/**
 * Seed script — populates the database with realistic product data.
 * Run: node server/seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { User, Product } = require('./models');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gadgetgo';

// Create a demo owner account if it doesn't exist
async function getOrCreateOwner() {
  let owner = await User.findOne({ email: 'store@gadgetgo.com' });
  if (!owner) {
    owner = await User.create({
      name: "Amit's Electronics",
      email: 'store@gadgetgo.com',
      password: '$2b$10$dummyhashnotusedforlogin000000000000000000000',
      phone: '+919000000001',
      role: 'owner',
      isPhoneVerified: true,
      isEmailVerified: true,
    });
    console.log('✅ Created demo owner: store@gadgetgo.com');
  }
  return owner;
}

const products = [
  // ─── LAPTOPS ──────────────────────────────────────────
  {
    title: "MacBook Pro M2 14-inch (2023) | 16GB Unified RAM | 512GB SSD | Pristine Condition",
    brand: "Apple",
    description: "Supercharged by M2 Pro, this MacBook Pro is perfect for heavy tasks like video editing, coding, and 3D rendering. Pristine condition with no scratches. Comes with original charger and box.",
    category: "laptops",
    pricePerDay: 400,
    actualPrice: 199900,
    damageDeposit: 5000,
    specs: { Processor: "Apple M2 Pro", RAM: "16GB Unified", Storage: "512GB SSD", Display: "14.2-inch Liquid Retina XDR", Battery: "Up to 17 hrs" },
    rating: 4.8, totalRatings: 463, rentedCount: 142, manufactureDate: "Feb 2023", delivery: "Tomorrow 8 am - 12 pm", sponsored: true,
  },
  {
    title: "Dell XPS 15 OLED Touchscreen | Intel Core i7 13th Gen | Content Creator Laptop",
    brand: "Dell",
    description: "Stunning 3.5K OLED touchscreen with 100% DCI-P3 color gamut. Perfect for photographers, video editors, and designers. Includes Dell premium support warranty.",
    category: "laptops",
    pricePerDay: 350,
    actualPrice: 159900,
    damageDeposit: 4500,
    specs: { Processor: "Intel Core i7-13700H", RAM: "16GB DDR5", Storage: "512GB NVMe SSD", Display: "15.6-inch 3.5K OLED Touch", GPU: "NVIDIA RTX 4050" },
    rating: 4.2, totalRatings: 120, rentedCount: 56, manufactureDate: "Mar 2023", delivery: "Sunday, 27 Apr", sponsored: false,
  },
  {
    title: "Lenovo Legion Pro 5 Gaming Laptop | RTX 4070 | 165Hz Display | Great for eSports",
    brand: "Lenovo",
    description: "Built for competitive gaming with a blazing 165Hz display and RTX 4070. Run AAA titles at ultra settings. RGB keyboard with per-key lighting.",
    category: "laptops",
    pricePerDay: 500,
    actualPrice: 179900,
    damageDeposit: 6000,
    specs: { Processor: "AMD Ryzen 7 7745HX", RAM: "16GB DDR5", Storage: "1TB NVMe SSD", Display: "16-inch WQXGA 165Hz", GPU: "NVIDIA RTX 4070 8GB" },
    rating: 4.9, totalRatings: 89, rentedCount: 78, manufactureDate: "Jun 2023", delivery: "Tomorrow", sponsored: true,
  },
  {
    title: "HP Spectre x360 2-in-1 Touch | Intel Core i5 | Pen Included | Ultra Portable",
    brand: "HP",
    description: "Elegant 2-in-1 convertible with included HP stylus pen. Perfect for note-taking, sketching, and presentations. Folds into tablet mode for reading.",
    category: "laptops",
    pricePerDay: 280,
    actualPrice: 139900,
    damageDeposit: 3500,
    specs: { Processor: "Intel Core i5-1340P", RAM: "16GB LPDDR5", Storage: "512GB SSD", Display: "13.5-inch 3K2K OLED Touch", Weight: "1.36 kg" },
    rating: 4.5, totalRatings: 56, rentedCount: 34, manufactureDate: "Apr 2023", delivery: "Sunday, 27 Apr", sponsored: false,
  },
  {
    title: "ASUS ROG Strix G16 | RTX 4060 | Intel i9 | eSports Ready",
    brand: "ASUS",
    description: "Powerful gaming laptop with Intel i9 processor and RTX 4060. Features advanced cooling with liquid metal thermal compound. MUX switch for maximum gaming performance.",
    category: "laptops",
    pricePerDay: 450,
    actualPrice: 164900,
    damageDeposit: 5500,
    specs: { Processor: "Intel Core i9-13980HX", RAM: "16GB DDR5", Storage: "1TB NVMe SSD", Display: "16-inch QHD 240Hz", GPU: "NVIDIA RTX 4060 8GB" },
    rating: 4.6, totalRatings: 203, rentedCount: 91, manufactureDate: "May 2023", delivery: "Tomorrow", sponsored: false,
  },

  // ─── CAMERAS ──────────────────────────────────────────
  {
    title: "Sony A7IV Mirrorless Camera Body | 33MP Full-Frame | 4K 60p Video",
    brand: "Sony",
    description: "The perfect hybrid camera for photo and video. 33MP full-frame sensor with real-time Eye AF for both humans and animals. 10fps burst shooting. S-Cinetone color science.",
    category: "cameras",
    pricePerDay: 600,
    actualPrice: 198990,
    damageDeposit: 8000,
    specs: { Sensor: "33MP Full-Frame Exmor R", Video: "4K 60fps / 1080p 120fps", AF: "759 Phase-Detection Points", Stabilization: "5-axis IBIS", "Battery Life": "580 shots" },
    rating: 4.9, totalRatings: 320, rentedCount: 98, manufactureDate: "Jan 2023", delivery: "Monday, 28 Apr", sponsored: true,
  },
  {
    title: "Canon EOS R5 Mirrorless Camera | 8K Video | 45MP | Professional Grade",
    brand: "Canon",
    description: "Canon's flagship mirrorless camera with 8K RAW video recording and 45MP full-frame sensor. Dual card slots (CFexpress + SD). Animal detection autofocus.",
    category: "cameras",
    pricePerDay: 800,
    actualPrice: 339990,
    damageDeposit: 12000,
    specs: { Sensor: "45MP Full-Frame CMOS", Video: "8K 30fps / 4K 120fps", AF: "Dual Pixel CMOS AF II", Stabilization: "8-stop IBIS", "Card Slots": "CFexpress + SD UHS-II" },
    rating: 4.8, totalRatings: 210, rentedCount: 67, manufactureDate: "Sep 2022", delivery: "Tuesday, 29 Apr", sponsored: false,
  },
  {
    title: "Nikon Z6 III Mirrorless | 24.5MP | Partially Stacked Sensor | Video Beast",
    brand: "Nikon",
    description: "Nikon's latest mirrorless with a partially stacked CMOS sensor for blazing readout speed. Excellent low-light performance with native ISO 100-64000. N-Log and HLG video profiles.",
    category: "cameras",
    pricePerDay: 550,
    actualPrice: 219990,
    damageDeposit: 7000,
    specs: { Sensor: "24.5MP Partially Stacked CMOS", Video: "6K 60fps / 4K 120fps", AF: "299 Focus Points", Stabilization: "6-stop IBIS", EVF: "5.76M-dot Blackout-Free" },
    rating: 4.7, totalRatings: 145, rentedCount: 52, manufactureDate: "Jun 2024", delivery: "Tomorrow", sponsored: true,
  },
  {
    title: "Canon EOS R50 Mirrorless | Beginner Friendly | 24.2MP | Compact & Light",
    brand: "Canon",
    description: "Perfect for beginners and vloggers. Lightweight APS-C mirrorless with excellent autofocus and flip-out screen. Creative Assist mode for easy shooting.",
    category: "cameras",
    pricePerDay: 250,
    actualPrice: 72990,
    damageDeposit: 3000,
    specs: { Sensor: "24.2MP APS-C CMOS", Video: "4K 30fps / 1080p 120fps", AF: "Dual Pixel CMOS AF", Weight: "329g body only", Screen: "3-inch Vari-Angle Touch" },
    rating: 4.4, totalRatings: 89, rentedCount: 45, manufactureDate: "Mar 2023", delivery: "Tomorrow", sponsored: false,
  },

  // ─── PHONES ───────────────────────────────────────────
  {
    title: "iPhone 15 Pro Max 256GB | Natural Titanium | Best Camera Phone",
    brand: "Apple",
    description: "Apple's most powerful iPhone ever. A17 Pro chip with hardware-accelerated ray tracing. Titanium design, 5x optical zoom, Action Button, and USB-C with USB 3 speeds.",
    category: "phones",
    pricePerDay: 350,
    actualPrice: 159900,
    damageDeposit: 8000,
    specs: { Chip: "A17 Pro", Display: "6.7-inch Super Retina XDR 120Hz", Camera: "48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto", Storage: "256GB", Battery: "All-day battery life" },
    rating: 4.9, totalRatings: 1024, rentedCount: 234, manufactureDate: "Sep 2023", delivery: "Tomorrow 8 am - 12 pm", sponsored: true,
  },
  {
    title: "Samsung Galaxy S24 Ultra | AI Smartphone | S-Pen | 512GB",
    brand: "Samsung",
    description: "Samsung's ultimate flagship with Galaxy AI features. Circle to Search, Live Translate, and AI Photo Editing built-in. Titanium frame with Gorilla Armor glass.",
    category: "phones",
    pricePerDay: 300,
    actualPrice: 134999,
    damageDeposit: 7000,
    specs: { Chip: "Snapdragon 8 Gen 3", Display: "6.8-inch QHD+ AMOLED 120Hz", Camera: "200MP Main + 12MP + 10MP 3x + 50MP 5x", Storage: "512GB", Battery: "5000mAh" },
    rating: 4.8, totalRatings: 850, rentedCount: 189, manufactureDate: "Jan 2024", delivery: "Tomorrow", sponsored: false,
  },
  {
    title: "Google Pixel 8 Pro | AI Photo & Video | Best Android Camera",
    brand: "Google",
    description: "Google's AI-first smartphone with Magic Eraser, Best Take, and Audio Magic Eraser. 7 years of OS updates. The best computational photography in any phone.",
    category: "phones",
    pricePerDay: 250,
    actualPrice: 106999,
    damageDeposit: 5000,
    specs: { Chip: "Google Tensor G3", Display: "6.7-inch LTPO OLED 120Hz", Camera: "50MP Main + 48MP Ultra Wide + 48MP 5x Telephoto", Storage: "256GB", Battery: "5050mAh" },
    rating: 4.6, totalRatings: 520, rentedCount: 112, manufactureDate: "Oct 2023", delivery: "Sunday, 27 Apr", sponsored: false,
  },
  {
    title: "OnePlus 12 | Snapdragon 8 Gen 3 | Hasselblad Camera | Flagship Killer",
    brand: "OnePlus",
    description: "The flagship killer returns with Snapdragon 8 Gen 3, Hasselblad-tuned cameras, and 100W SUPERVOOC charging. 0 to 100% in just 26 minutes.",
    category: "phones",
    pricePerDay: 200,
    actualPrice: 69999,
    damageDeposit: 4000,
    specs: { Chip: "Snapdragon 8 Gen 3", Display: "6.82-inch 2K LTPO AMOLED 120Hz", Camera: "50MP Main + 64MP 3x + 48MP Ultra Wide", Storage: "256GB", Battery: "5400mAh, 100W" },
    rating: 4.5, totalRatings: 340, rentedCount: 87, manufactureDate: "Jan 2024", delivery: "Tomorrow", sponsored: true,
  },

  // ─── DRONES ───────────────────────────────────────────
  {
    title: "DJI Mini 3 Pro | 4K HDR Video | Under 249g | No License Needed",
    brand: "DJI",
    description: "Compact drone under 249g — no drone license required in most countries. 4K HDR video, tri-directional obstacle sensing, and 34-min flight time. Perfect for travel.",
    category: "drones",
    pricePerDay: 400,
    actualPrice: 68990,
    damageDeposit: 6000,
    specs: { Weight: "249g", Video: "4K 60fps HDR", "Flight Time": "34 min", Range: "12 km", Sensor: "1/1.3-inch CMOS 48MP" },
    rating: 4.6, totalRatings: 450, rentedCount: 156, manufactureDate: "May 2022", delivery: "Tomorrow", sponsored: true,
  },
  {
    title: "DJI Mavic 3 Classic | Hasselblad Camera | 46 Min Flight Time",
    brand: "DJI",
    description: "Professional-grade drone with Hasselblad camera system and 4/3 CMOS sensor. 46-minute max flight time. Advanced return-to-home and obstacle avoidance on all sides.",
    category: "drones",
    pricePerDay: 700,
    actualPrice: 131990,
    damageDeposit: 10000,
    specs: { Weight: "895g", Video: "5.1K 50fps / 4K 120fps", "Flight Time": "46 min", Range: "15 km", Sensor: "4/3 CMOS 20MP Hasselblad" },
    rating: 4.9, totalRatings: 150, rentedCount: 48, manufactureDate: "Sep 2022", delivery: "Sunday, 27 Apr", sponsored: false,
  },
  {
    title: "DJI Air 3 | Dual Camera | Medium Tele & Wide | 48MP Photos",
    brand: "DJI",
    description: "Versatile drone with dual camera system — 24mm wide and 70mm medium telephoto. Both cameras shoot 48MP photos and 4K HDR video. O4 transmission up to 20km.",
    category: "drones",
    pricePerDay: 500,
    actualPrice: 96990,
    damageDeposit: 7000,
    specs: { Weight: "720g", Video: "4K 60fps HDR (both cameras)", "Flight Time": "46 min", Range: "20 km", Sensor: "Dual 1/1.3-inch 48MP" },
    rating: 4.7, totalRatings: 230, rentedCount: 89, manufactureDate: "Jul 2023", delivery: "Tomorrow", sponsored: false,
  },

  // ─── TABLETS ──────────────────────────────────────────
  {
    title: "iPad Pro M2 12.9-inch | 256GB | WiFi | Liquid Retina XDR",
    brand: "Apple",
    description: "The most powerful iPad ever with M2 chip. ProMotion 120Hz display with mini-LED backlighting. Apple Pencil hover support. Perfect for digital art and note-taking.",
    category: "tablets",
    pricePerDay: 300,
    actualPrice: 112900,
    damageDeposit: 5000,
    specs: { Chip: "Apple M2", Display: "12.9-inch Liquid Retina XDR", Storage: "256GB", Camera: "12MP Wide + 10MP Ultra Wide", Connectivity: "WiFi 6E" },
    rating: 4.8, totalRatings: 345, rentedCount: 120, manufactureDate: "Oct 2022", delivery: "Tomorrow", sponsored: true,
  },
  {
    title: "Samsung Galaxy Tab S9 Ultra | 14.6-inch | S-Pen | 512GB",
    brand: "Samsung",
    description: "Samsung's largest tablet with a massive 14.6-inch Dynamic AMOLED 2X display. IP68 water resistance with included S-Pen. DeX mode for desktop experience.",
    category: "tablets",
    pricePerDay: 350,
    actualPrice: 136999,
    damageDeposit: 6000,
    specs: { Chip: "Snapdragon 8 Gen 2", Display: "14.6-inch Dynamic AMOLED 2X 120Hz", Storage: "512GB", Camera: "13MP + 8MP Ultra Wide", Battery: "11200mAh" },
    rating: 4.6, totalRatings: 178, rentedCount: 65, manufactureDate: "Aug 2023", delivery: "Sunday, 27 Apr", sponsored: false,
  },

  // ─── GAMING CONSOLES ──────────────────────────────────
  {
    title: "PlayStation 5 Slim | 1TB | 2 DualSense Controllers | 3 Games Bundle",
    brand: "Sony",
    description: "PS5 Slim with 1TB SSD, two DualSense controllers, and 3 popular games (Spider-Man 2, FC 25, Horizon). Experience haptic feedback and adaptive triggers.",
    category: "gaming",
    pricePerDay: 350,
    actualPrice: 54990,
    damageDeposit: 5000,
    specs: { Storage: "1TB SSD", Resolution: "4K 120Hz / 8K", CPU: "AMD Zen 2 Custom", GPU: "AMD RDNA 2 Custom 10.28 TFLOPS", "Disc Drive": "Ultra HD Blu-ray" },
    rating: 4.9, totalRatings: 567, rentedCount: 203, manufactureDate: "Nov 2023", delivery: "Tomorrow", sponsored: true,
  },
  {
    title: "Nintendo Switch OLED | White | Mario Kart 8 + Online Membership",
    brand: "Nintendo",
    description: "The Nintendo Switch OLED with a vibrant 7-inch OLED screen, wide adjustable stand, and enhanced audio. Includes Mario Kart 8 Deluxe and 3-month Online membership.",
    category: "gaming",
    pricePerDay: 200,
    actualPrice: 27999,
    damageDeposit: 3000,
    specs: { Display: "7-inch OLED", Storage: "64GB", "Battery Life": "4.5 - 9 hours", Mode: "TV / Tabletop / Handheld", "Online": "3-month membership included" },
    rating: 4.7, totalRatings: 890, rentedCount: 340, manufactureDate: "Oct 2021", delivery: "Tomorrow", sponsored: false,
  },
  {
    title: "Xbox Series X | 1TB | Game Pass Ultimate 1 Month | 2 Controllers",
    brand: "Microsoft",
    description: "Microsoft's most powerful console with 12 TFLOPS of GPU power. Includes 1 month Game Pass Ultimate (300+ games). Quick Resume lets you switch between games instantly.",
    category: "gaming",
    pricePerDay: 300,
    actualPrice: 49990,
    damageDeposit: 4500,
    specs: { Storage: "1TB NVMe SSD", Resolution: "4K 120Hz / 8K", CPU: "AMD Zen 2 Custom 3.8GHz", GPU: "12 TFLOPS RDNA 2", "Game Pass": "1 month Ultimate included" },
    rating: 4.5, totalRatings: 320, rentedCount: 145, manufactureDate: "Nov 2020", delivery: "Sunday, 27 Apr", sponsored: false,
  },

  // ─── VR HEADSETS ──────────────────────────────────────
  {
    title: "Meta Quest 3 | 128GB | Mixed Reality | Standalone VR",
    brand: "Meta",
    description: "Next-gen mixed reality headset with full-color passthrough. Play VR games, watch movies in a virtual cinema, or overlay apps on your real world. No PC required.",
    category: "vr",
    pricePerDay: 300,
    actualPrice: 49999,
    damageDeposit: 5000,
    specs: { Chip: "Snapdragon XR2 Gen 2", Display: "2064x2208 per eye LCD", Storage: "128GB", Tracking: "Inside-Out 6DoF", "IPD Range": "53-75mm" },
    rating: 4.6, totalRatings: 234, rentedCount: 89, manufactureDate: "Oct 2023", delivery: "Tomorrow", sponsored: true,
  },
  {
    title: "Apple Vision Pro | 256GB | Spatial Computing | The Future",
    brand: "Apple",
    description: "Apple's revolutionary spatial computer. Apps float in your space, 3D movies feel real, FaceTime with Personas. Powered by M2 + R1 chips. Includes travel case.",
    category: "vr",
    pricePerDay: 1500,
    actualPrice: 359900,
    damageDeposit: 25000,
    specs: { Chip: "M2 + R1", Display: "Micro-OLED 23MP total", Storage: "256GB", Tracking: "Inside-Out + Eye + Hand", Audio: "Spatial Audio dual drivers" },
    rating: 4.3, totalRatings: 67, rentedCount: 12, manufactureDate: "Feb 2024", delivery: "Monday, 28 Apr", sponsored: true,
  },

  // ─── AUDIO ────────────────────────────────────────────
  {
    title: "Sony WH-1000XM5 | Best Noise Cancelling Headphones | 30hr Battery",
    brand: "Sony",
    description: "Industry-leading noise cancellation with Auto NC Optimizer. 30-hour battery, multipoint connection, speak-to-chat, and LDAC hi-res audio support.",
    category: "audio",
    pricePerDay: 100,
    actualPrice: 29990,
    damageDeposit: 2000,
    specs: { Driver: "30mm Carbon Fiber", ANC: "Dual Processor V1 + HD QN1", Battery: "30 hours", Codec: "LDAC / AAC / SBC", Weight: "250g" },
    rating: 4.8, totalRatings: 780, rentedCount: 312, manufactureDate: "May 2022", delivery: "Tomorrow", sponsored: true,
  },
  {
    title: "JBL PartyBox 310 | Portable Party Speaker | 240W | Light Show",
    brand: "JBL",
    description: "Massive 240W portable speaker with built-in light show. IPX4 splashproof, guitar/mic input, 18-hour battery. Perfect for college parties and events.",
    category: "audio",
    pricePerDay: 350,
    actualPrice: 41999,
    damageDeposit: 4000,
    specs: { Power: "240W RMS", Battery: "18 hours", Protection: "IPX4 Splashproof", Connectivity: "Bluetooth 5.1 + AUX + USB", Weight: "17.4 kg" },
    rating: 4.7, totalRatings: 234, rentedCount: 156, manufactureDate: "Jan 2023", delivery: "Tomorrow", sponsored: false,
  },
  {
    title: "AirPods Pro 2nd Gen | USB-C | Adaptive Audio | Hearing Health",
    brand: "Apple",
    description: "Apple's best earbuds with Adaptive Audio, Conversation Awareness, and USB-C charging. Active Noise Cancellation with 2x improvement over 1st gen.",
    category: "audio",
    pricePerDay: 80,
    actualPrice: 24900,
    damageDeposit: 1500,
    specs: { Chip: "H2", ANC: "2x better Active Noise Cancellation", Battery: "6 hrs (30 hrs with case)", Connectivity: "Bluetooth 5.3", Protection: "IP54 Dust/Water Resistant" },
    rating: 4.7, totalRatings: 1200, rentedCount: 450, manufactureDate: "Sep 2023", delivery: "Tomorrow", sponsored: false,
  },

  // ─── ACCESSORIES ──────────────────────────────────────
  {
    title: "DJI OM 7 | Smartphone Gimbal Stabilizer | AI Tracking | Magnetic Mount",
    brand: "DJI",
    description: "3-axis smartphone gimbal with ActiveTrack 6.0 AI subject tracking. Magnetic quick-release mount, gesture control, and time-lapse modes. Folds compact for travel.",
    category: "accessories",
    pricePerDay: 100,
    actualPrice: 12990,
    damageDeposit: 1500,
    specs: { Axes: "3-axis motorized", "Battery Life": "6.5 hours", Tracking: "ActiveTrack 6.0", Weight: "290g", Compatibility: "Phones 170-290mm width" },
    rating: 4.5, totalRatings: 178, rentedCount: 89, manufactureDate: "Sep 2023", delivery: "Tomorrow", sponsored: false,
  },
  {
    title: "Elgato Stream Deck MK.2 | 15 LCD Keys | Content Creator Essential",
    brand: "Elgato",
    description: "15 customizable LCD keys for one-touch control of your apps and platforms. Essential for streamers, video editors, and productivity enthusiasts. Detachable USB-C cable.",
    category: "accessories",
    pricePerDay: 80,
    actualPrice: 17990,
    damageDeposit: 2000,
    specs: { Keys: "15 customizable LCD", Connection: "USB-C (detachable)", Compatibility: "Windows 10+ / macOS 12+", Size: "118 x 84 x 21mm", "Stand": "Adjustable magnetic" },
    rating: 4.6, totalRatings: 340, rentedCount: 123, manufactureDate: "Jun 2022", delivery: "Tomorrow", sponsored: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const owner = await getOrCreateOwner();

    // Clear existing products (fresh seed)
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert all products with the owner reference
    const docs = products.map(p => ({ ...p, owner: owner._id }));
    await Product.insertMany(docs);

    console.log(`✅ Seeded ${docs.length} products across ${[...new Set(products.map(p => p.category))].length} categories`);
    console.log('Categories:', [...new Set(products.map(p => p.category))].join(', '));

    await mongoose.disconnect();
    console.log('Done!');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
