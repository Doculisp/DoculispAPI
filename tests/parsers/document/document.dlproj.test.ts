import { containerPromise } from "../../../src/moduleLoader";
import { configure } from "approvals/lib/config";
import { Options } from "approvals/lib/Core/Options";
import { getVerifier } from "../../tools";
import { DocumentParser } from "../../../src/types/types.document";
import { buildProjectLocation, testable } from "../../testHelpers";

/**
 * Tests for parsing .dlproj project files that define batch compilation configurations.
 * These files specify multiple documents to be compiled together as a project.
 */
describe('Document Project File Parser', () => {
    let parse: DocumentParser = undefined as any;
    let verifyAsJson: (data: any, options?: Options) => void;

    beforeAll(() => {
        verifyAsJson = getVerifier(configure);
    });

    beforeEach(async () => {
        let container = await containerPromise;
        parse = testable.document.resultBuilder(container);
    });

    /**
     * Tests parsing of .dlproj project files with various document configurations.
     */
    describe('Project File Parsing', () => {
        it('single document project file parses successfully', () => {
        let dlisp = `
(documents
    (document
        (source C:/main.dlisp)
        (output ./project.md)
    )
)
`;

        let result = parse(dlisp, buildProjectLocation('C:/build.dlisp', 7, 1));

        verifyAsJson(result);
        });
    });
});