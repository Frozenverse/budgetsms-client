# Examples

This directory contains practical examples showing how to use `budgetsms-client-js` in different JavaScript/TypeScript environments.

## Available Examples

### 1. JavaScript (CommonJS) - `javascript-example.js`

Traditional Node.js with `require()` syntax.

**Run:**
```bash
node examples/javascript-example.js
```

**Best for:**
- Node.js projects without "type": "module"
- Traditional server-side JavaScript
- Projects using CommonJS

### 2. JavaScript (ESM) - `javascript-esm-example.mjs`

Modern JavaScript using ES modules with `import` syntax.

**Run:**
```bash
node examples/javascript-esm-example.mjs
```

**Best for:**
- Modern Node.js projects
- Projects with "type": "module" in package.json
- Frontend build tools (Webpack, Vite, etc.)

### 3. TypeScript - `typescript-example.ts`

Full TypeScript with type safety and autocomplete.

**Run:**
```bash
# First compile (or use ts-node)
npx ts-node examples/typescript-example.ts

# Or compile and run
npx tsc examples/typescript-example.ts
node examples/typescript-example.js
```

**Best for:**
- TypeScript projects
- Maximum type safety
- Large codebases requiring maintainability

## What Each Example Shows

All examples demonstrate:

- ✅ Client initialization
- ✅ Sending SMS messages
- ✅ Error handling
- ✅ Checking account credit
- ✅ Operator lookup
- ✅ Status checking
- ✅ Working with responses

## Before Running

1. **Install the package:**
   ```bash
   npm install budgetsms-client-js
   ```

2. **Get your credentials:**
   - Sign up at [BudgetSMS.net](https://www.budgetsms.net)
   - Get your username, userid, and API handle
   - Replace placeholder values in the examples

3. **Update credentials:**
   ```javascript
   const client = new BudgetSMS({
     username: 'your-username',  // Replace this
     userid: 'your-userid',      // Replace this
     handle: 'your-api-handle'   // Replace this
   });
   ```

4. **Uncomment the functions you want to test:**
   ```javascript
   // Uncomment these lines:
   // await sendMessage();
   // await checkBalance();
   ```

## Quick Comparison

| Feature | JavaScript (CJS) | JavaScript (ESM) | TypeScript |
|---------|-----------------|------------------|------------|
| Import syntax | `require()` | `import` | `import` |
| Type safety | ❌ Runtime only | ❌ Runtime only | ✅ Compile time |
| Autocomplete | ✅ Via .d.ts | ✅ Via .d.ts | ✅ Full IntelliSense |
| Build step | ❌ No | ❌ No | ✅ Yes (tsc) |
| Node.js version | 18+ | 18+ | 18+ |
| Best for | Legacy projects | Modern projects | Large projects |

## Notes

- **TypeScript not required**: JavaScript examples work without any TypeScript installation
- **Autocomplete works**: Even in JavaScript, your editor will show autocomplete thanks to included type definitions
- **Same API**: All examples use the exact same API - choose based on your project setup
- **Test mode**: Use `client.testSMS()` instead of `client.sendSMS()` to test without sending real SMS

## Getting Help

- 📚 [Full API Documentation](../README.md)
- 🐛 [Report Issues](https://github.com/Frozenverse/budgetsms-client-js/issues)
- 💬 [Ask Questions](https://github.com/Frozenverse/budgetsms-client-js/discussions)
