<!-- (dl (section-meta DoculispApi)) -->

The **DoculispApi** is the main public interface for the DoculispTypeScript library, providing a clean, high-level API for compiling Doculisp documents and accessing the underlying processing pipeline components.

<!-- (dl (## Core Purpose)) -->

The DoculispApi serves as the **primary entry point** for developers using the Doculisp system:

- **High-Level Interface** - Simple methods for common Doculisp operations
- **Pipeline Orchestration** - Coordinates the complete processing workflow
- **Error Management** - Provides comprehensive error handling and reporting
- **Component Access** - Exposes underlying pipeline components for advanced usage
- **Testing Support** - Offers testable variants with dependency injection

This API abstracts the **complexity of the processing pipeline** while providing **full access** to advanced features when needed.

<!-- (dl (## API Creation)) -->

The DoculispApi provides multiple creation patterns to suit different use cases:

<!-- (dl (### Standard API Creation)) -->

**Static Factory Method:**
```typescript
const api = await DoculispApi.create();
```

This creates a standard API instance with:
- **Default container** - Production-ready dependency injection container
- **File system access** - Real file operations for reading/writing documents
- **Full pipeline** - Complete processing capabilities

<!-- (dl (### Testable API Creation)) -->

**For Testing and Mocking:**
```typescript
const [testableContainer, api] = await DoculispApi.createTestable();
```

This creates a testable API instance with:
- **Isolated container** - Independent dependency injection for testing
- **Mock support** - Ability to replace components with test doubles
- **Test control** - Complete control over component behavior

<!-- (dl (### Direct Instantiation)) -->

**With Custom Container:**
```typescript
const customContainer = buildCustomContainer();
const api = new DoculispApi(customContainer);
```

This allows:
- **Custom configuration** - Use pre-configured dependency containers
- **Advanced scenarios** - Custom component implementations
- **Integration flexibility** - Embed in existing dependency injection systems

<!-- (dl (## Core API Methods)) -->

The DoculispApi provides essential methods for document processing:

<!-- (dl (### File Compilation)) -->

**`compileFile` Method:**
```typescript
async compileFile(sourcePath: string, outputPath?: string): Result<string>[]
```

**Usage:**
```typescript
// Compile to specific output file
const results = await api.compileFile('./docs/readme.dlisp', './README.md');

// Compile with automatic output path
const results = await api.compileFile('./docs/readme.dlisp');

// Check results (returns array because .dlproj files can compile multiple documents)
if (results.every(r => r.success)) {
    console.log('All documents compiled successfully');
} else {
    results.forEach(result => {
        if (!result.success) {
            console.error(`Compilation failed: ${result.message}`);
        }
    });
}
```

<!-- (dl (### Document Validation)) -->

**`testFile` Method:**
```typescript
async testFile(sourcePath: string): Result<string | false>[]
```

**Usage:**
```typescript
// Test document without generating output
const results = await api.testFile('./docs/readme.dlisp');

// Check results (returns array for consistency with compileFile)
if (results.every(r => r.success)) {
    console.log('Document is valid');
} else {
    results.forEach(result => {
        if (!result.success) {
            console.error(`Validation failed: ${result.message}`);
        }
    });
}
```

<!-- (dl (### Variable Table Management)) -->

**`createVariableTable` Method:**
```typescript
createVariableTable(): IVariableTable
```

**Usage:**
```typescript
// Create isolated variable context
const variables = api.createVariableTable();
variables.addValue('customVar', { type: 'variable-string', value: 'Custom Value' });
```

<!-- (dl (## Advanced Component Access)) -->

The DoculispApi provides **direct access** to underlying pipeline components for advanced use cases:

<!-- (dl (### Pipeline Components)) -->

**Core Processing Components:**
```typescript
// Get the complete AST builder with includes
const astBuilder = api.getAstBuilder();

// Get individual parsing components
const { nonSemanticAstBuilder, markdownAstBuilder, projectAstBuilder } = api.getPartialAstBuilders();

// Get tokenization component
const tokenizer = api.getTokenizer();

// Get document preprocessor
const preprocessor = api.getPreprocessor();

// Get string output generator
const stringWriter = api.getStringWriter();
```

<!-- (dl (### Utility Components)) -->

**Helper and Utility Access:**
```typescript
// Get path construction utilities
const pathConstructor = api.getPathConstructor();

// Get core utility functions
const util = api.getUtil();
```

**Usage Examples:**
```typescript
// Create custom paths
const sourcePath = pathConstructor('./custom/path.dlisp');

// Create success/failure results
const success = util.ok(processedData);
const failure = util.fail('Custom Step')('Custom Category')('Custom error message');
```

<!-- (dl (## Testing and Dependency Injection)) -->

The DoculispApi provides comprehensive **testing support** through dependency injection:

<!-- (dl (### Testable API Instance)) -->

**Getting Testable API:**
```typescript
const testableApi = api.getTestableApi();
```

**Or create directly:**
```typescript
const [container, testableApi] = await DoculispApi.createTestable();
```

<!-- (dl (### Component Replacement)) -->

**Replace Individual Components:**
```typescript
// Replace file system with mock
const mockFileSystem = createMockFileSystem();
testableApi.setPathConstructor(mockPathConstructor);

// Replace processing components
const mockAstBuilder = createMockAstBuilder();
testableApi.setAstBuilder(mockAstBuilder);

// Replace utilities
const mockUtil = createMockUtil();
testableApi.setUtil(mockUtil);
```

<!-- (dl (### Complete Testing Example)) -->

```typescript
// Create testable environment
const [container, testableApi] = await DoculispApi.createTestable();

// Set up test doubles
const mockFileSystem = {
    loadFile: jest.fn().mockResolvedValue(util.ok('test content')),
    writeFile: jest.fn().mockResolvedValue(util.ok(undefined))
};

testableApi.setPathConstructor(createMockPathConstructor());
container.replaceValue(mockFileSystem, 'fileHandler');

// Test with controlled environment
const result = await testableApi.compileFile('./test.dlisp', './output.md');

// Verify behavior
expect(mockFileSystem.loadFile).toHaveBeenCalledWith(expect.any(Object));
expect(result.success).toBe(true);
```

<!-- (dl (## Error Handling and Results)) -->

The DoculispApi follows the **Result pattern** for comprehensive error handling:

<!-- (dl (### Result Pattern Usage)) -->

All API methods return [`Result<T>`](<!-- (dl (get-path result-type)) -->) types:

```typescript
const result = await api.compileFile('./source.dlisp');

if (result.success) {
    // Success case - no errors
    console.log('Compilation completed successfully');
} else {
    // Failure case - detailed error information
    console.error(`Error in ${result.processingStep}: ${result.message}`);
    if (result.documentPath) {
        console.error(`File: ${result.documentPath.fullPath}`);
    }
}
```

<!-- (dl (### Error Categories)) -->

The API provides detailed error classification through [`FailureCategory`](<!-- (dl (get-path failure-category-type)) -->):

- **Parse Error** - Syntax and structure issues
- **Validation Error** - Semantic and configuration problems
- **File System Error** - File access and path issues  
- **Include Error** - Dependency resolution failures

<!-- (dl (### Processing Step Context)) -->

Errors include [`ProcessingStep`](<!-- (dl (get-path processing-step-type)) -->) information showing where failures occurred:

- Document Parsing, Tokenization, AST Parsing
- Doculisp AST Parsing, Project AST Parsing
- Include Processing, Building Document
- File Operations, Input Validation

<!-- (dl (## Integration Patterns)) -->

The DoculispApi supports various **integration patterns** for different use cases:

<!-- (dl (### Simple Compilation Workflow)) -->

```typescript
import { DoculispApi } from 'doculisp-typescript';

const api = await DoculispApi.create();

// Single document compilation
await api.compileFile('./docs/readme.dlisp', './README.md');
```

<!-- (dl (### Batch Processing)) -->

```typescript
const documentsToCompile = [
    { source: './docs/readme.dlisp', output: './README.md' },
    { source: './docs/api.dlisp', output: './API.md' },
    { source: './docs/guide.dlisp', output: './GUIDE.md' }
];

for (const doc of documentsToCompile) {
    const result = await api.compileFile(doc.source, doc.output);
    if (!result.success) {
        console.error(`Failed to compile ${doc.source}: ${result.message}`);
    }
}
```

<!-- (dl (### Validation Pipeline)) -->

```typescript
// Validate before compilation
const validationResult = await api.testFile('./docs/readme.dlisp');

if (validationResult.success) {
    // Only compile if validation passes
    const compileResult = await api.compileFile('./docs/readme.dlisp', './README.md');
}
```

<!-- (dl (### Custom Processing)) -->

```typescript
// Get individual components for custom workflows
const astBuilder = api.getAstBuilder();
const stringWriter = api.getStringWriter();
const pathConstructor = api.getPathConstructor();

// Build custom processing pipeline
const sourcePath = pathConstructor('./custom.dlisp');
const variables = api.createVariableTable();

// Custom processing steps...
```

<!-- (dl (## Performance and Resource Management)) -->

The DoculispApi is designed for **efficient resource usage**:

<!-- (dl (### Async Operations)) -->

- **Non-blocking** - All file operations are asynchronous
- **Promise-based** - Modern async/await patterns
- **Resource cleanup** - Proper handling of file handles and memory

<!-- (dl (### Container Lifecycle)) -->

- **Singleton components** - Shared instances for efficiency
- **Lazy initialization** - Components created only when needed
- **Memory management** - Proper cleanup of large document structures

<!-- (dl (### Scalability)) -->

- **Stateless operations** - API instances can process multiple documents
- **Concurrent processing** - Multiple documents can be processed simultaneously
- **Resource sharing** - Common components shared across operations

The **DoculispApi** provides a clean, powerful interface that makes Doculisp's sophisticated document processing capabilities accessible to developers while maintaining the flexibility to access advanced features and provide comprehensive testing support.