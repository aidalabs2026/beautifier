export const SITE_NAME = 'Beautifier';
export const SITE_TITLE_SUFFIX = 'Beautifier — Format JSON, XML, HTML Online';
export const SITE_DESCRIPTION =
  'Format, minify, and validate JSON, XML, and HTML right in your browser. Your data never leaves your device.';
export const SITE_URL = 'https://beautifier.aidalabs.kr';
export const SITE_LOCALE = 'en';
export const CONTACT_EMAIL = 'facered79@gmail.com';

// Google Search Console meta-tag verification token.
// Set after creating the GSC property and choosing the "HTML tag" method.
// Leave empty to omit the meta entirely.
export const GSC_VERIFICATION = 'tAy5xjnlcP6nYG7CuBLll7K3n1WvQYe_KsWKCJugDxE';

// Google Analytics 4 Measurement ID (G-XXXXXXXXXX). Leave empty to skip GA4.
export const GA4_MEASUREMENT_ID = '';

export const NAV_ITEMS: Array<{ href: string; label: string }> = [
  { href: '/', label: 'Home' },
  { href: '/json/', label: 'JSON' },
  { href: '/guides/', label: 'Guides' },
  { href: '/glossary/', label: 'Glossary' },
  { href: '/faq/', label: 'FAQ' },
  { href: '/about/', label: 'About' },
];

export const FOOTER_LINKS: Array<{ href: string; label: string }> = [
  { href: '/about/', label: 'About' },
  { href: '/privacy/', label: 'Privacy' },
  { href: '/terms/', label: 'Terms' },
  { href: '/contact/', label: 'Contact' },
];
