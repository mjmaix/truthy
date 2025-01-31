import * as dotenv from 'dotenv';

dotenv.config({
  path: __dirname + `/../config/.env.${process.env.NODE_ENV}`,
  debug: true
});

export default {
  server: {
    port: 7777,
    origin: 'http://localhost:3000'
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    type: process.env.DB_TYPE || 'postgres',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_DATABASE_NAME || 'truthy',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
    synchronize: false
  },
  jwt: {
    expiresIn: 900,
    refreshExpiresIn: 604800,
    cookieExpiresIn: 604800,
    secret: 's3r3t'
  },
  app: {
    fallbackLanguage: 'en',
    name: 'Truthy',
    version: 'v0.1',
    description: 'Official Truthy API',
    appUrl: 'http://localhost:7777',
    frontendUrl: 'http://localhost:3000',
    sameSite: true
  },
  mail: {
    host: 'smtp.mailtrap.io',
    port: 2525,
    user: 'f4a511d60957e6',
    pass: '7522797b96cef0',
    from: 'truthycms',
    fromMail: 'truthycms@gmail.com',
    preview: true,
    secure: false,
    ignoreTLS: true,
    queueName: 'truthy-mail'
  },
  queue: {
    driver: 'redis',
    host: 'localhost',
    port: 6379,
    db: '',
    password: '',
    username: ''
  },
  throttle: {
    global: {
      ttl: 60,
      limit: 60
    },
    login: {
      prefix: 'login_fail_throttle',
      limit: 5,
      duration: 2592000,
      blockDuration: 3000
    }
  },
  twofa: {
    authenticationAppNAme: 'truthy'
  },
  winston: {
    groupName: 'truthy',
    streamName: 'truthy-stream',
    awsAccessKeyId: '',
    awsSecretAccessKey: '',
    awsRegion: ''
  }
};
