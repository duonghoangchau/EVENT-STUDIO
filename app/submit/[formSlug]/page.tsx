import { submitRegistration } from '@/app/actions';
import { prisma } from '@/lib/db';
import { normalizeFormSchema } from '@/lib/form-schema';
import { getServerPreferences } from '@/lib/preferences-server';
import { resolveLocalizedText, t } from '@/lib/preferences';
import { FormField } from '@/lib/types';
import { notFound } from 'next/navigation';

export default async function SubmitPage({ params }: { params: Promise<{ formSlug: string }> }) {
  const { formSlug } = await params;
  const form = await prisma.eventForm.findUnique({ where: { slug: formSlug }, include: { project: true } });

  if (!form) notFound();

  const schema = normalizeFormSchema(form.schemaJson);
  const preferences = await getServerPreferences({ defaultLanguage: form.project.language === 'en' ? 'en' : 'vi' });
  const language = preferences.language;

  return (
    <div className="min-h-screen app-surface-alt px-5 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 rounded-3xl p-8 text-white" style={{ background: 'linear-gradient(135deg, #2563eb, #0f172a)' }}>
          <h1 className="text-3xl font-black">{resolveLocalizedText(schema.title, language, t(language, 'registration'))}</h1>
          <p className="mt-2 text-slate-300">{form.project.name}</p>
        </div>

        <form action={submitRegistration.bind(null, form.id)} className="space-y-5" encType="multipart/form-data">
          {schema.steps.map((step, index) => (
            <div key={step.id} className="rounded-3xl border app-border app-surface p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-bold text-white">{index + 1}</div>
                <h2 className="text-xl font-black app-strong">{resolveLocalizedText(step.title, language)}</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {step.fields.map((field) => (
                  <Field key={field.id} field={field} language={language} />
                ))}
              </div>
            </div>
          ))}

          <button className="w-full rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white">{t(language, 'submitRegistration')}</button>
        </form>
      </div>
    </div>
  );
}

function Field({ field, language }: { field: FormField; language: 'vi' | 'en' }) {
  const commonInputProps = {
    name: field.name,
    required: field.required,
    placeholder: resolveLocalizedText(field.placeholder, language, resolveLocalizedText(field.label, language)),
    className: 'input mt-2',
  };

  if (field.type === 'textarea') {
    return (
      <label className="block md:col-span-2">
        <span className="label">
          {resolveLocalizedText(field.label, language)}
          {field.required ? <span className="text-red-500"> *</span> : null}
        </span>
        <textarea {...commonInputProps} rows={5} />
      </label>
    );
  }

  if (field.type === 'select') {
    return (
      <label className="block">
        <span className="label">
          {resolveLocalizedText(field.label, language)}
          {field.required ? <span className="text-red-500"> *</span> : null}
        </span>
        <select {...commonInputProps} defaultValue="">
          <option value="" disabled>
            {t(language, 'chooseValue')}
          </option>
          {(field.options || ['Option 1']).map((option, index) => (
            <option key={`${field.id}-${index}`} value={resolveLocalizedText(option, language)}>
              {resolveLocalizedText(option, language)}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === 'radio') {
    return (
      <fieldset className="block">
        <legend className="label">
          {resolveLocalizedText(field.label, language)}
          {field.required ? <span className="text-red-500"> *</span> : null}
        </legend>
        <div className="mt-3 space-y-2 rounded-2xl border app-border app-surface-alt p-4">
          {(field.options || ['Option 1']).map((option, index) => (
            <label key={`${field.id}-${index}`} className="flex items-center gap-3 text-sm app-text">
              <input name={field.name} required={field.required} type="radio" value={resolveLocalizedText(option, language)} />
              <span>{resolveLocalizedText(option, language)}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (field.type === 'checkbox') {
    const hasOptions = Boolean(field.options?.length);

    if (hasOptions) {
      return (
        <fieldset className="block">
          <legend className="label">
            {resolveLocalizedText(field.label, language)}
            {field.required ? <span className="text-red-500"> *</span> : null}
          </legend>
          <div className="mt-3 space-y-2 rounded-2xl border app-border app-surface-alt p-4">
            {field.options?.map((option, index) => (
              <label key={`${field.id}-${index}`} className="flex items-center gap-3 text-sm app-text">
                <input name={field.name} type="checkbox" value={resolveLocalizedText(option, language)} />
                <span>{resolveLocalizedText(option, language)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      );
    }

    return (
      <label className="mt-8 flex items-center gap-3 rounded-2xl border app-border app-surface-alt p-4 text-sm app-text">
        <input name={field.name} required={field.required} type="checkbox" />
        <span>{resolveLocalizedText(field.label, language)}</span>
      </label>
    );
  }

  if (field.type === 'file') {
    return (
      <label className="block">
        <span className="label">
          {resolveLocalizedText(field.label, language)}
          {field.required ? <span className="text-red-500"> *</span> : null}
        </span>
        <input className="mt-2 block w-full rounded-xl border app-border app-panel px-4 py-3 text-sm" name={field.name} required={field.required} type="file" />
      </label>
    );
  }

  if (field.type === 'consent') {
    return (
      <label className="mt-8 flex items-start gap-3 rounded-2xl border app-border app-surface-alt p-4 text-sm app-text md:col-span-2">
        <input name={field.name} required={field.required} type="checkbox" />
        <span>{resolveLocalizedText(field.label, language)}</span>
      </label>
    );
  }

  return (
    <label className="block">
      <span className="label">
        {resolveLocalizedText(field.label, language)}
        {field.required ? <span className="text-red-500"> *</span> : null}
      </span>
      <input {...commonInputProps} type={field.type === 'phone' ? 'tel' : field.type} />
    </label>
  );
}
