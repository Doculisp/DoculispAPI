import { IAstEmpty, RootAst } from "./types.ast";
import { IPath } from "./types.filePath"
import { ILocation, IRange, Result } from "./types.general";
import { IVariableTable } from "./types.variableTable";

export interface IProjectDocument {
    id?: string | undefined
    sourcePath: IPath;
    destinationPath: IPath;
    location: ILocation;
    type: 'project-document';
    blockRange: IRange;
};

export interface IProjectDocuments {
    documents: IProjectDocument[];
    location: ILocation;
    type: 'project-documents';
    blockRange: IRange;
};

export interface IProjectParser {
    parse(tokenResults: Result<RootAst | IAstEmpty>, variableTable: IVariableTable): Result<IProjectDocuments>;
};