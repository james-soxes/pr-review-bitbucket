// ===== REFACTORED N8N CODE NODE - CONFLUENCE PAGE CREATOR =====
// Version: 2.0
// Purpose: Create Confluence pages from email estimation requests
// Author: Refactored for better maintainability and error handling

/**
 * CONFIGURATION - Update these values for your environment
 */
const CONFIG = {
  PAGE_TITLE_PREFIX: "[Estimation] - ",
  DEFAULT_VALUES: {
    summary: 'No summary available',
    priority: 'Not specified', 
    taskBreakdown: 'No breakdown provided',
    originalSender: 'Unknown sender',
    cleanBody: 'No email content available'
  },
  CONFLUENCE: {
    // These will be extracted from input data
    spaceKey: null,
    parentPageId: null
  }
};

/**
 * UTILITY FUNCTIONS
 */

/**
 * Safely escape XML/HTML entities to prevent parsing errors
 * @param {string} unsafe - Raw text that may contain special characters
 * @returns {string} - Escaped text safe for XML/HTML
 */
function escapeXml(unsafe) {
  if (!unsafe || typeof unsafe !== 'string') {
    return unsafe || '';
  }
  
  const escapeMap = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;'
  };
  
  return unsafe.replace(/[<>&'"]/g, char => escapeMap[char]);
}

/**
 * Format text for Confluence display with line breaks
 * @param {string} text - Raw text content
 * @returns {string} - Formatted text with HTML line breaks
 */
function formatTextForConfluence(text) {
  if (!text) return '';
  return escapeXml(String(text)).replace(/\n/g, '<br />');
}

/**
 * Extract and validate input data with fallbacks
 * @param {Object} inputData - Raw input from previous node
 * @returns {Object} - Validated and processed data
 */
function extractInputData(inputData) {
  const data = inputData || {};
  
  return {
    summary: data.summary || CONFIG.DEFAULT_VALUES.summary,
    priority: data.priority || CONFIG.DEFAULT_VALUES.priority,
    taskBreakdown: data.taskBreakdown || CONFIG.DEFAULT_VALUES.taskBreakdown,
    originalSender: data.originalSender || CONFIG.DEFAULT_VALUES.originalSender,
    cleanBody: data.cleanBody || CONFIG.DEFAULT_VALUES.cleanBody,
    spaceKey: data.spaceKey,
    parentId: data.parentId
  };
}

/**
 * Generate the main content structure for the Confluence page
 * @param {Object} processedData - Processed input data
 * @returns {string} - HTML content for Confluence storage format
 */
function generatePageContent(processedData) {
  const sections = [
    generateQuoteRequestSection(processedData),
    generateAiSummarySection(processedData),
    generateTaskBreakdownSection(processedData),
    generateOriginalEmailSection(processedData)
  ];
  
  return sections.join('\n');
}

/**
 * Generate the quote request section
 */
function generateQuoteRequestSection(data) {
  return `
    <h2>Yêu cầu Báo giá từ Email</h2>
    <ul>
        <li><strong>Người gửi gốc:</strong> ${data.originalSender}</li>
        <li><strong>Độ ưu tiên AI đề xuất:</strong> ${data.priority}</li>
    </ul>
    <hr />`;
}

/**
 * Generate the AI summary section
 */
function generateAiSummarySection(data) {
  return `
    <h2>Tóm tắt của AI</h2>
    <p>${data.summary}</p>
    <hr />`;
}

/**
 * Generate the task breakdown section with panel macro
 */
function generateTaskBreakdownSection(data) {
  return `
    <h2>Phân tích &amp; Bóc tách Công việc (AI Đề xuất)</h2>
    <ac:structured-macro ac:name="panel">
        <ac:parameter ac:name="title">Task Breakdown by AI</ac:parameter>
        <ac:rich-text-body>
            <p><em>Ghi chú: Đây là các hạng mục do AI phân tích tự động, cần được review và chỉnh sửa bởi con người.</em></p>
            <p>${data.taskBreakdown}</p>
        </ac:rich-text-body>
    </ac:structured-macro>
    <hr />`;
}

/**
 * Generate the original email section with panel macro
 */
function generateOriginalEmailSection(data) {
  return `
    <h2>Nội dung Email gốc (Đã làm sạch)</h2>
    <ac:structured-macro ac:name="panel">
        <ac:rich-text-body>
            <p>${data.cleanBody}</p>
        </ac:rich-text-body>
    </ac:structured-macro>`;
}

/**
 * Build the complete Confluence API payload
 * @param {Object} processedData - Processed input data
 * @param {string} pageContent - Generated HTML content
 * @returns {Object} - Complete Confluence API payload
 */
function buildConfluencePayload(processedData, pageContent) {
  return {
    type: "page",
    title: `${CONFIG.PAGE_TITLE_PREFIX}${processedData.summary}`,
    space: {
      key: processedData.spaceKey
    },
    ancestors: [
      {
        id: processedData.parentId
      }
    ],
    body: {
      storage: {
        value: pageContent.trim(),
        representation: "storage"
      }
    }
  };
}

/**
 * Add metadata for debugging and tracking
 * @param {Object} payload - Base Confluence payload
 * @param {string} pageContent - Generated content
 * @returns {Object} - Enhanced payload with metadata
 */
function addMetadata(payload, pageContent) {
  return {
    ...payload,
    _metadata: {
      processedAt: new Date().toISOString(),
      version: "2.0",
      dataSource: {
        parseNode: '[PARSE] - AI JSON Response',
        preprocessNode: '[PRE-PROCESS] - Extract Original Email'
      },
      contentLength: pageContent.length,
      nodeId: "confluence-page-creator"
    }
  };
}

/**
 * Create error response payload
 * @param {Error} error - Error object
 * @param {Object} inputData - Original input data for context
 * @returns {Object} - Error response with fallback
 */
function createErrorResponse(error, inputData) {
  const spaceKey = inputData?.spaceKey || 'UNKNOWN';
  
  return {
    error: true,
    message: error.message,
    timestamp: new Date().toISOString(),
    nodeVersion: "2.0",
    fallbackPayload: {
      type: "page",
      title: `${CONFIG.PAGE_TITLE_PREFIX}Error in Processing - ${new Date().toISOString()}`,
      space: { key: spaceKey },
      body: {
        storage: {
          value: `
            <h2>Processing Error</h2>
            <p><strong>Error:</strong> ${escapeXml(error.message)}</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <p><em>Please check the workflow configuration and input data.</em></p>
          `,
          representation: "storage"
        }
      }
    }
  };
}

/**
 * MAIN EXECUTION LOGIC
 */
try {
  // Step 1: Extract and validate input data
  const rawInput = $input.first().json;
  const inputData = extractInputData(rawInput);
  
  // Step 2: Validate required fields
  if (!inputData.spaceKey || !inputData.parentId) {
    throw new Error('Missing required Confluence configuration: spaceKey or parentId');
  }
  
  // Step 3: Process data for Confluence format
  const processedData = {
    summary: inputData.summary,
    originalSender: formatTextForConfluence(inputData.originalSender),
    priority: inputData.priority,
    taskBreakdown: formatTextForConfluence(inputData.taskBreakdown),
    cleanBody: formatTextForConfluence(inputData.cleanBody),
    spaceKey: inputData.spaceKey,
    parentId: inputData.parentId
  };
  
  // Step 4: Generate page content
  const pageContent = generatePageContent(processedData);
  
  // Step 5: Build Confluence API payload
  const confluencePayload = buildConfluencePayload(processedData, pageContent);
  
  // Step 6: Add metadata and return
  const finalPayload = addMetadata(confluencePayload, pageContent);
  
  return [{ json: finalPayload }];
  
} catch (error) {
  // Comprehensive error handling with context
  console.error('Confluence Page Creator Error:', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  
  const errorResponse = createErrorResponse(error, $input.first().json);
  
  return [{ json: errorResponse }];
}

// ===== END OF REFACTORED CODE =====