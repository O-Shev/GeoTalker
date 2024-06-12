#!/bin/sh

set -e

# Set up MinIO alias using environment variables
mc alias set storage "http$( [ "$MINIO_USE_SSL" = true ] && echo s)://$MINIO_HOST:$MINIO_PORT" "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"

# check on existing access key and create new if not exist
mc admin user svcacct info storage "$MINIO_ACCESS_KEY" || \
mc admin user svcacct add               \
   --access-key "$MINIO_ACCESS_KEY"   \
   --secret-key "$MINIO_SECRET_KEY"   \
   storage "$MINIO_ROOT_USER"

# Iterate over all environment variables
for env_var in $(env); do
    # Check if the variable name starts with "MINIO_BUCKET_"
    if [[ $env_var == MINIO_BUCKET_* ]]; then
        # Extract the bucket name
        bucket_name="${env_var#*=}"
        mc mb "storage/$bucket_name" || true
    fi
done
