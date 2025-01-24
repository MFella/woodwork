package com.woodapi.dtos;

import javax.validation.constraints.NotNull;

public class OrderItem {
    @NotNull
    private WoodComponent name;
    
    @NotNull
    private Long count;

    public OrderItem(WoodComponent component, Long count) {
        this.name = component;
        this.count = count;        
    }

    public WoodComponent getName() {
        return name;
    }

    public Long getCount() {
        return count;
    }
}
