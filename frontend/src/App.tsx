import './index.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MetadataProvider } from './context/MetadataContext';

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
    <MetadataProvider>
      <Suspense fallback={<PageLoader />}>
        <Dashboard />
      </Suspense>
    </MetadataProvider>
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

        {/* Protected dashboard routes — MetadataProvider only loads here */}
        <Route path="/feed"          element={guardedRoute(<ProtectedRoute />)} />
        <Route path="/my"            element={guardedRoute(<ProtectedRoute />)} />
        <Route path="/matches"       element={guardedRoute(<ProtectedRoute />)} />
        <Route path="/notifications" element={guardedRoute(<ProtectedRoute />)} />
        <Route path="/users"         element={guardedRoute(<ProtectedRoute />)} />
        <Route path="/settings"      element={guardedRoute(<ProtectedRoute />)} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={isAuthenticated ? (isVerified ? '/feed' : '/pending') : '/auth'} replace />} />
      </Routes>
    </Suspense>
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
