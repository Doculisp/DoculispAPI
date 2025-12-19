<!-- (dl (section-meta Tokenizer)) -->

The **Tokenizer** is the second stage of the Doculisp processing pipeline, responsible for breaking down Doculisp code blocks into discrete, typed tokens that can be parsed into an Abstract Syntax Tree.

<!-- (dl (## Core Purpose)) -->

The Tokenizer transforms the Doculisp parts extracted by the Document Parser into a **structured token stream**:

- **Lexical Analysis** - Break Doculisp code into meaningful units
- **Token Classification** - Assign specific types to each token
- **Location Tracking** - Maintain precise source positions for every token
- **Syntax Preparation** - Prepare tokens for AST parsing

This tokenization enables the **structured parsing** of Doculisp's Lisp-inspired syntax while preserving complete location information for error reporting.

<!-- (dl (## Token Types)) -->

The Tokenizer produces four distinct types of tokens, each serving a specific purpose in Doculisp syntax:

<!-- (dl (### Text Tokens)) -->

**`TextToken`** - Represents regular text content outside of Lisp expressions:

```typescript
interface TextToken {
    readonly type: 'text';
    readonly content: string;
    readonly location: ILocation;
}
```

**Usage:** Text that appears between Doculisp blocks or at the document level.

<!-- (dl (### Identifier Tokens)) -->

**`IdentifierToken`** - Represents Doculisp commands and identifiers:

```typescript
interface IdentifierToken {
    readonly type: 'identifier';
    readonly identifier: string;
    readonly location: ILocation;
}
```

**Examples:** `section-meta`, `title`, `include`, `content`, `toc`, `#`, `##`

<!-- (dl (### Parameter Tokens)) -->

**`ParameterToken`** - Represents parameter values passed to Doculisp commands:

```typescript
interface ParameterToken {
    readonly type: 'parameter';
    readonly parameter: string;
    readonly location: ILocation;
}
```

**Examples:** `"My Document Title"`, `"./path/to/file.md"`, `"numbered-labeled"`

<!-- (dl (### Structural Tokens)) -->

**`CloseParenthesisToken`** - Represents closing parentheses that end Lisp expressions:

```typescript
interface CloseParenthesisToken {
    readonly type: 'close-parenthesis';
    readonly location: ILocation;
}
```

**Purpose:** Marks the end of Lisp expressions and enables proper nesting.

<!-- (dl (## Tokenization Process)) -->

<!-- (dl (### Input Processing)) -->

The Tokenizer receives a [`DocumentMap`](<!-- (dl (get-path document-map-type)) -->) and processes only the Doculisp parts:

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

<!-- (dl (### Location Preservation)) -->

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

<!-- (dl (## Tokenizer Interface)) -->

The Tokenizer follows the API's functional design pattern:

```typescript
type TokenFunction = (input: DocumentMap) => Result<TokenizedDocument>;
```

**Input:**
- **[`DocumentMap`](<!-- (dl (get-path document-map-type)) -->)** - Mixed content from Document Parser

**Output:**
- **[`Result<TokenizedDocument>`](<!-- (dl (get-path result-type)) -->)** - Success with tokens or detailed failure

### TokenizedDocument Structure

The tokenizer produces a [`TokenizedDocument`](<!-- (dl (get-path tokenized-document-type)) -->) containing:

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

<!-- (dl (## Error Handling)) -->

The Tokenizer provides **comprehensive error detection** for common syntax issues:

<!-- (dl (### Syntax Errors)) -->

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

<!-- (dl (### Parameter Validation)) -->

- **Parameter length limits** - Enforce 255 character maximum
- **Newline detection** - Parameters cannot contain newlines
- **Escape sequence handling** - Proper handling of `\)` and other escapes

<!-- (dl (## Integration with Pipeline)) -->

The Tokenizer serves as the **bridge** between textual content and structured parsing:

**Pipeline Flow:**
1. **[Document Parser](<!-- (dl (get-path document-parser-type)) -->)** → [`DocumentMap`](<!-- (dl (get-path document-map-type)) -->) (separate content types)
2. **[Tokenizer](<!-- (dl (get-path token-function-type)) -->)** → [`TokenizedDocument`](<!-- (dl (get-path tokenized-document-type)) -->) (structured tokens)
3. **[AST Parser](<!-- (dl (get-path iast-parser-type)) -->)** → [`RootAst`](<!-- (dl (get-path root-ast-type)) -->) (syntax tree)
4. **[Semantic Parser](<!-- (dl (get-path idoculisp-parser-type)) -->)** → [`IDoculisp`](<!-- (dl (get-path doculisp-type)) -->) (semantic meaning)

<!-- (dl (### Token Stream Benefits)) -->

The tokenized representation provides several advantages:

- **Structured Access** - Random access to any token by index
- **Type Safety** - Each token has a specific, known type
- **Location Precision** - Every token knows its exact source position
- **Parser Preparation** - Tokens are ready for recursive descent parsing

<!-- (dl (### Lisp Syntax Support)) -->

The Tokenizer is specifically designed for **Doculisp's Lisp-inspired syntax**:

- **S-expressions** - Parenthesized expressions with nested structure
- **Commands and parameters** - Clear distinction between identifiers and values
- **Whitespace handling** - Flexible whitespace rules for readability
- **Comment support** - Handles commented-out blocks with `*` prefix

This tokenization approach enables Doculisp to maintain its **clean, readable syntax** while providing the structural foundation needed for reliable parsing and error reporting.