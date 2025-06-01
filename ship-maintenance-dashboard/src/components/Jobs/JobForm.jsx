import React, { useState, useEffect } from 'react';

const JobForm = ({ job, shipId, onSubmit, onCancel }) => {
  const [components, setComponents] = useState([]);
  const [formData, setFormData] = useState({
    type: '',
    componentId: '',
    componentName: '',
    priority: 'Medium',
    status: 'Pending',
    scheduledDate: '',
    description: '',
    shipId: shipId
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Load ship components for the select dropdown
    const allComponents = JSON.parse(localStorage.getItem('components')) || [];
    const shipComponents = allComponents.filter(comp => comp.shipId === shipId);
    setComponents(shipComponents);

    if (job) {
      setFormData({
        ...job,
        scheduledDate: job.scheduledDate.split('T')[0]
      });
    }
  }, [job, shipId]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.type.trim()) {
      newErrors.type = 'Maintenance type is required';
    }
    if (!formData.componentId) {
      newErrors.componentId = 'Component selection is required';
    }
    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }
    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Scheduled date is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
      const selectedComponent = components.find(c => c.id === formData.componentId);
      const updatedJob = {
        ...formData,
        id: job ? job.id : `j${Date.now()}`,
        componentName: selectedComponent ? selectedComponent.name : ''
      };

      if (job) {
        // Edit existing job
        const updatedJobs = jobs.map(j => 
          j.id === job.id ? updatedJob : j
        );
        localStorage.setItem('jobs', JSON.stringify(updatedJobs));
      } else {
        // Add new job
        localStorage.setItem('jobs', JSON.stringify([...jobs, updatedJob]));
      }

      onSubmit(updatedJob);
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
        {job ? 'Edit Maintenance Job' : 'Schedule New Maintenance'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Maintenance Type</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="e.g., Routine Check, Repair, Replacement"
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.type ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Component</label>
          <select
            name="componentId"
            value={formData.componentId}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.componentId ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          >
            <option value="">Select a component</option>
            {components.map(component => (
              <option key={component.id} value={component.id}>
                {component.name} ({component.serialNumber})
              </option>
            ))}
          </select>
          {errors.componentId && <p className="mt-1 text-sm text-red-600">{errors.componentId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md shadow-sm sm:text-sm border-gray-300 focus:ring-blue-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md shadow-sm sm:text-sm border-gray-300 focus:ring-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Scheduled Date</label>
          <input
            type="date"
            name="scheduledDate"
            value={formData.scheduledDate}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.scheduledDate ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.scheduledDate && <p className="mt-1 text-sm text-red-600">{errors.scheduledDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Detailed description of the maintenance work..."
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.description ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
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
            {job ? 'Update Job' : 'Schedule Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm; 