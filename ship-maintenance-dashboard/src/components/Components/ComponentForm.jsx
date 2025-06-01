import React, { useState, useEffect } from 'react';

const ComponentForm = ({ component, shipId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    installDate: '',
    lastMaintenanceDate: '',
    shipId: shipId
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (component) {
      setFormData({
        ...component,
        installDate: component.installDate.split('T')[0],
        lastMaintenanceDate: component.lastMaintenanceDate.split('T')[0]
      });
    }
  }, [component]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Component name is required';
    }
    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = 'Serial number is required';
    }
    if (!formData.installDate) {
      newErrors.installDate = 'Installation date is required';
    }
    if (!formData.lastMaintenanceDate) {
      newErrors.lastMaintenanceDate = 'Last maintenance date is required';
    }
    if (new Date(formData.lastMaintenanceDate) < new Date(formData.installDate)) {
      newErrors.lastMaintenanceDate = 'Last maintenance date cannot be before installation date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const components = JSON.parse(localStorage.getItem('components')) || [];
      const updatedComponent = {
        ...formData,
        id: component ? component.id : `c${Date.now()}`
      };

      if (component) {
        // Edit existing component
        const updatedComponents = components.map(c => 
          c.id === component.id ? updatedComponent : c
        );
        localStorage.setItem('components', JSON.stringify(updatedComponents));
      } else {
        // Add new component
        localStorage.setItem('components', JSON.stringify([...components, updatedComponent]));
      }

      onSubmit(updatedComponent);
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
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {component ? 'Edit Component' : 'Add New Component'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Component Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Serial Number</label>
          <input
            type="text"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.serialNumber ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.serialNumber && <p className="mt-1 text-sm text-red-600">{errors.serialNumber}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Installation Date</label>
          <input
            type="date"
            name="installDate"
            value={formData.installDate}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.installDate ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.installDate && <p className="mt-1 text-sm text-red-600">{errors.installDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Last Maintenance Date</label>
          <input
            type="date"
            name="lastMaintenanceDate"
            value={formData.lastMaintenanceDate}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.lastMaintenanceDate ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.lastMaintenanceDate && (
            <p className="mt-1 text-sm text-red-600">{errors.lastMaintenanceDate}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
          >
            {component ? 'Update Component' : 'Add Component'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComponentForm; 