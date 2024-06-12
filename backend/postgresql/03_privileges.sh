#!/bin/bash
set -e

RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color


# Ensure the environment variables are set
if [[ -z "$CORE_USER" || -z "$CORE_PASSWORD" || -z "$TELEGRAM_USER" || -z "$TELEGRAM_PASSWORD" ]]; then
  echo -e "${YELLOW}[CORE_USER || CORE_PASSWORD || TELEGRAM_USER || TELEGRAM_PASSWORD] ENVIRONMENT VARIABLES ARE NOT SET${NC}"
  echo -e "${RED}WARNING: ADDITIONAL USERS HAVE NOT CREATED${NC}"
  exit 0
fi

# Execute the SQL commands using psql
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
        CREATE USER $TELEGRAM_USER WITH PASSWORD '$TELEGRAM_PASSWORD';
        CREATE USER $CORE_USER WITH PASSWORD '$CORE_PASSWORD';

        GRANT ALL PRIVILEGES ON SCHEMA core TO $CORE_USER;
        GRANT ALL PRIVILEGES ON SCHEMA telegram TO $TELEGRAM_USER;

        GRANT USAGE ON SCHEMA telegram TO $CORE_USER;
EOSQL