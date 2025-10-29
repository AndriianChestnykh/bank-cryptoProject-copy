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

export default function BankCryptoSimulator() {
  const [showMarketPricing, setShowMarketPricing] = useState(UI_CONFIG.DEFAULT_SHOW_MARKET_PRICING);

  const {
    bankUsd, bankStable, userUsd, userStable, userCrypto, cryptoPrice, marketLiquidity, transactionHistory,
    setBankUsd, setBankStable, setUserUsd, setUserStable, setUserCrypto, setCryptoPrice, setMarketLiquidity,
    buyStable, sellStable, buyCrypto, sellCrypto, reset, 
    maxSpendStable, maxSellCrypto, cryptoIfBuy, stableIfSell, INITIAL_CRYPTO_PRICE
  } = useBankCrypto();

  const [spendStableAmount, setSpendStableAmount] = useState(0);
  const cryptoIfBuyCalculated = useMemo(() => cryptoIfBuy(spendStableAmount), [spendStableAmount, cryptoPrice]);

  const [sellCryptoAmount, setSellCryptoAmount] = useState(0);
  const stableIfSellCalculated = useMemo(() => stableIfSell(sellCryptoAmount), [sellCryptoAmount, cryptoPrice]);

  const [fiatToStable, setFiatToStable] = useState(0);
  const [stableToFiat, setStableToFiat] = useState(0);
  function handleBuyCrypto() {
    const result = buyCrypto(Number(spendStableAmount));
    if (!result.success) {
      alert(result.error);
      return;
    }
    setSpendStableAmount(0);
  }

  function handleSellCrypto() {
    const result = sellCrypto(Number(sellCryptoAmount));
    if (!result.success) {
      alert(result.error);
      return;
    }
    setSellCryptoAmount(0);
  }

  function handleBuyStable() {
    const result = buyStable(Number(fiatToStable));
    if (!result.success) {
      alert(result.error);
      return;
    }
    setFiatToStable(0);
  }

  function handleSellStable() {
    const result = sellStable(Number(stableToFiat));
    if (!result.success) {
      alert(result.error);
      return;
    }
    setStableToFiat(0);
  }

  function handleReset() {
    reset();
    setSpendStableAmount(0);
    setFiatToStable(0);
    setStableToFiat(0);
  }

  const handlePriceChange = (e) => {
    const value = Math.max(PRICING.MIN_CRYPTO_PRICE, Math.min(PRICING.MAX_CRYPTO_PRICE, Number(e.target.value)));
    setCryptoPrice(value);
  };

  const handleResetPrice = () => setCryptoPrice(INITIAL_CRYPTO_PRICE);

  return (
    <div className={CSS_CLASSES.CONTAINER}>
      <div className={CSS_CLASSES.MAX_WIDTH_7XL}>
        {/* Main trading interface */}
        <div className={CSS_CLASSES.GRID_3_COL}>
          {/* Left: Bank overview */}
          <section className={CSS_CLASSES.SECTION_SPACING}>
            <h2 className="text-2xl font-semibold">{LABELS.BANK_WALLET}</h2>

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
                <BalanceCard
                  value={userStable}
                  currency="USDT"
                  showSlider={true}
                  min={0}
                  max={TRANSACTION_LIMITS.MAX_USER_BALANCE_STABLE}
                  step={UI_CONFIG.RANGE_SLIDER_STEP_SMALL}
                  onSliderChange={e => setUserStable(Number(e.target.value))}
                />
                <div className="col-span-2">
                  <BalanceCard
                    value={userCrypto}
                    currency="BTC"
                    showSlider={false}
                    cryptoPrice={cryptoPrice}
                  />
                </div>
              </div>
            </div>

            {/* Trading sections side by side */}
            <div className={CSS_CLASSES.GRID_2_COL}>
              {/* Fiat <-> Stablecoin exchange */}
              <TradingForm
                title="USDT / USD"
                fields={[
                  {
                    label: "Amount",
                    maxValue: Math.min(userUsd, TRANSACTION_LIMITS.MAX_PER_TRANSACTION_USD),
                    value: fiatToStable,
                    onChange: e => setFiatToStable(Number(e.target.value)),
                    onSubmit: handleBuyStable,
                    onMax: () => setFiatToStable(Math.min(userUsd, TRANSACTION_LIMITS.MAX_PER_TRANSACTION_USD)),
                    submitButtonText: "Buy USDT",
                    submitButtonClass: CSS_CLASSES.BUTTON_SUCCESS
                  },
                  {
                    label: "Amount",
                    maxValue: Math.min(userStable, TRANSACTION_LIMITS.MAX_PER_TRANSACTION_STABLE),
                    value: stableToFiat,
                    onChange: e => setStableToFiat(Number(e.target.value)),
                    onSubmit: handleSellStable,
                    onMax: () => setStableToFiat(Math.min(userStable, TRANSACTION_LIMITS.MAX_PER_TRANSACTION_STABLE)),
                    submitButtonText: "Sell USDT",
                    submitButtonClass: CSS_CLASSES.BUTTON_DANGER
                  }
                ]}
              />

              {/* Buy/Sell BTC */}
              <TradingForm
                title="BTC / USDT"
                fields={[
                  {
                    label: "Amount",
                    maxValue: Math.min(maxSpendStable, TRANSACTION_LIMITS.MAX_PER_TRANSACTION_CRYPTO),
                    value: spendStableAmount,
                    onChange: e => setSpendStableAmount(Number(e.target.value)),
                    onSubmit: handleBuyCrypto,
                    onMax: () => setSpendStableAmount(Math.min(maxSpendStable, TRANSACTION_LIMITS.MAX_PER_TRANSACTION_CRYPTO)),
                    submitButtonText: "Buy BTC",
                    submitButtonClass: CSS_CLASSES.BUTTON_SUCCESS
                  },
                  {
                    label: "Amount",
                    maxValue: stableIfSellCalculated,
                    value: stableIfSellCalculated,
                    onChange: e => setSellCryptoAmount(Number(e.target.value) / cryptoPrice),
                    onSubmit: handleSellCrypto,
                    onMax: () => setSellCryptoAmount(maxSellCrypto),
                    submitButtonText: "Sell BTC",
                    submitButtonClass: CSS_CLASSES.BUTTON_DANGER
                  }
                ]}
              />
            </div>
          </section>

        </div>

        {/* Transaction history at the bottom */}
        <TransactionHistory history={transactionHistory} />
      </div>
    </div>
  );
}
