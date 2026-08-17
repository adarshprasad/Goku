import { getBrand } from "@/lib/brand";
import { saveSiteSettings } from "./actions";

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
  const brand = await getBrand();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-serif text-4xl">Brand & pages</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        These fields appear on the live shop. Upload a logo that already sits on forest green so it matches the header.
      </p>
      <form action={saveSiteSettings} className="mt-10 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Field name="name" label="Shop name" defaultValue={brand.name} />
          <Field name="taglineEn" label="Tagline" defaultValue={brand.taglineEn} />
        </div>
        <Field name="description" label="SEO description" defaultValue={brand.description} textarea />
        <Field name="heroSubtitle" label="Home hero line" defaultValue={brand.heroSubtitle} textarea />
        <label className="block text-sm">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Logo</span>
          <input name="logoFile" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="mt-2 block w-full text-sm" />
          <input type="hidden" name="logo" value={brand.logo} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={brand.logo} alt="" className="mt-3 h-24 w-24 object-cover" />
        </label>
        <div className="grid gap-6 md:grid-cols-2">
          <Field name="supportEmail" label="Email" defaultValue={brand.supportEmail} type="email" />
          <Field name="supportPhone" label="Phone" defaultValue={brand.supportPhone} />
          <Field name="whatsapp" label="WhatsApp number (with country code)" defaultValue={brand.whatsapp} />
          <Field name="gstin" label="GSTIN" defaultValue={brand.gstin} />
        </div>
        <Field name="address" label="Address" defaultValue={brand.address} textarea />
        <Field name="instagram" label="Instagram URL" defaultValue={brand.instagram} />
        <div className="grid gap-6 md:grid-cols-3">
          <Field name="returnDays" label="Return days" defaultValue={brand.returnDays} />
          <Field name="shippingIndia" label="India shipping" defaultValue={brand.shippingIndia} />
          <Field name="shippingIntl" label="International shipping" defaultValue={brand.shippingIntl} />
        </div>
        <Field name="aboutTitle" label="About title" defaultValue={brand.aboutTitle} />
        <Field name="aboutBody" label="About page" defaultValue={brand.aboutBody} textarea />
        <Field name="craftTitle" label="Home craft title" defaultValue={brand.craftTitle} />
        <Field name="craftBody" label="Home craft text" defaultValue={brand.craftBody} textarea />
        <label className="block text-sm">
          <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Craft photograph</span>
          <input name="craftImageFile" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="mt-2 block w-full text-sm" />
          <input type="hidden" name="craftImage" value={brand.craftImage} />
        </label>
        <Field name="shippingPolicy" label="Shipping & returns page" defaultValue={brand.shippingPolicy} textarea />
        <Field name="privacyBody" label="Privacy" defaultValue={brand.privacyBody} textarea />
        <Field name="termsBody" label="Terms" defaultValue={brand.termsBody} textarea />
        <Field name="refundBody" label="Refunds" defaultValue={brand.refundBody} textarea />
        <input type="hidden" name="taglineKn" value={brand.taglineEn} />
        <input type="hidden" name="originState" value={brand.originState} />
        <button className="min-h-12 bg-[var(--forest)] px-8 text-[var(--ivory)]">Save brand</button>
      </form>
    </div>
  );
}
