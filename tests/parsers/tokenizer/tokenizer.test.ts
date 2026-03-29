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

    // Semantic test scenario helpers
    const tokenizeScenario = {
        text: (text: string, depth: number = 6, index: number = 8) => 
            tokenizer(createDocMap([createTextPart(text, 5, 23)], depth, index)),
        
        lisp: (code: string, depth: number = 2, index: number = 7, line: number = 4, char: number = 2, path: string = BASIC_SAMPLE_DOCUMENT) => 
            tokenizer(createDocMap([createLispPart(code, line, char, path)], depth, index, path)),
        
        empty: () => 
            tokenizer(createDocMap([], 4, 8, 'c:/empty/readme.md')),
    };

    it('should fail if document parsing failed', () => {
        const parseResult = fail('This document did not parse', undefined, buildPath('X:/non-exist.dlisp')) as Result<DocumentMap>;

        const result = tokenizer(parseResult);

        verifyAsJson(result);
    });

    it('should return empty if given an empty parse result', () => {
        const result = tokenizeScenario.empty();

        verifyAsJson(result);
    });

    it('should tokenize text as text', () => {
        const result = tokenizeScenario.text('hello my text');

        verifyAsJson(result);
    });

    describe('handling Doculisp', () => {
        it('should tokenize an empty comment', () => {
            const result = tokenizeScenario.lisp('(*)', 1, 5, 2, 1);

            verifyAsJson(result);
        });
        
        it('should tokenize an single identifier', () => {
            const result = tokenizeScenario.lisp('(identifier)');

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
            const result = tokenizeScenario.lisp('(identifier )', 3);

            verifyAsJson(result);
        });
        
        it('should tokenize an single identifier with new line after identifier', () => {
            const result = tokenizeScenario.lisp('(identifier\r\n)', 7, 4);

            verifyAsJson(result);
        });
        
        it('should tokenize an single identifier containing only numbers', () => {
            const result = tokenizeScenario.lisp('(123987)', 4, 6);

            verifyAsJson(result);
        });
        
        it('should tokenize an single identifier with hyphen and underscore', () => {
            const result = tokenizeScenario.lisp('(identifier-start_end)', 7);

            verifyAsJson(result);
        });

        it('should tokenize a single identifier with a single word parameter', () => {
            const result = tokenizeScenario.lisp('(the thing)', 5, 5, 1, 13, 'Z:/parameter.md');

            verifyAsJson(result);
        });

        it('should tokenize a single identifier with a multi word parameter', () => {
            const result = tokenizeScenario.lisp('(title the thing from beyond\n\tthe swamp)', 8, 1, 1, 13, 'Z:/parameter.md');

            verifyAsJson(result);
        });

        it('should handle nested lisp', () => {
            const result = tokenizeScenario.lisp(`(section-meta
        (include
            (Section ./structure.md)
        )
    )`, 7, 7, 2, 1, 'A:/main.md');

            verifyAsJson(result);
        });

        it('should handle comment with nested lisp', () => {
            const result = tokenizeScenario.lisp(`(section-meta
        (*include
            (Section ./structure.md)
            (*Section ./comments.md)
            (Section ./toc.md)
        )
    )`, 7, 1, 2, 1, 'A:/main.md');

            verifyAsJson(result);
        });

        it('should handle parameter with escaped open paren', () => {
            const result = tokenizeScenario.lisp("(title The elusive \\())", 7, 1, 2, 1, 'A:/main.md');

            verifyAsJson(result);
        });

        it('should handle parameter with escaped close paren', () => {
            const result = tokenizeScenario.lisp("(title The elusive \\))", 7, 1, 2, 1, 'A:/main.md');

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

        // Helper to test whitespace validation patterns
        const testWhitespaceValidation = (description: string, input: string) => {
            it(description, () => {
                const location = buildProjectLocation(BASIC_SAMPLE_DOCUMENT, 1, 1);
                const result = toResult(input, location);
                verifyWithGiven(result, undefined, input);
            });
        };

        testWhitespaceValidation(
            'should fail when space follows opening parenthesis',
            '<!-- (dl ( identifier)) -->'
        );

        testWhitespaceValidation(
            'should fail when newline follows opening parenthesis',
            '<!-- (dl (\nidentifier)) -->'
        );

        testWhitespaceValidation(
            'should fail when tab follows opening parenthesis',
            '<!-- (dl (\tidentifier)) -->'
        );

        testWhitespaceValidation(
            'should fail when multiple whitespace follows opening parenthesis',
            '<!-- (dl ( \n\t identifier)) -->'
        );

        testWhitespaceValidation(
            'should fail with Windows line endings after opening parenthesis',
            '<!-- (dl (\r\nidentifier)) -->'
        );

        testWhitespaceValidation(
            'should fail in nested context with whitespace',
            '<!-- (dl (outer ( inner))) -->'
        );

        testWhitespaceValidation(
            'should succeed when identifier immediately follows opening parenthesis',
            '<!-- (dl (identifier)) -->'
        );

        testWhitespaceValidation(
            'should succeed with whitespace before closing parenthesis',
            '<!-- (dl (identifier )) -->'
        );

        testWhitespaceValidation(
            'should succeed with whitespace in parameters',
            '<!-- (dl (command parameter with spaces)) -->'
        );
    });
});