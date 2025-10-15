import { IRegisterable } from "../types/types.containers";
import { IRootStructure, IStructure } from "../types/types.structure";

function buildStructure(): IRootStructure {
    const commentBlock: IStructure = {
        hasParameter: 'maybe',
        hasSubIdentifier: {
            getStructureForSubIdentifier(_name) { return commentBlock; },
            isValidSubIdentifier(_name) { return true; },
            getMandatorySubIdentifiers() { return []; }
        },
        type: 'comment',
    }

    const sectionBlock: IStructure = {
        hasParameter: true,
        hasSubIdentifier: false,
        type: 'section',
    };

    const includeBlock: IStructure = {
        hasParameter: false,
        hasSubIdentifier: {
            isValidSubIdentifier(_name: string) {
                return true;
            },
            getStructureForSubIdentifier(name: string) {
                if(name.startsWith('*')) {
                    return commentBlock;
                }

                return sectionBlock;
            },
            getMandatorySubIdentifiers() { return []; },
        },
        type: 'include',
    };

    const refLinkBlock: IStructure = {
        hasParameter: true,
        hasSubIdentifier: false,
        type: 'ref-link',
    }

    const subtitleBlock: IStructure = {
        hasParameter: true,
        hasSubIdentifier: false,
        type: 'subtitle',
    }

    const titleBlock: IStructure = {
        hasParameter: true,
        hasSubIdentifier: false,
        mandatory: true,
        type: 'title',
    }

    const sectionMetaBlock: IStructure = {
        hasParameter: false,
        hasSubIdentifier: {
            getMandatorySubIdentifiers() {
                return [ titleBlock ];
            },
            getStructureForSubIdentifier(name) {
                switch (name) {
                    case 'title':
                        return titleBlock;

                    case 'subtitle':
                        return subtitleBlock;

                    case 'ref-link':
                        return refLinkBlock;

                    case 'include':
                        return includeBlock;
                
                    default:
                        if(name.startsWith('*')) {
                            return commentBlock;
                        }

                        return false;
                }
            },
            isValidSubIdentifier(name) {
                return (
                    [
                        'title',
                        'subtitle',
                        'ref-link',
                        'include'
                    ].includes(name)
                    || name.startsWith('*')
                );
            },
        },
        type: 'section-meta',
    }

    const tocBlock: IStructure = {
        hasParameter: true,
        hasSubIdentifier: false,
        type: 'toc',
    }

    const contentBlock: IStructure = {
        hasParameter: false,
        hasSubIdentifier: {
            getMandatorySubIdentifiers() { return []; },
            getStructureForSubIdentifier(name) {
                if (name === 'toc') {
                    return tocBlock;
                }

                if (name.startsWith('*')) {
                    return commentBlock;
                }

                return false;
            },
            isValidSubIdentifier(name) {
                return (
                    [
                        'toc'
                    ].includes(name)
                    || name.startsWith('*')
                );
            },
        },
        type: 'content',
    }

    const headerBlock: IStructure = {
        hasParameter: true,
        hasSubIdentifier: false,
        type: 'header',
    }

    const doculispBlock: IRootStructure = {
        hasParameter: false,
        SubIdentifiers: {
            getMandatorySubIdentifiers() { return []; },
            getStructureForSubIdentifier(name) {
                if(name.startsWith('*')) {
                    return commentBlock;
                }

                if(name.replaceAll('#', '').length === 0) {
                    return headerBlock;
                }

                if(name === 'content') {
                    return contentBlock;
                }

                if(name === 'section-meta') {
                    return sectionMetaBlock;
                }

                return false;
            },
            isValidSubIdentifier(name) {
                return (
                    name.startsWith('*')
                    || name.replaceAll('#', '').length === 0
                    || name === 'content'
                    || name === 'section-meta'
                );
            },
        },
        type: 'dl',
    }

    return doculispBlock;
}

const structureLoader: IRegisterable = {
    builder: () => buildStructure(),
    name: 'structure',
    dependencies: [],
    singleton: true
};

export {
    structureLoader,
};