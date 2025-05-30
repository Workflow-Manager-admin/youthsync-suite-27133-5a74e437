import React, { useState, useRef, useEffect } from "react";
import CircularProgress from "../components/CircularProgress";
import "../styles/focusflow.css";

/**
 * FocusFlow Page: Pomodoro timer with session count, custom duration
 */
// PUBLIC_INTERFACE
function FocusFlowPage() {
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [timerOn, setTimerOn] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [input, setInput] = useState(duration);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerOn) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setTimerOn(false);
            setCompleted((c) => c + 1);
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
    <div className="flex flex-col items-center px-2 py-7">
      <div className="max-w-xl w-full bg-[#22232a] rounded-xl shadow-xl p-5 md:p-8 mt-3 relative overflow-visible">
        <div className="mb-5 flex items-center gap-2">
          <span className="rounded-full bg-[#38bdf8] w-6 h-6 flex items-center justify-center shadow-[0_0_10px_#38bdf8] font-bold text-lg text-[#18181b]">F</span>
          <span className="font-extrabold text-2xl bg-gradient-to-r from-[#38bdf8] to-blue-100 text-transparent bg-clip-text">FocusFlow</span>
        </div>
        <p className="opacity-75 text-sm mb-3">
          Pomodoro timer: Stay sharp, take smart breaks!
        </p>
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-3 md:justify-center">
          <div>
            <CircularProgress
              value={timeLeft}
              max={duration * 60}
              size={120}
              accent="#38bdf8"
              text={formatTime(timeLeft)}
              label="Time left"
            />
          </div>
          <div className="flex flex-col gap-2 items-center w-full max-w-xs">
            <div className="flex items-center gap-2 text-sm mt-2">
              <input
                type="number"
                value={input}
                min={5}
                max={120}
                onChange={handleChange}
                onBlur={setCustom}
                className="w-16 bg-[#10141b] border border-[#232] rounded px-2 py-[6px] text-white"
                aria-label="Set minutes"
              />
              <span>min</span>
              <button
                type="button"
                onClick={setCustom}
                className="px-2 py-1 bg-[#38bdf8] text-[#18181b] font-bold rounded hover:bg-cyan-400 text-xs ml-2"
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
                className="px-2 py-1 bg-[#222] text-blue-100 rounded ml-2 text-xs"
              >
                25-min
              </button>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                className={`rounded-md px-4 py-2 text-sm font-semibold transition shadow-lg ${timerOn ? "bg-red-400 text-[#18181b] hover:bg-red-500" : "bg-[#38bdf8] text-[#18181b] hover:bg-cyan-400"}`}
                onClick={startPause}
              >
                {timerOn ? "Pause" : timeLeft === 0 ? "Start" : "Start"}
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-md px-3 py-2 bg-[#222] text-gray-200 hover:bg-[#333] font-medium transition text-sm"
              >
                Reset
              </button>
            </div>
            <div className="mt-3 text-xs text-blue-100 text-center">
              Completed Pomodoros:{" "}
              <span className="text-cyan-300 font-bold">{completed}</span>
              <div>{focusSummary(completed)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FocusFlowPage;
