# Database Seeding Scripts

This directory contains scripts to seed the database with initial data.

## Available Scripts

### Super Admin Seeding

Creates a super admin user with full system access.

**Command:**
```bash
npm run seed:superadmin
```

**Super Admin Details:**
- Email: `superadmin@elevate.com`
- Password: `321ewq`
- Name: Super Administrator
- Role: superadmin
- Permissions: All system permissions

### Fix Existing Super Admin

If you have an existing super admin that's not working, you can fix it by making it verified and updating the password.

**Command:**
```bash
npm run fix:superadmin
```

This will:
- Set the existing super admin as verified
- Update the password to "321ewq"
- Clear any pending OTP verification

## Prerequisites

1. Make sure MongoDB is running
2. Set up your environment variables in `.env` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/elevate-placement-tracker
   ```

## Usage

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Run the seeding script:
   ```bash
   npm run seed:superadmin
   ```

## Notes

- The script checks if a super admin already exists before creating a new one
- If a super admin already exists, the script will display the existing user's information
- The password is automatically hashed using bcrypt before saving to the database
- The super admin account is created with `isVerified: true` for immediate access
