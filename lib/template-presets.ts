import { defaultTheme } from '@/lib/defaults';
import { PageSection, ThemeConfig } from '@/lib/types';

type TemplatePreset = {
  category: string;
  description: string;
  name: string;
  sections: PageSection[];
  theme: ThemeConfig;
};

function cloneSections(sections: PageSection[]) {
  return sections.map((section) => ({
    ...section,
    data: JSON.parse(JSON.stringify(section.data)),
  }));
}

export const templatePresets: TemplatePreset[] = [
  {
    name: 'Conference / Seminar',
    category: 'conference',
    description: 'For business conferences, industry forums, and speaker-led seminar pages.',
    theme: {
      ...defaultTheme,
      name: 'Conference / Seminar',
      primary: '#2563EB',
      secondary: '#0F172A',
      accent: '#F97316',
    },
    sections: cloneSections([
      {
        id: 'hero-1',
        type: 'hero',
        variant: 'center',
        order: 1,
        visible: true,
        data: {
          badge: 'Annual Business Forum',
          title: 'Future-ready conference experiences',
          subtitle: 'Bring together executive insights, keynote sessions, sponsor showcases, and registration in one polished event page.',
          cta: 'Reserve your seat',
        },
      },
      {
        id: 'about-1',
        type: 'about',
        variant: 'two-column',
        order: 2,
        visible: true,
        data: {
          title: 'Why this format works',
          body: 'This template is built for thought-leadership events with a clear hero, agenda overview, speaker lineup, and a direct registration path.',
        },
      },
      {
        id: 'speakers-1',
        type: 'speakers',
        variant: 'cards',
        order: 3,
        visible: true,
        data: {
          title: 'Featured speakers',
          items: [
            { name: 'Nguyen Minh Anh', position: 'CEO, Delfi Technology', avatar: '' },
            { name: 'Tran Bao Chau', position: 'Regional Partnerships Lead', avatar: '' },
            { name: 'Le Duc Huy', position: 'Innovation Strategist', avatar: '' },
          ],
        },
      },
      {
        id: 'agenda-1',
        type: 'agenda',
        variant: 'timeline',
        order: 4,
        visible: true,
        data: {
          title: 'Program highlights',
          items: [
            { time: '08:30', title: 'Registration & coffee', description: 'Early networking with delegates and sponsors.' },
            { time: '09:15', title: 'Opening keynote', description: 'Market outlook and digital transformation themes.' },
            { time: '10:30', title: 'Panel discussion', description: 'Cross-industry leaders share practical playbooks.' },
          ],
        },
      },
      {
        id: 'sponsors-1',
        type: 'sponsors',
        variant: 'grid',
        order: 5,
        visible: true,
        data: {
          title: 'Supporting partners',
          items: [
            { name: 'Delfi Solutions', tier: 'Host' },
            { name: 'Cloud Network', tier: 'Gold' },
            { name: 'Growth Media', tier: 'Silver' },
          ],
        },
      },
      {
        id: 'form-1',
        type: 'form',
        variant: 'card',
        order: 6,
        visible: true,
        data: {
          title: 'Register for the forum',
          description: 'Share your details to receive the event confirmation and attendee guide.',
          button_text: 'Register now',
        },
      },
      {
        id: 'footer-1',
        type: 'footer',
        variant: 'simple',
        order: 7,
        visible: true,
        data: {
          text: '© Conference / Seminar Template',
        },
      },
    ]),
  },
  {
    name: 'Medical Congress',
    category: 'medical',
    description: 'For healthcare congresses, CME events, and professional medical symposium pages.',
    theme: {
      ...defaultTheme,
      name: 'Medical Congress',
      primary: '#0F766E',
      secondary: '#164E63',
      accent: '#2563EB',
    },
    sections: cloneSections([
      {
        id: 'hero-1',
        type: 'hero',
        variant: 'center',
        order: 1,
        visible: true,
        data: {
          badge: 'Medical Congress 2026',
          title: 'Connect clinicians, experts, and innovation partners',
          subtitle: 'A trusted landing page structure for scientific programs, faculty highlights, and healthcare registration workflows.',
          cta: 'Join the congress',
        },
      },
      {
        id: 'about-1',
        type: 'about',
        variant: 'two-column',
        order: 2,
        visible: true,
        data: {
          title: 'Designed for professional healthcare events',
          body: 'Use this template to present scientific themes, faculty profiles, symposium schedules, venue details, and important attendee questions with clarity.',
        },
      },
      {
        id: 'agenda-1',
        type: 'agenda',
        variant: 'timeline',
        order: 3,
        visible: true,
        data: {
          title: 'Scientific agenda',
          items: [
            { time: '07:30', title: 'Check-in & badge pick-up', description: 'Delegate desk opens with welcome kit distribution.' },
            { time: '08:30', title: 'Clinical keynote', description: 'Opening lecture on evidence-based practice trends.' },
            { time: '10:00', title: 'Expert symposium', description: 'Case-based discussion with multidisciplinary panelists.' },
          ],
        },
      },
      {
        id: 'speakers-1',
        type: 'speakers',
        variant: 'cards',
        order: 4,
        visible: true,
        data: {
          title: 'Faculty members',
          items: [
            { name: 'Dr. Pham Khanh Linh', position: 'Cardiology Specialist', avatar: '' },
            { name: 'Assoc. Prof. Nguyen Thanh', position: 'Medical Affairs Lead', avatar: '' },
            { name: 'Dr. Hoang Bich', position: 'Healthcare Innovation Advisor', avatar: '' },
          ],
        },
      },
      {
        id: 'faq-1',
        type: 'faq',
        variant: 'accordion',
        order: 5,
        visible: true,
        data: {
          title: 'Attendee questions',
          items: [
            { question: 'Is CME accreditation available?', answer: 'You can adapt this section to describe CME points, certificates, and post-event follow-up.' },
            { question: 'Can industry partners register?', answer: 'Yes, the structure supports multiple attendee audiences and custom registration fields.' },
          ],
        },
      },
      {
        id: 'form-1',
        type: 'form',
        variant: 'card',
        order: 6,
        visible: true,
        data: {
          title: 'Medical congress registration',
          description: 'Collect participant data, specialty, organization, and other required details.',
          button_text: 'Submit registration',
        },
      },
      {
        id: 'footer-1',
        type: 'footer',
        variant: 'simple',
        order: 7,
        visible: true,
        data: {
          text: '© Medical Congress Template',
        },
      },
    ]),
  },
  {
    name: 'Product Launch',
    category: 'launch',
    description: 'For launch campaigns, demo events, and brand reveal landing pages.',
    theme: {
      ...defaultTheme,
      name: 'Product Launch',
      primary: '#EA580C',
      secondary: '#111827',
      accent: '#FDBA74',
    },
    sections: cloneSections([
      {
        id: 'hero-1',
        type: 'hero',
        variant: 'center',
        order: 1,
        visible: true,
        data: {
          badge: 'Launch Event',
          title: 'Turn your product debut into a high-energy story',
          subtitle: 'A launch-ready template with showcase blocks, feature moments, speaker teasers, and a fast registration CTA.',
          cta: 'Get launch access',
        },
      },
      {
        id: 'about-1',
        type: 'about',
        variant: 'two-column',
        order: 2,
        visible: true,
        data: {
          title: 'Built for momentum',
          body: 'Use this page to position the product promise, explain the reveal storyline, and drive signups for demos, livestreams, or launch-day sessions.',
        },
      },
      {
        id: 'agenda-1',
        type: 'agenda',
        variant: 'timeline',
        order: 3,
        visible: true,
        data: {
          title: 'Launch-day flow',
          items: [
            { time: '15:00', title: 'Pre-show networking', description: 'Warm-up content and welcome from the host.' },
            { time: '15:30', title: 'Product reveal', description: 'Showcase the big product announcement and story arc.' },
            { time: '16:00', title: 'Live demo', description: 'Walk through product highlights and real use cases.' },
          ],
        },
      },
      {
        id: 'speakers-1',
        type: 'speakers',
        variant: 'cards',
        order: 4,
        visible: true,
        data: {
          title: 'On-stage team',
          items: [
            { name: 'Bao Tran', position: 'Product Director', avatar: '' },
            { name: 'Minh Vu', position: 'Lead Designer', avatar: '' },
            { name: 'Quynh Le', position: 'Customer Success Lead', avatar: '' },
          ],
        },
      },
      {
        id: 'faq-1',
        type: 'faq',
        variant: 'accordion',
        order: 5,
        visible: true,
        data: {
          title: 'Launch FAQs',
          items: [
            { question: 'Will the session be recorded?', answer: 'Great for hybrid launches where attendees may want replay access and follow-up materials.' },
            { question: 'Can I request a private demo?', answer: 'You can add a follow-up CTA or custom registration field for private demo interest.' },
          ],
        },
      },
      {
        id: 'form-1',
        type: 'form',
        variant: 'card',
        order: 6,
        visible: true,
        data: {
          title: 'Request your seat',
          description: 'Capture launch attendees, waitlist demand, or partner invite responses.',
          button_text: 'Claim my spot',
        },
      },
      {
        id: 'footer-1',
        type: 'footer',
        variant: 'simple',
        order: 7,
        visible: true,
        data: {
          text: '© Product Launch Template',
        },
      },
    ]),
  },
  {
    name: 'Workshop / Training',
    category: 'workshop',
    description: 'For hands-on training sessions, classroom events, and cohort-based learning pages.',
    theme: {
      ...defaultTheme,
      name: 'Workshop / Training',
      primary: '#7C3AED',
      secondary: '#312E81',
      accent: '#22C55E',
    },
    sections: cloneSections([
      {
        id: 'hero-1',
        type: 'hero',
        variant: 'center',
        order: 1,
        visible: true,
        data: {
          badge: 'Workshop Series',
          title: 'A focused landing page for practical learning events',
          subtitle: 'Ideal for bootcamps, trainings, and workshop sessions that need a clear agenda, trainer intro, and quick signup flow.',
          cta: 'Reserve workshop seat',
        },
      },
      {
        id: 'about-1',
        type: 'about',
        variant: 'two-column',
        order: 2,
        visible: true,
        data: {
          title: 'Teach with clarity',
          body: 'This structure helps you explain audience level, learning outcomes, training format, and workshop expectations before registration.',
        },
      },
      {
        id: 'agenda-1',
        type: 'agenda',
        variant: 'timeline',
        order: 3,
        visible: true,
        data: {
          title: 'Learning agenda',
          items: [
            { time: '09:00', title: 'Warm-up session', description: 'Set context, outcomes, and participant expectations.' },
            { time: '10:00', title: 'Hands-on module', description: 'Break down core concepts with live exercises.' },
            { time: '13:30', title: 'Practice lab', description: 'Apply the methods in guided breakout groups.' },
          ],
        },
      },
      {
        id: 'speakers-1',
        type: 'speakers',
        variant: 'cards',
        order: 4,
        visible: true,
        data: {
          title: 'Trainers',
          items: [
            { name: 'Huong Do', position: 'Lead Facilitator', avatar: '' },
            { name: 'Tien Nguyen', position: 'Workshop Coach', avatar: '' },
          ],
        },
      },
      {
        id: 'faq-1',
        type: 'faq',
        variant: 'accordion',
        order: 5,
        visible: true,
        data: {
          title: 'Before you join',
          items: [
            { question: 'Do I need prior experience?', answer: 'Use this block to set participant level and required preparation clearly.' },
            { question: 'Will materials be shared?', answer: 'You can note workbook access, templates, slides, or post-session certificates here.' },
          ],
        },
      },
      {
        id: 'form-1',
        type: 'form',
        variant: 'card',
        order: 6,
        visible: true,
        data: {
          title: 'Join the workshop',
          description: 'Capture learner profile, team size, and training goals with a customizable registration form.',
          button_text: 'Register learner',
        },
      },
      {
        id: 'footer-1',
        type: 'footer',
        variant: 'simple',
        order: 7,
        visible: true,
        data: {
          text: '© Workshop / Training Template',
        },
      },
    ]),
  },
  {
    name: 'Gala Invitation',
    category: 'gala',
    description: 'For celebration events, gala dinners, appreciation nights, and invitation-led experiences.',
    theme: {
      ...defaultTheme,
      name: 'Gala Invitation',
      primary: '#B45309',
      secondary: '#111827',
      accent: '#F59E0B',
    },
    sections: cloneSections([
      {
        id: 'hero-1',
        type: 'hero',
        variant: 'center',
        order: 1,
        visible: true,
        data: {
          badge: 'Exclusive Invitation',
          title: 'Set the tone for a memorable gala night',
          subtitle: 'A warmer template for formal invitations, evening programs, guest information, and RSVP collection.',
          cta: 'Confirm attendance',
        },
      },
      {
        id: 'about-1',
        type: 'about',
        variant: 'two-column',
        order: 2,
        visible: true,
        data: {
          title: 'Made for premium guest journeys',
          body: 'Use this layout to announce your occasion, highlight the atmosphere, explain dress code or guest notes, and collect RSVPs elegantly.',
        },
      },
      {
        id: 'agenda-1',
        type: 'agenda',
        variant: 'timeline',
        order: 3,
        visible: true,
        data: {
          title: 'Evening timeline',
          items: [
            { time: '18:30', title: 'Welcome reception', description: 'Guest arrival, check-in, and photo opportunities.' },
            { time: '19:15', title: 'Dinner & stage program', description: 'Formal dinner service and celebration highlights.' },
            { time: '21:00', title: 'Networking & entertainment', description: 'Live band, recognition moments, and guest connection.' },
          ],
        },
      },
      {
        id: 'map-1',
        type: 'map',
        variant: 'simple',
        order: 4,
        visible: true,
        data: {
          location: 'Grand Ballroom, District 1, Ho Chi Minh City',
        },
      },
      {
        id: 'faq-1',
        type: 'faq',
        variant: 'accordion',
        order: 5,
        visible: true,
        data: {
          title: 'Guest notes',
          items: [
            { question: 'Is there a dress code?', answer: 'Perfect for sharing black-tie, formal, or thematic attire guidance.' },
            { question: 'Can I bring a guest?', answer: 'Use this section to explain RSVP policy, plus-one rules, and invitation terms.' },
          ],
        },
      },
      {
        id: 'form-1',
        type: 'form',
        variant: 'card',
        order: 6,
        visible: true,
        data: {
          title: 'RSVP for the gala',
          description: 'Collect attendance confirmation, meal preference, and guest notes in a polished invitation flow.',
          button_text: 'Send RSVP',
        },
      },
      {
        id: 'footer-1',
        type: 'footer',
        variant: 'simple',
        order: 7,
        visible: true,
        data: {
          text: '© Gala Invitation Template',
        },
      },
    ]),
  },
];

export function findTemplatePresetByName(name: string) {
  return templatePresets.find((preset) => preset.name === name);
}
