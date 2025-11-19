// apps/site/app/admin/page.tsx
'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
//import { CMSLogin, CMSDashboard } from '.';
//import { CMSLogin } from './CMSLogin';
//import { CMSDashboard } from './CMSDashboard';
import { CMSLogin } from '@kit/blocks/src/cms/CMSLogin';
import { CMSDashboard } from '@kit/blocks/src/cms/CMSDashboard';
//import { CMSLogin, CMSDashboard } from '@kit/blocks';
export default function AdminPage() {
    const [loggedIn, setLoggedIn] = useState(false);
    return (_jsx("main", { children: loggedIn ? (_jsx(CMSDashboard, {})) : (_jsx(CMSLogin, { onLogin: () => setLoggedIn(true) })) }));
}
