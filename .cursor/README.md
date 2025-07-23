# Multiple Agent Workflow System

This directory contains the configuration and workflow definitions for the multiple agent system used in the Music Database Client (ACM) project.

## Overview

The Music Database Client uses a multiple agent working flow with four specialized agents:

1. **Project Manager** - Task management, progress tracking, coordination
2. **Frontend Engineer** - Vue.js 2 development, component creation, UI/UX
3. **Technical Writer** - Documentation sync, clarity, accuracy
4. **QA Engineer** - Testing, code quality, validation

## Directory Structure

```
.cursor/
├── roles/                    # Agent role definitions
│   ├── project-manager.md
│   ├── frontend-engineer.md
│   ├── technical-writer.md
│   └── qa-engineer.md
├── workflows/                # Agent workflow configurations
│   ├── feature-development.md
│   ├── bug-fix.md
│   ├── documentation-update.md
│   └── testing-protocol.md
├── templates/                # Reusable templates
│   ├── task-template.md
│   ├── test-plan-template.md
│   └── documentation-template.md
└── README.md                 # This file
```

## Agent Coordination

### Core Workflows

#### 1. Feature Development
```
PM → Plans feature → FE → Develops code → TW → Updates docs → QA → Tests & validates
```

#### 2. Bug Fix
```
QA → Identifies issue → PM → Prioritizes → FE → Fixes → TW → Updates docs → QA → Validates
```

#### 3. Documentation Update
```
FE → Code changes → TW → Identifies doc needs → PM → Schedules → QA → Reviews
```

#### 4. Testing & Quality
```
PM → Defines goals → QA → Creates strategy → FE → Implements → TW → Documents patterns
```

## Getting Started

### For Project Managers
1. Review `TASKS.md` for current project priorities
2. Use `templates/task-template.md` for creating new tasks
3. Follow `workflows/feature-development.md` for feature planning
4. Monitor quality gates and agent handoffs

### For Frontend Engineers
1. Follow Vue.js 2 best practices from `roles/frontend-engineer.md`
2. Use established patterns from `acm-kit-v1` component library
3. Trigger documentation updates when needed
4. Create unit tests for new components

### For Technical Writers
1. Monitor code changes for documentation impacts
2. Use `templates/documentation-template.md` for consistency
3. Follow `workflows/documentation-update.md` process
4. Maintain accuracy and clarity standards

### For QA Engineers
1. Follow `workflows/testing-protocol.md` for comprehensive testing
2. Use `templates/test-plan-template.md` for test planning
3. Monitor code quality metrics and coverage (target >70%)
4. Validate feature implementations and bug fixes

## Quality Gates

All work must pass through quality gates before handoff:

- **Code Quality**: ESLint, Prettier, SonarQube checks
- **Test Coverage**: Minimum coverage thresholds
- **Documentation**: Up-to-date and accurate docs
- **Performance**: Performance benchmarks met
- **Security**: Security best practices followed

## Communication Protocols

### Handoff Procedures
1. Clear task definition with requirements
2. Regular progress updates
3. Quality gate validation before handoff
4. Documentation of all work
5. Feedback loop for issues

### Emergency Procedures
- **Critical Bugs**: Direct escalation to PM
- **Blockers**: Immediate escalation and alternative planning
- **Dependencies**: Clear communication of impacts

## Success Metrics

### Workflow Efficiency
- Average task completion time
- Handoff efficiency between agents
- Blocker resolution time
- Communication effectiveness

### Quality Metrics
- Test coverage percentage (target >70%)
- Code quality scores
- Documentation accuracy
- Bug resolution time

### Team Metrics
- Agent utilization and productivity
- Cross-agent collaboration effectiveness
- Knowledge sharing and learning
- Process improvement initiatives

## File Management

### Central Files
- `../../TASKS.md` - Central task management (PM responsibility)
- `../../WORKFLOW.md` - Agent coordination documentation
- `../../memory-bank/` - Project context and documentation

### Agent-Specific Files
- **Project Manager**: Task tracking, progress monitoring
- **Frontend Engineer**: Component development, code implementation
- **Technical Writer**: Documentation maintenance, style guides
- **QA Engineer**: Test planning, quality assurance

## Workflow States

Tasks and features progress through defined states:

1. **PLANNED** - Requirements defined, resources allocated
2. **IN_PROGRESS** - Implementation underway
3. **DOCUMENTATION** - Documentation being updated
4. **TESTING** - Quality assurance in progress
5. **REVIEW** - Final validation and approval
6. **COMPLETED** - Work finished and deployed

## Best Practices

### Task Management
- Use consistent task templates
- Clear acceptance criteria
- Regular progress updates
- Proactive blocker communication

### Code Quality
- Follow established patterns
- Maintain test coverage
- Document changes appropriately
- Peer review before handoff

### Documentation
- Keep docs synchronized with code
- Use templates for consistency
- Validate accuracy regularly
- Update based on feedback

### Testing
- Test-driven development approach
- Comprehensive test coverage
- Automated quality checks
- Regular regression testing

## Continuous Improvement

The multiple agent workflow system is continuously improved through:

- Regular retrospectives on workflow effectiveness
- Feedback incorporation from all agents
- Process refinement based on metrics
- Tool evaluation and upgrades
- Best practice sharing and documentation

## Support and Resources

### Documentation
- Project context in `memory-bank/`
- Workflow definitions in `workflows/`
- Templates in `templates/`
- Agent roles in `roles/`

### Tools
- **Development**: Vue.js 2, Vuetify, Vite, Vuex
- **Testing**: Vitest, Vue Test Utils, SonarQube
- **Quality**: ESLint, Prettier, coverage tools
- **Coordination**: Task tracking, progress monitoring

---

*This multiple agent workflow system is designed to improve project efficiency, code quality, and team coordination while maintaining high standards for the Music Database Client project.*
