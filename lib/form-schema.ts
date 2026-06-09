import { FORM_FIELD_TYPES, FormField, FormFieldType, FormSchema, FormStep } from '@/lib/types';

const FIELD_TYPE_SET = new Set<FormFieldType>(FORM_FIELD_TYPES);

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asString(value: unknown, fallback = '') {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return fallback;
}

function asBoolean(value: unknown, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value === 'true') return true;
    if (value === 'false') return false;
  }
  return fallback;
}

function normalizeId(input: string, fallback: string) {
  const normalized = input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  return normalized || fallback;
}

function normalizeOptions(value: unknown) {
  if (!Array.isArray(value)) return undefined;

  const options = value
    .map((item) => asString(item).trim())
    .filter(Boolean);

  return options.length ? options : undefined;
}

function normalizeField(value: unknown, stepIndex: number, fieldIndex: number): FormField {
  const field = asRecord(value) ?? {};
  const type = asString(field.type, 'text') as FormFieldType;
  const safeType = FIELD_TYPE_SET.has(type) ? type : 'text';
  const label = asString(field.label, `Field ${fieldIndex + 1}`).trim() || `Field ${fieldIndex + 1}`;
  const name = normalizeId(asString(field.name, label), `field_${stepIndex + 1}_${fieldIndex + 1}`);

  return {
    id: normalizeId(asString(field.id, name), `field_${stepIndex + 1}_${fieldIndex + 1}`),
    label,
    name,
    type: safeType,
    required: asBoolean(field.required, false),
    placeholder: asString(field.placeholder).trim() || undefined,
    options: ['select', 'radio', 'checkbox'].includes(safeType) ? normalizeOptions(field.options) : undefined,
  };
}

function normalizeStep(value: unknown, stepIndex: number): FormStep {
  const step = asRecord(value) ?? {};
  const title = asString(step.title, `Step ${stepIndex + 1}`).trim() || `Step ${stepIndex + 1}`;
  const fields = Array.isArray(step.fields) ? step.fields.map((field, index) => normalizeField(field, stepIndex, index)) : [];

  return {
    id: normalizeId(asString(step.id, title), `step_${stepIndex + 1}`),
    title,
    fields,
  };
}

export function normalizeFormSchema(value: unknown): FormSchema {
  const schema = asRecord(value) ?? {};
  const mode = asString(schema.mode, 'multi') === 'single' ? 'single' : 'multi';
  const steps = Array.isArray(schema.steps) ? schema.steps.map((step, index) => normalizeStep(step, index)) : [];

  return {
    title: asString(schema.title, 'Registration Form').trim() || 'Registration Form',
    mode,
    steps,
  };
}

export function createEmptyField(stepIndex: number, fieldIndex: number): FormField {
  return {
    id: `field_${stepIndex + 1}_${fieldIndex + 1}`,
    label: `Field ${fieldIndex + 1}`,
    name: `field_${stepIndex + 1}_${fieldIndex + 1}`,
    type: 'text',
    required: false,
    placeholder: '',
  };
}

export function createEmptyStep(stepIndex: number): FormStep {
  return {
    id: `step_${stepIndex + 1}`,
    title: `Step ${stepIndex + 1}`,
    fields: [createEmptyField(stepIndex, 0)],
  };
}
