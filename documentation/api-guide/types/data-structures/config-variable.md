<!-- (dl (section-meta Configuration and Variable Types)) -->

These types manage configuration settings, variable storage, and metadata throughout the processing pipeline.

<!-- (dl (##variable-table-type `IVariableTable`)) -->

Core interface for variable storage and retrieval:

```typescript
interface IVariableTable {
    addValue(key: string, value: Variable): void;
    getValue(key: string): Variable | undefined;
    hasValue(key: string): boolean;
    createChild(): IVariableTable;
}
```

**Key Methods:**
- **`addValue`** - Store variables with string keys
- **`getValue`** - Retrieve variables by key
- **`hasValue`** - Check for variable existence
- **`createChild`** - Create isolated child scope

<!-- (dl (##testable-variable-table-type `ITestableVariableTable`)) -->

Extended interface for testing scenarios with additional capabilities:

```typescript
interface ITestableVariableTable extends IVariableTable {
    exportAsJson(): Record<string, any>;
    clear(): void;
}
```

**Additional Methods:**
- **`exportAsJson`** - Export all variables for inspection
- **`clear`** - Reset table for test isolation
- **Testing support** - Enables verification and cleanup in tests

<!-- (dl (##variable-type `Variable`)) -->

Union type representing all possible variable value types:

```typescript
type Variable = 
    | IVariableId
    | IStringArray  
    | IVariablePath
    | IVariableString;
```

**Variable Types:**
- **`IVariableId`** - Identifier references for linking
- **`IStringArray`** - Collections of string values
- **`IVariablePath`** - File path references
- **`IVariableString`** - Simple string values

<!-- (dl (##source-key-constant `sourceKey`)) -->

Special constant for the source file variable key:

```typescript
const sourceKey: string;
```

**Purpose:**
- **Source tracking** - Identifies the current source file being processed
- **Error context** - Enables accurate error reporting with file information
- **Pipeline coordination** - Maintains source context across processing stages

<!-- (dl (##working-directory-key-constant `workingDirectoryKey`)) -->

Special constant for the working directory variable key:

```typescript
const workingDirectoryKey: string;
```

**Purpose:**
- **Path resolution** - Base directory for relative path calculations
- **Include processing** - Context for resolving external file dependencies
- **File operations** - Working directory for file system operations

**Usage Example:**
```typescript
// Set up variable context
const variables = container.buildAs<IVariableTable>('variableTable').createChild();
variables.addValue(sourceKey, { type: 'variable-path', value: sourcePath });
variables.addValue(workingDirectoryKey, { type: 'variable-path', value: workingDir });
```