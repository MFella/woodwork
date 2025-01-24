// package com.woodapi.service;

// import static org.junit.Assert.assertEquals;
// import static org.mockito.ArgumentMatchers.anyString;
// import static org.mockito.Mockito.when;

// import java.util.List;

// import org.junit.Before;
// import org.junit.Test;
// import org.junit.runner.RunWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mockito;
// import org.mockito.MockitoAnnotations;
// import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
// import org.springframework.test.web.servlet.MockMvc;
// import org.springframework.test.web.servlet.setup.MockMvcBuilders;
// import org.springframework.web.reactive.function.client.WebClient;

// import com.woodapi.dtos.OrderItem;
// import com.woodapi.dtos.OrderToScheduleDTO;
// import com.woodapi.dtos.ScheduledOrderDTO;
// import com.woodapi.dtos.WoodComponent;


// @RunWith(SpringJUnit4ClassRunner.class)
// public class OrderServiceTest {
//     private WebClient webClient;
//     private MockMvc mockMvc;

//     @InjectMocks
//     private OrderService orderService; // Mock your service

//     @Before
//     public void setUp() {
//         MockitoAnnotations.openMocks(this);
//         mockMvc = MockMvcBuilders.standaloneSetup(orderService).build();
//     }

//     @Test
//     public void Get_All_Orders_Returns_Empty_Array() {
//         // Act
//         List<ScheduledOrderDTO> scheduledOrders = orderService.getAllOrders();

//         // Assert
//         assertEquals(scheduledOrders.size(), 0);
//     }

//     @Test
//     public void Schedule_Order_Should_Throw_Error_When_Available_Resource_Is_Null() {
//         String expectedErrorMessage = "Cannot find resource";
//         // Arrange
//         // Mock the response for the POST request
//         WebClient.RequestBodySpec requestBodySpec = Mockito.mock(WebClient.RequestBodySpec.class);

//         when(requestBodySpec.bodyValue(anyString())).thenReturn(null);

//         OrderToScheduleDTO orderToScheduleDTO = new OrderToScheduleDTO();
//         OrderItem[] orderItems = {
//             new OrderItem(WoodComponent.Beam, 2L)
//         };
//         orderToScheduleDTO.setOrderItems(orderItems);

//         try {
//             // Act
//             orderService.scheduleOrder(orderToScheduleDTO);
//         } catch (Exception exception) {
//             // Assert
//             assertEquals(exception.getMessage(), expectedErrorMessage);
//         }

//     }
// }
