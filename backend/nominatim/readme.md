```sh
./build.sh {path to .osm.pbf}
```
create backup of nominatim-data
```sh
docker run --rm \ 
  -v nominatim-data:/nominatim-data \
  -v $(pwd):/backup ubuntu \
  tar cvf /backup/nominatim-data.tar /nominatim-data && \
  sudo useradd -M -N -r -s /usr/sbin/nologin postgres && \
  sudo chown postgres -R /nominatim-data && \
  sudo chmod 750 -R /nominatim-data
```
restore in the new container <nominatim>
```sh
docker run --rm -v nominatim-data:/nominatim-data \
  -v $(pwd):/backup ubuntu bash \
  -c "cd /nominatim-data && tar xvf /backup/nominatim-data.tar --strip 1 && useradd -M -N -r -s /usr/sbin/nologin postgres && chown postgres -R /nominatim-data && chmod 750 -R /nominatim-data"
```


then we can sop container and delete temporally volume nominatim-flatnode
```sh
docker stop nominatim-build
docker rm nominatim-build
docker volume rm nominatim-flatnode
```