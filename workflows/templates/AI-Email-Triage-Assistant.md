# AI Email Triage Assistant

## Overview

The AI Email Triage Assistant is a sophisticated workflow that automatically processes, analyzes, and categorizes incoming emails using AI. It intelligently routes different types of emails to appropriate actions such as creating Jira tasks, Confluence pages, or sending team alerts.

## Features

- **AI-Powered Email Classification**: Uses OpenAI GPT-4 to categorize emails into specific types
- **Automated Task Creation**: Creates Jira tickets for task requests automatically
- **Confluence Integration**: Extracts content from Confluence links and creates analysis pages
- **Policy Alert System**: Sends Microsoft Teams notifications for policy updates
- **Spam Detection**: Automatically moves spam emails to the spam folder
- **Multi-language Support**: Handles Vietnamese and English content

## Email Categories

The workflow categorizes emails into the following types:

### 1. TASK_REQUEST
- **Description**: Emails containing direct work assignments or specific requests
- **Actions**: Creates Jira task with AI-generated summary and context
- **Indicators**: Contains action verbs like "tạo", "làm", "cập nhật", "implement"

### 2. ESTIMATION_REQUEST
- **Description**: Requests for project estimates or time/effort assessments
- **Actions**: Creates Confluence analysis page with task breakdown
- **Indicators**: Contains "báo giá", "estimate", "effort", "timeline"

### 3. CONFLUENCE_LINK_ESTIMATE
- **Description**: Emails with Confluence/wiki links requiring analysis
- **Actions**: Fetches linked content, analyzes it, and creates estimation breakdown
- **Indicators**: Primary content is a link to Confluence, Wiki, Notion, or Jira

### 4. POLICY_UPDATE
- **Description**: Official policy changes or platform announcements
- **Actions**: Sends alert to Microsoft Teams channel
- **Indicators**: From official accounts (noreply@, notifications@, developer@)

### 5. SPAM_MARKETING
- **Description**: Promotional or marketing content
- **Actions**: Moves email to spam folder
- **Indicators**: Sales language, unknown senders, call-to-action buttons

### 6. OTHER
- **Description**: General communication, status updates, meeting notes
- **Actions**: Removes from inbox and marks as read
- **Indicators**: Social messages, team announcements, information sharing

## Workflow Architecture

### Main Components

1. **Email Trigger** (`[GET] - Unread Email`)
   - Polls Gmail every hour at 15 minutes past the hour
   - Filters for unread emails from specific sender

2. **Content Processing**
   - Converts HTML email to Markdown
   - Extracts original email content from forwarded messages
   - Prepares data for AI analysis

3. **AI Analysis Service**
   - Calls sub-workflow `sub-AI-Analysis-Service`
   - Uses GPT-4o for intelligent email classification
   - Returns category, priority, summary, and task breakdown

4. **Decision Router** (`[DECIDE] - Action by Email Category`)
   - Routes emails based on AI classification
   - Triggers appropriate actions for each category

5. **Action Handlers**
   - **Jira Integration**: Creates tasks via `sub-Create-Jira-Task`
   - **Confluence Integration**: Creates analysis pages via `sub-Create-Confluence-Page`
   - **Teams Integration**: Sends policy update alerts
   - **Gmail Management**: Spam filtering and email organization

### Sub-Workflows

The main workflow orchestrates three sub-workflows:

1. **sub-AI-Analysis-Service** (`DrLDQaf54G0ZhJpf`)
   - Handles AI analysis and classification
   - Returns structured JSON with categorization results

2. **sub-Create-Jira-Task** (`DwfZVlGV8BkAy0mU`)
   - Creates Jira tickets with proper formatting
   - Maps AI priorities to Jira priority values

3. **sub-Create-Confluence-Page** (`RijpYfQk5ngFJNpN`)
   - Creates Confluence analysis pages
   - Formats content with Vietnamese headers and structure

## Configuration Requirements

### Credentials Needed

1. **Gmail OAuth2** (`gmailOAuth2`)
   - Required for reading emails and managing labels
   - ID: `YIw7bvsLVAOVl1mk`

2. **OpenAI API** (`openAiApi`)
   - Required for AI email analysis
   - ID: `rvEVzeazfzW6v66O`

3. **Atlassian/Jira API** (`jiraSoftwareCloudApi`)
   - Required for Jira and Confluence integration
   - ID: `vuqHzqXD5jQQXkbq`

### Environment Configuration

- **Confluence Space Key**: `~james` (personal space)
- **Confluence Parent Page ID**: `673022176`
- **Teams Webhook URL**: Pre-configured for policy alerts
- **Gmail Filter**: Currently set to `james@soxes.ch`

## Setup Instructions

### Prerequisites

1. N8N instance with required node packages:
   - `n8n-nodes-base` (core nodes)
   - `@n8n/n8n-nodes-langchain` (AI nodes)

2. Active credentials for:
   - Gmail account
   - OpenAI API key
   - Atlassian Cloud (Jira/Confluence)

### Installation Steps

1. **Import Main Workflow**
   ```bash
   # Import the JSON file into your n8n instance
   ```

2. **Configure Sub-Workflows**
   - Import and configure the three required sub-workflows
   - Ensure workflow IDs match the references in the main workflow

3. **Update Credentials**
   - Configure Gmail OAuth2 authentication
   - Add OpenAI API key
   - Set up Atlassian Cloud credentials

4. **Customize Settings**
   - Update email sender filter in the trigger node
   - Modify Confluence space and parent page settings
   - Configure Teams webhook URL for your organization

5. **Test Configuration**
   - Send test emails of different types
   - Verify AI classification accuracy
   - Check Jira task creation
   - Test Confluence page generation

## Monitoring and Maintenance

### Execution Monitoring

- **Error Workflow**: `TblM55auqwhaZ2F7` handles execution errors
- **Execution Progress**: Saved for debugging and analysis
- **Caller Policy**: Restricted to workflows from same owner

### Performance Considerations

- **Polling Frequency**: Currently set to hourly (configurable)
- **AI Model**: Uses GPT-4o for optimal accuracy
- **Rate Limits**: Consider OpenAI API rate limits for high volume

### Troubleshooting

Common issues and solutions:

1. **AI Classification Errors**
   - Check OpenAI API key validity
   - Verify prompt formatting in analysis service
   - Review email content preprocessing

2. **Jira Integration Issues**
   - Validate Atlassian credentials
   - Check project permissions and issue type configurations
   - Verify priority mapping values

3. **Confluence Integration Problems**
   - Ensure space access permissions
   - Verify parent page ID exists
   - Check page creation permissions

## Usage Examples

### Example 1: Task Request Email
```
Subject: Urgent: Update user authentication system
From: manager@company.com
Body: Please implement two-factor authentication for the user login system. This needs to be completed by Friday.
```
**Result**: Creates Jira task with high priority, detailed description, and deadline context.

### Example 2: Estimation Request
```
Subject: Project estimation needed
From: client@external.com
Body: We need an estimate for developing a mobile app with user management, payment integration, and reporting dashboard.
```
**Result**: Creates Confluence analysis page with AI-generated task breakdown and effort estimation.

### Example 3: Confluence Link
```
Subject: Please review and estimate
From: product@company.com
Body: Please review the requirements at: https://company.atlassian.net/wiki/spaces/PROJ/pages/123456/New-Feature
```
**Result**: Fetches Confluence content, analyzes requirements, creates estimation page with task breakdown.

## Security Considerations

- **Credential Management**: All API keys stored securely in n8n credential system
- **Access Control**: Workflow restricted to same-owner execution
- **Data Privacy**: Email content processed through OpenAI API (consider data policies)
- **Error Handling**: Comprehensive error workflow prevents data loss

## Version History

- **Current Version**: Production-ready with 25 nodes
- **Features**: Multi-category classification, sub-workflow architecture
- **Last Updated**: Based on export timestamp from live system
- **Dependencies**: Requires three sub-workflows for full functionality

## Support and Extensions

### Possible Enhancements

1. **Additional Email Providers**: Support for Outlook, Exchange
2. **Enhanced AI Models**: Integration with other AI providers
3. **Custom Categories**: User-defined email categories
4. **Advanced Filtering**: More sophisticated email filtering rules
5. **Analytics Dashboard**: Workflow performance and classification metrics

### Integration Points

- **CRM Systems**: Extend to create leads/contacts
- **Project Management**: Integration with additional PM tools
- **Communication**: Slack, Discord, other messaging platforms
- **Knowledge Base**: Integration with additional wiki systems

This workflow represents a comprehensive email automation solution that can significantly reduce manual email processing time while ensuring important communications are properly categorized and actioned.