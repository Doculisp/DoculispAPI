import { containerPromise } from "../../../src/moduleLoader";
import { configure } from "approvals/lib/config";
import { Options } from "approvals/lib/Core/Options";
import { getVerifiers } from "../../tools";
import { buildPath, buildProjectLocation, testable } from "../../testHelpers";
import { IProjectDocuments, IProjectParser } from "../../../src/types/types.astProject";
import { IProjectLocation, IUtil, Result } from "../../../src/types/types.general";
import { IVariableTable } from "../../../src/types/types.variableTable";

describe('astProject', () => {
    let resultBuilder: (text: string, projectLocation: IProjectLocation) => Result<IProjectDocuments>;
    let verifyAsJson: (data: any, options?: Options) => void;
    let verifyWithGiven: (data: any, options?: any, ...given: any[]) => void;
    let parser: IProjectParser;
    let util: IUtil;
    let variableTable: IVariableTable = null as any;

    beforeAll(() => {
        let verifiers = getVerifiers(configure);
        verifyAsJson = verifiers.verifyAsJson;
        verifyWithGiven = verifiers.verifyWithGiven;
    });

    beforeEach(async () => {
        let container = await containerPromise;
        resultBuilder = testable.project.resultBuilder(container, environment => {
            environment.replaceValue(buildPath, 'pathConstructor');
        });

        parser = testable.project.parseBuilder(container, environment => {
            util = environment.buildAs<IUtil>('util');
            variableTable = environment.buildAs<IVariableTable>('variableTable').createChild();
        });
    });

    it('should handle an empty project file', () => {
        const result = resultBuilder('', buildProjectLocation('./test.dlproj'));

        verifyWithGiven(result, undefined, '');
    });

    it('should handle an empty documents block', () => {
        const text = '(documents)';
        const result = resultBuilder(text, buildProjectLocation('./test.dlproj'));

        verifyWithGiven(result, undefined, text);
    });

    it('should return an error when given an error', () => {
        const tokenResults = util.fail('No good.');
        const result = parser.parse(tokenResults, variableTable);

        expect(result).toBe(tokenResults);
    });

    it('should enforce only a single documents block', () => {
        const project = `
(documents)
(documents)
`;

        const result = resultBuilder(project, buildProjectLocation('./myBad.dlproj'));

        verifyAsJson(result);
    });

    describe('basic project documents', () => {
        it('should parse a single document', () => {
            const project = `
(documents
    (document
        (source ./myReadme.md)
        (output ./README.md)
    )
)
`;
            const result = resultBuilder(project, buildProjectLocation('./myProject.dlproj'));

            verifyWithGiven(result, undefined, project);
        });
        
        it('should parse a two document', () => {
            const project = `
(documents
    (document
        (source ./myReadme.md)
        (output ./README.md)
    )
    (document
        (source ./howTo.md)
        (output ./contrib.md)
    )
)
`;
            const result = resultBuilder(project, buildProjectLocation('./myProject.dlproj'));

            verifyWithGiven(result, undefined, project);
        });

        it('should fail if document block is missing the source block', () => {
            const project = `
(documents
    (document
        (output ./README.md)
    )
)
`;

            const result = resultBuilder(project, buildProjectLocation('./project.dlproj'));

            verifyAsJson(result);
        });

        it('should fail if document block is missing the output block', () => {
            const project = `
(documents
    (document
        (source ./myReadme.md)
    )
)
`;

            const result = resultBuilder(project, buildProjectLocation('./project.dlproj'));

            verifyAsJson(result);
        });
    });

    describe('id project documents', () => {
        it('should parse a single document', () => {
            const project = `
(documents
    (document
        (readmeβ
            (source ./_main.dlisp)
            (output ../README.md)
        )
    )
)
`;

            const result = resultBuilder(project, buildProjectLocation('/docs.dlproj'));

            verifyWithGiven(result, undefined, project);
        });
        
        it('should parse a two documents', () => {
            const project = `
(documents
    (document
        (readme
            (source ./_main.dlisp)
            (output ../README.md)
        )
    )
    (document
        (contrib
            (source ./contrib/_main.dlisp)
            (output ../contrib.md)
        )
    )
)
`;

            const result = resultBuilder(project, buildProjectLocation('/docs.dlproj'));

            verifyWithGiven(result, undefined, project);
        });
        
        it('should parse a two documents one simple', () => {
            const project = `
(documents
    (document
        (readme
            (source ./_main.dlisp)
            (output ../README.md)
        )
    )
    (document
        (source ./contrib/_main.dlisp)
        (output ../contrib.md)
    )
)
`;

            const result = resultBuilder(project, buildProjectLocation('/docs.dlproj'));

            verifyWithGiven(result, undefined, project);
        });
        
        it('should fail if missing source', () => {
            const project = `
(documents
    (document
        (readme
            (output ../README.md)
        )
    )
)
`;

            const result = resultBuilder(project, buildProjectLocation('/docs.dlproj'));

            verifyAsJson(result);
        });
        
        it('should fail if missing output', () => {
            const project = `
(documents
    (document
        (readme
            (source ./_main.dlisp)
        )
    )
)
`;

            const result = resultBuilder(project, buildProjectLocation('/docs.dlproj'));

            verifyAsJson(result);
        });
        
        it('should fail if identifier is not unique', () => {
            const project = `
(documents
    (document
        (readme
            (source ./_main.dlisp)
            (output ../README.md)
        )
    )
    (document
        (readme
            (source ./contrib/_main.dlisp)
            (output ../contrib.md)
        )
    )
)
`;

            const result = resultBuilder(project, buildProjectLocation('/docs.dlproj'));

            verifyAsJson(result);
        });

        it('should not parse a document with a capitalized id', () => {
            const project = `
(documents
    (document
        (Readme
            (source ./_main.dlisp)
            (output ../README.md)
        )
    )
)
`;
            const result = resultBuilder(project, buildProjectLocation('/docs.dlproj'));
            verifyAsJson(result);
        });

        it('should not parse a document with an id that contains a symbol', () => {
            const project = `
(documents
    (document
        (readmeϐ
            (source ./_main.dlisp)
            (output ../README.md)
        )
    )
)
`;
            const result = resultBuilder(project, buildProjectLocation('/docs.dlproj'));
            verifyAsJson(result);
        });

        it('should fail when documents block contains unknown identifier', () => {
            const project = `
(documents
    (document
        (source ./readme.md)
        (output ./README.md)
    )
    (unknownIdentifier some-value)
)
`;
            const result = resultBuilder(project, buildProjectLocation('./malformed.dlproj'));
            verifyAsJson(result);
        });

        it('should fail when document structure contains unknown identifier', () => {
            const project = `
(documents
    (document
        (source ./readme.md)
        (output ./README.md)
        (unknownBlock some-parameter)
    )
)
`;
            const result = resultBuilder(project, buildProjectLocation('./malformed.dlproj'));
            verifyAsJson(result);
        });

        it('should fail when document has duplicate source blocks', () => {
            const project = `
(documents
    (document
        (source ./readme.md)
        (source ./another-readme.md)
        (output ./README.md)
    )
)
`;
            const result = resultBuilder(project, buildProjectLocation('./malformed.dlproj'));
            verifyAsJson(result);
        });

        it('should fail when document has duplicate output blocks', () => {
            const project = `
(documents
    (document
        (source ./readme.md)
        (output ./README.md)
        (output ./ANOTHER-README.md)
    )
)
`;
            const result = resultBuilder(project, buildProjectLocation('./malformed.dlproj'));
            verifyAsJson(result);
        });

        it('should fail when document block contains unknown block', () => {
            const project = `
(documents
    (document
        (source ./readme.md)
        (output ./README.md)
        (unknownBlock ./something)
    )
)
`;
            const result = resultBuilder(project, buildProjectLocation('./malformed.dlproj'));
            verifyAsJson(result);
        });

        it('should fail when document block does not contain source or output', () => {
            const project = `
(documents
    (document
    )
)
`;
            const result = resultBuilder(project, buildProjectLocation('./malformed.dlproj'));
            verifyAsJson(result);
        });

        it('should fail when document has duplicate unknown blocks', () => {
            const project = `
(documents
    (document
        (source ./readme.md)
        (source ./readme.md)
        (output ./README.md)
    )
)
`;
            const result = resultBuilder(project, buildProjectLocation('./malformed.dlproj'));
            verifyAsJson(result);
        });

        it('should fail when project contains unknown top-level identifier', () => {
            const project = `
(documents
    (document
        (source ./readme.md)
        (output ./README.md)
    )
)
(unknownTopLevel ./something)
`;
            const result = resultBuilder(project, buildProjectLocation('./malformed.dlproj'));
            verifyAsJson(result);
        });
    });
});