const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Admin = require('../src/models/admin.model');
const connectDB = require('../src/config/db');

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('Checking for existing administrator accounts...');
    
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'akhils88815@gmail.com';
    const adminName = process.env.SEED_ADMIN_NAME || 'Akhil Singh';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'akhils9076_admin';

    // Check if admin with this email exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`An administrator account with email ${adminEmail} already exists.`);
      process.exit(0);
    }

    // Create the admin user
    await Admin.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
    });

    console.log('======================================================');
    console.log('🎉 INITIAL ADMINISTRATOR SEEDED SUCCESSFULLY!');
    console.log(`Name:     ${adminName}`);
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: [Configured in .env under SEED_ADMIN_PASSWORD]`);
    console.log('======================================================');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding administrator:', err.message);
    process.exit(1);
  }
};

seedAdmin();
