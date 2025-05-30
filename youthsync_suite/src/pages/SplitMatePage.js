import React, { useState } from "react";
import "../styles/splitmate.css";

// Accent icon for error feedback
function ErrorIcon() {
  return (
    <span
      style={{
        color: "#ff4680",
        fontWeight: "bold",
        fontSize: "1.12em",
        marginRight: "0.14em",
        display: "inline-flex",
        alignItems: "center"
      }}
      aria-hidden="true"
    >&#9888;</span>
  );
}

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
    <div className="splitmate-root">
      <div className="splitmate-card">
        <div className="splitmate-header">
          <span className="splitmate-circle">S</span>
          <span className="splitmate-title">SplitMate</span>
        </div>
        <p className="splitmate-desc">
          Bill splitter: Choose equal or custom shares.
        </p>
        <form
          autoComplete="off"
          onSubmit={e => {
            e.preventDefault();
            split();
          }}
          aria-labelledby="splitmate-heading"
          role="region"
        >
          <div className="splitmate-form-row" role="group" aria-label="Bill Split Settings">
            <div className="splitmate-top-inputs">
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="splitmate-amount-input"
                required
                placeholder="Total Amount (₹)"
                aria-label="Total bill amount"
                inputMode="decimal"
              />
              <input
                type="number"
                min="1"
                max="15"
                value={numPeople}
                onChange={e => handleNumPeopleChange(e.target.value)}
                className="splitmate-num-input"
                required
                placeholder="People"
                aria-label="Number of people"
                inputMode="numeric"
              />
              <button
                type="button"
                title="Reset all names/shares"
                className="splitmate-reset-btn"
                onClick={resetAll}
                aria-label="Reset form"
              >
                Reset
              </button>
            </div>
            <div className="splitmate-toggle-row">
              <label className="select-none inline-flex gap-2 cursor-pointer" htmlFor="splitmate-custom-toggle">
                <input
                  id="splitmate-custom-toggle"
                  type="checkbox"
                  checked={useCustomShares}
                  onChange={e => setUseCustomShares(e.target.checked)}
                  className="splitmate-custom-toggle"
                  aria-checked={useCustomShares}
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
                className="splitmate-share-row"
                key={idx}
              >
                <input
                  className="splitmate-name-input"
                  placeholder={`Name #${idx + 1}${names[idx] ? "" : " (e.g. Alex, Priya)"}`}
                  value={names[idx] || ""}
                  onChange={e => handleChange(idx, "name", e.target.value)}
                  aria-label={`Person ${idx + 1} name`}
                  maxLength={18}
                />
                {useCustomShares ? (
                  <input
                    type="number"
                    className="splitmate-share-input"
                    placeholder="% Share"
                    value={shares[idx] || ""}
                    onChange={e => handleChange(idx, "share", e.target.value)}
                    min={0}
                    max={100}
                    step={0.01}
                    aria-label={`% share for person ${idx + 1}`}
                  />
                ) : (
                  <input
                    className="splitmate-equal-input"
                    placeholder="Equal share"
                    disabled
                    aria-label="Equal share"
                  />
                )}
                <span className="self-center splitmate-person-type" aria-label="share type">
                  {useCustomShares && "%"}
                </span>
              </div>
            ))}
          </div>
          <button
            className="splitmate-btn-submit"
            type="submit"
            aria-label="Calculate and split bill"
          >
            Split Bill
          </button>
        </form>
        {error && (
          <div className="splitmate-error" role="alert">
            <ErrorIcon /> {error}
          </div>
        )}
        {results && (
          <section
            className="splitmate-results-row"
            aria-label="Split results"
            tabIndex={-1}
          >
            {results.map((r, i) => (
              <div
                key={i}
                className="splitmate-person-card"
                tabIndex={0}
                aria-label={`${r.name}: ₹${r.share.toFixed(2)} (${useCustomShares ? "custom share" : "equal share"})`}
              >
                <div className="splitmate-person-name">{r.name}</div>
                <div className="splitmate-person-amount">₹{r.share.toFixed(2)}</div>
                <div className="splitmate-person-type">{useCustomShares ? "custom" : "equal"}</div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

export default SplitMatePage;
