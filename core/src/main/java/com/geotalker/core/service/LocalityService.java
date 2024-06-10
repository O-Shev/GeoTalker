package com.geotalker.core.service;

import com.geotalker.core.api.BoundariesServiceApi;
import com.geotalker.core.api.NominatimApi;
import com.geotalker.core.dto.client.LocalityDTO;
import com.geotalker.core.dto.nominatim.NDetailsResponse;
import com.geotalker.core.dto.nominatim.NResponse;
import com.geotalker.core.model.enums.WiretapStatus;
import com.geotalker.core.model.locality.BoundingBox;
import com.geotalker.core.model.locality.Coordinates;
import com.geotalker.core.model.locality.Locality;
import com.geotalker.core.model.locality.Osm;
import com.geotalker.core.repository.LocalityRepository;
import com.geotalker.core.util.LocalityMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@Transactional
public class LocalityService {
    private final NominatimApi nominatimApi;
    private final LocalityRepository localityRepository;
    private final LocalityMapper localityMapper;
    private final BoundariesServiceApi boundariesServiceApi;
    private final StorageService storageService;

    @Autowired
    public LocalityService(NominatimApi nominatimApi,
                           LocalityRepository localityRepository,
                           LocalityMapper localityMapper,
                           BoundariesServiceApi boundariesServiceApi,
                           StorageService storageService) {
        this.nominatimApi = nominatimApi;
        this.localityRepository = localityRepository;
        this.localityMapper = localityMapper;
        this.boundariesServiceApi = boundariesServiceApi;

        this.storageService = storageService;
    }

    public Locality constructLocality(Osm osm) {
        NDetailsResponse nDetailsResponse = nominatimApi.details(osm);
        if(nDetailsResponse == null) throw new RuntimeException("can't find such osm type");
        NResponse nResponse = nominatimApi.lookup(List.of(osm))[0];


        Locality locality = new Locality();
        locality.setOsm(osm);
        locality.setDisplayName(nResponse.displayName());
        locality.setCoordinates(new Coordinates(nResponse.lat(), nResponse.lon()));
        locality.setRankAddress(nDetailsResponse.rankAddress());

        BoundingBox boundingBox = new BoundingBox();

        boundingBox.setMinLatitude(nResponse.boundingbox().get(0));
        boundingBox.setMaxLatitude(nResponse.boundingbox().get(1));
        boundingBox.setMinLongitude(nResponse.boundingbox().get(2));
        boundingBox.setMaxLongitude(nResponse.boundingbox().get(3));

        locality.setBoundingBox(boundingBox);

        return locality;
    }

    public Osm getOsmForCountry(String country) {
        NResponse[] nResponses = nominatimApi.searchCountry(country);
        if(nResponses.length == 0) return null;
        NResponse nResponse = nResponses[0];
        return new Osm(nResponse.osmType(), nResponse.osmId());
    }

    public Locality getOrCreateLocality(Osm osm){
        Locality locality = localityRepository.findByOsm(osm);
        if (locality != null) return locality;
        locality = constructLocality(osm);
        locality = localityRepository.save(locality);
        return locality;
    }

    public List<LocalityDTO> getAllLocalities() {
        return localityRepository.findAll().stream()
                .map(localityMapper::toDto)
                .toList();
    }

    public List<LocalityDTO> getReadyLocalities(){
        return localityRepository.findLocalitiesByWiretapStatus(WiretapStatus.READY).stream()
                .map(localityMapper::toDto)
                .toList();
    }

    public List<LocalityDTO> getLocalitiesPreview(Coordinates coordinates){

        NResponse nRR = nominatimApi.reverse(coordinates);
        NDetailsResponse nDetailsResponse = nominatimApi.details(new Osm(nRR.osmType(), nRR.osmId()));

        String country = null;
        List<Osm> osms = new ArrayList<>();
        for (NDetailsResponse.Address address : nDetailsResponse.address()) {
            if ("R".equals(address.osmType()) && address.isaddress()) osms.add(new Osm(address.osmType(), address.osmId()));
            else if ("country".equals(address.type())) country = address.localname();
        }

        List<NResponse> nLookupList;
        nLookupList = new ArrayList<>(Arrays.stream(nominatimApi.lookup(osms)).toList());


        if(country != null){
            NResponse[] nResponses = nominatimApi.searchCountry(country);
            if(nResponses.length >= 1) nLookupList.add(nResponses[0]);
        }

        List<Locality> localities = nLookupList.stream()
                .filter(v -> "relation".equals(v.osmType()))
                .map(localityMapper::toModel)
                .toList();

        creatBoundariesIfNotExist(localities);

        return localities.stream()
                .map(localityMapper::toDto)
                .toList();
    }

    public List<LocalityDTO> getLocalitiesPreview(String q) {
        NResponse[] nLookupList = nominatimApi.search(q);

        List<Locality> localities = Arrays.stream(nLookupList)
                .filter(v -> "relation".equals(v.osmType()))
                .map(localityMapper::toModel)
                .toList();

        creatBoundariesIfNotExist(localities);

        return localities.stream()
                .map(localityMapper::toDto)
                .toList();
    }


    public void creatBoundariesIfNotExist(List<Locality> localities){
        for(Locality locality : localities){
            if(!storageService.isPresentBoundaries(locality.getOsm()))
                boundariesServiceApi.createBoundariesAsync(locality.getOsm());
        }
    }


}


//    public Locality createAndSaveLocalityWithHierarchy(Osm osm){
//        Locality locality = getOrCreateLocality(osm);
//        if(locality.getParentId() != null) return locality;
//        NDetailsResponse nDetailsResponse = nominatimApi.details(osm);
//
//        Locality prevLocality = locality;
//        for (NDetailsResponse.Address address : nDetailsResponse.address()) {
//            Osm currentOsm = null;
//            if(address.osmType() != null || address.osmId() != null) currentOsm = new Osm(address.osmType(), address.osmId());
//            else if("country".equals(address.type())) currentOsm = getOsmForCountry(address.localname());
//            if(currentOsm == null || currentOsm.equals(prevLocality.getOsm())) continue;
//
//            Locality currentLocality = localityRepository.findByOsm(currentOsm);
//            if (currentLocality != null){
//                prevLocality.setParentId(currentLocality.getId());
//                localityRepository.save(prevLocality);
//                break;
//            } else {
//                currentLocality = localityRepository.save(constructLocality(currentOsm));
//                prevLocality.setParentId(currentLocality.getId());
//                localityRepository.save(prevLocality);
//                prevLocality = currentLocality;
//            }
//        }
//
//        return locality;
//    }












//екаврфррраі
//пцукрвшапіфжйОШАІПІЛЩІ
//        КІМГВДСОПЩАВГПАГЛАМІАШАІЗЩУЦПВГІМПАВАМІВРІГВИ
//
//ЛАВШПАПШРІ  ОХЄ ДШ  Ш   Ш               ИШПУАІПЛТ                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           КТО ЧИТАЕТ ТОТ ЛЁША