import { API_BASE, ENDPOINTS } from './constants';
import type {
  BudgetSMSConfig,
  SendSMSParams,
  TestSMSParams,
  SendSMSResponse,
  TestSMSResponse,
  CheckCreditResponse,
  OperatorResponse,
  HLRResponse,
  SMSStatusResponse,
  GetPricingResponse,
  APIRequestParams,
} from './types';
import {
  buildQueryString,
  parseSendSMSResponse,
  parseCheckCreditResponse,
  parseOperatorResponse,
  parseSMSStatusResponse,
  parsePricingResponse,
} from './utils';

/**
 * BudgetSMS API Client
 *
 * A modern, type-safe client for the BudgetSMS.net HTTP API.
 * Supports all API endpoints with proper error handling and response parsing.
 *
 * @example
 * ```typescript
 * const client = new BudgetSMS({
 *   username: 'your-username',
 *   userid: 'your-userid',
 *   handle: 'your-api-handle'
 * });
 *
 * // Send an SMS
 * const result = await client.sendSMS({
 *   msg: 'Hello World!',
 *   from: 'YourApp',
 *   to: '31612345678'
 * });
 * ```
 */
export class BudgetSMS {
  private readonly username: string;
  private readonly userid: string;
  private readonly handle: string;
  private readonly baseUrl: string;
  private readonly timeout: number;

  /**
   * Create a new BudgetSMS client
   * @param config - Configuration object with credentials and optional settings
   */
  constructor(config: BudgetSMSConfig) {
    this.username = config.username;
    this.userid = config.userid;
    this.handle = config.handle;
    this.baseUrl = config.baseUrl || API_BASE;
    this.timeout = config.timeout || 30000;
  }

  /**
   * Make an HTTP GET request to the API
   * @param endpoint - API endpoint path
   * @param params - Query parameters
   * @returns Response text
   */
  private async request(endpoint: string, params: APIRequestParams = {}): Promise<string> {
    const queryString = buildQueryString(params);
    const url = `${this.baseUrl}${endpoint}?${queryString}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Get base authentication parameters
   */
  private getAuthParams(): APIRequestParams {
    return {
      username: this.username,
      userid: this.userid,
      handle: this.handle,
    };
  }

  /**
   * Send an SMS message
   *
   * @param params - SMS parameters
   * @returns Promise resolving to SendSMSResponse
   * @throws {BudgetSMSError} If the API returns an error
   *
   * @example
   * ```typescript
   * const result = await client.sendSMS({
   *   msg: 'Hello World!',
   *   from: 'YourApp',
   *   to: '31612345678',
   *   price: true,  // Get price info in response
   *   mccmnc: true  // Get operator info in response
   * });
   *
   * console.log(`SMS sent with ID: ${result.smsId}`);
   * if (result.price) {
   *   console.log(`Cost: €${result.price} for ${result.parts} part(s)`);
   * }
   * ```
   */
  async sendSMS(params: SendSMSParams): Promise<SendSMSResponse> {
    const requestParams: APIRequestParams = {
      ...this.getAuthParams(),
      msg: params.msg,
      from: params.from,
      to: params.to,
      customid: params.customid,
      price: params.price,
      mccmnc: params.mccmnc,
      credit: params.credit,
    };

    const response = await this.request(ENDPOINTS.SEND_SMS, requestParams);
    return parseSendSMSResponse(response, params.price, params.mccmnc, params.credit);
  }

  /**
   * Test SMS sending without actually sending or reducing credit
   *
   * Useful for testing your implementation without consuming credits.
   *
   * @param params - SMS parameters (same as sendSMS)
   * @returns Promise resolving to TestSMSResponse
   * @throws {BudgetSMSError} If the API returns an error
   *
   * @example
   * ```typescript
   * const result = await client.testSMS({
   *   msg: 'Test message',
   *   from: 'TestApp',
   *   to: '31612345678'
   * });
   *
   * console.log(`Test successful, would get SMS ID: ${result.smsId}`);
   * ```
   */
  async testSMS(params: TestSMSParams): Promise<TestSMSResponse> {
    const requestParams: APIRequestParams = {
      ...this.getAuthParams(),
      msg: params.msg,
      from: params.from,
      to: params.to,
      customid: params.customid,
      price: params.price,
      mccmnc: params.mccmnc,
      credit: params.credit,
    };

    const response = await this.request(ENDPOINTS.TEST_SMS, requestParams);
    return parseSendSMSResponse(response, params.price, params.mccmnc, params.credit);
  }

  /**
   * Check remaining account credit
   *
   * @returns Promise resolving to CheckCreditResponse
   * @throws {BudgetSMSError} If the API returns an error
   *
   * @example
   * ```typescript
   * const result = await client.checkCredit();
   * console.log(`Remaining credit: €${result.credit}`);
   * ```
   */
  async checkCredit(): Promise<CheckCreditResponse> {
    const response = await this.request(ENDPOINTS.CHECK_CREDIT, this.getAuthParams());
    return parseCheckCreditResponse(response);
  }

  /**
   * Check operator based on phone number prefix
   *
   * Note: This checks the original operator based on prefix.
   * If a number has been ported, use hlr() instead.
   *
   * @param phoneNumber - Phone number to check (international format, no +)
   * @returns Promise resolving to OperatorResponse
   * @throws {BudgetSMSError} If the API returns an error
   *
   * @example
   * ```typescript
   * const result = await client.checkOperator('31612345678');
   * console.log(`Operator: ${result.operatorName} (${result.mccMnc})`);
   * console.log(`Cost: €${result.messageCost}`);
   * ```
   */
  async checkOperator(phoneNumber: string): Promise<OperatorResponse> {
    const requestParams: APIRequestParams = {
      ...this.getAuthParams(),
      check: phoneNumber,
    };

    const response = await this.request(ENDPOINTS.CHECK_OPERATOR, requestParams);
    return parseOperatorResponse(response);
  }

  /**
   * Perform HLR (Home Location Register) lookup
   *
   * Returns the actual current operator, even if the number has been ported.
   * More accurate than checkOperator() but may cost credits.
   *
   * @param phoneNumber - Phone number to lookup (international format, no +)
   * @returns Promise resolving to HLRResponse
   * @throws {BudgetSMSError} If the API returns an error
   *
   * @example
   * ```typescript
   * const result = await client.hlr('31612345678');
   * console.log(`Current operator: ${result.operatorName}`);
   * console.log(`Network: ${result.mccMnc}`);
   * ```
   */
  async hlr(phoneNumber: string): Promise<HLRResponse> {
    const requestParams: APIRequestParams = {
      ...this.getAuthParams(),
      to: phoneNumber,
    };

    const response = await this.request(ENDPOINTS.HLR, requestParams);
    return parseOperatorResponse(response);
  }

  /**
   * Check SMS delivery status (Pull DLR)
   *
   * Retrieve the current delivery status of a sent message.
   * For automatic updates, consider using Push DLR instead.
   *
   * @param smsId - The SMS ID returned from sendSMS()
   * @returns Promise resolving to SMSStatusResponse
   * @throws {BudgetSMSError} If the API returns an error
   *
   * @example
   * ```typescript
   * const result = await client.checkSMS('12345678');
   * console.log(`Status: ${result.status}`); // DLRStatus enum value
   * ```
   */
  async checkSMS(smsId: string): Promise<SMSStatusResponse> {
    const requestParams: APIRequestParams = {
      ...this.getAuthParams(),
      smsid: smsId,
    };

    const response = await this.request(ENDPOINTS.CHECK_SMS, requestParams);
    return parseSMSStatusResponse(response, smsId);
  }

  /**
   * Get account pricing for all operators
   *
   * Returns a comprehensive list of pricing for all available operators.
   * Each entry includes country, operator, MCC/MNC codes, and pricing info.
   *
   * @returns Promise resolving to GetPricingResponse (array of pricing entries)
   * @throws {BudgetSMSError} If the API returns an error
   *
   * @example
   * ```typescript
   * const pricing = await client.getPricing();
   * for (const entry of pricing) {
   *   console.log(`${entry.countryname} - ${entry.operatorname}: €${entry.price}`);
   * }
   * ```
   */
  async getPricing(): Promise<GetPricingResponse> {
    const response = await this.request(ENDPOINTS.GET_PRICING, this.getAuthParams());
    return parsePricingResponse(response);
  }
}
