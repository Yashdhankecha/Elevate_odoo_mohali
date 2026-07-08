/**
 * utils/validateEnv.js
 * Validates that all required environment variables are present at startup.
 * Call validateEnv() as the first line of server.js.
 */

const REQUIRED_ENV = [
  'JWT_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'EMAIL_USER',
  'EMAIL_PASS',
];

// Optional but warn if missing
const OPTIONAL_ENV = [
  'MONGODB_URI',
  'CLIENT_URL',
  'GROQ_API_KEY',
  'PORT',
];

const validateEnv = () => {
  const missing = REQUIRED_ENV.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   • ${key}`));
    console.error('\n   Add these to your .env file and restart the server.\n');
    process.exit(1);
  }

  const missingOptional = OPTIONAL_ENV.filter(key => !process.env[key]);
  if (missingOptional.length > 0) {
    console.warn('⚠️  Missing optional environment variables (defaults will be used):');
    missingOptional.forEach(key => console.warn(`   • ${key}`));
  }

  console.log('✅ Environment variables validated');
};

module.exports = validateEnv;
