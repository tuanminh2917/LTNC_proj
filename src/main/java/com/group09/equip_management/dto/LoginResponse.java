package com.group09.equip_management.dto;

public class LoginResponse {

    private boolean success;
    private String message;
    private UserSessionDto user;

    public LoginResponse() {}

    public LoginResponse(boolean success, String message, UserSessionDto user) {
        this.success = success;
        this.message = message;
        this.user = user;
    }

    public static LoginResponse success(String message, UserSessionDto user) {
        return new LoginResponse(true, message, user);
    }

    public static LoginResponse failure(String message) {
        return new LoginResponse(false, message, null);
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UserSessionDto getUser() {
        return user;
    }

    public void setUser(UserSessionDto user) {
        this.user = user;
    }
}