// packages/blocks/src/cms/CMSLogin.tsx
// WAS: apps/site/app/admin/CMSLogin.tsx
'use client';
export function CMSLogin({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="p-4">
      <h2 className="type-h2b">Login</h2>
      <button onClick={onLogin} className="buttonLink-2">
        <div className="type-h4">Log In (Mock) v1</div>
        {/*<h4 className="type-h3a">Log In (Mock) v1</h4>*/}
      </button>
    </div>
  );
}
