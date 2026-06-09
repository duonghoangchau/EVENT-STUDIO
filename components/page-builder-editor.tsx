'use client';

import { useEffect, useState } from 'react';
import { usePreferences } from '@/components/preferences-provider';
import { createSection, normalizePageJson, SECTION_VARIANTS, SINGLE_INSTANCE_SECTION_TYPES } from '@/lib/page-schema';
import { resolveLocalizedText, sectionTypeLabel } from '@/lib/preferences';
import { PAGE_SECTION_TYPES, PageSection, SectionType } from '@/lib/types';

type PageBuilderEditorProps = {
  action: (formData: FormData) => void | Promise<void>;
  initialSections: PageSection[];
};

type ItemShape = Record<string, unknown>;

function normalizeOrders(sections: PageSection[]) {
  return sections.map((section, index) => ({ ...section, order: index + 1 }));
}

function reorderSections(sections: PageSection[], fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || toIndex >= sections.length) return sections;
  const next = [...sections];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return normalizeOrders(next);
}

function textValue(value: unknown, language: 'vi' | 'en', fallback = '') {
  return resolveLocalizedText(value, language, fallback);
}

function localizedEditorValue(value: unknown, language: 'vi' | 'en') {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);

  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const localized = value as { vi?: unknown; en?: unknown };
    const candidate = localized[language];
    if (typeof candidate === 'string') return candidate;
  }

  return '';
}

function setLocalizedValue(currentValue: unknown, language: 'vi' | 'en', nextValue: string) {
  if (typeof currentValue === 'object' && currentValue !== null && !Array.isArray(currentValue)) {
    const localized = currentValue as { vi?: string; en?: string };
    if ('vi' in localized || 'en' in localized) {
      return {
        ...localized,
        [language]: nextValue,
      };
    }
  }

  const baseValue =
    typeof currentValue === 'string' || typeof currentValue === 'number' || typeof currentValue === 'boolean' ? String(currentValue) : '';

  return {
    vi: language === 'vi' ? nextValue : baseValue,
    en: language === 'en' ? nextValue : baseValue,
  };
}

function sectionHeadline(section: PageSection, language: 'vi' | 'en') {
  const data = section.data || {};
  const title = textValue(data.title, language);
  const location = textValue(data.location, language);
  const footerText = textValue(data.text, language);
  if (title.trim()) return title;
  if (location.trim()) return location;
  if (footerText.trim()) return footerText;
  return sectionTypeLabel(section.type, language);
}

function sectionMeta(section: PageSection, language: 'vi' | 'en') {
  const data = section.data || {};
  if (Array.isArray(data.items)) return `${data.items.length} item${data.items.length === 1 ? '' : 's'}`;
  const subtitle = textValue(data.subtitle, language);
  const body = textValue(data.body, language);
  const description = textValue(data.description, language);
  if (subtitle.trim()) return subtitle;
  if (body.trim()) return body;
  if (description.trim()) return description;
  return section.variant || 'default';
}

function ItemEditor({
  items,
  onChange,
  fields,
  addLabel,
}: {
  items: ItemShape[];
  onChange: (items: ItemShape[]) => void;
  fields: Array<{ key: string; label: string; multiline?: boolean; localizable?: boolean }>;
  addLabel: string;
}) {
  const { language, translate } = usePreferences();

  return (
    <div className="space-y-3">
      {items.map((item, itemIndex) => (
        <details key={itemIndex} className="rounded-2xl border app-border app-surface-alt p-4" open={itemIndex === 0}>
          <summary className="cursor-pointer text-sm font-semibold app-strong">
            {textValue(item[fields[0]?.key], language) || `${textValue(addLabel, language)} ${itemIndex + 1}`}
          </summary>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {fields.map((field) => (
              <label key={field.key} className={`block ${field.multiline ? 'md:col-span-2' : ''}`}>
                <span className="label">{field.label}</span>
                {field.localizable === false ? (
                  field.multiline ? (
                    <textarea
                      className="input mt-2 min-h-24"
                      value={textValue(item[field.key], language)}
                      onChange={(event) =>
                        onChange(items.map((current, index) => (index === itemIndex ? { ...current, [field.key]: event.target.value } : current)))
                      }
                    />
                  ) : (
                    <input
                      className="input mt-2"
                      value={textValue(item[field.key], language)}
                      onChange={(event) =>
                        onChange(items.map((current, index) => (index === itemIndex ? { ...current, [field.key]: event.target.value } : current)))
                      }
                    />
                  )
                ) : (
                  <div className="mt-2 grid gap-3 lg:grid-cols-2">
                    <LocalizedTextInput
                      label="VI"
                      multiline={field.multiline}
                      value={localizedEditorValue(item[field.key], 'vi')}
                      onChange={(value) =>
                        onChange(
                          items.map((current, index) =>
                            index === itemIndex ? { ...current, [field.key]: setLocalizedValue(current[field.key], 'vi', value) } : current
                          )
                        )
                      }
                    />
                    <LocalizedTextInput
                      label="EN"
                      multiline={field.multiline}
                      value={localizedEditorValue(item[field.key], 'en')}
                      onChange={(value) =>
                        onChange(
                          items.map((current, index) =>
                            index === itemIndex ? { ...current, [field.key]: setLocalizedValue(current[field.key], 'en', value) } : current
                          )
                        )
                      }
                    />
                  </div>
                )}
              </label>
            ))}
          </div>

          <div className="mt-3 flex justify-end">
            <button className="btn-secondary" type="button" onClick={() => onChange(items.filter((_, index) => index !== itemIndex))}>
              {translate('removeItem')}
            </button>
          </div>
        </details>
      ))}

      <button className="btn-secondary" type="button" onClick={() => onChange([...items, Object.fromEntries(fields.map((field) => [field.key, '']))])}>
        {addLabel}
      </button>
    </div>
  );
}

function LocalizedTextInput({
  label,
  multiline,
  value,
  onChange,
}: {
  label: string;
  multiline?: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-[11px] font-bold uppercase tracking-[0.16em] app-muted">{label}</div>
      {multiline ? (
        <textarea className="input min-h-24" value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className="input" value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </div>
  );
}

function RawInput({
  type = 'text',
  value,
  onChange,
  placeholder,
}: {
  type?: 'text' | 'url';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return <input className="input" type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />;
}

function normalizeColorValue(value: unknown, fallback: string) {
  if (typeof value === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim())) {
    return value.trim();
  }

  return fallback;
}

function normalizeOverlayStrength(value: unknown, fallback = 18) {
  const numeric = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : Number.NaN;
  if (Number.isFinite(numeric)) {
    return Math.min(85, Math.max(0, Math.round(numeric)));
  }

  return fallback;
}

function normalizeBooleanValue(value: unknown, fallback = true) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value === 'true') return true;
    if (value === 'false') return false;
  }

  return fallback;
}

function SectionFields({
  section,
  onChange,
}: {
  section: PageSection;
  onChange: (section: PageSection) => void;
}) {
  const { translate } = usePreferences();
  const data = section.data || {};
  const setDataValueRaw = (key: string, value: unknown) => onChange({ ...section, data: { ...data, [key]: value } });
  const localTextField = (label: string, key: string, options?: { multiline?: boolean }) => (
    <div className="grid gap-3 lg:grid-cols-2">
      <LocalizedTextInput label={`${label} VI`} multiline={options?.multiline} value={localizedEditorValue(data[key], 'vi')} onChange={(value) => onChange({ ...section, data: { ...data, [key]: setLocalizedValue(data[key], 'vi', value) } })} />
      <LocalizedTextInput label={`${label} EN`} multiline={options?.multiline} value={localizedEditorValue(data[key], 'en')} onChange={(value) => onChange({ ...section, data: { ...data, [key]: setLocalizedValue(data[key], 'en', value) } })} />
    </div>
  );

  if (section.type === 'hero') {
    const primaryColor = normalizeColorValue(data.background_primary, '#2563EB');
    const secondaryColor = normalizeColorValue(data.background_secondary, '#0F172A');
    const backgroundImage = typeof data.background_image === 'string' ? data.background_image : '';
    const overlayStrength = normalizeOverlayStrength(data.background_overlay, 18);
    const visibilityToggles = [
      { key: 'show_badge', label: translate('showHeroBadge') },
      { key: 'show_title', label: translate('showHeroTitle') },
      { key: 'show_subtitle', label: translate('showHeroSubtitle') },
      { key: 'show_primary_cta', label: translate('showHeroPrimaryCta') },
      { key: 'show_secondary_cta', label: translate('showHeroSecondaryCta') },
    ] as const;

    return (
      <div className="grid gap-4">
        {localTextField(translate('badge'), 'badge')}
        {localTextField(translate('title'), 'title')}
        {localTextField(translate('subtitle'), 'subtitle', { multiline: true })}
        {localTextField(translate('primaryCta'), 'cta')}
        {localTextField(translate('secondaryCta'), 'secondary_cta')}
        <label className="block">
          <span className="label">{translate('heroImageUrl')}</span>
          <div className="mt-2">
            <RawInput type="url" value={backgroundImage} placeholder="https://images.example.com/hero.jpg" onChange={(value) => setDataValueRaw('background_image', value)} />
          </div>
          <p className="mt-2 text-xs app-muted">{translate('heroBackgroundHint')}</p>
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="label">{translate('heroPrimaryColor')}</span>
            <div className="mt-2 flex items-center gap-3">
              <input
                className="h-11 w-14 cursor-pointer rounded-xl border app-border app-panel p-1"
                type="color"
                value={primaryColor}
                onChange={(event) => setDataValueRaw('background_primary', event.target.value)}
              />
              <RawInput value={primaryColor} onChange={(value) => setDataValueRaw('background_primary', value)} />
            </div>
          </label>
          <label className="block">
            <span className="label">{translate('heroSecondaryColor')}</span>
            <div className="mt-2 flex items-center gap-3">
              <input
                className="h-11 w-14 cursor-pointer rounded-xl border app-border app-panel p-1"
                type="color"
                value={secondaryColor}
                onChange={(event) => setDataValueRaw('background_secondary', event.target.value)}
              />
              <RawInput value={secondaryColor} onChange={(value) => setDataValueRaw('background_secondary', value)} />
            </div>
          </label>
        </div>
        <label className="block">
          <span className="label">{translate('heroOverlayOpacity')}</span>
          <div className="mt-2 flex items-center gap-4">
            <input
              className="w-full accent-blue-600"
              type="range"
              min="0"
              max="85"
              step="1"
              value={overlayStrength}
              onChange={(event) => setDataValueRaw('background_overlay', Number(event.target.value))}
            />
            <div className="min-w-16 rounded-xl app-soft px-3 py-2 text-center text-sm font-semibold app-strong">{overlayStrength}%</div>
          </div>
          <p className="mt-2 text-xs app-muted">{translate('heroOverlayHint')}</p>
        </label>
        <div className="grid gap-3 md:grid-cols-2">
          {visibilityToggles.map((toggle) => (
            <label key={toggle.key} className="inline-flex items-center gap-2 rounded-2xl border app-border app-surface-alt px-4 py-3 text-sm font-medium app-strong">
              <input
                checked={normalizeBooleanValue(data[toggle.key], true)}
                type="checkbox"
                onChange={(event) => setDataValueRaw(toggle.key, event.target.checked)}
              />
              {toggle.label}
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (section.type === 'about') {
    return (
      <div className="grid gap-4">
        {localTextField(translate('title'), 'title')}
        {localTextField(translate('body'), 'body', { multiline: true })}
      </div>
    );
  }

  if (section.type === 'agenda') {
    return (
      <div className="grid gap-4">
        {localTextField(translate('title'), 'title')}
        <ItemEditor
          addLabel={translate('addAgendaItem')}
          fields={[
            { key: 'time', label: translate('time'), localizable: false },
            { key: 'title', label: translate('title') },
            { key: 'description', label: translate('description'), multiline: true },
          ]}
          items={Array.isArray(data.items) ? (data.items as ItemShape[]) : []}
          onChange={(items) => setDataValueRaw('items', items)}
        />
      </div>
    );
  }

  if (section.type === 'speakers') {
    return (
      <div className="grid gap-4">
        {localTextField(translate('title'), 'title')}
        <ItemEditor
          addLabel={translate('addSpeaker')}
          fields={[
            { key: 'name', label: translate('name') },
            { key: 'position', label: translate('position') },
            { key: 'avatar', label: translate('avatarUrl'), localizable: false },
          ]}
          items={Array.isArray(data.items) ? (data.items as ItemShape[]) : []}
          onChange={(items) => setDataValueRaw('items', items)}
        />
      </div>
    );
  }

  if (section.type === 'sponsors') {
    return (
      <div className="grid gap-4">
        {localTextField(translate('title'), 'title')}
        <ItemEditor
          addLabel={translate('addSponsor')}
          fields={[
            { key: 'name', label: translate('name') },
            { key: 'tier', label: translate('tier') },
          ]}
          items={Array.isArray(data.items) ? (data.items as ItemShape[]) : []}
          onChange={(items) => setDataValueRaw('items', items)}
        />
      </div>
    );
  }

  if (section.type === 'form') {
    return (
      <div className="grid gap-4">
        {localTextField(translate('title'), 'title')}
        {localTextField(translate('description'), 'description', { multiline: true })}
        {localTextField(translate('buttonText'), 'button_text')}
      </div>
    );
  }

  if (section.type === 'faq') {
    return (
      <div className="grid gap-4">
        {localTextField(translate('title'), 'title')}
        <ItemEditor
          addLabel={translate('addFaqItem')}
          fields={[
            { key: 'question', label: translate('question') },
            { key: 'answer', label: translate('answer'), multiline: true },
          ]}
          items={Array.isArray(data.items) ? (data.items as ItemShape[]) : []}
          onChange={(items) => setDataValueRaw('items', items)}
        />
      </div>
    );
  }

  if (section.type === 'map') {
    return (
      localTextField(translate('location'), 'location')
    );
  }

  return (
    localTextField(translate('footerText'), 'text', { multiline: true })
  );
}

export function PageBuilderEditor({ action, initialSections }: PageBuilderEditorProps) {
  const { language, translate } = usePreferences();
  const [sections, setSections] = useState<PageSection[]>(normalizePageJson({ sections: initialSections }).sections);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(sections[0]?.id ?? null);
  const singleInstanceTypes = new Set<SectionType>(SINGLE_INSTANCE_SECTION_TYPES);

  useEffect(() => {
    if (!sections.length) {
      setSelectedSectionId(null);
      return;
    }

    if (!selectedSectionId || !sections.some((section) => section.id === selectedSectionId)) {
      setSelectedSectionId(sections[0].id);
    }
  }, [sections, selectedSectionId]);

  const selectedIndex = sections.findIndex((section) => section.id === selectedSectionId);
  const selectedSection = selectedIndex >= 0 ? sections[selectedIndex] : null;

  const updateSection = (index: number, section: PageSection) => {
    setSections((current) => normalizeOrders(current.map((item, currentIndex) => (currentIndex === index ? section : item))));
  };

  const addSection = (type: SectionType) => {
    if (singleInstanceTypes.has(type) && sections.some((section) => section.type === type)) return;
    const nextSection = createSection(type, sections.length + 1);
    setSections((current) => [...current, nextSection]);
    setSelectedSectionId(nextSection.id);
  };

  const moveSection = (fromIndex: number, direction: -1 | 1) => {
    setSections((current) => reorderSections(current, fromIndex, fromIndex + direction));
  };

  const removeSection = (index: number) => {
    setSections((current) => normalizeOrders(current.filter((_, currentIndex) => currentIndex !== index)));
  };

  return (
    <form action={action} className="section-shell p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-black app-strong">{translate('pageBuilder')}</h2>
          <p className="mt-1 text-sm app-muted">{translate('editBlockHint')}</p>
        </div>
        <button className="btn-primary" type="submit">
          {translate('savePage')}
        </button>
      </div>

      <div className="mt-5 rounded-2xl border app-border app-surface-alt p-4">
        <div className="mb-3 text-sm font-semibold app-strong">{translate('addSection')}</div>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {PAGE_SECTION_TYPES.map((type) => {
            const isDisabled = singleInstanceTypes.has(type) && sections.some((section) => section.type === type);

            return (
              <button key={type} className="btn-secondary justify-start disabled:cursor-not-allowed disabled:opacity-50" disabled={isDisabled} type="button" onClick={() => addSection(type)}>
                {sectionTypeLabel(type, language)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-5 2xl:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="rounded-3xl border app-border app-surface-alt p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black app-strong">{translate('sectionQueue')}</h3>
                <p className="mt-1 text-sm app-muted">{sections.length} {translate('blocksOnPage')}</p>
              </div>
            </div>

            <div className="mt-4 space-y-3 xl:max-h-[820px] xl:overflow-auto xl:pr-1">
              {sections.map((section, index) => {
                const isSelected = section.id === selectedSectionId;

                return (
                  <button
                    key={section.id}
                    className={`block w-full rounded-2xl border p-4 text-left transition ${
                      isSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'app-border app-panel'
                    }`}
                    draggable
                    type="button"
                    onClick={() => setSelectedSectionId(section.id)}
                    onDragStart={() => setDraggedIndex(index)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => {
                      if (draggedIndex === null) return;
                      setSections((current) => reorderSections(current, draggedIndex, index));
                      setDraggedIndex(null);
                    }}
                    onDragEnd={() => setDraggedIndex(null)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="rounded-full app-soft px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] app-muted">
                          {sectionTypeLabel(section.type, language)}
                        </div>
                        <div className="mt-3 text-sm font-bold app-strong">{sectionHeadline(section, language)}</div>
                        <div className="mt-1 line-clamp-2 text-xs app-muted">{sectionMeta(section, language)}</div>
                      </div>
                      <div className="text-xs font-semibold app-muted">#{index + 1}</div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${section.visible ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                        {section.visible ? translate('showOnPublicPage') : translate('hiddenFromPublicPage')}
                      </span>
                      <span className="rounded-full app-soft px-2.5 py-1 text-xs font-semibold app-muted">{section.variant || 'default'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          {selectedSection ? (
            <div className="min-w-0 rounded-3xl border app-border app-surface p-5 shadow-sm 2xl:sticky 2xl:top-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ background: 'var(--app-primary-soft)', color: 'var(--app-primary-soft-text)' }}>
                    {sectionTypeLabel(selectedSection.type, language)}
                  </div>
                  <h3 className="mt-3 text-xl font-black app-strong">{sectionHeadline(selectedSection, language)}</h3>
                  <p className="mt-1 text-sm app-muted">{translate('editBlockHint')}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button className="btn-secondary" type="button" disabled={selectedIndex <= 0} onClick={() => moveSection(selectedIndex, -1)}>
                    {translate('moveUp')}
                  </button>
                  <button className="btn-secondary" type="button" disabled={selectedIndex >= sections.length - 1} onClick={() => moveSection(selectedIndex, 1)}>
                    {translate('moveDown')}
                  </button>
                  <button className="btn-secondary" type="button" onClick={() => removeSection(selectedIndex)}>
                    {translate('remove')}
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="label">{translate('sectionId')}</span>
                  <input
                    className="input mt-2"
                    value={selectedSection.id}
                    onChange={(event) => updateSection(selectedIndex, { ...selectedSection, id: event.target.value })}
                  />
                </label>

                <label className="block">
                  <span className="label">{translate('variant')}</span>
                  <select
                    className="input mt-2"
                    value={selectedSection.variant}
                    onChange={(event) => updateSection(selectedIndex, { ...selectedSection, variant: event.target.value })}
                  >
                    {SECTION_VARIANTS[selectedSection.type].map((variant) => (
                      <option key={variant} value={variant}>
                        {variant}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="inline-flex items-center gap-2 text-sm font-medium app-strong sm:col-span-2">
                  <input
                    checked={selectedSection.visible}
                    type="checkbox"
                    onChange={(event) => updateSection(selectedIndex, { ...selectedSection, visible: event.target.checked })}
                  />
                  {translate('showOnPublicPage')}
                </label>
              </div>

              <div className="mt-5">
                <SectionFields section={selectedSection} onChange={(next) => updateSection(selectedIndex, next)} />
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed app-border app-surface-alt p-10 text-center app-muted">
              {translate('addSectionPlaceholder')}
            </div>
          )}

          <details className="rounded-2xl border app-border app-surface-alt p-4">
            <summary className="cursor-pointer font-semibold app-strong">{translate('advancedJsonPreview')}</summary>
            <pre className="mt-3 max-h-80 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">{JSON.stringify({ sections }, null, 2)}</pre>
          </details>
        </div>
      </div>

      <input name="pageJson" type="hidden" value={JSON.stringify({ sections })} />
    </form>
  );
}
