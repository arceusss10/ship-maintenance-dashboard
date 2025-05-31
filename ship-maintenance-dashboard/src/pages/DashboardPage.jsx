import React from "react";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const DashboardPage = () => {
  // Mock data - will be replaced with actual data from context/localStorage
  const totalShips = 5;
  const overdueComponents = 3;
  const jobsInProgress = 7;
  const jobsCompleted = 12;

  const { currentUser } = useContext(AuthContext);
  const role = currentUser?.role;

  // KPI Card Component
  const KPICard = ({ title, value, color }) => (
    <div className={`${color} rounded-lg shadow-md p-6`}>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Role-based welcome messages */}
      {role === "Admin" && (
        <p className="mb-4 text-blue-600 font-semibold">
          Welcome, Admin! You have full control over ships and users.
        </p>
      )}
      {role === "Engineer" && (
        <p className="mb-4 text-green-600 font-semibold">
          Welcome, Engineer! Here are your assigned maintenance jobs.
        </p>
      )}
      {role === "Inspector" && (
        <p className="mb-4 text-yellow-600 font-semibold">
          Welcome, Inspector! Here's an overview of inspection reports.
        </p>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Ships"
          value={totalShips}
          color="bg-white hover:bg-blue-50"
        />
        <KPICard
          title="Overdue Components"
          value={overdueComponents}
          color="bg-white hover:bg-red-50"
        />
        <KPICard
          title="Jobs in Progress"
          value={jobsInProgress}
          color="bg-white hover:bg-yellow-50"
        />
        <KPICard
          title="Completed Jobs"
          value={jobsCompleted}
          color="bg-white hover:bg-green-50"
        />
      </div>

      {/* Role-specific content sections */}
      {role === "Admin" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
            <ul className="space-y-2">
              <li className="text-gray-600">New ship added: Ever Given</li>
              <li className="text-gray-600">Component maintenance scheduled</li>
              <li className="text-gray-600">Inspection report submitted</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">System Status</h2>
            <ul className="space-y-2">
              <li className="text-green-600">All systems operational</li>
              <li className="text-yellow-600">3 pending maintenance tasks</li>
              <li className="text-red-600">2 overdue inspections</li>
            </ul>
          </div>
        </div>
      )}

      {role === "Engineer" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">My Assigned Jobs</h2>
            <ul className="space-y-2">
              <li className="text-gray-600">Engine maintenance - Ever Given</li>
              <li className="text-gray-600">Radar check - Maersk Alabama</li>
              <li className="text-gray-600">Component replacement scheduled</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Maintenance</h2>
            <ul className="space-y-2">
              <li className="text-yellow-600">Main Engine Service (Tomorrow)</li>
              <li className="text-gray-600">Navigation System Check (Next Week)</li>
              <li className="text-gray-600">Safety Equipment Inspection (Next Month)</li>
            </ul>
          </div>
        </div>
      )}

      {role === "Inspector" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Pending Inspections</h2>
            <ul className="space-y-2">
              <li className="text-red-600">Ever Given - Annual Safety Check</li>
              <li className="text-yellow-600">Maersk Alabama - Quarterly Review</li>
              <li className="text-gray-600">New ship registration inspection</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
            <ul className="space-y-2">
              <li className="text-gray-600">Safety compliance report submitted</li>
              <li className="text-gray-600">Equipment certification completed</li>
              <li className="text-gray-600">Maintenance standards review</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage; 