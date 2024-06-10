package com.geotalker.core.api;

import com.geotalker.core.model.locality.Osm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class BoundariesServiceApi {

    private final RestClient client;

    @Autowired
    public BoundariesServiceApi(@Value("${spring.api.boundaries.url}") String apiUrl) {
        client = RestClient.builder()
                .baseUrl(apiUrl)
                .build();
    }

    public void createBoundaries(Osm osm){
        client.get()
                .uri("/create?osm_ids={?}", osm.getAsStr())
                .retrieve();
    }

    public void createBoundariesAsync(Osm osm){
        client.get()
                .uri("/create?async=true&osm_ids={?}", osm.getAsStr())
                .retrieve();
    }


}
