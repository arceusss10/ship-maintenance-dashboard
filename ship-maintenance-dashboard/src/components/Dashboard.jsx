import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalShips: 0,
    overdueComponents: 0,
    jobsInProgress: 0,
    jobsCompleted: 0,
    jobsByPriority: {
      High: 0,
      Medium: 0,
      Low: 0
    },
    jobsByType: {},
    componentsByStatus: {
      Active: 0,
      'Under Maintenance': 0,
      'Needs Attention': 0
    }
  });

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const calculateStats = () => {
      const ships = JSON.parse(localStorage.getItem('ships')) || [];
      const components = JSON.parse(localStorage.getItem('components')) || [];
      const jobs = JSON.parse(localStorage.getItem('jobs')) || [];

      // Calculate jobs by priority
      const jobsByPriority = jobs.reduce((acc, job) => {
        acc[job.priority] = (acc[job.priority] || 0) + 1;
        return acc;
      }, { High: 0, Medium: 0, Low: 0 });

      // Calculate jobs by type
      const jobsByType = jobs.reduce((acc, job) => {
        acc[job.jobType] = (acc[job.jobType] || 0) + 1;
        return acc;
      }, {});

      // Calculate components by status
      const componentsByStatus = components.reduce((acc, comp) => {
        const lastMaintenance = new Date(comp.lastMaintenanceDate);
        const monthsSinceLastMaintenance = (new Date() - lastMaintenance) / (1000 * 60 * 60 * 24 * 30);
        
        if (monthsSinceLastMaintenance > 6) {
          acc['Needs Attention']++;
        } else if (jobs.some(job => job.componentId === comp.id && job.status === 'In Progress')) {
          acc['Under Maintenance']++;
        } else {
          acc['Active']++;
        }
        return acc;
      }, { Active: 0, 'Under Maintenance': 0, 'Needs Attention': 0 });

      setStats({
        totalShips: ships.length,
        overdueComponents: components.filter(comp => {
          const lastMaintenance = new Date(comp.lastMaintenanceDate);
          return (new Date() - lastMaintenance) / (1000 * 60 * 60 * 24 * 30) > 6;
        }).length,
        jobsInProgress: jobs.filter(job => job.status === 'In Progress').length,
        jobsCompleted: jobs.filter(job => job.status === 'Completed').length,
        jobsByPriority,
        jobsByType,
        componentsByStatus
      });
    };

    calculateStats();
    const interval = setInterval(calculateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const KPICard = ({ title, value, description, color, icon }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center">
        <div className="text-2xl mr-4">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );

  const PriorityChart = ({ data }) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    const getPercentage = (value) => ((value / total) * 100).toFixed(1);
    
    const priorityColors = {
      High: 'bg-red-500',
      Medium: 'bg-yellow-500',
      Low: 'bg-green-500'
    };

    const priorityTextColors = {
      High: 'text-red-700',
      Medium: 'text-yellow-700',
      Low: 'text-green-700'
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Jobs by Priority</h3>
        <div className="space-y-6">
          {Object.entries(data).map(([priority, value]) => {
            const percentage = getPercentage(value);
            return (
              <div key={priority} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${priorityColors[priority]} mr-2`}></div>
                    <span className={`font-medium ${priorityTextColors[priority]}`}>
                      {priority} Priority
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-semibold">{value} jobs</span>
                    <span className="text-gray-500">({percentage}%)</span>
                  </div>
                </div>
                <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full ${priorityColors[priority]} transition-all duration-500 ease-in-out`}
                    style={{ width: `${percentage}%` }}
                  >
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Section */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Jobs</span>
            <span className="font-semibold">{total}</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
            {Object.entries(data).map(([priority, value]) => (
              <div
                key={priority}
                className={`p-2 rounded ${priorityColors[priority]} bg-opacity-10 text-center`}
              >
                <div className={`font-medium ${priorityTextColors[priority]}`}>
                  {priority}
                </div>
                <div className={priorityTextColors[priority]}>
                  {getPercentage(value)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const ComponentStatusChart = ({ data }) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    const getPercentage = (value) => ((value / total) * 100).toFixed(1);

    const statusConfig = {
      'Active': {
        color: 'bg-emerald-500',
        textColor: 'text-emerald-700',
        description: 'Functioning normally'
      },
      'Under Maintenance': {
        color: 'bg-blue-500',
        textColor: 'text-blue-700',
        description: 'Currently being serviced'
      },
      'Needs Attention': {
        color: 'bg-red-500',
        textColor: 'text-red-700',
        description: 'Requires immediate maintenance'
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Component Status Distribution</h3>
          <div className="text-sm text-gray-500">
            Total: {total} components
          </div>
        </div>

        <div className="space-y-8">
          {Object.entries(data).map(([status, count]) => {
            const percentage = getPercentage(count);
            const config = statusConfig[status];
            
            return (
              <div key={status} className="relative">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div>
                      <div className={`font-medium ${config.textColor}`}>
                        {status}
                      </div>
                      <div className="text-xs text-gray-500">
                        {config.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{count}</div>
                    <div className="text-sm text-gray-500">{percentage}%</div>
                  </div>
                </div>

                {/* Progress bar with gradient */}
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${config.color} rounded-full transition-all duration-500`}
                    style={{ 
                      width: `${percentage}%`,
                      background: `linear-gradient(90deg, ${config.color}88 0%, ${config.color} 100%)`
                    }}
                  />
                </div>

                {/* Mini stats below progress bar */}
                <div className="mt-1 flex justify-between text-xs text-gray-400">
                  <div>0%</div>
                  <div>50%</div>
                  <div>100%</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual distribution circle */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              {Object.entries(data).map(([status, count], index, arr) => {
                const percentage = getPercentage(count);
                const config = statusConfig[status];
                let rotation = 0;
                
                // Calculate rotation based on previous segments
                for (let i = 0; i < index; i++) {
                  rotation += (Number(getPercentage(arr[i][1])) * 3.6); // Convert percentage to degrees
                }

                return (
                  <div
                    key={status}
                    className={`absolute w-full h-full ${config.color} rounded-full`}
                    style={{
                      clipPath: `conic-gradient(from ${rotation}deg, currentColor ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg)`,
                      opacity: 0.8
                    }}
                  />
                );
              })}
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm font-medium">{total}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Ships"
          value={stats.totalShips}
          color="border-blue-500"
          icon="🚢"
        />
        <KPICard
          title="Overdue Components"
          value={stats.overdueComponents}
          color="border-red-500"
          icon="⚠️"
          description="Components needing maintenance"
        />
        <KPICard
          title="Jobs in Progress"
          value={stats.jobsInProgress}
          color="border-yellow-500"
          icon="🔧"
        />
        <KPICard
          title="Completed Jobs"
          value={stats.jobsCompleted}
          color="border-green-500"
          icon="✅"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PriorityChart
          data={stats.jobsByPriority}
        />
        <ComponentStatusChart
          data={stats.componentsByStatus}
        />
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>
        <div className="space-y-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            <span>All systems operational</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
            <span>{stats.jobsInProgress} maintenance tasks in progress</span>
          </div>
          {stats.overdueComponents > 0 && (
            <div className="flex items-center text-sm text-red-600">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              <span>{stats.overdueComponents} components require immediate attention</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 