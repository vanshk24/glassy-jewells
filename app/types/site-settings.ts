export type AnnouncementBehavior = 'static' | 'scroll' | 'hover';

export interface SiteSettings {
  id: number;
  brand_name: string;
  logo_url: string | null;
  hero_banner_url: string | null;
  hero_heading: string | null;
  hero_subheading: string | null;
  announcement_text: string | null;
  announcement_behavior: AnnouncementBehavior;
  contact_email: string | null;
  contact_phone: string | null;
  social_links: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface UpdateSiteSettingsInput {
  brand_name?: string;
  logo_url?: string | null;
  hero_banner_url?: string | null;
  hero_heading?: string | null;
  hero_subheading?: string | null;
  announcement_text?: string | null;
  announcement_behavior?: AnnouncementBehavior;
  contact_email?: string | null;
  contact_phone?: string | null;
  social_links?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
}
