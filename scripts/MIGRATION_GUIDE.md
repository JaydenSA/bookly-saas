# Database Migration Guide: Kinde → Clerk

This guide will walk you through migrating your user database from Kinde to Clerk authentication.

## Prerequisites

- ✅ Clerk dependencies installed (`@clerk/nextjs`)
- ✅ Kinde dependencies removed
- ✅ Code migrated to use Clerk
- ✅ MongoDB running and accessible
- ✅ `.env.local` file with `MONGODB_URI`

## Migration Steps

### Step 1: Backup Your Database 💾

**IMPORTANT:** Always backup before migration!

```bash
npm run backup-db
```

This creates a JSON backup in `backups/users-backup-[timestamp].json`

### Step 2: Review What Will Change 📋

The migration will rename the database field:
- **Before:** `kindeUserId: "kinde_xyz123"`
- **After:** `clerkUserId: "kinde_xyz123"`

**Note:** The actual user ID values won't change initially. You'll update them to Clerk IDs as users sign in.

### Step 3: Run the Migration 🚀

```bash
npm run migrate-to-clerk
```

The script will:
1. Connect to MongoDB
2. Show you how many users will be affected
3. Display sample users before migration
4. Perform the field rename
5. Verify the migration succeeded
6. Show sample users after migration

**Expected Output:**
```
🚀 Starting Clerk migration...
📡 Connecting to MongoDB...
✅ Connected to MongoDB

📊 Found 5 users with 'kindeUserId' field

📋 Sample users before migration:
  1. John Doe (john@example.com)
     kindeUserId: kinde_user_001

🔄 Performing migration...
✅ Migration completed!
   - Matched: 5 documents
   - Modified: 5 documents

🔍 Verifying migration...
   - Users with clerkUserId: 5
   - Users with kindeUserId: 0

✅ Migration verified successfully!

📋 Sample users after migration:
  1. John Doe (john@example.com)
     clerkUserId: kinde_user_001

🎉 Database migration complete!
```

### Step 4: Update User IDs (Post-Migration) 🔄

After migration, existing users will have their old Kinde IDs stored in `clerkUserId`. You have two options:

#### Option A: Progressive Update (Recommended)
Users get new Clerk IDs as they sign in:
1. User signs in with Clerk
2. Your app creates/updates their record with the new Clerk ID
3. Over time, all active users will have proper Clerk IDs

#### Option B: Manual Update
If you need to immediately update user IDs:
1. Export users from Kinde dashboard
2. Have users sign up in Clerk
3. Match users by email
4. Update IDs manually

For most use cases, **Option A** is recommended as it's automatic and doesn't require user action.

### Step 5: Verify Migration ✅

1. **Check database directly:**
   ```javascript
   // In MongoDB shell
   db.users.findOne()
   // Should show 'clerkUserId' instead of 'kindeUserId'
   ```

2. **Test in your app:**
   ```bash
   npm run dev
   ```
   - Try signing up a new user
   - Check that they're created with `clerkUserId`
   - Verify dashboard loads correctly

## Rollback (If Needed) ⏪

If something goes wrong, you can rollback:

```bash
npm run rollback-clerk
```

This will rename `clerkUserId` back to `kindeUserId`.

## Restore from Backup

If you need to completely restore from backup:

1. Find your backup file in `backups/`
2. Use MongoDB import tool:
   ```bash
   mongoimport --db booking-system --collection users --file backups/users-backup-[timestamp].json --jsonArray
   ```

## Troubleshooting

### "Connection failed"
- Check your `MONGODB_URI` in `.env.local`
- Ensure MongoDB is running
- Verify connection string is correct

### "No users to migrate"
- Database might already be migrated
- Check if `clerkUserId` field already exists
- Verify you're connected to the correct database

### "Migration count mismatch"
- Some users might have both fields
- Check database manually
- Consider running a cleanup script

### Users can't sign in after migration
- Make sure Clerk is properly configured in `.env.local`
- Verify middleware is updated
- Check browser console for errors
- Clear browser cache/cookies

## Post-Migration Checklist

- [ ] Backup created successfully
- [ ] Migration script ran without errors
- [ ] All users have `clerkUserId` field
- [ ] No users have `kindeUserId` field
- [ ] New user signup works
- [ ] Existing user can access dashboard (if they have a Clerk account)
- [ ] API endpoints return correct data
- [ ] Staff permissions work correctly

## Important Notes

⚠️ **Existing User Sessions:**
- Old Kinde sessions will be invalid
- Users will need to sign in again with Clerk
- Consider adding a notification banner

⚠️ **User Experience:**
- Existing users will need to create/sign in with Clerk
- Email addresses should match their previous Kinde accounts
- Consider email communication about the auth change

⚠️ **Data Integrity:**
- The migration only renames the field
- All other user data (name, email, role, permissions) remains unchanged
- Business relationships and bookings are unaffected

## Need Help?

If you encounter issues:
1. Check the error message carefully
2. Verify all prerequisites are met
3. Ensure backups are created
4. Try the rollback script if needed
5. Check CLERK_MIGRATION_SUMMARY.md for more details

---

**Last Updated:** $(date)
**Script Version:** 1.0.0

