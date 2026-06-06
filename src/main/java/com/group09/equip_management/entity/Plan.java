package com.group09.equip_management.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "Plan")
public class Plan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "plan_id")
    private Integer planId;

    @Column(name = "type", nullable = false)
    private String type; // Bạn có thể map thành một Enum tương ứng trong Java

    @Column(name = "created_date", nullable = false, updatable = false)
    private java.time.LocalDate createdDate;

    @Column(name = "status", nullable = false)
    private String status; // Bạn có thể map thành một Enum tương ứng trong Java

    @Column(name = "year", nullable = false)
    private Integer year;

    // Kết nối 1 - Nhiều sang bảng chi tiết
    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlanDetail> details;

    // Constructors, Getters, Setters...

    public Plan() {}

    public Plan(String type) {
        this.type = type;
        this.createdDate = java.time.LocalDate.now();
        this.status = "Chờ phê duyệt"; // Mặc định khi tạo mới sẽ là Pending
        this.year = java.time.LocalDate.now().getYear();
    }

    public Integer getPlanId() {
        return planId;
    }

    public void setPlanId(Integer planId) {
        this.planId = planId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<PlanDetail> getDetails() {
        return details;
    }

    public void setDetails(List<PlanDetail> details) {
        this.details = details;
    }

    public java.time.LocalDate getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.time.LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }
}