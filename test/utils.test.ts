import { describe, it, expect } from 'vitest';
import {
  buildQueryString,
  parseResponse,
  parseSendSMSResponse,
  parseCheckCreditResponse,
  parseOperatorResponse,
  parseSMSStatusResponse,
  parsePricingResponse,
  validatePhoneNumber,
  validateSender,
  validateMessage,
} from '../src/utils';
import { BudgetSMSError } from '../src/errors';
import { BudgetSMSErrorCode, DLRStatus } from '../src/constants';

describe('buildQueryString', () => {
  it('should build query string from parameters', () => {
    const params = {
      username: 'test',
      userid: '12345',
      msg: 'Hello World',
    };
    const result = buildQueryString(params);
    expect(result).toContain('username=test');
    expect(result).toContain('userid=12345');
    expect(result).toContain('msg=Hello%20World');
  });

  it('should URL encode special characters', () => {
    const params = {
      msg: 'Test & encode = special',
    };
    const result = buildQueryString(params);
    expect(result).toContain('msg=Test%20%26%20encode%20%3D%20special');
  });

  it('should convert booleans to 1/0', () => {
    const params = {
      price: true,
      mccmnc: false,
    };
    const result = buildQueryString(params);
    expect(result).toContain('price=1');
    expect(result).toContain('mccmnc=0');
  });

  it('should skip undefined and null values', () => {
    const params = {
      username: 'test',
      customid: undefined,
      other: null,
    };
    const result = buildQueryString(params);
    expect(result).toBe('username=test');
  });
});

describe('parseResponse', () => {
  it('should parse OK response', () => {
    const result = parseResponse('OK 12345');
    expect(result).toBe('12345');
  });

  it('should parse OK response with no data', () => {
    const result = parseResponse('OK');
    expect(result).toBe('');
  });

  it('should throw BudgetSMSError for ERR response', () => {
    expect(() => parseResponse('ERR 1001')).toThrow(BudgetSMSError);
    try {
      parseResponse('ERR 1001');
    } catch (error) {
      expect(error).toBeInstanceOf(BudgetSMSError);
      expect((error as BudgetSMSError).code).toBe(BudgetSMSErrorCode.NOT_ENOUGH_CREDITS);
    }
  });

  it('should throw error for invalid response format', () => {
    expect(() => parseResponse('INVALID')).toThrow('Unexpected API response format');
  });
});

describe('parseSendSMSResponse', () => {
  it('should parse basic SMS response', () => {
    const result = parseSendSMSResponse('OK 12345678');
    expect(result).toEqual({
      success: true,
      smsId: '12345678',
    });
  });

  it('should parse SMS response with price info', () => {
    const result = parseSendSMSResponse('OK 12345678 0.055 1', true);
    expect(result).toEqual({
      success: true,
      smsId: '12345678',
      price: 0.055,
      parts: 1,
    });
  });

  it('should parse SMS response with price and mccmnc', () => {
    const result = parseSendSMSResponse('OK 12345678 0.055 1 20416', true, true);
    expect(result).toEqual({
      success: true,
      smsId: '12345678',
      price: 0.055,
      parts: 1,
      mccMnc: '20416',
    });
  });

  it('should parse SMS response with all optional fields', () => {
    const result = parseSendSMSResponse('OK 12345678 0.055 1 20416 100.50', true, true, true);
    expect(result).toEqual({
      success: true,
      smsId: '12345678',
      price: 0.055,
      parts: 1,
      mccMnc: '20416',
      credit: 100.50,
    });
  });
});

describe('parseCheckCreditResponse', () => {
  it('should parse credit response', () => {
    const result = parseCheckCreditResponse('OK 123.45');
    expect(result).toEqual({
      success: true,
      credit: 123.45,
    });
  });

  it('should throw error for invalid credit format', () => {
    expect(() => parseCheckCreditResponse('OK invalid')).toThrow('Invalid credit response');
  });
});

describe('parseOperatorResponse', () => {
  it('should parse operator response', () => {
    const result = parseOperatorResponse('OK 20416:T-Mobile Netherlands BV:0.0450');
    expect(result).toEqual({
      success: true,
      mccMnc: '20416',
      operatorName: 'T-Mobile Netherlands BV',
      messageCost: 0.045,
    });
  });

  it('should throw error for invalid operator format', () => {
    expect(() => parseOperatorResponse('OK invalid')).toThrow('Invalid operator response format');
  });
});

describe('parseSMSStatusResponse', () => {
  it('should parse SMS status response', () => {
    const result = parseSMSStatusResponse('OK 1', '12345678');
    expect(result).toEqual({
      success: true,
      smsId: '12345678',
      status: DLRStatus.DELIVERED,
    });
  });

  it('should throw error for invalid status format', () => {
    expect(() => parseSMSStatusResponse('OK invalid', '12345678')).toThrow('Invalid status response');
  });
});

describe('parsePricingResponse', () => {
  it('should parse pricing JSON response', () => {
    const jsonResponse = JSON.stringify([
      {
        countryprefix: '31',
        countryname: 'The Netherlands',
        mcc: '204',
        operatorname: 'Tele2',
        mnc: '02',
        price: '0.04',
        old_price: '0.045',
        last_modified: '2014-02-18 12:05:55',
      },
    ]);
    const result = parsePricingResponse(jsonResponse);
    expect(result).toHaveLength(1);
    expect(result[0].countryname).toBe('The Netherlands');
  });

  it('should handle error response', () => {
    expect(() => parsePricingResponse('ERR 1002')).toThrow(BudgetSMSError);
  });

  it('should throw error for invalid JSON', () => {
    expect(() => parsePricingResponse('invalid json')).toThrow('Failed to parse pricing response');
  });
});

describe('validatePhoneNumber', () => {
  it('should validate correct phone numbers', () => {
    expect(validatePhoneNumber('31612345678')).toBe(true);
    expect(validatePhoneNumber('12345678')).toBe(true);
    expect(validatePhoneNumber('1234567890123456')).toBe(true);
  });

  it('should reject invalid phone numbers', () => {
    expect(validatePhoneNumber('1234567')).toBe(false); // Too short
    expect(validatePhoneNumber('12345678901234567')).toBe(false); // Too long
    expect(validatePhoneNumber('+31612345678')).toBe(false); // Contains +
    expect(validatePhoneNumber('31 612 345 678')).toBe(false); // Contains spaces
    expect(validatePhoneNumber('abc123')).toBe(false); // Contains letters
  });
});

describe('validateSender', () => {
  it('should validate alphanumeric senders', () => {
    expect(validateSender('MyApp')).toBe(true);
    expect(validateSender('Test123')).toBe(true);
    expect(validateSender('ABC')).toBe(true);
    expect(validateSender('12345678901')).toBe(true); // Max 11 alphanumeric
  });

  it('should validate numeric senders', () => {
    expect(validateSender('123456')).toBe(true);
    expect(validateSender('1234567890123456')).toBe(true); // Max 16 numeric
  });

  it('should reject invalid senders', () => {
    expect(validateSender('TooLongSender')).toBe(false); // >11 alphanumeric
    expect(validateSender('12345678901234567')).toBe(false); // >16 numeric
    expect(validateSender('Test Sender')).toBe(false); // Contains space
    expect(validateSender('Test-Sender')).toBe(false); // Contains special char
    expect(validateSender('')).toBe(false); // Empty
  });
});

describe('validateMessage', () => {
  it('should validate correct messages', () => {
    expect(validateMessage('Hello')).toBe(true);
    expect(validateMessage('A'.repeat(612))).toBe(true); // Max length
  });

  it('should reject invalid messages', () => {
    expect(validateMessage('')).toBe(false); // Empty
    expect(validateMessage('A'.repeat(613))).toBe(false); // Too long
  });
});
