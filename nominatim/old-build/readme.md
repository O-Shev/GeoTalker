# Basic Nominatim Docker
*Shell script for automating the full process of deploying Nominatim in a Docker container*

## Description
[Nominatim](https://nominatim.org/release-docs/latest/) (from the Latin, 'by name') is a tool to search [OSM](https://en.wikipedia.org/wiki/OpenStreetMap) data by name and address and to generate synthetic addresses of OSM points (reverse geocoding).

In the context of GeoTalker, Nominatim uses as:
- Database of administrative boundaries
- Database of administrative divisions hierarchy
- Revers geocoding

Installation of Nominatim with databse requires some preparation, especially if there are needed database of full planet. There are recommened to read basik steps of installation on official [Nominatim page](https://nominatim.org/release-docs/latest/admin/Installation/). The isolation is extremely important here. For this goal was chosen containerisation.


## Build image
```sh
./app-build-import.sh [ URL | PATH ]
```
- `URL`: Which OSM extract to download and import
- `PATH`:  Path to pbf file located in `nominatim-utility`

#### Examples
```sh
./app-build.sh https://download.geofabrik.de/europe/albania-latest.osm.pbf
```
```sh
./app-build.sh ./nominatim-utility/albania-latest.osm.pbf
```
After successful installation, the `nominatim-import-finished` image will be created.

### Configuration
- By default this script to dropp data required for dynamic updates.  
- By default uses `Nginx` with `PHP-FPM` instead `Apache`
- Nginx, PHP-FPM, PostgreSQL configuration you can find in `.conf.sh` directory
- Envirements for Nominatim configuretion set in `.env` file (see [this](https://nominatim.org/release-docs/latest/admin/Import/#configuration-setup-in-env))


