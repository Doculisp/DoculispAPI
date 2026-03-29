import { containerPromise } from "../../../src/moduleLoader";
import { configure } from "approvals/lib/config";
import { getVerifiers } from "../../tools";
import { Options } from "approvals/lib/Core/Options";
import { IContainer, ITestableContainer } from "../../../src/types/types.containers";
import { TokenFunction, TokenizedDocument } from '../../../src/types/types.tokens';
import { IFail, ILocation, IRange, ISuccess, IUtil, Result, IProjectLocation } from "../../../src/types/types.general";
import { DocumentMap } from "../../../src/types/types.document";
import { buildProjectLocation, testable, buildPath, buildLocation } from "../../testHelpers";
import { IPath, PathConstructor } from "../../../src/types/types.filePath";

describe('tokenizer', () => {
    const BASIC_SAMPLE_DOCUMENT = 'D:/comments/simple.md';

    let container: IContainer = null as any;
    let tokenizer: TokenFunction = undefined as any;
    let verifyAsJson: (data: any, options?: Options) => void = undefined as any;
    let verifyWithGiven: (data: any, options?: Options | undefined, ...given: any[]) => void = undefined as any;
    let ok: (successfulValue: any) => ISuccess<any> = undefined as any;
    let fail: (message: string, range?: IRange | undefined, documentPath?: IPath) => IFail = undefined as any;
    let util: IUtil = undefined as any;
    let getLocation: (path: string, depth: number, index: number, line: number, char: number, extension?: string | false) => ILocation = undefined as any;

    beforeAll(() => {
        const verifiers = getVerifiers(configure);
        verifyAsJson = verifiers.verifyAsJson;
        verifyWithGiven = verifiers.verifyWithGiven;
    });

    // Consolidated setup logic for tokenizer environment configuration
    const setupTokenizerEnvironment = (environment: ITestableContainer): IUtil => {
        const pathHandler: PathConstructor = (filePath) => buildPath(filePath);
        environment.replaceValue(pathHandler, 'pathConstructor');
        return environment.buildAs<IUtil>('util');
    };

    beforeEach(async () => {
        container = await containerPromise;
        tokenizer = testable.token.parserBuilder(container, (environment: ITestableContainer) => {
            util = setupTokenizerEnvironment(environment);
            getLocation = buildLocation(util);
        });

        ok = util.ok;
        fail = util.fail('Tokenization')('Parse Error');
    });

    // Test data builders
    const createDocMap = (parts: any[], depth: number = 1, index: number = 1, path: string = BASIC_SAMPLE_DOCUMENT) => ok({
        projectLocation: buildProjectLocation(path, depth, index),
        parts: parts,
    });

    const createTextPart = (text: string, line: number, char: number, path: string = BASIC_SAMPLE_DOCUMENT) => ({
        type: 'text' as const,
        text: text,
        location: getLocation(path, 0, 0, line, char),
    });

    const createLispPart = (text: string, line: number, char: number, path: string = BASIC_SAMPLE_DOCUMENT) => ({
        type: 'lisp' as const,
        text: text,
        location: getLocation(path, 0, 0, line, char),
    });

    it('should fail if document parsing failed', () => {
        const parseResult = fail('This document did not parse', undefined, buildPath('X:/non-exist.dlisp')) as Result<DocumentMap>;

        const result = tokenizer(parseResult);

        verifyAsJson(result);
    });

    it('should return empty if given an empty parse result', () => {
        const parseResult = createDocMap([], 4, 8, 'c:/empty/readme.md');

        const result = tokenizer(parseResult);

        verifyAsJson(result);
    });

    it('should tokenize text as text', () => {
        const parseResult = createDocMap([createTextPart('hello my text', 5, 23)], 6, 8);

        const result = tokenizer(parseResult);

        verifyAsJson(result);
    });

    describe('handling Doculisp', () => {
        it('should tokenize an empty comment', () => {
            const parseResult = createDocMap([createLispPart('(*)', 2, 1)], 1, 5);
            
            const result = tokenizer(parseResult);

            verifyAsJson(result);
        });
        
        it('should tokenize an single identifier', () => {
            const parseResult = createDocMap([createLispPart('(identifier)', 4, 2)], 2, 7);
            
            const result = tokenizer(parseResult);

            verifyAsJson(result);
        });

        it('should provide standardized error when tokenization fails (mocked parser)', () => {
            // Build a tokenizer that uses a mocked internals.createStringParser which always fails
            const failingTokenizer = testable.token.parserBuilder(container, (environment: ITestableContainer) => {
                util = setupTokenizerEnvironment(environment);
                getLocation = buildLocation(util);

                // Grab the real internals so we can base the mock on it
                const originalInternals = environment.buildAs<any>('internals');
                const mockInternals = {
                    ...originalInternals,
                    createStringParser: (..._args: any[]) => ({
                        parse: () => ({ success: false, message: 'Simulated string parser failure' })
                    })
                };

                environment.replaceValue(mockInternals, 'internals');
            });

            const parseResult = createDocMap([createLispPart('(unclosed (paren', 1, 1)], 1, 1);

            const result = failingTokenizer(parseResult);

            verifyAsJson(result);
        });
        
        it('should tokenize an single identifier with space after identifier', () => {
            const parseResult = createDocMap([createLispPart('(identifier )', 4, 2)], 3, 7);
            
            const result = tokenizer(parseResult);

            verifyAsJson(result);
        });
        
        it('should tokenize an single identifier with new line after identifier', () => {
            const parseResult = createDocMap([createLispPart('(identifier\r\n)', 4, 2)], 7, 4);
            
            const result = tokenizer(parseResult);

            verifyAsJson(result);
        });
        
        it('should tokenize an single identifier containing only numbers', () => {
            const parseResult = createDocMap([createLispPart('(123987)', 4, 2)], 4, 6);
            
            const result = tokenizer(parseResult);

            verifyAsJson(result);
        });
        
        it('should tokenize an single identifier with hyphen and underscore', () => {
            const parseResult = createDocMap([createLispPart('(identifier-start_end)', 4, 2)], 7, 7);
            
            const result = tokenizer(parseResult);

            verifyAsJson(result);
        });

        it('should tokenize a single identifier with a single word parameter', () => {
            const parseResult = createDocMap([createLispPart('(the thing)', 1, 13, 'Z:/parameter.md')], 5, 5, 'Z:/parameter.md');

            const result = tokenizer(parseResult);

            verifyAsJson(result);
        });

        it('should tokenize a single identifier with a multi word parameter', () => {
            const parseResult = createDocMap([createLispPart('(title the thing from beyond\n\tthe swamp)', 1, 13, 'Z:/parameter.md')], 8, 1, 'Z:/parameter.md');

            const result = tokenizer(parseResult);

            verifyAsJson(result);
        });

        it('should handle nested lisp', () => {
            const parseResult = createDocMap([
                createLispPart(`(section-meta
        (include
            (Section ./structure.md)
        )
    )`, 2, 1, 'A:/main.md')
            ], 7, 7, 'A:/main.md');

            const result = tokenizer(parseResult);

            verifyAsJson(result);
        });

        it('should handle comment with nested lisp', () => {
            const parseResult = createDocMap([
                createLispPart(`(section-meta
        (*include
            (Section ./structure.md)
            (*Section ./comments.md)
            (Section ./toc.md)
        )
    )`, 2, 1, 'A:/main.md')
            ], 7, 1, 'A:/main.md');

            const result = tokenizer(parseResult);

            verifyAsJson(result);
        });

        it('should handle parameter with escaped open paren', () => {
            const parseResult = createDocMap([createLispPart("(title The elusive \\())", 2, 1, 'A:/main.md')], 7, 1, 'A:/main.md');

            const result = tokenizer(parseResult);

            verifyAsJson(result);
        });

        it('should handle parameter with escaped close paren', () => {
            const parseResult = createDocMap([createLispPart("(title The elusive \\))", 2, 1, 'A:/main.md')], 7, 1, 'A:/main.md');

            const result = tokenizer(parseResult);

            verifyAsJson(result);
        });
    });

    describe('whitespace error handling', () => {
        let toResult: (text: string, location: IProjectLocation) => Result<TokenizedDocument>;

        beforeEach(() => {
            toResult = testable.token.resultBuilder(container, environment => {
                util = setupTokenizerEnvironment(environment);
                getLocation = buildLocation(util);
            });
        });

        it('should fail when space follows opening parenthesis', () => {
            const input = '<!-- (dl ( identifier)) -->';
            const location = buildProjectLocation(BASIC_SAMPLE_DOCUMENT, 1, 1);
            
            const result = toResult(input, location);
            
            verifyWithGiven(result, undefined, input);
        });

        it('should fail when newline follows opening parenthesis', () => {
            const input = '<!-- (dl (\nidentifier)) -->';
            const location = buildProjectLocation(BASIC_SAMPLE_DOCUMENT, 1, 1);
            
            const result = toResult(input, location);
            
            verifyWithGiven(result, undefined, input);
        });

        it('should fail when tab follows opening parenthesis', () => {
            const input = '<!-- (dl (\tidentifier)) -->';
            const location = buildProjectLocation(BASIC_SAMPLE_DOCUMENT, 1, 1);
            
            const result = toResult(input, location);
            
            verifyWithGiven(result, undefined, input);
        });

        it('should fail when multiple whitespace follows opening parenthesis', () => {
            const input = '<!-- (dl ( \n\t identifier)) -->';
            const location = buildProjectLocation(BASIC_SAMPLE_DOCUMENT, 1, 1);
            
            const result = toResult(input, location);
            
            verifyWithGiven(result, undefined, input);
        });

        it('should fail with Windows line endings after opening parenthesis', () => {
            const input = '<!-- (dl (\r\nidentifier)) -->';
            const location = buildProjectLocation(BASIC_SAMPLE_DOCUMENT, 1, 1);
            
            const result = toResult(input, location);
            
            verifyWithGiven(result, undefined, input);
        });

        it('should fail in nested context with whitespace', () => {
            const input = '<!-- (dl (outer ( inner))) -->';
            const location = buildProjectLocation(BASIC_SAMPLE_DOCUMENT, 1, 1);
            
            const result = toResult(input, location);
            
            verifyWithGiven(result, undefined, input);
        });

        it('should succeed when identifier immediately follows opening parenthesis', () => {
            const input = '<!-- (dl (identifier)) -->';
            const location = buildProjectLocation(BASIC_SAMPLE_DOCUMENT, 1, 1);
            
            const result = toResult(input, location);
            
            verifyWithGiven(result, undefined, input);
        });

        it('should succeed with whitespace before closing parenthesis', () => {
            const input = '<!-- (dl (identifier )) -->';
            const location = buildProjectLocation(BASIC_SAMPLE_DOCUMENT, 1, 1);
            
            const result = toResult(input, location);
            
            verifyWithGiven(result, undefined, input);
        });

        it('should succeed with whitespace in parameters', () => {
            const input = '<!-- (dl (command parameter with spaces)) -->';
            const location = buildProjectLocation(BASIC_SAMPLE_DOCUMENT, 1, 1);
            
            const result = toResult(input, location);
            
            verifyWithGiven(result, undefined, input);
        });
    });
});