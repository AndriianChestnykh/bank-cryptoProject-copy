import React, { useState, useMemo } from "react";

// BankCryptoSimulator.jsx
// React component simulating a bank with USD, stablecoins, and crypto balances.
// Supports fiat ⇄ stablecoin exchange, crypto purchase, and transaction history.

export default function BankCryptoSimulator() {
  const INITIAL_CRYPTO_PRICE = 100000;

  // Bank-side balances
  const [bankUsd, setBankUsd] = useState(1_000_000);
  const [bankStable, setBankStable] = useState(1_000_000);

  // User balances
  const [userUsd, setUserUsd] = useState(10_000);
  const [userStable, setUserStable] = useState(0);
  const [userCrypto, setUserCrypto] = useState(0);

  const [showMarketPricing, setShowMarketPricing] = useState(true);

  // Market/price
  const [cryptoPrice, setCryptoPrice] = useState(INITIAL_CRYPTO_PRICE);
  
  // Market liquidity (simulating open market)
  const [marketUsdtLiquidity, setMarketUsdtLiquidity] = useState(5_000_000);

  // Crypto buy flow
  const [spendStableAmount, setSpendStableAmount] = useState(0);
  const maxSpend = useMemo(() => Math.max(0, userStable), [userStable]);
  const cryptoIfBuy = useMemo(() => (cryptoPrice > 0 ? spendStableAmount / cryptoPrice : 0), [spendStableAmount, cryptoPrice]);

  // Crypto sell flow
  const [sellCryptoAmount, setSellCryptoAmount] = useState(0);
  const maxSellCrypto = useMemo(() => Math.max(0, userCrypto), [userCrypto]);
  const stableIfSell = useMemo(() => +(sellCryptoAmount * cryptoPrice).toFixed(2), [sellCryptoAmount, cryptoPrice]);

  // Stablecoin ⇄ Fiat flows
  const [fiatToStable, setFiatToStable] = useState(0);
  const [stableToFiat, setStableToFiat] = useState(0);

  // Transaction history
  const [history, setHistory] = useState([]);
  function addHistory(type, details) {
    setHistory(prev => [{ id: Date.now(), type, details, timestamp: new Date().toLocaleTimeString() }, ...prev]);
  }

  // Handlers
  function handleBuyCrypto() {
    const spend = Number(spendStableAmount);
    if (!spend || spend <= 0) return alert("Enter a positive amount.");
    if (spend > 1_000_000) return alert("Per-transaction limit is 1,000,000 USDT.");
    if (spend > userStable) return alert("Insufficient stablecoin balance.");
    if (spend > marketUsdtLiquidity) return alert("Insufficient market liquidity.");

    const cryptoBought = spend / cryptoPrice;
    setUserStable(prev => +(prev - spend).toFixed(6));
    setUserCrypto(prev => +(prev + cryptoBought).toFixed(8));
    setMarketUsdtLiquidity(prev => +(prev + spend).toFixed(2));
    setSpendStableAmount(0);
    addHistory("Buy BTC", `Spent ${spend} USDT, received ${cryptoBought.toFixed(6)} BTC (from market)`);
  }

  function handleSellCrypto() {
    const cryptoAmt = Number(sellCryptoAmount);
    if (!cryptoAmt || cryptoAmt <= 0) return alert("Enter a positive amount.");
    if (cryptoAmt > userCrypto) return alert("Insufficient BTC balance.");
    const receiveStable = +(cryptoAmt * cryptoPrice).toFixed(2);
    if (receiveStable > marketUsdtLiquidity) return alert("Insufficient market liquidity.");

    setUserCrypto(prev => +(prev - cryptoAmt).toFixed(8));
    setUserStable(prev => +(prev + receiveStable).toFixed(2));
    setMarketUsdtLiquidity(prev => +(prev - receiveStable).toFixed(2));
    setSellCryptoAmount(0);
    addHistory("Sell BTC", `Sold ${cryptoAmt} BTC, received ${receiveStable} USDT (to market)`);
  }

  function handleBuyStable() {
    const amt = Number(fiatToStable);
    if (!amt || amt <= 0) return alert("Enter a positive amount.");
    if (amt > userUsd) return alert("Insufficient user USD.");
    if (amt > bankStable) return alert("Bank has insufficient stablecoin reserves.");
    if (amt > 500_000) return alert("Per-transaction limit is 500,000 USD.");

    setUserUsd(prev => prev - amt);
    setUserStable(prev => prev + amt);
    setBankUsd(prev => prev + amt);
    setBankStable(prev => prev - amt);
    setFiatToStable(0);
    addHistory("Buy Stable", `Bought ${amt} USDT for ${amt} USD`);
  }

  function handleSellStable() {
    const amt = Number(stableToFiat);
    if (!amt || amt <= 0) return alert("Enter a positive amount.");
    if (amt > userStable) return alert("Insufficient user stablecoins.");
    if (amt > bankUsd) return alert("Bank has insufficient USD.");
    if (amt > 500_000) return alert("Per-transaction limit is 500,000 USDT.");

    setUserStable(prev => prev - amt);
    setUserUsd(prev => prev + amt);
    setBankUsd(prev => prev - amt);
    setBankStable(prev => prev + amt);
    setStableToFiat(0);
    addHistory("Sell Stable", `Sold ${amt} USDT, received ${amt} USD`);
  }

  function handleReset() {
    setBankUsd(1_000_000);
    setBankStable(1_000_000);
    setUserUsd(10_000);
    setUserStable(0);
    setUserCrypto(0);
    setCryptoPrice(INITIAL_CRYPTO_PRICE);
    setMarketUsdtLiquidity(5_000_000);
    setSpendStableAmount(0);
    setFiatToStable(0);
    setStableToFiat(0);
    setHistory([]);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Main trading interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left: Bank overview */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Bank Wallet</h2>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-medium">Bank balances</h3>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-white rounded shadow-sm">
                  <div className="text-xl font-mono">${bankUsd.toLocaleString()}</div>
                  <input type="range" min="0" max="5000000" step="1000" value={bankUsd}
                    onChange={e => setBankUsd(Number(e.target.value))}
                    className="w-full mt-2" />
                </div>
                <div className="p-3 bg-white rounded shadow-sm">
                  <div className="text-xl font-mono">{bankStable.toLocaleString()} USDT</div>
                  <input type="range" min="0" max="5000000" step="1000" value={bankStable}
                    onChange={e => setBankStable(Number(e.target.value))}
                    className="w-full mt-2" />
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-medium flex justify-between items-center">
                Market / Pricing
                <button
                  onClick={() => setShowMarketPricing(!showMarketPricing)}
                  className="ml-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                  aria-expanded={showMarketPricing}
                >
                  <svg
                    className={`w-4 h-4 transform transition-transform ${showMarketPricing ? 'rotate-180' : 'rotate-0'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
              </h3>
              {showMarketPricing && (
                <div className="mt-3">
                  <label className="text-s text-gray-500">BTC price (USD)</label>
                  <div className="mt-1 flex gap-2 items-center">
                    <input type="number" value={cryptoPrice} min="0" max="1000000" step="1000"
                      onChange={e => {
                        const v = Math.max(0, Math.min(1000000, Number(e.target.value)));
                        setCryptoPrice(v);
                      }}
                      className="w-full p-2 rounded border" />
                    <button className="px-3 py-2 bg-gray-500 text-white rounded" onClick={() => setCryptoPrice(INITIAL_CRYPTO_PRICE)}>Reset</button>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">Rates can be fetched from an external API.</div>
                </div>
              )}
            </div>

            <button onClick={handleReset} className="w-full py-2 rounded bg-gray-500 text-white">Reset all</button>
          </section>

          {/* Middle: User area */}
          <section className="space-y-4 lg:col-span-2">
            <h2 className="text-2xl font-semibold">User Wallet</h2>

            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded shadow-sm">
                  <div className="text-xl font-mono">${userUsd.toLocaleString()}</div>
                  <input type="range" min="0" max="200000" step="100" value={userUsd}
                    onChange={e => setUserUsd(Number(e.target.value))}
                    className="w-full mt-2" />
                </div>
                <div className="p-3 bg-white rounded shadow-sm">
                  <div className="text-xl font-mono">{userStable.toLocaleString()} USDT</div>
                  <input type="range" min="0" max="100000" step="100" value={userStable}
                    onChange={e => setUserStable(Number(e.target.value))}
                    className="w-full mt-2" />
                </div>
                <div className="col-span-2 p-3 bg-white rounded shadow-sm">
                  <div className="text-xl font-mono">{userCrypto.toFixed(8)} BTC</div>
                  <div className="text-s text-gray-500 mt-2">Equivalent: ${(userCrypto * cryptoPrice).toFixed(2)} USD</div>
                </div>
              </div>
            </div>

            {/* Trading sections side by side */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
              {/* Fiat <-> Stablecoin exchange */}
              <div className="bg-white p-4 rounded-lg shadow-sm space-y-3 flex flex-col h-full">
                <h3 className="font-medium">USDT / USD</h3>
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="text-s text-gray-500">Amount (max {Math.min(userUsd, 500_000).toFixed(2)})</label>
                    <div className="mt-3 grid grid-cols-1 gap-2">
                      <input type="number" min="0" max={Math.min(userUsd, 500_000)} value={fiatToStable}
                        onChange={e => setFiatToStable(Number(e.target.value))}
                        className="p-2 rounded border" />
                      <div className="flex gap-2">
                        <button onClick={handleBuyStable} className="flex-1 py-2 rounded bg-green-600 text-white">Buy USDT</button>
                        <button onClick={() => setFiatToStable(Math.min(userUsd, 500_000))} className="py-2 px-3 rounded bg-gray-200">Max</button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-s text-gray-500">Amount (max {Math.min(userStable, 500_000).toFixed(2)})</label>
                    <div className="mt-3 grid grid-cols-1 gap-2">
                      <input type="number" min="0" max={Math.min(userStable, 500_000)} value={stableToFiat}
                        onChange={e => setStableToFiat(Number(e.target.value))}
                        className="p-2 rounded border" />
                      <div className="flex gap-2">
                        <button onClick={handleSellStable} className="flex-1 py-2 rounded bg-red-500 text-white">Sell USDT</button>
                        <button onClick={() => setStableToFiat(Math.min(userStable, 500_000))} className="py-2 px-3 rounded bg-gray-200">Max</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buy/Sell BTC */}
              <div className="bg-white p-4 rounded-lg shadow-sm space-y-3 flex flex-col h-full">
                <h3 className="font-medium">BTC / USDT</h3>
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="text-s text-gray-500">Amount (max {Math.min(maxSpend, 1_000_000).toFixed(2)})</label>
                    <div className="mt-3 grid grid-cols-1 gap-2">
                      <input type="number" min="0" max={Math.min(maxSpend, 1_000_000)} step="1000" value={spendStableAmount}
                        onChange={e => setSpendStableAmount(Number(e.target.value))}
                        className="p-2 rounded border" />
                      <div className="flex gap-2">
                        <button onClick={handleBuyCrypto} className="flex-1 py-2 rounded bg-green-600 text-white">Buy BTC</button>
                        <button onClick={() => setSpendStableAmount(Math.min(maxSpend, 1_000_000))} className="py-2 px-3 rounded bg-gray-200">Max</button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-s text-gray-500">Amount (max {stableIfSell.toFixed(2)})</label>
                    <div className="mt-3 grid grid-cols-1 gap-2">
                      <input type="number" min="0" max={stableIfSell} step="1000" value={stableIfSell}
                        onChange={e => setSellCryptoAmount(Number(e.target.value) / cryptoPrice)}
                        className="p-2 rounded border" />
                      <div className="flex gap-2">
                        <button onClick={handleSellCrypto} className="flex-1 py-2 rounded bg-red-500 text-white">Sell BTC</button>
                        <button onClick={() => setSellCryptoAmount(maxSellCrypto)} className="py-2 px-3 rounded bg-gray-200">Max</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Transaction history at the bottom */}
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 max-h-64 overflow-y-auto">
            {history.length === 0 && <div className="text-gray-400">No transactions</div>}
            <ul className="space-y-2">
              {history.map(tx => (
                <li key={tx.id} className="p-3 bg-white rounded shadow-sm">
                  <div className="font-medium text-gray-800">{tx.type}</div>
                  <div className="text-xs text-gray-600">{tx.details}</div>
                  <div className="text-xs text-gray-400">{tx.timestamp}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
