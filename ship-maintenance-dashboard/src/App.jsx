import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { initializeMockData } from "./utils/localStorageUtils";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ShipsPage from "./pages/ShipsPage";
import { AuthContext } from "./contexts/AuthContext";
import Navbar from "./components/Navigation/Navbar";

const App = () => {
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    initializeMockData();
  }, []);

  // Protected Route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ships"
              element={
                <ProtectedRoute>
                  <ShipsPage />
                </ProtectedRoute>
              }
            />
            {/* Add more routes here */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
