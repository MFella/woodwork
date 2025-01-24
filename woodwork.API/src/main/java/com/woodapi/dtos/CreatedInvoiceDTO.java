package com.woodapi.dtos;

import java.util.UUID;

public class CreatedInvoiceDTO {
    private final String id = UUID.randomUUID().toString();

    public String getId() {
        return this.id;
    }

}
