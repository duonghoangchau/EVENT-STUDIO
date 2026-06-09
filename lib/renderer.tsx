import Link from 'next/link';
import { PageSection, ThemeConfig } from '@/lib/types';

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function asText(value: unknown, fallback = '') {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (isRecord(value)) {
    const preferredKeys = ['title', 'name', 'label', 'text', 'question', 'answer', 'position', 'role', 'time'];
    for (const key of preferredKeys) {
      const candidate = value[key];
      if (typeof candidate === 'string' && candidate.trim()) return candidate;
    }
  }
  return fallback;
}

function speakerItem(value: unknown) {
  if (!isRecord(value)) {
    return {
      name: asText(value, 'Speaker'),
      position: 'Guest speaker',
      avatar: '',
    };
  }

  return {
    name: asText(value.name, 'Speaker'),
    position: asText(value.position || value.role, 'Guest speaker'),
    avatar: asText(value.avatar || value.image || value.photo),
  };
}

function agendaItem(value: unknown) {
  if (!isRecord(value)) {
    return {
      title: asText(value, 'Agenda item'),
      time: '',
      description: '',
    };
  }

  return {
    title: asText(value.title || value.name, 'Agenda item'),
    time: asText(value.time),
    description: asText(value.description || value.body),
  };
}

function sponsorItem(value: unknown) {
  if (!isRecord(value)) {
    return {
      name: asText(value, 'Sponsor'),
      tier: '',
    };
  }

  return {
    name: asText(value.name || value.label, 'Sponsor'),
    tier: asText(value.tier || value.level),
  };
}

function faqItem(value: unknown) {
  if (!isRecord(value)) {
    return {
      question: asText(value, 'Question'),
      answer: 'Thong tin se duoc cap nhat boi ban to chuc.',
    };
  }

  return {
    question: asText(value.question || value.title, 'Question'),
    answer: asText(value.answer || value.body, 'Thong tin se duoc cap nhat boi ban to chuc.'),
  };
}

function registrationHref(projectSlug?: string, formSlug?: string) {
  if (projectSlug) return `/${projectSlug}/register`;
  if (formSlug) return `/submit/${formSlug}`;
  return '#registration';
}

export function LandingRenderer({
  sections,
  theme,
  formSlug,
  projectSlug,
}: {
  sections: PageSection[];
  theme: ThemeConfig;
  formSlug?: string;
  projectSlug?: string;
}) {
  const visible = [...sections].filter((section) => section.visible).sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-white" style={{ ['--primary' as any]: theme.primary }}>
      {visible.map((section) => (
        <Section key={section.id} section={section} theme={theme} formSlug={formSlug} projectSlug={projectSlug} />
      ))}
    </div>
  );
}

function Section({ section, theme, formSlug, projectSlug }: { section: PageSection; theme: ThemeConfig; formSlug?: string; projectSlug?: string }) {
  const d = section.data || {};

  if (section.type === 'hero') {
    return (
      <section
        className="relative overflow-hidden px-6 py-24 text-center"
        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
      >
        <div className="mx-auto max-w-4xl text-white">
          <div className="mb-5 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">{d.badge || 'Event'}</div>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">{d.title || 'Event Landing Page'}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/85">{d.subtitle || 'Thong tin su kien'}</p>
          <div className="mt-8">
            <Link href={registrationHref(projectSlug, formSlug)} className="rounded-2xl bg-white px-6 py-3 font-bold text-slate-950 shadow-lg">
              {d.cta || 'Dang ky ngay'}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === 'about') {
    return (
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <h2 className="text-3xl font-black">{d.title || 'About event'}</h2>
          <p className="text-lg leading-8 text-slate-600">{d.body || 'Noi dung su kien.'}</p>
        </div>
      </section>
    );
  }

  if (section.type === 'agenda') {
    const items = asArray(d.items).map(agendaItem);

    return (
      <section className="bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-3xl font-black">{d.title || 'Agenda'}</h2>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="rounded-2xl border bg-white p-5 shadow-sm">
                {item.time ? <div className="mb-2 text-sm font-bold text-blue-600">{item.time}</div> : null}
                <div className="font-semibold">{item.title}</div>
                {item.description ? <p className="mt-2 text-sm text-slate-600">{item.description}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === 'speakers') {
    const items = asArray(d.items).length ? asArray(d.items).map(speakerItem) : ['Speaker A', 'Speaker B', 'Speaker C'].map(speakerItem);

    return (
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-3xl font-black">{d.title || 'Speakers'}</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {items.map((item, index) => (
              <div key={index} className="rounded-3xl border p-6 shadow-sm">
                {item.avatar ? (
                  <img src={item.avatar} alt={item.name} className="mb-4 h-24 w-24 rounded-full bg-slate-100 object-cover" />
                ) : (
                  <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-2xl font-bold text-slate-400">
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-sm text-slate-500">{item.position}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === 'sponsors') {
    const items = asArray(d.items).length ? asArray(d.items).map(sponsorItem) : ['Logo', 'Logo', 'Logo', 'Logo'].map(sponsorItem);

    return (
      <section className="bg-slate-50 px-6 py-14">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-2xl font-black">{d.title || 'Sponsors'}</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {items.map((item, index) => (
              <div key={index} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="font-bold text-slate-500">{item.name}</div>
                {item.tier ? <div className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">{item.tier}</div> : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === 'form') {
    return (
      <section id="registration" className="px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border p-8 text-center shadow-sm">
          <h2 className="text-3xl font-black">{d.title || 'Registration'}</h2>
          <p className="mt-3 text-slate-500">Dien thong tin de xac nhan tham du.</p>
          <Link href={registrationHref(projectSlug, formSlug)} className="mt-6 inline-flex rounded-2xl px-6 py-3 font-bold text-white" style={{ background: theme.primary }}>
            Mo form dang ky
          </Link>
        </div>
      </section>
    );
  }

  if (section.type === 'faq') {
    const items = asArray(d.items).length
      ? asArray(d.items).map(faqItem)
      : ['Su kien dien ra o dau?', 'Toi co nhan email xac nhan khong?'].map(faqItem);

    return (
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-3xl font-black">FAQ</h2>
          {items.map((item, index) => (
            <details key={index} className="mb-3 rounded-2xl border p-5">
              <summary className="cursor-pointer font-bold">{item.question}</summary>
              <p className="mt-3 text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === 'map') {
    return (
      <section className="bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-black">Dia diem</h2>
          <div className="mt-5 rounded-3xl bg-white p-10 text-slate-500 shadow-sm">{d.location || 'Ho Chi Minh City'}</div>
        </div>
      </section>
    );
  }

  return <footer className="bg-slate-950 px-6 py-10 text-center text-white">{d.text || '© Delfi Event Studio'}</footer>;
}
