# AI Token Parser Codex

This codex provides comprehensive documentation for the Doculisp token parser (tokenizer), including input/output data structures, parsing logic, and implementation patterns.

## Overview

The tokenizer is the second stage in the Doculisp processing pipeline:
- **Input**: `DocumentMap` (from document parser)
- **Output**: `TokenizedDocument` (containing token array)
- **Purpose**: Converts structured document parts into discrete tokens for AST parsing

## Input Data Structures

### DocumentMap
The tokenizer receives a `Result<DocumentMap>` containing:

```typescript
type DocumentMap = {
    readonly parts: DocumentPart[];
    readonly projectLocation: IProjectLocation;
};
```

### DocumentPart Types
Document parts come in two varieties:

#### Text Parts
```typescript
interface IText {
    readonly text: string;
    readonly location: ILocation;
    readonly type: 'text';
}
```
- Contains plain text content (markdown, comments, etc.)
- Location tracks position in original file
- Passed through as text tokens without parsing

#### Lisp Parts
```typescript
interface ILispBlock {
    readonly text: string;
    readonly location: ILocation;
    readonly type: 'lisp';
}
```
- Contains Doculisp syntax within parentheses
- Location tracks starting position of the block
- Subject to detailed tokenization parsing

## Output Data Structures

### TokenizedDocument
```typescript
type TokenizedDocument = {
    readonly tokens: Token[];
    readonly projectLocation: IProjectLocation;
};
```

### Token Types
Four distinct token types are produced:

#### TextToken
```typescript
type TextToken = {
    readonly text: string;
    readonly location: ILocation;
    readonly type: 'token - text';
};
```
- Represents non-Doculisp content
- Preserves original text exactly
- Single token per text part

#### IdentifierToken
```typescript
type IdentifierToken = {
    readonly text: string;
    readonly location: ILocation;
    readonly type: 'token - identifier';
};
```
- First element after opening parenthesis
- Function/command name in Doculisp syntax
- Matches pattern: `/^[^\(\)\s]+/`

#### ParameterToken
```typescript
type ParameterToken = {
    readonly text: string;
    readonly location: ILocation;
    readonly type: 'token - parameter';
};
```
- Arguments/parameters following identifiers
- Supports escaped parentheses: `\(` and `\)`
- Supports escaped backslashes: `\\`
- Pattern: `/^([^\s\(\)\\]+|\\\)|\\\(|\\\w|\\\\)+([^\(\)\\]+|\\\)|\\\(|\\\w|\\\\)*/`

#### CloseParenthesisToken
```typescript
type CloseParenthesisToken = {
    readonly location: ILocation;
    readonly type: 'token - close parenthesis';
};
```
- Marks end of Doculisp expressions
- No text content (structure-only)
- Essential for nested parsing

## Parsing Logic

### State Management
The tokenizer maintains an `isToken` boolean flag:
- `true`: Expecting identifier (immediately after opening paren)
- `false`: Expecting parameter or close paren

### Token Recognition Sequence
Parsing attempts handlers in this order:

1. **Whitespace Handling**
   - Windows newlines (`\r\n`)
   - Unix newlines (`\n`)
   - Non-newline whitespace (spaces, tabs)
   - All whitespace is discarded (not tokenized)

2. **Comment Handling**
   - Nested comment parsing with `(*` and `*)`
   - Maintains depth counter for proper nesting
   - Comments are completely discarded
   - Supports nested parentheses within comments

3. **Parenthesis Handling**
   - Opening paren `(`: Sets `isToken = true`, discarded
   - Closing paren `)`: Creates CloseParenthesisToken

4. **Identifier Parsing**
   - Only when `isToken = true`
   - Non-whitespace, non-parenthesis characters
   - Sets `isToken = false` after parsing

5. **Parameter Parsing**
   - Only when `isToken = false`
   - Handles escape sequences
   - Trims whitespace
   - Continues until whitespace or parenthesis

### Escape Sequence Processing
Parameters support these escape sequences:
- `\(` → `(`
- `\)` → `)`
- `\\` → `\`
- Other `\w` sequences preserved as-is

### Location Tracking
Each token maintains precise location information:
- File path reference
- Line and character position
- Enables accurate error reporting
- Preserved through parsing pipeline

## Error Handling

### Input Validation
- Tokenizer fails if input `DocumentMap` failed
- Propagates parsing errors with file path context
- Returns `Result<TokenizedDocument>` for error handling

### Error Propagation
```typescript
if (tokens.success) {
    totalTokens.addTokens(tokens.value);
} else {
    return util.fail(tokens.message, documentPath);
}
```

## Implementation Patterns

### Parser Composition
Uses `internals.createStringParser()` with handler functions:
```typescript
const parser = internals.createStringParser(
    tokenizeWhiteSpace,
    tokenizeComment, 
    tokenizeParenthesis,
    tokenizeParameter,
    tokenizeIdentifier
);
```

### Token Builder Pattern
```typescript
function getTokenBuilder() {
    const tokens: Token[] = [];
    return {
        addToken(token: Token): void,
        addTokens(tokens: Token[]): void,
        getTokens(): Token[]
    };
}
```

### Handler Function Signature
```typescript
type HandleStringValue<T> = (
    input: string, 
    current: ILocation
) => StringStepParseResult<T>;
```

## Testing Patterns

### Test Structure
- Uses dependency injection container
- Mocks file system with `PathConstructor`
- Approval testing with JSON verification
- Isolated test environment per test

### Common Test Scenarios
1. **Error Propagation**: Failed input `DocumentMap`
2. **Empty Input**: Empty parts array
3. **Text Processing**: Plain text parts
4. **Basic Identifiers**: Simple function names
5. **Parameters**: Single and multi-word arguments
6. **Nesting**: Complex nested expressions
7. **Comments**: Nested comment handling
8. **Escaping**: Escaped parentheses in parameters

### Test Data Builders
```typescript
buildProjectLocation(path, depth, index)
buildLocation(util)(path, depth, index, line, char, extension?)
```

## Integration Points

### Dependencies
The tokenizer depends on:
- `searches`: Regular expression patterns
- `internals`: Parser creation utilities  
- `util`: Result handling and success/failure utilities

### Pipeline Position
```
Document Parser → **Tokenizer** → AST Parser → Doculisp Parser
```

### Registration
```typescript
const tokenizer: IRegisterable = {
    builder: (searches, internals, util) => buildTokenize(searches.searchLispFor, internals, util),
    name: 'tokenizer',
    singleton: true,
    dependencies: ['searches', 'internals', 'util']
};
```

## Key Implementation Notes

1. **Single Pass**: Tokenizes each lisp block in one pass
2. **State Machine**: Uses `isToken` flag to distinguish identifier vs parameter context  
3. **Greedy Matching**: Identifiers and parameters consume maximum possible characters
4. **Location Preservation**: Every token maintains precise source location
5. **Error Context**: Failures include file path for debugging
6. **Escape Processing**: Parameters undergo escape sequence transformation
7. **Comment Nesting**: Properly handles nested `(*` comments with depth tracking
8. **Whitespace Normalization**: All whitespace discarded except within parameters

This tokenizer serves as the critical bridge between raw document structure and structured token streams ready for AST construction.