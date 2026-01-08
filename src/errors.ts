import { BudgetSMSErrorCode, ERROR_MESSAGES } from './constants';

/**
 * Custom error class for BudgetSMS API errors
 */
export class BudgetSMSError extends Error {
  /**
   * Creates a new BudgetSMSError
   * @param code - The BudgetSMS error code
   * @param message - Optional custom error message (defaults to standard message for the code)
   */
  constructor(
    public readonly code: BudgetSMSErrorCode,
    message?: string
  ) {
    super(message || ERROR_MESSAGES[code] || `BudgetSMS API error: ${code}`);
    this.name = 'BudgetSMSError';

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BudgetSMSError);
    }
  }

  /**
   * Returns true if the error code indicates a temporary/retryable error
   */
  isRetryable(): boolean {
    return [
      BudgetSMSErrorCode.SYSTEM_ERROR_TEMPORARY,
      BudgetSMSErrorCode.SYSTEM_ERROR_TEMPORARY_2,
      BudgetSMSErrorCode.GATEWAY_NOT_REACHABLE,
    ].includes(this.code);
  }

  /**
   * Returns true if the error code indicates an authentication/credentials issue
   */
  isAuthenticationError(): boolean {
    return [
      BudgetSMSErrorCode.INVALID_CREDENTIALS,
      BudgetSMSErrorCode.ACCOUNT_NOT_ACTIVE,
      BudgetSMSErrorCode.IP_NOT_ALLOWED,
      BudgetSMSErrorCode.NO_HANDLE_PROVIDED,
      BudgetSMSErrorCode.NO_USERID_PROVIDED,
      BudgetSMSErrorCode.NO_USERNAME_PROVIDED,
    ].includes(this.code);
  }

  /**
   * Returns true if the error code indicates insufficient credits
   */
  isInsufficientCredits(): boolean {
    return this.code === BudgetSMSErrorCode.NOT_ENOUGH_CREDITS;
  }

  /**
   * Convert error to JSON for logging/serialization
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      stack: this.stack,
    };
  }
}
