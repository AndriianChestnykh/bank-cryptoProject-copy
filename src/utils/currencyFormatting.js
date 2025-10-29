import { PRECISION } from '../constants';

export const formatUsd = (amount) => {
  return `$${amount.toLocaleString()}`;
};

export const formatUsdt = (amount) => {
  return `${amount.toLocaleString()} USDT`;
};

export const formatStablecoin = (amount) => {
  return formatUsdt(amount);
};

const formatCryptoValue = (amount, decimals = PRECISION.CRYPTO_DECIMALS) => {
  const minDecimals = Math.max(decimals, 6);
  const formatted = amount.toFixed(minDecimals);
  const trimmed = parseFloat(formatted).toFixed(Math.max(2, minDecimals));
  return trimmed;
};

export const formatCrypto = (amount, decimals = PRECISION.CRYPTO_DECIMALS) => {
  return `${formatCryptoValue(amount, decimals)} BTC`;
};

export const formatCryptoWithUsd = (amount, price, decimals = PRECISION.CRYPTO_DECIMALS) => {
  const cryptoFormatted = formatCrypto(amount, decimals);
  const usdEquivalent = (amount * price).toFixed(2);
  return `${cryptoFormatted} - Equivalent: $${usdEquivalent} USD`;
};

export const formatCryptoWithUsdSeparate = (amount, price, decimals = PRECISION.CRYPTO_DECIMALS) => {
  const cryptoValue = formatCryptoValue(amount, decimals);
  const usdEquivalent = (amount * price).toFixed(2);
  
  return {
    mainValue: `${cryptoValue} BTC`,
    usdEquivalent: `Equivalent: $${usdEquivalent} USD`
  };
};

export const getCurrencyType = (currency) => {
  switch (currency) {
    case 'USD':
      return 'usd';
    case 'USDT':
    case 'STABLE':
      return 'stable';
    case 'BTC':
    case 'CRYPTO':
      return 'crypto';
    default:
      return 'default';
  }
};

export const formatCurrency = (amount, currencyType, cryptoPrice = null) => {
  switch (currencyType) {
    case 'usd':
      return formatUsd(amount);
    case 'stable':
      return formatStablecoin(amount);
    case 'crypto':
      if (cryptoPrice) {
        return formatCryptoWithUsdSeparate(amount, cryptoPrice);
      }
      return formatCrypto(amount);
    default:
      return amount.toLocaleString();
  }
};
