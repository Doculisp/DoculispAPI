import { ITestableContainer } from "../../../src/types/types.containers";
import { IUtil, Result, IProjectLocation } from "../../../src/types/types.general";
import { TokenFunction, TokenizedDocument } from '../../../src/types/types.tokens';
import { PathConstructor } from "../../../src/types/types.filePath";
import { buildPath, buildProjectLocation } from "../../testHelpers";
import { verifyWithGivenJest } from "../../tools";
import { CreateDocMapFn, CreatePartFn } from "./tokenizer.builders";

/**
 * Test execution helpers for tokenizer tests.
 * These functions support test setup, scenario execution, and validation patterns.
 */

/**
 * Consolidated setup logic for tokenizer environment configuration.
 * Configures the path handler and returns the util instance.
 */
export const setupTokenizerEnvironment = (environment: ITestableContainer): IUtil => {
    const pathHandler: PathConstructor = (filePath) => buildPath(filePath);
    environment.replaceValue(pathHandler, 'pathConstructor');
    return environment.buildAs<IUtil>('util');
};

/**
 * Creates semantic test scenario helpers for tokenizer testing.
 * Provides convenient methods for common tokenization scenarios.
 * 
 * @param tokenizer - The tokenizer function to test
 * @param createDocMap - Document map builder
 * @param createTextPart - Text part builder
 * @param createLispPart - Lisp part builder
 */
export const createTokenizeScenario = (
    tokenizer: TokenFunction,
    createDocMap: CreateDocMapFn,
    createTextPart: CreatePartFn,
    createLispPart: CreatePartFn
) => ({
    text: (text: string, depth: number = 6, index: number = 8) => 
        tokenizer(createDocMap([createTextPart(text, 5, 23)], depth, index)),
    
    lisp: (code: string, depth: number = 2, index: number = 7, line: number = 4, char: number = 2, path?: string) => 
        tokenizer(createDocMap([createLispPart(code, line, char, path)], depth, index, path)),
    
    empty: () => 
        tokenizer(createDocMap([], 4, 8, 'c:/empty/readme.md')),
});

/**
 * Creates a whitespace validation test helper.
 * Generates test cases that validate whitespace handling in Doculisp parsing.
 * 
 * @param getToResult - Function that returns the result builder (called at test runtime)
 * @param sampleDocumentPath - Path to use for test documents
 */
export const createWhitespaceValidator = (
    getToResult: () => ((text: string, location: IProjectLocation) => Result<TokenizedDocument>),
    sampleDocumentPath: string
) => (description: string, input: string) => {
    it(description, () => {
        const location = buildProjectLocation(sampleDocumentPath, 1, 1);
        const result = getToResult()(input, location);
        verifyWithGivenJest(result, input);
    });
};
