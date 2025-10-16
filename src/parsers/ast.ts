import { IdentifierAst, IAstContainer, IAstParser, IAstIdentifier, IAstCommand, IAstEmpty, IAstParameter, IAstValue, RootAst, CoreAst } from "../types/types.ast";
import { IRegisterable } from "../types/types.containers";
import { ILocation, IUtil, Result } from "../types/types.general";
import { IInternals, StepParseResult } from "../types/types.internal";
import { IdentifierToken, ParameterToken, TextToken, Token, TokenizedDocument } from "../types/types.tokens";
import { ITrimArray } from "../types/types.trimArray";

function buildAstParser(util: IUtil, internals: IInternals, trimArray: ITrimArray): IAstParser {
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

    function parseIdentifierToken(identifier: IdentifierToken): IAstIdentifier {
        return {
            type: 'ast-identifier',
            location: identifier.location,
            value: identifier.text,
        }
    }

    function parseCommandToken(identifier: IdentifierToken, parameter: ParameterToken): IAstCommand {
        return {
            type: 'ast-command',
            value: identifier.text,
            parameter: parseParameterToken(parameter),
            location: identifier.location
        }
    }

    function parseContainerToken(command: IdentifierToken, ast: IdentifierAst[]): IAstContainer {
        return {
            type: 'ast-container',
            subStructure: ast,
            location: command.location,
            value: command.text,
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
            subResult: parseIdentifierToken(identifier),
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
            return util.fail(`Parse Error: Malformed lisp expression at '${closeCommand.location.documentPath.fullName}' (Line: ${closeCommand.location.line}, Char: ${closeCommand.location.char}).`, closeCommand.location.documentPath);
        }

        return util.ok({
            type: 'parse result',
            subResult: parseCommandToken(command, parameter),
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
            return util.fail(`Parse Error: Malformed lisp expression at '${remaining.location.documentPath.fullName}' (Line: ${remaining.location.line}, Char: ${remaining.location.char}).`, remaining.location.documentPath);
        }

        return util.ok({
            type: 'parse result',
            subResult: parseContainerToken(container, subAst),
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
            return util.fail(`Parse Error: Unknown token '${tokenText}' at '${token.location.documentPath.fullName}' (Line: ${token.location.line}, Char: ${token.location.char}).`, token.location.documentPath)
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