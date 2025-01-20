package com.woodapi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ExampleController {

    @GetMapping("/hello")
    public ExampleResponse sayHello() {
        return new ExampleResponse("Hello :)");
    }
}

class ExampleResponse {
    private String message;

    public ExampleResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return this.message;
    }
    
}
