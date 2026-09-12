'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-3">
     {//<Image src="/logo.png" alt="Logo" width={40} height={40} priority />
} 
      <div className="hidden sm:block">
        <h1 className="text-xl font-bold text-slate-800">COMPTA</h1>

        <p className="text-xs text-slate-500">desk</p>
      </div>
    </Link>
  );
}
