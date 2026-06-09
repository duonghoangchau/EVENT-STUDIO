export const PREFERENCE_LANGUAGES = ['vi', 'en'] as const;
export const PREFERENCE_THEMES = ['light', 'dark'] as const;

export type PreferenceLanguage = (typeof PREFERENCE_LANGUAGES)[number];
export type PreferenceTheme = (typeof PREFERENCE_THEMES)[number];

export type LocalizedText = string | { vi?: string; en?: string };

export const DEFAULT_LANGUAGE: PreferenceLanguage = 'vi';
export const DEFAULT_THEME: PreferenceTheme = 'light';

export const PREFERENCE_COOKIE_KEYS = {
  language: 'delfi_language',
  theme: 'delfi_theme',
} as const;

type TranslationKey =
  | 'dashboard'
  | 'projects'
  | 'templates'
  | 'assets'
  | 'settings'
  | 'signOut'
  | 'language'
  | 'theme'
  | 'vietnamese'
  | 'english'
  | 'lightMode'
  | 'darkMode'
  | 'pageBuilder'
  | 'savePage'
  | 'addSection'
  | 'sectionQueue'
  | 'blocksOnPage'
  | 'showOnPublicPage'
  | 'hiddenFromPublicPage'
  | 'editBlockHint'
  | 'moveUp'
  | 'moveDown'
  | 'remove'
  | 'removeItem'
  | 'sectionId'
  | 'variant'
  | 'advancedJsonPreview'
  | 'livePreview'
  | 'openPreview'
  | 'backToProjects'
  | 'publicSite'
  | 'preview'
  | 'projectWorkspace'
  | 'workflowHint'
  | 'previous'
  | 'next'
  | 'overview'
  | 'builder'
  | 'forms'
  | 'submissions'
  | 'loginTitle'
  | 'loginSubtitle'
  | 'loginButton'
  | 'email'
  | 'password'
  | 'adminAccess'
  | 'missingCredentials'
  | 'invalidCredentials'
  | 'loginFailed'
  | 'publicVisitorsHint'
  | 'internalTool'
  | 'dashboardSummary'
  | 'createProject'
  | 'mvpFlow'
  | 'registration'
  | 'fillRegistrationInfo'
  | 'openRegistrationForm'
  | 'chooseValue'
  | 'submitRegistration'
  | 'registrationSuccess'
  | 'registrationSaved'
  | 'backToHome'
  | 'hero'
  | 'about'
  | 'agenda'
  | 'speakers'
  | 'sponsors'
  | 'form'
  | 'faq'
  | 'map'
  | 'footer'
  | 'badge'
  | 'title'
  | 'subtitle'
  | 'primaryCta'
  | 'secondaryCta'
  | 'body'
  | 'description'
  | 'buttonText'
  | 'location'
  | 'time'
  | 'name'
  | 'position'
  | 'avatarUrl'
  | 'tier'
  | 'question'
  | 'answer'
  | 'footerText'
  | 'addAgendaItem'
  | 'addSpeaker'
  | 'addSponsor'
  | 'addFaqItem'
  | 'addField'
  | 'addStep'
  | 'removeField'
  | 'removeStep'
  | 'saveSchema'
  | 'formBuilder'
  | 'formBuilderSummary'
  | 'openPublicForm'
  | 'formTitle'
  | 'mode'
  | 'multiStep'
  | 'singleStep'
  | 'stepTitle'
  | 'stepId'
  | 'label'
  | 'fieldName'
  | 'fieldType'
  | 'fieldId'
  | 'placeholder'
  | 'required'
  | 'optionsOnePerLine'
  | 'jsonPreview'
  | 'addSectionPlaceholder'
  | 'event'
  | 'eventLandingPage'
  | 'eventInfo'
  | 'registerNow'
  | 'aboutEvent'
  | 'featuredSpeakers'
  | 'guestSpeaker'
  | 'venue'
  | 'faqTitle'
  | 'faqFallbackAnswer'
  | 'venueFallback'
  | 'speakerFallback'
  | 'sponsorFallback'
  | 'agendaItemFallback'
  | 'questionFallback'
  | 'projectsDescription'
  | 'newProject'
  | 'submissionsLabel'
  | 'formsLabel';

const TRANSLATIONS: Record<PreferenceLanguage, Record<TranslationKey, string>> = {
  vi: {
    dashboard: 'Tổng quan',
    projects: 'Dự án',
    templates: 'Mẫu giao diện',
    assets: 'Tài nguyên',
    settings: 'Cấu hình',
    signOut: 'Đăng xuất',
    language: 'Ngôn ngữ',
    theme: 'Giao diện',
    vietnamese: 'Vietnamese',
    english: 'English',
    lightMode: 'Sáng',
    darkMode: 'Tối',
    pageBuilder: 'Page Builder',
    savePage: 'Lưu trang',
    addSection: 'Thêm section',
    sectionQueue: 'Danh sách section',
    blocksOnPage: 'block trên trang',
    showOnPublicPage: 'Hiển thị trên trang public',
    hiddenFromPublicPage: 'Đăng án trên trang public',
    editBlockHint: 'Chỉnh sửa section này trong khi các section còn lại vẫn nằm gọn trong danh sách.',
    moveUp: 'Lên trên',
    moveDown: 'Xuống dưới',
    remove: 'Xóa',
    removeItem: 'Xóa item',
    sectionId: 'Section id',
    variant: 'Kiểu hiển thị',
    advancedJsonPreview: 'Xem JSON nâng cao',
    livePreview: 'Xem trước trực tiếp',
    openPreview: 'Mở preview',
    backToProjects: 'Về danh sách dự án',
    publicSite: 'Trang public',
    preview: 'Preview',
    projectWorkspace: 'Không gian dự án',
    workflowHint: 'Dung Previous/Next de di qua cac buoc chinh ma khong can quay lai menu lon.',
    previous: 'Trước',
    next: 'Tiếp',
    overview: 'Tổng quan',
    builder: 'Builder',
    forms: 'Form',
    submissions: 'Đăng ký',
    loginTitle: 'Đăng nhập admin',
    loginSubtitle: 'Sử dụng tài khoản admin đã được seed vào hệ thống.',
    loginButton: 'Đăng nhập',
    email: 'Email',
    password: 'Mật khẩu',
    adminAccess: 'Truy cập admin',
    missingCredentials: 'Vui lòng nhập đầy đủ email và mật khẩu.',
    invalidCredentials: 'Email hoặc mật khẩu không đúng.',
    loginFailed: 'Không thể đăng nhập, Vui lòng thử lại.',
    publicVisitorsHint: 'Người dùng public chỉ cần truy cập URL sự kiện và form đăng ký.',
    internalTool: 'Công cụ nội bộ MVP',
    dashboardSummary: 'Tạo landing page sự kiện, form đăng ký multi-step, preview và export theo hướng JSON schema-driven.',
    createProject: 'Tạo dự án mới',
    mvpFlow: 'Luong MVP',
    registration: 'Đăng ký tham dự',
    fillRegistrationInfo: 'Điền thông tin để xác nhận tham dự.',
    openRegistrationForm: 'Mở fomr đăng ký',
    chooseValue: 'Chọn một giá trị',
    submitRegistration: 'Gửi đăng ký',
    registrationSuccess: 'Đăng ký thành công',
    registrationSaved: 'Thông tin của bạn đã được ghi nhận.',
    backToHome: 'Về trang chủ',
    hero: 'Hero',
    about: 'Tổng quan',
    agenda: 'Lịch trình',
    speakers: 'Diễn giả',
    sponsors: 'Nhà tài trợ',
    form: 'Form đăng ký',
    faq: 'FAQ',
    map: 'Bản đồ',
    footer: 'Chân trang',
    badge: 'Badge',
    title: 'Tiêu đề',
    subtitle: 'Mô tả ngắn',
    primaryCta: 'CTA chính',
    secondaryCta: 'CTA phụ',
    body: 'Nội dung',
    description: 'Mô tả',
    buttonText: 'Noi dung nut',
    location: 'Địa điểm',
    time: 'Thời gian',
    name: 'Tên',
    position: 'Chức danh',
    avatarUrl: 'Avatar URL',
    tier: 'Hạng mục',
    question: 'Câu hỏi',
    answer: 'Trả lời',
    footerText: 'Nội dung chân trang',
    addAgendaItem: 'Thêm mục lịch trình',
    addSpeaker: 'Thêm diễn giả',
    addSponsor: 'Thêm nhà tài trợ',
    addFaqItem: 'Thêm câu hỏi FAQ',
    addField: 'Thêm trường',
    addStep: 'Thêm bước',
    removeField: 'Xóa trường',
    removeStep: 'Xóa bước',
    saveSchema: 'Lưu schema',
    formBuilder: 'Form Builder',
    formBuilderSummary: 'Tùy chỉnh step, field, options và cách thu thập thông tin đăng ký.',
    openPublicForm: 'Mở form public',
    formTitle: 'Tiêu đề form',
    mode: 'Chế độ',
    multiStep: 'Nhiều bước',
    singleStep: 'Một bước',
    stepTitle: 'Tiêu đề bước',
    stepId: 'Step ID',
    label: 'Nhãn',
    fieldName: 'Tên trường',
    fieldType: 'Loại trường',
    fieldId: 'Field ID',
    placeholder: 'Placeholder',
    required: 'Bắt buộc',
    optionsOnePerLine: 'Lựa chọn, mỗi dòng một giá trị',
    jsonPreview: 'Xem JSON',
    addSectionPlaceholder: 'Thêm section từ thư viện để bắt đầu dựng trang.',
    event: 'Sự kiện',
    eventLandingPage: 'Landing page sự kiện',
    eventInfo: 'Thông tin sự kiện',
    registerNow: 'Đăng ký ngay',
    aboutEvent: 'Thông tin sự kiện',
    featuredSpeakers: 'Diễn giả nổi bật',
    guestSpeaker: 'Diễn giả khách mời',
    venue: 'Địa điểm',
    faqTitle: 'Câu hỏi thường gặp',
    faqFallbackAnswer: 'Thông tin sẽ được cập nhật bởi ban tổ chức.',
    venueFallback: 'Thành phố Hồ Chí Minh',
    speakerFallback: 'Diễn giả',
    sponsorFallback: 'Nhà tài trợ',
    agendaItemFallback: 'Nội dung lịch trình',
    questionFallback: 'Câu hỏi',
    projectsDescription: 'Danh sách Event Landing Page.',
    newProject: 'Tạo mới',
    submissionsLabel: 'Đăng ký',
    formsLabel: 'Biểu mẫu',
  },
  en: {
    dashboard: 'Dashboard',
    projects: 'Projects',
    templates: 'Templates',
    assets: 'Assets',
    settings: 'Settings',
    signOut: 'Sign out',
    language: 'Language',
    theme: 'Theme',
    vietnamese: 'Vietnamese',
    english: 'English',
    lightMode: 'Light',
    darkMode: 'Dark',
    pageBuilder: 'Page Builder',
    savePage: 'Save page',
    addSection: 'Add section',
    sectionQueue: 'Section queue',
    blocksOnPage: 'blocks on page',
    showOnPublicPage: 'Show on public page',
    hiddenFromPublicPage: 'Hidden from public page',
    editBlockHint: 'Edit this block while the rest of the page stays compact in the queue.',
    moveUp: 'Move up',
    moveDown: 'Move down',
    remove: 'Remove',
    removeItem: 'Remove item',
    sectionId: 'Section id',
    variant: 'Variant',
    advancedJsonPreview: 'Advanced JSON preview',
    livePreview: 'Live Preview',
    openPreview: 'Open Preview',
    backToProjects: 'Back to Projects',
    publicSite: 'Public Site',
    preview: 'Preview',
    projectWorkspace: 'Project workspace',
    workflowHint: 'Use Previous/Next to move through the project workflow without jumping back to the main menu.',
    previous: 'Previous',
    next: 'Next',
    overview: 'Overview',
    builder: 'Builder',
    forms: 'Forms',
    submissions: 'Submissions',
    loginTitle: 'Admin sign in',
    loginSubtitle: 'Use the admin account seeded into the system.',
    loginButton: 'Sign in',
    email: 'Email',
    password: 'Password',
    adminAccess: 'Admin access',
    missingCredentials: 'Please enter both email and password.',
    invalidCredentials: 'Incorrect email or password.',
    loginFailed: 'Unable to sign in. Please try again.',
    publicVisitorsHint: 'Public visitors should only use event URLs and registration forms.',
    internalTool: 'Internal Tool MVP',
    dashboardSummary: 'Build event landing pages, registration forms, previews, and exports with a JSON schema-driven workflow.',
    createProject: 'Create project',
    mvpFlow: 'MVP flow',
    registration: 'Registration',
    fillRegistrationInfo: 'Fill in your details to confirm attendance.',
    openRegistrationForm: 'Open registration form',
    chooseValue: 'Choose a value',
    submitRegistration: 'Submit registration',
    registrationSuccess: 'Registration successful',
    registrationSaved: 'Your information has been recorded.',
    backToHome: 'Back to home',
    hero: 'Hero',
    about: 'About',
    agenda: 'Agenda',
    speakers: 'Speakers',
    sponsors: 'Sponsors',
    form: 'Registration Form',
    faq: 'FAQ',
    map: 'Map',
    footer: 'Footer',
    badge: 'Badge',
    title: 'Title',
    subtitle: 'Subtitle',
    primaryCta: 'Primary CTA',
    secondaryCta: 'Secondary CTA',
    body: 'Body',
    description: 'Description',
    buttonText: 'Button text',
    location: 'Location',
    time: 'Time',
    name: 'Name',
    position: 'Position',
    avatarUrl: 'Avatar URL',
    tier: 'Tier',
    question: 'Question',
    answer: 'Answer',
    footerText: 'Footer text',
    addAgendaItem: 'Add agenda item',
    addSpeaker: 'Add speaker',
    addSponsor: 'Add sponsor',
    addFaqItem: 'Add FAQ item',
    addField: 'Add field',
    addStep: 'Add step',
    removeField: 'Remove field',
    removeStep: 'Remove step',
    saveSchema: 'Save schema',
    formBuilder: 'Form Builder',
    formBuilderSummary: 'Customize steps, fields, options, and how registration data is collected.',
    openPublicForm: 'Open public form',
    formTitle: 'Form title',
    mode: 'Mode',
    multiStep: 'Multi-step',
    singleStep: 'Single-step',
    stepTitle: 'Step title',
    stepId: 'Step id',
    label: 'Label',
    fieldName: 'Name',
    fieldType: 'Field type',
    fieldId: 'Field id',
    placeholder: 'Placeholder',
    required: 'Required',
    optionsOnePerLine: 'Options (one per line)',
    jsonPreview: 'JSON preview',
    addSectionPlaceholder: 'Add a section from the library to start building the page.',
    event: 'Event',
    eventLandingPage: 'Event Landing Page',
    eventInfo: 'Event information',
    registerNow: 'Register now',
    aboutEvent: 'About the event',
    featuredSpeakers: 'Featured speakers',
    guestSpeaker: 'Guest speaker',
    venue: 'Venue',
    faqTitle: 'FAQ',
    faqFallbackAnswer: 'Details will be shared by the organizer.',
    venueFallback: 'Ho Chi Minh City',
    speakerFallback: 'Speaker',
    sponsorFallback: 'Sponsor',
    agendaItemFallback: 'Agenda item',
    questionFallback: 'Question',
    projectsDescription: 'List of event landing page projects.',
    newProject: 'Create new',
    submissionsLabel: 'submissions',
    formsLabel: 'forms',
  },
};

export function isPreferenceLanguage(value: unknown): value is PreferenceLanguage {
  return typeof value === 'string' && PREFERENCE_LANGUAGES.includes(value as PreferenceLanguage);
}

export function isPreferenceTheme(value: unknown): value is PreferenceTheme {
  return typeof value === 'string' && PREFERENCE_THEMES.includes(value as PreferenceTheme);
}

export function getPreferenceLanguage(value: unknown, fallback: PreferenceLanguage = DEFAULT_LANGUAGE) {
  return isPreferenceLanguage(value) ? value : fallback;
}

export function getPreferenceTheme(value: unknown, fallback: PreferenceTheme = DEFAULT_THEME) {
  return isPreferenceTheme(value) ? value : fallback;
}

export function t(language: PreferenceLanguage, key: TranslationKey) {
  return TRANSLATIONS[language][key] || TRANSLATIONS[DEFAULT_LANGUAGE][key];
}

export function resolveLocalizedText(value: unknown, language: PreferenceLanguage, fallback = ''): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);

  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const localized = value as { vi?: unknown; en?: unknown };
    const preferred = localized[language];
    if (typeof preferred === 'string' && preferred.trim()) return preferred;
    const alternate = language === 'vi' ? localized.en : localized.vi;
    if (typeof alternate === 'string' && alternate.trim()) return alternate;
  }

  return fallback;
}

export function toEditableText(value: unknown, language: PreferenceLanguage, fallback = '') {
  return resolveLocalizedText(value, language, fallback);
}

export function sectionTypeLabel(type: string, language: PreferenceLanguage) {
  if (type in TRANSLATIONS[language]) {
    return t(language, type as TranslationKey);
  }

  return type;
}
