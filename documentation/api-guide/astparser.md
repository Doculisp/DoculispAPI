<!-- (dl (section-meta AST Parser)) -->

The **AST Parser** is the third stage of the Doculisp processing pipeline, responsible for transforming the linear token stream into a hierarchical Abstract Syntax Tree (AST) that represents the structural relationships of Doculisp expressions.

<!-- (dl (## Core Purpose)) -->

The AST Parser converts tokenized Doculisp code into a **non-semantic, structurally-validated tree**:

- **Hierarchical Structure** - Transform flat token stream into nested tree
- **Syntax Validation** - Ensure proper Lisp expression structure without interpreting meaning
- **Shape Validation** - Verify basic structural correctness of expressions
- **Foundation Building** - Create a clean, validated structure for semantic processing

This transformation from linear tokens to a **structurally-sound tree** makes semantic analysis much easier in subsequent pipeline stages by ensuring the basic shape of the code is correct.

<!-- (dl (## AST Node Architecture)) -->

The AST Parser creates a tree of strongly-typed nodes that represent the **structural shape** of Doculisp syntax without interpreting semantic meaning:

<!-- (dl (### Core AST Union)) -->

All AST nodes are part of the [`CoreAst`](<!-- (dl (get-path core-ast-type)) -->) union type:

```typescript
type CoreAst = IdentifierAst | IAstValue;
```

<!-- (dl (### Value Nodes)) -->

**[`IAstValue`](<!-- (dl (get-path ast-value-type)) -->)** - Represents literal values and parameters:

```typescript
interface IAstValue {
    readonly type: 'ast-value';
    readonly value: string;
    readonly location: ILocation;
}
```

**Usage:** Parameter values like `"My Document Title"`, `"./path/to/file.md"`, `"numbered-labeled"`

<!-- (dl (### Identifier Nodes)) -->

**[`IAstIdentifier`](<!-- (dl (get-path ast-identifier-type)) -->)** - Represents Doculisp commands and identifiers:

```typescript
interface IAstIdentifier {
    readonly type: 'ast-identifier';
    readonly value: string;
    readonly location: ILocation;
    readonly blockRange: IRange;
}
```

**Usage:** Commands like `section-meta`, `title`, `include`, `content`

<!-- (dl (### Command Nodes)) -->

**[`IAstCommand`](<!-- (dl (get-path ast-command-type)) -->)** - Represents commands with their parameters:

```typescript
interface IAstCommand {
    readonly type: 'ast-command';
    readonly value: string;
    readonly location: ILocation;
    readonly parameter: IAstParameter;
    readonly blockRange: IRange;
}
```

**Usage:** Complete expressions like `(title My Document)`, `(include (Section ./file.md))`

<!-- (dl (### Container Nodes)) -->

**[`IAstContainer`](<!-- (dl (get-path ast-container-type)) -->)** - Represents nested groupings:

```typescript
interface IAstContainer {
    readonly type: 'ast-container';
    readonly value: string;
    readonly location: ILocation;
    readonly subStructure: IdentifierAst[];
    readonly blockRange: IRange;
}
```

**Usage:** Nested structures and complex expressions with multiple levels

<!-- (dl (## Parsing Process)) -->

<!-- (dl (### Token Stream to Tree Transformation)) -->

The AST Parser processes the [`TokenizedDocument`](<!-- (dl (get-path tokenized-document-type)) -->) using **recursive descent parsing**:

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

<!-- (dl (### Nested Expression Handling)) -->

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

<!-- (dl (## Parser Interface)) -->

The AST Parser implements the [`IAstParser`](<!-- (dl (get-path iast-parser-type)) -->) interface:

```typescript
interface IAstParser {
    parse(tokenizedDocument: TokenizedDocument): Result<RootAst>;
}
```

**Input:**
- **[`TokenizedDocument`](<!-- (dl (get-path tokenized-document-type)) -->)** - Structured tokens from Tokenizer

**Output:**
- **[`Result<RootAst>`](<!-- (dl (get-path result-type)) -->)** - Success with AST or detailed failure

<!-- (dl (### RootAst Structure)) -->

The parser produces a [`RootAst`](<!-- (dl (get-path root-ast-type)) -->) containing the complete tree:

```typescript
interface RootAst {
    readonly ast: CoreAst[];
    readonly location: IProjectLocation;
}
```

**Properties:**
- **AST array** - Top-level AST nodes (multiple root expressions allowed)
- **Location** - Project location information for error reporting
- **Immutable structure** - Read-only tree for safe processing

<!-- (dl (## Syntax Validation)) -->

The AST Parser performs **comprehensive syntax validation** during tree construction:

<!-- (dl (### Structural Validation)) -->

- **Balanced parentheses** - Ensure all expressions are properly closed
- **Valid nesting** - Check that nested structures are syntactically correct
- **Command structure** - Validate that commands have appropriate parameters
- **Expression completeness** - Ensure no incomplete or malformed expressions

<!-- (dl (### Error Detection)) -->

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

<!-- (dl (## Location Preservation)) -->

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

<!-- (dl (## Integration with Pipeline)) -->

The AST Parser serves as the **structural validation layer** that prepares clean, validated syntax trees for semantic analysis:

**Pipeline Flow:**
1. **[Document Parser](<!-- (dl (get-path document-parser-type)) -->)** → [`DocumentMap`](<!-- (dl (get-path document-map-type)) -->) (content separation)
2. **[Tokenizer](<!-- (dl (get-path token-function-type)) -->)** → [`TokenizedDocument`](<!-- (dl (get-path tokenized-document-type)) -->) (lexical analysis)
3. **[AST Parser](<!-- (dl (get-path iast-parser-type)) -->)** → [`RootAst`](<!-- (dl (get-path root-ast-type)) -->) (non-semantic syntax tree)
4. **[Semantic Parser](<!-- (dl (get-path idoculisp-parser-type)) -->)** → [`IDoculisp`](<!-- (dl (get-path doculisp-type)) -->) (semantic meaning interpretation)

<!-- (dl (### Tree Processing Benefits)) -->

The non-semantic AST provides several advantages for downstream semantic processing:

- **Clean structure** - Guaranteed syntactically correct tree for semantic analysis
- **Shape validation** - Basic structural errors caught before semantic processing
- **Simplified semantics** - Semantic parsers can focus on meaning, not syntax
- **Early error detection** - Structural problems identified before complex semantic analysis

<!-- (dl (### Lisp Expression Support)) -->

The AST Parser is specifically designed for **Doculisp's Lisp-inspired syntax**:

- **S-expressions** - Full support for parenthesized expressions
- **Command-parameter structure** - Clear distinction between commands and their arguments
- **Arbitrary nesting** - Handle deeply nested expressions without limits
- **Multiple roots** - Support documents with multiple top-level expressions

This **non-semantic AST representation** provides a clean, structurally-validated foundation that makes semantic analysis much easier by ensuring the basic shape and syntax of Doculisp documents is correct before any meaning interpretation begins.