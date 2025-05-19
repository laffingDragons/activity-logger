import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function CustomTimePicker({ value, onChange, onClose }) {
  const [selectedTime, setSelectedTime] = useState(value);

  useEffect(() => {
    setSelectedTime(value);
  }, [value]);

  const handleClockClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    const normalizedAngle = (angle + 360) % 360;

    const hours = Math.floor(normalizedAngle / 30) % 12;
    const minutes = Math.round((normalizedAngle % 30) * 2);
    const newTime = new Date(selectedTime);
    const isPM = selectedTime.getHours() >= 12;
    newTime.setHours(hours + (isPM ? 12 : 0), minutes);
    setSelectedTime(newTime);
  };

  const handleAdjust = (type, delta) => {
    const newTime = new Date(selectedTime);
    if (type === "hour") {
      newTime.setHours(newTime.getHours() + delta);
    } else {
      newTime.setMinutes(newTime.getMinutes() + delta);
    }
    setSelectedTime(newTime);
  };

  const handleConfirm = () => {
    onChange(selectedTime);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const angle = ((selectedTime.getHours() % 12) * 30) + (selectedTime.getMinutes() * 0.5);

  return (
    <div className="neumorphic p-6 rounded-full">
      <div className="time-picker" onClick={handleClockClick}>
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute text-sm"
            style={{
              top: `${50 - 40 * Math.cos((i * 30) * (Math.PI / 180))}%`,
              left: `${50 + 40 * Math.sin((i * 30) * (Math.PI / 180))}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {i === 0 ? 12 : i}
          </span>
        ))}
        <motion.div
          className="time-hand"
          style={{ rotate: angle }}
          transition={{ type: "spring", stiffness: 100 }}
        />
      </div>
      <div className="text-center mt-4">
        <div className="flex justify-center gap-4 mb-4">
          <div>
            <motion.button
              onClick={() => handleAdjust("hour", 1)}
              className="neumorphic p-2 rounded-full"
              whileTap={{ scale: 0.9 }}
            >
              +H
            </motion.button>
            <motion.button
              onClick={() => handleAdjust("hour", -1)}
              className="neumorphic p-2 rounded-full mt-2"
              whileTap={{ scale: 0.9 }}
            >
              -H
            </motion.button>
          </div>
          <div>
            <motion.button
              onClick={() => handleAdjust("minute", 5)}
              className="neumorphic p-2 rounded-full"
              whileTap={{ scale: 0.9 }}
            >
              +M
            </motion.button>
            <motion.button
              onClick={() => handleAdjust("minute", -5)}
              className="neumorphic p-2 rounded-full mt-2"
              whileTap={{ scale: 0.9 }}
            >
              -M
            </motion.button>
          </div>
        </div>
        <p>{selectedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
      </div>
      <div className="flex gap-4 mt-6">
        <motion.button
          onClick={handleConfirm}
          className="neumorphic p-3 flex-1 bg-[var(--accent)] text-purple-900 rounded-lg"
          whileTap={{ scale: 0.9 }}
        >
          OK
        </motion.button>
        <motion.button
          onClick={handleCancel}
          className="neumorphic p-3 flex-1 bg-[var(--secondary)] text-purple-900 rounded-lg"
          whileTap={{ scale: 0.9 }}
        >
          Cancel
        </motion.button>
      </div>
    </div>
  );
}

export default CustomTimePicker;