import { TRANSACTION_LIMITS, ERROR_MESSAGES } from '../constants';

export const validatePositiveAmount = (amount) => {
  if (!amount || amount <= 0) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_AMOUNT };
  }
  return { isValid: true, error: null };
};

const validateTransactionLimit = (amount, limit, errorMessage) => {
  if (amount > limit) {
    return { isValid: false, error: errorMessage };
  }
  return { isValid: true, error: null };
};

export const validateUsdTransactionLimit = (amount) => {
  return validateTransactionLimit(amount, TRANSACTION_LIMITS.MAX_PER_TRANSACTION_USD, ERROR_MESSAGES.TRANSACTION_LIMIT_USD);
};

export const validateStableTransactionLimit = (amount) => {
  return validateTransactionLimit(amount, TRANSACTION_LIMITS.MAX_PER_TRANSACTION_STABLE, ERROR_MESSAGES.TRANSACTION_LIMIT_STABLE);
};

export const validateCryptoTransactionLimit = (amount) => {
  return validateTransactionLimit(amount, TRANSACTION_LIMITS.MAX_PER_TRANSACTION_CRYPTO, ERROR_MESSAGES.TRANSACTION_LIMIT_CRYPTO);
};

const validateBalance = (amount, balance, errorMessage) => {
  if (amount > balance) {
    return { isValid: false, error: errorMessage };
  }
  return { isValid: true, error: null };
};

export const validateUserUsdBalance = (amount, userBalance) => {
  return validateBalance(amount, userBalance, ERROR_MESSAGES.INSUFFICIENT_USER_USD);
};

export const validateUserStableBalance = (amount, userBalance) => {
  return validateBalance(amount, userBalance, ERROR_MESSAGES.INSUFFICIENT_USER_STABLE);
};

export const validateUserCryptoBalance = (amount, userBalance) => {
  return validateBalance(amount, userBalance, ERROR_MESSAGES.INSUFFICIENT_USER_CRYPTO);
};

export const validateBankUsdBalance = (amount, bankBalance) => {
  return validateBalance(amount, bankBalance, ERROR_MESSAGES.INSUFFICIENT_BANK_USD);
};

export const validateBankStableBalance = (amount, bankBalance) => {
  return validateBalance(amount, bankBalance, ERROR_MESSAGES.INSUFFICIENT_BANK_STABLE);
};

export const validateMarketLiquidity = (amount, liquidity) => {
  return validateBalance(amount, liquidity, ERROR_MESSAGES.INSUFFICIENT_MARKET_LIQUIDITY);
};

export const runValidations = (rules) => {
  for (const rule of rules) {
    const result = rule();
    if (!result.isValid) {
      return result;
    }
  }
  return { isValid: true, error: null };
};

export const createValidationRule = (validator, ...args) => {
  return () => validator(...args);
};
