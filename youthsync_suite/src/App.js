import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import GradeBoostPage from "./pages/GradeBoostPage";
import SplitMatePage from "./pages/SplitMatePage";
import FocusFlowPage from "./pages/FocusFlowPage";

/**
 * App root component - provides layout, navbar, and routing.
 */
const App = () => {
  // For style: give body correct background always.
  React.useEffect(() => {
    document.body.classList.add("bg-[#18181b]", "text-white");
    return () => {
      document.body.classList.remove("bg-[#18181b]", "text-white");
    };
  }, []);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[#18181b]">
      <Navbar />
      <main className="flex-1 pt-20 md:pt-24">
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/gradeboost" element={<GradeBoostPage />} />
          <Route path="/splitmate" element={<SplitMatePage />} />
          <Route path="/focusflow" element={<FocusFlowPage />} />
        </Routes>
      </main>
      <footer className="py-4 text-center text-xs text-gray-500 bg-[#18181b] select-none border-t border-[#222]">
        &copy; {new Date().getFullYear()} YouthSync Suite &mdash; made for students
      </footer>
    </div>
  );
};

export default App;
