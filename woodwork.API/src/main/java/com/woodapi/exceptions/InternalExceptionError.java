package com.woodapi.exceptions;

public class InternalExceptionError extends RuntimeException {
    public InternalExceptionError(String message) {
        super(message);
    }
}
