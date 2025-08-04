import React, { useEffect, useState, useRef } from 'react';
import Chart from 'react-apexcharts';
import api from '../api';

const CpuLoadChartCard = () => {
  const [dataPoints, setDataPoints] = useState([]);
  const maxPoints = 20;
  const chartRef = useRef(null);

  const fetchCpuLoad = async () => {
    try {
      const res = await api.get('/health');
      const cpu = res.data.cpu_percent || Math.random() * 100; // fallback for mock
      setDataPoints(prev => {
        const updated = [...prev, cpu];
        return updated.length > maxPoints ? updated.slice(-maxPoints) : updated;
      });
    } catch {
      // push a placeholder if the fetch fails
      setDataPoints(prev => [...prev, 0]);
    }
  };

  useEffect(() => {
    fetchCpuLoad(); // initial fetch
    const interval = setInterval(fetchCpuLoad, 5000); // every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const chartOptions = {
    chart: {
      id: 'cpu-load',
      type: 'line',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 500,
        dynamicAnimation: { speed: 500 },
      },
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: dataPoints.map((_, i) => i + 1),
      labels: { show: false },
    },
    yaxis: {
      max: 100,
      title: { text: 'CPU %' },
    },
    tooltip: {
      y: { formatter: val => `${val.toFixed(1)}%` },
    },
  };

  const chartSeries = [
    {
      name: 'CPU Load',
      data: dataPoints.map(v => parseFloat(v.toFixed(1))),
    },
  ];

  return (
    <div className="col-md-6">
      <div className="card mb-4">
        <div className="card-header bg-info text-white">CPU Load (Last ~2 min)</div>
        <div className="card-body">
          <Chart
            ref={chartRef}
            options={chartOptions}
            series={chartSeries}
            type="line"
            height="250"
          />
        </div>
      </div>
    </div>
  );
};

export default CpuLoadChartCard;


// import CpuLoadChartCard from './CpuLoadChartCard';

// function DashboardExample() {
//   return (
//     <div className="container">
//       <h4 className="mb-3">System Health Overview</h4>
//       <div className="row">
//         <SystemStatusDashboard />
//         <CpuLoadChartCard />
//       </div>
//     </div>
//   );
// }
