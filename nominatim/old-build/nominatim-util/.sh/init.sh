#!/bin/bash

echo "------ENVIROEMENTS-----"
env
echo "------ENVIROEMENTS-----"


if [ -z "$APP_DIR" ]; then
    echo "APP_DIR envirement don't exist. You should set APP_DIR"
    exit 1
fi

sh_dir="$(dirname "$0")"
conf_sh_dir="$(dirname "$sh_dir")/.conf.sh"

# Create the APP_DIR & 'website' directores
mkdir $APP_DIR || { echo "Error: can't create $APP_DIR direcory" && exit 1; }
mkdir "$APP_DIR/website" || { echo "Error: can't create $APP_DIR/website direcory" && exit 1; }

# Change ownership and permissions
chown -R nominatim:nominatim "$APP_DIR" || { echo "can't 'chown' the $APP_DIR" && exit 1; }
chmod -R 755 "$APP_DIR" || { echo "can't 'chmod' the $APP_DIR" && exit 1; }

service postgresql start
if pg_isready; then
  su postgres -c "createuser -s nominatim"
  su postgres -c "createuser www-data"
else
  echo "Error (postgres: createuser): PostgreSQL has not started or is not accepting connections"
  exit 1
fi

# configuration
$conf_sh_dir/postgresql-tuning.conf.sh
$conf_sh_dir/php-fpm.conf.sh
$conf_sh_dir/nginx.conf.sh

$sh_dir/import.sh || { echo "import error" && exit 1; }

service postgresql stop
# Delete postgres-import.conf
rm -f $import_psql_conf || echo "Can't delete $import_psql_conf"

cp $sh_dir/start.sh $APP_DIR
echo "INITIALIZE OF NOMINATIM SUCCESSFUL"