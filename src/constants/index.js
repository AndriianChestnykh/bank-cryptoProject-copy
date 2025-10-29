// Application constants for Bank Crypto Simulator
// This file centralizes all magic numbers, strings, and configuration values

// ===== CURRENCY TYPES =====
export const CURRENCY_TYPES = {
  USD: 'USD',
  STABLE: 'STABLE', // Generic stablecoin (USDT, USDC, etc.)
  CRYPTO: 'CRYPTO'  // Generic crypto (BTC, ETH, etc.)
};

// ===== INITIAL BALANCES =====
export const INITIAL_BALANCES = {
  BANK_USD: 1_000_000,
  BANK_STABLE: 1_000_000,
  USER_USD: 10_000,
  USER_STABLE: 0,
  USER_CRYPTO: 0,
  MARKET_LIQUIDITY: 5_000_000
};

// ===== PRICING =====
export const PRICING = {
  INITIAL_CRYPTO_PRICE: 100_000,
  MIN_CRYPTO_PRICE: 0,
  MAX_CRYPTO_PRICE: 1_000_000,
  PRICE_STEP: 1_000
};

// ===== TRANSACTION LIMITS =====
export const TRANSACTION_LIMITS = {
  MAX_PER_TRANSACTION_USD: 500_000,
  MAX_PER_TRANSACTION_STABLE: 500_000,
  MAX_PER_TRANSACTION_CRYPTO: 1_000_000,
  MAX_USER_BALANCE_USD: 200_000,
  MAX_USER_BALANCE_STABLE: 100_000,
  MAX_BANK_BALANCE: 5_000_000
};

// ===== PRECISION =====
export const PRECISION = {
  USD_DECIMALS: 2,
  STABLE_DECIMALS: 6,
  CRYPTO_DECIMALS: 8,
  LIQUIDITY_DECIMALS: 2
};

// ===== UI CONFIGURATION =====
export const UI_CONFIG = {
  DEFAULT_SHOW_MARKET_PRICING: true,
  TRANSACTION_HISTORY_MAX_HEIGHT: '16rem', // 64 in Tailwind
  RANGE_SLIDER_STEP: 1_000,
  RANGE_SLIDER_STEP_SMALL: 100
};

// ===== TRANSACTION TYPES =====
export const TRANSACTION_TYPES = {
  BUY_STABLE: 'Buy USDT',
  SELL_STABLE: 'Sell USDT',
  BUY_CRYPTO: 'Buy BTC',
  SELL_CRYPTO: 'Sell BTC'
};

// ===== ERROR MESSAGES =====
export const ERROR_MESSAGES = {
  INVALID_AMOUNT: 'Enter a positive amount.',
  INSUFFICIENT_USER_USD: 'Insufficient user USD.',
  INSUFFICIENT_USER_STABLE: 'Insufficient user stablecoins.',
  INSUFFICIENT_USER_CRYPTO: 'Insufficient BTC balance.',
  INSUFFICIENT_BANK_USD: 'Bank has insufficient USD.',
  INSUFFICIENT_BANK_STABLE: 'Bank has insufficient stablecoin reserves.',
  INSUFFICIENT_MARKET_LIQUIDITY: 'Insufficient market liquidity.',
  TRANSACTION_LIMIT_USD: 'Per-transaction limit is 500,000 USD.',
  TRANSACTION_LIMIT_STABLE: 'Per-transaction limit is 500,000 USDT.',
  TRANSACTION_LIMIT_CRYPTO: 'Per-transaction limit is 1,000,000 USDT.'
};

// ===== SUCCESS MESSAGES =====
export const SUCCESS_MESSAGES = {
  TRANSACTION_COMPLETED: 'Transaction completed successfully.'
};

// ===== VIEW MODES =====
export const VIEW_MODES = {
  DETAILED: 'detailed',
  SIMPLIFIED: 'simplified'
};

// ===== COMPONENT LABELS =====
export const LABELS = {
  BANK_WALLET: 'Bank Wallet',
  BANK_DASHBOARD: 'Bank Dashboard',
  USER_WALLET: 'User Wallet',
  BANK_BALANCES: 'Bank balances',
  MARKET_PRICING: 'Market / Pricing',
  BTC_PRICE_USD: 'BTC price (USD)',
  RATES_API_NOTE: 'Rates can be fetched from an external API.',
  RESET_ALL: 'Reset all',
  TRANSACTION_HISTORY: 'Transaction History',
  NO_TRANSACTIONS: 'No transactions',
  DETAILED_VIEW: 'Detailed View',
  SIMPLIFIED_VIEW: 'Simplified View',
  SIMPLIFIED_INTERFACE_NOTE: 'Simplified interface - stablecoins work under the hood.',
  EQUIVALENT: 'Equivalent:',
  AMOUNT_TO_SPEND: 'Amount to spend',
  AMOUNT_TO_RECEIVE: 'Amount to receive',
  YOU_WILL_RECEIVE: 'You will receive ~',
  YOU_WILL_SELL: 'You will sell ~',
  AT_PRICE: 'at price',
  MAX: 'Max'
};

// ===== CSS CLASSES =====
export const CSS_CLASSES = {
  CONTAINER: 'min-h-screen bg-gray-50 p-6',
  MAX_WIDTH_7XL: 'max-w-7xl mx-auto',
  MAX_WIDTH_6XL: 'max-w-6xl mx-auto',
  GRID_3_COL: 'grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6',
  GRID_2_COL: 'grid grid-cols-1 xl:grid-cols-2 gap-6 items-start',
  SECTION_SPACING: 'space-y-4',
  CARD_BG: 'bg-gray-100 p-4 rounded-lg',
  WHITE_CARD: 'bg-white p-4 rounded-lg shadow-sm',
  BALANCE_CARD: 'p-3 bg-white rounded shadow-sm',
  MONO_FONT: 'text-xl font-mono',
  BUTTON_PRIMARY: 'py-2 rounded bg-blue-600 text-white',
  BUTTON_SUCCESS: 'py-2 rounded bg-green-600 text-white',
  BUTTON_DANGER: 'py-2 rounded bg-red-500 text-white',
  BUTTON_SECONDARY: 'py-2 rounded bg-gray-500 text-white',
  BUTTON_MAX: 'py-2 px-3 rounded bg-gray-200',
  INPUT_FIELD: 'p-2 rounded border',
  RANGE_SLIDER: 'w-full mt-2',
  HISTORY_CONTAINER: 'bg-white shadow-xl rounded-2xl p-6',
  HISTORY_LIST: 'bg-gray-50 p-4 rounded-lg text-sm text-gray-700 max-h-64 overflow-y-auto'
};

// ===== CONVERSION RATES =====
export const CONVERSION_RATES = {
  USD_TO_STABLE: 1, // 1:1 conversion
  STABLE_TO_USD: 1  // 1:1 conversion
};


