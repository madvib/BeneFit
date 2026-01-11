'use client';

import * as React from 'react';

export default function WorkoutsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      {/* 
        This layout is intentionaly sparse. 
        Top-level workout screens (like active sessions) should own their entire viewport.
      */}
      <main className="h-full w-full">{children}</main>
    </div>
  );
}
