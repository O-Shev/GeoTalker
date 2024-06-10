tee /etc/postgresql/14/main/conf.d/postgresql-tuning.conf << EOF_PSQL_CONF

listen_addresses = '127.0.0.1'

# For 64gb RAM
 shared_buffers = 2GB
 maintenance_work_mem = 10GB
 autovacuum_work_mem = 2GB
 work_mem = 50MB
 effective_cache_size = 24GB
 synchronous_commit = off
 max_wal_size = 1GB
 checkpoint_timeout = 10min
 checkpoint_completion_target = 0.9

# For 16gb RAM (by chatGPT)
#shared_buffers = 4GB
#maintenance_work_mem = 2GB
#autovacuum_work_mem = 1GB
#work_mem = 25MB
#effective_cache_size = 8GB
#synchronous_commit = off
#max_wal_size = 512MB
#checkpoint_timeout = 10min
#checkpoint_completion_target = 0.9

EOF_PSQL_CONF