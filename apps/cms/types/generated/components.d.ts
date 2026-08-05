import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsCakeGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_cake_grids';
  info: {
    description: "Pulls cakes from the catalog. Components cannot hold relations, so 'by_category' matches on categorySlug.";
    displayName: 'Cake Grid';
    icon: 'grid';
  };
  attributes: {
    background: Schema.Attribute.Enumeration<
      ['surface', 'cream', 'green', 'brown']
    >;
    categorySlug: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    limit: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<6>;
    mode: Schema.Attribute.Enumeration<['featured', 'all', 'by_category']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'featured'>;
  };
}

export interface SectionsFeatureCards extends Struct.ComponentSchema {
  collectionName: 'components_sections_feature_cards';
  info: {
    description: 'A row of image cards linking to key sections (Torty, Kaviare\u0148, Priestor).';
    displayName: 'Feature Cards';
    icon: 'grid';
  };
  attributes: {
    background: Schema.Attribute.Enumeration<
      ['surface', 'cream', 'green', 'brown']
    >;
    cards: Schema.Attribute.Component<'shared.feature-card', true>;
    heading: Schema.Attribute.String;
  };
}

export interface SectionsGallery extends Struct.ComponentSchema {
  collectionName: 'components_sections_galleries';
  info: {
    description: 'A grid of photos.';
    displayName: 'Gallery';
    icon: 'picture';
  };
  attributes: {
    background: Schema.Attribute.Enumeration<
      ['surface', 'cream', 'green', 'brown']
    >;
    heading: Schema.Attribute.String;
    images: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    description: 'Full-bleed hero with headline, subtitle and CTAs over a photo.';
    displayName: 'Hero';
    icon: 'picture';
  };
  attributes: {
    background: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    ctas: Schema.Attribute.Component<'shared.link', true>;
    eyebrow: Schema.Attribute.String;
    scrim: Schema.Attribute.Enumeration<['light', 'medium', 'strong']> &
      Schema.Attribute.DefaultTo<'medium'>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SectionsMediaText extends Struct.ComponentSchema {
  collectionName: 'components_sections_media_texts';
  info: {
    description: 'An image beside a heading and body copy.';
    displayName: 'Media + Text';
    icon: 'landscape';
  };
  attributes: {
    background: Schema.Attribute.Enumeration<
      ['surface', 'cream', 'green', 'brown']
    >;
    body: Schema.Attribute.Blocks;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    imageSide: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.DefaultTo<'left'>;
  };
}

export interface SectionsQuote extends Struct.ComponentSchema {
  collectionName: 'components_sections_quotes';
  info: {
    description: 'A centered pull-quote on a coloured band.';
    displayName: 'Quote';
    icon: 'quote';
  };
  attributes: {
    author: Schema.Attribute.String;
    background: Schema.Attribute.Enumeration<
      ['surface', 'cream', 'green', 'brown']
    >;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SectionsReservationCta extends Struct.ComponentSchema {
  collectionName: 'components_sections_reservation_ctas';
  info: {
    description: 'A call-to-action band inviting guests to reserve a table.';
    displayName: 'Reservation CTA';
    icon: 'calendar';
  };
  attributes: {
    background: Schema.Attribute.Enumeration<
      ['surface', 'cream', 'green', 'brown']
    >;
    body: Schema.Attribute.Text;
    button: Schema.Attribute.Component<'shared.link', false>;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsRichText extends Struct.ComponentSchema {
  collectionName: 'components_sections_rich_texts';
  info: {
    description: 'A heading and a block of formatted prose.';
    displayName: 'Rich Text';
    icon: 'align-left';
  };
  attributes: {
    body: Schema.Attribute.Blocks & Schema.Attribute.Required;
    heading: Schema.Attribute.String;
  };
}

export interface SharedBadge extends Struct.ComponentSchema {
  collectionName: 'components_shared_badges';
  info: {
    description: 'A small label shown on a card (matches the web UI Badge variants).';
    displayName: 'Badge';
    icon: 'priceTag';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<['rust', 'gold', 'soft', 'green']> &
      Schema.Attribute.DefaultTo<'rust'>;
  };
}

export interface SharedContact extends Struct.ComponentSchema {
  collectionName: 'components_shared_contacts';
  info: {
    description: 'Where and how to reach the caf\u00E9.';
    displayName: 'Contact';
    icon: 'phone';
  };
  attributes: {
    addressLine: Schema.Attribute.String & Schema.Attribute.Required;
    cafePhone: Schema.Attribute.String & Schema.Attribute.Required;
    cakePhone: Schema.Attribute.String;
    city: Schema.Attribute.String;
    email: Schema.Attribute.Email & Schema.Attribute.Required;
    mapUrl: Schema.Attribute.String;
  };
}

export interface SharedFeatureCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_feature_cards';
  info: {
    description: 'An image card with a category label, heading, description and link.';
    displayName: 'Feature Card';
    icon: 'grid';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    linkHref: Schema.Attribute.String;
    linkLabel: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    description: 'A navigation or call-to-action link.';
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'ghost', 'light', 'gold']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface SharedOpeningHours extends Struct.ComponentSchema {
  collectionName: 'components_shared_opening_hours';
  info: {
    description: 'Opening hours for a single day of the week.';
    displayName: 'Opening Hours';
    icon: 'clock';
  };
  attributes: {
    closed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    closes: Schema.Attribute.Time;
    day: Schema.Attribute.Enumeration<
      [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ]
    > &
      Schema.Attribute.Required;
    opens: Schema.Attribute.Time;
  };
}

export interface SharedReservation extends Struct.ComponentSchema {
  collectionName: 'components_shared_reservations';
  info: {
    description: 'How guests reserve a table.';
    displayName: 'Reservation';
    icon: 'calendar';
  };
  attributes: {
    email: Schema.Attribute.Email;
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    phone: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'Meta tags for search engines and social sharing.';
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    keywords: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    ogImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    description: 'A link to a social media profile.';
    displayName: 'Social Link';
    icon: 'earth';
  };
  attributes: {
    platform: Schema.Attribute.Enumeration<
      ['instagram', 'facebook', 'tiktok', 'youtube', 'tripadvisor', 'other']
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'sections.cake-grid': SectionsCakeGrid;
      'sections.feature-cards': SectionsFeatureCards;
      'sections.gallery': SectionsGallery;
      'sections.hero': SectionsHero;
      'sections.media-text': SectionsMediaText;
      'sections.quote': SectionsQuote;
      'sections.reservation-cta': SectionsReservationCta;
      'sections.rich-text': SectionsRichText;
      'shared.badge': SharedBadge;
      'shared.contact': SharedContact;
      'shared.feature-card': SharedFeatureCard;
      'shared.link': SharedLink;
      'shared.opening-hours': SharedOpeningHours;
      'shared.reservation': SharedReservation;
      'shared.seo': SharedSeo;
      'shared.social-link': SharedSocialLink;
    }
  }
}
