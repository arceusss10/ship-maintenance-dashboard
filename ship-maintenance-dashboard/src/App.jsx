import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ShipsPage from './pages/ShipsPage';
import ShipDetail from './components/Ships/ShipDetail';
import Login from './components/Auth/Login';
import PrivateRoute from './components/Auth/PrivateRoute';
import { initializeSampleUsers } from './data/sampleUsers';
import CalendarPage from './pages/CalendarPage';

function App() {
  useEffect(() => {
    // Initialize sample users when the app starts
    initializeSampleUsers();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/ships"
              element={
                <PrivateRoute>
                  <ShipsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/ships/:id"
              element={
                <PrivateRoute>
                  <ShipDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <PrivateRoute>
                  <CalendarPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
