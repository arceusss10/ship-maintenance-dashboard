import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const ShipList = ({ onAddNew, onEdit, onView }) => {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const loadShips = () => {
      const storedShips = JSON.parse(localStorage.getItem('ships')) || [];
      setShips(storedShips);
      setLoading(false);
    };

    loadShips();
    window.addEventListener('storage', loadShips);
    return () => window.removeEventListener('storage', loadShips);
  }, []);

  const handleDelete = (shipId) => {
    if (window.confirm('Are you sure you want to delete this ship?')) {
      const updatedShips = ships.filter(ship => ship.id !== shipId);
      localStorage.setItem('ships', JSON.stringify(updatedShips));
      setShips(updatedShips);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading ships...</div>;
  }

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ships Management</h1>
        {currentUser?.role === 'Admin' && (
          <button
            onClick={onAddNew}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add New Ship
          </button>
        )}
      </div>

      {ships.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No ships available.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IMO Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flag</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ships.map((ship) => (
                <tr key={ship.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{ship.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{ship.imo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{ship.flag}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ship.status === 'Active' ? 'bg-green-100 text-green-800' :
                      ship.status === 'Under Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ship.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onView(ship)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      View
                    </button>
                    {currentUser?.role === 'Admin' && (
                      <>
                        <button
                          onClick={() => onEdit(ship)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(ship.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShipList; 