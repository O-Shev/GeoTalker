const {CONFIG, API_S_CONFIG, MINIO_CONFIG} = require('./config.js');
const zlib = require("zlib");
const express = require('express');
const axios = require('axios')
const topojsonServer = require('topojson-server')
const turf = require('@turf/turf')
const Minio = require('minio');

const minio_client = new Minio.Client(MINIO_CONFIG);
const app = express();

const gzipCompressPromise = (data) => {
    return new Promise((resolve, reject) => {
        zlib.gzip(JSON.stringify(data), (err, compressedData) => {
            if (err) {
                reject(err);
            } else {
                resolve(compressedData);
            }
        });
    });
};
const getGeojsonObjectByOsmId = async (osmIdArray) =>{
    const osmTypeLookup = {
        "relation": "R",
        "way": "W",
        "node": "N"
    };
    const geojsonObject = {};

    const subOsmIdArrays = [];
    for (let i = 0; i < osmIdArray.length; i += CONFIG.LOOKUP_CHUNK_SIZE) {
        subOsmIdArrays.push(osmIdArray.slice(i, i + CONFIG.LOOKUP_CHUNK_SIZE));
    }

    for (let i = 0; i < subOsmIdArrays.length; i += 1) {
        const osm_ids =  subOsmIdArrays[i].join(",");
        const NLookupResponse = await axios.get(`${CONFIG.NOMINATIM_HOST}/lookup`, { params: { osm_ids: osm_ids, format: "json", polygon_geojson: 1 }});
        NLookupResponse.data.forEach((e) => {
            const key = osmTypeLookup[e.osm_type] + e.osm_id;
            const geometry = simplifyGeojson(e.geojson);
            geojsonObject[key] = {
                type: "Feature",
                geometry: geometry,
            }
        })

    }

    return geojsonObject;
}
const simplifyGeojson = (geojson) => {

    let simplifiedGeojson;
    if (geojson.type === 'MultiPolygon') {
        simplifiedGeojson = {
            type: 'MultiPolygon',
            coordinates: []
        };

        geojson.coordinates.forEach((v) => {
            const poligon = {
                type: "Polygon",
                coordinates: v
            }
            const bbox = turf.bbox(poligon);
            const width = bbox[2] - bbox[0];
            const height = bbox[3] - bbox[1];

            let diagonalLength = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
            if (diagonalLength > CONFIG.MAX_DIAGONAL_LENGTH) diagonalLength = CONFIG.MAX_DIAGONAL_LENGTH;

            const tolerance = diagonalLength * CONFIG.TOLERANCE_RATIO;
            const simpPoligon = turf.simplify(poligon, {tolerance: tolerance, highQuality: true});
            simplifiedGeojson.coordinates.push(simpPoligon.coordinates);
        })

        return simplifiedGeojson;
    } else {
        const bbox = turf.bbox(geojson);
        const width = bbox[2] - bbox[0];
        const height = bbox[3] - bbox[1];

        let diagonalLength = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
        if (diagonalLength > CONFIG.MAX_DIAGONAL_LENGTH) diagonalLength = CONFIG.MAX_DIAGONAL_LENGTH;

        const tolerance = diagonalLength * CONFIG.TOLERANCE_RATIO;
        return turf.simplify(geojson, {tolerance: tolerance, highQuality: true});
    }

}
const geo2topo = (geojsonObject) => {
    return topojsonServer.topology(geojsonObject, CONFIG.QUANTIZATION);
}
const upload = async (object, identifier) => {
    const metaData = {'Content-Type': 'application/topojson', 'Content-Encoding': 'gzip'};
    return await minio_client.putObject(CONFIG.MINIO_BOUNDARIES_BUCKET, identifier, object, metaData);
}
const getGzipTopoJson = async (osm_ids) => {
    const osmIdArray = osm_ids.split(",");
    const geojsonObject = await getGeojsonObjectByOsmId(osmIdArray);
    const topoObject = geo2topo(geojsonObject);
    return await gzipCompressPromise(topoObject);
}
const createGzipTopoJson = async (osm_ids) =>{
    const gzipObject = await getGzipTopoJson(osm_ids);
    const identifier = osm_ids.replace(/,/g, '');
    return await upload(gzipObject, identifier);
}




app.get('/create', async (req, res) => {
    try {
        const { osm_ids, async } = req.query;
        if(async && (async == 1 || async == true)) {
            createGzipTopoJson(osm_ids);
            res.status(200).json("ok");
        }
        else {
            const objInfo = await createGzipTopoJson(osm_ids);
            res.status(200).json(objInfo);
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json(error);
    }
});
app.get('/get', async (req, res) => {
    try {
        const { osm_ids } = req.query;
        const compressedData = await getGzipTopoJson(osm_ids);
        await res.setHeader('Content-Encoding', 'gzip');
        res.send(compressedData)
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json(error);
    }
});


app.listen(API_S_CONFIG.PORT, () => {
    console.log(`Server is running on ${API_S_CONFIG.PORT}`);
});