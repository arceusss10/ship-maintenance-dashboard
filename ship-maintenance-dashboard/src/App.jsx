import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { initializeMockData } from "./utils/localStorageUtils";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ShipsPage from "./pages/ShipsPage";
import { AuthContext } from "./contexts/AuthContext";

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
    </Router>
  );
};

export default App;
