/**
 * TypeScript Example
 *
 * This example shows how to use budgetsms-client-js with full TypeScript
 * type safety and autocomplete.
 */

import {
  BudgetSMS,
  BudgetSMSError,
  SendSMSResponse,
  CheckCreditResponse,
  OperatorResponse,
  DLRStatus,
  BudgetSMSErrorCode,
  type SendSMSParams,
  type BudgetSMSConfig
} from 'budgetsms-client-js';

// Type-safe configuration
const config: BudgetSMSConfig = {
  username: 'your-username',
  userid: 'your-userid',
  handle: 'your-api-handle',
  timeout: 30000
};

const client = new BudgetSMS(config);

// Example 1: Send SMS with full type safety
async function sendTypedSMS(): Promise<void> {
  const params: SendSMSParams = {
    msg: 'Hello TypeScript!',
    from: 'MyApp',
    to: '31612345678',
    price: true,
    mccmnc: true
  };

  try {
    const result: SendSMSResponse = await client.sendSMS(params);

    console.log('✅ SMS sent successfully!');
    console.log('SMS ID:', result.smsId);

    // TypeScript knows these properties exist when price: true
    if (result.price !== undefined && result.parts !== undefined) {
      console.log(`Cost: €${result.price} for ${result.parts} part(s)`);
    }

    // TypeScript knows this exists when mccmnc: true
    if (result.mccMnc !== undefined) {
      console.log('Network:', result.mccMnc);
    }
  } catch (error) {
    handleError(error);
  }
}

// Example 2: Type-safe error handling
function handleError(error: unknown): void {
  if (error instanceof BudgetSMSError) {
    console.error('❌ BudgetSMS Error:', error.message);
    console.error('Error Code:', error.code);

    // TypeScript knows the error code enum
    switch (error.code) {
      case BudgetSMSErrorCode.NOT_ENOUGH_CREDITS:
        console.error('💳 Insufficient credits');
        break;
      case BudgetSMSErrorCode.INVALID_CREDENTIALS:
        console.error('🔐 Invalid credentials');
        break;
      case BudgetSMSErrorCode.SMS_TEXT_EMPTY:
        console.error('📝 Message text is empty');
        break;
      default:
        console.error('Other error:', error.code);
    }

    // Helper methods
    if (error.isRetryable()) {
      console.log('🔄 This error is retryable');
    }
  } else if (error instanceof Error) {
    console.error('Unexpected error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}

// Example 3: Check credit with typed response
async function checkBalance(): Promise<number> {
  try {
    const result: CheckCreditResponse = await client.checkCredit();
    console.log(`💰 Credit: €${result.credit}`);
    return result.credit;
  } catch (error) {
    handleError(error);
    return 0;
  }
}

// Example 4: Operator check with type safety
async function checkOperatorInfo(phoneNumber: string): Promise<OperatorResponse | null> {
  try {
    const result: OperatorResponse = await client.checkOperator(phoneNumber);

    console.log('📱 Operator Info:');
    console.log('  Name:', result.operatorName);
    console.log('  MCC/MNC:', result.mccMnc);
    console.log('  Cost:', `€${result.messageCost}`);

    return result;
  } catch (error) {
    handleError(error);
    return null;
  }
}

// Example 5: Status check with enum
async function checkMessageStatus(smsId: string): Promise<void> {
  try {
    const result = await client.checkSMS(smsId);

    // TypeScript provides autocomplete for DLRStatus enum
    switch (result.status) {
      case DLRStatus.DELIVERED:
        console.log('✅ Message delivered');
        break;
      case DLRStatus.DELIVERY_FAILED:
        console.log('❌ Delivery failed');
        break;
      case DLRStatus.SENT_NO_STATUS:
        console.log('⏳ Sent, awaiting status');
        break;
      case DLRStatus.EXPIRED:
        console.log('⌛ Message expired');
        break;
      default:
        console.log('📊 Status:', result.status);
    }
  } catch (error) {
    handleError(error);
  }
}

// Example 6: Using type inference
async function sendAndTrack(): Promise<void> {
  try {
    // TypeScript infers the return type
    const sendResult = await client.sendSMS({
      msg: 'Tracked message',
      from: 'App',
      to: '31612345678'
    });

    // result.smsId is automatically typed as string
    const smsId: string = sendResult.smsId;

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Check status
    await checkMessageStatus(smsId);
  } catch (error) {
    handleError(error);
  }
}

// Example 7: Async/await with proper typing
async function runExamples(): Promise<void> {
  console.log('🚀 BudgetSMS TypeScript Example\n');

  try {
    // All these calls are fully typed
    await sendTypedSMS();
    const credit = await checkBalance();

    if (credit > 0) {
      await checkOperatorInfo('31612345678');
    }

    // await sendAndTrack();
  } catch (error) {
    console.error('Failed to run examples:', error);
  }

  console.log('\n✨ Examples completed!');
}

// Run examples
// runExamples();

// Export for use in other modules
export { client, sendTypedSMS, checkBalance, checkOperatorInfo };
