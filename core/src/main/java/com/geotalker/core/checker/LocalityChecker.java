package com.geotalker.core.checker;

import com.geotalker.core.api.BoundariesServiceApi;
import com.geotalker.core.model.locality.Locality;
import com.geotalker.core.model.locality.Osm;
import com.geotalker.core.repository.LocalityRepository;
import com.geotalker.core.service.StorageService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class LocalityChecker {

    private final LocalityRepository localityRepository;
    private final BoundariesServiceApi boundariesServiceApi;
    private final StorageService storageService;

    @Autowired
    public LocalityChecker(LocalityRepository localityRepository,
                           BoundariesServiceApi boundariesServiceApi,
                           StorageService storageService) {
        this.localityRepository = localityRepository;
        this.boundariesServiceApi = boundariesServiceApi;
        this.storageService = storageService;
    }
    @PostConstruct
    public void onApplicationStart() {
        isExistInMinio();
    }

    @Scheduled(fixedRate = 2 * 60 * 60 * 1000) // Run every 2 hours
    public void isExistInMinio() {
        Iterable<Locality> localities = localityRepository.findAll();
        for (Locality locality : localities) {
            if(!storageService.isPresentBoundaries(locality.getOsm()))
                boundariesServiceApi.createBoundariesAsync(locality.getOsm());
        }
    }
}