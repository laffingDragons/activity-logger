import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LogPage from "./pages/LogPage";
import MasterPage from "./pages/MasterPage";
import SettingsPanel from "./components/SettingsPanel";
import OnboardingTour from "./components/OnboardingTour";
import { useTheme } from "./hooks/useTheme";
import { useState } from "react";
import { motion } from "framer-motion";

function App() {
  const { theme, fontSize } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(!localStorage.getItem("onboardingCompleted"));

  return (
    <div className="min-h-screen" style={{ fontSize }}>
      <Router>
        <motion.header
          className="frosted-glass p-6 flex justify-between items-center"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          <h1 className="text-xl font-bold">Activity Logger</h1>
          <motion.button
            className="neumorphic p-2 rounded-full"
            onClick={() => setShowSettings(true)}
            whileTap={{ scale: 0.9 }}
          >
            ⚙️
          </motion.button>
        </motion.header>
        <Routes>
          <Route path="/" element={<LogPage />} />
          <Route path="/master" element={<MasterPage />} />
        </Routes>
        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} />
        )}
        {showOnboarding && (
          <OnboardingTour onComplete={() => {
            localStorage.setItem("onboardingCompleted", "true");
            setShowOnboarding(false);
          }} />
        )}
        <ToastContainer position="bottom-center" autoClose={30000} />
      </Router>
    </div>
  );
}

export default App;