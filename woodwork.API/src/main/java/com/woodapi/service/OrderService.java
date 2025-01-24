package com.woodapi.service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.woodapi.dtos.AvailableComponentsDTO;
import com.woodapi.dtos.CreatedInvoiceDTO;
import com.woodapi.dtos.OrderItem;
import com.woodapi.dtos.OrderToScheduleDTO;
import com.woodapi.dtos.ScheduledOrderDTO;
import com.woodapi.exceptions.InternalExceptionError;
import com.woodapi.model.ComponentAvailability;
import com.woodapi.model.EntityType;
import com.woodapi.model.TransactionStatus;
import com.woodapi.repository.OrderRepository;

import reactor.core.publisher.Mono;

@Service
public class OrderService {
    private final OrderRepository orderRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository) 
    {
        this.orderRepository = orderRepository;
    }

    public List<ScheduledOrderDTO> getAllOrders() {
        return this.orderRepository.getAllOrders();
    }

    public ScheduledOrderDTO scheduleOrder(OrderToScheduleDTO orderDto) {
        OrderItem[] orderItems = orderDto.getOrderItems();

        // ask external resource, whether orderComponent count is valid or not
        Mono<ResponseEntity<AvailableComponentsDTO>> mockedAvailableComponentsResponse =
            ExternalRestDataService.getMockedResponseEntity(EntityType.COMPONENT, AvailableComponentsDTO.class, orderItems);

        AvailableComponentsDTO availableResourcesDTO = mockedAvailableComponentsResponse.block().getBody();

        if (availableResourcesDTO == null) {
            throw new InternalExceptionError("Cannot find resource");
        }

        List<ComponentAvailability> componentAvailabilities = this.getComponentsAvailability(availableResourcesDTO, orderItems);
        ScheduledOrderDTO scheduledOrderDTO = new ScheduledOrderDTO(componentAvailabilities, TransactionStatus.REJECTED);

        if (this.isTransactionNotEligible(availableResourcesDTO, orderItems)) {
            // dont proceed invoice, when transaction is not eligible
            return scheduledOrderDTO;
        }

        Mono<ResponseEntity<CreatedInvoiceDTO>> mockedCreatedInvoiceResponse =
            ExternalRestDataService.getMockedResponseEntity(EntityType.INVOICE, CreatedInvoiceDTO.class, orderItems);

        CreatedInvoiceDTO createdInvoiceDTO = mockedCreatedInvoiceResponse.block().getBody();
        scheduledOrderDTO.setCreatedInvoice(createdInvoiceDTO);

        if (createdInvoiceDTO == null) {
            createdInvoiceDTO = new CreatedInvoiceDTO();
            createdInvoiceDTO.setStatus(TransactionStatus.REJECTED);
        } else {
            createdInvoiceDTO.setStatus(TransactionStatus.COMPLETED);
        }

        scheduledOrderDTO.setOrderStatus(TransactionStatus.COMPLETED);
        this.orderRepository.saveOrder(scheduledOrderDTO);
        return scheduledOrderDTO;
    }

    private Boolean isTransactionNotEligible(AvailableComponentsDTO availableResourcesDTO, OrderItem[] orderItems) {
        List<OrderItem> orderItemList = Arrays.asList(orderItems);
        return orderItemList.stream().anyMatch((item) -> item.getCount() > availableResourcesDTO.getCount(item.getName()));
    }

    private List<ComponentAvailability> getComponentsAvailability(AvailableComponentsDTO availableResourcesDTO,
        OrderItem[] orderItems) {

        List<OrderItem> orderItemList = Arrays.asList(orderItems);
        return orderItemList.stream().map((item) ->
            new ComponentAvailability(item.getName(), item.getCount() <= availableResourcesDTO.getCount(item.getName())))
            .collect(Collectors.toList());
    }
}
