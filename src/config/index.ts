import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config = {
  server: {
    port: +process.env.SERVER_PORT || 7777,
    origin: process.env.SERVER_ORIGIN || 'http://localhost:3000',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    type: (process.env.DB_TYPE || 'postgres') as MysqlConnectionOptions['type'] | PostgresConnectionOptions['type'],
    port: +process.env.DB_PORT || 5432,
    database: process.env.DB_DATABASE || 'truthy',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
    synchronize: process.env.DB_SYNCHRONIZE === 'true' || false,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: +process.env.JWT_EXPIRES_IN || 900,
    refreshExpiresIn: +process.env.JWT_REFRESH_EXPIRES_IN || 604800,
    cookieExpiresIn: +process.env.JWT_COOKIE_EXPIRES_IN || 604800,
  },
  app: {
    fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
    name: process.env.APP_NAME || 'Truthy',
    version: process.env.APP_VERSION || 'v0.1',
    description: process.env.APP_DESCRIPTION || 'Official Truthy API',
    appUrl: process.env.APP_URL || 'http://localhost:7777',
    frontendUrl: process.env.APP_FRONTEND_URL || 'http://localhost:3000',
    sameSite: process.env.APP_SAME_SITE || true,
    stage: process.env.APP_STAGE || 'development',
  },
  mail: {
    host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
    port: +process.env.MAIL_PORT || 2525,
    user: process.env.MAIL_USER || 'f4a511d60957e6',
    pass: process.env.MAIL_PASS || '7522797b96cef0',
    from: process.env.MAIL_FROM || 'truthycms',
    fromMail: process.env.MAIL_FROM_MAIL || 'truthycms@gmail.com',
    preview: process.env.MAIL_PREVIEW === 'true' || true,
    secure: process.env.MAIL_SECURE === 'true' || false,
    ignoreTLS: process.env.MAIL_IGNORE_TLS === 'true' || true,
    queueName: process.env.MAIL_QUEUE_NAME || 'truthy-mail',
  },
  redis: {
    driver: process.env.REDIS_DRIVER || 'redis',
    host: process.env.REDIS_HOST || 'localhost',
    port: +process.env.REDIS_PORT || 6379,
    db: process.env.REDIS_DB || '',
    password: process.env.REDIS_PASSWORD || '',
    username: process.env.REDIS_USERNAME || '',
  },
  throttle: {
    global: {
      ttl: +process.env.THROTTLE_GLOBAL_TTL || 60,
      limit: +process.env.THROTTLE_GLOBAL_LIMIT || 60,
    },
    login: {
      prefix: process.env.THROTTLE_LOGIN_PREFIX || 'login_fail_throttle',
      limit: +process.env.THROTTLE_LOGIN_LIMIT || 5,
      duration: +process.env.THROTTLE_LOGIN_DURATION || 60 * 60 * 24 * 30, // Store number for 30 days since first fail
      blockDuration: +process.env.THROTTLE_LOGIN_BLOCK_DURATION || 3000,
    },
  },
  twofa: {
    authenticationAppNAme: process.env.TWOFA_AUTHENTICATION_APP_NAME || 'truthy',
  },
  winston: {
    name: process.env.WINSTON_NAME || 'Truthy CMS',
    groupName: process.env.WINSTON_GROUP_NAME || 'truthy',
    streamName: process.env.WINSTON_STREAM_NAME || 'truthy-stream',
    awsAccessKeyId: process.env.WINSTON_AWS_ACCESS_KEY_ID || '',
    awsSecretAccessKey: process.env.WINSTON_AWS_SECRET_ACCESS_KEY || '',
    awsRegion: process.env.WINSTON_AWS_REGION || '',
    consoleAppName: process.env.WINSTON_CONSOLE_APP_NAME || 'truthy-console',
  },
};

type Config = typeof config;
export default {
  get<K extends keyof Config>(key: K): Config[K] {
    return config[key];
  },
};
