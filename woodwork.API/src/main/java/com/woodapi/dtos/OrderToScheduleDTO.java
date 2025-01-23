package com.woodapi.dtos;

import com.woodapi.model.OrderStatus;

public class OrderToScheduleDTO {
    private OrderItem[] orderItems;
    private OrderStatus status = OrderStatus.NOT_STARTED;

    public OrderItem[] getOrderItems() {
        return orderItems;
    }

    public void setStatus(OrderStatus orderStatus) {
        this.status = orderStatus;
    }

    public OrderStatus getStatus() {
        return this.status;
    }
}
