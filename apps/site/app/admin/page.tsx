// apps/site/app/admin/page.tsx
'use client';
import { useState } from 'react';
import { CMSLogin } from './CMSLogin';
import { CMSDashboard } from './CMSDashboard';

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <main>
      {loggedIn ? (
        <CMSDashboard />
      ) : (
        <CMSLogin onLogin={() => setLoggedIn(true)} />
      )}
    </main>
  );
}
