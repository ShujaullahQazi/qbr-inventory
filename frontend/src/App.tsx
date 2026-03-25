import './index.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MetadataProvider } from './context/MetadataContext';
import { ToastProvider } from './context/ToastContext';

// Lazy-loaded pages — each becomes its own JS chunk
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const PendingApproval = lazy(() => import('./pages/PendingApproval'));

/** Shared suspense fallback */
function PageLoader() {
  return (
    <div className="loading-page">
      <div className="spinner" />
      <p>Loading QBR Inventory...</p>
    </div>
  );
}

/** Wraps authenticated + verified routes with MetadataProvider */
function ProtectedRoute() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Dashboard />
    </Suspense>
  );
}

function AppContent() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  const isVerified = user?.is_verified ?? false;

  /** Helper: resolve where an unqualified user should go */
  const guardedRoute = (element: React.ReactNode) => {
    if (!isAuthenticated) return <Navigate to="/auth" replace />;
    if (!isVerified) return <Navigate to="/pending" replace />;
    return element;
  };

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Auth */}
        <Route path="/auth" element={isAuthenticated ? <Navigate to="/feed" replace /> : <Auth />} />

        {/* Pending approval */}
        <Route path="/pending" element={
          isAuthenticated
            ? (isVerified ? <Navigate to="/feed" replace /> : <PendingApproval />)
            : <Navigate to="/auth" replace />
        } />

        {/* Protected dashboard routes */}
        <Route path="/*" element={guardedRoute(<ProtectedRoute />)} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MetadataProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </MetadataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
