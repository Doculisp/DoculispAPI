<!-- (dl (section-meta Core Pipeline Interfaces)) -->

These interfaces represent the main components that orchestrate the document compilation pipeline from source to output.

<!-- (dl (##icontroller-type `IController`)) -->

Main compilation orchestrator interface that coordinates the entire processing pipeline:

```typescript
interface IController {
    compile(source: IPath, output: IPath | false): Promise<Result<void>>;
    test(variableTable: IVariableTable): Promise<Result<void>>;
}
```

**Key Methods:**
- **`compile`** - Full compilation from source file to output markdown
- **`test`** - Validation mode that checks syntax without writing output
- **Pipeline coordination** - Orchestrates all processing stages in sequence
- **Error propagation** - Collects and reports errors from any pipeline stage

**Usage Pattern:**
```typescript
const controller = container.buildAs<IController>('controller');

// Compile to file
const result = await controller.compile(sourcePath, outputPath);

// Test validation only
const testResult = await controller.test(variableTable);
```

<!-- (dl (##iinclude-builder-type `IIncludeBuilder`)) -->

Full AST building interface with external file inclusion and dependency resolution:

```typescript
interface IIncludeBuilder {
    build(doculisp: IDoculisp, variableTable: IVariableTable): Promise<Result<ISectionWriter>>;
}
```

**Capabilities:**
- **Include resolution** - Process external file dependencies recursively
- **AST completion** - Build complete document tree with all includes
- **Variable context** - Manage shared variables across included files
- **Error aggregation** - Collect errors from all included documents

**Processing Flow:**
1. **Parse includes** - Identify external file references
2. **Recursive processing** - Process each included file through full pipeline
3. **Dependency resolution** - Handle nested includes and circular reference detection
4. **Tree assembly** - Combine all processed content into unified structure

<!-- (dl (##istring-writer-type `IStringWriter`)) -->

Interface for converting processed AST structures to final markdown output:

```typescript
interface IStringWriter {
    writeString(sectionWriter: ISectionWriter): Result<string>;
}
```

**Responsibilities:**
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