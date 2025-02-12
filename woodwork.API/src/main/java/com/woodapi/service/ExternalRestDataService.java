package com.woodapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.woodapi.dtos.OrderItem;
import com.woodapi.model.EntityType;

import reactor.core.publisher.Mono;

@Service
public class ExternalRestDataService {
    private final static String WOOD_COMPONENTS_AVAILABILITY_ENDPOINT_SUFFIX = "/available?components=";
    private final static String INVOICE_ENDPOINT_SUFFIX = "/invoice";

    private static WebClient webClient;

    @Autowired
    private ExternalRestDataService(WebClient webClient) {
        ExternalRestDataService.webClient = webClient;
    }

    public static <T> Mono<ResponseEntity<T>> getMockedResponseEntity(EntityType entityType, Class<T> classType, OrderItem[] orderItems) {
        String uriSuffix = entityType == EntityType.COMPONENT ?
            ExternalRestDataService.getComponentsAvailabilityEndpointSuffix(orderItems):
            ExternalRestDataService.getInvoiceCreationEndpointSuffix();
        return ExternalRestDataService.webClient.get().uri(uriSuffix).retrieve().toEntity(classType);
    }

    public static <T> Mono<ResponseEntity<T>> postMockedResponseEntity(String uriSuffix, Class<T> classType, Object bodyObject) {
        return ExternalRestDataService.webClient.post().uri(uriSuffix).bodyValue(bodyObject).retrieve().toEntity(classType);
    }

    private static String getComponentsAvailabilityEndpointSuffix(OrderItem[] orderItems) {
        String urlSuffix = ExternalRestDataService.WOOD_COMPONENTS_AVAILABILITY_ENDPOINT_SUFFIX;
        for (int i = 0; i < orderItems.length; i++) {
            urlSuffix += orderItems[i].getName() + ",";
        }

        return urlSuffix;
    }

    private static String getInvoiceCreationEndpointSuffix() {
        return ExternalRestDataService.INVOICE_ENDPOINT_SUFFIX;
    }
}
