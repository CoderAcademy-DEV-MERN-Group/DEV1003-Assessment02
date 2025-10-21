const { JWT_SECRET_KEY, TOKEN_HEADER_KEY } = process.env;

const jwtConfig = {
  JWT_SECRET_KEY: JWT_SECRET_KEY || 'test-dev-secret-key',
  TOKEN_HEADER_KEY: TOKEN_HEADER_KEY || 'Authorization',
};

export default jwtConfig;
