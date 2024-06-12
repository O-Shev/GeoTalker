package com.geotalker.core.util;
import com.geotalker.core.dto.telegram.TObject.TError;

public class TErrorException extends RuntimeException {
    private final TError tError;

    public TErrorException(TError tError) {
        super(tError.message);
        this.tError = tError;
    }

    public TError getTError() {
        return tError;
    }

    @Override
    public String toString() {
        return "TelegramResponseException{" +
                "tError=" + tError +
                '}';
    }
}
