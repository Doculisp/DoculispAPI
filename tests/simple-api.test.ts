import { DoculispApi } from '../src/index';

describe('Simple Doculisp API', () => {
    let api: DoculispApi;

    beforeAll(async () => {
        api = await DoculispApi.create();
    });

    describe('API Initialization', () => {
        it('API instance creates successfully', async () => {
            expect(api).toBeDefined();
        });
    });

    describe('Component Access', () => {
        it('utility methods access provides functionality', () => {
            const util = api.getUtil();
            expect(util).toBeDefined();
            expect(typeof util.ok).toBe('function');
            expect(typeof util.fail).toBe('function');
        });

        it('path constructor access provides functionality', () => {
            const pathConstructor = api.getPathConstructor();
            expect(pathConstructor).toBeDefined();
            expect(typeof pathConstructor).toBe('function');
        });

        it('variable table factory access provides functionality', () => {
            const variableTable = api.createVariableTable();
            expect(variableTable).toBeDefined();
            expect(typeof variableTable.addValue).toBe('function');
        });

        it('AST builder access provides functionality', () => {
            const astBuilder = api.getAstBuilder();
            expect(astBuilder).toBeDefined();
            expect(typeof astBuilder.parse).toBe('function');
        });

        it('string writer access provides functionality', () => {
            const stringWriter = api.getStringWriter();
            expect(stringWriter).toBeDefined();
            expect(typeof stringWriter.writeAst).toBe('function');
        });
    });

    describe('Path Constructor Functionality', () => {
        it('path construction creates valid paths', () => {
            const pathConstructor = api.getPathConstructor();
            const testPath = pathConstructor('./test.md');
            
            expect(testPath).toBeDefined();
            expect(testPath.extension).toBe('.md');
            expect(testPath.fullName).toContain('test.md');
        });
    });

    describe('Util Functionality', () => {
        it('success result creation works correctly', () => {
            const util = api.getUtil();
            const result = util.ok('test value');
            
            expect(result.success).toBe(true);
            expect(result.value).toBe('test value');
        });

        it('failure result creation works correctly', () => {
            const util = api.getUtil();
            const result = util.fail('File Operations')('File System Error')('test error');
            
            expect(result.success).toBe(false);
            expect(result.message).toBe('test error');
        });
    });
});