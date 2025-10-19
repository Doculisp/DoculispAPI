# Tokenizer Error Test Plan

**Status:** Planning Phase  
**Last Updated:** October 18, 2025  
**Note:** This document should be updated as each phase is executed to track progress and findings.

## Prerequisites

**REQUIRED READING:** Before beginning execution, thoroughly read these documents:
- [ ] `.github/.copilot-instructions.md` - GitHub Copilot instructions and commit message format
- [ ] `.github/AI-Testing-Codex.md` - Testing patterns, dependency injection, and approval testing
- [ ] `.github/AI-Assistant-Codex.md` - Doculisp DSL syntax, used for test examples
- [ ] `.github/AI-Token-Parser-Codex.md` - Documentation about the system under test

These documents contain essential information for proper implementation, testing patterns, and commit message formatting that must be followed throughout execution.

## Bug Description

The Doculisp tokenizer currently allows whitespace between an opening parenthesis `(` and the identifier that follows it. This creates inconsistent `blockRange` calculations in the AST parser and violates proper Doculisp syntax.

**Example problematic input:** `"( \nidentifier)"` - space/newline after opening parenthesis

**Expected behavior:** The tokenizer should return an error when encountering whitespace immediately after an opening parenthesis.

## Root Cause Analysis

Based on investigation using the AI-Token-Parser-Codex:

1. **Current tokenizer logic:**
   - Opening parenthesis `(` sets `isToken = true` and is discarded
   - Whitespace handling occurs before identifier parsing
   - Whitespace is discarded without checking `isToken` state
   - Identifier is then parsed normally

2. **The problem:**
   - When `isToken = true`, the next non-whitespace character should be an identifier
   - Allowing whitespace creates a gap where the opening parenthesis location is lost
   - AST parser cannot calculate correct `blockRange.start` positions

## Test Strategy

### Test Location
- **Directory:** `tests/parsers/tokenizer/`
- **File:** Add to existing `tokenizer.test.ts` or create new `tokenizer.error.test.ts`

### Testing Architecture
- Use `testable.token.resultBuilder` for isolated tokenizer testing
- Follow established dependency injection patterns
- Use `verifyAsJson` for error structure verification

### Test Cases to Implement

#### 1. Basic Error Cases (Should Fail)

**Test 1.1: Space after opening parenthesis**
```javascript
it('should fail when space follows opening parenthesis', () => {
    // Input: "( identifier)"
    // Expected: Error result
});
```

**Test 1.2: Newline after opening parenthesis**
```javascript
it('should fail when newline follows opening parenthesis', () => {
    // Input: "(\nidentifier)"
    // Expected: Error result
});
```

**Test 1.3: Tab after opening parenthesis**
```javascript
it('should fail when tab follows opening parenthesis', () => {
    // Input: "(\tidentifier)"
    // Expected: Error result
});
```

**Test 1.4: Multiple whitespace characters**
```javascript
it('should fail when multiple whitespace follows opening parenthesis', () => {
    // Input: "( \n\t identifier)"
    // Expected: Error result
});
```

#### 2. Edge Cases (Should Fail)

**Test 2.1: Windows line endings**
```javascript
it('should fail with Windows line endings after opening parenthesis', () => {
    // Input: "(\r\nidentifier)"
    // Expected: Error result
});
```

**Test 2.2: Nested parentheses with whitespace**
```javascript
it('should fail in nested context with whitespace', () => {
    // Input: "(outer ( inner))"
    // Expected: Error result
});
```

#### 3. Valid Cases (Should Pass)

**Test 3.1: No whitespace after opening parenthesis**
```javascript
it('should succeed when identifier immediately follows opening parenthesis', () => {
    // Input: "(identifier)"
    // Expected: Success with proper tokens
});
```

**Test 3.2: Whitespace before closing parenthesis (should be allowed)**
```javascript
it('should succeed with whitespace before closing parenthesis', () => {
    // Input: "(identifier )"
    // Expected: Success with proper tokens
});
```

**Test 3.3: Whitespace within parameters (should be allowed)**
```javascript
it('should succeed with whitespace in parameters', () => {
    // Input: "(command parameter with spaces)"
    // Expected: Success with proper tokens
});
```

### Test Implementation Pattern

```javascript
describe('tokenizer error handling', () => {
    let container: IContainer;
    let verifyAsJson: (data: any, options?: Options) => void;
    let toResult: (text: string, location: IProjectLocation) => Result<TokenizedDocument>;

    beforeEach(async () => {
        container = await containerPromise;
        toResult = testable.token.resultBuilder(container, environment => {
            // Setup test environment
        });
    });

    it('should fail when space follows opening parenthesis', () => {
        const input = "( identifier)";
        const location = buildProjectLocation('./test.dlisp', 1, 1);
        
        const result = toResult(input, location);
        
        expect(result.success).toBe(false);
        verifyAsJson(result);
    });
});
```

## Implementation Requirements

### 1. Tokenizer Modification
- Modify `tokenizeWhiteSpace` function to check `isToken` state
- When `isToken = true` and whitespace is encountered, return error instead of discard
- Preserve existing whitespace handling for other contexts

### 2. Error Message Format
- Should include precise location information
- Should clearly indicate the syntax violation
- Example: `"Parse Error: Unexpected whitespace after opening parenthesis at 'file.dlisp' (Line: 2, Char: 2)."`

### 3. Backward Compatibility
- Ensure existing valid Doculisp syntax continues to work
- No changes to parameter whitespace handling
- No changes to whitespace before closing parentheses

## Expected Test Results

### Before Fix
- All error cases currently pass (incorrectly)
- Valid cases pass correctly

### After Fix
- All error cases should fail with appropriate error messages
- All valid cases should continue to pass
- Error messages should include precise location information

## Success Criteria

1. **All error test cases fail appropriately** - tokenizer returns error for whitespace after opening parenthesis
2. **All valid test cases continue to pass** - no regression in valid syntax
3. **Error messages are informative** - include file path, line, and character position
4. **Approval tests verify error structure** - consistent error format across test cases

## Dependencies

- **AI-Token-Parser-Codex** - Understanding of tokenizer architecture
- **AI-Testing-Codex** - Testing patterns and dependency injection
- **Existing tokenizer tests** - Ensure no regression in existing functionality

## Risks and Considerations

1. **Breaking Change:** This will break any existing Doculisp documents that use whitespace after opening parenthesis
2. **Error Location:** Ensure error points to the whitespace character, not the identifier
3. **Nested Contexts:** Verify error handling works correctly in nested expressions
4. **Performance:** Error checking should not impact tokenizer performance for valid input

## Documentation Updates

After implementation:
1. Update AI-Token-Parser-Codex with new error handling behavior
2. Update Doculisp syntax documentation to clarify whitespace rules
3. Add error examples to user documentation

---

**Note:** This test plan follows the established Doculisp testing architecture and ensures comprehensive coverage of the whitespace error condition while maintaining backward compatibility for valid syntax.

## Execution Tracking

### Phase 1: Test 1.1 - Space after opening parenthesis ⏳
- **Input:** `"( identifier)"`
- **Expected:** Should fail with error
- **Tasks:**
  - [ ] Implement test case using `testable.token.resultBuilder`
  - [ ] Verify test fails as expected (before tokenizer fix)
  - [ ] Document test behavior and error message
  - [ ] User validation
  - [ ] Commit
  - [ ] Push
- **Update Status:** [Date] - [Findings/Issues]

### Phase 2: Test 1.2 - Newline after opening parenthesis ⏳
- **Input:** `"(\nidentifier)"`
- **Expected:** Should fail with error
- **Tasks:**
  - [ ] Implement test case using `testable.token.resultBuilder`
  - [ ] Verify test fails as expected (before tokenizer fix)
  - [ ] Document test behavior and error message
  - [ ] User validation
  - [ ] Commit
  - [ ] Push
- **Update Status:** [Date] - [Findings/Issues]

### Phase 3: Test 1.3 - Tab after opening parenthesis ⏳
- **Input:** `"(\tidentifier)"`
- **Expected:** Should fail with error
- **Tasks:**
  - [ ] Implement test case using `testable.token.resultBuilder`
  - [ ] Verify test fails as expected (before tokenizer fix)
  - [ ] Document test behavior and error message
  - [ ] User validation
  - [ ] Commit
  - [ ] Push
- **Update Status:** [Date] - [Findings/Issues]

### Phase 4: Test 1.4 - Multiple whitespace ⏳
- **Input:** `"( \n\t identifier)"`
- **Expected:** Should fail with error
- **Tasks:**
  - [ ] Implement test case using `testable.token.resultBuilder`
  - [ ] Verify test fails as expected (before tokenizer fix)
  - [ ] Document test behavior and error message
  - [ ] User validation
  - [ ] Commit
  - [ ] Push
- **Update Status:** [Date] - [Findings/Issues]

### Phase 5: Test 2.1 - Windows line endings ⏳
- **Input:** `"(\r\nidentifier)"`
- **Expected:** Should fail with error
- **Tasks:**
  - [ ] Implement test case using `testable.token.resultBuilder`
  - [ ] Verify test fails as expected (before tokenizer fix)
  - [ ] Document test behavior and error message
  - [ ] User validation
  - [ ] Commit
  - [ ] Push
- **Update Status:** [Date] - [Findings/Issues]

### Phase 6: Test 2.2 - Nested parentheses with whitespace ⏳
- **Input:** `"(outer ( inner))"`
- **Expected:** Should fail with error
- **Tasks:**
  - [ ] Implement test case using `testable.token.resultBuilder`
  - [ ] Verify test fails as expected (before tokenizer fix)
  - [ ] Document test behavior and error message
  - [ ] User validation
  - [ ] Commit
  - [ ] Push
- **Update Status:** [Date] - [Findings/Issues]

### Phase 7: Test 3.1 - Valid: No whitespace ⏳
- **Input:** `"(identifier)"`
- **Expected:** Should pass (baseline test)
- **Tasks:**
  - [ ] Implement test case using `testable.token.resultBuilder`
  - [ ] Verify test passes correctly
  - [ ] Document expected token output
  - [ ] User validation
  - [ ] Commit
  - [ ] Push
- **Update Status:** [Date] - [Findings/Issues]

### Phase 8: Test 3.2 - Valid: Whitespace before closing ⏳
- **Input:** `"(identifier )"`
- **Expected:** Should pass (valid syntax)
- **Tasks:**
  - [ ] Implement test case using `testable.token.resultBuilder`
  - [ ] Verify test passes correctly
  - [ ] Document expected token output
  - [ ] User validation
  - [ ] Commit
  - [ ] Push
- **Update Status:** [Date] - [Findings/Issues]

### Phase 9: Test 3.3 - Valid: Whitespace in parameters ⏳
- **Input:** `"(command parameter with spaces)"`
- **Expected:** Should pass (valid syntax)
- **Tasks:**
  - [ ] Implement test case using `testable.token.resultBuilder`
  - [ ] Verify test passes correctly
  - [ ] Document expected token output
  - [ ] User validation
  - [ ] Commit
  - [ ] Push
- **Update Status:** [Date] - [Findings/Issues]

### Phase 10: Tokenizer Fix Implementation ⏳
- **Tasks:**
  - [ ] Modify tokenizeWhiteSpace function to check `isToken` state
  - [ ] Implement error condition when `isToken = true` and whitespace encountered
  - [ ] Preserve backward compatibility for valid whitespace usage
  - [ ] Test fix against all implemented test cases
  - [ ] User validation
  - [ ] Commit
  - [ ] Push
- **Update Status:** [Date] - [Findings/Issues]

### Phase 11: Validation ⏳
- **Tasks:**
  - [ ] Run all error test cases (Phases 1-6) - should now pass (return errors)
  - [ ] Run all valid test cases (Phases 7-9) - should continue to pass
  - [ ] Run existing tokenizer test suite - should pass (no regression)
  - [ ] Run full project test suite - should pass
  - [ ] User validation
  - [ ] Commit
  - [ ] Push
- **Update Status:** [Date] - [Findings/Issues]

### Phase 12: Documentation ⏳
- **Tasks:**
  - [ ] Update AI-Token-Parser-Codex with new error handling behavior
  - [ ] Update Doculisp syntax documentation
  - [ ] Add error examples to user documentation
  - [ ] User validation
  - [ ] Commit
  - [ ] Push
- **Update Status:** [Date] - [Findings/Issues]

### Phase 13: Cleanup ⏳
- **Tasks:**
  - [ ] Verify all tests are passing
  - [ ] Confirm implementation is complete and documented
  - [ ] Remove this test plan document
  - [ ] User validation
  - [ ] Commit
  - [ ] Push
- **Update Status:** [Date] - Implementation complete, plan archived

**Instructions for Execution:**
1. Update the status of this document at each phase completion
2. Record any unexpected findings or issues encountered
3. If plan needs modification, update the relevant sections
4. Mark phases as ✅ when completed, ❌ if failed, or ⚠️ if issues found
5. **IMPORTANT:** After updating the plan for each phase, seek user confirmation before proceeding to the next phase