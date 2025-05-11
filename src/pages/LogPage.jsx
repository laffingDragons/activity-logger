import { Link } from "react-router-dom";
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
          <Link to="/master" className="neumorphic p-2 bg-[var(--accent)] text-white rounded-lg text-sm">
            Manage Categories
          </Link>
          <button onClick={handleExport} className="neumorphic p-2 bg-[var(--secondary)] text-white rounded-lg text-sm">
            Export CSV
          </button>
          <label className="neumorphic p-2 bg-[var(--secondary)] text-white rounded-lg text-sm">
            Import CSV
            <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
          </label>
        </div>
        <FrostedCard className="mb-6">
          <h2 className="text-lg font-bold mb-3">Weekly Stats</h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm">Total Time: {logs.reduce((sum, log) => sum + log.duration, 0)} min</p>
            <p className="text-sm">Activities: {logs.length}</p>
          </motion.div>
        </FrostedCard>
        <LogForm onLogAdded={() => window.scrollTo(0, 0)} />
      </div>
      <div>
        <ChartSelector />
        <LogTable />
      </div>
    </motion.div>
  );
}

export default LogPage;