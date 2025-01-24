package com.woodapi.dtos;

import java.util.UUID;

import com.woodapi.model.TransactionStatus;

public class CreatedInvoiceDTO {
    private final String id = UUID.randomUUID().toString();
    private TransactionStatus status = TransactionStatus.NOT_STARTED;

    public String getId() {
        return this.id;
    }

    public void setStatus(TransactionStatus status) {
        this.status = status;
    }

    public TransactionStatus getTransactionStatus() {
        return this.status;
    }
}
