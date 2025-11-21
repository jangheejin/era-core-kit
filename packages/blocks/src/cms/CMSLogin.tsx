// apps/site/app/admin/CMSLogin.tsx
'use client';
export function CMSLogin({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="p-4">
      <h2>Login</h2>
      <button onClick={onLogin} className="buttonLink-2">
        Log In (Mock) v1
      </button>
    </div>
  );
}
