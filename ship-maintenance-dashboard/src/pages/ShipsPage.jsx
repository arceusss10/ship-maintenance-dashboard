import React, { useState } from 'react';
import ShipList from '../components/Ships/ShipList';
import ShipForm from '../components/Ships/ShipForm';
import ShipDetail from '../components/Ships/ShipDetail';

const ShipsPage = () => {
  const [selectedShip, setSelectedShip] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);

  const handleAddNew = () => {
    setSelectedShip(null);
    setIsFormOpen(true);
    setIsViewMode(false);
  };

  const handleEdit = (ship) => {
    setSelectedShip(ship);
    setIsFormOpen(true);
    setIsViewMode(false);
  };

  const handleView = (ship) => {
    setSelectedShip(ship);
    setIsViewMode(true);
    setIsFormOpen(false);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedShip(null);
  };

  const handleFormSubmit = (shipData) => {
    // This will be replaced with actual localStorage operations
    console.log('Ship data:', shipData);
    setIsFormOpen(false);
    setSelectedShip(null);
  };

  return (
    <div className="container mx-auto px-4">
      {!isFormOpen && !isViewMode && (
        <ShipList 
          onAddNew={handleAddNew}
          onEdit={handleEdit}
          onView={handleView}
        />
      )}

      {isFormOpen && (
        <ShipForm
          ship={selectedShip}
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
        />
      )}

      {isViewMode && selectedShip && (
        <div>
          <button
            onClick={() => setIsViewMode(false)}
            className="mb-4 px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ← Back to List
          </button>
          <ShipDetail ship={selectedShip} />
        </div>
      )}
    </div>
  );
};

export default ShipsPage; 