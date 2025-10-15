import { containerPromise } from "../../src/moduleLoader";
import { ITestableContainer } from "../../src/types/types.containers";
import { IFileHandler } from "../../src/types/types.fileHandler";
import { IFail } from "../../src/types/types.general";
import { IPath } from "../../src/types/types.filePath";

describe('fileHandler error messages', () => {
    let testable: ITestableContainer = null as any;
    let fileHandler: IFileHandler = null as any;

    beforeEach(async () => {
        const container = await containerPromise;
        testable = container.buildTestable();
        
        // Create a fake path constructor that returns predictable paths
        const fakePathConstructor = (pathString: string): IPath => ({
            fullName: pathString,
            extension: pathString.includes('.') ? pathString.substring(pathString.lastIndexOf('.')) : false,
            getContainingDir: () => fakePathConstructor(pathString.substring(0, pathString.lastIndexOf('/'))),
            getRelativeFrom: () => pathString,
            type: 'path' as const,
            toJSON: () => ({ fullName: pathString })
        });
        
        testable.replaceValue(fakePathConstructor, 'pathConstructor');
        fileHandler = testable.buildAs<IFileHandler>('fileHandler');
    });

    describe('load method', () => {
        it('should provide clear error message when file does not exist', () => {
            const fakePath: IPath = {
                fullName: '/nonexistent/file.txt',
                extension: '.txt',
                getContainingDir: () => fakePath,
                getRelativeFrom: () => '/nonexistent/file.txt',
                type: 'path' as const,
                toJSON: () => ({ fullName: '/nonexistent/file.txt' })
            };
            const result = fileHandler.load(fakePath);
            expect(result.success).toBe(false);
            const failResult = result as IFail;
            expect(failResult.message).toMatch(/^File load failed:/);
            expect(failResult.message).toContain('/nonexistent/file.txt');
        });
    });

    describe('write method', () => {
        it('should provide clear error message when write fails', () => {
            // Mock fs to throw an error on writeFileSync
            const mockFs = {
                writeFileSync: jest.fn(() => {
                    throw new Error('Permission denied');
                })
            };
            testable.replaceValue(mockFs, 'fs');
            const testFileHandler = testable.buildAs<IFileHandler>('fileHandler');
            const fakePath: IPath = {
                fullName: '/readonly/file.txt',
                extension: '.txt',
                getContainingDir: () => fakePath,
                getRelativeFrom: () => '/readonly/file.txt',
                type: 'path' as const,
                toJSON: () => ({ fullName: '/readonly/file.txt' })
            };
            const textResult = { success: true, value: 'test content' } as any;
            const result = testFileHandler.write(fakePath, textResult);
            expect(result.success).toBe(false);
            const failResult = result as IFail;
            expect(failResult.message).toMatch(/^File write failed:/);
            expect(failResult.message).toContain('/readonly/file.txt');
        });
    });

    describe('getProcessWorkingDirectory method', () => {
        it('should provide clear error message when getting working directory fails', () => {
            const originalCwd = process.cwd;
            process.cwd = jest.fn(() => {
                throw new Error('Access denied');
            });
            try {
                const result = fileHandler.getProcessWorkingDirectory();
                expect(result.success).toBe(false);
                const failResult = result as IFail;
                expect(failResult.message).toMatch(/^Working directory access failed:/);
            } finally {
                process.cwd = originalCwd;
            }
        });
    });

    describe('setProcessWorkingDirectory method', () => {
        it('should provide clear error message when setting working directory fails', () => {
            const fakePath: IPath = {
                fullName: '/nonexistent/directory',
                extension: false,
                getContainingDir: () => fakePath,
                getRelativeFrom: () => '/nonexistent/directory',
                type: 'path' as const,
                toJSON: () => ({ fullName: '/nonexistent/directory' })
            };
            const result = fileHandler.setProcessWorkingDirectory(fakePath);
            expect(result.success).toBe(false);
            const failResult = result as IFail;
            expect(failResult.message).toMatch(/^Working directory change failed:/);
            expect(failResult.message).toContain('/nonexistent/directory');
        });
    });
});