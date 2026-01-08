import { DLRStatus } from './constants';

/**
 * Authentication credentials for BudgetSMS API
 */
export interface BudgetSMSCredentials {
  /** Your BudgetSMS username */
  username: string;
  /** Your BudgetSMS userid (numeric) */
  userid: string;
  /** Your API handle (unique identifier) */
  handle: string;
}

/**
 * Parameters for sending an SMS message
 */
export interface SendSMSParams {
  /** The SMS message text (UTF-8 encoded, max 612 characters recommended) */
  msg: string;
  /** Sender ID (alphanumeric max 11 chars, or numeric max 16 digits) */
  from: string;
  /** Receiver phone number in international format (no +, no spaces) */
  to: string;
  /** Optional custom message ID (alphanumeric, max 50 chars, must be unique) */
  customid?: string;
  /** Request price information in response (default: false) */
  price?: boolean;
  /** Request MCC/MNC information in response (default: false) */
  mccmnc?: boolean;
  /** Show remaining credit in response (default: false) */
  credit?: boolean;
}

/**
 * Parameters for test SMS (same as SendSMSParams)
 * Test SMS simulates sending without actually sending or reducing credit
 */
export type TestSMSParams = SendSMSParams;

/**
 * Response from sending an SMS
 */
export interface SendSMSResponse {
  /** Whether the SMS was successfully submitted */
  success: true;
  /** The SMS message ID assigned by BudgetSMS */
  smsId: string;
  /** Price per SMS part (if price parameter was set to true) */
  price?: number;
  /** Number of SMS parts (if price parameter was set to true) */
  parts?: number;
  /** Mobile Country Code + Mobile Network Code (if mccmnc parameter was set to true) */
  mccMnc?: string;
  /** Remaining account credit (if credit parameter was set to true) */
  credit?: number;
}

/**
 * Response from test SMS (same as SendSMSResponse)
 */
export type TestSMSResponse = SendSMSResponse;

/**
 * Response from checking account credit
 */
export interface CheckCreditResponse {
  /** Whether the check was successful */
  success: true;
  /** Remaining credit amount */
  credit: number;
}

/**
 * Response from checking operator or HLR lookup
 */
export interface OperatorResponse {
  /** Whether the check was successful */
  success: true;
  /** Mobile Country Code + Mobile Network Code combined (e.g., "20416") */
  mccMnc: string;
  /** Name of the mobile operator */
  operatorName: string;
  /** Cost per SMS message to this operator */
  messageCost: number;
}

/**
 * Response from HLR lookup (same structure as OperatorResponse)
 */
export type HLRResponse = OperatorResponse;

/**
 * Response from checking SMS status
 */
export interface SMSStatusResponse {
  /** Whether the check was successful */
  success: true;
  /** The SMS message ID */
  smsId: string;
  /** Current delivery status */
  status: DLRStatus;
}

/**
 * Single pricing entry for an operator
 */
export interface PricingEntry {
  /** Country prefix (e.g., "31" for Netherlands) */
  countryprefix: string;
  /** Country name */
  countryname: string;
  /** Mobile Country Code */
  mcc: string;
  /** Operator name */
  operatorname: string;
  /** Mobile Network Code */
  mnc: string;
  /** Price per SMS part in euro */
  price: string;
  /** Old price before the change */
  old_price: string;
  /** Last modified date (GMT+1) */
  last_modified: string;
}

/**
 * Response from getting account pricing
 * Returns a JSON array of pricing entries
 */
export type GetPricingResponse = PricingEntry[];

/**
 * Configuration options for BudgetSMS client
 */
export interface BudgetSMSConfig extends BudgetSMSCredentials {
  /** Custom base URL (default: https://api.budgetsms.net) */
  baseUrl?: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
}

/**
 * Internal parameters for API requests
 */
export interface APIRequestParams {
  [key: string]: string | number | boolean | undefined;
}
