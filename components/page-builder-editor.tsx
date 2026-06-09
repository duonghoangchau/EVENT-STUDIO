'use client';

import { useEffect, useState } from 'react';
import { createSection, normalizePageJson, SECTION_LIBRARY, SINGLE_INSTANCE_SECTION_TYPES } from '@/lib/page-schema';
import { PAGE_SECTION_TYPES, PageSection, SectionType } from '@/lib/types';

type PageBuilderEditorProps = {
  action: (formData: FormData) => void | Promise<void>;
  initialSections: PageSection[];
};

type ItemShape = Record<string, string>;

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

function sectionHeadline(section: PageSection) {
  const data = section.data || {};
  if (typeof data.title === 'string' && data.title.trim()) return data.title;
  if (typeof data.location === 'string' && data.location.trim()) return data.location;
  if (typeof data.text === 'string' && data.text.trim()) return data.text;
  return SECTION_LIBRARY[section.type].label;
}

function sectionMeta(section: PageSection) {
  const data = section.data || {};
  if (Array.isArray(data.items)) return `${data.items.length} item${data.items.length === 1 ? '' : 's'}`;
  if (typeof data.subtitle === 'string' && data.subtitle.trim()) return data.subtitle;
  if (typeof data.body === 'string' && data.body.trim()) return data.body;
  if (typeof data.description === 'string' && data.description.trim()) return data.description;
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
  fields: Array<{ key: string; label: string; multiline?: boolean }>;
  addLabel: string;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, itemIndex) => (
        <details key={itemIndex} className="rounded-2xl border border-slate-200 bg-slate-50 p-4" open={itemIndex === 0}>
          <summary className="cursor-pointer text-sm font-semibold text-slate-700">
            {item[fields[0]?.key] || `${addLabel.replace('Add ', '')} ${itemIndex + 1}`}
          </summary>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {fields.map((field) => (
              <label key={field.key} className={`block ${field.multiline ? 'md:col-span-2' : ''}`}>
                <span className="label">{field.label}</span>
                {field.multiline ? (
                  <textarea
                    className="input mt-2 min-h-24"
                    value={item[field.key] || ''}
                    onChange={(event) =>
                      onChange(items.map((current, index) => (index === itemIndex ? { ...current, [field.key]: event.target.value } : current)))
                    }
                  />
                ) : (
                  <input
                    className="input mt-2"
                    value={item[field.key] || ''}
                    onChange={(event) =>
                      onChange(items.map((current, index) => (index === itemIndex ? { ...current, [field.key]: event.target.value } : current)))
                    }
                  />
                )}
              </label>
            ))}
          </div>

          <div className="mt-3 flex justify-end">
            <button className="btn-secondary" type="button" onClick={() => onChange(items.filter((_, index) => index !== itemIndex))}>
              Remove item
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

function SectionFields({
  section,
  onChange,
}: {
  section: PageSection;
  onChange: (section: PageSection) => void;
}) {
  const data = section.data || {};
  const setDataValue = (key: string, value: unknown) => onChange({ ...section, data: { ...data, [key]: value } });

  if (section.type === 'hero') {
    return (
      <div className="grid gap-4">
        <label className="block">
          <span className="label">Badge</span>
          <input className="input mt-2" value={String(data.badge || '')} onChange={(event) => setDataValue('badge', event.target.value)} />
        </label>
        <label className="block">
          <span className="label">Title</span>
          <input className="input mt-2" value={String(data.title || '')} onChange={(event) => setDataValue('title', event.target.value)} />
        </label>
        <label className="block">
          <span className="label">Subtitle</span>
          <textarea className="input mt-2 min-h-28" value={String(data.subtitle || '')} onChange={(event) => setDataValue('subtitle', event.target.value)} />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="label">Primary CTA</span>
            <input className="input mt-2" value={String(data.cta || '')} onChange={(event) => setDataValue('cta', event.target.value)} />
          </label>
          <label className="block">
            <span className="label">Secondary CTA</span>
            <input className="input mt-2" value={String(data.secondary_cta || '')} onChange={(event) => setDataValue('secondary_cta', event.target.value)} />
          </label>
        </div>
      </div>
    );
  }

  if (section.type === 'about') {
    return (
      <div className="grid gap-4">
        <label className="block">
          <span className="label">Title</span>
          <input className="input mt-2" value={String(data.title || '')} onChange={(event) => setDataValue('title', event.target.value)} />
        </label>
        <label className="block">
          <span className="label">Body</span>
          <textarea className="input mt-2 min-h-32" value={String(data.body || '')} onChange={(event) => setDataValue('body', event.target.value)} />
        </label>
      </div>
    );
  }

  if (section.type === 'agenda') {
    return (
      <div className="grid gap-4">
        <label className="block">
          <span className="label">Title</span>
          <input className="input mt-2" value={String(data.title || '')} onChange={(event) => setDataValue('title', event.target.value)} />
        </label>
        <ItemEditor
          addLabel="Add agenda item"
          fields={[
            { key: 'time', label: 'Time' },
            { key: 'title', label: 'Title' },
            { key: 'description', label: 'Description', multiline: true },
          ]}
          items={Array.isArray(data.items) ? (data.items as ItemShape[]) : []}
          onChange={(items) => setDataValue('items', items)}
        />
      </div>
    );
  }

  if (section.type === 'speakers') {
    return (
      <div className="grid gap-4">
        <label className="block">
          <span className="label">Title</span>
          <input className="input mt-2" value={String(data.title || '')} onChange={(event) => setDataValue('title', event.target.value)} />
        </label>
        <ItemEditor
          addLabel="Add speaker"
          fields={[
            { key: 'name', label: 'Name' },
            { key: 'position', label: 'Position' },
            { key: 'avatar', label: 'Avatar URL' },
          ]}
          items={Array.isArray(data.items) ? (data.items as ItemShape[]) : []}
          onChange={(items) => setDataValue('items', items)}
        />
      </div>
    );
  }

  if (section.type === 'sponsors') {
    return (
      <div className="grid gap-4">
        <label className="block">
          <span className="label">Title</span>
          <input className="input mt-2" value={String(data.title || '')} onChange={(event) => setDataValue('title', event.target.value)} />
        </label>
        <ItemEditor
          addLabel="Add sponsor"
          fields={[
            { key: 'name', label: 'Name' },
            { key: 'tier', label: 'Tier' },
          ]}
          items={Array.isArray(data.items) ? (data.items as ItemShape[]) : []}
          onChange={(items) => setDataValue('items', items)}
        />
      </div>
    );
  }

  if (section.type === 'form') {
    return (
      <div className="grid gap-4">
        <label className="block">
          <span className="label">Title</span>
          <input className="input mt-2" value={String(data.title || '')} onChange={(event) => setDataValue('title', event.target.value)} />
        </label>
        <label className="block">
          <span className="label">Description</span>
          <textarea className="input mt-2 min-h-24" value={String(data.description || '')} onChange={(event) => setDataValue('description', event.target.value)} />
        </label>
        <label className="block">
          <span className="label">Button text</span>
          <input className="input mt-2" value={String(data.button_text || '')} onChange={(event) => setDataValue('button_text', event.target.value)} />
        </label>
      </div>
    );
  }

  if (section.type === 'faq') {
    return (
      <div className="grid gap-4">
        <label className="block">
          <span className="label">Title</span>
          <input className="input mt-2" value={String(data.title || '')} onChange={(event) => setDataValue('title', event.target.value)} />
        </label>
        <ItemEditor
          addLabel="Add FAQ item"
          fields={[
            { key: 'question', label: 'Question' },
            { key: 'answer', label: 'Answer', multiline: true },
          ]}
          items={Array.isArray(data.items) ? (data.items as ItemShape[]) : []}
          onChange={(items) => setDataValue('items', items)}
        />
      </div>
    );
  }

  if (section.type === 'map') {
    return (
      <label className="block">
        <span className="label">Location</span>
        <input className="input mt-2" value={String(data.location || '')} onChange={(event) => setDataValue('location', event.target.value)} />
      </label>
    );
  }

  return (
    <label className="block">
      <span className="label">Footer text</span>
      <textarea className="input mt-2 min-h-24" value={String(data.text || '')} onChange={(event) => setDataValue('text', event.target.value)} />
    </label>
  );
}

export function PageBuilderEditor({ action, initialSections }: PageBuilderEditorProps) {
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
          <h2 className="font-black">Page Builder</h2>
          <p className="mt-1 text-sm text-slate-500">Select one block at a time, keep the queue compact, and edit details in a focused panel.</p>
        </div>
        <button className="btn-primary" type="submit">
          Save page
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 text-sm font-semibold text-slate-700">Add section</div>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {PAGE_SECTION_TYPES.map((type) => {
            const isDisabled = singleInstanceTypes.has(type) && sections.some((section) => section.type === type);

            return (
              <button key={type} className="btn-secondary justify-start disabled:cursor-not-allowed disabled:opacity-50" disabled={isDisabled} type="button" onClick={() => addSection(type)}>
                {SECTION_LIBRARY[type].label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-5 2xl:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900">Section queue</h3>
                <p className="mt-1 text-sm text-slate-500">{sections.length} block{sections.length === 1 ? '' : 's'} on page</p>
              </div>
            </div>

            <div className="mt-4 space-y-3 xl:max-h-[820px] xl:overflow-auto xl:pr-1">
              {sections.map((section, index) => {
                const isSelected = section.id === selectedSectionId;

                return (
                  <button
                    key={section.id}
                    className={`block w-full rounded-2xl border p-4 text-left transition ${
                      isSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
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
                        <div className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                          {SECTION_LIBRARY[section.type].label}
                        </div>
                        <div className="mt-3 text-sm font-bold text-slate-900">{sectionHeadline(section)}</div>
                        <div className="mt-1 line-clamp-2 text-xs text-slate-500">{sectionMeta(section)}</div>
                      </div>
                      <div className="text-xs font-semibold text-slate-400">#{index + 1}</div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${section.visible ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                        {section.visible ? 'Visible' : 'Hidden'}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{section.variant || 'default'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          {selectedSection ? (
            <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm 2xl:sticky 2xl:top-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
                    {SECTION_LIBRARY[selectedSection.type].label}
                  </div>
                  <h3 className="mt-3 text-xl font-black text-slate-900">{sectionHeadline(selectedSection)}</h3>
                  <p className="mt-1 text-sm text-slate-500">Edit this block while the rest of the page stays compact in the queue.</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button className="btn-secondary" type="button" disabled={selectedIndex <= 0} onClick={() => moveSection(selectedIndex, -1)}>
                    Move up
                  </button>
                  <button className="btn-secondary" type="button" disabled={selectedIndex >= sections.length - 1} onClick={() => moveSection(selectedIndex, 1)}>
                    Move down
                  </button>
                  <button className="btn-secondary" type="button" onClick={() => removeSection(selectedIndex)}>
                    Remove
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="label">Section id</span>
                  <input
                    className="input mt-2"
                    value={selectedSection.id}
                    onChange={(event) => updateSection(selectedIndex, { ...selectedSection, id: event.target.value })}
                  />
                </label>

                <label className="block">
                  <span className="label">Variant</span>
                  <input
                    className="input mt-2"
                    value={selectedSection.variant}
                    onChange={(event) => updateSection(selectedIndex, { ...selectedSection, variant: event.target.value })}
                  />
                </label>

                <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
                  <input
                    checked={selectedSection.visible}
                    type="checkbox"
                    onChange={(event) => updateSection(selectedIndex, { ...selectedSection, visible: event.target.checked })}
                  />
                  Visible
                </label>
              </div>

              <div className="mt-5">
                <SectionFields section={selectedSection} onChange={(next) => updateSection(selectedIndex, next)} />
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
              Add a section from the library to start building the page.
            </div>
          )}

          <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <summary className="cursor-pointer font-semibold">Advanced JSON preview</summary>
            <pre className="mt-3 max-h-80 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">{JSON.stringify({ sections }, null, 2)}</pre>
          </details>
        </div>
      </div>

      <input name="pageJson" type="hidden" value={JSON.stringify({ sections })} />
    </form>
  );
}
