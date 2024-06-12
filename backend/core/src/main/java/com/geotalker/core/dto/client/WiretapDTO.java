package com.geotalker.core.dto.client;

public record WiretapDTO(Long id,
                         Long localityId,
                         String chatPhotoId,
                         String chatTitle,
                         Integer memberCount,
                         Boolean isChannel){}