# AI Document Parser Codex: Doculisp Document Parser Architecture

## Overview

The Doculisp Document Parser is a sophisticated parsing system that converts raw text files (both `.md` and `.dlisp` formats) into structured `DocumentMap` objects. This codex provides comprehensive documentation of the expected data structures, parsing behavior, and output formats for AI assistants working with the document parsing system.

## Core Data Structures

### 1. DocumentMap - The Primary Output

The `DocumentMap` is the main result structure returned by the document parser:

```typescript
type DocumentMap = {
    readonly parts: DocumentPart[];
    readonly projectLocation: IProjectLocation;
};
```

**Structure Breakdown:**
- **`parts`**: Array of parsed document segments (text and lisp blocks)
- **`projectLocation`**: Metadata about the document's location and hierarchy

### 2. DocumentPart - Content Segments

Document content is broken into two types of parts:

```typescript
export type DocumentPart = IText | ILispBlock;

// Text content (regular markdown/text)
export interface IText {
    readonly text: string;
    readonly location: ILocation;
    readonly type: 'text';
}

// Doculisp code blocks
export interface ILispBlock {
    readonly text: string;
    readonly location: ILocation;
    readonly type: 'lisp';
}
```

**Key Properties:**
- **`text`**: The actual content string (cleaned and normalized)
- **`location`**: Precise location information within the source document
- **`type`**: Discriminator - either `'text'` for regular content or `'lisp'` for Doculisp blocks

### 3. Location Information

Every document part includes detailed location information:

```typescript
export interface ILocation extends IProjectLocation, ILocationCoordinates {
    increaseLine(by?: number): ILocation;
    increaseChar(by?: number): ILocation;
    compare(other: ILocation): IsOrder;
}

export interface IProjectLocation {
    readonly documentPath: IPath;
    readonly documentDepth: number;
    readonly documentIndex: number;
}

export interface ILocationCoordinates {
    readonly line: number;
    readonly char: number;
}
```

**Location Properties:**
- **`documentPath`**: Full path information with extension details
- **`documentDepth`**: Hierarchical depth in document structure
- **`documentIndex`**: Index position within document hierarchy
- **`line`**: Line number (1-based indexing)
- **`char`**: Character position within line (1-based indexing)

## File Type Processing

### 1. Markdown Files (.md)

For `.md` files, the parser handles multiple content types:

**Text Content:**
- Regular markdown text
- Preserves whitespace and formatting
- Handles inline and multiline code blocks
- Manages HTML comments

**Doculisp Blocks:**
- Embedded within HTML comments: `<!-- (dl ...) -->`
- Extracted as separate `lisp` type parts
- Whitespace normalized and trimmed

**Example Input:**
```markdown
Hello world!

<!-- (dl (# My Header)) -->

Some more text with `inline code`.
```

**Expected Output Structure:**
```typescript
{
  success: true,
  value: {
    parts: [
      {
        location: { char: 1, line: 1, ... },
        text: "Hello world!",
        type: "text"
      },
      {
        location: { char: 6, line: 3, ... },
        text: "(# My Header)",
        type: "lisp"
      },
      {
        location: { char: 1, line: 5, ... },
        text: "Some more text with `inline code`.",
        type: "text"
      }
    ],
    projectLocation: { ... }
  }
}
```

### 2. Doculisp Files (.dlisp)

For `.dlisp` files, the entire content is treated as Lisp code:

**Processing Behavior:**
- Entire file content wrapped in implicit parentheses
- No HTML comment markers needed
- Must be valid Lisp syntax
- Cannot contain raw text outside Lisp structures

**Example Input (.dlisp file):**
```lisp
(section-meta
    (title My Document)
    (include
        (Section ./intro.md)
    )
)

(content (toc numbered-labeled))
```

**Expected Output Structure:**
```typescript
{
  success: true,
  value: {
    parts: [
      {
        location: { char: 1, line: 1, ... },
        text: "(section-meta\n    (title My Document)\n    (include\n        (Section ./intro.md)\n    )\n)\n\n(content (toc numbered-labeled))",
        type: "lisp"
      }
    ],
    projectLocation: { ... }
  }
}
```

## Content Processing Rules

### 1. Text Normalization

**Line Ending Normalization:**
- Windows (`\r\n`) → Unix (`\n`)
- Classic Mac (`\r`) → Unix (`\n`)
- Consistent line ending format across platforms

**Whitespace Handling:**
- Trailing whitespace removed from lines
- Leading/trailing empty lines preserved with location tracking
- Internal whitespace preserved for formatting

**Example:**
```
Input:  "  hello world  \r\n  \r\n  goodbye  "
Output: "  hello world\n\ngoodbye"
```

### 2. Code Block Processing

**Inline Code Blocks:**
- Marked with backticks: `` `code` ``
- Cannot contain line breaks
- Preserved as-is within text content
- Error if not properly closed

**Multiline Code Blocks:**
- Marked with triple backticks: ``` ``` ```
- Can span multiple lines
- Preserved as-is within text content
- Error if not properly closed

### 3. Comment Processing

**HTML Comments:**
- Standard format: `<!-- content -->`
- Can contain Doculisp blocks
- Non-Doculisp content is discarded
- Can span multiple lines
- Error if not properly closed

**Doculisp Comments:**
- Within Lisp blocks using `*` prefix
- Example: `(*commented-atom (parameter))`
- Completely removed from output

## Error Handling

The parser provides detailed error information for various failure scenarios:

### 1. Validation Errors

**Document Constraints:**
```typescript
// documentDepth must be >= 1
// documentIndex must be >= 1
{
  success: false,
  message: "Document Depth must be a value of 1 or larger.",
  documentPath: "path/to/file.md"
}
```

### 2. Syntax Errors

**Unclosed Blocks:**
```typescript
{
  success: false,
  message: "Multiline code block at 'file.md' Line: 5, Char: 1 does not close",
  documentPath: "path/to/file.md"
}
```

**Nested Doculisp Blocks:**
```typescript
{
  success: false,
  message: "Doculisp Block at 'file.md' Line: 3, Char: 5 contains an embedded doculisp block at Line: 7, Char: 10.",
  documentPath: "path/to/file.md"
}
```

### 3. File Format Errors

**Invalid .dlisp Content:**
```typescript
{
  success: false,
  message: "Doculisp block at 'file.dlisp' Line: 1, Char: 1 has something not contained in parenthesis at Line: 5, Char: 15.",
  documentPath: "path/to/file.dlisp"
}
```

## Expected Output Patterns

### 1. Empty Document
```typescript
{
  success: true,
  value: {
    parts: [],
    projectLocation: {
      documentDepth: 1,
      documentIndex: 1,
      documentPath: "empty.md"
    }
  }
}
```

### 2. Simple Text Document
```typescript
{
  success: true,
  value: {
    parts: [
      {
        location: {
          char: 1,
          line: 1,
          documentDepth: 1,
          documentIndex: 1,
          documentPath: "simple.md"
        },
        text: "Hello, world!",
        type: "text"
      }
    ],
    projectLocation: { ... }
  }
}
```

### 3. Mixed Content Document
```typescript
{
  success: true,
  value: {
    parts: [
      {
        location: { char: 1, line: 1, ... },
        text: "Introduction text",
        type: "text"
      },
      {
        location: { char: 6, line: 3, ... },
        text: "(section-meta (title My Document))",
        type: "lisp"
      },
      {
        location: { char: 1, line: 5, ... },
        text: "More content here",
        type: "text"
      }
    ],
    projectLocation: { ... }
  }
}
```

### 4. Pure Doculisp Document (.dlisp)
```typescript
{
  success: true,
  value: {
    parts: [
      {
        location: { char: 1, line: 1, ... },
        text: "(section-meta\n    (title Document)\n    (include (Section ./intro.md))\n)\n\n(content)",
        type: "lisp"
      }
    ],
    projectLocation: { ... }
  }
}
```

## Integration Patterns

### 1. Testing with Document Parser

```typescript
import { testable } from 'testHelpers';
import { buildProjectLocation } from 'testHelpers';

// Create parser instance
const parse = testable.document.resultBuilder(container);

// Test simple text
const result = parse('Hello world', buildProjectLocation('test.md', 1, 1));

// Verify structure
expect(result.success).toBe(true);
if (result.success) {
    expect(result.value.parts).toHaveLength(1);
    expect(result.value.parts[0].type).toBe('text');
    expect(result.value.parts[0].text).toBe('Hello world');
}
```

### 2. Error Handling Patterns

```typescript
// Validate document constraints
if (!result.success) {
    console.error(`Parse error: ${result.message}`);
    if (result.documentPath) {
        console.error(`In file: ${result.documentPath}`);
    }
    return;
}

// Process successful result
const { parts, projectLocation } = result.value;
parts.forEach(part => {
    if (part.type === 'text') {
        // Handle text content
        processTextContent(part.text, part.location);
    } else if (part.type === 'lisp') {
        // Handle Doculisp code
        processLispBlock(part.text, part.location);
    }
});
```

### 3. Location Tracking

```typescript
// Use location information for debugging
parts.forEach(part => {
    console.log(`${part.type} at ${part.location.documentPath}:${part.location.line}:${part.location.char}`);
    console.log(`Content: ${part.text}`);
});
```

## Best Practices

### 1. Result Validation

Always check the `success` property before accessing the value:

```typescript
if (result.success) {
    // Safe to access result.value
    const documentMap = result.value;
} else {
    // Handle error case
    handleParseError(result.message, result.documentPath);
}
```

### 2. Type Guards

Use type discrimination for processing parts:

```typescript
parts.forEach(part => {
    switch (part.type) {
        case 'text':
            // TypeScript knows this is IText
            processText(part.text);
            break;
        case 'lisp':
            // TypeScript knows this is ILispBlock
            processLisp(part.text);
            break;
    }
});
```

### 3. Location Awareness

Leverage location information for error reporting and debugging:

```typescript
function processDocumentPart(part: DocumentPart) {
    try {
        // Process the part
        return processContent(part.text);
    } catch (error) {
        throw new Error(
            `Error processing ${part.type} at ${part.location.documentPath}:${part.location.line}:${part.location.char}: ${error.message}`
        );
    }
}
```

## Performance Considerations

### 1. Memory Efficiency

- Document parts share location objects where possible
- Text content is normalized but not duplicated
- Large documents are processed incrementally

### 2. Processing Optimization

- Parser uses streaming approach for large files
- Early termination on syntax errors
- Efficient regex patterns for content recognition

---

This codex provides the foundation for understanding and working with the Doculisp Document Parser's output structures. The parser transforms raw text into structured, location-aware document representations that enable sophisticated document processing and analysis workflows.