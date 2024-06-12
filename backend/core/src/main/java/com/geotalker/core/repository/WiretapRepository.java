package com.geotalker.core.repository;

import com.geotalker.core.model.TelegramSupergroup;
import com.geotalker.core.model.Wiretap;
import com.geotalker.core.model.enums.WiretapStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WiretapRepository extends JpaRepository<Wiretap, Long> {
    Wiretap findByPrimaryInterlink(String primaryInterlink);

    @Query("SELECT w FROM Wiretap w WHERE w.telegramSupergroup.id = ?1")
    Wiretap findByTSupergroupId(Long id);

    @Query("SELECT w FROM Wiretap w WHERE w.telegramSupergroup = ?1")
    Optional<Wiretap> findByTSupergroup(TelegramSupergroup telegramSupergroup);

    List<Wiretap> findByStatus(WiretapStatus status);

    Wiretap findByStatusAndTelegramSupergroupChatId(WiretapStatus status, Long chatId);
}

