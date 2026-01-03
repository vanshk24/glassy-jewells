import { Form, useActionData, useLoaderData } from "react-router";
import type { Route } from "./+types/admin.settings";
import { getSiteSettings, updateSiteSettings } from "~/services/site-settings.service";
import { requireSuperAdmin } from "~/utils/session.server";
import { Button } from "~/components/ui/button/button";
import { Input } from "~/components/ui/input/input";
import { Label } from "~/components/ui/label/label";
import { Textarea } from "~/components/ui/textarea/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select/select";
import type { AnnouncementBehavior } from "~/types/site-settings";
import styles from "./admin.settings.module.css";

export async function loader({ request }: Route.LoaderArgs) {
  await requireSuperAdmin(request);
  const settings = await getSiteSettings();
  return { settings };
}

export async function action({ request }: Route.ActionArgs) {
  await requireSuperAdmin(request);

  const formData = await request.formData();
  
  const updates = {
    brand_name: formData.get("brand_name") as string,
    logo_url: formData.get("logo_url") as string || null,
    hero_banner_url: formData.get("hero_banner_url") as string || null,
    hero_heading: formData.get("hero_heading") as string || null,
    hero_subheading: formData.get("hero_subheading") as string || null,
    announcement_text: formData.get("announcement_text") as string || null,
    announcement_behavior: formData.get("announcement_behavior") as AnnouncementBehavior || 'static',
    contact_email: formData.get("contact_email") as string || null,
    contact_phone: formData.get("contact_phone") as string || null,
    social_links: {
      facebook: formData.get("social_facebook") as string || "",
      instagram: formData.get("social_instagram") as string || "",
      twitter: formData.get("social_twitter") as string || "",
      linkedin: formData.get("social_linkedin") as string || "",
      youtube: formData.get("social_youtube") as string || "",
    },
  };

  const result = await updateSiteSettings(updates);

  if (result.success) {
    return { success: true, message: "Settings updated successfully!" };
  } else {
    return { success: false, error: result.error || "Failed to update settings" };
  }
}

export default function AdminSettings({ loaderData, actionData }: Route.ComponentProps) {
  const { settings } = loaderData;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Site Settings</h1>
        <p>Manage your brand and site-wide content</p>
      </div>

      {actionData?.success && (
        <div className={styles.successMessage}>
          {actionData.message}
        </div>
      )}

      {actionData?.error && (
        <div className={styles.errorMessage}>
          {actionData.error}
        </div>
      )}

      <Form method="post" className={styles.form}>
        <Card>
          <CardHeader>
            <CardTitle>Brand Identity</CardTitle>
            <CardDescription>Configure your store's brand and visual identity</CardDescription>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.field}>
              <Label htmlFor="brand_name">Brand Name *</Label>
              <Input
                id="brand_name"
                name="brand_name"
                defaultValue={settings?.brand_name || ""}
                required
              />
            </div>

            <div className={styles.field}>
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input
                id="logo_url"
                name="logo_url"
                type="url"
                placeholder="https://example.com/logo.png"
                defaultValue={settings?.logo_url || ""}
              />
              {settings?.logo_url && (
                <div className={styles.imagePreview}>
                  <img src={settings.logo_url} alt="Logo preview" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Homepage hero banner and messaging</CardDescription>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.field}>
              <Label htmlFor="hero_banner_url">Hero Banner URL</Label>
              <Input
                id="hero_banner_url"
                name="hero_banner_url"
                type="url"
                placeholder="https://example.com/banner.jpg"
                defaultValue={settings?.hero_banner_url || ""}
              />
              {settings?.hero_banner_url && (
                <div className={styles.imagePreview}>
                  <img src={settings.hero_banner_url} alt="Banner preview" />
                </div>
              )}
            </div>

            <div className={styles.field}>
              <Label htmlFor="hero_heading">Hero Heading</Label>
              <Input
                id="hero_heading"
                name="hero_heading"
                placeholder="Discover Amazing Products"
                defaultValue={settings?.hero_heading || ""}
              />
            </div>

            <div className={styles.field}>
              <Label htmlFor="hero_subheading">Hero Subheading</Label>
              <Textarea
                id="hero_subheading"
                name="hero_subheading"
                placeholder="Quality items at unbeatable prices"
                defaultValue={settings?.hero_subheading || ""}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Announcement Bar</CardTitle>
            <CardDescription>Top banner message for promotions and notices</CardDescription>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.field}>
              <Label htmlFor="announcement_text">Announcement Text</Label>
              <Input
                id="announcement_text"
                name="announcement_text"
                placeholder="🎉 Free shipping on orders over $50!"
                defaultValue={settings?.announcement_text || ""}
              />
              <p className={styles.fieldHint}>Leave empty to hide the announcement bar</p>
            </div>

            <div className={styles.field}>
              <Label htmlFor="announcement_behavior">Behavior</Label>
              <Select
                name="announcement_behavior"
                defaultValue={settings?.announcement_behavior || 'static'}
              >
                <SelectTrigger id="announcement_behavior">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="static">Static (Default)</SelectItem>
                  <SelectItem value="scroll">Scrolling Text</SelectItem>
                  <SelectItem value="hover">Pause on Hover</SelectItem>
                </SelectContent>
              </Select>
              <p className={styles.fieldHint}>Choose how the announcement appears</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Customer support contact details</CardDescription>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.field}>
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                placeholder="contact@example.com"
                defaultValue={settings?.contact_email || ""}
              />
            </div>

            <div className={styles.field}>
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                defaultValue={settings?.contact_phone || ""}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>Connect your social media profiles</CardDescription>
          </CardHeader>
          <CardContent className={styles.cardContent}>
            <div className={styles.field}>
              <Label htmlFor="social_facebook">Facebook</Label>
              <Input
                id="social_facebook"
                name="social_facebook"
                type="url"
                placeholder="https://facebook.com/yourpage"
                defaultValue={settings?.social_links?.facebook || ""}
              />
            </div>

            <div className={styles.field}>
              <Label htmlFor="social_instagram">Instagram</Label>
              <Input
                id="social_instagram"
                name="social_instagram"
                type="url"
                placeholder="https://instagram.com/yourprofile"
                defaultValue={settings?.social_links?.instagram || ""}
              />
            </div>

            <div className={styles.field}>
              <Label htmlFor="social_twitter">Twitter / X</Label>
              <Input
                id="social_twitter"
                name="social_twitter"
                type="url"
                placeholder="https://twitter.com/yourhandle"
                defaultValue={settings?.social_links?.twitter || ""}
              />
            </div>

            <div className={styles.field}>
              <Label htmlFor="social_linkedin">LinkedIn</Label>
              <Input
                id="social_linkedin"
                name="social_linkedin"
                type="url"
                placeholder="https://linkedin.com/company/yourcompany"
                defaultValue={settings?.social_links?.linkedin || ""}
              />
            </div>

            <div className={styles.field}>
              <Label htmlFor="social_youtube">YouTube</Label>
              <Input
                id="social_youtube"
                name="social_youtube"
                type="url"
                placeholder="https://youtube.com/@yourchannel"
                defaultValue={settings?.social_links?.youtube || ""}
              />
            </div>
          </CardContent>
        </Card>

        <div className={styles.actions}>
          <Button type="submit" size="lg">
            Save Changes
          </Button>
        </div>
      </Form>
    </div>
  );
}
