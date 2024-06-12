package com.geotalker.core.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.geotalker.core.dto.nominatim.*;
import com.geotalker.core.model.locality.Coordinates;
import com.geotalker.core.model.locality.Osm;
import com.geotalker.core.util.NErrorException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.MediaType.APPLICATION_JSON;

@Component
public class NominatimApi {

    private final RestClient client;
    private final ObjectMapper objectMapper;

    public NominatimApi(@Value("${spring.api.nominatim.url}") String apiUrl){
        objectMapper = new ObjectMapper();
        client = RestClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader("Accept-Language", "en-US")
                .build();
    }

    private <T> T responseHandler(String response, Class<T> clazz){
        try {
            JsonNode rootNode = objectMapper.readTree(response);
            if(rootNode.has("error")){
                if(rootNode.get("error").has("code")) {
                    NError nError = objectMapper.treeToValue(rootNode.get("error"), NError.class);
                    throw new NErrorException(nError);
                } else throw new NErrorException(new NError(null, rootNode.get("error").asText()));
            } else return objectMapper.treeToValue(rootNode, clazz);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }


    public NResponse reverse(Coordinates coordinates) {
        String response =  client.get()
                .uri("/reverse?lat={latitude}&lon={longitude}&format=json", coordinates.getLatitude(), coordinates.getLongitude())
                .retrieve()
                .body(String.class);

        return responseHandler(response, NResponse.class);
    }

    public NDetailsResponse details(Osm osm){
        String response =  client.get()
                .uri("/details?osmtype={osmType}&osmid={osmId}&addressdetails=1", osm.getType(), osm.getId())
                .retrieve()
                .body(String.class);

        return responseHandler(response, NDetailsResponse.class);
    }

    public NResponse[] lookup(List<Osm> osms)  {
        String osmIds = osms.stream()
                .map(osmId -> osmId.getType().name() + osmId.getId())
                .collect(Collectors.joining(","));

        String response =  client.get()
                .uri("/lookup?osm_ids={?}&format=json", osmIds)
                .retrieve()
                .body(String.class);

        return responseHandler(response, NResponse[].class);
    }

    public NResponse[] lookupWithPolygon(List<Osm> osms)  {
        String osmIds = osms.stream()
                .map(osmId -> osmId.getType().name() + osmId.getId())
                .collect(Collectors.joining(","));

        String response =  client.get()
                .uri("/lookup?osm_ids={?}&format=json&polygon_geojson=1", osmIds)
                .retrieve()
                .body(String.class);

        return responseHandler(response, NResponse[].class);
    }

    public NResponse[] searchCountry(String q) {
        String response =  client.get()
                .uri("/search?country={q}&format=json", q)
                .retrieve()
                .body(String.class);

        return responseHandler(response, NResponse[].class);
    }

    public NResponse[] search(String q) {
        String response =  client.get()
                .uri("/search?q={q}&format=json&extratags=1", q)
                .retrieve()
                .body(String.class);

        return responseHandler(response, NResponse[].class);
    }
}
