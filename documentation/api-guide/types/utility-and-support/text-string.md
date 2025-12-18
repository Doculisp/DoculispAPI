<!-- (dl (section-meta Text and String Processing)) -->

These types provide efficient string construction and text manipulation capabilities for document generation.

<!-- (dl (##istring-builder-type `IStringBuilder`)) -->

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

<!-- (dl (##string-builder-factory-type `StringBuilderFactory`)) -->

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

<!-- (dl (##itext-helpers-type `ITextHelpers`)) -->

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

<!-- (dl (##isearch-helpers-type `ISearchHelpers`)) -->

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