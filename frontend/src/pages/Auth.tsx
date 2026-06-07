import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { useAuthForm } from '../hooks/useAuthForm';
import { HomeIcon } from '../components/Icons';
import DeveloperFootnote from '../components/DeveloperFootnote';

export default function Auth() {
  const {
    mode,
    setMode,
    error,
    setError,
    loading,
    form,
    handleChange,
    handleSubmit
  } = useAuthForm();

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <div className="auth-brand-icon" style={{ background: 'transparent', border: '1px solid var(--border-medium)', boxShadow: 'none' }}>
            <HomeIcon size={28} stroke="var(--primary-light)" />
          </div>
          <h1>QBR Inventory</h1>
          <p>Realtors Network</p>
        </div>

        <div className="auth-card">
          <div className="auth-toggle">
            <button
              className={mode === 'login' ? 'active' : ''}
              onClick={() => { setMode('login'); setError(''); }}
            >
              Login
            </button>
            <button
              className={mode === 'register' ? 'active' : ''}
              onClick={() => { setMode('register'); setError(''); }}
            >
              Register
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          {mode === 'login' ? (
            <LoginForm
              form={form}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              loading={loading}
            />
          ) : (
            <RegisterForm
              form={form}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              loading={loading}
            />
          )}
        </div>

        <p className="auth-footer">
          Connecting Realtors — one match at a time.
        </p>
      </div>

      {/* Sticky-bottom footnote — outside auth-container so it always sits at the page bottom */}
      <div className="auth-footnote">
        <DeveloperFootnote />
      </div>
    </div>
  );
}
