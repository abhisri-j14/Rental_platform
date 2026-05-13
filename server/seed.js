const mongoose = require('mongoose');
const { User, Product } = require('./models');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gadgetgo';

const productsData = [
  // PHONES
  {
    title: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', category: 'phones', pricePerDay: 750, actualPrice: 130000, damageDeposit: 12000,
    description: 'AI-powered flagship with 200MP camera and S-Pen.',
    specs: { Camera: '200MP', CPU: 'SD 8 Gen 3' }, images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1000'],
    rating: 4.8, totalRatings: 145, rentedCount: 890, delivery: 'Get It Today'
  },
  {
    title: 'OnePlus 12 5G', brand: 'OnePlus', category: 'phones', pricePerDay: 500, actualPrice: 70000, damageDeposit: 8000,
    description: 'Smooth Beyond Belief. Hasselblad Camera for Mobile.',
    specs: { RAM: '16GB', Charging: '100W' }, images: ['https://images.unsplash.com/photo-1678911820864-e2c567c655d7?q=80&w=1000'],
    rating: 4.7, totalRatings: 89, rentedCount: 420, delivery: 'Get It Today'
  },
  {
    title: 'iPhone 15 Pro Max', brand: 'Apple', category: 'phones', pricePerDay: 800, actualPrice: 160000, damageDeposit: 15000,
    description: 'Titanium design, A17 Pro chip. The ultimate iPhone experience.',
    specs: { Display: '6.7"', Chip: 'A17 Pro' }, images: ['https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=1000'],
    rating: 4.9, totalRatings: 210, rentedCount: 1200, delivery: 'Get It Today'
  },
  {
    title: 'iQOO 12 5G', brand: 'iQOO', category: 'phones', pricePerDay: 450, actualPrice: 60000, damageDeposit: 6000,
    description: 'Monster performance for gaming. Pro-level camera.',
    specs: { CPU: 'SD 8 Gen 3', Display: '144Hz' }, images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1000'],
    rating: 4.6, totalRatings: 54, rentedCount: 210, delivery: 'Get It Today'
  },
  {
    title: 'realme GT 5 Pro', brand: 'realme', category: 'phones', pricePerDay: 400, actualPrice: 55000, damageDeposit: 5000,
    description: 'High-performance flagship with incredible value.',
    specs: { Display: 'LTPO', Camera: 'Sony LYT-808' }, images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000'],
    rating: 4.5, totalRatings: 32, rentedCount: 120, delivery: 'Get It by Tomorrow'
  },
  {
    title: 'Redmi Note 13 Pro+', brand: 'Redmi', category: 'phones', pricePerDay: 300, actualPrice: 35000, damageDeposit: 4000,
    description: 'Super-powered midrange with 200MP camera.',
    specs: { Camera: '200MP', Charging: '120W' }, images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000'],
    rating: 4.4, totalRatings: 112, rentedCount: 640, delivery: 'Get It Today'
  },
  {
    title: 'vivo X100 Pro', brand: 'vivo', category: 'phones', pricePerDay: 600, actualPrice: 90000, damageDeposit: 9000,
    description: 'Camera powerhouse with Zeiss optics.',
    specs: { Lens: 'Zeiss APO', CPU: 'Dimensity 9300' }, images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000'],
    rating: 4.7, totalRatings: 28, rentedCount: 95, delivery: 'Get It Today'
  },
  {
    title: 'Motorola Edge 40 Pro', brand: 'Motorola', category: 'phones', pricePerDay: 450, actualPrice: 65000, damageDeposit: 7000,
    description: 'Fast, smooth, and clean Android experience.',
    specs: { Display: '165Hz', OS: 'Clean Android' }, images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000'],
    rating: 4.5, totalRatings: 18, rentedCount: 50, delivery: 'Get It by Tomorrow'
  },
  {
    title: 'Nokia XR21 Rugged 5G', brand: 'Nokia', category: 'phones', pricePerDay: 350, actualPrice: 45000, damageDeposit: 5000,
    description: 'Built to last. The ultimate rugged smartphone.',
    specs: { Durability: 'Mil-Std-810H', Battery: '2-day life' }, images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000'],
    rating: 4.3, totalRatings: 12, rentedCount: 30, delivery: 'Get It Today'
  },
  {
    title: 'OPPO Find X7 Ultra', brand: 'OPPO', category: 'phones', pricePerDay: 650, actualPrice: 95000, damageDeposit: 10000,
    description: 'Legendary photography with dual periscope cameras.',
    specs: { Camera: 'Dual Periscope', CPU: 'SD 8 Gen 3' }, images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000'],
    rating: 4.8, totalRatings: 22, rentedCount: 75, delivery: 'Get It Today'
  },

  // LAPTOPS
  {
    title: 'MacBook Air M2', brand: 'Apple', category: 'laptops', pricePerDay: 1200, actualPrice: 115000, damageDeposit: 15000,
    description: 'Thinner, lighter, faster. The most loved laptop.',
    specs: { CPU: 'M2', RAM: '8GB' }, images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000'],
    rating: 4.8, totalRatings: 340, rentedCount: 1500, delivery: 'Get It Today'
  },
  {
    title: 'Samsung Galaxy Book3 Pro', brand: 'Samsung', category: 'laptops', pricePerDay: 1400, actualPrice: 160000, damageDeposit: 20000,
    description: 'Dynamic AMOLED display for stunning visuals.',
    specs: { Display: 'Dynamic AMOLED', CPU: 'i7 13th Gen' }, images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1000'],
    rating: 4.6, totalRatings: 45, rentedCount: 180, delivery: 'Get It Today'
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
