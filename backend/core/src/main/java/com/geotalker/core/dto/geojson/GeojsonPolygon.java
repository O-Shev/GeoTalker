package com.geotalker.core.dto.geojson;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class GeojsonPolygon implements Geojson {
    public final String type;
    public final List<List<List<Double>>> coordinates;

    public GeojsonPolygon(@JsonProperty("coordinates") List<List<List<Double>>> coordinates) {
        type = "Polygon";
        this.coordinates = coordinates;
    }
}
