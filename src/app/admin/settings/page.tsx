import { getBrand } from "@/lib/brand";
import { auth } from "@/auth";
import { saveSiteSettings, changeAdminPassword } from "./actions";

function Field({
  name,
  label,
  defaultValue,
  textarea,
  type = "text",
}: {
  name: string;
  label: string;
  defaultValue: string;
  textarea?: boolean;
  type?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">{label}</span>
      {textarea ? (
        <textarea name={name} rows={6} defaultValue={defaultValue} className="mt-2 w-full border border-[var(--line)] bg-[var(--ivory)] px-3 py-2" />
      ) : (
        <input name={name} type={type} defaultValue={defaultValue} className="mt-2 min-h-11 w-full border border-[var(--line)] bg-[var(--ivory)] px-3" />
      )}
    </label>
  );
}

export default async function AdminSettingsPage() {
  const [brand, session] = await Promise.all([getBrand(), auth()]);
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-serif text-4xl">Brand & pages</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Every line on the shop that is not a product, collection, banner, or journal post lives here. Save once; the live site updates.
      </p>
      <form action={saveSiteSettings} className="mt-10 space-y-10">
        <section className="space-y-6">
          <h2 className="font-serif text-2xl">Name, logo, domain</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Field name="name" label="Shop name" defaultValue={brand.name} />
            <Field name="taglineEn" label="Tagline" defaultValue={brand.taglineEn} />
          </div>
          <Field name="siteUrl" label="Public website (your domain)" defaultValue={brand.siteUrl} />
          <p className="-mt-4 text-xs text-[var(--muted)]">
            Live shop: https://tavaruseere.com — also set AUTH_URL, NEXTAUTH_URL, and NEXT_PUBLIC_SITE_URL in `.env`.
          </p>
          <Field name="description" label="SEO description (search engines + share cards)" defaultValue={brand.description} textarea />
          <label className="block text-sm">
            <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Logo</span>
            <input name="logoFile" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="mt-2 block w-full text-sm" />
            <input type="hidden" name="logo" value={brand.logo} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brand.logo} alt="" className="mt-3 h-24 w-24 object-cover" />
          </label>
        </section>

        <section className="space-y-6">
          <h2 className="font-serif text-2xl">Contact (shown on the shop)</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Field name="supportEmail" label="Public email" defaultValue={brand.supportEmail} type="email" />
            <Field name="supportPhone" label="Public phone" defaultValue={brand.supportPhone} />
            <Field name="whatsapp" label="WhatsApp number (the phone that has WhatsApp)" defaultValue={brand.whatsapp} />
            <p className="-mt-2 text-xs text-[var(--muted)] md:col-span-2">
              Open WhatsApp on that phone → Settings → your profile: the number must be 96867 26381. Do not test the shop button on that same phone — WhatsApp cannot start a chat with itself. Ask a second phone to tap WhatsApp on the site. If a second phone also cannot look it up, this SIM is not registered on WhatsApp.
            </p>
            <Field name="gstin" label="GSTIN" defaultValue={brand.gstin} />
          </div>
          <Field name="address" label="Address (footer + about + invoices)" defaultValue={brand.address} textarea />
          <div className="grid gap-6 md:grid-cols-2">
            <Field name="headerCity" label="City under the logo in the header" defaultValue={brand.headerCity} />
            <Field name="originState" label="Origin state code for GST (e.g. KA)" defaultValue={brand.originState} />
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="font-serif text-2xl">Social (paste after you create each page)</h2>
          <p className="text-sm text-[var(--muted)]">
            Empty fields stay hidden. Use the same username everywhere: tavaruseere. Google Business is the Maps listing, not a social app.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <Field name="instagram" label="Instagram URL" defaultValue={brand.instagram} />
            <Field name="facebook" label="Facebook page URL" defaultValue={brand.facebook} />
            <Field name="youtube" label="YouTube channel URL" defaultValue={brand.youtube} />
            <Field name="pinterest" label="Pinterest URL" defaultValue={brand.pinterest} />
            <Field name="twitter" label="X (Twitter) URL" defaultValue={brand.twitter} />
            <Field name="linkedin" label="LinkedIn URL" defaultValue={brand.linkedin} />
            <Field name="whatsappChannel" label="WhatsApp Channel URL" defaultValue={brand.whatsappChannel} />
            <Field name="googleBusiness" label="Google Business / Maps URL" defaultValue={brand.googleBusiness} />
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="font-serif text-2xl">Header menu</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Field name="navShop" label="Shop link label" defaultValue={brand.navShop} />
            <Field name="navWedding" label="Wedding label" defaultValue={brand.navWedding} />
            <Field name="navWeddingHref" label="Wedding URL" defaultValue={brand.navWeddingHref} />
            <Field name="navHandloom" label="Handloom label" defaultValue={brand.navHandloom} />
            <Field name="navHandloomHref" label="Handloom URL" defaultValue={brand.navHandloomHref} />
            <Field name="navJournal" label="Journal label" defaultValue={brand.navJournal} />
            <Field name="navAbout" label="About / atelier label" defaultValue={brand.navAbout} />
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="font-serif text-2xl">Home page</h2>
          <Field name="heroSubtitle" label="Hero line under the shop name" defaultValue={brand.heroSubtitle} textarea />
          <div className="grid gap-6 md:grid-cols-2">
            <Field name="heroCta" label="Primary button" defaultValue={brand.heroCta} />
            <Field name="heroCtaHref" label="Primary button URL" defaultValue={brand.heroCtaHref} />
            <Field name="heroSecondary" label="Second button" defaultValue={brand.heroSecondary} />
            <Field name="heroSecondaryHref" label="Second button URL" defaultValue={brand.heroSecondaryHref} />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Field name="shopByLabel" label="Collections section label" defaultValue={brand.shopByLabel} />
            <Field name="bestsellersTitle" label="Bestsellers heading" defaultValue={brand.bestsellersTitle} />
            <Field name="journalHomeTitle" label="Journal heading" defaultValue={brand.journalHomeTitle} />
            <Field name="drapingCta" label="Appointment link at the bottom" defaultValue={brand.drapingCta} />
          </div>
          <Field name="craftTitle" label="Craft block title" defaultValue={brand.craftTitle} />
          <Field name="craftBody" label="Craft block text" defaultValue={brand.craftBody} textarea />
          <label className="block text-sm">
            <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Craft photograph</span>
            <input name="craftImageFile" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="mt-2 block w-full text-sm" />
            <input type="hidden" name="craftImage" value={brand.craftImage} />
          </label>
          <div className="grid gap-6 md:grid-cols-2">
            <Field name="promise1Title" label="Promise 1 title" defaultValue={brand.promise1Title} />
            <Field name="promise1Body" label="Promise 1 text" defaultValue={brand.promise1Body} textarea />
            <Field name="promise2Title" label="Promise 2 title" defaultValue={brand.promise2Title} />
            <Field name="promise2Body" label="Promise 2 text (blank = GSTIN auto)" defaultValue={brand.promise2Body} textarea />
            <Field name="promise3Title" label="Promise 3 title" defaultValue={brand.promise3Title} />
            <Field name="promise3Body" label="Promise 3 text (blank = India shipping)" defaultValue={brand.promise3Body} textarea />
            <Field name="promise4Title" label="Promise 4 title" defaultValue={brand.promise4Title} />
            <Field name="promise4Body" label="Promise 4 text" defaultValue={brand.promise4Body} textarea />
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="font-serif text-2xl">Checkout & footer</h2>
          <Field name="checkoutIntro" label="Checkout intro (above the WhatsApp order form)" defaultValue={brand.checkoutIntro} textarea />
          <Field name="checkoutPayNote" label="Checkout bag line" defaultValue={brand.checkoutPayNote} textarea />
          <Field name="productPayNote" label="Product page pay note" defaultValue={brand.productPayNote} textarea />
          <Field name="footerPromise" label="Footer promise paragraph" defaultValue={brand.footerPromise} textarea />
          <div className="grid gap-6 md:grid-cols-3">
            <Field name="returnDays" label="Return days" defaultValue={brand.returnDays} />
            <Field name="shippingIndia" label="India shipping" defaultValue={brand.shippingIndia} />
            <Field name="shippingIntl" label="International shipping" defaultValue={brand.shippingIntl} />
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="font-serif text-2xl">About & legal pages</h2>
          <Field name="aboutTitle" label="About title" defaultValue={brand.aboutTitle} />
          <Field name="aboutBody" label="About page" defaultValue={brand.aboutBody} textarea />
          <Field name="shippingPolicy" label="Shipping & returns page" defaultValue={brand.shippingPolicy} textarea />
          <Field name="privacyBody" label="Privacy" defaultValue={brand.privacyBody} textarea />
          <Field name="termsBody" label="Terms" defaultValue={brand.termsBody} textarea />
          <Field name="refundBody" label="Refunds" defaultValue={brand.refundBody} textarea />
        </section>

        <input type="hidden" name="taglineKn" value={brand.taglineEn} />
        <button className="min-h-12 bg-[var(--forest)] px-8 text-[var(--ivory)]">Save all shop copy</button>
      </form>
      <form action={changeAdminPassword} className="mt-16 space-y-3 border-t border-[var(--line)] pt-10">
        <h2 className="font-serif text-2xl">Admin login</h2>
        <p className="text-sm text-[var(--muted)]">
          This is the email and password you type at /login. Change both before customers see the site.
        </p>
        <label className="block max-w-md text-sm">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Admin email</span>
          <input
            name="email"
            type="email"
            required
            defaultValue={session?.user?.email ?? ""}
            className="mt-2 min-h-11 w-full border border-[var(--line)] px-3"
          />
        </label>
        <label className="block max-w-md text-sm">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">New password (leave blank to keep)</span>
          <input name="newPassword" type="password" className="mt-2 min-h-11 w-full border border-[var(--line)] px-3" />
        </label>
        <button className="min-h-11 bg-[var(--forest)] px-5 text-[var(--ivory)]">Update admin login</button>
      </form>
    </div>
  );
}
