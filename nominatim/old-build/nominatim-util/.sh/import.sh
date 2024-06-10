#!/bin/bash

export IMPORT_FINISHED="false"

import_psql_conf=/etc/postgresql/14/main/conf.d/postgres-import.conf
# To improve import performance (but reduce crash recovery safety)
cat <<EOF > $import_psql_conf || { echo "Can't write $import_psql_conf" && exit 1; }
fsync = off
full_page_writes = off
EOF

service postgresql restart
service nginx stop
service php8.1-fpm stop
if [ ! -e "$OSM_FILE" ]; then
  echo "Error import: File does not exist: $OSM_FILE"
elif ! pg_isready; then
  echo "Error import: PostgreSQL has not started or is not accepting connections"
else
  cd $APP_DIR && \
  su nominatim -c "nominatim import --osm-file $OSM_FILE --threads $THREADS" && \

  # Sometimes Nominatim marks parent places to be indexed during the initial
  # import which leads to '123 entries are not yet indexed' errors in --check-database
  # Thus another quick additional index here for the remaining places
  su nominatim -c "nominatim index --threads $THREADS" && \
  su nominatim -c "nominatim admin --check-database" && \
  echo "Freezing database"
  su nominatim -c "nominatim freeze" && \
  IMPORT_FINISHED="true"
fi

if [ "$IMPORT_FINISHED" = "false" ]; then
  echo "Error: nominatim [import|index] is not successful"
  exit 1
fi