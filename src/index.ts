// Export all types for API consumers
export * from './types';
export { IDoculispApi } from './types/types.api';

// Export the main API components
export { containerPromise } from './moduleLoader';
export { container, registry, manager } from './container';

// Export core interfaces that API consumers will need
import { containerPromise } from './moduleLoader';
import { IController } from './types/types.controller';
import { IIncludeBuilder } from './types/types.includeBuilder';
import { IStringWriter } from './types/types.stringWriter';
import { IVariableTable, sourceKey } from './types/types.variableTable';
import { PathConstructor } from './types/types.filePath';
import { IUtil } from './types/types.general';
import { IContainer, ITestableContainer } from './types/types.containers';
import { DocumentParser, IAstParser, IDoculispParser, IProjectParser, TokenFunction } from './types';
import { IDoculispApi, ITestableDoculispApi } from './types/types.api';

/**
 * Main API class for Doculisp document compilation
 */
export class DoculispApi implements IDoculispApi {
    private container: IContainer;

    constructor(container: IContainer) {
        this.container = container;
    }

    /**
     * Initialize the API with the default container
     */
    static async create(): Promise<DoculispApi> {
        const container = await containerPromise;
        return new DoculispApi(container);
    }

    /**
     * Create a testable API instance with an isolated container
     * @returns A tuple containing the testable container and the API instance
     */
    static async createTestable(): Promise<[ITestableContainer, DoculispApi]> {
        const baseContainer = await containerPromise;
        const testableContainer = baseContainer.buildTestable();
        const api = new DoculispApi(testableContainer);
        return [testableContainer, api];
    }

    /**
     * Compile a single Doculisp file to markdown
     */
    async compileFile(sourcePath: string, outputPath?: string) {
        const pathConstructor = this.container.buildAs<PathConstructor>('pathConstructor');
        const controller = this.container.buildAs<IController>('controller');
        
        const source = pathConstructor(sourcePath);
        const output = outputPath ? pathConstructor(outputPath) : false;
        
        return controller.compile(source, output);
    }

    /**
     * Test/validate a Doculisp file without writing output
     */
    async testFile(sourcePath: string) {
        const pathConstructor = this.container.buildAs<PathConstructor>('pathConstructor');
        const controller = this.container.buildAs<IController>('controller');
        const variableTable = this.container.buildAs<IVariableTable>('variableTable').createChild();
        
        const source = pathConstructor(sourcePath);
        variableTable.addValue(sourceKey, { type: 'variable-path', value: source });
        
        return controller.test(variableTable);
    }

    /**
     * Get the AST builder for advanced usage
     */
    getAstBuilder() {
        return this.container.buildAs<IIncludeBuilder>('includeBuilder');
    }

    /**
     * Get partial AST builders for advanced usage
     */
    getPartialAstBuilders() {
        const ast = this.container.buildAs<IAstParser>('astParser');
        const markdownAst = this.container.buildAs<IDoculispParser>('astDoculispParse');
        const projectAst = this.container.buildAs<IProjectParser>('astProjectParse');

        return {
            nonSemanticAstBuilder: ast,
            markdownAstBuilder: markdownAst,
            projectAstBuilder: projectAst
        }
    }

    /**
     * Get the tokenizer for advanced usage
     */
    getTokenizer() {
        return this.container.buildAs<TokenFunction>('tokenizer');
    }

    /**
     * Get the preprocessor for advanced usage
     */
    getPreprocessor() {
        return this.container.buildAs<DocumentParser>('documentParse');
    }

    /**
     * Get the string writer for advanced usage
     */
    getStringWriter() {
        return this.container.buildAs<IStringWriter>('stringWriter');
    }

    /**
     * Create a new variable table
     */
    createVariableTable() {
        return this.container.buildAs<IVariableTable>('variableTable').createChild();
    }

    /**
     * Get the path constructor utility
     */
    getPathConstructor() {
        return this.container.buildAs<PathConstructor>('pathConstructor');
    }

    /**
     * Get the utility functions
     */
    getUtil() {
        return this.container.buildAs<IUtil>('util');
    }

    /**
     * Get a testable version of this API for testing purposes
     */
    getTestableApi(): ITestableDoculispApi {
        if (!(this.container as any).buildTestable) {
            throw new Error('Cannot create testable API from non-testable container');
        }
        const testableContainer = (this.container as any).buildTestable() as ITestableContainer;
        return new TestableDoculispApi(testableContainer);
    }
}

/**
 * Testable implementation of the Doculisp API
 * Allows injection of test fakes through container registration
 */
export class TestableDoculispApi extends DoculispApi implements ITestableDoculispApi {
    private testableContainer: ITestableContainer;

    constructor(testableContainer: ITestableContainer) {
        super(testableContainer);
        this.testableContainer = testableContainer;
    }

    /**
     * Set a fake AST builder for testing (full pipeline)
     */
    setAstBuilder(fake: IIncludeBuilder): void {
        this.testableContainer.replaceValue(fake, 'includeBuilder');
    }

    /**
     * Set fake partial AST builders for testing (individual stages)
     */
    setPartialAstBuilders(fakes: {
        nonSemanticAstBuilder?: IAstParser;
        markdownAstBuilder?: IDoculispParser;
        projectAstBuilder?: IProjectParser;
    }): void {
        if (fakes.nonSemanticAstBuilder)
            this.testableContainer.replaceValue(fakes.nonSemanticAstBuilder, 'astParser');
        if (fakes.markdownAstBuilder)
            this.testableContainer.replaceValue(fakes.markdownAstBuilder, 'astDoculispParse');
        if (fakes.projectAstBuilder)
            this.testableContainer.replaceValue(fakes.projectAstBuilder, 'astProjectParse');
    }

    /**
     * Set a fake tokenizer for testing
     */
    setTokenizer(fake: TokenFunction): void {
        this.testableContainer.replaceValue(fake, 'tokenizer');
    }

    /**
     * Set a fake preprocessor for testing
     */
    setPreprocessor(fake: DocumentParser): void {
        this.testableContainer.replaceValue(fake, 'documentParse');
    }

    /**
     * Set a fake string writer for testing
     */
    setStringWriter(fake: IStringWriter): void {
        this.testableContainer.replaceValue(fake, 'stringWriter');
    }

    /**
     * Set a fake path constructor for testing
     */
    setPathConstructor(fake: PathConstructor): void {
        this.testableContainer.replaceValue(fake, 'pathConstructor');
    }

    /**
     * Set fake utility functions for testing
     */
    setUtil(fake: IUtil): void {
        this.testableContainer.replaceValue(fake, 'util');
    }

    /**
     * Override to return this same testable instance
     */
    override getTestableApi(): ITestableDoculispApi {
        return this;
    }
}