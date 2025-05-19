import { Link } from "react-router-dom";
import { useState } from "react";
import LogForm from "../components/LogForm";
import LogTable from "../components/LogTable";
import ChartSelector from "../components/ChartSelector";
import FrostedCard from "../components/FrostedCard";
import { motion } from "framer-motion";
import { useLogs } from "../hooks/useLogs";
import { exportToCSV, importFromCSV } from "../utils/storage";
import { useCategories } from "../hooks/useCategories";

function LogPage() {
  const { logs } = useLogs();
  const { categories } = useCategories();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogAdded = (newLog) => {
    // Force a re-render of LogTable
    setRefreshKey((prev) => prev + 1);
  };

  const handleExport = () => {
    exportToCSV(logs, categories);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    importFromCSV(file, (data) => {
      localStorage.setItem("logs", JSON.stringify(data));
      window.location.reload();
    });
  };

  return (
    <motion.div
      className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <div className="flex gap-3 mb-6">
          <Link
            to="/master"
            className="neumorphic p-2 bg-[var(--accent)] text-purple-900 rounded-lg text-sm"
          >
            Manage Categories
          </Link>
          <button
            onClick={handleExport}
            className="neumorphic p-2 bg-[var(--secondary)] text-purple-900 rounded-lg text-sm"
          >
            Export CSV
          </button>
          <label className="neumorphic p-2 bg-[var(--secondary)] text-purple-900 rounded-lg text-sm">
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
        <div className="flex gap-6 mb-6">
          <FrostedCard className="flex-1">
            <h2 className="text-lg font-bold mb-3">Weekly Stats</h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-sm">
                    Total Time:{" "}
                    {logs.reduce((sum, log) => sum + log.duration, 0)} min
                  </p>
                  <p className="text-sm">Activities: {logs.length}</p>
                </div>
              </div>
            </motion.div>
          </FrostedCard>
          <FrostedCard className="flex-1">
            <h2 className="text-lg font-bold mb-3">Today's Stats</h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex-1 bg-green-100 p-3 rounded-lg">
                {(() => {
                  const today = new Date().toISOString().split("T")[0];
                  const todayLogs = logs.filter((log) => log.date === today);
                  const todayTotal = todayLogs.reduce(
                    (sum, log) => sum + log.duration,
                    0
                  );
                  return (
                    <>
                      <p className="text-sm text-green-800">
                        Time: {todayTotal} min
                      </p>
                      <p className="text-sm text-green-800">
                        Activities: {todayLogs.length}
                      </p>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          </FrostedCard>
        </div>
        <LogForm onLogAdded={handleLogAdded} />
      </div>
      <div>
        <ChartSelector />
        <LogTable key={refreshKey} />
      </div>
    </motion.div>
  );
}

export default LogPage;