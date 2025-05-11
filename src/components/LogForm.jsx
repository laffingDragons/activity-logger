import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addMinutes } from "date-fns";
import { useLogs } from "../hooks/useLogs";
import { useCategories } from "../hooks/useCategories";
import { useVoice } from "../hooks/useVoice";
import FrostedCard from "./FrostedCard";
import { vibrate } from "../utils/haptic";

function LogForm({ onLogAdded }) {
  const { addLog } = useLogs();
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
    // Simple parsing logic (improve based on testing)
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
    parsed.category = parts[0]; // First word as category
    parsed.subcategory = parts[1] || "None";
    return parsed;
  };

  const parseTime = (timeStr) => {
    // Basic time parsing (e.g., "9am" -> Date)
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const duration = (endTime - startTime) / (1000 * 60); // Minutes
    const log = {
      id: Date.now().toString(),
      date: format(date, "yyyy-MM-dd"),
      category: category || "Uncategorized",
      subcategory: subcategory || "None",
      startTime: format(startTime, "HH:mm"),
      endTime: format(endTime, "HH:mm"),
      duration,
    };

    addLog(log);
    onLogAdded();
    vibrate(50); // Haptic feedback
    resetForm();
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

  return (
    <FrostedCard className="mb-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm">Date</label>
          <DatePicker
            selected={date}
            onChange={setDate}
            dateFormat="yyyy-MM-dd"
            className="neumorphic p-2 w-full rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="neumorphic p-2 w-full rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          {errors.category && (
            <motion.p
              className="text-red-500 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.category}
            </motion.p>
          )}
          <input
            type="text"
            placeholder="New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="neumorphic p-2 w-full mt-2 rounded"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="neumorphic p-2 mt-2 w-full bg-[var(--accent)] text-white"
          >
            Add Category
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm">Subcategory</label>
          <select
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className="neumorphic p-2 w-full rounded"
          >
            <option value="None">None</option>
            {category &&
              categories
                .find((cat) => cat.name === category)
                ?.subcategories.map((sub) => (
                  <option key={sub.id} value={sub.name}>{sub.name}</option>
                ))}
          </select>
          <input
            type="text"
            placeholder="New Subcategory"
            value={newSubcategory}
            onChange={(e) => setNewSubcategory(e.target.value)}
            className="neumorphic p-2 w-full mt-2 rounded"
          />
          <button
            type="button"
            onClick={handleAddSubcategory}
            className="neumorphic p-2 mt-2 w-full bg-[var(--accent)] text-white"
          >
            Add Subcategory
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm">Start Time</label>
          <DatePicker
            selected={startTime}
            onChange={setStartTime}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="HH:mm"
            className="neumorphic p-2 w-full rounded"
          />
          {errors.startTime && (
            <motion.p
              className="text-red-500 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.startTime}
            </motion.p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm">End Time</label>
          <DatePicker
            selected={endTime}
            onChange={setEndTime}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="HH:mm"
            className="neumorphic p-2 w-full rounded"
          />
          {errors.endTime && (
            <motion.p
              className="text-red-500 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {errors.endTime}
            </motion.p>
          )}
        </div>
        <div className="flex gap-2">
          <motion.button
            type="submit"
            className="neumorphic p-2 flex-1 bg-[var(--accent)] text-white"
            whileTap={{ scale: 0.9 }}
          >
            Log Activity
          </motion.button>
          <motion.button
            type="button"
            onClick={startListening}
            className={`neumorphic p-2 flex-1 ${isListening ? "bg-red-500" : "bg-[var(--secondary)]"} text-white`}
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