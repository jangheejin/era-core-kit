// apps/site/app/admin/page.tsx
'use client';
import { useState } from 'react';
//import { CMSLogin, CMSDashboard } from '.';
//import { CMSLogin } from './CMSLogin';
//import { CMSDashboard } from './CMSDashboard';
import { CMSLogin } from '@kit/blocks/src/cms/CMSLogin';
import { CMSDashboard } from '@kit/blocks/src/cms/CMSDashboard';
//import { CMSLogin, CMSDashboard } from '@kit/blocks';

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
