package com.geotalker.core.dto.geojson;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class GeojsonMultiPolygon implements Geojson {
    public final String type;
    public final List<List<List<List<Double>>>> coordinates;

    public GeojsonMultiPolygon(@JsonProperty("coordinates") List<List<List<List<Double>>>> coordinates) {
        type = "MultiPolygon";
        this.coordinates = coordinates;
    }
}
