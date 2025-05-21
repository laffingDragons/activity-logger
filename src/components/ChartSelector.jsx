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

  const getFilteredLogs = () => {
    const now = new Date();
    // Set hours, minutes, seconds to 0 for accurate date comparison
    now.setHours(0, 0, 0, 0);
    const today = new Date().toISOString().split('T')[0];
    
    // Helper function to determine if an activity spans to the next day
    const spansNextDay = (log) => {
      const startDateTime = new Date(`${log.date}T${log.startTime}`);
      const endDateTime = new Date(`${log.date}T${log.endTime}`);
      return endDateTime < startDateTime;
    };

    // Helper function to check if activity overlaps with a given date
    const overlapsWithDate = (log, dateStr) => {
      // Activity is directly on this date
      if (log.date === dateStr) {
        return true;
      }
      
      // Activity is from the previous day and spans to this date
      const logDate = new Date(log.date);
      const targetDate = new Date(dateStr);
      
      if (spansNextDay(log)) {
        const nextDay = new Date(logDate);
        nextDay.setDate(nextDay.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);
        
        // If the activity spans to the next day and that next day is our target date
        return nextDay.toISOString().split('T')[0] === dateStr;
      }
      
      return false;
    };

    switch (timeFilter) {
      case 'today':
        return logs.filter(log => {
          return overlapsWithDate(log, today);
        });

      case 'yesterday':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() );
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        return logs.filter(log => {
          return overlapsWithDate(log, yesterdayStr);
        });

      case 'week':
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);
        
        return logs.filter(log => {
          const logDate = new Date(log.date);
          logDate.setHours(0, 0, 0, 0);
          
          // Check if the log date is within the past week
          if (logDate >= weekAgo && logDate <= now) {
            return true;
          }
          
          // Check if the log spans from before the week into the week
          if (spansNextDay(log)) {
            const nextDay = new Date(logDate);
            nextDay.setDate(nextDay.getDate() + 1);
            return nextDay >= weekAgo;
          }
          
          return false;
        });

      case 'month':
        const monthAgo = new Date(now);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        monthAgo.setHours(0, 0, 0, 0);
        
        return logs.filter(log => {
          const logDate = new Date(log.date);
          logDate.setHours(0, 0, 0, 0);
          
          // Check if the log date is within the past month
          if (logDate >= monthAgo && logDate <= now) {
            return true;
          }
          
          // Check if the log spans from before the month into the month
          if (spansNextDay(log)) {
            const nextDay = new Date(logDate);
            nextDay.setDate(nextDay.getDate() + 1);
            return nextDay >= monthAgo;
          }
          
          return false;
        });

      default:
        return logs;
    }
  };

  const handleChartChange = (type) => {
    setChartType(type);
  };

  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter);
  };

  // Update chartData to use filtered logs
  const filteredLogs = getFilteredLogs();
  const chartData = {
    labels: [...new Set(filteredLogs.map((log) => log[filter]))],
    datasets: [
      {
        label: "Time Spent (min)",
        data: [...new Set(filteredLogs.map((log) => log[filter]))].map(
          (item) => filteredLogs
            .filter((log) => log[filter] === item)
            .reduce((sum, log) => sum + log.duration, 0)
        ),
        backgroundColor: [
          'rgba(255, 182, 193, 0.6)',  // Light pink
          'rgba(176, 224, 230, 0.6)',  // Powder blue
          'rgba(255, 218, 185, 0.6)',  // Peach
          'rgba(221, 160, 221, 0.6)',  // Plum
          'rgba(176, 196, 222, 0.6)',  // Light steel blue
          'rgba(152, 251, 152, 0.6)',  // Pale green
          'rgba(238, 232, 170, 0.6)',  // Pale goldenrod
          'rgba(230, 230, 250, 0.6)',  // Lavender
          'rgba(255, 160, 122, 0.6)',  // Light salmon
          'rgba(173, 216, 230, 0.6)',  // Light blue
          'rgba(240, 230, 140, 0.6)',  // Khaki
          'rgba(144, 238, 144, 0.6)',  // Light green
          'rgba(255, 192, 203, 0.6)',  // Pink
          'rgba(175, 238, 238, 0.6)',  // Pale turquoise
          'rgba(216, 191, 216, 0.6)',  // Thistle
        ],
        borderColor: ['var(--accent)'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { size: 11 }
        }
      },
      title: {
        display: true,
        text: `${filter.charAt(0).toUpperCase() + filter.slice(1)} Distribution`,
        font: { size: 16 }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutBounce',
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Minutes'
        }
      }
    }
  };

  const chartComponents = {
    Bar: <Bar data={chartData} options={lineChartOptions} />,
    'Horizontal Bar': <Bar data={chartData} options={{ ...lineChartOptions, indexAxis: 'y' }} />,
    Line: <Line data={chartData} options={lineChartOptions} />,
    Pie: <Pie data={chartData} options={chartOptions} />,
    Doughnut: <Doughnut data={chartData} options={chartOptions} />,
    Radar: <Radar data={chartData} options={chartOptions} />,
    'Polar Area': <Pie data={chartData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, polarArea: true } }} />,
  };

  return (
    <FrostedCard className="mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-lg font-bold">Activity Insights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-auto">
          <select
            value={timeFilter}
            onChange={(e) => handleTimeFilterChange(e.target.value)}
            className="neumorphic p-2 rounded w-full text-sm"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
          <select
            value={chartType}
            onChange={(e) => handleChartChange(e.target.value)}
            className="neumorphic p-2 rounded w-full text-sm"
          >
            <option value="Pie">Pie Chart</option>
            <option value="Doughnut">Doughnut Chart</option>
            <option value="Bar">Bar Chart</option>
            <option value="Horizontal Bar">Horizontal Bar</option>
            <option value="Line">Line Chart</option>
            <option value="Radar">Radar Chart</option>
            <option value="Polar Area">Polar Area</option>
          </select>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="neumorphic p-2 rounded w-full text-sm"
          >
            <option value="category">Category</option>
            <option value="subcategory">Subcategory</option>
            <option value="date">Date</option>
          </select>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-[300px] flex items-center justify-center"
      >
        {chartComponents[chartType]}
      </motion.div>
    </FrostedCard>
  );
}

export default ChartSelector;