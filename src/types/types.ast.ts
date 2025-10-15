import { ILocation, IProjectLocation, Result } from "./types.general";
import { TokenizedDocument } from "./types.tokens";

export interface IAstIdentifier {
    readonly value: string;
    readonly location: ILocation;
    readonly type: 'ast-identifier';
};

export interface IAstParameter {
    readonly value: string;
    readonly location: ILocation;
    readonly type: 'ast-Parameter'
}

export interface IAstCommand {
    readonly value: string;
    readonly location: ILocation;
    readonly parameter: IAstParameter;
    readonly type: 'ast-command'
};

export interface IAstContainer {
    readonly value: string;
    readonly location: ILocation;
    readonly subStructure: IdentifierAst[]
    readonly type: 'ast-container'
};

export interface IAstValue {
    readonly value: string;
    readonly location: ILocation;
    readonly type: 'ast-value';
};

export interface IAstEmpty {
    readonly location: IProjectLocation;
    readonly type: 'ast-Empty';
}

export type IdentifierAst = IAstCommand | IAstContainer | IAstIdentifier;
export type CoreAst = IAstValue | IdentifierAst;
export type Ast = CoreAst | IAstParameter;

export type RootAst = {
    readonly ast: CoreAst[],
    readonly location: IProjectLocation;
    readonly type: 'RootAst',
}

export interface IAstParser {
    parse(tokens: Result<TokenizedDocument>): Result<RootAst | IAstEmpty>;
}