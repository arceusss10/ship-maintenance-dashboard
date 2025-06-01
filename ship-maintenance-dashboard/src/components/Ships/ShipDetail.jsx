import React, { useState, useEffect } from 'react';

const ShipDetail = ({ ship }) => {
  const [components, setComponents] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Load components for this ship
    const allComponents = JSON.parse(localStorage.getItem('components')) || [];
    const shipComponents = allComponents.filter(comp => comp.shipId === ship.id);
    setComponents(shipComponents);

    // Load maintenance jobs for this ship
    const allJobs = JSON.parse(localStorage.getItem('jobs')) || [];
    const shipJobs = allJobs.filter(job => job.shipId === ship.id);
    setJobs(shipJobs);
  }, [ship.id]);

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Ship Information */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ship Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Ship Name</p>
            <p className="mt-1 text-lg text-gray-900">{ship.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">IMO Number</p>
            <p className="mt-1 text-lg text-gray-900">{ship.imo}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Flag</p>
            <p className="mt-1 text-lg text-gray-900">{ship.flag}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p className="mt-1">
              <span className={`px-2 inline-flex text-sm font-semibold rounded-full ${
                ship.status === 'Active' ? 'bg-green-100 text-green-800' :
                ship.status === 'Under Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {ship.status}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Components Section */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Installed Components</h3>
        {components.length === 0 ? (
          <p className="text-gray-500">No components installed.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serial Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Install Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Maintenance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {components.map((component) => (
                  <tr key={component.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{component.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{component.serialNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(component.installDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(component.lastMaintenanceDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Maintenance Jobs Section */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance History</h3>
        {jobs.length === 0 ? (
          <p className="text-gray-500">No maintenance jobs found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        job.priority === 'High' ? 'bg-red-100 text-red-800' :
                        job.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {job.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(job.scheduledDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipDetail; 