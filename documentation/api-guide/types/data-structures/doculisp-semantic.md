<!-- (dl (section-meta Doculisp Semantic Types)) -->

These types represent the semantic structure of Doculisp documents after AST processing, providing meaning to the parsed syntax.

<!-- (dl (##doculisp-part-type `DoculispPart`)) -->

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

<!-- (dl (##doculisp-type `IDoculisp`)) -->

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

<!-- (dl (##section-writer-type `ISectionWriter`)) -->

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

<!-- (dl (##toc-style-type `TocStyle`)) -->

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