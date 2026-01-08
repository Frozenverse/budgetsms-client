/**
 * BudgetSMS.js - Modern TypeScript client for BudgetSMS.net HTTP API
 *
 * @packageDocumentation
 */

// Main client class
export { BudgetSMS } from './client';

// Types
export type {
  BudgetSMSCredentials,
  BudgetSMSConfig,
  SendSMSParams,
  TestSMSParams,
  SendSMSResponse,
  TestSMSResponse,
  CheckCreditResponse,
  OperatorResponse,
  HLRResponse,
  SMSStatusResponse,
  PricingEntry,
  GetPricingResponse,
} from './types';

// Constants and enums
export {
  API_BASE,
  ENDPOINTS,
  BudgetSMSErrorCode,
  DLRStatus,
  ERROR_MESSAGES,
  DLR_STATUS_MESSAGES,
} from './constants';

// Error class
export { BudgetSMSError } from './errors';

// Utilities (exported for advanced use cases)
export {
  validatePhoneNumber,
  validateSender,
  validateMessage,
} from './utils';
