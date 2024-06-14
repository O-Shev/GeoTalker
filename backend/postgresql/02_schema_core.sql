CREATE SCHEMA core;

CREATE TYPE core.user_account_role AS ENUM ('ROOT', 'ADMIN', 'SUPER_USER', 'USER');
CREATE TYPE core.user_account_provider AS ENUM ('GOOGLE', 'LOCAL');
CREATE TYPE core.osm_type AS ENUM ('N', 'W', 'R');
CREATE TYPE core.wiretap_status AS ENUM (
    'READY',
    'WAITING',
    'DEACTIVATED'
);
CREATE TYPE core.interlink_type AS ENUM (
    'HASH',
    'USERNAME'
);

CREATE TABLE core.user_account(
    id SERIAL PRIMARY KEY,
    provider core.user_account_provider NOT NULL,
    name varchar(255),
    profile_photo varchar(255),
    email varchar(320) NOT NULL,
    verified boolean,
    password varchar(255),
    role core.user_account_role NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE core.confirmation_token(
    id SERIAL PRIMARY KEY,
    value varchar NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_account_id INT NOT NULL REFERENCES core.user_account(id)
);


CREATE TABLE core.locality(
    id SERIAL PRIMARY KEY,

    osm_type core.osm_type NOT NULL,
    osm_id BIGINT NOT NULL,

    display_name VARCHAR,

    rank_address INT NOT NULL,

    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,

    min_latitude DOUBLE PRECISION NOT NULL,
    max_latitude DOUBLE PRECISION NOT NULL,
    min_longitude DOUBLE PRECISION NOT NULL,
    max_longitude DOUBLE PRECISION NOT NULL,

    CONSTRAINT uq_locality_osm UNIQUE (osm_type, osm_id)
);

CREATE TABLE core.wiretap(
    id SERIAL PRIMARY KEY,

    user_account_id INT NOT NULL,
    locality_id INT NOT NULL,

    telegram_supergroup_id BIGINT,
    telegram_supergroup_api_id INT,

    primary_interlink varchar(255) NOT NULL, -- as url

    status core.wiretap_status NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (locality_id) REFERENCES core.locality(id),
    FOREIGN KEY (telegram_supergroup_id, telegram_supergroup_api_id) REFERENCES telegram.supergroup(id, api_id),
    CONSTRAINT uq_wiretap_t_supergroup UNIQUE (telegram_supergroup_id, telegram_supergroup_api_id),
    FOREIGN KEY (user_account_id) REFERENCES core.user_account(id)
);

CREATE TABLE core.mapping_info(
    id SERIAL PRIMARY KEY,
    wiretap_id INT NOT NULL UNIQUE,

    title VARCHAR(255),
    member_count INT,
    username VARCHAR(50),
    description VARCHAR,
    is_channel boolean,

    FOREIGN KEY (wiretap_id) REFERENCES core.wiretap(id) ON DELETE CASCADE
);
