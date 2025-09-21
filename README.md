# N8N Workflow Generator Expert System

A comprehensive system for generating functional N8N workflows with integrated Winsurf validation rules. This expert system ensures that generated workflows are production-ready, secure, and follow N8N best practices.

## 🚀 Features

- **Automated Workflow Generation**: Create complete N8N workflows from descriptions or images
- **Winsurf Integration**: Built-in validation rules ensure code quality and compliance
- **Security First**: Prevents hardcoded credentials and enforces secure practices
- **Error Handling**: Automatic inclusion of proper error handling patterns
- **Documentation**: Auto-generated sticky notes and comprehensive workflow documentation
- **OpenAI Compatibility**: Updated for latest N8N OpenAI node specifications
- **Performance Optimization**: Built-in performance checks and optimization suggestions

## 📋 Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- N8N >= 1.0.0
- Winsurf CLI

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/james-soxes/n8n-automation-suite.git
   cd n8n-automation-suite
   ```

2. **Install dependencies**:
   ```bash
   npm run setup
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## 🎯 Quick Start

### Basic Usage

1. **Validate existing workflows**:
   ```bash
   npm run validate
   ```

2. **Lint and fix issues**:
   ```bash
   npm run lint:fix
   ```

3. **Generate HTML report**:
   ```bash
   npm run lint:report
   ```

### Development Mode

```bash
npm run dev
```

This will watch for changes and automatically validate workflows.

## 📖 Rule Categories

### 1. Workflow Validation Rules
- **n8n-workflow-validation**: Ensures valid JSON structure and completeness
- **n8n-node-structure**: Validates node properties and required fields
- **n8n-connection-integrity**: Verifies proper node connections

### 2. Security Rules
- **n8n-security**: Prevents hardcoded credentials and enforces secure practices
- **n8n-credential-references**: Ensures proper credential handling
- **n8n-sensitive-data-protection**: Validates sensitive data handling

### 3. Performance Rules
- **n8n-performance**: Optimizes workflow performance
- **n8n-efficient-nodes**: Suggests efficient node usage
- **n8n-rate-limiting**: Handles API rate limiting

### 4. Best Practices
- **n8n-documentation**: Requires sticky notes and documentation
- **n8n-naming-conventions**: Enforces consistent naming
- **n8n-error-handling**: Ensures proper error handling

## 🔧 Configuration

### Winsurf Configuration (`winsurf.config.js`)

The main configuration file contains:
- Rule definitions and severity levels
- Custom validators for N8N-specific patterns
- Integration settings for CI/CD
- Auto-fix configurations

### Rule Definitions (`winsurf-n8n-rules.json`)

Comprehensive rule definitions including:
- Validation checks
- Error patterns and fixes
- Node-specific rules
- Quality gates

## 📝 Workflow Generation Guidelines

### 1. Basic Structure
Every generated workflow must include:
```json
{
  "name": "Generated Workflow",
  "nodes": [],
  "connections": {},
  "active": false,
  "settings": {
    "executionOrder": "v1"
  },
  "tags": ["generated", "winsurf"]
}
```

### 2. Node Requirements
Each node must have:
- Unique ID (UUID format)
- Descriptive name
- Valid node type
- Proper positioning
- Complete parameters

### 3. OpenAI Node Configuration
**Important**: Use `"complete"` instead of `"completion"` for OpenAI nodes:
```json
{
  "type": "n8n-nodes-base.openAi",
  "parameters": {
    "resource": "complete",
    "model": "gpt-3.5-turbo",
    "prompt": "Your prompt here"
  }
}
```

### 4. Error Handling
Include error handling nodes:
```json
{
  "type": "n8n-nodes-base.errorTrigger",
  "name": "Error Handler",
  "parameters": {
    "errorWorkflow": "error-notification-workflow"
  }
}
```

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Validate Specific Workflow
```bash
node scripts/validate-workflows.js path/to/workflow.json
```

### Generate Test Report
```bash
npm run lint:report
```

## 🚀 CI/CD Integration

### GitHub Actions
```yaml
name: Validate N8N Workflows
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm run ci
```

### Pre-commit Hooks
Automatically configured with Husky:
- Lint and fix issues before commit
- Validate workflow structure
- Generate documentation

## 📊 Reporting

### HTML Reports
Generate comprehensive HTML reports:
```bash
npm run lint:report
```

### JSON Reports
For programmatic access:
```bash
winsurf lint --format json --output-file report.json
```

## 🔍 Common Issues and Solutions

### 1. Invalid Node Connections
**Error**: `Connection references non-existent node`
**Solution**: Ensure all connection references point to valid node IDs

### 2. Missing Credentials
**Error**: `Hardcoded credentials detected`
**Solution**: Use credential references instead of hardcoded values

### 3. OpenAI Compatibility
**Error**: `Use 'complete' instead of 'completion'`
**Solution**: Update OpenAI node resource parameter

### 4. Missing Documentation
**Warning**: `Workflow lacks documentation`
**Solution**: Add sticky notes explaining workflow purpose and steps

## 📚 API Reference

### Custom Validators

#### `validateWorkflowStructure(workflow)`
Validates basic workflow JSON structure.

#### `validateConnections(workflow)`
Ensures all node connections are valid.

#### `validateOpenAINode(node)`
Validates OpenAI node configuration.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/james-soxes/n8n-automation-suite/issues)
- **Documentation**: [Wiki](https://github.com/james-soxes/n8n-automation-suite/wiki)
- **Discussions**: [GitHub Discussions](https://github.com/james-soxes/n8n-automation-suite/discussions)

## 🔄 Changelog

### v1.0.0
- Initial release
- Complete Winsurf integration
- N8N workflow validation rules
- OpenAI compatibility updates
- Comprehensive documentation

---

**Made with ❤️ for the N8N community**
