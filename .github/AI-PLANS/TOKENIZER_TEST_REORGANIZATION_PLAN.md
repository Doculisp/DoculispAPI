# Tokenizer Test Reorganization Plan

## Overview

This plan provides a systematic approach to reorganize and rename the `tokenizer.test.ts` file to follow modern testing conventions and improve maintainability. The reorganization will align with the AI Testing Codex principles while maintaining all existing functionality. This test file covers tokenization functionality that converts raw document parts into structured tokens, which is a critical component in the Doculisp parsing pipeline.

## Prerequisites

**CRITICAL**: Before executing any step, the copilot MUST:
1. Read the **AI Testing Codex** (`.github/AI-Testing-Codex.md`) in full
2. Read the **AI Token Parser Codex** (`.github/AI-Token-Parser-Codex.md`) for tokenizer understanding
3. Read the **AI Assistant Codex** (`.github/AI-Assistant-Codex.md`) for Doculisp syntax understanding
4. Read this complete plan document
5. Understand the commit message format from `.github/.copilot-instructions.md`

## Plan Execution Rules

1. **Step-by-step execution**: Complete each step individually and wait for confirmation before proceeding
2. **Test validation**: After each step, run tests. If tests pass, commit the changes. If tests fail, do NOT mark the step complete
3. **Plan updates**: Update this plan document after each completed step by marking it `[COMPLETED]`
4. **Approval file tracking**: Each step must include renaming all 25+ associated approval files to match new test names

## Jest Testing Requirements

**IMPORTANT**: All test commands in this plan use Jest directly via `npx jest` rather than `npm test`. This is because npm does not properly pass command-line arguments to Jest. 

**Correct Commands:**
- Build and run specific test file: `npm run build && npx jest --testPathPattern=filename`
- Build and run all tests: `npm run build && npx jest`
- Build and run tests with watch mode: `npm run build && npx jest --watch`

**DO NOT USE:** `npm test -- --testPathPattern=filename` (this will not work correctly)

### CRITICAL BUILD REQUIREMENT

Before running any tests, you MUST build the TypeScript project first. The Doculisp project uses a sophisticated dependency injection container that auto-discovers modules from the compiled `dist/` folder. If you run tests without building first, the DI container will fail to find required modules and tests will fail with module resolution errors.

**Required workflow:**
1. `npm run build` (compiles TypeScript to dist/)
2. `npx jest [options] [testPathPattern]` (runs tests against compiled code)

**Combined command pattern:** `npm run build && npx jest [options] [testPathPattern]`

This build requirement applies to ALL test executions throughout this reorganization plan.

## Periodic Re-reading Requirements

**MANDATORY**: The copilot MUST re-read the following documents at these intervals:
1. **After every 2-3 test reorganizations**: Re-read this plan and the AI Testing Codex
2. **When summarizing the conversation**: Re-read this plan, AI Testing Codex, AI Token Parser Codex, and any relevant AI Assistant Codex sections
3. **After any extended pause or context switch**: Re-read all prerequisite documents
4. **Before starting each major reorganization phase**: Re-read relevant sections of this plan
5. **When encountering uncertainty or inconsistency**: Stop and re-read the appropriate codex documents

## Current State Analysis

The current `tokenizer.test.ts` has these issues:
- Non-descriptive main describe block using generic "tokenizer" name
- Mixed use of "should" and descriptive test naming patterns
- Inconsistent test organization with some tests at root level, others grouped
- Test names don't clearly indicate the tokenization scenarios being tested
- 25+ approval files using old naming conventions
- Some duplicate test cases (tab handling tested twice)
- Test structure doesn't clearly separate success/failure scenarios
- Limited use of AI Testing Codex patterns for dependency injection

**Current Test Structure:**
- **Root Level Tests**: 3 tests (parsing failure, empty result, text tokenization)
- **Doculisp Handling**: 13 tests (various tokenization scenarios)
- **Whitespace Error Handling**: 12 tests (validation scenarios with some duplicates)

## Target State

After reorganization:
- Clear, descriptive test names following sentence structure with spaces
- Logical test grouping by tokenization functionality
- Consistent naming conventions following AI Testing Codex patterns
- Better describe block organization separating success/failure scenarios
- All 25+ approval files correctly renamed
- Elimination of duplicate test cases
- Improved readability and maintainability

## Reorganization Steps

### Phase 1: Setup and Preparation

#### Step 1: Create Backup and Analyze Current Structure
- [ ] **[PENDING]** Create backup of current test file
- [ ] **[PENDING]** Document current approval files (25+ files)
- [ ] **[PENDING]** Identify duplicate test cases for consolidation
- [ ] **[PENDING]** Commit backup with message: `". d Creates backup before tokenizer test reorganization"`

**Expected Outcomes**: 
- Backup file created
- Current state documented
- Duplicates identified
- Safe starting point established

#### Step 2: Plan Test Name Mappings
- [ ] **[PENDING]** Create mapping document showing old test names → new test names
- [ ] **[PENDING]** Create mapping document showing old approval files → new approval files (25+ mappings)
- [ ] **[PENDING]** Plan consolidation of duplicate test cases
- [ ] **[PENDING]** Validate no naming conflicts exist

**Expected Outcomes**:
- Complete rename mapping documented
- Duplicate consolidation planned
- No conflicts identified
- Clear path forward established

### Phase 2: Core Test Structure Reorganization

#### Step 3: Reorganize Basic Tokenization Tests
- [ ] **[PENDING]** Rename 3 root-level tests under `describe('Basic Tokenization')`
- [ ] **[PENDING]** Use pattern: `{input type} tokenization {verb} {scenario}`
- [ ] **[PENDING]** Update associated approval files (3 files)
- [ ] **[PENDING]** Run tests and commit if passing

**Root Level Tests to Rename**:
- `should fail if document parsing failed` → `failed document parsing propagates error`
- `should return empty if given an empty parse result` → `empty document parsing returns empty tokens`
- `should tokenize text as text` → `text content tokenization preserves text`

**Expected Outcomes**:
- 3 basic tokenization tests renamed
- 3 approval files renamed
- Tests passing
- Commit created

#### Step 4: Reorganize Doculisp Tokenization Tests
- [ ] **[PENDING]** Rename 13 Doculisp handling tests under `describe('Doculisp Tokenization')`
- [ ] **[PENDING]** Group by subcategories: Empty/Simple, Parameters, Nesting, Escaping, Error Handling
- [ ] **[PENDING]** Use pattern: `{content type} {verb} {scenario}`
- [ ] **[PENDING]** Update associated approval files (13 files)
- [ ] **[PENDING]** Run tests and commit if passing

**Doculisp Tests to Rename**:
- `should tokenize an empty comment` → `empty comment tokenizes successfully`
- `should tokenize an single identifier` → `single identifier tokenizes successfully`
- `should tokenize an single identifier with space after identifier` → `identifier with trailing space tokenizes successfully`
- `should tokenize an single identifier with new line after identifier` → `identifier with trailing newline tokenizes successfully`
- `should tokenize an single identifier containing only numbers` → `numeric identifier tokenizes successfully`
- `should tokenize an single identifier with hyphen and underscore` → `identifier with special characters tokenizes successfully`
- `should tokenize a single identifier with a single word parameter` → `single word parameter tokenizes successfully`
- `should tokenize a single identifier with a multi word parameter` → `multi word parameter tokenizes successfully`
- `should handle nested lisp` → `nested lisp structure tokenizes successfully`
- `should handle comment with nested lisp` → `commented nested lisp tokenizes successfully`
- `should handle parameter with escaped open paren` → `escaped open parenthesis tokenizes successfully`
- `should handle parameter with escaped close paren` → `escaped close parenthesis tokenizes successfully`
- `should provide standardized error when tokenization fails (mocked parser)` → `tokenization failure produces standardized error`

**Expected Outcomes**:
- 13 Doculisp tokenization tests renamed
- 13 approval files renamed
- Tests logically grouped
- Tests passing
- Commit created

#### Step 5: Reorganize Whitespace Validation Tests
- [ ] **[PENDING]** Rename 12 whitespace error handling tests under `describe('Whitespace Validation')`
- [ ] **[PENDING]** Consolidate duplicate test cases (tab handling appears twice)
- [ ] **[PENDING]** Group by subcategories: Error Scenarios, Success Scenarios
- [ ] **[PENDING]** Use pattern: `{whitespace type} {position} {verb} {result}`
- [ ] **[PENDING]** Update associated approval files (11 files after consolidation)
- [ ] **[PENDING]** Run tests and commit if passing

**Whitespace Tests to Rename** (with consolidation):
- `should fail when space follows opening parenthesis` → `space after opening parenthesis produces error`
- `should fail when newline follows opening parenthesis` → `newline after opening parenthesis produces error`
- `should fail when tab follows opening parenthesis` → `tab after opening parenthesis produces error` (consolidate duplicate)
- `should fail when multiple whitespace follows opening parenthesis` → `multiple whitespace after opening parenthesis produces error` (consolidate duplicate)
- `should fail with Windows line endings after opening parenthesis` → `Windows line endings after opening parenthesis produce error`
- `should fail in nested context with whitespace` → `nested whitespace after opening parenthesis produces error`
- `should succeed when identifier immediately follows opening parenthesis` → `identifier immediately after opening parenthesis tokenizes successfully`
- `should succeed with whitespace before closing parenthesis` → `whitespace before closing parenthesis tokenizes successfully`
- `should succeed with whitespace in parameters` → `whitespace within parameters tokenizes successfully`

**Expected Outcomes**:
- 9 unique whitespace validation tests (3 duplicates removed)
- 9 approval files renamed (3 removed for duplicates)
- Tests logically grouped
- Tests passing
- Commit created

### Phase 3: Test Structure Modernization

#### Step 6: Update Test Structure and Imports
- [ ] **[PENDING]** Reorganize describe blocks to match new test categories
- [ ] **[PENDING]** Ensure all imports follow AI Testing Codex patterns
- [ ] **[PENDING]** Add JSDoc comments for each test group
- [ ] **[PENDING]** Update variable naming to match AI Testing Codex
- [ ] **[PENDING]** Run tests and commit if passing

**Expected Changes**:
```typescript
// Old structure
describe('tokenizer', () => {
  describe('handling Doculisp', () => { ... })
  describe('whitespace error handling', () => { ... })
})

// New structure  
describe('Tokenizer', () => {
  describe('Basic Tokenization', () => { ... })
  describe('Doculisp Tokenization', () => {
    describe('Simple Structures', () => { ... })
    describe('Parameters', () => { ... })
    describe('Nesting', () => { ... })
    describe('Escape Sequences', () => { ... })
    describe('Error Handling', () => { ... })
  })
  describe('Whitespace Validation', () => {
    describe('Error Scenarios', () => { ... })
    describe('Success Scenarios', () => { ... })
  })
})
```

**Expected Outcomes**:
- Modernized test structure
- Clear test organization with subcategories
- Tests passing
- Commit created

#### Step 7: Apply AI Testing Codex Patterns
- [ ] **[PENDING]** Ensure all test setup follows the AI Testing Codex builder patterns
- [ ] **[PENDING]** Standardize variable naming (parse, verifyAsJson, etc.)
- [ ] **[PENDING]** Optimize dependency injection setup
- [ ] **[PENDING]** Add appropriate JSDoc comments
- [ ] **[PENDING]** Remove duplicate beforeEach logic
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
- [ ] **[PENDING]** Verify all 22+ approval files are correctly named and functioning (after consolidation)
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
- [ ] **[PENDING]** Note tokenization-specific patterns established

**Expected Outcomes**:
- Plan marked complete
- Summary documentation created
- Reorganization fully documented

## File Naming Conventions

### Test Names
- **Basic tokenization**: `{input type} tokenization {verb} {scenario}`
- **Doculisp processing**: `{content type} {verb} {scenario}`
- **Whitespace validation**: `{whitespace type} {position} {verb} {result}`
- **Structure**: Use sentence structure with spaces (noun verb pattern)

### Approval Files
- **Pattern**: `tokenizer.test.{describe_block}_{test_name_with_underscores}.approved.json`
- **Examples**: 
  - `tokenizer.test.basic_tokenization_failed_document_parsing_propagates_error.approved.json`
  - `tokenizer.test.doculisp_tokenization_simple_structures_single_identifier_tokenizes_successfully.approved.json`
  - `tokenizer.test.whitespace_validation_error_scenarios_space_after_opening_parenthesis_produces_error.approved.json`
- **Note**: Approval files use underscores to replace spaces in test names for file system compatibility

### Describe Blocks
- **Main descriptor**: `Tokenizer`
- **Functional groupings**: `Basic Tokenization`, `Doculisp Tokenization`, `Whitespace Validation`
- **Sub-groupings**: Organize by functionality within each major category
- **Descriptive names**: Names that indicate the tokenization capability being tested

## Quality Gates

Each step must pass these gates:
1. **Tests Pass**: All existing functionality preserved
2. **Approval Files**: Correctly renamed and functioning (22+ files after consolidation)
3. **Naming Convention**: Follows established patterns with sentence structure
4. **AI Testing Codex**: Adheres to documented best practices
5. **Token Parser Understanding**: References AI Token Parser Codex appropriately
6. **Commit Message**: Uses Arlo's Risk-Aware Commit Notation
7. **No Duplicates**: Duplicate test cases consolidated

## Risk Mitigation

- **Backup Strategy**: Original file backed up before changes
- **Incremental Changes**: Small, testable changes with immediate validation
- **Rollback Plan**: Can revert to backup if any step fails
- **Test Validation**: Each step must pass tests before proceeding
- **Approval File Tracking**: Careful management of 25+ approval file renames
- **Duplicate Handling**: Systematic consolidation of duplicate test cases

## Success Criteria

The reorganization is complete when:
1. All existing tests pass with new names (22+ tests after consolidation)
2. All approval files correctly renamed and functioning (22+ files)
3. Test structure follows AI Testing Codex patterns
4. Naming conventions are consistent throughout
5. No regression in functionality
6. Improved readability and maintainability
7. Duplicate test cases eliminated
8. Clear categorization of tokenization functionality
9. Foundation established for future tokenizer test expansion

## Special Considerations

- **Large File**: 25+ tests and approval files to reorganize
- **Complex Functionality**: Tokenization involves multiple parsing scenarios
- **Duplicate Tests**: Several test cases are duplicated and need consolidation
- **Token Parser Domain**: Tests involve complex tokenization rules and validation
- **AI Token Parser Codex**: Must reference appropriate tokenizer concepts and patterns
- **Whitespace Sensitivity**: Many tests focus on precise whitespace handling rules
- **Approval Testing**: Heavy use of approval files for token structure validation

---

**REMEMBER**: After each step, wait for human confirmation before proceeding to the next step. Update this plan by marking completed steps as `[COMPLETED]`.