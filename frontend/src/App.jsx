import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    <Router> {}
      <div>
        {}

        {}
        <Routes>
          {}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {}
          {}
          <Route
            path="/dashboard" 
            element={ 
              <ProtectedRoute> {}
                <DashboardPage /> {}
              </ProtectedRoute>
            }
          />

          {}
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;