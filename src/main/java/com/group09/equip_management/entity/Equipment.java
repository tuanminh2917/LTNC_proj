package com.group09.equip_management.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "Equipment")
public class Equipment {

    @Id
    @Column(name = "equip_id", length = 50)
    private String equipId; // Dung chuoi String lam ID khoa chinh theo quy dinh cua nhom

    @Column(name = "equip_name", nullable = false)
    private String equipName;

    @Column(name = "origin")
    private String origin;

    @Column(name = "date_of_receipt")
    private LocalDate dateOfReceipt;

    @Column(name = "user_id")
    private Integer userId;

    // Constructors
    public Equipment() {}

    public Equipment(String equipId, String equipName, String origin, LocalDate dateOfReceipt, Integer userId) {
        this.equipId = equipId;
        this.equipName = equipName;
        this.origin = origin;
        this.dateOfReceipt = dateOfReceipt;
        this.userId = userId;
    }

    // Getters and Setters
    public String getEquipId() { return equipId; }
    public void setEquipId(String equipId) { this.equipId = equipId; }

    public String getEquipName() { return equipName; }
    public void setEquipName(String equipName) { this.equipName = equipName; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public LocalDate getDateOfReceipt() { return dateOfReceipt; }
    public void setDateOfReceipt(LocalDate dateOfReceipt) { this.dateOfReceipt = dateOfReceipt; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
}