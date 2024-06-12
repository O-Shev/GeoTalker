package com.geotalker.core.util;

import com.geotalker.core.dto.client.LocalityDTO;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class LocalityDTOGenerator {
    // Define ranges for latitude and longitude
    private static final double MIN_LATITUDE = -90.0;
    private static final double MAX_LATITUDE = 90.0;
    private static final double MIN_LONGITUDE = -180.0;
    private static final double MAX_LONGITUDE = 180.0;

    // Method to generate random coordinates
    private static Double[] generateRandomCoordinates() {
        Random random = new Random();
        double latitude = MIN_LATITUDE + (MAX_LATITUDE - MIN_LATITUDE) * random.nextDouble();
        double longitude = MIN_LONGITUDE + (MAX_LONGITUDE - MIN_LONGITUDE) * random.nextDouble();
        return new Double[]{latitude, longitude};
    }

    // Method to generate LocalityDTO objects
    public static List<LocalityDTO> generateLocalityDTOs(int count) {
        List<LocalityDTO> dtos = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            Double[] coordinates = generateRandomCoordinates();
            dtos.add(new LocalityDTO((long) i,  null, null, null, coordinates, null));
        }
        return dtos;
    }

}
