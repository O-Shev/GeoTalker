package com.geotalker.core.dto.geojson;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = GeojsonPolygon.class, name = "Polygon"),
        @JsonSubTypes.Type(value = GeojsonMultiPolygon.class, name = "MultiPolygon"),
        @JsonSubTypes.Type(value = GeojsonPoint.class, name = "Point"),
})
public interface Geojson {
}
