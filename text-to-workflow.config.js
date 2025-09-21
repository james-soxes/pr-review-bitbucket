// Text-to-Workflow Configuration for N8N Expert System
const { v4: uuidv4 } = require('uuid');

module.exports = {
  // Text analysis configuration
  textAnalysis: {
    // Keywords for identifying different workflow components
    triggerKeywords: ['when', 'if', 'trigger', 'start', 'schedule', 'webhook', 'email', 'form'],
    actionKeywords: ['send', 'create', 'update', 'delete', 'fetch', 'process', 'transform', 'notify'],
    conditionKeywords: ['if', 'when', 'condition', 'filter', 'check', 'validate'],
    dataOpKeywords: ['transform', 'map', 'merge', 'split', 'aggregate', 'format'],
    
    // Node type mappings
    nodeMapping: {
      triggers: {
        'schedule': 'n8n-nodes-base.cron',
        'webhook': 'n8n-nodes-base.webhook',
        'email': 'n8n-nodes-base.emailTrigger',
        'form': 'n8n-nodes-base.formTrigger',
        'manual': 'n8n-nodes-base.manualTrigger'
      },
      actions: {
        'send_email': 'n8n-nodes-base.emailSend',
        'http_request': 'n8n-nodes-base.httpRequest',
        'database': 'n8n-nodes-base.postgres',
        'slack': 'n8n-nodes-base.slack',
        'discord': 'n8n-nodes-base.discord',
        'openai': 'n8n-nodes-base.openAi',
        'code': 'n8n-nodes-base.code'
      },
      conditions: {
        'condition': 'n8n-nodes-base.if',
        'filter': 'n8n-nodes-base.filter',
        'switch': 'n8n-nodes-base.switch'
      }
    }
  },

  // Workflow generation settings
  workflowGeneration: {
    // Default workflow structure
    defaultStructure: {
      name: '',
      nodes: [],
      connections: {},
      active: false,
      settings: {
        executionOrder: 'v1'
      },
      tags: ['generated', 'text-description']
    },
    
    // Node positioning
    positioning: {
      startPosition: [250, 300],
      horizontalSpacing: 400,
      verticalSpacing: 200,
      layoutPattern: 'left-to-right'
    },
    
    // Node ID generation
    generateNodeId: () => uuidv4(),
    
    // Node naming conventions
    namingRules: {
      maxLength: 50,
      format: 'descriptive',
      pattern: /^[A-Z][a-zA-Z0-9\s-_]*$/
    }
  },

  // Node-specific configurations
  nodeConfigurations: {
    openai: {
      defaultParameters: {
        resource: 'complete',
        model: 'gpt-3.5-turbo',
        maxTokens: 1000,
        temperature: 0.7
      },
      requiredFields: ['model', 'prompt'],
      credentialType: 'openAiApi'
    },
    
    webhook: {
      defaultParameters: {
        httpMethod: 'POST',
        path: '/webhook',
        responseMode: 'onReceived'
      },
      requiredFields: ['httpMethod', 'path']
    },
    
    httpRequest: {
      defaultParameters: {
        requestMethod: 'GET',
        timeout: 10000,
        followRedirect: true
      },
      requiredFields: ['url', 'requestMethod']
    },
    
    code: {
      defaultParameters: {
        language: 'javascript',
        mode: 'runOnceForAllItems'
      },
      template: `// Process the input data
const items = $input.all();

// Your code here
const processedItems = items.map(item => {
  return {
    json: {
      // Transform your data
      ...item.json
    }
  };
});

return processedItems;`
    },
    
    stickyNote: {
      defaultParameters: {
        height: 160,
        width: 240
      },
      colors: {
        workflow_start: '#FFD700',
        decision_point: '#FF6B6B',
        api_call: '#4ECDC4',
        data_transform: '#45B7D1',
        error_handling: '#FFA07A'
      }
    }
  },

  // Documentation generation
  documentation: {
    stickyNoteTemplates: {
      workflowStart: (purpose) => `🚀 WORKFLOW START\n\nPurpose: ${purpose}\n\nThis workflow will automatically execute when triggered.`,
      
      decisionPoint: (condition) => `🔀 DECISION POINT\n\nCondition: ${condition}\n\nThe workflow branches based on this condition.`,
      
      apiCall: (service, action) => `🌐 API CALL\n\nService: ${service}\nAction: ${action}\n\nConnecting to external service.`,
      
      dataTransform: (operation) => `🔄 DATA TRANSFORMATION\n\nOperation: ${operation}\n\nProcessing and transforming data.`,
      
      errorHandling: (scenario) => `⚠️ ERROR HANDLING\n\nScenario: ${scenario}\n\nHandles errors gracefully.`
    },
    
    workflowDescription: (purpose, trigger, outcome) => 
      `This workflow ${purpose}. It is triggered ${trigger} and results in ${outcome}.`
  },

  // Validation rules
  validation: {
    preGeneration: [
      'parseTextDescription',
      'identifyComponents',
      'mapBusinessLogic',
      'planErrorHandling'
    ],
    
    postGeneration: [
      'validateJsonSyntax',
      'checkNodeIdUniqueness',
      'verifyConnectionIntegrity',
      'ensureAllNodesConnected',
      'validateCredentialReferences',
      'checkMissingParameters'
    ],
    
    completeness: [
      'allActionsImplemented',
      'errorHandlingIncluded',
      'documentationComplete',
      'executionReady'
    ]
  },

  // Error handling patterns
  errorHandling: {
    patterns: {
      apiFailure: {
        nodeType: 'n8n-nodes-base.noOp',
        parameters: {
          notice: 'API call failed - continuing with default values'
        }
      },
      
      dataValidation: {
        nodeType: 'n8n-nodes-base.if',
        parameters: {
          conditions: {
            string: [
              {
                value1: '={{$json.data}}',
                operation: 'isNotEmpty'
              }
            ]
          }
        }
      },
      
      timeout: {
        nodeType: 'n8n-nodes-base.httpRequest',
        parameters: {
          timeout: 30000,
          continueOnFail: true
        }
      }
    },
    
    notifications: {
      email: 'n8n-nodes-base.emailSend',
      slack: 'n8n-nodes-base.slack',
      webhook: 'n8n-nodes-base.httpRequest'
    }
  },

  // Output formatting
  outputFormatting: {
    jsonIndentation: 2,
    propertyOrder: ['name', 'nodes', 'connections', 'active', 'settings', 'tags'],
    stringQuotes: 'double',
    trailingCommas: false
  },

  // Quality assurance
  qualityAssurance: {
    minimumNodes: 2, // At least trigger + one action
    maximumNodes: 50,
    requiredDocumentation: true,
    errorHandlingRequired: true,
    credentialValidation: true
  },

  // Advanced patterns
  advancedPatterns: {
    aiAgent: {
      memoryNode: 'n8n-nodes-base.set',
      toolNodes: ['n8n-nodes-base.httpRequest', 'n8n-nodes-base.code'],
      responseFormatting: 'n8n-nodes-base.set'
    },
    
    parallelProcessing: {
      splitNode: 'n8n-nodes-base.splitInBatches',
      mergeNode: 'n8n-nodes-base.merge',
      maxParallel: 5
    },
    
    conditionalBranching: {
      switchNode: 'n8n-nodes-base.switch',
      ifNode: 'n8n-nodes-base.if',
      mergeNode: 'n8n-nodes-base.merge'
    }
  },

  // Helper functions
  helpers: {
    // Generate workflow name from description
    generateWorkflowName: (description) => {
      const words = description.split(' ').slice(0, 5);
      return words.map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ') + ' Workflow';
    },
    
    // Extract main action from description
    extractMainAction: (description) => {
      const actionWords = ['send', 'create', 'update', 'delete', 'process', 'transform'];
      const words = description.toLowerCase().split(' ');
      return actionWords.find(action => words.includes(action)) || 'process';
    },
    
    // Identify trigger type from description
    identifyTrigger: (description) => {
      const triggerPatterns = {
        'schedule': /every|daily|hourly|weekly|monthly/i,
        'webhook': /webhook|api|http|post|receive/i,
        'email': /email|mail|message/i,
        'manual': /manual|button|click|start/i
      };
      
      for (const [type, pattern] of Object.entries(triggerPatterns)) {
        if (pattern.test(description)) {
          return type;
        }
      }
      return 'manual';
    },
    
    // Generate sticky note content
    generateStickyNote: (type, context) => {
      const templates = module.exports.documentation.stickyNoteTemplates;
      switch (type) {
        case 'start':
          return templates.workflowStart(context.purpose);
        case 'decision':
          return templates.decisionPoint(context.condition);
        case 'api':
          return templates.apiCall(context.service, context.action);
        case 'transform':
          return templates.dataTransform(context.operation);
        case 'error':
          return templates.errorHandling(context.scenario);
        default:
          return `📝 ${type.toUpperCase()}\n\n${context.description || 'Additional workflow step'}`;
      }
    }
  }
};
