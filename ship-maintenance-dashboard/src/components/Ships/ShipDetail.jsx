import React, { useState, useEffect } from 'react';
import ComponentList from '../Components/ComponentList';
import ComponentForm from '../Components/ComponentForm';
import JobList from '../Jobs/JobList';
import JobForm from '../Jobs/JobForm';

const ShipDetail = ({ ship }) => {
  const [components, setComponents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [showComponentForm, setShowComponentForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

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

  const handleAddComponent = () => {
    setSelectedComponent(null);
    setShowComponentForm(true);
  };

  const handleEditComponent = (component) => {
    setSelectedComponent(component);
    setShowComponentForm(true);
  };

  const handleComponentSubmit = () => {
    // Refresh components list
    const allComponents = JSON.parse(localStorage.getItem('components')) || [];
    const shipComponents = allComponents.filter(comp => comp.shipId === ship.id);
    setComponents(shipComponents);
    setShowComponentForm(false);
    setSelectedComponent(null);
  };

  const handleAddJob = () => {
    setSelectedJob(null);
    setShowJobForm(true);
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setShowJobForm(true);
  };

  const handleJobSubmit = () => {
    // Refresh jobs list
    const allJobs = JSON.parse(localStorage.getItem('jobs')) || [];
    const shipJobs = allJobs.filter(job => job.shipId === ship.id);
    setJobs(shipJobs);
    setShowJobForm(false);
    setSelectedJob(null);
  };

  return (
    <div className="space-y-6">
      {/* Ship Information */}
      <div className="bg-white rounded-lg shadow">
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
      </div>

      {/* Components Section */}
      {showComponentForm ? (
        <ComponentForm
          component={selectedComponent}
          shipId={ship.id}
          onSubmit={handleComponentSubmit}
          onCancel={() => setShowComponentForm(false)}
        />
      ) : (
        <ComponentList
          shipId={ship.id}
          onAddNew={handleAddComponent}
          onEdit={handleEditComponent}
        />
      )}

      {/* Maintenance Jobs Section */}
      {showJobForm ? (
        <JobForm
          job={selectedJob}
          shipId={ship.id}
          onSubmit={handleJobSubmit}
          onCancel={() => setShowJobForm(false)}
        />
      ) : (
        <JobList
          shipId={ship.id}
          onAddNew={handleAddJob}
          onEdit={handleEditJob}
        />
      )}
    </div>
  );
};


export default ShipDetail; 