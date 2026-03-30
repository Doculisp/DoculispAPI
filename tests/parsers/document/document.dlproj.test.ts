import { containerPromise } from "../../../src/moduleLoader";
import { getJestVerifiers } from "../../tools";
import { DocumentParser } from "../../../src/types/types.document";
import { buildProjectLocation, testable } from "../../testHelpers";
import { IContainer } from "../../../src/types/types.containers";

// Test Fixtures
const PROJECT_FILE_FIXTURES = {
    singleDocument: `
(documents
    (document
        (source C:/main.dlisp)
        (output ./project.md)
    )
)
`,
};

/**
 * Tests for parsing .dlproj project files that define batch compilation configurations.
 * These files specify multiple documents to be compiled together as a project.
 */
describe('Document Project File Parser', () => {
    let container: IContainer = null as any;
    let parse: DocumentParser = undefined as any;
    const { verifyAsJson } = getJestVerifiers();

    beforeEach(async () => {
        container = await containerPromise;
        parse = testable.document.resultBuilder(container);
    });

    // Test constants for document location parameters
    const HEADING_DEPTH = {
        LEVEL_7: 7,
    };

    const DOCUMENT_INDEX = {
        FIRST: 1,
    };

    // Helper function to reduce duplication
    const parseAndVerify = (content: string, path: string, depth: number, index: number) => {
        const result = parse(content, buildProjectLocation(path, depth, index));
        verifyAsJson(result);
    };

    /**
     * Tests parsing of .dlproj project files with various document configurations.
     */
    describe('Project File Parsing', () => {
        it('single document project file parses successfully', () => {
            parseAndVerify(
                PROJECT_FILE_FIXTURES.singleDocument,
                'C:/build.dlisp',
                HEADING_DEPTH.LEVEL_7,
                DOCUMENT_INDEX.FIRST
            );
        });
    });
});