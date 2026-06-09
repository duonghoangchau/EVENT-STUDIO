import Link from 'next/link';
import { PreferenceLanguage, resolveLocalizedText, t } from '@/lib/preferences';
import { PageSection, ThemeConfig } from '@/lib/types';

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function asText(value: unknown, language: PreferenceLanguage, fallback = '') {
  const localized = resolveLocalizedText(value, language);
  if (localized) return localized;

  if (isRecord(value)) {
    const preferredKeys = ['title', 'name', 'label', 'text', 'question', 'answer', 'position', 'role', 'time'];
    for (const key of preferredKeys) {
      const candidate = resolveLocalizedText(value[key], language);
      if (candidate.trim()) return candidate;
    }
  }

  return fallback;
}

function speakerItem(value: unknown, language: PreferenceLanguage) {
  if (!isRecord(value)) {
    return {
      name: asText(value, language, t(language, 'speakerFallback')),
      position: t(language, 'guestSpeaker'),
      avatar: '',
    };
  }

  return {
    name: asText(value.name, language, t(language, 'speakerFallback')),
    position: asText(value.position || value.role, language, t(language, 'guestSpeaker')),
    avatar: asText(value.avatar || value.image || value.photo, language),
  };
}

function agendaItem(value: unknown, language: PreferenceLanguage) {
  if (!isRecord(value)) {
    return {
      title: asText(value, language, t(language, 'agendaItemFallback')),
      time: '',
      description: '',
    };
  }

  return {
    title: asText(value.title || value.name, language, t(language, 'agendaItemFallback')),
    time: asText(value.time, language),
    description: asText(value.description || value.body, language),
  };
}

function sponsorItem(value: unknown, language: PreferenceLanguage) {
  if (!isRecord(value)) {
    return {
      name: asText(value, language, t(language, 'sponsorFallback')),
      tier: '',
    };
  }

  return {
    name: asText(value.name || value.label, language, t(language, 'sponsorFallback')),
    tier: asText(value.tier || value.level, language),
  };
}

function faqItem(value: unknown, language: PreferenceLanguage) {
  if (!isRecord(value)) {
    return {
      question: asText(value, language, t(language, 'questionFallback')),
      answer: t(language, 'faqFallbackAnswer'),
    };
  }

  return {
    question: asText(value.question || value.title, language, t(language, 'questionFallback')),
    answer: asText(value.answer || value.body, language, t(language, 'faqFallbackAnswer')),
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
  language,
  formSlug,
  projectSlug,
}: {
  sections: PageSection[];
  theme: ThemeConfig;
  language: PreferenceLanguage;
  formSlug?: string;
  projectSlug?: string;
}) {
  const visible = [...sections].filter((section) => section.visible).sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen app-surface app-text" style={{ ['--primary' as never]: theme.primary }}>
      {visible.map((section) => (
        <Section key={section.id} section={section} theme={theme} language={language} formSlug={formSlug} projectSlug={projectSlug} />
      ))}
    </div>
  );
}

function Section({
  section,
  theme,
  language,
  formSlug,
  projectSlug,
}: {
  section: PageSection;
  theme: ThemeConfig;
  language: PreferenceLanguage;
  formSlug?: string;
  projectSlug?: string;
}) {
  const d = section.data || {};

  if (section.type === 'hero') {
    return (
      <section
        className="relative overflow-hidden px-6 py-24 text-center"
        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
      >
        <div className="mx-auto max-w-4xl text-white">
          <div className="mb-5 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
            {asText(d.badge, language, t(language, 'event'))}
          </div>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">{asText(d.title, language, t(language, 'eventLandingPage'))}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/85">{asText(d.subtitle, language, t(language, 'eventInfo'))}</p>
          <div className="mt-8">
            <Link href={registrationHref(projectSlug, formSlug)} className="rounded-2xl bg-white px-6 py-3 font-bold text-slate-950 shadow-lg">
              {asText(d.cta, language, t(language, 'registerNow'))}
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
          <h2 className="text-3xl font-black app-strong">{asText(d.title, language, t(language, 'aboutEvent'))}</h2>
          <p className="text-lg leading-8 app-muted">{asText(d.body, language, t(language, 'eventInfo'))}</p>
        </div>
      </section>
    );
  }

  if (section.type === 'agenda') {
    const items = asArray(d.items).map((item) => agendaItem(item, language));

    return (
      <section className="app-surface-alt px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-3xl font-black app-strong">{asText(d.title, language, t(language, 'agenda'))}</h2>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="rounded-2xl border app-border app-panel p-5 shadow-sm">
                {item.time ? <div className="mb-2 text-sm font-bold" style={{ color: theme.primary }}>{item.time}</div> : null}
                <div className="font-semibold app-strong">{item.title}</div>
                {item.description ? <p className="mt-2 text-sm app-muted">{item.description}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === 'speakers') {
    const items = asArray(d.items).length ? asArray(d.items).map((item) => speakerItem(item, language)) : [null, null, null].map((item) => speakerItem(item, language));

    return (
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-3xl font-black app-strong">{asText(d.title, language, t(language, 'featuredSpeakers'))}</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {items.map((item, index) => (
              <div key={index} className="rounded-3xl border app-border app-panel p-6 shadow-sm">
                {item.avatar ? (
                  <img src={item.avatar} alt={item.name} className="mb-4 h-24 w-24 rounded-full object-cover" style={{ background: 'var(--app-soft)' }} />
                ) : (
                  <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full text-2xl font-bold" style={{ background: 'var(--app-soft)', color: 'var(--app-muted)' }}>
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <h3 className="font-bold app-strong">{item.name}</h3>
                <p className="text-sm app-muted">{item.position}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === 'sponsors') {
    const items = asArray(d.items).length ? asArray(d.items).map((item) => sponsorItem(item, language)) : [null, null, null, null].map((item) => sponsorItem(item, language));

    return (
      <section className="app-surface-alt px-6 py-14">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-2xl font-black app-strong">{asText(d.title, language, t(language, 'sponsors'))}</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {items.map((item, index) => (
              <div key={index} className="rounded-2xl app-panel p-6 shadow-sm">
                <div className="font-bold app-muted">{item.name}</div>
                {item.tier ? <div className="mt-2 text-xs uppercase tracking-[0.2em] app-muted">{item.tier}</div> : null}
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
        <div className="mx-auto max-w-3xl rounded-3xl border app-border app-panel p-8 text-center shadow-sm">
          <h2 className="text-3xl font-black app-strong">{asText(d.title, language, t(language, 'registration'))}</h2>
          <p className="mt-3 app-muted">{asText(d.description, language, t(language, 'fillRegistrationInfo'))}</p>
          <Link
            href={registrationHref(projectSlug, formSlug)}
            className="mt-6 inline-flex rounded-2xl px-6 py-3 font-bold text-white"
            style={{ background: theme.primary }}
          >
            {asText(d.button_text || d.cta, language, t(language, 'openRegistrationForm'))}
          </Link>
        </div>
      </section>
    );
  }

  if (section.type === 'faq') {
    const items = asArray(d.items).length ? asArray(d.items).map((item) => faqItem(item, language)) : [null, null].map((item) => faqItem(item, language));

    return (
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-3xl font-black app-strong">{asText(d.title, language, t(language, 'faqTitle'))}</h2>
          {items.map((item, index) => (
            <details key={index} className="mb-3 rounded-2xl border app-border app-panel p-5">
              <summary className="cursor-pointer font-bold app-strong">{item.question}</summary>
              <p className="mt-3 app-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    );
  }

  if (section.type === 'map') {
    return (
      <section className="app-surface-alt px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-black app-strong">{t(language, 'venue')}</h2>
          <div className="mt-5 rounded-3xl app-panel p-10 shadow-sm app-muted">{asText(d.location, language, t(language, 'venueFallback'))}</div>
        </div>
      </section>
    );
  }

  return <footer className="px-6 py-10 text-center" style={{ background: theme.secondary, color: '#ffffff' }}>{asText(d.text, language, '© Delfi Event Studio')}</footer>;
}
