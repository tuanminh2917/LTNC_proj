package com.group09.equip_management.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "Record_Detail")
public class Record_Detail {
    @Id
    @Column(name = "rec_det_id")
    private Long recDetId;

    @Column(name = "equip_id")
    private String equipId;

    @Column(name = "conductor")
    private String conductor;

    @Column(name = "scope_of_work")
    private String scopeOfWork;

    @Column(name = "conduct_day")
    private LocalDate conductDay;

    // Constructors, getters, and setters
    public Record_Detail() {}

    public Record_Detail(Long recDetId, String equipId, String conductor, String scopeOfWork, LocalDate conductDay) {
        this.recDetId = recDetId;
        this.equipId = equipId;
        this.conductor = conductor;
        this.scopeOfWork = scopeOfWork;
        this.conductDay = conductDay;
    }

    public Long getRecDetId() {
        return recDetId;
    }

    public void setRecDetId(Long recDetId) {
        this.recDetId = recDetId;
    }

    public String getEquipId() {
        return equipId;
    }

    public void setEquipId(String equipId) {
        this.equipId = equipId;
    }

    public String getConductor() {
        return conductor;
    }

    public void setConductor(String conductor) {
        this.conductor = conductor;
    }

    public String getScopeOfWork() {
        return scopeOfWork;
    }

    public void setScopeOfWork(String scopeOfWork) {
        this.scopeOfWork = scopeOfWork;
    }

    public LocalDate getConductDay() {
        return conductDay;
    }

    public void setConductDay(LocalDate conductDay) {
        this.conductDay = conductDay;
    }
}
