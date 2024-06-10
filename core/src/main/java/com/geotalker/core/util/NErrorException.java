package com.geotalker.core.util;

import com.geotalker.core.dto.nominatim.NError;

public class NErrorException extends RuntimeException {
    private final NError nError;

    public NErrorException(NError nError) {
        super(nError.message());
        this.nError = nError;
    }

    public NError getNError() {
        return nError;
    }
}
