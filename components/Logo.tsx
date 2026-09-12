'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-3">
      <Image src="/logo.png" alt="Logo" width={40} height={40} priority />

     <div className="hidden sm:flex items-center gap-2">
  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm">
    <span className="text-sm font-bold">C</span>
  </div>

  <div className="flex flex-col leading-none">
    <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
      COMPTA
    </h1>

    <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-slate-400">
      Desk
    </span>
  </div>
</div>
    </Link>
  );
}
