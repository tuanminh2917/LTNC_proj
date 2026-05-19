package com.group09.equip_management.controller;

import com.group09.equip_management.dto.LoginRequest;
import com.group09.equip_management.dto.LoginResponse;
import com.group09.equip_management.dto.UserSessionDto;
import com.group09.equip_management.service.AuthService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private AuthService authService;

    // API dang nhap
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        LoginResponse response = authService.login(loginRequest);

        if (response.isSuccess()) {
            session.setAttribute("loggedInUser", response.getUser());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body(response);
    }

    // API kiem tra trang thai dang nhap
    @GetMapping("/me")
    public ResponseEntity<LoginResponse> getCurrentUser(HttpSession session) {
        UserSessionDto user = (UserSessionDto) session.getAttribute("loggedInUser");

        if (user == null) {
            return ResponseEntity.status(401).body(
                LoginResponse.failure("Chưa đăng nhập")
            );
        }

        return ResponseEntity.ok(
            LoginResponse.success("Đã đăng nhập", user)
        );
    }

    // API dang xuat
    @PostMapping("/logout")
    public ResponseEntity<LoginResponse> logout(HttpSession session) {
        session.invalidate();

        return ResponseEntity.ok(
            new LoginResponse(true, "Đăng xuất thành công", null)
        );
    }
}