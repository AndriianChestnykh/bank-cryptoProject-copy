import React, { useState, useMemo } from "react";

// SimplifiedBankCrypto.jsx
// Simplified version where user doesn't see stablecoins but they work under the hood
// User spends USD directly to buy crypto (two transactions happen: USD->USDT, USDT->Crypto)

export default function SimplifiedBankCrypto() {
  const INITIAL_CRYPTO_PRICE = 100000;

  // Bank-side balances
  const [bankUsd, setBankUsd] = useState(1_000_000);
  const [bankStable, setBankStable] = useState(1_000_000);

  // User balances (only USD and Crypto visible to user)
  const [userUsd, setUserUsd] = useState(10_000);
  const [userStable, setUserStable] = useState(0); // Hidden from user
  const [userCrypto, setUserCrypto] = useState(0);

  const [showMarketPricing, setShowMarketPricing] = useState(true);

  // Market/price
  const [cryptoPrice, setCryptoPrice] = useState(INITIAL_CRYPTO_PRICE);
  
  // Market liquidity (simulating open market)
  const [marketUsdtLiquidity, setMarketUsdtLiquidity] = useState(5_000_000);

  // Crypto buy flow (user enters USD amount)
  const [spendUsdAmount, setSpendUsdAmount] = useState(0);
  const maxSpendUsd = useMemo(() => Math.max(0, userUsd), [userUsd]);
  const cryptoIfBuy = useMemo(() => (cryptoPrice > 0 ? spendUsdAmount / cryptoPrice : 0), [spendUsdAmount, cryptoPrice]);

  // Crypto sell flow (user enters USD amount they want to receive)
  const [receiveUsdAmount, setReceiveUsdAmount] = useState(0);
  const maxSellCrypto = useMemo(() => Math.max(0, userCrypto), [userCrypto]);
  const cryptoToSell = useMemo(() => (cryptoPrice > 0 ? receiveUsdAmount / cryptoPrice : 0), [receiveUsdAmount, cryptoPrice]);

  // Transaction history
  const [history, setHistory] = useState([]);
  function addHistory(type, details) {
    setHistory(prev => [{ id: Date.now(), type, details, timestamp: new Date().toLocaleTimeString() }, ...prev]);
  }

  // Handlers
  function handleBuyCrypto() {
    const spendUsd = Number(spendUsdAmount);
    if (!spendUsd || spendUsd <= 0) return alert("Enter a positive amount.");
    if (spendUsd > 500_000) return alert("Per-transaction limit is 500,000 USD.");
    if (spendUsd > userUsd) return alert("Insufficient USD balance.");
    if (spendUsd > bankStable) return alert("Bank has insufficient stablecoin reserves.");
    if (spendUsd > marketUsdtLiquidity) return alert("Insufficient market liquidity.");

    // Two transactions under the hood:
    // 1. USD -> USDT (1:1)
    // 2. USDT -> Crypto (at market rate)
    const usdtAmount = spendUsd; // 1:1 conversion
    const cryptoBought = usdtAmount / cryptoPrice;

    // Update balances
    setUserUsd(prev => prev - spendUsd);
    setUserStable(prev => +(prev + usdtAmount).toFixed(6)); // Hidden from user
    setUserCrypto(prev => +(prev + cryptoBought).toFixed(8));
    setBankUsd(prev => prev + spendUsd);
    setBankStable(prev => +(prev - usdtAmount).toFixed(2));
    setMarketUsdtLiquidity(prev => +(prev + usdtAmount).toFixed(2));
    
    setSpendUsdAmount(0);
    addHistory("Buy BTC", `Spent ${spendUsd} USD, received ${cryptoBought.toFixed(6)} BTC (via USDT)`);
  }

  function handleSellCrypto() {
    const receiveUsd = Number(receiveUsdAmount);
    if (!receiveUsd || receiveUsd <= 0) return alert("Enter a positive amount.");
    if (receiveUsd > 500_000) return alert("Per-transaction limit is 500,000 USD.");
    if (receiveUsd > marketUsdtLiquidity) return alert("Insufficient market liquidity.");
    
    const cryptoToSellAmount = receiveUsd / cryptoPrice;
    if (cryptoToSellAmount > userCrypto) return alert("Insufficient BTC balance.");

    // Two transactions under the hood:
    // 1. Crypto -> USDT (at market rate)
    // 2. USDT -> USD (1:1)
    const usdtReceived = receiveUsd; // 1:1 conversion

    // Update balances
    setUserCrypto(prev => +(prev - cryptoToSellAmount).toFixed(8));
    setUserStable(prev => +(prev - usdtReceived).toFixed(6)); // Hidden from user
    setUserUsd(prev => prev + receiveUsd);
    setBankUsd(prev => prev - receiveUsd);
    setBankStable(prev => +(prev + usdtReceived).toFixed(2));
    setMarketUsdtLiquidity(prev => +(prev - usdtReceived).toFixed(2));
    
    setReceiveUsdAmount(0);
    addHistory("Sell BTC", `Sold ${cryptoToSellAmount.toFixed(6)} BTC, received ${receiveUsd} USD (via USDT)`);
  }

  function handleReset() {
    setBankUsd(1_000_000);
    setBankStable(1_000_000);
    setUserUsd(10_000);
    setUserStable(0);
    setUserCrypto(0);
    setCryptoPrice(INITIAL_CRYPTO_PRICE);
    setMarketUsdtLiquidity(5_000_000);
    setSpendUsdAmount(0);
    setReceiveUsdAmount(0);
    setHistory([]);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Main trading interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left: Bank overview */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Bank Dashboard</h2>
            <p className="text-sm text-gray-600">Simplified interface - stablecoins work under the hood.</p>

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
                  <label className="text-xs text-gray-500">BTC price (USD)</label>
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

            <button onClick={handleReset} className="w-full py-2 rounded bg-grey-500 text-white">Reset all</button>
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
                <div className="col-span-1 p-3 bg-white rounded shadow-sm">
                  <div className="text-xl font-mono">{userCrypto.toFixed(8)} BTC</div>
                  <div className="text-sm text-gray-400 mt-2">Equivalent: ${(userCrypto * cryptoPrice).toFixed(2)} USD</div>
                </div>
              </div>
            </div>

            {/* Direct USD to Crypto trading */}
            <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
              <h3 className="font-medium">BTC / USD</h3>
              <div className="flex-1 space-y-6">
                <div>
                  <label className="text-s text-gray-500">Amount to spend (max {Math.min(maxSpendUsd, 500_000).toFixed(2)})</label>
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <input type="number" min="0" max={Math.min(maxSpendUsd, 500_000)} step="1000" value={spendUsdAmount}
                      onChange={e => setSpendUsdAmount(Number(e.target.value))}
                      className="p-2 rounded border" />
                    <div className="text-sm text-gray-600">You will receive ~ <span className="font-mono">{cryptoIfBuy.toFixed(6)}</span> BTC at price <span className="font-mono">${cryptoPrice}</span>.</div>
                    <div className="flex gap-2">
                      <button onClick={handleBuyCrypto} className="flex-1 py-2 rounded bg-green-600 text-white">Buy BTC</button>
                      <button onClick={() => setSpendUsdAmount(Math.min(maxSpendUsd, 500_000))} className="py-2 px-3 rounded bg-gray-200">Max</button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-s text-gray-500">Amount to receive (max {Math.min(userCrypto * cryptoPrice, 500_000).toFixed(2)})</label>
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <input type="number" min="0" max={Math.min(userCrypto * cryptoPrice, 500_000)} step="1000" value={receiveUsdAmount}
                      onChange={e => setReceiveUsdAmount(Number(e.target.value))}
                      className="p-2 rounded border" />
                    <div className="text-sm text-gray-600">You will sell ~ <span className="font-mono">{cryptoToSell.toFixed(6)}</span> BTC at price <span className="font-mono">${cryptoPrice}</span>.</div>
                    <div className="flex gap-2">
                      <button onClick={handleSellCrypto} className="flex-1 py-2 rounded bg-red-500 text-white">Sell BTC</button>
                      <button onClick={() => setReceiveUsdAmount(Math.min(userCrypto * cryptoPrice, 500_000))} className="py-2 px-3 rounded bg-gray-200">Max</button>
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
