<!-- (dl (section-meta Token and Parsing Types)) -->

These types represent the fundamental building blocks for tokenizing and parsing Doculisp source code.

<!-- (dl (##token-type `Token`)) -->

Union type representing all possible token types in Doculisp:

```typescript
type Token = TextToken | CloseParenthesisToken | IdentifierToken | ParameterToken;
```

**Component Types:**
- **`TextToken`** - Regular text content outside Doculisp blocks
- **`IdentifierToken`** - Doculisp identifiers (commands, block names)
- **`ParameterToken`** - Parameter values passed to Doculisp commands
- **`CloseParenthesisToken`** - Closing parenthesis tokens

<!-- (dl (##tokenized-document-type `TokenizedDocument`)) -->

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

<!-- (dl (##token-function-type `TokenFunction`)) -->

Function type for the tokenization process:

```typescript
type TokenFunction = (input: DocumentMap) => Result<TokenizedDocument>;
```

**Usage:**
- **Input** - `DocumentMap` containing parsed document structure
- **Output** - `Result<TokenizedDocument>` with success/failure handling
- **Error handling** - Returns detailed failure information on tokenization errors