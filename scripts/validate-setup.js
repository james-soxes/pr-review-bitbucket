#!/usr/bin/env node
/**
 * Bitbucket Code Review Assistant - Setup Validation Script
 * 
 * This script validates the N8N workflow JSON and provides setup guidance.
 * 
 * Usage:
 *   node scripts/validate-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Bitbucket Code Review Assistant - Setup Validation\n');

// File paths
const workflowPath = path.join(__dirname, '..', 'bitbucket-code-review-assistant.json');
const packagePath = path.join(__dirname, '..', 'package.json');

// Validation functions
function validateJSON(filePath, description) {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`❌ ${description} not found: ${filePath}`);
      return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    console.log(`✅ ${description} is valid JSON`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} has invalid JSON: ${error.message}`);
    return false;
  }
}

function validateWorkflowStructure() {
  try {
    const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
    
    // Check required workflow properties
    const requiredProps = ['name', 'nodes', 'connections'];
    const missingProps = requiredProps.filter(prop => !workflow[prop]);
    
    if (missingProps.length > 0) {
      console.error(`❌ Workflow missing required properties: ${missingProps.join(', ')}`);
      return false;
    }
    
    // Check for required nodes
    const nodeTypes = workflow.nodes.map(node => node.type);
    const requiredNodeTypes = [
      'n8n-nodes-base.bitbucketTrigger',
      'n8n-nodes-base.code',
      'n8n-nodes-base.switch',
      'n8n-nodes-base.httpRequest'
    ];
    
    const missingNodes = requiredNodeTypes.filter(type => !nodeTypes.includes(type));
    
    if (missingNodes.length > 0) {
      console.error(`❌ Workflow missing required node types: ${missingNodes.join(', ')}`);
      return false;
    }
    
    console.log(`✅ Workflow structure is valid (${workflow.nodes.length} nodes)`);
    return true;
  } catch (error) {
    console.error(`❌ Error validating workflow structure: ${error.message}`);
    return false;
  }
}

function validateCredentials() {
  console.log('\n📋 Required Credentials Checklist:');
  console.log('   □ Bitbucket API credentials (bitbucket-api-credentials)');
  console.log('   □ OpenAI API credentials (openai-api-key)');
  console.log('   □ Environment variables: BITBUCKET_WORKSPACE, BITBUCKET_REPOSITORY');
  console.log('\n   ℹ️  Configure these in your N8N instance before activating the workflow.');
}

function printSetupGuide() {
  console.log('\n📚 Quick Setup Guide:');
  console.log('   1. Import bitbucket-code-review-assistant.json into N8N');
  console.log('   2. Configure Bitbucket App Password with Repositories + Pull requests permissions');
  console.log('   3. Add OpenAI API key with GPT-4o-mini access');
  console.log('   4. Set environment variables for workspace and repository');
  console.log('   5. Configure Bitbucket webhook pointing to N8N trigger URL');
  console.log('   6. Activate workflow and test with a small PR');
  console.log('\n📖 For detailed instructions, see: docs/bitbucket-code-review-setup.md');
}

// Main validation
function main() {
  let allValid = true;
  
  // Validate JSON files
  allValid &= validateJSON(workflowPath, 'Workflow JSON');
  allValid &= validateJSON(packagePath, 'Package JSON');
  
  // Validate workflow structure
  if (fs.existsSync(workflowPath)) {
    allValid &= validateWorkflowStructure();
  }
  
  // Show setup guidance
  validateCredentials();
  printSetupGuide();
  
  // Final result
  console.log('\n' + '='.repeat(60));
  if (allValid) {
    console.log('✅ All validations passed! Ready for N8N import.');
  } else {
    console.log('❌ Some validations failed. Please fix issues before proceeding.');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { validateJSON, validateWorkflowStructure };