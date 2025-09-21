# N8N Workflows Documentation

This directory contains organized n8n automation workflows exported from the n8n instance at `https://tienworkflow.tino.page/`.

## 📁 Folder Structure

```
workflows/
├── main-workflows/          # Primary workflows with triggers
├── sub-workflows/           # Reusable sub-workflows and services
├── archived/               # Deprecated or duplicate workflows
└── README.md              # This documentation
```

## 🔧 Main Workflows

Located in `main-workflows/` - These are the primary automation workflows that contain triggers and orchestrate the entire process.

### `ai-email-triage-assistant.json`
- **ID**: `JasTV4gv4NDVVogA`
- **Description**: AI-powered email processing workflow with intelligent routing
- **Trigger**: Gmail trigger (polls for unread emails from james@soxes.ch)
- **Features**:
  - AI-powered email classification and analysis
  - Multi-path routing based on email category
  - Automatic Confluence page creation for estimates
  - JIRA task creation for action items
  - MS Teams notifications for policy updates
  - Spam filtering and labeling
- **Dependencies**: All sub-workflows in this collection
- **Schedule**: Every hour at 15 minutes past the hour

### `jira-daily-digest-v1.1.json`
- **ID**: `TpkHechdPUuHi8Co`
- **Description**: Daily JIRA digest with Teams integration and metrics tracking
- **Trigger**: Schedule trigger (8:00 AM, Monday-Friday, Asia/Ho_Chi_Minh timezone)
- **Features**:
  - Fetches open JIRA issues assigned to user
  - Identifies overdue team tasks
  - Finds mentions and recent updates
  - Sends formatted digest to MS Teams
  - Tracks metrics in Google Sheets
- **Status**: Active workflow
- **Dependencies**: JIRA API, MS Teams webhook, Google Sheets API

## ⚙️ Sub-Workflows

Located in `sub-workflows/` - These are reusable service workflows called by main workflows using the "Execute Workflow" node.

### `ai-analysis-service.json`
- **ID**: `DrLDQaf54G0ZhJpf`
- **Purpose**: AI-powered email content analysis and classification
- **Input**: Email subject, sender, and body content
- **Output**: Classification, priority, task breakdown, and sender analysis
- **AI Model**: GPT-4 with Vietnamese language support
- **Categories**: TASK_REQUEST, ESTIMATION_REQUEST, CONFLUENCE_LINK_ESTIMATE, POLICY_UPDATE, SPAM_MARKETING, OTHER

### `create-confluence-page.json`
- **ID**: `RijpYfQk5ngFJNpN`
- **Purpose**: Creates Confluence pages from email content with AI analysis
- **Input**: Summary, priority, task breakdown, sender, and clean email body
- **Output**: Confluence page with structured content and MS Teams notification
- **Features**:
  - XML/HTML entity escaping for safe content
  - Structured page layout with panels and sections
  - Automatic MS Teams notification upon creation
- **Space**: Configurable (default: ~james)

### `create-jira-task.json`
- **ID**: `DwfZVlGV8BkAy0mU`
- **Purpose**: Creates JIRA tasks from email requests
- **Input**: Task summary, description, and priority mapping
- **Output**: JIRA task in specified project
- **Project**: James' Management Hub (ID: 10866)
- **Issue Type**: Task (ID: 10289)
- **Priority Mapping**: Supports all JIRA priority levels with ID mapping

### `send-ms-teams-message.json`
- **ID**: `9K2hf3sZ3NJ8p8GE`
- **Purpose**: Sends formatted notifications to MS Teams channels
- **Input**: Message content, activity details, and optional button actions
- **Output**: MS Teams MessageCard with structured layout
- **Features**:
  - Support for facts, activities, and action buttons
  - Configurable theme colors and styling
  - Error handling and fallback messaging

## 📋 Archived Workflows

Located in `archived/` - Contains duplicate files and deprecated workflows.

- `AI-Email-Triage-Assistant-duplicate.json` - Duplicate from old templates folder
- `sub-Create-Confluence-Page-duplicate.json` - Duplicate from old components folder

## 🚀 Usage Instructions

### Importing Workflows

1. **Access your n8n instance**
2. **Go to Workflows section**
3. **Click "Import from file"**
4. **Select the desired workflow JSON file**
5. **Configure credentials and settings**
6. **Test the workflow**
7. **Activate when ready**

### Workflow Dependencies

**For AI Email Triage Assistant:**
1. Import all sub-workflows first
2. Configure credentials:
   - Gmail OAuth2
   - JIRA Software Cloud API
   - OpenAI API
3. Update webhook URLs for MS Teams
4. Adjust space keys and page IDs for Confluence
5. Test each sub-workflow independently
6. Import and configure main workflow

**For JIRA Daily Digest:**
1. Configure JIRA credentials
2. Set up MS Teams webhook
3. Configure Google Sheets access (optional)
4. Update user account IDs and project keys
5. Test schedule timing

### Configuration Requirements

#### Credentials Needed:
- **Gmail OAuth2**: For email access
- **JIRA Software Cloud API**: For JIRA integration
- **OpenAI API**: For AI analysis (GPT-4 access required)
- **Google Sheets OAuth2**: For metrics tracking (optional)

#### Webhooks:
- **MS Teams Incoming Webhook**: For notifications
  - Replace webhook URLs in relevant workflows
  - Test webhook functionality

#### Environment-Specific Settings:
- **Confluence Space Keys**: Update space keys for your instance
- **JIRA Project IDs**: Update project and issue type IDs
- **User Account IDs**: Replace with your JIRA user account IDs
- **Email Filters**: Adjust sender filters as needed

## 🔧 Maintenance

### Regular Updates:
- **Quarterly**: Rotate API tokens and credentials
- **Monthly**: Review JQL queries and filters
- **Bi-weekly**: Test error handling and notifications

### Monitoring:
- Check execution logs for errors
- Monitor API rate limits
- Verify webhook connectivity
- Review AI classification accuracy

## 📊 Workflow Statistics

- **Total Workflows**: 6
- **Main Workflows**: 2
- **Sub-Workflows**: 4
- **Total Lines of Code**: 2,228
- **Languages Used**: JSON, JavaScript (Code nodes), JQL
- **AI Integration**: OpenAI GPT-4

## 🔗 Related Documentation

- [N8N Official Documentation](https://docs.n8n.io/)
- [JIRA REST API Documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [Confluence REST API Documentation](https://developer.atlassian.com/cloud/confluence/rest/v1/)
- [MS Teams MessageCard Reference](https://docs.microsoft.com/en-us/outlook/actionable-messages/message-card-reference)

## 📝 Version History

- **v1.1**: Organized folder structure, renamed files to kebab-case
- **v1.0**: Initial export from n8n instance (September 21, 2025)

---

*Last updated: September 21, 2025*  
*Source: n8n instance at https://tienworkflow.tino.page/*