<!-- (dl (section-meta Introduction)) -->

The DoculispTypeScript project provides a comprehensive **TypeScript compiler** for the Doculisp documentation language. This API guide covers the **Dependency Injection Container system** and **core compilation pipeline** that powers the compiler.

<!-- (dl (# What This Guide Covers)) -->

This guide provides everything you need to work with the DoculispTypeScript API:

- **Container System**: How to access and work with the dependency injection container
- **Core Architecture**: Understanding the compilation pipeline and component interactions  
- **Pipeline APIs**: Detailed documentation for DocumentParse, Tokenizer, and AstParser
- **Usage Patterns**: Practical examples and common integration scenarios
- **Advanced Topics**: Performance optimization, testing, and custom extensions

<!-- (dl (# Who Should Use This Guide)) -->

**Primary Audience:**
- **Tool Developers**: Building IDE extensions, language servers, or linting tools
- **Integration Developers**: Incorporating Doculisp compilation into existing toolchains
- **Advanced Users**: Needing fine-grained control over the compilation process
- **Contributors**: Working on the DoculispTypeScript project itself

**Alternative Resources:**
- For basic Doculisp usage: See the [User Guide](../user-guide/_main.md)
- For language syntax: See the [Language Specification](../../Lang/AI-Assistant-Codex.md)
- For quick compilation: Use the command-line interface

<!-- (dl (# Getting Started)) -->

**Recommended Approach**: Use the high-level DoculispApi class for most use cases:

```typescript
import { DoculispApi } from 'doculisp';

// Create API instance (handles container initialization)
const api = await DoculispApi.create();

// Simple file compilation
const results = await api.compileFile('./docs/readme.dlisp', './README.md');

// Test/validate without writing output
const testResults = await api.testFile('./docs/readme.dlisp');
```

**Advanced Container Access**: For fine-grained control, access the container directly:

```typescript
import { containerPromise } from 'doculisp/dist/moduleLoader';
import { IController, PathConstructor, IPath } from 'doculisp';

// Always await the container (it's asynchronous)
const container = await containerPromise;

// Build any registered object with full type safety
const controller = container.buildAs<IController>('controller');
const pathConstructor = container.buildAs<PathConstructor>('pathConstructor');

const sourcePath: IPath = pathConstructor('./docs/readme.dlisp');
const destinationPath: IPath = pathConstructor('./README.md');
const results = controller.compile(sourcePath, destinationPath);
```

**Critical**: The container is asynchronous because modules are loaded dynamically. Always use `await containerPromise` before accessing container functionality.

<!-- (dl (# Exported Types)) -->

**Type Safety**: DoculispTypeScript exports all its TypeScript interfaces and types for enhanced development experience:

```typescript
// Import core types for type-safe development
import {
  // Main API
  DoculispApi,
  IDoculispApi,
  ITestableDoculispApi,
  
  // Core interfaces
  IController,
  PathConstructor, 
  IPath,
  
  // Pipeline types
  DocumentParser,
  TokenFunction, 
  IAstParser,
  IDoculispParser,
  
  // Data types
  Result,
  DocumentMap,
  TokenizedDocument,
  Token,
  IAst,
  IDoculisp,
  IRange,
  
  // Container types
  IContainer,
  IProjectLocation
} from 'doculisp';
```

**Benefits of Using Exported Types:**
- **IntelliSense Support**: Get autocomplete and parameter hints in your IDE
- **Compile-time Safety**: Catch type mismatches before runtime
- **Better Documentation**: Self-documenting code with clear interfaces
- **Refactoring Safety**: IDE can safely rename and refactor with type information

<!-- (dl (# Key Concepts)) -->

**Dependency Injection Container:**
- Manages all compilation components and their dependencies
- Provides type-safe object creation and lifecycle management
- Enables easy testing through dependency replacement
- Automatically resolves complex dependency chains

**Compilation Pipeline:**
- **DocumentParse**: Extracts Doculisp from documents (first stage)
- **Tokenizer**: Converts content to structured tokens (second stage)  
- **AstParser**: Builds Abstract Syntax Trees (third stage)
- **Semantic Processing**: Converts AST to Doculisp structures
- **Output Generation**: Produces final markdown documents

**File Type Support:**
- **`.dlproj`**: Project files for batch compilation
- **`.dlisp`**: Pure Doculisp structure files
- **`.md`**: Markdown with embedded Doculisp blocks

<!-- (dl (# API Interface System)) -->

**Comprehensive API Interfaces**: The system provides structured interfaces for improved TypeScript integration:

**Main API Interface (`IDoculispApi`)**:
- **Core Methods**: `compileFile()` and `testFile()` for basic document processing
- **Pipeline Access**: Direct access to parsing stages (`getTokenizer()`, `getPreprocessor()`, `getPartialAstBuilders()`)
- **Utility Methods**: Variable table creation, path constructor, and utility functions
- **Testing Support**: Built-in `getTestableApi()` method for test scenarios

**Testable API Interface (`ITestableDoculispApi`)**:
- **Component Injection**: Methods to inject test fakes for all major components
- **Pipeline Mocking**: Individual setter methods for each parsing stage
- **Test Isolation**: Complete dependency injection for isolated testing

```typescript
// Use interfaces for enhanced type safety
import { IDoculispApi, ITestableDoculispApi } from 'doculisp';

// Standard API usage
const api: IDoculispApi = await DoculispApi.create();

// Testable API for testing scenarios  
const [testContainer, testApi]: [ITestableContainer, ITestableDoculispApi] = 
    await DoculispApi.createTestable();
```

<!-- (dl (# AST Block Range Tracking)) -->

**Precise Location Tracking**: AST interfaces include comprehensive location information:

**Block Range Property**:
All AST interfaces include a `blockRange: IRange` property:
- **`IAstIdentifier`**: Precise location of identifier blocks
- **`IAstCommand`**: Exact boundaries of command blocks  
- **`IAstContainer`**: Complete container block ranges
- **Doculisp Types**: `IPathId`, `IContentLocation`, `ILoad` interfaces also include block ranges

**Usage Example**:
```typescript
// AST nodes include precise location information
const identifier: IAstIdentifier = {
    // ... existing properties
    blockRange: {
        start: { line: 1, char: 1 },
        end: { line: 1, char: 10 }
    }
};
```

<!-- (dl (# Important Limitations)) -->

**Variable System Constraints:**
The Doculisp compiler has very limited variable support. The variable table only supports:

- **System-generated string variables**: `source` and `destination` (automatically set during compilation)
- **ID variables**: Used internally for tracking header IDs and ensuring uniqueness

**Custom string variables are NOT supported** - you cannot add arbitrary string variables for use in documents.

<!-- (dl (# Navigation Guide)) -->

**Recommended Reading Order:**

1. **[Container Fundamentals](./container-fundamentals.md)** - Start here to understand the foundation
2. **[Architecture Overview](./architecture-overview.md)** - Learn how components work together
3. **[Core Pipeline APIs](./core-pipeline-apis.md)** - Deep dive into the main APIs
4. **[Usage Patterns](./usage-patterns.md)** - See practical examples and patterns

**Reference Sections:**
- **[Core Objects](./core-objects.md)** - Complete container object reference
- **[Pipeline Overview](./parsing-pipeline-overview.md)** - Detailed pipeline documentation
- **[Testing Patterns](./testing-patterns.md)** - Testing strategies and examples
- **[Advanced Usage](./advanced-usage.md)** - Performance optimization and extensions