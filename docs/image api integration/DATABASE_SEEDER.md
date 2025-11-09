# Database Seeder

## Overview

The database seeder populates your database with sample data for development and testing purposes. It creates realistic data across all tables to help you develop and test features without manually creating data.

## What Gets Seeded

The seeder creates the following data:

### 1. Users (3 users)
- **Admin User**
  - Email: `admin@mindak.com`
  - Username: `admin`
  - Password: `password123`
  - Role: `admin`

- **Test User**
  - Email: `user@mindak.com`
  - Username: `testuser`
  - Password: `password123`
  - Role: `user`

- **John Doe**
  - Email: `john.doe@example.com`
  - Username: `johndoe`
  - Password: `password123`
  - Role: `user`

### 2. Service Categories (5 categories)
- Digital Marketing (active)
- Web Development (active)
- Branding & Design (active)
- Content Creation (active)
- Consulting (inactive - for testing)

### 3. Services (10 services)
Distributed across the categories with realistic names, descriptions, and prices:
- Social Media Management ($999.99)
- SEO Optimization ($1,499.99)
- PPC Advertising ($1,999.99)
- Custom Website Development ($4,999.99)
- E-commerce Solutions ($6,999.99)
- Website Maintenance ($299.99)
- Logo Design ($799.99)
- Brand Identity Package ($2,499.99)
- Video Production ($1,999.99)
- Blog Writing ($199.99)

### 4. Form Questions & Answers
- **Podcast Form**: 6 general questions including name, email, phone, topic, date, and referral source
- **Services Form**: 5 general questions including company name, contact info, budget, and timeline
- **Service-Specific Questions**: Questions tied to specific services (e.g., social media platforms for Social Media Management)
- **Multiple Choice Answers**: Pre-defined options for select/radio/checkbox questions

### 5. Reservations
- **2 Podcast Reservations**: One pending, one confirmed
- **2 Service Reservations**: One pending, one confirmed
- All with realistic client answers and metadata

### 6. Analytics Events (6 events)
- Reservation submissions and confirmations
- Form views
- Service views

## Usage

### Prerequisites

1. **Database must be running**
   ```bash
   yarn docker:up
   ```

2. **Migrations must be applied**
   ```bash
   yarn migration:run
   ```

### Running the Seeder

#### Development Database
```bash
yarn seed
```

This will seed your development database (configured via `DB_HOST`, `DB_PORT`, `DB_NAME`, etc.)

#### Test Database
```bash
yarn seed:test
```

This will seed your test database (configured via `TEST_DB_HOST`, `TEST_DB_PORT`, `TEST_DB_NAME`, etc.)

### Expected Output

When the seeder runs successfully, you'll see output like:

```
🌱 Starting database seeding...
👤 Seeding users...
✅ Created 3 users
📁 Seeding service categories...
✅ Created 5 service categories
🛠️  Seeding services...
✅ Created 10 services
❓ Seeding form questions...
💬 Seeding form question answers...
✅ Created form questions and answers
🎙️  Seeding podcast reservations...
✅ Created 2 podcast reservations
🛎️  Seeding service reservations...
✅ Created 2 service reservations
📊 Seeding analytics events...
✅ Created analytics events

✨ Database seeding completed successfully!

📝 Summary:
   - 3 users created
   - 5 service categories created
   - 10 services created
   - Multiple form questions and answers created
   - 2 podcast reservations created
   - 2 service reservations created
   - 6 analytics events created

🔑 Test credentials:
   Admin: admin@mindak.com / password123
   User: user@mindak.com / password123

👋 Seeding process finished
```

## Important Notes

### ⚠️ Data Duplication

The seeder does **NOT** check for existing data. Running it multiple times will create duplicate entries. This is intentional for testing purposes.

If you want a clean slate:

1. **Drop and recreate the database**, or
2. **Manually delete data** from tables before re-seeding

### 🔄 Re-running the Seeder

To re-seed with fresh data:

```bash
# Option 1: Drop and recreate database (Docker)
yarn docker:down
yarn docker:up
yarn migration:run
yarn seed

# Option 2: Manually clear tables (if you have a clear script)
# Then run:
yarn seed
```

### 🧪 Testing with Seeded Data

The seeded data is perfect for:
- Testing authentication (use the provided credentials)
- Testing service browsing and filtering
- Testing form submissions
- Testing reservation workflows
- Testing admin features (status updates, notes)
- Testing analytics tracking

### 🔐 Security

**Never run the seeder in production!** The seeder:
- Uses hardcoded passwords
- Creates test data
- Is designed for development/testing only

## Customizing the Seeder

The seeder is located at `src/infra/database/seed.ts`. You can modify it to:
- Add more sample data
- Change the test credentials
- Add data specific to your testing needs
- Adjust the sample data to match your use cases

## Troubleshooting

### Error: "Variable DB_HOST not found in environment"
Make sure you have a `.env` file with all required database configuration variables.

### Error: "relation does not exist"
Run migrations first: `yarn migration:run`

### Error: "duplicate key value violates unique constraint"
The seeder has been run before. Either:
1. Clear the database and re-run migrations
2. Modify the seeder to use different unique values

### Connection Issues
Ensure Docker containers are running: `yarn docker:up`

## Related Documentation

- [Database Schema](./implementation%20docs/DATABASE_SCHEMA.md) - Complete schema reference
- [API Documentation](./api/CLIENT_API_DOCUMENTATION.md) - API endpoints that use this data
- [Admin API Documentation](./ADMIN_API_DOCUMENTATION.md) - Admin endpoints for managing data

## Script Location

**File**: `src/infra/database/seed.ts`

**Package.json scripts**:
- `seed`: Seeds development database
- `seed:test`: Seeds test database
