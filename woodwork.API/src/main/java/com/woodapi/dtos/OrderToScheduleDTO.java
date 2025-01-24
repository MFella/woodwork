package com.woodapi.dtos;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

public class OrderToScheduleDTO {
    @NotNull
    @Valid
    private OrderItem[] orderItems;

    public OrderItem[] getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(OrderItem[] orderItems) {
        this.orderItems = orderItems;
    }
}
