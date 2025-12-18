<!-- (dl (section-meta Result and Error Handling Types)) -->

The DoculispTypeScript API uses a **Result pattern** for explicit error handling rather than throwing exceptions. This approach makes error states visible in type signatures and enables safe, composable error handling throughout the processing pipeline.

<!-- (dl (## Core Result Types)) -->

<!-- (dl (###result-type `Result<T>`)) -->

The fundamental union type representing either a successful operation or a failure:

```typescript
type Result<T> = ISuccess<T> | IFail;
```

**Usage Pattern:**
```typescript
const result = compileDocument(source);
if (result.success) {
    // Type-safe access to success value
    console.log(result.value);
} else {
    // Handle specific failure with context
    console.error(`${result.processingStep}: ${result.message}`);
}
```

<!-- (dl (###isuccess-type `ISuccess<T>`)) -->

Represents a successful operation result containing the expected value:

```typescript
interface ISuccess<T> {
    readonly value: T;        // The successful result
    readonly success: true;   // Discriminator property
}
```

**Key Features:**
- **Type-safe value access** - Only accessible when `success` is `true`
- **Immutable structure** - Prevents accidental modification
- **Generic type parameter** - Works with any result type

<!-- (dl (###ifail-type `IFail`)) -->

Represents a failure with comprehensive context information:

```typescript
interface IFail {
    readonly message: string;              // Human-readable error description
    readonly documentPath?: IPath;         // Optional source file location
    readonly success: false;               // Discriminator property
    readonly failureCategory: FailureCategory;  // Error classification
    readonly processingStep: ProcessingStep;    // Pipeline stage where error occurred
}
```

**Key Features:**
- **Detailed context** - Shows exactly where and why the failure occurred
- **Optional file location** - Links errors to specific source files when available
- **Categorized failures** - Enables different handling strategies per error type
- **Pipeline awareness** - Identifies which processing stage failed

<!-- (dl (## Error Classification Types)) -->

<!-- (dl (###failure-category-type `FailureCategory`)) -->

Classifies errors by their fundamental cause, enabling appropriate handling strategies:

```typescript
type FailureCategory = 
    | 'Parse Error'        // Malformed input syntax
    | 'Validation Error'   // Invalid structure or configuration
    | 'File System Error'  // File access or path issues
    | 'Include Error';     // Problems resolving external dependencies
```

**Usage Examples:**
- **Parse Error**: Invalid Doculisp syntax, malformed tokens
- **Validation Error**: Missing required elements, invalid parameters
- **File System Error**: File not found, permission denied, invalid paths
- **Include Error**: Circular dependencies, missing include files

<!-- (dl (###processing-step-type `ProcessingStep`)) -->

Identifies which stage of the processing pipeline encountered an error:

```typescript
type ProcessingStep = 
    | 'Document Parsing'              // Raw text → DocumentMap
    | 'Tokenization'                  // DocumentMap → Tokens
    | 'AST Parsing'                   // Tokens → Abstract Syntax Tree
    | 'Doculisp AST Parsing'         // AST → Doculisp Semantic Structure
    | 'Project AST Parsing'          // AST → Project Structure
    | 'Include Processing'           // Resolving external file dependencies
    | 'Building Document'            // Assembling final document structure
    | 'File Operations'              // Reading/writing files
    | 'Package Information Retrieval' // Loading package metadata
    | 'Input Validation';            // Validating user inputs
```

**Benefits:**
- **Precise error location** - Know exactly which pipeline stage failed
- **Debugging assistance** - Narrow down troubleshooting scope
- **Error routing** - Handle different pipeline failures appropriately
- **Progress tracking** - Understand how far processing succeeded

<!-- (dl (## Error Handling Patterns)) -->

<!-- (dl (### Safe Chaining)) -->

The Result pattern enables safe operation chaining without nested try/catch blocks:

```typescript
// Each step safely handles the previous result
const result = parseDocument(content);
if (!result.success) return result;

const tokenResult = tokenize(result.value);
if (!tokenResult.success) return tokenResult;

const astResult = buildAst(tokenResult.value);
// Continue chain safely...
```

<!-- (dl (### Comprehensive Context)) -->

Every failure provides maximum context for debugging and user feedback:

```typescript
if (!result.success) {
    console.error(`
        Step: ${result.processingStep}
        Category: ${result.failureCategory}
        File: ${result.documentPath?.fullPath || 'Unknown'}
        Message: ${result.message}
    `);
}
```

<!-- (dl (### Type-Safe Error Handling)) -->

The discriminated union ensures compile-time safety:

```typescript
// TypeScript ensures you check success before accessing value
function handleResult<T>(result: Result<T>): T | null {
    if (result.success) {
        return result.value;  // ✅ Type-safe access
    } else {
        logError(result.message);
        return null;
    }
    // result.value here would be a compile error ❌
}
```