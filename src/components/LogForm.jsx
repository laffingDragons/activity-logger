import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, addMinutes } from "date-fns";
import { useLogs } from "../hooks/useLogs";
import { useCategories } from "../hooks/useCategories";
import AutocompleteInput from "./AutocompleteInput";
import { useVoice } from "../hooks/useVoice";
import FrostedCard from "./FrostedCard";
import CustomDatePicker from "./CustomDatePicker";
import CustomTimePicker from "./CustomTimePicker";
import { vibrate } from "../utils/haptic";

function LogForm({ onLogAdded }) {
  const { addLog, logs } = useLogs();
  const { categories, addCategory, addSubcategory } = useCategories();
  const { startListening, transcript, isListening } = useVoice();

  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("None");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(addMinutes(new Date(), 30));
  const [errors, setErrors] = useState({});
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  useEffect(() => {
    if (transcript) {
      const parsed = parseVoiceInput(transcript);
      if (parsed.category) setCategory(parsed.category);
      if (parsed.subcategory) setSubcategory(parsed.subcategory);
      if (parsed.startTime) setStartTime(parsed.startTime);
      if (parsed.endTime) setEndTime(parsed.endTime);
    }
  }, [transcript]);

  const parseVoiceInput = (text) => {
    const parts = text.toLowerCase().split(" ");
    let parsed = { category: "", subcategory: "None", startTime: null, endTime: null };
    if (parts.includes("from")) {
      const fromIndex = parts.indexOf("from");
      parsed.startTime = parseTime(parts[fromIndex + 1]);
      if (parts.includes("to")) {
        const toIndex = parts.indexOf("to");
        parsed.endTime = parseTime(parts[toIndex + 1]);
      }
    }
    parsed.category = parts[0];
    parsed.subcategory = parts[1] || "None";
    return parsed;
  };

  const parseTime = (timeStr) => {
    const now = new Date();
    const match = timeStr.match(/(\d+)(am|pm)/);
    if (match) {
      let hours = parseInt(match[1]);
      if (match[2] === "pm" && hours < 12) hours += 12;
      now.setHours(hours, 0, 0, 0);
      return now;
    }
    return now;
  };

  const validate = () => {
    const newErrors = {};
    if (!category) newErrors.category = "Category is required";
    if (!startTime) newErrors.startTime = "Start time is required";
    if (!endTime) newErrors.endTime = "End time is required";
    if (startTime && endTime && startTime >= endTime) {
      newErrors.endTime = "End time must be after start time";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const duration = (endTime - startTime) / (1000 * 60);
    const log = {
      id: Date.now().toString(),
      date: format(date, "yyyy-MM-dd"),
      category: category || "Uncategorized",
      subcategory: subcategory || "None",
      startTime: format(startTime, "HH:mm"),
      endTime: format(endTime, "HH:mm"),
      duration,
    };

    await addLog(log); // Wait for the log to be added
    vibrate(50);
    resetForm();
    onLogAdded(log); // Pass the new log to the callback

    // Scroll to the logs table
    const tableElement = document.querySelector('.logged-activities');
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resetForm = () => {
    setDate(new Date());
    setCategory("");
    setSubcategory("None");
    setStartTime(new Date());
    setEndTime(addMinutes(new Date(), 30));
    setErrors({});
  };

  const handleAddCategory = () => {
    if (newCategory) {
      addCategory({ id: Date.now().toString(), name: newCategory, subcategories: [] });
      setCategory(newCategory);
      setNewCategory("");
    }
  };

  const handleAddSubcategory = () => {
    if (newSubcategory && category) {
      addSubcategory(category, { id: Date.now().toString(), name: newSubcategory });
      setSubcategory(newSubcategory);
      setNewSubcategory("");
    }
  };

  // Get top 5 most tracked activities
  const getTopActivities = () => {
    const activityCount = logs.reduce((acc, log) => {
      const key = `${log.category}-${log.subcategory}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(activityCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([key]) => {
        const [category, subcategory] = key.split('-');
        return { category, subcategory };
      });
  };

  const quickSelectActivities = getTopActivities();

  const handleQuickSelect = (activity) => {
    setCategory(activity.category);
    setSubcategory(activity.subcategory);
  };

  const handleDurationSelect = (minutes) => {
    setEndTime(addMinutes(startTime, minutes));
  };

  return (
    <FrostedCard className="mb-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Most Used Activities</h3>
          <div className="flex flex-wrap gap-2">
            {quickSelectActivities.map((activity) => {
              const count = logs.filter(
                log => log.category === activity.category && 
                      log.subcategory === activity.subcategory
              ).length;
              
              return (
                <motion.button
                  key={`${activity.category}-${activity.subcategory}`}
                  type="button"
                  onClick={() => handleQuickSelect(activity)}
                  className={`neumorphic p-2 rounded-lg text-sm flex items-center gap-2 ${
                    category === activity.category && subcategory === activity.subcategory
                      ? "neumorphic-pressed bg-[var(--accent)] text-purple-900"
                      : ""
                  }`}
                  whileTap={{ scale: 0.9 }}
                >
                  <span>{activity.category} - {activity.subcategory}</span>
                  <span className="text-xs bg-[var(--accent)] px-2 py-1 rounded-full">
                    {count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm mb-2">Date</label>
          <motion.button
            type="button"
            onClick={() => setShowDatePicker(true)}
            className="neumorphic p-3 w-full rounded-lg text-left"
            whileTap={{ scale: 0.9 }}
          >
            {format(date, "yyyy-MM-dd")}
          </motion.button>
          {showDatePicker && (
            <motion.div
              className="fixed inset-0 frosted-glass flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CustomDatePicker
                selected={date}
                onChange={(newDate) => setDate(newDate)}
                onClose={() => setShowDatePicker(false)}
              />
            </motion.div>
          )}
        </div>
        <div className="mb-6">
          <label className="block text-sm mb-2">Activity</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="neumorphic p-3 w-full rounded-lg"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <motion.p
                  className="text-red-500 text-xs mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.category}
                </motion.p>
              )}
            </div>
            <div>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="neumorphic p-3 w-full rounded-lg"
              >
                <option value="None">None</option>
                {category &&
                  categories
                    .find((cat) => cat.name === category)
                    ?.subcategories.map((sub) => (
                      <option key={sub.id} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
              </select>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="New Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="neumorphic p-3 w-full rounded-lg mb-2"
              />
              <motion.button
                type="button"
                onClick={handleAddCategory}
                className="neumorphic p-2 w-full bg-[var(--accent)] text-purple-900 rounded-lg"
                whileTap={{ scale: 0.9 }}
              >
                Add Category
              </motion.button>
            </div>
            <div>
              <input
                type="text"
                placeholder="New Subcategory"
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
                className="neumorphic p-3 w-full rounded-lg mb-2"
              />
              <motion.button
                type="button"
                onClick={handleAddSubcategory}
                className="neumorphic p-2 w-full bg-[var(--accent)] text-purple-900 rounded-lg"
                whileTap={{ scale: 0.9 }}
              >
                Add Subcategory
              </motion.button>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm mb-2">Start Time</label>
          <motion.button
            type="button"
            onClick={() => setShowStartTimePicker(true)}
            className="neumorphic p-3 w-full rounded-lg text-left"
            whileTap={{ scale: 0.9 }}
          >
            {startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </motion.button>
          {showStartTimePicker && (
            <motion.div
              className="fixed inset-0 frosted-glass flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CustomTimePicker
                value={startTime}
                onChange={(newTime) => setStartTime(newTime)}
                onClose={() => setShowStartTimePicker(false)}
              />
            </motion.div>
          )}
          {errors.startTime && (
            <motion.p
              className="text-red-500 text-xs mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.startTime}
            </motion.p>
          )}
        </div>
        <div className="mb-6">
          <label className="block text-sm mb-2">End Time</label>
          <motion.button
            type="button"
            onClick={() => setShowEndTimePicker(true)}
            className="neumorphic p-3 w-full rounded-lg text-left"
            whileTap={{ scale: 0.9 }}
          >
            {endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </motion.button>
          {showEndTimePicker && (
            <motion.div
              className="fixed inset-0 frosted-glass flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CustomTimePicker
                value={endTime}
                onChange={(newTime) => setEndTime(newTime)}
                onClose={() => setShowEndTimePicker(false)}
              />
            </motion.div>
          )}
          {errors.endTime && (
            <motion.p
              className="text-red-500 text-xs mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.endTime}
            </motion.p>
          )}
          <div className="flex gap-2 mt-2">
            {[15, 30, 60].map((minutes) => (
              <motion.button
                key={minutes}
                type="button"
                onClick={() => handleDurationSelect(minutes)}
                className="neumorphic p-2 rounded-lg text-sm"
                whileTap={{ scale: 0.9 }}
              >
                {minutes} min
              </motion.button>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <motion.button
            type="submit"
            className="neumorphic p-3 flex-1 bg-[var(--accent)] text-purple-900 rounded-lg hover:shadow-lg transition-all duration-200"
            whileTap={{ scale: 0.9, backgroundColor: "var(--secondary)" }}
            initial={{ scale: 1 }}
            animate={{ scale: 1 }}
          >
            Log Activity
          </motion.button>
          <motion.button
            type="button"
            onClick={startListening}
            className={`neumorphic p-3 flex-1 ${
              isListening ? "neumorphic-pressed bg-red-500" : "bg-[var(--secondary)]"
            } text-purple-900 rounded-lg`}
            whileTap={{ scale: 0.9 }}
          >
            {isListening ? "Stop Voice" : "Voice Input"}
          </motion.button>
        </div>
      </form>
    </FrostedCard>
  );
}

export default LogForm;