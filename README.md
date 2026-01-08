# budgetsms-client-js

Modern, type-safe TypeScript/JavaScript client for the [BudgetSMS.net](https://www.budgetsms.net) HTTP API.

> **Note:** This is an **unofficial** client library and is not affiliated with or endorsed by BudgetSMS.net. It is a community-maintained open-source project.

[![npm version](https://img.shields.io/npm/v/budgetsms-client-js.svg)](https://www.npmjs.com/package/budgetsms-client-js)
[![CI](https://github.com/Frozenverse/budgetsms-client-js/workflows/CI/badge.svg)](https://github.com/Frozenverse/budgetsms-client-js/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green.svg)](https://nodejs.org/)
[![npm downloads](https://img.shields.io/npm/dm/budgetsms-client-js.svg)](https://www.npmjs.com/package/budgetsms-client-js)

## Features

- 🎯 **Works with JavaScript & TypeScript** - No TypeScript required!
- 📦 **Dual module support** - ESM and CommonJS
- 🔒 **Type-safe error handling** - Error code enums with helper methods
- 🎨 **Response parsing** - Clean, typed response objects
- 🪶 **Zero dependencies** - Lightweight (22KB) and fast
- ✅ **Fully tested** - 42 tests, 100% coverage
- 📚 **Complete API coverage** - All 7 BudgetSMS endpoints
- 💡 **IntelliSense support** - Autocomplete in VS Code, even in JavaScript
- 🚀 **Node.js 18+** - Uses native fetch (no extra dependencies)

## Installation

```bash
npm install budgetsms-client-js
```

```bash
yarn add budgetsms-client-js
```

```bash
pnpm add budgetsms-client-js
```

## Quick Start

### TypeScript / ESM

```typescript
import { BudgetSMS } from 'budgetsms-client-js';

// Initialize the client
const client = new BudgetSMS({
  username: 'your-username',
  userid: 'your-userid',
  handle: 'your-api-handle'
});

// Send an SMS
const result = await client.sendSMS({
  msg: 'Hello World!',
  from: 'YourApp',
  to: '31612345678'
});

console.log(`SMS sent with ID: ${result.smsId}`);
```

### JavaScript / CommonJS

```javascript
const { BudgetSMS } = require('budgetsms-client-js');

// Initialize the client
const client = new BudgetSMS({
  username: 'your-username',
  userid: 'your-userid',
  handle: 'your-api-handle'
});

// Send an SMS (using .then() or async/await)
client.sendSMS({
  msg: 'Hello World!',
  from: 'YourApp',
  to: '31612345678'
}).then(result => {
  console.log(`SMS sent with ID: ${result.smsId}`);
}).catch(error => {
  console.error('Error:', error.message);
});
```

### JavaScript / ESM (Node.js with "type": "module")

```javascript
import { BudgetSMS } from 'budgetsms-client-js';

const client = new BudgetSMS({
  username: 'your-username',
  userid: 'your-userid',
  handle: 'your-api-handle'
});

const result = await client.sendSMS({
  msg: 'Hello World!',
  from: 'YourApp',
  to: '31612345678'
});

console.log(`SMS sent with ID: ${result.smsId}`);
```

## API Reference

### Initialize Client

```typescript
import { BudgetSMS } from 'budgetsms-client-js';

const client = new BudgetSMS({
  username: 'your-username',    // Your BudgetSMS username
  userid: 'your-userid',        // Your BudgetSMS user ID
  handle: 'your-api-handle',    // Your API handle

  // Optional configuration
  baseUrl: 'https://api.budgetsms.net',  // Custom API base URL
  timeout: 30000                          // Request timeout in ms (default: 30000)
});
```

### Send SMS

Send an SMS message to a recipient.

```typescript
const result = await client.sendSMS({
  msg: 'Your message text',
  from: 'YourApp',           // Sender ID (max 11 alphanumeric or 16 numeric)
  to: '31612345678',         // Recipient phone number (international format, no +)

  // Optional parameters
  customid: 'unique-id-123', // Custom message ID (max 50 chars, must be unique)
  price: true,               // Include price information in response
  mccmnc: true,              // Include operator network information
  credit: true               // Include remaining credit in response
});

console.log(`SMS ID: ${result.smsId}`);

// If price was requested
if (result.price) {
  console.log(`Cost: €${result.price} for ${result.parts} part(s)`);
}

// If mccmnc was requested
if (result.mccMnc) {
  console.log(`Network: ${result.mccMnc}`);
}
```

### Test SMS

Test your SMS implementation without actually sending or consuming credits.

```typescript
const result = await client.testSMS({
  msg: 'Test message',
  from: 'TestApp',
  to: '31612345678'
});

console.log(`Test successful, would get SMS ID: ${result.smsId}`);
```

### Check Credit

Get your remaining account balance.

```typescript
const result = await client.checkCredit();
console.log(`Remaining credit: €${result.credit}`);
```

### Check Operator

Check the operator for a phone number based on its prefix.

> **Note:** This checks the original operator. If a number has been ported to another operator, use `hlr()` instead.

```typescript
const result = await client.checkOperator('31612345678');
console.log(`Operator: ${result.operatorName}`);
console.log(`Network: ${result.mccMnc}`);
console.log(`Cost per SMS: €${result.messageCost}`);
```

### HLR Lookup

Perform an HLR (Home Location Register) lookup to determine the actual current operator, even if the number has been ported.

```typescript
const result = await client.hlr('31612345678');
console.log(`Current operator: ${result.operatorName}`);
console.log(`Network: ${result.mccMnc}`);
```

### Check SMS Status

Check the delivery status of a sent message (Pull DLR).

```typescript
const result = await client.checkSMS('12345678'); // SMS ID from sendSMS()
console.log(`Status: ${result.status}`);

// Use DLRStatus enum for type-safe status checking
import { DLRStatus, DLR_STATUS_MESSAGES } from 'budgetsms-client-js';

if (result.status === DLRStatus.DELIVERED) {
  console.log('Message was delivered!');
} else {
  console.log(`Status: ${DLR_STATUS_MESSAGES[result.status]}`);
}
```

### Get Pricing

Retrieve pricing information for all operators in your account.

```typescript
const pricing = await client.getPricing();

for (const entry of pricing) {
  console.log(`${entry.countryname} - ${entry.operatorname}: €${entry.price}`);
  console.log(`  MCC/MNC: ${entry.mcc}/${entry.mnc}`);
  console.log(`  Last modified: ${entry.last_modified}`);
}
```

## Error Handling

The client uses typed error handling with the `BudgetSMSError` class.

```typescript
import { BudgetSMSError, BudgetSMSErrorCode } from 'budgetsms-client-js';

try {
  await client.sendSMS({
    msg: 'Test',
    from: 'App',
    to: '31612345678'
  });
} catch (error) {
  if (error instanceof BudgetSMSError) {
    console.error(`BudgetSMS Error: ${error.message}`);
    console.error(`Error Code: ${error.code}`);

    // Check specific error conditions
    if (error.isInsufficientCredits()) {
      console.error('Please top up your account!');
    }

    if (error.isAuthenticationError()) {
      console.error('Check your credentials!');
    }

    if (error.isRetryable()) {
      console.error('Temporary error, you can retry');
    }
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Error Codes

All BudgetSMS API error codes are available as an enum:

```typescript
import { BudgetSMSErrorCode, ERROR_MESSAGES } from 'budgetsms-client-js';

// Access error codes
BudgetSMSErrorCode.NOT_ENOUGH_CREDITS        // 1001
BudgetSMSErrorCode.INVALID_CREDENTIALS       // 1002
BudgetSMSErrorCode.ACCOUNT_NOT_ACTIVE        // 1003
// ... and many more

// Get error message for a code
console.log(ERROR_MESSAGES[BudgetSMSErrorCode.NOT_ENOUGH_CREDITS]);
// "Not enough credits to send messages"
```

## DLR Status Codes

Delivery report statuses are available as an enum:

```typescript
import { DLRStatus, DLR_STATUS_MESSAGES } from 'budgetsms-client-js';

// DLR status values
DLRStatus.DELIVERED              // 1 - Message is delivered
DLRStatus.DELIVERY_FAILED        // 3 - Message delivery failed
DLRStatus.EXPIRED                // 5 - Message expired
DLRStatus.SENT_NO_STATUS         // 0 - Message is sent, no status yet
// ... and more

// Get human-readable status message
console.log(DLR_STATUS_MESSAGES[DLRStatus.DELIVERED]);
// "Message is delivered"
```

## Validation Utilities

The package includes validation utilities for common use cases:

```typescript
import { validatePhoneNumber, validateSender, validateMessage } from 'budgetsms-client-js';

// Validate phone number (8-16 digits)
if (!validatePhoneNumber('31612345678')) {
  console.error('Invalid phone number format');
}

// Validate sender ID
// - Alphanumeric: max 11 characters [a-zA-Z0-9]
// - Numeric: max 16 digits
if (!validateSender('MyApp')) {
  console.error('Invalid sender format');
}

// Validate message text (not empty, max 612 chars for 4 SMS parts)
if (!validateMessage('Hello World')) {
  console.error('Invalid message');
}
```

## TypeScript Support

This package is written in TypeScript and provides full type definitions.

```typescript
import type {
  BudgetSMSConfig,
  SendSMSParams,
  SendSMSResponse,
  OperatorResponse,
  PricingEntry,
  // ... and more
} from 'budgetsms-client-js';
```

## Requirements

- Node.js >= 18.0.0 (for native `fetch` support)
- Works with **both JavaScript and TypeScript** projects
- No build step required for JavaScript users

## JavaScript & TypeScript Support

This package is **fully compatible with JavaScript** projects:

- ✅ **JavaScript (CommonJS)**: `require('budgetsms-client-js')`
- ✅ **JavaScript (ESM)**: `import { BudgetSMS } from 'budgetsms-client-js'`
- ✅ **TypeScript**: Full type definitions included
- ✅ **No TypeScript required**: The package ships as compiled JavaScript
- ✅ **IntelliSense support**: Get autocomplete even in JavaScript projects (VS Code, etc.)

### For JavaScript Users

You don't need TypeScript installed to use this package. It's written in TypeScript but **compiled to JavaScript** before publishing. The TypeScript definitions are optional and only provide better editor autocomplete.

```javascript
// Plain JavaScript - works perfectly!
const { BudgetSMS } = require('budgetsms-client-js');

const client = new BudgetSMS({
  username: 'test',
  userid: '123',
  handle: 'abc'
});

// Your editor will still show autocomplete thanks to included .d.ts files
client.sendSMS({ /* autocomplete works here! */ });
```

### For TypeScript Users

Full type safety out of the box:

```typescript
import { BudgetSMS, SendSMSResponse, BudgetSMSError } from 'budgetsms-client-js';

const client = new BudgetSMS({ ... });
const result: SendSMSResponse = await client.sendSMS({ ... });
```

## Module Format Support

This package supports both ESM and CommonJS:

```typescript
// ESM (TypeScript or JavaScript with "type": "module")
import { BudgetSMS } from 'budgetsms-client-js';

// CommonJS (Traditional Node.js)
const { BudgetSMS } = require('budgetsms-client-js');
```

## Examples

Check out the [examples](./examples) directory for complete working examples:

- **[javascript-example.js](./examples/javascript-example.js)** - CommonJS (traditional Node.js)
- **[javascript-esm-example.mjs](./examples/javascript-esm-example.mjs)** - ES Modules
- **[typescript-example.ts](./examples/typescript-example.ts)** - TypeScript with full types

Each example includes:
- Client initialization
- Sending SMS
- Error handling
- Credit checking
- Operator lookup
- Status tracking

## API Documentation

For complete BudgetSMS API documentation, visit:
- [Official BudgetSMS API Documentation](https://www.budgetsms.net/sms-http-api/)

## License

MIT © [Nick Leeman](https://github.com/Frozenverse)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

- 📧 For BudgetSMS API issues: [contact BudgetSMS support](https://www.budgetsms.net/contact/)
- 🐛 For package issues: [GitHub Issues](https://github.com/Frozenverse/budgetsms-client-js/issues)

## Changelog

See [Releases](https://github.com/Frozenverse/budgetsms-client-js/releases) for version history.
