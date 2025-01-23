package com.woodapi.service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;

import com.woodapi.dtos.AvailableResourcesDTO;
import com.woodapi.dtos.OrderItem;
import com.woodapi.dtos.OrderToScheduleDTO;
import com.woodapi.dtos.ScheduledOrderDTO;
import com.woodapi.model.ComponentAvailability;
import com.woodapi.model.OrderStatus;

import reactor.core.publisher.Mono;

@Service
public class OrderService {
    private final static String WOOD_COMPONENTS_AVAILABILITY_ENDPOINT_SUFFIX = "/available?components=";
    // private final static String WOOD_COMPONENTS_BASE_URL = "https://";
    private final Map<String, OrderToScheduleDTO> orderMap = new HashMap<>();
    private final WebClient webClient;

    @Autowired
    public OrderService(WebClient webClient) 
    {
        // WebClient with mocked response
        this.webClient = webClient;
        // webClientBuilder.baseUrl(OrderService.WOOD_COMPONENTS_BASE_URL)
        // .exchangeFunction(clientRequest -> this.getMockedClientResponse(clientRequest))
        // .build();
    }

    public OrderToScheduleDTO getOrderById(String orderId) {
        return orderMap.get(orderId);
    }

    public ScheduledOrderDTO scheduleOrder(OrderToScheduleDTO orderDto) {
        OrderItem[] orderItems = orderDto.getOrderItems();
        final String uuid = UUID.randomUUID().toString();
        orderMap.put(uuid, orderDto);

        orderDto.setStatus(OrderStatus.PENDING);

        String componentsAvailabilityUrlSuffix = this.getExternalResourceUrlSuffix(orderItems);

        // ask external resource, whether orderComponent count is valid or not
        Mono<AvailableResourcesDTO> response = this.webClient.get().uri(componentsAvailabilityUrlSuffix).retrieve().bodyToMono(AvailableResourcesDTO.class);

        AvailableResourcesDTO availableResourcesDTO = response.block();
        Boolean isTransactionEligible = this.isTransactionEligible(availableResourcesDTO, orderItems);

        if (isTransactionEligible) {
            //TODO: process invoice data
        }

        List<ComponentAvailability> componentAvailabilities = this.getComponentsAvailability(availableResourcesDTO, orderItems);
        return new ScheduledOrderDTO(componentAvailabilities); 
    }

    private String getExternalResourceUrlSuffix(OrderItem[] orderItems) {
        String urlSuffix = OrderService.WOOD_COMPONENTS_AVAILABILITY_ENDPOINT_SUFFIX;
        for (int i = 0; i < orderItems.length; i++) {
            urlSuffix += orderItems[i].getComponent() + ",";
        }

        return urlSuffix;
    }

    private Boolean isTransactionEligible(AvailableResourcesDTO availableResourcesDTO, OrderItem[] orderItems) {
        List<OrderItem> orderItemList = Arrays.asList(orderItems);
        return orderItemList.stream().anyMatch((item) -> item.getCount() < availableResourcesDTO.getCount(item.getComponent()));
    }

    private List<ComponentAvailability> getComponentsAvailability(AvailableResourcesDTO availableResourcesDTO, OrderItem[] orderItems) {
        List<OrderItem> orderItemList = Arrays.asList(orderItems);
        return orderItemList.stream().map((item) -> new ComponentAvailability(item.getComponent(), item.getCount() > availableResourcesDTO.getCount(item.getComponent()))).collect(Collectors.toList());
    }

    private Mono<ClientResponse> getMockedClientResponse(ClientRequest clientRequest) {
        return Mono.just(ClientResponse.create(HttpStatus.OK)
        .header("content-type", "application/json")
        .body("{ \"key\" : \"value\"}")
        .build());
    } 
}
