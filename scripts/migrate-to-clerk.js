/**
 * Database Migration Script: Kinde to Clerk
 * 
 * This script renames the 'kindeUserId' field to 'clerkUserId' in the User collection.
 * 
 * Usage:
 *   node scripts/migrate-to-clerk.js
 * 
 * IMPORTANT: Make a backup of your database before running this script!
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// MongoDB connection URI - update this if needed
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/booking-system';

async function migrateDatabase() {
  try {
    console.log('🚀 Starting Clerk migration...\n');
    
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Check how many users have kindeUserId
    const usersWithKinde = await usersCollection.countDocuments({ kindeUserId: { $exists: true } });
    console.log(`📊 Found ${usersWithKinde} users with 'kindeUserId' field`);

    if (usersWithKinde === 0) {
      console.log('✅ No users to migrate. All done!');
      await mongoose.connection.close();
      return;
    }

    // Show a few examples before migration
    console.log('\n📋 Sample users before migration:');
    const samples = await usersCollection.find({ kindeUserId: { $exists: true } }).limit(3).toArray();
    samples.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name} (${user.email})`);
      console.log(`     kindeUserId: ${user.kindeUserId}`);
    });

    // Confirm migration
    console.log('\n⚠️  This will rename "kindeUserId" to "clerkUserId" for all users.');
    console.log('⚠️  Make sure you have a database backup before proceeding!\n');

    // Perform the migration
    console.log('🔄 Performing migration...');
    const result = await usersCollection.updateMany(
      { kindeUserId: { $exists: true } },
      { $rename: { kindeUserId: 'clerkUserId' } }
    );

    console.log(`✅ Migration completed!`);
    console.log(`   - Matched: ${result.matchedCount} documents`);
    console.log(`   - Modified: ${result.modifiedCount} documents\n`);

    // Verify migration
    console.log('🔍 Verifying migration...');
    const usersWithClerk = await usersCollection.countDocuments({ clerkUserId: { $exists: true } });
    const remainingKinde = await usersCollection.countDocuments({ kindeUserId: { $exists: true } });

    console.log(`   - Users with clerkUserId: ${usersWithClerk}`);
    console.log(`   - Users with kindeUserId: ${remainingKinde}`);

    if (remainingKinde === 0 && usersWithClerk === usersWithKinde) {
      console.log('\n✅ Migration verified successfully!');
    } else {
      console.log('\n⚠️  Warning: Migration may not have completed successfully.');
      console.log('   Please check your database manually.');
    }

    // Show samples after migration
    console.log('\n📋 Sample users after migration:');
    const samplesAfter = await usersCollection.find({ clerkUserId: { $exists: true } }).limit(3).toArray();
    samplesAfter.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name} (${user.email})`);
      console.log(`     clerkUserId: ${user.clerkUserId}`);
    });

    console.log('\n🎉 Database migration complete!\n');
    console.log('📝 Next steps:');
    console.log('   1. Update your .env.local with Clerk API keys');
    console.log('   2. Test user authentication');
    console.log('   3. Verify all users can sign in\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('📡 Disconnected from MongoDB');
  }
}

// Run migration
migrateDatabase();

