import mongoose from 'mongoose';
import User from '../src/models/User';
import Business from '../src/models/Business';
import Service from '../src/models/Service';
import Booking from '../src/models/Booking';
import Payment from '../src/models/Payment';
import TestDoc from '../src/models/TestDoc';

async function populateDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Business.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});
    await TestDoc.deleteMany({});

    // Create sample users
    console.log('Creating users...');
    const users = await User.insertMany([
      {
        kindeUserId: 'kinde_user_001',
        name: 'John Smith',
        email: 'john@example.com',
        role: 'owner',
        phone: '+27123456789',
      },
      {
        kindeUserId: 'kinde_user_002',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'staff',
        phone: '+27987654321',
      },
      {
        kindeUserId: 'kinde_user_003',
        name: 'Mike Davis',
        email: 'mike@example.com',
        role: 'owner',
        phone: '+27111222333',
      },
      {
        kindeUserId: 'kinde_user_004',
        name: 'Emma Wilson',
        email: 'emma@example.com',
        role: 'staff',
        phone: '+27444555666',
      },
    ]);

    // Create sample businesses
    console.log('Creating businesses...');
    const businesses = await Business.insertMany([
      {
        name: 'Elite Hair Salon',
        slug: 'elite-hair-salon',
        address: '123 Main Street, Cape Town, 8001',
        description: 'Premium hair salon offering cutting-edge styles and treatments.',
        logoUrl: 'https://example.com/logos/elite-hair.png',
        timezone: 'Africa/Johannesburg',
        depositPercentage: 20,
        ownerId: users[0]._id,
        payfastMerchantId: 'PF_MERCHANT_001',
        ozowApiKey: 'OZOW_API_001',
        workingHours: {
          mon: ['09:00-18:00'],
          tue: ['09:00-18:00'],
          wed: ['09:00-18:00'],
          thu: ['09:00-18:00'],
          fri: ['09:00-18:00'],
          sat: ['09:00-15:00'],
          sun: [],
        },
      },
      {
        name: 'Zen Wellness Spa',
        slug: 'zen-wellness-spa',
        address: '456 Oak Avenue, Johannesburg, 2000',
        description: 'Relaxing wellness spa with professional massage and beauty treatments.',
        logoUrl: 'https://example.com/logos/zen-wellness.png',
        timezone: 'Africa/Johannesburg',
        depositPercentage: 25,
        ownerId: users[2]._id,
        payfastMerchantId: 'PF_MERCHANT_002',
        ozowApiKey: 'OZOW_API_002',
        workingHours: {
          mon: ['08:00-19:00'],
          tue: ['08:00-19:00'],
          wed: ['08:00-19:00'],
          thu: ['08:00-19:00'],
          fri: ['08:00-19:00'],
          sat: ['08:00-17:00'],
          sun: ['09:00-15:00'],
        },
      },
    ]);

    // Update users with business IDs
    await User.findByIdAndUpdate(users[1]._id, { businessId: businesses[0]._id });
    await User.findByIdAndUpdate(users[3]._id, { businessId: businesses[1]._id });

    // Create sample services
    console.log('Creating services...');
    const services = await Service.insertMany([
      // Elite Hair Salon services
      {
        businessId: businesses[0]._id,
        name: 'Haircut & Style',
        description: 'Professional haircut with styling and consultation',
        price: 350,
        duration: 60,
        depositRequired: true,
      },
      {
        businessId: businesses[0]._id,
        name: 'Hair Color',
        description: 'Full hair coloring service with premium products',
        price: 850,
        duration: 120,
        depositRequired: true,
      },
      {
        businessId: businesses[0]._id,
        name: 'Hair Wash & Blow Dry',
        description: 'Relaxing hair wash with professional blow dry styling',
        price: 180,
        duration: 30,
        depositRequired: false,
      },
      // Zen Wellness Spa services
      {
        businessId: businesses[1]._id,
        name: 'Deep Tissue Massage',
        description: 'Therapeutic deep tissue massage for muscle tension relief',
        price: 450,
        duration: 60,
        depositRequired: true,
      },
      {
        businessId: businesses[1]._id,
        name: 'Facial Treatment',
        description: 'Rejuvenating facial with cleansing, exfoliation, and moisturizing',
        price: 380,
        duration: 75,
        depositRequired: true,
      },
      {
        businessId: businesses[1]._id,
        name: 'Manicure & Pedicure',
        description: 'Complete nail care and polish application',
        price: 280,
        duration: 90,
        depositRequired: false,
      },
    ]);

    // Create sample bookings
    console.log('Creating bookings...');
    const bookings = await Booking.insertMany([
      {
        businessId: businesses[0]._id,
        client: {
          name: 'Alice Brown',
          phone: '+27123456788',
          email: 'alice.brown@email.com',
        },
        serviceId: services[0]._id,
        staffId: users[1]._id,
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        status: 'confirmed',
        paymentStatus: 'deposit_paid',
        totalPrice: 350,
        depositAmount: 70,
        notes: 'Client prefers shorter layers',
      },
      {
        businessId: businesses[0]._id,
        client: {
          name: 'Bob Green',
          phone: '+27123456787',
          email: 'bob.green@email.com',
        },
        serviceId: services[1]._id,
        staffId: users[1]._id,
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        status: 'pending',
        paymentStatus: 'unpaid',
        totalPrice: 850,
        depositAmount: 170,
        notes: 'First time coloring, wants natural look',
      },
      {
        businessId: businesses[1]._id,
        client: {
          name: 'Carol White',
          phone: '+27123456786',
          email: 'carol.white@email.com',
        },
        serviceId: services[3]._id,
        staffId: users[3]._id,
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        status: 'confirmed',
        paymentStatus: 'paid',
        totalPrice: 450,
        depositAmount: 112.50,
        notes: 'Focus on lower back tension',
      },
      {
        businessId: businesses[1]._id,
        client: {
          name: 'David Black',
          phone: '+27123456785',
          email: 'david.black@email.com',
        },
        serviceId: services[4]._id,
        staffId: users[3]._id,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        status: 'completed',
        paymentStatus: 'paid',
        totalPrice: 380,
        depositAmount: 95,
        notes: 'Sensitive skin - use gentle products',
      },
      {
        businessId: businesses[0]._id,
        client: {
          name: 'Eve Red',
          phone: '+27123456784',
          email: 'eve.red@email.com',
        },
        serviceId: services[2]._id,
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: 'cancelled',
        paymentStatus: 'refunded',
        totalPrice: 180,
        depositAmount: 0,
        notes: 'Client cancelled due to emergency',
      },
    ]);

    // Create sample payments
    console.log('Creating payments...');
    await Payment.insertMany([
      {
        bookingId: bookings[0]._id,
        gateway: 'payfast',
        amount: 70,
        status: 'success',
        transactionRef: 'PF_TXN_001_70',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        bookingId: bookings[2]._id,
        gateway: 'ozow',
        amount: 450,
        status: 'success',
        transactionRef: 'OZ_TXN_002_450',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        bookingId: bookings[3]._id,
        gateway: 'eft',
        amount: 380,
        status: 'success',
        transactionRef: 'EFT_TXN_003_380',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        bookingId: bookings[4]._id,
        gateway: 'payfast',
        amount: 180,
        status: 'refunded',
        transactionRef: 'PF_TXN_004_180_REFUND',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    ]);

    // Create sample test documents
    console.log('Creating test documents...');
    await TestDoc.insertMany([
      {
        title: 'Database Connection Test',
        note: 'This document verifies that the database connection is working properly',
      },
      {
        title: 'API Endpoint Test',
        note: 'Testing all CRUD operations for the API endpoints',
      },
      {
        title: 'Admin Panel Test',
        note: 'Verifying the admin panel functionality with sample data',
      },
    ]);

    console.log('\n✅ Database populated successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users: ${users.length}`);
    console.log(`🏢 Businesses: ${businesses.length}`);
    console.log(`⚙️ Services: ${services.length}`);
    console.log(`📅 Bookings: ${bookings.length}`);
    console.log(`💳 Payments: 4`);
    console.log(`🧪 Test Documents: 3`);

    console.log('\n🔗 Business Details:');
    businesses.forEach((business, index) => {
      console.log(`${index + 1}. ${business.name} (${business.slug})`);
      console.log(`   Owner: ${users[index * 2].name}`);
      console.log(`   Address: ${business.address}`);
      console.log(`   Deposit: ${business.depositPercentage}%`);
    });

    console.log('\n🎯 You can now test your admin panel at /admin');

  } catch (error) {
    console.error('❌ Error populating database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
populateDatabase();
