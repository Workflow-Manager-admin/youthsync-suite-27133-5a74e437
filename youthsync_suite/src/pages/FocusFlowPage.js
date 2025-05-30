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

  // Ensure if duration changes, update timeLeft and input
  useEffect(() => {
    setTimeLeft(duration * 60);
    setInput(duration);
  }, [duration]);

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

  // Animate session increment
  return (
    <div className="focusflow-root">
      <div className="focusflow-card">
        <div className="focusflow-header">
          <span className="focusflow-circle">F</span>
          <span className="focusflow-title">FocusFlow</span>
        </div>
        <p className="focusflow-desc">
          Pomodoro timer: Stay sharp, take smart breaks!
        </p>
        <div className="focusflow-main-row">
          <div className="focusflow-timer-col">
            <CircularProgress
              value={timeLeft}
              max={duration * 60}
              size={120}
              accent="#38bdf8"
              text={formatTime(timeLeft)}
              label="Time left"
            />
          </div>
          <div className="focusflow-side-col">
            <div className="focusflow-input-row">
              <input
                type="number"
                value={input}
                min={5}
                max={120}
                onChange={handleChange}
                onBlur={setCustom}
                className="focusflow-time-input"
                aria-label="Set minutes"
              />
              <span>min</span>
              <button
                type="button"
                onClick={setCustom}
                className="focusflow-set-btn"
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
              >
                25-min
              </button>
            </div>
            <div className="focusflow-actions">
              <button
                type="button"
                className={`focusflow-btn${timerOn ? " red" : ""}`}
                onClick={startPause}
              >
                {timerOn ? "Pause" : "Start"}
              </button>
              <button
                type="button"
                onClick={reset}
                className="focusflow-btn"
              >
                Reset
              </button>
            </div>
            <div className="focusflow-summary-row">
              Completed Pomodoros:{" "}
              <span className="focusflow-completed-count">{completed}</span>
              <div>{focusSummary(completed)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FocusFlowPage;
