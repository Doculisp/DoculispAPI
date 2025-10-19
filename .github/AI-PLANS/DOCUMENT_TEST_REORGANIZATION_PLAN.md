# Document Parser Test Reorganization Plan

## Overview

This plan provides a systematic approach to reorganize and rename the `document.test.ts` file and its associated approval files to follow modern testing conventions and improve maintainability. The reorganization will align with the AI Testing Codex principles while maintaining all existing functionality.

## Prerequisites

**CRITICAL**: Before executing any step, the copilot MUST:
1. Read the **AI Testing Codex** (`.github/AI-Testing-Codex.md`) in full
2. Read this complete plan document
3. After every 2-3 test reorganizations, re-read both the AI Testing Codex and this plan
4. After summarizing the conversation, re-read both documents

## Plan Execution Rules

1. **Step-by-step execution**: Complete each step individually and wait for confirmation before proceeding
2. **Test validation**: After each step, run tests. If tests pass, commit the changes. If tests fail, do NOT mark the step complete
3. **Plan updates**: Update this plan document after each completed step by marking it `[COMPLETED]`
4. **Approval file tracking**: Each step must include renaming associated approval files to match new test names

## Jest Testing Requirements

**IMPORTANT**: All test commands in this plan use Jest directly via `npx jest` rather than `npm test`. This is because npm does not properly pass command-line arguments to Jest. 

**Correct Commands:**
- Run specific test file: `npm run build && npx jest --testPathPattern=filename`
- Run all tests: `npm run build && npx jest`
- Run tests with watch mode: `npm run build && npx jest --watch`

**DO NOT USE:** `npm test -- --testPathPattern=filename` (this will not work correctly)

### CRITICAL BUILD REQUIREMENT

Before running any tests, you MUST build the TypeScript project first. The Doculisp project uses a sophisticated dependency injection container that auto-discovers modules from the compiled `dist/` folder. If you run tests without building first, the DI container will fail to find required modules and tests will fail with module resolution errors.

**Required workflow:**
1. `npm run build` (compiles TypeScript to dist/)
2. `npx jest [options] [testPathPattern]` (runs tests against compiled code)

**Combined command pattern:** `npm run build && npx jest [options] [testPathPattern]`

This build requirement applies to ALL test executions throughout this reorganization plan.

## Current State Analysis

The current `document.test.ts` has these issues:
- Inconsistent naming conventions (mixing "should" and action-based descriptions)
- Poor test organization (deeply nested describes with unclear hierarchy)
- Non-descriptive test names that don't clearly indicate what is being tested
- Approval files with overly long, auto-generated names
- Mixed testing patterns not following AI Testing Codex guidelines

## Target State

After reorganization:
- Clear, descriptive test names following consistent conventions
- Logical test grouping with meaningful describe blocks
- Shorter, more readable approval file names
- Consistent use of AI Testing Codex patterns
- Better separation of concerns between test categories

## Reorganization Steps

### Phase 1: Setup and Preparation

#### Step 1: Create Backup and Analyze Current Structure
- [ ] **[PENDING]** Create backup of current test file and approval files
- [ ] **[PENDING]** Document all current approval files and their mappings
- [ ] **[PENDING]** Commit backup with message: `". d Creates backup before document test reorganization"`

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

#### Step 3: Reorganize Parameter Validation Tests
- [ ] **[PENDING]** Rename parameter validation tests to follow pattern: `{subject} {verb} {condition}`
- [ ] **[PENDING]** Update associated approval files
- [ ] **[PENDING]** Ensure tests follow AI Testing Codex patterns
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should not allow a document with a zero depth.` → `depth validation rejects zero`
- `should not allow a document with a negative depth.` → `depth validation rejects negative`
- `should not allow a document with a zero index.` → `index validation rejects zero`
- `should not allow a document with a negative index.` → `index validation rejects negative`

**Expected Outcomes**:
- 4 parameter validation tests renamed
- 4 approval files renamed
- Tests passing
- Commit created

#### Step 4: Reorganize Text Parsing Tests
- [ ] **[PENDING]** Rename text parsing tests under `describe('text parsing')`
- [ ] **[PENDING]** Use pattern: `{content type} {verb} {scenario}`
- [ ] **[PENDING]** Update associated approval files (8 files)
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should successfully parse an empty string` → `empty string parses successfully`
- `should parse a simple text of "hello"` → `simple text parses hello`
- `should parse text of "blow fish"` → `simple phrase parses blow fish`
- `should parse text of " blow fish"` → `text with leading space parses correctly`
- `should parse text of " blow fish "` → `text with surrounding spaces parses correctly`
- `should parse text of "   \\r\\n blow fish"` → `multiline text with whitespace parses correctly`
- `should parse nested multiline code blocks` → `nested code blocks parse successfully`
- `should parse nested multiline code blocks that end with the file` → `nested code blocks at EOF parse successfully`
- `should not parse nested multiline code blocks when closing markers are unbalanced` → `unbalanced code block markers produce error`

**Expected Outcomes**:
- 9 text parsing tests renamed
- 9 approval files renamed
- Tests passing
- Commit created

#### Step 5: Reorganize HTML Comment Tests
- [ ] **[PENDING]** Rename HTML comment tests under `describe('html comment parsing')`
- [ ] **[PENDING]** Use pattern: `{content type} {verb} {scenario}` or `{content type} {error condition} produces error`
- [ ] **[PENDING]** Update associated approval files (11 files)
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should not parse html comments` → `html comments parse as text`
- `should not parse html but preserve new line counts comments` → `multiline html comments preserve newlines`
- `should not parse html comments in the middle of text.` → `html comments mixed with text parse correctly`
- `should parse html comments inside an inline code block` → `html comments in inline code parse correctly`
- `should parse an inline codeblock in middle of sentence` → `inline code in sentence parses correctly`
- `should parse html comments inside a multiline code block` → `html comments in multiline code parse correctly`
- `should fail to parse if html comment is not closed` → `unclosed html comment produces error`
- `should fail if inline code block does not close` → `unclosed inline code block produces error`
- `should fail to parse an inline code block with a line break` → `inline code with newline produces error`
- `should fail to parse a multiline code block that does not close` → `unclosed multiline code block produces error`

**Expected Outcomes**:
- 10 HTML comment tests renamed
- 10 approval files renamed  
- Tests passing
- Commit created

#### Step 6: Reorganize Doculisp Block Tests
- [ ] **[PENDING]** Rename Doculisp tests under `describe('doculisp block parsing')`
- [ ] **[PENDING]** Use pattern: `{content type} {verb} {scenario}`
- [ ] **[PENDING]** Update associated approval files (7 files)
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should parse a doculisp block at top of file` → `doculisp block at file start parses correctly`
- `should parse a multiline doculisp block` → `multiline doculisp block parses correctly`
- `should parse a doculisp block in the middle of file` → `doculisp block mid file parses correctly`
- `should parse lisp outside an html tag as text` → `lisp outside html tags parses as text`
- `should parse Doculisplisp outside an html tag as text` → `doculisp outside html tags parses as text`
- `should allow for an escaped parentheses in a parameter` → `escaped parentheses in parameters parse correctly`
- `should parse Doculisp that contains a get-path in a link` → `doculisp with get path links parses correctly`

**Expected Outcomes**:
- 7 Doculisp tests renamed
- 7 approval files renamed
- Tests passing
- Commit created

#### Step 7: Reorganize Pure .dlisp File Tests
- [ ] **[PENDING]** Rename .dlisp file tests under `describe('pure dlisp file parsing')`
- [ ] **[PENDING]** Use pattern: `{content type} {verb} {scenario}` or `{error condition} produces error`
- [ ] **[PENDING]** Update associated approval files (4 files)
- [ ] **[PENDING]** Run tests and commit if passing

**Current Tests to Rename**:
- `should handle a correctly formatted file` → `valid dlisp file parses successfully`
- `should fail to parse a file that contains a dl identifier` → `dl identifier in dlisp file produces error`
- `should handle a file with parentheses that do not close` → `unclosed parentheses in dlisp file produces error`
- `should handle a file with to many parenthesis` → `extra parentheses in dlisp file produces error`

**Expected Outcomes**:
- 4 .dlisp file tests renamed
- 4 approval files renamed
- Tests passing
- Commit created

### Phase 3: Test Structure Modernization

#### Step 8: Update Test Structure and Imports
- [ ] **[PENDING]** Reorganize describe blocks to match new test categories
- [ ] **[PENDING]** Ensure all imports follow AI Testing Codex patterns
- [ ] **[PENDING]** Add JSDoc comments for major test groups
- [ ] **[PENDING]** Run tests and commit if passing

**Expected Changes**:
```typescript
// Old structure
describe('document', () => {
  describe('parsing markup', () => {
    describe('text', () => { ... })
    describe('html comments', () => { ... })
    describe('Doculisp', () => { ... })
  })
  describe('parsing .dlisp files', () => { ... })
})

// New structure  
describe('Document Parser', () => {
  describe('Parameter Validation', () => { ... })
  describe('Text Parsing', () => { ... })
  describe('HTML Comment Parsing', () => { ... })
  describe('Doculisp Block Parsing', () => { ... })
  describe('Pure Dlisp File Parsing', () => { ... })
})
```

**Expected Outcomes**:
- Modernized test structure
- Clear test organization
- Tests passing
- Commit created

#### Step 9: Apply AI Testing Codex Patterns
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

#### Step 10: Final Test Execution and Cleanup
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

#### Step 11: Plan Completion and Documentation
- [ ] **[PENDING]** Mark this plan as `[COMPLETED]`
- [ ] **[PENDING]** Document any deviations or lessons learned
- [ ] **[PENDING]** Provide summary of changes made

**Expected Outcomes**:
- Plan marked complete
- Summary documentation created
- Reorganization fully documented

## File Naming Conventions

### Test Names
- **Parameter validation**: `{subject} validation {verb} {condition}`
- **Parsing success**: `{content type} {verb} {scenario}`
- **Error handling**: `{error condition} produces error`
- **Structure**: Use sentence structure with spaces (noun verb pattern)

### Approval Files
- **Pattern**: `document.test.{describe_block}_{test_name_with_underscores}.approved.json`
- **Example**: `document.test.text_parsing_simple_text_parses_hello.approved.json`
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