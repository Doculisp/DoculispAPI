import { IdentifierAst, IAstContainer, IAstParser, IAstIdentifier, IAstCommand, IAstEmpty, IAstParameter, IAstValue, RootAst, CoreAst } from "../types/types.ast";
import { IRegisterable } from "../types/types.containers";
import { ILocation, IRange, IUtil, Result } from "../types/types.general";
import { IInternals, StepParseResult } from "../types/types.internal";
import { IdentifierToken, ParameterToken, TextToken, Token, TokenizedDocument } from "../types/types.tokens";
import { ITrimArray } from "../types/types.trimArray";

function buildAstParser(util: IUtil, internals: IInternals, trimArray: ITrimArray): IAstParser {
    const failureBuilder = util.fail('AST Parsing')('Parse Error');
    
    function parseTextToken(token: TextToken): IAstValue {
        return {
            type: 'ast-value',
            value: token.text,
            location: token.location,
        };
    }

    function parseParameterToken(parameter: ParameterToken): IAstParameter {
        return {
            type: 'ast-Parameter',
            location: parameter.location,
            value: parameter.text,
        };
    }

    function parseIdentifierToken(identifier: IdentifierToken, blockRange: IRange): IAstIdentifier {
        return {
            type: 'ast-identifier',
            location: identifier.location,
            value: identifier.text,
            blockRange: blockRange,
        }
    }

    function parseCommandToken(identifier: IdentifierToken, parameter: ParameterToken, blockRange: IRange): IAstCommand {
        return {
            type: 'ast-command',
            value: identifier.text,
            parameter: parseParameterToken(parameter),
            location: identifier.location,
            blockRange: blockRange
        }
    }

    function parseContainerToken(command: IdentifierToken, ast: IdentifierAst[], blockRange: IRange): IAstContainer {
        return {
            type: 'ast-container',
            subStructure: ast,
            location: command.location,
            value: command.text,
            blockRange: blockRange
        };
    }

    function parseIdentifier(input: Token[], current: ILocation): StepParseResult<Token[], IAstIdentifier> {
        if(input.length < 2) {
            return internals.noResultFound();
        }

        const identifier = input[0] as Token;
        const close = input[1] as Token;

        if(identifier.type !== 'token - identifier') {
            return internals.noResultFound();
        }

        if(close.type !== 'token - close parenthesis') {
            return internals.noResultFound();
        }

        return util.ok({
            type: 'parse result',
            subResult: parseIdentifierToken(identifier, { start: identifier.location.increaseChar(-1), end: close.location }),
            location: current,
            rest: trimArray.trim(2, input),
        });
    };

    function parseText(input: Token[], current: ILocation): StepParseResult<Token[], IAstValue> {
        if(input.length < 1) {
            return internals.noResultFound();
        }

        const textToken = input[0] as Token;

        if(textToken.type !== 'token - text') {
            return internals.noResultFound();
        }

        return util.ok({
            type: 'parse result',
            subResult: parseTextToken(textToken),
            location: current,
            rest: trimArray.trim(1, input),
        });
    };

    function parseCommand(input: Token[], current: ILocation): StepParseResult<Token[], IAstCommand> {
        if(input.length < 3) {
            return internals.noResultFound();
        }

        const command = input[0] as Token;
        const parameter = input[1] as Token;
        const closeCommand = input[2] as Token;

        if(command.type !== 'token - identifier') {
            return internals.noResultFound();
        }

        if(parameter.type !== 'token - parameter') {
            return internals.noResultFound();
        }

        if(closeCommand.type !== 'token - close parenthesis') {
            const range: IRange = {
                start: command.location,
                end: { line: closeCommand.location.line, char: closeCommand.location.char + closeCommand.text.length, documentPath: closeCommand.location.documentPath, documentDepth: closeCommand.location.documentDepth, documentIndex: closeCommand.location.documentIndex },
            };
            return failureBuilder(`Malformed lisp expression at '${closeCommand.location.documentPath.fullName}'`, range, closeCommand.location.documentPath);
        }

        return util.ok({
            type: 'parse result',
            subResult: parseCommandToken(command, parameter, { start: command.location.increaseChar(-1), end: closeCommand.location }),
            location: current,
            rest: trimArray.trim(3, input),
        });
    }

    function parseContainer(input: Token[], current: ILocation): StepParseResult<Token[], IAstContainer> {
        if(input.length < 3) {
            return internals.noResultFound();
        }

        const container = input[0] as Token;
        const identifier = input[0] as Token;

        if(container.type !== 'token - identifier') {
            return internals.noResultFound();
        }

        if (identifier.type !== 'token - identifier') {
            return internals.noResultFound();
        }

        const parser = internals.createArrayParser<Token, IdentifierAst>(parseIdentifier, parseCommand, parseContainer);
        const parsed = parser.parse(trimArray.trim(1, input), container.location);

        if(!parsed.success) {
            return parsed;
        }

        const [subAst, remaining] = parsed.value;

        const close = remaining.remaining[0] as Token;

        if(remaining.remaining.length === 0 || close.type !== 'token - close parenthesis') {
            const range: IRange = {
                start: container.location,
                end: { line: remaining.location.line, char: remaining.location.char + (remaining.remaining.length > 0 ? (remaining.remaining[0] as any).text.length : 1), documentPath: remaining.location.documentPath, documentDepth: remaining.location.documentDepth, documentIndex: remaining.location.documentIndex },
            };
            return failureBuilder(`Malformed lisp expression at '${remaining.location.documentPath.fullName}'`, range, remaining.location.documentPath);
        }

        return util.ok({
            type: 'parse result',
            subResult: parseContainerToken(container, subAst, { start: container.location.increaseChar(-1), end: close.location }),
            location: current,
            rest: trimArray.trim(1, remaining.remaining),
        });
    }
    
    function parse(tokenMaybe: Result<TokenizedDocument>): Result<RootAst | IAstEmpty> {
        if(!tokenMaybe.success) {
            return tokenMaybe;
        }

        const tokenDoc = tokenMaybe.value;
        if(tokenDoc.tokens.length === 0) {
            return util.ok({
                type: 'ast-Empty',
                location: tokenMaybe.value.projectLocation
            });
        }

        const parser = internals.createArrayParser<Token, CoreAst>(parseText, parseCommand, parseIdentifier, parseContainer);
        const parsed = parser.parse(tokenDoc.tokens, (tokenDoc.tokens[0] as Token).location);

        if(!parsed.success) {
            return parsed;
        }

        const [result, leftovers] = parsed.value;

        if(0 < leftovers.remaining.length) {
            const token: Token = leftovers.remaining[0] as Token;
            const tokenText = token.type === 'token - close parenthesis' ? ')' : (token as any).text;
            const range: IRange = {
                start: token.location,
                end: { line: token.location.line, char: token.location.char + (tokenText ? tokenText.length : 1), documentPath: token.location.documentPath, documentDepth: token.location.documentDepth, documentIndex: token.location.documentIndex },
            };
            return failureBuilder(`Unknown token '${tokenText}' at '${token.location.documentPath.fullName}'`, range, token.location.documentPath)
        }
        
        return util.ok({
            ast: result,
            location: tokenDoc.projectLocation,
            type: 'RootAst'
        });
    }

    return {
        parse,
    };
}

const astParser: IRegisterable = {
    builder: (util: IUtil, internals: IInternals, trimArray: ITrimArray) => buildAstParser(util, internals, trimArray),
    name: 'astParser',
    singleton: false,
    dependencies: ['util', 'internals', 'trimArray']
};

export {
    astParser,
};