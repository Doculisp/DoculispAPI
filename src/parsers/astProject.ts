import { IdentifierAst, CoreAst, IAstEmpty, RootAst } from "../types/types.ast";
import { IProjectDocument, IProjectDocuments, IProjectParser } from "../types/types.astProject";
import { IRegisterable } from "../types/types.containers";
import { IPath, PathConstructor } from "../types/types.filePath";
import { ILocation, IUtil, Result } from "../types/types.general";
import { IInternals, StepParseResult } from "../types/types.internal";
import { TextHelper } from "../types/types.textHelpers";
import { ITrimArray } from "../types/types.trimArray";
import { IVariableTable } from "../types/types.variableTable";

interface ISource {
    source: IPath,
    location: ILocation,
    type: 'i-source',
};

interface IOutput {
    output: IPath,
    location: ILocation
    type: 'i-output',
}

function buildAstProject(internals: IInternals, util: IUtil, trimArray: ITrimArray, pathConstructor: PathConstructor, textHelper: TextHelper): IProjectParser {
    function parse(tokenResults: Result<RootAst | IAstEmpty>, variableTable: IVariableTable): Result<IProjectDocuments> {
        if(!tokenResults.success) {
            return tokenResults;
        }

        if(tokenResults.value.type === 'ast-Empty') {
            const empty: IProjectDocuments = {
                type: 'project-documents',
                documents: [],
                location: util.location(tokenResults.value.location.documentPath, tokenResults.value.location.documentDepth, tokenResults.value.location.documentIndex, 0, 0),
                blockRange: {
                    start: util.location(tokenResults.value.location.documentPath, tokenResults.value.location.documentDepth, tokenResults.value.location.documentIndex, 0, 0),
                    end: util.location(tokenResults.value.location.documentPath, tokenResults.value.location.documentDepth, tokenResults.value.location.documentIndex, 0, 0)
                }
            };

            return util.ok(empty);
        }

       function parseDocuments(input: CoreAst[], current: ILocation): StepParseResult<CoreAst[], IProjectDocuments> {
            const ast = input[0] as CoreAst;

            if(ast.type !== 'ast-identifier' && ast.type !== 'ast-container') {
                return internals.noResultFound();
            }

            if(ast.value !== 'documents') {
                return internals.noResultFound();
            }

            if(ast.type === 'ast-identifier') {
                const empty: IProjectDocuments = {
                    type: 'project-documents',
                    documents: [],
                    location: ast.location,
                    blockRange: ast.blockRange,
                };

                return util.ok({
                    type: 'parse result',
                    location: ast.location,
                    subResult: empty,
                    rest: trimArray.trim(1, input),
                });
            }

            const parser = internals.createArrayParser(parseDocument);
            const maybe = parser.parse(ast.subStructure, (ast.subStructure[0] as IdentifierAst).location);

            if(!maybe.success) {
                return maybe;
            }

            const [result, remaining] = maybe.value;

            if(0 < remaining.remaining.length) {
                const bad = remaining.remaining[0] as CoreAst;
                return util.fail(`Parse Error: Documents block contains unknown identifier '${bad.value}' at '${current.documentPath.fullName}' (Line: ${bad.location.line}, Char: ${bad.location.char}).`, current.documentPath);
            }

            const documents: IProjectDocuments = {
                type: 'project-documents',
                documents: result,
                location: ast.location,
                blockRange: ast.blockRange,
            };

            return util.ok({
                type: 'parse result',
                location: current,
                subResult: documents,
                rest: trimArray.trim(1, input),
            });
        }

        function parseSource(input: CoreAst[], current: ILocation): StepParseResult<CoreAst[], ISource> {
            const ast = input[0] as IdentifierAst;

            if(ast.type !== 'ast-command') {
                return internals.noResultFound();
            }

            if(ast.value !== 'source') {
                return internals.noResultFound();
            }

            let source: ISource = {
                source: pathConstructor(ast.parameter.value),
                location: current,
                type: 'i-source'
            };

            return util.ok({
                type: 'parse result',
                location: current,
                subResult: source,
                rest: trimArray.trim(1, input),
            });
        }

        function parseOutput(input: CoreAst[], current: ILocation): StepParseResult<CoreAst[], IOutput> {
            const ast = input[0] as IdentifierAst;

            if(ast.type !== 'ast-command') {
                return internals.noResultFound();
            }

            if(ast.value !== 'output') {
                return internals.noResultFound();
            }

            const output: IOutput = {
                output: pathConstructor(ast.parameter.value),
                location: current,
                type: 'i-output'
            };

            return util.ok({
                type: 'parse result',
                location: current,
                subResult: output,
                rest: trimArray.trim(1, input),
            });
        }

        function parseDocumentByParts(originalLocation: ILocation, originalAst: CoreAst[] | false, id?: string | undefined): (input: CoreAst[], current: ILocation) => StepParseResult<CoreAst[], IProjectDocument> {
            return function(input: CoreAst[], current: ILocation): StepParseResult<CoreAst[], IProjectDocument> {
                const parser = internals.createArrayParser<CoreAst, IOutput | ISource>(parseSource, parseOutput);

                const maybe = parser.parse(input, current);

                if(!maybe.success) {
                    return maybe;
                }

                const [result, remaining] = maybe.value;

                if(result.length === 0) {
                    return internals.noResultFound();
                }

                if(0 < remaining.remaining.length) {
                    const first = remaining.remaining[0] as IdentifierAst;
                    return util.fail(`Parse Error: Unknown identifier '${first.value}' at '${current.documentPath.fullName}' (Line: ${first.location.line}, Char: ${first.location.char}).`, current.documentPath);
                }

                const sources = result.filter(r => r.type === 'i-source');
                const outputs = result.filter(r => r.type === 'i-output');

                if(0 === sources.length && 0 === outputs.length) {
                    return internals.noResultFound();
                }

                if(0 === sources.length) {
                    return util.fail(`Validation Error: Missing source block in document identifier at '${originalLocation.documentPath}' (Line: ${originalLocation.line}, Char: ${originalLocation.char}).`, originalLocation.documentPath)
                }

                if(0 === outputs.length) {
                    return util.fail(`Validation Error: Missing output block in document identifier at '${originalLocation.documentPath}' (Line: ${originalLocation.line}, Char: ${originalLocation.char}).`, originalLocation.documentPath)
                }

                if(1 < sources.length) {
                    const bad = sources[1] as ISource;
                    return util.fail(`Parse Error: Duplicate source block at '${current.documentPath}' (Line: ${bad.location.line}, Char: ${bad.location.char}).`, current.documentPath);
                }

                if(1 < outputs.length) {
                    const bad = outputs[1] as IOutput;
                    return util.fail(`Parse Error: Duplicate output block at '${current.documentPath}' (Line: ${bad.location.line}, Char: ${bad.location.char}).`, current.documentPath);
                }

                const source = sources[0] as ISource;
                const output = outputs[0] as IOutput;

                if(id){
                    variableTable.addGlobalValue(id, { type: 'variable-id', value: output.output, source: current, headerLinkText: false });
                }

                const found: IProjectDocument = {
                    type: 'project-document',
                    destinationPath: output.output,
                    sourcePath: source.source,
                    location: originalLocation,
                    id: id,
                };

                return util.ok({
                    type: 'parse result',
                    location: originalLocation,
                    subResult: found,
                    rest: trimArray.trim(2, originalAst ? originalAst : input),
                });
            }
        }

        function parseDocId(input: CoreAst[], current: ILocation): StepParseResult<CoreAst[], IProjectDocument> {
            const ast = input[0] as CoreAst;

            if(ast.type !== 'ast-container') {
                return internals.noResultFound();
            }

            const id = ast.value;

            const table = textHelper.symbolLocation(id)
            if(!!table) {
                let bads = Object.keys(table);
                let badMsg = bads.map(badS => `'${badS}' at ID character ${table[badS]}`).join('.\n  ') + '.';

                return util.fail(`Validation Error: Invalid characters in document ID '${id}' at '${current.documentPath.fullName}' (Line: ${current.line}, Char: ${current.char}).\n  ${badMsg}`);
            }

            if(!textHelper.isLowercase(id)) {
                return util.fail(`Validation Error: Document ID must be lowercase at '${current.documentPath.fullName}' (Line: ${current.line}, Char: ${current.char}). Did you mean '${id.toLocaleLowerCase()}'?`)
            }

            if(variableTable.hasKey(id)) {
                let orig = variableTable.getValue(id);
                let msg = '';

                if(orig && orig.type === 'variable-id') {
                    msg = `\n  Original use of ID was at '${orig.source.documentPath}' (Line: ${orig.source.line}, Char: ${orig.source.char}).`;
                }

                return util.fail(`Validation Error: Duplicate document ID '${id}' at '${current.documentPath.fullName}' (Line: ${current.line}, Char: ${current.char}).${msg}`, current.documentPath);
            }
            return parseDocumentByParts(current, input, id)(ast.subStructure, (ast.subStructure[0] as IdentifierAst).location);
        }

        function parseDocument(input: CoreAst[], current: ILocation): StepParseResult<CoreAst[], IProjectDocument> {
            const ast = input[0] as CoreAst;

            if(ast.type !== 'ast-container') {
                return internals.noResultFound();
            }

            if(ast.value !== 'document') {
                return internals.noResultFound();
            }

            const parseByParts = parseDocumentByParts(current, false)
            const parser = internals.createArrayParser(parseByParts, parseDocId);

            const maybe = parser.parse(ast.subStructure, (ast.subStructure[0] as IdentifierAst).location);

            if(!maybe.success) {
                return maybe;
            }

            const [result, remaining] = maybe.value;

            if(0 < remaining.remaining.length) {
                const bad = remaining.remaining[0] as CoreAst;
                return util.fail(`Parse Error: Unknown identifier '${bad.value}' at '${current.documentPath}' (Line: ${bad.location.line}, Char: ${bad.location.char}).`, current.documentPath);
            }

            if(result.length === 0) {
                return util.fail(`Parse Error: Document block does not contain source or output at '${current.documentPath}' (Line: ${current.line}, Char: ${current.char}).`, current.documentPath);
            }

            if(1 < result.length) {
                const bad = result[0] as IProjectDocument;
                return util.fail(`Parse Error: Duplicate source block at '${current.documentPath.fullName}' (Line: ${bad.location.line}, Char: ${bad.location.char}).`, current.documentPath);
            }

            const doc = result[0] as IProjectDocument;

            return util.ok({
                type: 'parse result',
                location: current,
                subResult: doc,
                rest: trimArray.trim(1, input)
            });
        }

        const parser = internals.createArrayParser(parseDocuments);
        const maybe = parser.parse(tokenResults.value.ast, util.location(tokenResults.value.location.documentPath, tokenResults.value.location.documentDepth, tokenResults.value.location.documentIndex, 1, 1));

        if(!maybe.success) {
            return maybe;
        }

        const [result, remaining] = maybe.value;

        if(0 < remaining.remaining.length) {
            const bad = remaining.remaining[0] as CoreAst;
            return util.fail(`Parse Error: Unknown identifier '${bad.value}' at '${bad.location.documentPath.fullName}' (Line: ${bad.location.line}, Char: ${bad.location.char}).`, bad.location.documentPath);
        }

        if(0 === result.length) {
            const empty: IProjectDocuments = {
                type: 'project-documents',
                documents: [],
                location: util.location(tokenResults.value.location.documentPath, tokenResults.value.location.documentDepth, tokenResults.value.location.documentIndex, 0, 0),
                blockRange: {
                    start: util.location(tokenResults.value.location.documentPath, tokenResults.value.location.documentDepth, tokenResults.value.location.documentIndex, 0, 0),
                    end: util.location(tokenResults.value.location.documentPath, tokenResults.value.location.documentDepth, tokenResults.value.location.documentIndex, 0, 0)
                }
            };

            return util.ok(empty);
        }

        if(1 < result.length) {
            const bad = result[1] as IProjectDocuments;
            return util.fail(`Parse Error: Duplicate documents block detected at '${bad.location.documentPath.fullName}' (Line: ${bad.location.line}, Char: ${bad.location.char}). Project file may only contain a single documents block.`, bad.location.documentPath);
        }

        return util.ok(result[0] as IProjectDocuments);
    }

    return {
        parse,
    };
}

const doculispParser: IRegisterable = {
    builder: (internals: IInternals, util: IUtil, trimArray: ITrimArray, pathConstructor: PathConstructor, textHelper: TextHelper) => buildAstProject(internals, util, trimArray, pathConstructor, textHelper),
    name: 'astProjectParse',
    singleton: false,
    dependencies: ['internals', 'util', 'trimArray', 'pathConstructor', 'textHelpers']
};

export {
    doculispParser,
};
