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

const CONFIG = {
    NOMINATIM_HOST: process.env.API_NOMINATIM_URL,
    LOOKUP_CHUNK_SIZE: Number(process.env.LOOKUP_CHUNK_SIZE),
    TOLERANCE_RATIO: Number(process.env.TOLERANCE_RATIO),
    QUANTIZATION: Number(process.env.QUANTIZATION),
    MAX_DIAGONAL_LENGTH: Number(process.env.MAX_DIAGONAL_LENGTH),
    MINIO_BOUNDARIES_BUCKET:  process.env.MINIO_BUCKET_BOUNDARIES
}

const MINIO_CONFIG = {
    endPoint: process.env.MINIO_HOST,
    port: Number(process.env.MINIO_PORT),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
}

const API_S_CONFIG = {
    PORT: process.env.API_PORT
};

module.exports = {
    CONFIG,
    API_S_CONFIG,
    MINIO_CONFIG
};