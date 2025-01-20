// package com.woodapi.controller;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.woodapi.dtos.OrderDTO;
// import com.woodapi.service.OrderService;

// @RestController
// @RequestMapping("/api/order")
// public class OrderController {

//     private final OrderService orderService;

//     @Autowired
//     public OrderController(OrderService orderService) {
//         this.orderService = orderService;
//     }

//     @PostMapping("")
//     public ResponseEntity<String> saveOrder(@RequestBody OrderDTO orderDTO) {
//         orderService.saveOrder(orderDTO);
//         return new ResponseEntity<>("Order has been created", HttpStatus.CREATED);
//     }
// }
