import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CsvUpload } from './pages/CsvUpload';
import { ApiManagement } from './pages/ApiManagement';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Header } from './components/layout/Header';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/csv-upload" 
            element={
              <ProtectedRoute>
                <div className="flex h-screen flex-col">
                  <Header />
                  <main className="flex-1 overflow-y-auto p-4">
                    <CsvUpload />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route 
            path="/api-management" 
            element={
              <ProtectedRoute>
                <div className="flex h-screen flex-col">
                  <Header />
                  <main className="flex-1 overflow-y-auto p-4">
                    <ApiManagement />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/csv-upload" replace />} />
          <Route path="*" element={<Navigate to="/csv-upload" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;