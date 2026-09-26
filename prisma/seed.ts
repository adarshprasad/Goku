import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const photo = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

const pics = {
  baby: "photo-1515488042361-ee00e0ddd4e4",
  crib: "photo-1522771739844-6a9f6d5f14af",
  feet: "photo-1555252333-9f8e92e65df9",
  hold: "photo-1471286174890-9c112ffca5b4",
  mother: "photo-1492725764893-90b379c2b6e7",
  soft: "photo-1522771930-78848d9293e8",
  cloth: "photo-1612423284934-2850a4ea6b0f",
  knit: "photo-1617331721458-bd3bd6898f29",
};

type Piece = { name: string; qty: number };
type Break = { minQty: number; pricePaise: number };

type SeedProduct = {
  slug: string;
  sku: string;
  name: string;
  audience: "hospital" | "mother" | "baby";
  category: string;
  ageRange: string;
  packOf: number;
  description: string;
  pieces: Piece[];
  price: number;
  mrp: number;
  fabric: string;
  color: string;
  care: string;
  featured?: boolean;
  hospitalOnly?: boolean;
  minOrderQty?: number;
  breaks?: Break[];
  stock: number;
  collections: string[];
  photo: string;
  variants?: { name: string; sku: string; stock: number; price?: number }[];
};

const products: SeedProduct[] = [
  {
    slug: "first-day-hospital-kit",
    sku: "YJU-HK-001",
    name: "First-day hospital kit",
    audience: "baby",
    category: "hospital-kit",
    ageRange: "Newborn",
    packOf: 1,
    description:
      "The set a maternity ward hands a newborn: jabla, muslin nappies, swaddles, and a hooded towel. Every piece is pre-washed, softened, and sealed.",
    pieces: [
      { name: "Snap jabla", qty: 3 },
      { name: "Muslin nappy", qty: 5 },
      { name: "Swaddle", qty: 2 },
      { name: "Hooded towel", qty: 1 },
    ],
    price: 899,
    mrp: 1299,
    fabric: "Cotton muslin",
    color: "Ivory",
    care: "Machine wash cold, dry in shade. Already washed once before packing.",
    featured: true,
    minOrderQty: 10,
    breaks: [
      { minQty: 10, pricePaise: 74900 },
      { minQty: 50, pricePaise: 69900 },
      { minQty: 100, pricePaise: 64900 },
    ],
    stock: 400,
    collections: ["hospital-kits", "newborn"],
    photo: pics.baby,
  },
  {
    slug: "ward-monthly-carton",
    sku: "YJU-HK-020",
    name: "Ward monthly carton",
    audience: "hospital",
    category: "hospital-kit",
    ageRange: "Newborn",
    packOf: 20,
    description:
      "Twenty sealed first-day kits in one carton for the maternity store. Hospital accounts only. Contents match the first-day kit.",
    pieces: [{ name: "First-day hospital kit", qty: 20 }],
    price: 0,
    mrp: 0,
    fabric: "Cotton muslin",
    color: "Ivory",
    care: "Keep sealed until the birth. Each inner set is pre-washed.",
    hospitalOnly: true,
    minOrderQty: 1,
    breaks: [
      { minQty: 1, pricePaise: 1299000 },
      { minQty: 5, pricePaise: 1199000 },
    ],
    stock: 40,
    collections: ["hospital-kits"],
    photo: pics.soft,
  },
  {
    slug: "mother-baby-going-home",
    sku: "YJU-MB-001",
    name: "Mother & baby going-home set",
    audience: "mother",
    category: "hospital-kit",
    ageRange: "Newborn",
    packOf: 1,
    description:
      "What a new mother packs for the hospital and the ride home: a feeding gown for her, and a pre-washed set for the baby.",
    pieces: [
      { name: "Feeding gown", qty: 1 },
      { name: "Jabla", qty: 2 },
      { name: "Muslin nappy", qty: 3 },
      { name: "Swaddle", qty: 1 },
    ],
    price: 1499,
    mrp: 1999,
    fabric: "Cotton",
    color: "Blush",
    care: "Machine wash cold. Baby pieces are pre-washed before packing.",
    featured: true,
    stock: 80,
    collections: ["for-mothers", "newborn"],
    photo: pics.mother,
    variants: [
      { name: "Mother S", sku: "YJU-MB-001-S", stock: 20 },
      { name: "Mother M", sku: "YJU-MB-001-M", stock: 30 },
      { name: "Mother L", sku: "YJU-MB-001-L", stock: 20 },
      { name: "Mother XL", sku: "YJU-MB-001-XL", stock: 10 },
    ],
  },
  {
    slug: "snap-jabla-pack",
    sku: "YJU-JB-003",
    name: "Snap jabla, pack of 3",
    audience: "baby",
    category: "jabla",
    ageRange: "0–3 months",
    packOf: 3,
    description: "Front-snap jablas in soft cotton. Pre-washed so the first wear is not a stiff new cloth.",
    pieces: [{ name: "Snap jabla", qty: 3 }],
    price: 449,
    mrp: 599,
    fabric: "Cotton",
    color: "Assorted prints",
    care: "Machine wash cold, dry in shade.",
    featured: true,
    stock: 120,
    collections: ["newborn"],
    photo: pics.feet,
  },
  {
    slug: "muslin-nappy-pack",
    sku: "YJU-NP-005",
    name: "Muslin nappy, pack of 5",
    audience: "baby",
    category: "nappy",
    ageRange: "Newborn",
    packOf: 5,
    description: "Four-layer muslin langots for the first months. Washed before they are packed.",
    pieces: [{ name: "Muslin nappy", qty: 5 }],
    price: 299,
    mrp: 399,
    fabric: "Muslin",
    color: "White",
    care: "Hot wash allowed. Dry in the sun.",
    stock: 0,
    collections: ["newborn", "muslin"],
    photo: pics.cloth,
  },
  {
    slug: "cloud-muslin-set",
    sku: "YJU-MS-001",
    name: "Cloud muslin set",
    audience: "baby",
    category: "muslin",
    ageRange: "0–3 months",
    packOf: 1,
    description: "A swaddle, a burp cloth, and a light wrap in the same pre-washed muslin.",
    pieces: [
      { name: "Swaddle", qty: 1 },
      { name: "Burp cloth", qty: 2 },
      { name: "Wrapper", qty: 1 },
    ],
    price: 799,
    mrp: 999,
    fabric: "Muslin",
    color: "Sand",
    care: "Gentle wash, dry in shade.",
    featured: true,
    stock: 60,
    collections: ["muslin", "newborn"],
    photo: pics.crib,
  },
  {
    slug: "day-one-swaddle",
    sku: "YJU-SW-002",
    name: "Day-one swaddle, pack of 2",
    audience: "baby",
    category: "swaddle",
    ageRange: "Newborn",
    packOf: 2,
    description: "Two breathable swaddles, pre-washed and sealed, sized for a newborn curl.",
    pieces: [{ name: "Swaddle", qty: 2 }],
    price: 549,
    mrp: 749,
    fabric: "Muslin",
    color: "Ivory",
    care: "Machine wash cold.",
    stock: 70,
    collections: ["newborn", "muslin"],
    photo: pics.hold,
  },
  {
    slug: "hooded-bath-towel",
    sku: "YJU-TW-001",
    name: "Hooded bath towel",
    audience: "baby",
    category: "hooded-towel",
    ageRange: "0–3 months",
    packOf: 1,
    description: "A small hooded towel in cotton terry, washed once so the pile is not scratchy.",
    pieces: [{ name: "Hooded towel", qty: 1 }],
    price: 399,
    mrp: 499,
    fabric: "Cotton terry",
    color: "Sage",
    care: "Machine wash warm.",
    stock: 50,
    collections: ["newborn"],
    photo: pics.knit,
  },
  {
    slug: "feeding-gown",
    sku: "YJU-FD-001",
    name: "Feeding gown",
    audience: "mother",
    category: "feeding",
    ageRange: "Newborn",
    packOf: 1,
    description: "A front-open cotton gown for hospital nights and the first weeks of feeding at home.",
    pieces: [{ name: "Feeding gown", qty: 1 }],
    price: 999,
    mrp: 1499,
    fabric: "Cotton",
    color: "Clay",
    care: "Machine wash cold.",
    featured: true,
    stock: 40,
    collections: ["for-mothers"],
    photo: pics.mother,
    variants: [
      { name: "S", sku: "YJU-FD-001-S", stock: 8 },
      { name: "M", sku: "YJU-FD-001-M", stock: 12 },
      { name: "L", sku: "YJU-FD-001-L", stock: 12 },
      { name: "XL", sku: "YJU-FD-001-XL", stock: 8 },
    ],
  },
];

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.orderEvent.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.returnRequest.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productPairing.deleteMany();
  await prisma.collectionProduct.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.addon.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.journalPost.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.address.deleteMany();
  await prisma.measurementProfile.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.hospitalAccount.deleteMany();
  await prisma.user.deleteMany();
  await prisma.setting.deleteMany();

  const password = await bcrypt.hash("yaju123", 10);
  const adminPassword = await bcrypt.hash("yaju-admin", 10);
  const hospitalPassword = await bcrypt.hash("yaju-hospital", 10);

  const customer = await prisma.user.create({
    data: {
      email: "customer@yaju.in",
      name: "Meera Iyer",
      passwordHash: password,
      role: "CUSTOMER",
      phone: "9845011122",
    },
  });
  await prisma.user.create({
    data: {
      email: "admin@yaju.in",
      name: "Yaju desk",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });
  const hospitalUser = await prisma.user.create({
    data: {
      email: "hospital@yaju.in",
      name: "Ward sister",
      passwordHash: hospitalPassword,
      role: "HOSPITAL",
      phone: "9845099900",
      gstin: "29AAAAA0000A1Z5",
    },
  });
  await prisma.hospitalAccount.create({
    data: {
      userId: hospitalUser.id,
      hospitalName: "Indiranagar Maternity",
      city: "Bengaluru",
      gstin: "29AAAAA0000A1Z5",
      contactName: "Ward sister",
      phone: "9845099900",
      maternityBeds: 24,
      monthlyBirths: 80,
      wardLine1: "Maternity ward, 2nd floor",
      wardCity: "Bengaluru",
      wardState: "KA",
      wardPincode: "560038",
      status: "APPROVED",
      priceTier: "STANDARD",
    },
  });

  const collections = [
    {
      slug: "hospital-kits",
      name: "Hospital kits",
      tagline: "For the ward",
      description: "Pre-washed newborn sets packed for maternity wards.",
      image: photo(pics.baby),
      sortOrder: 1,
    },
    {
      slug: "for-mothers",
      name: "For new mothers",
      tagline: "Take-home sets",
      description: "Going-home sets and feeding wear.",
      image: photo(pics.mother),
      sortOrder: 2,
    },
    {
      slug: "newborn",
      name: "Newborn",
      tagline: "First months",
      description: "Jabla, nappy, swaddle, and towel.",
      image: photo(pics.soft),
      sortOrder: 3,
    },
    {
      slug: "muslin",
      name: "Muslin",
      tagline: "Breathable layers",
      description: "Pre-washed muslin for warm rooms.",
      image: photo(pics.crib),
      sortOrder: 4,
    },
  ];

  const colMap: Record<string, string> = {};
  for (const c of collections) {
    const row = await prisma.collection.create({ data: c });
    colMap[c.slug] = row.id;
  }

  const ids: Record<string, string> = {};
  for (const p of products) {
    const created = await prisma.product.create({
      data: {
        slug: p.slug,
        sku: p.sku,
        name: p.name,
        type: "Set",
        audience: p.audience,
        category: p.category,
        ageRange: p.ageRange,
        packOf: p.packOf,
        preWashed: true,
        contents: JSON.stringify(p.pieces),
        minOrderQty: p.minOrderQty ?? 1,
        hospitalOnly: p.hospitalOnly ?? false,
        priceBreaks: JSON.stringify(p.breaks ?? []),
        description: p.description,
        craftStory: p.pieces.map((piece) => `${piece.qty} × ${piece.name}`).join(", "),
        pricePaise: p.price * 100,
        mrpPaise: p.mrp * 100,
        hsn: "6111",
        weave: p.category,
        fabric: p.fabric,
        work: p.audience,
        occasion: p.ageRange,
        color: p.color,
        weightFeel: `Pack of ${p.packOf}`,
        care: p.care,
        featured: p.featured ?? false,
        inStock: p.stock > 0,
        images: {
          create: [0, 1].map((i) => ({
            url: photo(p.photo),
            alt: `Placeholder photo for ${p.name}. Replace with Yaju product photography.`,
            sortOrder: i,
          })),
        },
        variants: {
          create: (p.variants ?? [{ name: `Pack of ${p.packOf}`, sku: `${p.sku}-DEF`, stock: p.stock }]).map((v) => ({
            name: v.name,
            sku: v.sku,
            stock: v.stock,
            pricePaise: v.price ? v.price * 100 : null,
            color: p.color,
          })),
        },
        collections: { create: p.collections.map((slug) => ({ collectionId: colMap[slug] })) },
      },
    });
    ids[p.slug] = created.id;
  }

  await prisma.productPairing.createMany({
    data: [
      { productId: ids["mother-baby-going-home"], pairedId: ids["feeding-gown"] },
      { productId: ids["first-day-hospital-kit"], pairedId: ids["hooded-bath-towel"] },
      { productId: ids["cloud-muslin-set"], pairedId: ids["day-one-swaddle"] },
    ],
  });

  await prisma.addon.create({
    data: {
      slug: "gift-note",
      name: "Gift note",
      description: "A short note packed with a mother set.",
      pricePaise: 0,
      sku: "YJU-ADD-NOTE",
    },
  });

  await prisma.coupon.createMany({
    data: [
      { code: "SOFT10", type: "PERCENT", value: 10, minSubtotal: 100000, maxDiscount: 30000, active: true },
      { code: "FIRSTSET", type: "FIXED", value: 10000, minSubtotal: 79900, active: true },
      { code: "FREESHIP", type: "FREE_SHIP", value: 0, minSubtotal: 0, active: true },
    ],
  });

  await prisma.review.createMany({
    data: [
      {
        productId: ids["first-day-hospital-kit"],
        userId: customer.id,
        authorName: "Ananya",
        rating: 5,
        title: "Soft on day one",
        body: "The jabla did not feel new-stiff. We used the swaddle the night we came home.",
        verified: true,
      },
      {
        productId: ids["mother-baby-going-home"],
        authorName: "Farheen",
        rating: 5,
        title: "Everything for the hospital bag",
        body: "The feeding gown and the baby set arrived washed and packed. I did not have to shop twice.",
        verified: true,
      },
      {
        productId: ids["feeding-gown"],
        authorName: "Smita",
        rating: 4,
        title: "Easy at 3 am",
        body: "Front opening is simple. Cotton stayed soft after three washes.",
        verified: true,
      },
    ],
  });

  await prisma.journalPost.createMany({
    data: [
      {
        slug: "why-we-wash-before-we-pack",
        title: "Why we wash before we pack",
        excerpt: "Newborn skin should not be the first thing to rinse a new cloth.",
        body: "Each baby piece is washed, rinsed, dried in shade, and sealed. Hospitals receive sets, not loose garments that still need a home wash. Mothers get the same promise on retail sets.",
        image: photo(pics.soft),
      },
      {
        slug: "what-to-pack-for-the-hospital",
        title: "What to pack for the hospital",
        excerpt: "A short list for the bag you actually carry.",
        body: "For the baby: jabla, nappies, two swaddles, a towel. For you: a feeding gown that opens in front, and a set you can leave on after discharge. Yaju sells that as one going-home set.",
        image: photo(pics.mother),
      },
    ],
  });

  await prisma.banner.create({
    data: {
      title: "Soft from the first day",
      subtitle: "Pre-washed sets for hospitals and new mothers.",
      image: photo(pics.baby),
      href: "/shop",
      active: true,
      sort: 0,
    },
  });

  await prisma.setting.createMany({
    data: [
      { key: "originState", value: "KA" },
      { key: "freeShippingPaise", value: "800000" },
      { key: "enableCod", value: "true" },
    ],
  });

  console.log("Seeded Yaju. customer@yaju.in / yaju123 · admin@yaju.in / yaju-admin · hospital@yaju.in / yaju-hospital");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
