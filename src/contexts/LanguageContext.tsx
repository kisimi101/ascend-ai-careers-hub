import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 180+ languages with their native names
export const languages = {
  en: { name: 'English', native: 'English' },
  es: { name: 'Spanish', native: 'Español' },
  fr: { name: 'French', native: 'Français' },
  de: { name: 'German', native: 'Deutsch' },
  it: { name: 'Italian', native: 'Italiano' },
  pt: { name: 'Portuguese', native: 'Português' },
  ru: { name: 'Russian', native: 'Русский' },
  zh: { name: 'Chinese (Simplified)', native: '中文(简体)' },
  'zh-TW': { name: 'Chinese (Traditional)', native: '中文(繁體)' },
  ja: { name: 'Japanese', native: '日本語' },
  ko: { name: 'Korean', native: '한국어' },
  ar: { name: 'Arabic', native: 'العربية' },
  hi: { name: 'Hindi', native: 'हिन्दी' },
  bn: { name: 'Bengali', native: 'বাংলা' },
  pa: { name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  ur: { name: 'Urdu', native: 'اردو' },
  vi: { name: 'Vietnamese', native: 'Tiếng Việt' },
  th: { name: 'Thai', native: 'ไทย' },
  id: { name: 'Indonesian', native: 'Bahasa Indonesia' },
  ms: { name: 'Malay', native: 'Bahasa Melayu' },
  tl: { name: 'Filipino', native: 'Filipino' },
  tr: { name: 'Turkish', native: 'Türkçe' },
  pl: { name: 'Polish', native: 'Polski' },
  uk: { name: 'Ukrainian', native: 'Українська' },
  nl: { name: 'Dutch', native: 'Nederlands' },
  sv: { name: 'Swedish', native: 'Svenska' },
  no: { name: 'Norwegian', native: 'Norsk' },
  da: { name: 'Danish', native: 'Dansk' },
  fi: { name: 'Finnish', native: 'Suomi' },
  el: { name: 'Greek', native: 'Ελληνικά' },
  he: { name: 'Hebrew', native: 'עברית' },
  cs: { name: 'Czech', native: 'Čeština' },
  sk: { name: 'Slovak', native: 'Slovenčina' },
  ro: { name: 'Romanian', native: 'Română' },
  hu: { name: 'Hungarian', native: 'Magyar' },
  bg: { name: 'Bulgarian', native: 'Български' },
  hr: { name: 'Croatian', native: 'Hrvatski' },
  sr: { name: 'Serbian', native: 'Српски' },
  sl: { name: 'Slovenian', native: 'Slovenščina' },
  et: { name: 'Estonian', native: 'Eesti' },
  lv: { name: 'Latvian', native: 'Latviešu' },
  lt: { name: 'Lithuanian', native: 'Lietuvių' },
  fa: { name: 'Persian', native: 'فارسی' },
  sw: { name: 'Swahili', native: 'Kiswahili' },
  am: { name: 'Amharic', native: 'አማርኛ' },
  ha: { name: 'Hausa', native: 'Hausa' },
  yo: { name: 'Yoruba', native: 'Yorùbá' },
  ig: { name: 'Igbo', native: 'Igbo' },
  zu: { name: 'Zulu', native: 'isiZulu' },
  xh: { name: 'Xhosa', native: 'isiXhosa' },
  af: { name: 'Afrikaans', native: 'Afrikaans' },
  ta: { name: 'Tamil', native: 'தமிழ்' },
  te: { name: 'Telugu', native: 'తెలుగు' },
  kn: { name: 'Kannada', native: 'ಕನ್ನಡ' },
  ml: { name: 'Malayalam', native: 'മലയാളം' },
  mr: { name: 'Marathi', native: 'मराठी' },
  gu: { name: 'Gujarati', native: 'ગુજરાતી' },
  or: { name: 'Odia', native: 'ଓଡ଼ିଆ' },
  ne: { name: 'Nepali', native: 'नेपाली' },
  si: { name: 'Sinhala', native: 'සිංහල' },
  my: { name: 'Burmese', native: 'မြန်မာဘာသာ' },
  km: { name: 'Khmer', native: 'ភាសាខ្មែរ' },
  lo: { name: 'Lao', native: 'ລາວ' },
  mn: { name: 'Mongolian', native: 'Монгол' },
  ka: { name: 'Georgian', native: 'ქართული' },
  hy: { name: 'Armenian', native: 'Հայերdelays' },
  az: { name: 'Azerbaijani', native: 'Azərbaycan' },
  uz: { name: 'Uzbek', native: "O'zbek" },
  kk: { name: 'Kazakh', native: 'Қазақ' },
  ky: { name: 'Kyrgyz', native: 'Кыргызча' },
  tg: { name: 'Tajik', native: 'Тоҷикӣ' },
  tk: { name: 'Turkmen', native: 'Türkmen' },
  ps: { name: 'Pashto', native: 'پښتو' },
  ku: { name: 'Kurdish', native: 'Kurdî' },
  sd: { name: 'Sindhi', native: 'سنڌي' },
  bo: { name: 'Tibetan', native: 'བོད་སྐད་' },
  dz: { name: 'Dzongkha', native: 'རྫོང་ཁ' },
  ug: { name: 'Uyghur', native: 'ئۇيغۇرچە' },
  sq: { name: 'Albanian', native: 'Shqip' },
  mk: { name: 'Macedonian', native: 'Македонски' },
  bs: { name: 'Bosnian', native: 'Bosanski' },
  mt: { name: 'Maltese', native: 'Malti' },
  is: { name: 'Icelandic', native: 'Íslenska' },
  ga: { name: 'Irish', native: 'Gaeilge' },
  cy: { name: 'Welsh', native: 'Cymraeg' },
  gd: { name: 'Scottish Gaelic', native: 'Gàidhlig' },
  eu: { name: 'Basque', native: 'Euskara' },
  ca: { name: 'Catalan', native: 'Català' },
  gl: { name: 'Galician', native: 'Galego' },
  be: { name: 'Belarusian', native: 'Беларуская' },
  eo: { name: 'Esperanto', native: 'Esperanto' },
  la: { name: 'Latin', native: 'Latina' },
  haw: { name: 'Hawaiian', native: 'ʻŌlelo Hawaiʻi' },
  mi: { name: 'Maori', native: 'Te Reo Māori' },
  sm: { name: 'Samoan', native: 'Gagana Samoa' },
  to: { name: 'Tongan', native: 'Lea Fakatonga' },
  fj: { name: 'Fijian', native: 'Vosa Vakaviti' },
  mg: { name: 'Malagasy', native: 'Malagasy' },
  so: { name: 'Somali', native: 'Soomaali' },
  rw: { name: 'Kinyarwanda', native: 'Ikinyarwanda' },
  ny: { name: 'Chichewa', native: 'Chichewa' },
  sn: { name: 'Shona', native: 'ChiShona' },
  st: { name: 'Sesotho', native: 'Sesotho' },
  tn: { name: 'Setswana', native: 'Setswana' },
  ts: { name: 'Tsonga', native: 'Xitsonga' },
  ss: { name: 'Swati', native: 'SiSwati' },
  ve: { name: 'Venda', native: 'Tshivenḓa' },
  nso: { name: 'Northern Sotho', native: 'Sesotho sa Leboa' },
  fy: { name: 'Frisian', native: 'Frysk' },
  lb: { name: 'Luxembourgish', native: 'Lëtzebuergesch' },
  fo: { name: 'Faroese', native: 'Føroyskt' },
  kl: { name: 'Greenlandic', native: 'Kalaallisut' },
  se: { name: 'Northern Sami', native: 'Davvisámegiella' },
  br: { name: 'Breton', native: 'Brezhoneg' },
  co: { name: 'Corsican', native: 'Corsu' },
  oc: { name: 'Occitan', native: 'Occitan' },
  rm: { name: 'Romansh', native: 'Rumantsch' },
  as: { name: 'Assamese', native: 'অসমীয়া' },
  bh: { name: 'Bihari', native: 'भोजपुरी' },
  sa: { name: 'Sanskrit', native: 'संस्कृतम्' },
  ks: { name: 'Kashmiri', native: 'कॉशुर' },
  doi: { name: 'Dogri', native: 'डोगरी' },
  mni: { name: 'Manipuri', native: 'মৈতৈলোন্' },
  sat: { name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  mai: { name: 'Maithili', native: 'मैथिली' },
  kok: { name: 'Konkani', native: 'कोंकणी' },
  jv: { name: 'Javanese', native: 'Basa Jawa' },
  su: { name: 'Sundanese', native: 'Basa Sunda' },
  ace: { name: 'Acehnese', native: 'Bahsa Acèh' },
  ban: { name: 'Balinese', native: 'Basa Bali' },
  bug: { name: 'Buginese', native: 'Basa Ugi' },
  min: { name: 'Minangkabau', native: 'Baso Minangkabau' },
  ceb: { name: 'Cebuano', native: 'Binisaya' },
  ilo: { name: 'Ilocano', native: 'Ilokano' },
  war: { name: 'Waray', native: 'Winaray' },
  pam: { name: 'Kapampangan', native: 'Kapampangan' },
  bcl: { name: 'Bikol', native: 'Bikol' },
  hil: { name: 'Hiligaynon', native: 'Ilonggo' },
  hmn: { name: 'Hmong', native: 'Hmoob' },
  yi: { name: 'Yiddish', native: 'ייִדיש' },
  ht: { name: 'Haitian Creole', native: 'Kreyòl ayisyen' },
  tpi: { name: 'Tok Pisin', native: 'Tok Pisin' },
  bi: { name: 'Bislama', native: 'Bislama' },
  pap: { name: 'Papiamento', native: 'Papiamentu' },
  ty: { name: 'Tahitian', native: 'Reo Tahiti' },
  mh: { name: 'Marshallese', native: 'Kajin M̧ajeļ' },
  ch: { name: 'Chamorro', native: 'Chamoru' },
  gil: { name: 'Gilbertese', native: 'Taetae ni Kiribati' },
  tvl: { name: 'Tuvaluan', native: 'Te Ggana Tuuvalu' },
  niu: { name: 'Niuean', native: 'Ko e vagahau Niuē' },
  rar: { name: 'Cook Islands Maori', native: 'Te reo Māori Kūki ʻĀirani' },
  wls: { name: 'Wallisian', native: 'Fakaʻuvea' },
  fud: { name: 'Futunan', native: 'Fakafutuna' },
  tkl: { name: 'Tokelauan', native: 'Tokelau' },
  nau: { name: 'Nauruan', native: 'Dorerin Naoero' },
  pau: { name: 'Palauan', native: 'A tekoi er a Belau' },
  yap: { name: 'Yapese', native: 'Waqab' },
  pon: { name: 'Pohnpeian', native: 'Pohnpei' },
  trk: { name: 'Chuukese', native: 'Chuuk' },
  kos: { name: 'Kosraean', native: 'Kosrae' },
  ff: { name: 'Fulah', native: 'Pulaar' },
  wo: { name: 'Wolof', native: 'Wolof' },
  bm: { name: 'Bambara', native: 'Bamanankan' },
  ln: { name: 'Lingala', native: 'Lingála' },
  kg: { name: 'Kongo', native: 'Kikongo' },
  rn: { name: 'Kirundi', native: 'Ikirundi' },
  lg: { name: 'Luganda', native: 'Luganda' },
  om: { name: 'Oromo', native: 'Afaan Oromoo' },
  ti: { name: 'Tigrinya', native: 'ትግርኛ' },
  aa: { name: 'Afar', native: 'Qafar af' },
  ak: { name: 'Akan', native: 'Akan' },
  tw: { name: 'Twi', native: 'Twi' },
  ee: { name: 'Ewe', native: 'Eʋegbe' },
  gn: { name: 'Guarani', native: "Avañe'ẽ" },
  qu: { name: 'Quechua', native: 'Runasimi' },
  ay: { name: 'Aymara', native: 'Aymar aru' },
  nah: { name: 'Nahuatl', native: 'Nāhuatl' },
  yua: { name: 'Yucatec Maya', native: "Maayaʼ tʼàan" },
  oto: { name: 'Otomi', native: 'Hñähñu' },
  tzh: { name: 'Tzotzil', native: 'Bats\'i k\'op' },
  mam: { name: 'Mam', native: 'Qyol Mam' },
  chr: { name: 'Cherokee', native: 'ᏣᎳᎩ' },
  nv: { name: 'Navajo', native: 'Diné bizaad' },
  oj: { name: 'Ojibwe', native: 'Anishinaabemowin' },
  cr: { name: 'Cree', native: 'ᓀᐦᐃᔭᐍᐏᐣ' },
  iu: { name: 'Inuktitut', native: 'ᐃᓄᒃᑎᑐᑦ' },
  ik: { name: 'Inupiaq', native: 'Iñupiaq' },
};

export type LanguageCode = keyof typeof languages;

// Translation keys interface
interface Translations {
  common: {
    signIn: string;
    signUp: string;
    signOut: string;
    getStarted: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    loading: string;
    search: string;
    filter: string;
    export: string;
    download: string;
    share: string;
    settings: string;
    profile: string;
    home: string;
    tools: string;
    back: string;
    next: string;
    previous: string;
    submit: string;
    create: string;
    update: string;
    view: string;
    close: string;
  };
  auth: {
    signInRequired: string;
    signInToAccess: string;
    signInToContinue: string;
    createAccount: string;
    email: string;
    password: string;
    fullName: string;
    forgotPassword: string;
    noAccount: string;
    haveAccount: string;
  };
  profile: {
    myProfile: string;
    savedPortfolios: string;
    savedCareerPlans: string;
    jobAlerts: string;
    activityHistory: string;
    language: string;
    preferences: string;
  };
  tools: {
    resumeBuilder: string;
    coverLetterGenerator: string;
    interviewPractice: string;
    jobSearch: string;
    salaryEstimator: string;
    careerPathPlanner: string;
    portfolioBuilder: string;
    industryInsights: string;
  };
}

// Default English translations
const defaultTranslations: Translations = {
  common: {
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    getStarted: 'Get Started',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    loading: 'Loading...',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    download: 'Download',
    share: 'Share',
    settings: 'Settings',
    profile: 'Profile',
    home: 'Home',
    tools: 'Tools',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    create: 'Create',
    update: 'Update',
    view: 'View',
    close: 'Close',
  },
  auth: {
    signInRequired: 'Sign In Required',
    signInToAccess: 'Please sign in to access this feature',
    signInToContinue: 'Sign In to Continue',
    createAccount: 'Create Account',
    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
  },
  profile: {
    myProfile: 'My Profile',
    savedPortfolios: 'Saved Portfolios',
    savedCareerPlans: 'Saved Career Plans',
    jobAlerts: 'Job Alerts',
    activityHistory: 'Activity History',
    language: 'Language',
    preferences: 'Preferences',
  },
  tools: {
    resumeBuilder: 'Resume Builder',
    coverLetterGenerator: 'Cover Letter Generator',
    interviewPractice: 'Interview Practice',
    jobSearch: 'Job Search',
    salaryEstimator: 'Salary Estimator',
    careerPathPlanner: 'Career Path Planner',
    portfolioBuilder: 'Portfolio Builder',
    industryInsights: 'Industry Insights',
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
  languages: typeof languages;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('preferred_language');
    return (saved as LanguageCode) || 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('preferred_language', lang);
  };

  useEffect(() => {
    // Set document direction for RTL languages
    const rtlLanguages = ['ar', 'he', 'fa', 'ur', 'ps', 'sd', 'ku', 'ug', 'yi'];
    document.documentElement.dir = rtlLanguages.includes(language) ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: defaultTranslations, // In production, this would load translations based on language
    languages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
