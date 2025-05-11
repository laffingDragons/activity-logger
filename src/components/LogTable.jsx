import { useState } from "react";
import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { useLogs } from "../hooks/useLogs";
import { toast } from "react-toastify";
import FrostedCard from "./FrostedCard";
import { vibrate } from "../utils/haptic";

function LogTable() {
  const { logs, updateLog, deleteLog } = useLogs();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (log) => {
    setEditingId(log.id);
    setEditForm({ ...log });
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

  const swipeHandlers = (log) => useSwipeable({
    onSwipedLeft: () => handleEdit(log),
    onSwipedRight: () => handleDelete(log),
  });

  return (
    <FrostedCard>
      <h2 className="text-lg font-bold mb-4">Logged Activities</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
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
            {logs.sort((a, b) => new Date(b.date) - new Date(a.date)).map((log) => (
              <motion.tr
                key={log.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                {...swipeHandlers(log)}
              >
                {editingId === log.id ? (
                  <>
                    <td className="p-2">
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        className="neumorphic p-1 rounded"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="neumorphic p-1 rounded"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={editForm.subcategory}
                        onChange={(e) => setEditForm({ ...editForm, subcategory: e.target.value })}
                        className="neumorphic p-1 rounded"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="time"
                        value={editForm.startTime}
                        onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                        className="neumorphic p-1 rounded"
                      />
                      -
                      <input
                        type="time"
                        value={editForm.endTime}
                        onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
                        className="neumorphic p-1 rounded"
                      />
                    </td>
                    <td className="p-2">{editForm.duration} min</td>
                    <td className="p-2">
                      <button
                        onClick={handleSave}
                        className="neumorphic p-1 bg-[var(--accent)] text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="neumorphic p-1 bg-gray-500 text-white rounded ml-2"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2">{log.date}</td>
                    <td className="p-2">{log.category}</td>
                    <td className="p-2">{log.subcategory}</td>
                    <td className="p-2">{`${log.startTime} - ${log.endTime}`}</td>
                    <td className="p-2">{log.duration} min</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleEdit(log)}
                        className="neumorphic p-1 bg-[var(--secondary)] text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(log)}
                        className="neumorphic p-1 bg-red-500 text-white rounded ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </FrostedCard>
  );
}

export default LogTable;