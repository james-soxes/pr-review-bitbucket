# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository Overview

This is an n8n automation suite repository designed for creating, managing, and deploying workflow automations using n8n with MCP (Model Context Protocol) tools. The project focuses on template-driven workflow development, validation, and deployment.

## Core Architecture

### Directory Structure

- `components/` - Reusable n8n workflow components and node configurations
- `docs/` - Documentation for workflows, templates, and development guides
- `templates/` - Pre-built n8n workflow templates organized by use case

### Workflow Development Philosophy

This project follows a **template-first approach** where existing workflows are customized rather than built from scratch. The architecture prioritizes:

- Discovery and reuse of existing n8n templates (2,500+ available)
- Validation-driven development with pre and post-deployment checks
- MCP tool integration for enhanced workflow capabilities
- Attribution and documentation of template sources

## Development Commands

### N8N MCP Tools Setup

```bash
# Initialize MCP tools documentation
call_mcp_tool tools_documentation

# Get database statistics and verify MCP working
call_mcp_tool get_database_statistics
```

### Template Discovery and Search

```bash
# Find templates by metadata (recommended for beginners)
call_mcp_tool search_templates_by_metadata '{"complexity": "simple", "maxSetupMinutes": 30}'

# Search templates by functionality
call_mcp_tool search_templates '"slack notification"'

# Get curated templates by task type
call_mcp_tool get_templates_for_task '"webhook_processing"'

# Find templates using specific nodes
call_mcp_tool list_node_templates '["n8n-nodes-base.slack"]'
```

### Node Discovery and Configuration

```bash
# Search for nodes by functionality
call_mcp_tool search_nodes '{"query": "webhook"}'

# List nodes by category
call_mcp_tool list_nodes '{"category": "trigger"}'

# Get essential node information (recommended first step)
call_mcp_tool get_node_essentials '"nodes-base.slack"'

# Find specific node properties
call_mcp_tool search_node_properties '"nodes-base.httpRequest"' '"auth"'
```

### Workflow Validation

```bash
# Validate node configuration before building
call_mcp_tool validate_node_minimal '"nodes-base.slack"' '{}'

# Validate complete node operation
call_mcp_tool validate_node_operation '"nodes-base.slack"' '{"resource":"message","operation":"send"}' '"runtime"'

# Validate complete workflow
call_mcp_tool validate_workflow '{"workflow": WORKFLOW_JSON}'

# Validate workflow connections and structure
call_mcp_tool validate_workflow_connections '{"workflow": WORKFLOW_JSON}'

# Validate n8n expressions
call_mcp_tool validate_workflow_expressions '{"workflow": WORKFLOW_JSON}'
```

## Development Workflow

### 1. Template Discovery Phase

Always start by finding existing templates:

```bash
# For beginners - simple complexity with short setup time
call_mcp_tool search_templates_by_metadata '{"complexity": "simple", "targetAudience": "marketers", "maxSetupMinutes": 30}'

# For specific services
call_mcp_tool search_templates_by_metadata '{"requiredService": "openai"}'
```

### 2. Template Retrieval and Customization

```bash
# Get full template for customization
call_mcp_tool get_template 'TEMPLATE_ID' '{"mode": "full"}'

# Always include attribution when using templates
# Format: "This workflow is based on a template by **[author.name]** (@[author.username])"
# Include link: "View the original template at: [url]"
```

### 3. Building from Scratch (if no suitable template)

```bash
# Get node essentials first
call_mcp_tool get_node_essentials '"nodes-base.httpRequest"'

# Pre-validate configuration
call_mcp_tool validate_node_minimal '"nodes-base.httpRequest"' '{"method": "POST"}'
```

### 4. Workflow Validation Pipeline

Always validate workflows before deployment:

```bash
# 1. Validate complete workflow
call_mcp_tool validate_workflow '{"workflow": WORKFLOW_JSON}'

# 2. Check connections and structure
call_mcp_tool validate_workflow_connections '{"workflow": WORKFLOW_JSON}'

# 3. Validate expressions syntax
call_mcp_tool validate_workflow_expressions '{"workflow": WORKFLOW_JSON}'
```

## Key Development Principles

### Template Attribution Requirements

When using any n8n template, you **MUST** include:

- Author's name and username: "**[author.name]** (@[author.username])"
- Link to original template: "View the original at: [url]"
- This attribution should be included in workflow documentation and comments

### Validation Strategy

- **Pre-validate**: Check node configurations before building workflows
- **Post-validate**: Validate complete workflows before deployment
- **Expression validation**: Ensure all n8n expressions use proper syntax (`$json`, `$node["NodeName"].json`)

### Node Usage Guidelines

- Prefer standard nodes over Code nodes unless absolutely necessary
- Any node can be used as an AI tool, not just those marked `usableAsTool=true`
- Use `get_node_essentials()` to see only the 10-20 most important properties first
- Leverage pre-configured templates from `get_node_for_task()`

### Workflow Development Best Practices

- Always search for existing templates before building from scratch (saves 70-90% development time)
- Use metadata filters to find skill-appropriate templates
- Build workflows incrementally with validation at each step
- Include error handling in complex workflows
- Document workflow purpose and configuration in sticky notes

## Common Node Types and Use Cases

### Triggers

- `nodes-base.webhook` - HTTP webhook endpoints
- `nodes-base.cron` - Scheduled executions
- `nodes-base.manualTrigger` - Manual workflow starts

### AI Integration

- `@n8n/n8n-nodes-langchain.openai` - OpenAI API integration
- AI Agent modules for advanced automation
- Use "complete" operation rather than "completion" for OpenAI nodes

### Communication

- `nodes-base.slack` - Slack integration
- `nodes-base.gmail` - Email automation
- `nodes-base.discord` - Discord messaging

### Data Processing

- `nodes-base.httpRequest` - HTTP API calls
- `nodes-base.code` - Custom JavaScript/Python logic
- `nodes-base.json` - JSON manipulation

## Project-Specific Notes

This repository is configured for educational purposes with n8n automation, focusing on workflow template creation and MCP tool integration. The development approach emphasizes discovery and customization of existing workflows rather than building from scratch.

When working with this codebase, always:

1. Check for existing templates first using MCP tools
2. Validate configurations before building
3. Include proper attribution for templates
4. Test workflows thoroughly before deployment
5. Document workflow architecture and connections clearly
