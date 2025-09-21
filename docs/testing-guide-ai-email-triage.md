# 🧪 Testing Guide - AI Email Triage Assistant

## Tổng quan

Tài liệu này cung cấp hướng dẫn chi tiết để test workflow **AI Email Triage Assistant** một cách thủ công và tự động.

## 📋 Test Cases Chi tiết

### 1. Test TASK_REQUEST Flow

**Mục tiêu**: Xác minh workflow tạo Jira task từ email yêu cầu công việc

**Bước thực hiện**:
1. Soạn email với nội dung:
   ```
   Subject: [TASK] Cần cập nhật API documentation
   Body: Xin chào, 
   
   Tôi cần team kỹ thuật cập nhật API documentation cho module user authentication. 
   Deadline: cuối tuần này.
   
   Chi tiết:
   - Cập nhật endpoint /login
   - Thêm examples cho response codes
   - Review security requirements
   
   Cảm ơn!
   ```
2. Gửi email từ james@soxes.ch tới hệ thống
3. Chờ workflow trigger (tối đa 1 giờ hoặc trigger manually)

**Kết quả mong đợi**:
- Email được AI phân loại là `TASK_REQUEST`
- Jira task được tạo với:
  - Summary: `[EMAIL TASK] - [AI Summary]`
  - Description chứa context từ email
  - Priority mapping chính xác
- Email được đánh dấu đã đọc

**Tiêu chí Pass/Fail**:
- ✅ Pass: Jira task được tạo trong 5 phút với đầy đủ thông tin
- ❌ Fail: Không tạo task hoặc thiếu thông tin

### 2. Test ESTIMATION_REQUEST Flow

**Mục tiêu**: Xác minh workflow tạo Confluence page cho yêu cầu estimate

**Bước thực hiện**:
1. Soạn email với nội dung:
   ```
   Subject: Estimate cho dự án Mobile App
   Body: Chào team,
   
   Cần báo giá cho dự án mobile app với requirements sau:
   
   - User authentication với social login
   - Product catalog với search/filter
   - Shopping cart và checkout
   - Push notifications
   - Offline mode cơ bản
   - Admin dashboard
   
   Timeline mong muốn: 3 tháng
   Budget range: 50-80k USD
   
   Cảm ơn!
   ```
2. Gửi email và chờ xử lý

**Kết quả mong đợi**:
- AI phân loại là `ESTIMATION_REQUEST`
- Confluence page được tạo với:
  - Title: `[Estimation] - [AI Summary]`
  - Structured content với AI task breakdown
  - Thông tin người gửi và context
- Email được mark as read

### 3. Test CONFLUENCE_LINK_ESTIMATE Flow

**Mục tiêu**: Test việc phân tích Confluence page để estimate

**Bước thực hiện**:
1. Soạn email chứa link Confluence:
   ```
   Subject: Estimate cho project này
   Body: Xin chào,
   
   Bạn có thể review và estimate cho project này không:
   https://soxes.atlassian.net/wiki/spaces/~james/pages/673022176/Project+Specifications
   
   Cần có estimate trước thứ 6.
   
   Thanks!
   ```
2. Gửi và theo dõi workflow

**Kết quả mong đợi**:
- AI phân loại đúng là `CONFLUENCE_LINK_ESTIMATE`
- System fetch được Confluence page content
- AI tạo được task breakdown từ specs
- Personal analysis page được tạo trong space ~james

### 4. Test Network Disconnect During AI Processing

**Mục tiêu**: Kiểm tra retry logic khi mất kết nối

**Bước thực hiện**:
1. Gửi email bất kỳ để trigger workflow
2. Trong khi workflow đang chạy, ngắt mạng tại thời điểm AI processing
3. Reconnect sau 10-15 giây
4. Quan sát execution log

**Kết quả mong đợi**:
- AI node retry 2 lần (maxTries: 2)
- Mỗi retry cách nhau 5 giây (waitBetweenTries: 5000)
- Workflow hoàn tất thành công sau khi network phục hồi
- Hoặc fail gracefully nếu hết retries

### 5. Test Error Handling & Spam Classification

**Bước thực hiện**:
1. Gửi email marketing/spam:
   ```
   Subject: 🎉 SPECIAL OFFER - Buy now and save 50%!
   Body: Limited time offer! Click here to claim your discount...
   ```
2. Gửi email với format lỗi hoặc nội dung không hợp lệ

**Kết quả mong đợi**:
- Spam email được chuyển vào thư mục Spam
- Email lỗi được xử lý bởi Global Error Handler
- Error notification gửi qua MS Teams
- Workflow không crash

## 🔍 Monitoring & Metrics

### Execution Monitoring

1. **n8n Dashboard**:
   - Truy cập execution history
   - Check execution time (< 2 phút cho mỗi email)
   - Monitor error rates

2. **AI Cost Tracking**:
   ```javascript
   // Monitor trong execution logs
   OpenAI API calls per day
   Token usage: Input/Output tokens
   Daily cost estimate
   ```

3. **Success Metrics**:
   - **Uptime**: > 99%
   - **Error Rate**: < 1% 
   - **Processing Time**: < 2 phút/email
   - **AI Accuracy**: > 90% classification accuracy

### Weekly Health Check

**Thực hiện mỗi thứ 2**:
1. Review execution logs tuần trước
2. Check AI cost spending
3. Verify credential expiry dates
4. Test 1 sample email từ mỗi category
5. Update documentation nếu có thay đổi

## 🚨 Troubleshooting Common Issues

### Issue 1: Email không được xử lý
**Possible Causes**:
- Gmail trigger bị disable
- Credential hết hạn
- Email từ sender không đúng filter

**Solutions**:
- Check workflow active status
- Refresh Gmail OAuth2 credentials
- Verify email sender filter

### Issue 2: AI Classification sai
**Possible Causes**:
- Prompt cần optimize
- Email content ambiguous
- Model overloaded

**Solutions**:
- Review prompt template
- Add more examples to training
- Switch to GPT-4 nếu đang dùng 3.5

### Issue 3: Jira/Confluence creation fail
**Possible Causes**:
- API credentials expired
- Permission issues
- Network connectivity

**Solutions**:
- Refresh Atlassian credentials
- Check space/project permissions
- Test API endpoint manually

## 📊 Test Results Template

```markdown
## Test Execution Report - [Date]

### Test Summary
- **Total Tests**: 5
- **Passed**: X
- **Failed**: X
- **Skipped**: X

### Detailed Results
| Test Case | Status | Duration | Notes |
|-----------|--------|----------|--------|
| TASK_REQUEST Flow | ✅/❌ | Xms | |
| ESTIMATION_REQUEST Flow | ✅/❌ | Xms | |
| CONFLUENCE_LINK Flow | ✅/❌ | Xms | |
| Network Disconnect Test | ✅/❌ | Xms | |
| Error Handling Test | ✅/❌ | Xms | |

### Issues Found
1. [Issue description] - [Priority] - [Status]

### Recommendations
1. [Action item]
2. [Improvement suggestion]
```

## 🎯 Next Steps

1. **Automate Testing**: Tạo Postman collection cho API testing
2. **Performance Testing**: Load test với 100+ emails
3. **Integration Testing**: End-to-end test với real data
4. **User Acceptance Testing**: Train team sử dụng workflow

---

**Cập nhật cuối**: 2025-09-21  
**Version**: 1.0  
**Owner**: AI Email Triage Assistant Team