package com.group09.equip_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Embeddable // Biến thành lớp nhúng (Element) thay vì Entity
public class PlanDetail {

    @Column(name = "equip_id", length = 50, nullable = false)
    private String equipId; // Khai báo trực tiếp không cần Id phức hợp

    @Column(name = "conductor")
    private String conductor;

    @Column(name = "scope_of_work", columnDefinition = "TEXT")
    private String scopeOfWork;

    @Column(name = "expected_time")
    private Integer expectedTime;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    // BẮT BUỘC: Cần có Constructor không tham số cho Hibernate
    public PlanDetail() {}

    public PlanDetail(String equipId, String conductor, Integer expectedTime, String note, String scopeOfWork) {
        this.equipId = equipId;
        this.conductor = conductor;
        this.expectedTime = expectedTime;
        this.note = note;
        this.scopeOfWork = scopeOfWork;
    }

    // Getters and Setters thông thường...
    public String getEquipId() { return equipId; }
    public void setEquipId(String equipId) { this.equipId = equipId; }
    public String getConductor() { return conductor; }
    public void setConductor(String conductor) { this.conductor = conductor; }
    public Integer getExpectedTime() { return expectedTime; }
    public void setExpectedTime(Integer expectedTime) { this.expectedTime = expectedTime; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public String getScopeOfWork() {
        return scopeOfWork;
    }
    public void setScopeOfWork(String scopeOfWork) {
        this.scopeOfWork = scopeOfWork;
    }
}