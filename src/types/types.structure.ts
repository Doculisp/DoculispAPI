export interface IValidateSubItem {
    isValidSubIdentifier(name: string): boolean;
    getStructureForSubIdentifier(name: string): IStructure | false;
    getMandatorySubIdentifiers(): IStructure[];
}

export interface IStructure {
    hasParameter: true | false | 'maybe';
    hasSubIdentifier: false | IValidateSubItem;
    mandatory?: true;
    type: 'comment' | 'section' | 'include' | 'ref-link' | 'subtitle' | 'title' | 'section-meta' | 'toc' | 'content' | 'header';
};

export interface IRootStructure {
    hasParameter: false;
    SubIdentifiers: IValidateSubItem;
    type: 'dl';
};