package com.geotalker.core.controller.advice;

import com.geotalker.core.util.InterlinkNotValidException;
import com.geotalker.core.util.NErrorException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ClientControllerExceptionHandler {

        @ExceptionHandler(InterlinkNotValidException.class)
        @ResponseStatus(HttpStatus.BAD_REQUEST)
        public ResponseEntity<String> handleInterlinkNotValidException(InterlinkNotValidException e) {
                System.out.println(e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }

        @ExceptionHandler(NErrorException.class)
        @ResponseStatus(HttpStatus.BAD_REQUEST)
        public ResponseEntity<String> handleNErrorException(NErrorException e) {
                System.out.println(e);
                return ResponseEntity.badRequest().body(e.getMessage());
        }
}
