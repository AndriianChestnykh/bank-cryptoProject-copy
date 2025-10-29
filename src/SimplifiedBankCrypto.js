import React, { useState, useMemo } from "react";
import { useBankCrypto } from "./hooks/useBankCrypto";
import BalanceCard from "./components/BalanceCard";
import MarketPricing from "./components/MarketPricing";
import TradingForm from "./components/TradingForm";
import TransactionHistory from "./components/TransactionHistory";
import {
  CSS_CLASSES,
  LABELS,
  UI_CONFIG,
  TRANSACTION_LIMITS,
  PRICING
} from "./constants";
import { formatCrypto } from "./utils/currencyFormatting";

export default function SimplifiedBankCrypto() {
  const [showMarketPricing, setShowMarketPricing] = useState(UI_CONFIG.DEFAULT_SHOW_MARKET_PRICING);

  const {
    bankUsd, bankStable, userUsd, userStable, userCrypto, cryptoPrice, marketLiquidity, transactionHistory,
    setBankUsd, setBankStable, setUserUsd, setUserStable, setUserCrypto, setCryptoPrice, setMarketLiquidity,
    buyCryptoWithUsd, sellCryptoForUsd, reset, maxSpendUsd, cryptoIfBuyWithUsd, cryptoToSellForUsd,
    INITIAL_CRYPTO_PRICE
  } = useBankCrypto();

  const [spendUsdAmount, setSpendUsdAmount] = useState(0);
  const cryptoIfBuyCalculated = useMemo(() => cryptoIfBuyWithUsd(spendUsdAmount), [spendUsdAmount, cryptoPrice]);

  const [receiveUsdAmount, setReceiveUsdAmount] = useState(0);
  const cryptoToSellCalculated = useMemo(() => cryptoToSellForUsd(receiveUsdAmount), [receiveUsdAmount, cryptoPrice]);
  function handleBuyCrypto() {
    const result = buyCryptoWithUsd(Number(spendUsdAmount));
    if (!result.success) {
      alert(result.error);
      return;
    }
    setSpendUsdAmount(0);
  }

  function handleSellCrypto() {
    const result = sellCryptoForUsd(Number(receiveUsdAmount));
    if (!result.success) {
      alert(result.error);
      return;
    }
    setReceiveUsdAmount(0);
  }

  function handleReset() {
    reset();
    setSpendUsdAmount(0);
    setReceiveUsdAmount(0);
  }

  const handlePriceChange = (e) => {
    const value = Math.max(PRICING.MIN_CRYPTO_PRICE, Math.min(PRICING.MAX_CRYPTO_PRICE, Number(e.target.value)));
    setCryptoPrice(value);
  };

  const handleResetPrice = () => setCryptoPrice(INITIAL_CRYPTO_PRICE);

  return (
    <div className={CSS_CLASSES.CONTAINER}>
      <div className={CSS_CLASSES.MAX_WIDTH_6XL}>
        {/* Main trading interface */}
        <div className={CSS_CLASSES.GRID_3_COL}>
          {/* Left: Bank overview */}
          <section className={CSS_CLASSES.SECTION_SPACING}>
            <h2 className="text-2xl font-semibold">{LABELS.BANK_DASHBOARD}</h2>
            <p className="text-sm text-gray-600">{LABELS.SIMPLIFIED_INTERFACE_NOTE}</p>

            <div className={CSS_CLASSES.CARD_BG}>
              <h3 className="font-medium">{LABELS.BANK_BALANCES}</h3>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <BalanceCard
                  value={bankUsd}
                  currency="USD"
                  showSlider={true}
                  min={0}
                  max={TRANSACTION_LIMITS.MAX_BANK_BALANCE}
                  step={UI_CONFIG.RANGE_SLIDER_STEP}
                  onSliderChange={e => setBankUsd(Number(e.target.value))}
                />
                <BalanceCard
                  value={bankStable}
                  currency="USDT"
                  showSlider={true}
                  min={0}
                  max={TRANSACTION_LIMITS.MAX_BANK_BALANCE}
                  step={UI_CONFIG.RANGE_SLIDER_STEP}
                  onSliderChange={e => setBankStable(Number(e.target.value))}
                />
              </div>
            </div>

            <MarketPricing
              isExpanded={showMarketPricing}
              onToggle={() => setShowMarketPricing(!showMarketPricing)}
              cryptoPrice={cryptoPrice}
              onPriceChange={handlePriceChange}
              onResetPrice={handleResetPrice}
              initialPrice={INITIAL_CRYPTO_PRICE}
            />

            <button onClick={handleReset} className={`w-full ${CSS_CLASSES.BUTTON_SECONDARY}`}>
              {LABELS.RESET_ALL}
            </button>
          </section>

          {/* Middle: User area */}
          <section className={`${CSS_CLASSES.SECTION_SPACING} lg:col-span-2`}>
            <h2 className="text-2xl font-semibold">{LABELS.USER_WALLET}</h2>

            <div className={CSS_CLASSES.CARD_BG}>
              <div className="grid grid-cols-2 gap-3">
                <BalanceCard
                  value={userUsd}
                  currency="USD"
                  showSlider={true}
                  min={0}
                  max={TRANSACTION_LIMITS.MAX_USER_BALANCE_USD}
                  step={UI_CONFIG.RANGE_SLIDER_STEP_SMALL}
                  onSliderChange={e => setUserUsd(Number(e.target.value))}
                />
                <div className="col-span-1">
                  <BalanceCard
                    value={userCrypto}
                    currency="BTC"
                    showSlider={false}
                    cryptoPrice={cryptoPrice}
                  />
                </div>
              </div>
            </div>

            {/* Direct USD to Crypto trading */}
            <TradingForm
              title="BTC / USD"
              fields={[
                {
                  label: LABELS.AMOUNT_TO_SPEND,
                  maxValue: Math.min(maxSpendUsd, TRANSACTION_LIMITS.MAX_PER_TRANSACTION_USD),
                  value: spendUsdAmount,
                  onChange: e => setSpendUsdAmount(Number(e.target.value)),
                  onSubmit: handleBuyCrypto,
                  onMax: () => setSpendUsdAmount(Math.min(maxSpendUsd, TRANSACTION_LIMITS.MAX_PER_TRANSACTION_USD)),
                  submitButtonText: "Buy BTC",
                  submitButtonClass: CSS_CLASSES.BUTTON_SUCCESS,
                  preview: `${LABELS.YOU_WILL_RECEIVE} ${formatCrypto(cryptoIfBuyCalculated)} ${LABELS.AT_PRICE} $${cryptoPrice}.`
                },
                {
                  label: LABELS.AMOUNT_TO_RECEIVE,
                  maxValue: Math.min(userCrypto * cryptoPrice, TRANSACTION_LIMITS.MAX_PER_TRANSACTION_USD),
                  value: receiveUsdAmount,
                  onChange: e => setReceiveUsdAmount(Number(e.target.value)),
                  onSubmit: handleSellCrypto,
                  onMax: () => setReceiveUsdAmount(Math.min(userCrypto * cryptoPrice, TRANSACTION_LIMITS.MAX_PER_TRANSACTION_USD)),
                  submitButtonText: "Sell BTC",
                  submitButtonClass: CSS_CLASSES.BUTTON_DANGER,
                  preview: `${LABELS.YOU_WILL_SELL} ${formatCrypto(cryptoToSellCalculated)} ${LABELS.AT_PRICE} $${cryptoPrice}.`
                }
              ]}
            />
          </section>
        </div>

        {/* Transaction history at the bottom */}
        <TransactionHistory history={transactionHistory} />
      </div>
    </div>
  );
}
