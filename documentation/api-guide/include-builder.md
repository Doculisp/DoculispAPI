<!-- (dl (section-meta Include Builder)) -->

The **Include Builder** serves as both the **first and final step** in the Doculisp processing workflow due to its unique ability to walk the include tree. It orchestrates the complete processing of all dependencies AND assembles the final unified document structure.

<!-- (dl (## Core Purpose)) -->

The Include Builder performs **dual orchestration and final assembly**:

**As First Step (Orchestrator):**
- **Pipeline Initiation** - Kicks off processing for the main document and all includes
- **Tree Walking** - Recursively discovers and processes the entire include hierarchy
- **Dependency Coordination** - Manages processing of each file through the complete pipeline
- **Context Management** - Maintains variable context across the entire include tree

**As Final Step (Assembler):**
- **Document Assembly** - Combines all processed content into unified structure
- **Include Integration** - Weaves included content into the main document structure
- **Final Validation** - Ensures the complete document is ready for output

This **dual role** enables the Include Builder to both initiate the entire processing workflow AND produce the final unified result.

<!-- (dl (## Include Processing)) -->

The Include Builder processes the `include` declarations found in document metadata to build complete document hierarchies:

<!-- (dl (### Include Syntax Recognition)) -->

From `section-meta` blocks, the builder processes include lists:

```doculisp
(section-meta
    (title Main Document)
    (include
        (Getting-Started ./docs/getting-started.md)
        (API-Reference ./docs/api-reference.md)
        (Advanced-Topics ./docs/advanced.md)
    )
)
```

<!-- (dl (### Recursive Processing)) -->

For each included file, the Include Builder **orchestrates complete pipeline processing**:

1. **Loads the external file** using the file system interface
2. **Orchestrates full pipeline** - Coordinates Document Parser → Tokenizer → AST Parser → Doculisp AST Parser for each include
3. **Manages recursive processing** - When includes have their own includes, orchestrates additional pipeline runs
4. **Assembles the complete structure** - Combines all processed results into unified document hierarchy

<!-- (dl (### Dependency Tree Construction)) -->

**Example Include Hierarchy:**
```
Main Document
├── Getting Started
│   ├── Installation (included from getting-started.md)
│   └── Quick Start (included from getting-started.md)
├── API Reference
│   ├── Core API (included from api-reference.md)
│   └── Advanced API (included from api-reference.md)
└── Advanced Topics
```

<!-- (dl (## Circular Dependency Detection)) -->

The Include Builder implements **comprehensive circular dependency detection**:

<!-- (dl (### Detection Algorithm)) -->

- **Path tracking** - Maintains stack of currently processing file paths
- **Cycle detection** - Identifies when a file attempts to include itself (directly or indirectly)
- **Error reporting** - Provides clear error messages showing the circular path

**Circular Dependency Error:**
```typescript
{
    success: false,
    message: "Circular dependency detected: main.dlisp → intro.md → overview.md → main.dlisp",
    documentPath: currentPath,
    processingStep: "Include Processing",
    failureCategory: "Include Error"
}
```

<!-- (dl (### Dependency Validation)) -->

The builder validates all include relationships:
- **File existence** - Ensures all included files exist and are accessible
- **Path resolution** - Resolves relative paths correctly based on including file location
- **Permission checking** - Verifies files are readable
- **Format validation** - Ensures included files are valid Doculisp or markdown

<!-- (dl (## Variable Context Management)) -->

The Include Builder manages **variable context** across the entire include hierarchy:

<!-- (dl (### Variable Inheritance)) -->

- **Context propagation** - Variables from parent documents are available in included documents
- **Scope management** - Each included document can define its own local variables
- **Source tracking** - Maintains [`sourceKey`](<!-- (dl (get-path source-key-constant)) -->) for each file being processed
- **Working directory** - Updates [`workingDirectoryKey`](<!-- (dl (get-path working-directory-key-constant)) -->) for relative path resolution

<!-- (dl (### Variable Resolution)) -->

```typescript
// Variable context during include processing:
parentVariables.addValue(sourceKey, currentFile);
parentVariables.addValue(workingDirectoryKey, currentFileDirectory);

// Process included file with inherited context
const childVariableTable = parentVariables.createChild();
const includeResult = await processIncludeWithContext(includedFile, childVariableTable);
```

<!-- (dl (## Builder Interface)) -->

The Include Builder implements the [`IIncludeBuilder`](<!-- (dl (get-path iinclude-builder-type)) -->) interface:

```typescript
interface IIncludeBuilder {
    build(doculisp: IDoculisp, variableTable: IVariableTable): Promise<Result<ISectionWriter>>;
}
```

**Input:**
- **[`IDoculisp`](<!-- (dl (get-path doculisp-type)) -->)** - Semantic document structure from Doculisp AST Parser
- **[`IVariableTable`](<!-- (dl (get-path variable-table-type)) -->)** - Variable context for resolution

**Output:**
- **[`Promise<Result<ISectionWriter>>`](<!-- (dl (get-path result-type)) -->)** - Complete document tree or detailed failure

<!-- (dl (### ISectionWriter Structure)) -->

The builder produces an [`ISectionWriter`](<!-- (dl (get-path section-writer-type)) -->) containing the complete document:

```typescript
interface ISectionWriter {
    readonly doculisp: IDoculisp;
    readonly variableTable: IVariableTable;
}
```

**Properties:**
- **Complete Doculisp structure** - Main document with all includes resolved and integrated
- **Final variable table** - All variables from main document and includes combined
- **Self-contained** - No external dependencies remain; ready for output generation

<!-- (dl (## Document Tree Assembly)) -->

The Include Builder creates a **complete, hierarchical document structure**:

<!-- (dl (### Tree Building Process)) -->

1. **Start with main document** - Process the root Doculisp structure
2. **Identify includes** - Find all `include` declarations in document metadata
3. **Process each include** - Run each included file through the full pipeline
4. **Integrate results** - Combine included content into main document structure
5. **Recursive processing** - Handle nested includes in included files
6. **Finalize structure** - Create complete, self-contained document tree

<!-- (dl (### Content Integration)) -->

**Before Include Resolution:**
```typescript
// Main document has include references
{
    parts: [
        { type: 'title', title: 'Main Document' },
        { type: 'content-location' }  // Placeholder for included content
    ],
    includes: []  // Empty - not yet resolved
}
```

**After Include Resolution:**
```typescript
// Complete document with all content integrated
{
    parts: [
        { type: 'title', title: 'Main Document' },
        { type: 'title', title: 'Getting Started' },  // From included file
        { type: 'write', content: 'Installation instructions...' },
        { type: 'title', title: 'API Reference' },   // From another included file
        { type: 'write', content: 'API documentation...' }
    ],
    includes: [/* Complete included document structures */]
}
```

<!-- (dl (## Error Handling and Recovery)) -->

The Include Builder provides **comprehensive error handling** for include-related issues:

<!-- (dl (### Include Resolution Errors)) -->

- **File not found** - Missing included files with clear path information
- **Permission denied** - Inaccessible files with security context
- **Parsing failures** - Errors in included file syntax or structure
- **Circular dependencies** - Complete dependency chain information

<!-- (dl (### Error Aggregation)) -->

The builder can collect and report multiple errors:
- **Continue processing** - Attempt to process all includes even if some fail
- **Error collection** - Gather all errors for comprehensive reporting
- **Partial success** - Indicate which includes succeeded and which failed

**Multi-Include Error Example:**
```typescript
{
    success: false,
    message: "Multiple include failures: './intro.md' not found, './api.md' has syntax errors",
    documentPath: mainDocumentPath,
    processingStep: "Include Processing",
    failureCategory: "Include Error"
}
```

<!-- (dl (## Integration with Pipeline)) -->

The Include Builder has **dual positioning** in the processing workflow due to its tree-walking capabilities:

**Complete Processing Flow with Include Builder:**
1. **[Include Builder](<!-- (dl (get-path iinclude-builder-type)) -->)** *(First Step)* - Takes [`IDoculisp`](<!-- (dl (get-path doculisp-type)) -->) with include references, initiates tree walking

2. **For main document and each discovered include, orchestrates:**
   - **[Document Parser](<!-- (dl (get-path document-parser-type)) -->)** → [`DocumentMap`](<!-- (dl (get-path document-map-type)) -->) (content separation)
   - **[Tokenizer](<!-- (dl (get-path token-function-type)) -->)** → [`TokenizedDocument`](<!-- (dl (get-path tokenized-document-type)) -->) (lexical analysis)
   - **[AST Parser](<!-- (dl (get-path iast-parser-type)) -->)** → [`RootAst`](<!-- (dl (get-path root-ast-type)) -->) (structural validation)
   - **[Doculisp AST Parser](<!-- (dl (get-path idoculisp-parser-type)) -->)** → [`IDoculisp`](<!-- (dl (get-path doculisp-type)) -->) (semantic interpretation)
   - **Recursively processes nested includes** - Walks deeper into include tree as needed

3. **[Include Builder](<!-- (dl (get-path iinclude-builder-type)) -->)** *(Final Step)* - Assembles all processed content → [`ISectionWriter`](<!-- (dl (get-path section-writer-type)) -->) (unified document)

4. **[String Writer](<!-- (dl (get-path istring-writer-type)) -->)** → Final markdown output

<!-- (dl (### Dependency Resolution Benefits)) -->

The Include Builder provides crucial capabilities:

- **Modular documentation** - Enables breaking large documents into manageable pieces
- **Reusable content** - Allows sharing content sections across multiple documents
- **Maintainable structure** - Changes to included files automatically propagate
- **Collaborative workflows** - Multiple authors can work on different sections independently

<!-- (dl (### Document Composition)) -->

The Include Builder enables **sophisticated document composition**:

- **Hierarchical organization** - Nested includes create complex document structures
- **Content reuse** - Same included files can be used in multiple parent documents
- **Conditional inclusion** - Include processing respects commented includes (`*Section`)
- **Dynamic assembly** - Complete documents assembled at build time from modular components

The **Include Builder** serves as both the **orchestration engine** and **final assembler** for modular, interdependent Doculisp documents. Its tree-walking capabilities enable it to initiate and coordinate the complete processing workflow while also producing the final unified, self-contained structures, embodying Doculisp's core philosophy of **modular, maintainable documentation**.