import { Ast, IdentifierAst, CoreAst, IAstCommand, IAstEmpty, RootAst } from "../types/types.ast";
import { DoculispBulletStyle, DoculispPart, IContentLocation, IDoculisp, IDoculispParser, IEmptyDoculisp, IHeader, ILoad, IPathId, ITableOfContents, ITitle, IWrite } from "../types/types.astDoculisp";
import { IDictionary, IRegisterable } from "../types/types.containers";
import { ILocation, IRange, IUtil, Result } from "../types/types.general";
import { IInternals, IKeeper, StepParseResult } from "../types/types.internal";
import { ITrimArray } from "../types/types.trimArray";
import { destKey, IVariablePath, IVariableTable } from "../types/types.variableTable";
import { IPath, PathConstructor } from "../types/types.filePath";
import { TextHelper } from "../types/types.textHelpers";

function headerize(depth: number, value: string): string {
    const id = ''.padStart(depth, '#');
    return `${id} ${value} ${id}`;
}

function getSymbolErrorMessage<T extends Ast>(typeId: string, word: string, current: ILocation, ast: T, textHelper: TextHelper): string | false {
    let symbols = textHelper.symbolLocation(word);

    if(symbols) {
        let symbolKeys = Object.keys(symbols);
        let badMsg = symbolKeys.map(badS => `'${badS}' @ id char ${(symbols as IDictionary<number>)[badS]}`).join('\n\t');

        return `Symbol(s) in ${typeId} id '${word}' at '${current.documentPath.fullName}'.\n${badMsg}`;
    }

    return false;
}

function buildAstParser(internals: IInternals, util: IUtil, trimArray: ITrimArray, pathConstructor: PathConstructor, textHelper: TextHelper): IDoculispParser {
    const parseFailure = util.fail('Doculisp AST Parsing')('Parse Error');
    const validationFailure = util.fail('Doculisp AST Parsing')('Validation Error');
    
    function parse(astResult: Result<RootAst | IAstEmpty>, variableTable: IVariableTable): Result<IDoculisp | IEmptyDoculisp> {
        if(!astResult.success) {
            return astResult;
        }

        let hasSectionMeta = false;
        let hasInclude = false;
        let sectionLinkText: string | false = false;

        function parseValue(input: CoreAst[], current: ILocation): StepParseResult<CoreAst[], IWrite> {
            const ast = input[0] as CoreAst;
    
            if(ast.type !== 'ast-value') {
                return internals.noResultFound();
            }

            const lines = ast.value.split('\n');
            const end = 1 < lines.length
                ? ast.location.increaseLine(lines.length - 1).increaseChar((lines[lines.length - 1] as string).length)
                : ast.location.increaseChar(ast.value.length);
    
            return util.ok({
                type: 'parse result',
                subResult: {
                    type: 'doculisp-write',
                    start: ast.location,
                    end,
                    value: ast.value,
                },
                rest: trimArray.trim(1, input),
                location: current
            });
        }
    
        function parseHeader(input: CoreAst[], current: ILocation): StepParseResult<CoreAst[], IHeader> {
            const ast = input[0] as CoreAst;
    
            if(ast.value.charAt(0) !== '#') {
                return internals.noResultFound();
            }
    
            if(ast.type !== 'ast-command') {
                const range: IRange = {
                    start: {
                        documentPath: ast.location.documentPath,
                        line: ast.location.line,
                        char: ast.location.char,
                        documentDepth: ast.location.documentDepth,
                        documentIndex: ast.location.documentIndex,
                    },
                    end: {
                        documentPath: ast.location.documentPath,
                        line: ast.location.line,
                        char: ast.location.char + ast.value.length,
                        documentDepth: ast.location.documentDepth,
                        documentIndex: ast.location.documentIndex,
                    }
                };
                return validationFailure(`Dynamic header at '${ast.location.documentPath.fullName}' must have a text parameter.`, range, current.documentPath);
            }

            const id = ast.value.replace(/^#+/, '');

            if(0 < id.length) {
                let errorMsg = getSymbolErrorMessage('heading', id, current, ast, textHelper);
                if(errorMsg) {
                    const range: IRange = {
                        start: {
                            documentPath: ast.location.documentPath,
                            line: ast.location.line,
                            char: ast.location.char,
                            documentDepth: ast.location.documentDepth,
                            documentIndex: ast.location.documentIndex,
                        },
                        end: {
                            documentPath: ast.location.documentPath,
                            line: ast.location.line,
                            char: ast.location.char + ast.value.length,
                            documentDepth: ast.location.documentDepth,
                            documentIndex: ast.location.documentIndex,
                        }
                    };
                    return validationFailure(errorMsg, range, current.documentPath);
                }

                if(!textHelper.isLowercase(id)) {
                    const range: IRange = {
                        start: ast.location,
                        end: {
                            line: ast.location.line,
                            char: ast.location.char + ast.value.length,
                            documentPath: ast.location.documentPath,
                            documentDepth: ast.location.documentDepth,
                            documentIndex: ast.location.documentIndex,
                        }
                    };
                    return validationFailure(`Heading ID must be lowercase at '${current.documentPath.fullName}'. Did you mean '${id.toLocaleLowerCase()}'?`, range, current.documentPath);
                }

                if(variableTable.hasKey(id)) {
                    let orig = variableTable.getValue(id);
                    let msg = '';
    
                    if(orig && orig.type === 'variable-id') {
                        msg = `\n  Original use of ID was at '${orig.source.documentPath}'.`;
                    }
                    const range: IRange = {
                        start: {
                            documentPath: ast.location.documentPath,
                            line: ast.location.line,
                            char: ast.location.char,
                            documentDepth: ast.location.documentDepth,
                            documentIndex: ast.location.documentIndex,
                        },
                        end: {
                            documentPath: ast.location.documentPath,
                            line: ast.location.line,
                            char: ast.location.char + ast.value.length,
                            documentDepth: ast.location.documentDepth,
                            documentIndex: ast.location.documentIndex,
                        }
                    };
                    return validationFailure(`Duplicate heading ID '${id}' at '${current.documentPath.fullName}'.${msg}`, range, current.documentPath);
                }

                const destinationPath = (
                    variableTable.hasKey(destKey) ?
                    (variableTable.getValue(destKey) as IVariablePath).value :
                    false
                );

                if(!destinationPath) {
                    variableTable.addGlobalValue(id, { value: '', type: 'variable-empty-id' });
                } else {
                    variableTable.addGlobalValue(id, { type: 'variable-id', value: destinationPath, source: current, headerLinkText: textHelper.toLinkText(ast.parameter.value) })
                }
            }

            return util.ok({
                type: 'parse result',
                subResult: {
                    type: 'doculisp-header',
                    depthCount: current.documentDepth + ast.value.length - id.length,
                    documentOrder: ast.location,
                    text: ast.parameter.value,
                    id: 0 < id.length ? id : undefined,
                },
                location: current,
                rest: trimArray.trim(1, input),
            });
        }
    
        function parseSectionMeta(input: CoreAst[], current: ILocation): StepParseResult<CoreAst[], ITitle | ILoad> {
            function getLinkText(title: IAstCommand, refLink: string | boolean) {
                let linkText = textHelper.toLinkText(title.parameter.value);

                sectionLinkText = linkText;
                return linkText;
            }

            function parseTitle(ast: IdentifierAst[], location: ILocation, refLink: string | false, subtitle: string | false): Result<ITitle> {
                const titles = ast.filter(s => s.value === 'title');
                const range: IRange = {
                    start: {
                        documentPath: location.documentPath,
                        line: location.line,
                        char: location.char,
                        documentDepth: location.documentDepth,
                        documentIndex: location.documentIndex,
                    },
                    end: {
                        documentPath: location.documentPath,
                        line: location.line,
                        char: location.char + 1,
                        documentDepth: location.documentDepth,
                        documentIndex: location.documentIndex,
                    }
                };
        
                if(1 < titles.length) {
                    return validationFailure(`Multiple title blocks found in section-meta at '${location.documentPath.fullName}'. Only one title block allowed per section-meta.`, range, current.documentPath);
                }
    
                if(titles.length === 0) {
                    if(!hasSectionMeta) {
                        return parseFailure(`Section-meta missing title block at '${location.documentPath.fullName}'.`, range, current.documentPath);
                    }
                }

                const title = titles[0] as IdentifierAst;

                if(title.type === 'ast-identifier') {
                    return validationFailure(`Missing title text in title block at '${title.location.documentPath.fullName}'`, range, current.documentPath);
                }
        
                if(title.type === 'ast-container') {
                    const next = title.subStructure[0] as IdentifierAst;
                    const range: IRange = {
                        start: {
                            documentPath: next.location.documentPath,
                            line: next.location.line,
                            char: next.location.char,
                            documentDepth: next.location.documentDepth,
                            documentIndex: next.location.documentIndex,
                        },
                        end: {
                            documentPath: next.location.documentPath,
                            line: next.location.line,
                            char: next.location.char + next.value.length,
                            documentDepth: next.location.documentDepth,
                            documentIndex: next.location.documentIndex,
                        }
                    };
                    return validationFailure(`Unknown block '${next.value}' in title block at '${title.location.documentPath.fullName}'.`, range, current.documentPath);
                }
    
                let linkText = getLinkText(title, refLink);

                const idResult = parseId(ast, current);
                if(!idResult.success) {
                    return idResult;
                }

                const id = idResult.value;
    
                return util.ok({
                    type: 'doculisp-title',
                    title: title.parameter.value,
                    documentOrder: title.location,
                    label: headerize(title.location.documentDepth, title.parameter.value),
                    ref_link: '#' + (refLink ? refLink : linkText),
                    subtitle: subtitle ? subtitle : undefined,
                    id: id ? id : undefined,
                });
            }

            function parseSubtitle(ast: IdentifierAst[], location: ILocation, depth: number): Result<string | false> {
                const subtitles = ast.filter(a => a.value === 'subtitle');
    
                if(subtitles.length === 0) {
                    return util.ok(false);
                }
    
                if(1 < subtitles.length) {
                    const range: IRange = {
                        start: {
                            line: location.line,
                            char: location.char,
                            documentPath: location.documentPath,
                            documentDepth: location.documentDepth,
                            documentIndex: location.documentIndex,
                        },
                        end: {
                            line: location.line,
                            char: location.char + 1,
                            documentPath: location.documentPath,
                            documentDepth: location.documentDepth,
                            documentIndex: location.documentIndex,
                        }
                    };
                    return validationFailure(`Multiple subtitle blocks found in section-meta at '${location.documentPath.fullName}'. Only one subtitle block allowed per section-meta.`, range, current.documentPath);
                }
    
                const subtitle = subtitles[0] as IdentifierAst;
    
                if(subtitle.type === 'ast-identifier') {
                    const range: IRange = {
                        start: {
                            documentPath: subtitle.location.documentPath,
                            line: subtitle.location.line,
                            char: subtitle.location.char,
                            documentDepth: subtitle.location.documentDepth,
                            documentIndex: subtitle.location.documentIndex,
                        },
                        end: {
                            documentPath: subtitle.location.documentPath,
                            line: subtitle.location.line,
                            char: subtitle.location.char + subtitle.value.length,
                            documentDepth: subtitle.location.documentDepth,
                            documentIndex: subtitle.location.documentIndex,
                        }
                    };
                    return validationFailure(`Missing subtitle text in subtitle block at '${subtitle.location.documentPath.fullName}'.`, range, current.documentPath);
                }
    
                if(subtitle.type === 'ast-container') {
                    const next = subtitle.subStructure[0] as IdentifierAst;
                    const range: IRange = {
                        start: {
                            documentPath: next.location.documentPath,
                            line: next.location.line,
                            char: next.location.char,
                            documentDepth: next.location.documentDepth,
                            documentIndex: next.location.documentIndex,
                        },
                        end: {
                            documentPath: next.location.documentPath,
                            line: next.location.line,
                            char: next.location.char + next.value.length,
                            documentDepth: next.location.documentDepth,
                            documentIndex: next.location.documentIndex,
                        }
                    };
                    return validationFailure(`Unknown block '${next.value}' in subtitle block at '${subtitle.location.documentPath.fullName}'.`, range, current.documentPath);
                }
    
                return util.ok(headerize(depth, subtitle.parameter.value));
            }

            function parseRefLink(ast: IdentifierAst[], location: ILocation): Result<string | false> {
                const refLinks = ast.filter(a => a.value === 'ref-link');
    
                if(refLinks.length === 0) {
                    return util.ok(false);
                }
    
                if(1 < refLinks.length) {
                    const range: IRange = {
                        start: {
                            line: location.line,
                            char: location.char,
                            documentPath: location.documentPath,
                            documentDepth: location.documentDepth,
                            documentIndex: location.documentIndex,
                        },
                        end: {
                            line: location.line,
                            char: location.char + 1,
                            documentPath: location.documentPath,
                            documentDepth: location.documentDepth,
                            documentIndex: location.documentIndex,
                        }
                    };
                    return validationFailure(`Multiple ref-link blocks found in section-meta at '${location.documentPath.fullName}'. Only one ref-link block allowed per section-meta.`, range, current.documentPath);
                }
    
                const refLink = refLinks[0] as IdentifierAst;
    
                if(refLink.type === 'ast-identifier') {
                    const range: IRange = {
                        start: {
                            documentPath: refLink.location.documentPath,
                            line: refLink.location.line,
                            char: refLink.location.char,
                            documentDepth: refLink.location.documentDepth,
                            documentIndex: refLink.location.documentIndex,
                        },
                        end: {
                            documentPath: refLink.location.documentPath,
                            line: refLink.location.line,
                            char: refLink.location.char + refLink.value.length,
                            documentDepth: refLink.location.documentDepth,
                            documentIndex: refLink.location.documentIndex,
                        }
                    };
                    return validationFailure(`Missing ref-link text in ref-link block at '${refLink.location.documentPath.fullName}'.`, range, current.documentPath);
                }
    
                if(refLink.type === 'ast-container') {
                    const next = refLink.subStructure[0] as IdentifierAst;
                    const range: IRange = {
                        start: {
                            documentPath: next.location.documentPath,
                            line: next.location.line,
                            char: next.location.char,
                            documentDepth: next.location.documentDepth,
                            documentIndex: next.location.documentIndex,
                        },
                        end: {
                            documentPath: next.location.documentPath,
                            line: next.location.line,
                            char: next.location.char + next.value.length,
                            documentDepth: next.location.documentDepth,
                            documentIndex: next.location.documentIndex,
                        }
                    };
                    return validationFailure(`The ref-link block at '${refLink.location.documentPath.fullName}' contains unknown block '${next.value}'.`, range, current.documentPath);
                }
    
                return util.ok(refLink.parameter.value);
            }

            function parseInclude(ast: IdentifierAst[], location: ILocation): Result<ILoad[] | false> {
                function parseSections(ast: IdentifierAst[]): Result<ILoad[]> {
                    const bad = ast.filter(a => a.type !== 'ast-command');
    
                    if(0 < bad.length) {
                        const next = bad[0] as IdentifierAst;
                        const range: IRange = {
                            start: {
                                documentPath: next.location.documentPath,
                                line: next.location.line,
                                char: next.location.char,
                                documentDepth: next.location.documentDepth,
                                documentIndex: next.location.documentIndex,
                            },
                            end: {
                                documentPath: next.location.documentPath,
                                line: next.location.line,
                                char: next.location.char + next.value.length,
                                documentDepth: next.location.documentDepth,
                                documentIndex: next.location.documentIndex,
                            }
                        };
                        return parseFailure(`Include contains unknown command '${next.value}' at '${next.location.documentPath.fullName}'.`, range, location.documentPath);
                    }
    
                    const commands = ast as IAstCommand[];
    
                    const loaders = commands.map((rawLoad): ILoad => {
                        return {
                            type: 'doculisp-load',
                            document: false,
                            documentOrder: rawLoad.location,
                            path: pathConstructor(rawLoad.parameter.value),
                            sectionLabel: rawLoad.value.replaceAll('-', ' '),
                            blockRange: rawLoad.blockRange,
                        }
                    });

                    hasInclude = hasInclude || 0 < loaders.length;
    
                    return util.ok(loaders);
                }

                const includes = ast.filter(a => a.value === 'include');
    
                if(includes.length === 0) {
                    return util.ok(false);
                }
    
                if(1 < includes.length) {
                    const range: IRange = {
                        start: {
                            line: location.line,
                            char: location.char,
                            documentPath: location.documentPath,
                            documentDepth: location.documentDepth,
                            documentIndex: location.documentIndex,
                        },
                        end: {
                            line: location.line,
                            char: location.char + 1,
                            documentPath: location.documentPath,
                            documentDepth: location.documentDepth,
                            documentIndex: location.documentIndex,
                        }
                    };
                    return validationFailure(`The section-meta block at '${location.documentPath.fullName}' has more than one include.`, range, current.documentPath);
                }
                
                const include = includes[0] as IdentifierAst;
    
                if(include.type === 'ast-identifier') {
                    return util.ok(false);
                }
    
                if(include.type === 'ast-command') {
                    const range: IRange = {
                        start: {
                            documentPath: include.location.documentPath,
                            line: include.location.line,
                            char: include.location.char,
                            documentDepth: include.location.documentDepth,
                            documentIndex: include.location.documentIndex,
                        },
                        end: {
                            documentPath: include.location.documentPath,
                            line: include.location.line,
                            char: include.location.char + include.value.length,
                            documentDepth: include.location.documentDepth,
                            documentIndex: include.location.documentIndex,
                        }
                    };

                    return validationFailure(`The include block at '${include.location.documentPath.fullName}' has unknown parameter '${include.parameter.value}'.`, range, location.documentPath);
                }
    
                return parseSections(include.subStructure);
            }

            function parseAuthor(ast: IdentifierAst[], location: ILocation): Result<false> {
                const authors = ast.filter(a => a.value === 'author');

                for (let index = 0; index < authors.length; index++) {
                    const author = authors[index] as IdentifierAst;
                    if(author.type === 'ast-identifier') {
                        const range: IRange = {
                            start: author.location,
                            end: {
                                line: author.location.line,
                                char: author.location.char + author.value.length,
                                documentPath: author.location.documentPath,
                                documentDepth: author.location.documentDepth,
                                documentIndex: author.location.documentIndex,
                            }
                        };
                        return validationFailure(`Author block at '${author.location.documentPath.fullName}' does not contain the author's name.`, range, location.documentPath);
                    }

                    if(author.type === 'ast-container') {
                        const child = author.subStructure[0] as IdentifierAst;
                        const range: IRange = {
                            start: child.location,
                            end: {
                                line: child.location.line,
                                char: child.location.char + child.value.length,
                                documentPath: child.location.documentPath,
                                documentDepth: child.location.documentDepth,
                                documentIndex: child.location.documentIndex,
                            }
                        };
                        return validationFailure(`Author block at '${author.location.documentPath.fullName}' contains unknown child block '${child.value}'.`, range, location.documentPath);
                    }

                    variableTable.addValueToStringList('author', { value: author.parameter.value, type: 'variable-string' });
                }

                return util.ok(false);
            }

            function parseId(ast: IdentifierAst[], location: ILocation): Result<string | false> {
                const ids = ast.filter(a => a.value === 'id');

                if(ids.length === 0) {
                    return util.ok(false);
                }
                
                if(1 < ids.length) {
                    const range: IRange = {
                        start: location,
                        end: {
                            line: location.line,
                            char: location.char + 'section-meta'.length,
                            documentPath: location.documentPath,
                            documentDepth: location.documentDepth,
                            documentIndex: location.documentIndex,
                        }
                    };
                    return validationFailure(`The section-meta block at '${location.documentPath.fullName}' has more than one id.`, range, current.documentPath);
                }

                const idIdentifier = ids[0] as IdentifierAst;

                if(idIdentifier.type === 'ast-container') {
                    const range: IRange = {
                        start: idIdentifier.location,
                        end: {
                            line: idIdentifier.location.line,
                            char: idIdentifier.location.char + idIdentifier.value.length,
                            documentPath: idIdentifier.location.documentPath,
                            documentDepth: idIdentifier.location.documentDepth,
                            documentIndex: idIdentifier.location.documentIndex,
                        }
                    };
                    return validationFailure(`The section id block at '${idIdentifier.location.documentPath.fullName}' contains sub blocks.`, range, current.documentPath);
                }

                if(idIdentifier.type === 'ast-identifier') {
                    const range: IRange = {
                        start: idIdentifier.location,
                        end: {
                            line: idIdentifier.location.line,
                            char: idIdentifier.location.char + idIdentifier.value.length,
                            documentPath: idIdentifier.location.documentPath,
                            documentDepth: idIdentifier.location.documentDepth,
                            documentIndex: idIdentifier.location.documentIndex,
                        }
                    };
                    return validationFailure(`The section id block at '${idIdentifier.location.documentPath.fullName}' is missing identifier text parameter.`, range, current.documentPath);
                }

                const id = idIdentifier.parameter.value;

                const errorMsg = getSymbolErrorMessage('section', id, current, idIdentifier, textHelper);
                if(errorMsg) {
                    const range: IRange = {
                        start: idIdentifier.location,
                        end: {
                            line: idIdentifier.location.line,
                            char: idIdentifier.location.char + idIdentifier.value.length,
                            documentPath: idIdentifier.location.documentPath,
                            documentDepth: idIdentifier.location.documentDepth,
                            documentIndex: idIdentifier.location.documentIndex,
                        }
                    };
                    return validationFailure(errorMsg, range, current.documentPath);
                }

                if(!textHelper.isLowercase(id)) {
                    const range: IRange = {
                        start: idIdentifier.location,
                        end: {
                            line: idIdentifier.location.line,
                            char: idIdentifier.location.char + idIdentifier.value.length,
                            documentPath: idIdentifier.location.documentPath,
                            documentDepth: idIdentifier.location.documentDepth,
                            documentIndex: idIdentifier.location.documentIndex,
                        }
                    };
                    return validationFailure(`Section id '${id}' at '${current.documentPath.fullName}' must be lowercase. Did you mean '${id.toLocaleLowerCase()}'?`, range, current.documentPath);
                }

                if(variableTable.hasKey(id)) {
                    let orig = variableTable.getValue(id);
                    let msg = '';
    
                    if(orig && orig.type === 'variable-id') {
                        msg = `\n\tOriginal us of Id was in '${orig.source.documentPath}' Line: ${orig.source.line}, Char: ${orig.source.char}.`;
                    }
                    const range: IRange = {
                        start: idIdentifier.location,
                        end: {
                            line: idIdentifier.location.line,
                            char: idIdentifier.location.char + idIdentifier.value.length,
                            documentPath: idIdentifier.location.documentPath,
                            documentDepth: idIdentifier.location.documentDepth,
                            documentIndex: idIdentifier.location.documentIndex,
                        }
                    };
                    return validationFailure(`Section id '${id}' at '${current.documentPath.fullName}' has already been used.${msg}`, range, current.documentPath);
                }

                const destinationPath = (
                    variableTable.hasKey(destKey) ?
                    (variableTable.getValue(destKey) as IVariablePath).value :
                    false
                );

                if(!destinationPath) {
                    variableTable.addGlobalValue(id, { value: '', type: 'variable-empty-id' });
                } else {
                    variableTable.addGlobalValue(id, { value: destinationPath, source: location, type: 'variable-id', headerLinkText: sectionLinkText ? sectionLinkText : false });
                }

                return util.ok(id);
            }
    
            const sectionMeta = input[0] as CoreAst;

            if(sectionMeta.type === 'ast-command' && sectionMeta.value === 'section-meta') {
                hasSectionMeta = true;

                const title: ITitle = {
                    type: 'doculisp-title',
                    title: sectionMeta.parameter.value,
                    documentOrder: sectionMeta.location,
                    label: headerize(sectionMeta.location.documentDepth, sectionMeta.parameter.value),
                    ref_link: '#' + getLinkText(sectionMeta, false),
                };

                return util.ok({
                    type: 'parse result',
                    location: current,
                    subResult: title,
                    rest: trimArray.trim(1, input),
                });
            }
    
            if(sectionMeta.type !== 'ast-container' || sectionMeta.value !== 'section-meta') {
                return internals.noResultFound();
            }

            if(hasSectionMeta) {
                const range: IRange = {
                    start: sectionMeta.location,
                    end: {
                        line: sectionMeta.location.line,
                        char: sectionMeta.location.char + sectionMeta.value.length,
                        documentPath: sectionMeta.location.documentPath,
                        documentDepth: sectionMeta.location.documentDepth,
                        documentIndex: sectionMeta.location.documentIndex,
                    }
                };
                return validationFailure(`The section-meta block at '${sectionMeta.location.documentPath.fullName}' is a duplicate block. Only one section-meta block allowed per file.`, range, current.documentPath);
            }
    
            const badSections = sectionMeta.subStructure.filter(a => !['title', 'subtitle', 'ref-link', 'include', 'author', 'id'].includes(a.value));
    
            if(0 < badSections.length) {
                const next = badSections[0] as IdentifierAst;
                const range: IRange = {
                    start: next.location,
                    end: {
                        line: next.location.line,
                        char: next.location.char + next.value.length,
                        documentPath: next.location.documentPath,
                        documentDepth: next.location.documentDepth,
                        documentIndex: next.location.documentIndex,
                    }
                };
                return validationFailure(`The section-meta block at '${sectionMeta.location.documentPath.fullName}' contains unknown command '${next.value}'.`, range, current.documentPath);
            }
    
            const subtitle = parseSubtitle(sectionMeta.subStructure, current, sectionMeta.location.documentDepth + 2);
            
            if(!subtitle.success) {
                return subtitle;
            }
    
            const refLink = parseRefLink(sectionMeta.subStructure, current);
    
            if(!refLink.success) {
                return refLink;
            }

            const title = parseTitle(sectionMeta.subStructure, current, refLink.value, subtitle.value);
    
            if(!title.success) {
                return title;
            }

            const authors = parseAuthor(sectionMeta.subStructure, current);

            if(!authors.success){
                return authors;
            }
    
            const loaders = parseInclude(sectionMeta.subStructure, current);
    
            if(!loaders.success) {
                return loaders;
            }

            const result: (ITitle | ILoad)[] = loaders.value ? loaders.value : [];
            result.push(title.value);

            hasSectionMeta = true;
    
            return util.ok({
                type: 'parse group result',
                location: current,
                subResult: result.map((r): IKeeper<ITitle | ILoad> => { return { type: 'keep', keptValue: r } }),
                rest: trimArray.trim(1, input),
            });
        }
    
        function parseContent(input: CoreAst[], current: ILocation): StepParseResult<CoreAst[], IContentLocation | ITableOfContents> {
            function parseBulletStyle(bulletStyle: string | undefined, location: ILocation, documentPath: IPath) : Result<DoculispBulletStyle> {
                if(!bulletStyle) {
                    return util.ok('labeled');
                }

                const validStyles: DoculispBulletStyle[] = [
                    'bulleted',
                    'bulleted-labeled',
                    'labeled',
                    'no-table',
                    'numbered',
                    'numbered-labeled',
                    'unlabeled'
                ];
    
                if(!validStyles.includes(bulletStyle as DoculispBulletStyle)) {
                    const range: IRange = {
                        start: location,
                        end: {
                            line: location.line,
                            char: location.char + 'style'.length,
                            documentPath: location.documentPath,
                            documentDepth: location.documentDepth,
                            documentIndex: location.documentIndex,
                        }
                    };
                    return validationFailure(`The toc block at '${location.documentPath.fullName}' has unknown bullet style '${bulletStyle}'.`, range, documentPath);
                }

                return util.ok(bulletStyle as DoculispBulletStyle);
            }

            function parseToc(ast: IdentifierAst[], location: ILocation): Result<ITableOfContents | false> {
                const tocs = ast.filter(a => a.value === 'toc');
    
                if(tocs.length === 0) {
                    return util.ok(false);
                }
    
                if(1 < tocs.length) {
                    const range: IRange = {
                        start: location,
                        end: {
                            line: location.line,
                            char: location.char + 'content'.length,
                            documentPath: location.documentPath,
                            documentDepth: location.documentDepth,
                            documentIndex: location.documentIndex,
                        }
                    };
                    return validationFailure(`The content block at '${location.documentPath.fullName}' has more than one toc.`, range, location.documentPath);
                }

                const toc = tocs[0] as IdentifierAst;

                if(toc.type === 'ast-container') {
                    if(2 < toc.subStructure.length) {
                        const err = toc.subStructure[toc.subStructure.length -1] as IdentifierAst;
                        const range: IRange = {
                            start: err.location,
                            end: {
                                line: err.location.line,
                                char: err.location.char + err.value.length,
                                documentPath: err.location.documentPath,
                                documentDepth: err.location.documentDepth,
                                documentIndex: err.location.documentIndex,
                            }
                        };
                        return validationFailure(`The content block at '${location.documentPath.fullName}' has ${toc.subStructure.length} blocks and can only have 0, 1, or 2 blocks.`, range, location.documentPath);
                    }

                    const first = toc.subStructure[0] as IdentifierAst;
                    if(first.type !== 'ast-command' || !['label', 'style'].includes(first.value)){
                        const range: IRange = {
                            start: first.location,
                            end: {
                                line: first.location.line,
                                char: first.location.char + first.value.length,
                                documentPath: first.location.documentPath,
                                documentDepth: first.location.documentDepth,
                                documentIndex: first.location.documentIndex,
                            }
                        };
                        return validationFailure(`The content block at '${location.documentPath.fullName}' contains unknown command '${first.value}'.`, range, location.documentPath);
                    }
                    
                    let labelText: string | false = false;
                    let bulletStyle: DoculispBulletStyle = 'labeled';

                    if(first.value === 'label') {
                        labelText = first.parameter.value;
                    }

                    if(first.value === 'style') {
                        const typeMaybe = parseBulletStyle(first.parameter.value, toc.location, location.documentPath);
                        if(!typeMaybe.success) {
                            return typeMaybe;
                        }

                        bulletStyle = typeMaybe.value;
                    }

                    if(1 < toc.subStructure.length) {
                        const second = toc.subStructure[1] as IdentifierAst;

                        if(second.type !== 'ast-command' || !['label', 'style'].includes(second.value)) {
                            const range: IRange = {
                                start: second.location,
                                end: {
                                    line: second.location.line,
                                    char: second.location.char + second.value.length,
                                    documentPath: second.location.documentPath,
                                    documentDepth: second.location.documentDepth,
                                    documentIndex: second.location.documentIndex,
                                }
                            };
                            return validationFailure(`The content block at '${location.documentPath.fullName}' contains unknown command '${second.value}'.`, range, location.documentPath);
                        }

                        if(first.value === second.value) {
                            const range: IRange = {
                                start: second.location,
                                end: {
                                    line: second.location.line,
                                    char: second.location.char + second.value.length,
                                    documentPath: second.location.documentPath,
                                    documentDepth: second.location.documentDepth,
                                    documentIndex: second.location.documentIndex,
                                }
                            };
                            return validationFailure(`The content block at '${location.documentPath.fullName}' has a duplicate '${first.value}' block.`, range, location.documentPath);
                        }

                        if(second.value === 'label') {
                            labelText = second.parameter.value;
                        }
    
                        if(second.value === 'style') {
                            const typeMaybe = parseBulletStyle(second.parameter.value, toc.location, location.documentPath);
                            if(!typeMaybe.success) {
                                return typeMaybe;
                            }
    
                            bulletStyle = typeMaybe.value;
                        }
                    }

                    const docuToc: ITableOfContents = {
                        type: 'doculisp-toc',
                        label: labelText ? headerize(location.documentDepth + 1, labelText) : labelText,
                        documentOrder: toc.location.increaseChar(-1),
                        bulletStyle: bulletStyle,
                    };
        
                    return util.ok(docuToc);
                }
                else {
                    const style = (toc.type === 'ast-identifier') ? undefined : toc.parameter.value;
                    const bulletStyleMaybe = parseBulletStyle(style, toc.location, location.documentPath);

                    if(!bulletStyleMaybe.success) {
                        return bulletStyleMaybe;
                    }
        
                    const bulletStyle = bulletStyleMaybe.value
        
                    if(bulletStyle === 'no-table') {
                        return util.ok(false);
                    }
        
                    const docuToc: ITableOfContents = {
                        type: 'doculisp-toc',
                        label: false,
                        documentOrder: toc.location.increaseChar(-1),
                        bulletStyle: bulletStyle,
                    };
        
                    return util.ok(docuToc);
                }
            }
    
            const contentBlock = input[0] as CoreAst;
    
            if(contentBlock.value !== 'content') {
                return internals.noResultFound();
            }
    
            if(contentBlock.type === 'ast-value') {
                return internals.noResultFound();
            }
    
            if(contentBlock.type === 'ast-command') {
                const range: IRange = {
                    start: contentBlock.location,
                    end: {
                        line: contentBlock.location.line,
                        char: contentBlock.location.char + contentBlock.value.length,
                        documentPath: contentBlock.location.documentPath,
                        documentDepth: contentBlock.location.documentDepth,
                        documentIndex: contentBlock.location.documentIndex,
                    }
                };
                return validationFailure(`The content block at '${contentBlock.location.documentPath.fullName}' contains unknown parameter '${contentBlock.parameter.value}'.`, range, current.documentPath);
            }

            if(!hasSectionMeta) {
                const range: IRange = {
                    start: contentBlock.location,
                    end: {
                        line: contentBlock.location.line,
                        char: contentBlock.location.char + contentBlock.value.length,
                        documentPath: contentBlock.location.documentPath,
                        documentDepth: contentBlock.location.documentDepth,
                        documentIndex: contentBlock.location.documentIndex,
                    }
                };
                return validationFailure(`The content block at '${contentBlock.location.documentPath.fullName}' exists before the section-meta block.`, range, current.documentPath);
            }

            if(!hasInclude) {
                const range: IRange = {
                    start: contentBlock.location,
                    end: {
                        line: contentBlock.location.line,
                        char: contentBlock.location.char + contentBlock.value.length,
                        documentPath: contentBlock.location.documentPath,
                        documentDepth: contentBlock.location.documentDepth,
                        documentIndex: contentBlock.location.documentIndex,
                    }
                };
                return validationFailure(`The content block at '${contentBlock.location.documentPath.fullName}' exists without an include block that has external files.`, range, current.documentPath);
            }

            const content: IContentLocation = {
                type: 'doculisp-content',
                documentOrder: contentBlock.location,
                blockRange: contentBlock.blockRange,
            }
    
            if(contentBlock.type === 'ast-identifier') {
                return util.ok({
                    type: 'parse result',
                    subResult: content,
                    location: contentBlock.location,
                    rest: trimArray.trim(1, input),
                });
            }

            const bad = contentBlock.subStructure.filter(a => a.value !== 'toc');

            if(0 < bad.length) {
                const next = bad[0] as IdentifierAst;
                const range: IRange = {
                    start: next.location,
                    end: {
                        line: next.location.line,
                        char: next.location.char + next.value.length,
                        documentPath: next.location.documentPath,
                        documentDepth: next.location.documentDepth,
                        documentIndex: next.location.documentIndex,
                    }
                };
                return validationFailure(`The content block at '${contentBlock.location.documentPath.fullName}' has unknown command '${next.value}'.`, range, current.documentPath);
            }
    
            const tocMaybe = parseToc(contentBlock.subStructure, contentBlock.location);
    
            if(!tocMaybe.success) {
                return tocMaybe;
            }
    
            if(!tocMaybe.value) {
                return util.ok({
                    type: 'parse result',
                    subResult: content,
                    location: contentBlock.location,
                    rest: trimArray.trim(1, input),
                });
            }
    
            return util.ok({
                type: 'parse group result',
                subResult: [tocMaybe.value as ITableOfContents, content].map((r): IKeeper<ITableOfContents | IContentLocation> => { return { type: 'keep', keptValue: r } }),
                location: tocMaybe.value.documentOrder,
                rest: trimArray.trim(1, input),
            });
        }

        function parsePath(input: CoreAst[], current: ILocation): StepParseResult<CoreAst[], IPathId> {
            const pathIdBlock = input[0] as CoreAst;
            if(pathIdBlock.type === 'ast-value') {
                return internals.noResultFound();
            }

            if(pathIdBlock.value !== 'get-path') {
                return internals.noResultFound();
            }

            if(pathIdBlock.type === 'ast-identifier') {
                const range: IRange = {
                    start: pathIdBlock.location,
                    end: {
                        line: pathIdBlock.location.line,
                        char: pathIdBlock.location.char + pathIdBlock.value.length,
                        documentPath: pathIdBlock.location.documentPath,
                        documentDepth: pathIdBlock.location.documentDepth,
                        documentIndex: pathIdBlock.location.documentIndex,
                    }
                };
                return validationFailure(`get-path command at "${current.documentPath.fullName}" is missing parameter (Line: ${pathIdBlock.location.line}, Char: ${pathIdBlock.location.char}).`, range, current.documentPath);
            }

            if(pathIdBlock.type === 'ast-container') {
                return parseFailure(`get-path command at "${current.documentPath.fullName}" contains unknown sub structure (Line: ${pathIdBlock.location.line}, Char: ${pathIdBlock.location.char}).`);
            }

            return util.ok({
                type: 'parse result',
                location: current,
                subResult: {
                    type: 'doculisp-path-id',
                    id: pathIdBlock.parameter.value,
                    documentOrder: pathIdBlock.location,
                    blockRange: pathIdBlock.blockRange,
                },
                rest: trimArray.trim(1, input),
            });
        }
        
        if(astResult.value.type === 'ast-Empty'){
            return util.ok({ type: 'doculisp-empty' });
        }

        const astRoot = astResult.value;
        
        const parser = internals.createArrayParser<CoreAst, DoculispPart | ILoad>(parseValue, parseHeader, parseSectionMeta, parseContent, parsePath);
        const parsed = parser.parse(astRoot.ast, util.toLocation(astRoot.location, 0, 0));

        if(!parsed.success) {
            return parsed;
        }

        const [result, remaining] = parsed.value;

        if(0 < remaining.remaining.length) {
            const next = remaining.remaining[0] as CoreAst;
            const range: IRange = {
                start: next.location,
                end: {
                    line: next.location.line,
                    char: next.location.char + next.value.length,
                    documentPath: next.location.documentPath,
                    documentDepth: next.location.documentDepth,
                    documentIndex: next.location.documentIndex,
                }
            };
            return parseFailure(`Unknown identifier '${next.value}' at '${next.location.documentPath.fullName}' (Line: ${next.location.line}, Char: ${next.location.char}).`, range, next.location.documentPath);
        }

        // Validate: If include has external files, content block is required
        const doculispParts = result.filter(d => d.type !== 'doculisp-load') as DoculispPart[];
        const loadParts = result.filter(d => d.type === 'doculisp-load') as ILoad[];
        const hasContentBlock = doculispParts.some(d => d.type === 'doculisp-content');

        if(hasInclude && !hasContentBlock) {
            // Find the section-meta block to report error location
            const sectionMetaPart = doculispParts.find(d => d.type === 'doculisp-title');
            const errorLocation = sectionMetaPart ? sectionMetaPart.documentOrder : util.toLocation(astRoot.location, 1, 1);
            
            const range: IRange = {
                start: errorLocation,
                end: {
                    line: errorLocation.line,
                    char: errorLocation.char + 'section-meta'.length,
                    documentPath: errorLocation.documentPath,
                    documentDepth: errorLocation.documentDepth,
                    documentIndex: errorLocation.documentIndex,
                }
            };
            return validationFailure(`The section-meta block at '${errorLocation.documentPath.fullName}' has an include block with external files but no content block. A content block is required when including external files.`, range, errorLocation.documentPath);
        }

        return util.ok({
            projectLocation: astRoot.location,
            section: {
                doculisp: doculispParts,
                include: loadParts,
                documentOrder: util.toLocation(astRoot.location, 1, 1),
                type: 'doculisp-section'
            },
            type: 'doculisp-root'
        });
    }

    return {
        parse,
    }
}

const doculispParser: IRegisterable = {
    builder: (internals: IInternals, util: IUtil, trimArray: ITrimArray, pathConstructor: PathConstructor, textHelper: TextHelper) => buildAstParser(internals, util, trimArray, pathConstructor, textHelper),
    name: 'astDoculispParse',
    singleton: false,
    dependencies: ['internals', 'util', 'trimArray', 'pathConstructor', 'textHelpers']
};

export {
    doculispParser,
};