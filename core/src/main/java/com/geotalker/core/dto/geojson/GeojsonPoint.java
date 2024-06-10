package com.geotalker.core.dto.geojson;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class GeojsonPoint implements Geojson {
    public final String type;
    public final List<Double> coordinates;

    public GeojsonPoint(@JsonProperty("coordinates") List<Double> coordinates) {
        type = "Point";
        this.coordinates = coordinates;
    }
}