import React, { useState, useRef, useEffect } from "react";
import CircularProgress from "../components/CircularProgress";
import "../styles/focusflow.css";

/**
 * FocusFlow Page: Polished Pomodoro timer —
 * Modern, energetic yet focused UI with strong visual feedback and polished controls.
 */
// PUBLIC_INTERFACE
function FocusFlowPage() {
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [timerOn, setTimerOn] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [input, setInput] = useState(duration);
  const [sessionInc, setSessionInc] = useState(false); // Animation flag for completed
  const timerRef = useRef(null);

  // Timer ticking effect
  useEffect(() => {
    if (timerOn) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setTimerOn(false);
            setCompleted((c) => c + 1);
            setSessionInc(true);
            // Simple sound alert
            try {
              const ctx = new (window.AudioContext || window.webkitAudioContext)();
              const o = ctx.createOscillator();
              o.type = "sine";
              o.frequency.value = 880;
              o.connect(ctx.destination);
              o.start();
              o.stop(ctx.currentTime + 0.16);
            } catch {}
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerOn]);

  // Reset session increment animation state after a short duration
  useEffect(() => {
    if (sessionInc) {
      const t = setTimeout(() => setSessionInc(false), 700);
      return () => clearTimeout(t);
    }
  }, [sessionInc]);

  // Ensure if duration changes, update timeLeft and input
  useEffect(() => {
    setTimeLeft(duration * 60);
    setInput(duration);
  }, [duration]);

  // PUBLIC_INTERFACE
  function startPause() {
    if (timerOn) setTimerOn(false);
    else {
      if (timeLeft === 0) reset();
      setTimerOn(true);
    }
  }
  // PUBLIC_INTERFACE
  function reset() {
    setTimerOn(false);
    setTimeLeft(duration * 60);
  }
  // PUBLIC_INTERFACE
  function handleChange(e) {
    let v = Math.max(5, Math.min(Number(e.target.value) || 25, 120));
    setInput(v);
  }
  // PUBLIC_INTERFACE
  function setCustom() {
    setDuration(input);
    setTimeLeft(input * 60);
    setTimerOn(false);
  }
  // PUBLIC_INTERFACE
  function formatTime(sec) {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  }
  // PUBLIC_INTERFACE
  function focusSummary(cnt) {
    if (cnt === 0) return "No completed sessions yet.";
    if (cnt < 3) return "Great start! Keep going.";
    if (cnt < 6) return "You're on a roll!";
    return "Incredible streak!";
  }

  // Main Render - modern card, visually grouped controls, timer focus, animation for active state & session count
  return (
    <div className="focusflow-root">
      <div className="focusflow-card">
        <div className="focusflow-header">
          <span className="focusflow-circle" aria-hidden="true">F</span>
          <span className="focusflow-title">FocusFlow</span>
        </div>
        <p className="focusflow-desc">
          Pomodoro timer: <b>Stay sharp</b>, take smart breaks!
        </p>
        <div className="focusflow-main-row">
          <div className="focusflow-timer-col">
            <div
              className={`focusflow-timer-outer${timerOn ? " active" : ""}`}
              aria-live="polite"
              aria-label={`Timer: ${formatTime(timeLeft)}`}
            >
              <CircularProgress
                value={timeLeft}
                max={duration * 60}
                size={132}
                accent="#38bdf8"
                text={formatTime(timeLeft)}
                label="Time left"
              />
              <div
                className={`focusflow-timer-indicator${timerOn ? " active" : ""}`}
                aria-label={timerOn ? "Timer running" : "Timer paused"}
              ></div>
            </div>
          </div>
          <div className="focusflow-side-col" role="group" aria-label="Pomodoro settings and actions">
            <fieldset className="focusflow-input-group">
              <legend className="sr-only">Set timer duration</legend>
              <div className="focusflow-input-row">
                <input
                  type="number"
                  value={input}
                  min={5}
                  max={120}
                  onChange={handleChange}
                  onBlur={setCustom}
                  className="focusflow-time-input"
                  aria-label="Minutes per session"
                  inputMode="numeric"
                />
                <span>min</span>
                <button
                  type="button"
                  onClick={setCustom}
                  className="focusflow-set-btn"
                  tabIndex={0}
                  aria-label="Set custom duration"
                >
                  Set
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDuration(25);
                    setTimeLeft(25 * 60);
                    setInput(25);
                    setTimerOn(false);
                  }}
                  title="Reset to 25"
                  className="focusflow-quick-btn"
                  tabIndex={0}
                  aria-label="Quick set to 25 minutes"
                >
                  25-min
                </button>
              </div>
            </fieldset>
            <div className="focusflow-actions" role="group" aria-label="Timer controls">
              <button
                type="button"
                className={`focusflow-btn group${timerOn ? " red" : ""}`}
                onClick={startPause}
                aria-pressed={timerOn}
              >
                {timerOn ? (
                  <span>
                    <span className="focusflow-btnicon" aria-hidden="true">⏸</span> Pause
                  </span>
                ) : (
                  <span>
                    <span className="focusflow-btnicon" aria-hidden="true">▶</span> Start
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={reset}
                className="focusflow-btn"
                aria-label="Reset timer"
              >
                <span className="focusflow-btnicon" aria-hidden="true">↺</span> Reset
              </button>
            </div>
            <div className="focusflow-summary-row" aria-live="polite" aria-atomic="true">
              <span>Completed Pomodoros: </span>
              <span
                className={`focusflow-completed-count${sessionInc ? " bump" : ""}`}
                aria-label={`You have completed ${completed} sessions`}
                tabIndex={0}
              >
                {completed}
              </span>
              <div className="focusflow-motivation">{focusSummary(completed)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FocusFlowPage;
