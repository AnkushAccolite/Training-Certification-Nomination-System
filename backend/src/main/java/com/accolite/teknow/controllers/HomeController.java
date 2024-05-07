package com.accolite.teknow.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home(){
        return "Hello home";
    }

    @GetMapping("/secured")
    public String secured(){
        return "hello, Secured";
    }
}
