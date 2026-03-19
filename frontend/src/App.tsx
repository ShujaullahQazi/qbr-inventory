import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import PendingApproval from './pages/PendingApproval';

function AppContent() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner" />
        <p>Loading QBR Inventory...</p>
      </div>
    );
  }

  // Authenticated but not verified → pending approval screen
  const isVerified = user?.is_verified ?? false;

  return (
    <Routes>
      {/* Auth */}
      <Route path="/auth" element={isAuthenticated ? <Navigate to="/feed" replace /> : <Auth />} />

      {/* Pending approval */}
      <Route path="/pending" element={
        isAuthenticated
          ? (isVerified ? <Navigate to="/feed" replace /> : <PendingApproval />)
          : <Navigate to="/auth" replace />
      } />

      {/* Protected dashboard routes — only for verified users */}
      <Route path="/feed"          element={isAuthenticated ? (isVerified ? <Dashboard /> : <Navigate to="/pending" replace />) : <Navigate to="/auth" replace />} />
      <Route path="/my"            element={isAuthenticated ? (isVerified ? <Dashboard /> : <Navigate to="/pending" replace />) : <Navigate to="/auth" replace />} />
      <Route path="/matches"       element={isAuthenticated ? (isVerified ? <Dashboard /> : <Navigate to="/pending" replace />) : <Navigate to="/auth" replace />} />
      <Route path="/notifications" element={isAuthenticated ? (isVerified ? <Dashboard /> : <Navigate to="/pending" replace />) : <Navigate to="/auth" replace />} />
      <Route path="/users"         element={isAuthenticated ? (isVerified ? <Dashboard /> : <Navigate to="/pending" replace />) : <Navigate to="/auth" replace />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={isAuthenticated ? (isVerified ? '/feed' : '/pending') : '/auth'} replace />} />
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
