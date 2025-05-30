import React, { useState } from "react";

/**
 * SplitMate Page: Bill splitter with default & custom names/shares
 */
// PUBLIC_INTERFACE
function SplitMatePage() {
  const [amount, setAmount] = useState("");
  const [numPeople, setNumPeople] = useState(2);
  const [names, setNames] = useState(["", ""]);
  const [shares, setShares] = useState(["", ""]);
  const [useCustomShares, setUseCustomShares] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  // PUBLIC_INTERFACE
  function handleChange(idx, field, value) {
    if (field === "name") {
      setNames((prev) =>
        prev.map((n, i) => (i === idx ? value : n))
      );
    } else if (field === "share") {
      setShares((prev) =>
        prev.map((s, i) => (i === idx ? value : s))
      );
    }
  }

  function handleNumPeopleChange(n) {
    n = Math.max(1, Math.round(Number(n) || 1));
    setNumPeople(n);
    setNames(Array(n).fill("").map((v, i) => names[i] || ""));
    setShares(Array(n).fill("").map((v, i) => shares[i] || ""));
  }

  function resetAll() {
    setAmount("");
    setNumPeople(2);
    setNames(["", ""]);
    setShares(["", ""]);
    setResults(null);
    setError("");
    setUseCustomShares(false);
  }

  function validate() {
    if (amount === "" || Number(amount) <= 0)
      return "Enter a valid total amount (positive number).";
    if (!numPeople || numPeople < 1) return "At least one person required.";
    if (useCustomShares) {
      let sum = 0;
      for (let i = 0; i < numPeople; ++i) {
        const percent = Number(shares[i] || 0);
        if (isNaN(percent) || percent < 0)
          return `Invalid share % for person #${i + 1}`;
        sum += percent;
      }
      if (Math.abs(sum - 100) > 0.01)
        return "Custom percentages must sum to 100%";
    }
    return null;
  }

  // PUBLIC_INTERFACE
  function split() {
    const err = validate();
    if (err) {
      setError(err);
      setResults(null);
      return;
    }
    setError("");
    let peopleArr = [];
    if (!useCustomShares) {
      // Equal split
      let amt = Number(amount) / numPeople;
      amt = Math.round(amt * 100) / 100;
      for (let i = 0; i < numPeople; ++i) {
        peopleArr.push({
          name: names[i] ? names[i] : `Person ${i + 1}`,
          share: amt,
        });
      }
    } else {
      for (let i = 0; i < numPeople; ++i) {
        let perc = Number(shares[i] || 0);
        const amt = Math.round((perc / 100 * Number(amount)) * 100) / 100;
        peopleArr.push({
          name: names[i] ? names[i] : `Person ${i + 1}`,
          share: amt,
        });
      }
    }
    setResults(peopleArr);
  }

  return (
    <div className="flex flex-col items-center px-2 py-7">
      <div className="max-w-xl w-full bg-[#22232a] rounded-xl shadow-xl p-5 md:p-8 mt-3">
        <div className="mb-5 flex items-center gap-2">
          <span className="rounded-full bg-[#38bdf8] w-6 h-6 flex items-center justify-center shadow-[0_0_10px_#38bdf8] font-bold text-lg text-[#18181b]">S</span>
          <span className="font-extrabold text-2xl bg-gradient-to-r from-[#38bdf8] to-blue-100 text-transparent bg-clip-text">SplitMate</span>
        </div>
        <p className="opacity-75 text-sm mb-3">
          Bill splitter: Choose equal or custom shares.
        </p>
        <form
          onSubmit={e => {
            e.preventDefault();
            split();
          }}
        >
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Total Amount"
                min="0"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-36 bg-[#0f172a] border border-[#222] text-white rounded px-2 py-[5px] outline-none focus:ring-2 focus:ring-cyan-400/60"
                required
              />
              <input
                type="number"
                placeholder="People"
                min="1"
                max="15"
                value={numPeople}
                onChange={e => handleNumPeopleChange(e.target.value)}
                className="w-20 bg-[#0f172a] border border-[#222] text-white rounded px-2 py-[5px] outline-none focus:ring-2 focus:ring-cyan-400/60"
                required
              />
              <button
                type="button"
                title="Reset all names/shares"
                className="rounded bg-[#222] px-3 py-1 ml-1 text-xs hover:bg-[#333] text-cyan-200"
                onClick={resetAll}
              >
                Reset
              </button>
            </div>
            <div className="flex gap-2 items-center mt-2">
              <label className="text-sm select-none inline-flex gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustomShares}
                  onChange={e => setUseCustomShares(e.target.checked)}
                  className="accent-[#38bdf8]"
                />
                Custom shares
              </label>
              <span className="opacity-50 text-xs">
                ({useCustomShares
                  ? "Edit % for each" : "All split equal"})
              </span>
            </div>
            {Array.from({ length: numPeople }).map((_, idx) => (
              <div
                className="grid grid-cols-10 gap-2 py-1"
                key={idx}
                style={{ border: "none" }}
              >
                <input
                  className="col-span-4 bg-[#10141b] border border-[#232] rounded px-2 py-[5px] text-white"
                  placeholder={`Name #${idx + 1}`}
                  value={names[idx] || ""}
                  onChange={e => handleChange(idx, "name", e.target.value)}
                />
                {useCustomShares ? (
                  <input
                    type="number"
                    className="col-span-4 bg-[#10141b] border border-[#232] rounded px-2 py-[5px] text-white"
                    placeholder="% Share"
                    value={shares[idx] || ""}
                    onChange={e => handleChange(idx, "share", e.target.value)}
                    min={0}
                    max={100}
                    step={0.01}
                  />
                ) : (
                  <input
                    className="col-span-4 bg-[#10141b] border border-[#232] rounded px-2 py-[5px] text-white opacity-40"
                    placeholder="Equal share"
                    disabled
                  />
                )}
                <span className="col-span-2 self-center text-xs text-cyan-400">
                  {useCustomShares && "%"}
                </span>
              </div>
            ))}
          </div>
          <button
            className="mt-2 rounded-md px-5 py-2 bg-gradient-to-br from-[#38bdf8] to-blue-400 hover:from-cyan-400 hover:to-blue-500 text-[#18181b] font-bold shadow-lg text-sm transition"
            type="submit"
          >
            Split Bill
          </button>
        </form>
        {error && <div className="mt-3 mb-2 rounded p-2 bg-red-500/20 text-red-300 text-xs">{error}</div>}
        {results && (
          <div
            className="animate-fade-in-down mt-6 flex flex-wrap gap-3 justify-center"
          >
            {results.map((r, i) => (
              <div
                key={i}
                className="px-4 py-3 bg-[#1b2532] rounded-lg shadow-cyan-500/20 shadow-sm flex flex-col items-center min-w-[110px]"
              >
                <div className="text-sm font-semibold text-cyan-200">{r.name}</div>
                <div className="text-xl font-bold text-cyan-400 mt-1">₹{r.share.toFixed(2)}</div>
                <div className="text-xs text-blue-200 mt-1">{useCustomShares ? "custom" : "equal"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SplitMatePage;
