# CLAUDE.md - Crowbar Mobile Development Guidelines

This file contains important guidelines and context for AI assistants working on the Crowbar Mobile project.

## 🔄 Project Awareness & Context

- **Always read `ai-docs/planning/PROJECT_PLAN.md`** at the start of a new conversation to understand the project's architecture, goals, style, and constraints.
- **Check `ai-docs/tasks/TASKS.md`** before starting a new task. If the task isn't listed, add it with a brief description and today's date and time.
- **ALWAYS consult `ai-docs/planning/ACCEPTANCE_CRITERIA.md`** before starting any development to understand quality standards and validation requirements.
- **Use consistent naming conventions, file structure, and architecture patterns** as described in `ai-docs/planning/PROJECT_PLAN.md`.
- **Always use Brazilian Portuguese for comments and documentation**.

## 🧱 Code Structure & Modularity

- **Never create a file longer than 500 lines of code.** If a file approaches this limit, refactor by splitting it into modules or helper files.
- **Organize code into clearly separated modules**, grouped by feature or responsibility.
- **Use clear, consistent imports** (prefer relative imports within packages).

## 🧪 Testing & Reliability

- **Always create unit tests for new features** (functions, classes, routes, etc).
- **After updating any logic**, check whether existing unit tests need to be updated. If so, do it.
- **Tests should live in a `/tests` folder** mirroring the main app structure.
  - Include at least:
    - 1 test for expected use
    - 1 edge case
    - 1 failure case

## ✅ Task Completion

- **Always update tasks in `ai-docs/tasks/TASKS.md`** using best practices for markdown, linting and using **SCRUM METHOD**.
- **Mark completed tasks in `ai-docs/tasks/TASKS.md`** immediately after finishing them and **make a git commit/push**.
- Add new sub-tasks or TODOs discovered during development to `ai-docs/tasks/BACKLOG.md` under a "Discovered During Work" section.

## 📚 Documentation & Explainability

- **Update `README.md`** when new features are added, dependencies change, or setup steps are modified.
- **Comment non-obvious code** and ensure everything is understandable to a mid-level developer.
- When dealing with **API and routes** always update the `ai-docs/api/API.md` using best practices for markdown and linting.
- When writing complex logic, **add an inline `# Reason:` comment** explaining the why, not just the what.

## 🧠 AI Behavior Rules

- **Always create or update files with smaller chunks to avoid JSON parsing issues**
- **Never assume missing context. Ask questions if uncertain.**
- **Never hallucinate libraries or functions** – only use known, verified packages.
- **Always confirm file paths and module names** exist before referencing them in code or tests.
- **Never delete or overwrite existing code** unless explicitly instructed to or if part of a task from `ai-docs/tasks/TASKS.md`.
- **Always update memories in BOTH the remember tool AND `augment.config.json`** to ensure persistence across sessions.

## 📋 **ACCEPTANCE CRITERIA AND QUALITY**

### **📖 Using Acceptance Criteria**

- **ALWAYS consult `ai-docs/planning/ACCEPTANCE_CRITERIA.md`** before starting any development
- **Check Definition of Done (DoD)** to ensure all mandatory criteria are met
- **Use appropriate templates** from the criteria file for new features
- **Validate functional, performance, security and usability criteria** as specified

### **🔗 Integration with Tasks**

- **Acceptance criteria complement `ai-docs/tasks/TASKS.md`** - they don't replace them
- **Tasks define WHAT to do**, criteria define **HOW to validate it was done correctly**
- **Always reference specific criteria** when marking tasks as completed
- **Update criteria** when requirements change during development

### **⚡ When to Apply Criteria**

#### **🟢 ALWAYS apply for:**
- New features or systems
- APIs and endpoints
- User interfaces
- Integrations with external systems
- Critical security features
- Performance components

#### **🟡 CONSIDER applying for:**
- Significant refactoring
- Complex bug fixes
- Critical dependency updates
- Important configuration changes

#### **🔴 DO NOT apply for:**
- Simple bug fixes
- Documentation adjustments
- Minor configuration changes
- Experimental tests

### **🔄 Criteria Maintenance**

#### **📅 Regular Review**
- **Review criteria weekly** during sprint planning
- **Update based on feedback** from testing and production
- **Version significant changes** in criteria
- **Communicate changes** to entire team

#### **📊 Quality Metrics**
- **Test Coverage:** Maintain > 80% coverage
- **Performance:** Monitor SLAs defined in criteria
- **Security:** Zero critical vulnerabilities
- **Usability:** Follow defined UX guidelines

### **✅ Validation Process**

#### **🤖 Automated Validation**
```bash
# Run before marking task as completed
npm run test
npm run lint
npm run type-check
npm run test:e2e
```

#### **👤 Manual Validation**
- **Smoke Test:** Main functionalities working
- **User Journey:** Complete flows tested
- **Cross-platform:** iOS and Android compatibility verified
- **Load Testing:** Performance under load

#### **📋 Completion Checklist**
Before marking any task as ✅ **COMPLETED**:

- [ ] **All functional criteria** met
- [ ] **Performance criteria** validated
- [ ] **Security criteria** implemented
- [ ] **Usability criteria** verified
- [ ] **Definition of Done** completely satisfied
- [ ] **Automated tests** passing
- [ ] **Documentation** updated
- [ ] **Deploy and monitoring** configured

### **🎯 Templates and Patterns**

#### **📝 When creating new functionality:**
1. **Copy appropriate template** from `ACCEPTANCE_CRITERIA.md`
2. **Adapt criteria** for specific context
3. **Define measurable metrics** (not subjective)
4. **Include specific test scenarios**
5. **Document validation process**

#### **🔧 When modifying existing functionality:**
1. **Review existing criteria** for the functionality
2. **Update criteria** if necessary
3. **Check impact** on other systems
4. **Execute regression** of related tests

### **🚨 Alerts and Exceptions**

#### **⚠️ When criteria cannot be met:**
- **Document exception** with technical justification
- **Define risk mitigation plan**
- **Obtain stakeholder approval**
- **Create follow-up task** to resolve limitation

#### **🔥 Emergency situations:**
- **Critical hotfixes** may have criteria relaxed temporarily
- **ALWAYS create task** to apply complete criteria later
- **Document technical debt** created by the exception

---

## 🎯 **SUMMARY: WORKFLOW WITH CRITERIA**

1. **📖 READ** criteria before starting
2. **📋 PLAN** implementation based on criteria
3. **💻 DEVELOP** following defined standards
4. **🧪 TEST** according to validation process
5. **✅ VALIDATE** all criteria before concluding
6. **📝 DOCUMENT** and update as necessary
7. **🚀 DEPLOY** with monitoring configured

**Remember:** Acceptance criteria are the **quality guarantee** of the project! 🛡️

---

## 🚀 Project-Specific Context

### Current Status
- **MVP Status:** ✅ CONCLUÍDO
- **Phase:** 🚀 PREPARAÇÃO PARA PRODUÇÃO
- **Progress:** 80% complete (234/292 story points)
- **Completed Sprints:** 4/6

### Tech Stack
- **Framework:** React Native 0.80.1 with TypeScript
- **State Management:** Redux Toolkit with persistence
- **Navigation:** React Navigation (Bottom Tabs + Stack)
- **UI Library:** React Native Paper (Material Design 3)
- **Backend Integration:** Firebase (Auth, Firestore, Analytics, Messaging)
- **HTTP Client:** Axios with interceptors
- **Forms:** Formik + Yup
- **Animations:** React Native Reanimated

### Key Commands
```bash
# Development
npm start              # Start Metro bundler
npm run android       # Run on Android
npm run ios          # Run on iOS

# Quality
npm run lint         # Run ESLint
npm run format       # Run Prettier
npm run type-check   # TypeScript check
npm run quality      # Run all quality checks

# Testing
npm test             # Run unit tests
npm run test:e2e     # Run E2E tests

# Environment
npm run env:dev      # Switch to development
npm run env:staging  # Switch to staging
npm run env:prod     # Switch to production

# Build
npm run build:android     # Build Android
npm run build:ios        # Build iOS
npm run build:production # Build for production
```

### Important Files & Locations
- **Planning Docs:** `ai-docs/planning/`
- **Task Management:** `ai-docs/tasks/TASKS.md`
- **API Types:** `src/types/api.ts`
- **Redux Store:** `src/store/`
- **Screens:** `src/screens/`
- **Services:** `src/services/`
- **Components:** `src/components/`

### Next Immediate Tasks (Sprint 5)
1. Complete Push Notifications System (NOTIF-001)
2. Implement Real-time Features (REALTIME-001)
3. Begin comprehensive testing suite (Sprint 6)

---

## Agent OS Documentation

### Product Context
- **Mission & Vision:** @.agent-os/product/mission.md
- **Technical Architecture:** @.agent-os/product/tech-stack.md
- **Development Roadmap:** @.agent-os/product/roadmap.md
- **Decision History:** @.agent-os/product/decisions.md

### Development Standards
- **Code Style:** @~/.agent-os/standards/code-style.md
- **Best Practices:** @~/.agent-os/standards/best-practices.md

### Project Management
- **Active Specs:** @.agent-os/specs/
- **Spec Planning:** Use `@~/.agent-os/instructions/create-spec.md`
- **Tasks Execution:** Use `@~/.agent-os/instructions/execute-tasks.md`

## Workflow Instructions

When asked to work on this codebase:

1. **First**, check @.agent-os/product/roadmap.md for current priorities
2. **Then**, follow the appropriate instruction file:
   - For new features: @.agent-os/instructions/create-spec.md
   - For tasks execution: @.agent-os/instructions/execute-tasks.md
3. **Always**, adhere to the standards in the files listed above

## Important Notes

- Product-specific files in `.agent-os/product/` override any global standards
- User's specific instructions override (or amend) instructions found in `.agent-os/specs/...`
- Always adhere to established patterns, code style, and best practices documented above.

---

**Last Updated:** 2025-01-23