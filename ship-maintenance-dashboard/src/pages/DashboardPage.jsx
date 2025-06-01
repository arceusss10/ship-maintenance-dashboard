import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { calculateDashboardStats } from "../utils/localStorageUtils";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalShips: 0,
    overdueComponents: 0,
    jobsInProgress: 0,
    jobsCompleted: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const role = currentUser?.role;

  useEffect(() => {
    console.log("DashboardPage mounted, currentUser:", currentUser);
    
    const loadStats = () => {
      try {
        console.log("Calculating dashboard stats...");
        const calculatedStats = calculateDashboardStats();
        console.log("Calculated stats:", calculatedStats);
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
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, [currentUser]);

  if (!currentUser) {
    console.log("No current user found");
    return <div className="p-6 text-red-600">Please log in to view the dashboard.</div>;
  }

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

  // KPI Card Component
  const KPICard = ({ title, value }) => (
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome, {currentUser.role}!</p>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Ships"
            value={stats.totalShips}
          />
          <KPICard
            title="Overdue Components"
            value={stats.overdueComponents}
          />
          <KPICard
            title="Jobs in Progress"
            value={stats.jobsInProgress}
          />
          <KPICard
            title="Completed Jobs"
            value={stats.jobsCompleted}
          />
        </div>

        {/* Role-specific Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {role === "Admin" && (
                <>
                  <p className="text-gray-600">✓ New ship registration completed</p>
                  <p className="text-gray-600">⚠ Maintenance schedule updated</p>
                  <p className="text-gray-600">ℹ System backup completed</p>
                </>
              )}
              {role === "Engineer" && (
                <>
                  <p className="text-gray-600">🔧 Engine maintenance scheduled</p>
                  <p className="text-gray-600">📋 Inspection report submitted</p>
                  <p className="text-gray-600">⚡ Component replacement completed</p>
                </>
              )}
              {role === "Inspector" && (
                <>
                  <p className="text-gray-600">📝 Safety inspection completed</p>
                  <p className="text-gray-600">🔍 Quality check scheduled</p>
                  <p className="text-gray-600">📊 Monthly report generated</p>
                </>
              )}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Tasks</h2>
            <div className="space-y-4">
              {role === "Admin" && (
                <>
                  <p className="text-gray-600">📅 Monthly review meeting</p>
                  <p className="text-gray-600">📊 Generate quarterly report</p>
                  <p className="text-gray-600">👥 Staff training session</p>
                </>
              )}
              {role === "Engineer" && (
                <>
                  <p className="text-gray-600">🔧 Scheduled maintenance</p>
                  <p className="text-gray-600">⚡ Emergency repair</p>
                  <p className="text-gray-600">📝 Equipment testing</p>
                </>
              )}
              {role === "Inspector" && (
                <>
                  <p className="text-gray-600">🔍 Annual inspection due</p>
                  <p className="text-gray-600">📋 Compliance review</p>
                  <p className="text-gray-600">📝 Safety audit</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 