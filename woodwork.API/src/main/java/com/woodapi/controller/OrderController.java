package com.woodapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import com.woodapi.dtos.OrderToScheduleDTO;
import com.woodapi.dtos.ScheduledOrderDTO;
import com.woodapi.service.OrderService;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService, WebClient webClient) {
        this.orderService = orderService;
    }

    @PostMapping("/schedule")
    public ResponseEntity<ScheduledOrderDTO> saveOrder(@RequestBody OrderToScheduleDTO orderToScheduleDTO) {
        ScheduledOrderDTO scheduledOrderDto = orderService.scheduleOrder(orderToScheduleDTO);
        return new ResponseEntity<ScheduledOrderDTO>(scheduledOrderDto, HttpStatus.CREATED);
    }
}
