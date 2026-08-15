import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const img = (id: string, sig: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80&${sig}`;

const photos = [
  "photo-1610030469983-98e550d6193c",
  "photo-1583391733956-6c78276477e2",
  "photo-1594631661960-0ec055273205",
  "photo-1617627143750-d86bc21e42bb",
  "photo-1609106595812-96c62b6d0d8d",
  "photo-1596484552836-8a3995d48c1c",
  "photo-1572804013309-59a88b7e92f1",
  "photo-1617019114583-affb34d1b3cd",
  "photo-1567401893414-76b7b1e5a7a5",
  "photo-1595777457583-95e059d581b8",
];

type SeedProduct = {
  slug: string;
  sku: string;
  name: string;
  type: string;
  description: string;
  craftStory: string;
  artisanNote?: string;
  giTag?: string;
  price: number;
  mrp: number;
  weave: string;
  fabric: string;
  work: string;
  occasion: string;
  color: string;
  colorSecondary?: string;
  motif?: string;
  border?: string;
  pallu?: string;
  lengthMeters?: number;
  blousePiece?: boolean;
  weightFeel: string;
  care: string;
  featured?: boolean;
  stock: number;
  collections: string[];
  photo: number;
};

const products: SeedProduct[] = [
  {
    slug: "varanasi-moon-banarasi",
    sku: "HDK-BAN-001",
    name: "Varanasi Moon Banarasi",
    type: "Saree",
    description:
      "A moonlight kadhua Banarasi in ivory silk, woven with antique gold zari jaal. The pallu falls like temple steps — measured, luminous, ceremonial.",
    craftStory:
      "Kadhua is a discontinuous brocade technique from Varanasi where each motif is woven separately. A single jaal can take weeks on a pit loom.",
    artisanNote: "Woven by the Ansari atelier, Peeli Kothi.",
    giTag: "Banaras Brocades and Sarees",
    price: 28400, mrp: 32800,
    weave: "Banarasi", fabric: "Silk", work: "Zari", occasion: "Wedding",
    color: "Ivory", colorSecondary: "Gold", motif: "Jaal", border: "Temple", pallu: "Kadhua",
    weightFeel: "Heavy", care: "Dry clean only", featured: true, stock: 4,
    collections: ["wedding", "bridal", "handloom", "new-in"], photo: 0,
  },
  {
    slug: "kanchi-flame-kanjivaram",
    sku: "HDK-KAN-002",
    name: "Kanchi Flame Kanjivaram",
    type: "Saree",
    description:
      "Temple-border Kanjivaram in deep maroon with dual-shade korvai. Gold checks catch light as you walk — a classic for muhurtham.",
    craftStory:
      "Korvai joins contrasting body and border with interlocking weft. Kanchipuram weavers still work this join by hand.",
    artisanNote: "Silk from the Kanchipuram co-operative.",
    giTag: "Kancheepuram Silk",
    price: 31200, mrp: 36500,
    weave: "Kanjivaram", fabric: "Silk", work: "Zari", occasion: "Wedding",
    color: "Maroon", colorSecondary: "Gold", motif: "Checks", border: "Temple", pallu: "Broad zari",
    weightFeel: "Heavy", care: "Dry clean only", featured: true, stock: 3,
    collections: ["wedding", "bridal", "handloom"], photo: 1,
  },
  {
    slug: "chanderi-river-mist",
    sku: "HDK-CHA-003",
    name: "Chanderi River Mist",
    type: "Saree",
    description:
      "Translucent Chanderi in mist grey with silver bootis. Light enough for a noon wedding, formal enough for an evening aarti.",
    craftStory: "Chanderi handloom blends silk and cotton for a paper-fine drape with a dull-gold gleam.",
    giTag: "Chanderi Sarees",
    price: 9800, mrp: 12400,
    weave: "Chanderi", fabric: "Silk-cotton", work: "Booti", occasion: "Festive",
    color: "Grey", colorSecondary: "Silver", motif: "Booti", border: "Slim zari", pallu: "Plain with booti",
    weightFeel: "Light", care: "Gentle dry clean", featured: true, stock: 8,
    collections: ["festive", "handloom", "everyday"], photo: 2,
  },
  {
    slug: "pastel-organza-garden",
    sku: "HDK-ORG-004",
    name: "Pastel Organza Garden",
    type: "Saree",
    description:
      "Sheer organza in pistachio with hand-painted lotuses. Wear with a lined blouse; the drape photographs like watercolour.",
    craftStory: "Hand-painted organza from a Jaipur studio that treats each pallu as a miniature landscape.",
    price: 14600, mrp: 17200,
    weave: "Designer", fabric: "Organza", work: "Hand-painted", occasion: "Party",
    color: "Pistachio", colorSecondary: "Ivory", motif: "Lotus", border: "Painted vine", pallu: "Garden panel",
    blousePiece: true, weightFeel: "Light", care: "Dry clean only", featured: true, stock: 6,
    collections: ["festive", "new-in"], photo: 3,
  },
  {
    slug: "tussar-earth-story",
    sku: "HDK-TUS-005",
    name: "Tussar Earth Story",
    type: "Saree",
    description:
      "Raw tussar in warm sand with kantha running stitch along the border. A weekday heirloom — texture over shine.",
    craftStory: "Gopalpur tussar is reeled from wild silk cocoons; kantha is added in Bolpur.",
    price: 7200, mrp: 8900,
    weave: "Tussar", fabric: "Tussar silk", work: "Kantha", occasion: "Office",
    color: "Sand", motif: "Running stitch", border: "Kantha", pallu: "Plain",
    weightFeel: "Medium", care: "Gentle wash, dry in shade", stock: 10,
    collections: ["everyday", "handloom"], photo: 4,
  },
  {
    slug: "linen-coast-indigo",
    sku: "HDK-LIN-006",
    name: "Linen Coast Indigo",
    type: "Saree",
    description:
      "European-flax linen dyed in natural indigo, with a hand-drawn temple border in charcoal. Breathes in Bengaluru summers.",
    craftStory: "Indigo vats in Bagru; linen mill-woven then block-bordered.",
    price: 6400, mrp: 7800,
    weave: "Linen", fabric: "Linen", work: "Block print", occasion: "Casual",
    color: "Indigo", motif: "Temple line", border: "Block", pallu: "Graded indigo",
    weightFeel: "Light", care: "Gentle wash", stock: 12,
    collections: ["everyday", "new-in"], photo: 5,
  },
  {
    slug: "paithani-peacock-dusk",
    sku: "HDK-PAI-007",
    name: "Paithani Peacock Dusk",
    type: "Saree",
    description:
      "Classic Paithani with a peacock pallu in magenta and green. Oblique tapestry weave — the gold looks hammered, not printed.",
    craftStory: "Paithan weavers use tapestry interlocking so the pallu has no floats on the reverse.",
    giTag: "Paithani Sarees",
    price: 42000, mrp: 48000,
    weave: "Paithani", fabric: "Silk", work: "Zari", occasion: "Wedding",
    color: "Magenta", colorSecondary: "Green", motif: "Peacock", border: "Narali", pallu: "Peacock",
    weightFeel: "Heavy", care: "Dry clean only", featured: true, stock: 2,
    collections: ["wedding", "bridal", "handloom"], photo: 6,
  },
  {
    slug: "jamdani-cloud-white",
    sku: "HDK-JAM-008",
    name: "Jamdani Cloud White",
    type: "Saree",
    description:
      "Muslin jamdani with extra-weft flowers floating on white. A summer wedding essential — cool against skin.",
    craftStory: "Jamdani motifs are inlaid on the loom without a mechanical jacquard.",
    price: 11800, mrp: 13500,
    weave: "Jamdani", fabric: "Cotton muslin", work: "Extra-weft", occasion: "Festive",
    color: "White", colorSecondary: "Ivory", motif: "Floral", border: "Fine jamdani", pallu: "Scattered buti",
    weightFeel: "Light", care: "Gentle wash", stock: 7,
    collections: ["festive", "handloom"], photo: 7,
  },
  {
    slug: "ikkat-telangana-sunset",
    sku: "HDK-IKK-009",
    name: "Ikkat Telangana Sunset",
    type: "Saree",
    description:
      "Double ikat geometry in rust, black, and cream. The blur of the resist is the signature — not a flaw.",
    craftStory: "Pochampally double ikat ties warp and weft before dyeing.",
    giTag: "Pochampally Ikat",
    price: 8900, mrp: 10500,
    weave: "Ikkat", fabric: "Silk-cotton", work: "Ikat", occasion: "Festive",
    color: "Rust", colorSecondary: "Black", motif: "Geometry", border: "Ikat band", pallu: "Double ikat",
    weightFeel: "Medium", care: "Dry clean preferred", stock: 5,
    collections: ["festive", "handloom"], photo: 8,
  },
  {
    slug: "bandhani-gujarat-coral",
    sku: "HDK-BAN-010",
    name: "Bandhani Gujarat Coral",
    type: "Saree",
    description:
      "Gajji silk bandhani in coral with fine dots and a mirror-work blouse piece. Festive without heaviness.",
    craftStory: "Each dot is tied by hand before the dye bath in Jamnagar.",
    price: 10200, mrp: 12800,
    weave: "Bandhani", fabric: "Gajji silk", work: "Tie-dye", occasion: "Festive",
    color: "Coral", motif: "Bandhani dots", border: "Zari", pallu: "Bandhani",
    weightFeel: "Medium", care: "Dry clean only", stock: 6,
    collections: ["festive", "new-in"], photo: 9,
  },
  {
    slug: "crepe-midnight-sequin",
    sku: "HDK-CRE-011",
    name: "Crepe Midnight Sequin",
    type: "Saree",
    description:
      "Midnight crepe with sparse sequin constellations. A reception drape that does not fight jewellery.",
    craftStory: "Sequins are hand-placed in a Bengaluru atelier — density tapers toward the fall.",
    price: 13400, mrp: 15900,
    weave: "Designer", fabric: "Crepe", work: "Sequence", occasion: "Party",
    color: "Navy", motif: "Constellation", border: "None", pallu: "Sequin fade",
    weightFeel: "Medium", care: "Dry clean only", stock: 9,
    collections: ["festive"], photo: 0,
  },
  {
    slug: "georgette-rose-embroidery",
    sku: "HDK-GEO-012",
    name: "Georgette Rose Embroidery",
    type: "Saree",
    description:
      "Dusty rose georgette with resham roses on the pallu and a scalloped border. Soft drape for cocktail hours.",
    craftStory: "Resham embroidery from a Lucknow karigar who trained in chikankari before moving to colour.",
    price: 12100, mrp: 14800,
    weave: "Designer", fabric: "Georgette", work: "Embroidery", occasion: "Party",
    color: "Rose", motif: "Roses", border: "Scallop", pallu: "Embroidered",
    weightFeel: "Light", care: "Dry clean only", stock: 7,
    collections: ["festive", "new-in"], photo: 1,
  },
  {
    slug: "kanjivaram-peacock-green",
    sku: "HDK-KAN-013",
    name: "Kanjivaram Peacock Green",
    type: "Saree",
    description:
      "Emerald Kanjivaram with magenta korvai border — a South Indian wedding palette that photographs richly.",
    craftStory: "Contrast borders are a Kanchipuram signature; the join is the craft.",
    giTag: "Kancheepuram Silk",
    price: 26800, mrp: 31000,
    weave: "Kanjivaram", fabric: "Silk", work: "Zari", occasion: "Wedding",
    color: "Emerald", colorSecondary: "Magenta", motif: "Annams", border: "Korvai", pallu: "Broad zari",
    weightFeel: "Heavy", care: "Dry clean only", stock: 3,
    collections: ["wedding", "bridal", "handloom"], photo: 2,
  },
  {
    slug: "banarasi-wine-jangla",
    sku: "HDK-BAN-014",
    name: "Banarasi Wine Jangla",
    type: "Saree",
    description:
      "Wine silk with all-over jangla vines in gold. Bridal without the weight of a lehenga — sit, walk, bless.",
    craftStory: "Jangla is an all-over vine pattern historically reserved for wedding trousseaus.",
    giTag: "Banaras Brocades and Sarees",
    price: 35600, mrp: 41000,
    weave: "Banarasi", fabric: "Silk", work: "Zari", occasion: "Wedding",
    color: "Wine", colorSecondary: "Gold", motif: "Jangla", border: "Konia", pallu: "Shikargah",
    weightFeel: "Heavy", care: "Dry clean only", featured: true, stock: 2,
    collections: ["wedding", "bridal"], photo: 3,
  },
  {
    slug: "chanderi-marigold",
    sku: "HDK-CHA-015",
    name: "Chanderi Marigold",
    type: "Saree",
    description:
      "Mustard Chanderi with gold bootis — a Navratri and Haldi favourite. Pairs with uncut kundan.",
    craftStory: "Mustard is vat-dyed on silk-cotton in Chanderi town.",
    giTag: "Chanderi Sarees",
    price: 8600, mrp: 10200,
    weave: "Chanderi", fabric: "Silk-cotton", work: "Booti", occasion: "Festive",
    color: "Mustard", motif: "Booti", border: "Zari", pallu: "Gold stripe",
    weightFeel: "Light", care: "Gentle dry clean", stock: 11,
    collections: ["festive", "everyday"], photo: 4,
  },
  {
    slug: "organza-ivory-zardozi",
    sku: "HDK-ORG-016",
    name: "Organza Ivory Zardozi",
    type: "Saree",
    description:
      "Ivory organza with restrained zardozi on pallu and blouse. A civil ceremony piece — quiet luxury.",
    craftStory: "Zardozi in metal thread from a Lucknow workshop using antique gold plate.",
    price: 18900, mrp: 22500,
    weave: "Designer", fabric: "Organza", work: "Zardozi", occasion: "Wedding",
    color: "Ivory", colorSecondary: "Gold", motif: "Paisley", border: "Zardozi", pallu: "Zardozi panel",
    weightFeel: "Medium", care: "Dry clean only", stock: 4,
    collections: ["wedding", "bridal", "new-in"], photo: 5,
  },
  {
    slug: "cotton-handloom-coral-check",
    sku: "HDK-COT-017",
    name: "Cotton Handloom Coral Check",
    type: "Saree",
    description:
      "Fine cotton checks in coral and cream from a Tamil Nadu co-op. Office to dinner without a change of jewellery.",
    craftStory: "Coimbatore mill-spun yarn, handloomed in 6-yard warps.",
    price: 4200, mrp: 5200,
    weave: "Handloom cotton", fabric: "Cotton", work: "None", occasion: "Office",
    color: "Coral", colorSecondary: "Cream", motif: "Checks", border: "Pin", pallu: "Check",
    weightFeel: "Light", care: "Gentle wash", stock: 14,
    collections: ["everyday", "handloom"], photo: 6,
  },
  {
    slug: "linen-rose-dust",
    sku: "HDK-LIN-018",
    name: "Linen Rose Dust",
    type: "Saree",
    description:
      "Dusty rose linen with a raw selvedge border. For women who prefer matte fabric and gold hoops.",
    craftStory: "Belgian flax, dyed in Panipat, finished in Bengaluru.",
    price: 6800, mrp: 8100,
    weave: "Linen", fabric: "Linen", work: "None", occasion: "Casual",
    color: "Rose", motif: "Plain", border: "Selvedge", pallu: "Self",
    weightFeel: "Light", care: "Gentle wash", stock: 9,
    collections: ["everyday"], photo: 7,
  },
  {
    slug: "banarasi-black-kadhua",
    sku: "HDK-BAN-019",
    name: "Banarasi Black Kadhua",
    type: "Saree",
    description:
      "Black silk with sparse kadhua florals in antique gold. Evening wear that reads couture, not costume.",
    craftStory: "Black takes longer to dye evenly on mulberry silk; the kadhua is kept sparse on purpose.",
    giTag: "Banaras Brocades and Sarees",
    price: 29800, mrp: 34000,
    weave: "Banarasi", fabric: "Silk", work: "Zari", occasion: "Party",
    color: "Black", colorSecondary: "Gold", motif: "Floral kadhua", border: "Slim", pallu: "Kadhua",
    weightFeel: "Medium", care: "Dry clean only", featured: true, stock: 3,
    collections: ["festive", "wedding"], photo: 8,
  },
  {
    slug: "kanjivaram-mustard-temple",
    sku: "HDK-KAN-020",
    name: "Kanjivaram Mustard Temple",
    type: "Saree",
    description:
      "Mustard Kanjivaram with a wide temple border in maroon. A festival workhorse — durable silk, true colour.",
    giTag: "Kancheepuram Silk",
    craftStory: "Temple borders echo gopuram silhouettes; mustard is a harvest colour in Tamil Nadu.",
    price: 22400, mrp: 25900,
    weave: "Kanjivaram", fabric: "Silk", work: "Zari", occasion: "Festive",
    color: "Mustard", colorSecondary: "Maroon", motif: "Temple", border: "Temple", pallu: "Zari",
    weightFeel: "Heavy", care: "Dry clean only", stock: 5,
    collections: ["festive", "handloom"], photo: 9,
  },
  {
    slug: "silk-blouse-ivory-brocade",
    sku: "HDK-BLO-021",
    name: "Ivory Brocade Blouse",
    type: "Blouse",
    description:
      "Ready blouse in ivory brocade. Princess seam, lined, hook-and-eye back. Pair with organza or Banarasi.",
    craftStory: "Cut in our Bengaluru studio on Banarasi leftover looms — waste-nothing tailoring.",
    price: 4800, mrp: 5600,
    weave: "Banarasi", fabric: "Silk", work: "Zari", occasion: "Wedding",
    color: "Ivory", motif: "Brocade", border: "None", pallu: "n/a",
    lengthMeters: 0, blousePiece: false, weightFeel: "Medium", care: "Dry clean only", stock: 8,
    collections: ["wedding"], photo: 0,
  },
  {
    slug: "temple-coin-necklace",
    sku: "HDK-JWL-022",
    name: "Temple Coin Necklace",
    type: "Jewelry",
    description:
      "Gold-plated temple coins on a short necklace. Closes the look on Kanjivaram and Banarasi without competing.",
    craftStory: "Inspired by antique kasu malai; plated in a Hallmark-adjacent workshop in Chennai.",
    price: 3200, mrp: 3900,
    weave: "Designer", fabric: "Metal", work: "Temple", occasion: "Festive",
    color: "Gold", motif: "Coin", border: "n/a", pallu: "n/a",
    lengthMeters: 0, blousePiece: false, weightFeel: "Light", care: "Wipe with dry cloth", stock: 20,
    collections: ["festive", "wedding"], photo: 1,
  },
  {
    slug: "silk-care-kit",
    sku: "HDK-KIT-023",
    name: "Silk Care Kit",
    type: "Care kit",
    description:
      "Muslin storage bag, cedar block, and a pH-neutral silk wipe. Keep zari from tarnish and folds from setting.",
    craftStory: "Packed in Bengaluru; muslin from the same mills as our cotton handlooms.",
    price: 980, mrp: 1200,
    weave: "Designer", fabric: "Muslin", work: "None", occasion: "Casual",
    color: "Ivory", motif: "None", border: "n/a", pallu: "n/a",
    lengthMeters: 0, blousePiece: false, weightFeel: "Light", care: "Keep dry", stock: 40,
    collections: ["everyday"], photo: 2,
  },
  {
    slug: "huduku-gift-card",
    sku: "HDK-GFT-024",
    name: "Huduku Gift Card — ₹5,000",
    type: "Gift card",
    description:
      "A digital atelier credit. Perfect when you know her taste is better than your guess. Delivered by email.",
    craftStory: "Redeemable on any Huduku drape, blouse, or finishing service.",
    price: 5000, mrp: 5000,
    weave: "Designer", fabric: "Digital", work: "None", occasion: "Casual",
    color: "Maroon", motif: "Wordmark", border: "n/a", pallu: "n/a",
    lengthMeters: 0, blousePiece: false, weightFeel: "Light", care: "n/a", stock: 99,
    collections: ["new-in"], photo: 3,
  },
];

const collections = [
  { slug: "wedding", name: "Wedding", tagline: "Muhurtham silks", description: "Banarasi, Kanjivaram, and Paithani for the days that become family photographs.", image: img(photos[1], "c=wedding") },
  { slug: "bridal", name: "Bridal", tagline: "The first drape", description: "Heavier zari, temple borders, and pallus that carry a blessing.", image: img(photos[0], "c=bridal") },
  { slug: "festive", name: "Festive", tagline: "Light that holds colour", description: "Chanderi, organza, bandhani, and party crepes for Navratri to New Year.", image: img(photos[3], "c=festive") },
  { slug: "everyday", name: "Everyday", tagline: "Handloom for weekdays", description: "Linen, cotton, and tussar — beauty that survives a full calendar.", image: img(photos[5], "c=everyday") },
  { slug: "handloom", name: "Handloom", tagline: "GI weaves, named artisans", description: "Pieces with a place of origin and a pair of hands you can name.", image: img(photos[4], "c=handloom") },
  { slug: "new-in", name: "New-in", tagline: "This moon’s arrivals", description: "The newest warps from Varanasi, Kanchipuram, and our Bengaluru studio.", image: img(photos[2], "c=new") },
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
  await prisma.user.deleteMany();
  await prisma.setting.deleteMany();

  const adminHash = await bcrypt.hash("huduku-admin", 10);
  const customerHash = await bcrypt.hash("huduku123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@huduku.in",
      name: "Huduku Atelier",
      passwordHash: adminHash,
      role: "ADMIN",
      phone: "+918045672100",
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: "customer@huduku.in",
      name: "Ananya Rao",
      passwordHash: customerHash,
      role: "CUSTOMER",
      phone: "+919900112233",
    },
  });

  await prisma.address.create({
    data: {
      userId: customer.id,
      fullName: "Ananya Rao",
      phone: "9900112233",
      line1: "42, 4th Cross, Indiranagar",
      city: "Bengaluru",
      state: "KA",
      pincode: "560038",
      isDefault: true,
    },
  });

  const colMap: Record<string, string> = {};
  for (const c of collections) {
    const row = await prisma.collection.create({ data: c });
    colMap[c.slug] = row.id;
  }

  const productIds: Record<string, string> = {};

  for (const p of products) {
    const created = await prisma.product.create({
      data: {
        slug: p.slug,
        sku: p.sku,
        name: p.name,
        type: p.type,
        description: p.description,
        craftStory: p.craftStory,
        artisanNote: p.artisanNote,
        giTag: p.giTag,
        pricePaise: p.price * 100,
        mrpPaise: p.mrp * 100,
        weave: p.weave,
        fabric: p.fabric,
        work: p.work,
        occasion: p.occasion,
        color: p.color,
        colorSecondary: p.colorSecondary,
        motif: p.motif,
        border: p.border,
        pallu: p.pallu,
        lengthMeters: p.lengthMeters ?? 5.5,
        blousePiece: p.blousePiece ?? p.type === "Saree",
        weightFeel: p.weightFeel,
        care: p.care,
        modelHeightCm: p.type === "Saree" ? 170 : null,
        modelBlouseSize: p.type === "Saree" ? "M (36)" : null,
        featured: p.featured ?? false,
        images: {
          create: [0, 1, 2].map((i) => ({
            url: img(photos[(p.photo + i) % photos.length], `p=${p.sku}-${i}`),
            alt: `${p.name} — view ${i + 1}`,
            sortOrder: i,
            kind: i === 2 ? "detail" : "gallery",
          })),
        },
        variants: {
          create:
            p.type === "Blouse"
              ? ["32", "34", "36", "38"].map((size, i) => ({
                  name: `Bust ${size}`,
                  sku: `${p.sku}-${size}`,
                  blouseSize: size,
                  stock: i === 2 ? p.stock : 2,
                }))
              : [
                  {
                    name: p.color,
                    sku: `${p.sku}-DEF`,
                    color: p.color,
                    stock: p.stock,
                  },
                ],
        },
        collections: {
          create: p.collections.map((slug) => ({ collectionId: colMap[slug] })),
        },
      },
    });
    productIds[p.slug] = created.id;
  }

  await prisma.productPairing.createMany({
    data: [
      { productId: productIds["varanasi-moon-banarasi"], pairedId: productIds["silk-blouse-ivory-brocade"] },
      { productId: productIds["varanasi-moon-banarasi"], pairedId: productIds["temple-coin-necklace"] },
      { productId: productIds["pastel-organza-garden"], pairedId: productIds["silk-blouse-ivory-brocade"] },
      { productId: productIds["kanchi-flame-kanjivaram"], pairedId: productIds["temple-coin-necklace"] },
    ],
  });

  await prisma.addon.createMany({
    data: [
      { slug: "fall-pico", name: "Fall & pico", description: "Cotton fall and pico finish, 4–5 working days.", pricePaise: 45000, sku: "HDK-ADD-FALL" },
      { slug: "pre-pleating", name: "Pre-pleating", description: "Knife pleats stitched for a ready drape.", pricePaise: 120000, sku: "HDK-ADD-PLEAT" },
      { slug: "blouse-stitching", name: "Blouse stitching", description: "Studio stitch from standard size or your measurements.", pricePaise: 180000, sku: "HDK-ADD-BLOUSE" },
      { slug: "gift-wrap", name: "Gift wrap + note", description: "Muslin wrap and a handwritten Kannada/English note.", pricePaise: 25000, sku: "HDK-ADD-GIFT" },
    ],
  });

  await prisma.coupon.createMany({
    data: [
      { code: "HUDUKU10", type: "PERCENT", value: 10, minSubtotal: 500000, maxDiscount: 400000, active: true },
      { code: "FIRSTDRAPE", type: "FIXED", value: 75000, minSubtotal: 800000, active: true },
      { code: "FREESHIP", type: "FREE_SHIP", value: 0, minSubtotal: 0, active: true },
    ],
  });

  await prisma.review.createMany({
    data: [
      {
        productId: productIds["varanasi-moon-banarasi"],
        userId: customer.id,
        authorName: "Ananya Rao",
        rating: 5,
        title: "The pallu is architecture",
        body: "Zari is antique, not brassy. Draped for my cousin’s muhurtham in Mysuru — compliments all evening.",
        verified: true,
      },
      {
        productId: productIds["linen-coast-indigo"],
        authorName: "Meera K",
        rating: 5,
        title: "Weekday silk alternative",
        body: "Indigo held after two gentle washes. The temple line is crisp. I wear it to the studio.",
        verified: true,
      },
      {
        productId: productIds["chanderi-river-mist"],
        authorName: "Divya S",
        rating: 4,
        title: "Light as claimed",
        body: "True to the mist grey on screen. Needed a lined blouse, which Huduku stitched in five days.",
        verified: true,
      },
    ],
  });

  await prisma.journalPost.createMany({
    data: [
      {
        slug: "how-to-drape-a-kanjivaram",
        title: "How to drape a Kanjivaram so the korvai shows",
        excerpt: "Temple borders deserve a 1.5-pleat start and a pallu that sits on the left shoulder, not the arm.",
        body: "Start with a well-tucked first turn at the right waist. Keep pleats no wider than three fingers so the checks stay graphic. The korvai join should sit just below the blouse hem — that is the craft, not a seam to hide.\n\nHuduku’s pre-pleating service locks this geometry if you would rather walk into the hall already finished.",
        image: img(photos[1], "j=drape"),
      },
      {
        slug: "banarasi-kadhua-vs-cutwork",
        title: "Kadhua or cutwork: reading a Banarasi",
        excerpt: "Turn the saree over. If the motif is as finished on the reverse, you are holding kadhua.",
        body: "Cutwork clips extra weft; kadhua weaves each flower independently. The latter costs time and therefore gold. At Huduku we label both honestly — including when a piece is powerloom with hand finishing.",
        image: img(photos[0], "j=kadhua"),
      },
      {
        slug: "fall-pico-and-why-it-matters",
        title: "Fall, pico, and why your hem should not fray at a wedding",
        excerpt: "A cotton fall gives the pleats a spine. Pico seals the edge. Neither is optional on silk.",
        body: "We use cotton fall, never satin, on silk — it grips the petticoat. Pico is rolled, not overlocked, on handloom so the edge can still breathe. Add it at checkout; we return the saree ready to tuck.",
        image: img(photos[4], "j=fall"),
      },
    ],
  });

  await prisma.banner.create({
    data: {
      title: "The monsoon edit",
      subtitle: "Chanderi, linen, and organza for rooms with old fans and new jewellery.",
      image: img(photos[2], "b=hero"),
      href: "/collections/festive",
      active: true,
      sort: 0,
    },
  });

  await prisma.setting.createMany({
    data: [
      { key: "originState", value: "KA" },
      { key: "freeShippingPaise", value: "800000" },
      { key: "enableCod", value: "true" },
      { key: "enableInternational", value: "false" },
    ],
  });

  console.log("Seeded Huduku atelier. Admin admin@huduku.in / huduku-admin");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
