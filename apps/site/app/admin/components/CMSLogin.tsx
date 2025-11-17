// apps/site/app/admin/CMSLogin.tsx
'use client';
export function CMSLogin({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="p-4">
      <h2>Login</h2>
      <button onClick={onLogin} className="bg-black text-white px-4 py-2 rounded">
        Log In (Mock)
      </button>
    </div>
  );
}
