package com.geotalker.core.repository;

import com.geotalker.core.model.TelegramSupergroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TSupergroupRepository extends JpaRepository<TelegramSupergroup, TelegramSupergroup.PK> {
    Optional<TelegramSupergroup> findByChatId(Long chatId);
}

