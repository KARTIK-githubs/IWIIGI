import { useState } from 'react';

type Entry = 'sample' | 'reward';
const key = 'iwiigi-demo-ledger';
function load(): Entry[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(data) && (data.length === 0 || (data[0] === 'sample' && (data.length === 1 || (data.length === 2 && data[1] === 'reward'))))) return data;
  } catch { /* Start a new demo when storage is unavailable. */ }
  return [];
}

export default function App() {
  const [entries, setEntries] = useState(load);
  const [message, setMessage] = useState('');
  const earned = entries.includes('sample');
  const redeemed = entries.includes('reward');
  const points = (earned ? 100 : 0) - (redeemed ? 75 : 0);
  function save(next: Entry[], status: string) {
    setEntries(next);
    try { localStorage.setItem(key, JSON.stringify(next)); }
    catch { status += ' Progress will only last for this session.'; }
    setMessage(status);
  }
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 sm:p-12">
      <div className="mx-auto max-w-xl space-y-8">
        <header><h1 className="text-4xl font-bold">IWIIGI</h1><p className="mt-2 text-slate-300">Rewards demo. Sample activity and points stay in this browser and have no cash value.</p></header>
        <section className="rounded-xl bg-slate-800 p-6 space-y-4" aria-label="Rewards wallet">
          <p className="text-3xl font-bold" aria-live="polite">{points} points</p>
          <div className="flex flex-wrap gap-3">
            <button className="rounded bg-lime-300 px-4 py-2 text-slate-950 disabled:opacity-50" disabled={earned} onClick={() => save(['sample'], '100 points earned.')}>Complete sample activity</button>
            <button className="rounded bg-white px-4 py-2 text-slate-950 disabled:opacity-50" disabled={points < 75} onClick={() => save(['sample', 'reward'], 'Sample reward redeemed.')}>Redeem for 75 points</button>
          </div>
          <p role="status">{message}</p>
        </section>
        <section><h2 className="text-xl font-semibold">Activity</h2>{!earned && <p>No activity yet.</p>}<ul className="list-inside list-disc">{earned && <li>Sample activity +100</li>}{redeemed && <li>Sample reward −75</li>}</ul></section>
        {earned && <button className="underline" onClick={() => save([], 'Demo reset.')}>Reset demo</button>}
      </div>
    </main>
  );
}
