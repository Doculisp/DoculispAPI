import path from 'path';
import { DoculispApi } from '../src/index';

// Test API functionality 
describe('Doculisp API', () => {
    let api: DoculispApi;
    const testProjectFile = path.resolve('./documentation/doculisp.dlproj');

    beforeEach(async () => {
        [, api] = await DoculispApi.createTestable();
    });

    describe('testFile method', () => {
        it('should handle .dlproj files without throwing Unknown atom errors', async () => {
            const result = await api.testFile(testProjectFile);
            
            // Should be an array of results
            expect(Array.isArray(result)).toBe(true);
            
            // Should have at least one result
            expect(result.length).toBeGreaterThan(0);
            
            // All results should be successful
            result.forEach(r => {
                expect(r.success).toBe(true);
            });
        });

        it('should validate file extensions', async () => {
            const invalidFile = './some-invalid-file.txt';
            
            try {
                await api.testFile(invalidFile);
            } catch (error) {
                // Should throw an error for invalid file extension
                expect((error as Error).message).toContain('extension');
            }
        });

        it('should return validation results for .dlproj files', async () => {
            const result = await api.testFile(testProjectFile);
            
            // Should return successful results
            expect(result.length).toBeGreaterThan(0);
            result.forEach(r => {
                expect(r.success).toBe(true);
                if (r.success && typeof r.value === 'string') {
                    expect(r.value).toContain('valid.');
                }
            });
        });
    });

    describe('compileFile method', () => {
        it('should handle .dlproj files successfully', async () => {
            const result = await api.compileFile(testProjectFile);
            
            // Should be an array of results
            expect(Array.isArray(result)).toBe(true);
            
            // Should have at least one result
            expect(result.length).toBeGreaterThan(0);
            
            // All results should be successful
            result.forEach(r => {
                expect(r.success).toBe(true);
            });
        });
    });

    describe('utility methods', () => {
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

        it('should provide access to variable table factory', () => {
            const variableTable = api.createVariableTable();
            expect(variableTable).toBeDefined();
            expect(typeof variableTable.addValue).toBe('function');
        });

        it('should provide access to path constructor', () => {
            const pathConstructor = api.getPathConstructor();
            expect(pathConstructor).toBeDefined();
            expect(typeof pathConstructor).toBe('function');
        });

        it('should provide access to util functions', () => {
            const util = api.getUtil();
            expect(util).toBeDefined();
            expect(typeof util.ok).toBe('function');
            expect(typeof util.fail).toBe('function');
        });
    });
});