#!/bin/bash

container_volume_path="/nominatim-util"


script_dir="$(dirname "$0")"
relative_osm_data_path=""

if [ "$#" -eq 1 ]; then
  if [[ "$1" == http://* || "$1" == https://* ]]; then
    echo "URL is: $1"
    url="$1"
    if [[ "$url" != *.osm.pbf ]]; then
      echo "Error: File must have a .osm.pbf extension"
      exit 1
    fi
    relative_osm_data_path="/nominatim-util/$(basename "$url")"
    wget -O "$script_dir/$relative_osm_data_path" "$url" || { echo "Error: Unable to download .osm.pbf file" && exit 1; }
    echo "Downloaded file: $script_dir/$relative_osm_data_path"
  else
    if ! relative_osm_data_path="${1#$script_dir/}"; then
      echo "Error: Unable to resolve $1"
      exit 1
    fi
    if [[ "$relative_osm_data_path" != *.osm.pbf ]]; then
      { echo "Error: $relative_osm_data_path file must be .osm.pbf format" && exit 1; }
    fi
  fi
else
  echo "Error: At least one parameter must be passed: URL or osm-data"
  exit 1
fi


echo ".osm.data is $relative_osm_data_path"
cd "$script_dir" && \
docker build -t nominatim-build . && \
docker run \
    --name nominatim-init \
    --shm-size=1g \
    -v "$script_dir/nominatim-util:$container_volume_path" \
    -e OSM_FILE="/$relative_osm_data_path" \
    -e UTIL_DIR="$container_volume_path" \
    -e THREADS=$(nproc) \
    --env-file "$script_dir/.env" \
    nominatim-build \
    "$container_volume_path/.sh/init.sh" \
&& \
docker commit --change 'CMD ["sh", "-c", "/$APP_DIR/start.sh"]' -c "EXPOSE 80" nominatim-init nominatim-import-finished