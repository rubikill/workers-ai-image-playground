# Feature Development Workflow

## Process Overview
This workflow guides the development of new features from conception to completion, ensuring quality, documentation, and testing standards are met.

## Agent Roles & Responsibilities

### 1. Project Manager (Planning Phase)
**Inputs:** Feature request, business requirements
**Outputs:** Task definition, acceptance criteria, priority

#### Actions:
- [ ] Create feature in `TASKS.md`
- [ ] Break down feature into small, actionable tasks
- [ ] Define clear acceptance criteria
- [ ] Set priority
- [ ] Identify dependencies and blockers
- [ ] Assign tasks to appropriate agents

**Template:**
```markdown
## Feature: [Feature Name]
**Priority:** High/Medium/Low

### Broken Down Tasks:
- [ ] Task 1: [Small, actionable task]
- [ ] Task 2: [Small, actionable task]
- [ ] Task 3: [Small, actionable task]

### Acceptance Criteria:
- [ ] Criteria 1
- [ ] Criteria 2

### Dependencies:
- Dependency 1 (if any)
- Dependency 2 (if any)
```

---

### 2. Frontend Engineer (Implementation Phase)
**Inputs:** Feature requirements, design specifications
**Outputs:** Working code, component implementation

#### Actions:
- [ ] Review feature requirements and acceptance criteria
- [ ] Plan component architecture and data flow
- [ ] Implement feature following Vue.js 2 best practices
- [ ] Ensure responsive design using Vuetify
- [ ] Follow established coding standards and patterns
- [ ] Test implementation locally
- [ ] Create/update component documentation
- [ ] Trigger documentation review

**Technical Checklist:**
- [ ] Vue.js 2 Options API used correctly
- [ ] Vuetify components implemented properly
- [ ] Vuex state management if needed
- [ ] Responsive design implemented
- [ ] Accessibility considerations addressed
- [ ] Performance optimized
- [ ] Error handling implemented
- [ ] Local testing completed

**Code Standards:**
- Use established component patterns from `acm-kit-v1`
- Follow BEM methodology for custom CSS
- Implement proper prop validation
- Use computed properties for derived data
- Follow Vue.js style guide conventions

---

### 3. Technical Writer (Documentation Phase)
**Inputs:** Implemented feature code, component specifications
**Outputs:** Updated documentation, user guides

#### Actions:
- [ ] Review code changes and new components
- [ ] Identify documentation requirements
- [ ] Update component documentation
- [ ] Update user guides if user-facing changes
- [ ] Update API documentation if needed
- [ ] Ensure code comments are clear and helpful
- [ ] Update README if setup changes
- [ ] Validate documentation accuracy

**Documentation Checklist:**
- [ ] Component props and events documented
- [ ] Usage examples provided
- [ ] Integration patterns explained
- [ ] User guide updated (if applicable)
- [ ] API changes documented (if applicable)
- [ ] Code comments reviewed and improved
- [ ] Screenshots updated (if UI changes)

---

### 4. Senior Software Engineer (Review Phase)
**Inputs:** Feature implementation, documentation
**Outputs:** Test suite, quality validation

#### Actions:
- [ ] Review feature implementation and requirements
- [ ] Create test plan for new feature
- [ ] Write unit tests for new components/functions
- [ ] Write integration tests if needed
- [ ] Validate feature against acceptance criteria
- [ ] Perform code quality analysis
- [ ] Check test coverage metrics
- [ ] Validate documentation accuracy
- [ ] Test edge cases and error scenarios

**Testing Checklist:**
- [ ] Unit tests for all new functions/methods
- [ ] Component tests for Vue components
- [ ] Integration tests for feature workflows
- [ ] Edge case testing completed
- [ ] Error handling tested
- [ ] Performance testing (if applicable)
- [ ] Accessibility testing
- [ ] Cross-browser testing (if UI changes)

**Quality Gates:**
- Unit test coverage >80% for new code
- All tests passing
- No critical SonarQube issues
- Performance benchmarks met
- Accessibility standards met

---

### 5. Project Manager (Completion Phase)
**Inputs:** Tested feature, complete documentation
**Outputs:** Feature deployment, updated project tracking

#### Actions:
- [ ] Review feature completion against acceptance criteria
- [ ] Validate all quality gates passed
- [ ] Update task status in `TASKS.md`
- [ ] Coordinate deployment if needed
- [ ] Update project metrics and tracking
- [ ] Communicate completion to stakeholders
- [ ] Plan next iteration or related features

## Workflow States

### 1. **PLANNED** (PM)
- Requirements defined
- Acceptance criteria set
- Priority assigned
- Dependencies identified

### 2. **IN_DEVELOPMENT** (FE)
- Implementation started
- Code being written
- Local testing in progress

### 3. **DOCUMENTATION** (TW)
- Code review for documentation needs
- Documentation being updated
- Examples being created

### 4. **TESTING** (SSE)
- Tests being written
- Quality analysis in progress
- Validation against requirements

### 5. **REVIEW** (PM)
- Final review of all outputs
- Quality gate validation
- Deployment coordination

### 6. **COMPLETED** (PM)
- Feature live and functional
- Documentation updated
- Tests passing
- Metrics updated

## Communication Points

### Handoff Communications
1. **PM → FE**: Feature requirements, context, priority
2. **FE → TW**: Code changes, component documentation needs
3. **TW → SSE**: Updated documentation, testing requirements
4. **SSE → PM**: Test results, quality metrics, completion status

### Status Updates
- Daily progress updates in `TASKS.md`
- Blockers escalated immediately
- Quality issues addressed before handoff
- Timeline changes communicated proactively

## Quality Metrics

### Success Criteria
- Feature meets all acceptance criteria
- Code quality standards met
- Documentation accurate and complete
- Test coverage targets achieved
- Performance benchmarks met

### Tracking Metrics
- Time to completion
- Quality gate pass rate
- Documentation accuracy
- Test coverage percentage
- User acceptance (post-deployment)

---

*This workflow template is maintained by the Project Manager and updated based on team feedback and process improvements.*
