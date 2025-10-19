# CLI Test Reorganization Plan

## Overview

This plan provides a systematic approach to reorganize and rename the `cli.test.ts` file to follow modern testing conventions and improve maintainability. **IMPORTANT**: Analysis reveals that `cli.test.ts` is currently identical to `api.test.ts`, suggesting it may be a duplicate file or placeholder for future CLI functionality. This plan addresses the reorganization while also providing recommendations for resolving the duplication issue.

## Prerequisites

**CRITICAL**: Before executing any step, the copilot MUST:
1. Read the **AI Testing Codex** (`.github/AI-Testing-Codex.md`) in full
2. Read the **AI Assistant Codex** (`.github/AI-Assistant-Codex.md`) for Doculisp syntax understanding
3. Read this complete plan document
4. Understand the commit message format from `.github/.copilot-instructions.md`

## Plan Execution Rules

1. **Step-by-step execution**: Complete each step individually and wait for confirmation before proceeding
2. **Test validation**: After each step, run tests. If tests pass, commit the changes. If tests fail, do NOT mark the step complete
3. **Plan updates**: Update this plan document after each completed step by marking it `[COMPLETED]`
4. **Approval file tracking**: This test file uses standard Jest expectations, no approval files to rename
5. **Duplication decision**: A decision must be made about whether to maintain, remove, or repurpose this test file

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
2. **When summarizing the conversation**: Re-read this plan, AI Testing Codex, and any relevant AI Assistant Codex sections
3. **After any extended pause or context switch**: Re-read all prerequisite documents
4. **Before starting each major reorganization phase**: Re-read relevant sections of this plan
5. **When encountering uncertainty or inconsistency**: Stop and re-read the appropriate codex documents

## Current State Analysis

The current `cli.test.ts` has these critical issues:
- **DUPLICATE CONTENT**: File is identical to `api.test.ts`
- **MISLEADING NAME**: Named "cli.test" but contains no CLI-specific functionality
- **NO CLI IMPLEMENTATION**: Package.json shows no CLI entry point or bin configuration
- **REDUNDANT TESTING**: All tests duplicate those in `api.test.ts`
- **UNCLEAR PURPOSE**: No clear indication why this file exists separately

## Target State Options

This plan provides three potential outcomes based on project needs, but only first is acceptable:

### Option A: Remove Duplicate File ✅
- Delete `cli.test.ts` as it provides no additional value
- Update any references or documentation
- Simplify test suite by removing redundancy

### Option B: Convert to CLI-Specific Testing ❌
- Transform tests to focus on CLI usage patterns of the API
- Add tests for command-line style workflows
- Rename to reflect actual CLI-style API usage

### Option C: Maintain Separate File with Different Focus ❌
- Keep file but differentiate it from `api.test.ts`
- Focus on specific integration scenarios
- Rename and restructure to avoid duplication

## Reorganization Steps

### Phase 1: Analysis and Decision

#### Step 1: Create Backup and Analyze Duplication
- [ ] **[PENDING]** Create backup of current test file
- [ ] **[PENDING]** Confirm file is identical to `api.test.ts`
- [ ] **[PENDING]** Document duplication analysis
- [ ] **[PENDING]** Option A

**Expected Outcomes**: 
- Backup file created
- Duplication confirmed
- Strategic decision made

### Phase 2A: Remove Duplicate File (if Option A chosen)

#### Step 2A: Remove Duplicate Test File
- [ ] **[PENDING]** Delete `cli.test.ts` file
- [ ] **[PENDING]** Update test runner configuration if necessary
- [ ] **[PENDING]** Run full test suite to ensure no issues
- [ ] **[PENDING]** Commit removal with message: `". r Removes duplicate CLI test file"`

**Expected Outcomes**:
- File removed
- No test failures
- Test suite simplified

### Phase 2B: Convert to CLI-Style Testing (if Option B chosen)

#### Step 2B: Analyze CLI Usage Patterns
- [ ] **[PENDING]** Identify CLI-style usage patterns of the API
- [ ] **[PENDING]** Design tests for command-line workflows
- [ ] **[PENDING]** Plan integration scenarios different from `api.test.ts`

#### Step 3B: Implement CLI-Style Tests
- [ ] **[PENDING]** Replace tests with CLI-focused scenarios
- [ ] **[PENDING]** Add tests for batch operations
- [ ] **[PENDING]** Add tests for error handling in CLI contexts
- [ ] **[PENDING]** Run tests and commit if passing

**Expected Outcomes**:
- Distinct CLI-focused tests
- No duplication with `api.test.ts`
- Clear test purpose

### Phase 2C: Differentiate and Reorganize (if Option C chosen)

#### Step 2C: Plan Test Differentiation
- [ ] **[PENDING]** Identify integration scenarios not covered in `api.test.ts`
- [ ] **[PENDING]** Plan focus on specific workflow patterns
- [ ] **[PENDING]** Create test name mappings for new focus

#### Step 3C: Reorganize with New Focus
- [ ] **[PENDING]** Rename describe blocks to reflect new focus
- [ ] **[PENDING]** Modify tests to cover different scenarios
- [ ] **[PENDING]** Use pattern: `{workflow} {verb} {scenario}`
- [ ] **[PENDING]** Run tests and commit if passing

**Expected Outcomes**:
- Differentiated test coverage
- Clear separation from `api.test.ts`
- Improved test organization

### Phase 3: Final Steps (Common to all options)

#### Step 4: Update Documentation and References
- [ ] **[PENDING]** Update any documentation referencing the CLI tests
- [ ] **[PENDING]** Ensure test scripts and configurations are correct
- [ ] **[PENDING]** Update any README or testing documentation

#### Step 5: Plan Completion and Documentation
- [ ] **[PENDING]** Mark this plan as `[COMPLETED]`
- [ ] **[PENDING]** Document chosen option and rationale
- [ ] **[PENDING]** Provide summary of changes made

**Expected Outcomes**:
- Plan marked complete
- Decision documented
- Reorganization fully documented

## File Naming Conventions

### If Keeping File (Options B or C)
- **CLI workflows**: `{workflow} {verb} {scenario}`
- **Integration patterns**: `{integration} {verb} {scenario}`
- **Batch operations**: `{operation} batch {verb} {scenario}`
- **Structure**: Use sentence structure with spaces (noun verb pattern)

### Describe Blocks
- **Functional grouping**: Group by workflow or integration pattern
- **Clear differentiation**: Ensure no overlap with `api.test.ts`
- **Descriptive names**: Names that indicate the specific focus

## Quality Gates

Each step must pass these gates:
1. **Tests Pass**: All existing functionality preserved
2. **No Duplication**: Clear separation from `api.test.ts` if file is kept
3. **Clear Purpose**: File has distinct and documented purpose
4. **Naming Convention**: Follows established patterns
5. **Commit Message**: Uses Arlo's Risk-Aware Commit Notation

## Risk Mitigation

- **Backup Strategy**: Original file backed up before changes
- **Option Flexibility**: Multiple viable paths forward
- **Clear Decision Process**: Explicit choice between options
- **Test Validation**: Comprehensive testing after changes

## Success Criteria

The reorganization is complete when:
1. **Duplication Resolved**: No duplicate test content exists
2. **Clear Purpose**: File has distinct, documented purpose (or is removed)
3. **Tests Pass**: All functionality preserved
4. **Documentation Updated**: References and documentation are correct
5. **Improved Maintainability**: Test suite is cleaner and more focused

## Recommendation

**MANDATORY APPROACH**: Option A (Remove Duplicate File)

**Rationale**:
- **Project Evolution**: The CLI functionality has been moved to a separate project
- **Legacy File**: This file is a leftover from when API and CLI were combined
- **No Current Relevance**: File provides no value to the current API-only project
- **Maintenance Burden**: Keeping duplicate tests creates unnecessary maintenance overhead
- **Clear Project Scope**: Removing clarifies that this is purely an API library

**Decision Made**: The CLI test file will be removed as it no longer serves the project's current scope.

---

**REMEMBER**: After each step, wait for human confirmation before proceeding to the next step. Update this plan by marking completed steps as `[COMPLETED]`. **A strategic decision about the file's future must be made before proceeding with reorganization.**