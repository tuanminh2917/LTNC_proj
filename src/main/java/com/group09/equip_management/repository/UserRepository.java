package com.group09.equip_management.repository;

import com.group09.equip_management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // Sử dụng JPQL (không dùng nativeQuery) để an toàn và đồng bộ với class User
       @Query("SELECT u FROM User u WHERE " +
              "(:id IS NULL OR CAST(u.userId AS string) = :id) AND " + // Bỏ % nếu dùng =
              "(:username IS NULL OR u.username = :username) AND " +   // Bỏ % nếu dùng =
              "(:password IS NULL OR u.password = :password) AND " +   // Bỏ % nếu dùng =
              "(:officialName IS NULL OR u.officialName LIKE %:officialName%) AND " + // Giữ LIKE nếu muốn tìm mờ
              "(:role IS NULL OR u.role = :role)")
    List<User> searchUser(@Param("id") String id, 
                          @Param("username") String username, 
                          @Param("officialName") String officialName, 
                          @Param("role") String role);
}