import React, { useState } from "react";
import CircularProgress from "../components/CircularProgress";
import "../styles/gradeboost.css";

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
    <div className="gradeboost-root">
      <div className="gradeboost-card">
        <div className="gradeboost-header">
          <span className="gradeboost-circle">G</span>
          <span className="gradeboost-title">GradeBoost</span>
        </div>
        <p className="gradeboost-desc">CGPA calculator: Enter grades & credits.</p>
        <form
          className="gb-form"
          autoComplete="off"
          onSubmit={e => {
            e.preventDefault();
            calculate();
          }}
        >
          <div className="gb-form-row" role="list">
            {subjects.map((subject, idx) => (
              <div
                key={idx}
                className="gb-subject-row"
                role="listitem"
              >
                <select
                  value={subject.grade}
                  required
                  onChange={e =>
                    handleSubjectChange(idx, "grade", e.target.value)
                  }
                  className="gb-select"
                  aria-label="Select grade"
                >
                  <option value="">Grade</option>
                  {GRADES.map(g => (
                    <option value={g.label} key={g.label}>{g.label}</option>
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
                  className="gb-input gb-credit-input"
                  aria-label="Enter credits"
                  inputMode="numeric"
                />
                {subjects.length > 1 && (
                  <button
                    type="button"
                    className="gb-remove-btn"
                    onClick={() => removeSubject(idx)}
                    aria-label="Remove subject"
                    tabIndex={0}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="gb-actions">
            <button
              type="button"
              onClick={addSubject}
              className="gb-btn gb-add-btn"
              tabIndex={0}
            >
              + Add Subject
            </button>
            <button
              type="submit"
              className="gb-btn gb-btn-calc"
              tabIndex={0}
            >
              Calculate GPA
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="gb-btn gb-btn-reset"
              tabIndex={0}
            >
              Reset
            </button>
          </div>
        </form>
        {error && (
          <div className="gb-feedback gb-feedback-error" role="alert">
            <span className="gb-feedback-icon" aria-hidden="true">!</span>
            <span>{error}</span>
          </div>
        )}
        {showSummary && result && (
          <div className="gb-result-row" role="region" aria-live="polite">
            <div className="gb-result-circlebox">
              <CircularProgress
                value={result.gpa}
                max={10}
                size={92}
                accent="#38bdf8"
                text={`${result.gpa}`}
                label="GPA"
              />
            </div>
            <div className="gb-result-info">
              <div className="gb-result-gpa">{result.gpa} GPA</div>
              <div className="gb-result-summary">{performanceSummary(result.gpa)}</div>
              <div className="gb-result-credits">
                <span>Total Credits:</span> <span>{result.credits}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GradeBoostPage;
