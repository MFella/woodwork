package com.woodapi.service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.woodapi.dtos.OrderDTO;

@Service
public class OrderService {
    private final Map<String, OrderDTO> orderMap = new HashMap<>();

    public OrderService() {
    }

    public OrderDTO getOrderById(String orderId) {
        return orderMap.get(orderId);
    }

    public void saveOrder(OrderDTO orderDto) {
        final String uuid = UUID.randomUUID().toString();
        orderMap.put(uuid, orderDto);
    }
}
