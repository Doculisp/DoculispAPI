import { DoculispApi } from '../src/index';

describe('Simple Doculisp API', () => {
    let api: DoculispApi;

    beforeAll(async () => {
        api = await DoculispApi.create();
    });

    describe('API initialization', () => {
        it('should create API instance successfully', async () => {
            expect(api).toBeDefined();
        });

        it('should provide access to utility methods', () => {
            const util = api.getUtil();
            expect(util).toBeDefined();
            expect(typeof util.ok).toBe('function');
            expect(typeof util.fail).toBe('function');
        });

        it('should provide access to path constructor', () => {
            const pathConstructor = api.getPathConstructor();
            expect(pathConstructor).toBeDefined();
            expect(typeof pathConstructor).toBe('function');
        });

        it('should provide access to variable table factory', () => {
            const variableTable = api.createVariableTable();
            expect(variableTable).toBeDefined();
            expect(typeof variableTable.addValue).toBe('function');
        });

        it('should provide access to AST builder', () => {
            const astBuilder = api.getAstBuilder();
            expect(astBuilder).toBeDefined();
            expect(typeof astBuilder.parse).toBe('function');
        });

        it('should provide access to string writer', () => {
            const stringWriter = api.getStringWriter();
            expect(stringWriter).toBeDefined();
            expect(typeof stringWriter.writeAst).toBe('function');
        });
    });

    describe('path constructor functionality', () => {
        it('should construct paths correctly', () => {
            const pathConstructor = api.getPathConstructor();
            const testPath = pathConstructor('./test.md');
            
            expect(testPath).toBeDefined();
            expect(testPath.extension).toBe('.md');
            expect(testPath.fullName).toContain('test.md');
        });
    });

    describe('util functionality', () => {
        it('should create success results', () => {
            const util = api.getUtil();
            const result = util.ok('test value');
            
            expect(result.success).toBe(true);
            expect(result.value).toBe('test value');
        });

        it('should create failure results', () => {
            const util = api.getUtil();
            const result = util.fail('test error');
            
            expect(result.success).toBe(false);
            expect(result.message).toBe('test error');
        });
    });
});