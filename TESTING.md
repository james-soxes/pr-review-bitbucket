# 🧪 Testing Guide - AI Email Triage Assistant

## Overview
This document provides comprehensive test cases for the **AI Email Triage Assistant** workflow. The tests cover all major execution paths, error scenarios, and edge cases to ensure robust production operation.

## Test Environment Setup

### Prerequisites
- n8n instance with workflow deployed and active
- Gmail account: james@soxes.ch with OAuth2 configured
- API credentials configured:
  - OpenAI API key (GPT-4o access)
  - Jira API credentials
  - Confluence API credentials
  - MS Teams webhook URL
- Sub-workflows deployed:
  - AI Analysis Service (DrLDQaf54G0ZhJpf)
  - Create Confluence Page
  - Create Jira Task
  - Global Error Handler (DbzKrYofpCNCrr50)

### Test Data Preparation
Create test emails with specific formats for different scenarios (see individual test cases).

---

## Test Cases

### TC01 - Successful TASK_REQUEST Processing
**Category**: Happy Path  
**Priority**: High  
**Estimated Duration**: 3-5 minutes

#### Pre-conditions
- Workflow is active and running
- All API credentials are valid
- Jira project is accessible

#### Test Steps
1. **Send test email** to james@soxes.ch with subject: `[TEST] New Feature Development Request`
2. **Email body**:
   ```
   Hi James,
   
   We need to implement a new user dashboard feature for our application.
   
   Requirements:
   - User can view personal statistics
   - Export data to PDF
   - Mobile responsive design
   
   Priority: High
   Deadline: End of next week
   
   Please create a task for this.
   
   Best regards,
   Test User
   ```
3. **Wait for workflow execution** (trigger runs every hour at :15)
4. **Check execution logs** in n8n interface

#### Expected Results
- ✅ Email is processed successfully
- ✅ AI Analysis Service returns category: `TASK_REQUEST`
- ✅ New Jira task is created with:
  - Summary containing key information
  - Description with AI-enhanced details
  - Priority set appropriately
- ✅ Email is marked as read in Gmail
- ✅ No errors in execution log
- ✅ Total execution time < 60 seconds

#### Verification Steps
1. Check Jira project for new task
2. Verify email is marked as read in Gmail
3. Review n8n execution logs for success status

---

### TC02 - Successful ESTIMATION_REQUEST Processing
**Category**: Happy Path  
**Priority**: High  
**Estimated Duration**: 4-6 minutes

#### Pre-conditions
- Workflow is active
- Confluence space is accessible
- AI Analysis Service is functioning

#### Test Steps
1. **Send estimation email** with subject: `[TEST] Project Estimation Request`
2. **Email body**:
   ```
   Hello James,
   
   Could you please provide an estimation for the following project:
   
   Project: Customer Portal Redesign
   
   Scope:
   - UI/UX overhaul of existing portal
   - Integration with new authentication system
   - Mobile app companion
   - Admin dashboard enhancements
   - Performance optimization
   
   Timeline: We're planning to start in Q4 2024
   Budget: Up to $150K
   
   Please prepare a detailed breakdown.
   
   Thanks,
   Project Manager
   ```
3. **Monitor workflow execution**

#### Expected Results
- ✅ AI categorizes as `ESTIMATION_REQUEST`
- ✅ Confluence page is created with:
  - Project title as page title
  - Structured breakdown of components
  - AI-generated time estimates
  - Risk assessment section
- ✅ Page is created in correct Confluence space
- ✅ Email marked as read
- ✅ Execution completes without errors

---

### TC03 - CONFLUENCE_LINK_ESTIMATE Processing
**Category**: Happy Path  
**Priority**: Medium  
**Estimated Duration**: 5-7 minutes

#### Pre-conditions
- Valid Confluence page exists and is accessible
- AI Analysis Service can process Confluence content

#### Test Steps
1. **Create a test Confluence page** with project specifications
2. **Send email** with subject: `[TEST] Please estimate this Confluence spec`
3. **Email body**:
   ```
   Hi James,
   
   Please review this Confluence specification and provide your estimation:
   
   https://your-confluence.atlassian.net/wiki/spaces/PROJ/pages/123456789/Mobile+App+Requirements
   
   We need this by Friday for the client meeting.
   
   Let me know if you need any clarifications.
   
   Best,
   Business Analyst
   ```
4. **Wait for processing**

#### Expected Results
- ✅ AI identifies category as `CONFLUENCE_LINK_ESTIMATE`
- ✅ Page ID extracted correctly from URL
- ✅ Confluence content fetched successfully
- ✅ Content converted to Markdown
- ✅ AI analysis generates estimation breakdown
- ✅ New personal analysis page created
- ✅ Email marked as read

---

### TC04 - POLICY_UPDATE Alert Processing
**Category**: Happy Path  
**Priority**: Medium  
**Estimated Duration**: 2-3 minutes

#### Pre-conditions
- MS Teams webhook is configured and active
- Workflow can access Teams channel

#### Test Steps
1. **Send policy update email** with subject: `[TEST] Important: New Security Policy Update`
2. **Email body**:
   ```
   IMPORTANT POLICY UPDATE
   
   Effective immediately, all employees must:
   
   1. Use 2FA for all company accounts
   2. Change passwords every 90 days
   3. Complete security training by end of month
   
   Non-compliance will result in account suspension.
   
   Questions? Contact IT Security.
   
   HR Department
   ```

#### Expected Results
- ✅ AI categorizes as `POLICY_UPDATE`
- ✅ MS Teams notification sent with:
  - Alert formatting (urgent styling)
  - Policy summary
  - Action required information
- ✅ Email marked as read
- ✅ Teams message appears in designated channel

---

### TC05 - SPAM_MARKETING Detection and Handling
**Category**: Happy Path  
**Priority**: Medium  
**Estimated Duration**: 2-3 minutes

#### Pre-conditions
- Gmail API has permission to modify labels
- Spam folder/label exists

#### Test Steps
1. **Send marketing email** with subject: `[TEST] 🎉 50% OFF! Limited Time Offer - Buy Now!`
2. **Email body**:
   ```
   🔥 MEGA SALE ALERT! 🔥
   
   Don't miss out on our BIGGEST sale of the year!
   
   ✨ 50% OFF everything
   ✨ FREE shipping worldwide
   ✨ 24-hour flash sale only!
   
   Click here now: [SUSPICIOUS LINK]
   
   Act fast - only 100 items left!
   
   Unsubscribe: [link] | Terms: [link]
   ```

#### Expected Results
- ✅ AI detects category as `SPAM_MARKETING`
- ✅ Email automatically moved to Spam folder
- ✅ No further processing occurs
- ✅ Continue-on-error prevents workflow failure
- ✅ Execution completes successfully

---

### TC06 - AI Service Failure Recovery
**Category**: Error Handling  
**Priority**: High  
**Estimated Duration**: 8-10 minutes

#### Pre-conditions
- Temporarily disable OpenAI API key or set invalid key
- Email ready to send

#### Test Steps
1. **Disable OpenAI API** (set invalid key in credentials)
2. **Send test email** (any category type)
3. **Monitor execution** and retry behavior
4. **After 2 failed retries**, restore valid API key
5. **Wait for next scheduled run** or trigger manually

#### Expected Results
- ✅ First AI call fails with authentication error
- ✅ Workflow retries 2 times with 5-second intervals
- ✅ After 2 failures, error handler triggers
- ✅ Error notification sent via MS Teams
- ✅ Email remains unread for future processing
- ✅ Workflow doesn't crash or stop
- ✅ After API restoration, email processes successfully

---

### TC07 - Malformed Email Content Handling
**Category**: Error Handling  
**Priority**: Medium  
**Estimated Duration**: 3-4 minutes

#### Pre-conditions
- Workflow is active
- AI service is working

#### Test Steps
1. **Send email with problematic content**:
   - Subject: `[TEST] ����� Invalid UTF-8 Characters �����`
   - Body containing:
     ```
     Hello James,
     
     Here's some content with issues:
     - Extremely long text: [Insert 5000+ character string]
     - Special characters: <>{}[]|�����
     - HTML fragments: <div><span>unclosed tags
     - Binary-looking content: 01010101010101010101
     ```

#### Expected Results
- ✅ HTML to Markdown conversion handles special characters
- ✅ AI analysis processes despite formatting issues
- ✅ Classification still occurs (likely as "OTHER")
- ✅ Error handling prevents workflow crash
- ✅ Email gets processed or gracefully skipped
- ✅ Detailed error logged for review

---

### TC08 - Jira Service Unavailable
**Category**: Error Handling  
**Priority**: High  
**Estimated Duration**: 5-7 minutes

#### Pre-conditions
- Temporarily disable Jira API access (invalid credentials or network block)
- TASK_REQUEST email ready

#### Test Steps
1. **Disable Jira API access** (change credentials to invalid)
2. **Send TASK_REQUEST email** (use TC01 format)
3. **Monitor execution behavior**
4. **Check error handling response**

#### Expected Results
- ✅ Email processing starts normally
- ✅ AI analysis completes successfully
- ✅ Switch routes to TASK_REQUEST branch
- ✅ Jira API call fails with clear error
- ✅ Error handler captures failure
- ✅ Notification sent about Jira unavailability
- ✅ Email remains unread for retry later
- ✅ Workflow continues to run for future emails

---

### TC09 - Confluence Service Timeout
**Category**: Error Handling  
**Priority**: Medium  
**Estimated Duration**: 6-8 minutes

#### Pre-conditions
- Confluence API is very slow or timing out
- CONFLUENCE_LINK_ESTIMATE email ready

#### Test Steps
1. **Configure Confluence timeout** (if possible, or use a slow/broken URL)
2. **Send Confluence estimation email** with slow-loading page URL
3. **Monitor timeout behavior**

#### Expected Results
- ✅ Page fetching attempts with appropriate timeout
- ✅ Graceful failure when timeout occurs
- ✅ Fallback error message generated
- ✅ User notification about content unavailability
- ✅ Email marked for manual review
- ✅ Workflow doesn't hang indefinitely

---

### TC10 - Email with No Clear Category
**Category**: Edge Case  
**Priority**: Medium  
**Estimated Duration**: 3-4 minutes

#### Pre-conditions
- AI service is working normally

#### Test Steps
1. **Send ambiguous email** with subject: `[TEST] Random Thoughts`
2. **Email body**:
   ```
   Hi James,
   
   Just wanted to say hello and see how you're doing.
   
   Weather is nice today. Had coffee this morning.
   Random thought: Why do we call it "rush hour" when nobody's moving?
   
   Also, my cat learned a new trick.
   
   Anyway, hope you have a great day!
   
   Cheers,
   Random Friend
   ```

#### Expected Results
- ✅ AI analysis completes
- ✅ Category classified as "OTHER"
- ✅ Switch routes to default/OTHER branch
- ✅ Email marked as read (basic processing)
- ✅ No additional actions taken
- ✅ Execution completes successfully

---

## Performance Testing

### PT01 - High Volume Email Processing
**Objective**: Test workflow performance under load

#### Test Steps
1. **Send 10 emails** of different types within 5 minutes
2. **Monitor execution queue** and processing times
3. **Check resource usage** in n8n

#### Expected Results
- ✅ All emails processed within 30 minutes
- ✅ No execution failures due to overload
- ✅ Memory and CPU usage remain stable
- ✅ AI API rate limits respected

### PT02 - Large Email Content Processing
**Objective**: Test handling of emails with large attachments or content

#### Test Steps
1. **Send email with large text content** (>50KB)
2. **Include multiple attachments** if supported
3. **Monitor processing time**

#### Expected Results
- ✅ Large content processed successfully
- ✅ Processing time scales reasonably
- ✅ No timeout errors
- ✅ Memory usage remains acceptable

---

## Monitoring and Maintenance Testing

### MT01 - Daily Execution Health Check
**Objective**: Verify workflow runs reliably over time

#### Daily Verification (Automated if possible)
1. **Check execution logs** for past 24 hours
2. **Verify error rate** < 1%
3. **Monitor AI API costs** and usage
4. **Check credential expiration dates**

### MT02 - Weekly Performance Review
**Objective**: Track performance trends

#### Weekly Tasks
1. **Analyze execution times** and identify slowdowns
2. **Review error patterns** and common failures
3. **Check API quota usage** for all services
4. **Verify all sub-workflows** are functioning

---

## Test Execution Checklist

### Before Testing
- [ ] All credentials are valid and not expired
- [ ] Sub-workflows are deployed and active
- [ ] Test email account has appropriate permissions
- [ ] n8n instance has sufficient resources
- [ ] Backup current workflow configuration

### During Testing
- [ ] Record execution IDs for each test
- [ ] Take screenshots of key results
- [ ] Document any unexpected behavior
- [ ] Monitor system resources and performance

### After Testing
- [ ] Clean up test data (emails, Jira tasks, Confluence pages)
- [ ] Document test results and findings
- [ ] Update workflow if bugs discovered
- [ ] Schedule next testing cycle

---

## Success Criteria

### Overall Workflow Health
- **Uptime**: >99% (less than 7 hours downtime per month)
- **Error Rate**: <1% of all executions
- **Processing Time**: Average <60 seconds per email
- **AI Accuracy**: >95% correct categorization

### Integration Health
- **Jira Integration**: >99% success rate for task creation
- **Confluence Integration**: >95% success rate for page creation
- **MS Teams Notifications**: >99% delivery success
- **Gmail Operations**: >99% success rate for read/move operations

---

## Troubleshooting Guide

### Common Issues and Solutions

#### Issue: AI Analysis Service Returns Error 429 (Rate Limited)
**Solution**: 
- Implement exponential backoff
- Check API quota and upgrade if necessary
- Distribute load across multiple time periods

#### Issue: Gmail API Authentication Expires
**Solution**:
- Set up monitoring for credential expiration
- Implement automatic token refresh
- Document manual renewal process

#### Issue: Jira Task Creation Fails with Field Validation Error
**Solution**:
- Review Jira project configuration and required fields
- Update task creation template
- Implement field validation before API call

#### Issue: Confluence Page Creation Results in Permission Error
**Solution**:
- Verify API user has appropriate space permissions
- Check space key configuration
- Test with manual API calls using Postman

---

## Test Data Cleanup

### After Each Test Session
1. **Delete test Jira tasks** created during testing
2. **Remove test Confluence pages** if not needed
3. **Clear test emails** from Gmail (move to test folder)
4. **Reset any modified workflow settings**

### Weekly Cleanup
1. **Archive old execution logs** if storage is limited
2. **Clean up test credentials** that are no longer needed
3. **Update test data templates** based on new requirements

---

## Reporting

### Test Execution Report Template
```markdown
## Test Execution Report - [Date]

### Summary
- Total test cases executed: X
- Passed: X
- Failed: X  
- Skipped: X

### Failed Test Cases
[List any failures with details]

### Performance Metrics
- Average execution time: X seconds
- Peak memory usage: X MB
- API calls made: X

### Recommendations
[Any improvements or fixes needed]
```

---

*This testing guide should be updated regularly as the workflow evolves and new features are added.*