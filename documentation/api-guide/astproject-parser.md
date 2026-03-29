<!-- (dl (section-meta AST Project Parser)) -->

The **AST Project Parser** is a specialized parser that processes **project configuration files** (`.dlproj` files) to enable batch compilation of multiple Doculisp documents with a single command.

<!-- (dl (## Core Purpose)) -->

The AST Project Parser interprets project configuration syntax to enable **multi-document workflows**:

- **Batch Configuration** - Define multiple source-to-output document mappings
- **Project Management** - Handle complex documentation projects with many files
- **Workflow Automation** - Enable single-command compilation of entire documentation sets
- **Dependency Coordination** - Manage relationships between multiple related documents

This parser enables Doculisp to scale from **single documents** to **complete documentation projects** with coordinated compilation workflows.

<!-- (dl (## Project File Structure)) -->

The AST Project Parser processes `.dlproj` files with a specialized syntax for defining document collections:

<!-- (dl (### Project Syntax)) -->

**Basic Project Structure:**
```lisp
(documents
    (document
        (source ./docs/readme.dlisp)
        (output ./README.md)
    )
    (document
        (source ./docs/api-guide.dlisp)
        (output ./docs/API.md)
    )
    (document
        (source ./docs/contributing.dlisp)
        (output ./CONTRIBUTING.md)
    )
)
```

<!-- (dl (### Document Definition Elements)) -->

Each `document` block defines a **source-to-output mapping**:

- **`source`** - Path to the input Doculisp file
- **`output`** - Path where the compiled markdown should be written
- **Relative paths** - All paths are relative to the project file location

<!-- (dl (## Semantic Interpretation)) -->

The AST Project Parser transforms the validated AST into meaningful project structures:

<!-- (dl (### Project Structure)) -->

The parser creates an [`IProjectDocuments`](<!-- (dl (get-path project-documents-type)) -->) containing all document definitions:

```typescript
interface IProjectDocuments {
    documents: IProjectDocument[];
    location: ILocation;
    type: 'project-documents';
    blockRange: IRange;
}
```

<!-- (dl (### Document Definitions)) -->

Each document mapping becomes an [`IProjectDocument`](<!-- (dl (get-path project-document-type)) -->) structure:

```typescript
interface IProjectDocument {
    id?: string | undefined;
    sourcePath: IPath;
    destinationPath: IPath;
    location: ILocation;
    type: 'project-document';
    blockRange: IRange;
}
```

**Properties:**
- **ID** - Optional identifier for cross-referencing
- **Source path** - Input Doculisp file with full path resolution
- **Destination path** - Target markdown file with full path resolution
- **Location context** - Position in project file for error reporting
- **Type discriminator** - `'project-document'`
- **Block range** - Source range information

<!-- (dl (## Path Resolution)) -->

The parser performs **comprehensive path management**:

<!-- (dl (### Relative Path Handling)) -->

- **Project-relative paths** - All paths resolved relative to the project file location
- **Path validation** - Ensures source files exist and output directories are writable
- **Cross-platform compatibility** - Handles different path separators and formats
- **Absolute path support** - Also supports absolute paths when needed

<!-- (dl (### Path Validation)) -->

The parser validates all paths during parsing:

```typescript
// Example validation checks:
- Source file exists and is readable
- Output directory exists or can be created
- No circular path references
- Valid file extensions (.dlisp for source)
```

**Path Resolution Error:**
```typescript
{
    success: false,
    message: "Source file './docs/missing-file.dlisp' not found",
    documentPath: projectPath,
    processingStep: "Project AST Parsing",
    failureCategory: "File System Error"
}
```

<!-- (dl (## Parser Interface)) -->

The AST Project Parser implements the [`IProjectParser`](<!-- (dl (get-path iproject-parser-type)) -->) interface:

```typescript
interface IProjectParser {
    parse(tokenResults: Result<RootAst | IAstEmpty>, variableTable: IVariableTable): Result<IProjectDocuments>;
}
```

**Input:**
- **[`RootAst`](<!-- (dl (get-path root-ast-type)) -->)** - Structurally validated AST from project file parsing
- **[`IVariableTable`](<!-- (dl (get-path variable-table-type)) -->)** - Variable context for resolution

**Output:**
- **[`Result<IProjectDocuments>`](<!-- (dl (get-path result-type)) -->)** - Success with project configuration or detailed failure

<!-- (dl (### Project Processing Flow)) -->

The parser processes project files through these stages:

1. **AST Validation** - Ensure project file has correct structure
2. **Document Extraction** - Find and process each document definition
3. **Path Resolution** - Resolve all source and output paths
4. **Validation** - Verify all paths and configurations are valid
5. **Project Assembly** - Create final `IProjectDocuments` structure

<!-- (dl (## Project Validation)) -->

The parser performs **comprehensive project validation**:

<!-- (dl (### Structural Validation)) -->

- **Required elements** - Ensure `documents` block exists with document definitions
- **Document structure** - Validate each document has required `source` and `output`
- **Syntax compliance** - Verify project file follows correct syntax rules
- **Completeness checking** - Ensure no incomplete or malformed document definitions

<!-- (dl (### Configuration Validation)) -->

- **File accessibility** - Check that all source files exist and are readable
- **Output feasibility** - Verify output paths are writable and directories exist
- **Path conflicts** - Detect duplicate output paths or circular references
- **Extension validation** - Ensure source files have appropriate extensions

**Project Validation Error:**
```typescript
{
    success: false,
    message: "Duplicate output path './README.md' found in multiple document definitions",
    documentPath: projectPath,
    processingStep: "Project AST Parsing",
    failureCategory: "Validation Error"
}
```

<!-- (dl (## Batch Processing Integration)) -->

The AST Project Parser enables **coordinated multi-document compilation**:

<!-- (dl (### Project Workflow)) -->

```typescript
// Typical project processing workflow:
const projectResult = projectParser.parse(projectAst, variableTable);
if (projectResult.success) {
    for (const document of projectResult.value.documents) {
        const compileResult = await controller.compile(
            document.sourcePath, 
            document.destinationPath
        );
        // Handle individual document results
    }
}
```

<!-- (dl (### Error Aggregation)) -->

Project processing can collect errors across multiple documents:
- **Individual document errors** - Compilation failures for specific documents
- **Project-level errors** - Configuration or structural problems
- **Dependency errors** - Issues with shared resources or references
- **Summary reporting** - Aggregate status across all documents in project

<!-- (dl (## Integration with Pipeline)) -->

The AST Project Parser operates **parallel to document parsing** for project-level coordination:

**Document Processing Pipeline:**
1. **[Document Parser](<!-- (dl (get-path document-parser-type)) -->)** → [`DocumentMap`](<!-- (dl (get-path document-map-type)) -->)
2. **[Tokenizer](<!-- (dl (get-path token-function-type)) -->)** → [`TokenizedDocument`](<!-- (dl (get-path tokenized-document-type)) -->)
3. **[AST Parser](<!-- (dl (get-path iast-parser-type)) -->)** → [`RootAst`](<!-- (dl (get-path root-ast-type)) -->)

**Project Processing Pipeline:**
1. **Project File Processing** → [`DocumentMap`](<!-- (dl (get-path document-map-type)) -->)
2. **Project Tokenization** → [`TokenizedDocument`](<!-- (dl (get-path tokenized-document-type)) -->)  
3. **Project AST Parsing** → [`RootAst`](<!-- (dl (get-path root-ast-type)) -->)
4. **[AST Project Parser](<!-- (dl (get-path iproject-parser-type)) -->)** → [`IProjectDocuments`](<!-- (dl (get-path project-documents-type)) -->)

<!-- (dl (### Project Orchestration)) -->

The project parser enables **higher-level document orchestration**:

- **Batch compilation** - Process multiple documents with single command
- **Dependency awareness** - Understand relationships between project documents  
- **Coordinated updates** - Update multiple documents together consistently
- **Status reporting** - Provide comprehensive status across entire project

<!-- (dl (### Project File Benefits)) -->

Using project files provides several advantages:

- **Configuration management** - Centralized configuration for complex projects
- **Reproducible builds** - Consistent compilation across different environments
- **Team coordination** - Shared project configuration for collaborative workflows
- **Automation support** - Easy integration with build systems and CI/CD pipelines

The **AST Project Parser** extends Doculisp's capabilities from individual document processing to **comprehensive project management**, enabling scalable documentation workflows for large, multi-document projects.