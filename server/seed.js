const mongoose = require('mongoose');
const { User, Product } = require('./models');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gadgetgo';

const productsData = [
  // PHONES
  {
    title: 'Samsung Galaxy S26 5G (Black, 12GB RAM, 256GB Storage)', brand: 'Samsung', category: 'phones', pricePerDay: 300, actualPrice: 90000, damageDeposit: 3500,
    description: 'Samsung Galaxy S26 5G (Black, 12GB RAM, 256GB Storage). Features advanced Galaxy AI, Photo Assist, Creative Studio, and a 50MP camera powered by the ProVisual Engine. Driven by a powerful customized processor and 4300mAh battery.',
    specs: { RAM: '12GB', Storage: '256GB', Camera: '50MP ProVisual', Battery: '4300mAh', Features: 'Galaxy AI, Photo Assist' }, images: [
      'http://localhost:5000/uploads/samsung_s26.png',
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1000',
      'https://images.unsplash.com/photo-1592890288564-766d8a041268?q=80&w=1000'
    ],
    rating: 4.8, totalRatings: 92, rentedCount: 3, delivery: 'Get It by tomorrow'
  },
  {
    title: 'OnePlus 15 (16GB RAM, 512GB Storage, Sand Storm)', brand: 'OnePlus', category: 'phones', pricePerDay: 350, actualPrice: 95000, damageDeposit: 3500,
    description: 'OnePlus 15 (16GB RAM + 512GB Storage, Sand Storm edition). India\'s first Snapdragon® 8 Elite Gen 5 smartphone. Featuring a game-changing 165Hz display, a massive 7300mAh battery, personalised AI, and a Triple 50MP Camera supporting 4K 120fps Dolby Vision recording.',
    specs: { RAM: '16GB', Storage: '512GB', CPU: 'Snapdragon 8 Elite Gen 5', Display: '165Hz Fluid AMOLED', Battery: '7300mAh', Camera: 'Triple 50MP (4K/120fps)' }, images: [
      'http://localhost:5000/uploads/oneplus_15.png',
      'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?q=80&w=1000',
      'https://images.unsplash.com/photo-1565630916779-e303be97b6f5?q=80&w=1000'
    ],
    rating: 4.7, totalRatings: 68, rentedCount: 5, delivery: 'Get It Today'
  },
  {
    title: 'Apple iPhone 17 Pro (512 GB, Deep Blue)', brand: 'Apple', category: 'phones', pricePerDay: 450, actualPrice: 175000, damageDeposit: 4500,
    description: 'Apple iPhone 17 Pro (512 GB, Deep Blue). Features a 15.93 cm (6.3″) Super Retina XDR Display with ProMotion up to 120Hz, the blazing-fast A19 Pro Chip, breakthrough battery life, and a Pro Fusion Camera System with a Center Stage Front Camera.',
    specs: { Storage: '512GB', Display: '15.93 cm (6.3") 120Hz', CPU: 'A19 Pro Chip', Camera: 'Pro Fusion System', Features: 'Center Stage Front Camera' }, images: [
      'http://localhost:5000/uploads/iphone_17_pro.png',
      'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=1000',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1000'
    ],
    rating: 4.9, totalRatings: 185, rentedCount: 2, delivery: 'Get It by Tomorrow'
  },
  {
    title: 'Oppo Reno15Pro mini 5G (Cocoa Brown, 12GB RAM, 256GB Storage)', brand: 'OPPO', category: 'phones', pricePerDay: 200, actualPrice: 50399, damageDeposit: 1500,
    description: 'Oppo Reno15Pro mini 5G (Cocoa Brown, 12GB RAM, 256GB Storage). Ultra-clear 200MP main camera supporting 4K 60fps HDR video. Features a beautifully compact and slim design with premium metal frames.',
    specs: { RAM: '12GB', Storage: '256GB', Camera: '200MP Ultra-Clear', Video: '4K 60fps HDR', Color: 'Cocoa Brown' }, images: [
      'http://localhost:5000/uploads/oppo_reno15_pro_mini.png',
      'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?q=80&w=1000',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000'
    ],
    rating: 4.6, totalRatings: 44, rentedCount: 7, delivery: 'Get It by T'
  },
  {
    title: 'vivo T4 Ultra 5G (Phoenix Gold, 8GB RAM, 256GB Storage)', brand: 'vivo', category: 'phones', pricePerDay: 150, actualPrice: 54990, damageDeposit: 1200,
    description: 'vivo T4 Ultra 5G: Features a 16.94 cm (6.67 inch) Full HD+ AMOLED Display, a powerful MediaTek Dimensity 9300+ Processor, a massive 5500 mAh Battery, a 50MP + 8MP + 50MP Periscope main camera system, and a 32MP Front Camera. Phoenix Gold edition with 8GB RAM and 256GB storage.',
    specs: { RAM: '8GB', Storage: '256GB', Display: '16.94 cm (6.67") Full HD+ AMOLED', Processor: 'Dimensity 9300+', Battery: '5500 mAh', Camera: '50MP + 8MP + 50MP Periscope', Color: 'Phoenix Gold' }, images: [
      'http://localhost:5000/uploads/vivo_t4_ultra.png',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1000'
    ],
    rating: 4.7, totalRatings: 35, rentedCount: 8, delivery: 'Get It Today'
  },
  // LAPTOPS
  {
    title: 'MacBook Air M2', brand: 'Apple', category: 'laptops', pricePerDay: 450, actualPrice: 115000, damageDeposit: 5500,
    description: 'Thinner, lighter, faster. The most loved laptop.',
    specs: { CPU: 'M2', RAM: '8GB' }, images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1000'
    ],
    rating: 4.8, totalRatings: 340, rentedCount: 3, delivery: 'Get It by Tomorrow'
  },
  {
    title: 'Samsung Galaxy Book3 Pro', brand: 'Samsung', category: 'laptops', pricePerDay: 400, actualPrice: 120000, damageDeposit: 2500,
    description: 'Dynamic AMOLED display for stunning visuals.',
    specs: { Display: 'Dynamic AMOLED', CPU: 'i7 13th Gen' }, images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1000',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000',
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000'
    ],
    rating: 4.6, totalRatings: 45, rentedCount: 2, delivery: 'Get It Today'
  },
  {
    title: 'Dell XPS 15 9530', brand: 'Dell', category: 'laptops', pricePerDay: 300, actualPrice: 70000, damageDeposit: 1900,
    description: 'Stunning 3.5K OLED InfinityEdge display. Powerful Intel Core i9 processor with NVIDIA RTX 4060 graphics. Crafted with CNC machined aluminum and carbon fiber.',
    specs: { Display: '15.6" OLED 3.5K', CPU: 'Intel i9 13th Gen', RAM: '32GB DDR5', GPU: 'NVIDIA RTX 4060' }, images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1000',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1000'
    ],
    rating: 4.7, totalRatings: 180, rentedCount: 6, delivery: 'Get It by Tomorrow'
  },
  {
    title: 'Lenovo ThinkPad X1 Carbon Gen 11', brand: 'Lenovo', category: 'laptops', pricePerDay: 350, actualPrice: 105000, damageDeposit: 2000,
    description: 'The pinnacle of business laptops. Ultra-lightweight carbon fiber chassis, legendary spill-resistant keyboard, robust enterprise security, and long-lasting battery life.',
    specs: { Display: '14" WUXGA IPS', CPU: 'Intel i7 13th Gen vPro', RAM: '16GB LPDDR5', Weight: '1.12 kg' }, images: [
      'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?q=80&w=1000',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1000'
    ],
    rating: 4.9, totalRatings: 95, rentedCount: 2, delivery: 'Get It Today'
  },
  {
    title: 'ASUS ROG Zephyrus G14', brand: 'ASUS', category: 'laptops', pricePerDay: 350, actualPrice: 90000, damageDeposit: 1500,
    description: 'Compact and high-performance gaming beast. 120Hz ROG Nebula Display powered by AMD Ryzen 9 and NVIDIA RTX 4070 graphics. Iconic AniMe Matrix custom LED display lid.',
    specs: { Display: '14" QHD+ 120Hz', CPU: 'AMD Ryzen 9 7940HS', RAM: '32GB DDR5', GPU: 'NVIDIA RTX 4070' }, images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000'
    ],
    rating: 4.8, totalRatings: 112, rentedCount: 4, delivery: 'Get It by Tomorrow'
  },

  // CAMERAS
  {
    title: 'Canon EOS R50 RF-S18-45mm IS STM Mirrorless Camera', brand: 'Canon', category: 'cameras', pricePerDay: 350, actualPrice: 55990, damageDeposit: 3400,
    description: 'Supercharge your content creation with the Canon EOS R50. Features a 24.2 MP APS-C CMOS sensor, 4K UHD 30p video, and Dual Pixel CMOS AF II. Perfect for creators, vloggers, and travelers.',
    specs: { Sensor: '24.2 MP APS-C', Video: '4K UHD 30p', Lens: 'RF-S 18-45mm IS STM', ISO: '100-25600' }, images: [
      'http://localhost:5000/uploads/canon_eos_r50.png',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000',
      'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?q=80&w=1000'
    ],
    rating: 4.7, totalRatings: 84, rentedCount: 2, delivery: 'Get It Today'
  },
  {
    title: 'Sony Alpha ZV-E10 Mirrorless Vlog Camera', brand: 'Sony', category: 'cameras', pricePerDay: 400, actualPrice: 69990, damageDeposit: 3500,
    description: 'Made for creators. The Sony Alpha ZV-E10 features a large 24.2 MP APS-C sensor, interchangeable lens options, a product showcase setting, background defocus switch, and a high-quality directional 3-capsule mic with windscreen.',
    specs: { Sensor: '24.2 MP APS-C', Video: '4K 30p HDR', Mic: 'Directional 3-Capsule', Features: 'Product Showcase AF' }, images: [
      'http://localhost:5000/uploads/sony_zv_e10.png',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000',
      'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?q=80&w=1000'
    ],
    rating: 4.8, totalRatings: 112, rentedCount: 2, delivery: 'Get It by Tomorrow'
  },
  {
    title: 'DJI Osmo Pocket 3 Vlogging Camera', brand: 'DJI', category: 'cameras', pricePerDay: 250, actualPrice: 53900, damageDeposit: 1200,
    description: 'Pocket-sized stabilization for cinematic video. Features a massive 1-inch CMOS sensor, 4K/120fps recording, 3-axis mechanical gimbal stabilization, full-pixel fast focusing, and a 2-inch rotatable OLED touchscreen.',
    specs: { Sensor: '1" CMOS', Video: '4K/120fps', Stabilization: '3-Axis Gimbal', Screen: '2" Rotatable' }, images: [
      'http://localhost:5000/uploads/dji_pocket_3.png',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1000',
      'https://images.unsplash.com/photo-1629130740389-a8f17a1f418c?q=80&w=1000'
    ],
    rating: 4.9, totalRatings: 215, rentedCount: 1, delivery: 'Get It by Tomorrow'
  },

  // DRONES
  {
    title: 'Foldable 4K FPV Live Video Drone for Kids & Adults', brand: 'DJI', category: 'drones', pricePerDay: 150, actualPrice: 15000, damageDeposit: 1200,
    description: 'Drone with 4K Camera Foldable 1080P HD Drone with FPV Live Video, Smart Gestures Selfie, Altitude Hold, One Key Take Off/Landing, 3D Flips. Ideal for kids and adults alike.',
    specs: { Video: '4K Camera & 1080P HD FPV', Features: 'FPV Live Video, Smart Gestures, Altitude Hold, One Key Take Off/Landing, 3D Flips', Portability: 'Foldable Design' }, images: [
      'http://localhost:5000/uploads/drone_4k_foldable.png',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1000'
    ],
    rating: 4.5, totalRatings: 34, rentedCount: 1, delivery: 'Get It Today'
  },
  {
    title: 'Adults 4K Brushless Motor FPV Drone (45 Mins Flight)', brand: 'DJI', category: 'drones', pricePerDay: 200, actualPrice: 28000, damageDeposit: 1500,
    description: 'Drones with Camera for Adults 4K. High-performance Brushless Motor Drone. Equipped with FPV Foldable RC, 2 high-capacity batteries supporting 45 Mins Long Flight Time, Beyond-Range Loss Alert, and 360° flips.',
    specs: { Video: '4K UHD FPV Camera', Motor: 'Brushless High-Speed Motor', Battery: '2 Batteries Included', 'Flight Time': '45 Mins Long Flight Time', Features: 'Beyond-Range Loss Alert, 360° Flip' }, images: [
      'http://localhost:5000/uploads/drone_brushless_adults.png',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1000'
    ],
    rating: 4.8, totalRatings: 52, rentedCount: 2, delivery: 'Get It by Tomorrow'
  },

  // TABLETS
  {
    title: 'Apple iPad 11″ (Liquid Retina Display, 128GB, Wi-Fi 6, Pink)', brand: 'Apple', category: 'tablets', pricePerDay: 330, actualPrice: 49900, damageDeposit: 2000,
    description: 'Apple iPad 11″: A16 chip, 27.69 cm (11″) Model, Liquid Retina Display, 128GB, Wi-Fi 6, 12MP Front/12MP Back Camera, Touch ID, All-Day Battery Life — Pink.',
    specs: { Screen: '27.69 cm (11") Liquid Retina', CPU: 'A16 Bionic Chip', Storage: '128GB', Connectivity: 'Wi-Fi 6', Camera: '12MP Front / 12MP Back', Color: 'Pink' }, images: [
      'http://localhost:5000/uploads/apple_ipad_11_pink.png',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000'
    ],
    rating: 4.8, totalRatings: 42, rentedCount: 2, delivery: 'Get It by Tomorrow'
  },
  {
    title: 'OnePlus Pad 4 (3.4K 144Hz Screen, 8GB RAM, 256GB WiFi, Dune Glow)', brand: 'OnePlus', category: 'tablets', pricePerDay: 390, actualPrice: 65000, damageDeposit: 2500,
    description: 'OnePlus Pad 4: Snapdragon® 8 Elite Gen 5 Platform, 33.53cm 13.2" 3.4K Screen, 144Hz Adaptive Refresh Rate, 8 Speakers with AI Power, PC-Level Productivity, 13,380 mAh Battery, 8GB RAM + 256GB Storage, WiFi, Dune Glow.',
    specs: { Screen: '33.53cm (13.2") 3.4K 144Hz', CPU: 'Snapdragon 8 Elite Gen 5', Audio: '8 Speakers (AI Powered)', Battery: '13,380 mAh Battery', Memory: '8GB RAM + 256GB Storage', Color: 'Dune Glow' }, images: [
      'http://localhost:5000/uploads/oneplus_pad_4.png',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000'
    ],
    rating: 4.9, totalRatings: 28, rentedCount: 1, delivery: 'Get It Today'
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding');

    let owner = await User.findOne({ role: 'owner' });
    if (!owner) {
      owner = await User.create({
        name: 'Gizzmo Store',
        email: 'store@gizzmo.com',
        phone: '9999999999',
        role: 'owner',
        isEmailVerified: true,
        isPhoneVerified: true
      });
      console.log('👤 Created default store owner');
    }

    await Product.deleteMany({});
    console.log('🗑️  Cleared old products');

    const productsWithOwner = productsData.map(p => ({ ...p, owner: owner._id }));

    await Product.insertMany(productsWithOwner);
    console.log(`✨ Successfully seeded ${productsData.length} products`);

    await mongoose.disconnect();
    console.log('👋 Disconnected');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  }
}

seed();
