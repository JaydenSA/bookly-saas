# 🚀 Quick Start: Database Migration

## TL;DR - 3 Simple Steps

### 1️⃣ Backup (1 minute)
```bash
npm run backup-db
```

### 2️⃣ Migrate (1 minute)
```bash
npm run migrate-to-clerk
```

### 3️⃣ Test (5 minutes)
```bash
npm run dev
# Try signing up a new user
# Verify everything works
```

## That's it! 🎉

---

## What This Does

**Before:**
```javascript
{
  "_id": "507f1f77bcf86cd799439011",
  "kindeUserId": "kinde_user_001",  // ❌ Old field
  "name": "John Doe",
  "email": "john@example.com",
  "role": "owner"
}
```

**After:**
```javascript
{
  "_id": "507f1f77bcf86cd799439011",
  "clerkUserId": "kinde_user_001",  // ✅ New field (same value initially)
  "name": "John Doe",
  "email": "john@example.com",
  "role": "owner"
}
```

## Available Commands

| Command | What It Does |
|---------|-------------|
| `npm run backup-db` | Creates a backup of your users |
| `npm run migrate-to-clerk` | Migrates kindeUserId → clerkUserId |
| `npm run rollback-clerk` | Reverts the migration (emergency use) |

## Need More Details?

📖 Read the full guide: `scripts/MIGRATION_GUIDE.md`

## Troubleshooting

**Error: "Connection failed"**
→ Check your `.env.local` has `MONGODB_URI`

**Error: "No users to migrate"**
→ Already migrated! You're good to go.

**Users can't sign in**
→ Make sure Clerk is configured in `.env.local`

---

💡 **Pro Tip:** Always run `npm run backup-db` before any database changes!

