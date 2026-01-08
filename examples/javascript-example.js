/**
 * JavaScript Example - CommonJS
 *
 * This example shows how to use budgetsms-client-js in a plain JavaScript
 * Node.js project (no TypeScript required).
 */

const { BudgetSMS, BudgetSMSError } = require('budgetsms-client-js');

// Initialize the client with your credentials
const client = new BudgetSMS({
  username: 'your-username',
  userid: 'your-userid',
  handle: 'your-api-handle'
});

// Example 1: Send an SMS
async function sendMessage() {
  try {
    const result = await client.sendSMS({
      msg: 'Hello from JavaScript!',
      from: 'MyApp',
      to: '31612345678',
      price: true,  // Get price info
      mccmnc: true  // Get network info
    });

    console.log('✅ SMS sent successfully!');
    console.log('SMS ID:', result.smsId);

    if (result.price) {
      console.log(`Cost: €${result.price} for ${result.parts} part(s)`);
    }

    if (result.mccMnc) {
      console.log('Network:', result.mccMnc);
    }
  } catch (error) {
    if (error instanceof BudgetSMSError) {
      console.error('❌ BudgetSMS Error:', error.message);
      console.error('Error Code:', error.code);

      // Check specific error types
      if (error.isInsufficientCredits()) {
        console.error('Please top up your account!');
      }
    } else {
      console.error('❌ Unexpected error:', error);
    }
  }
}

// Example 2: Check account credit
async function checkBalance() {
  try {
    const result = await client.checkCredit();
    console.log(`💰 Remaining credit: €${result.credit}`);
  } catch (error) {
    console.error('Error checking credit:', error.message);
  }
}

// Example 3: Check operator for a number
async function checkOperator() {
  try {
    const result = await client.checkOperator('31612345678');
    console.log('📱 Operator:', result.operatorName);
    console.log('Network:', result.mccMnc);
    console.log(`Cost per SMS: €${result.messageCost}`);
  } catch (error) {
    console.error('Error checking operator:', error.message);
  }
}

// Example 4: Using promises (.then/.catch style)
function sendMessageWithPromises() {
  client.sendSMS({
    msg: 'Hello World',
    from: 'App',
    to: '31612345678'
  })
    .then(result => {
      console.log('SMS sent with ID:', result.smsId);
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
}

// Run examples
(async () => {
  console.log('🚀 BudgetSMS JavaScript Example\n');

  // Uncomment the examples you want to run:

  // await sendMessage();
  // await checkBalance();
  // await checkOperator();
  // sendMessageWithPromises();

  console.log('\n✨ Examples completed!');
})();
