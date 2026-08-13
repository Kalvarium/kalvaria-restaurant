import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsCafeGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_cafe_grids';
  info: {
    description: "Shows caf\u00E9 menu items from the Cafe collection. Pick specific items in 'cafes' to curate and order them; leave it empty to fall back to the featured items.";
    displayName: 'Cafe Grid';
    icon: 'grid';
  };
  attributes: {
    background: Schema.Attribute.Enumeration<
      ['surface', 'cream', 'green', 'brown']
    >;
    cafes: Schema.Attribute.Relation<'oneToMany', 'api::cafe.cafe'>;
    callLabel: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Call'>;
    ctaBody: Schema.Attribute.Text;
    ctaButton: Schema.Attribute.Component<'shared.link', false>;
    ctaHeading: Schema.Attribute.String;
    emptyText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'We are currently preparing our menu.'>;
    favoriteLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Favorite'>;
    heading: Schema.Attribute.String;
    intro: Schema.Attribute.Text;
    limit: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<8>;
    reserveLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Reserve a table'>;
  };
}

export interface SectionsCakeGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_cake_grids';
  info: {
    description: "Shows cakes from the catalog. Pick specific cakes in 'cakes' to curate and order them; leave it empty to fall back to the featured cakes.";
    displayName: 'Cake Grid';
    icon: 'grid';
  };
  attributes: {
    allergensLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Allergens'>;
    background: Schema.Attribute.Enumeration<
      ['surface', 'cream', 'green', 'brown']
    >;
    cakes: Schema.Attribute.Relation<'oneToMany', 'api::cake.cake'>;
    callLabel: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Call'>;
    ctaBody: Schema.Attribute.Text;
    ctaButton: Schema.Attribute.Component<'shared.link', false>;
    ctaHeading: Schema.Attribute.String;
    emptyText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'We are currently preparing an offer.'>;
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
    orderLabel: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Order'>;
  };
}

export interface SectionsCardGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_card_grids';
  info: {
    description: 'A responsive grid of Info Cards (icon + title + body). Add cards individually \u2014 used for the contact page and any card row.';
    displayName: 'Card Grid';
    icon: 'grid';
  };
  attributes: {
    align: Schema.Attribute.Enumeration<['left', 'center']> &
      Schema.Attribute.DefaultTo<'left'>;
    background: Schema.Attribute.Enumeration<
      ['surface', 'cream', 'green', 'brown']
    >;
    cafeLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Caf\u00E9'>;
    cakesLabel: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Cakes'>;
    cards: Schema.Attribute.Component<'shared.info-card', true>;
    columns: Schema.Attribute.Enumeration<['2', '3', '4']> &
      Schema.Attribute.DefaultTo<'3'>;
    emailLabel: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Email'>;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    openingHours: Schema.Attribute.Component<'shared.opening-hours', true>;
  };
}

export interface SectionsCtaCard extends Struct.ComponentSchema {
  collectionName: 'components_sections_cta_cards';
  info: {
    description: "A contained, centered call-to-action card: an eyebrow, heading, short body and a button, set in a bordered (or cream) panel. Use for a boxed CTA like a menu download or 'book an event'.";
    displayName: 'CTA Card';
    icon: 'cursor';
  };
  attributes: {
    background: Schema.Attribute.Enumeration<
      ['surface', 'cream', 'green', 'brown']
    >;
    body: Schema.Attribute.Blocks;
    bodySize: Schema.Attribute.Enumeration<
      ['xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge', 'xxxlarge']
    > &
      Schema.Attribute.DefaultTo<'small'>;
    button: Schema.Attribute.Component<'shared.link', false>;
    cardBackground: Schema.Attribute.Enumeration<
      ['surface', 'cream', 'green', 'brown']
    > &
      Schema.Attribute.DefaultTo<'green'>;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    topDivider: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface SectionsForm extends Struct.ComponentSchema {
  collectionName: 'components_sections_forms';
  info: {
    description: "A booking / enquiry form that emails the restaurant. Set the editorial text and add the form's inputs under Fields (each is a Form Field entry). `display: page` = full-screen photo + form; `display: dialog` = a button that opens the form in a modal.";
    displayName: 'Form';
    icon: 'envelop';
  };
  attributes: {
    anchor: Schema.Attribute.String;
    content: Schema.Attribute.Component<'sections.text', true>;
    display: Schema.Attribute.Enumeration<['page', 'dialog']> &
      Schema.Attribute.DefaultTo<'page'>;
    errorMessage: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Sorry, something went wrong. Please call us instead.'>;
    eyebrow: Schema.Attribute.String;
    fields: Schema.Attribute.Component<'shared.form-field', true>;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    intro: Schema.Attribute.Text;
    quote: Schema.Attribute.Text;
    recipient: Schema.Attribute.Enumeration<
      ['reservation', 'upstairs', 'cakes']
    > &
      Schema.Attribute.DefaultTo<'reservation'>;
    submitLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Send reservation request'>;
    successMessage: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<"Thank you! We'll get back to you soon to confirm your reservation.">;
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
    align: Schema.Attribute.Enumeration<['left', 'center']> &
      Schema.Attribute.DefaultTo<'left'>;
    background: Schema.Attribute.Enumeration<
      ['surface', 'cream', 'green', 'brown']
    >;
    columns: Schema.Attribute.Enumeration<['2', '3', '4', '5', '6']> &
      Schema.Attribute.DefaultTo<'4'>;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    images: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
    layout: Schema.Attribute.Enumeration<['grid', 'staggered']> &
      Schema.Attribute.DefaultTo<'grid'>;
    showCaptions: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
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
    scrim: Schema.Attribute.Enumeration<['none', 'light', 'medium', 'strong']> &
      Schema.Attribute.DefaultTo<'medium'>;
    size: Schema.Attribute.Enumeration<['full', 'tall', 'short']> &
      Schema.Attribute.DefaultTo<'full'>;
    subtitle: Schema.Attribute.Text;
    textWidth: Schema.Attribute.Enumeration<['sm', 'md', 'lg', 'xl', 'full']> &
      Schema.Attribute.DefaultTo<'md'>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsMap extends Struct.ComponentSchema {
  collectionName: 'components_sections_maps';
  info: {
    description: 'A full-width embedded map. Paste a Google Maps embed URL (Share \u2192 Embed a map \u2192 the src of the iframe).';
    displayName: 'Map';
    icon: 'pinMap';
  };
  attributes: {
    background: Schema.Attribute.Enumeration<
      ['surface', 'cream', 'green', 'brown']
    >;
    embedUrl: Schema.Attribute.String & Schema.Attribute.Required;
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
    showCaption: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    variant: Schema.Attribute.Enumeration<['contained', 'full']> &
      Schema.Attribute.DefaultTo<'contained'>;
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

export interface SectionsText extends Struct.ComponentSchema {
  collectionName: 'components_sections_texts';
  info: {
    description: "The general-purpose text block: an optional eyebrow and heading over a body of formatted prose. Set alignment to 'center' for a section intro, 'left' for a prose column.";
    displayName: 'Text';
    icon: 'align-left';
  };
  attributes: {
    align: Schema.Attribute.Enumeration<['left', 'center']> &
      Schema.Attribute.DefaultTo<'left'>;
    background: Schema.Attribute.Enumeration<
      ['surface', 'cream', 'green', 'brown']
    >;
    body: Schema.Attribute.Blocks;
    bodySize: Schema.Attribute.Enumeration<
      ['xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge', 'xxxlarge']
    > &
      Schema.Attribute.DefaultTo<'medium'>;
    button: Schema.Attribute.Component<'shared.link', false>;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    titleSize: Schema.Attribute.Enumeration<
      ['xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge', 'xxxlarge']
    > &
      Schema.Attribute.DefaultTo<'medium'>;
    topDivider: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface SectionsVenueInfo extends Struct.ComponentSchema {
  collectionName: 'components_sections_venue_infos';
  info: {
    description: "Two columns: intro text + a feature list on the left, and a coloured info card (label/value rows) on the right. Used for the Upstairs space page's 'Space Information' block.";
    displayName: 'Venue Info';
    icon: 'apps';
  };
  attributes: {
    background: Schema.Attribute.Enumeration<
      ['surface', 'cream', 'green', 'brown']
    >;
    body: Schema.Attribute.Blocks;
    cardHeading: Schema.Attribute.String;
    features: Schema.Attribute.Component<'shared.list-item', true>;
    rows: Schema.Attribute.Component<'shared.info-row', true>;
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
    email: Schema.Attribute.Email & Schema.Attribute.Required;
    mapUrl: Schema.Attribute.String;
  };
}

export interface SharedEmailTemplate extends Struct.ComponentSchema {
  collectionName: 'components_shared_email_templates';
  info: {
    description: "Wording for a form-notification email: subject line, an intro above the details, and an optional footer. The customer's submitted fields are appended automatically.";
    displayName: 'Email Template';
    icon: 'envelop';
  };
  attributes: {
    footer: Schema.Attribute.Blocks;
    intro: Schema.Attribute.Blocks;
    subject: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFormField extends Struct.ComponentSchema {
  collectionName: 'components_shared_form_fields';
  info: {
    description: 'One input in a form: `name` is the data key (e.g. "phone"), plus label, type, placeholder, whether it\'s required, and whether it spans the full width. For `checkbox` (e.g. a consent tick) the label is the text beside the box \u2014 set fullWidth. `cakes` renders a dropdown whose options are the available cakes from the Cake collection.';
    displayName: 'Form Field';
    icon: 'apps';
  };
  attributes: {
    fullWidth: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    max: Schema.Attribute.String;
    min: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    placeholder: Schema.Attribute.String;
    required: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    type: Schema.Attribute.Enumeration<
      [
        'text',
        'tel',
        'email',
        'date',
        'time',
        'number',
        'textarea',
        'checkbox',
        'cakes',
      ]
    > &
      Schema.Attribute.DefaultTo<'text'>;
  };
}

export interface SharedInfoCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_info_cards';
  info: {
    description: 'A card with an icon, a title and content pulled from General Info (address / opening hours / contact). Background colour is adjustable.';
    displayName: 'Info Card';
    icon: 'layout';
  };
  attributes: {
    background: Schema.Attribute.Enumeration<
      ['white', 'cream', 'green', 'brown']
    > &
      Schema.Attribute.DefaultTo<'white'>;
    icon: Schema.Attribute.Enumeration<
      ['none', 'location', 'clock', 'phone', 'mail', 'info']
    > &
      Schema.Attribute.DefaultTo<'none'>;
    note: Schema.Attribute.String;
    size: Schema.Attribute.Enumeration<
      ['xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge', 'xxxlarge']
    > &
      Schema.Attribute.DefaultTo<'medium'>;
    source: Schema.Attribute.Enumeration<['address', 'hours', 'contact']> &
      Schema.Attribute.DefaultTo<'address'>;
    title: Schema.Attribute.String;
  };
}

export interface SharedInfoRow extends Struct.ComponentSchema {
  collectionName: 'components_shared_info_rows';
  info: {
    description: 'A label/value row shown in an info card (e.g. Capacity \u2192 up to 30 guests).';
    displayName: 'Info Row';
    icon: 'bulletList';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
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
    href: Schema.Attribute.String;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'ghost', 'light', 'gold', 'white']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface SharedListItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_list_items';
  info: {
    description: 'A single bullet in a feature list.';
    displayName: 'List Item';
    icon: 'bulletList';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedOpeningHours extends Struct.ComponentSchema {
  collectionName: 'components_shared_opening_hours';
  info: {
    description: 'One opening-hours row \u2014 group the days yourself: `days` is the label (e.g. "Mon\u2013Thu", "Friday") and `time` is the hours (e.g. "8:00\u201320:00", "Closed").';
    displayName: 'Opening Hours';
    icon: 'clock';
  };
  attributes: {
    days: Schema.Attribute.String & Schema.Attribute.Required;
    time: Schema.Attribute.String & Schema.Attribute.Required;
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
      'sections.cafe-grid': SectionsCafeGrid;
      'sections.cake-grid': SectionsCakeGrid;
      'sections.card-grid': SectionsCardGrid;
      'sections.cta-card': SectionsCtaCard;
      'sections.form': SectionsForm;
      'sections.gallery': SectionsGallery;
      'sections.hero': SectionsHero;
      'sections.map': SectionsMap;
      'sections.media-text': SectionsMediaText;
      'sections.quote': SectionsQuote;
      'sections.text': SectionsText;
      'sections.venue-info': SectionsVenueInfo;
      'shared.badge': SharedBadge;
      'shared.contact': SharedContact;
      'shared.email-template': SharedEmailTemplate;
      'shared.form-field': SharedFormField;
      'shared.info-card': SharedInfoCard;
      'shared.info-row': SharedInfoRow;
      'shared.link': SharedLink;
      'shared.list-item': SharedListItem;
      'shared.opening-hours': SharedOpeningHours;
      'shared.reservation': SharedReservation;
      'shared.seo': SharedSeo;
      'shared.social-link': SharedSocialLink;
    }
  }
}
