package com.woodapi.dtos;

import java.util.List;

import com.woodapi.model.ComponentAvailability;

public class ScheduledOrderDTO {
    private List<ComponentAvailability> componentsAvailability;

    public ScheduledOrderDTO(List<ComponentAvailability> componentsAvailability) {
        this.componentsAvailability = componentsAvailability;
    }

    public List<ComponentAvailability> getComponentsAvailability() {
        return componentsAvailability;
    }
}
