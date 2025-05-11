import { useTheme } from "../hooks/useTheme";
import { motion } from "framer-motion";
import FrostedCard from "./FrostedCard";
import { vibrate } from "../utils/haptic";

function SettingsPanel({ onClose }) {
  const { theme, setTheme, fontSize, setFontSize } = useTheme();

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

  return (
    <motion.div
      className="fixed inset-0 frosted-glass flex items-center justify-center z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <FrostedCard className="w-11/12 max-w-md">
        <h2 className="text-lg font-bold mb-4">Settings</h2>
        <div className="mb-4">
          <label className="block text-sm">Color Palette</label>
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
        <div className="mb-4">
          <label className="block text-sm">Font Size</label>
          <div className="flex gap-2">
            {fontSizes.map((size) => (
              <motion.button
                key={size}
                onClick={() => {
                  setFontSize(size);
                  vibrate(50);
                }}
                className={`neumorphic p-2 ${fontSize === size ? "bg-[var(--accent)] text-white" : ""}`}
                whileTap={{ scale: 0.9 }}
              >
                {size}
              </motion.button>
            ))}
          </div>
        </div>
        <motion.button
          onClick={onClose}
          className="neumorphic p-2 w-full bg-[var(--accent)] text-white"
          whileTap={{ scale: 0.9 }}
        >
          Close
        </motion.button>
      </FrostedCard>
    </motion.div>
  );
}

export default SettingsPanel;