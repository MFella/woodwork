package com.woodapi.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.woodapi.dtos.ScheduledOrderDTO;

@Component
public class OrderRepository {
    private final Map<String, ScheduledOrderDTO> scheduledOrderMap = new HashMap<>();

    public OrderRepository() {
    }

    public void saveOrder(ScheduledOrderDTO scheduledOrderDTO) {
        this.scheduledOrderMap.put(scheduledOrderDTO.getId(), scheduledOrderDTO);
    }

    public List<ScheduledOrderDTO> getAllOrders() {
        return new ArrayList<ScheduledOrderDTO>(this.scheduledOrderMap.values());
    }
}
