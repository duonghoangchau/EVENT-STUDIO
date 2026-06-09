import { submitRegistration } from '@/app/actions';
import { prisma } from '@/lib/db';
import { normalizeFormSchema } from '@/lib/form-schema';
import { FormField } from '@/lib/types';
import { notFound } from 'next/navigation';

export default async function SubmitPage({ params }: { params: Promise<{ formSlug: string }> }) {
  const { formSlug } = await params;
  const form = await prisma.eventForm.findUnique({ where: { slug: formSlug }, include: { project: true } });

  if (!form) notFound();

  const schema = normalizeFormSchema(form.schemaJson);

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 rounded-3xl bg-slate-950 p-8 text-white">
          <h1 className="text-3xl font-black">{schema.title}</h1>
          <p className="mt-2 text-slate-300">{form.project.name}</p>
        </div>

        <form action={submitRegistration.bind(null, form.id)} className="space-y-5" encType="multipart/form-data">
          {schema.steps.map((step, index) => (
            <div key={step.id} className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-bold text-white">{index + 1}</div>
                <h2 className="text-xl font-black">{step.title}</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {step.fields.map((field) => (
                  <Field key={field.id} field={field} />
                ))}
              </div>
            </div>
          ))}

          <button className="w-full rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white">Gui dang ky</button>
        </form>
      </div>
    </div>
  );
}

function Field({ field }: { field: FormField }) {
  const commonInputProps = {
    name: field.name,
    required: field.required,
    placeholder: field.placeholder || field.label,
    className: 'input mt-2',
  };

  if (field.type === 'textarea') {
    return (
      <label className="block md:col-span-2">
        <span className="label">
          {field.label}
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
          {field.label}
          {field.required ? <span className="text-red-500"> *</span> : null}
        </span>
        <select {...commonInputProps} defaultValue="">
          <option value="" disabled>
            Chon mot gia tri
          </option>
          {(field.options || ['Option 1']).map((option) => (
            <option key={option} value={option}>
              {option}
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
          {field.label}
          {field.required ? <span className="text-red-500"> *</span> : null}
        </legend>
        <div className="mt-3 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          {(field.options || ['Option 1']).map((option) => (
            <label key={option} className="flex items-center gap-3 text-sm text-slate-700">
              <input name={field.name} required={field.required} type="radio" value={option} />
              <span>{option}</span>
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
            {field.label}
            {field.required ? <span className="text-red-500"> *</span> : null}
          </legend>
          <div className="mt-3 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            {field.options?.map((option) => (
              <label key={option} className="flex items-center gap-3 text-sm text-slate-700">
                <input name={field.name} type="checkbox" value={option} />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>
      );
    }

    return (
      <label className="mt-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <input name={field.name} required={field.required} type="checkbox" />
        <span>{field.label}</span>
      </label>
    );
  }

  if (field.type === 'file') {
    return (
      <label className="block">
        <span className="label">
          {field.label}
          {field.required ? <span className="text-red-500"> *</span> : null}
        </span>
        <input className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm" name={field.name} required={field.required} type="file" />
      </label>
    );
  }

  if (field.type === 'consent') {
    return (
      <label className="mt-8 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 md:col-span-2">
        <input name={field.name} required={field.required} type="checkbox" />
        <span>{field.label}</span>
      </label>
    );
  }

  return (
    <label className="block">
      <span className="label">
        {field.label}
        {field.required ? <span className="text-red-500"> *</span> : null}
      </span>
      <input {...commonInputProps} type={field.type === 'phone' ? 'tel' : field.type} />
    </label>
  );
}
