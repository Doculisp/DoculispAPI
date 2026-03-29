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
        let verifiers = getVerifiers(configure);
        verifyAsJson = verifiers.verifyAsJson;
        verifyWithGiven = verifiers.verifyWithGiven;
    });

    beforeEach(async () => {
        container = await containerPromise;
        parse = testable.document.resultBuilder(container);
    });

    it('should not allow a document with a zero depth.', () => {
        const result = parse('hello', buildProjectLocation('C:/my_document.md', 0, 6));
        
        verifyAsJson(result);
    });

    it('should not allow a document with a negative depth.', () => {
        const result = parse('hello', buildProjectLocation('C:/my_document.md', -1, 6));
        
        verifyAsJson(result);
    });

    it('should not allow a document with a zero index.', () => {
        const result = parse('', buildProjectLocation('C:/my_document.md', 4, 0));
        
        verifyAsJson(result);
    });

    it('should not allow a document with a negative index.', () => {
        const result = parse('', buildProjectLocation('C:/my_document.md', 4, -1));
        
        verifyAsJson(result);
    });

    describe('parsing markup', () => {
        describe('text', () => {
            it('should successfully parse an empty string', () => {
            const result = parse(TEXT_FIXTURES.empty, buildProjectLocation('C:/my_document.md', 4, 8));
    
            verifyAsJson(result);
        });
    
        it('should parse a simple text of "hello"', () => {
            const result = parse(TEXT_FIXTURES.simpleText, buildProjectLocation('C:/my_document.md', 3, 6));
    
            verifyAsJson(result);
        });

        it('should parse text of "blow fish"', () => {
            const result = parse(TEXT_FIXTURES.twoWords, buildProjectLocation('C:/my_document.md', 7, 2));
            verifyAsJson(result);
        });

        it('should parse text of " blow fish"', () => {
            const result = parse(TEXT_FIXTURES.leadingSpace, buildProjectLocation('C:/my_document.md', 4, 6));
            verifyAsJson(result);
        });

        it('should parse text of " blow fish "', () => {
            const result = parse(TEXT_FIXTURES.surroundingSpaces, buildProjectLocation('C:/my_document.md', 7, 1));
            verifyAsJson(result);
        });

        it('should parse text of "   \\r\\n blow fish"', () => {
            const result = parse(TEXT_FIXTURES.lineBreakWithSpaces, buildProjectLocation('C:/my_document.md', 1, 8));
            verifyAsJson(result);
        });

        it('should parse nested multiline code blocks', () => {
            const result = parse(CODE_BLOCK_FIXTURES.nestedCodeBlocks, buildProjectLocation('C:/markdown/multiline.md', 4, 3));

            verifyAsJson(result);
        });

        it('should parse nested multiline code blocks that end with the file', () => {
            const result = parse(CODE_BLOCK_FIXTURES.nestedCodeBlocksEndOfFile, buildProjectLocation('C:/markdown/multiline.md', 4, 3));

            verifyAsJson(result);
        });

            it('should not parse nested multiline code blocks when closing markers are unbalanced', () => {
                const md = `An example of an markdown document with nested code blocks that do not close:
    \`\`\`\`markdown
    # A document
    
    \`\`\`html
    <a href="www.google.com">Google</a>
    \`\`\`
    
    ## Sub section title
    \`\`\`\`\`
    `;
                const result = parse(md, buildProjectLocation('C:/markdown/multiline.md', 4, 3));
    
                verifyAsJson(result);
            });
        });

        describe('html comments', () => {
            it('should not parse html comments', () => {
            const md = HTML_COMMENT_FIXTURES.simpleComment.trim();
                const result = parse(md, buildProjectLocation('C:/readme.md', 5, 2));
    
                verifyAsJson(result);
            });
    
            it('should not parse html but preserve new line counts comments', () => {
            const result = parse(HTML_COMMENT_FIXTURES.multilineComment, buildProjectLocation('C:/readme.md', 8, 3));
                verifyAsJson(result);
            });
    
            it('should not parse html comments in the middle of text.', () => {
            const result = parse(HTML_COMMENT_FIXTURES.commentInMiddle, buildProjectLocation('C:/comments/helloWorld.md', 1, 2));
                verifyAsJson(result);
            });
    
            it('should parse html comments inside an inline code block', () => {
            const result = parse(CODE_BLOCK_FIXTURES.inlineCodeWithComment, buildProjectLocation('C:/html/inline.md', 5, 3));

            verifyAsJson(result);
        });

        it('should parse an inline codeblock in middle of sentence', () => {
            const result = parse(CODE_BLOCK_FIXTURES.inlineCodeInSentence, buildProjectLocation('C:/html/inline.md', 5, 3));
            
            verifyAsJson(result);
        });

        it('should parse html comments inside a multiline code block', () => {
            const result = parse(CODE_BLOCK_FIXTURES.codeBlockWithHtmlComments, buildProjectLocation('C:/markdown/multiline.md', 4, 3));

            verifyAsJson(result);
        });

        it('should fail to parse if html comment is not closed', () => {
            const result = parse(HTML_COMMENT_FIXTURES.unclosedComment, buildProjectLocation('C:/examples/bad.md', 5, 4));

            verifyAsJson(result);
        });

        it('should fail if inline code block does not close', () => {
            const result = parse(CODE_BLOCK_FIXTURES.unclosedInlineCodeBlock, buildProjectLocation('C:/bad/noCloseInline.md', 8, 4));

            verifyAsJson(result);
        });

        it('should fail to parse an inline code block with a line break', () => {
            const result = parse(CODE_BLOCK_FIXTURES.inlineCodeBlockWithLineBreak, buildProjectLocation('C:/examples/badInline.md', 6, 8));

            verifyAsJson(result);
        });

        it('should fail to parse a multiline code block that does not close', () => {
            const result = parse(CODE_BLOCK_FIXTURES.unclosedMultilineCodeBlock, buildProjectLocation('C:/bad/examples/multiline.md', 2, 7));

            verifyAsJson(result);
        });
    });

    describe('Doculisp', () => {
        it('should parse a doculisp block at top of file', () => {
                const result = parse(DOCULISP_FIXTURES.singleLineBlock, buildProjectLocation('_main.md', 3, 7));

                verifyWithGiven(result, undefined, DOCULISP_FIXTURES.singleLineBlock);
            });

            it('should parse a multiline doculisp block', () => {
                const result = parse(DOCULISP_FIXTURES.multilineBlock, buildProjectLocation('S:/ome/file.md', 2, 1));

                verifyWithGiven(result, undefined, DOCULISP_FIXTURES.multilineBlock);
            });
            
            it('should parse a doculisp block in the middle of file', () => {
                const result = parse(DOCULISP_FIXTURES.blockInMiddle, buildProjectLocation('_main.md', 7, 5));

                verifyWithGiven(result, undefined, DOCULISP_FIXTURES.blockInMiddle);
            });

            it('should parse lisp outside an html tag as text', () => {
                const result = parse(DOCULISP_FIXTURES.lispOutsideHtml, buildProjectLocation('documentExample.md', 3, 4));

                verifyAsJson(result);
            });

            it('should parse Doculisp outside an html tag as text', () => {
                const result = parse(DOCULISP_FIXTURES.doculispOutsideHtml, buildProjectLocation('documentExample2.md', 8, 8));

                verifyAsJson(result);
            });

            it('should allow for an escaped parentheses in a parameter', () => {
                const result = parse(DOCULISP_FIXTURES.escapedParentheses, buildProjectLocation('./_main.md', 2, 1));
                verifyWithGiven(result, undefined, DOCULISP_FIXTURES.escapedParentheses);
            });

            it('should parse Doculisp that contains a get-path in a link', () => {
                const result = parse(DOCULISP_FIXTURES.getPathInLink, buildProjectLocation('./_main.md', 2, 1));
                verifyWithGiven(result, undefined, DOCULISP_FIXTURES.getPathInLink);
            });
        });
    });

    describe('parsing .dlisp files', () => {
        it('should handle a correctly formatted file', () => {
            let result = parse(DLISP_FILE_FIXTURES.validFile, buildProjectLocation('C:/main.dlisp', 7, 1));

            verifyAsJson(result);
        });

        it('should fail to parse a file that contains a dl identifier', () => {
            let result = parse(DLISP_FILE_FIXTURES.fileWithDlIdentifier, buildProjectLocation('C:/bad/extraDl.dlisp', 5, 6));

            verifyAsJson(result);
        });

        it('should handle a file with parentheses that do not close', () => {
            let result = parse(DLISP_FILE_FIXTURES.unclosedParentheses, buildProjectLocation('C:/main.dlisp', 6, 1));

            verifyAsJson(result);
        });

        it('should handle a file with to many parenthesis', () => {
            let result = parse(DLISP_FILE_FIXTURES.tooManyParentheses, buildProjectLocation('C:/main.dlisp', 5, 8));

            verifyAsJson(result);
        });
    });
});