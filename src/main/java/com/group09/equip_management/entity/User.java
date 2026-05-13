package com.group09.equip_management.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "User")
public class User {
    @Id
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "official_name")
    private String officialName;

    @Column(name = "role")
    private String role;

    // Constructors
    public User() {}

    public User(Integer userId, String username, String password, String officialName, String role) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.officialName = officialName;
        this.role = role;
    }

    // Getters and Setters
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getOfficialName() { return officialName; }
    public void setOfficialName(String officialName) { this.officialName = officialName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
