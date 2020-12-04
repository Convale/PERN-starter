const PORT = 5000;
const API_URL = "http://localhost:5000";
const BASE_URL = "http://localhost:3000";
const DB_PASSWORD = "password123";
const ACCESS_TOKEN_SECRET = "secret_kittens";
const ACCESS_TOKEN_EXPIRATION = 3600; // seconds
const REFRESH_TOKEN_SECRET = "secret_dogs";
const REFRESH_TOKEN_EXPIRATION = 604800; // seconds
const RESET_TOKEN_SECRET = "top_secret";
const RESET_TOKEN_EXPIRATION = 86400; // seconds
const VERIFICATION_TOKEN_SECRET = "secret_santa";
const EMAIL_FROM = "nannie53@ethereal.email";
const SMTP_OPTIONS = {
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "nannie53@ethereal.email",
    pass: "yWsSXyBGY9fXmuY71d",
  },
};

module.exports = {
  PORT,
  API_URL,
  BASE_URL,
  DB_PASSWORD,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRATION,
  RESET_TOKEN_SECRET,
  RESET_TOKEN_EXPIRATION,
  VERIFICATION_TOKEN_SECRET,
  EMAIL_FROM,
  SMTP_OPTIONS,
};
