import { useState, useEffect, useCallback } from "react";

export function useLogs() {
  const [logs, setLogs] = useState([]);

  // Load logs from localStorage
  useEffect(() => {
    const storedLogs = JSON.parse(localStorage.getItem("logs") || "[]");
    setLogs(storedLogs);
  }, []);

  // Persist logs to localStorage
  const persistLogs = useCallback(
    (updatedLogs) => {
      localStorage.setItem("logs", JSON.stringify(updatedLogs));
      setLogs(updatedLogs);
    },
    [setLogs]
  );

  const addLog = async (log) => {
    const updatedLogs = [...logs, log];
    persistLogs(updatedLogs);
    return log;
  };

  const updateLog = (id, updatedLog) => {
    const updatedLogs = logs.map((log) => {
      if (log.id === id) {
        // Ensure all required fields are present
        const finalLog = {
          ...log,
          ...updatedLog,
          id: log.id, // Preserve the original ID
          date: updatedLog.date || log.date,
          category: updatedLog.category || log.category,
          subcategory: updatedLog.subcategory || log.subcategory,
          startTime: updatedLog.startTime || log.startTime,
          endTime: updatedLog.endTime || log.endTime,
          duration: updatedLog.duration || log.duration,
          lastModified: new Date().toISOString() // Add modification timestamp
        };
        return finalLog;
      }
      return log;
    });
    
    persistLogs(updatedLogs);
    
    // Return the updated log for potential use
    return updatedLogs.find(log => log.id === id);
  };

  const deleteLog = (id) => {
    const updatedLogs = logs.filter((log) => log.id !== id);
    persistLogs(updatedLogs);
  };

  return {
    logs,
    addLog,
    updateLog,
    deleteLog,
    refreshLogs: () => {
      const storedLogs = JSON.parse(localStorage.getItem("logs") || "[]");
      setLogs(storedLogs);
    },
  };
}