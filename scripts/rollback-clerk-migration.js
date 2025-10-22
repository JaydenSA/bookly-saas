/**
 * Rollback Script: Clerk to Kinde
 * 
 * This script reverts the migration by renaming 'clerkUserId' back to 'kindeUserId'.
 * Use this ONLY if you need to rollback the Clerk migration.
 * 
 * Usage:
 *   node scripts/rollback-clerk-migration.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/booking-system';

async function rollbackMigration() {
  try {
    console.log('🔄 Starting rollback to Kinde...\n');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    const usersWithClerk = await usersCollection.countDocuments({ clerkUserId: { $exists: true } });
    console.log(`📊 Found ${usersWithClerk} users with 'clerkUserId' field`);

    if (usersWithClerk === 0) {
      console.log('✅ No users to rollback.');
      await mongoose.connection.close();
      return;
    }

    console.log('🔄 Performing rollback...');
    const result = await usersCollection.updateMany(
      { clerkUserId: { $exists: true } },
      { $rename: { clerkUserId: 'kindeUserId' } }
    );

    console.log(`✅ Rollback completed!`);
    console.log(`   - Matched: ${result.matchedCount} documents`);
    console.log(`   - Modified: ${result.modifiedCount} documents\n`);

    console.log('🎉 Rollback complete!\n');

  } catch (error) {
    console.error('❌ Rollback failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

rollbackMigration();

