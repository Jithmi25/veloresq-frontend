import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface DashboardStats {
  totalUsers: number;
  totalGarages: number;
  totalBookings: number;
  totalEmergencies: number;
}

interface SystemHealth {
  uptime: string;
  cpuUsage: number;
  memoryUsage: number;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // API calls
        const [statsRes, healthRes, activityRes] = await Promise.all([
          axios.get('/api/admin/dashboard'),
          axios.get('/api/admin/health'),
          axios.get('/api/admin/activities'),
        ]);

        setStats(statsRes.data);
        setHealth(healthRes.data);
        setActivities(activityRes.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Total Users</p>
          <p className="text-xl font-semibold">{stats?.totalUsers}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Total Garages</p>
          <p className="text-xl font-semibold">{stats?.totalGarages}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Total Bookings</p>
          <p className="text-xl font-semibold">{stats?.totalBookings}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Total Emergencies</p>
          <p className="text-xl font-semibold">{stats?.totalEmergencies}</p>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-2xl font-bold mb-2">System Health</h2>
        <p><strong>Uptime:</strong> {health?.uptime}</p>
        <p><strong>CPU Usage:</strong> {health?.cpuUsage}%</p>
        <p><strong>Memory Usage:</strong> {health?.memoryUsage}%</p>
      </div>

      {/* Recent Activities */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-2xl font-bold mb-2">Recent Activities</h2>
        {activities.length === 0 ? (
          <p>No recent activities.</p>
        ) : (
          <ul className="list-disc list-inside">
            {activities.map((activity) => (
              <li key={activity.id}>
                [{new Date(activity.timestamp).toLocaleString()}] <strong>{activity.type}</strong>: {activity.description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
