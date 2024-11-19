'use client';

import SoccerScoreboard from "@/components/SoccerScoreboard";

export default function Home()
{
  return (
    <div className="grid items-center justify-items-center pt-10 gap-2 font-[family-name:var(--font-geist-sans)]">
      <main className="flex w-6/12 flex-col gap-8 row-start-2 items-center sm:items-start">
        <SoccerScoreboard />
      </main>
    </div>
  );
}
