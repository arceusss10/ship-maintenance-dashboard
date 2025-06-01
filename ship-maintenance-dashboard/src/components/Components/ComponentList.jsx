import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const ComponentList = ({ shipId, onAddNew, onEdit }) => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const loadComponents = () => {
      const allComponents = JSON.parse(localStorage.getItem('components')) || [];
      const shipComponents = allComponents.filter(comp => comp.shipId === shipId);
      setComponents(shipComponents);
      setLoading(false);
    };

    loadComponents();
    window.addEventListener('storage', loadComponents);
    return () => window.removeEventListener('storage', loadComponents);
  }, [shipId]);

  const handleDelete = (componentId) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      const allComponents = JSON.parse(localStorage.getItem('components')) || [];
      const updatedComponents = allComponents.filter(comp => comp.id !== componentId);
      localStorage.setItem('components', JSON.stringify(updatedComponents));
      setComponents(components.filter(comp => comp.id !== componentId));
    }
  };

  const getMaintenanceStatus = (lastMaintenanceDate) => {
    const today = new Date();
    const lastMaintenance = new Date(lastMaintenanceDate);
    const monthsDiff = (today.getFullYear() - lastMaintenance.getFullYear()) * 12 + 
                      (today.getMonth() - lastMaintenance.getMonth());
    
    if (monthsDiff >= 6) {
      return { status: 'Overdue', className: 'bg-red-100 text-red-800' };
    } else if (monthsDiff >= 4) {
      return { status: 'Due Soon', className: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'Up to Date', className: 'bg-green-100 text-green-800' };
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading components...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Ship Components</h2>
        {currentUser?.role === 'Admin' && (
          <button
            onClick={onAddNew}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Component
          </button>
        )}
      </div>

      {components.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No components installed on this ship.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Install Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Maintenance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {components.map((component) => {
                const maintenanceStatus = getMaintenanceStatus(component.lastMaintenanceDate);
                return (
                  <tr key={component.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {component.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {component.serialNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(component.installDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(component.lastMaintenanceDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${maintenanceStatus.className}`}>
                        {maintenanceStatus.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {currentUser?.role === 'Admin' && (
                        <>
                          <button
                            onClick={() => onEdit(component)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(component.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ComponentList; 