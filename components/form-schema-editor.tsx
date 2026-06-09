'use client';

import { useState } from 'react';
import { usePreferences } from '@/components/preferences-provider';
import { createEmptyField, createEmptyStep } from '@/lib/form-schema';
import { FORM_FIELD_TYPES, FormField, FormSchema } from '@/lib/types';

type FormSchemaEditorProps = {
  action: (formData: FormData) => void | Promise<void>;
  formTitle: string;
  formSlug: string;
  initialSchema: FormSchema;
};

function updateField(fields: FormField[], fieldIndex: number, updater: (field: FormField) => FormField) {
  return fields.map((field, index) => (index === fieldIndex ? updater(field) : field));
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

function mergeLocalizedOptions(currentOptions: FormField['options'], language: 'vi' | 'en', rawValue: string): FormField['options'] {
  const nextLines = rawValue.split('\n').map((line) => line.trim());
  const existing = currentOptions || [];
  const maxLength = Math.max(existing.length, nextLines.length);
  const merged = Array.from({ length: maxLength }, (_, index) => {
    const currentOption = existing[index];
    const nextLine = nextLines[index] || '';

    if (typeof currentOption === 'object' && currentOption !== null && !Array.isArray(currentOption)) {
      const localized = currentOption as { vi?: string; en?: string };
      const updated = {
        vi: language === 'vi' ? nextLine : localized.vi || '',
        en: language === 'en' ? nextLine : localized.en || '',
      };

      return updated.vi || updated.en ? updated : null;
    }

    const baseValue =
      typeof currentOption === 'string' || typeof currentOption === 'number' || typeof currentOption === 'boolean' ? String(currentOption) : '';
    const updated = {
      vi: language === 'vi' ? nextLine : baseValue,
      en: language === 'en' ? nextLine : baseValue,
    };

    return updated.vi || updated.en ? updated : null;
  }).filter(Boolean);

  return merged.length ? (merged as NonNullable<FormField['options']>) : undefined;
}

function LocalizedTextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-[11px] font-bold uppercase tracking-[0.16em] app-muted">{label}</div>
      <input className="input" value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

export function FormSchemaEditor({ action, formTitle, formSlug, initialSchema }: FormSchemaEditorProps) {
  const { translate } = usePreferences();
  const [schema, setSchema] = useState<FormSchema>(initialSchema);
  const localizedFieldPair = (
    label: string,
    value: unknown,
    onChange: (nextLanguage: 'vi' | 'en', nextValue: string) => void
  ) => (
    <div className="space-y-2">
      <span className="label">{label}</span>
      <div className="grid gap-3 lg:grid-cols-2">
        <LocalizedTextInput label={`${label} VI`} value={localizedEditorValue(value, 'vi')} onChange={(nextValue) => onChange('vi', nextValue)} />
        <LocalizedTextInput label={`${label} EN`} value={localizedEditorValue(value, 'en')} onChange={(nextValue) => onChange('en', nextValue)} />
      </div>
    </div>
  );

  return (
    <form action={action} className="section-shell p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black app-strong">{formTitle}</h2>
          <p className="text-sm app-muted">/{formSlug}</p>
        </div>
        <button className="btn-primary" type="submit">
          {translate('saveSchema')}
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[2fr_1fr]">
        <div className="block">
          {localizedFieldPair(translate('formTitle'), schema.title, (nextLanguage, nextValue) =>
            setSchema((current) => ({ ...current, title: setLocalizedValue(current.title, nextLanguage, nextValue) }))
          )}
        </div>
        <label className="block">
          <span className="label">{translate('mode')}</span>
          <select
            className="input mt-2"
            value={schema.mode}
            onChange={(event) => setSchema((current) => ({ ...current, mode: event.target.value === 'single' ? 'single' : 'multi' }))}
          >
            <option value="multi">{translate('multiStep')}</option>
            <option value="single">{translate('singleStep')}</option>
          </select>
        </label>
      </div>

      <div className="mt-6 space-y-4">
        {schema.steps.map((step, stepIndex) => (
          <div key={step.id} className="rounded-3xl border app-border app-surface-alt p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="grid flex-1 gap-3 md:grid-cols-[1fr_220px]">
                <div className="block">
                  {localizedFieldPair(translate('stepTitle'), step.title, (nextLanguage, nextValue) =>
                    setSchema((current) => ({
                      ...current,
                      steps: current.steps.map((item, index) =>
                        index === stepIndex ? { ...item, title: setLocalizedValue(item.title, nextLanguage, nextValue) } : item
                      ),
                    }))
                  )}
                </div>
                <label className="block">
                  <span className="label">{translate('stepId')}</span>
                  <input
                    className="input mt-2"
                    value={step.id}
                    onChange={(event) =>
                      setSchema((current) => ({
                        ...current,
                        steps: current.steps.map((item, index) => (index === stepIndex ? { ...item, id: event.target.value } : item)),
                      }))
                    }
                  />
                </label>
              </div>
              <button
                className="btn-secondary"
                type="button"
                onClick={() =>
                  setSchema((current) => ({
                    ...current,
                    steps: current.steps.filter((_, index) => index !== stepIndex),
                  }))
                }
              >
                {translate('removeStep')}
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {step.fields.map((field, fieldIndex) => (
                <div key={field.id} className="rounded-2xl border app-border app-surface p-4">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="block md:col-span-2">
                      {localizedFieldPair(translate('label'), field.label, (nextLanguage, nextValue) =>
                        setSchema((current) => ({
                          ...current,
                          steps: current.steps.map((item, index) =>
                            index === stepIndex
                              ? {
                                  ...item,
                                  fields: updateField(item.fields, fieldIndex, (currentField) => ({
                                    ...currentField,
                                    label: setLocalizedValue(currentField.label, nextLanguage, nextValue),
                                  })),
                                }
                              : item
                          ),
                        }))
                      )}
                    </div>

                    <label className="block">
                      <span className="label">{translate('fieldName')}</span>
                      <input
                        className="input mt-2"
                        value={field.name}
                        onChange={(event) =>
                          setSchema((current) => ({
                            ...current,
                            steps: current.steps.map((item, index) =>
                              index === stepIndex
                                ? { ...item, fields: updateField(item.fields, fieldIndex, (currentField) => ({ ...currentField, name: event.target.value })) }
                                : item
                            ),
                          }))
                        }
                      />
                    </label>

                    <label className="block">
                      <span className="label">{translate('fieldType')}</span>
                      <select
                        className="input mt-2"
                        value={field.type}
                        onChange={(event) =>
                          setSchema((current) => ({
                            ...current,
                            steps: current.steps.map((item, index) =>
                              index === stepIndex
                                ? {
                                    ...item,
                                    fields: updateField(item.fields, fieldIndex, (currentField) => ({
                                      ...currentField,
                                      type: event.target.value as FormField['type'],
                                      options: ['select', 'radio', 'checkbox'].includes(event.target.value)
                                        ? currentField.options?.length
                                          ? currentField.options
                                          : ['Option 1', 'Option 2']
                                        : undefined,
                                    })),
                                  }
                                : item
                            ),
                          }))
                        }
                      >
                        {FORM_FIELD_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="label">{translate('fieldId')}</span>
                      <input
                        className="input mt-2"
                        value={field.id}
                        onChange={(event) =>
                          setSchema((current) => ({
                            ...current,
                            steps: current.steps.map((item, index) =>
                              index === stepIndex
                                ? { ...item, fields: updateField(item.fields, fieldIndex, (currentField) => ({ ...currentField, id: event.target.value })) }
                                : item
                            ),
                          }))
                        }
                      />
                    </label>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto_auto]">
                    <div className="block">
                      {localizedFieldPair(translate('placeholder'), field.placeholder, (nextLanguage, nextValue) =>
                        setSchema((current) => ({
                          ...current,
                          steps: current.steps.map((item, index) =>
                            index === stepIndex
                              ? {
                                  ...item,
                                  fields: updateField(item.fields, fieldIndex, (currentField) => ({
                                    ...currentField,
                                    placeholder: setLocalizedValue(currentField.placeholder, nextLanguage, nextValue),
                                  })),
                                }
                              : item
                          ),
                        }))
                      )}
                    </div>

                    <label className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                      <input
                        checked={field.required}
                        onChange={(event) =>
                          setSchema((current) => ({
                            ...current,
                            steps: current.steps.map((item, index) =>
                              index === stepIndex
                                ? { ...item, fields: updateField(item.fields, fieldIndex, (currentField) => ({ ...currentField, required: event.target.checked })) }
                                : item
                            ),
                          }))
                        }
                        type="checkbox"
                      />
                      {translate('required')}
                    </label>

                    <button
                      className="btn-secondary mt-6"
                      type="button"
                      onClick={() =>
                        setSchema((current) => ({
                          ...current,
                          steps: current.steps.map((item, index) =>
                            index === stepIndex
                              ? { ...item, fields: item.fields.filter((_, currentFieldIndex) => currentFieldIndex !== fieldIndex) }
                              : item
                          ),
                        }))
                      }
                    >
                      {translate('removeField')}
                    </button>
                  </div>

                  {['select', 'radio', 'checkbox'].includes(field.type) ? (
                    <div className="mt-4 space-y-2">
                      <span className="label">{translate('optionsOnePerLine')}</span>
                      <div className="grid gap-3 lg:grid-cols-2">
                        <div className="space-y-1.5">
                          <div className="text-[11px] font-bold uppercase tracking-[0.16em] app-muted">VI</div>
                          <textarea
                            className="input min-h-28"
                            value={(field.options || []).map((option) => localizedEditorValue(option, 'vi')).join('\n')}
                            onChange={(event) =>
                              setSchema((current) => ({
                                ...current,
                                steps: current.steps.map((item, index) =>
                                  index === stepIndex
                                    ? {
                                        ...item,
                                        fields: updateField(item.fields, fieldIndex, (currentField) => ({
                                          ...currentField,
                                          options: mergeLocalizedOptions(currentField.options, 'vi', event.target.value),
                                        })),
                                      }
                                    : item
                                ),
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <div className="text-[11px] font-bold uppercase tracking-[0.16em] app-muted">EN</div>
                          <textarea
                            className="input min-h-28"
                            value={(field.options || []).map((option) => localizedEditorValue(option, 'en')).join('\n')}
                            onChange={(event) =>
                              setSchema((current) => ({
                                ...current,
                                steps: current.steps.map((item, index) =>
                                  index === stepIndex
                                    ? {
                                        ...item,
                                        fields: updateField(item.fields, fieldIndex, (currentField) => ({
                                          ...currentField,
                                          options: mergeLocalizedOptions(currentField.options, 'en', event.target.value),
                                        })),
                                      }
                                    : item
                                ),
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="mt-4">
              <button
                className="btn-secondary"
                type="button"
                onClick={() =>
                  setSchema((current) => ({
                    ...current,
                    steps: current.steps.map((item, index) =>
                      index === stepIndex ? { ...item, fields: [...item.fields, createEmptyField(stepIndex, item.fields.length)] } : item
                    ),
                  }))
                }
              >
                {translate('addField')}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          className="btn-secondary"
          type="button"
          onClick={() =>
            setSchema((current) => ({
              ...current,
              steps: [...current.steps, createEmptyStep(current.steps.length)],
            }))
          }
        >
          {translate('addStep')}
        </button>
      </div>

      <details className="mt-6 rounded-2xl border app-border app-surface-alt p-4">
        <summary className="cursor-pointer font-semibold app-strong">{translate('jsonPreview')}</summary>
        <pre className="mt-3 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">{JSON.stringify(schema, null, 2)}</pre>
      </details>

      <input name="schemaJson" type="hidden" value={JSON.stringify(schema)} />
    </form>
  );
}
