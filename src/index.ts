// Export all types for API consumers
export * from './types';

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

/**
 * Main API class for Doculisp document compilation
 */
export class DoculispApi {
    private container: IContainer;

    constructor(container: IContainer) {
        this.container = container;
    }

    /**
     * Initialize the API with the default container
     */
    static async create(): Promise<DoculispApi> {
        const container = await containerPromise;
        return new DoculispApi(container.buildTestable()); // Use a testable container to prevent the API from having a global state
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
}