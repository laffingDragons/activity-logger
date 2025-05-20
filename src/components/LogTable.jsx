import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useLogs } from "../hooks/useLogs";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { vibrate } from "../utils/haptic";
import FrostedCard from "./FrostedCard";

import { useRef } from 'react';

function LogTable() {
  const { logs, updateLog, deleteLog } = useLogs();
  const tableRef = useRef(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [timeFilter, setTimeFilter] = useState('all');    const getFilteredLogs = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0];
    
    switch (timeFilter) {
      case 'today':
        return logs.filter(log => log.date === today);
      case 'yesterday':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() );
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        return logs.filter(log => log.date === yesterdayStr);
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        return logs.filter(log => new Date(log.date) >= weekAgo);
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        return logs.filter(log => new Date(log.date) >= monthAgo);
      default:
        return logs;
    }
  };

  const handleEdit = (log) => {
    setEditingId(log.id);
    setEditForm({ ...log });
    vibrate(50);
  };

  const handleSave = () => {
    updateLog(editingId, editForm);
    setEditingId(null);
    vibrate(50);
  };

  const handleDelete = (log) => {
    deleteLog(log.id);
    vibrate(50);
    toast.info(
      <div>
        Deleted "{log.category} - {log.subcategory}"
        <button
          className="ml-2 underline"
          onClick={() => {
            updateLog(log.id, log);
            toast.dismiss();
          }}
        >
          Undo
        </button>
      </div>,
      { autoClose: 30000 }
    );
  };

  // Create swipe handlers for each row
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => (editingId ? handleSave() : null),
    onSwipedRight: () => (editingId ? null : handleDelete(editForm)),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  if (!logs || logs.length === 0) {
    return <div className="text-center p-4">No logs found</div>;
  }

  return (
    <FrostedCard>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Logged Activities</h2>
        <div className="flex gap-2">
          {['all', 'today', 'yesterday', 'week', 'month'].map((filter) => (
            <motion.button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`neumorphic px-3 py-1 rounded-lg text-sm ${
                timeFilter === filter ? 'bg-[var(--accent)] text-purple-900' : ''
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Category</th>
              <th className="text-left p-2">Subcategory</th>
              <th className="text-left p-2">Time</th>
              <th className="text-left p-2">Duration</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredLogs()
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((log) => {
                // Format date as DD-MMM (e.g., 05-Jun)
                const dateObj = new Date(log.date);
                const day = String(dateObj.getDate()).padStart(2, '0');
                const month = dateObj.toLocaleString('en-US', { month: 'short' });
                const formattedDate = `${day}-${month}`;
                return (
                  <motion.tr
                    key={log.id}
                    {...swipeHandlers}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {editingId === log.id ? (
                      <>
                        <td className="p-2">
                          <input
                            type="date"
                            value={editForm.date}
                            onChange={(e) =>
                              setEditForm({ ...editForm, date: e.target.value })
                            }
                            className="neumorphic p-1 rounded"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={editForm.category}
                            onChange={(e) =>
                              setEditForm({ ...editForm, category: e.target.value })
                            }
                            className="neumorphic p-1 rounded"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={editForm.subcategory}
                            onChange={(e) =>
                              setEditForm({ ...editForm, subcategory: e.target.value })
                            }
                            className="neumorphic p-1 rounded"
                          />
                        </td>
                        <td className="p-2">
                          <div className="inline-flex items-center gap-2 bg-white/5 p-2 rounded-lg shadow-inner">
                            <input
                              type="time"
                              value={editForm.startTime}
                              onChange={(e) =>
                                setEditForm({ ...editForm, startTime: e.target.value })
                              }
                              className="neumorphic px-3 py-2 rounded-lg text-base w-32 focus:ring-2 focus:ring-blue-500 focus:outline-none hover:bg-white/5"
                            />
                            <span className="text-gray-400 font-medium">→</span>
                            <input
                              type="time"
                              value={editForm.endTime}
                              onChange={(e) =>
                                setEditForm({ ...editForm, endTime: e.target.value })
                              }
                              className="neumorphic px-3 py-2 rounded-lg text-base w-32 focus:ring-2 focus:ring-blue-500 focus:outline-none hover:bg-white/5"
                            />
                          </div>
                        </td>
                        <td className="p-2">{editForm.duration} min</td>
                        <td className="p-2">
                          <button
                            onClick={handleSave}
                            className="neumorphic p-1 bg-[var(--accent)] text-purple-900 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="neumorphic p-1 bg-gray-500 text-purple-900 rounded ml-2"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-2">{formattedDate}</td>
                        <td className="p-2">{log.category}</td>
                        <td className="p-2">{log.subcategory}</td>
                        <td className="p-2">{`${log.startTime} - ${log.endTime}`}</td>
                        <td className="p-2">{log.duration} min</td>
                        <td className="p-2">
                          <button
                            onClick={() => handleEdit(log)}
                            className="neumorphic p-1 bg-[var(--secondary)] text-purple-900 rounded"
                            aria-label="Edit log"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(log)}
                            className="neumorphic p-1 bg-red-500 text-purple-900 rounded ml-2"
                            aria-label="Delete log"
                          >
                            🗑️
                          </button>
                        </td>
                      </>
                    )}
                  </motion.tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </FrostedCard>
  );
}

export default LogTable;