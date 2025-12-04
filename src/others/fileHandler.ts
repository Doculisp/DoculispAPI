import { IRegisterable } from "../types/types.containers";
import { IFileHandler } from "../types/types.fileHandler";
import { IPath, PathConstructor } from "../types/types.filePath";
import { Result, UtilBuilder } from "../types/types.general";

function buildLoader(utilBuilder: UtilBuilder, fs: any, pathConstructor: PathConstructor): IFileHandler {

    const util = utilBuilder();
    const failureBuilder = util.failAlt('File Operations');

    function load(filePath: IPath): Result<string> {
        try {
            const value: string = fs.readFileSync(filePath.fullName, {encoding: 'utf8'});
            return util.ok(value);
        } catch (error) {
            const msg = (error && (error as any).message) ? (error as any).message : String(error);
            return failureBuilder(`File load failed: ${msg} (Path: ${filePath.fullName}).`, 'File System Error', filePath);
        }
    }

    function write(filePath: IPath, text: Result<string>): Result<string> {
        if(!text.success) {
            return text;
        }

        const output = text.value;

        try {
            fs.writeFileSync(filePath.fullName, output, {encoding: 'utf8'});
            return text;
        }
        catch(error) {
            const msg = (error && (error as any).message) ? (error as any).message : String(error);
            return failureBuilder(`File write failed: ${msg} (Path: ${filePath.fullName}).`, 'File System Error', filePath);
        }
    }

    function getProcessWorkingDirectory(): Result<IPath> {
        try {
            return util.ok(pathConstructor(process.cwd()));
        } catch (error) {
            const msg = (error && (error as any).message) ? (error as any).message : String(error);
            return failureBuilder(`Working directory access failed: ${msg}.`, 'File System Error');
        }
    }

    function setProcessWorkingDirectory(directory: IPath): Result<undefined> {
        try {
            process.chdir(directory.fullName);
            return util.ok(undefined);
        } catch(error) {
            const msg = (error && (error as any).message) ? (error as any).message : String(error);
            return failureBuilder(`Working directory change failed: ${msg} (Path: ${directory.fullName}).`, 'File System Error', directory);
        }
    }

    return {
        load,
        write,
        getProcessWorkingDirectory,
        setProcessWorkingDirectory,
    };
}

const loader: IRegisterable = {
    builder: (utilBuilder: UtilBuilder, fs: any, pathConstructor: PathConstructor) => buildLoader(utilBuilder, fs, pathConstructor),
    name: 'fileHandler',
    dependencies: ['utilBuilder', 'fs', 'pathConstructor'],
    singleton: true
};

export {
    loader,
};