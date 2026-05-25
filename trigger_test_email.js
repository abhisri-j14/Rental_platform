require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const http = require('http');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gadgetgo';
const JWT_SECRET = process.env.JWT_SECRET || 'gadgetgo-dev-secret-change-in-production';
const PORT = process.env.PORT || 5000;

async function run() {
  console.log('🔄 Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);

  const { Order } = require('./server/models');

  // Find the latest order where the owner exists and has a product
  console.log('🔍 Finding latest order...');
  const order = await Order.findOne({}).populate('product').populate('owner').populate('renter');

  if (!order) {
    console.error('❌ No orders found in the database. Please place an order first.');
    process.exit(1);
  }

  if (!order.owner || !order.renter) {
    console.error('❌ Found order but owner or renter details are missing in DB.');
    process.exit(1);
  }

  console.log(`\n📦 Found Order ID: ${order._id}`);
  console.log(`💻 Device: ${order.product?.title || 'Unknown'}`);
  console.log(`👤 Renter: ${order.renter.email} (${order.renter.name})`);
  console.log(`🏪 Owner: ${order.owner.email} (${order.owner.name})`);

  // Generate a valid JWT token for the owner
  console.log(`🔑 Generating JWT Token for owner: ${order.owner.email}...`);
  const token = jwt.sign(
    { id: order.owner._id.toString(), email: order.owner.email },
    JWT_SECRET
  );

  // Prepare post return inspection body
  const payload = JSON.stringify({
    orderId: order._id.toString(),
    damageLevel: 'minor', // 'none' | 'minor' | 'moderate' | 'severe'
    damageDescription: 'Minor hairline scratches on the back cover, device fully operational.',
    deductedAmount: 500, // Amount deducted from deposit (in ₹)
    poolContribution: 1200, // Protection pool contribution (in ₹)
  });

  console.log('📡 Sending POST request to /api/emails/inspection-complete...');
  
  const req = http.request({
    hostname: 'localhost',
    port: PORT,
    path: '/api/emails/inspection-complete',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'Authorization': `Bearer ${token}`
    }
  }, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      console.log(`\n📊 Response Status Code: ${res.statusCode}`);
      console.log('--- Response Body ---');
      try {
        console.log(JSON.stringify(JSON.parse(body), null, 2));
      } catch {
        console.log(body);
      }
      console.log('---------------------');
      mongoose.disconnect();
      process.exit(0);
    });
  });

  req.on('error', (e) => {
    console.error(`❌ Request Error: ${e.message}`);
    mongoose.disconnect();
    process.exit(1);
  });

  req.write(payload);
  req.end();
}

run().catch(err => {
  console.error('❌ Execution failed:', err);
  process.exit(1);
});
