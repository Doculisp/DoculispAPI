# AST Doculisp Project File Test Consolidation Plan

## Overview

This plan provides a systematic approach to consolidate and cleanup the `astDoculisp.dlproj.test.ts` file by comparing it with `astProject.test.ts`, removing duplicates, moving unique functionality, and ultimately deleting the redundant file. This is **NOT** a standard reorganization but rather a consolidation task to eliminate duplicate test coverage and maintain all unique functionality in the appropriate location.

## Prerequisites

**CRITICAL**: Before executing any step, the copilot MUST:
1. Read the **AI Testing Codex** (`.github/AI-Testing-Codex.md`) in full
2. Read the **AI Doculisp AST Parser Codex** (`.github/AI-Doculisp-AST-Parser-Codex.md`) for Doculisp semantic parsing understanding
3. Read the **AI Assistant Codex** (`.github/AI-Assistant-Codex.md`) for Doculisp syntax understanding
4. Read this complete plan document
5. Understand the commit message format from `.github/.copilot-instructions.md`

## Plan Execution Rules

1. **Step-by-step execution**: Complete each step individually and wait for confirmation before proceeding
2. **Test validation**: After each step, run tests. If tests pass, commit the changes. If tests fail, do NOT mark the step complete
3. **Plan updates**: Update this plan document after each completed step by marking it `[COMPLETED]`
4. **Comparison focus**: Primary task is comparing tests between two files to identify duplicates and unique functionality
5. **Consolidation approach**: Move unique tests to astProject.test.ts, then delete this file
6. **No approval file creation**: Since file will be deleted, focus on preserving functionality in the target file

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
2. **When summarizing the conversation**: Re-read this plan, AI Testing Codex, AI Doculisp AST Parser Codex, and any relevant AI Assistant Codex sections
3. **After any extended pause or context switch**: Re-read all prerequisite documents
4. **Before starting each major reorganization phase**: Re-read relevant sections of this plan
5. **When encountering uncertainty or inconsistency**: Stop and re-read the appropriate codex documents

## Current State Analysis

The current `astDoculisp.dlproj.test.ts` situation:
- Very small test file with only 1 test case
- Currently skipped using `describe.skip` - tests are not executing
- Likely contains duplicate or overlapping functionality with `astProject.test.ts`
- File appears to be redundant and should be consolidated
- No approval files exist due to skip status
- Single test focuses on document parsing without document identifier

**Current Test Structure:**
- **Main describe block**: "astDoculisp project File" (skipped)
- **Single test**: "should parse a single document file without document identifier"

**Consolidation Issues:**
- Potential duplicate functionality with astProject tests
- Unclear separation of concerns between the two test files
- Maintenance overhead of having two similar test files
- Skipped status indicates possible abandonment or redundancy

## Target State

After consolidation:
- All unique functionality preserved in `astProject.test.ts`
- Duplicate tests identified and eliminated
- `astDoculisp.dlproj.test.ts` file deleted
- Single source of truth for project file testing
- No loss of test coverage for unique scenarios
- Cleaner test file structure with no redundant files
- Improved maintainability with consolidated test coverage

## Consolidation Steps

### Phase 1: Analysis and Comparison

#### Step 1: Create Backup and Analyze Both Files
- [ ] **[PENDING]** Create backup of both `astDoculisp.dlproj.test.ts` and `astProject.test.ts`
- [ ] **[PENDING]** Read and analyze the complete `astProject.test.ts` file
- [ ] **[PENDING]** Compare test functionality between both files
- [ ] **[PENDING]** Commit backup with message: `". d Creates backup before AST project test consolidation"`

**Expected Outcomes**: 
- Backup files created for both test files
- Complete understanding of both test suites
- Safe starting point established

#### Step 2: Identify Duplicates and Unique Tests
- [ ] **[PENDING]** Create detailed comparison document of all test cases
- [ ] **[PENDING]** Identify exact duplicate tests (same functionality)
- [ ] **[PENDING]** Identify unique tests that exist only in astDoculisp.dlproj.test.ts
- [ ] **[PENDING]** Document which tests need to be moved to astProject.test.ts

**Expected Outcomes**:
- Complete comparison analysis documented
- Duplicate tests identified for removal
- Unique tests identified for migration
- Clear migration plan established

### Phase 2: Test Migration

#### Step 3: Move Unique Tests to astProject.test.ts
- [ ] **[PENDING]** Unskip and validate unique tests from astDoculisp.dlproj.test.ts
- [ ] **[PENDING]** Rename unique tests to follow astProject.test.ts naming conventions
- [ ] **[PENDING]** Add unique tests to appropriate describe blocks in astProject.test.ts
- [ ] **[PENDING]** Update test setup and imports to match astProject patterns
- [ ] **[PENDING]** Run tests to ensure unique functionality works in new location

**Expected Outcomes**:
- All unique functionality preserved in astProject.test.ts
- Tests follow consistent naming patterns
- No loss of test coverage
- All migrated tests pass

#### Step 4: Validate Complete Test Coverage
- [ ] **[PENDING]** Run complete astProject.test.ts to ensure all tests pass
- [ ] **[PENDING]** Verify that all unique functionality from astDoculisp.dlproj.test.ts is covered
- [ ] **[PENDING]** Create or update approval files for migrated tests
- [ ] **[PENDING]** Commit migrated tests with message: `"^ F Migrates unique project file tests to astProject"`

**Expected Outcomes**:
- All tests in astProject.test.ts pass
- Complete test coverage verified
- Approval files updated as needed
- Migration committed successfully

### Phase 3: File Cleanup

#### Step 5: Remove Redundant File
- [ ] **[PENDING]** Final validation that all unique functionality is preserved
- [ ] **[PENDING]** Delete `astDoculisp.dlproj.test.ts` file
- [ ] **[PENDING]** Run complete test suite to ensure no regressions
- [ ] **[PENDING]** Commit file deletion with message: `". R Removes redundant astDoculisp.dlproj.test.ts after consolidation"`

**Expected Outcomes**:
- Redundant test file removed
- No regressions in test suite
- Clean consolidated test structure
- Deletion committed

#### Step 6: Cleanup Backup Files
- [ ] **[PENDING]** Delete backup files created during consolidation
- [ ] **[PENDING]** Remove any temporary files or directories created during process
- [ ] **[PENDING]** Verify no backup files remain in working directory
- [ ] **[PENDING]** Commit cleanup with message: `". d Removes backup files after AST Doculisp dlproj test consolidation"`

**Expected Outcomes**:
- All backup files removed
- Clean working directory
- Cleanup commit created

#### Step 7: Plan Completion and Documentation
- [ ] **[PENDING]** Mark this plan as `[COMPLETED]`
- [ ] **[PENDING]** Document what tests were migrated vs. removed as duplicates
- [ ] **[PENDING]** Provide summary of consolidation results
- [ ] **[PENDING]** Update any references to the deleted test file

**Expected Outcomes**:
- Plan marked complete
- Consolidation results documented
- Migration summary provided
- All references updated

## File Naming Conventions

### Test Names
- **Project file parsing**: `{content type} {verb} {scenario}`
- **Structure**: Use sentence structure with spaces (noun verb pattern)

### Approval Files (if tests are unskipped)
- **Pattern**: `astDoculisp.dlproj.test.{describe_block}_{test_name_with_underscores}.approved.json`
- **Example**: `astDoculisp.dlproj.test.doculisp_project_file_parser_project_file_parsing_single_document_project_file_parses_successfully.approved.json`
- **Note**: Approval files use underscores to replace spaces in test names for file system compatibility

### Describe Blocks
- **Main descriptor**: `Doculisp Project File Parser`
- **Functional grouping**: Group by project file functionality
- **Descriptive names**: Names that indicate the project file parsing capability being tested

## Quality Gates

Each step must pass these gates:
1. **Tests Pass**: All existing functionality preserved (if unskipped)
2. **Skip Status**: Appropriate handling of skip status with documented rationale
3. **Approval Files**: Correctly created and functioning (if applicable)
4. **Naming Convention**: Follows established patterns
5. **AI Testing Codex**: Adheres to documented best practices
6. **Container Usage**: Modern async containerPromise pattern
7. **Commit Message**: Uses Arlo's Risk-Aware Commit Notation

## Risk Mitigation

- **Backup Strategy**: Original file backed up before changes
- **Skip Status Handling**: Careful consideration of whether to unskip tests
- **Incremental Changes**: Small, testable changes with immediate validation
- **Rollback Plan**: Can revert to backup if any step fails
- **Test Validation**: Each step must pass tests before proceeding (if unskipped)

## Success Criteria

The consolidation is complete when:
1. All unique functionality from astDoculisp.dlproj.test.ts is preserved in astProject.test.ts
2. All duplicate tests are identified and eliminated
3. astDoculisp.dlproj.test.ts file is deleted
4. Complete test suite passes without regressions
5. No loss of test coverage for any unique scenarios
6. Improved maintainability with single source of truth for project file testing
7. Clean test file structure with no redundant files
8. All approval files updated appropriately for migrated tests

## Special Considerations

- **File Consolidation**: This is not a reorganization but a consolidation/cleanup task
- **Duplicate Detection**: Must carefully compare test functionality to avoid losing unique coverage
- **Skip Status**: Tests are currently skipped - need to unskip temporarily for migration validation
- **Cross-File Migration**: Tests will be moved between files, requiring careful import and setup handling
- **Approval Files**: May need to create new approval files for migrated tests in target location
- **Test Naming**: Migrated tests must follow astProject.test.ts naming conventions
- **File Deletion**: Final step involves complete removal of source file

## Consolidation Decision Matrix

The consolidation approach is predetermined based on your requirements:

### Primary Objective: Eliminate Redundancy
- **Action**: Compare tests, migrate unique functionality, delete redundant file
- **Rationale**: Maintain single source of truth for project file testing
- **Risk**: Medium - must ensure no unique functionality is lost during consolidation

### Migration Strategy
1. **Preserve Unique Tests**: Any test that provides unique coverage gets migrated
2. **Remove Duplicates**: Any test that duplicates existing astProject coverage gets removed
3. **Update Target File**: astProject.test.ts becomes the single location for all project file testing
4. **Delete Source File**: astDoculisp.dlproj.test.ts is completely removed after successful migration

---

**REMEMBER**: After each step, wait for human confirmation before proceeding to the next step. Update this plan by marking completed steps as `[COMPLETED]`.