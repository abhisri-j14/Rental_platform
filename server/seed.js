const mongoose = require('mongoose');
const { User, Product } = require('./models');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gadgetgo';

const productsData = [
  {
    title: 'MacBook Pro 16" M3 Max',
    brand: 'Apple',
    description: 'The most powerful MacBook ever. 128GB RAM, 2TB SSD. Perfect for video editing and AI development.',
    category: 'laptops',
    pricePerDay: 2500,
    actualPrice: 350000,
    damageDeposit: 50000,
    specs: { RAM: '128GB', Storage: '2TB SSD', CPU: 'M3 Max' },
    rating: 4.9,
    totalRatings: 124,
    rentedCount: 450,
    sponsored: true
  },
  {
    title: 'Sony Alpha a7 IV Mirrorless Camera',
    brand: 'Sony',
    description: '33MP Full-Frame sensor, 4K 60p video. A versatile choice for both photos and video.',
    category: 'cameras',
    pricePerDay: 1500,
    actualPrice: 220000,
    damageDeposit: 25000,
    specs: { Sensor: 'Full Frame', Resolution: '33MP', Video: '4K 60p' },
    rating: 4.8,
    totalRatings: 89,
    rentedCount: 310
  },
  {
    title: 'DJI Mavic 3 Pro',
    brand: 'DJI',
    description: 'Triple camera system, 43 min flight time. Capture stunning aerial footage.',
    category: 'drones',
    pricePerDay: 2000,
    actualPrice: 180000,
    damageDeposit: 30000,
    specs: { Camera: 'Hasselblad', FlightTime: '43 min', Range: '15km' },
    rating: 4.7,
    totalRatings: 56,
    rentedCount: 180
  },
  {
    title: 'iPhone 15 Pro Max 512GB',
    brand: 'Apple',
    description: 'Titanium design, A17 Pro chip. The ultimate iPhone experience.',
    category: 'phones',
    pricePerDay: 800,
    actualPrice: 160000,
    damageDeposit: 15000,
    specs: { Display: '6.7"', Chip: 'A17 Pro', Storage: '512GB' },
    rating: 4.9,
    totalRatings: 210,
    rentedCount: 1200
  },
  {
    title: 'PlayStation 5 Console',
    brand: 'Sony',
    description: 'Ultra-high speed SSD, ray tracing, and 4K gaming.',
    category: 'gaming',
    pricePerDay: 500,
    actualPrice: 50000,
    damageDeposit: 5000,
    specs: { Storage: '825GB SSD', Video: '4K 120Hz', HDR: 'Yes' },
    rating: 4.6,
    totalRatings: 450,
    rentedCount: 3500
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding');

    // Create a dummy owner if none exists
    let owner = await User.findOne({ role: 'owner' });
    if (!owner) {
      owner = await User.create({
        name: 'Gizzmo Store',
        email: 'store@gizzmo.com',
        phone: '1234567890',
        role: 'owner',
        isEmailVerified: true,
        isPhoneVerified: true
      });
      console.log('Created dummy owner');
    }

    // Clear existing products (optional, but good for clean seed)
    // await Product.deleteMany({});
    
    // Add owner ID to products
    const productsWithOwner = productsData.map(p => ({ ...p, owner: owner._id }));

    await Product.insertMany(productsWithOwner);
    console.log('Successfully seeded products');

    await mongoose.disconnect();
  } catch (err) {
    console.error('Seeding error:', err);
  }
}

seed();
