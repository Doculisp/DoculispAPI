# AI String Writer Codex

## Overview

The String Writer is the final stage of the Doculisp processing pipeline that transforms validated Doculisp AST structures into markdown output. It takes semantically validated Doculisp documents and produces formatted markdown with proper document structure, table of contents, content placement, and metadata headers.

## Input Data Structures

### Primary Input Types

```typescript
// Main input result type
Result<IDoculisp | IEmptyDoculisp>

// Primary document structure
interface IDoculisp {
    projectLocation: IProjectLocation;  // Root document location
    section: ISectionWriter;           // Main content section
    type: 'doculisp-root';
}

// Empty document (no content)
interface IEmptyDoculisp {
    type: 'doculisp-empty';
}

// Variable table for metadata retrieval
interface IVariableRetriever {
    getValue<T>(key: string): T | false;
    getKeys(): string[];
    hasKey(key: string): boolean;
}
```

### Core Content Structure

```typescript
// Main content container
interface ISectionWriter extends ILocationSortable {
    doculisp: DoculispPart[];         // Ordered content parts
    include: ILoad[];                 // External document references
    type: 'doculisp-section';
}

// Individual content elements
type DoculispPart = IWrite | ITitle | ITableOfContents | IContentLocation | IHeader;

// Location tracking for all elements
interface ILocationSortable {
    readonly documentOrder: ILocation;
}
```

### Content Part Types

```typescript
// Text content blocks
interface IWrite extends ILocationSortable {
    type: 'doculisp-write';
    value: string;                    // Raw text/markdown content
}

// Document titles with metadata
interface ITitle extends ILocationSortable {
    type: 'doculisp-title';
    title: string;                    // Primary title text
    label: string;                    // Display label
    ref_link: string;                 // Generated reference link
    subtitle?: string | undefined;    // Optional subtitle
}

// Section headers with depth
interface IHeader extends ILocationSortable {
    type: 'doculisp-header';
    depthCount: number;              // Header level (1-6)
    text: string;                    // Header text
}

// Table of contents configuration
interface ITableOfContents extends ILocationSortable {
    type: 'doculisp-toc';
    label: string | false;           // Optional TOC title
    bulletStyle: DoculispBulletStyle; // Formatting style
}

// Content insertion point
interface IContentLocation extends ILocationSortable {
    type: 'doculisp-content';
}
```

### External Document Structure

```typescript
// External file references
interface ILoad extends ILocationSortable {
    type: 'doculisp-load';
    path: IPath;                     // File path
    sectionLabel: string;            // Section identifier
    document: ISectionWriter | false; // Loaded document or failure
}

// Table of contents bullet styles
type DoculispBulletStyle = 
    'no-table'  |                    // No TOC generated
    'unlabeled' |                    // Plain links
    'labeled'   |                    // Links with section labels
    'numbered'  |                    // Numbered list
    'numbered-labeled' |             // Numbered with labels
    'bulleted' |                     // Bullet points
    'bulleted-labeled';              // Bullets with labels
```

## Transformation Logic

### Document Generation Process

1. **Result Validation**: Check if input is successful, handle failures
2. **Empty Document Handling**: Return empty string for empty documents
3. **Header Generation**: Create document header with metadata and author info
4. **Content Processing**: Transform Doculisp parts to markdown
5. **Footer Generation**: Add closing metadata and formatting markers

### Content Processing Patterns

```typescript
// Main processing flow
function writeSection(previous: ILocation, section: ISectionWriter): string

// Individual content type processors
function writeAstWrite(astWrite: IWrite): string           // Text blocks
function writeAstTitle(astTitle: ITitle): string           // Titles
function writeAstHeader(astHeader: IHeader): string        // Headers  
function writeTableOfContents(toc: ITableOfContents, loads: ILoad[]): string
function writeContent(loads: ILoad[]): string              // External content
```

### Table of Contents Generation

The TOC system supports multiple formatting styles:

- **labeled**: `Label: [Title](link)`
- **unlabeled**: `[Title](link)`
- **numbered**: `1. [Title](link)`
- **numbered-labeled**: `1. Label: [Title](link)`
- **bulleted**: `* [Title](link)`
- **bulleted-labeled**: `* Label: [Title](link)`

### Content Spacing Logic

Intelligent spacing between content blocks:
- Double line breaks between different content types
- Smart spacing for consecutive text blocks based on location proximity
- Proper separation for document boundaries

## Output Structure

### Generated Document Format

```markdown
<!-- GENERATED DOCUMENT DO NOT EDIT! -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- Compiled with doculisp https://www.npmjs.com/package/doculisp -->
<!-- Written By: Author Name -->

[CONTENT]

<!-- Written By: Author Name -->
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- GENERATED DOCUMENT DO NOT EDIT! -->
```

### Content Processing Rules

1. **Text Blocks**: Direct output with smart spacing
2. **Titles**: Formatted as markdown headers with optional subtitles
3. **Headers**: Generated with appropriate `#` markers and text
4. **TOC**: Formatted link lists based on bullet style configuration
5. **Content**: Recursive processing of external documents
6. **Authors**: Extracted from variable table and added as HTML comments

## StringBuilder Utility

Internal utility class for efficient string construction:

```typescript
class StringBuilder {
    addLine(): StringBuilder                    // Add empty line
    addLine(value: string): StringBuilder       // Add line with content
    add(value: string): StringBuilder           // Append to current line
    toString(): string                          // Get final result
    get length(): number                        // Total character count
    get lineLength(): number                    // Current line length
}
```

## Error Handling

### Error Propagation
- Input validation failures are passed through unchanged
- Missing external documents result in skipped content
- Invalid bullet styles generate debug markers

### Validation Patterns
```typescript
// Result validation
if (!astMaybe.success) {
    return astMaybe;  // Pass through errors unchanged
}

// Empty document handling
if (astMaybe.value.type === 'doculisp-empty') {
    return util.ok('');
}

// Missing document handling
if (!load.document) {
    continue;  // Skip missing external documents
}
```

## Integration Patterns

### Dependency Injection
```typescript
const stringWriter: IRegisterable = {
    builder: (util: IUtil) => buildWriter(util),
    name: 'stringWriter',
    dependencies: ['util'],
    singleton: false,
};
```

### Usage Pattern
```typescript
// Standard usage
const writer = container.build<IStringWriter>('stringWriter');
const result = writer.writeAst(doculispResult, variableTable);

// With error handling
if (result.success) {
    // Use result.value as markdown string
} else {
    // Handle result.error
}
```

## Testing Strategies

### Approval Testing
- Use `verifyMarkdown` for successful output verification
- Use `verifyAsJson` for error result verification
- Test various TOC bullet styles and configurations

### Test Categories
1. **Basic Functionality**: Error propagation, empty documents
2. **Text Blocks**: Simple text, multiline content, spacing rules
3. **Lisp Blocks**: Titles, headers, TOC generation
4. **Sub Documents**: External content inclusion, recursive processing
5. **Integration**: Complete pipeline testing with real documents

### Mock Setup
```typescript
// Use testable helpers for consistent environment
const writer = testable.stringWriter.writer(container);
const result = testable.stringWriter.resultBuilder(container, environment => {
    // Configure path constructor, file handler, variable table
});
```

## Location Tracking

### Document Order Processing
- Maintains `ILocation` information throughout transformation
- Uses previous location for intelligent spacing decisions
- Tracks document boundaries for proper content separation

### Spacing Intelligence
```typescript
if (previousType === 'doculisp-write' && doculisp.type === 'doculisp-write') {
    if (previous.documentPath !== doculisp.documentOrder.documentPath
       || (previous.line + 2) <= doculisp.documentOrder.line
       || (doculisp.documentOrder.line + 2) <= previous.line) {
        sb.addLine();  // Add extra spacing for distant content
    }
}
```

## Variable Table Integration

### Author Metadata
- Retrieves `author` array from variable table
- Generates HTML comment blocks for author attribution
- Supports multiple authors with repeated comment blocks

### Metadata Processing
```typescript
function buildAuthorTable(variableTable: IVariableRetriever): string | false {
    const authors = variableTable.getValue<string[]>('author');
    if (!authors || authors.length === 0) {
        return false;
    }
    // Generate author comments
}
```

## Performance Considerations

### Efficient String Building
- Uses StringBuilder for optimal string concatenation
- Minimizes string operations through builder pattern
- Handles large documents with recursive content inclusion

### Memory Management
- Processes content sequentially to avoid large memory footprint
- Skips missing external documents gracefully
- Uses lazy evaluation for optional content

## Common Usage Patterns

### Standard Document Generation
```typescript
const result = stringWriter.writeAst(doculispResult, variableTable);
if (result.success) {
    await fs.writeFile(outputPath, result.value);
}
```

### Pipeline Integration
```typescript
// Complete pipeline
const documentResult = documentParser.parse(filePath);
const tokenResult = tokenizer.parse(documentResult);
const astResult = astParser.parse(tokenResult);
const doculispResult = doculispParser.parse(astResult, variableTable);
const finalResult = stringWriter.writeAst(doculispResult, variableTable);
```

### Error Handling Chain
```typescript
return pipe(
    documentParser.parse(filePath),
    result => tokenizer.parse(result),
    result => astParser.parse(result),
    result => doculispParser.parse(result, variableTable),
    result => stringWriter.writeAst(result, variableTable)
);
```