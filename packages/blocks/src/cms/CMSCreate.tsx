// packages/blocks/src/cms/CMSCreate.tsx
// temporary button to show temporary more in-depth case study creation page
'use client';
export function CMSCreate({ onPress }: { onPress: () => void }) {
    return (
      <div className="p-4">
        <h2>Login v2</h2>
        <button onClick={onPress} className="bg-black text-white px-4 py-2 rounded">
          Log In (Mock) v2
        </button>
      </div>
    );
}