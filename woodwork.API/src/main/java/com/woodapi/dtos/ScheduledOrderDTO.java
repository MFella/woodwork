package com.woodapi.dtos;

import java.util.List;
import java.util.UUID;

import com.woodapi.model.ComponentAvailability;
import com.woodapi.model.TransactionStatus;

public class ScheduledOrderDTO {
    private List<ComponentAvailability> componentsAvailability;
    private TransactionStatus status = TransactionStatus.NOT_STARTED;
    private CreatedInvoiceDTO createdInvoiceDTO;
    private final String id = UUID.randomUUID().toString();

    public ScheduledOrderDTO(List<ComponentAvailability> componentsAvailability, TransactionStatus status) {
        this.componentsAvailability = componentsAvailability;
        this.status = status;
    }

    public void setOrderStatus(TransactionStatus status) {
        this.status = status;
    }

    public String getId() {
        return this.id;
    }

    public void setCreatedInvoice(CreatedInvoiceDTO createdInvoiceDTO) {
        this.createdInvoiceDTO = createdInvoiceDTO;
    }

    public List<ComponentAvailability> getComponentsAvailability() {
        return this.componentsAvailability;
    }

    public CreatedInvoiceDTO getCreatedInvoice() {
        return this.createdInvoiceDTO;
    }

    public TransactionStatus getOrderStatus() {
        return this.status;
    }
}
