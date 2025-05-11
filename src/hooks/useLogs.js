import { useState, useEffect } from "react";

export function useLogs() {
  const [logs, setLogs] = useState(() => {
    return JSON.parse(localStorage.getItem("logs")) || [];
  });

  useEffect(() => {
    localStorage.setItem("logs", JSON.stringify(logs));
  }, [logs]);

  const addLog = (log) => {
    setLogs([...logs, log]);
  };

  const updateLog = (id, updatedLog) => {
    setLogs(logs.map((log) => (log.id === id ? { ...log, ...updatedLog } : log)));
  };

  const deleteLog = (id) => {
    setLogs(logs.filter((log) => log.id !== id));
  };

  return { logs, addLog, updateLog, deleteLog };
}