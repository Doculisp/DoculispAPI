import { configure } from "approvals/lib/config";
import { Options } from "approvals/lib/Core/Options";
import { getVerifiers, order } from "../tools";
import { IProjectLocation, ISuccess, IUtil } from "../../src/types/types.general";
import { Result } from "../../src/types/types.general";
import { buildProjectLocation, testable, buildPath } from "../testHelpers";
import { IFileHandler } from "../../src/types/types.fileHandler";
import { containerPromise } from "../../src/moduleLoader";
import { IVariableTestable } from "../../src/types/types.variableTable";
import { IPath } from "../../src/types/types.filePath";
import { ITestableContainer } from "../../src/types/types.containers";

describe('String Writer Real Write', () => {
    let verifyAsJson: (data: any, options?: Options) => void;
    let verifyMarkdown: (sut: any, options?: Options) => void;
    let verifyText: (text: string, options?: Options) => void;
    let toResult: (text: string, location: IProjectLocation) => Result<string> = null as any;
    let pathToResult: (sourcePath: IPath, outPutPath?: IPath | undefined) => Result<string>[] = null as any;
    let fileHandler: IFileHandler = null as any;
    let variableTable: IVariableTestable = undefined as any;

    let writeHolder: Result<string>[] = null as any;

    let workingDir: string = null as any;

    function verifyMarkdownResult(textMaybe: Result<string>, options?: Options): void {
        if(textMaybe.success) {
            verifyMarkdown(textMaybe.value, options);
        }
        else {
            verifyAsJson(textMaybe, options);
        }
    }

    function verifyAll(textMaybe: Result<string>[], options?: Options): void {
        let result = "";

        textMaybe.forEach(t => {
            if(0 < result.length)
                result += "\n\n";

            if(t.success)
                result += t.value;
            else
                result += JSON.stringify(order(t), undefined, 3);
        });

        if(0 === textMaybe.length) {
            result = "~Empty~";
        }

        verifyText(result);
    }

    beforeAll(() => {
        const verifiers =  getVerifiers(configure);
        verifyAsJson = verifiers.verifyAsJson;
        verifyMarkdown = verifiers.verifyMarkdown;
        verifyText = verifiers.verifyText;
    });

    function changeDir(sampleName: string): void {
        process.chdir(`./tests/Sample/${sampleName}`);
    }

    function setupOutPut(outPutFileName: string): void {
        variableTable.addValue(' destination', { type: 'variable-path', value: buildPath(`./${outPutFileName}`) });
    }

    function loadFile(filePath: string): ISuccess<string> {
        return fileHandler.load(buildPath(filePath)) as ISuccess<string>;
    }

    function buildEnvironment(environment: ITestableContainer) {
        writeHolder = [];
        const util: IUtil = environment.buildAs<IUtil>('util');
        variableTable = environment.buildAs<IVariableTestable>('variableTable');
        variableTable.addGlobalValue(' ID ', { type: 'variable-string', value: 'String Writer Test'});

        environment.replace({
            builder: () => variableTable,
            name: 'variableTable',
            singleton: true
        });

        fileHandler = environment.buildAs<IFileHandler>('fileHandler');
        const fakeFileHandler: IFileHandler = {
            load: function (path: IPath): Result<string> {
                return fileHandler.load(path);
            },
            write: function (path: IPath, text: Result<string>): Result<string> {
                writeHolder.push(text);
                return util.ok(path.fullName);
            },
            getProcessWorkingDirectory: function (): Result<IPath> {
                return fileHandler.getProcessWorkingDirectory();
            },
            setProcessWorkingDirectory: function (directory: IPath): Result<undefined> {
                return fileHandler.setProcessWorkingDirectory(directory);
            }
        };

        environment.replaceValue(fakeFileHandler, 'fileHandler');
    }

    beforeEach(async () => {
        workingDir = process.cwd();
        const container = await containerPromise;
        const chain = testable.advanced.chainSetup(container, buildEnvironment);
        toResult = chain(testable.stringWriter.resultBuilder);
        pathToResult = chain(testable.stringWriter.pathCompileResultBuilder);
    });

    afterEach(() => {
        process.chdir(workingDir);
    });
    
    describe('Error Handling', () => {
        beforeEach(() => {
            changeDir('simpleBadLink');
            setupOutPut('readme.md');
        });

        it('bad link references produce error result', () => {
            const filePath = './_main.dlisp';
            const doc: Result<string> = loadFile(filePath);

            if(!doc.success) {
                expect(JSON.stringify(doc, null, 4)).toBe('');
            }

            const result = toResult(doc.value, buildProjectLocation(filePath, 1, 1));
            verifyMarkdownResult(result);
        });
    });

    describe('Cross Reference Processing', () => {
        beforeEach(() => {
            changeDir('project');
        });

        it('document cross references resolve paths correctly', () => {
            const filePath = './project.dlproj';
            
            const results = pathToResult(buildProjectLocation(filePath, 1, 1).documentPath);

            writeHolder.forEach(h => results.push(h));
            verifyAll(results);
        });
    });

    describe('Documentation Writing', () => {
        beforeEach(() => {
            changeDir('complex');
            setupOutPut('readme.md');
        });

        it('structure documentation renders correctly', () => {
            const filePath = './lang/structure.md';
            const doc: Result<string> = loadFile(filePath);

            if(!doc.success) {
                expect(JSON.stringify(doc, null, 4)).toBe('');
            }

            const result = toResult(doc.value, buildProjectLocation(filePath, 1, 1));
            verifyMarkdownResult(result);
        });

        it('doculisp documentation renders correctly', () => {
            const filePath = './lang/doculisp.md';
            const doc: Result<string> = loadFile(filePath);

            if(!doc.success) {
                expect(JSON.stringify(doc, null, 4)).toBe('');
            }

            const result = toResult(doc.value, buildProjectLocation(filePath, 1, 1));
            verifyMarkdownResult(result);
        });

        it('section-meta documentation renders correctly', () => {
            process.chdir('./lang/section-meta');
            const filePath = './_main.md';
            const doc: Result<string> = loadFile(filePath);

            if(!doc.success) {
                expect(JSON.stringify(doc, null, 4)).toBe('');
            }

            const result = toResult(doc.value, buildProjectLocation(filePath, 1, 1));
            verifyMarkdownResult(result);
        });

        it('content documentation renders correctly', () => {
            const filePath = './lang/content.md';
            const doc: Result<string> = loadFile(filePath);

            if(!doc.success) {
                expect(JSON.stringify(doc, null, 4)).toBe('');
            }

            const result = toResult(doc.value, buildProjectLocation(filePath, 1, 1));
            verifyMarkdownResult(result);
        });

        it('headings documentation renders correctly', () => {
            const filePath = './lang/headings.md';
            const doc: Result<string> = loadFile(filePath);

            if(!doc.success) {
                expect(JSON.stringify(doc, null, 4)).toBe('');
            }

            const result = toResult(doc.value, buildProjectLocation(filePath, 1, 1));
            verifyMarkdownResult(result);
        });

        it('comment documentation renders correctly', () => {
            const filePath = './lang/comment.md';
            const doc: Result<string> = loadFile(filePath);

            if(!doc.success) {
                expect(JSON.stringify(doc, null, 4)).toBe('');
            }

            const result = toResult(doc.value, buildProjectLocation(filePath, 1, 1));
            verifyMarkdownResult(result);
        });

        it('keywords documentation renders correctly', () => {
            const filePath = './lang/keywords.md';
            const doc: Result<string> = loadFile(filePath);

            if(!doc.success) {
                expect(JSON.stringify(doc, null, 4)).toBe('');
            }

            const result = toResult(doc.value, buildProjectLocation(filePath, 1, 1));
            verifyMarkdownResult(result);
        });

        it('complete documentation renders correctly', () => {
            const filePath = './_main.md';
            const doc: Result<string> = loadFile(filePath);

            if(!doc.success) {
                expect(JSON.stringify(doc, null, 4)).toBe('');
            }

            const result = toResult(doc.value, buildProjectLocation(filePath, 1, 1));
            verifyMarkdownResult(result);
        });
    });
});
