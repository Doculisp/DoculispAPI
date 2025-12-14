import { IPath } from "./types.filePath";

export type IsBefore = -1
export type IsSame = 0
export type IsAfter = 1;
export type IsOrder = IsBefore | IsSame | IsAfter;

export const isBefore: IsBefore = -1;
export const isSame: IsSame = 0;
export const isAfter: IsAfter = 1;

export interface IComparable<T> {
    compare(other: T) : IsOrder
};

export interface IProjectLocation {
    readonly documentPath: IPath;
    readonly documentDepth: number;
    readonly documentIndex: number;
}

export interface ILocationCoordinates extends IProjectLocation {
    readonly line: number;
    readonly char: number;
}

export interface ILocation extends IProjectLocation, ILocationCoordinates, IComparable<ILocation> {
    increaseLine(by?: number|undefined): ILocation;
    increaseChar(by?: number|undefined): ILocation;
};

export interface IRange {
    readonly start: ILocationCoordinates;
    readonly end: ILocationCoordinates;
}

export interface ISuccess<T> {
    readonly value: T;
    readonly success: true;
};

export type FailureCategory = 
    | 'Parse Error'
    | 'Validation Error'
    | 'File System Error'
    | 'Include Error';

export type ProcessingStep = 
    | 'Document Parsing'
    | 'Tokenization'
    | 'AST Parsing'
    | 'Doculisp AST Parsing'
    | 'Project AST Parsing'
    | 'Include Processing'
    | 'Building Document'
    | 'File Operations'
    | 'Package Information Retrieval'
    | 'Input Validation';

export interface IFail {
    readonly message: string;
    readonly documentPath?: IPath | undefined;
    readonly success: false;
    readonly failureCategory: FailureCategory;
    readonly processingStep: ProcessingStep;
};

export type Result<T> = ISuccess<T> | IFail;

export type LocationBuilder = (line: number, char: number) => ILocation;

export type UtilBuilder = () => IUtil;

export interface IUtil {
    ok<T>(successfulValue: T): ISuccess<T>;
    fail(step: ProcessingStep) : (category: FailureCategory) => (message: string, documentPath?: IPath) => IFail;
    location: (documentPath: IPath, documentDepth: number, documentIndex: number, line: number, char: number) => ILocation;
    toLocation: (projectLocation: IProjectLocation, line: number, char: number) => ILocation;
    getProjectLocation: (location: ILocation) => IProjectLocation;
}