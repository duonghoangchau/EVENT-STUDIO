import { PageSection, ThemeConfig, FormSchema } from '@/lib/types';

export const defaultTheme: ThemeConfig = {
  name: 'Corporate Blue',
  primary: '#2563EB',
  secondary: '#0F172A',
  accent: '#F97316',
  font: 'Inter',
  radius: '24px',
};

export const defaultSections: PageSection[] = [
  { id: 'hero-1', type: 'hero', variant: 'center', order: 1, visible: true, data: { badge: 'Delfi Event', title: 'Sự kiện chuyên nghiệp', subtitle: 'Tạo landing page sự kiện nhanh bằng template, theme và AI.', cta: 'Đăng ký tham dự' } },
  { id: 'about-1', type: 'about', variant: 'two-column', order: 2, visible: true, data: { title: 'Thông tin sự kiện', body: 'Trang landing page được dựng bằng section JSON và render bằng component chuẩn.' } },
  { id: 'agenda-1', type: 'agenda', variant: 'timeline', order: 3, visible: true, data: { title: 'Agenda', items: ['13:00 - Check-in', '14:00 - Keynote', '15:00 - Networking'] } },
  { id: 'form-1', type: 'form', variant: 'card', order: 4, visible: true, data: { title: 'Đăng ký tham dự' } },
  { id: 'footer-1', type: 'footer', variant: 'simple', order: 5, visible: true, data: { text: '© Delfi Event Studio' } },
];

export const defaultFormSchema: FormSchema = {
  title: 'Form đăng ký tham dự',
  mode: 'multi',
  steps: [
    { id: 'step-1', title: 'Thông tin cá nhân', fields: [
      { id: 'full_name', label: 'Họ và tên', name: 'full_name', type: 'text', required: true },
      { id: 'email', label: 'Email', name: 'email', type: 'email', required: true },
      { id: 'phone', label: 'Số điện thoại', name: 'phone', type: 'phone', required: true },
    ]},
    { id: 'step-2', title: 'Thông tin công ty', fields: [
      { id: 'company', label: 'Công ty / Đơn vị', name: 'company', type: 'text', required: false },
      { id: 'job_title', label: 'Chức vụ', name: 'job_title', type: 'text', required: false },
    ]},
  ],
};
