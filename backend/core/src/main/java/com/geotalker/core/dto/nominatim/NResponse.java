package com.geotalker.core.dto.nominatim;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.geotalker.core.dto.geojson.Geojson;

import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public record NResponse(String osmType, // relation | way | node
                        Long osmId,
                        List<Double> boundingbox,
                        Double lat,
                        Double lon,
                        String displayName,
                        Geojson geojson,
                        Map<String, String> extratags) {


}
