const {T_CREDENTIALS, T_CONFIG, API_S_CONFIG, PG_CONFIG, MINIO_CONFIG} = require('./config.js');
const TClient = require('./telegram/TClient');
const ApiServer = require('./ApiServer');
const pg  = require('pg');
const Minio = require('minio');

const main = async () => {
    const pg_client = new pg.Client(PG_CONFIG);
    await pg_client.connect().then(() => {console.log('Connected to PostgreSQL database');}).catch(error => {console.error('Error connecting to PostgreSQL database:', error);});

    const minio_client = new Minio.Client(MINIO_CONFIG);

    const t_client = new TClient(T_CREDENTIALS, T_CONFIG, pg_client, minio_client);
    const apiServer = new ApiServer(t_client, API_S_CONFIG);

    t_client.start();
    apiServer.start();
};

main();





