import { containerPromise } from "../../../src/moduleLoader";
import { configure } from "approvals/lib/config";
import { Options } from "approvals/lib/Core/Options";
import { getVerifiers } from "../../tools";
import { DocumentParser } from "../../../src/types/types.document";
import { buildProjectLocation, testable } from "../../testHelpers";
import { IContainer } from "../../../src/types/types.containers";

// Test Fixtures
const TEXT_FIXTURES = {
    empty: '',
    simpleText: 'hello',
    twoWords: 'blow fish',
    leadingSpace: ' blow fish',
    surroundingSpaces: ' blow fish ',
    lineBreakWithSpaces: '   \r\n blow fish',
};

const CODE_BLOCK_FIXTURES = {
    nestedCodeBlocks: `An example of an markdown document with nested code blocks:
    \`\`\`\`markdown
    # A document
    
    \`\`\`html
    <a href="www.google.com">Google</a>
    \`\`\`
    
    ## Sub section title
    \`\`\`\`
    `,
    nestedCodeBlocksEndOfFile: `An example of an markdown document with nested code blocks:
    \`\`\`\`markdown
    # A document
    
    \`\`\`html
    <a href="www.google.com">Google</a>
    \`\`\`
    
    ## Sub section title
    \`\`\`\``,
    nestedCodeBlocksUnbalanced: `An example of an markdown document with nested code blocks that do not close:
    \`\`\`\`markdown
    # A document
    
    \`\`\`html
    <a href="www.google.com">Google</a>
    \`\`\`
    
    ## Sub section title
    \`\`\`\`\`
    `,
    inlineCodeWithComment: '`<!-- an example html comment -->`',
    inlineCodeInSentence: 'hello `int = 5;` world',
    codeBlockWithHtmlComments: `An example of an markdown document with html comments:
    \`\`\`markdown
    # A document
    
    <!-- this need
    a summary
    -->
    
    ## Sub section title
    \`\`\`
    `,
    unclosedInlineCodeBlock: '`let b = 7',
    inlineCodeBlockWithLineBreak: `\`let a = 0;
    let b = a;
    \``,
    unclosedMultilineCodeBlock: '```\nlet a = "hello;\nlet b = "world"\nconsole.log(a + " " + b);\n',
};

const HTML_COMMENT_FIXTURES = {
    simpleComment: `<!-- This is a comment -->hello bro`,
    multilineComment: `<!--
    This is a comment
    -->
                     \t\thello bro
                     `,
    commentInMiddle: `hello
    <!-- need stuff here -->
    
    world`,
    unclosedComment: `<!--
    Hello
    World
    Boom
    `,
};

const DOCULISP_FIXTURES = {
    singleLineBlock: '<!-- (dl (# header)) -->',
    multilineBlock: `<!--
(dl (# My heading))
-->`,
    blockInMiddle: '# Title\r\nsome text about title\r\n<!--\r\nSome lisp: (dl (# two)) -->\r\nMickey Mouse Hotline.',
    lispOutsideHtml: '(# Heading) Hello Doculisp',
    doculispOutsideHtml: '(dl (# Heading)) Hello Doculisp',
    escapedParentheses: '<!-- (dl (# My \\(really awesome header)) -->',
    getPathInLink: `<!-- (dl
(section-meta
    (title Using Dynamic Path)
)
) -->

[back](<!-- (dl (get-path readme)) -->)
                `,
};

const DLISP_FILE_FIXTURES = {
    validFile: `
(section-meta
    (title Doculisp)
    (include
        (Section ./structure.md)
        (Section ./doculisp.md)
        (Section ./section-meta.md)
        (Section ./content.md)
        (Section ./headings.md)
        (Section ./comment.md)
        (Section ./keywords.md)
    )
)

(content (toc numbered-labeled))
`,
    fileWithDlIdentifier: `(dl
(section-meta
    (title Doculisp)
)

(content (toc numbered-labeled)))
`,
    unclosedParentheses: `
(section-meta
    (title Doculisp)
    (include
        (Section ./structure.md)
        (Section ./doculisp.md
        (Section ./section-meta.md)
    )
)
`,
    tooManyParentheses: `(content (toc numbered-labeled)) )`,
};

describe('document', () => {
    let container: IContainer = null as any;
    let parse: DocumentParser = undefined as any;
    let verifyAsJson: (data: any, options?: Options) => void;
    let verifyWithGiven: (data: any, options?: Options | undefined, ...given: any[]) => void;

    beforeAll(() => {
        const verifiers = getVerifiers(configure);
        verifyAsJson = verifiers.verifyAsJson;
        verifyWithGiven = verifiers.verifyWithGiven;
    });

    beforeEach(async () => {
        container = await containerPromise;
        parse = testable.document.resultBuilder(container);
    });

    // Test constants for document location parameters
    const HEADING_DEPTH = {
        INVALID_ZERO: 0,
        INVALID_NEGATIVE: -1,
        ROOT: 1,
        LEVEL_2: 2,
        LEVEL_3: 3,
        LEVEL_4: 4,
        LEVEL_5: 5,
        LEVEL_6: 6,
        LEVEL_7: 7,
        LEVEL_8: 8,
    };

    const DOCUMENT_INDEX = {
        INVALID_ZERO: 0,
        INVALID_NEGATIVE: -1,
        FIRST: 1,
        SECOND: 2,
        THIRD: 3,
        FOURTH: 4,
        FIFTH: 5,
        SIXTH: 6,
        SEVENTH: 7,
        EIGHTH: 8,
    };

    // Helper functions to reduce duplication
    const parseAndVerify = (content: string, path: string, depth: number, index: number) => {
        const result = parse(content, buildProjectLocation(path, depth, index));
        verifyAsJson(result);
    };

    const parseAndVerifyWithGiven = (content: string, path: string, depth: number, index: number) => {
        const result = parse(content, buildProjectLocation(path, depth, index));
        verifyWithGiven(result, undefined, content);
    };

    it('should not allow a document with a zero depth.', () => {
        parseAndVerify('hello', 'C:/my_document.md', HEADING_DEPTH.INVALID_ZERO, DOCUMENT_INDEX.SIXTH);
    });

    it('should not allow a document with a negative depth.', () => {
        parseAndVerify('hello', 'C:/my_document.md', HEADING_DEPTH.INVALID_NEGATIVE, DOCUMENT_INDEX.SIXTH);
    });

    it('should not allow a document with a zero index.', () => {
        parseAndVerify('', 'C:/my_document.md', HEADING_DEPTH.LEVEL_4, DOCUMENT_INDEX.INVALID_ZERO);
    });

    it('should not allow a document with a negative index.', () => {
        parseAndVerify('', 'C:/my_document.md', HEADING_DEPTH.LEVEL_4, DOCUMENT_INDEX.INVALID_NEGATIVE);
    });

    describe('parsing markup', () => {
        describe('text', () => {
            it('should successfully parse an empty string', () => {
                parseAndVerify(TEXT_FIXTURES.empty, 'C:/my_document.md', HEADING_DEPTH.LEVEL_4, DOCUMENT_INDEX.EIGHTH);
            });
    
            it('should parse a simple text of "hello"', () => {
                parseAndVerify(TEXT_FIXTURES.simpleText, 'C:/my_document.md', HEADING_DEPTH.LEVEL_3, DOCUMENT_INDEX.SIXTH);
            });

            it('should parse text of "blow fish"', () => {
                parseAndVerify(TEXT_FIXTURES.twoWords, 'C:/my_document.md', HEADING_DEPTH.LEVEL_7, DOCUMENT_INDEX.SECOND);
            });

            it('should parse text of " blow fish"', () => {
                parseAndVerify(TEXT_FIXTURES.leadingSpace, 'C:/my_document.md', HEADING_DEPTH.LEVEL_4, DOCUMENT_INDEX.SIXTH);
            });

            it('should parse text of " blow fish "', () => {
                parseAndVerify(TEXT_FIXTURES.surroundingSpaces, 'C:/my_document.md', HEADING_DEPTH.LEVEL_7, DOCUMENT_INDEX.FIRST);
            });

            it('should parse text of "   \\r\\n blow fish"', () => {
                parseAndVerify(TEXT_FIXTURES.lineBreakWithSpaces, 'C:/my_document.md', HEADING_DEPTH.ROOT, DOCUMENT_INDEX.EIGHTH);
            });

            it('should parse nested multiline code blocks', () => {
                parseAndVerify(CODE_BLOCK_FIXTURES.nestedCodeBlocks, 'C:/markdown/multiline.md', HEADING_DEPTH.LEVEL_4, DOCUMENT_INDEX.THIRD);
            });

            it('should parse nested multiline code blocks that end with the file', () => {
                parseAndVerify(CODE_BLOCK_FIXTURES.nestedCodeBlocksEndOfFile, 'C:/markdown/multiline.md', HEADING_DEPTH.LEVEL_4, DOCUMENT_INDEX.THIRD);
            });

            it('should not parse nested multiline code blocks when closing markers are unbalanced', () => {
                parseAndVerify(CODE_BLOCK_FIXTURES.nestedCodeBlocksUnbalanced, 'C:/markdown/multiline.md', HEADING_DEPTH.LEVEL_4, DOCUMENT_INDEX.THIRD);
            });
        });

        describe('html comments', () => {
            it('should not parse html comments', () => {
                const trimmedComment = HTML_COMMENT_FIXTURES.simpleComment.trim();
                parseAndVerify(trimmedComment, 'C:/readme.md', HEADING_DEPTH.LEVEL_5, DOCUMENT_INDEX.SECOND);
            });
    
            it('should not parse html but preserve new line counts comments', () => {
                parseAndVerify(HTML_COMMENT_FIXTURES.multilineComment, 'C:/readme.md', HEADING_DEPTH.LEVEL_8, DOCUMENT_INDEX.THIRD);
            });
    
            it('should not parse html comments in the middle of text.', () => {
                parseAndVerify(HTML_COMMENT_FIXTURES.commentInMiddle, 'C:/comments/helloWorld.md', HEADING_DEPTH.ROOT, DOCUMENT_INDEX.SECOND);
            });
    
                it('should parse html comments inside an inline code block', () => {
                parseAndVerify(CODE_BLOCK_FIXTURES.inlineCodeWithComment, 'C:/html/inline.md', HEADING_DEPTH.LEVEL_5, DOCUMENT_INDEX.THIRD);
            });

            it('should parse an inline codeblock in middle of sentence', () => {
                parseAndVerify(CODE_BLOCK_FIXTURES.inlineCodeInSentence, 'C:/html/inline.md', HEADING_DEPTH.LEVEL_5, DOCUMENT_INDEX.THIRD);
            });

            it('should parse html comments inside a multiline code block', () => {
                parseAndVerify(CODE_BLOCK_FIXTURES.codeBlockWithHtmlComments, 'C:/markdown/multiline.md', HEADING_DEPTH.LEVEL_4, DOCUMENT_INDEX.THIRD);
            });

            it('should fail to parse if html comment is not closed', () => {
                parseAndVerify(HTML_COMMENT_FIXTURES.unclosedComment, 'C:/examples/bad.md', HEADING_DEPTH.LEVEL_5, DOCUMENT_INDEX.FOURTH);
            });

            it('should fail if inline code block does not close', () => {
                parseAndVerify(CODE_BLOCK_FIXTURES.unclosedInlineCodeBlock, 'C:/bad/noCloseInline.md', HEADING_DEPTH.LEVEL_8, DOCUMENT_INDEX.FOURTH);
            });

            it('should fail to parse an inline code block with a line break', () => {
                parseAndVerify(CODE_BLOCK_FIXTURES.inlineCodeBlockWithLineBreak, 'C:/examples/badInline.md', HEADING_DEPTH.LEVEL_6, DOCUMENT_INDEX.EIGHTH);
            });

            it('should fail to parse a multiline code block that does not close', () => {
                parseAndVerify(CODE_BLOCK_FIXTURES.unclosedMultilineCodeBlock, 'C:/bad/examples/multiline.md', HEADING_DEPTH.LEVEL_2, DOCUMENT_INDEX.SEVENTH);
            });
    });

    describe('Doculisp', () => {
            it('should parse a doculisp block at top of file', () => {
                parseAndVerifyWithGiven(DOCULISP_FIXTURES.singleLineBlock, '_main.md', HEADING_DEPTH.LEVEL_3, DOCUMENT_INDEX.SEVENTH);
            });

            it('should parse a multiline doculisp block', () => {
                parseAndVerifyWithGiven(DOCULISP_FIXTURES.multilineBlock, 'S:/ome/file.md', HEADING_DEPTH.LEVEL_2, DOCUMENT_INDEX.FIRST);
            });
            
            it('should parse a doculisp block in the middle of file', () => {
                parseAndVerifyWithGiven(DOCULISP_FIXTURES.blockInMiddle, '_main.md', HEADING_DEPTH.LEVEL_7, DOCUMENT_INDEX.FIFTH);
            });

            it('should parse lisp outside an html tag as text', () => {
                parseAndVerify(DOCULISP_FIXTURES.lispOutsideHtml, 'documentExample.md', HEADING_DEPTH.LEVEL_3, DOCUMENT_INDEX.FOURTH);
            });

            it('should parse Doculisp outside an html tag as text', () => {
                parseAndVerify(DOCULISP_FIXTURES.doculispOutsideHtml, 'documentExample2.md', HEADING_DEPTH.LEVEL_8, DOCUMENT_INDEX.EIGHTH);
            });

            it('should allow for an escaped parentheses in a parameter', () => {
                parseAndVerifyWithGiven(DOCULISP_FIXTURES.escapedParentheses, './_main.md', HEADING_DEPTH.LEVEL_2, DOCUMENT_INDEX.FIRST);
            });

            it('should parse Doculisp that contains a get-path in a link', () => {
                parseAndVerifyWithGiven(DOCULISP_FIXTURES.getPathInLink, './_main.md', HEADING_DEPTH.LEVEL_2, DOCUMENT_INDEX.FIRST);
            });
        });
    });

    describe('parsing .dlisp files', () => {
        it('should handle a correctly formatted file', () => {
            parseAndVerify(DLISP_FILE_FIXTURES.validFile, 'C:/main.dlisp', HEADING_DEPTH.LEVEL_7, DOCUMENT_INDEX.FIRST);
        });

        it('should fail to parse a file that contains a dl identifier', () => {
            parseAndVerify(DLISP_FILE_FIXTURES.fileWithDlIdentifier, 'C:/bad/extraDl.dlisp', HEADING_DEPTH.LEVEL_5, DOCUMENT_INDEX.SIXTH);
        });

        it('should handle a file with parentheses that do not close', () => {
            parseAndVerify(DLISP_FILE_FIXTURES.unclosedParentheses, 'C:/main.dlisp', HEADING_DEPTH.LEVEL_6, DOCUMENT_INDEX.FIRST);
        });

        it('should handle a file with to many parenthesis', () => {
            parseAndVerify(DLISP_FILE_FIXTURES.tooManyParentheses, 'C:/main.dlisp', HEADING_DEPTH.LEVEL_5, DOCUMENT_INDEX.EIGHTH);
        });
    });
});