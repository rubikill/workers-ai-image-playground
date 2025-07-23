# Simplified Multiple Agent Workflow

## Core Principle: Break Down → Track Progress → Complete

Instead of complex estimation and planning, we focus on:
1. **Breaking features into small, actionable tasks**
2. **Clear progress tracking**
3. **Simple handoffs between agents**

## Task Breakdown Strategy

### Feature Development
```
Large Feature → Small Tasks → Assign → Track → Complete
```

**Example:**
```markdown
## Feature: User Profile Management
**Priority:** High

### Tasks:
- [ ] Create user profile component structure (FE)
- [ ] Add profile form validation (FE)
- [ ] Implement profile image upload (FE)
- [ ] Write component tests (SSE)
- [ ] Update user documentation (TW)
- [ ] Review and approve (PM)
```

### Bug Fixes
```
Bug Report → Investigate → Fix → Test → Document → Close
```

**Example:**
```markdown
## Bug: Profile image not saving
**Priority:** P2

### Tasks:
- [ ] Reproduce the issue (SSE)
- [ ] Identify root cause (FE)
- [ ] Implement fix (FE)
- [ ] Add regression test (SSE)
- [ ] Update troubleshooting docs (TW)
```

## Simple Progress States

### Task States
- **TODO** - Not started
- **IN_PROGRESS** - Currently being worked on
- **REVIEW** - Ready for review/testing
- **DONE** - Completed and verified

### Visual Progress Tracking
```
Feature: User Profile Management [3/6 tasks completed]
- [x] Create component structure (FE)
- [x] Add form validation (FE)
- [x] Implement image upload (FE)
- [ ] Write component tests (SSE) - IN_PROGRESS
- [ ] Update documentation (TW)
- [ ] Final review (PM)
```

## Agent Responsibilities (Simplified)

### Project Manager
- Break down features into small tasks
- Assign tasks to appropriate agents
- Track overall progress
- Remove blockers

### Frontend Engineer
- Implement code tasks
- Create component structures
- Handle UI/UX requirements
- Trigger documentation needs

### Technical Writer
- Update docs when code changes
- Create user guides for new features
- Maintain documentation accuracy
- Review technical content

### Senior Software Engineer
- Test implementations
- Write automated tests
- Validate bug fixes
- Ensure quality standards

## Simple Handoff Rules

### 1. Feature Development Flow
```
PM creates tasks → FE implements → TW documents → SSE tests → PM reviews
```

### 2. Bug Fix Flow
```
SSE reports → PM prioritizes → FE fixes → SSE validates → TW updates docs
```

### 3. Documentation Flow
```
FE changes code → TW updates docs → SSE reviews accuracy → PM approves
```

## Task Creation Template (Simplified)

```markdown
## [Task Name]
**Type:** Feature/Bug/Docs/Test
**Priority:** High/Medium/Low
**Assignee:** [Agent]

### What needs to be done:
[Clear, actionable description]

### Done when:
- [ ] Specific outcome 1
- [ ] Specific outcome 2

### Notes:
[Any important context]
```

## Progress Tracking (Simple)

### Daily Updates
- What did you complete?
- What are you working on?
- Any blockers?

### Weekly Summary
- Tasks completed this week
- Tasks in progress
- Tasks planned for next week
- Any process improvements needed

## Quality Gates (Minimal)

### Before marking a task DONE:
- [ ] Code works as expected
- [ ] Tests pass (if applicable)
- [ ] Documentation updated (if needed)
- [ ] No obvious regressions

### Before starting next phase:
- [ ] Previous phase tasks completed
- [ ] No major blockers
- [ ] Next tasks clearly defined

## Benefits of This Approach

### ✅ Advantages
- **Simple to use** - No complex estimation
- **Clear progress** - Easy to see what's done/in progress
- **Flexible** - Tasks can be adjusted as needed
- **Fast** - Less overhead, more doing
- **Transparent** - Everyone can see progress

### 🎯 Focus Areas
- Break work into small, manageable pieces
- Track progress clearly and simply
- Maintain quality without bureaucracy
- Keep agents focused on their strengths
- Enable fast feedback and iteration

## Example: Real Task Breakdown

### Before (Complex)
```
Epic: Improve Search Functionality
- Estimated effort: 40 hours
- Sprint: 3 weeks
- Requirements: 15 detailed items
- Acceptance criteria: 20 items
```

### After (Simple)
```
Feature: Improve Search Functionality
Priority: High

Tasks:
- [ ] Add search filters UI (FE)
- [ ] Implement filter logic (FE)
- [ ] Add search result sorting (FE)
- [ ] Write search component tests (SSE)
- [ ] Update search documentation (TW)
- [ ] Performance test search with large data (SSE)
```

This approach keeps the team focused on shipping working software rather than managing complex planning overhead.

---

*Simplified workflow - focus on doing, not planning overhead.*
