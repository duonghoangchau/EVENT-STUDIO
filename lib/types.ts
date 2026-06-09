export const PAGE_SECTION_TYPES = ['hero', 'about', 'agenda', 'speakers', 'sponsors', 'form', 'faq', 'map', 'footer'] as const;

export type SectionType = typeof PAGE_SECTION_TYPES[number];

export const FORM_FIELD_TYPES = ['text', 'email', 'phone', 'select', 'radio', 'checkbox', 'textarea', 'file', 'consent'] as const;
export type LocalizedText = string | { vi?: string; en?: string };

export type PageSection = {
  id: string;
  type: SectionType;
  variant: string;
  order: number;
  visible: boolean;
  data: Record<string, any>;
};

export type PageJson = {
  sections: PageSection[];
};

export type ThemeConfig = {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  font: string;
  radius: string;
};

export type FormFieldType = typeof FORM_FIELD_TYPES[number];

export type FormField = {
  id: string;
  label: LocalizedText;
  name: string;
  type: FormFieldType;
  required: boolean;
  placeholder?: LocalizedText;
  options?: LocalizedText[];
};

export type FormStep = { id: string; title: LocalizedText; fields: FormField[] };
export type FormSchema = { title: LocalizedText; mode: 'single' | 'multi'; steps: FormStep[] };
