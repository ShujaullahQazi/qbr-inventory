import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export function useAuthForm() {
  const { login } = useAuth();
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    sector: '',
    agency_name: '',
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Client-side pre-validation
    const cleanPhone = form.phone.replace(/\s+/g, '');
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setError('Please enter a valid phone number (10-15 digits).');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let res;
      if (mode === 'register') {
        res = await authAPI.register({
          name: form.name.trim(),
          phone: cleanPhone,
          password: form.password,
          sector: form.sector,
          agency_name: form.agency_name?.trim() || null,
        });
      } else {
        res = await authAPI.login({
          phone: cleanPhone,
          password: form.password,
        });
      }
      login(res.data.token, res.data.user);
    } catch (err: any) {
      if (err.response?.status === 422 && Array.isArray(err.response.data.detail)) {
        // Handle Pydantic validation errors nicely
        const msg = err.response.data.detail[0]?.msg;
        setError(`Validation error: ${msg}`);
      } else {
        setError(err.response?.data?.detail || 'Something went wrong. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    mode,
    setMode,
    error,
    setError,
    loading,
    form,
    handleChange,
    handleSubmit
  };
}
