<!-- (dl (section-meta File System Operations)) -->

These types provide abstracted file system operations for reading, writing, and path management.

<!-- (dl (##ipath-type `IPath`)) -->

Core interface for file path representation and manipulation:

```typescript
interface IPath {
    readonly fullPath: string;
    readonly extension: string;
    readonly fileName: string;
    readonly directoryPath: string;
    // Additional path manipulation methods...
}
```

**Key Features:**
- **Full path access** - Complete file system path
- **Extension handling** - File extension extraction and validation
- **Name extraction** - File name without path or extension
- **Directory operations** - Parent directory path access

<!-- (dl (##path-constructor-type `PathConstructor`)) -->

Factory function type for creating `IPath` instances:

```typescript
type PathConstructor = (pathString: string) => IPath;
```

**Usage:**
- **Path creation** - Convert string paths to `IPath` objects
- **Validation** - Ensures path format consistency
- **Abstraction** - Platform-independent path handling

**Example:**
```typescript
const pathConstructor = container.buildAs<PathConstructor>('pathConstructor');
const sourcePath = pathConstructor('./docs/readme.dlisp');
```

<!-- (dl (##ifile-handler-type `IFileHandler`)) -->

Complete file system operations interface combining all file operations:

```typescript
interface IFileHandler extends IFileLoader, IFileWriter, IDirectoryHandler {
    // Combines all file system capabilities
}
```

**Capabilities:**
- **File reading** - Load file contents from disk
- **File writing** - Save content to files
- **Directory operations** - List, create, and manage directories
- **Unified interface** - Single point for all file system needs

<!-- (dl (##ifile-loader-type `IFileLoader`)) -->

Interface for reading files from the file system:

```typescript
interface IFileLoader {
    loadFile(path: IPath): Promise<Result<string>>;
    fileExists(path: IPath): Promise<boolean>;
}
```

**Methods:**
- **`loadFile`** - Read file content as string with error handling
- **`fileExists`** - Check file existence without reading content
- **Async operations** - Non-blocking file system access

<!-- (dl (##ifile-writer-type `IFileWriter`)) -->

Interface for writing files to the file system:

```typescript
interface IFileWriter {
    writeFile(path: IPath, content: string): Promise<Result<void>>;
}
```

**Methods:**
- **`writeFile`** - Save string content to specified path
- **Error handling** - Returns `Result<void>` for safe operation chaining
- **Async operations** - Non-blocking file writing

<!-- (dl (##idirectory-handler-type `IDirectoryHandler`)) -->

Interface for directory operations:

```typescript
interface IDirectoryHandler {
    listDirectory(path: IPath): Promise<Result<string[]>>;
    createDirectory(path: IPath): Promise<Result<void>>;
    directoryExists(path: IPath): Promise<boolean>;
}
```

**Methods:**
- **`listDirectory`** - Get directory contents as string array
- **`createDirectory`** - Create directory (including parent directories)
- **`directoryExists`** - Check directory existence
- **Path management** - Handle directory creation and traversal