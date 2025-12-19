<!-- GENERATED DOCUMENT DO NOT EDIT! -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- Compiled with doculisp https://www.npmjs.com/package/doculisp -->
<!-- Written By: Jason Kerney -->
<!-- Written By: GitHub Copilot -->

# DoculispTypeScript API Guide #

## Contents ##

1. [Introduction](#introduction)
2. [Document Parser](#document-parser)
3. [Tokenizer](#tokenizer)
4. [AST Parser](#ast-parser)
5. [DoculispTypeScript Public Types](#doculisptypescript-public-types)

## Introduction ##

The DoculispTypeScript API is designed around several core philosophical principles that make it powerful, predictable, and maintainable. Understanding these principles will help you use the API effectively and write robust code.

### Immutability and Functional Design ###

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

### Result-Based Error Handling ###

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

### Pipeline Architecture ###

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

### Dependency Injection and Testability ###

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

### Location-Aware Processing ###

Every piece of data maintains **precise location information** (file, line, character) throughout processing:

- **Meaningful error messages** show exactly where problems occur
- **IDE integration** enables click-to-navigate error locations
- **Debug-friendly** - trace any value back to its source
- **User-friendly** - errors point to specific locations in source files

### Modular and Extensible Design ###

The API is built for **composition and extension**:

- **Small, focused interfaces** that do one thing well
- **Builder patterns** for complex object construction
- **Abstract interfaces** that allow custom implementations
- **Minimal coupling** between components

This philosophy makes the DoculispTypeScript API both powerful for complex documentation workflows and approachable for simple use cases. Each design decision prioritizes **reliability**, **maintainability**, and **developer experience**.

## Document Parser ##

The **Document Parser** is the first stage of the Doculisp processing pipeline, responsible for analyzing raw document content and distinguishing between regular markdown text and embedded Doculisp code blocks.

#### Core Purpose ####

The Document Parser's primary intent is to **separate content types** within mixed-content documents:

- **Markdown Content** - Regular text that should be preserved as-is in the output
- **Doculisp Blocks** - Code sections that need to be processed through the Doculisp pipeline
- **Location Tracking** - Maintain precise source positions for both content types

This separation enables Doculisp's **dual-mode capability** where documents can contain both static content and dynamic Doculisp instructions.

#### Content Recognition ####

### Doculisp Block Detection

The parser identifies Doculisp blocks using specific markers:

**In `.md` files (HTML Comment Syntax):**
```markdown
Regular markdown content here.

<!-- (dl
    (section-meta
        (title My Document)
    )
) -->

More markdown content.

<!-- (dl (# Dynamic Heading)) -->

Final markdown content.
```

**In `.dlisp` files (Raw Syntax):**
```doculisp
(section-meta
    (title My Document)
    (include
        (Section ./content.md)
    )
)
```

#### Content Type Classification ####

The parser classifies content into two distinct types:

1. **`IText` Parts** - Continuous markdown/text content
2. **`ILispBlock` Parts** - Doculisp code requiring processing

```typescript
type DocumentPart = IText | ILispBlock;

interface DocumentMap {
    readonly parts: DocumentPart[];
    readonly projectLocation: IProjectLocation;
}
```

For complete type definitions, see [DocumentPart](#documentpart) and [DocumentMap](#documentmap) in the types documentation.

#### Processing Strategy ####

##### Mixed Content Handling #####

The Document Parser enables **seamless integration** of static and dynamic content:

**Example Input:**
```markdown
# Project Overview
This is a traditional markdown section.

<!-- (dl (section-meta
    (title Dynamic Documentation)
    (include
        (Installation ./_install.md)
        (Usage ./_usage.md)
    )
)) -->

## Static Conclusion
This concluding text remains unchanged.

<!-- (dl (content (toc numbered-labeled))) -->
```

**Parser Output Structure:**
1. **Text Part**: `"# Project Overview\nThis is a traditional markdown section.\n"`
2. **Lisp Part**: `"(section-meta (title Dynamic Documentation) (include ...))`
3. **Text Part**: `"## Static Conclusion\nThis concluding text remains unchanged.\n"`
4. **Lisp Part**: `"(content (toc numbered-labeled))"`

#### Location Preservation ####

Every part maintains **precise location information**:

```typescript
interface DocumentPart {
    readonly type: 'text' | 'lisp';
    readonly content: string;
    readonly location: ILocation;  // Exact position in source file
}
```

See [ILocation](#ilocation) for detailed location tracking capabilities.

This enables:
- **Accurate error reporting** - Point to exact line and character
- **IDE integration** - Navigate directly to problem locations
- **Debugging support** - Trace output back to source

#### Parser Interface ####

The Document Parser follows the API's functional design pattern:

```typescript
type DocumentParser = (
    content: string,
    projectLocation: IProjectLocation
) => Result<DocumentMap>;
```

**Parameters:**
- **`content`** - Raw document text content
- **`projectLocation`** - File context for error reporting (see [IProjectLocation](#iprojectlocation))

**Return Value:**
- **[`Result<DocumentMap>`](#resultt)** - Success with parsed structure or detailed failure

#### Error Handling ####

The parser provides **comprehensive error reporting** for:

- **Malformed HTML comments** - Invalid `<!-- (dl ...) -->` syntax
- **Unclosed blocks** - Missing closing comment tags
- **Nested comment issues** - Improper HTML comment nesting
- **Character encoding problems** - Unicode or encoding issues

**Example Error:**
```typescript
{
    success: false,
    message: "Unclosed Doculisp block starting at line 15",
    documentPath: sourcePath,
    processingStep: "Document Parsing",
    failureCategory: "Parse Error"
}
```

#### Integration with Pipeline ####

The Document Parser serves as the **foundation** for the entire Doculisp processing pipeline:

1. **[Document Parser](#documentparser)** → [`DocumentMap`](#documentmap) (mixed content parts)
2. **[Tokenizer](#tokenfunction)** → [`TokenizedDocument`](#tokenizeddocument) (Lisp parts become tokens)
3. **[AST Parser](#iastparser)** → [`RootAst`](#rootast) (tokens become syntax tree)
4. **[Semantic Parser](#idoculispparser)** → [`IDoculisp`](#idoculisp) (AST becomes semantic structure)
5. **[Include Builder](#iincludebuilder)** → [`ISectionWriter`](#isectionwriter) (resolve external dependencies)
6. **[String Writer](#istringwriter)** → Final markdown output

By cleanly separating content types at the beginning, the Document Parser enables the rest of the pipeline to focus purely on Doculisp processing while preserving markdown content exactly as authored.

This design supports Doculisp's core philosophy of **gradual adoption** - documents can start as pure markdown and incrementally add Doculisp features without breaking existing content.

## Tokenizer ##

The **Tokenizer** is the second stage of the Doculisp processing pipeline, responsible for breaking down Doculisp code blocks into discrete, typed tokens that can be parsed into an Abstract Syntax Tree.

#### Core Purpose ####

The Tokenizer transforms the Doculisp parts extracted by the Document Parser into a **structured token stream**:

- **Lexical Analysis** - Break Doculisp code into meaningful units
- **Token Classification** - Assign specific types to each token
- **Location Tracking** - Maintain precise source positions for every token
- **Syntax Preparation** - Prepare tokens for AST parsing

This tokenization enables the **structured parsing** of Doculisp's Lisp-inspired syntax while preserving complete location information for error reporting.

#### Token Types ####

The Tokenizer produces four distinct types of tokens, each serving a specific purpose in Doculisp syntax:

##### Text Tokens #####

**`TextToken`** - Represents regular text content outside of Lisp expressions:

```typescript
interface TextToken {
    readonly type: 'text';
    readonly content: string;
    readonly location: ILocation;
}
```

**Usage:** Text that appears between Doculisp blocks or at the document level.

##### Identifier Tokens #####

**`IdentifierToken`** - Represents Doculisp commands and identifiers:

```typescript
interface IdentifierToken {
    readonly type: 'identifier';
    readonly identifier: string;
    readonly location: ILocation;
}
```

**Examples:** `section-meta`, `title`, `include`, `content`, `toc`, `#`, `##`

##### Parameter Tokens #####

**`ParameterToken`** - Represents parameter values passed to Doculisp commands:

```typescript
interface ParameterToken {
    readonly type: 'parameter';
    readonly parameter: string;
    readonly location: ILocation;
}
```

**Examples:** `"My Document Title"`, `"./path/to/file.md"`, `"numbered-labeled"`

##### Structural Tokens #####

**`CloseParenthesisToken`** - Represents closing parentheses that end Lisp expressions:

```typescript
interface CloseParenthesisToken {
    readonly type: 'close-parenthesis';
    readonly location: ILocation;
}
```

**Purpose:** Marks the end of Lisp expressions and enables proper nesting.

#### Tokenization Process ####

##### Input Processing #####

The Tokenizer receives a [`DocumentMap`](#documentmap) and processes only the Doculisp parts:

**Example Doculisp Code:**
```doculisp
(section-meta
    (title My Document)
    (include
        (Getting-Started ./getting-started.md)
        (Advanced ./advanced.md)
    )
)
```

**Token Stream Output:**
1. **IdentifierToken**: `"section-meta"`
2. **IdentifierToken**: `"title"`
3. **ParameterToken**: `"My Document"`
4. **CloseParenthesisToken**: `)`
5. **IdentifierToken**: `"include"`
6. **IdentifierToken**: `"Getting-Started"`
7. **ParameterToken**: `"./getting-started.md"`
8. **CloseParenthesisToken**: `)`
9. **IdentifierToken**: `"Advanced"`
10. **ParameterToken**: `"./advanced.md"`
11. **CloseParenthesisToken**: `)`
12. **CloseParenthesisToken**: `)`
13. **CloseParenthesisToken**: `)`

##### Location Preservation #####

Every token maintains **precise source location** information:

```typescript
interface ILocation {
    readonly documentPath: IPath;
    readonly line: number;
    readonly char: number;
    // ... additional properties
}
```

This enables:
- **Exact error positioning** - Point to specific characters in source files
- **IDE integration** - Navigate directly to token locations
- **Debugging support** - Trace tokens back to original source

#### Tokenizer Interface ####

The Tokenizer follows the API's functional design pattern:

```typescript
type TokenFunction = (input: DocumentMap) => Result<TokenizedDocument>;
```

**Input:**
- **[`DocumentMap`](#documentmap)** - Mixed content from Document Parser

**Output:**
- **[`Result<TokenizedDocument>`](#resultt)** - Success with tokens or detailed failure

### TokenizedDocument Structure

The tokenizer produces a [`TokenizedDocument`](#tokenizeddocument) containing:

```typescript
interface TokenizedDocument {
    readonly tokens: Token[];
    readonly projectLocation: IProjectLocation;
}
```

**Properties:**
- **Token array** - Sequential list of all tokens in processing order
- **Project context** - Location information for error reporting
- **Immutable structure** - Read-only token stream for safe processing

#### Error Handling ####

The Tokenizer provides **comprehensive error detection** for common syntax issues:

##### Syntax Errors #####

- **Unmatched parentheses** - Missing opening or closing parentheses
- **Invalid characters** - Characters that break Doculisp syntax rules
- **Malformed expressions** - Improperly structured Lisp expressions
- **Encoding issues** - Unicode or character encoding problems

**Example Error:**
```typescript
{
    success: false,
    message: "Unmatched closing parenthesis at line 8, character 15",
    documentPath: sourcePath,
    processingStep: "Tokenization",
    failureCategory: "Parse Error"
}
```

##### Parameter Validation #####

- **Parameter length limits** - Enforce 255 character maximum
- **Newline detection** - Parameters cannot contain newlines
- **Escape sequence handling** - Proper handling of `\)` and other escapes

#### Integration with Pipeline ####

The Tokenizer serves as the **bridge** between textual content and structured parsing:

**Pipeline Flow:**
1. **[Document Parser](#documentparser)** → [`DocumentMap`](#documentmap) (separate content types)
2. **[Tokenizer](#tokenfunction)** → [`TokenizedDocument`](#tokenizeddocument) (structured tokens)
3. **[AST Parser](#iastparser)** → [`RootAst`](#rootast) (syntax tree)
4. **[Semantic Parser](#idoculispparser)** → [`IDoculisp`](#idoculisp) (semantic meaning)

##### Token Stream Benefits #####

The tokenized representation provides several advantages:

- **Structured Access** - Random access to any token by index
- **Type Safety** - Each token has a specific, known type
- **Location Precision** - Every token knows its exact source position
- **Parser Preparation** - Tokens are ready for recursive descent parsing

##### Lisp Syntax Support #####

The Tokenizer is specifically designed for **Doculisp's Lisp-inspired syntax**:

- **S-expressions** - Parenthesized expressions with nested structure
- **Commands and parameters** - Clear distinction between identifiers and values
- **Whitespace handling** - Flexible whitespace rules for readability
- **Comment support** - Handles commented-out blocks with `*` prefix

This tokenization approach enables Doculisp to maintain its **clean, readable syntax** while providing the structural foundation needed for reliable parsing and error reporting.

## AST Parser ##

The **AST Parser** is the third stage of the Doculisp processing pipeline, responsible for transforming the linear token stream into a hierarchical Abstract Syntax Tree (AST) that represents the structural relationships of Doculisp expressions.

#### Core Purpose ####

The AST Parser converts tokenized Doculisp code into a **non-semantic, structurally-validated tree**:

- **Hierarchical Structure** - Transform flat token stream into nested tree
- **Syntax Validation** - Ensure proper Lisp expression structure without interpreting meaning
- **Shape Validation** - Verify basic structural correctness of expressions
- **Foundation Building** - Create a clean, validated structure for semantic processing

This transformation from linear tokens to a **structurally-sound tree** makes semantic analysis much easier in subsequent pipeline stages by ensuring the basic shape of the code is correct.

#### AST Node Architecture ####

The AST Parser creates a tree of strongly-typed nodes that represent the **structural shape** of Doculisp syntax without interpreting semantic meaning:

##### Core AST Union #####

All AST nodes are part of the [`CoreAst`](#coreast) union type:

```typescript
type CoreAst = IdentifierAst | IAstValue;
```

##### Value Nodes #####

**[`IAstValue`](#iastvalue)** - Represents literal values and parameters:

```typescript
interface IAstValue {
    readonly type: 'value';
    readonly value: string;
    readonly location: ILocation;
}
```

**Usage:** Parameter values like `"My Document Title"`, `"./path/to/file.md"`, `"numbered-labeled"`

##### Identifier Nodes #####

**[`IAstIdentifier`](#iastidentifier)** - Represents Doculisp commands and identifiers:

```typescript
interface IAstIdentifier {
    readonly type: 'identifier';
    readonly identifier: string;
    readonly location: ILocation;
}
```

**Usage:** Commands like `section-meta`, `title`, `include`, `content`

##### Command Nodes #####

**[`IAstCommand`](#iastcommand)** - Represents commands with their parameters:

```typescript
interface IAstCommand {
    readonly type: 'command';
    readonly identifier: string;
    readonly parameters: CoreAst[];
    readonly location: ILocation;
}
```

**Usage:** Complete expressions like `(title My Document)`, `(include (Section ./file.md))`

##### Container Nodes #####

**[`IAstContainer`](#iastcontainer)** - Represents nested groupings:

```typescript
interface IAstContainer {
    readonly type: 'container';
    readonly children: CoreAst[];
    readonly location: ILocation;
}
```

**Usage:** Nested structures and complex expressions with multiple levels

#### Parsing Process ####

##### Token Stream to Tree Transformation #####

The AST Parser processes the [`TokenizedDocument`](#tokenizeddocument) using **recursive descent parsing**:

**Example Token Stream:**
```
[IdentifierToken: "section-meta"]
[IdentifierToken: "title"]
[ParameterToken: "My Document"]
[CloseParenthesisToken: ")"]
[CloseParenthesisToken: ")"]
```

**Generated AST Structure:**
```typescript
{
  type: 'command',
  identifier: 'section-meta',
  parameters: [
    {
      type: 'command',
      identifier: 'title',
      parameters: [
        {
          type: 'value',
          value: 'My Document',
          location: {...}
        }
      ],
      location: {...}
    }
  ],
  location: {...}
}
```

##### Nested Expression Handling #####

The parser handles **arbitrarily deep nesting** of Doculisp expressions:

**Input:**
```doculisp
(section-meta
    (include
        (Getting-Started ./start.md)
        (Advanced
            (Deep-Topic ./deep.md)
            (Expert-Level ./expert.md)
        )
    )
)
```

**Tree Structure:**
- **Root Command**: `section-meta`
  - **Child Command**: `include`
    - **Child Command**: `Getting-Started` → `./start.md`
    - **Child Command**: `Advanced`
      - **Child Command**: `Deep-Topic` → `./deep.md`
      - **Child Command**: `Expert-Level` → `./expert.md`

#### Parser Interface ####

The AST Parser implements the [`IAstParser`](#iastparser) interface:

```typescript
interface IAstParser {
    parse(tokenizedDocument: TokenizedDocument): Result<RootAst>;
}
```

**Input:**
- **[`TokenizedDocument`](#tokenizeddocument)** - Structured tokens from Tokenizer

**Output:**
- **[`Result<RootAst>`](#resultt)** - Success with AST or detailed failure

##### RootAst Structure #####

The parser produces a [`RootAst`](#rootast) containing the complete tree:

```typescript
interface RootAst {
    readonly ast: CoreAst[];
    readonly projectLocation: IProjectLocation;
}
```

**Properties:**
- **AST array** - Top-level AST nodes (multiple root expressions allowed)
- **Project context** - Location information for error reporting
- **Immutable structure** - Read-only tree for safe processing

#### Syntax Validation ####

The AST Parser performs **comprehensive syntax validation** during tree construction:

##### Structural Validation #####

- **Balanced parentheses** - Ensure all expressions are properly closed
- **Valid nesting** - Check that nested structures are syntactically correct
- **Command structure** - Validate that commands have appropriate parameters
- **Expression completeness** - Ensure no incomplete or malformed expressions

##### Error Detection #####

**Common syntax errors detected:**

- **Unmatched parentheses** - Missing opening or closing parentheses
- **Invalid token sequences** - Tokens that don't form valid expressions
- **Malformed commands** - Commands with incorrect parameter structure
- **Nested expression errors** - Problems in deeply nested structures

**Example Error:**
```typescript
{
    success: false,
    message: "Expected closing parenthesis for expression starting at line 5, character 8",
    documentPath: sourcePath,
    processingStep: "AST Parsing",
    failureCategory: "Parse Error"
}
```

#### Location Preservation ####

Every AST node maintains **complete location tracking**:

```typescript
interface ILocation {
    readonly documentPath: IPath;
    readonly documentDepth: number;
    readonly documentIndex: number;
    readonly line: number;
    readonly char: number;
}
```

**Benefits:**
- **Precise error reporting** - Point to exact characters where problems occur
- **IDE integration** - Enable click-to-navigate from errors to source
- **Debugging support** - Trace any AST node back to its original source location
- **Tool development** - Enable rich development tools and language servers

#### Integration with Pipeline ####

The AST Parser serves as the **structural validation layer** that prepares clean, validated syntax trees for semantic analysis:

**Pipeline Flow:**
1. **[Document Parser](#documentparser)** → [`DocumentMap`](#documentmap) (content separation)
2. **[Tokenizer](#tokenfunction)** → [`TokenizedDocument`](#tokenizeddocument) (lexical analysis)
3. **[AST Parser](#iastparser)** → [`RootAst`](#rootast) (non-semantic syntax tree)
4. **[Semantic Parser](#idoculispparser)** → [`IDoculisp`](#idoculisp) (semantic meaning interpretation)

##### Tree Processing Benefits #####

The non-semantic AST provides several advantages for downstream semantic processing:

- **Clean structure** - Guaranteed syntactically correct tree for semantic analysis
- **Shape validation** - Basic structural errors caught before semantic processing
- **Simplified semantics** - Semantic parsers can focus on meaning, not syntax
- **Early error detection** - Structural problems identified before complex semantic analysis

##### Lisp Expression Support #####

The AST Parser is specifically designed for **Doculisp's Lisp-inspired syntax**:

- **S-expressions** - Full support for parenthesized expressions
- **Command-parameter structure** - Clear distinction between commands and their arguments
- **Arbitrary nesting** - Handle deeply nested expressions without limits
- **Multiple roots** - Support documents with multiple top-level expressions

This **non-semantic AST representation** provides a clean, structurally-validated foundation that makes semantic analysis much easier by ensuring the basic shape and syntax of Doculisp documents is correct before any meaning interpretation begins.

## DoculispTypeScript Public Types ##

### Contents ###

* [Result and Error Handling Types](#result-and-error-handling-types)
* [Data Structure Types](#data-structure-types)
* [Utility and Support Types](#utility-and-support-types)
* [Pipeline Component Types](#pipeline-component-types)

### Result and Error Handling Types ###

The DoculispTypeScript API uses a **Result pattern** for explicit error handling rather than throwing exceptions. This approach makes error states visible in type signatures and enables safe, composable error handling throughout the processing pipeline.

##### Core Result Types #####

###### `Result<T>` ######

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

###### `ISuccess<T>` ######

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

###### `IFail` ######

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

##### Error Classification Types #####

###### `FailureCategory` ######

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

###### `ProcessingStep` ######

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

##### Error Handling Patterns #####

###### Safe Chaining ######

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

###### Comprehensive Context ######

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

###### Type-Safe Error Handling ######

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

### Data Structure Types ###

* [Token and Parsing Types](#token-and-parsing-types)
* [AST Node Types](#ast-node-types)
* [Doculisp Semantic Types](#doculisp-semantic-types)
* [Project and Document Types](#project-and-document-types)
* [Configuration and Variable Types](#configuration-and-variable-types)

#### Token and Parsing Types ####

These types represent the fundamental building blocks for tokenizing and parsing Doculisp source code.

###### `Token` ######

Union type representing all possible token types in Doculisp:

```typescript
type Token = TextToken | CloseParenthesisToken | IdentifierToken | ParameterToken;
```

**Component Types:**
- **`TextToken`** - Regular text content outside Doculisp blocks
- **`IdentifierToken`** - Doculisp identifiers (commands, block names)
- **`ParameterToken`** - Parameter values passed to Doculisp commands
- **`CloseParenthesisToken`** - Closing parenthesis tokens

###### `TokenizedDocument` ######

Container that holds the tokenized representation of a document with location information:

```typescript
interface TokenizedDocument {
    readonly tokens: Token[];
    readonly projectLocation: IProjectLocation;
}
```

**Key Features:**
- **Token array** - Sequential list of all tokens in document order
- **Location context** - Project-level location information for error reporting
- **Immutable structure** - Prevents accidental modification during processing

###### `TokenFunction` ######

Function type for the tokenization process:

```typescript
type TokenFunction = (input: DocumentMap) => Result<TokenizedDocument>;
```

**Usage:**
- **Input** - `DocumentMap` containing parsed document structure
- **Output** - `Result<TokenizedDocument>` with success/failure handling
- **Error handling** - Returns detailed failure information on tokenization errors

#### AST Node Types ####

These types represent the Abstract Syntax Tree (AST) nodes that form the structural representation of parsed Doculisp code.

###### `CoreAst` ######

Union type representing all core AST node types:

```typescript
type CoreAst = IdentifierAst | IAstValue;
```

**Component Types:**
- **`IdentifierAst`** - AST nodes representing identifiers and commands
- **`IAstValue`** - AST nodes representing literal values

###### `RootAst` ######

Root container for an entire AST with project location context:

```typescript
interface RootAst {
    readonly ast: CoreAst[];
    readonly projectLocation: IProjectLocation;
}
```

**Key Features:**
- **AST array** - Top-level AST nodes in document order
- **Project context** - Location information for error reporting and debugging
- **Immutable structure** - Read-only AST representation

###### `IAstValue` ######

Represents literal values in the AST:

```typescript
interface IAstValue {
    readonly type: 'value';
    readonly value: string;
    readonly location: ILocation;
}
```

**Properties:**
- **Type discriminator** - Identifies this as a value node
- **String value** - The literal text content
- **Location tracking** - Precise source location for error reporting

###### `IAstIdentifier` ######

Represents identifier nodes (commands, block names):

```typescript
interface IAstIdentifier {
    readonly type: 'identifier';
    readonly identifier: string;
    readonly location: ILocation;
}
```

**Properties:**
- **Type discriminator** - Identifies this as an identifier node
- **Identifier text** - The identifier string
- **Location tracking** - Source location for debugging

###### `IAstCommand` ######

Represents command nodes with parameters:

```typescript
interface IAstCommand {
    readonly type: 'command';
    readonly identifier: string;
    readonly parameters: CoreAst[];
    readonly location: ILocation;
}
```

**Properties:**
- **Command identifier** - The command name
- **Parameter array** - Child AST nodes representing parameters
- **Location tracking** - Source position for error reporting

###### `IAstContainer` ######

Represents container nodes that group other AST elements:

```typescript
interface IAstContainer {
    readonly type: 'container';
    readonly children: CoreAst[];
    readonly location: ILocation;
}
```

**Properties:**
- **Child nodes** - Array of contained AST elements
- **Hierarchical structure** - Enables nested Doculisp blocks
- **Location context** - Position information for debugging

#### Doculisp Semantic Types ####

These types represent the semantic structure of Doculisp documents after AST processing, providing meaning to the parsed syntax.

###### `DoculispPart` ######

Union type representing all semantic elements in a Doculisp document:

```typescript
type DoculispPart = IWrite | ITitle | ITableOfContents | IContentLocation | IHeader | IPathId;
```

**Component Types:**
- **`IWrite`** - Text content to be written to output
- **`ITitle`** - Document or section titles
- **`ITableOfContents`** - Table of contents configuration
- **`IContentLocation`** - Content placement markers
- **`IHeader`** - Dynamic heading elements
- **`IPathId`** - Path reference identifiers

###### `IDoculisp` ######

Complete Doculisp document structure containing all semantic parts:

```typescript
interface IDoculisp {
    readonly parts: DoculispPart[];
    readonly includes: ISectionWriter[];
    readonly projectLocation: IProjectLocation;
}
```

**Key Features:**
- **Semantic parts** - All processed Doculisp elements in order
- **Include resolution** - Resolved external document dependencies
- **Location context** - Project-level positioning for error handling

###### `ISectionWriter` ######

Root document structure with complete include hierarchy:

```typescript
interface ISectionWriter {
    readonly doculisp: IDoculisp;
    readonly variableTable: IVariableTable;
}
```

**Properties:**
- **Doculisp content** - Complete semantic document structure
- **Variable context** - Shared variable table for metadata and references
- **Include hierarchy** - Full resolution of external dependencies

###### `TocStyle` ######

Enumeration defining table of contents formatting options:

```typescript
type TocStyle =
    | 'no-table'
    | 'unlabeled'
    | 'labeled'
    | 'numbered'
    | 'numbered-labeled'
    | 'bulleted'
    | 'bulleted-labeled';
```

**Style Options:**
- **`no-table`** - No table of contents generated
- **`unlabeled`** - TOC without section names
- **`labeled`** - Section names only
- **`numbered`** - Numbered entries only
- **`numbered-labeled`** - Numbers with section names
- **`bulleted`** - Bullet points only
- **`bulleted-labeled`** - Bullets with section names

#### Project and Document Types ####

These types represent project-level structures and raw document parsing results.

###### `IDocument` ######

Represents a single document definition within a project:

```typescript
interface IDocument {
    readonly source: IPath;
    readonly output: IPath;
    readonly location: ILocation;
}
```

**Properties:**
- **Source path** - Input Doculisp file location
- **Output path** - Target markdown file destination
- **Location context** - Position in project file for error reporting

###### `IProject` ######

Container for multiple document definitions in a project:

```typescript
interface IProject {
    readonly documents: IDocument[];
    readonly projectLocation: IProjectLocation;
}
```

**Key Features:**
- **Document array** - All documents defined in the project
- **Batch processing** - Enables compilation of multiple documents
- **Project context** - Location information for project-level operations

###### `DocumentMap` ######

Parsed document structure containing both text and Doculisp parts:

```typescript
interface DocumentMap {
    readonly parts: DocumentPart[];
    readonly projectLocation: IProjectLocation;
}
```

**Properties:**
- **Document parts** - Sequential text and Lisp content blocks
- **Mixed content** - Supports documents with embedded Doculisp
- **Location tracking** - Project position for error context

###### `DocumentPart` ######

Union type representing content blocks within a document:

```typescript
type DocumentPart = IText | ILispBlock;
```

**Component Types:**
- **`IText`** - Regular markdown/text content
- **`ILispBlock`** - Doculisp code blocks for processing

**Usage Pattern:**
```typescript
// Process mixed content
documentMap.parts.forEach(part => {
    if (part.type === 'text') {
        // Handle regular text content
        processText(part.content);
    } else {
        // Handle Doculisp code blocks
        processLisp(part.lispContent);
    }
});
```

#### Configuration and Variable Types ####

These types manage configuration settings, variable storage, and metadata throughout the processing pipeline.

###### `IVariableTable` ######

Core interface for variable storage and retrieval:

```typescript
interface IVariableTable {
    addValue(key: string, value: Variable): void;
    getValue(key: string): Variable | undefined;
    hasValue(key: string): boolean;
    createChild(): IVariableTable;
}
```

**Key Methods:**
- **`addValue`** - Store variables with string keys
- **`getValue`** - Retrieve variables by key
- **`hasValue`** - Check for variable existence
- **`createChild`** - Create isolated child scope

###### `ITestableVariableTable` ######

Extended interface for testing scenarios with additional capabilities:

```typescript
interface ITestableVariableTable extends IVariableTable {
    exportAsJson(): Record<string, any>;
    clear(): void;
}
```

**Additional Methods:**
- **`exportAsJson`** - Export all variables for inspection
- **`clear`** - Reset table for test isolation
- **Testing support** - Enables verification and cleanup in tests

###### `Variable` ######

Union type representing all possible variable value types:

```typescript
type Variable =
    | IVariableId
    | IStringArray
    | IVariablePath
    | IVariableString;
```

**Variable Types:**
- **`IVariableId`** - Identifier references for linking
- **`IStringArray`** - Collections of string values
- **`IVariablePath`** - File path references
- **`IVariableString`** - Simple string values

###### `sourceKey` ######

Special constant for the source file variable key:

```typescript
const sourceKey: string;
```

**Purpose:**
- **Source tracking** - Identifies the current source file being processed
- **Error context** - Enables accurate error reporting with file information
- **Pipeline coordination** - Maintains source context across processing stages

###### `workingDirectoryKey` ######

Special constant for the working directory variable key:

```typescript
const workingDirectoryKey: string;
```

**Purpose:**
- **Path resolution** - Base directory for relative path calculations
- **Include processing** - Context for resolving external file dependencies
- **File operations** - Working directory for file system operations

**Usage Example:**
```typescript
// Set up variable context
const variables = container.buildAs<IVariableTable>('variableTable').createChild();
variables.addValue(sourceKey, { type: 'variable-path', value: sourcePath });
variables.addValue(workingDirectoryKey, { type: 'variable-path', value: workingDir });
```

### Utility and Support Types ###

* [Location and Positioning](#location-and-positioning)
* [File System Operations](#file-system-operations)
* [Text and String Processing](#text-and-string-processing)
* [General Utilities](#general-utilities)

#### Location and Positioning ####

These types handle source code locations, positioning, and coordinate tracking throughout the parsing and processing pipeline.

###### `ILocation` ######

Core interface for source code location with comparison capabilities:

```typescript
interface ILocation extends IProjectLocation, ILocationCoordinates, IComparable<ILocation> {
    increaseLine(by?: number): ILocation;
    increaseChar(by?: number): ILocation;
}
```

**Key Features:**
- **Project context** - Document path, depth, and index information
- **Coordinate tracking** - Line and character position
- **Immutable operations** - `increaseLine` and `increaseChar` return new instances
- **Comparison support** - Implements `IComparable<ILocation>` for ordering

**Usage Pattern:**
```typescript
// Move location forward
let currentLocation = initialLocation;
currentLocation = currentLocation.increaseChar(5);
currentLocation = currentLocation.increaseLine(1);
```

###### `ILocationCoordinates` ######

Interface defining line and character positioning within a document:

```typescript
interface ILocationCoordinates extends IProjectLocation {
    readonly line: number;
    readonly char: number;
}
```

**Properties:**
- **Line number** - 1-based line position in source file
- **Character number** - 1-based character position within line
- **Project context** - Inherited document path and hierarchy information

###### `IProjectLocation` ######

Interface representing project-level location context:

```typescript
interface IProjectLocation {
    readonly documentPath: IPath;
    readonly documentDepth: number;
    readonly documentIndex: number;
}
```

**Properties:**
- **Document path** - Full path to the source file
- **Document depth** - Nesting level in include hierarchy (0 = root)
- **Document index** - Sequential index for processing order

**Usage:**
- **Error reporting** - Provides context for where errors occurred
- **Include hierarchy** - Tracks nested document relationships
- **Processing coordination** - Maintains order across multiple files

###### `IRange` ######

Interface representing a range between two locations:

```typescript
interface IRange {
    readonly start: ILocationCoordinates;
    readonly end: ILocationCoordinates;
}
```

**Properties:**
- **Start position** - Beginning location of the range
- **End position** - Ending location of the range
- **Span definition** - Defines text or code spans within documents

#### File System Operations ####

These types provide abstracted file system operations for reading, writing, and path management.

###### `IPath` ######

Core interface for file path representation and manipulation:

```typescript
interface IPath {
    readonly fullPath: string;
    readonly extension: string;
    readonly fileName: string;
    readonly directoryPath: string;
    // Additional path manipulation methods...
}
```

**Key Features:**
- **Full path access** - Complete file system path
- **Extension handling** - File extension extraction and validation
- **Name extraction** - File name without path or extension
- **Directory operations** - Parent directory path access

###### `PathConstructor` ######

Factory function type for creating `IPath` instances:

```typescript
type PathConstructor = (pathString: string) => IPath;
```

**Usage:**
- **Path creation** - Convert string paths to `IPath` objects
- **Validation** - Ensures path format consistency
- **Abstraction** - Platform-independent path handling

**Example:**
```typescript
const pathConstructor = container.buildAs<PathConstructor>('pathConstructor');
const sourcePath = pathConstructor('./docs/readme.dlisp');
```

###### `IFileHandler` ######

Complete file system operations interface combining all file operations:

```typescript
interface IFileHandler extends IFileLoader, IFileWriter, IDirectoryHandler {
    // Combines all file system capabilities
}
```

**Capabilities:**
- **File reading** - Load file contents from disk
- **File writing** - Save content to files
- **Directory operations** - List, create, and manage directories
- **Unified interface** - Single point for all file system needs

###### `IFileLoader` ######

Interface for reading files from the file system:

```typescript
interface IFileLoader {
    loadFile(path: IPath): Promise<Result<string>>;
    fileExists(path: IPath): Promise<boolean>;
}
```

**Methods:**
- **`loadFile`** - Read file content as string with error handling
- **`fileExists`** - Check file existence without reading content
- **Async operations** - Non-blocking file system access

###### `IFileWriter` ######

Interface for writing files to the file system:

```typescript
interface IFileWriter {
    writeFile(path: IPath, content: string): Promise<Result<void>>;
}
```

**Methods:**
- **`writeFile`** - Save string content to specified path
- **Error handling** - Returns `Result<void>` for safe operation chaining
- **Async operations** - Non-blocking file writing

###### `IDirectoryHandler` ######

Interface for directory operations:

```typescript
interface IDirectoryHandler {
    listDirectory(path: IPath): Promise<Result<string[]>>;
    createDirectory(path: IPath): Promise<Result<void>>;
    directoryExists(path: IPath): Promise<boolean>;
}
```

**Methods:**
- **`listDirectory`** - Get directory contents as string array
- **`createDirectory`** - Create directory (including parent directories)
- **`directoryExists`** - Check directory existence
- **Path management** - Handle directory creation and traversal

#### Text and String Processing ####

These types provide efficient string construction and text manipulation capabilities for document generation.

###### `IStringBuilder` ######

Interface for efficient string construction with line management:

```typescript
interface IStringBuilder {
    append(text: string): IStringBuilder;
    appendLine(text?: string): IStringBuilder;
    toString(): string;
    readonly length: number;
    readonly lineCount: number;
}
```

**Key Features:**
- **Fluent interface** - Method chaining for readable code
- **Line management** - Track line count during construction
- **Efficient building** - Optimized for large string assembly
- **Length tracking** - Monitor string size during construction

**Usage Pattern:**
```typescript
const content = stringBuilder
    .appendLine('# Document Title')
    .appendLine()
    .append('Generated content: ')
    .append(dynamicValue)
    .appendLine()
    .toString();
```

###### `StringBuilderFactory` ######

Factory function type for creating `IStringBuilder` instances:

```typescript
type StringBuilderFactory = () => IStringBuilder;
```

**Purpose:**
- **Instance creation** - Generate new string builder objects
- **Isolation** - Each factory call creates independent builder
- **Dependency injection** - Allows swapping implementations for testing

**Example:**
```typescript
const createBuilder = container.buildAs<StringBuilderFactory>('stringBuilder');
const builder = createBuilder();
```

###### `ITextHelpers` ######

Interface providing text manipulation and processing utilities:

```typescript
interface ITextHelpers {
    normalize(text: string): string;
    escape(text: string): string;
    stripMarkdown(text: string): string;
    // Additional text processing methods...
}
```

**Capabilities:**
- **Text normalization** - Standardize whitespace and formatting
- **Escaping** - Handle special characters safely
- **Markdown processing** - Strip or convert markdown syntax
- **Content sanitization** - Prepare text for different output formats

###### `ISearchHelpers` ######

Interface for regular expression and text search operations:

```typescript
interface ISearchHelpers {
    findMatches(pattern: RegExp, text: string): RegExpMatchArray[];
    replaceAll(pattern: RegExp, text: string, replacement: string): string;
    // Additional search utilities...
}
```

**Features:**
- **Pattern matching** - Find all regex matches in text
- **Text replacement** - Replace patterns with new content
- **Search utilities** - Common text search and manipulation operations
- **Safe regex handling** - Wrapper for complex regular expression operations

#### General Utilities ####

These types provide core utility functions and interfaces used throughout the API.

###### `IUtil` ######

Core utility interface providing result creation and location management:

```typescript
interface IUtil {
    ok<T>(successfulValue: T): ISuccess<T>;
    fail(step: ProcessingStep): (category: FailureCategory) => (message: string, documentPath?: IPath) => IFail;
    location(documentPath: IPath, documentDepth: number, documentIndex: number, line: number, char: number): ILocation;
    toLocation(projectLocation: IProjectLocation, line: number, char: number): ILocation;
    getProjectLocation(location: ILocation): IProjectLocation;
}
```

**Key Methods:**
- **`ok`** - Create success results with values
- **`fail`** - Curried function for creating failure results with context
- **`location`** - Create location objects from coordinates
- **`toLocation`** - Convert project location to full location
- **`getProjectLocation`** - Extract project context from location

**Usage Pattern:**
```typescript
// Create success result
const success = util.ok(processedData);

// Create failure result with context
const failure = util.fail('Document Parsing')('Parse Error')('Invalid syntax at line 5');

// Create location
const location = util.location(filePath, 0, 0, 5, 10);
```

###### `IComparable<T>` ######

Generic interface for objects that can be compared and ordered:

```typescript
interface IComparable<T> {
    compare(other: T): IsOrder;
}
```

**Properties:**
- **Generic type** - Works with any comparable type
- **Order result** - Returns `IsBefore`, `IsSame`, or `IsAfter`
- **Sorting support** - Enables consistent ordering operations

###### `IsOrder` ######

Type representing comparison results for ordering:

```typescript
type IsOrder = IsBefore | IsSame | IsAfter;

// Where:
type IsBefore = -1;
type IsSame = 0;
type IsAfter = 1;
```

**Values:**
- **`IsBefore (-1)`** - First item comes before second
- **`IsSame (0)`** - Items are equal in ordering
- **`IsAfter (1)`** - First item comes after second

###### `IVersion` ######

Interface for accessing version information:

```typescript
interface IVersion {
    readonly major: number;
    readonly minor: number;
    readonly patch: number;
    readonly versionString: string;
}
```

**Properties:**
- **Semantic versioning** - Major, minor, and patch numbers
- **String representation** - Complete version string (e.g., "1.2.3")
- **Version comparison** - Enables version checking and compatibility

**Usage:**
```typescript
const version = container.buildAs<IVersion>('version');
console.log(`API Version: ${version.versionString}`);
```

###### `LocationBuilder` ######

Factory function type for creating location objects:

```typescript
type LocationBuilder = (line: number, char: number) => ILocation;
```

**Purpose:**
- **Location creation** - Generate location objects from coordinates
- **Context binding** - Pre-configured with document context
- **Simplified creation** - Reduced parameter count for common operations

###### `UtilBuilder` ######

Factory function type for creating utility instances:

```typescript
type UtilBuilder = () => IUtil;
```

**Purpose:**
- **Utility instantiation** - Create new utility objects
- **Dependency injection** - Allow different utility implementations
- **Testing support** - Enable utility mocking and replacement

### Pipeline Component Types ###

#### Contents ####

1. Core Pipeline Interfaces: [Core Pipeline Interfaces](#core-pipeline-interfaces)
2. Specialized Parsers: [Specialized Parsers](#specialized-parsers)
3. Dependency Injection: [Dependency Injection](#dependency-injection)

#### Core Pipeline Interfaces ####

These interfaces represent the main components that orchestrate the document compilation pipeline from source to output.

###### `IController` ######

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

###### `IIncludeBuilder` ######

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

###### `IStringWriter` ######

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

###### `IDocWriter` ######

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

#### Specialized Parsers ####

These parser interfaces handle the transformation of content through different stages of the processing pipeline.

###### `DocumentParser` ######

Function type for parsing raw document content into structured format:

```typescript
type DocumentParser = (content: string, projectLocation: IProjectLocation) => Result<DocumentMap>;
```

**Processing:**
- **Raw text input** - Accepts plain text document content
- **Content separation** - Identifies text content vs. Doculisp blocks
- **Structure creation** - Generates `DocumentMap` with mixed content parts
- **Location tracking** - Maintains precise source location information

**Output Structure:**
- **`DocumentPart[]`** - Array of text and Lisp content blocks
- **Project context** - Location information for error reporting
- **Mixed content support** - Handles documents with embedded Doculisp

###### `IAstParser` ######

Interface for converting tokenized content to Abstract Syntax Tree representation:

```typescript
interface IAstParser {
    parse(tokenizedDocument: TokenizedDocument): Result<RootAst>;
}
```

**Transformation:**
- **Token to AST** - Convert sequential tokens into hierarchical tree structure
- **Syntax validation** - Ensure proper Lisp syntax and structure
- **Node creation** - Generate typed AST nodes (identifiers, commands, containers)
- **Error detection** - Identify malformed expressions and syntax errors

**AST Benefits:**
- **Structural representation** - Tree format enables easier processing
- **Type safety** - Strongly typed nodes prevent runtime errors
- **Location preservation** - Each node maintains source position
- **Hierarchical access** - Navigate nested structures efficiently

###### `IDoculispParser` ######

Interface for parsing AST into Doculisp semantic structures:

```typescript
interface IDoculispParser {
    parse(rootAst: RootAst, variableTable: IVariableTable): Result<IDoculisp>;
}
```

**Semantic Analysis:**
- **AST to semantics** - Convert raw AST into meaningful Doculisp structures
- **Command interpretation** - Process Doculisp commands (section-meta, content, etc.)
- **Validation rules** - Apply Doculisp-specific structural requirements
- **Variable integration** - Handle variable definitions and references

**Semantic Structures:**
- **`IWrite`** - Text content for output
- **`ITitle`** - Document and section titles
- **`ITableOfContents`** - TOC configuration
- **`IHeader`** - Dynamic heading elements
- **`IContentLocation`** - Content placement markers

###### `IProjectParser` ######

Interface for parsing project-level AST into project structure definitions:

```typescript
interface IProjectParser {
    parse(rootAst: RootAst): Result<IProject>;
}
```

**Project Processing:**
- **Project syntax** - Parse `.dlproj` file format
- **Document definitions** - Extract source/output file pairs
- **Batch configuration** - Setup for multi-document compilation
- **Validation** - Ensure all referenced files exist and are accessible

**Project Structure:**
- **`IDocument[]`** - Array of document compilation definitions
- **Source paths** - Input Doculisp files to process
- **Output paths** - Target markdown files to generate
- **Batch coordination** - Enable processing multiple documents together

**Usage Pattern:**
```typescript
// Parse project file
const projectResult = projectParser.parse(projectAst);
if (projectResult.success) {
    // Process each document in the project
    for (const doc of projectResult.value.documents) {
        await compileDocument(doc.source, doc.output);
    }
}
```

#### Dependency Injection ####

These interfaces provide dependency injection capabilities for testing, modularity, and component replacement throughout the API.

###### `IContainer` ######

Main dependency injection container interface for component management:

```typescript
interface IContainer {
    buildAs<T>(key: string): T;
    buildTestable(): ITestableContainer;
}
```

**Core Capabilities:**
- **Component resolution** - Retrieve registered components by key
- **Type safety** - Generic `buildAs<T>` ensures correct return types
- **Testable creation** - Generate isolated containers for testing
- **Dependency coordination** - Manage component lifecycles and dependencies

**Usage Pattern:**
```typescript
// Get components from container
const controller = container.buildAs<IController>('controller');
const parser = container.buildAs<IAstParser>('astParser');
const pathConstructor = container.buildAs<PathConstructor>('pathConstructor');
```

###### `ITestableContainer` ######

Extended container interface with test replacement capabilities:

```typescript
interface ITestableContainer extends IContainer {
    replaceValue<T>(fake: T, key: string): void;
}
```

**Testing Features:**
- **Component replacement** - Swap real implementations with test fakes
- **Isolation** - Independent container instances for each test
- **Fake injection** - Replace file system, parsers, or other dependencies
- **Test control** - Complete control over component behavior in tests

**Testing Pattern:**
```typescript
// Create testable container
const testContainer = container.buildTestable();

// Inject test fakes
const mockFileSystem = createMockFileSystem();
testContainer.replaceValue(mockFileSystem, 'fileHandler');

// Test with controlled dependencies
const api = new DoculispApi(testContainer);
```

###### `IManager` ######

Container management interface for component registration and lifecycle:

```typescript
interface IManager {
    register<T>(key: string, factory: () => T): void;
    registerSingleton<T>(key: string, factory: () => T): void;
    registerInstance<T>(key: string, instance: T): void;
}
```

**Registration Types:**
- **`register`** - New instance per request (transient)
- **`registerSingleton`** - Single shared instance (singleton)
- **`registerInstance`** - Pre-created instance registration
- **Factory functions** - Lazy instantiation with dependency resolution

###### `IRegistry` ######

Registry interface for component lookup and resolution:

```typescript
interface IRegistry {
    resolve<T>(key: string): T;
    canResolve(key: string): boolean;
    getRegistrations(): string[];
}
```

**Registry Operations:**
- **Component resolution** - Look up registered components by key
- **Availability checking** - Verify if components are registered
- **Registration listing** - Get all available component keys
- **Dependency validation** - Ensure all required components are available

**Container Architecture Benefits:**
- **Modularity** - Clean separation between components
- **Testability** - Easy mocking and replacement for tests
- **Flexibility** - Swap implementations without changing client code
- **Maintainability** - Clear dependency declarations and management

**Example Setup:**
```typescript
// Component registration
manager.registerSingleton('fileHandler', () => new FileHandler());
manager.register('astParser', () => new AstParser());
manager.registerInstance('pathConstructor', createPathConstructor());

// Component usage
const fileHandler = registry.resolve<IFileHandler>('fileHandler');
const canParse = registry.canResolve('astParser');
```

<!-- Written By: Jason Kerney -->
<!-- Written By: GitHub Copilot -->
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- GENERATED DOCUMENT DO NOT EDIT! -->