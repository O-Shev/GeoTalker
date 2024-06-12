package com.geotalker.core.repository;

import com.geotalker.core.model.enums.WiretapStatus;
import com.geotalker.core.model.locality.Locality;
import com.geotalker.core.model.locality.Osm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocalityRepository extends JpaRepository<Locality, Long> {
    Locality findByOsm(Osm osm);
    List<Locality> findLocalitiesByWiretapStatus(WiretapStatus wiretapStatus);
}
