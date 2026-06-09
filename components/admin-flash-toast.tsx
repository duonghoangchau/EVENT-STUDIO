'use client';

import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { AdminFlash } from '@/lib/admin-flash';

const iconMap = {
  success: CheckCircle2,
  error: TriangleAlert,
  info: Info,
} as const;

export function AdminFlashToast({ initialFlash }: { initialFlash: AdminFlash | null }) {
  const [flash, setFlash] = useState<AdminFlash | null>(initialFlash);

  useEffect(() => {
    setFlash(initialFlash);
  }, [initialFlash]);

  useEffect(() => {
    if (!initialFlash) return;

    fetch('/api/admin/flash', {
      method: 'POST',
    }).catch(() => undefined);
  }, [initialFlash]);

  useEffect(() => {
    if (!flash) return;

    const timer = window.setTimeout(() => {
      setFlash(null);
    }, 4200);

    return () => window.clearTimeout(timer);
  }, [flash]);

  if (!flash) return null;

  const Icon = iconMap[flash.type];

  return (
    <div className="admin-toast-wrap pointer-events-none fixed right-5 top-5 z-[70] flex w-[min(92vw,24rem)] justify-end">
      <div className={`admin-toast pointer-events-auto ${flash.type}`}>
        <div className="flex items-start gap-3">
          <div className="admin-toast-icon">
            <Icon size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold app-strong">{flash.title}</div>
            <div className="mt-1 text-sm app-muted">{flash.message}</div>
          </div>
          <button className="admin-toast-close" type="button" onClick={() => setFlash(null)} aria-label="Dismiss notification">
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
