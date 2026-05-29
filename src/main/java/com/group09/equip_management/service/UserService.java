package com.group09.equip_management.service;

import com.group09.equip_management.entity.User;
import com.group09.equip_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    // Find all users
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }
}
