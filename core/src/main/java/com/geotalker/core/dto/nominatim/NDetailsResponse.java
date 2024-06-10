package com.geotalker.core.dto.nominatim;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public record NDetailsResponse(List<Address> address,
                               String localname,
                               Integer rankAddress,
                               @JsonDeserialize(using = ExtratagsDeserializer.class)
                               Map<String, String> extratags) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    @JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
    public record Address (String localname,
                    Long osmId,
                    String osmType, // R | W | N
                    String placeType,
                    String clazz,
                    String type,
                    Integer adminLevel,
                    Integer rankAddress,
                    Boolean isaddress){}

    public static class ExtratagsDeserializer extends StdDeserializer<Map<String, String>> {

        public ExtratagsDeserializer() {
            this(null);
        }

        public ExtratagsDeserializer(Class<?> vc) {
            super(vc);
        }

        @Override
        public Map<String, String> deserialize(com.fasterxml.jackson.core.JsonParser jp, com.fasterxml.jackson.databind.DeserializationContext ctxt) throws IOException {
            JsonNode node = null;
            try {
                node = jp.getCodec().readTree(jp);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }

            if (node.isArray()) {
                // If it's an array, return null
                return null;
            } else {
                // If it's an object, deserialize as usual
                Map<String, String> extratags = new HashMap<>();
                node.fields().forEachRemaining(entry -> {
                    extratags.put(entry.getKey(), entry.getValue().asText());
                });
                return extratags;
            }
        }
    }
}