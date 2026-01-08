/**
 * JavaScript Example - ESM
 *
 * This example shows how to use budgetsms-client in a JavaScript
 * project using ES modules (import/export).
 *
 * To run this: node examples/javascript-esm-example.mjs
 */

import { BudgetSMS, BudgetSMSError, DLRStatus } from 'budgetsms-client';

// Initialize the client
const client = new BudgetSMS({
  username: 'your-username',
  userid: 'your-userid',
  handle: 'your-api-handle'
});

// Example 1: Send SMS
async function sendSMS() {
  try {
    const result = await client.sendSMS({
      msg: 'Hello from ESM JavaScript!',
      from: 'MyApp',
      to: '31612345678'
    });

    console.log('✅ SMS sent!');
    console.log('SMS ID:', result.smsId);
    return result.smsId;
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Example 2: Check SMS status
async function checkStatus(smsId) {
  try {
    const result = await client.checkSMS(smsId);

    console.log('📊 SMS Status:', result.status);

    // Check status using enum
    if (result.status === DLRStatus.DELIVERED) {
      console.log('✅ Message delivered!');
    } else if (result.status === DLRStatus.DELIVERY_FAILED) {
      console.log('❌ Delivery failed');
    } else {
      console.log('⏳ Status:', result.status);
    }
  } catch (error) {
    console.error('Error checking status:', error.message);
  }
}

// Example 3: Get account pricing
async function getPricing() {
  try {
    const pricing = await client.getPricing();

    console.log(`📋 Found ${pricing.length} pricing entries`);

    // Show first 5 entries
    pricing.slice(0, 5).forEach(entry => {
      console.log(`${entry.countryname} - ${entry.operatorname}: €${entry.price}`);
    });
  } catch (error) {
    console.error('Error getting pricing:', error.message);
  }
}

// Example 4: Error handling with type checking
async function sendWithErrorHandling() {
  try {
    await client.sendSMS({
      msg: 'Test',
      from: 'App',
      to: '31612345678'
    });
  } catch (error) {
    if (error instanceof BudgetSMSError) {
      // Handle BudgetSMS-specific errors
      console.error('BudgetSMS Error:', error.message);
      console.error('Code:', error.code);

      if (error.isInsufficientCredits()) {
        console.error('💳 Please top up your account');
      } else if (error.isAuthenticationError()) {
        console.error('🔐 Check your credentials');
      } else if (error.isRetryable()) {
        console.error('🔄 Temporary error, please retry');
      }
    } else {
      // Handle other errors (network, etc.)
      console.error('Unexpected error:', error);
    }
  }
}

// Run examples
console.log('🚀 BudgetSMS ESM JavaScript Example\n');

// Uncomment to run:
// const smsId = await sendSMS();
// await checkStatus(smsId);
// await getPricing();
// await sendWithErrorHandling();

console.log('\n✨ Examples completed!');
