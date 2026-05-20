package com.group09.equip_management.service;

import com.group09.equip_management.dto.LoginRequest;
import com.group09.equip_management.dto.LoginResponse;
import com.group09.equip_management.dto.UserSessionDto;
import com.group09.equip_management.entity.User;
import com.group09.equip_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public LoginResponse login(LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        // TODO 1: Kiem tra du lieu dau vao
        if (username == null || username.trim().isEmpty() ||
            password == null || password.trim().isEmpty()) {

            return LoginResponse.failure("Vui lòng nhập đầy đủ tài khoản và mật khẩu");
        }

        username = username.trim();
        password = password.trim();

        // TODO 2: Tim user theo username
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isEmpty()) {
            return LoginResponse.failure("Tài khoản không tồn tại");
        }

        User user = userOpt.get();

        // TODO 3: Kiem tra mat khau
        // Luu y: Database demo hien tai dang luu mat khau dang plain text, vi du: 123
        if (!password.equals(user.getPassword())) {
            return LoginResponse.failure("Sai mật khẩu");
        }

        // TODO 4: Tao user dto de tra ve front-end, khong tra password
        UserSessionDto userSessionDto = new UserSessionDto(
            user.getUserId(),
            user.getUsername(),
            user.getOfficialName(),
            user.getRole()
        );

        return LoginResponse.success("Đăng nhập thành công", userSessionDto);
    }
}