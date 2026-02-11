'use client';

import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    setLoading(false);

    if (!response.ok) {
      setError('Invalid username or password.');
      return;
    }

    window.location.href = '/dashboard';
  };

  return (
    <main className="centered-page">
      <section className="panel login-panel">
        {/* logo from the provided URL to keep branding aligned with your CMS */}
        <img src="https://cms.hopinternational.org/wp-content/uploads/2026/02/HOP-Logo.svg" alt="HOP logo" className="logo" />
        <h1>Contact Management Login</h1>
        <p className="muted">Secure access to your contact records.</p>

        <form className="stack" onSubmit={onSubmit}>
          <label>
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}
