'use client';

import SoccerScoreboard from "@/components/SoccerScoreboard";

export default function Home() {
  return (
    <div
      className="min-h-screen flex items-start justify-center py-10 px-4"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #0f172a 0%, #080c14 60%, #030508 100%)' }}
    >
      <div className="w-full max-w-2xl">
        <SoccerScoreboard />
      </div>
    </div>
  );
}
