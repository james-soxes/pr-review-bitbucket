# Contributing to N8N Automation Suite

Thank you for your interest in contributing to the N8N Automation Suite! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Types of Contributions

We welcome several types of contributions:

- **🐛 Bug Reports**: Report issues with existing workflows
- **💡 Feature Requests**: Suggest new workflows or improvements
- **🔧 Code Contributions**: Submit new workflows, components, or fixes
- **📚 Documentation**: Improve documentation, tutorials, or examples
- **🧪 Testing**: Help test workflows in different environments

## 📋 Development Process

### 1. Fork & Clone

```bash
# Fork the repository on GitHub
git clone https://github.com/your-username/n8n-automation-suite.git
cd n8n-automation-suite
```

### 2. Create Feature Branch

```bash
git checkout -b feature/your-workflow-name
# or
git checkout -b fix/issue-description
```

### 3. Development Setup

```bash
# Install dependencies
npm install

# Set up your environment
cp .env.example .env
# Edit .env with your test credentials
```

## 🏗️ Workflow Development Guidelines

### Directory Structure

Place your contributions in the appropriate directories:

```
workflows/
├── components/         # Reusable workflow components
│   ├── your-component.json
│   └── README.md      # Update with your component
└── templates/         # Complete workflow solutions
    ├── your-workflow.json
    └── README.md      # Update with your workflow
```

### Component Standards

#### JSON Structure
```json
{
  "name": "descriptive-workflow-name",
  "nodes": [...],
  "connections": {...},
  "settings": {
    "executionOrder": "v1"
  },
  "meta": {
    "templateCredsSetupCompleted": true,
    "instanceId": "your-workflow-export"
  }
}
```

#### Node Naming Convention
- Use descriptive, action-oriented names
- Format: `[ACTION] - Description`
- Examples: `[PARSE] - Extract Email Data`, `[CREATE] - Confluence Page`

#### Code Node Standards
```javascript
// Always include header comments
// ===== WORKFLOW COMPONENT NAME =====
// Version: 1.0
// Purpose: Brief description
// Author: Your name

/**
 * Function documentation
 * @param {Object} input - Input parameter
 * @returns {Object} - Return value
 */
function yourFunction(input) {
  // Implementation
}

try {
  // Main execution logic
  return [{ json: result }];
} catch (error) {
  // Comprehensive error handling
  return [{ json: { error: true, message: error.message } }];
}
```

### Configuration Management

#### Credentials
- Never commit credentials or sensitive data
- Use N8N credential management system
- Provide clear setup instructions in README

#### Environment Variables
```javascript
// Use environment-aware configuration
const CONFIG = {
  API_URL: $vars.API_URL || 'https://default-url.com',
  TIMEOUT: $vars.TIMEOUT || 30000
};
```

## 📝 Documentation Requirements

### Workflow Documentation

Each workflow must include:

1. **Purpose**: Clear description of what the workflow does
2. **Prerequisites**: Required services, credentials, versions
3. **Setup Instructions**: Step-by-step configuration guide
4. **Input/Output Examples**: Sample data structures
5. **Error Handling**: Common issues and troubleshooting

### README Updates

When adding workflows, update the relevant README files:

```markdown
## Your Workflow Name
**Location**: `workflows/components/your-workflow.json`

**Purpose**: Brief description

### Features:
- ✅ Feature 1
- ✅ Feature 2

### Setup Requirements:
- Service 1: Description
- Service 2: Description

### Input Data:
```json
{
  "example": "input structure"
}
```
```

## 🧪 Testing Guidelines

### Pre-submission Checklist

- [ ] **JSON Validation**: Ensure workflow JSON is valid
- [ ] **Import Test**: Successfully imports into clean N8N instance
- [ ] **Execution Test**: Runs without errors with sample data
- [ ] **Error Handling**: Gracefully handles invalid inputs
- [ ] **Documentation**: All required documentation is complete
- [ ] **Credentials**: No sensitive data in the workflow

### Test Environments

Test your workflows in:
- **Clean N8N instance**: Fresh installation
- **Different N8N versions**: Test compatibility
- **Various data scenarios**: Edge cases, errors, empty data

## 🚀 Submission Process

### Pull Request Checklist

Before submitting your pull request:

- [ ] **Branch Updated**: Latest changes from main branch
- [ ] **Tests Pass**: All workflows import and execute correctly
- [ ] **Documentation Complete**: README updates, inline comments
- [ ] **No Credentials**: Removed all sensitive information
- [ ] **Descriptive Title**: Clear, concise PR title
- [ ] **Detailed Description**: Explain changes and testing done

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New workflow
- [ ] New component
- [ ] Documentation update
- [ ] Other: ___

## Testing
- [ ] Imported successfully into clean N8N
- [ ] Tested with sample data
- [ ] Error handling verified
- [ ] Documentation updated

## Additional Notes
Any additional information or context
```

### Review Process

1. **Automated Checks**: JSON validation, file structure
2. **Maintainer Review**: Code quality, documentation
3. **Testing**: Import and execution testing
4. **Feedback**: Requested changes if needed
5. **Merge**: Approved contributions are merged

## 🐛 Reporting Issues

### Bug Report Template

```markdown
**Workflow**: Name of affected workflow
**N8N Version**: Your N8N version
**Environment**: Self-hosted/Cloud

**Description**
Clear description of the issue

**Steps to Reproduce**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Additional Context**
Logs, screenshots, etc.
```

### Feature Request Template

```markdown
**Feature Type**: Workflow/Component/Enhancement

**Description**
Clear description of the requested feature

**Use Case**
Why this feature would be useful

**Additional Context**
Mockups, examples, related workflows
```

## 📞 Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Documentation**: Check existing docs first

### Response Times

- **Bug Reports**: 48 hours acknowledgment
- **Feature Requests**: 1 week review
- **Pull Requests**: 1 week initial review

## 🏆 Recognition

### Contributors

All contributors are recognized in:
- Repository contributors list
- Release notes for significant contributions
- Special recognition for major features

### Coding Standards

- **Clean Code**: Readable, well-commented code
- **Error Handling**: Comprehensive error management
- **Performance**: Efficient, optimized workflows
- **Security**: No credentials, proper input validation

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and harassment-free experience for everyone, regardless of background or experience level.

### Expected Behavior

- **Respectful Communication**: Be kind and professional
- **Constructive Feedback**: Focus on improving the project
- **Collaborative Spirit**: Work together toward common goals
- **Inclusive Environment**: Welcome newcomers and diverse perspectives

### Unacceptable Behavior

- Harassment or discrimination of any kind
- Trolling, insulting, or derogatory comments
- Public or private harassment
- Publishing others' private information

## ❓ FAQ

**Q: Can I contribute workflows for specific companies?**
A: Yes, but ensure they're generalizable and don't contain proprietary information.

**Q: What if my workflow uses a paid service?**
A: That's fine! Just document the requirements clearly.

**Q: How do I handle sensitive configuration data?**
A: Use N8N credentials and environment variables. Never commit sensitive data.

**Q: Can I contribute workflows in languages other than English?**
A: Yes! We welcome international contributions with appropriate documentation.

---

Thank you for contributing to the N8N Automation Suite! 🙏

**Questions?** Open a GitHub Discussion or contact the maintainers.