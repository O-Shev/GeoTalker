package com.geotalker.core.repository;

import com.geotalker.core.model.TelegramMessage;
import com.geotalker.core.model.TelegramSupergroup;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TelegramMessageRepository {
    @PersistenceContext
    private EntityManager entityManager;

    public List<TelegramMessage> loadMessages(TelegramSupergroup supergroup, Long fromMessage, int limit) {
        return entityManager.createQuery(
                "SELECT m FROM TelegramMessage m WHERE m.supergroup = :supergroup AND m.id < :fromMessage ORDER BY m.id DESC",
                        TelegramMessage.class)
                .setParameter("supergroup", supergroup)
                .setParameter("fromMessage", fromMessage)
                .setMaxResults(limit)
                .getResultList();
    }

    public List<TelegramMessage> loadInitMessages(TelegramSupergroup supergroup, int limit) {
        return entityManager.createQuery(
                        "SELECT m FROM TelegramMessage m WHERE m.supergroup = :supergroup ORDER BY m.id DESC",
                        TelegramMessage.class)
                .setParameter("supergroup", supergroup)
                .setMaxResults(limit)
                .getResultList();
    }
}
