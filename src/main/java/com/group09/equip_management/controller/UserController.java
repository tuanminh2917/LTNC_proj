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
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/all")

    public ResponseEntity<List<User>> findAllUsers() {
        List<User> users = userService.findAllUsers();
        // return new ResponseEntity<>(users, HttpStatus.OK);
        // khong tra ve username va password trong response de tang cuong bao mat
        users.forEach(user -> {
            user.setUsername(null);
            user.setPassword(null);
        });
        return ResponseEntity.ok(users);
    }
}
