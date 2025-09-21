# N8N Workflow Components

This directory contains exported n8n workflow components that can be imported and reused.

## sub-Create-Confluence-Page.json

**Purpose**: Creates Confluence pages from email estimation requests and sends Teams notifications

**Workflow Description**:
This sub-workflow processes email data to create structured Confluence pages for project estimation requests. It's designed to work with Vietnamese content and automatically formats the data for Confluence storage format.

### Nodes:

1. **When Executed by Another Workflow** - Trigger node for sub-workflow execution
2. **[PARSE] - JSON for Create Confluence From Email** - Code node that processes email data and creates Confluence page payload
3. **[CREATE] - Confluence Page - Estimate** - HTTP Request node that creates the Confluence page
4. **[PARSE] - JSON Confluence - MS Team** - Code node that creates Teams notification payload
5. **[NOTIFY] - Send to MS Teams** - HTTP Request node that sends notification to Microsoft Teams

### Input Data Expected:
```json
{
  "spaceKey": "~james",
  "parentId": 673022176,
  "originalSender": "sender information",
  "summary": "AI-generated summary",
  "priority": "Medium|High|Low",
  "taskBreakdown": "AI-generated task breakdown",
  "cleanBody": "cleaned email content",
  "aiOuput": "JSON string with AI analysis results"
}
```

### Output:
- Creates a Confluence page with sections for:
  - Quote request details (Vietnamese)
  - AI summary
  - Task breakdown with panel macro
  - Original email content with panel macro
- Sends Teams notification with page details

### Configuration Required:
1. **Atlassian Credentials**: Set up `jiraSoftwareCloudApi` credentials for Confluence access
2. **Teams Webhook URL**: Update the webhook URL for Teams notifications
3. **Space and Parent Page**: Configure the Confluence space key and parent page ID

### Features:
- **HTML/XML Escaping**: Prevents parsing errors in Confluence
- **Error Handling**: Comprehensive error handling with fallback page creation
- **Vietnamese Content Support**: Properly handles Vietnamese text and formatting
- **Modular Structure**: Clean code organization with utility functions
- **Teams Integration**: Rich Teams notifications with actionable links

### How to Import:
1. Copy the JSON content from `sub-Create-Confluence-Page.json`
2. In n8n, go to Workflows → Import from File
3. Paste the JSON content or upload the file
4. Configure credentials and URLs as needed
5. Save and activate the workflow

### Dependencies:
- n8n version 1.x or higher
- Confluence Cloud instance with API access
- Microsoft Teams with webhook capabilities
- Proper authentication credentials configured

### Version: 1.0
**Created**: September 2025  
**Author**: AI-Generated and Optimized  
**Last Modified**: September 21, 2025