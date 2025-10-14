# AI AST Parser Codex

This codex provides comprehensive documentation for the Doculisp AST (Abstract Syntax Tree) parser, including input/output data structures, parsing logic, and implementation patterns.

## Overview

The AST parser is the third stage in the Doculisp processing pipeline:
- **Input**: `TokenizedDocument` (from tokenizer)
- **Output**: `RootAst` or `IAstEmpty` (structured syntax tree)
- **Purpose**: Converts flat token arrays into hierarchical AST structures representing Doculisp syntax

## Input Data Structures

### TokenizedDocument
The AST parser receives a `Result<TokenizedDocument>` containing:

```typescript
type TokenizedDocument = {
    readonly tokens: Token[];
    readonly projectLocation: IProjectLocation;
};
```

### Token Types (Input)
The parser processes these token types from the tokenizer:

#### TextToken
```typescript
type TextToken = {
    readonly text: string;
    readonly location: ILocation;
    readonly type: 'token - text';
};
```
- Plain text content outside Doculisp expressions
- Converted directly to `IAstValue` nodes

#### AtomToken
```typescript
type AtomToken = {
    readonly text: string;
    readonly location: ILocation;
    readonly type: 'token - atom';
};
```
- Function/command names in Doculisp expressions
- Used for atoms, commands, and containers

#### ParameterToken
```typescript
type ParameterToken = {
    readonly text: string;
    readonly location: ILocation;
    readonly type: 'token - parameter';
};
```
- Arguments/parameters following atoms
- Used in command structures

#### CloseParenthesisToken
```typescript
type CloseParenthesisToken = {
    readonly location: ILocation;
    readonly type: 'token - close parenthesis';
};
```
- Marks end of Doculisp expressions
- Used for structure validation

## Output Data Structures

### RootAst
The primary output structure containing the complete AST:

```typescript
type RootAst = {
    readonly ast: CoreAst[];
    readonly location: IProjectLocation;
    readonly type: 'RootAst';
}
```

### AST Node Types

#### IAstEmpty
```typescript
interface IAstEmpty {
    readonly type: 'ast-Empty';
}
```
- Returned when no tokens are present
- Represents empty documents

#### IAstValue
```typescript
interface IAstValue {
    readonly value: string;
    readonly location: ILocation;
    readonly type: 'ast-value';
}
```
- Represents plain text content
- Direct conversion from `TextToken`

#### IAstAtom
```typescript
interface IAstAtom {
    readonly value: string;
    readonly location: ILocation;
    readonly type: 'ast-atom';
}
```
- Simple Doculisp functions with no parameters
- Pattern: `(functionName)`

#### IAstParameter
```typescript
interface IAstParameter {
    readonly value: string;
    readonly location: ILocation;
    readonly type: 'ast-Parameter';
}
```
- Parameter values within commands
- Processed from `ParameterToken`

#### IAstCommand
```typescript
interface IAstCommand {
    readonly value: string;
    readonly location: ILocation;
    readonly parameter: IAstParameter;
    readonly type: 'ast-command';
}
```
- Doculisp functions with single parameter
- Pattern: `(functionName parameterValue)`

#### IAstContainer
```typescript
interface IAstContainer {
    readonly value: string;
    readonly location: ILocation;
    readonly subStructure: AtomAst[];
    readonly type: 'ast-container';
}
```
- Doculisp functions containing nested structures
- Pattern: `(functionName (nested) (content))`

### Type Hierarchies

```typescript
type AtomAst = IAstCommand | IAstContainer | IAstAtom;
type CoreAst = IAstValue | AtomAst;
type Ast = CoreAst | IAstParameter;
```

## Parsing Logic

### Parser Structure
The AST parser uses the generic parser infrastructure with specialized handler functions:

```typescript
const parser = internals.createArrayParser<Token, CoreAst>(
    parseText, 
    parseCommand, 
    parseAtom, 
    parseContainer
);
```

### Parsing Patterns

#### 1. Text Parsing
**Pattern**: Single text token
**Handler**: `parseText()`
**Requirements**: 
- 1 token minimum
- First token must be `'token - text'`

```typescript
// Input: [TextToken]
// Output: IAstValue
```

#### 2. Atom Parsing
**Pattern**: Atom + Close Parenthesis
**Handler**: `parseAtom()`
**Requirements**:
- 2 tokens minimum
- Pattern: `AtomToken + CloseParenthesisToken`

```typescript
// Input: [AtomToken, CloseParenthesisToken]
// Output: IAstAtom
```

#### 3. Command Parsing
**Pattern**: Atom + Parameter + Close Parenthesis
**Handler**: `parseCommand()`
**Requirements**:
- 3 tokens minimum
- Pattern: `AtomToken + ParameterToken + CloseParenthesisToken`

```typescript
// Input: [AtomToken, ParameterToken, CloseParenthesisToken]
// Output: IAstCommand
```

#### 4. Container Parsing
**Pattern**: Atom + Nested Content + Close Parenthesis
**Handler**: `parseContainer()`
**Requirements**:
- 3+ tokens minimum
- Pattern: `AtomToken + [NestedTokens...] + CloseParenthesisToken`
- Recursively parses nested content

```typescript
// Input: [AtomToken, ...NestedTokens, CloseParenthesisToken]
// Output: IAstContainer with subStructure
```

### Parsing Algorithm

#### Main Parse Function
```typescript
function parse(tokenMaybe: Result<TokenizedDocument>): Result<RootAst | IAstEmpty>
```

#### Processing Flow
1. **Input Validation**: Check if tokenization succeeded
2. **Empty Check**: Return `IAstEmpty` if no tokens
3. **Parser Creation**: Create array parser with all handlers
4. **Parse Execution**: Process token array from first token location
5. **Leftover Validation**: Ensure all tokens were consumed
6. **Result Construction**: Build `RootAst` with results

#### Error Handling
- **Malformed Lisp**: Missing close parenthesis in commands
- **Unknown Tokens**: Unconsumed tokens after parsing
- **Structure Validation**: Proper nesting and token sequences

### Handler Implementation Details

#### parseText Handler
```typescript
function parseText(input: Token[], current: ILocation): StepParseResult<Token[], IAstValue>
```
- **Input Requirements**: At least 1 token
- **Token Validation**: First token must be `'token - text'`
- **Output**: `IAstValue` with text content
- **Consumption**: 1 token

#### parseAtom Handler
```typescript
function parseAtom(input: Token[], current: ILocation): StepParseResult<Token[], IAstAtom>
```
- **Input Requirements**: At least 2 tokens
- **Token Validation**: `AtomToken` + `CloseParenthesisToken`
- **Output**: `IAstAtom` with atom value
- **Consumption**: 2 tokens

#### parseCommand Handler
```typescript
function parseCommand(input: Token[], current: ILocation): StepParseResult<Token[], IAstCommand>
```
- **Input Requirements**: Exactly 3 tokens
- **Token Validation**: `AtomToken` + `ParameterToken` + `CloseParenthesisToken`
- **Output**: `IAstCommand` with embedded `IAstParameter`
- **Error Handling**: Fails if close parenthesis missing
- **Consumption**: 3 tokens

#### parseContainer Handler
```typescript
function parseContainer(input: Token[], current: ILocation): StepParseResult<Token[], IAstContainer>
```
- **Input Requirements**: At least 3 tokens
- **Token Validation**: `AtomToken` + nested content + `CloseParenthesisToken`
- **Recursive Parsing**: Creates sub-parser for nested content
- **Output**: `IAstContainer` with `subStructure` array
- **Error Handling**: Validates proper closing parenthesis
- **Consumption**: Variable (entire container)

## Token Consumption and Array Trimming

### ITrimArray Utility
The parser uses `ITrimArray` for efficient token array manipulation:

```typescript
interface ITrimArray {
    trim<T>(length: number, values: T[]): T[];
}
```

### Usage Pattern
```typescript
// Consume N tokens from beginning of array
rest: trimArray.trim(N, input)
```

## Error Patterns

### Common Error Scenarios

#### 1. Malformed Lisp
```typescript
return util.fail(`Malformed lisp at ${closeCommand.location}.`, closeCommand.location.documentPath);
```
- **Trigger**: Missing close parenthesis in commands
- **Context**: Includes precise location information

#### 2. Unknown Tokens
```typescript
return util.fail(`Unknown Token '${JSON.stringify(token, null, 4)}`, token.location.documentPath);
```
- **Trigger**: Unconsumed tokens after parsing
- **Context**: Full token details for debugging

#### 3. Structural Validation
```typescript
return util.fail(`Malformed lisp at ${remaining.location}`, remaining.location.documentPath);
```
- **Trigger**: Container parsing failures
- **Context**: Location where structure breaks down

## Integration Patterns

### Pipeline Position
```
Document Parser → Tokenizer → **AST Parser** → Doculisp Parser
```

### Dependency Registration
```typescript
const astParser: IRegisterable = {
    builder: (util: IUtil, internals: IInternals, trimArray: ITrimArray) => 
        buildAstParser(util, internals, trimArray),
    name: 'astParser',
    singleton: false,
    dependencies: ['util', 'internals', 'trimArray']
};
```

### Consumer Pattern
```typescript
const astResult = astParser.parse(tokenizedDocument);
if (astResult.success) {
    const rootAst = astResult.value;
    // Process AST structure...
}
```

## Testing Patterns

### Test Structure
```typescript
describe('ast parser', () => {
    let parser: IAstParser;
    let toResult: (text: string, location: IProjectLocation) => Result<RootAst | IAstEmpty>;
    
    beforeEach(() => {
        parser = testable.ast.parserBuilder(container, environment => {
            // Setup mocks
        });
        toResult = testable.ast.resultBuilder(container, environment => {
            // Setup pipeline
        });
    });
});
```

### Common Test Scenarios
1. **Empty Documents**: No tokens → `IAstEmpty`
2. **Text Only**: Plain text tokens → `IAstValue` nodes
3. **Simple Atoms**: `(atom)` → `IAstAtom`
4. **Commands**: `(command parameter)` → `IAstCommand`
5. **Containers**: `(container (nested))` → `IAstContainer`
6. **Mixed Content**: Text + Doculisp combinations
7. **Error Cases**: Malformed structures, unknown tokens

### Approval Testing
```typescript
const result = parser.parse(tokens);
verifyAsJson(result);
```

## Key Implementation Notes

1. **Token Order Significance**: Handler order in parser creation matters
2. **Greedy Parsing**: Handlers consume maximum valid token sequences  
3. **Location Preservation**: Every AST node maintains source location
4. **Error Context**: Failures include file path and location details
5. **Recursive Structure**: Containers can contain any `AtomAst` types
6. **Validation Logic**: Strict token sequence validation prevents malformed AST
7. **Memory Efficiency**: Uses array trimming instead of copying
8. **Immutable Results**: Parsing doesn't modify input token arrays

## AST Structure Examples

### Simple Atom
```
Input:  (content)
Tokens: [AtomToken("content"), CloseParenthesisToken]
AST:    IAstAtom { value: "content", type: "ast-atom" }
```

### Command
```
Input:  (title My Document)
Tokens: [AtomToken("title"), ParameterToken("My Document"), CloseParenthesisToken]
AST:    IAstCommand { 
          value: "title", 
          parameter: IAstParameter { value: "My Document" },
          type: "ast-command" 
        }
```

### Container
```
Input:  (section-meta (title Hello))
Tokens: [AtomToken("section-meta"), AtomToken("title"), ParameterToken("Hello"), CloseParenthesisToken, CloseParenthesisToken]
AST:    IAstContainer {
          value: "section-meta",
          subStructure: [
            IAstCommand { 
              value: "title", 
              parameter: IAstParameter { value: "Hello" } 
            }
          ],
          type: "ast-container"
        }
```

### Mixed Content
```
Input:  Some text (content)
Tokens: [TextToken("Some text"), AtomToken("content"), CloseParenthesisToken]
AST:    RootAst {
          ast: [
            IAstValue { value: "Some text", type: "ast-value" },
            IAstAtom { value: "content", type: "ast-atom" }
          ]
        }
```

This AST parser serves as the critical bridge between flat token streams and hierarchical syntax trees, enabling the downstream Doculisp processor to work with structured, semantically meaningful representations of the document content.