<!-- (dl (section-meta [Unreleased])) -->

### Improved ###

- **Error Reporting**: Enhanced error message consistency and precision across entire parsing pipeline
  - **Standardized Error Format**: All error messages now follow consistent formatting with proper prefixes and punctuation
    - Parse errors use `"Parse Error:"` prefix with clear descriptions
    - Validation errors use `"Validation Error:"` prefix with specific context
    - File system errors include full path information and operation details
  - **Enhanced Location Tracking**: Error messages now include precise range information with start and end positions
    - Range objects provide exact character positions for error highlighting
    - Line and character details included in error messages for better debugging
    - Comprehensive test coverage with 110+ updated approval test baselines
  - **Improved Error Context**: Error messages provide better context for troubleshooting
    - Detailed failure messages with line and character information
    - Range parameters included in failure handling across all parsers
    - Consistent error formatting across tokenizer, AST parser, Doculisp parser, project parser, document parser, and string writer

- **Documentation**: Comprehensive API Guide with complete pipeline documentation
  - **New API Documentation Sections**: Added detailed documentation for all major components
    - Doculisp API usage and integration patterns
    - String Writer functionality and output generation
    - Include Builder and external file handling
    - AST Project Parser and project file processing
    - Doculisp AST Parser and semantic validation
    - Core AST Parser and syntax tree construction
    - Tokenizer and lexical analysis
    - Document Parser and input processing
  - **Type System Documentation**: Complete documentation of API types and interfaces
    - Pipeline component types and dependency injection
    - Error handling interfaces and result types
    - Data structure types and parsing results
    - Utility types and helper interfaces
  - **Design Philosophy**: Added comprehensive introduction explaining core API design principles
    - Pipeline architecture and component composition
    - Type safety and error handling patterns
    - Testing strategies and best practices