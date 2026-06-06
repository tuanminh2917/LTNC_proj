package com.group09.equip_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "Plan_Detail")
public class PlanDetail {

    @EmbeddedId
    private PlanDetailId id; // Chứa cả planId và equipId

    @ManyToOne
    @MapsId("planId") // Map trường planId trong khóa phức hợp với bảng Plan
    @JoinColumn(name = "plan_id")
    @JsonIgnore // <--- Thêm nhãn này để không bị lỗi bọc vòng khi chuyển thành JSON
    private Plan plan;

    // Nếu bạn có Entity Equipment.java, có thể map quan hệ @ManyToOne tại đây
    // Ở đây tạm thời map dưới dạng String thuần theo schema của bạn
    @Column(name = "conductor")
    private String conductor;

    @Column(name = "expected_time")
    private Integer expectedTime;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    // Constructors, Getters, Setters...
    public PlanDetail() {}

    public PlanDetail(PlanDetailId id, Plan plan, String conductor, Integer expectedTime, String note) {
        this.id = id;
        this.plan = plan;
        this.conductor = conductor;
        this.expectedTime = expectedTime;
        this.note = note;
    }

    // Getters and Setters for all fields...
    public PlanDetailId getId() {
        return id;
    }

    public void setId(PlanDetailId id) {
        this.id = id;
    }

    public Plan getPlan() {
        return plan;
    }

    public void setPlan(Plan plan) {
        this.plan = plan;
    }

    public String getConductor() {
        return conductor;
    }

    public void setConductor(String conductor) {
        this.conductor = conductor;
    }

    public Integer getExpectedTime() {
        return expectedTime;
    }

    public void setExpectedTime(Integer expectedTime) {
        this.expectedTime = expectedTime;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}