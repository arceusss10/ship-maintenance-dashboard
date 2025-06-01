import React, { useState, useEffect } from 'react';

const JOB_TYPES = [
  'Routine Inspection',
  'Preventive Maintenance',
  'Corrective Maintenance',
  'Emergency Repair',
  'System Upgrade',
  'Component Replacement',
  'Safety Check',
  'Performance Testing',
  'Calibration',
  'Other'
];

const JobForm = ({ job, shipId, onSubmit, onCancel }) => {
  const [components, setComponents] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [formData, setFormData] = useState({
    type: '',
    componentId: '',
    componentName: '',
    priority: 'Medium',
    status: 'Pending',
    scheduledDate: '',
    description: '',
    assignedEngineerId: '',
    assignedEngineerName: '',
    jobType: JOB_TYPES[0],
    shipId: shipId
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Load ship components for the select dropdown
    const allComponents = JSON.parse(localStorage.getItem('components')) || [];
    const shipComponents = allComponents.filter(comp => comp.shipId === shipId);
    setComponents(shipComponents);

    // Load engineers
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const engineerUsers = allUsers.filter(user => user.role === 'Engineer' || user.role === 'Inspector');
    setEngineers(engineerUsers);

    if (job) {
      setFormData({
        ...job,
        scheduledDate: job.scheduledDate.split('T')[0]
      });
    }
  }, [job, shipId]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.componentId) {
      newErrors.componentId = 'Component is required';
    }
    if (!formData.assignedEngineerId) {
      newErrors.assignedEngineerId = 'Engineer assignment is required';
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
      const selectedEngineer = engineers.find(e => e.id === formData.assignedEngineerId);
      
      const updatedJob = {
        ...formData,
        id: job ? job.id : `j${Date.now()}`,
        componentName: selectedComponent?.name || '',
        assignedEngineerName: selectedEngineer?.name || ''
      };

      if (job) {
        // Edit existing job
        const updatedJobs = jobs.map(j => j.id === job.id ? updatedJob : j);
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
        {job ? 'Edit Maintenance Job' : 'Create New Maintenance Job'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Component</label>
          <select
            name="componentId"
            value={formData.componentId}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.componentId ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select a component</option>
            {components.map(component => (
              <option key={component.id} value={component.id}>
                {component.name} (SN: {component.serialNumber})
              </option>
            ))}
          </select>
          {errors.componentId && <p className="mt-1 text-sm text-red-600">{errors.componentId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Job Type</label>
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
          >
            {JOB_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Assigned Engineer</label>
          <select
            name="assignedEngineerId"
            value={formData.assignedEngineerId}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.assignedEngineerId ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select an engineer</option>
            {engineers.map(engineer => (
              <option key={engineer.id} value={engineer.id}>
                {engineer.name} ({engineer.specialization})
              </option>
            ))}
          </select>
          {errors.assignedEngineerId && <p className="mt-1 text-sm text-red-600">{errors.assignedEngineerId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
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
              errors.scheduledDate ? 'border-red-300' : 'border-gray-300'
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
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter job description..."
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
            {job ? 'Update Job' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm; 