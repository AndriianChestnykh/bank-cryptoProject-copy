import { useState, useMemo } from 'react';
import {
  INITIAL_BALANCES,
  PRICING,
  TRANSACTION_LIMITS,
  PRECISION,
  ERROR_MESSAGES,
  TRANSACTION_TYPES,
  CONVERSION_RATES
} from '../constants';
import {
  validatePositiveAmount,
  validateUsdTransactionLimit,
  validateStableTransactionLimit,
  validateCryptoTransactionLimit,
  validateUserUsdBalance,
  validateUserStableBalance,
  validateUserCryptoBalance,
  validateBankUsdBalance,
  validateBankStableBalance,
  validateMarketLiquidity,
  runValidations,
  createValidationRule
} from '../utils/validation';
import {
  formatCryptoAmount,
  formatStableAmount,
  formatLiquidityAmount,
  calculateCryptoFromStable,
  calculateStableFromCrypto,
  convertUsdToStable,
  convertStableToUsd
} from '../utils/transactionHelpers';

export function useBankCrypto() {
  const [bankUsd, setBankUsd] = useState(INITIAL_BALANCES.BANK_USD);
  const [bankStable, setBankStable] = useState(INITIAL_BALANCES.BANK_STABLE);
  const [userUsd, setUserUsd] = useState(INITIAL_BALANCES.USER_USD);
  const [userStable, setUserStable] = useState(INITIAL_BALANCES.USER_STABLE);
  const [userCrypto, setUserCrypto] = useState(INITIAL_BALANCES.USER_CRYPTO);
  const [cryptoPrice, setCryptoPrice] = useState(PRICING.INITIAL_CRYPTO_PRICE);
  const [marketLiquidity, setMarketLiquidity] = useState(INITIAL_BALANCES.MARKET_LIQUIDITY);
  const [transactionHistory, setTransactionHistory] = useState([]);
  
  function addTransactionToHistory(type, details) {
    setTransactionHistory(prev => [
      { 
        id: Date.now(), 
        type, 
        details, 
        timestamp: new Date().toLocaleTimeString() 
      }, 
      ...prev
    ]);
  }

  const buyStableMethod = (amount) => {
    const validation = runValidations([
      createValidationRule(validatePositiveAmount, amount),
      createValidationRule(validateUsdTransactionLimit, amount),
      createValidationRule(validateUserUsdBalance, amount, userUsd),
      createValidationRule(validateBankStableBalance, amount, bankStable)
    ]);

    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    setUserUsd(prev => prev - amount);
    setUserStable(prev => formatStableAmount(prev + amount));
    setBankUsd(prev => prev + amount);
    setBankStable(prev => formatStableAmount(prev - amount));
    
    addTransactionToHistory(TRANSACTION_TYPES.BUY_STABLE, `Bought ${amount} USDT for ${amount} USD`);
    return { success: true };
  };

  const sellStableMethod = (amount) => {
    const validation = runValidations([
      createValidationRule(validatePositiveAmount, amount),
      createValidationRule(validateStableTransactionLimit, amount),
      createValidationRule(validateUserStableBalance, amount, userStable),
      createValidationRule(validateBankUsdBalance, amount, bankUsd)
    ]);

    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    setUserStable(prev => formatStableAmount(prev - amount));
    setUserUsd(prev => prev + amount);
    setBankUsd(prev => prev - amount);
    setBankStable(prev => formatStableAmount(prev + amount));
    
    addTransactionToHistory(TRANSACTION_TYPES.SELL_STABLE, `Sold ${amount} USDT, received ${amount} USD`);
    return { success: true };
  };

  const buyCryptoMethod = (stableAmount) => {
    const validation = runValidations([
      createValidationRule(validatePositiveAmount, stableAmount),
      createValidationRule(validateCryptoTransactionLimit, stableAmount),
      createValidationRule(validateUserStableBalance, stableAmount, userStable),
      createValidationRule(validateMarketLiquidity, stableAmount, marketLiquidity)
    ]);

    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const cryptoBought = calculateCryptoFromStable(stableAmount, cryptoPrice);
    setUserStable(prev => formatStableAmount(prev - stableAmount));
    setUserCrypto(prev => formatCryptoAmount(prev + cryptoBought));
    setMarketLiquidity(prev => formatLiquidityAmount(prev + stableAmount));
    
    addTransactionToHistory(TRANSACTION_TYPES.BUY_CRYPTO, `Spent ${stableAmount} USDT, received ${formatStableAmount(cryptoBought)} BTC (from market)`);
    return { success: true };
  };

  const sellCryptoMethod = (cryptoAmount) => {
    const validation = runValidations([
      createValidationRule(validatePositiveAmount, cryptoAmount),
      createValidationRule(validateUserCryptoBalance, cryptoAmount, userCrypto)
    ]);

    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const receiveStable = formatLiquidityAmount(calculateStableFromCrypto(cryptoAmount, cryptoPrice));
    const liquidityValidation = validateMarketLiquidity(receiveStable, marketLiquidity);
    
    if (!liquidityValidation.isValid) {
      return { success: false, error: liquidityValidation.error };
    }

    setUserCrypto(prev => formatCryptoAmount(prev - cryptoAmount));
    setUserStable(prev => formatStableAmount(prev + receiveStable));
    setMarketLiquidity(prev => formatLiquidityAmount(prev - receiveStable));
    
    addTransactionToHistory(TRANSACTION_TYPES.SELL_CRYPTO, `Sold ${cryptoAmount} BTC, received ${receiveStable} USDT (to market)`);
    return { success: true };
  };

  const transactionMethods = {
    buyStable: buyStableMethod,
    sellStable: sellStableMethod,
    buyCrypto: buyCryptoMethod,
    sellCrypto: sellCryptoMethod,
    buyCryptoWithUsd: (usdAmount) => {
      const validation = runValidations([
        createValidationRule(validatePositiveAmount, usdAmount),
        createValidationRule(validateUsdTransactionLimit, usdAmount),
        createValidationRule(validateUserUsdBalance, usdAmount, userUsd),
        createValidationRule(validateBankStableBalance, usdAmount, bankStable),
        createValidationRule(validateMarketLiquidity, usdAmount, marketLiquidity)
      ]);

      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      const stableAmount = convertUsdToStable(usdAmount);
      const buyStableResult = buyStableMethod(usdAmount);
      
      if (!buyStableResult.success) {
        return buyStableResult;
      }

      const buyCryptoResult = buyCryptoMethod(stableAmount);
      
      if (!buyCryptoResult.success) {
        sellStableMethod(stableAmount);
        return buyCryptoResult;
      }

      return { success: true };
    },
    sellCryptoForUsd: (usdAmount) => {
      const validation = runValidations([
        createValidationRule(validatePositiveAmount, usdAmount),
        createValidationRule(validateUsdTransactionLimit, usdAmount),
        createValidationRule(validateMarketLiquidity, usdAmount, marketLiquidity)
      ]);

      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      const cryptoToSellAmount = calculateCryptoFromStable(usdAmount, cryptoPrice);
      const cryptoValidation = validateUserCryptoBalance(cryptoToSellAmount, userCrypto);
      
      if (!cryptoValidation.isValid) {
        return { success: false, error: cryptoValidation.error };
      }

      const stableReceived = formatLiquidityAmount(calculateStableFromCrypto(cryptoToSellAmount, cryptoPrice));
      const liquidityValidation = validateMarketLiquidity(stableReceived, marketLiquidity);
      
      if (!liquidityValidation.isValid) {
        return { success: false, error: liquidityValidation.error };
      }

      const sellCryptoResult = sellCryptoMethod(cryptoToSellAmount);
      
      if (!sellCryptoResult.success) {
        return sellCryptoResult;
      }

      const sellStableResult = sellStableMethod(stableReceived);
      
      if (!sellStableResult.success) {
        buyCryptoMethod(stableReceived);
        return sellStableResult;
      }

      return { success: true };
    },
    reset: () => {
      setBankUsd(INITIAL_BALANCES.BANK_USD);
      setBankStable(INITIAL_BALANCES.BANK_STABLE);
      setUserUsd(INITIAL_BALANCES.USER_USD);
      setUserStable(INITIAL_BALANCES.USER_STABLE);
      setUserCrypto(INITIAL_BALANCES.USER_CRYPTO);
      setCryptoPrice(PRICING.INITIAL_CRYPTO_PRICE);
      setMarketLiquidity(INITIAL_BALANCES.MARKET_LIQUIDITY);
      setTransactionHistory([]);
    }
  };

  // Computed values
  const computedValues = {
    maxSpendUsd: useMemo(() => Math.max(0, userUsd), [userUsd]),
    maxSpendStable: useMemo(() => Math.max(0, userStable), [userStable]),
    maxSellCrypto: useMemo(() => Math.max(0, userCrypto), [userCrypto]),
    cryptoIfBuy: (stableAmount) => (cryptoPrice > 0 ? calculateCryptoFromStable(stableAmount, cryptoPrice) : 0),
    stableIfSell: (cryptoAmount) => formatLiquidityAmount(calculateStableFromCrypto(cryptoAmount, cryptoPrice)),
    cryptoIfBuyWithUsd: (usdAmount) => (cryptoPrice > 0 ? calculateCryptoFromStable(convertUsdToStable(usdAmount), cryptoPrice) : 0),
    cryptoToSellForUsd: (usdAmount) => (cryptoPrice > 0 ? calculateCryptoFromStable(usdAmount, cryptoPrice) : 0)
  };

  return {
    // State
    bankUsd,
    bankStable,
    userUsd,
    userStable,
    userCrypto,
    cryptoPrice,
    marketLiquidity,
    transactionHistory,
    
    // Setters
    setBankUsd,
    setBankStable,
    setUserUsd,
    setUserStable,
    setUserCrypto,
    setCryptoPrice,
    setMarketLiquidity,
    
    // Transaction methods
    ...transactionMethods,
    
    // Computed values
    ...computedValues,
    
    // Constants
    INITIAL_CRYPTO_PRICE: PRICING.INITIAL_CRYPTO_PRICE
  };
}
