<!-- (dl (section-meta [Unreleased])) -->

<!-- (dl (# Breaking Changes)) -->
- **AST Block Range Tracking**: Enhanced AST identifiers with precise block range information
  - **Range Information**: AST identifiers now include required `blockRange` property containing start and end locations
    - **Start Location**: Precise character position where the opening parenthesis begins
    - **End Location**: Precise character position where the closing parenthesis ends
    - **Full Block Coverage**: Range spans the entire block from opening to closing parenthesis
  - **Parser Enhancement**: AST parser now calculates and stores block ranges during identifier parsing
    - **Location Calculation**: Uses `current.increaseChar(-1)` for opening parenthesis position
    - **Closing Location**: Captures exact closing parenthesis location from tokens
    - **Range Construction**: Creates `IRange` objects with start and end coordinates
  - **Type System Support**: Added `IRange` interface to general types for location coordinate pairs
    - **Range Definition**: Contains `start` and `end` location coordinates
    - **Location Coordinates**: Uses existing `ILocationCoordinates` interface
    - **Type Integration**: Seamlessly integrates with existing location tracking system

<!-- (dl (# Improved)) -->
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
- **IDE Integration**: Enhanced language server capabilities with precise block tracking
  - **Code Navigation**: Better jump-to-definition and find-references functionality
  - **Error Highlighting**: More precise error underlining for malformed blocks
  - **Refactoring Support**: Enhanced block selection and manipulation capabilities
  - **Debugging Support**: Improved debugging information with exact block boundaries
- **Testing Infrastructure**: Enhanced test verification system with given-received pattern
  - **Approval Testing**: New `verifyWithGiven` function for comprehensive test validation
    - **Given Context**: Tests now capture original input alongside parsed results
    - **Result Comparison**: Enhanced approval testing with input/output correlation
    - **Test Clarity**: Better understanding of test cases with visible input data
  - **Test Coverage**: Expanded AST parser test suite with new multiline scenarios
    - **Multiline Parsing**: New tests for identifiers with closing parentheses on new lines
    - **Container Parsing**: Enhanced tests for nested structures with complex formatting
    - **Test Organization**: Improved test structure with comprehensive given-received validation

<!-- (dl (# Technical Details)) -->
- **Breaking Change**: Required `blockRange` property in AST identifier interface
  - **Required Property**: `blockRange` is now required for all AST identifiers
  - **API Impact**: Existing code consuming AST identifiers must handle the new required property
  - **Type Safety**: TypeScript consumers gain enhanced type information with guaranteed block range data
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
  - **Approval Baselines**: Updated test baselines with given-received format
  - **Test Utilities**: Enhanced `getVerifiers` function with additional verification methods

<!-- (dl (# Benefits)) -->
- **Enhanced Development Experience**: Developers working with Doculisp ASTs gain access to precise block boundaries
- **Better Error Reporting**: Tools can now highlight exact problem areas within blocks
  - **Precise Error Location**: Error messages point to exact Doculisp syntax rather than HTML comments
  - **Improved Debugging**: Location information helps developers quickly identify problematic code sections
  - **Enhanced IDE Features**: Language servers can provide more accurate syntax highlighting and error indicators
- **IDE Feature Support**: Language servers can provide more sophisticated editing features
- **Future Extensibility**: Foundation for advanced features like block-level refactoring and manipulation
- **Debugging Improvements**: Easier debugging with exact block boundary information
- **Testing Quality**: Enhanced test coverage and validation with given-received pattern testing