'use client';

import { useState } from 'react';
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

export function FormSchemaEditor({ action, formTitle, formSlug, initialSchema }: FormSchemaEditorProps) {
  const [schema, setSchema] = useState<FormSchema>(initialSchema);

  return (
    <form action={action} className="section-shell p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black">{formTitle}</h2>
          <p className="text-sm text-slate-500">/{formSlug}</p>
        </div>
        <button className="btn-primary" type="submit">
          Save schema
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[2fr_1fr]">
        <label className="block">
          <span className="label">Form title</span>
          <input
            className="input mt-2"
            value={schema.title}
            onChange={(event) => setSchema((current) => ({ ...current, title: event.target.value }))}
          />
        </label>
        <label className="block">
          <span className="label">Mode</span>
          <select
            className="input mt-2"
            value={schema.mode}
            onChange={(event) => setSchema((current) => ({ ...current, mode: event.target.value === 'single' ? 'single' : 'multi' }))}
          >
            <option value="multi">Multi-step</option>
            <option value="single">Single-step</option>
          </select>
        </label>
      </div>

      <div className="mt-6 space-y-4">
        {schema.steps.map((step, stepIndex) => (
          <div key={step.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="grid flex-1 gap-3 md:grid-cols-[1fr_220px]">
                <label className="block">
                  <span className="label">Step title</span>
                  <input
                    className="input mt-2"
                    value={step.title}
                    onChange={(event) =>
                      setSchema((current) => ({
                        ...current,
                        steps: current.steps.map((item, index) => (index === stepIndex ? { ...item, title: event.target.value } : item)),
                      }))
                    }
                  />
                </label>
                <label className="block">
                  <span className="label">Step id</span>
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
                Remove step
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {step.fields.map((field, fieldIndex) => (
                <div key={field.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <label className="block">
                      <span className="label">Label</span>
                      <input
                        className="input mt-2"
                        value={field.label}
                        onChange={(event) =>
                          setSchema((current) => ({
                            ...current,
                            steps: current.steps.map((item, index) =>
                              index === stepIndex
                                ? { ...item, fields: updateField(item.fields, fieldIndex, (currentField) => ({ ...currentField, label: event.target.value })) }
                                : item
                            ),
                          }))
                        }
                      />
                    </label>

                    <label className="block">
                      <span className="label">Name</span>
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
                      <span className="label">Field type</span>
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
                      <span className="label">Field id</span>
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
                    <label className="block">
                      <span className="label">Placeholder</span>
                      <input
                        className="input mt-2"
                        value={field.placeholder || ''}
                        onChange={(event) =>
                          setSchema((current) => ({
                            ...current,
                            steps: current.steps.map((item, index) =>
                              index === stepIndex
                                ? { ...item, fields: updateField(item.fields, fieldIndex, (currentField) => ({ ...currentField, placeholder: event.target.value })) }
                                : item
                            ),
                          }))
                        }
                      />
                    </label>

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
                      Required
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
                      Remove field
                    </button>
                  </div>

                  {['select', 'radio', 'checkbox'].includes(field.type) ? (
                    <label className="mt-4 block">
                      <span className="label">Options (one per line)</span>
                      <textarea
                        className="input mt-2 min-h-28"
                        value={(field.options || []).join('\n')}
                        onChange={(event) =>
                          setSchema((current) => ({
                            ...current,
                            steps: current.steps.map((item, index) =>
                              index === stepIndex
                                ? {
                                    ...item,
                                    fields: updateField(item.fields, fieldIndex, (currentField) => ({
                                      ...currentField,
                                      options: event.target.value
                                        .split('\n')
                                        .map((option) => option.trim())
                                        .filter(Boolean),
                                    })),
                                  }
                                : item
                            ),
                          }))
                        }
                      />
                    </label>
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
                Add field
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
          Add step
        </button>
      </div>

      <details className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <summary className="cursor-pointer font-semibold">JSON preview</summary>
        <pre className="mt-3 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">{JSON.stringify(schema, null, 2)}</pre>
      </details>

      <input name="schemaJson" type="hidden" value={JSON.stringify(schema)} />
    </form>
  );
}
