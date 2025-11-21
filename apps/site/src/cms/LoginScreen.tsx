//apps/site/src/cms/LoginScreen.tsx
'use client';

import { useState, FormEvent } from 'react';

type LoginScreenProps = {
  onSuccess: () => void;
};

export function LoginScreen({ onSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // demo only
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // DEMO-ONLY "AUTH"
    if (!email || !password) {
      setError('Enter any email + password to continue.');
      return;
    }
    setError(null);
    onSuccess();
  }

  return (
    <div className="cms-login-shell">
      <div className="cms-login-card">
        <h1 className="type-h2">ERA CMS (Demo)</h1>
        <p className="type-body">
          This is a demo-only login. Any email + password will “log in”.
        </p>
        <form onSubmit={handleSubmit} className="cms-login-form">
          <label className="type-label">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="cms-input"
            />
          </label>

          <label className="type-label">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="cms-input"
            />
          </label>

          {error && <p className="cms-error">{error}</p>}

          <button type="submit" className="c-button">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
