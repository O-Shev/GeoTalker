package com.geotalker.core.dto.client;

public record LocalityDTO(Long id,
                          String osm,
                          String displayName,
                          Integer rankAddress,
                          Double[] coordinates,
                          Double[][] boundingBox) {}
