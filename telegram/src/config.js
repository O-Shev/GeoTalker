const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envFilePath = path.join(__dirname, '../', '.env');
const envLocalFilePath = path.join(__dirname, '../', '.env.local');

if (fs.existsSync(envLocalFilePath)) {
  console.log(`Use ${envLocalFilePath} file`);
  dotenv.config({ path: envLocalFilePath });
} else if (fs.existsSync(envFilePath)) {
  console.log(`Use ${envFilePath} file`);
  dotenv.config({ path: envFilePath });
} else {
  console.log('WARNING: env file not specified');
}

const T_CREDENTIALS = {
  phone_number: process.env.PHONE_NUMBER,
  password: process.env.PASSWORD,
  api_id: process.env.API_ID,
  api_hash: process.env.API_HASH
};

const T_CONFIG = {
  receive_timeout: process.env.RECEIVE_TIMEOUT || 0,
  database_directory: process.env.DATABASE_DIRECTORY || 'tdb',
  application_version: process.env.npm_package_version || 'undefined',
  device_model:  'pc',

  CORE_URL: process.env.CORE_URL,
  FILE_MAX_SIZE_TO_DOWNLOAD: Number(process.env.FILE_MAX_SIZE_TO_DOWNLOAD),
  MINIO_BUCKET_PROFILE_PHOTO:  process.env.MINIO_BUCKET_TELEGRAM_PROFILE_PHOTO,
  MINIO_BUCKET_PHOTO:  process.env.MINIO_BUCKET_TELEGRAM_PHOTO,
  MINIO_BUCKET_VIDEO: process.env.MINIO_BUCKET_TELEGRAM_VIDEO,
  MINIO_BUCKET_VIDEO_NOTE: process.env.MINIO_BUCKET_TELEGRAM_VIDEO_NOTE,
  MINIO_BUCKET_AUDIO: process.env.MINIO_BUCKET_TELEGRAM_AUDIO,
  MINIO_BUCKET_VOICE_NOTE: process.env.MINIO_BUCKET_TELEGRAM_VOICE_NOTE,
  MINIO_BUCKET_STICKER:  process.env.MINIO_BUCKET_TELEGRAM_STICKER,
  MINIO_BUCKET_ANIMATION:  process.env.MINIO_BUCKET_TELEGRAM_ANIMATION,
};

const PG_CONFIG = {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
};

const MINIO_CONFIG = {
  endPoint: process.env.MINIO_HOST,
  port: Number(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
};

const API_S_CONFIG = {
  port: process.env.API_PORT
};

module.exports = {
  T_CREDENTIALS,
  T_CONFIG,
  API_S_CONFIG,
  PG_CONFIG,
  MINIO_CONFIG
};
