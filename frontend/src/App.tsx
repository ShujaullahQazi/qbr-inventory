import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner" />
        <p>Loading QBR Inventory...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth */}
      <Route path="/auth" element={isAuthenticated ? <Navigate to="/feed" replace /> : <Auth />} />

      {/* Protected dashboard routes */}
      <Route path="/feed"          element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" replace />} />
      <Route path="/my"            element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" replace />} />
      <Route path="/matches"       element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" replace />} />
      <Route path="/notifications" element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" replace />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={isAuthenticated ? '/feed' : '/auth'} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
