package com.group09.equip_management.controller;

import com.group09.equip_management.entity.User;
import com.group09.equip_management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    // Tiep nhan tieu chi tim kiem va map truc tiep vao object User
    @PostMapping("/search")
    public ResponseEntity<List<User>> searchUser(@RequestBody User criteria) {
        // System.out.println("Received search criteria: " + criteria);
        List<User> results = userService.search(criteria);
        return ResponseEntity.ok(results);
    }
}
