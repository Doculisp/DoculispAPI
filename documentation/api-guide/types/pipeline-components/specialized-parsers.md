<!-- (dl (section-meta Specialized Parsers)) -->

These parser interfaces handle the transformation of content through different stages of the processing pipeline.

<!-- (dl (##document-parser-type `DocumentParser`)) -->

Function type for parsing raw document content into structured format:

```typescript
type DocumentParser = (content: string, projectLocation: IProjectLocation) => Result<DocumentMap>;
```

**Processing:**
- **Raw text input** - Accepts plain text document content
- **Content separation** - Identifies text content vs. Doculisp blocks
- **Structure creation** - Generates `DocumentMap` with mixed content parts
- **Location tracking** - Maintains precise source location information

**Output Structure:**
- **`DocumentPart[]`** - Array of text and Lisp content blocks
- **Project context** - Location information for error reporting
- **Mixed content support** - Handles documents with embedded Doculisp

<!-- (dl (##iast-parser-type `IAstParser`)) -->

Interface for converting tokenized content to Abstract Syntax Tree representation:

```typescript
interface IAstParser {
    parse(tokenizedDocument: TokenizedDocument): Result<RootAst>;
}
```

**Transformation:**
- **Token to AST** - Convert sequential tokens into hierarchical tree structure
- **Syntax validation** - Ensure proper Lisp syntax and structure
- **Node creation** - Generate typed AST nodes (identifiers, commands, containers)
- **Error detection** - Identify malformed expressions and syntax errors

**AST Benefits:**
- **Structural representation** - Tree format enables easier processing
- **Type safety** - Strongly typed nodes prevent runtime errors  
- **Location preservation** - Each node maintains source position
- **Hierarchical access** - Navigate nested structures efficiently

<!-- (dl (##idoculisp-parser-type `IDoculispParser`)) -->

Interface for parsing AST into Doculisp semantic structures:

```typescript
interface IDoculispParser {
    parse(rootAst: RootAst, variableTable: IVariableTable): Result<IDoculisp>;
}
```

**Semantic Analysis:**
- **AST to semantics** - Convert raw AST into meaningful Doculisp structures
- **Command interpretation** - Process Doculisp commands (section-meta, content, etc.)
- **Validation rules** - Apply Doculisp-specific structural requirements
- **Variable integration** - Handle variable definitions and references

**Semantic Structures:**
- **`IWrite`** - Text content for output
- **`ITitle`** - Document and section titles
- **`ITableOfContents`** - TOC configuration
- **`IHeader`** - Dynamic heading elements
- **`IContentLocation`** - Content placement markers

<!-- (dl (##iproject-parser-type `IProjectParser`)) -->

Interface for parsing project-level AST into project structure definitions:

```typescript
interface IProjectParser {
    parse(rootAst: RootAst): Result<IProject>;
}
```

**Project Processing:**
- **Project syntax** - Parse `.dlproj` file format
- **Document definitions** - Extract source/output file pairs
- **Batch configuration** - Setup for multi-document compilation
- **Validation** - Ensure all referenced files exist and are accessible

**Project Structure:**
- **`IDocument[]`** - Array of document compilation definitions
- **Source paths** - Input Doculisp files to process
- **Output paths** - Target markdown files to generate
- **Batch coordination** - Enable processing multiple documents together

**Usage Pattern:**
```typescript
// Parse project file
const projectResult = projectParser.parse(projectAst);
if (projectResult.success) {
    // Process each document in the project
    for (const doc of projectResult.value.documents) {
        await compileDocument(doc.source, doc.output);
    }
}
```