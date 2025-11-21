// apps/site/app/admin/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { CMSLogin } from '@kit/blocks/src/cms/CMSLogin';
import { CMSDashboard } from '@kit/blocks/src/cms/CMSDashboard';
//import { CMSCreate } from '@kit/blocks/src/cms/CMSCreate';

import Link from 'next/link';
 
export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
//  const [isClicked, setIsClicked] = useState(false);

  return (
    <main className="c-page c-page-admin">
      <div className="c-stack c-stack--row c-stack--between">

      </div>
      <div className="c-container c-stack">
        <h1 className="type-h1">ERA CMS Admin</h1>
        {!isLoggedIn ? (
          <CMSLogin onLogin={() => setIsLoggedIn(true)} />
        ) : (
          <CMSDashboard />
        )}
      </div>

      <div className="c-container c-stack">
      </div>

      <div className="c-container c-stack pad-2">
        <Link href="/admin/case-studies/new" className="c-button">Updated Case Study Creation</Link>
      </div>

      <br/>
      <hr />

      <div className="c-container c-stack pad-2">
        <h2>Database</h2>
        <Link href="/admin/case-studies/list" className="c-button">
          View mock case study database
        </Link>
      </div>

    </main>
  );
}