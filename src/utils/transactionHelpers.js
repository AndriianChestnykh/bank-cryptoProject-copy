import { PRECISION, CONVERSION_RATES } from '../constants';

export const formatToPrecision = (value, decimals) => {
  return +(value).toFixed(decimals);
};

export const calculateCryptoFromStable = (stableAmount, cryptoPrice) => {
  return stableAmount / cryptoPrice;
};

export const calculateStableFromCrypto = (cryptoAmount, cryptoPrice) => {
  return cryptoAmount * cryptoPrice;
};

export const convertUsdToStable = (usdAmount) => {
  return usdAmount * CONVERSION_RATES.USD_TO_STABLE;
};

export const convertStableToUsd = (stableAmount) => {
  return stableAmount * CONVERSION_RATES.STABLE_TO_USD;
};

export const formatCryptoAmount = (amount) => {
  return formatToPrecision(amount, PRECISION.CRYPTO_DECIMALS);
};

export const formatStableAmount = (amount) => {
  return formatToPrecision(amount, PRECISION.STABLE_DECIMALS);
};

export const formatUsdAmount = (amount) => {
  return formatToPrecision(amount, PRECISION.USD_DECIMALS);
};

export const formatLiquidityAmount = (amount) => {
  return formatToPrecision(amount, PRECISION.LIQUIDITY_DECIMALS);
};
