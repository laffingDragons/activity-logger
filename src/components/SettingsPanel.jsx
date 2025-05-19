import { useTheme } from "../hooks/useTheme";
import { motion } from "framer-motion";
import FrostedCard from "./FrostedCard";
import { vibrate } from "../utils/haptic";
import { Link } from "react-router-dom";
import { exportToCSV, importFromCSV } from "../utils/storage";
import { useLogs } from "../hooks/useLogs";
import { useCategories } from "../hooks/useCategories";

function SettingsPanel({ onClose }) {
  const { theme, setTheme, fontSize, setFontSize } = useTheme();
  const { logs } = useLogs();
  const { categories } = useCategories();

  const palettes = [
    "default",
    "pastel",
    "neon",
    "frost",
    "midnight",
    "sunset",
    "ocean",
    "forest",
    "candy",
    "retro",
    "minimal",
    "cosmic",
  ];

  const fontSizes = ["14px", "16px", "18px", "20px"];

  const handleExport = () => {
    exportToCSV(logs, categories);
    vibrate(50);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      importFromCSV(file, (data) => {
        localStorage.setItem("logs", JSON.stringify(data));
        vibrate(50);
        window.location.reload();
      });
    }
  };

  const handleDeleteAllData = () => {
    const shouldExport = window.confirm(
      "⚠️ Would you like to export your data before deleting? Click 'OK' to export first, or 'Cancel' to continue with deletion."
    );

    if (shouldExport) {
      exportToCSV(logs, categories);
      // Show second confirmation after export
      setTimeout(() => {
        confirmAndDelete();
      }, 1000);
    } else {
      confirmAndDelete();
    }
  };

  const confirmAndDelete = () => {
    const confirmed = window.confirm(
      "⚠️ Are you absolutely sure? This will permanently delete all your logs and categories. This action cannot be undone!"
    );

    if (confirmed) {
      localStorage.clear();
      vibrate([100, 50, 100]); // Longer vibration pattern for destructive action
      window.location.reload();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 frosted-glass flex items-center justify-center z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <FrostedCard className="w-11/12 max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Settings</h2>
        
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-2">Data Management</h3>
          <div className="flex gap-2 flex-wrap">
            <Link
              to="/master"
              className="neumorphic p-2 bg-[var(--accent)] text-green-900 rounded-lg text-sm"
              onClick={() => onClose()}
            >
              📝 Manage Categories
            </Link>
            <button
              onClick={handleExport}
              className="neumorphic p-2 bg-[var(--secondary)] text-green-900 rounded-lg text-sm"
            >
              📤 Export Data
            </button>
            <label className="neumorphic p-2 bg-[var(--secondary)] text-green-900 rounded-lg text-sm cursor-pointer">
              📥 Import Data
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-md font-semibold mb-2">Theme</h3>
          <select
            value={theme}
            onChange={(e) => {
              setTheme(e.target.value);
              vibrate(50);
            }}
            className="neumorphic p-2 w-full rounded"
          >
            {palettes.map((palette) => (
              <option key={palette} value={palette}>{palette}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <h3 className="text-md font-semibold mb-2">Font Size</h3>
          <div className="flex gap-2">
            {fontSizes.map((size) => (
              <motion.button
                key={size}
                onClick={() => {
                  setFontSize(size);
                  vibrate(50);
                }}
                className={`neumorphic p-2 ${fontSize === size ? "bg-[var(--accent)] text-green-900" : ""}`}
                whileTap={{ scale: 0.9 }}
              >
                {size}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-md font-semibold mb-2">Danger Zone</h3>
          <motion.button
            onClick={handleDeleteAllData}
            className="neumorphic p-2 w-full bg-red-500 text-white font-medium mb-4"
            whileTap={{ scale: 0.95 }}
          >
            🗑️ Delete All Data
          </motion.button>
          <p className="text-xs text-gray-600">
            This will permanently delete all your logs and categories. Make sure to export your data first if you want to keep a backup.
          </p>
        </div>

        <motion.button
          onClick={onClose}
          className="neumorphic p-2 w-full bg-[var(--accent)] text-green-900"
          whileTap={{ scale: 0.9 }}
        >
          Close
        </motion.button>
      </FrostedCard>
    </motion.div>
  );
}

export default SettingsPanel;