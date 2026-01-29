# Claude Code Development Guidelines

## 🎯 Core Development Philosophy

**Explore → Think → Plan → Execute**

Code Requirements: **Simple, Effective**

---

## 📋 Claude AI Development Rules

### 1. Deep Problem Understanding
- Thoroughly analyze the problem first
- Read relevant files in the codebase
- Write plans to `tasks/todo.md` file

### 2. Detailed Planning
- Plans should include checkable todo items
- Each task must be clear and executable
- Prioritize tasks by importance

### 3. Plan Confirmation
- Must confirm plan with team before starting work
- Wait for plan validation before execution

### 4. Step-by-Step Execution
- Complete tasks according to todo items one by one
- Mark as completed immediately after finishing
- Keep task status updated in real-time

### 5. High-Level Communication
- Provide high-level change descriptions for each step
- Explain what was done, not how it was done
- Keep communications concise and clear

### 6. Simplicity First Principle
- Every task and code change should be as simple as possible
- Avoid large-scale or complex changes
- Minimize code affected by each change
- **Everything follows the simplicity principle**

### 7. Summary & Review
- Add review section to `tasks/todo.md` file
- Summarize changes made
- Record other relevant information

---

## 🔒 Security Check Guidelines

### Code Security Review
After completing code writing, must perform the following security checks:

- ✅ **Follow security best practices**
- ✅ **No sensitive information leakage in frontend**
- ✅ **No exploitable security vulnerabilities**
- ✅ **Input validation and output escaping**
- ✅ **Correct permission control implementation**

### Security Checklist
```markdown
- [ ] Sensitive data encrypted storage
- [ ] API interface permission verification
- [ ] SQL injection protection
- [ ] XSS attack protection
- [ ] CSRF token validation
- [ ] File upload security checks
- [ ] No sensitive information in logs
```

---

## 📚 Learning & Knowledge Transfer

### Claude Teaching Mode
After completing feature development, need to explain in detail:

1. **Feature Description**
   - Detailed explanation of built features
   - Explain how the code works

2. **Change Walkthrough**
   - Step-by-step explanation of changes made
   - Explain reasons and impact of each change

3. **Technical Guidance**
   - Teach code like a senior engineer
   - Share best practices and experience
   - Provide learning suggestions

### Knowledge Documentation
- Important technical decisions must be documented
- Complex business logic needs detailed comments
- Key architectural designs need documentation

---

## 🚀 Efficient Workflow

### Productivity During Development Gaps

When AI is handling complex tasks, team members can:

#### 💡 Creative Generation
- Brainstorm new feature ideas
- Discuss product optimization plans
- Explore technical innovation directions

#### 🔄 Reflection & Planning
- Review current project progress
- Evaluate business development direction
- Plan next phase goals

#### 📝 Content Creation
- Write technical blogs
- Organize project documentation
- Prepare sharing materials

#### 🤝 Team Collaboration
- Code reviews
- Technical discussions
- Experience sharing

### Suggested Interaction Methods
1. **Technical Mentor Role**: Discuss technical challenges and solutions
2. **Product Consultant Role**: Analyze market needs and product direction
3. **Creative Partner Role**: Inspire new ideas and innovative thinking
4. **Learning Partner Role**: Learn new technologies and best practices together

---

## 📁 File Structure Standards

### Required Files
```
project/
├── tasks/
│   └── todo.md          # Task planning and progress tracking
├── docs/
│   ├── architecture.md  # Architecture documentation
│   ├── api.md          # API documentation
│   └── security.md     # Security specifications
├── rules.md            # Development rules
├── CLAUDE.md           # This file
└── README.md           # Project description
```

### todo.md Template
```markdown
# Project Task List

## 📋 Current Plan
- [ ] Task 1: Description
- [ ] Task 2: Description
- [ ] Task 3: Description

## ✅ Completed
- [x] Completed task

## 📝 Review Summary
### Current Changes
- Change 1: Description
- Change 2: Description

### Related Information
- Notes
- Future plans
```

---

## 🎯 Quality Standards

### Code Quality
- **Readability**: Clear and understandable code
- **Maintainability**: Reasonable structure, easy to modify
- **Testability**: Easy to write and execute tests
- **Performance**: Meet performance requirements

### Delivery Standards
- **Complete Functionality**: Meet requirement specifications
- **Pass Tests**: All test cases pass
- **Complete Documentation**: Necessary documentation updated
- **Security Compliance**: Pass security checks

---

## 🔄 Continuous Improvement

### Regular Reviews
- Weekly workflow effectiveness reviews
- Collect team feedback
- Optimize development rules and processes

### Learning & Growth
- Share best practices
- Learn new technologies and tools
- Improve overall team capabilities

---

## 🤖 Claude Code Specific Instructions

### Task Management
- Use TodoWrite tool to track all tasks
- Mark tasks as in_progress when starting
- Mark as completed immediately when done
- Never batch completions

### Code Style
- Follow existing codebase conventions
- Check for existing libraries before using new ones
- Mimic existing patterns and naming conventions
- Never add comments unless explicitly requested

### Testing & Validation
- Run lint and typecheck commands when available
- Verify solutions with existing tests
- Never assume test frameworks - check codebase first

### Communication
- Keep responses concise and direct
- Answer in 1-4 lines unless detail requested
- No unnecessary preamble or explanations
- Focus on what was done, not how

---

*This guidelines document will be continuously updated and improved as the project evolves.*