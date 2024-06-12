package com.geotalker.core.repository;

import com.geotalker.core.model.ConfirmationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationToken, Integer> {
    Optional<ConfirmationToken> findConfirmationTokenByValue(String value);
}
