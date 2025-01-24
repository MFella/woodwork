package com.woodapi.dtos;

import javax.validation.constraints.NotNull;

public class OrderItem {
    @NotNull
    private WoodComponent name;
    
    @NotNull
    private Long count;

    public OrderItem() {
        super();
    }

    public WoodComponent getName() {
        return name;
    }

    public Long getCount() {
        return count;
    }
}
