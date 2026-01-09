import { ReactNode } from 'react';

export const HeaderLeft = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center gap-3 md:gap-6">{children}</div>
);
export const HeaderCenter = ({ children }: { children: ReactNode }) => (
  <div className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center lg:flex">
    {children}
  </div>
);
export const HeaderRight = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center gap-2 md:gap-4">{children}</div>
);
