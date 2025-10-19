# Include Builder Test Reorganization Plan

## Overview

This plan reorganizes `tests/parsers/includeBuilder/includeBuilder.test.ts` to follow AI Testing Codex principles. The test file contains 9 tests across 2 describe blocks covering external file inclusion functionality - the core system for processing document hierarchies and recursive file resolution.

**File Statistics:**
- **Tests**: 9 total tests
- **Describe Blocks**: 2 main blocks (`includeParse`, `parse`)
- **Approval Files**: 7 approval files
- **Test Categories**: External inclusion processing, error handling, recursive document parsing

## Prerequisites

**CRITICAL**: Before executing any step, the copilot MUST:
1. Read the **AI Testing Codex** (`.github/AI-Testing-Codex.md`) in full
2. Read the **AI Assistant Codex** (`.github/AI-Assistant-Codex.md`) for Doculisp syntax understanding  
3. Read the **AI Include Builder Codex** (`.github/AI-Include-Builder-Codex.md`) for document hierarchy understanding
4. Read this complete plan document
5. Understand Arlo's Risk-Aware Commit Notation from `.github/.copilot-instructions.md`

## Plan Execution Rules

1. **Test All Changes**: Run `npx jest` after each step to ensure no regressions
2. **Commit Frequently**: Use Arlo's notation for each step completion
3. **Preserve Functionality**: All existing test logic must be maintained exactly
4. **Follow Naming Conventions**: Use sentence structure with spaces for test names
5. **Maintain Test Order**: Keep logical test progression within each category
6. **Update Approval Files**: Rename approval files to match new test names
7. **Backup First**: Create backup before starting reorganization
8. **Atomic Changes**: Complete each step fully before proceeding to next
9. **Track Progress**: Update progress tracking after each completed step
10. **Request Confirmation**: Ask for confirmation before proceeding to each major phase

## Jest Testing Requirements

**IMPORTANT**: All test commands in this plan use Jest directly via `npx jest` rather than `npm test`. This is because npm does not properly pass command-line arguments to Jest. 

**Correct Commands:**
- Run specific test file: `npx jest --testPathPattern=filename`
- Run all tests: `npx jest`
- Run tests with watch mode: `npx jest --watch`

**DO NOT USE:** `npm test -- --testPathPattern=filename` (this will not work correctly)

## Periodic Re-reading Requirements

**MANDATORY**: The copilot MUST re-read the following documents at these intervals:
1. **After every 2-3 test reorganizations**: Re-read this plan and the AI Testing Codex
2. **When summarizing the conversation**: Re-read this plan, AI Testing Codex, and AI Include Builder Codex
3. **After any extended pause or context switch**: Re-read all prerequisite documents
4. **Before starting each major reorganization phase**: Re-read relevant sections of this plan
5. **When encountering uncertainty or inconsistency**: Stop and re-read the appropriate codex documents

**Purpose**: Ensure consistency, maintain quality standards, and prevent drift from established patterns throughout the reorganization process.

## Current State Analysis

### Current Test Structure Issues
1. **Inconsistent Naming**: Mix of technical terms and unclear descriptions
2. **Poor Test Organization**: Tests not clearly categorized by functionality
3. **Unclear Grouping**: `includeParse` vs `parse` distinction not immediately clear
4. **Approval File Naming**: Some inconsistency in approval file naming patterns
5. **Missing Test Categories**: No clear separation of core functionality vs edge cases

### Current Test Inventory
**`includeParse` describe block (6 tests):**
- `should handle an empty ast` - Basic empty document processing
- `should return an error if given an error` - Error propagation testing
- `should return an error if there is a file error` - File system error handling
- `should parse one included document` - Single external file inclusion
- `should not an included document not a markdown or dlisp` - File type validation
- `should parse two sub documents` - Multiple external file inclusion
- `should parse a sub document containing a sub document` - Recursive document processing

**`parse` describe block (3 tests):**
- `should return file error if there is one` - File system error handling
- `should parse an empty file` - Empty document processing
- `should parse a document with a child and grand child` - Complex hierarchy processing

### Technical Dependencies
- **AI Include Builder Codex**: Document hierarchy, pipeline integration, working directory management
- **File System Abstraction**: Mock file system with `IFileLoader` and `IDirectoryHandler`
- **Variable Table Integration**: Metadata sharing across document hierarchy
- **Location Tracking**: Precise location maintenance through recursive processing
- **Error Propagation**: Comprehensive error handling with context preservation

## Target State

### Reorganized Test Structure
```
describe('Include Builder')
├── describe('Basic Document Processing')
│   ├── Empty document handling produces empty result
│   ├── Single document inclusion resolves correctly
│   └── Multiple document inclusion combines properly
├── describe('Recursive Document Processing')
│   ├── Nested document inclusion processes hierarchy
│   ├── Complex document hierarchy resolves completely
│   └── Document working directory management works correctly
├── describe('Error Handling')
│   ├── File system errors propagate correctly
│   ├── Parse errors propagate through chain
│   └── Invalid file types produce validation errors
└── describe('File Type Validation')
    └── Non-markdown and non-dlisp files rejected properly
```

### Naming Pattern Examples
- **Basic processing**: `{scenario} {verb} {expected outcome}`
- **Error handling**: `{error condition} {verb} correctly`
- **File validation**: `{file type condition} {verb} properly`
- **Recursive processing**: `{hierarchy scenario} {verb} {processing outcome}`

## Reorganization Steps

### Phase 1: Setup and Preparation

#### Step 1: Create Backup and Verify Current Tests
- [ ] **Create backup**: Copy `includeBuilder.test.ts` to `includeBuilder.test.ts.backup`
- [ ] **Run current tests**: Execute `npx jest --testPathPattern=includeBuilder` to ensure all pass
- [ ] **Document current state**: List all current test names and approval files
- [ ] **Verify approval files**: Confirm all 7 approval files are present and named correctly
- [ ] **Commit backup**: `". d Creates backup of include builder tests before reorganization"`

#### Step 2: Analyze Current Test Dependencies and Setup
- [ ] **Review test setup**: Understand the testable builder system and file system mocking
- [ ] **Identify dependencies**: Document the `IIncludeBuilder`, file handlers, and variable table usage
- [ ] **Understand approval patterns**: Analyze the `verifyWithGiven` pattern for multi-file scenarios
- [ ] **Map test relationships**: Understand the progression from simple to complex scenarios
- [ ] **Plan approval file mapping**: Prepare mapping from old to new approval file names

### Phase 2: Core Test Structure Reorganization

#### Step 3: Reorganize Basic Document Processing Tests
- [ ] **Rename empty document test**: `'should handle an empty ast'` → `'empty document handling produces empty result'`
- [ ] **Rename single inclusion test**: `'should parse one included document'` → `'single document inclusion resolves correctly'`  
- [ ] **Rename multiple inclusion test**: `'should parse two sub documents'` → `'multiple document inclusion combines properly'`
- [ ] **Update approval files**: Rename corresponding approval files to match new test names
- [ ] **Run tests**: Verify all basic processing tests pass with new names
- [ ] **Commit changes**: `"^ r Renames basic document processing tests with sentence structure"`

#### Step 4: Reorganize Recursive Document Processing Tests
- [ ] **Rename nested inclusion test**: `'should parse a sub document containing a sub document'` → `'nested document inclusion processes hierarchy'`
- [ ] **Rename complex hierarchy test**: `'should parse a document with a child and grand child'` → `'complex document hierarchy resolves completely'`
- [ ] **Add working directory test context**: Ensure tests clearly demonstrate working directory management
- [ ] **Update approval files**: Rename corresponding approval files to match new test names
- [ ] **Run tests**: Verify all recursive processing tests pass with new names
- [ ] **Commit changes**: `"^ r Renames recursive document processing tests with sentence structure"`

#### Step 5: Reorganize Error Handling Tests
- [ ] **Rename error propagation test**: `'should return an error if given an error'` → `'parse errors propagate through chain'`
- [ ] **Rename file error test** (from includeParse): `'should return an error if there is a file error'` → `'file system errors propagate correctly'`
- [ ] **Rename file error test** (from parse): `'should return file error if there is one'` → `'file system errors propagate correctly'`
- [ ] **Consolidate duplicate error tests**: Merge the two file error tests if they're truly duplicates
- [ ] **Update approval files**: Rename corresponding approval files to match new test names
- [ ] **Run tests**: Verify all error handling tests pass with new names
- [ ] **Commit changes**: `"^ r Renames error handling tests with sentence structure"`

#### Step 6: Reorganize File Type Validation Tests
- [ ] **Rename file type test**: `'should not an included document not a markdown or dlisp'` → `'non-markdown and non-dlisp files rejected properly'`
- [ ] **Fix grammar in test name**: Ensure the new name is grammatically correct and clear
- [ ] **Update approval file**: Rename corresponding approval file to match new test name
- [ ] **Run tests**: Verify file type validation test passes with new name
- [ ] **Commit changes**: `"^ r Renames file type validation test with sentence structure"`

#### Step 7: Reorganize Empty File Processing Test
- [ ] **Analyze empty file test**: Determine if `'should parse an empty file'` belongs in basic processing
- [ ] **Rename empty file test**: `'should parse an empty file'` → `'empty document handling produces empty result'` (if different from Step 3)
- [ ] **Consolidate if duplicate**: If this duplicates the empty AST test, consider consolidation
- [ ] **Update approval file**: Rename corresponding approval file to match new test name
- [ ] **Run tests**: Verify empty file processing test passes with new name
- [ ] **Commit changes**: `"^ r Reorganizes empty file processing test placement"`

### Phase 3: Test Structure Modernization

#### Step 8: Reorganize Describe Block Structure
- [ ] **Create new describe structure**: Implement the target describe block hierarchy
- [ ] **Move tests to appropriate describe blocks**: 
  - Basic processing: empty document, single inclusion, multiple inclusion
  - Recursive processing: nested inclusion, complex hierarchy, working directory
  - Error handling: parse errors, file system errors
  - File validation: file type rejection
- [ ] **Preserve test setup**: Ensure beforeEach and beforeAll blocks are properly organized
- [ ] **Maintain test isolation**: Verify each test remains independent
- [ ] **Run tests**: Verify all tests pass in new describe block structure
- [ ] **Commit changes**: `"^ r Reorganizes describe blocks following AI Testing Codex structure"`

#### Step 9: Update Test Patterns and Consistency
- [ ] **Standardize test patterns**: Ensure all tests follow consistent arrange-act-assert patterns
- [ ] **Review setup patterns**: Ensure testable builder usage is consistent across all tests
- [ ] **Optimize imports**: Remove unused imports and organize remaining imports
- [ ] **Add test comments**: Add brief comments for complex test scenarios if needed
- [ ] **Run tests**: Verify all consistency updates maintain test functionality
- [ ] **Commit changes**: `"^ r Standardizes test patterns and improves consistency"`

### Phase 4: Final Validation and Cleanup

#### Step 10: Final Test Execution and Approval File Validation
- [ ] **Run complete test suite**: Execute `npx jest --testPathPattern=includeBuilder` 
- [ ] **Verify all approval files**: Confirm all 7 approval files have been renamed correctly
- [ ] **Check approval file content**: Ensure approval file content matches test expectations
- [ ] **Test approval regeneration**: If needed, regenerate approval files with new names
- [ ] **Run full test suite**: Execute `npx jest` to ensure no regressions in other tests
- [ ] **Commit final state**: `"^ r Completes include builder test reorganization with validation"`

#### Step 11: Cleanup and Documentation
- [ ] **Remove backup file**: Delete `includeBuilder.test.ts.backup` after confirming success
- [ ] **Update test documentation**: Document any important changes or patterns
- [ ] **Verify git status**: Ensure all changes are properly committed
- [ ] **Final verification**: One last test run to confirm everything works
- [ ] **Mark plan complete**: Update this plan's completion status

## File Naming Conventions

### Test Names (Sentence Structure with Spaces)
- **Basic Processing**: `{scenario} {verb} {expected outcome}`
  - `empty document handling produces empty result`
  - `single document inclusion resolves correctly`
  - `multiple document inclusion combines properly`

- **Recursive Processing**: `{hierarchy scenario} {verb} {processing outcome}`
  - `nested document inclusion processes hierarchy`
  - `complex document hierarchy resolves completely`

- **Error Handling**: `{error condition} {verb} correctly`
  - `parse errors propagate through chain`
  - `file system errors propagate correctly`

- **File Validation**: `{file type condition} {verb} properly`
  - `non-markdown and non-dlisp files rejected properly`

### Approval File Names (Underscores for File System)
- **Pattern**: `includeBuilder.test.include_builder_{describe_block}_{test_name_with_underscores}.approved.json`
- **Examples**:
  - `includeBuilder.test.include_builder_basic_document_processing_empty_document_handling_produces_empty_result.approved.json`
  - `includeBuilder.test.include_builder_error_handling_file_system_errors_propagate_correctly.approved.json`

## Quality Gates

### Step Completion Criteria
- [ ] **All tests pass**: Every step must maintain passing test status
- [ ] **Approval files updated**: All approval files renamed to match new test names
- [ ] **No regressions**: Full test suite continues to pass
- [ ] **Consistent naming**: All test names follow sentence structure pattern
- [ ] **Logical grouping**: Tests are grouped by functionality, not implementation details
- [ ] **Clear progression**: Tests progress from simple to complex within each category

### Final Success Criteria
- [ ] **9 tests organized** into 4 logical describe blocks
- [ ] **7 approval files** renamed with consistent naming convention
- [ ] **All tests pass** individually and as a complete suite
- [ ] **Clear test intent** from reading test names alone
- [ ] **Follows AI Testing Codex** patterns and conventions
- [ ] **Maintains functionality** - no behavioral changes to test logic

## Risk Mitigation

### Backup Strategy
- **File backup**: `includeBuilder.test.ts.backup` before any changes
- **Git safety**: Commit after each major step for easy rollback
- **Approval safety**: Keep old approval files until new ones are verified

### Rollback Plan
1. **Immediate rollback**: `git reset --hard HEAD~1` to undo last commit
2. **Full rollback**: Restore from `.backup` file if multiple steps need reversal
3. **Approval recovery**: Restore original approval files from git history
4. **Test verification**: Re-run tests after any rollback to confirm stability

### Error Recovery
- **Test failures**: Stop immediately and diagnose before proceeding
- **Approval mismatches**: Regenerate approval files or fix test names
- **Missing files**: Check git status and restore from backup or git history

## Success Criteria

This reorganization is complete when:

1. **All 9 tests** are renamed with clear, sentence-structure names
2. **4 describe blocks** properly categorize tests by functionality
3. **7 approval files** are renamed to match new test names
4. **All tests pass** individually and as a complete suite
5. **No regressions** in other test files
6. **Test names clearly communicate** intent and expected behavior
7. **Structure follows** AI Testing Codex principles
8. **Commit history** uses Arlo's Risk-Aware Commit Notation

The reorganized test file should be a model of clear test organization that other developers can easily understand and extend, while maintaining all existing functionality for external file inclusion and document hierarchy processing.

---

**Note**: This plan focuses on improving test organization and readability while preserving all existing functionality. The Include Builder component is critical for document hierarchy processing, so maintaining test coverage is essential.