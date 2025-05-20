import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function CustomTimePicker({ value, onChange, onClose }) {
  const [selectedTime, setSelectedTime] = useState(value);
  const [period, setPeriod] = useState(value.getHours() >= 12 ? 'PM' : 'AM');

  useEffect(() => {
    setSelectedTime(value);
    setPeriod(value.getHours() >= 12 ? 'PM' : 'AM');
  }, [value]);

  const hours = selectedTime.getHours() % 12 || 12;
  const minutes = selectedTime.getMinutes();

  const handleHourChange = (increment) => {
    const newTime = new Date(selectedTime);
    let newHour = (selectedTime.getHours() % 12) + increment;
    if (newHour > 12) newHour = 1;
    if (newHour < 1) newHour = 12;
    newTime.setHours(period === 'PM' ? newHour + 12 : newHour);
    setSelectedTime(newTime);
  };

  const handleMinuteChange = (increment) => {
    const newTime = new Date(selectedTime);
    let newMinute = selectedTime.getMinutes() + increment;
    if (newMinute >= 60) newMinute = 0;
    if (newMinute < 0) newMinute = 59;
    newTime.setMinutes(newMinute);
    setSelectedTime(newTime);
  };

  const handlePeriodToggle = () => {
    const newTime = new Date(selectedTime);
    const currentHours = newTime.getHours();
    const newPeriod = period === 'AM' ? 'PM' : 'AM';
    
    if (period === 'AM' && currentHours < 12) {
      newTime.setHours(currentHours + 12);
    } else if (period === 'PM' && currentHours >= 12) {
      newTime.setHours(currentHours - 12);
    }
    
    setPeriod(newPeriod);
    setSelectedTime(newTime);
  };

  const handleConfirm = () => {
    onChange(selectedTime);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="neumorphic p-6 rounded-lg bg-white/10 backdrop-blur-md w-[280px]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <button
              onClick={() => handleHourChange(1)}
              className="neumorphic p-2 rounded-lg hover:bg-gray-100/10"
            >
              ▲
            </button>
            <div className="text-2xl font-semibold my-2">
              {String(hours).padStart(2, '0')}
            </div>
            <button
              onClick={() => handleHourChange(-1)}
              className="neumorphic p-2 rounded-lg hover:bg-gray-100/10"
            >
              ▼
            </button>
          </div>
          <span className="text-2xl font-bold">:</span>
          <div className="flex flex-col items-center">
            <button
              onClick={() => handleMinuteChange(5)}
              className="neumorphic p-2 rounded-lg hover:bg-gray-100/10"
            >
              ▲
            </button>
            <div className="text-2xl font-semibold my-2">
              {String(minutes).padStart(2, '0')}
            </div>
            <button
              onClick={() => handleMinuteChange(-5)}
              className="neumorphic p-2 rounded-lg hover:bg-gray-100/10"
            >
              ▼
            </button>
          </div>
        </div>
        <button
          onClick={handlePeriodToggle}
          className={`neumorphic px-3 py-2 rounded-lg text-lg ${
            period === 'PM' ? 'bg-[var(--accent)] text-purple-900' : ''
          }`}
        >
          {period}
        </button>
      </div>
      <div className="flex gap-3">
        <motion.button
          onClick={handleConfirm}
          className="neumorphic py-2 flex-1 bg-[var(--accent)] text-purple-900 rounded-lg font-medium"
          whileTap={{ scale: 0.95 }}
        >
          OK
        </motion.button>
        <motion.button
          onClick={handleCancel}
          className="neumorphic py-2 flex-1 bg-[var(--secondary)] text-purple-900 rounded-lg font-medium"
          whileTap={{ scale: 0.95 }}
        >
          Cancel
        </motion.button>
      </div>
    </div>
  );
}

export default CustomTimePicker;