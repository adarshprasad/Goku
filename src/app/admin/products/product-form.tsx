import { saveProduct, deleteProductImage } from "./actions";

type CollectionOpt = { id: string; name: string };

export type ProductEditorValue = {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  type: string;
  description: string;
  craftStory: string;
  artisanNote: string;
  giTag: string;
  pricePaise: number;
  mrpPaise: number;
  hsn: string;
  weave: string;
  fabric: string;
  work: string;
  occasion: string;
  color: string;
  motif: string;
  border: string;
  pallu: string;
  lengthMeters: number;
  blousePiece: boolean;
  weightFeel: string;
  care: string;
  featured: boolean;
  published: boolean;
  madeToOrder: boolean;
  stock: number;
  variantId: string;
  collectionIds: string[];
  images: { id: string; url: string; alt: string }[];
};

const empty: ProductEditorValue = {
  name: "",
  slug: "",
  sku: "",
  type: "Saree",
  description: "",
  craftStory: "",
  artisanNote: "",
  giTag: "",
  pricePaise: 0,
  mrpPaise: 0,
  hsn: "6211",
  weave: "Kanjivaram",
  fabric: "Silk",
  work: "Zari",
  occasion: "Wedding",
  color: "",
  motif: "",
  border: "",
  pallu: "",
  lengthMeters: 5.5,
  blousePiece: true,
  weightFeel: "Medium",
  care: "Dry clean only",
  featured: false,
  published: true,
  madeToOrder: false,
  stock: 1,
  variantId: "",
  collectionIds: [],
  images: [],
};

function Inp({
  name,
  label,
  defaultValue,
  type = "text",
  textarea,
}: {
  name: string;
  label: string;
  defaultValue?: string | number;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">{label}</span>
      {textarea ? (
        <textarea name={name} rows={4} defaultValue={defaultValue} className="mt-2 w-full border border-[var(--line)] bg-[var(--ivory)] px-3 py-2" />
      ) : (
        <input name={name} type={type} defaultValue={defaultValue} className="mt-2 min-h-11 w-full border border-[var(--line)] bg-[var(--ivory)] px-3" />
      )}
    </label>
  );
}

export function ProductEditor({
  product,
  collections,
}: {
  product?: ProductEditorValue;
  collections: CollectionOpt[];
}) {
  const p = product ?? empty;
  return (
    <form action={saveProduct} className="mt-8 space-y-5">
      {p.id ? <input type="hidden" name="id" value={p.id} /> : null}
      <input type="hidden" name="variantId" value={p.variantId} />
      <div className="grid gap-5 md:grid-cols-2">
        <Inp name="name" label="Name" defaultValue={p.name} />
        <Inp name="sku" label="SKU" defaultValue={p.sku} />
        <Inp name="slug" label="URL slug (blank = from name)" defaultValue={p.slug} />
        <Inp name="type" label="Type" defaultValue={p.type} />
        <Inp name="price" label="Price ₹" type="number" defaultValue={Math.round(p.pricePaise / 100) || ""} />
        <Inp name="mrp" label="MRP ₹" type="number" defaultValue={Math.round(p.mrpPaise / 100) || ""} />
        <Inp name="stock" label="Stock" type="number" defaultValue={p.stock} />
        <Inp name="hsn" label="HSN" defaultValue={p.hsn} />
        <Inp name="weave" label="Weave" defaultValue={p.weave} />
        <Inp name="fabric" label="Fabric" defaultValue={p.fabric} />
        <Inp name="work" label="Work" defaultValue={p.work} />
        <Inp name="occasion" label="Occasion" defaultValue={p.occasion} />
        <Inp name="color" label="Colour" defaultValue={p.color} />
        <Inp name="weightFeel" label="Weight" defaultValue={p.weightFeel} />
        <Inp name="lengthMeters" label="Length (m)" type="number" defaultValue={p.lengthMeters} />
        <Inp name="care" label="Care" defaultValue={p.care} />
      </div>
      <Inp name="description" label="Description" defaultValue={p.description} textarea />
      <Inp name="craftStory" label="Craft story" defaultValue={p.craftStory} textarea />
      <div className="grid gap-5 md:grid-cols-2">
        <Inp name="artisanNote" label="Artisan note" defaultValue={p.artisanNote} />
        <Inp name="giTag" label="GI tag" defaultValue={p.giTag} />
        <Inp name="motif" label="Motif" defaultValue={p.motif} />
        <Inp name="border" label="Border" defaultValue={p.border} />
        <Inp name="pallu" label="Pallu" defaultValue={p.pallu} />
      </div>
      <fieldset>
        <legend className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Collections</legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {collections.map((c) => (
            <label key={c.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="collectionId" value={c.id} defaultChecked={p.collectionIds.includes(c.id)} />
              {c.name}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="published" defaultChecked={p.published} /> Live
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="featured" defaultChecked={p.featured} /> Bestseller
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="blousePiece" defaultChecked={p.blousePiece} /> Blouse piece
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="madeToOrder" defaultChecked={p.madeToOrder} /> Made to order
        </label>
      </div>
      {p.images.length ? (
        <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
          {p.images.map((img) => (
            <div key={img.id} className="border border-[var(--line)] p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt} className="aspect-[3/4] w-full object-cover" />
              <form action={deleteProductImage} className="mt-2">
                <input type="hidden" name="imageId" value={img.id} />
                <input type="hidden" name="productId" value={p.id} />
                <button className="text-xs underline">Remove photo</button>
              </form>
            </div>
          ))}
        </div>
      ) : null}
      <label className="block text-sm">
        <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">Add photographs</span>
        <input name="photos" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="mt-2 block w-full text-sm" />
      </label>
      <button className="min-h-12 bg-[var(--forest)] px-8 text-[var(--ivory)]">Save drape</button>
    </form>
  );
}
