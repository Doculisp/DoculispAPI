import { IIncludeBuilder } from './types.includeBuilder';
import { IStringWriter } from './types.stringWriter';
import { IVariableTable } from './types.variableTable';
import { PathConstructor } from './types.filePath';
import { IUtil } from './types.general';
import { DocumentParser } from './types.document';
import { IAstParser } from './types.ast';
import { IDoculispParser } from './types.astDoculisp';
import { IProjectParser } from './types.astProject';
import { TokenFunction } from './types.tokens';

/**
 * Interface for the main Doculisp API
 * Provides access to compilation, parsing stages, and utility functions
 */
export interface IDoculispApi {
    /**
     * Compile a single Doculisp file to markdown
     */
    compileFile(sourcePath: string, outputPath?: string): Promise<any>;

    /**
     * Test/validate a Doculisp file without writing output
     */
    testFile(sourcePath: string): Promise<any>;

    /**
     * Get the AST builder for advanced usage (full pipeline)
     */
    getAstBuilder(): IIncludeBuilder;

    /**
     * Get partial AST builders for advanced usage (individual stages)
     */
    getPartialAstBuilders(): {
        nonSemanticAstBuilder: IAstParser;
        markdownAstBuilder: IDoculispParser;
        projectAstBuilder: IProjectParser;
    };

    /**
     * Get the tokenizer for advanced usage
     */
    getTokenizer(): TokenFunction;

    /**
     * Get the preprocessor for advanced usage
     */
    getPreprocessor(): DocumentParser;

    /**
     * Get the string writer for advanced usage
     */
    getStringWriter(): IStringWriter;

    /**
     * Create a new variable table
     */
    createVariableTable(): IVariableTable;

    /**
     * Get the path constructor utility
     */
    getPathConstructor(): PathConstructor;

    /**
     * Get the utility functions
     */
    getUtil(): IUtil;

    /**
     * Get a testable version of this API for testing purposes
     */
    getTestableApi(): ITestableDoculispApi;
}

/**
 * Testable interface for the Doculisp API
 * Extends IDoculispApi with methods to inject test fakes for all components
 */
export interface ITestableDoculispApi extends IDoculispApi {
    /**
     * Set a fake AST builder for testing (full pipeline)
     */
    setAstBuilder(fake: IIncludeBuilder): void;

    /**
     * Set fake partial AST builders for testing (individual stages)
     */
    setPartialAstBuilders(fakes: {
        nonSemanticAstBuilder?: IAstParser;
        markdownAstBuilder?: IDoculispParser;
        projectAstBuilder?: IProjectParser;
    }): void;

    /**
     * Set a fake tokenizer for testing
     */
    setTokenizer(fake: TokenFunction): void;

    /**
     * Set a fake preprocessor for testing
     */
    setPreprocessor(fake: DocumentParser): void;

    /**
     * Set a fake string writer for testing
     */
    setStringWriter(fake: IStringWriter): void;

    /**
     * Set a fake path constructor for testing
     */
    setPathConstructor(fake: PathConstructor): void;

    /**
     * Set fake utility functions for testing
     */
    setUtil(fake: IUtil): void;
}