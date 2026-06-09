import Link from 'next/link';

type BreadcrumbItem = {
  href?: string;
  label: string;
};

export function AdminBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm app-muted">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 ? <span className="app-muted">/</span> : null}
            {item.href && !isLast ? (
              <Link href={item.href} className="font-medium app-muted hover:text-slate-900">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-semibold app-strong' : 'font-medium app-muted'}>{item.label}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
