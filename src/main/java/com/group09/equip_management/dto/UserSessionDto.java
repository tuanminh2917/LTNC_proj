package com.group09.equip_management.dto;

public class UserSessionDto {

    private Integer userId;
    private String username;
    private String officialName;
    private String role;

    public UserSessionDto() {}

    public UserSessionDto(Integer userId, String username, String officialName, String role) {
        this.userId = userId;
        this.username = username;
        this.officialName = officialName;
        this.role = role;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getOfficialName() {
        return officialName;
    }

    public void setOfficialName(String officialName) {
        this.officialName = officialName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}