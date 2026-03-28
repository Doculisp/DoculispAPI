import { containerPromise } from "../../../src/moduleLoader";
import { configure } from "approvals/lib/config";
import { Options } from "approvals/lib/Core/Options";
import { getVerifiers } from "../../tools";
import { buildPath, buildProjectLocation, testable } from "../../testHelpers";
import { IProjectDocuments, IProjectParser } from "../../../src/types/types.astProject";
import { IProjectLocation, IUtil, Result } from "../../../src/types/types.general";
import { IVariableTable } from "../../../src/types/types.variableTable";

/**
 * Test suite for Project AST Parser functionality.
 * Tests the parsing of .dlproj project files that define batch document compilation configurations.
 * Covers basic project structure validation, document parsing, and identified document processing.
 */
describe('Project AST Parser', () => {
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

    /**
     * Tests for basic project structure validation and parsing.
     * Covers empty input handling, error propagation, and structure validation.
     */
    describe('Basic Project Structure', () => {
        /**
         * Tests handling of empty or minimal project input scenarios.
         */
        describe('Empty Input Handling', () => {
            it('empty project file produces empty project', () => {
                const result = resultBuilder('', buildProjectLocation('./test.dlproj'));

                verifyWithGiven(result, undefined, '');
            });

            it('empty documents block produces empty documents', () => {
                const text = '(documents)';
                const result = resultBuilder(text, buildProjectLocation('./test.dlproj'));

                verifyWithGiven(result, undefined, text);
            });
        });

        /**
         * Tests that parsing errors are properly propagated through the system.
         */
        describe('Error Propagation', () => {
            it('failed input parsing propagates error', () => {
                const tokenResults = util.fail('Project AST Parsing')('Parse Error')('No good.', undefined);
                const result = parser.parse(tokenResults, variableTable);

                expect(result).toBe(tokenResults);
            });
        });

        /**
         * Tests validation of project file structure and syntax rules.
         */
        describe('Structure Validation', () => {
            it('duplicate documents blocks produce error', () => {
                const project = `
(documents)
(documents)
`;

                const result = resultBuilder(project, buildProjectLocation('./myBad.dlproj'));

                verifyAsJson(result);
            });
        });
    });

    /**
     * Tests for parsing and processing document structures within project files.
     * Covers single documents, multiple documents, and document validation.
     */
    describe('Document Structure Processing', () => {
        /**
         * Tests parsing of single document configurations.
         */
        describe('Single Document', () => {
            it('source and output block creates document', () => {
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
        });

        /**
         * Tests parsing of multiple document configurations in a single project.
         */
        describe('Multiple Documents', () => {
            it('two documents create ordered document list', () => {
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
        });

        /**
         * Tests validation of required document fields and structure.
         */
        describe('Document Validation', () => {
            it('missing source block produces error', () => {
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

            it('missing output block produces error', () => {
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
    });

    /**
     * Tests for processing documents with custom identifiers.
     * Covers basic ID documents, validation, format checking, and error handling.
     */
    describe('Identified Document Processing', () => {
        /**
         * Tests basic parsing of documents with custom identifiers.
         */
        describe('Basic ID Documents', () => {
            it('single document with id creates identified document', () => {
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
            
            it('two identified documents create document list', () => {
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
            
            it('mixed identified and simple documents work together', () => {
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
        });

        /**
         * Tests validation rules for documents with identifiers.
         */
        describe('ID Document Validation', () => {
            it('missing source in identified document produces error', () => {
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
            
            it('missing output in identified document produces error', () => {
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
            
            it('duplicate document ids produce error', () => {
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
        });

        /**
         * Tests validation of identifier format rules and character restrictions.
         */
        describe('ID Format Validation', () => {
            it('capitalized document id produces error', () => {
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

            it('symbol in document id produces error', () => {
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
        });

        /**
         * Tests comprehensive error handling for various malformed document structures.
         */
        describe('Structure Error Handling', () => {
            it('unknown identifier in documents block produces error', () => {
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

            it('unknown identifier in document produces error', () => {
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

            it('duplicate source blocks produce error', () => {
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

            it('duplicate output blocks produce error', () => {
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

            it('unknown block in document produces error', () => {
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

            it('empty document block produces error', () => {
                const project = `
(documents
    (document
    )
)
`;
                const result = resultBuilder(project, buildProjectLocation('./malformed.dlproj'));
                verifyAsJson(result);
            });

            it('duplicate unknown blocks produce error', () => {
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

            it('unknown top level identifier produces error', () => {
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
});