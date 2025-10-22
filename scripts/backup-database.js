/**
 * Database Backup Script
 * 
 * Creates a JSON backup of your users collection before migration.
 * 
 * Usage:
 *   node scripts/backup-database.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/booking-system';

async function backupDatabase() {
  try {
    console.log('💾 Starting database backup...\n');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    console.log('📦 Fetching all users...');
    const users = await usersCollection.find({}).toArray();
    console.log(`✅ Found ${users.length} users\n`);

    // Create backups directory if it doesn't exist
    const backupsDir = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    // Create backup file with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupsDir, `users-backup-${timestamp}.json`);

    console.log('💾 Writing backup to file...');
    fs.writeFileSync(backupFile, JSON.stringify(users, null, 2));
    
    const fileSize = (fs.statSync(backupFile).size / 1024).toFixed(2);
    console.log(`✅ Backup created successfully!`);
    console.log(`   File: ${backupFile}`);
    console.log(`   Size: ${fileSize} KB`);
    console.log(`   Users: ${users.length}\n`);

    console.log('🎉 Backup complete!\n');

  } catch (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

backupDatabase();

