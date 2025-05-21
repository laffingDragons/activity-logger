import { motion } from "framer-motion";

function CustomTimePicker({ value, onChange, onClose }) {
  const formatTimeForInput = (date) => {
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  };

  const handleTimeChange = (e) => {
    const timeString = e.target.value;
    const [hours, minutes] = timeString.split(':').map(Number);
    const newTime = new Date(value);
    newTime.setHours(hours);
    newTime.setMinutes(minutes);
    onChange(newTime);
  };

  return (
    <div className="neumorphic p-6 rounded-lg bg-white/10 backdrop-blur-md w-[280px]">
      <div className="flex justify-center mb-6">
        <input
          type="time"
          value={formatTimeForInput(value)}
          onChange={handleTimeChange}
          className="neumorphic px-4 py-3 rounded-lg text-lg w-full focus:ring-2 focus:ring-[var(--accent)] focus:outline-none hover:bg-white/5"
        />
      </div>
      <div className="flex justify-end gap-2">
        <motion.button
          onClick={onClose}
          className="neumorphic px-4 py-2 rounded-lg"
          whileTap={{ scale: 0.95 }}
        >
          Cancel
        </motion.button>
        <motion.button
          onClick={onClose}
          className="neumorphic px-4 py-2 rounded-lg bg-[var(--accent)] text-purple-900"
          whileTap={{ scale: 0.95 }}
        >
          OK
        </motion.button>
      </div>
    </div>
  );
}

export default CustomTimePicker;