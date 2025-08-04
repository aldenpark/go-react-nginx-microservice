import React, { useEffect, useState } from 'react';
import api from '../api';

const statusColor = (status) => {
  switch (status) {
    case 'ok':
    case 'healthy':
      return 'success';
    case 'degraded':
    case 'warn':
      return 'warning';
    case 'error':
    case 'down':
      return 'danger';
    default:
      return 'secondary';
  }
};

const StatusCard = ({ title, status, description, loading }) => {
  const color = statusColor(status);

  return (
    <div className="col-md-4 mb-4">
      <div className={`card border-${color}`}>
        <div className={`card-header bg-${color} text-white`}>
          {title}
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status" />
              <div className="mt-2">Checking...</div>
            </div>
          ) : (
            <>
              <h5 className="card-title">
                Status: <span className={`text-${color}`}>{status}</span>
              </h5>
              <p className="card-text">{description}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const SystemStatusDashboard = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await api.get('/health');
      setHealth({
        backend: res.data.status || 'unknown',
        cpu: res.data.cpu || 'healthy',
        db: res.data.db || 'ok',
        version: res.data.version || 'v1.0.0',
      });
    } catch (err) {
      setHealth({
        backend: 'error',
        cpu: 'unknown',
        db: 'unknown',
        version: 'unknown',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="row">
      <StatusCard
        title="Backend Service"
        status={health?.backend}
        description="Checks if the Go microservice is responding."
        loading={loading}
      />
      <StatusCard
        title="CPU Load"
        status={health?.cpu}
        description="Current CPU status of the server."
        loading={loading}
      />
      <StatusCard
        title="Database"
        status={health?.db}
        description="Database connection and readiness."
        loading={loading}
      />
      <StatusCard
        title="App Version"
        status={health?.version}
        description="Currently deployed app version."
        loading={loading}
      />
    </div>
  );
};

export default SystemStatusDashboard;


// import SystemStatusDashboard from './components/SystemStatusDashboard';

// function DashboardExample() {
//   return (
//     <div className="container">
//       <h4 className="mb-3">System Health Overview</h4>
//       <SystemStatusDashboard />
//     </div>
//   );
// }
