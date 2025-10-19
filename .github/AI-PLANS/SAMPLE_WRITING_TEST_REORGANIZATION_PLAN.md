# Sample Writing Test Reorganization Plan

## Overview

This plan provides a systematic approach to reorganize and rename the `sampleWriting.test.ts` file and its associated approval files to follow modern testing conventions and improve maintainability. The reorganization will align with the AI Testing Codex principles while maintaining all existing functionality.

## Prerequisites

**CRITICAL**: Before executing any step, the copilot MUST:
1. Read the **AI Testing Codex** (`.github/AI-Testing-Codex.md`) in full
2. Read the **AI String Writer Codex** (`.github/AI-String-Writer-Codex.md`) for final markdown generation understanding
3. Read this complete plan document
4. After every 2-3 test reorganizations, re-read both the AI Testing Codex and this plan
5. After summarizing the conversation, re-read both documents

## Plan Execution Rules

1. **Step-by-step execution**: Complete each step individually and wait for confirmation before proceeding
2. **Test validation**: After each step, run tests. If tests pass, commit the changes. If tests fail, do NOT mark the step complete
3. **Plan updates**: Update this plan document after each completed step by marking it `[COMPLETED]`
4. **Approval file tracking**: Each step must include renaming associated approval files to match new test names

## Jest Testing Requirements

**IMPORTANT**: All test commands in this plan use Jest directly via `npx jest` rather than `npm test`. This is because npm does not properly pass command-line arguments to Jest. 

**Correct Commands:**
- Run specific test file: `npx jest --testPathPattern=filename`
- Run all tests: `npx jest`
- Run tests with watch mode: `npx jest --watch`

**DO NOT USE:** `npm test -- --testPathPattern=filename` (this will not work correctly)

## Current State Analysis

The current `sampleWriting.test.ts` has these issues:
- Generic "stringWriter writing sample" describe block name doesn't clearly indicate purpose
- Only 2 tests with similar but inconsistent naming patterns
- Test names don't clearly communicate what sample documents are being tested
- Working directory management is mixed with test logic
- Non-descriptive test names that don't indicate the specific sample being processed

## Target State

After reorganization:
- Clear, descriptive test names following consistent conventions
- Logical test grouping with meaningful describe blocks
- Clear indication of which sample documents are being tested
- Consistent working directory management patterns
- Better separation of concerns between different sample types

## Reorganization Steps

### Phase 1: Setup and Preparation

#### Step 1: Create Backup and Analyze Current Structure
- [ ] **[PENDING]** Create backup of current test file and approval files
- [ ] **[PENDING]** Document all current approval files and their mappings
- [ ] **[PENDING]** Commit backup with message: `". d Creates backup before sample writing test reorganization"`

**Expected Outcomes**: 
- Backup files created
- Current state documented
- Safe starting point established

#### Step 2: Plan Test Name Mappings
- [ ] **[PENDING]** Create mapping document showing old test names → new test names
- [ ] **[PENDING]** Create mapping document showing old approval files → new approval files
- [ ] **[PENDING]** Validate no naming conflicts exist

**Expected Outcomes**:
- Complete rename mapping documented
- No conflicts identified
- Clear path forward established

### Phase 2: Core Test Structure Reorganization

#### Step 3: Reorganize Sample Document Processing Tests
- [ ] **[PENDING]** Rename sample processing tests under `describe('sample document processing')`
- [ ] **[PENDING]** Use pattern: `{sample type} sample processes correctly`
- [ ] **[PENDING]** Update associated approval files (2 files)
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should write document.md` → `document markdown sample processes correctly`
- `should write the sample document` → `main dlisp sample processes correctly`

**Expected Outcomes**:
- 2 sample processing tests renamed
- 2 approval files renamed
- Tests passing
- Commit created

### Phase 3: Test Structure Modernization

#### Step 4: Update Test Structure and Imports
- [ ] **[PENDING]** Reorganize describe blocks to match new test categories
- [ ] **[PENDING]** Ensure all imports follow AI Testing Codex patterns
- [ ] **[PENDING]** Add JSDoc comments for major test groups
- [ ] **[PENDING]** Run tests and commit if passing

**Expected Changes**:
```typescript
// Old structure
describe('stringWriter writing sample', () => {
  it('should write document.md', () => { ... })
  it('should write the sample document', () => { ... })
})

// New structure
describe('Sample Writing', () => {
  describe('Sample Document Processing', () => {
    it('document markdown sample processes correctly', () => { ... })
    it('main dlisp sample processes correctly', () => { ... })
  })
})
```

**Expected Outcomes**:
- Modernized test structure
- Clear test organization
- Tests passing
- Commit created

#### Step 5: Apply AI Testing Codex Patterns
- [ ] **[PENDING]** Ensure all test setup follows the AI Testing Codex builder patterns
- [ ] **[PENDING]** Standardize variable naming (toResult, verifyAsJson, etc.)
- [ ] **[PENDING]** Add appropriate JSDoc comments for test groups
- [ ] **[PENDING]** Run tests and commit if passing

**Expected Outcomes**:
- Consistent with AI Testing Codex
- Standardized variable names
- Better documentation
- Tests passing
- Commit created

### Phase 4: Final Validation and Cleanup

#### Step 6: Final Test Execution and Cleanup
- [ ] **[PENDING]** Run complete test suite to ensure all tests pass
- [ ] **[PENDING]** Verify all approval files are correctly named and functioning
- [ ] **[PENDING]** Remove any orphaned approval files
- [ ] **[PENDING]** Update any test documentation or comments
- [ ] **[PENDING]** Final commit with comprehensive changes

**Expected Outcomes**:
- All tests passing
- No orphaned files
- Clean test structure
- Final commit created

#### Step 7: Plan Completion and Documentation
- [ ] **[PENDING]** Mark this plan as `[COMPLETED]`
- [ ] **[PENDING]** Document any deviations or lessons learned
- [ ] **[PENDING]** Provide summary of changes made

**Expected Outcomes**:
- Plan marked complete
- Summary documentation created
- Reorganization fully documented

## File Naming Conventions

### Test Names
- **Sample processing**: `{sample type} sample processes correctly`
- **Structure**: Use sentence structure with spaces (noun verb pattern)

### Approval Files
- **Pattern**: `sampleWriting.test.{describe_block}_{test_name_with_underscores}.approved.md`
- **Example**: `sampleWriting.test.sample_document_processing_document_markdown_sample_processes_correctly.approved.md`
- **Note**: Approval files use underscores to replace spaces in test names for file system compatibility

## Quality Gates

Each step must pass these gates:
1. **Tests Pass**: All existing functionality preserved
2. **Approval Files**: Correctly renamed and functioning
3. **Naming Convention**: Follows established patterns
4. **AI Testing Codex**: Adheres to documented best practices
5. **Commit Message**: Uses Arlo's Risk-Aware Commit Notation

## Risk Mitigation

- **Backup Strategy**: All original files backed up before changes
- **Incremental Changes**: Small, testable changes with immediate validation
- **Rollback Plan**: Can revert to backup if any step fails
- **Test Validation**: Each step must pass tests before proceeding

## Success Criteria

The reorganization is complete when:
1. All existing tests pass with new names
2. All approval files correctly renamed and functioning
3. Test structure follows AI Testing Codex patterns
4. Naming conventions are consistent throughout
5. No regression in functionality
6. Improved readability and maintainability

---

**REMEMBER**: After each step, wait for human confirmation before proceeding to the next step. Update this plan by marking completed steps as `[COMPLETED]`.