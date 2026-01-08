/**
 * BudgetSMS API Base URL and Endpoints
 */
export const API_BASE = 'https://api.budgetsms.net';

export const ENDPOINTS = {
  SEND_SMS: '/sendsms/',
  TEST_SMS: '/testsms/',
  CHECK_CREDIT: '/checkcredit/',
  CHECK_OPERATOR: '/checkoperator/',
  HLR: '/hlr/',
  CHECK_SMS: '/checksms/',
  GET_PRICING: '/getpricing/',
} as const;

/**
 * BudgetSMS API Error Codes
 * Source: HTTP API Specification V2.7, Chapter 11
 */
export enum BudgetSMSErrorCode {
  // Authentication & Account Errors (1xxx)
  NOT_ENOUGH_CREDITS = 1001,
  INVALID_CREDENTIALS = 1002,
  ACCOUNT_NOT_ACTIVE = 1003,
  IP_NOT_ALLOWED = 1004,
  NO_HANDLE_PROVIDED = 1005,
  NO_USERID_PROVIDED = 1006,
  NO_USERNAME_PROVIDED = 1007,

  // SMS Message Errors (2xxx)
  SMS_TEXT_EMPTY = 2001,
  SMS_NUMERIC_SENDER_TOO_LONG = 2002,
  SMS_ALPHANUMERIC_SENDER_TOO_LONG = 2003,
  SMS_SENDER_EMPTY_OR_INVALID = 2004,
  DESTINATION_TOO_SHORT = 2005,
  DESTINATION_NOT_NUMERIC = 2006,
  DESTINATION_EMPTY = 2007,
  SMS_TEXT_NOT_OK = 2008,
  PARAMETER_ISSUE = 2009,
  DESTINATION_INVALIDLY_FORMATTED = 2010,
  DESTINATION_INVALID = 2011,
  SMS_TEXT_TOO_LONG = 2012,
  SMS_MESSAGE_INVALID = 2013,
  CUSTOM_ID_ALREADY_USED = 2014,
  CHARSET_PROBLEM = 2015,
  INVALID_UTF8_ENCODING = 2016,
  INVALID_SMS_ID = 2017,

  // Routing Errors (3xxx)
  NO_ROUTE_TO_DESTINATION = 3001,
  NO_ROUTES_SETUP = 3002,
  INVALID_DESTINATION = 3003,

  // System Errors (4xxx)
  SYSTEM_ERROR_CUSTOM_ID = 4001,
  SYSTEM_ERROR_TEMPORARY = 4002,
  SYSTEM_ERROR_TEMPORARY_2 = 4003,
  SYSTEM_ERROR_CONTACT_SUPPORT = 4004,
  SYSTEM_ERROR_PERMANENT = 4005,
  GATEWAY_NOT_REACHABLE = 4006,
  SYSTEM_ERROR_CONTACT_SUPPORT_2 = 4007,

  // Send Errors (5xxx)
  SEND_ERROR = 5001,
  WRONG_SMS_TYPE = 5002,
  WRONG_OPERATOR = 5003,

  // Unknown Error (6xxx)
  UNKNOWN_ERROR = 6001,

  // HLR Errors (7xxx)
  NO_HLR_PROVIDER = 7001,
  UNEXPECTED_HLR_RESULTS = 7002,
  BAD_NUMBER_FORMAT = 7003,
  HLR_UNEXPECTED_ERROR = 7901,
  HLR_PROVIDER_ERROR = 7902,
  HLR_PROVIDER_ERROR_2 = 7903,
}

/**
 * Error code descriptions for better error messages
 */
export const ERROR_MESSAGES: Record<BudgetSMSErrorCode, string> = {
  [BudgetSMSErrorCode.NOT_ENOUGH_CREDITS]: 'Not enough credits to send messages',
  [BudgetSMSErrorCode.INVALID_CREDENTIALS]: 'Identification failed. Wrong credentials',
  [BudgetSMSErrorCode.ACCOUNT_NOT_ACTIVE]: 'Account not active, contact BudgetSMS',
  [BudgetSMSErrorCode.IP_NOT_ALLOWED]: 'This IP address is not added to this account. No access to the API',
  [BudgetSMSErrorCode.NO_HANDLE_PROVIDED]: 'No handle provided',
  [BudgetSMSErrorCode.NO_USERID_PROVIDED]: 'No UserID provided',
  [BudgetSMSErrorCode.NO_USERNAME_PROVIDED]: 'No Username provided',

  [BudgetSMSErrorCode.SMS_TEXT_EMPTY]: 'SMS message text is empty',
  [BudgetSMSErrorCode.SMS_NUMERIC_SENDER_TOO_LONG]: 'SMS numeric senderid can be max. 16 numbers',
  [BudgetSMSErrorCode.SMS_ALPHANUMERIC_SENDER_TOO_LONG]: 'SMS alphanumeric sender can be max. 11 characters',
  [BudgetSMSErrorCode.SMS_SENDER_EMPTY_OR_INVALID]: 'SMS senderid is empty or invalid',
  [BudgetSMSErrorCode.DESTINATION_TOO_SHORT]: 'Destination number is too short',
  [BudgetSMSErrorCode.DESTINATION_NOT_NUMERIC]: 'Destination is not numeric',
  [BudgetSMSErrorCode.DESTINATION_EMPTY]: 'Destination is empty',
  [BudgetSMSErrorCode.SMS_TEXT_NOT_OK]: 'SMS text is not OK (check encoding?)',
  [BudgetSMSErrorCode.PARAMETER_ISSUE]: 'Parameter issue (check all mandatory parameters, encoding, etc.)',
  [BudgetSMSErrorCode.DESTINATION_INVALIDLY_FORMATTED]: 'Destination number is invalidly formatted',
  [BudgetSMSErrorCode.DESTINATION_INVALID]: 'Destination is invalid',
  [BudgetSMSErrorCode.SMS_TEXT_TOO_LONG]: 'SMS message text is too long',
  [BudgetSMSErrorCode.SMS_MESSAGE_INVALID]: 'SMS message is invalid',
  [BudgetSMSErrorCode.CUSTOM_ID_ALREADY_USED]: 'SMS CustomID is used before',
  [BudgetSMSErrorCode.CHARSET_PROBLEM]: 'Charset problem',
  [BudgetSMSErrorCode.INVALID_UTF8_ENCODING]: 'Invalid UTF-8 encoding',
  [BudgetSMSErrorCode.INVALID_SMS_ID]: 'Invalid SMSid',

  [BudgetSMSErrorCode.NO_ROUTE_TO_DESTINATION]: 'No route to destination. Contact BudgetSMS for possible solutions',
  [BudgetSMSErrorCode.NO_ROUTES_SETUP]: 'No routes are setup. Contact BudgetSMS for a route setup',
  [BudgetSMSErrorCode.INVALID_DESTINATION]: 'Invalid destination. Check international mobile number formatting',

  [BudgetSMSErrorCode.SYSTEM_ERROR_CUSTOM_ID]: 'System error, related to customID',
  [BudgetSMSErrorCode.SYSTEM_ERROR_TEMPORARY]: 'System error, temporary issue. Try resubmitting in 2 to 3 minutes',
  [BudgetSMSErrorCode.SYSTEM_ERROR_TEMPORARY_2]: 'System error, temporary issue',
  [BudgetSMSErrorCode.SYSTEM_ERROR_CONTACT_SUPPORT]: 'System error, temporary issue. Contact BudgetSMS',
  [BudgetSMSErrorCode.SYSTEM_ERROR_PERMANENT]: 'System error, permanent',
  [BudgetSMSErrorCode.GATEWAY_NOT_REACHABLE]: 'Gateway not reachable',
  [BudgetSMSErrorCode.SYSTEM_ERROR_CONTACT_SUPPORT_2]: 'System error, contact BudgetSMS',

  [BudgetSMSErrorCode.SEND_ERROR]: 'Send error, Contact BudgetSMS with the send details',
  [BudgetSMSErrorCode.WRONG_SMS_TYPE]: 'Wrong SMS type',
  [BudgetSMSErrorCode.WRONG_OPERATOR]: 'Wrong operator',

  [BudgetSMSErrorCode.UNKNOWN_ERROR]: 'Unknown error',

  [BudgetSMSErrorCode.NO_HLR_PROVIDER]: 'No HLR provider present, Contact BudgetSMS',
  [BudgetSMSErrorCode.UNEXPECTED_HLR_RESULTS]: 'Unexpected results from HLR provider',
  [BudgetSMSErrorCode.BAD_NUMBER_FORMAT]: 'Bad number format',
  [BudgetSMSErrorCode.HLR_UNEXPECTED_ERROR]: 'Unexpected error. Contact BudgetSMS',
  [BudgetSMSErrorCode.HLR_PROVIDER_ERROR]: 'HLR provider error. Contact BudgetSMS',
  [BudgetSMSErrorCode.HLR_PROVIDER_ERROR_2]: 'HLR provider error. Contact BudgetSMS',
};

/**
 * DLR (Delivery Report) Status Codes
 * Source: HTTP API Specification V2.7, Chapter 12
 */
export enum DLRStatus {
  /** Message is sent, no status yet (default) */
  SENT_NO_STATUS = 0,
  /** Message is delivered */
  DELIVERED = 1,
  /** Message is not sent */
  NOT_SENT = 2,
  /** Message delivery failed */
  DELIVERY_FAILED = 3,
  /** Message is sent */
  SENT = 4,
  /** Message expired */
  EXPIRED = 5,
  /** Message has a invalid destination address */
  INVALID_DESTINATION = 6,
  /** SMSC error, message could not be processed */
  SMSC_ERROR = 7,
  /** Message is not allowed */
  NOT_ALLOWED = 8,
  /** Message status unknown, usually after 24 hours without status update SMSC */
  STATUS_UNKNOWN_24H = 11,
  /** Message status unknown, SMSC received unknown status code */
  STATUS_UNKNOWN_CODE = 12,
  /** Message status unknown, no status update received from SMSC after 72 hours after submit */
  STATUS_UNKNOWN_72H = 13,
}

/**
 * DLR status descriptions for better understanding
 */
export const DLR_STATUS_MESSAGES: Record<DLRStatus, string> = {
  [DLRStatus.SENT_NO_STATUS]: 'Message is sent, no status yet',
  [DLRStatus.DELIVERED]: 'Message is delivered',
  [DLRStatus.NOT_SENT]: 'Message is not sent',
  [DLRStatus.DELIVERY_FAILED]: 'Message delivery failed',
  [DLRStatus.SENT]: 'Message is sent',
  [DLRStatus.EXPIRED]: 'Message expired',
  [DLRStatus.INVALID_DESTINATION]: 'Message has invalid destination address',
  [DLRStatus.SMSC_ERROR]: 'SMSC error, message could not be processed',
  [DLRStatus.NOT_ALLOWED]: 'Message is not allowed',
  [DLRStatus.STATUS_UNKNOWN_24H]: 'Message status unknown, usually after 24 hours without status update from SMSC',
  [DLRStatus.STATUS_UNKNOWN_CODE]: 'Message status unknown, SMSC received unknown status code',
  [DLRStatus.STATUS_UNKNOWN_72H]: 'Message status unknown, no status update received from SMSC after 72 hours',
};
