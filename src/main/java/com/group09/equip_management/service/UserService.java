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

    // Tìm kiếm người dùng theo ID (trả về Optional để tránh NullPointerException)
    public Optional<User> findById(Integer userId) {
        return userRepository.findById(userId);
    }

    // Lấy danh sách toàn bộ người dùng
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Hàm tìm kiếm linh hoạt dựa trên thông tin người dùng
    public List<User> search(User criteria) {
        // Kiểm tra nếu tất cả các trường tìm kiếm đều trống
        // Chú ý: userId kiểu Integer nên kiểm tra null, các trường String kiểm tra isEmpty()
        if (criteria.getUserId() == null &&
            (criteria.getUsername() == null || criteria.getUsername().isEmpty()) &&
            (criteria.getOfficialName() == null || criteria.getOfficialName().isEmpty()) &&
            (criteria.getRole() == null || criteria.getRole().isEmpty())) {

            return userRepository.findAll();
        }

        // Chuyển đổi userId sang String để khớp với tham số @Param("id") String trong Repository
        String idStr = (criteria.getUserId() != null) ? String.valueOf(criteria.getUserId()) : null;

        // Gọi hàm searchUser đã định nghĩa trong UserRepository
        return userRepository.searchUser(
            idStr,
            criteria.getUsername(),
            criteria.getOfficialName(),
            criteria.getRole()
        );
    }
}
