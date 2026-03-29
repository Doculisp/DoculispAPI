# Doculisp Language Rules: Documentation vs. Enforcement Analysis

## Executive Summary

This analysis compares the documented rules in the Doculisp Language specification (Lang README) against the actual enforcement in the parser implementation (astDoculisp.ts). Several discrepancies have been identified where rules are either:
- **Documented but NOT enforced** - Rules that appear in documentation but are not validated
- **Enforced but NOT documented** - Rules that are validated but not clearly stated in documentation

## Rules NOT Enforced (But Documented)

| # | Rule | Documented Location | What Happens | Evidence |
|---|------|---------------------|--------------|----------|
| 1 | **Include requires content block** | Lang README, Section Meta Block, point 5: "If it [include] is used there must be a `content` block" | Files compile successfully without content block even when include is present | Test confirmed: `(section-meta (title Test) (include (Section ./file.md)))` succeeds without content block |
| 2 | **Section-meta positioning** | Implied by examples showing section-meta first | Headers (`#`) and other blocks can appear BEFORE section-meta in the dl block | Test confirmed: `(# Header)` before `(section-meta ...)` succeeds |

## Rules NOT Clearly Documented (But Enforced)

| # | Rule | Enforcement Location | Error Message | Documentation Gap |
|---|------|----------------------|---------------|-------------------|
| 1 | **Content requires section-meta to appear first** | astDoculisp.ts:978-991 | "The content block at '{path}' exists before the section-meta block" | Not explicitly stated in Lang README |
| 2 | **Content requires include with external files** | astDoculisp.ts:993-1006 | "The content block at '{path}' exists without an include block that has external files" | Inverse of documented rule; enforces opposite direction |
| 3 | **Parameter max length 255 characters** | Lang README states it, but unclear if enforced | Not tested | Mentioned in docs but no validation found in code |
| 4 | **Section-meta can only appear once** | astDoculisp.ts:725-741 | "The section-meta block at '{path}' is a duplicate block. Only one section-meta block allowed per file" | Clearly enforced but not prominently documented |
| 5 | **Sub-parts of section-meta can be in any order** | Test: astDoculisp.test.ts:199 | - | Not documented; users might assume specific order required |

## Detailed Analysis

### 1. Include Requires Content Block (NOT ENFORCED)

**Documented Rule:**
> "Include (include):
> * If it is used there must be a `content` block."
> 
> -- Lang README, Section Meta Block, point 5

**Reality:**
The parser does NOT enforce this rule. You can have a section-meta with an include block but no content block, and the file will compile successfully.

**Test Result:**
```doculisp
(section-meta
    (title Test Title)
    (include
        (Section ./dummy-include.md)
    )
)
```
Result: ✅ Success (no errors)

**Impact:** Medium
- Users following documentation will unnecessarily add content blocks
- Unclear what happens to included files if no content block exists
- May cause confusion about expected behavior

**Recommendation:** Either:
1. Enforce the rule (add validation check), OR
2. Update documentation to clarify that content block is optional

---

### 2. Section-Meta Positioning (NOT ENFORCED)

**Documented Pattern:**
All examples in the Lang README show section-meta as the first block within a dl container, implying it should come first.

**Reality:**
Headers and potentially other blocks can appear before section-meta without any validation errors.

**Test Result:**
```doculisp
(# My Header)

(section-meta
    (title Test Title)
)
```
Result: ✅ Success (no errors)

**Impact:** Low to Medium
- Creates inconsistency in code style
- May be intentional flexibility, but not clearly documented
- Could lead to unexpected behavior if section-meta is meant to establish context

**Recommendation:** Either:
1. Add validation requiring section-meta to be first (if intended), OR
2. Document that section-meta can appear anywhere (if intentional flexibility)

---

### 3. Content Block Positioning and Dependencies (OVER-ENFORCED)

**Documented Rule:**
> "If it [include] is used there must be a `content` block."

**Enforced Rules (more restrictive):**
1. Content block MUST come AFTER section-meta (enforced)
2. Content block REQUIRES an include block with external files (enforced)

**The Discrepancy:**
- Documentation says: "include → requires → content"
- Code enforces: "content → requires → include"

These are subtly different:
- Doc rule: If you have include, you must have content
- Code rule: If you have content, you must have include AND section-meta

**Impact:** Medium
- Current enforcement is stricter than documented
- Users cannot use content blocks without includes
- The documented rule is never checked

**Recommendation:**
Update documentation to accurately reflect both enforced rules:
1. "Content block must appear after section-meta"
2. "Content block requires an include block with external files"

---

### 4. Parameter Length Limit (UNCLEAR ENFORCEMENT)

**Documented Rule:**
> "A parameter has a max length of 255 characters."
> -- Lang README, Parameter section

**Reality:**
No validation found in astDoculisp.ts for parameter length. This might be enforced at the token parsing level.

**Status:** Needs Investigation
- Check tokenizer.ts for parameter length validation
- If not enforced, should it be?
- If enforced elsewhere, document where

---

### 5. Section-Meta Sub-Parts Order (UNDOCUMENTED FLEXIBILITY)

**Test Evidence:**
```typescript
// From astDoculisp.test.ts:199
it('should handle all subparts put together out of order', () => {
    const contents = `
(section-meta
    (ref-link doculisp_is_)
    (include ...)
    (title Doculisp is ✨)
)`;
```

**Reality:**
Sub-parts of section-meta (title, subtitle, ref-link, include, author, id) can appear in ANY order.

**Documentation Gap:**
The Lang README doesn't explicitly state whether order matters.

**Impact:** Low
- Positive flexibility for users
- May cause confusion about best practices

**Recommendation:**
Add note to documentation: "Sub-components of section-meta can appear in any order"

---

## Summary Table: All Enforced Rules

Based on comprehensive code analysis, here are ALL 40 validation rules currently enforced:

### Categories

**Dynamic Header Rules:** 4 rules
- Must have text parameter
- ID cannot contain special symbols
- ID must be lowercase
- ID must be unique

**Section-Meta Rules:** 2 rules
- Only one section-meta per file
- Can only contain: title, subtitle, ref-link, include, author, id

**Title Rules:** 4 rules
- Only one title per section-meta
- First section-meta must have title
- Must have text parameter
- Cannot contain sub-blocks

**Subtitle Rules:** 3 rules
- Only one subtitle per section-meta
- Must have text parameter
- Cannot contain sub-blocks

**Ref-Link Rules:** 3 rules
- Only one ref-link per section-meta
- Must have text parameter
- Cannot contain sub-blocks

**Include Rules:** 3 rules
- Can only contain commands
- Only one include per section-meta
- Cannot have parameter (must have sub-blocks)

**Author Rules:** 2 rules
- Must contain author's name
- Cannot contain sub-blocks

**ID Rules:** 7 rules
- Only one id per section-meta
- Cannot contain sub-blocks
- Must have text parameter
- Cannot contain special symbols
- Must be lowercase
- Must be unique across document tree

**Content Rules:** 4 rules
- Cannot have parameters
- Must appear after section-meta
- Requires include block with external files
- Can only contain 'toc' sub-command

**TOC Rules:** 6 rules
- Only one toc per content block
- Can have 0, 1, or 2 sub-blocks
- Sub-blocks must be 'label' or 'style'
- Valid bullet styles: labeled, unlabeled, numbered, numbered-labeled, bulleted, bulleted-labeled, no-table
- Cannot have duplicate label or style blocks

**Path (get-path) Rules:** 2 rules
- Must have parameter
- Cannot contain sub-blocks

**Total Enforced Rules:** 40

## Recommendations

### Priority 1 (High Impact)

1. **Clarify Include/Content Relationship**
   - Either enforce "include requires content" OR
   - Update documentation to remove this requirement

2. **Document Content Block Requirements**
   - Explicitly state: "Content block must appear after section-meta"
   - Explicitly state: "Content block requires include with external files"

### Priority 2 (Medium Impact)

3. **Document or Enforce Section-Meta Positioning**
   - Add validation if section-meta must be first, OR
   - Document that it can appear anywhere

4. **Document Sub-Part Order Flexibility**
   - Add note that section-meta sub-parts can appear in any order

### Priority 3 (Low Impact)

5. **Verify Parameter Length Enforcement**
   - Check if 255 character limit is enforced
   - Document where validation occurs

6. **Create Validation Rules Reference**
   - Add comprehensive rules reference to documentation
   - Include all 40 enforced validation rules

---

## Testing Methodology

Tests were conducted using:
1. Direct code analysis of astDoculisp.ts
2. Live compilation tests using DoculispApi
3. Review of existing test suite (astDoculisp.test.ts)
4. Comparison with Lang README documentation

Test files created:
- Header before section-meta
- Include without content
- Content without include
- Multiple section-meta blocks

All tests executed successfully to verify enforcement behavior.

---

## Conclusion

The Doculisp parser has robust validation with 40 distinct rules enforced. However, there are 2 documented rules that are NOT enforced, and several important enforced rules that are not clearly documented. Addressing these discrepancies will improve user experience and reduce confusion about expected behavior.

The most significant discrepancy is the Include/Content relationship, where the documented rule and enforced rule are inverse of each other.
