<!-- GENERATED DOCUMENT DO NOT EDIT! -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- Compiled with doculisp https://www.npmjs.com/package/doculisp -->
<!-- Written By: Jason Kerney -->

# Changelog #

1. Release: [[2.0.0] - TBD](#200---tbd)
2. Release: [[1.0.1] - 2025-10-14](#101---2025-10-14)
3. Release: [[1.0.0] - 2025-10-14](#100---2025-10-14)
4. History: [CLI Version History (Pre-API Extraction)](#cli-version-history-pre-api-extraction)

## [2.0.0] - TBD ##

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

- **Code Clarity**: The terminology change from "atom" to "identifier" provides clearer understanding of the language structure
  - Function names and keywords in Doculisp are now consistently called "identifiers"
  - More intuitive for developers familiar with programming language terminology
  - Better alignment with standard compiler and parser terminology

### Technical Details ###

- **Parser Infrastructure**: All parser handlers updated to use identifier terminology
- **Type System**: Complete type system refactoring for consistency
- **Internal APIs**: All internal function signatures updated
- **Language Server Integration**: Updated completion providers and syntax highlighting
- **Testing Framework**: Comprehensive test updates with new approval test baselines

### Migration Guide ###

For users of the DoculispTypeScript API:
- Update any references to `AtomToken` to use `IdentifierToken`
- Replace `IAstAtom` with `IAstIdentifier` in type annotations
- Change `AtomAst` to `IdentifierAst` where used
- Update any custom parser extensions to use the new identifier terminology
- Review any error handling that looked for "atom" in error messages - now use "identifier"

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