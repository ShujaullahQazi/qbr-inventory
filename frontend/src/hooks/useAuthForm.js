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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let res;
      if (mode === 'register') {
        res = await authAPI.register({
          name: form.name,
          phone: form.phone,
          password: form.password,
          sector: form.sector,
          agency_name: form.agency_name || null,
        });
      } else {
        res = await authAPI.login({
          phone: form.phone,
          password: form.password,
        });
      }
      login(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
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
