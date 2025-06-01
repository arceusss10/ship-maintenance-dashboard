import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { calculateDashboardStats } from '../utils/localStorageUtils';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalShips: 0,
    overdueComponents: 0,
    jobsInProgress: 0,
    jobsCompleted: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const loadStats = () => {
      try {
        const calculatedStats = calculateDashboardStats();
        setStats(calculatedStats);
        setError(null);
      } catch (err) {
        console.error("Error loading stats:", err);
        setError("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 ${color}`}>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome, {currentUser.name}!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Ships"
            value={stats.totalShips}
            color="border-l-4 border-blue-500"
          />
          <StatCard
            title="Overdue Components"
            value={stats.overdueComponents}
            color="border-l-4 border-red-500"
          />
          <StatCard
            title="Jobs in Progress"
            value={stats.jobsInProgress}
            color="border-l-4 border-yellow-500"
          />
          <StatCard
            title="Completed Jobs"
            value={stats.jobsCompleted}
            color="border-l-4 border-green-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 