# Test Suite Reorganization Meta-Plan

## Overview

This meta-plan provides systematic instructions for an AI assistant to analyze each test file in the Doculisp project and create detailed reorganization plans. This is **NOT** a plan to execute changes directly, but rather a plan to **create individual reorganization plans** for each test file that another AI can then execute.

## Meta-Plan Objectives

1. **Generate Individual Plans**: Create a specific reorganization plan for each test file
2. **Ensure Consistency**: All plans follow the same structure and quality standards
3. **Maintain Context**: Each plan is self-contained and executable by another AI
4. **Preserve Quality**: All plans must meet the same standards as the `DOCUMENT_TEST_REORGANIZATION_PLAN.md`

## Prerequisites for Plan Creation

**CRITICAL**: Before creating any individual plan, the AI MUST:
1. Read the **AI Testing Codex** (`.github/AI-Testing-Codex.md`) in full
2. Read the **AI Assistant Codex** (`.github/AI-Assistant-Codex.md`) for Doculisp syntax understanding
3. Study the example plan: `DOCUMENT_TEST_REORGANIZATION_PLAN.md`
4. Understand the commit message format from `.github/.copilot-instructions.md`

## Periodic Re-reading Requirements

**MANDATORY**: The AI MUST re-read the following documents at these intervals:
1. **After every 3 plan creations**: Re-read this meta-plan and the AI Testing Codex
2. **When summarizing the conversation**: Re-read this meta-plan, AI Testing Codex, and example plan
3. **After any extended pause or context switch**: Re-read all prerequisite documents
4. **Before starting each major phase**: Re-read relevant sections of this meta-plan
5. **When encountering uncertainty**: Stop and re-read the appropriate codex documents

**Purpose**: Ensure consistency, maintain quality standards, and prevent drift from established patterns throughout the plan creation process.

## Test File Inventory

The following test files require reorganization plans:

### Core API Tests
- `tests/api.test.ts` - Main API integration tests
- `tests/simple-api.test.ts` - Simplified API tests  
- `tests/cli.test.ts` - Command line interface tests
- `tests/container.test.ts` - Dependency injection container tests

### Parser Tests
- `tests/parsers/document/document.test.ts` - ✅ **COMPLETED** (example plan created)
- `tests/parsers/document/document.dlproj.test.ts` - Document project file parsing
- `tests/parsers/tokenizer/tokenizer.test.ts` - Token parsing tests
- `tests/parsers/ast/astParser.test.ts` - Abstract syntax tree parsing
- `tests/parsers/astDoculisp/astDoculisp.test.ts` - Doculisp AST parsing
- `tests/parsers/astDoculisp/astDoculisp.dlproj.test.ts` - Doculisp project AST parsing
- `tests/parsers/astProject/astProject.test.ts` - Project AST parsing
- `tests/parsers/includeBuilder/includeBuilder.test.ts` - External file inclusion tests

### String Writer Tests
- `tests/stringWriter/stringWriter.test.ts` - Core string writing functionality
- `tests/stringWriter/stringWriter.realWrite.test.ts` - Real-world writing scenarios
- `tests/stringWriter/sampleWriting.test.ts` - Sample output writing tests

### Other Component Tests
- `tests/others/controller.test.ts` - Controller functionality tests
- `tests/others/fileHandler.test.ts` - File handling operations tests

## Plan Creation Process

### Phase 1: Test File Analysis

For each test file, the AI must complete this analysis process:

#### Step 1: File Structure Analysis
1. **Read the test file completely**
2. **Identify all describe blocks and their hierarchy**
3. **Catalog all test cases with their current names**
4. **Document all associated approval files**
5. **Identify test patterns and conventions currently used**

#### Step 2: Current Issues Assessment
1. **Analyze naming consistency issues**
2. **Identify organizational problems**
3. **Document deviation from AI Testing Codex patterns**
4. **Assess test grouping logic**
5. **Evaluate approval file naming conventions**

#### Step 3: Dependencies and Context Analysis
1. **Identify which AI Codex documents are relevant**
2. **Document dependencies on other test files or helpers**
3. **Understand the component being tested and its role**
4. **Analyze test data patterns and mock strategies**

### Phase 2: Plan Document Creation

#### Step 4: Create Individual Reorganization Plan
Using the `DOCUMENT_TEST_REORGANIZATION_PLAN.md` as a template, create a plan with:

**Required Sections:**
1. **Overview** - Specific to the test file being reorganized
2. **Prerequisites** - Including relevant AI Codex references
3. **Plan Execution Rules** - Standard rules plus file-specific considerations
4. **Periodic Re-reading Requirements** - When to re-read plan and codex documents
5. **Current State Analysis** - Detailed analysis from Phase 1
6. **Target State** - Clear vision for the reorganized file
7. **Reorganization Steps** - Detailed step-by-step instructions
8. **File Naming Conventions** - Test names and approval file patterns
9. **Quality Gates** - Success criteria and validation steps
10. **Risk Mitigation** - Backup and rollback strategies
11. **Success Criteria** - Clear completion definition

**Plan Naming Convention:**
- Pattern: `{TEST_FILE_NAME}_REORGANIZATION_PLAN.md`
- Examples: 
  - `TOKENIZER_TEST_REORGANIZATION_PLAN.md`
  - `AST_PARSER_TEST_REORGANIZATION_PLAN.md`
  - `STRING_WRITER_TEST_REORGANIZATION_PLAN.md`

#### Step 5: Plan Quality Validation
1. **Ensure plan is detailed enough for another AI to execute completely**
2. **Verify plan is concise enough to fit in context window**
3. **Confirm all steps have completion tracking**
4. **Validate that AI Testing Codex references are included**
5. **Check that confirmation gates are included after each step**
6. **Ensure test-pass-before-commit requirements are clear**
7. **Verify periodic re-reading requirements are included in the plan**
8. **Confirm the plan includes conversation summary re-reading instructions**

### Phase 3: Plan Documentation

#### Step 6: Plan Registration and Confirmation
1. **Add the plan to the meta-plan tracking section**
2. **Document any unique considerations for the test file**
3. **Note any dependencies between test file reorganizations**
4. **Update the completion status**
5. **Request confirmation from user before proceeding to next plan**
6. **Wait for explicit approval to continue with next test file**

## Plan Creation Standards

### Test Naming Conventions (Apply to All Plans)
- **Structure**: Use sentence structure with spaces (noun verb pattern)
- **Parameter validation**: `{subject} validation {verb} {condition}`
- **Parsing success**: `{content type} {verb} {scenario}`
- **Error handling**: `{error condition} produces error`
- **Integration tests**: `{scenario} {verb} {expected outcome}`

### Approval File Naming (Apply to All Plans)
- **Pattern**: `{test_file}.{describe_block}_{test_name_with_underscores}.approved.json`
- **Consistency**: Convert spaces to underscores for file system compatibility
- **Clarity**: Names should be descriptive but not excessively long

### Plan Template Structure

Each plan MUST include:

```markdown
# {Component} Test Reorganization Plan

## Overview
[Specific description of the test file and reorganization goals]

## Prerequisites
**CRITICAL**: Before executing any step, the copilot MUST:
1. Read the **AI Testing Codex** (`.github/AI-Testing-Codex.md`) in full
2. Read the **AI Assistant Codex** (`.github/AI-Assistant-Codex.md`) [if Doculisp syntax involved]
3. Read this complete plan document
4. [Additional specific prerequisites]

## Plan Execution Rules
[Standard rules plus file-specific considerations]

## Periodic Re-reading Requirements
**MANDATORY**: The copilot MUST re-read the following documents at these intervals:
1. **After every 2-3 test reorganizations**: Re-read this plan and the AI Testing Codex
2. **When summarizing the conversation**: Re-read this plan, AI Testing Codex, and any relevant AI Assistant Codex sections
3. **After any extended pause or context switch**: Re-read all prerequisite documents
4. **Before starting each major reorganization phase**: Re-read relevant sections of this plan
5. **When encountering uncertainty or inconsistency**: Stop and re-read the appropriate codex documents

## Current State Analysis
[Detailed analysis of current issues]

## Target State
[Clear vision for reorganized structure]

## Reorganization Steps
### Phase 1: Setup and Preparation
[Steps 1-2: Backup and analysis]

### Phase 2: Core Test Structure Reorganization  
[Steps 3-N: Systematic renaming by category]

### Phase 3: Test Structure Modernization
[Steps N+1-N+2: Structure and patterns]

### Phase 4: Final Validation and Cleanup
[Final steps: Validation and completion]

## File Naming Conventions
[Specific patterns for this test file]

## Quality Gates
[Success criteria for each step]

## Risk Mitigation
[Backup and rollback strategies]

## Success Criteria
[Clear completion definition]
```

## Meta-Plan Execution Process

### Step 1: Initialize Plan Creation Session
- [ ] **[PENDING]** Read all prerequisite documents
- [ ] **[PENDING]** Review the example plan (DOCUMENT_TEST_REORGANIZATION_PLAN.md)
- [ ] **[PENDING]** Understand the meta-plan structure and requirements

### Step 2: Create Plans for Core API Tests
- [ ] **[COMPLETED]** Create `API_TEST_REORGANIZATION_PLAN.md` ✅
- [ ] **[COMPLETED]** Create `SIMPLE_API_TEST_REORGANIZATION_PLAN.md` ✅
- [ ] **[COMPLETED]** Create `CLI_TEST_REORGANIZATION_PLAN.md` ✅ (Removal plan)
- [ ] **[COMPLETED]** Create `CONTAINER_TEST_REORGANIZATION_PLAN.md` ✅

### Step 3: Create Plans for Parser Tests
- [ ] **[COMPLETED]** `DOCUMENT_TEST_REORGANIZATION_PLAN.md` ✅
- [ ] **[COMPLETED]** Create `DOCUMENT_DLPROJ_TEST_REORGANIZATION_PLAN.md` ✅
- [ ] **[COMPLETED]** Create `TOKENIZER_TEST_REORGANIZATION_PLAN.md` ✅
- [ ] **[COMPLETED]** Create `AST_PARSER_TEST_REORGANIZATION_PLAN.md` ✅
- [ ] **[COMPLETED]** Create `AST_DOCULISP_TEST_REORGANIZATION_PLAN.md` ✅
- [ ] **[COMPLETED]** Create `AST_DOCULISP_DLPROJ_TEST_REORGANIZATION_PLAN.md` ✅
- [ ] **[COMPLETED]** Create `AST_PROJECT_TEST_REORGANIZATION_PLAN.md` ✅
- [ ] **[COMPLETED]** Create `INCLUDE_BUILDER_TEST_REORGANIZATION_PLAN.md` ✅

### Step 4: Create Plans for String Writer Tests
- [ ] **[COMPLETED]** Create `STRING_WRITER_TEST_REORGANIZATION_PLAN.md` ✅
- [ ] **[COMPLETED]** Create `STRING_WRITER_REALWRITE_TEST_REORGANIZATION_PLAN.md` ✅
- [ ] **[COMPLETED]** Create `SAMPLE_WRITING_TEST_REORGANIZATION_PLAN.md` ✅

### Step 5: Create Plans for Other Component Tests
- [ ] **[COMPLETED]** Create `CONTROLLER_TEST_REORGANIZATION_PLAN.md` ✅
- [ ] **[COMPLETED]** Create `FILE_HANDLER_TEST_REORGANIZATION_PLAN.md` ✅

### Step 6: Meta-Plan Validation and Completion
- [ ] **[COMPLETED]** Review all created plans for consistency ✅
- [ ] **[COMPLETED]** Ensure all plans meet quality standards ✅
- [ ] **[COMPLETED]** Validate completeness of plan coverage ✅
- [ ] **[COMPLETED]** Create execution priority recommendations ✅
- [ ] **[COMPLETED]** Mark meta-plan as complete ✅

## Plan Creation Instructions

### For Each Test File Plan Creation:

1. **Analyze First**: Thoroughly read and understand the test file before writing the plan
2. **Follow Template**: Use the established template structure consistently
3. **Be Specific**: Include exact test name mappings and file counts
4. **Include Context**: Reference relevant AI Codex documents
5. **Quality Gates**: Ensure each step has clear success criteria
6. **Test Dependencies**: Account for test interdependencies
7. **Approval Files**: Map all current approval files to new names
8. **Re-reading Requirements**: Include mandatory periodic re-reading instructions
9. **Conversation Summary**: Specify what documents to re-read when summarizing conversations
10. **Confirmation Gate**: After completing each plan, request user confirmation before proceeding to next plan

### Quality Checkpoints:

- **Completeness**: Can another AI execute this plan without additional input?
- **Clarity**: Are all steps unambiguous and specific?
- **Standards**: Does it follow AI Testing Codex patterns?
- **Context**: Is the plan small enough to fit in a context window?
- **Tracking**: Are there completion checkboxes and confirmation gates?
- **Re-reading**: Are periodic re-reading requirements clearly specified?
- **Conversation Handling**: Are conversation summary re-reading instructions included?
- **User Confirmation**: Does the process include confirmation requests after each plan creation?

## Success Criteria for Meta-Plan

The meta-plan is complete when:

1. **All Test Files Covered**: Every test file has a reorganization plan ✅
2. **Consistent Quality**: All plans meet the established standards ✅
3. **Self-Contained**: Each plan can be executed independently ✅
4. **Well-Documented**: Clear instructions and examples provided ✅
5. **Validated**: All plans have been reviewed for completeness and clarity ✅

## Final Validation Summary

### Plan Creation Completeness ✅
- **16 of 16 test reorganization plans created**
- **All test files in the Doculisp project covered**
- **Systematic execution through all categories completed**

### Quality Standards Verification ✅
- **Template Consistency**: All plans follow DOCUMENT_TEST_REORGANIZATION_PLAN.md structure
- **AI Testing Codex Compliance**: All plans reference and follow established patterns
- **Confirmation Gates**: Every plan includes human confirmation requirements
- **Periodic Re-reading**: All plans specify mandatory re-reading intervals
- **Risk Mitigation**: Backup strategies and rollback procedures included
- **Test Preservation**: All plans focus on organization without changing test logic

### Coverage Analysis ✅
- **Core API Tests (4 plans)**: Comprehensive API surface coverage
- **Parser Tests (7 plans)**: Complete processing pipeline from document to semantics
- **String Writer Tests (3 plans)**: Full output generation and formatting
- **Other Component Tests (2 plans)**: Support components and error handling

### Execution Readiness ✅
- **Prioritized Execution Order**: 5-phase execution strategy with clear dependencies
- **Independent Executability**: Each plan contains all context needed for execution
- **Quality Gates**: Success criteria and validation steps clearly defined
- **Human Oversight**: Confirmation protocols ensure human control at each step

## Meta-Plan Status: **COMPLETE** ✅

All 16 test reorganization plans have been successfully created and validated. The comprehensive test suite reorganization meta-plan is ready for systematic execution following the established priority phases and confirmation protocols.

## Execution Priority Recommendations

### **CRITICAL PRIORITY** - Core Processing Pipeline (Execute First)
1. **DOCUMENT_TEST_REORGANIZATION_PLAN.md** - Foundation parsing (28 tests)
2. **TOKENIZER_TEST_REORGANIZATION_PLAN.md** - Token processing (17 tests)
3. **AST_PARSER_TEST_REORGANIZATION_PLAN.md** - AST construction (14 tests)
4. **AST_DOCULISP_TEST_REORGANIZATION_PLAN.md** - Doculisp semantics (17 tests)

**Rationale**: These form the core processing pipeline. Document → Token → AST → Doculisp semantic analysis. Failures here cascade to all other components.

### **HIGH PRIORITY** - Extended Processing Pipeline (Execute Second)
5. **INCLUDE_BUILDER_TEST_REORGANIZATION_PLAN.md** - External file processing (11 tests)
6. **STRING_WRITER_TEST_REORGANIZATION_PLAN.md** - Output generation (19 tests)

**Rationale**: Complete the end-to-end processing pipeline. Include builder handles document hierarchy, string writer generates final output.

### **MEDIUM PRIORITY** - API Integration Layer (Execute Third)
7. **CONTAINER_TEST_REORGANIZATION_PLAN.md** - Dependency injection (6 tests)
8. **API_TEST_REORGANIZATION_PLAN.md** - Primary API surface (13 tests)
9. **SIMPLE_API_TEST_REORGANIZATION_PLAN.md** - Simplified API usage (6 tests)

**Rationale**: API layer depends on core pipeline. Container provides foundation for dependency injection patterns used throughout.

### **MEDIUM PRIORITY** - Specialized Processing (Execute Fourth)
10. **DOCUMENT_DLPROJ_TEST_REORGANIZATION_PLAN.md** - Project file processing (7 tests)
11. **AST_DOCULISP_DLPROJ_TEST_REORGANIZATION_PLAN.md** - Project AST processing (4 tests)
12. **AST_PROJECT_TEST_REORGANIZATION_PLAN.md** - Project structure analysis (5 tests)

**Rationale**: Specialized project file processing. Less critical than core pipeline but important for complete project functionality.

### **LOWER PRIORITY** - Extended Scenarios (Execute Fifth)
13. **STRING_WRITER_REALWRITE_TEST_REORGANIZATION_PLAN.md** - Real-world writing (3 tests)
14. **SAMPLE_WRITING_TEST_REORGANIZATION_PLAN.md** - Example output scenarios (3 tests)
15. **CONTROLLER_TEST_REORGANIZATION_PLAN.md** - Controller orchestration (10 tests)

**Rationale**: Extended scenarios and orchestration. Important for comprehensive coverage but less critical for core functionality.

### **MAINTENANCE PRIORITY** - Support Components (Execute Last)
16. **FILE_HANDLER_TEST_REORGANIZATION_PLAN.md** - File operations error handling (5 tests)
17. **CLI_TEST_REORGANIZATION_PLAN.md** - CLI removal and cleanup (3 tests)

**Rationale**: Support components and legacy cleanup. File handler focuses on error scenarios, CLI plan removes deprecated functionality.

## Execution Strategy Recommendations

### **Phase 1: Core Pipeline (Plans 1-4)**
- Execute in strict sequence (Document → Tokenizer → AST Parser → AST Doculisp)
- Run full test suite after each plan to validate pipeline integrity
- Do NOT proceed to Phase 2 until all Phase 1 plans are complete

### **Phase 2: Extended Pipeline (Plans 5-6)**
- Can be executed in parallel if resources allow
- Include Builder and String Writer are independent of each other
- Validate end-to-end processing after both complete

### **Phase 3: API Integration (Plans 7-9)**
- Container plan MUST complete before API plans
- API and Simple API plans can be executed in parallel
- Full integration testing recommended after phase completion

### **Phase 4: Specialized & Extended (Plans 10-15)**
- Project-related plans (10-12) can be batched together
- Writing scenario plans (13-14) can be executed in parallel
- Controller plan (15) should execute after API integration is stable

### **Phase 5: Maintenance (Plans 16-17)**
- Can be executed in any order
- CLI removal should be coordinated with any CLI dependencies
- File handler is independent and can be done anytime

## Confirmation Protocol

**CRITICAL**: After creating each individual reorganization plan, the AI MUST:
1. **Present the completed plan** to the user for review
2. **Request explicit confirmation** before proceeding to the next plan
3. **Wait for user approval** - do NOT continue automatically
4. **Allow for interruption** - user may need to handle other priorities
5. **Resume only when confirmed** - respect user's workflow and availability

**Example Confirmation Request**:
> "I have completed the `TOKENIZER_TEST_REORGANIZATION_PLAN.md`. The plan includes [brief summary of key reorganization points]. 
> 
> May I proceed to create the next plan (`AST_PARSER_TEST_REORGANIZATION_PLAN.md`), or would you like to pause here to handle other priorities?"

---

**REMEMBER**: This meta-plan creates plans - it does not execute reorganizations. Each created plan will be executed by another AI instance with human confirmation at each step. Additionally, each plan creation requires user confirmation before proceeding to the next plan.