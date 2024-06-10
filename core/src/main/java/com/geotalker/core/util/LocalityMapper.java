package com.geotalker.core.util;

import com.geotalker.core.dto.client.LocalityDTO;
import com.geotalker.core.dto.nominatim.NResponse;
import com.geotalker.core.model.locality.BoundingBox;
import com.geotalker.core.model.locality.Coordinates;
import com.geotalker.core.model.locality.Locality;
import com.geotalker.core.model.locality.Osm;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;


@Mapper(componentModel = "spring")
public interface LocalityMapper {

    @Mapping(source = "osm", target = "osm", qualifiedByName = "toOsmString")
    @Mapping(source = "coordinates", target = "coordinates", qualifiedByName = "toCoordinatesArray")
    @Mapping(source = "boundingBox", target = "boundingBox", qualifiedByName = "toBoundingBoxArray")
    LocalityDTO toDto(Locality locality);

    default LocalityDTO toDto(NResponse nResponse) {
        return this.toDto(this.toModel(nResponse));
    }


    default Locality toModel(NResponse nResponse){
        Locality locality = new Locality();

        BoundingBox boundingBox = new BoundingBox();
        boundingBox.setMinLatitude(nResponse.boundingbox().get(0));
        boundingBox.setMaxLatitude(nResponse.boundingbox().get(1));
        boundingBox.setMinLongitude(nResponse.boundingbox().get(2));
        boundingBox.setMaxLongitude(nResponse.boundingbox().get(3));
        locality.setBoundingBox(boundingBox);

        locality.setOsm(new Osm(nResponse.osmType(), nResponse.osmId()));
        locality.setCoordinates(new Coordinates(nResponse.lat(), nResponse.lon()));
        locality.setDisplayName(nResponse.displayName());

        return locality;
    };


    @Named("toOsmString")
    default String toOsmString(Osm osm){
        return osm.getAsStr();
    }

    @Named("toCoordinatesArray")
    default Double[] toCoordinatesArray(Coordinates coordinates) {
        return new Double[]{coordinates.getLongitude(), coordinates.getLatitude()};
    }

    @Named("toBoundingBoxArray")
    default Double[][] toBoundingBoxArray(BoundingBox boundingBox) {
        Double[][] boundingBoxArray = new Double[2][2];

        boundingBoxArray[0][0] = boundingBox.getMinLongitude();
        boundingBoxArray[0][1] = boundingBox.getMinLatitude();
        boundingBoxArray[1][0] = boundingBox.getMaxLongitude();
        boundingBoxArray[1][1] = boundingBox.getMaxLatitude();

        return boundingBoxArray;
    }

}