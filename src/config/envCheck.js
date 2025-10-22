export const validateEnv = () => {
  // CRITICAL application env variables, the app will not run without these
  const required = ['JWT_SECRET_KEY', 'TOKEN_HEADER_KEY', 'MONGODB_URI', 'NODE_ENV'];
  const missing = required.filter((env) => !process.env[env]);

  if (missing.length > 0) {
    console.error('CRITICAL: Missing required environment variables: ');
    missing.forEach((env) => console.error(`  - ${env}`));
    process.exit(1);
  }

  // Important but not application breaking env variables, API KEY only used for seeding, or adding new movies (not implemented in v.0.1)
  const important = ['OMDB_API_KEY'];
  const missingImportant = important.filter((env) => !process.env[env]);

  if (missingImportant.length > 0 && process.env.NODE_ENV !== 'production') {
    console.warn(' DEVELOPMENT: Missing imporant environment variables');
    missingImportant.forEach((env) => console.warn(`  - ${env} (some features disabled)`));
  }

  // Security checks for encrypted variables
  if (process.env.NODE_ENV === 'production') {
    if (
      process.env.JWT_SECRET_KEY.includes('example') ||
      process.env.JWT_SECRET_KEY === 'your_secret_key_here'
    ) {
      console.error('SECURITY ERROR: Change JWT_SECRET_KEY in production!');
      process.exit(1);
    }
  }

  console.log('Environment validation passed');
};

export default validateEnv;
