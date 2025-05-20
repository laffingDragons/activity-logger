import { useEffect, useRef, useState } from 'react';
import { useLogs } from '../hooks/useLogs';
import Chart from 'chart.js/auto';

function ActivityChart({ chartType = 'category', timeFilter = 'today' }) {
  const { logs } = useLogs();
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);

  const getFilteredLogs = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0];
    
    switch (timeFilter) {
      case 'today':
        return logs.filter(log => log.date === today);
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

  const pastelColors = [
    'rgba(240, 248, 255, 0.7)',  // alice blue
    'rgba(144, 238, 144, 0.7)',  // light green
    'rgba(230, 230, 250, 0.7)',  // lavender
    'rgba(176, 224, 230, 0.7)',  // powder blue
    'rgba(238, 130, 238, 0.7)',  // violet
    'rgba(221, 160, 221, 0.7)',  // plum
    'rgba(255, 218, 185, 0.7)',  // peach
    'rgba(255, 240, 245, 0.7)',  // lavender blush
    'rgba(173, 216, 230, 0.7)',  // light blue
    'rgba(152, 251, 152, 0.7)',  // pale green
  ];

  const processData = (chartType, filteredLogs) => {
    switch (chartType) {
      case 'category':
        return processCategories(filteredLogs);
      case 'timeline':
        return processTimeline(filteredLogs);
      case 'breakdown':
        return processBreakdown(filteredLogs);
      default:
        return processCategories(filteredLogs);
    }
  };

  const processCategories = (filteredLogs) => {
    const data = filteredLogs.reduce((acc, log) => {
      if (!log.category || !log.duration) return acc;
      if (!acc[log.category]) acc[log.category] = 0;
      acc[log.category] += parseFloat(log.duration) / 60; // Convert to hours
      return acc;
    }, {});

    return {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data),
        backgroundColor: pastelColors.slice(0, Object.keys(data).length),
        borderColor: pastelColors.slice(0, Object.keys(data).length).map(color => color.replace('0.7', '1')),
        borderWidth: 1
      }]
    };
  };

  const processTimeline = (filteredLogs) => {
    const timeData = filteredLogs.reduce((acc, log) => {
      const date = log.date;
      if (!acc[date]) acc[date] = 0;
      acc[date] += parseFloat(log.duration) / 60; // Convert to hours
      return acc;
    }, {});

    return {
      labels: Object.keys(timeData).sort(),
      datasets: [{
        label: 'Hours Spent',
        data: Object.keys(timeData).sort().map(date => timeData[date]),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true
      }]
    };
  };

  const processBreakdown = (filteredLogs) => {
    const data = filteredLogs.reduce((acc, log) => {
      if (!log.category || !log.subcategory || !log.duration) return acc;
      const key = `${log.category} - ${log.subcategory}`;
      if (!acc[key]) acc[key] = 0;
      acc[key] += parseFloat(log.duration) / 60; // Convert to hours
      return acc;
    }, {});

    return {
      labels: Object.keys(data),
      datasets: [{
        data: Object.values(data),
        backgroundColor: pastelColors.slice(0, Object.keys(data).length),
        borderColor: pastelColors.slice(0, Object.keys(data).length).map(color => color.replace('0.7', '1')),
        borderWidth: 1
      }]
    };
  };

  useEffect(() => {
    if (!chartRef.current) return;

    const updateChart = () => {
      const filteredLogs = getFilteredLogs();
      if (filteredLogs.length === 0) {
        if (chart) {
          chart.destroy();
          setChart(null);
        }
        return;
      }

      const data = processData(chartType, filteredLogs);
      const config = {
        type: chartType === 'timeline' ? 'line' : 'doughnut',
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                font: { size: 12 }
              }
            },
            title: {
              display: true,
              text: `Activity ${chartType === 'timeline' ? 'Timeline' : 
                    chartType === 'breakdown' ? 'Breakdown' : 
                    'Distribution'} (${timeFilter})`,
              font: { size: 16 }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.raw;
                  return ` ${value.toFixed(1)} hours`;
                }
              }
            }
          },
          ...(chartType === 'timeline' && {
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Hours'
                }
              }
            }
          })
        }
      };

      if (chart) {
        chart.data = config.data;
        chart.options = config.options;
        chart.config.type = config.type;
        chart.update('none');
      } else {
        const newChart = new Chart(chartRef.current, config);
        setChart(newChart);
      }
    };

    updateChart();

    return () => {
      if (chart) {
        chart.destroy();
        setChart(null);
      }
    };
  }, [logs, chart, chartType, timeFilter]);

  if (!logs || logs.length === 0) {
    return (
      <div className="w-full h-full min-h-[300px] p-4 flex items-center justify-center text-gray-500">
        No activity data available
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[300px] p-4">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default ActivityChart;