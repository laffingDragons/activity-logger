import { useEffect, useRef, useState } from 'react';
import { useLogs } from '../hooks/useLogs';
import Chart from 'chart.js/auto';

function ActivityChart() {
  const { logs } = useLogs();
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);

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
    'rgba(255, 182, 193, 0.7)',  // pink
    'rgba(135, 206, 235, 0.7)',  // sky blue
    'rgba(255, 228, 196, 0.7)',  // bisque
    'rgba(216, 191, 216, 0.7)',  // thistle
    'rgba(176, 196, 222, 0.7)',  // light steel blue
    'rgba(240, 255, 240, 0.7)',  // honeydew
    'rgba(245, 255, 250, 0.7)',  // mint cream
    'rgba(255, 250, 205, 0.7)',  // lemon chiffon
    'rgba(250, 235, 215, 0.7)',  // antique white
    'rgba(255, 239, 213, 0.7)'   // papaya whip
  ];

  useEffect(() => {
    if (!chartRef.current) return;

    const updateChart = () => {
      // Process data
      const categoryData = logs.reduce((acc, log) => {
        if (!log.category || !log.duration) return acc;
        const category = log.category;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += parseFloat(log.duration);
        return acc;
      }, {});

      // Don't create/update chart if no data
      if (Object.keys(categoryData).length === 0) {
        if (chart) {
          chart.destroy();
          setChart(null);
        }
        return;
      }

      const chartConfig = {
        type: 'doughnut',
        data: {
          labels: Object.keys(categoryData),
          datasets: [{
            data: Object.values(categoryData),
            backgroundColor: pastelColors.slice(0, Object.keys(categoryData).length),
            borderColor: pastelColors.slice(0, Object.keys(categoryData).length).map(color => color.replace('0.7', '1')),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                font: {
                  size: 12
                }
              }
            },
            title: {
              display: true,
              text: 'Activity Distribution',
              font: {
                size: 16
              }
            }
          }
        }
      };

      if (chart) {
        // Update existing chart
        chart.data = chartConfig.data;
        chart.options = chartConfig.options;
        chart.update('none');
      } else {
        // Create new chart
        const newChart = new Chart(chartRef.current, chartConfig);
        setChart(newChart);
      }
    };

    // Update the chart whenever logs change
    updateChart();

    // Cleanup function
    return () => {
      if (chart) {
        chart.destroy();
        setChart(null);
      }
    };
  }, [logs, chart]); // Include both logs and chart in dependencies

  // Don't render anything if no valid data
  if (!logs || logs.length === 0) {
    return null;
  }

  return (
    <div className="w-full h-full min-h-[300px] p-4">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default ActivityChart;