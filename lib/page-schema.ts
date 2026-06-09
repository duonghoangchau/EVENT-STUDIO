import { z } from 'zod';
import { PAGE_SECTION_TYPES, PageJson, PageSection, SectionType } from '@/lib/types';

const sectionTypeSchema = z.enum(PAGE_SECTION_TYPES);
export const SINGLE_INSTANCE_SECTION_TYPES: SectionType[] = ['hero', 'form', 'footer', 'map'];
const singleInstanceSectionTypeSet = new Set<SectionType>(SINGLE_INSTANCE_SECTION_TYPES);

export const SECTION_VARIANTS: Record<SectionType, string[]> = {
  hero: ['center', 'fullscreen', 'split'],
  about: ['two-column', 'stacked'],
  agenda: ['timeline', 'cards', 'compact'],
  speakers: ['cards', 'grid', 'spotlight'],
  sponsors: ['grid', 'logo-strip', 'tiers'],
  form: ['card', 'split', 'minimal'],
  faq: ['accordion', 'list'],
  map: ['simple', 'card'],
  footer: ['simple', 'dark', 'columns'],
};

const pageSectionSchema = z.object({
  id: z.string().min(1),
  type: sectionTypeSchema,
  variant: z.string().default('default'),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
  data: z.record(z.string(), z.unknown()).default({}),
});

const pageJsonSchema = z.object({
  sections: z.array(pageSectionSchema).default([]),
});

function text(vi: string, en: string) {
  return { vi, en };
}

export const SECTION_LIBRARY: Record<SectionType, { label: string; template: PageSection }> = {
  hero: {
    label: 'Hero',
    template: {
      id: 'hero',
      type: 'hero',
      variant: 'center',
      order: 1,
      visible: true,
      data: {
        badge: text('Sự kiện nổi bật', 'Featured event'),
        title: text('Landing page sự kiện chuyên nghiệp', 'Professional event landing page'),
        subtitle: text(
          'Giới thiệu hội nghị, roadshow hoặc sự kiện thường niên với ấn tượng đầu tiên rõ ràng.',
          'Introduce your conference, roadshow, or annual summit with a clear first impression.'
        ),
        cta: text('Đăng ký ngay', 'Register now'),
        secondary_cta: text('Xem thêm', 'Learn more'),
        show_badge: true,
        show_title: true,
        show_subtitle: true,
        show_primary_cta: true,
        show_secondary_cta: true,
      },
    },
  },
  about: {
    label: 'About',
    template: {
      id: 'about',
      type: 'about',
      variant: 'two-column',
      order: 1,
      visible: true,
      data: {
        title: text('Tổng quan sự kiện', 'About the event'),
        body: text(
          'Dùng khối này để mô tả câu chuyện sự kiện, giá trị nổi bật và nhóm khách mời phù hợp.',
          'Use this block to explain the event story, value proposition, and audience fit.'
        ),
      },
    },
  },
  agenda: {
    label: 'Agenda',
    template: {
      id: 'agenda',
      type: 'agenda',
      variant: 'timeline',
      order: 1,
      visible: true,
      data: {
        title: text('Lịch trình', 'Agenda'),
        items: [
          { time: '13:00', title: text('Đón khách', 'Check-in'), description: text('Đón tiếp khách mời và dùng cà phê nhẹ.', 'Guest reception and welcome coffee.') },
          { time: '14:00', title: text('Phát biểu khai mạc', 'Opening keynote'), description: text('Tầm nhìn, chiến lược và phần mở đầu chương trình.', 'Vision, strategy, and event opening.') },
        ],
      },
    },
  },
  speakers: {
    label: 'Speakers',
    template: {
      id: 'speakers',
      type: 'speakers',
      variant: 'cards',
      order: 1,
      visible: true,
      data: {
        title: text('Diễn giả nổi bật', 'Featured speakers'),
        items: [
          { name: text('Tên diễn giả', 'Speaker name'), position: text('Chức danh hoặc tổ chức', 'Title or organization'), avatar: '' },
          { name: text('Chuyên gia khách mời', 'Guest expert'), position: text('Thành viên thảo luận', 'Panelist'), avatar: '' },
        ],
      },
    },
  },
  sponsors: {
    label: 'Sponsors',
    template: {
      id: 'sponsors',
      type: 'sponsors',
      variant: 'grid',
      order: 1,
      visible: true,
      data: {
        title: text('Nhà tài trợ', 'Sponsors'),
        items: [
          { name: text('Nhà tài trợ Một', 'Sponsor One'), tier: text('Vàng', 'Gold') },
          { name: text('Nhà tài trợ Hai', 'Sponsor Two'), tier: text('Bạc', 'Silver') },
        ],
      },
    },
  },
  form: {
    label: 'Registration Form',
    template: {
      id: 'form',
      type: 'form',
      variant: 'card',
      order: 1,
      visible: true,
      data: {
        title: text('Đăng ký tham dự', 'Register for the event'),
        description: text('Điền thông tin để xác nhận tham dự.', 'Fill in your details to confirm attendance.'),
        button_text: text('Mở form đăng ký', 'Open registration form'),
      },
    },
  },
  faq: {
    label: 'FAQ',
    template: {
      id: 'faq',
      type: 'faq',
      variant: 'accordion',
      order: 1,
      visible: true,
      data: {
        title: text('Câu hỏi thường gặp', 'FAQ'),
        items: [
          { question: text('Sự kiện diễn ra ở đâu?', 'Where is the event held?'), answer: text('Thông tin địa điểm sẽ được ban tổ chức cập nhật.', 'Venue details will be shared by the organizer.') },
          { question: text('Tôi có nhận email xác nhận không?', 'Will I receive a confirmation email?'), answer: text('Có, hệ thống sẽ ghi nhận đăng ký sau khi bạn gửi form.', 'Yes, the system records your submission after registration.') },
        ],
      },
    },
  },
  map: {
    label: 'Map',
    template: {
      id: 'map',
      type: 'map',
      variant: 'simple',
      order: 1,
      visible: true,
      data: {
        location: text('Thành phố Hồ Chí Minh', 'Ho Chi Minh City'),
      },
    },
  },
  footer: {
    label: 'Footer',
    template: {
      id: 'footer',
      type: 'footer',
      variant: 'simple',
      order: 1,
      visible: true,
      data: {
        text: text('© Delfi Event Studio', '© Delfi Event Studio'),
      },
    },
  },
};

function slugifyPart(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function cloneSection(section: PageSection): PageSection {
  return {
    ...section,
    data: JSON.parse(JSON.stringify(section.data)),
  };
}

export function createSection(type: SectionType, order: number) {
  const template = cloneSection(SECTION_LIBRARY[type].template);
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return {
    ...template,
    id: `${slugifyPart(type)}-${suffix}`,
    order,
  };
}

export function normalizePageJson(value: unknown): PageJson {
  const parsed = pageJsonSchema.parse(value);
  const usedTypes = new Set<SectionType>();
  const usedIds = new Set<string>();
  const sections: PageSection[] = [];

  parsed.sections
    .sort((a, b) => a.order - b.order)
    .forEach((section, index) => {
      if (singleInstanceSectionTypeSet.has(section.type) && usedTypes.has(section.type)) return;

      const fallback = SECTION_LIBRARY[section.type].template;
      let id = section.id || `${section.type}-${index + 1}`;

      if (usedIds.has(id)) {
        let duplicateIndex = 2;
        while (usedIds.has(`${id}-${duplicateIndex}`)) duplicateIndex += 1;
        id = `${id}-${duplicateIndex}`;
      }

      usedIds.add(id);
      usedTypes.add(section.type);

      sections.push({
        ...cloneSection(fallback),
        ...section,
        id,
        variant: SECTION_VARIANTS[section.type].includes(section.variant) ? section.variant : fallback.variant,
        order: typeof section.order === 'number' ? section.order : index + 1,
        visible: typeof section.visible === 'boolean' ? section.visible : true,
        data: section.data || {},
      });
    });

  return {
    sections: sections
      .sort((a, b) => a.order - b.order)
      .map((section, index) => ({
        ...section,
        order: index + 1,
      })),
  };
}
