<!-- GENERATED DOCUMENT DO NOT EDIT! -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- Compiled with doculisp https://www.npmjs.com/package/doculisp -->
<!-- Written By: Jason Kerney -->

# Changelog #

1. Unreleased: [[Unreleased]](#unreleased)
2. Release: [[2.1.0] - 2025-10-18](#210---2025-10-18)
3. Release: [[2.0.0] - 2025-10-18](#200---2025-10-18)
4. Release: [[1.0.1] - 2025-10-14](#101---2025-10-14)
5. Release: [[1.0.0] - 2025-10-14](#100---2025-10-14)
6. History: [CLI Version History (Pre-API Extraction)](#cli-version-history-pre-api-extraction)

## [Unreleased] ##

### Breaking Changes ###

- **AST Block Range Tracking**: Enhanced AST identifiers, commands, and containers with precise block range information
  - **Type System Breaking Change**: New required `blockRange` property added to existing interfaces
    - **TypeScript Impact**: `IAstIdentifier`, `IAstCommand`, and `IAstContainer` interfaces now require `blockRange` property
    - **Compilation Requirement**: TypeScript consumers must handle the new required field for successful compilation
    - **Runtime Safety**: API always populates this data - no undefined values or runtime errors
    - **Purely Additive**: New functionality that extends existing capabilities without removing features
  - **Range Information**: AST identifiers, commands, and containers now include required `blockRange` property containing start and end locations
    - **Start Location**: Precise character position where the opening parenthesis begins
    - **End Location**: Precise character position where the closing parenthesis ends
    - **Full Block Coverage**: Range spans the entire block from opening to closing parenthesis
  - **Parser Enhancement**: AST parser now calculates and stores block ranges during identifier, command, and container parsing
    - **Location Calculation**: Uses `identifier.location.increaseChar(-1)` for accurate opening parenthesis position
    - **Closing Location**: Captures exact closing parenthesis location from tokens
    - **Range Construction**: Creates `IRange` objects with start and end coordinates
    - **Container Support**: AST containers now track their complete block range from opening to closing parenthesis
    - **Project Parser Integration**: AST Project parser now includes block range support for project document structures
  - **Doculisp AST Parser Integration**: Enhanced Doculisp semantic parser with block range support for path references and content blocks
    - **Path ID Block Range**: `IPathId` interface now includes required `blockRange` property for precise `get-path` command tracking
    - **Content Block Range**: `IContentLocation` interface now includes required `blockRange` property for precise content block tracking
    - **Include Statement Range**: `ILoad` interface now includes required `blockRange` property for precise include statement tracking
    - **Doculisp Path Parsing**: AST Doculisp parser `parsePath` function now preserves block range information from underlying AST nodes
    - **Doculisp Content Parsing**: AST Doculisp parser `parseContent` function now preserves block range information from underlying AST nodes
    - **Include Statement Parsing**: AST Doculisp parser preserves block range information for include statements in section metadata
    - **Cross-Reference Tracking**: Path reference commands (`get-path`) now include precise block boundaries for enhanced tooling support
    - **Content Block Tracking**: Content placement blocks now include precise block boundaries for enhanced tooling support
    - **Include Block Tracking**: Include statements in section metadata now include precise block boundaries for enhanced tooling support
    - **Semantic Layer Enhancement**: Block range information flows from core AST through Doculisp semantic layer to final output
  - **Type System Support**: Added `IRange` interface to general types for location coordinate pairs
    - **Range Definition**: Contains `start` and `end` location coordinates
    - **Location Coordinates**: Uses existing `ILocationCoordinates` interface
    - **Type Integration**: Seamlessly integrates with existing location tracking system

### Improved ###

- **Tokenizer Error Handling**: Enhanced whitespace validation after opening parenthesis
  - **Syntax Error Detection**: Tokenizer now properly rejects whitespace characters immediately following opening parentheses
    - **Error Prevention**: Prevents malformed Doculisp syntax like `( identifier)` from being tokenized
    - **Clear Error Messages**: Provides specific error messages for different whitespace types (space, newline, tab)
    - **Context Awareness**: Only applies validation when tokenizer is in parameter/identifier parsing state
  - **Whitespace Types Detected**: Comprehensive validation for all whitespace scenarios
    - **Space Characters**: Detects and rejects space characters after opening parenthesis
    - **Newline Characters**: Handles both Windows (`\r\n`) and Unix (`\n`) line endings
    - **Tab Characters**: Detects and rejects tab characters following opening parenthesis
    - **Mixed Whitespace**: Properly handles multiple consecutive whitespace characters
  - **Parser State Integration**: Validation respects tokenizer state machine behavior
    - **State-Aware Validation**: Only validates whitespace when `isToken` flag indicates parameter/identifier context
    - **Syntax Preservation**: Valid syntax like text content with spaces remains unaffected
    - **Error Context**: Provides precise location information for whitespace errors
  - **Comprehensive Test Coverage**: Added 11 comprehensive test cases for whitespace error scenarios
    - **Error Cases**: Tests for space, newline, tab, multiple whitespace, and Windows line endings
    - **Success Cases**: Validates that valid syntax continues to work correctly
    - **Nested Contexts**: Tests whitespace handling in nested container structures
- **Parser Location Tracking**: Enhanced Doculisp content location precision
  - **Content Location Accuracy**: Parser now tracks precise Doculisp content location instead of HTML comment markers
    - **Accurate Error Reporting**: Error messages now point to exact Doculisp syntax location rather than comment start
    - **Debugging Enhancement**: Location information points to actual content for better debugging experience
    - **AST Location Precision**: Abstract syntax tree nodes contain precise content locations
  - **Implementation Details**: Improved `isDoculisp` parser function in document parser
    - **Content Start Tracking**: Added `contentStartLocation` variable to track actual content beginning
    - **Location Calculation**: Updates location to skip over discarded `(dl ` prefix markers
    - **First Content Detection**: Locates first meaningful text content for accurate positioning
  - **Test Coverage**: Updated all approval tests to reflect corrected location tracking
    - **Location Verification**: All test baselines updated with precise content character positions
    - **Comprehensive Coverage**: 27+ test files updated across AST, Doculisp, document, and include parsers
    - **Test Accuracy**: Tests now verify exact content location rather than comment location
- **Testing Infrastructure**: Enhanced test verification system with given-received pattern
  - **Approval Testing**: New `verifyWithGiven` function for comprehensive test validation
    - **Given Context**: Tests now capture original input alongside parsed results
    - **Result Comparison**: Enhanced approval testing with input/output correlation
    - **Test Clarity**: Better understanding of test cases with visible input data
  - **Test Coverage**: Expanded AST parser test suite with new multiline scenarios
    - **Multiline Parsing**: New tests for identifiers with closing parentheses on new lines
    - **Container Parsing**: Enhanced tests for nested structures with complex formatting
    - **Test Organization**: Improved test structure with comprehensive given-received validation

### Technical Details ###

- **Type System Changes**: Required `blockRange` property in AST identifier, command, and container interfaces
  - **Required Property**: `blockRange` is now required for all AST identifiers, commands, and containers
  - **TypeScript Breaking Change**: Interface changes require TypeScript consumers to update type handling
  - **JavaScript Compatibility**: JavaScript consumers continue to work without changes (additional property ignored)
  - **Type Safety**: TypeScript consumers gain enhanced type information with guaranteed block range data
  - **Complete AST Coverage**: All AST node types (`IAstIdentifier`, `IAstCommand`, `IAstContainer`) now include block range tracking
  - **Project AST Integration**: `IProjectDocuments` and `IProjectDocument` interfaces now include required `blockRange` property for complete project structure tracking
  - **Doculisp Type Integration**: `IPathId`, `IContentLocation`, and `ILoad` interfaces in Doculisp AST types now include required `blockRange` property for comprehensive block tracking
  - **Migration Impact**: Mock objects and test fixtures need to include new `blockRange` property
- **Parser Performance**: Minimal performance impact with efficient range calculation
  - **Single Pass**: Range calculation integrated into existing parsing logic
  - **Memory Efficient**: Range objects created only when needed during parsing
  - **Location Reuse**: Leverages existing location tracking infrastructure
- **Implementation Details**: Clean integration with existing parser architecture
  - **Handler Pattern**: Uses established parser handler signature patterns
  - **Location Tracking**: Builds on existing `ILocation` and coordinate system
  - **Type Hierarchy**: Extends `IAstIdentifier` interface without breaking changes
- **Test Framework Enhancement**: Improved testing capabilities for parser validation
  - **Tool Functions**: New `verifyWithGiven` helper for enhanced approval testing
  - **Test Organization**: Better separation of input data and expected results
  - **Approval Baselines**: Updated test baselines with given-received format and block range information
  - **Test Utilities**: Enhanced `getVerifiers` function with additional verification methods
  - **AST Test Updates**: Comprehensive test baseline updates to reflect new block range properties
    - **Block Range Validation**: All AST parser tests now validate precise block range information
    - **Command Tests**: Enhanced test coverage for AST command block range tracking
    - **Location Accuracy**: Test baselines updated with corrected location calculations
    - **Project Parser Tests**: AST Project parser tests updated with enhanced `verifyWithGiven` pattern and block range validation

### New Features ###

- **Enhanced Error Handling**: Introduced advanced error categorization and processing step tracking
  - **Extended Error Interface**: New `IFailAlt` interface provides enhanced error information beyond basic failure messages
    - **Failure Categories**: Errors now classified into logical categories (`Parse Error`, `Validation Error`, `File System Error`, `Include Error`)
    - **Processing Steps**: Detailed tracking of where in the pipeline errors occur (`Document Parsing`, `Tokenization`, `AST Parsing`, etc.)
    - **Enhanced Debugging**: Developers can now understand both what went wrong and where it happened in the processing pipeline
  - **Parallel Error System**: New error handling system runs alongside existing error handling for gradual migration
    - **Backward Compatibility**: Existing `IFail` interface remains fully functional and unchanged
    - **Enhanced Result Types**: `Result<T>` now supports both traditional and enhanced error types
    - **Gradual Adoption**: Teams can migrate to enhanced error handling incrementally without breaking changes
  - **Improved Error Builder**: New `failAlt()` method provides structured error creation
    - **Curried Interface**: `util.failAlt(step)(message, category, path)` enables step-specific error builders
    - **Consistent Categorization**: Enforces proper error classification at the point of creation
    - **Clean Message Format**: Error messages no longer require category prefixes - handled automatically by the interface
  - **Version Package Integration**: Package information retrieval now uses enhanced error handling as the first migration target
    - **Processing Step Tracking**: Version errors now properly categorized under 'Package Information Retrieval' step
    - **Validation Error Classification**: Package.json access failures properly classified as 'Validation Error' category
    - **Foundation Pattern**: Establishes the migration pattern for other components to follow

### Benefits ###

- **Enhanced Development Experience**: Developers working with Doculisp ASTs gain access to precise block boundaries
- **Better Error Reporting**: Tools can now highlight exact problem areas within blocks
  - **Precise Error Location**: Error messages point to exact Doculisp syntax rather than HTML comments
  - **Improved Debugging**: Location information helps developers quickly identify problematic code sections
  - **Enhanced IDE Features**: Language servers can provide more accurate syntax highlighting and error indicators
- **IDE Feature Support**: Language servers can provide more sophisticated editing features
- **Future Extensibility**: Foundation for advanced features like block-level refactoring and manipulation
- **Debugging Improvements**: Easier debugging with exact block boundary information
- **Testing Quality**: Enhanced test coverage and validation with given-received pattern testing
- **Path Reference Enhancement**: `get-path` commands now provide precise block range information for improved cross-reference tooling
  - **Reference Highlighting**: Tools can now precisely highlight path reference blocks in editors
  - **Cross-Reference Navigation**: Enhanced support for jump-to-definition and find-references features
  - **Block-Level Operations**: Foundation for advanced editing operations on path reference blocks
- **Content Block Enhancement**: Content placement blocks now provide precise block range information for improved document structure tooling
  - **Content Highlighting**: Tools can now precisely highlight content placement blocks in editors
  - **Document Structure Navigation**: Enhanced support for navigation and manipulation of document structure
  - **Content Block Operations**: Foundation for advanced editing operations on content placement blocks
- **Include Statement Enhancement**: Include statements in section metadata now provide precise block range information for improved modular document tooling
  - **Include Highlighting**: Tools can now precisely highlight include statement blocks in editors
  - **File Reference Navigation**: Enhanced support for jump-to-file and dependency analysis features
  - **Include Block Operations**: Foundation for advanced editing operations on include statement blocks

### Migration Guide ###

**For TypeScript Consumers:**
- **Interface Updates**: `IAstIdentifier`, `IAstCommand`, `IAstContainer`, `IProjectDocuments`, and `IProjectDocument` now include required `blockRange: IRange` property
- **Mock Objects**: Update test fixtures and mock data to include `blockRange` property:
  ```typescript
  const mockIdentifier: IAstIdentifier = {
    value: "content",
    location: someLocation,
    type: "ast-identifier",
    blockRange: {
      start: startLocation,
      end: endLocation
    }
  };

  const mockCommand: IAstCommand = {
    value: "title",
    location: someLocation,
    type: "ast-command",
    parameter: someParameter,
    blockRange: {
      start: startLocation,
      end: endLocation
    }
  };

  const mockContainer: IAstContainer = {
    value: "section-meta",
    location: someLocation,
    type: "ast-container",
    subStructure: [],
    blockRange: {
      start: startLocation,
      end: endLocation
    }
  };

  const mockProjectDocuments: IProjectDocuments = {
    type: "project-documents",
    documents: [],
    location: someLocation,
    blockRange: {
      start: startLocation,
      end: endLocation
    }
  };

  const mockProjectDocument: IProjectDocument = {
    id: "document-id",
    sourcePath: sourcePath,
    destinationPath: destinationPath,
    location: someLocation,
    type: "project-document",
    blockRange: {
      start: startLocation,
      end: endLocation
    }
  };

  const mockPathId: IPathId = {
    type: "doculisp-path-id",
    id: "path-id",
    documentOrder: someLocation,
    blockRange: {
      start: startLocation,
      end: endLocation
    }
  };

  const mockContentLocation: IContentLocation = {
    type: "doculisp-content",
    documentOrder: someLocation,
    blockRange: {
      start: startLocation,
      end: endLocation
    }
  };

  const mockLoad: ILoad = {
    type: "doculisp-load",
    path: somePath,
    sectionLabel: "Section Label",
    document: false,
    documentOrder: someLocation,
    blockRange: {
      start: startLocation,
      end: endLocation
    }
  };
  ```

- **Type Safety**: New `IRange` interface provides precise block boundary information
- **No Runtime Changes**: Existing functionality remains unchanged - only additional data provided

**For JavaScript Consumers:**
- **No Changes Required**: JavaScript code continues to work without modifications
- **Additional Data Available**: New `blockRange` property available for enhanced tooling if desired

**Benefits After Migration:**
- **Precise Block Boundaries**: Access to exact start/end positions for AST nodes
- **Enhanced Tooling**: Foundation for advanced IDE features and debugging capabilities
- **Future-Ready**: Prepared for upcoming features that leverage block range information

## [2.1.0] - 2025-10-18 ##

### Improved ###

- **Development Infrastructure**: Upgraded TypeScript compiler and toolchain
  - **TypeScript**: Updated from version 4.4.4 to 5.9.3 (latest stable)
    - Gained 1.5 years of TypeScript improvements and bug fixes
    - Enhanced type inference and checking capabilities
    - Improved compilation performance and developer tooling
    - Access to modern TypeScript language features
    - Better IDE support and error messages during development
  - **TypeScript Related Dependencies**: Updated for compatibility
    - **ts-jest**: Updated from 29.0.5 to 29.1.2 for Jest integration
    - All TypeScript tooling now uses consistent version 5.9.3
    - Maintained backward compatibility with existing API consumers
  - **Compilation Verification**: Full testing and validation completed
    - All 293 existing tests continue to pass
    - No breaking changes introduced to public API
    - Generated declaration files remain fully compatible
    - Build process and CI/CD pipeline verified
    - API functionality confirmed with comprehensive testing

### Technical Details ###

- **Backward Compatibility**: Zero breaking changes for API consumers
  - Consumer projects can continue using any TypeScript version 4.0+
  - JavaScript projects require no changes
  - Generated declaration files use standard TypeScript syntax
  - Compiled JavaScript output remains ES2022 compatible
- **Development Benefits**: Enhanced development experience for contributors
  - Improved error messages and debugging information
  - Better IDE integration and IntelliSense support
  - Access to modern TypeScript features for internal development
  - Enhanced build tooling and compiler performance
  - Future-ready for upcoming TypeScript and Node.js versions
- **Quality Assurance**: Comprehensive validation process
  - Incremental upgrade approach from 4.x → 5.0.2 → 5.9.3
  - Full test suite execution at each upgrade step
  - API functionality verification with document compilation testing
  - Declaration file generation and compatibility verification
  - No compilation errors or type checking issues

### Migration Guide ###

**No action required for API consumers.** This upgrade affects only the internal development toolchain and provides no breaking changes to the public API.

For contributors and developers working on the DoculispAPI codebase:
- **Development Environment**: Consider updating to TypeScript 5.x for optimal development experience
- **Build Tools**: Ensure your development environment supports modern TypeScript versions
- **IDE Support**: Update TypeScript language server for enhanced IntelliSense and error detection
- **Testing**: All existing tests and development workflows remain unchanged

## [2.0.0] - 2025-10-18 ##

### Breaking Changes ###

- **API Terminology**: Renamed all references from "atom" to "identifier" throughout the codebase
  - **Token Types**: `AtomToken` → `IdentifierToken`
  - **AST Types**: `IAstAtom` → `IAstIdentifier`, `AtomAst` → `IdentifierAst`
  - **Parser Functions**: `parseAtom()` → `parseIdentifier()`, `tokenizeAtom()` → `tokenizeIdentifier()`
  - **Type Interfaces**: Updated all type definitions to use "identifier" terminology
  - **Documentation**: Updated all documentation, comments, and examples to reflect new terminology
  - **Test Files**: Updated test names and expectations to use identifier terminology
  - **Error Messages**: Changed error messages from "Unknown atom" to "Unknown identifier"

### Improved ###

- **Error Messages**: Significantly improved error message quality across the entire system
  - **Controller Module**: Standardized validation error messages with consistent prefixes and punctuation
    - Command validation errors: `"Validation Error: Must have a destination file."` with proper punctuation
    - Project validation errors: `"Validation Error: A project file cannot have a destination path."` with enhanced clarity
    - Source file validation: `"Validation Error: A source file must be given."` with consistent formatting
  - **File Handler**: Enhanced file operation error messages with standardized "Validation Error:" prefix
    - File load errors: `"Validation Error: File load failed: [reason] (Path: [fullPath])."`
    - File write errors: `"Validation Error: File write failed: [reason] (Path: [fullPath])."`
    - Directory access errors: `"Validation Error: Working directory access failed: [reason]."`
    - Directory change errors: `"Validation Error: Working directory change failed: [reason] (Path: [fullPath])."`
    - All file operation errors now include proper punctuation and path context
  - **Version Module**: Standardized package.json validation error messages
    - Version lookup errors: `"Validation Error: Could not find the version in package.json."` with enhanced specificity
  - **Doculisp AST Parser**: Complete standardization of semantic validation error messages
    - **Section-meta validation**: Enhanced error messages with consistent `"Validation Error:"` prefix
      - Multiple includes: `"Validation Error: The section-meta block at '[path]' has more than one include (Line: X, Char: Y)."`
      - Include parameter validation: `"Validation Error: The include block at '[path]' has unknown parameter '[param]' (Line: X, Char: Y)."`
      - Multiple IDs: `"Validation Error: The section-meta block at '[path]' has more than one id (Line: X, Char: Y)."`
      - ID structure validation: `"Validation Error: The section id block at '[path]' contains sub blocks (Line: X, Char: Y)."`
      - Missing ID parameter: `"Validation Error: The section id block at '[path]' is missing identifier text parameter (Line: X, Char: Y)."`
      - Duplicate ID usage: `"Validation Error: Section id '[id]' at '[path]' has already been used (Line: X, Char: Y).[context]"`
    - **Content block validation**: Enhanced error messages for table of contents validation
      - Multiple TOC blocks: `"Validation Error: The content block at '[path]' has more than one toc (Line: X, Char: Y)."`
      - TOC sub-block limits: `"Validation Error: The content block at '[path]' has [count] blocks and can only have 0, 1, or 2 blocks (Line: X, Char: Y)."`
      - Duplicate TOC configuration: `"Validation Error: The content block at '[path]' has a duplicate '[type]' block (Line: X, Char: Y). First occurrence at (Line: X, Char: Y)."`
    - **get-path command validation**: Enhanced path reference error messages
      - Missing parameter: `"Validation Error: get-path command at '[path]' is missing parameter (Line: X, Char: Y)."`
      - Unknown sub-structure: `"Validation Error: get-path command at '[path]' contains unknown sub structure (Line: X, Char: Y)."`
    - **Parse error standardization**: Unknown identifier errors now use `"Parse Error:"` prefix
      - Unknown identifiers: `"Parse Error: Unknown identifier '[identifier]' at '[path]' (Line: X, Char: Y)."`
  - **Project AST Parser**: Complete standardization of project file parsing error messages
    - **Parse error consistency**: All unknown identifier errors now use `"Parse Error:"` prefix with enhanced context
      - Documents block validation: `"Parse Error: Unknown identifier '[identifier]' at '[path]' (Line: X, Char: Y)."`
      - Document structure validation: `"Parse Error: Document block does not contain source or output at '[path]' (Line: X, Char: Y)."`
      - Duplicate block detection: `"Parse Error: Duplicate source block at '[path]' (Line: X, Char: Y)."`
      - Project structure validation: `"Parse Error: Duplicate documents block detected at '[path]' (Line: X, Char: Y). Project file may only contain a single documents block."`
    - **Enhanced error context**: Improved error message ordering and clarity for better debugging
  - **Tokenizer**: Enhanced tokenization error messages with standardized formatting
    - Parse error prefix: `"Parse Error: Tokenization failed: [original error message]"` for consistent error handling
  - **Document Parser**: Complete overhaul of all document parsing error messages with standardized formatting
    - Parse errors now use consistent `"Parse Error:"` prefix with clear descriptions
    - **Validation errors** now use consistent `"Validation Error:"` prefix for input validation
    - **Document depth validation**: `"Validation Error: Document depth must be a value of 1 or larger."`
    - **Document index validation**: `"Validation Error: Document index must be a value of 1 or larger."`
    - Standardized location format: `(Line: X, Char: Y)` with proper parentheses
    - Enhanced clarity: "Unclosed multiline code block", "Embedded Doculisp block detected", etc.
    - All 9+ document parser error messages updated and tested
  - **Container System**: All dependency injection error messages now include clear prefixes and context
    - Registration errors: `Registration failed: Module name is required.`
    - Build errors: `Build failed: No module named 'moduleName' is registered.`
    - Replacement errors: `Replacement failed: Module 'name' is not registered.`
    - Circular dependency detection: `Build failed: Circular dependency detected: "a" => "b" => "a".`
  - **File Handler**: Enhanced file operation error messages with full context
    - File load errors: `File load failed: [reason] (Path: [fullPath])`
    - File write errors: `File write failed: [reason] (Path: [fullPath])`
    - Directory errors: `Working directory [operation] failed: [reason] (Path: [fullPath])`
  - **Project Parser**: Enhanced project file parsing error messages with standardized formatting
    - Missing source/output blocks: `"Validation Error: Missing [source|output] block in document identifier"`
    - Duplicate IDs: `"Validation Error: Duplicate document ID 'id' at... Original use of ID was at..."`
    - **Documents block validation**: `"Parse Error: Documents block contains unknown identifier '[identifier]' at '[path]' (Line: X, Char: Y)."`
    - **Document structure validation**: `"Parse Error: Unknown identifier '[identifier]' at '[path]' (Line: X, Char: Y)."`
    - **Duplicate source blocks**: `"Parse Error: Duplicate source block at '[path]' (Line: X, Char: Y)."`
    - **Duplicate output blocks**: `"Parse Error: Duplicate output block at '[path]' (Line: X, Char: Y)."`
    - Invalid IDs: `"Validation Error: Document ID must be lowercase"` and character validation messages
    - Consistent location format: `(Line: X, Char: Y)` with proper punctuation
    - All 10+ project parser error messages updated and tested
  - **Include Builder**: Standardized include validation error messages with consistent formatting
    - Invalid file type errors: `"Validation Error: Invalid file type in include block at [path] (Line: X, Char: Y). Included files must be markdown or dlisp files."`
    - Consistent error prefix and location format matching other parser modules
    - Enhanced clarity by removing redundant file path information from error message
  - **AST Parser**: Complete standardization of core AST parsing error messages with enhanced formatting
    - **Parse Error Prefix**: All AST parser error messages now use consistent `"Parse Error:"` prefix
    - **Location Format**: Standardized location format using parentheses: `(Line: X, Char: Y)` with proper punctuation
    - **Token Processing Errors**: Enhanced error messages for unknown token handling
      - Unknown token errors: `"Parse Error: Unknown token '[token]' at '[path]' (Line: X, Char: Y)."`
      - Malformed lisp errors: `"Parse Error: Malformed lisp expression at '[path]' (Line: X, Char: Y)."`
      - Token type validation with improved clarity and context
    - **Comprehensive Testing**: All 3 AST parser core error messages verified with new approval test baselines
  - **Doculisp AST Parser**: Complete overhaul of Doculisp semantic parsing error messages with standardized formatting
    - **Validation Error Prefix**: All error messages now use consistent `"Validation Error:"` prefix (with selective `"Parse Error:"` for syntax issues)
    - **Location Format**: Standardized location format using parentheses: `(Line: X, Char: Y)`
    - **Section Meta Validation**: Enhanced error messages for section-meta block validation
      - Title validation: `"Validation Error: Missing title text in title block at [path] (Line: X, Char: Y)."`
      - **Section-meta missing title**: `"Parse Error: Section-meta missing title block at '[path]' (Line: X, Char: Y)."`
      - Multiple titles: `"Validation Error: Multiple title blocks found in section-meta at [path] (Line: X, Char: Y). Only one title block allowed per section-meta."`
      - Subtitle validation: `"Validation Error: Missing subtitle text in subtitle block at [path] (Line: X, Char: Y)."`
      - Multiple subtitles: `"Validation Error: Multiple subtitle blocks found in section-meta at [path] (Line: X, Char: Y). Only one subtitle block allowed per section-meta."`
      - Ref-link validation: `"Validation Error: Missing ref-link text in ref-link block at [path] (Line: X, Char: Y)."`
      - Multiple ref-links: `"Validation Error: Multiple ref-link blocks found in section-meta at [path] (Line: X, Char: Y). Only one ref-link block allowed per section-meta."`
      - Author validation: `"Validation Error: Author block at [path] does not contain the author's name (Line: X, Char: Y)."`
      - Unknown commands: `"Validation Error: The section-meta block at [path] contains unknown command 'command' (Line: X, Char: Y)."`
      - **Include unknown commands**: `"Parse Error: Include contains unknown command '[command]' at '[path]' (Line: X, Char: Y)."`
      - Duplicate section-meta: `"Validation Error: The section-meta block at [path] is a duplicate block (Line: X, Char: Y). Only one section-meta block allowed per file."`
    - **Content Block Validation**: Enhanced error messages for content block validation
      - Before section-meta: `"Validation Error: The content block at [path] exists before the section-meta block (Line: X, Char: Y)."`
      - Without includes: `"Validation Error: The content block at [path] exists without an include block that has external files (Line: X, Char: Y)."`
      - Unknown commands: `"Validation Error: The content block at [path] has unknown command 'command' (Line: X, Char: Y)."`
      - Unknown parameters: `"Validation Error: The content block at [path] contains unknown parameter 'param' (Line: X, Char: Y)."`
    - **Table of Contents Validation**: Enhanced TOC error messages
      - Unknown bullet style: `"Validation Error: The toc block at [path] has unknown bullet style 'style' (Line: X, Char: Y)."`
    - **Heading ID Validation**: Enhanced heading ID error messages
      - Symbol validation: `"Validation Error: Symbol(s) in heading id 'id' at [path] (Line: X, Char: Y)."`
      - Lowercase validation: `"Validation Error: Section id 'id' at [path] must be lowercase (Line: X, Char: Y). Did you mean 'suggested-id'?"`
      - Duplicate IDs: `"Validation Error: Duplicate heading ID 'id' at [path] (Line: X, Char: Y). Original use of ID was at [originalPath] (Line: X, Char: Y)."`
    - **Error Context Enhancement**: Improved error context with precise location information and clearer descriptions
    - **Grammar and Clarity**: Fixed grammar issues and improved readability across all error messages
    - **Consistency**: All 27+ Doculisp AST parser error messages now follow the same formatting standards
  - **String Writer**: Standardized document ID reference error messages with consistent formatting
    - Unknown document ID errors: `"Validation Error: Unknown document ID 'id' at [path] (Line: X, Char: Y)."`
    - Consistent error prefix and location format matching parser modules
    - Enhanced clarity for document linking and reference validation
  - **Error Consistency**: All error messages now follow consistent formatting patterns across the entire processing pipeline
  - **Better Debugging**: Error messages include file paths, operation context, and clear failure reasons
  - **Comprehensive Coverage**: Error message standardization initiative now covers all major parser modules including document, token, AST, Doculisp, project, include, and string writer components

- **Code Clarity**: The terminology change from "atom" to "identifier" provides clearer understanding of the language structure
  - Function names and keywords in Doculisp are now consistently called "identifiers"
  - More intuitive for developers familiar with programming language terminology
  - Better alignment with standard compiler and parser terminology

### Technical Details ###

- **Language Specification**: Version bumped to 2.0.0 reflecting the breaking terminology changes
- **Parser Infrastructure**: All parser handlers updated to use identifier terminology
- **Type System**: Complete type system refactoring for consistency
- **Internal APIs**: All internal function signatures updated
- **Language Server Integration**: Updated completion providers and syntax highlighting
- **Error Handling Infrastructure**: Complete overhaul of error message generation
  - Systematic error message standardization initiative across entire codebase
  - Standardized error message prefixes across all modules (`Parse Error:`, `Validation Error:`, etc.)
  - Enhanced error context with file paths and operation details
  - Consistent location format: `(Line: X, Char: Y)` with proper punctuation
  - Improved error message consistency and readability
  - Enhanced error propagation through the processing pipeline
  - Comprehensive error message improvement plan covering all parser modules
  - **AST Parser Error Standardization**: Complete standardization of all core AST parsing error messages with consistent prefixes and location formatting
  - Project parser error message standardization completing the parser error message consistency initiative
  - Include builder error message standardization with consistent validation error prefixes
  - **Doculisp AST Parser Error Standardization**: Complete standardization of all Doculisp semantic validation error messages with consistent prefixes and location formatting
  - **Testing Framework**: Comprehensive test updates with new approval test baselines
  - **Controller Module Test Coverage**: Added comprehensive validation error testing
    - **File destination validation**: New tests for missing destination file scenarios
    - **Project file validation**: New tests for invalid project file destination path scenarios
    - **Source file validation**: New tests for missing source file scenarios
    - All 3 new controller validation error messages verified with approval test baselines
  - **File Handler Test Coverage**: Enhanced file operation error testing with standardized message validation
    - **File load error tests**: Comprehensive testing of file not found and read permission scenarios
    - **File write error tests**: Enhanced testing of write permission and directory access scenarios
    - **Working directory tests**: Added testing for directory access and change operation failures
    - All file handler error messages now validated with consistent "Validation Error:" prefix expectations
  - **Doculisp AST Parser Test Coverage**: Expanded error scenario testing with new approval test baselines
    - **Section-meta validation tests**: Enhanced testing for multiple includes, IDs, and parameter validation
      - Multiple includes test: Validates proper error reporting for multiple include blocks in section-meta
      - Include parameter test: Validates error handling for unknown parameters in include blocks
      - Multiple IDs test: Validates proper error reporting for multiple id blocks in section-meta
      - ID structure test: Validates error handling for section ID blocks with sub-blocks
      - Missing ID parameter test: Validates error handling for section ID blocks without parameters
      - Duplicate section ID test: Validates error handling for reused section IDs across document
    - **Content block validation tests**: Enhanced testing for table of contents configuration
      - Multiple TOC test: Validates proper error reporting for multiple toc blocks in content
      - TOC sub-block limits test: Validates error handling for excessive toc configuration blocks
      - Duplicate TOC blocks test: Validates error handling for duplicate label/style blocks in toc
    - All 9 new Doculisp AST parser error scenario tests verified with approval test baselines
  - **Project AST Parser Test Coverage**: Expanded document structure validation testing
    - **Unknown identifier tests**: Enhanced testing for invalid identifiers in documents and document blocks
      - Document block unknown identifier test: Validates error reporting for invalid identifiers within document blocks
      - Document structure validation test: Validates error reporting for missing source/output in document blocks
      - Duplicate block tests: Enhanced testing for duplicate source/output blocks within documents
      - Top-level unknown identifier test: Validates error reporting for invalid project-level identifiers
    - All 4 new project parser error structure tests verified with approval test baselines
  - **Tokenizer Test Coverage**: Added tokenization failure error message testing
    - **Tokenization error handling**: New test for standardized error message format when tokenization fails
    - Parse error prefix validation: Ensures tokenization errors use consistent "Parse Error:" prefix
    - Enhanced error propagation testing for parser chain integration
  - Updated all container tests to expect new error message formats
  - Added comprehensive file handler error message testing
  - Systematic update of all document parser approval tests to match new error message formats
  - Updated all project parser approval tests to reflect standardized error message formats
  - Updated include builder approval tests for invalid file type error validation
  - **New AST Parser Test Coverage**: Added comprehensive error scenario test coverage with approval test baselines
    - Unknown token handling tests with malformed Doculisp expressions
    - Container structure validation tests for missing closing parentheses
    - Command validation tests for incomplete token sequences
    - All 3 new AST parser error message tests verified with approval test baselines
    - Both basic functionality and lisp expression test suites expanded with error validation
  - **Extended Doculisp AST Parser Test Coverage**: Expanded error scenario testing with new approval test baselines
    - **Section-meta missing title test**: New test for section-meta blocks without required title blocks
    - **Include unknown command test**: New test for invalid commands within include blocks
    - Enhanced validation coverage for semantic parsing errors
    - All new Doculisp AST parser error messages verified with approval test baselines
  - **Extended Project Parser Test Coverage**: Added comprehensive document structure validation testing
    - **Documents block unknown identifier test**: New test for invalid identifiers in documents block
    - **Document structure unknown identifier test**: New test for invalid identifiers within document blocks
    - **Duplicate source block test**: New test for multiple source blocks within single document
    - **Duplicate output block test**: New test for multiple output blocks within single document
    - All 4 new project parser error message tests verified with approval test baselines
  - **Extended Document Parser Test Coverage**: Added input validation testing with approval test baselines
    - **Document depth validation tests**: New tests for zero and negative depth values
    - **Document index validation tests**: New tests for zero and negative index values
    - Enhanced parameter validation coverage for document processing
    - All 4 new document parser validation error messages verified with approval test baselines
  - **Updated Doculisp AST parser approval tests**: Complete update of all 27+ approval test baselines for standardized error messages
    - Section-meta validation errors: title, subtitle, ref-link, author, and duplicate validation tests
    - Content block validation errors: location, include dependency, and command validation tests
    - Table of contents validation errors: bullet style and command validation tests
    - Heading ID validation errors: symbol, lowercase, and duplicate ID validation tests
    - All approval tests now expect consistent "Validation Error:" prefix and parentheses location format
  - Updated string writer approval tests for document ID reference validation errors
  - Enhanced test coverage for error scenarios and edge cases
  - All 9+ document parser error messages verified with updated approval test baselines
  - All 10+ project parser error messages verified with updated approval test baselines
  - Include builder file type validation error message verified with updated approval test baseline
  - **All 27+ Doculisp AST parser error messages verified** with updated approval test baselines covering section-meta, content, TOC, and heading ID validation
  - **All 3 AST parser error messages verified** with new comprehensive approval test baselines
  - String writer document ID reference error messages verified with updated approval test baselines

### Migration Guide ###

For users of the DoculispTypeScript API:
- **Terminology Updates**: Update any references to `AtomToken` to use `IdentifierToken`
- **Type System Changes**: Replace `IAstAtom` with `IAstIdentifier` in type annotations
- **AST Updates**: Change `AtomAst` to `IdentifierAst` where used
- **Parser Extensions**: Update any custom parser extensions to use the new identifier terminology
  - **Error Handling**: Review any error handling code that depends on specific error message formats
  - **Controller Module**: Validation errors now use `"Validation Error:"` prefix with proper punctuation
    - File destination errors: `"Validation Error: Must have a destination file."`
    - Project validation errors: `"Validation Error: A project file cannot have a destination path."`
    - Source file errors: `"Validation Error: A source file must be given."`
  - **File Handler**: All file operation errors now use `"Validation Error:"` prefix with enhanced context
    - File load errors: `"Validation Error: File load failed: [reason] (Path: [fullPath])."`
    - File write errors: `"Validation Error: File write failed: [reason] (Path: [fullPath])."`
    - Directory operation errors: `"Validation Error: Working directory [operation] failed: [reason]."`
    - All file operations now include proper punctuation and path context
  - **Version Module**: Package validation errors now use `"Validation Error:"` prefix
    - Version lookup errors: `"Validation Error: Could not find the version in package.json."`
  - **Doculisp AST Parser**: Complete standardization with consistent prefix usage
    - **Validation errors** now use `"Validation Error:"` prefix for semantic validation
      - Section-meta validation: Multiple includes, IDs, parameter validation all use consistent formatting
      - Content block validation: TOC configuration errors use standardized location format
      - get-path validation: Missing parameters and sub-structure errors use consistent prefixes
    - **Parse errors** now use `"Parse Error:"` prefix for syntax issues
      - Unknown identifier errors: `"Parse Error: Unknown identifier '[identifier]' at '[path]' (Line: X, Char: Y)."`
  - **Project AST Parser**: Complete standardization with `"Parse Error:"` prefix for structural issues
    - Unknown identifier errors: `"Parse Error: Unknown identifier '[identifier]' at '[path]' (Line: X, Char: Y)."`
    - Document structure validation: `"Parse Error: Document block does not contain source or output at '[path]' (Line: X, Char: Y)."`
    - Duplicate block detection: `"Parse Error: Duplicate [source|documents] block at '[path]' (Line: X, Char: Y)."`
    - Enhanced error message ordering for better clarity and debugging context
  - **Tokenizer**: Tokenization errors now use `"Parse Error:"` prefix
    - Tokenization failures: `"Parse Error: Tokenization failed: [original error message]"`
  - Document parser errors now use `"Parse Error:"` prefix with standardized location format
  - Container errors now have consistent prefixes (`Registration failed:`, `Build failed:`, etc.)
  - File operation errors now include full file paths in parentheses
  - Project parser errors now use `"Validation Error:"` prefix with consistent formatting
  - Include builder errors now use `"Validation Error:"` prefix with standardized location format
  - **AST parser errors**: Complete standardization with `"Parse Error:"` prefix for all syntax parsing
    - Unknown token errors now provide clear token identification and location information
    - Malformed lisp expression errors now use consistent formatting with file path context
    - All core AST parsing now follows the same error message patterns
  - **Doculisp AST parser errors**: Complete standardization with `"Validation Error:"` prefix for all semantic validation (and `"Parse Error:"` for syntax issues)
    - Section-meta validation errors now have consistent prefixes and improved clarity
    - Include validation errors now use `"Parse Error:"` prefix for syntax-level issues
    - Content block validation errors now include proper context about dependencies and order
    - Heading ID validation errors now provide better suggestions and duplicate detection
    - All Doculisp semantic validation now follows the same error message patterns
  - String writer errors now use `"Validation Error:"` prefix for document reference validation
  - Location information now uses parentheses format: `(Line: X, Char: Y)` instead of `Line: X, Char: Y`
  - Circular dependency messages use arrow notation (`"a" => "b" => "c"`)
  - **AST Parser Integration**: Update any AST parsing integration that depends on specific error message formats
    - Unknown token errors now use `"Parse Error:"` prefix with standardized location format
    - Malformed lisp expression errors now include full file path context
    - Token validation errors now provide enhanced debugging information
  - **Document Parser Integration**: Review any document processing that depends on validation error formats
    - Document depth and index validation errors now use `"Validation Error:"` prefix
    - Parameter validation now follows consistent formatting standards
  - **Project Parser Integration**: Update any project file processing that depends on error message formats
    - Documents block validation errors now use `"Parse Error:"` prefix with enhanced context
    - Document structure validation errors now provide clearer identifier information
    - Duplicate block detection errors now include precise location information
  - **Controller Integration**: Update any controller usage that depends on validation error formats
    - Command validation errors now use consistent "Validation Error:" prefix
    - Enhanced punctuation and grammar in all validation messages
  - **File Handler Integration**: Update any file operation handling that depends on error message formats
    - All file operations now use "Validation Error:" prefix with enhanced context
    - Path information now consistently included in parentheses format
  - **Tokenizer Integration**: Update any tokenization error handling
    - Tokenization errors now wrapped with "Parse Error:" prefix for consistency
    - Enhanced error propagation through parser chain
  - Replace any string matching for "atom" in error messages with "identifier"
  - Update any error message parsing that relied on previous inconsistent formats
  - All parser modules now follow the same error message formatting standards

## [1.0.1] - 2025-10-14 ##

### Fixed ###

- **Package Dependencies**: Fixed missing dependencies in package.json
  - Added proper dependency declarations for production use
  - Improved installation reliability for downstream consumers
  - Ensures all required modules are available when installed as a library

### Improved ###

- **Documentation**: Enhanced API documentation and usage examples
  - Clearer installation and setup instructions
  - Better code examples for common use cases
  - Improved TypeScript integration guidance

## [1.0.0] - 2025-10-14 ##

### New Project ###

This marks the initial release of **Doculisp API** as an independent library, extracted from the Doculisp CLI project to provide a dedicated API for building markdown documents with Doculisp DSL.

### Features ###

- **Complete Parsing Pipeline**: Full document processing from Doculisp source to markdown output
  - Document parser for `.md` and `.dlisp` files
  - Token parser for Doculisp syntax analysis
  - AST parser for syntax tree construction
  - Doculisp semantic parser for document structure validation
  - Include builder for external file resolution
  - String writer for final markdown generation

- **TypeScript API**: Comprehensive TypeScript API with full type definitions
  - All parsing pipeline components available as importable modules
  - Type-safe interfaces for all data structures
  - Generic parser system for extensibility
  - Container-based dependency injection system

- **File System Abstraction**: Flexible file handling for different environments
  - Abstract file system interfaces for testability
  - Support for both synchronous and asynchronous operations
  - Working directory management for relative path resolution

- **Project Support**: Handle multi-document projects with `.dlproj` files
  - Batch processing of multiple documents
  - Consistent variable sharing across document hierarchy
  - Configurable output paths and compilation options

- **Comprehensive Testing**: Full test suite with approval testing patterns
  - Unit tests for all pipeline components
  - Integration tests for complete workflows
  - Mock system for file operations
  - JSON and markdown verification patterns

### Migration from CLI ###

This API library was extracted from the Doculisp CLI to enable:
- **Library Integration**: Use Doculisp functionality in other Node.js applications
- **Custom Tooling**: Build custom tools and extensions using Doculisp parsing
- **Programmatic Access**: Process Doculisp documents programmatically
- **Framework Integration**: Integrate with build systems, IDEs, and other development tools

The CLI functionality continues to be available in the separate `doculisp` package, while this library focuses purely on the API functionality.

## CLI Version History (Pre-API Extraction) ##

This archive contains the version history from when this functionality was part of the Doculisp CLI project. These versions (2.9.0 through 3.4.12) represent the evolution of the parsing and API functionality before it was extracted into this dedicated API library.

The current Doculisp API project begins with version 1.0.0, which represents the extraction of this functionality from the CLI into an independent library.

### Historical Context ###

The Doculisp CLI project contained both:
- Command-line interface functionality
- Core parsing and document processing functionality (now this API)

In October 2025, the core functionality was extracted into this dedicated API library to:
- Enable programmatic use of Doculisp functionality
- Support library integration in other projects
- Provide a focused API without CLI dependencies
- Allow independent versioning of API vs CLI features

### CLI Version References ###

For reference, the CLI versions that contributed to this API functionality include:

- **3.4.12** (2025-09-23): TypeScript API Export improvements
- **3.4.10** (2025-09-20): Error handling and parsing improvements
- **3.4.9** (2025-09-16): Documentation and API enhancements
- **3.4.8** (2025-09-13): Parser stability and performance improvements
- **3.4.7** (2025-09-10): String writer and output formatting improvements
- **3.4.6** (2025-09-06): Include builder and file resolution enhancements
- **3.4.5** (2025-09-03): AST parser and semantic validation improvements
- **3.4.4** (2025-08-30): Token parser and syntax handling improvements
- **3.4.3** (2025-08-27): Document parser and file handling improvements
- **3.4.2** (2025-08-24): Core parsing pipeline enhancements
- **3.4.0** (2025-08-20): Major parsing architecture improvements
- **3.3.0** (2025-08-15): Container system and dependency injection
- **3.2.0** (2025-08-10): Project file support and batch processing
- **3.1.0** (2025-08-05): Advanced parsing features and error handling
- **3.0.0** (2025-08-01): Complete rewrite of parsing system
- **2.9.1** (2025-07-25): Bug fixes and stability improvements
- **2.9.0** (2025-07-20): Initial TypeScript migration and API foundation

The detailed history of these versions remains available in the original Doculisp CLI project repository.

<!-- Written By: Jason Kerney -->
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- GENERATED DOCUMENT DO NOT EDIT! -->