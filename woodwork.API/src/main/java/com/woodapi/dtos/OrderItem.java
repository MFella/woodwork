package com.woodapi.dtos;

public class OrderItem {
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
