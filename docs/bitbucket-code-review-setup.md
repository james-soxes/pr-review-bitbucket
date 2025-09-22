# 🔍 Bitbucket AI Code Review Assistant - Setup Guide

## 📋 Overview

**Automation thứ 2** trong Q2 roadmap theo "Pragmatic Guru Track" - tập trung vào **quick win** và **immediate value**.

### 🎯 Goals
- **Primary**: Tự động tóm tắt thay đổi cho PR nhỏ (<200 LoC)
- **Secondary**: Cảnh báo và khuyến khích chia nhỏ PR lớn
- **Business Impact**: Tiết kiệm 2-3 giờ/tuần cho team lead, cải thiện quality review

---

## 🚀 Phase 1: Basic Setup (4 tuần)

### Week 1-2: Foundation ✅
- [x] Bitbucket webhook integration
- [x] PR size calculation logic
- [x] Basic routing (Small vs Large PR)

### Week 3-4: AI Integration 🔄
- [x] OpenAI GPT-4o-mini for diff summarization
- [x] Professional warning system
- [ ] Deploy và test với real PRs

---

## 📦 Prerequisites

### 1. n8n Instance
- **Cloud**: n8n.cloud (recommended for quick start)
- **Self-hosted**: Docker với public webhook URL

### 2. Bitbucket Access
- **Repository**: Admin hoặc Write access
- **App Password**: Repositories Read + Write để post comments

### 3. OpenAI API
- **API Key**: GPT-4o-mini access (cost: ~$1-2/month cho team nhỏ)
- **Model**: `gpt-4o-mini` (cost-effective, good quality)

---

## ⚙️ Step-by-Step Setup

### Step 1: Import Workflow vào n8n

```bash
# Download workflow JSON
curl -o bitbucket-code-review-assistant.json \
https://raw.githubusercontent.com/james-soxes/n8n-automation-suite/main/workflows/main-workflows/bitbucket-code-review-assistant.json

# Import trong n8n UI:
# 1. Go to Workflows → Import from file
# 2. Select downloaded JSON file
# 3. Click Import
```

### Step 2: Configure Bitbucket Credentials

#### 2a. Tạo App Password
1. Đi vào **Bitbucket Settings** → **Personal Bitbucket settings**
2. **App passwords** → **Create app password**
3. **Label**: `n8n-code-review-bot`
4. **Permissions**:
   - ✅ **Repositories**: Read, Write
   - ✅ **Pull requests**: Read, Write
5. Copy password (chỉ hiện 1 lần!)

#### 2b. Setup Credentials trong n8n
1. **Credentials** → **Add credential** → **Bitbucket API**
2. **Name**: `bitbucket-api-credentials`
3. **Username**: Your Bitbucket username
4. **App Password**: Paste từ step 2a
5. **Save**

### Step 3: Configure Environment Variables

Trong n8n **Settings** → **Environment variables**:

```bash
# Required Variables
BITBUCKET_WORKSPACE=your-workspace-name
BITBUCKET_REPOSITORY=your-repo-name

# Example:
BITBUCKET_WORKSPACE=soxes-team
BITBUCKET_REPOSITORY=web-application
```

### Step 4: Setup OpenAI Credentials

1. **Credentials** → **Add credential** → **OpenAI**
2. **Name**: `openai-api-key`
3. **API Key**: Your OpenAI API key (sk-...)
4. **Save**

### Step 5: Configure Webhook trong Bitbucket

#### 5a. Get Webhook URL từ n8n
1. Mở workflow trong n8n
2. Click vào **"🎯 Bitbucket PR Trigger"** node
3. Copy **Webhook URL** (looks like: `https://your-n8n.app/webhook/...`)

#### 5b. Add Webhook trong Bitbucket Repository
1. Đi vào **Repository Settings** → **Webhooks**
2. **Add webhook**:
   - **Title**: `n8n-code-review-webhook`
   - **URL**: Paste URL từ step 5a
   - **Status**: Active ✅
   - **Triggers**:
     - ✅ Pull Request → Created
     - ✅ Pull Request → Updated
3. **Save**

### Step 6: Test Setup

#### 6a. Activate Workflow
1. Trong n8n workflow editor
2. Toggle **Active** switch ✅
3. Verify "Listening for events"

#### 6b. Create Test PR
```bash
# Create simple test branch
git checkout -b test/pr-size-check
echo "console.log('Small PR test');" > test-file.js
git add test-file.js
git commit -m "Test: Small PR for bot verification"
git push origin test/pr-size-check

# Create PR trong Bitbucket UI
# Title: "[TEST] Verify Code Review Bot - Small PR"
```

#### 6c. Verify Results
- **n8n**: Check execution logs → should see successful run
- **Bitbucket**: PR should have AI summary comment within 30 seconds
- **Console**: Check logs for Lines of Code calculation

---

## 🔍 Understanding the Logic

### PR Size Classification

```javascript
// Logic trong "📊 Extract PR Info" node
const totalLinesChanged = additions + deletions;
const sizeCategory = totalLinesChanged < 200 ? 'SMALL' : 'LARGE';
```

### AI Summary (Small PRs)
- **Trigger**: PR < 200 LoC
- **Process**: 
  1. Get diff từ Bitbucket API
  2. Send to GPT-4o-mini với structured prompt
  3. Format response thành professional comment
  4. Post comment với mention

### Warning System (Large PRs)
- **Trigger**: PR >= 200 LoC
- **Process**: 
  1. Generate professional warning message
  2. Include suggestions for breaking down PR
  3. Tag PR author
  4. Post cảnh báo comment

---

## 📊 Expected Results

### For Small PRs (<200 LoC)
```markdown
🤖 **AI Code Review Summary**

**Pull Request**: Add user profile validation
**Author**: jane.developer
**Lines Changed**: +45/-12 (57 total)
**Branch**: feature/user-validation → main

**📋 Summary of Changes:**
- **🔧 Validation**: Added email format validation for user profiles
- **📝 Error Handling**: Implemented proper error messages for invalid inputs  
- **⚡ Impact**: Improves user experience và prevents invalid data entry

---
*This summary was generated automatically by AI Code Review Assistant 🚀*

**Next Steps**: Please review the changes and ensure all tests are passing before merging.

*💡 Pro tip: Smaller PRs (< 200 LoC) are easier to review and less prone to bugs!*
```

### For Large PRs (>=200 LoC)
```markdown
⚠️ **PR Exceeds Size Threshold**

Hi @john.developer! 👋

Pull Request này có **347 dòng code thay đổi** (298 additions, 49 deletions), vượt quá ngưỡng khuyến nghị của team (200 LoC).

**🔍 Tại sao điều này quan trọng?**
- PR lớn khó review và dễ bỏ sót lỗi
- Tăng thời gian merge và conflict risk
- Khó rollback nếu có vấn đề

**💡 Đề nghị:**
Xem xét chia nhỏ PR này thành các phần độc lập:
- Tách refactor khỏi feature mới
- Chia theo module/component riêng biệt
- Tạo separate PR cho config changes

**📊 Thống kê PR:**
- **Title**: Complete user authentication system
- **Branch**: feature/auth-system → main
- **Created**: 22/09/2025

*Tin nhắn này được tạo tự động bởi Code Review Bot 🤖*
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. "No pull request data found in webhook"
**Solution**: 
- Check Bitbucket webhook configuration
- Verify triggers are set correctly
- Test webhook URL manually

#### 2. "Authentication failed - Bitbucket API"
**Solution**:
- Regenerate App Password
- Check username spelling
- Verify repository permissions

#### 3. "OpenAI API call failed"
**Solution**:
- Check API key validity
- Verify billing and limits
- Check model availability (gpt-4o-mini)

#### 4. "Webhook not triggering"
**Solution**:
```bash
# Test webhook manually
curl -X POST "https://your-n8n.app/webhook/..." \
  -H "Content-Type: application/json" \
  -d '{"test": "manual trigger"}'
```

### Debug Steps
1. **n8n Execution log**: Check từng node execution
2. **Bitbucket webhook log**: Verify delivery attempts
3. **Console logs**: Check JavaScript debug outputs

---

## 💡 Cost Analysis

### OpenAI API Costs (estimated)
- **Model**: GPT-4o-mini ($0.15/1M input tokens, $0.60/1M output tokens)
- **Per PR**: ~500 input tokens + 100 output tokens = $0.0001 per small PR
- **Monthly** (50 small PRs): ~$0.005 ≈ $0.01/month
- **Very cost-effective!** 💰

### Time Savings
- **Before**: 5-10 minutes per PR review
- **After**: 2-3 minutes per PR review
- **Team of 5 developers**: 10-15 hours/month saved
- **ROI**: $300-500 value vs $1-2 cost ⚡

---

## 🔄 Next Steps (Phase 2)

### Week 5-8: Advanced Features
- [ ] **Inline Code Review**: Specific line comments
- [ ] **Google Sheets Integration**: Issue tracking
- [ ] **Weekly Reports**: Automation metrics
- [ ] **Team Best Practices**: Custom rules integration

### Future Enhancements
- [ ] GitLab/GitHub versions
- [ ] Security vulnerability detection
- [ ] Code quality metrics
- [ ] Integration với JIRA/Linear

---

## 📈 Success Metrics

### Week 1-4 Goals:
- [ ] **Uptime**: >95% webhook response
- [ ] **Accuracy**: AI summaries helpful in >80% cases  
- [ ] **Adoption**: Team uses comments for review guidance
- [ ] **Efficiency**: Average PR review time reduced by 30%

### Long-term Goals:
- [ ] **PR Size**: Average LoC per PR reduced by 25%
- [ ] **Quality**: Bugs caught pre-merge increased
- [ ] **Team Satisfaction**: Positive feedback from developers

---

## 🤝 Support & Feedback

### Quick Support
- **Documentation**: Check this guide first
- **Logs**: Always check n8n execution logs
- **Test**: Create small test PRs to verify

### Feedback Loop
- **Week 2**: Team feedback on AI summary quality
- **Week 4**: Metrics review and adjustments
- **Month 1**: Full retrospective and next phase planning

---

*This automation là part của "Pragmatic Guru Track" - focusing on immediate value và practical solutions! 🚀*