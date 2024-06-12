package com.geotalker.core.repository;

import com.geotalker.core.model.MappingInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MappingInfoRepository extends JpaRepository<MappingInfo, Long> {
    // Add custom query methods here if needed
}
