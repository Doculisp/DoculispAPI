import { IdentifierAst, CoreAst, IAstEmpty, RootAst } from "../types/types.ast";
import { IProjectDocument, IProjectDocuments, IProjectParser } from "../types/types.astProject";
import { IRegisterable } from "../types/types.containers";
import { IPath, PathConstructor } from "../types/types.filePath";
import { ILocation, IRange, IUtil, Result } from "../types/types.general";
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
        const parseFailure = util.fail('Project AST Parsing')('Parse Error');
        const validationFailure = util.fail('Project AST Parsing')('Validation Error');
        
        if (!tokenResults.success) {
            return tokenResults;
        }

        if (tokenResults.value.type === 'ast-Empty') {
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

            if (ast.type !== 'ast-identifier' && ast.type !== 'ast-container') {
                return internals.noResultFound();
            }

            if (ast.value !== 'documents') {
                return internals.noResultFound();
            }

            if (ast.type === 'ast-identifier') {
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

            if (!maybe.success) {
                return maybe;
            }

            const [result, remaining] = maybe.value;

            if (0 < remaining.remaining.length) {
                const bad = remaining.remaining[0] as CoreAst;
                const range: IRange = {
                    start: bad.location,
                    end: {
                        line: bad.location.line,
                        char: bad.location.char + bad.value.length,
                        documentPath: bad.location.documentPath,
                        documentDepth: bad.location.documentDepth,
                        documentIndex: bad.location.documentIndex
                    }
                };
                return parseFailure(`Documents block contains unknown identifier '${bad.value}' at '${current.documentPath.fullName}'.`, range, current.documentPath);
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

            if (ast.type !== 'ast-command') {
                return internals.noResultFound();
            }

            if (ast.value !== 'source') {
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

            if (ast.type !== 'ast-command') {
                return internals.noResultFound();
            }

            if (ast.value !== 'output') {
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

        function parseDocumentByParts(originalLocation: ILocation, originalAst: CoreAst[] | false, blockRange: IRange, id?: string | undefined): (input: CoreAst[], current: ILocation) => StepParseResult<CoreAst[], IProjectDocument> {
            return function (input: CoreAst[], current: ILocation): StepParseResult<CoreAst[], IProjectDocument> {
                const parser = internals.createArrayParser<CoreAst, IOutput | ISource>(parseSource, parseOutput);

                const maybe = parser.parse(input, current);

                if (!maybe.success) {
                    return maybe;
                }

                const [result, remaining] = maybe.value;

                if (result.length === 0) {
                    return internals.noResultFound();
                }

                if (0 < remaining.remaining.length) {
                    const first = remaining.remaining[0] as IdentifierAst;
                    const range: IRange = {
                        start: first.location,
                        end: {
                            line: first.location.line,
                            char: first.location.char + first.value.length,
                            documentPath: first.location.documentPath,
                            documentDepth: first.location.documentDepth,
                            documentIndex: first.location.documentIndex
                        }
                    };
                    return parseFailure(`Unknown identifier '${first.value}' at '${current.documentPath.fullName}'.`, range, current.documentPath);
                }

                const sources = result.filter(r => r.type === 'i-source');
                const outputs = result.filter(r => r.type === 'i-output');

                if (0 === sources.length && 0 === outputs.length) {
                    return internals.noResultFound();
                }

                if (0 === sources.length) {
                    const range: IRange = {
                        start: originalLocation,
                        end: {
                            line: originalLocation.line,
                            char: originalLocation.char + 1,
                            documentPath: originalLocation.documentPath,
                            documentDepth: originalLocation.documentDepth,
                            documentIndex: originalLocation.documentIndex
                        }
                    };
                    return validationFailure(`Missing source block in document identifier at '${originalLocation.documentPath}'.`, range, originalLocation.documentPath)
                }

                if (0 === outputs.length) {
                    const range: IRange = {
                        start: originalLocation,
                        end: {
                            line: originalLocation.line,
                            char: originalLocation.char + 1,
                            documentPath: originalLocation.documentPath,
                            documentDepth: originalLocation.documentDepth,
                            documentIndex: originalLocation.documentIndex
                        }
                    };
                    return validationFailure(`Missing output block in document identifier at '${originalLocation.documentPath}'.`, range, originalLocation.documentPath)
                }

                if (1 < sources.length) {
                    const bad = sources[1] as ISource;
                    const range: IRange = {
                        start: bad.location,
                        end: {
                            line: bad.location.line,
                            char: bad.location.char + 1,
                            documentPath: bad.location.documentPath,
                            documentDepth: bad.location.documentDepth,
                            documentIndex: bad.location.documentIndex
                        }
                    };
                    return parseFailure(`Duplicate source block at '${current.documentPath}'.`, range, current.documentPath);
                }

                if (1 < outputs.length) {
                    const bad = outputs[1] as IOutput;
                    const range: IRange = {
                        start: bad.location,
                        end: {
                            line: bad.location.line,
                            char: bad.location.char + 1,
                            documentPath: bad.location.documentPath,
                            documentDepth: bad.location.documentDepth,
                            documentIndex: bad.location.documentIndex
                        }
                    };
                    return parseFailure(`Duplicate output block at '${current.documentPath}'.`, range, current.documentPath);
                }

                const source = sources[0] as ISource;
                const output = outputs[0] as IOutput;

                if (id) {
                    variableTable.addGlobalValue(id, { type: 'variable-id', value: output.output, source: current, headerLinkText: false });
                }

                const found: IProjectDocument = {
                    type: 'project-document',
                    destinationPath: output.output,
                    sourcePath: source.source,
                    location: originalLocation,
                    id: id,
                    blockRange
                };

                return util.ok({
                    type: 'parse result',
                    location: originalLocation,
                    subResult: found,
                    rest: trimArray.trim(2, originalAst ? originalAst : input),
                });
            }
        }

        function parseDocId(blockRange: IRange): (input: CoreAst[], current: ILocation) => StepParseResult<CoreAst[], IProjectDocument> {
            return function (input: CoreAst[], current: ILocation): StepParseResult<CoreAst[], IProjectDocument> {
                const ast = input[0] as CoreAst;

                if (ast.type !== 'ast-container') {
                    return internals.noResultFound();
                }

                const id = ast.value;

                const table = textHelper.symbolLocation(id)
                if (!!table) {
                    let bads = Object.keys(table);
                    let badMsg = bads.map(badS => `'${badS}' at ID character ${table[badS]}`).join('.\n  ') + '.';
                    const range: IRange = {
                        start: ast.location,
                        end: {
                            line: ast.location.line,
                            char: ast.location.char + id.length,
                            documentPath: ast.location.documentPath,
                            documentDepth: ast.location.documentDepth,
                            documentIndex: ast.location.documentIndex
                        }
                    };
                    return validationFailure(`Invalid characters in document ID '${id}' at '${current.documentPath.fullName}'.\n  ${badMsg}`, range);
                }

                if (!textHelper.isLowercase(id)) {
                    const range: IRange = {
                        start: ast.location,
                        end: {
                            line: ast.location.line,
                            char: ast.location.char + id.length,
                            documentPath: ast.location.documentPath,
                            documentDepth: ast.location.documentDepth,
                            documentIndex: ast.location.documentIndex
                        }
                    };
                    return validationFailure(`Document ID must be lowercase at '${current.documentPath.fullName}'. Did you mean '${id.toLocaleLowerCase()}'?`, range)
                }

                if (variableTable.hasKey(id)) {
                    let orig = variableTable.getValue(id);
                    let msg = '';

                    if (orig && orig.type === 'variable-id') {
                        msg = `\n  Original use of ID was at '${orig.source.documentPath}' (Line: ${orig.source.line}, Char: ${orig.source.char}).`;
                    }
                    const range: IRange = {
                        start: ast.location,
                        end: {
                            line: ast.location.line,
                            char: ast.location.char + id.length,
                            documentPath: ast.location.documentPath,
                            documentDepth: ast.location.documentDepth,
                            documentIndex: ast.location.documentIndex
                        }
                    };
                    return validationFailure(`Duplicate document ID '${id}' at '${current.documentPath.fullName}'.${msg}`, range, current.documentPath);
                }
                return parseDocumentByParts(current, input, blockRange, id)(ast.subStructure, (ast.subStructure[0] as IdentifierAst).location);
            }
        }

        function parseDocument(input: CoreAst[], current: ILocation): StepParseResult<CoreAst[], IProjectDocument> {
            const ast = input[0] as CoreAst;

            if (ast.type !== 'ast-container') {
                return internals.noResultFound();
            }

            if (ast.value !== 'document') {
                return internals.noResultFound();
            }

            const parseByParts = parseDocumentByParts(current, false, ast.blockRange)
            const parser = internals.createArrayParser(parseByParts, parseDocId(ast.blockRange));

            const maybe = parser.parse(ast.subStructure, (ast.subStructure[0] as IdentifierAst).location);

            if (!maybe.success) {
                return maybe;
            }

            const [result, remaining] = maybe.value;

            if (0 < remaining.remaining.length) {
                const bad = remaining.remaining[0] as CoreAst;
                const range: IRange = {
                    start: bad.location,
                    end: {
                        line: bad.location.line,
                        char: bad.location.char + bad.value.length,
                        documentPath: bad.location.documentPath,
                        documentDepth: bad.location.documentDepth,
                        documentIndex: bad.location.documentIndex
                    }
                };
                return parseFailure(`Unknown identifier '${bad.value}' at '${current.documentPath}'.`, range, current.documentPath);
            }

            if (result.length === 0) {
                const range: IRange = {
                    start: current,
                    end: {
                        line: current.line,
                        char: current.char + 1,
                        documentPath: current.documentPath,
                        documentDepth: current.documentDepth,
                        documentIndex: current.documentIndex
                    }
                };
                return parseFailure(`Document block does not contain source or output at '${current.documentPath}'.`, range, current.documentPath);
            }

            if (1 < result.length) {
                const bad = result[0] as IProjectDocument;
                return parseFailure(`Duplicate source block at '${current.documentPath.fullName}'.`, bad.blockRange, current.documentPath);
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

        if (!maybe.success) {
            return maybe;
        }

        const [result, remaining] = maybe.value;

        if (0 < remaining.remaining.length) {
            const bad = remaining.remaining[0] as CoreAst;
            const range: IRange = {
                start: bad.location,
                end: {
                    line: bad.location.line,
                    char: bad.location.char + bad.value.length,
                    documentPath: bad.location.documentPath,
                    documentDepth: bad.location.documentDepth,
                    documentIndex: bad.location.documentIndex
                }
            };
            return parseFailure(`Unknown identifier '${bad.value}' at '${bad.location.documentPath.fullName}'.`, range, bad.location.documentPath);
        }

        if (0 === result.length) {
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

        if (1 < result.length) {
            const bad = result[1] as IProjectDocuments;
            return parseFailure(`Duplicate documents block detected at '${bad.location.documentPath.fullName}'. Project file may only contain a single documents block.`, bad.blockRange, bad.location.documentPath);
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
