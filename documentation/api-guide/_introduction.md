<!-- (dl (# Introduction)) -->

The DoculispTypeScript API is designed around several core philosophical principles that make it powerful, predictable, and maintainable. Understanding these principles will help you use the API effectively and write robust code.

## Immutability and Functional Design

The API follows **functional programming principles** where operations don't modify existing data structures. Instead, they return new objects with the desired changes. This approach:

- **Prevents side effects** that can cause hard-to-debug issues
- **Enables safe concurrent processing** without race conditions
- **Makes code predictable** - functions with the same input always produce the same output
- **Simplifies testing** by eliminating hidden state dependencies

```typescript
// Operations return new objects rather than modifying existing ones
const originalDocument = parseDocument(content);
const processedDocument = processIncludes(originalDocument); // original unchanged
```

## Result-Based Error Handling

Rather than throwing exceptions that can crash your application, the API uses a **Result pattern** that makes error handling explicit and manageable:

- **Success states** contain the expected value
- **Failure states** contain detailed error information with location context
- **No hidden exceptions** - all possible failures are represented in the return type
- **Composable error handling** - chain operations safely without try/catch blocks

```typescript
const result = compileDocument(source);
if (result.success) {
    // Access result.value safely
    console.log(result.value);
} else {
    // Handle specific error with context
    console.error(`Error at ${result.error.location}: ${result.error.message}`);
}
```

## Pipeline Architecture

The API is structured as a **processing pipeline** where each stage transforms data for the next stage:

1. **Document Parsing** - Raw text → Document structure
2. **Tokenization** - Document → Tokens
3. **AST Generation** - Tokens → Abstract Syntax Tree
4. **Semantic Analysis** - AST → Doculisp Structure
5. **Include Resolution** - Doculisp → Complete Document Tree
6. **Output Generation** - Document Tree → Final Markdown

This design provides:

- **Clear separation of concerns** - each stage has a single responsibility
- **Testable components** - test each stage independently
- **Flexible processing** - customize or replace individual stages
- **Debuggable flow** - inspect data at any stage in the pipeline

## Dependency Injection and Testability

The API uses **dependency injection** to make components:

- **Testable** - replace file system operations with in-memory mocks
- **Flexible** - swap implementations without changing client code
- **Maintainable** - clear dependencies make code easier to understand
- **Reliable** - isolated components are easier to test and debug

```typescript
// Create testable container with mock file system
const container = buildTestable()
    .withFileSystem(mockFileSystem)
    .build();

const controller = container.controller;
```

## Location-Aware Processing

Every piece of data maintains **precise location information** (file, line, character) throughout processing:

- **Meaningful error messages** show exactly where problems occur
- **IDE integration** enables click-to-navigate error locations
- **Debug-friendly** - trace any value back to its source
- **User-friendly** - errors point to specific locations in source files

## Modular and Extensible Design

The API is built for **composition and extension**:

- **Small, focused interfaces** that do one thing well
- **Builder patterns** for complex object construction
- **Abstract interfaces** that allow custom implementations
- **Minimal coupling** between components

This philosophy makes the DoculispTypeScript API both powerful for complex documentation workflows and approachable for simple use cases. Each design decision prioritizes **reliability**, **maintainability**, and **developer experience**.