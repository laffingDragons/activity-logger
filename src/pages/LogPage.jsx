import { Link } from "react-router-dom";
import { useState } from "react";
import LogForm from "../components/LogForm";
import LogTable from "../components/LogTable";
import ChartSelector from "../components/ChartSelector";
import ActivityChart from "../components/ActivityChart";
import FrostedCard from "../components/FrostedCard";
import { motion } from "framer-motion";
import { useLogs } from "../hooks/useLogs";
import { useCategories } from "../hooks/useCategories";

function LogPage() {
  const { logs } = useLogs();
  const { categories } = useCategories();
  const [refreshKey, setRefreshKey] = useState(0);
  const [chartType, setChartType] = useState('category');
  const [timeFilter, setTimeFilter] = useState('today');

  const handleLogAdded = (newLog) => {
    // Force a re-render of LogTable
    setRefreshKey((prev) => prev + 1);
  };

  // Calculate today's stats
  const getTodayStats = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1).toISOString().split('T')[0];
    const todayLogs = logs.filter((log) => {
      const logDate = new Date(log.date).toISOString().split('T')[0];
      return logDate === today;
    });

    return {
      totalTime: todayLogs.reduce((sum, log) => sum + (parseInt(log.duration) || 0), 0),
      count: todayLogs.length,
    };
  };

  const todayStats = getTodayStats();

  return (
    <motion.div
      className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <div className="flex gap-6 mb-6">
          {/* Weekly Stats card */}
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
                    {(logs.reduce((sum, log) => sum + log.duration, 0) / 60).toFixed(1)} hours
                  </p>
                  <p className="text-sm">Activities: {logs.length}</p>
                </div>
              </div>
            </motion.div>
          </FrostedCard>

          {/* Today's Stats card */}
          <FrostedCard className="flex-1">
            <h2 className="text-lg font-bold mb-3">Today's Stats</h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex-1 bg-green-100 p-3 rounded-lg">
                <p className="text-sm font-medium text-green-800">
                  Time: {(todayStats.totalTime / 60).toFixed(1)} hours
                </p>
                <p className="text-sm font-medium text-green-800">
                  Activities: {todayStats.count}
                </p>
              </div>
            </motion.div>
          </FrostedCard>
        </div>

        <LogForm onLogAdded={handleLogAdded} />
      </div>
      <div>
          <ChartSelector 
            onChartTypeChange={setChartType}
            onTimeFilterChange={setTimeFilter}
          />
          {/* <div className="mt-4">
            <ActivityChart 
              chartType={chartType}
              timeFilter={timeFilter}
            />
          </div> */}
        <LogTable key={refreshKey} />
      </div>
    </motion.div>
  );
}

export default LogPage;