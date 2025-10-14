# AI Doculisp AST Parser Codex

This codex provides comprehensive documentation for the Doculisp AST parser, which converts generic AST structures into semantically meaningful Doculisp constructs for document generation.

## Overview

The Doculisp AST parser is the fourth stage in the Doculisp processing pipeline:
- **Input**: `RootAst` or `IAstEmpty` (from AST parser)
- **Output**: `IDoculisp` or `IEmptyDoculisp` (structured document model)
- **Purpose**: Transforms generic AST nodes into domain-specific Doculisp structures with semantic validation

## Input Data Structures

### RootAst
The primary input structure from the AST parser:

```typescript
type RootAst = {
    readonly ast: CoreAst[];
    readonly location: IProjectLocation;
    readonly type: 'RootAst';
}
```

### CoreAst Types (Input)
The parser processes these AST node types:

#### IAstValue
```typescript
interface IAstValue {
    readonly value: string;
    readonly location: ILocation;
    readonly type: 'ast-value';
}
```
- Plain text content
- Converted to `IWrite` structures

#### IAstCommand
```typescript
interface IAstCommand {
    readonly value: string;
    readonly location: ILocation;
    readonly parameter: IAstParameter;
    readonly type: 'ast-command';
}
```
- Commands with single parameters
- Used for titles, headers, and simple directives

#### IAstContainer
```typescript
interface IAstContainer {
    readonly value: string;
    readonly location: ILocation;
    readonly subStructure: AtomAst[];
    readonly type: 'ast-container';
}
```
- Complex nested structures
- Used for section-meta, content, and include blocks

#### IAstAtom
```typescript
interface IAstAtom {
    readonly value: string;
    readonly location: ILocation;
    readonly type: 'ast-atom';
}
```
- Simple commands without parameters
- Used for basic content placement

### Additional Dependencies

#### IVariableSaver
```typescript
interface IVariableSaver {
    addValueToList(key: string, value: string): void;
}
```
- Used for storing author information and other metadata
- Accumulates values across parsing operations

## Output Data Structures

### IDoculisp
The primary output structure containing the complete document model:

```typescript
interface IDoculisp {
    projectLocation: IProjectLocation;
    section: ISectionWriter;
    type: 'doculisp-root';
}
```

### ISectionWriter
```typescript
interface ISectionWriter extends ILocationSortable {
    readonly doculisp: DoculispPart[];
    readonly include: ILoad[];
    readonly type: 'doculisp-section';
}
```

### Doculisp Part Types

#### IWrite
```typescript
interface IWrite extends ILocationSortable {
    readonly type: 'doculisp-write';
    readonly value: string;
}
```
- Plain text content for output
- Converted from `IAstValue` nodes

#### ITitle
```typescript
interface ITitle extends ILocationSortable {
    readonly type: 'doculisp-title';
    readonly title: string;
    readonly label: string;
    readonly ref_link: string;
    readonly subtitle?: string | undefined;
}
```
- Document titles with automatic link generation
- Supports optional subtitles and custom reference links

#### IHeader
```typescript
interface IHeader extends ILocationSortable {
    readonly type: 'doculisp-header';
    readonly depthCount: number;
    readonly text: string;
}
```
- Dynamic headers with depth-based formatting
- Generated from `(# text)` syntax

#### ILoad
```typescript
interface ILoad extends ILocationSortable {
    readonly type: 'doculisp-load';
    readonly path: IPath;
    readonly sectionLabel: string;
    document: ISectionWriter | false;
}
```
- External file inclusion specifications
- Automatically converts hyphens to spaces in labels

#### ITableOfContents
```typescript
interface ITableOfContents extends ILocationSortable {
    readonly type: 'doculisp-toc';
    readonly label: string | false;
    readonly bulletStyle: DoculispBulletStyle;
}
```
- Table of contents configuration
- Supports multiple bullet styles and optional labeling

#### IContentLocation
```typescript
interface IContentLocation extends ILocationSortable {
    readonly type: 'doculisp-content';
}
```
- Marks where external content should be inserted
- Requires section-meta with includes

### DoculispBulletStyle
```typescript
type DoculispBulletStyle = 
    'no-table'  |
    'unlabeled' |
    'labeled'   |
    'numbered'  |
    'numbered-labeled' |
    'bulleted' |
    'bulleted-labeled';
```

### IEmptyDoculisp
```typescript
interface IEmptyDoculisp {
    readonly type: 'doculisp-empty';
}
```
- Returned when input AST is empty

## Parsing Logic

### Parser Structure
Uses the generic parser infrastructure with specialized handler functions:

```typescript
const parser = internals.createArrayParser<CoreAst, DoculispPart | ILoad>(
    parseValue, 
    parseHeader, 
    parseSectionMeta, 
    parseContent
);
```

### State Tracking
The parser maintains global state for validation:
- `hasSectionMeta`: Ensures only one section-meta block per document
- `hasInclude`: Tracks whether includes are present for content validation

### Parsing Patterns

#### 1. Value Parsing
**Pattern**: `IAstValue` → `IWrite`
**Handler**: `parseValue()`
**Purpose**: Convert plain text to writable content

#### 2. Header Parsing
**Pattern**: Dynamic headers `(# text)` → `IHeader`
**Handler**: `parseHeader()`
**Validation**: 
- Command value must be only `#` characters
- Must have parameter for header text
- Depth calculated from `#` count + document depth

#### 3. Section-Meta Parsing
**Pattern**: Complex section metadata → `ITitle` + `ILoad[]`
**Handler**: `parseSectionMeta()`
**Sub-components**:
- **Title**: Required, single occurrence
- **Subtitle**: Optional, single occurrence
- **Ref-link**: Optional, custom reference link
- **Include**: Optional, external file specifications
- **Author**: Optional, multiple allowed (stored in variable table)

#### 4. Content Parsing
**Pattern**: Content placement + optional TOC → `IContentLocation` + `ITableOfContents`
**Handler**: `parseContent()`
**Validation**:
- Must come after section-meta
- Requires includes in section-meta
- Optional TOC with style and label configuration

## Section-Meta Processing

### Title Processing
```typescript
function parseTitle(ast: AtomAst[], location: ILocation, refLink: string | false, subtitle: string | false): Result<ITitle>
```

**Features**:
- **Link Generation**: Automatic ref_link from title text
- **Character Stripping**: Removes special characters for clean links
- **Subtitle Integration**: Optional subtitle with depth-based formatting
- **Custom Links**: Override with ref-link parameter

### Include Processing
```typescript
function parseInclude(ast: AtomAst[], location: ILocation): Result<ILoad[] | false>
```

**Features**:
- **Label Transformation**: Converts hyphens to spaces in section labels
- **Path Construction**: Uses PathConstructor for proper file paths
- **Multiple Sections**: Supports multiple external files
- **State Tracking**: Sets `hasInclude` flag for content validation

### Author Processing
```typescript
function parseAuthor(ast: AtomAst[], location: ILocation): Result<false>
```

**Features**:
- **Variable Storage**: Stores authors in variable table
- **Multiple Authors**: Supports multiple author blocks
- **Duplicate Prevention**: Variable table handles duplicates
- **Validation**: Ensures proper parameter format

## Content Processing

### TOC Processing
```typescript
function parseToc(ast: AtomAst[], location: ILocation): Result<ITableOfContents | false>
```

**Features**:
- **Style Validation**: Enforces valid bullet styles
- **Label Support**: Optional custom labels with header formatting
- **Configuration Blocks**: Supports `(label text)` and `(style type)` sub-blocks
- **Flexible Ordering**: Style and label blocks can appear in any order

### Bullet Style Validation
```typescript
function parseBulletStyle(bulletStyle: string | undefined, location: ILocation, documentPath: IPath): Result<DoculispBulletStyle>
```

**Valid Styles**:
- `'no-table'`: No table of contents
- `'unlabeled'`: Simple unlabeled list
- `'labeled'`: List with section labels
- `'numbered'`: Numbered list
- `'numbered-labeled'`: Numbered list with labels
- `'bulleted'`: Bulleted list
- `'bulleted-labeled'`: Bulleted list with labels

## Utility Functions

### Header Generation
```typescript
function headerize(depth: number, value: string): string {
    const id = ''.padStart(depth, '#');
    return `${id} ${value} ${id}`;
}
```
- Creates markdown headers with proper depth
- Used for titles, subtitles, and TOC labels

### Link Text Generation
```typescript
function getLinkText(title: IAstCommand, refLink: string | boolean): string
```
- Converts titles to URL-friendly reference links
- Strips special characters when `refLink` is false
- Preserves custom characters when `refLink` is provided

## Error Handling

### Validation Patterns

#### Structural Validation
- **Single Section-Meta**: Only one per document allowed
- **Required Elements**: Title required in section-meta
- **Order Dependencies**: Content must come after section-meta
- **Include Requirements**: Content requires includes with external files

#### Parameter Validation
- **Missing Parameters**: Commands requiring parameters must have them
- **Invalid Structures**: Prevents nested containers where not allowed
- **Duplicate Detection**: Multiple occurrences of singular elements
- **Unknown Commands**: Validates known command names

#### Error Context
```typescript
return util.fail(`Error description at '${location.documentPath.fullName}' Line: ${location.line}, Char: ${location.char}`, documentPath);
```
- **Precise Location**: Includes file path, line, and character
- **Context Information**: Describes what was expected vs found
- **Error Propagation**: Maintains error context through pipeline

## Integration Patterns

### Pipeline Position
```
Document Parser → Tokenizer → AST Parser → **Doculisp AST Parser** → Include Builder
```

### Dependency Registration
```typescript
const doculispParser: IRegisterable = {
    builder: (internals: IInternals, util: IUtil, trimArray: ITrimArray, pathConstructor: PathConstructor) => 
        buildAstParser(internals, util, trimArray, pathConstructor),
    name: 'astDoculispParse',
    singleton: false,
    dependencies: ['internals', 'util', 'trimArray', 'pathConstructor']
};
```

### Consumer Pattern
```typescript
const doculispResult = doculispParser.parse(astResult, variableTable);
if (doculispResult.success) {
    const doculisp = doculispResult.value;
    // Process doculisp structure...
}
```

## Testing Patterns

### Test Structure
```typescript
describe('doculisp parser', () => {
    let parser: IDoculispParser;
    let toResult: (text: string, location: IProjectLocation) => Result<IDoculisp | IEmptyDoculisp>;
    let variableTable: IVariableTestable;
    
    beforeEach(() => {
        parser = testable.doculisp.parserBuilder(container, environment => {
            // Setup mocks and variable table
            variableTable = environment.buildAs<IVariableTestable>('variableTable');
            variableTable.clear();
        });
    });
});
```

### Common Test Scenarios
1. **Empty Documents**: No AST → `IEmptyDoculisp`
2. **Plain Text**: Values only → `IWrite` structures
3. **Headers**: Dynamic headers → `IHeader` with depth
4. **Section-Meta**: Complete metadata → `ITitle` + `ILoad[]`
5. **Content**: Placement markers → `IContentLocation` + optional `ITableOfContents`
6. **Error Cases**: Validation failures, malformed structures
7. **Variable Storage**: Author information in variable table

### Parametrized Testing
```typescript
it.each([
    'no-table', 'unlabeled', 'labeled', 
    'numbered', 'numbered-labeled', 
    'bulleted', 'bulleted-labeled'
])('should parse TOC with bullet style %s', (bulletType: string) => {
    // Test implementation
});
```

## Document Structure Examples

### Basic Document
```
Input AST:
- IAstContainer: section-meta
  - IAstCommand: title "My Document"
- IAstValue: "Some content text"

Output:
IDoculisp {
  section: {
    doculisp: [
      ITitle { title: "My Document", label: "# My Document #" },
      IWrite { value: "Some content text" }
    ],
    include: []
  }
}
```

### Complex Document with Includes
```
Input AST:
- IAstContainer: section-meta
  - IAstCommand: title "Advanced Guide"
  - IAstContainer: include
    - IAstCommand: Section "./intro.md"
    - IAstCommand: Chapter "./advanced.md"
- IAstContainer: content
  - IAstContainer: toc
    - IAstCommand: label "Contents"
    - IAstCommand: style "numbered-labeled"

Output:
IDoculisp {
  section: {
    doculisp: [
      ITitle { title: "Advanced Guide" },
      ITableOfContents { label: "## Contents ##", bulletStyle: "numbered-labeled" },
      IContentLocation { type: "doculisp-content" }
    ],
    include: [
      ILoad { path: "./intro.md", sectionLabel: "Section" },
      ILoad { path: "./advanced.md", sectionLabel: "Chapter" }
    ]
  }
}
```

## Key Implementation Notes

1. **Semantic Validation**: Enforces Doculisp document structure rules
2. **State Management**: Tracks section-meta and include presence for validation
3. **Automatic Link Generation**: Creates URL-friendly reference links from titles
4. **Flexible Ordering**: Sub-elements within containers can appear in any order
5. **Variable Integration**: Stores metadata (authors) in variable table for later use
6. **Path Handling**: Uses PathConstructor for proper file path resolution
7. **Error Context**: Provides detailed location information for all validation errors
8. **Header Depth**: Calculates proper markdown header depth based on document nesting
9. **Character Normalization**: Handles special characters in titles and links
10. **TOC Configuration**: Supports flexible table of contents styling and labeling

This Doculisp AST parser serves as the critical semantic validation and transformation layer, converting generic AST structures into domain-specific document models that understand Doculisp's document generation requirements and constraints.