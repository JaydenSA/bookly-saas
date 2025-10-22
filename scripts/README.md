# Database Scripts

This directory contains scripts for managing your MongoDB database.

## 🔄 Migration Scripts (Kinde → Clerk)

### Quick Migration (3 steps)
```bash
# 1. Backup your database
npm run backup-db

# 2. Run migration
npm run migrate-to-clerk

# 3. Test your app
npm run dev
```

**📖 For detailed instructions, see [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)**

---

## 📊 Database Population Scripts

Scripts to populate your MongoDB database with sample data for testing the admin panel and API endpoints.

## Available Scripts

### 1. JavaScript Version
```bash
npm run populate-db
```

### 2. TypeScript Version (Recommended)
```bash
npm run populate-db:ts
```

## What the Script Does

The population script creates realistic sample data for your booking system:

### 👥 Users (4 users)
- **2 Business Owners**: John Smith (Elite Hair Salon), Mike Davis (Zen Wellness Spa)
- **2 Staff Members**: Sarah Johnson, Emma Wilson
- All users have Kinde authentication IDs, contact information, and proper role assignments

### 🏢 Businesses (2 businesses)
- **Elite Hair Salon**: Premium hair salon in Cape Town
- **Zen Wellness Spa**: Relaxing wellness spa in Johannesburg
- Both businesses have complete profiles including working hours, payment gateways, and deposit policies

### ⚙️ Services (6 services)
- **Hair Salon Services**: Haircut & Style, Hair Color, Hair Wash & Blow Dry
- **Spa Services**: Deep Tissue Massage, Facial Treatment, Manicure & Pedicure
- Services include pricing, duration, and deposit requirements

### 📅 Bookings (5 bookings)
- Mix of pending, confirmed, completed, and cancelled bookings
- Various payment statuses (unpaid, deposit_paid, paid, refunded)
- Real client information with contact details
- Booking dates spread across past, present, and future

### 💳 Payments (4 payments)
- Different payment gateways (PayFast, Ozow, EFT)
- Various payment statuses and transaction references
- Linked to corresponding bookings

### 🧪 Test Documents (3 documents)
- Sample test documents for API testing

## Sample Data Details

### Elite Hair Salon
- **Owner**: John Smith
- **Staff**: Sarah Johnson
- **Services**: Haircut & Style (R350), Hair Color (R850), Hair Wash & Blow Dry (R180)
- **Deposit Policy**: 20%
- **Working Hours**: Mon-Fri 9AM-6PM, Sat 9AM-3PM, Closed Sunday

### Zen Wellness Spa
- **Owner**: Mike Davis
- **Staff**: Emma Wilson
- **Services**: Deep Tissue Massage (R450), Facial Treatment (R380), Manicure & Pedicure (R280)
- **Deposit Policy**: 25%
- **Working Hours**: Mon-Fri 8AM-7PM, Sat 8AM-5PM, Sun 9AM-3PM

## Prerequisites

1. **MongoDB Connection**: Ensure your `MONGODB_URI` environment variable is set correctly
2. **Database Access**: Make sure your MongoDB instance is running and accessible
3. **Environment Setup**: Your `.env.local` file should contain the MongoDB connection string

## Important Notes

⚠️ **WARNING**: This script will **DELETE ALL EXISTING DATA** in your database before populating it with sample data. Make sure you're running this on a development database, not production!

## Usage

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Run the population script** (in a separate terminal):
   ```bash
   npm run populate-db:ts
   ```

3. **Visit your admin panel**:
   Navigate to `http://localhost:3000/admin` to see the populated data

## Customization

You can modify the script to:
- Add more sample data
- Change business details
- Adjust pricing and services
- Add different user roles
- Modify booking dates and statuses

The script is designed to be easily customizable - just edit the arrays in the `populateDatabase()` function.

## Troubleshooting

### Common Issues:

1. **Connection Error**: Check your `MONGODB_URI` environment variable
2. **Permission Error**: Ensure your MongoDB user has read/write permissions
3. **Schema Validation Error**: Make sure your models match the data structure in the script

### Need Help?

If you encounter any issues, check:
- Your MongoDB connection string
- Database permissions
- Model schema definitions
- Environment variable configuration
