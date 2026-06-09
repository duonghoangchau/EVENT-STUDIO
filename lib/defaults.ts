import { FormSchema, PageSection, ThemeConfig } from '@/lib/types';

function text(vi: string, en: string) {
  return { vi, en };
}

export const defaultTheme: ThemeConfig = {
  name: 'Corporate Blue',
  primary: '#2563EB',
  secondary: '#0F172A',
  accent: '#F97316',
  font: 'Inter',
  radius: '24px',
};

export const defaultSections: PageSection[] = [
  {
    id: 'hero-1',
    type: 'hero',
    variant: 'center',
    order: 1,
    visible: true,
    data: {
      badge: text('Sự kiện Delfi', 'Delfi Event'),
      title: text('Sự kiện chuyên nghiệp', 'Professional event landing page'),
      subtitle: text('Tạo landing page sự kiện nhanh bằng template và giao diện có sẵn.', 'Launch an event page quickly with ready-made templates and visual themes.'),
      cta: text('Đăng ký tham dự', 'Register now'),
      secondary_cta: text('Xem chương trình', 'See agenda'),
      show_badge: true,
      show_title: true,
      show_subtitle: true,
      show_primary_cta: true,
      show_secondary_cta: true,
    },
  },
  {
    id: 'about-1',
    type: 'about',
    variant: 'two-column',
    order: 2,
    visible: true,
    data: {
      title: text('Tổng quan sự kiện', 'About the event'),
      body: text('Trang landing page được dựng bằng section JSON và render bằng component chuẩn.', 'This landing page is built from structured sections and rendered through reusable components.'),
    },
  },
  {
    id: 'agenda-1',
    type: 'agenda',
    variant: 'timeline',
    order: 3,
    visible: true,
    data: {
      title: text('Lịch trình', 'Agenda'),
      items: [
        { time: '13:00', title: text('Đón khách', 'Check-in'), description: text('Đăng ký và nhận tài liệu.', 'Registration and welcome materials.') },
        { time: '14:00', title: text('Khai mạc', 'Opening keynote'), description: text('Phần mở đầu và định hướng chương trình.', 'Opening remarks and event direction.') },
        { time: '15:00', title: text('Kết nối', 'Networking'), description: text('Gặp gỡ và trao đổi với khách mời.', 'Meet and connect with attendees.') },
      ],
    },
  },
  {
    id: 'form-1',
    type: 'form',
    variant: 'card',
    order: 4,
    visible: true,
    data: {
      title: text('Đăng ký tham dự', 'Register for the event'),
      description: text('Điền thông tin để xác nhận tham dự.', 'Fill in your details to confirm attendance.'),
      button_text: text('Mở form đăng ký', 'Open registration form'),
    },
  },
  {
    id: 'footer-1',
    type: 'footer',
    variant: 'simple',
    order: 5,
    visible: true,
    data: {
      text: text('© Delfi Event Studio', '© Delfi Event Studio'),
    },
  },
];

export const defaultFormSchema: FormSchema = {
  title: text('Form đăng ký tham dự', 'Registration Form'),
  mode: 'multi',
  steps: [
    {
      id: 'step-1',
      title: text('Thông tin cá nhân', 'Personal information'),
      fields: [
        {
          id: 'full_name',
          label: text('Họ và tên', 'Full name'),
          name: 'full_name',
          type: 'text',
          required: true,
          placeholder: text('Họ và tên', 'Full name'),
        },
        {
          id: 'email',
          label: text('Email', 'Email'),
          name: 'email',
          type: 'email',
          required: true,
          placeholder: text('Email', 'Email'),
        },
        {
          id: 'phone',
          label: text('Số điện thoại', 'Phone number'),
          name: 'phone',
          type: 'phone',
          required: true,
          placeholder: text('Số điện thoại', 'Phone number'),
        },
      ],
    },
    {
      id: 'step-2',
      title: text('Thông tin công ty', 'Company information'),
      fields: [
        {
          id: 'company',
          label: text('Công ty / Đơn vị', 'Company / Organization'),
          name: 'company',
          type: 'text',
          required: false,
          placeholder: text('Công ty / Đơn vị', 'Company / Organization'),
        },
        {
          id: 'job_title',
          label: text('Chức vụ', 'Job title'),
          name: 'job_title',
          type: 'text',
          required: false,
          placeholder: text('Chức vụ', 'Job title'),
        },
      ],
    },
  ],
};
