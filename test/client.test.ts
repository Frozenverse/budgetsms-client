import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BudgetSMS } from '../src/client';
import { BudgetSMSError } from '../src/errors';
import { BudgetSMSErrorCode, DLRStatus } from '../src/constants';

// Mock fetch globally
global.fetch = vi.fn();

describe('BudgetSMS Client', () => {
  let client: BudgetSMS;

  beforeEach(() => {
    client = new BudgetSMS({
      username: 'testuser',
      userid: '12345',
      handle: 'testhandle123',
    });
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create client with credentials', () => {
      expect(client).toBeInstanceOf(BudgetSMS);
    });

    it('should use custom base URL if provided', () => {
      const customClient = new BudgetSMS({
        username: 'test',
        userid: '123',
        handle: 'handle',
        baseUrl: 'https://custom.api.example.com',
      });
      expect(customClient).toBeInstanceOf(BudgetSMS);
    });
  });

  describe('sendSMS', () => {
    it('should send SMS successfully', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        text: async () => 'OK 12345678',
      });

      const result = await client.sendSMS({
        msg: 'Test message',
        from: 'TestApp',
        to: '31612345678',
      });

      expect(result).toEqual({
        success: true,
        smsId: '12345678',
      });

      expect(global.fetch).toHaveBeenCalledOnce();
      const callUrl = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(callUrl).toContain('/sendsms/');
      expect(callUrl).toContain('username=testuser');
      expect(callUrl).toContain('msg=Test%20message');
    });

    it('should send SMS with price and mccmnc info', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        text: async () => 'OK 12345678 0.055 1 20416',
      });

      const result = await client.sendSMS({
        msg: 'Test',
        from: 'App',
        to: '31612345678',
        price: true,
        mccmnc: true,
      });

      expect(result).toEqual({
        success: true,
        smsId: '12345678',
        price: 0.055,
        parts: 1,
        mccMnc: '20416',
      });
    });

    it('should throw BudgetSMSError on API error', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        text: async () => 'ERR 1001',
      });

      try {
        await client.sendSMS({
          msg: 'Test',
          from: 'App',
          to: '31612345678',
        });
        // Should not reach here
        expect.fail('Expected error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BudgetSMSError);
        expect((error as BudgetSMSError).code).toBe(BudgetSMSErrorCode.NOT_ENOUGH_CREDITS);
      }
    });
  });

  describe('testSMS', () => {
    it('should test SMS without sending', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        text: async () => 'OK 12345678',
      });

      const result = await client.testSMS({
        msg: 'Test message',
        from: 'TestApp',
        to: '31612345678',
      });

      expect(result).toEqual({
        success: true,
        smsId: '12345678',
      });

      const callUrl = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(callUrl).toContain('/testsms/');
    });
  });

  describe('checkCredit', () => {
    it('should check remaining credit', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        text: async () => 'OK 123.45',
      });

      const result = await client.checkCredit();

      expect(result).toEqual({
        success: true,
        credit: 123.45,
      });

      const callUrl = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(callUrl).toContain('/checkcredit/');
    });
  });

  describe('checkOperator', () => {
    it('should check operator for phone number', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        text: async () => 'OK 20416:T-Mobile Netherlands BV:0.0450',
      });

      const result = await client.checkOperator('31612345678');

      expect(result).toEqual({
        success: true,
        mccMnc: '20416',
        operatorName: 'T-Mobile Netherlands BV',
        messageCost: 0.045,
      });

      const callUrl = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(callUrl).toContain('/checkoperator/');
      expect(callUrl).toContain('check=31612345678');
    });
  });

  describe('hlr', () => {
    it('should perform HLR lookup', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        text: async () => 'OK 20416:T-Mobile Netherlands BV:0.0450',
      });

      const result = await client.hlr('31612345678');

      expect(result).toEqual({
        success: true,
        mccMnc: '20416',
        operatorName: 'T-Mobile Netherlands BV',
        messageCost: 0.045,
      });

      const callUrl = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(callUrl).toContain('/hlr/');
      expect(callUrl).toContain('to=31612345678');
    });
  });

  describe('checkSMS', () => {
    it('should check SMS status', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        text: async () => 'OK 1',
      });

      const result = await client.checkSMS('12345678');

      expect(result).toEqual({
        success: true,
        smsId: '12345678',
        status: DLRStatus.DELIVERED,
      });

      const callUrl = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(callUrl).toContain('/checksms/');
      expect(callUrl).toContain('smsid=12345678');
    });
  });

  describe('getPricing', () => {
    it('should get account pricing', async () => {
      const pricingData = [
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
      ];

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(pricingData),
      });

      const result = await client.getPricing();

      expect(result).toEqual(pricingData);
      expect(result).toHaveLength(1);
      expect(result[0].countryname).toBe('The Netherlands');

      const callUrl = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(callUrl).toContain('/getpricing/');
    });
  });

  describe('error handling', () => {
    it('should handle HTTP errors', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(client.checkCredit()).rejects.toThrow('HTTP error! status: 500');
    });

    it('should handle network errors', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));

      await expect(client.checkCredit()).rejects.toThrow('Network error');
    });

    it('should handle timeout', async () => {
      const shortTimeoutClient = new BudgetSMS({
        username: 'test',
        userid: '123',
        handle: 'handle',
        timeout: 100,
      });

      (global.fetch as ReturnType<typeof vi.fn>).mockImplementationOnce(
        (_url: string, options?: { signal?: AbortSignal }) => {
          return new Promise((resolve, reject) => {
            // Simulate the abort signal being triggered
            if (options?.signal) {
              const abortHandler = () => {
                const abortError = new Error('The operation was aborted');
                abortError.name = 'AbortError';
                reject(abortError);
              };

              if (options.signal.aborted) {
                abortHandler();
              } else {
                options.signal.addEventListener('abort', abortHandler);
              }
            }

            // Simulate a long request
            setTimeout(() => {
              resolve({
                ok: true,
                text: async () => 'OK 123.45',
              });
            }, 200);
          });
        }
      );

      await expect(shortTimeoutClient.checkCredit()).rejects.toThrow('Request timeout');
    });
  });
});
