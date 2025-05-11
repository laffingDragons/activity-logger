import { useState } from "react";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";

function CustomDatePicker({ selected, onChange, onClose }) {
  const [tempDate, setTempDate] = useState(selected);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selected));
  const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });

  const handlePrevMonth = () => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
  const handleNextMonth = () => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));

  const handleConfirm = () => {
    onChange(tempDate);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="neumorphic p-6 rounded-xl">
      <div className="flex justify-between mb-4">
        <motion.button
          onClick={handlePrevMonth}
          className="neumorphic p-2 rounded-full"
          whileTap={{ scale: 0.9 }}
        >
          ←
        </motion.button>
        <span>{format(currentMonth, "MMMM yyyy")}</span>
        <motion.button
          onClick={handleNextMonth}
          className="neumorphic p-2 rounded-full"
          whileTap={{ scale: 0.9 }}
        >
          →
        </motion.button>
      </div>
      <div className="date-picker">
        {days.map((day) => (
          <motion.button
            key={day.toString()}
            onClick={() => setTempDate(day)}
            className={`date-day ${isSameDay(day, tempDate) ? "neumorphic-pressed bg-[var(--accent)] text-white" : "neumorphic"}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {format(day, "d")}
          </motion.button>
        ))}
      </div>
      <div className="flex gap-4 mt-6">
        <motion.button
          onClick={handleConfirm}
          className="neumorphic p-3 flex-1 bg-[var(--accent)] text-white rounded-lg"
          whileTap={{ scale: 0.9 }}
        >
          OK
        </motion.button>
        <motion.button
          onClick={handleCancel}
          className="neumorphic p-3 flex-1 bg-[var(--secondary)] text-white rounded-lg"
          whileTap={{ scale: 0.9 }}
        >
          Cancel
        </motion.button>
      </div>
    </div>
  );
}

export default CustomDatePicker;