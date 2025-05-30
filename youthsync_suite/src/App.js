import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import GradeBoostPage from "./pages/GradeBoostPage";
import SplitMatePage from "./pages/SplitMatePage";
import FocusFlowPage from "./pages/FocusFlowPage";
import "./styles/App.css"; // Vanilla CSS for app-level styling

/**
 * App root component - provides layout, navbar, and routing.
 */
const App = () => {
  // Set dark theme body class just once; CSS handles further styling.
  React.useEffect(() => {
    document.body.classList.add("ys-dark");
    return () => {
      document.body.classList.remove("ys-dark");
    };
  }, []);
  const location = useLocation();

  return (
    <div className="ys-app">
      <Navbar />
      <main className="ys-main">
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/gradeboost" element={<GradeBoostPage />} />
          <Route path="/splitmate" element={<SplitMatePage />} />
          <Route path="/focusflow" element={<FocusFlowPage />} />
        </Routes>
      </main>
      <footer className="ys-footer">
        &copy; {new Date().getFullYear()} YouthSync Suite &mdash; made for students
      </footer>
    </div>
  );
};

export default App;
