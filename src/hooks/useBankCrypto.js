import { useState, useMemo } from 'react';

// Shared hook for banking operations logic
export function useBankCrypto() {
  const INITIAL_CRYPTO_PRICE = 100000;

  // Bank-side balances
  const [bankUsd, setBankUsd] = useState(1_000_000);
  const [bankStable, setBankStable] = useState(1_000_000);

  // User balances
  const [userUsd, setUserUsd] = useState(10_000);
  const [userStable, setUserStable] = useState(0);
  const [userCrypto, setUserCrypto] = useState(0);

  // Market/price
  const [cryptoPrice, setCryptoPrice] = useState(INITIAL_CRYPTO_PRICE);
  
  // Market liquidity (simulating open market)
  const [marketUsdtLiquidity, setMarketUsdtLiquidity] = useState(5_000_000);

  // Transaction history
  const [history, setHistory] = useState([]);
  
  function addHistory(type, details) {
    setHistory(prev => [{ id: Date.now(), type, details, timestamp: new Date().toLocaleTimeString() }, ...prev]);
  }

  // Shared transaction methods
  const transactionMethods = {
    // USD -> USDT (1:1)
    buyStable: (amount) => {
      if (!amount || amount <= 0) return { success: false, error: "Enter a positive amount." };
      if (amount > userUsd) return { success: false, error: "Insufficient user USD." };
      if (amount > bankStable) return { success: false, error: "Bank has insufficient stablecoin reserves." };
      if (amount > 500_000) return { success: false, error: "Per-transaction limit is 500,000 USD." };

      setUserUsd(prev => prev - amount);
      setUserStable(prev => prev + amount);
      setBankUsd(prev => prev + amount);
      setBankStable(prev => prev - amount);
      
      addHistory("Buy USDT", `Bought ${amount} USDT for ${amount} USD`);
      return { success: true };
    },

    // USDT -> USD (1:1)
    sellStable: (amount) => {
      if (!amount || amount <= 0) return { success: false, error: "Enter a positive amount." };
      if (amount > userStable) return { success: false, error: "Insufficient user stablecoins." };
      if (amount > bankUsd) return { success: false, error: "Bank has insufficient USD." };
      if (amount > 500_000) return { success: false, error: "Per-transaction limit is 500,000 USDT." };

      setUserStable(prev => prev - amount);
      setUserUsd(prev => prev + amount);
      setBankUsd(prev => prev - amount);
      setBankStable(prev => prev + amount);
      
      addHistory("Sell USDT", `Sold ${amount} USDT, received ${amount} USD`);
      return { success: true };
    },

    // USDT -> BTC
    buyCrypto: (usdtAmount) => {
      if (!usdtAmount || usdtAmount <= 0) return { success: false, error: "Enter a positive amount." };
      if (usdtAmount > 1_000_000) return { success: false, error: "Per-transaction limit is 1,000,000 USDT." };
      if (usdtAmount > userStable) return { success: false, error: "Insufficient stablecoin balance." };
      if (usdtAmount > marketUsdtLiquidity) return { success: false, error: "Insufficient market liquidity." };

      const cryptoBought = usdtAmount / cryptoPrice;
      setUserStable(prev => +(prev - usdtAmount).toFixed(6));
      setUserCrypto(prev => +(prev + cryptoBought).toFixed(8));
      setMarketUsdtLiquidity(prev => +(prev + usdtAmount).toFixed(2));
      
      addHistory("Buy BTC", `Spent ${usdtAmount} USDT, received ${cryptoBought.toFixed(6)} BTC (from market)`);
      return { success: true };
    },

    // BTC -> USDT
    sellCrypto: (cryptoAmount) => {
      if (!cryptoAmount || cryptoAmount <= 0) return { success: false, error: "Enter a positive amount." };
      if (cryptoAmount > userCrypto) return { success: false, error: "Insufficient BTC balance." };
      
      const receiveUsdt = +(cryptoAmount * cryptoPrice).toFixed(2);
      if (receiveUsdt > marketUsdtLiquidity) return { success: false, error: "Insufficient market liquidity." };

      setUserCrypto(prev => +(prev - cryptoAmount).toFixed(8));
      setUserStable(prev => +(prev + receiveUsdt).toFixed(2));
      setMarketUsdtLiquidity(prev => +(prev - receiveUsdt).toFixed(2));
      
      addHistory("Sell BTC", `Sold ${cryptoAmount} BTC, received ${receiveUsdt} USDT (to market)`);
      return { success: true };
    },

    // Combined operations for Simplified View
    // USD -> BTC (via USDT) - shows two separate transactions
    buyCryptoWithUsd: (usdAmount) => {
      if (!usdAmount || usdAmount <= 0) return { success: false, error: "Enter a positive amount." };
      if (usdAmount > 500_000) return { success: false, error: "Per-transaction limit is 500,000 USD." };
      if (usdAmount > userUsd) return { success: false, error: "Insufficient USD balance." };
      if (usdAmount > bankStable) return { success: false, error: "Bank has insufficient stablecoin reserves." };
      if (usdAmount > marketUsdtLiquidity) return { success: false, error: "Insufficient market liquidity." };

      // Two transactions under the hood:
      // 1. USD -> USDT (1:1)
      const usdtAmount = usdAmount; // 1:1 conversion
      setUserUsd(prev => prev - usdAmount);
      setUserStable(prev => +(prev + usdtAmount).toFixed(6)); // Hidden from user
      setBankUsd(prev => prev + usdAmount);
      setBankStable(prev => +(prev - usdtAmount).toFixed(2));
      addHistory("Buy USDT", `Bought ${usdtAmount} USDT for ${usdAmount} USD`);

      // 2. USDT -> BTC (at market rate)
      const cryptoBought = usdtAmount / cryptoPrice;
      setUserStable(prev => +(prev - usdtAmount).toFixed(6));
      setUserCrypto(prev => +(prev + cryptoBought).toFixed(8));
      setMarketUsdtLiquidity(prev => +(prev + usdtAmount).toFixed(2));
      addHistory("Buy BTC", `Spent ${usdtAmount} USDT, received ${cryptoBought.toFixed(6)} BTC (from market)`);
      
      return { success: true };
    },

    // BTC -> USD (via USDT) - shows two separate transactions
    sellCryptoForUsd: (usdAmount) => {
      if (!usdAmount || usdAmount <= 0) return { success: false, error: "Enter a positive amount." };
      if (usdAmount > 500_000) return { success: false, error: "Per-transaction limit is 500,000 USD." };
      if (usdAmount > marketUsdtLiquidity) return { success: false, error: "Insufficient market liquidity." };
      
      const cryptoToSellAmount = usdAmount / cryptoPrice;
      if (cryptoToSellAmount > userCrypto) return { success: false, error: "Insufficient BTC balance." };

      // Two transactions under the hood:
      // 1. BTC -> USDT (at market rate)
      const usdtReceived = usdAmount; // 1:1 conversion
      setUserCrypto(prev => +(prev - cryptoToSellAmount).toFixed(8));
      setUserStable(prev => +(prev + usdtReceived).toFixed(6)); // Hidden from user
      setMarketUsdtLiquidity(prev => +(prev - usdtReceived).toFixed(2));
      addHistory("Sell BTC", `Sold ${cryptoToSellAmount.toFixed(6)} BTC, received ${usdtReceived} USDT (to market)`);

      // 2. USDT -> USD (1:1)
      setUserStable(prev => +(prev - usdtReceived).toFixed(6));
      setUserUsd(prev => prev + usdAmount);
      setBankUsd(prev => prev - usdAmount);
      setBankStable(prev => +(prev + usdtReceived).toFixed(2));
      addHistory("Sell USDT", `Sold ${usdtReceived} USDT, received ${usdAmount} USD`);
      
      return { success: true };
    },

    // Reset all values
    reset: () => {
      setBankUsd(1_000_000);
      setBankStable(1_000_000);
      setUserUsd(10_000);
      setUserStable(0);
      setUserCrypto(0);
      setCryptoPrice(INITIAL_CRYPTO_PRICE);
      setMarketUsdtLiquidity(5_000_000);
      setHistory([]);
    }
  };

  // Computed values
  const computedValues = {
    maxSpendUsd: useMemo(() => Math.max(0, userUsd), [userUsd]),
    maxSpendStable: useMemo(() => Math.max(0, userStable), [userStable]),
    maxSellCrypto: useMemo(() => Math.max(0, userCrypto), [userCrypto]),
    cryptoIfBuy: (usdtAmount) => (cryptoPrice > 0 ? usdtAmount / cryptoPrice : 0),
    usdtIfSell: (cryptoAmount) => +(cryptoAmount * cryptoPrice).toFixed(2),
    cryptoIfBuyWithUsd: (usdAmount) => (cryptoPrice > 0 ? usdAmount / cryptoPrice : 0),
    cryptoToSellForUsd: (usdAmount) => (cryptoPrice > 0 ? usdAmount / cryptoPrice : 0)
  };

  return {
    // State
    bankUsd,
    bankStable,
    userUsd,
    userStable,
    userCrypto,
    cryptoPrice,
    marketUsdtLiquidity,
    history,
    
    // Setters
    setBankUsd,
    setBankStable,
    setUserUsd,
    setUserStable,
    setUserCrypto,
    setCryptoPrice,
    setMarketUsdtLiquidity,
    
    // Transaction methods
    ...transactionMethods,
    
    // Computed values
    ...computedValues,
    
    // Constants
    INITIAL_CRYPTO_PRICE
  };
}
