# AI Testing Codex: Doculisp Testing Architecture

## Overview

The Doculisp project implements a sophisticated testing architecture that combines **dependency injection**, **builder patterns**, **approval testing**, and **fake dependency management**. This system enables comprehensive, isolated, and maintainable testing of complex parsing and document processing workflows.

**Important for AI Assistants**: When creating tests that involve Doculisp DSL structures, always reference the **AI Assistant Codex** (`AI-Assistant-Codex.md`) to ensure proper Doculisp syntax, file type usage, and structural patterns. The AI Assistant Codex contains essential guidelines for creating valid Doculisp code that tests should validate against.

## Core Components

### 1. Dependency Injection Container System

#### Container Architecture

The project uses a custom-built dependency injection system with three main interfaces:

- **`IContainer`**: Base container interface for dependency management
- **`ITestableContainer`**: Extended interface for test-specific dependency replacement
- **`IDependencyManager`**: Interface for building and managing dependencies

#### Key Features

```typescript
// Container supports both singleton and transient dependencies
container.registerBuilder(myFunction, dependencies, name, isSingleton);

// Testable containers allow dependency replacement
testableContainer.replaceBuilder(mockFunction, dependencies, name);
testableContainer.replaceValue(mockValue, name);
```

#### Container Lifecycle

1. **Production Container**: Automatically discovers and registers all modules from the `dist` folder
2. **Testable Container**: Creates isolated copies that support dependency replacement
3. **Dependency Resolution**: Handles complex dependency trees with circular dependency detection
4. **Caching**: Singleton dependencies are cached to ensure single instances

### 2. Builder Pattern System

#### Test Helpers Architecture

The `testHelpers.ts` file implements a comprehensive builder system that creates different levels of the processing pipeline:

```typescript
const testable = {
    document: { resultBuilder: newDocumentResultBuilder },
    token: { parserBuilder: newTokenResultParserBuilder, resultBuilder: newTokenResultBuilder },
    ast: { parserBuilder: newAstParserBuilder, resultBuilder: newAstResultBuilder },
    doculisp: { parserBuilder: newDoculispParserBuilder, resultBuilder: newDoculispResultBuilder },
    include: { parserBuilder: newIncludeParserBuilder, resultBuilder: newIncludeResultBuilder },
    stringWriter: { writer: newStringWriterBuilder, resultBuilder: newStringWriterResultBuilder }
};
```

#### Pipeline Stages

1. **Document Parser**: Parses raw text into document structures
2. **Tokenizer**: Converts documents into tokens
3. **AST Parser**: Builds abstract syntax trees from tokens
4. **Doculisp Parser**: Processes Doculisp-specific constructs
5. **Include Builder**: Handles external file inclusions
6. **String Writer**: Converts processed AST back to text/markdown

#### Builder Functions

Each builder function follows this pattern:

```typescript
function newBuilderType(
    container: IContainer, 
    setup: (environment: ITestableContainer) => void = () => {}
): BuilderReturnType {
    return newBuilder(container, setup, environment => {
        return buildActualComponent(environment);
    });
}
```

### 3. Fake Dependency Management

#### Dependency Replacement Strategies

The system supports multiple replacement strategies:

```typescript
// Replace with mock functions
environment.replaceBuilder(mockFunction, dependencies, name);

// Replace with values
environment.replaceValue(mockValue, name);

// Replace Node.js packages
environment.replacePackageBuilder(mockPackage, name);
environment.replacePackageValue(mockPackageValue, name);
```

#### Common Mock Patterns

**File System Mocking**:
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
environment.replaceBuilder(() => fileHandler, [], 'fileHandler', false);
```

**Path Constructor Mocking**:
```typescript
const pathHandler: PathConstructor = function (filePath): IPath {
    return buildPath(filePath);
};
environment.replaceValue(pathHandler, 'pathConstructor');
```

### 4. Approval Testing Integration

#### Approval Testing Setup

The project uses the `approvals` library for snapshot testing:

```typescript
import { getVerifiers } from "../tools";
import { configure } from "approvals/lib/config";

const verifiers = getVerifiers(configure);
verifyAsJson = verifiers.verifyAsJson;
verifyMarkdown = verifiers.verifyMarkdown;
```

#### Verification Patterns

**JSON Verification**:
```typescript
const result = parser.parse(tokens);
verifyAsJson(result);
```

**Markdown Verification**:
```typescript
function verifyMarkdownResult(textMaybe: Result<string>, options?: Options): void {
    if(textMaybe.success) {
        verifyMarkdown(textMaybe.value, options);
    } else {
        verifyAsJson(textMaybe, options);
    }
}
```

#### Order Normalization

The `tools.ts` provides an `order` function that normalizes object properties for consistent comparisons:

```typescript
export function order<T>(thing: T): T {
    // Handles arrays, objects, primitives, and custom types
    // Sorts object keys and recursively orders nested structures
    // Filters out private properties (starting with '_')
}
```

## Testing Patterns

### 1. Unit Testing Pattern

```typescript
describe('component name', () => {
    let verifyAsJson: (data: any, options?: Options) => void;
    let toResult: (input: InputType) => Result<OutputType>;
    let util: IUtil;

    beforeAll(() => {
        verifyAsJson = getVerifier(configure);
    });

    beforeEach(() => {
        toResult = testable.component.resultBuilder(container, environment => {
            // Setup mocks and dependencies
            util = environment.buildAs<IUtil>('util');
            
            // Replace dependencies as needed
            environment.replaceValue(mockValue, 'dependencyName');
        });
    });

    it('should handle specific scenario', () => {
        const input = createTestInput();
        const result = toResult(input);
        verifyAsJson(result);
    });
});
```

### 2. Integration Testing Pattern

```typescript
describe('integration tests', () => {
    let toExternalResult: (text: string, location: IProjectLocation) => Result<OutputType>;
    let addPathResult: (filePath: string, result: Result<string>) => void;

    beforeEach(() => {
        toExternalResult = testable.include.includeResultBuilder(container, environment => {
            // Setup file system mocks
            let pathToResult: IDictionary<Result<string>> = {};
            addPathResult = (filePath: string, result: Result<string>): void => {
                pathToResult[filePath] = result;
            };

            const fileHandler: IFileLoader = {
                load(filePath: IPath): Result<string> {
                    return pathToResult[filePath.fullName] || 
                           util.fail(`filePath has not been setup.`, filePath);
                }
            };
            environment.replaceBuilder(() => fileHandler, [], 'fileHandler');
        });
    });

    it('should handle complex file inclusion', () => {
        // Setup mock files with proper Doculisp syntax (following AI Assistant Codex)
        const childContent = `<!-- (dl (section-meta Child Section)) -->
<!-- (dl (# Child Content)) -->
This is child content.`;
        
        const grandchildContent = `<!-- (dl (section-meta Grandchild Section)) -->
<!-- (dl (## Grandchild Details)) -->
This is grandchild content.`;

        addPathResult('child.md', ok(childContent));
        addPathResult('grandchild.md', ok(grandchildContent));

        const result = toExternalResult(mainContent, location);
        verifyAsJson(result);
    });
});
```

### 3. Error Handling Testing

```typescript
it('should handle file system errors', () => {
    const expectedError = fail('file not found', buildPath('missing.md'));
    addPathResult('missing.md', expectedError);

    const result = toExternalResult(documentWithMissingInclude, location);
    expect(result).toBe(expectedError);
});
```

## Best Practices

### 1. Test Structure

- **Arrange**: Set up test data and mock dependencies
- **Act**: Execute the functionality being tested
- **Assert**: Verify results using approval testing

### 2. Doculisp Test Data Creation

- **Reference AI Assistant Codex**: Always consult `AI-Assistant-Codex.md` when creating Doculisp test structures
- **Follow file type rules**: Use `.dlisp` for structure-only tests, `.md` with HTML comments for content tests
- **Use proper syntax**: Follow the codex guidelines for block structure, parameter formatting, and nesting
- **Test edge cases**: Include tests for malformed syntax, invalid file types, and boundary conditions
- **Validate expected patterns**: Ensure test Doculisp follows the documented best practices and conventions

### 3. Dependency Management

- Always use `buildTestable()` to create isolated test containers
- Use `restoreAll()` to reset dependencies between tests
- Replace dependencies at the appropriate abstraction level

### 4. Mock Strategy

- **File System**: Mock file operations with in-memory dictionaries
- **External Services**: Replace with controlled mock implementations
- **Utility Functions**: Replace with simplified test versions

### 5. Approval Testing

- Use JSON verification for complex object structures
- Use Markdown verification for text output
- Normalize data with the `order()` function for consistent comparisons

### 6. Error Testing

- Test both success and failure paths
- Use the same error objects throughout the chain
- Verify error propagation through the pipeline

## Advanced Patterns

### 1. Complex Dependency Replacement

```typescript
beforeEach(() => {
    toResult = testable.stringWriter.resultBuilder(container, environment => {
        // Replace multiple dependencies
        environment.replaceValue(mockPathConstructor, 'pathConstructor');
        environment.replaceBuilder(() => mockFileHandler, [], 'fileHandler');
        
        // Get references to replaced dependencies
        util = environment.buildAs<IUtil>('util');
        variableTable = environment.buildAs<IVariableTestable>('variableTable');
        variableTable.clear();
    });
});
```

### 2. Chained Pipeline Testing

```typescript
function rawStringWriterResultBuilder(
    environment: ITestableContainer, 
    text: string, 
    location: IProjectLocation
): () => Result<string> {
    const includeBuilder = rawAstRecursiveExternalResultBuilder(environment, text, location);
    const stringWriter = buildStringWriter(environment);
    const variableTable = environment.buildAs<IVariableRetriever>('variableTable');

    return map(includeBuilder, result => stringWriter.writeAst(result, variableTable));
}
```

### 3. Variable Table Management

```typescript
beforeEach(() => {
    variableTable = environment.buildAs<IVariableTestable>('variableTable');
    variableTable.clear(); // Reset state between tests
});
```

## Configuration

### Jest Configuration

```javascript
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePathIgnorePatterns: ['dist']
};
```

### Approval Testing Configuration

```typescript
configure({
    reporters: [new JestReporter()],
    errorOnStaleApprovedFiles: true,
    failOnLineEndingDifferences: false,
    normalizeLineEndingsTo: '\n',
    appendEOL: true,
    EOL: '\n',
});
```

## Benefits of This Architecture

1. **Isolation**: Each test runs in complete isolation with its own dependency graph
2. **Flexibility**: Easy to mock any dependency at any level
3. **Maintainability**: Changes to implementation don't break tests unnecessarily
4. **Comprehensiveness**: Complex integration scenarios can be tested reliably
5. **Debugging**: Clear separation between components makes issues easier to isolate
6. **Scalability**: New components can be easily integrated into the testing framework

This testing architecture represents a sophisticated approach to testing complex document processing pipelines while maintaining flexibility, reliability, and maintainability.