// apps/site/app/admin/page.tsx
'use client';
import { useState } from 'react';
import { CMSLogin } from '@kit/blocks/src/cms/CMSLogin';
import { CMSDashboard } from '@kit/blocks/src/cms/CMSDashboard';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <main className="c-page c-page-admin">
      <div className="c-container c-stack">
        <h1 className="type-h1">ERA CMS Admin</h1>
        {!isLoggedIn ? (
          <CMSLogin onLogin={() => setIsLoggedIn(true)} />
        ) : (
          <CMSDashboard />
        )}
      </div>
    </main>
  );
}