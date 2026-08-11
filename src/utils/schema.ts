import type { SupportedLocale } from '@/types/i18n';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SportsTourItem {
  name: string;
  description: string;
  image: string;
  url: string;
  price: number;
  currency: string;
  startDate?: string;
  endDate?: string;
  locationName: string;
  locationAddress: string;
}

/**
 * Organization Schema.org JSON-LD (Corporate Entity)
 */
export function generateOrganizationSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsOrganization',
    '@id': `${siteUrl}/#organization`,
    name: 'SportivERF',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/assets/images/logo.png`,
      width: 512,
      height: 512,
      caption: 'SportivERF Logo'
    },
    image: `${siteUrl}/assets/images/og-default.jpg`,
    description: 'Premier global sports tourism platform, alpine skiing expeditions, and elite athletic retreats.',
    email: 'contact@sportiverf.com',
    telephone: '+1-800-555-0199',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '100 Sports Tourism Blvd',
      addressLocality: 'Geneva',
      postalCode: '1201',
      addressCountry: 'CH'
    },
    sameAs: [
      'https://twitter.com/sportiverf',
      'https://www.instagram.com/sportiverf',
      'https://www.linkedin.com/company/sportiverf',
      'https://www.youtube.com/@sportiverf'
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+1-800-555-0199',
        contactType: 'customer service',
        availableLanguage: ['English', 'Persian', 'Arabic'],
        areaServed: 'Worldwide'
      }
    ]
  };
}

/**
 * WebSite Schema.org JSON-LD with Sitelinks SearchBox
 */
export function generateWebSiteSchema(siteUrl: string, locale: SupportedLocale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: 'SportivERF',
    description: 'Multilingual Sports Tourism Platform & Athletic Expeditions',
    inLanguage: ['en', 'fa', 'ar'],
    publisher: {
      '@id': `${siteUrl}/#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/${locale}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

/**
 * BreadcrumbList Schema.org JSON-LD
 */
export function generateBreadcrumbSchema(siteUrl: string, items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`
    }))
  };
}

/**
 * FAQPage Schema.org JSON-LD
 */
export function generateFAQSchema(faqItems: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * TouristTrip / Product Schema.org JSON-LD for Sports Tourism Packages
 */
export function generateSportsTourSchema(siteUrl: string, tour: SportsTourItem) {
  const fullUrl = tour.url.startsWith('http') ? tour.url : `${siteUrl}${tour.url}`;
  const fullImage = tour.image.startsWith('http') ? tour.image : `${siteUrl}${tour.image}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    '@id': `${fullUrl}/#trip`,
    name: tour.name,
    description: tour.description,
    image: fullImage,
    url: fullUrl,
    touristType: ['Athletes', 'Sports Enthusiasts', 'Skiers'],
    offers: {
      '@type': 'Offer',
      price: tour.price,
      priceCurrency: tour.currency,
      availability: 'https://schema.org/InStock',
      url: fullUrl,
      validFrom: '2026-01-01'
    },
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: 1,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'TouristAttraction',
            name: tour.locationName,
            address: tour.locationAddress
          }
        }
      ]
    },
    provider: {
      '@id': `${siteUrl}/#organization`
    }
  };
}
