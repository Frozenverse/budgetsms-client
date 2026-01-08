import { BudgetSMSError } from './errors';
import { BudgetSMSErrorCode, DLRStatus } from './constants';
import type {
  APIRequestParams,
  SendSMSResponse,
  CheckCreditResponse,
  OperatorResponse,
  SMSStatusResponse,
  GetPricingResponse,
} from './types';

/**
 * Build a query string from parameters with proper UTF-8 URL encoding
 * @param params - Object containing query parameters
 * @returns URL-encoded query string
 */
export function buildQueryString(params: APIRequestParams): string {
  const pairs: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      // Convert booleans to 1/0 as expected by the API
      const stringValue = typeof value === 'boolean' ? (value ? '1' : '0') : String(value);
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(stringValue)}`);
    }
  }

  return pairs.join('&');
}

/**
 * Parse a basic API response (OK/ERR format)
 * @param response - Raw response text from API
 * @returns Parsed response data or throws BudgetSMSError
 */
export function parseResponse(response: string): string {
  const trimmed = response.trim();

  // Check for error response
  if (trimmed.startsWith('ERR ')) {
    const errorCode = parseInt(trimmed.substring(4), 10);
    if (isNaN(errorCode)) {
      throw new Error(`Invalid error response format: ${trimmed}`);
    }
    throw new BudgetSMSError(errorCode as BudgetSMSErrorCode);
  }

  // Check for success response
  if (trimmed.startsWith('OK ')) {
    return trimmed.substring(3).trim();
  }

  if (trimmed === 'OK') {
    return '';
  }

  throw new Error(`Unexpected API response format: ${trimmed}`);
}

/**
 * Parse Send SMS response with optional price and mccmnc data
 * Format: "OK smsId [price parts] [mccMnc]"
 * @param response - Raw response text from API
 * @param includePrice - Whether price info was requested
 * @param includeMccMnc - Whether mccmnc info was requested
 * @param includeCredit - Whether credit info was requested
 * @returns Parsed SendSMSResponse object
 */
export function parseSendSMSResponse(
  response: string,
  includePrice?: boolean,
  includeMccMnc?: boolean,
  includeCredit?: boolean
): SendSMSResponse {
  const data = parseResponse(response);
  const parts = data.split(/\s+/);

  if (parts.length === 0) {
    throw new Error('Invalid send SMS response: no SMS ID found');
  }

  const result: SendSMSResponse = {
    success: true,
    smsId: parts[0],
  };

  let index = 1;

  // Parse price and parts if requested
  if (includePrice && parts.length > index + 1) {
    result.price = parseFloat(parts[index]);
    result.parts = parseInt(parts[index + 1], 10);
    index += 2;
  }

  // Parse mccMnc if requested
  if (includeMccMnc && parts.length > index) {
    result.mccMnc = parts[index];
    index += 1;
  }

  // Parse credit if requested
  if (includeCredit && parts.length > index) {
    result.credit = parseFloat(parts[index]);
  }

  return result;
}

/**
 * Parse check credit response
 * Format: "OK credit"
 * @param response - Raw response text from API
 * @returns Parsed CheckCreditResponse object
 */
export function parseCheckCreditResponse(response: string): CheckCreditResponse {
  const data = parseResponse(response);
  const credit = parseFloat(data);

  if (isNaN(credit)) {
    throw new Error(`Invalid credit response: ${data}`);
  }

  return {
    success: true,
    credit,
  };
}

/**
 * Parse operator or HLR response
 * Format: "OK:mccMnc:operatorName:messageCost"
 * @param response - Raw response text from API
 * @returns Parsed OperatorResponse object
 */
export function parseOperatorResponse(response: string): OperatorResponse {
  const data = parseResponse(response);
  const parts = data.split(':');

  if (parts.length < 3) {
    throw new Error(`Invalid operator response format: ${data}`);
  }

  return {
    success: true,
    mccMnc: parts[0],
    operatorName: parts[1],
    messageCost: parseFloat(parts[2]),
  };
}

/**
 * Parse SMS status check response
 * Format: "OK status"
 * @param response - Raw response text from API
 * @param smsId - The SMS ID that was checked
 * @returns Parsed SMSStatusResponse object
 */
export function parseSMSStatusResponse(response: string, smsId: string): SMSStatusResponse {
  const data = parseResponse(response);
  const status = parseInt(data, 10);

  if (isNaN(status)) {
    throw new Error(`Invalid status response: ${data}`);
  }

  return {
    success: true,
    smsId,
    status: status as DLRStatus,
  };
}

/**
 * Parse pricing response (JSON format)
 * @param response - Raw JSON response from API
 * @returns Parsed GetPricingResponse array
 */
export function parsePricingResponse(response: string): GetPricingResponse {
  // Check for error response first
  if (response.trim().startsWith('ERR ')) {
    parseResponse(response); // This will throw the appropriate error
  }

  try {
    const pricing = JSON.parse(response);
    if (!Array.isArray(pricing)) {
      throw new Error('Pricing response is not an array');
    }
    return pricing;
  } catch (error) {
    if (error instanceof BudgetSMSError) {
      throw error;
    }
    throw new Error(`Failed to parse pricing response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate phone number format (basic MSISDN validation)
 * @param phoneNumber - Phone number to validate
 * @returns true if valid, false otherwise
 */
export function validatePhoneNumber(phoneNumber: string): boolean {
  // Must be numeric and between 8-16 digits
  return /^\d{8,16}$/.test(phoneNumber);
}

/**
 * Validate sender ID format
 * @param sender - Sender ID to validate
 * @returns true if valid, false otherwise
 */
export function validateSender(sender: string): boolean {
  // Alphanumeric: max 11 characters [a-zA-Z0-9]
  if (/^[a-zA-Z0-9]{1,11}$/.test(sender)) {
    return true;
  }

  // Numeric: max 16 digits
  if (/^\d{1,16}$/.test(sender)) {
    return true;
  }

  return false;
}

/**
 * Validate message text
 * @param message - Message text to validate
 * @returns true if valid, false otherwise
 */
export function validateMessage(message: string): boolean {
  // Must not be empty and should be reasonable length (max 612 chars for 4 SMS parts)
  return message.length > 0 && message.length <= 612;
}
