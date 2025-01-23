package com.woodapi.model;

import com.woodapi.dtos.WoodComponent;

public class ComponentAvailability {
    private WoodComponent component;
    private Boolean isAvailable;

    public ComponentAvailability(WoodComponent component, Boolean isAvailable) {
        this.component = component;
        this.isAvailable = isAvailable;
    }

    public WoodComponent getComponent() {
        return component;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }
}
