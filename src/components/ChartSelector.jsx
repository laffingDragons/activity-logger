import { useState } from "react";
import { motion } from "framer-motion";
import { Bar, Pie, Line, Doughnut, Radar } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { useLogs } from "../hooks/useLogs";
import FrostedCard from "./FrostedCard";

ChartJS.register(...registerables);

function ChartSelector() {
  const { logs } = useLogs();
  const [chartType, setChartType] = useState("Pie");
  const [filter, setFilter] = useState("category");
  const [timeFilter, setTimeFilter] = useState("today");

  const handleChartChange = (type) => {
    setChartType(type);
  };

  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter);
  };

  const chartData = {
    labels: [...new Set(logs.map((log) => log[filter]))],
    datasets: [
      {
        label: "Time Spent (min)",
        data: [...new Set(logs.map((log) => log[filter]))].map(
          (item) => logs
            .filter((log) => log[filter] === item)
            .reduce((sum, log) => sum + log.duration, 0)
        ),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: ["var(--accent)"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: { display: true },
      datalabels: { color: "var(--text)" },
    },
    animation: {
      duration: 1000,
      easing: "easeOutBounce",
    },
  };

  const chartComponents = {
    Bar: <Bar data={chartData} options={chartOptions} />,
    Pie: <Pie data={chartData} options={chartOptions} />,
    Line: <Line data={chartData} options={chartOptions} />,
    Doughnut: <Doughnut data={chartData} options={chartOptions} />,
    Radar: <Radar data={chartData} options={chartOptions} />,
  };

  return (
    <FrostedCard className="mb-4">
      <h2 className="text-lg font-bold mb-4">Activity Insights</h2>
      <div className="flex gap-2 mb-4">
        <select
          value={timeFilter}
          onChange={(e) => handleTimeFilterChange(e.target.value)}
          className="neumorphic p-2 rounded"
        >
          <option value="today">Today</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
        <select
          value={chartType}
          onChange={(e) => handleChartChange(e.target.value)}
          className="neumorphic p-2 rounded"
        >
          <option value="Pie">Pie</option>
          <option value="Bar">Bar</option>
          <option value="Line">Line</option>
          <option value="Doughnut">Doughnut</option>
          <option value="Radar">Radar</option>
        </select>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="neumorphic p-2 rounded"
        >
          <option value="category">Category</option>
          <option value="subcategory">Subcategory</option>
          <option value="date">Date</option>
        </select>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {chartComponents[chartType]}
      </motion.div>
    </FrostedCard>
  );
}

export default ChartSelector;