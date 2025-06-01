import React, { useState, useEffect } from 'react';

const ShipForm = ({ ship, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    imo: '',
    flag: '',
    status: 'Active'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (ship) {
      setFormData(ship);
    }
  }, [ship]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Ship name is required';
    }
    if (!formData.imo.trim()) {
      newErrors.imo = 'IMO number is required';
    } else if (!/^\d{7}$/.test(formData.imo)) {
      newErrors.imo = 'IMO number must be 7 digits';
    }
    if (!formData.flag.trim()) {
      newErrors.flag = 'Flag country is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const ships = JSON.parse(localStorage.getItem('ships')) || [];
      const updatedShip = {
        ...formData,
        id: ship ? ship.id : `s${Date.now()}`
      };

      if (ship) {
        // Edit existing ship
        const updatedShips = ships.map(s => s.id === ship.id ? updatedShip : s);
        localStorage.setItem('ships', JSON.stringify(updatedShips));
      } else {
        // Add new ship
        localStorage.setItem('ships', JSON.stringify([...ships, updatedShip]));
      }

      onSubmit(updatedShip);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {ship ? 'Edit Ship' : 'Add New Ship'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ship Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.name ? 'border-red-300' : ''
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">IMO Number</label>
            <input
              type="text"
              name="imo"
              value={formData.imo}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.imo ? 'border-red-300' : ''
              }`}
            />
            {errors.imo && <p className="mt-1 text-sm text-red-600">{errors.imo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Flag</label>
            <input
              type="text"
              name="flag"
              value={formData.flag}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.flag ? 'border-red-300' : ''
              }`}
            />
            {errors.flag && <p className="mt-1 text-sm text-red-600">{errors.flag}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="Active">Active</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Out of Service">Out of Service</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {ship ? 'Update Ship' : 'Add Ship'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShipForm; 