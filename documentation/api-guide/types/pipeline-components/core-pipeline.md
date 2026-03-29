<!-- (dl (section-meta Core Pipeline Interfaces)) -->

These interfaces represent the main components that orchestrate the document compilation pipeline from source to output.

<!-- (dl (##icontroller-type `IController`)) -->

Main compilation orchestrator interface that coordinates the entire processing pipeline:

```typescript
interface IController {
    compile(sourcePath: IPath, destinationPath?: IPath | false): Result<string>[];
    test(variableTable: IVariableTable): Result<string | false>[];
}
```

**Key Methods:**
- **`compile`** - Full compilation from source file to output markdown
  - Returns array of results (for .dlproj files with multiple documents)
  - Each result contains the output file path on success
- **`test`** - Validation mode that checks syntax without writing output
  - Returns array of results for consistency with compile
  - Returns validation status for each document
- **Pipeline coordination** - Orchestrates all processing stages in sequence
- **Error propagation** - Collects and reports errors from any pipeline stage

**Usage Pattern:**
```typescript
const controller = container.buildAs<IController>('controller');

// Compile to file (returns array of results)
const results = controller.compile(sourcePath, outputPath);
results.forEach(result => {
    if (result.success) {
        console.log(`Compiled: ${result.value}`);
    }
});

// Test validation only
const testResults = controller.test(variableTable);
```

<!-- (dl (##iinclude-builder-type `IIncludeBuilder`)) -->

Full AST building interface with external file inclusion and dependency resolution:

```typescript
interface IIncludeBuilder {
    parse(variableTable: IVariableTable): Result<IDoculisp | IEmptyDoculisp>;
    parseProject(path: IPath, variableTable: IVariableTable): Result<IProjectDocuments>;
    parseExternals(doculisp: Result<IDoculisp | IEmptyDoculisp>, variableTable: IVariableTable): Result<IDoculisp | IEmptyDoculisp>;
}
```

**Capabilities:**
- **Parse** - Process a single Doculisp document through the complete pipeline
- **Parse project** - Process project files (.dlproj) to extract document definitions
- **Parse externals** - Resolve external file dependencies recursively
- **Variable context** - Manage shared variables across included files
- **Error aggregation** - Collect errors from all included documents

**Processing Flow:**
1. **Parse document** - Run complete pipeline on source file
2. **Identify includes** - Find external file references in semantic structure
3. **Recursive processing** - Process each included file through full pipeline
4. **Dependency resolution** - Handle nested includes and circular reference detection
5. **Structure assembly** - Combine all processed content into unified IDoculisp

<!-- (dl (##istring-writer-type `IStringWriter`)) -->

InterfaceAst(astMaybe: Result<IDoculisp | IEmptyDoculisp>, variableTable: IVariableTable): Result<string>;
}
```

**Responsibilities:**
- **Markdown generation** - Convert IDoculisp semantic structures to markdown syntax
- **Content formatting** - Apply proper spacing, headings, and structure
- **Table of contents** - Generate TOC based on configuration
- **Link resolution** - Convert path references to proper markdown links
- **Result handling** - Process Result types and propagate error
- **Markdown generation** - Convert semantic structures to markdown syntax
- **Content formatting** - Apply proper spacing, headings, and structure
- **Table of contents** - Generate TOC based on configuration
- **Link resolution** - Convert path references to proper markdown links

**Output Features:**
- **Clean markdown** - Standards-compliant output that works everywhere
- **Proper formatting** - Consistent spacing and structure
- **Dynamic headings** - Context-aware heading levels
- **Metadata handling** - Include author information and document metadata

<!-- (dl (##idoc-writer-type `IDocWriter`)) -->

Document compilation and file writing interface that handles the final output stage:

```typescript
interface IDocWriter {
    compileDocument(source: IPath, output: IPath | false): Promise<Result<void>>;
}
```

**Functionality:**
- **End-to-end compilation** - Complete processing from source to file output
- **File system operations** - Handle reading source and writing output files
- **Output management** - Create directories and manage file paths
- **Error handling** - Comprehensive error reporting with file context

**Usage Modes:**
- **File output** - When `output` is an `IPath`, writes to specified file
- **Test mode** - When `output` is `false`, validates without writing
- **Directory creation** - Automatically creates output directories if needed