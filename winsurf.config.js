// Winsurf Configuration for N8N Workflow Generator Expert System
module.exports = {
  extends: ['@winsurf/recommended'],
  
  // Environment settings
  env: {
    node: true,
    es2021: true
  },

  // Parser options
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },

  // Global variables
  globals: {
    n8n: 'readonly',
    workflow: 'writable'
  },

  // Rule configurations
  rules: {
    // N8N Workflow Validation Rules
    'n8n/workflow-structure': 'error',
    'n8n/node-connections': 'error',
    'n8n/credential-security': 'error',
    'n8n/json-validation': 'error',
    
    // Node Structure Rules
    'n8n/required-node-fields': 'error',
    'n8n/valid-node-types': 'error',
    'n8n/proper-positioning': 'warn',
    
    // Connection Integrity
    'n8n/connection-mapping': 'error',
    'n8n/execution-order': 'warn',
    'n8n/orphaned-nodes': 'error',
    
    // OpenAI Compatibility
    'n8n/openai-complete-usage': 'error',
    'n8n/openai-model-validation': 'error',
    'n8n/openai-parameter-check': 'error',
    
    // Documentation Requirements
    'n8n/sticky-notes': 'warn',
    'n8n/workflow-description': 'warn',
    'n8n/node-naming': 'warn',
    
    // Error Handling
    'n8n/error-workflow': 'error',
    'n8n/try-catch-patterns': 'error',
    'n8n/fallback-mechanisms': 'warn',
    
    // Security Rules
    'n8n/no-hardcoded-credentials': 'error',
    'n8n/secure-parameters': 'error',
    'n8n/credential-references': 'error',
    
    // Performance Rules
    'n8n/efficient-nodes': 'warn',
    'n8n/proper-batching': 'warn',
    'n8n/rate-limiting': 'warn',
    
    // Best Practices
    'n8n/descriptive-names': 'warn',
    'n8n/logical-structure': 'warn',
    'n8n/consistent-naming': 'warn'
  },

  // Custom rule settings
  settings: {
    'n8n': {
      // Minimum N8N version compatibility
      version: '1.0.0',
      
      // Node type validation
      validNodeTypes: [
        'n8n-nodes-base.start',
        'n8n-nodes-base.webhook',
        'n8n-nodes-base.httpRequest',
        'n8n-nodes-base.code',
        'n8n-nodes-base.openAi',
        'n8n-nodes-base.stickyNote',
        'n8n-nodes-base.errorTrigger',
        'n8n-nodes-base.noOp'
      ],
      
      // Required workflow fields
      requiredWorkflowFields: [
        'name',
        'nodes',
        'connections',
        'active',
        'settings'
      ],
      
      // Security settings
      security: {
        allowHardcodedCredentials: false,
        requireCredentialReferences: true,
        validateSensitiveData: true
      },
      
      // Performance settings
      performance: {
        maxNodes: 50,
        maxConnections: 100,
        warnOnComplexity: true
      }
    }
  },

  // Override rules for specific files
  overrides: [
    {
      files: ['*.n8n.json'],
      rules: {
        'json/*': 'error',
        'n8n/*': 'error'
      }
    },
    {
      files: ['workflows/*.json'],
      rules: {
        'n8n/workflow-structure': 'error',
        'n8n/documentation': 'error'
      }
    }
  ],

  // Plugin configurations
  plugins: [
    'n8n-workflow-validator',
    'json-schema-validator'
  ],

  // Ignore patterns
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '*.min.js',
    'temp/'
  ],

  // Custom validation functions
  customValidators: {
    // Validate N8N workflow JSON structure
    validateWorkflowStructure: function(workflow) {
      const required = ['name', 'nodes', 'connections'];
      return required.every(field => workflow.hasOwnProperty(field));
    },
    
    // Validate node connections
    validateConnections: function(workflow) {
      const nodeIds = workflow.nodes.map(node => node.id);
      const connections = workflow.connections;
      
      for (const sourceId in connections) {
        if (!nodeIds.includes(sourceId)) {
          return false;
        }
        
        for (const outputIndex in connections[sourceId]) {
          const outputs = connections[sourceId][outputIndex];
          for (const connection of outputs) {
            if (!nodeIds.includes(connection.node)) {
              return false;
            }
          }
        }
      }
      return true;
    },
    
    // Validate OpenAI node configuration
    validateOpenAINode: function(node) {
      if (node.type === 'n8n-nodes-base.openAi') {
        // Check for 'complete' instead of 'completion'
        if (node.parameters.resource === 'completion') {
          return false;
        }
        
        // Validate required parameters
        const required = ['model', 'prompt'];
        return required.every(param => 
          node.parameters.hasOwnProperty(param)
        );
      }
      return true;
    }
  },

  // Reporting configuration
  reporting: {
    format: 'json',
    outputFile: 'winsurf-n8n-report.json',
    includeWarnings: true,
    includeErrors: true,
    verbose: true
  },

  // Auto-fix configuration
  autofix: {
    enabled: true,
    rules: [
      'n8n/node-naming',
      'n8n/proper-positioning',
      'json/formatting'
    ]
  },

  // Integration settings
  integration: {
    // Git hooks
    gitHooks: {
      'pre-commit': ['winsurf lint --fix'],
      'pre-push': ['winsurf lint']
    },
    
    // CI/CD integration
    ci: {
      failOnError: true,
      failOnWarning: false,
      generateReport: true
    },
    
    // IDE integration
    ide: {
      realTimeValidation: true,
      showInlineErrors: true,
      autoComplete: true
    }
  }
};
