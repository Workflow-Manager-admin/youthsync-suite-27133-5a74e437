import React, { useState } from "react";
import CircularProgress from "../components/CircularProgress";

// Grade conversion table
const GRADES = [
  { label: "S", value: 10 },
  { label: "A", value: 9 },
  { label: "B", value: 8 },
  { label: "C", value: 7 },
  { label: "D", value: 6 },
  { label: "E", value: 5 },
  { label: "F", value: 0 },
];

// PUBLIC_INTERFACE
/**
 * GradeBoost Page: CGPA calculator with progress indicator
 */
function GradeBoostPage() {
  // Each subject: { grade: <string>, credit: <number> }
  const [subjects, setSubjects] = useState([{ grade: "", credit: "" }]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  // PUBLIC_INTERFACE
  function handleSubjectChange(idx, field, value) {
    setSubjects((prev) =>
      prev.map((s, i) =>
        i === idx ? { ...s, [field]: value } : s
      )
    );
  }
  function addSubject() {
    setSubjects((prev) => [...prev, { grade: "", credit: "" }]);
  }
  function removeSubject(idx) {
    setSubjects((prev) => prev.filter((_, i) => i !== idx));
  }
  function resetAll() {
    setSubjects([{ grade: "", credit: "" }]);
    setResult(null);
    setShowSummary(false);
    setError("");
  }
  function validate() {
    if (!subjects.length) return "Add at least one subject.";
    for (let i = 0; i < subjects.length; ++i) {
      const { grade, credit } = subjects[i];
      if (!grade || credit === "") return "All fields are required.";
      if (!GRADES.some((g) => g.label === grade))
        return `Invalid grade in subject #${i + 1}`;
      const numCredit = Number(credit);
      if (isNaN(numCredit) || numCredit < 0)
        return `Invalid credit value in subject #${i + 1}`;
    }
    return null;
  }
  // PUBLIC_INTERFACE
  function calculate() {
    const msg = validate();
    if (msg) {
      setError(msg);
      setShowSummary(false);
      return;
    }
    setError("");
    let totalPoints = 0;
    let totalCredits = 0;
    for (const { grade, credit } of subjects) {
      const gradeVal =
        GRADES.find((g) => g.label === grade)?.value ?? 0;
      totalPoints += gradeVal * Number(credit);
      totalCredits += Number(credit);
    }
    if (totalCredits === 0) {
      setError("Total credits cannot be zero.");
      setResult(null);
      setShowSummary(false);
      return;
    }
    const gpa = totalPoints / totalCredits;
    setResult({
      gpa: +gpa.toFixed(2),
      points: totalPoints,
      credits: totalCredits,
    });
    setShowSummary(true);
  }
  // PUBLIC_INTERFACE
  function performanceSummary(gpa) {
    if (gpa >= 9) return "Excellent! Stellar performance!";
    if (gpa >= 8) return "Great! Keep building your bright future.";
    if (gpa >= 7) return "Good work! Keep striving.";
    if (gpa >= 6) return "You're doing okay, aim higher!";
    if (gpa >= 5) return "Need more effort. You can do it!";
    return "Focus on improvement. Seek help if needed!";
  }

  return (
    <div className="flex flex-col items-center px-2 py-7">
      <div className="max-w-xl w-full bg-[#22232a] rounded-xl shadow-xl p-5 md:p-8 mt-3">
        <div className="mb-5 flex items-center gap-2">
          <span className="rounded-full bg-[#38bdf8] w-6 h-6 flex items-center justify-center shadow-[0_0_10px_#38bdf8] font-bold text-lg text-[#18181b]">G</span>
          <span className="font-extrabold text-2xl bg-gradient-to-r from-[#38bdf8] to-blue-100 text-transparent bg-clip-text">GradeBoost</span>
        </div>
        <p className="opacity-75 text-sm mb-3">
          CGPA calculator: Enter grades & credits.
        </p>
        <form
          onSubmit={e => {
            e.preventDefault();
            calculate();
          }}
        >
          <div className="flex flex-col gap-3 mb-4">
            {subjects.map((subject, idx) => (
              <div
                key={idx}
                className="flex flex-row gap-2 items-center bg-[#27272a]/60 px-2 py-2 rounded-md"
              >
                <select
                  value={subject.grade}
                  required
                  onChange={e =>
                    handleSubjectChange(idx, "grade", e.target.value)
                  }
                  className="bg-[#0f172a] border border-[#222] text-white rounded px-2 py-[2px] outline-none focus:ring-2 focus:ring-cyan-400/60"
                  aria-label="Select grade"
                >
                  <option value="">Grade</option>
                  {GRADES.map(g => (
                    <option value={g.label} key={g.label}>
                      {g.label}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="Credits"
                  value={subject.credit}
                  required
                  onChange={e => handleSubjectChange(idx, "credit", e.target.value)}
                  className="w-20 bg-[#0f172a] border border-[#222] text-white rounded px-2 py-[2px] outline-none focus:ring-2 focus:ring-cyan-400/60"
                  aria-label="Enter credits"
                />
                {subjects.length > 1 && (
                  <button
                    type="button"
                    className="ml-1 px-1 py-1 text-base text-red-400 hover:bg-red-500/20 rounded-full transition"
                    onClick={() => removeSubject(idx)}
                    aria-label="Remove subject"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 mb-5">
            <button
              type="button"
              onClick={addSubject}
              className="rounded-md px-3 py-2 bg-[#38bdf8] hover:bg-cyan-400 text-[#18181b] font-semibold transition shadow-lg text-sm"
            >
              + Add Subject
            </button>
            <button
              type="submit"
              className="rounded-md px-4 py-2 bg-gradient-to-br from-[#38bdf8] to-blue-400 hover:from-cyan-400 hover:to-blue-500 text-[#18181b] font-bold shadow-lg text-sm transition"
            >
              Calculate GPA
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="rounded-md px-3 py-2 bg-[#222] text-gray-200 hover:bg-[#333] font-medium transition text-sm"
            >
              Reset
            </button>
          </div>
        </form>
        {error && <div className="mb-3 rounded p-2 bg-red-500/20 text-red-300 text-xs">{error}</div>}
        {showSummary && result && (
          <div className="flex flex-col md:flex-row gap-6 items-center bg-[#232a38]/80 p-5 mt-2 rounded-lg shadow-xl transition animate-in fade-in slide-in-from-top-8">
            <div className="flex flex-col items-center">
              <CircularProgress
                value={result.gpa}
                max={10}
                size={90}
                accent="#38bdf8"
                text={`${result.gpa}`}
                label="GPA"
              />
            </div>
            <div className="font-semibold flex flex-col items-center gap-1">
              <div>
                <span className="text-lg text-cyan-300 font-bold">{result.gpa}</span> GPA
              </div>
              <div className="text-xs text-blue-200">
                {performanceSummary(result.gpa)}
              </div>
              <div className="opacity-70 text-xs mt-1">
                Total Credits: <span>{result.credits}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GradeBoostPage;
