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
        badge: 'Featured event',
        title: 'Professional event landing page',
        subtitle: 'Introduce your conference, roadshow, or annual summit with a clear first impression.',
        cta: 'Register now',
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
        title: 'About the event',
        body: 'Use this block to explain the event story, value proposition, and audience fit.',
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
        title: 'Agenda',
        items: [
          { time: '13:00', title: 'Check-in', description: 'Guest reception and welcome coffee.' },
          { time: '14:00', title: 'Opening keynote', description: 'Vision, strategy, and event opening.' },
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
        title: 'Featured speakers',
        items: [
          { name: 'Speaker name', position: 'Title or organization', avatar: '' },
          { name: 'Guest expert', position: 'Panelist', avatar: '' },
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
        title: 'Sponsors',
        items: [
          { name: 'Sponsor One', tier: 'Gold' },
          { name: 'Sponsor Two', tier: 'Silver' },
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
        title: 'Register for the event',
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
        items: [
          { question: 'Where is the event held?', answer: 'Venue details will be shared by the organizer.' },
          { question: 'Will I receive a confirmation email?', answer: 'Yes, the system records your submission after registration.' },
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
        location: 'Ho Chi Minh City',
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
        text: '© Delfi Event Studio',
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
