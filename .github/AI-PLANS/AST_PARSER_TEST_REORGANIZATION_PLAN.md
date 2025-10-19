# AST Parser Test Reorganization Plan

## Overview

This plan provides a systematic approach to reorganize and rename the `astParser.test.ts` file to follow modern testing conventions and improve maintainability. The reorganization will align with the AI Testing Codex principles while maintaining all existing functionality. This test file covers Abstract Syntax Tree parsing functionality that converts tokenized input into structured AST nodes, which is a critical component in the Doculisp parsing pipeline.

## Prerequisites

**CRITICAL**: Before executing any step, the copilot MUST:
1. Read the **AI Testing Codex** (`.github/AI-Testing-Codex.md`) in full
2. Read the **AI AST Parser Codex** (`.github/AI-AST-Parser-Codex.md`) for AST parsing understanding
3. Read the **AI Assistant Codex** (`.github/AI-Assistant-Codex.md`) for Doculisp syntax understanding
4. Read this complete plan document
5. Understand the commit message format from `.github/.copilot-instructions.md`

## Plan Execution Rules

1. **Step-by-step execution**: Complete each step individually and wait for confirmation before proceeding
2. **Test validation**: After each step, run tests. If tests pass, commit the changes. If tests fail, do NOT mark the step complete
3. **Plan updates**: Update this plan document after each completed step by marking it `[COMPLETED]`
4. **Approval file tracking**: Each step must include renaming all 18+ associated approval files to match new test names

## Jest Testing Requirements

**IMPORTANT**: All test commands in this plan use Jest directly via `npx jest` rather than `npm test`. This is because npm does not properly pass command-line arguments to Jest. 

**CRITICAL BUILD REQUIREMENT**: The Doculisp project uses a dependency injection container that auto-discovers modules from the `dist/` folder. **You MUST run `npm run build` before any test execution** or tests will fail due to missing compiled dependencies.

**Correct Commands:**
- Build and run specific test file: `npm run build && npx jest --testPathPattern=filename`
- Build and run all tests: `npm run build && npx jest`
- Build and run tests with watch mode: `npm run build && npx jest --watch`

**DO NOT USE:** `npm test -- --testPathPattern=filename` (this will not work correctly)

## Periodic Re-reading Requirements

**MANDATORY**: The copilot MUST re-read the following documents at these intervals:
1. **After every 2-3 test reorganizations**: Re-read this plan and the AI Testing Codex
2. **When summarizing the conversation**: Re-read this plan, AI Testing Codex, AI AST Parser Codex, and any relevant AI Assistant Codex sections
3. **After any extended pause or context switch**: Re-read all prerequisite documents
4. **Before starting each major reorganization phase**: Re-read relevant sections of this plan
5. **When encountering uncertainty or inconsistency**: Stop and re-read the appropriate codex documents

## Current State Analysis

The current `astParser.test.ts` has these issues:
- Non-descriptive main describe block using generic "ast" name
- Inconsistent test naming with all tests using "should" prefix pattern
- Duplicate test cases across "basic functionality" and "lisp" describe blocks
- 3 identical error handling tests in both sections (missing closing parenthesis, malformed container, unknown token)
- Mixed test organization with unclear separation between basic parsing and full document parsing
- 18+ approval files using old naming conventions
- Test structure doesn't clearly separate different AST node types or parsing scenarios
- Limited use of AI Testing Codex patterns for dependency injection

**Current Test Structure:**
- **Basic Functionality**: 7 tests (includes parser-level tests and error handling)
- **Lisp Processing**: 11 tests (includes full document parsing and duplicate error handling)

**Duplicate Issues Identified:**
- "should fail when command is missing closing parenthesis" appears in both sections
- "should fail when container structure is malformed" appears in both sections  
- "should fail when encountering unknown token type" appears in both sections

## Target State

After reorganization:
- Clear, descriptive test names following sentence structure with spaces
- Logical test grouping by AST parsing functionality
- Consistent naming conventions following AI Testing Codex patterns
- Better describe block organization separating parsing scenarios, node types, and error conditions
- All 18+ approval files correctly renamed (with duplicates consolidated to ~15 files)
- Elimination of duplicate test cases
- Improved readability and maintainability
- Clear separation between token-level parsing and document-level parsing

## Reorganization Steps

### Phase 1: Setup and Preparation

#### Step 1: Create Backup and Analyze Current Structure
- [ ] **[PENDING]** Create backup of current test file
- [ ] **[PENDING]** Document current approval files (18+ files)
- [ ] **[PENDING]** Identify 3 sets of duplicate test cases for consolidation
- [ ] **[PENDING]** Commit backup with message: `". d Creates backup before AST parser test reorganization"`

**Expected Outcomes**: 
- Backup file created
- Current state documented
- Duplicates identified for consolidation
- Safe starting point established

#### Step 2: Plan Test Name Mappings
- [ ] **[PENDING]** Create mapping document showing old test names → new test names
- [ ] **[PENDING]** Create mapping document showing old approval files → new approval files (~15 mappings after consolidation)
- [ ] **[PENDING]** Plan consolidation of 3 duplicate error handling test sets
- [ ] **[PENDING]** Validate no naming conflicts exist

**Expected Outcomes**:
- Complete rename mapping documented
- Duplicate consolidation planned (18 tests → ~15 unique tests)
- No conflicts identified
- Clear path forward established

### Phase 2: Core Test Structure Reorganization

#### Step 3: Reorganize Basic AST Parsing Tests
- [ ] **[PENDING]** Rename basic parsing tests under `describe('Basic AST Parsing')`
- [ ] **[PENDING]** Group by subcategories: Empty Input, Error Propagation, Text Nodes
- [ ] **[PENDING]** Use pattern: `{input type} {verb} {result}`
- [ ] **[PENDING]** Update associated approval files (4 files)
- [ ] **[PENDING]** Run tests and commit if passing

**Basic Parsing Tests to Rename**:
- `should return an empty doculisp if there was no tokens` → `empty token list produces empty AST`
- `should return failure if given failure` → `failed tokenization propagates error`
- `should parse a text token` → `single text token creates text node`
- `should parse multiple text tokens` → `multiple text tokens create text nodes`

**Expected Outcomes**:
- 4 basic AST parsing tests renamed
- 4 approval files renamed
- Tests logically grouped
- Tests passing
- Commit created

#### Step 4: Reorganize Lisp Structure Parsing Tests
- [ ] **[PENDING]** Rename Lisp parsing tests under `describe('Lisp Structure Parsing')`
- [ ] **[PENDING]** Group by subcategories: Simple Commands, Containers, Complex Documents
- [ ] **[PENDING]** Use pattern: `{structure type} {verb} {scenario}`
- [ ] **[PENDING]** Update associated approval files (8 files)
- [ ] **[PENDING]** Run tests and commit if passing

**Lisp Structure Tests to Rename**:
- `should simple lisp tokens` → `HTML comment with Doculisp parses successfully`
- `should parse a basic identifier` → `simple identifier command parses successfully`
- `should parse a basic identifier with close on new line` → `identifier with newline formatting parses successfully`
- `should parse a container with a basic identifier` → `container with identifier parses successfully`
- `should parse a container with a basic identifier and new lines` → `container with multiline formatting parses successfully`
- `should parse a container with a command` → `container with command parses successfully`
- `should parse a file with a get-path` → `document with path reference parses successfully`
- `should parse a document with all the parts` → `complex document structure parses successfully`

**Expected Outcomes**:
- 8 Lisp structure parsing tests renamed
- 8 approval files renamed
- Tests logically grouped by complexity
- Tests passing
- Commit created

#### Step 5: Consolidate and Reorganize Error Handling Tests
- [ ] **[PENDING]** Consolidate 3 duplicate error handling test sets under `describe('Error Handling')`
- [ ] **[PENDING]** Keep only one version of each error test (from "lisp" section as it's more comprehensive)
- [ ] **[PENDING]** Use pattern: `{error condition} produces {error type}`
- [ ] **[PENDING]** Update associated approval files (3 files after consolidation)
- [ ] **[PENDING]** Remove duplicate approval files (3 files)
- [ ] **[PENDING]** Run tests and commit if passing

**Error Handling Tests to Consolidate and Rename**:
- `should fail when command is missing closing parenthesis` → `missing closing parenthesis produces parse error` (keep lisp version)
- `should fail when container structure is malformed` → `malformed container structure produces parse error` (keep lisp version)
- `should fail when encountering unknown token type` → `unknown token type produces parse error` (keep lisp version)

**Expected Outcomes**:
- 3 error handling tests consolidated and renamed (6 duplicates removed)
- 3 approval files renamed (3 duplicate files removed)
- Tests logically grouped
- Tests passing
- Commit created

### Phase 3: Test Structure Modernization

#### Step 6: Update Test Structure and Imports
- [ ] **[PENDING]** Reorganize describe blocks to match new test categories
- [ ] **[PENDING]** Ensure all imports follow AI Testing Codex patterns
- [ ] **[PENDING]** Add JSDoc comments for each test group
- [ ] **[PENDING]** Update variable naming to match AI Testing Codex
- [ ] **[PENDING]** Remove duplicate beforeEach setup blocks
- [ ] **[PENDING]** Run tests and commit if passing

**Expected Changes**:
```typescript
// Old structure
describe('ast', () => {
  describe('basic functionality', () => { ... }) // 7 tests including duplicates
  describe('lisp', () => { ... }) // 11 tests including duplicates
})

// New structure  
describe('AST Parser', () => {
  describe('Basic AST Parsing', () => {
    describe('Empty Input Handling', () => { ... })
    describe('Error Propagation', () => { ... })
    describe('Text Node Creation', () => { ... })
  })
  describe('Lisp Structure Parsing', () => {
    describe('Simple Commands', () => { ... })
    describe('Containers', () => { ... })
    describe('Complex Documents', () => { ... })
  })
  describe('Error Handling', () => { ... }) // Consolidated error tests
})
```

**Expected Outcomes**:
- Modernized test structure with clear hierarchy
- Clear test organization with subcategories
- Duplicated setup code removed
- Tests passing
- Commit created

#### Step 7: Apply AI Testing Codex Patterns
- [ ] **[PENDING]** Ensure all test setup follows the AI Testing Codex builder patterns
- [ ] **[PENDING]** Standardize variable naming (parse, verifyAsJson, toResult, etc.)
- [ ] **[PENDING]** Optimize dependency injection setup
- [ ] **[PENDING]** Add appropriate JSDoc comments
- [ ] **[PENDING]** Consolidate test builder patterns
- [ ] **[PENDING]** Run tests and commit if passing

**Expected Outcomes**:
- Consistent with AI Testing Codex
- Standardized variable names
- Optimized test setup
- Better documentation
- Tests passing
- Commit created

### Phase 4: Final Validation and Cleanup

#### Step 8: Final Test Execution and Cleanup
- [ ] **[PENDING]** Run complete test suite to ensure all tests pass
- [ ] **[PENDING]** Verify all ~15 approval files are correctly named and functioning (after consolidation)
- [ ] **[PENDING]** Update any test documentation or comments
- [ ] **[PENDING]** Remove any unused test helper variables
- [ ] **[PENDING]** Final commit with comprehensive changes

**Expected Outcomes**:
- All tests passing
- Clean test structure
- No unused code
- Final commit created

#### Step 9: Plan Completion and Documentation
- [ ] **[PENDING]** Mark this plan as `[COMPLETED]`
- [ ] **[PENDING]** Document any deviations or lessons learned
- [ ] **[PENDING]** Provide summary of changes made
- [ ] **[PENDING]** Note AST parsing-specific patterns established

**Expected Outcomes**:
- Plan marked complete
- Summary documentation created
- Reorganization fully documented

## File Naming Conventions

### Test Names
- **Basic AST parsing**: `{input type} {verb} {result}`
- **Lisp structure parsing**: `{structure type} {verb} {scenario}`
- **Error handling**: `{error condition} produces {error type}`
- **Structure**: Use sentence structure with spaces (noun verb pattern)

### Approval Files
- **Pattern**: `astParser.test.{describe_block}_{test_name_with_underscores}.approved.json`
- **Examples**: 
  - `astParser.test.basic_ast_parsing_empty_input_handling_empty_token_list_produces_empty_AST.approved.json`
  - `astParser.test.lisp_structure_parsing_simple_commands_simple_identifier_command_parses_successfully.approved.json`
  - `astParser.test.error_handling_missing_closing_parenthesis_produces_parse_error.approved.json`
- **Note**: Approval files use underscores to replace spaces in test names for file system compatibility

### Describe Blocks
- **Main descriptor**: `AST Parser`
- **Functional groupings**: `Basic AST Parsing`, `Lisp Structure Parsing`, `Error Handling`
- **Sub-groupings**: Organize by functionality and complexity within each major category
- **Descriptive names**: Names that indicate the AST parsing capability being tested

## Quality Gates

Each step must pass these gates:
1. **Tests Pass**: All existing functionality preserved
2. **Approval Files**: Correctly renamed and functioning (~15 files after consolidation)
3. **Naming Convention**: Follows established patterns with sentence structure
4. **AI Testing Codex**: Adheres to documented best practices
5. **AST Parser Understanding**: References AI AST Parser Codex appropriately
6. **Commit Message**: Uses Arlo's Risk-Aware Commit Notation
7. **No Duplicates**: Duplicate test cases consolidated appropriately

## Risk Mitigation

- **Backup Strategy**: Original file backed up before changes
- **Incremental Changes**: Small, testable changes with immediate validation
- **Rollback Plan**: Can revert to backup if any step fails
- **Test Validation**: Each step must pass tests before proceeding
- **Approval File Tracking**: Careful management of 18+ approval file renames and consolidation
- **Duplicate Handling**: Systematic consolidation of 3 sets of duplicate test cases

## Success Criteria

The reorganization is complete when:
1. All existing tests pass with new names (~15 tests after consolidation)
2. All approval files correctly renamed and functioning (~15 files)
3. Test structure follows AI Testing Codex patterns
4. Naming conventions are consistent throughout
5. No regression in functionality
6. Improved readability and maintainability
7. Duplicate test cases eliminated (6 duplicates consolidated to 3 unique tests)
8. Clear categorization of AST parsing functionality by complexity and type
9. Foundation established for future AST parser test expansion

## Special Considerations

- **Duplicate Test Issue**: 6 tests are duplicated across sections and need consolidation
- **Complex Functionality**: AST parsing involves multiple node types and parsing patterns
- **AI AST Parser Codex**: Must reference appropriate AST parsing concepts and node types
- **Parser Architecture**: Tests involve both token-level and document-level parsing
- **Error Handling**: Multiple error scenarios that need clear categorization
- **Approval Testing**: Heavy use of approval files for AST structure validation
- **Node Type Variety**: Tests cover text nodes, identifiers, commands, containers, and complex document structures

---

**REMEMBER**: After each step, wait for human confirmation before proceeding to the next step. Update this plan by marking completed steps as `[COMPLETED]`.