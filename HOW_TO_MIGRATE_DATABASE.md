# How to Migrate Your Database from Kinde to Clerk

## Overview
This guide helps you migrate your existing user database from Kinde authentication to Clerk.

---

## ⚡ Quick Start (For the Impatient)

```bash
# Step 1: Backup
npm run backup-db

# Step 2: Migrate
npm run migrate-to-clerk

# Step 3: Done! ✅
```

---

## 📚 Step-by-Step Guide

### Step 1: Make Sure MongoDB is Running

Check that your database is accessible:
```bash
# Your .env.local should have:
MONGODB_URI=mongodb://localhost:27017/booking-system
```

### Step 2: Create a Backup

**Always backup first!** This creates a JSON file of all your users:

```bash
npm run backup-db
```

You'll see:
```
💾 Starting database backup...
✅ Connected to MongoDB
📦 Fetching all users...
✅ Found 10 users
💾 Writing backup to file...
✅ Backup created successfully!
   File: backups/users-backup-2025-01-21T10-30-00.json
   Size: 15.23 KB
   Users: 10
```

### Step 3: Run the Migration

This renames `kindeUserId` to `clerkUserId` for all users:

```bash
npm run migrate-to-clerk
```

You'll see:
```
🚀 Starting Clerk migration...
📡 Connecting to MongoDB...
✅ Connected to MongoDB

📊 Found 10 users with 'kindeUserId' field

📋 Sample users before migration:
  1. John Doe (john@example.com)
     kindeUserId: kinde_user_12345

🔄 Performing migration...
✅ Migration completed!
   - Matched: 10 documents
   - Modified: 10 documents

🔍 Verifying migration...
   - Users with clerkUserId: 10
   - Users with kindeUserId: 0

✅ Migration verified successfully!

🎉 Database migration complete!
```

### Step 4: Verify

Check that everything worked:

1. **Open MongoDB:**
   ```javascript
   // In MongoDB Compass or shell
   db.users.findOne()
   
   // You should see:
   {
     "_id": ObjectId("..."),
     "clerkUserId": "kinde_user_12345",  // ✅ Changed!
     "name": "John Doe",
     "email": "john@example.com",
     ...
   }
   ```

2. **Test your app:**
   ```bash
   npm run dev
   ```
   - Try signing up a new user
   - Check the dashboard loads
   - Verify API calls work

---

## 🔄 What Happens to User IDs?

### During Migration
- Field name changes: `kindeUserId` → `clerkUserId`
- **Values stay the same** (e.g., `"kinde_user_12345"`)
- All other user data unchanged

### After Migration (When Users Sign In)
- New users: Get proper Clerk IDs automatically
- Existing users: Will need to sign in with Clerk
  - Your app can match them by email
  - Update their `clerkUserId` to the new Clerk ID

---

## ⏪ Rollback (If Needed)

Made a mistake? No problem:

```bash
npm run rollback-clerk
```

This changes `clerkUserId` back to `kindeUserId`.

Or restore from backup:
```bash
# Find your backup file in backups/
mongoimport --db booking-system --collection users --file backups/users-backup-[timestamp].json --jsonArray
```

---

## 🚨 Common Issues

### "Cannot connect to MongoDB"
**Fix:**
1. Check MongoDB is running
2. Verify `MONGODB_URI` in `.env.local`
3. Test connection: `mongosh mongodb://localhost:27017/booking-system`

### "No users to migrate"
**Fix:**
- Already migrated! ✅
- Or check you're connected to the right database

### Users Can't Sign In After Migration
**Fix:**
1. Make sure Clerk keys are in `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```
2. Clear browser cookies/cache
3. Check browser console for errors

---

## 📋 Complete Checklist

Before migration:
- [ ] MongoDB is running
- [ ] `.env.local` has `MONGODB_URI`
- [ ] Clerk is set up (keys in `.env.local`)
- [ ] Code migration is complete

During migration:
- [ ] Run `npm run backup-db`
- [ ] Backup file created successfully
- [ ] Run `npm run migrate-to-clerk`
- [ ] Migration completed without errors
- [ ] Verification shows correct counts

After migration:
- [ ] Test new user sign-up
- [ ] Test dashboard access
- [ ] Test API endpoints
- [ ] Verify staff permissions work

---

## 💡 Pro Tips

1. **Always backup** before any database changes
2. **Test on development** database first
3. **Keep backups** for at least 30 days
4. **Monitor** for a few days after migration
5. **Communicate** with users about the auth change

---

## 📖 More Resources

- **Quick Start:** `DATABASE_MIGRATION_QUICKSTART.md`
- **Detailed Guide:** `scripts/MIGRATION_GUIDE.md`
- **Main Migration Docs:** `CLERK_MIGRATION_SUMMARY.md`

---

## ❓ Still Have Questions?

The migration is safe and reversible. If you run into issues:
1. Check the error message
2. Review the detailed guide
3. Try the rollback script
4. Restore from backup if needed

**You got this!** 💪

