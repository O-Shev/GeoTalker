if [ ! -z "$POSTGRES_SHARED_BUFFERS" ]; then sed -i "s/shared_buffers = 2GB/shared_buffers = $POSTGRES_SHARED_BUFFERS/g" /etc/postgresql/14/main/conf.d/postgres-tuning.conf; fi
if [ ! -z "$POSTGRES_MAINTENANCE_WORK_MEM" ]; then sed -i "s/maintenance_work_mem = 2GB/maintenance_work_mem = $POSTGRES_MAINTENANCE_WORK_MEM/g" /etc/postgresql/14/main/conf.d/postgres-tuning.conf; fi
if [ ! -z "$POSTGRES_AUTOVACUUM_WORK_MEM" ]; then sed -i "s/autovacuum_work_mem = 256MB/autovacuum_work_mem = $POSTGRES_AUTOVACUUM_WORK_MEM/g" /etc/postgresql/14/main/conf.d/postgres-tuning.conf; fi
if [ ! -z "$POSTGRES_WORK_MEM" ]; then sed -i "s/work_mem = 64MB/work_mem = $POSTGRES_WORK_MEM/g" /etc/postgresql/14/main/conf.d/postgres-tuning.conf; fi
if [ ! -z "$POSTGRES_EFFECTIVE_CACHE_SIZE" ]; then sed -i "s/effective_cache_size = 3GB/effective_cache_size = $POSTGRES_EFFECTIVE_CACHE_SIZE/g" /etc/postgresql/14/main/conf.d/postgres-tuning.conf; fi
if [ ! -z "$POSTGRES_SYNCHRONOUS_COMMIT" ]; then sed -i "s/synchronous_commit = off/synchronous_commit = $POSTGRES_SYNCHRONOUS_COMMIT/g" /etc/postgresql/14/main/conf.d/postgres-tuning.conf; fi


{ echo "STARTING POSTGRESQL..." && service postgresql start && echo "POSTGRESQL STARTED" || service postgresql restart; } && \
echo "STARTING PHP-FPM..." && service php8.1-fpm start && echo "PHP-FPM STARTED" && \
echo "START NGINX IN daemon off MODE" && \
nginx -g 'daemon off;'