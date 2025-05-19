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
    const updatedLogs = logs.map((log) =>
      log.id === id ? { ...log, ...updatedLog } : log
    );
    persistLogs(updatedLogs);
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