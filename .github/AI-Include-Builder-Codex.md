# AI Include Builder Codex

This codex provides comprehensive documentation for the Doculisp Include Builder, which handles external file inclusion and recursively processes document hierarchies to create complete document structures.

## Overview

The Include Builder is the fifth stage in the Doculisp processing pipeline:
- **Input**: `IDoculisp` or `IEmptyDoculisp` (from Doculisp AST parser)
- **Output**: `IDoculisp` or `IEmptyDoculisp` (with populated external documents)
- **Purpose**: Resolves external file includes, recursively processes child documents, and builds complete document hierarchies

## Input Data Structures

### IDoculisp
The primary input structure from the Doculisp AST parser:

```typescript
interface IDoculisp {
    projectLocation: IProjectLocation;
    section: ISectionWriter;
    type: 'doculisp-root';
}
```

### ISectionWriter
Contains the main document content and external file specifications:

```typescript
interface ISectionWriter extends ILocationSortable {
    readonly doculisp: DoculispPart[];
    readonly include: ILoad[];
    readonly type: 'doculisp-section';
}
```

### ILoad (External File Specifications)
```typescript
interface ILoad extends ILocationSortable {
    readonly type: 'doculisp-load';
    readonly path: IPath;
    readonly sectionLabel: string;
    document: ISectionWriter | false;
}
```

**Key Properties**:
- **path**: File path to external document
- **sectionLabel**: Display label for the section
- **document**: Initially `false`, populated with parsed content during processing

### Additional Dependencies

#### IVariableSaver
```typescript
interface IVariableSaver {
    addValueToList(key: string, value: string): void;
}
```
- Used for accumulating variables across document hierarchy
- Maintains author lists and other metadata

#### IFileHandler
```typescript
interface IFileHandler extends IFileLoader, IFileWriter, IDirectoryHandler {
    load(path: IPath): Result<string>;
    getProcessWorkingDirectory(): Result<IPath>;
    setProcessWorkingDirectory(directory: IPath): Result<undefined>;
}
```

## Output Data Structures

### Populated IDoculisp
The output structure is identical to input but with all `ILoad.document` properties populated:

```typescript
interface ILoad extends ILocationSortable {
    readonly type: 'doculisp-load';
    readonly path: IPath;
    readonly sectionLabel: string;
    document: ISectionWriter | false; // Now populated with actual content
}
```

### Document Hierarchy
The builder creates a complete tree structure where each `ILoad` contains:
- **Parsed Content**: Full `ISectionWriter` with doculisp parts
- **Nested Includes**: Child documents with their own external files resolved
- **Variable Accumulation**: Shared variable table across entire hierarchy

## Core Functionality

### IIncludeBuilder Interface
```typescript
interface IIncludeBuilder {
    parse(path: IPath, variableTable: IVariableSaver): Result<IDoculisp | IEmptyDoculisp>;
    parseExternals(doculisp: Result<IDoculisp | IEmptyDoculisp>, variableTable: IVariableSaver): Result<IDoculisp | IEmptyDoculisp>;
}
```

### Key Methods

#### 1. parse()
**Signature**: `parse(filePath: IPath, variableTable: IVariableSaver): Result<IDoculisp | IEmptyDoculisp>`

**Purpose**: Entry point for parsing a complete document with all external includes
**Process**:
1. Sets up initial project location
2. Calls internal `_parse()` with depth 1, index 1
3. Returns fully processed document hierarchy

#### 2. parseExternals()
**Signature**: `parseExternals(astResult: Result<IDoculisp | IEmptyDoculisp>, variableTable: IVariableSaver): Result<IDoculisp | IEmptyDoculisp>`

**Purpose**: Processes external includes for an already parsed document
**Process**:
1. Validates input result
2. Handles empty documents
3. Calls `parseSection()` to resolve all includes
4. Returns document with populated external content

## Processing Algorithm

### Document Processing Pipeline
For each external document, the builder runs the complete processing pipeline:

```typescript
const documentResult = documentParse(fileMaybe.value, location);
const tokens = tokenizer(documentResult);
const ast = astParser.parse(tokens);
const doculisp = doculispParser.parse(ast, variableTable);
return parseExternals(doculisp, variableTable);
```

**Pipeline Stages**:
1. **Document Parsing**: Raw text → DocumentMap
2. **Tokenization**: DocumentMap → TokenizedDocument  
3. **AST Parsing**: Tokens → RootAst
4. **Doculisp Parsing**: AST → IDoculisp
5. **Include Processing**: Recursive external file resolution

### Recursive Include Resolution

#### parseSection() Algorithm
```typescript
function parseSection(doculisp: ISectionWriter, variableTable: IVariableSaver): Result<ISectionWriter>
```

**Process**:
1. **Iterate through includes**: Process each `ILoad` in `doculisp.include[]`
2. **Skip already processed**: If `load.document` exists, recursively process it
3. **Calculate location**: Set proper `documentDepth` and `documentIndex`
4. **Parse external file**: Run complete pipeline on external document
5. **Handle empty documents**: Skip if external document is empty
6. **Populate document**: Set `load.document` to parsed `ISectionWriter`

#### Document Location Calculation
```typescript
const location = { 
    documentDepth: doculisp.documentOrder.documentDepth + 1, 
    documentIndex: index + 1, 
    documentPath: load.path 
};
```

**Depth Tracking**: Each nested level increases depth by 1
**Index Tracking**: Sequential index within parent's include list
**Path Tracking**: Maintains file path for error reporting

### Working Directory Management

#### Directory Context Switching
```typescript
const workingDir = fileHandler.getProcessWorkingDirectory();
const targetDir = filePath.getContainingDir();
fileHandler.setProcessWorkingDirectory(targetDir);
// ... process file ...
fileHandler.setProcessWorkingDirectory(workingDir.value); // Restore
```

**Features**:
- **Context Preservation**: Saves and restores working directory
- **Relative Path Support**: Enables relative paths in include statements
- **Error Recovery**: Uses try/finally to ensure directory restoration
- **Nested Processing**: Handles nested directory changes correctly

## Error Handling

### Error Propagation Patterns

#### File System Errors
```typescript
const fileMaybe = fileHandler.load(filePath);
if(!fileMaybe.success) {
    return fileMaybe; // Propagate file load error
}
```

#### Parsing Errors
```typescript
const astResult = _parse(load.path, location, variableTable);
if(!astResult.success) {
    return astResult; // Propagate parsing error
}
```

#### Directory Errors
```typescript
const workingDir = fileHandler.getProcessWorkingDirectory();
if(!workingDir.success) {
    return workingDir; // Propagate directory error
}
```

### Error Context Preservation
- **File Path Context**: Errors include specific file paths
- **Location Information**: Maintains line/character context
- **Hierarchy Context**: Shows which document in hierarchy failed
- **Original Error**: Preserves original error messages

## Integration Patterns

### Pipeline Position
```
Document Parser → Tokenizer → AST Parser → Doculisp AST Parser → **Include Builder** → String Writer
```

### Dependency Registration
```typescript
const astBuilder: IRegisterable = {
    builder: (util, astParse, documentParse, tokenizer, fileHandler, path, astParser) => 
        buildAstBuilder(util, astParse, documentParse, tokenizer, fileHandler, path, astParser),
    name: 'includeBuilder',
    singleton: true,
    dependencies: ['util', 'astDoculispParse', 'documentParse', 'tokenizer', 'fileHandler', 'path', 'astParser']
};
```

### Consumer Pattern
```typescript
const includeResult = includeBuilder.parse(mainDocumentPath, variableTable);
if (includeResult.success) {
    const completeDocument = includeResult.value;
    // Document hierarchy fully resolved
}
```

## Testing Patterns

### Test Structure
```typescript
describe('include builder', () => {
    let toExternalResult: (text: string, location: IProjectLocation) => Result<IDoculisp | IEmptyDoculisp>;
    let addPathResult: (filePath: string, result: Result<string>) => void;
    let variableSaver: IVariableSaver;
    
    beforeEach(() => {
        toExternalResult = testable.include.includeResultBuilder(container, setup);
        // Setup file system mocks
    });
});
```

### File System Mocking
```typescript
const fileHandler: IFileLoader & IDirectoryHandler = {
    load(filePath: IPath): Result<string> {
        const result = pathToResult[filePath.fullName];
        return result || util.fail(`filePath has not been setup.`, filePath);
    },
    getProcessWorkingDirectory(): Result<IPath> { 
        return util.ok(buildPath('./', false)); 
    },
    setProcessWorkingDirectory(): Result<undefined> { 
        return util.ok(undefined); 
    }
};
```

### Common Test Scenarios
1. **Empty Documents**: No includes → passthrough processing
2. **Single Include**: One external file → simple resolution
3. **Multiple Includes**: Multiple external files → sequential processing
4. **Nested Includes**: Child documents with their own includes → recursive processing
5. **File Errors**: Missing files, load failures → error propagation
6. **Empty External Files**: External files with no content → skip processing
7. **Variable Accumulation**: Authors and metadata across hierarchy

### Mock File Setup
```typescript
addPathResult('path/to/child.md', ok(childDocumentContent));
addPathResult('path/to/grandchild.md', ok(grandchildContent));

const result = toExternalResult(mainDocumentContent, projectLocation);
```

## Document Hierarchy Examples

### Simple Include
```
Input:
Main Document:
  includes: [{ path: "./child.md", document: false }]

Child Document (./child.md):
  content: "Child content"
  includes: []

Output:
Main Document:
  includes: [{ 
    path: "./child.md", 
    document: ISectionWriter { 
      doculisp: [IWrite { value: "Child content" }],
      include: []
    }
  }]
```

### Nested Includes
```
Input:
Main Document:
  includes: [{ path: "./child.md", document: false }]

Child Document (./child.md):
  includes: [{ path: "./grandchild.md", document: false }]

Grandchild Document (./grandchild.md):
  content: "Grandchild content"
  includes: []

Output:
Main Document:
  includes: [{ 
    path: "./child.md",
    document: ISectionWriter {
      includes: [{
        path: "./grandchild.md",
        document: ISectionWriter {
          doculisp: [IWrite { value: "Grandchild content" }],
          include: []
        }
      }]
    }
  }]
```

### Multiple Includes
```
Input:
Main Document:
  includes: [
    { path: "./section1.md", document: false },
    { path: "./section2.md", document: false }
  ]

Output:
Main Document:
  includes: [
    { path: "./section1.md", document: ISectionWriter { ... } },
    { path: "./section2.md", document: ISectionWriter { ... } }
  ]
```

## Key Implementation Notes

1. **Recursive Processing**: Handles arbitrary nesting depth of includes
2. **Working Directory Management**: Proper relative path resolution
3. **Error Recovery**: Try/finally ensures directory restoration
4. **Variable Sharing**: Single variable table across entire hierarchy
5. **Lazy Loading**: Only processes external files when first encountered
6. **Depth Tracking**: Maintains proper document hierarchy depth
7. **Index Tracking**: Sequential numbering within include lists
8. **Empty Document Handling**: Skips processing empty external files
9. **Pipeline Integration**: Runs complete processing pipeline for each external file
10. **Memory Efficiency**: Reuses parsers and utilities across all documents

## Performance Considerations

### Optimization Strategies
- **Singleton Services**: Reuses parser instances across all documents
- **Early Termination**: Skips processing for empty documents
- **Efficient Path Handling**: Minimal directory switching overhead
- **Error Short-Circuiting**: Fails fast on first error encountered

### Resource Management
- **Directory Context**: Careful management of working directory state
- **File Handle Cleanup**: Relies on file handler implementation
- **Memory Usage**: Builds complete hierarchy in memory
- **Variable Table Growth**: Accumulates variables across all documents

This Include Builder serves as the critical component that transforms document specifications with external references into complete, self-contained document hierarchies ready for final output generation. It handles the complex orchestration of multiple parsers, file system operations, and recursive document processing while maintaining proper error context and variable accumulation throughout the entire document tree.