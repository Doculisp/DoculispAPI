<!-- (dl (section-meta Document Parser)) -->

The **Document Parser** is the first stage of the Doculisp processing pipeline, responsible for analyzing raw document content and distinguishing between regular markdown text and embedded Doculisp code blocks.

<!-- (dl (## Core Purpose)) -->

The Document Parser's primary intent is to **separate content types** within mixed-content documents:

- **Markdown Content** - Regular text that should be preserved as-is in the output
- **Doculisp Blocks** - Code sections that need to be processed through the Doculisp pipeline
- **Location Tracking** - Maintain precise source positions for both content types

This separation enables Doculisp's **dual-mode capability** where documents can contain both static content and dynamic Doculisp instructions.

<!-- (dl (## Content Recognition)) -->

### Doculisp Block Detection

The parser identifies Doculisp blocks using specific markers:

**In `.md` files (HTML Comment Syntax):**
```markdown
Regular markdown content here.

<!-- (dl
    (section-meta
        (title My Document)
    )
) -->

More markdown content.

<!-- (dl (# Dynamic Heading)) -->

Final markdown content.
```

**In `.dlisp` files (Raw Syntax):**
```doculisp
(section-meta
    (title My Document)
    (include
        (Section ./content.md)
    )
)
```

<!-- (dl (## Content Type Classification)) -->

The parser classifies content into two distinct types:

1. **`IText` Parts** - Continuous markdown/text content
2. **`ILispBlock` Parts** - Doculisp code requiring processing

```typescript
type DocumentPart = IText | ILispBlock;

interface DocumentMap {
    readonly parts: DocumentPart[];
    readonly projectLocation: IProjectLocation;
}
```

For complete type definitions, see [DocumentPart](<!-- (dl (get-path document-part-type)) -->) and [DocumentMap](<!-- (dl (get-path document-map-type)) -->) in the types documentation.

<!-- (dl (## Processing Strategy)) -->

<!-- (dl (### Mixed Content Handling)) -->

The Document Parser enables **seamless integration** of static and dynamic content:

**Example Input:**
```markdown
# Project Overview
This is a traditional markdown section.

<!-- (dl (section-meta
    (title Dynamic Documentation)
    (include
        (Installation ./_install.md)
        (Usage ./_usage.md)
    )
)) -->

## Static Conclusion
This concluding text remains unchanged.

<!-- (dl (content (toc numbered-labeled))) -->
```

**Parser Output Structure:**
1. **Text Part**: `"# Project Overview\nThis is a traditional markdown section.\n"`
2. **Lisp Part**: `"(section-meta (title Dynamic Documentation) (include ...))`
3. **Text Part**: `"## Static Conclusion\nThis concluding text remains unchanged.\n"`
4. **Lisp Part**: `"(content (toc numbered-labeled))"`

<!-- (dl (## Location Preservation)) -->

Every part maintains **precise location information**:

```typescript
interface DocumentPart {
    readonly type: 'text' | 'lisp';
    readonly content: string;
    readonly location: ILocation;  // Exact position in source file
}
```

See [ILocation](<!-- (dl (get-path ilocation-type)) -->) for detailed location tracking capabilities.

This enables:
- **Accurate error reporting** - Point to exact line and character
- **IDE integration** - Navigate directly to problem locations
- **Debugging support** - Trace output back to source

<!-- (dl (## Parser Interface)) -->

The Document Parser follows the API's functional design pattern:

```typescript
type DocumentParser = (
    content: string, 
    projectLocation: IProjectLocation
) => Result<DocumentMap>;
```

**Parameters:**
- **`content`** - Raw document text content
- **`projectLocation`** - File context for error reporting (see [IProjectLocation](<!-- (dl (get-path iproject-location-type)) -->))

**Return Value:**
- **[`Result<DocumentMap>`](<!-- (dl (get-path result-type)) -->)** - Success with parsed structure or detailed failure

<!-- (dl (## Error Handling)) -->

The parser provides **comprehensive error reporting** for:

- **Malformed HTML comments** - Invalid `<!-- (dl ...) -->` syntax
- **Unclosed blocks** - Missing closing comment tags
- **Nested comment issues** - Improper HTML comment nesting
- **Character encoding problems** - Unicode or encoding issues

**Example Error:**
```typescript
{
    success: false,
    message: "Unclosed Doculisp block starting at line 15",
    documentPath: sourcePath,
    processingStep: "Document Parsing",
    failureCategory: "Parse Error"
}
```

<!-- (dl (## Integration with Pipeline)) -->

The Document Parser serves as the **foundation** for the entire Doculisp processing pipeline:

1. **[Document Parser](<!-- (dl (get-path document-parser-type)) -->)** → [`DocumentMap`](<!-- (dl (get-path document-map-type)) -->) (mixed content parts)
2. **[Tokenizer](<!-- (dl (get-path token-function-type)) -->)** → [`TokenizedDocument`](<!-- (dl (get-path tokenized-document-type)) -->) (Lisp parts become tokens)
3. **[AST Parser](<!-- (dl (get-path iast-parser-type)) -->)** → [`RootAst`](<!-- (dl (get-path root-ast-type)) -->) (tokens become syntax tree)
4. **[Semantic Parser](<!-- (dl (get-path idoculisp-parser-type)) -->)** → [`IDoculisp`](<!-- (dl (get-path doculisp-type)) -->) (AST becomes semantic structure)
5. **[Include Builder](<!-- (dl (get-path iinclude-builder-type)) -->)** → [`ISectionWriter`](<!-- (dl (get-path section-writer-type)) -->) (resolve external dependencies)
6. **[String Writer](<!-- (dl (get-path istring-writer-type)) -->)** → Final markdown output

By cleanly separating content types at the beginning, the Document Parser enables the rest of the pipeline to focus purely on Doculisp processing while preserving markdown content exactly as authored.

This design supports Doculisp's core philosophy of **gradual adoption** - documents can start as pure markdown and incrementally add Doculisp features without breaking existing content.