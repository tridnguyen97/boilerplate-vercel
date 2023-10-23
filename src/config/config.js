const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../../.env'), override: true });

/**
 * @author Mohamed Riyad <m@ryad.me>
 *
 * This function will reload the .env variables.
 */
const reloadEnv = () => {
  const envConfig = dotenv.parse(fs.readFileSync('.env'));

  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const key in envConfig) {
    process.env[key] = envConfig[key];
  }
};

// Reload .env variables
reloadEnv();

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    DATABASE_URL: Joi.string().description('database connection string'),
    LOGGER_PATH: Joi.string().description('Log directory'),
    HOST_URL: Joi.string().description('URL of current host'),
    TIMEZONE: Joi.string().description('Timezone'),
    DB_NAME: Joi.string().description('database name'),
    DB_PASSWORD: Joi.string().description('database password'),
    DB_HOST: Joi.string().description('db host'),
    DB_USERNAME: Joi.string().description('db username'),
    DB_PORT: Joi.string().description('db port'),
    STRINGEE_API_KEY: Joi.string().description('Stringee api key'),
    STRINGEE_API_SECRET: Joi.string().description('Stringee api secret'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  database: {
    url: envVars.DATABASE_URL,
    name: envVars.DB_NAME,
    password: envVars.DB_PASSWORD,
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    username: envVars.DB_USERNAME,
  },
  stringee: {
    apiKeySecret: envVars.STRINGEE_API_SECRET,
    apiKeySid: envVars.STRINGEE_API_KEY,
  },
  log_path: envVars.LOGGER_PATH,
  host_url: envVars.HOST_URL,
  timezone: envVars.TIMEZONE,
};
