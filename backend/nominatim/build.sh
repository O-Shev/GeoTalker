#!/bin/bash

docker run -it \
  -v nominatim-flatnode:/nominatim/flatnode \
  -v nominatim-data:/var/lib/postgresql/14/main \
  -v ./osm-data:/osm-data \
  -e PBF_PATH=/osm-data/planet-latest.osm.pbf \
  -e POSTGRES_SHARED_BUFFERS=2GB \
  -e POSTGRES_MAINTAINENCE_WORK_MEM=10GB \
  -e POSTGRES_AUTOVACUUM_WORK_MEM=2GB \
  -e POSTGRES_WORK_MEM=50MB \
  -e POSTGRES_EFFECTIVE_CACHE_SIZE=20GB \
  -e POSTGRES_SYNCHRONOUS_COMMIT=off \
  -e POSTGRES_MAX_WAL_SIZE=1GB \
  -e POSTGRES_CHECKPOINT_TIMEOUT=10min \
  -e POSTGRES_CHECKPOINT_COMPLETITION_TARGET=0.9 \
  -e FREEZE=true \
  -e IMPORT_STYLE=admin \
  -e THREADS=$(nproc) \
  --shm-size=2g \
  -e NOMINATIM_PASSWORD=16101 \
  -p 8080:8080 \
  --name nominatim-build \
  mediagis/nominatim:4.4