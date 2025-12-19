<!-- (dl (section-meta Doculisp AST Parser)) -->

The **Doculisp AST Parser** is the fourth stage of the Doculisp processing pipeline, responsible for transforming the structurally-validated, non-semantic AST into meaningful Doculisp semantic structures that represent the actual intent and content of the document.

<!-- (dl (## Core Purpose)) -->

The Doculisp AST Parser performs **semantic analysis** on the validated AST structure:

- **Semantic Interpretation** - Convert structural nodes into meaningful Doculisp elements
- **Command Recognition** - Identify and process specific Doculisp commands and their purposes
- **Context Application** - Apply Doculisp-specific rules and constraints
- **Meaning Extraction** - Transform syntax into actionable document instructions

This transformation from **structural correctness** to **semantic meaning** enables the API to understand what the Doculisp code is intended to accomplish.

<!-- (dl (## Semantic Structure Creation)) -->

The Doculisp AST Parser transforms generic AST nodes into specific, meaningful Doculisp elements:

<!-- (dl (### Doculisp Parts)) -->

The parser creates [`DoculispPart`](<!-- (dl (get-path doculisp-part-type)) -->) elements that represent semantic document components:

```typescript
type DoculispPart = IWrite | ITitle | ITableOfContents | IContentLocation | IHeader | IPathId;
```

<!-- (dl (### Core Semantic Elements)) -->

**`IWrite`** - Text content to be written to the output:
```typescript
interface IWrite {
    readonly type: 'write';
    readonly content: string;
    readonly location: ILocation;
}
```

**`ITitle`** - Document and section titles:
```typescript
interface ITitle {
    readonly type: 'title';
    readonly title: string;
    readonly level: number;  // Heading level (H1, H2, etc.)
    readonly location: ILocation;
}
```

**`ITableOfContents`** - Table of contents configuration:
```typescript
interface ITableOfContents {
    readonly type: 'table-of-contents';
    readonly style: TocStyle;
    readonly label?: string;
    readonly location: ILocation;
}
```

**`IContentLocation`** - Markers for where included content should appear:
```typescript
interface IContentLocation {
    readonly type: 'content-location';
    readonly location: ILocation;
}
```

**`IHeader`** - Dynamic heading elements:
```typescript
interface IHeader {
    readonly type: 'header';
    readonly level: number;
    readonly text: string;
    readonly id?: string;
    readonly location: ILocation;
}
```

**`IPathId`** - Path reference identifiers for cross-linking:
```typescript
interface IPathId {
    readonly type: 'path-id';
    readonly id: string;
    readonly location: ILocation;
}
```

<!-- (dl (## Command Interpretation)) -->

The semantic parser recognizes and processes specific Doculisp commands:

<!-- (dl (### Document Structure Commands)) -->

**`section-meta`** - Document metadata and structure:
- Creates document titles, subtitles, author information
- Processes include lists for external file dependencies
- Establishes document identity and cross-reference IDs

**`content`** - Content placement and table of contents:
- Generates table of contents with specified styling
- Marks locations where included content should appear
- Controls content organization and presentation

<!-- (dl (### Dynamic Content Commands)) -->

**`#`, `##`, `###`** - Dynamic headings:
- Creates context-aware heading levels
- Enables heading adjustment based on document hierarchy
- Supports optional ID assignment for cross-referencing

**`get-path`** - Cross-reference resolution:
- Resolves document and section references
- Enables linking between different parts of documentation
- Maintains reference integrity across document restructuring

<!-- (dl (### Variable Commands)) -->

The parser integrates with the [`IVariableTable`](<!-- (dl (get-path variable-table-type)) -->) to handle:
- Variable definitions and references
- Source file context tracking
- Working directory management for relative paths

<!-- (dl (## Semantic Validation)) -->

Beyond structural validation, the Doculisp AST Parser performs **semantic validation**:

<!-- (dl (### Command-Specific Rules)) -->

- **Required parameters** - Ensure commands have necessary parameters
- **Parameter types** - Validate parameter values are appropriate for their use
- **Context constraints** - Apply rules about where certain commands can appear
- **Dependency validation** - Check that referenced files and IDs exist

<!-- (dl (### Document Integrity)) -->

- **Include resolution** - Verify that included files are accessible
- **ID uniqueness** - Ensure cross-reference IDs are unique and valid
- **Circular dependency detection** - Prevent infinite include loops
- **Path validation** - Check that file paths are valid and accessible

**Example Semantic Error:**
```typescript
{
    success: false,
    message: "Include file './missing-section.md' not found",
    documentPath: sourcePath,
    processingStep: "Doculisp AST Parsing",
    failureCategory: "Include Error"
}
```

<!-- (dl (## Parser Interface)) -->

The Doculisp AST Parser implements the [`IDoculispParser`](<!-- (dl (get-path idoculisp-parser-type)) -->) interface:

```typescript
interface IDoculispParser {
    parse(rootAst: RootAst, variableTable: IVariableTable): Result<IDoculisp>;
}
```

**Input:**
- **[`RootAst`](<!-- (dl (get-path root-ast-type)) -->)** - Structurally validated AST from AST Parser
- **[`IVariableTable`](<!-- (dl (get-path variable-table-type)) -->)** - Variable context for resolution

**Output:**
- **[`Result<IDoculisp>`](<!-- (dl (get-path result-type)) -->)** - Success with semantic structure or detailed failure

<!-- (dl (### IDoculisp Structure)) -->

The parser produces an [`IDoculisp`](<!-- (dl (get-path doculisp-type)) -->) containing complete semantic information:

```typescript
interface IDoculisp {
    readonly parts: DoculispPart[];
    readonly includes: ISectionWriter[];
    readonly projectLocation: IProjectLocation;
}
```

**Properties:**
- **Semantic parts** - All meaningful Doculisp elements in processing order
- **Include structure** - Resolved external document dependencies  
- **Project context** - Location information for error reporting

<!-- (dl (## Variable Integration)) -->

The Doculisp AST Parser integrates closely with the variable system:

<!-- (dl (### Variable Context)) -->

- **Source tracking** - Maintains current source file context using [`sourceKey`](<!-- (dl (get-path source-key-constant)) -->)
- **Working directory** - Manages relative path resolution with [`workingDirectoryKey`](<!-- (dl (get-path working-directory-key-constant)) -->)
- **Custom variables** - Supports user-defined variables for reusable values

<!-- (dl (### Variable Resolution)) -->

During semantic parsing, the parser:
- **Resolves variable references** - Replaces variable references with actual values
- **Updates context** - Maintains variable state across included files
- **Validates dependencies** - Ensures required variables are available

<!-- (dl (## Integration with Pipeline)) -->

The Doculisp AST Parser transforms validated structure into actionable semantic meaning:

**Pipeline Flow:**
1. **[Document Parser](<!-- (dl (get-path document-parser-type)) -->)** → [`DocumentMap`](<!-- (dl (get-path document-map-type)) -->) (content separation)
2. **[Tokenizer](<!-- (dl (get-path token-function-type)) -->)** → [`TokenizedDocument`](<!-- (dl (get-path tokenized-document-type)) -->) (lexical analysis)
3. **[AST Parser](<!-- (dl (get-path iast-parser-type)) -->)** → [`RootAst`](<!-- (dl (get-path root-ast-type)) -->) (structural validation)
4. **[Doculisp AST Parser](<!-- (dl (get-path idoculisp-parser-type)) -->)** → [`IDoculisp`](<!-- (dl (get-path doculisp-type)) -->) (semantic interpretation)
5. **[Include Builder](<!-- (dl (get-path iinclude-builder-type)) -->)** → [`ISectionWriter`](<!-- (dl (get-path section-writer-type)) -->) (dependency resolution)

<!-- (dl (### Semantic Processing Benefits)) -->

The semantic AST provides crucial advantages for document generation:

- **Meaningful structure** - Elements represent actual document intentions
- **Command-specific processing** - Each element type has clear, defined behavior  
- **Context awareness** - Elements understand their role in document structure
- **Generation ready** - Semantic elements can be directly converted to output

<!-- (dl (### Doculisp Command System)) -->

The semantic parser implements Doculisp's **command-based architecture**:

- **Extensible commands** - New commands can be added with specific semantic handlers
- **Parameter validation** - Each command validates its parameters appropriately
- **Context-sensitive behavior** - Commands behave differently based on document context
- **Composable functionality** - Commands can be combined to create complex document structures

This **semantic interpretation layer** transforms the structurally-correct AST into meaningful, actionable document instructions that can be processed by the include builder and ultimately converted into the final markdown output.