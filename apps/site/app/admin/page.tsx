// apps/site/app/admin/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

/*import { CMSLogin } from '@kit/blocks/src/cms/CMSLogin';
import { CMSDashboard } from '@kit/blocks/src/cms/CMSDashboard';
import { CMSCreate } from '@kit/blocks/src/cms/CMSCreate';*/

//import { CMSLogin, CMSDashboard, CMSCreate } from '@kit/blocks/cms';

// pull the CMS chrome bits from blocks
import { CMSLogin, CMSDashboard } from '@kit/blocks/cms';

// pull the extra button locally from the app
import { CMSCreate } from './CMSCreate';

import Link from 'next/link';
 
export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
//  const [isClicked, setIsClicked] = useState(false);

  return (
    <main className="c-page c-page-admin">
      <div className="c-container c-stack">
        <header className="c-stack">
          <h1 className="type-h1">ERA CMS Admin</h1>
          <p className="type-body type-muted">
            Temporary CMS demo. Nothing is saved, this is just for preview purposes
          </p>
        </header>

        {/* --- Before login --- */}
        {!isLoggedIn && (
          <section className="c-stack">
            {/*<h2 className="type-h3">Log in (mock)</h2>*/}

            {/* Original login button -> toggles dashboard */}
            <CMSLogin onLogin={() => setIsLoggedIn(true)} />

            {/* New second button -> goes straight to the detailed builder */}

            <CMSCreate
              onPress={() => {
                router.push('/admin/case-studies/new');
              }}
            />
            
            <p className="type-small type-muted">
              Or{' '}
              <Link href="/admin/case-studies/new">
                open the New Case Study form directly
              </Link>
              .
            </p>
          </section>
        )}{/* --- After "login" --- */}
        {isLoggedIn && (
          <section className="c-stack">
            <h2 className="type-h3">Content dashboard</h2>
            <CMSDashboard />

            <hr />
            <Link href="/admin/case-studies/list" className="c-button">
              View mock case study database
            </Link>

            <section className="c-stack">
              <h3 className="type-h3">Create a new mock case study</h3>
              <Link href="/admin/case-studies/new" className="c-button">
                Open case study builder
              </Link>
            </section>
          </section>
        )}
      </div>
    </main>
  );
}