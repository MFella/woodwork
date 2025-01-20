package com.woodapi.dtos;

enum WoodComponent {
    Lumber,
    Beam,
    Joist,
    Plywood,
    Door
}

class OrderItem {
    private WoodComponent component;
    private Long count;

    public OrderItem() {
        super();
    }

    public WoodComponent getComponent() {
        return component;
    }

    public Long getCount() {
        return count;
    }
}

public class OrderDTO {
    private OrderItem[] orderItems;

    public OrderItem[] getOrderItems() {
        return orderItems;
    }
}
