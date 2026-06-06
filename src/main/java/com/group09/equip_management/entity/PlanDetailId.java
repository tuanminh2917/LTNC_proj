package com.group09.equip_management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class PlanDetailId implements Serializable {
    @Column(name = "plan_id")
    private Integer planId;

    @Column(name = "equip_id", length = 50)
    private String equipId;

    public PlanDetailId() {}
    public PlanDetailId(Integer planId, String equipId) {
        this.planId = planId;
        this.equipId = equipId;
    }
    // Getters, Setters, hashCode và equals (bắt buộc phải có)
    public Integer getPlanId() {
        return planId;
    }

    public void setPlanId(Integer planId) {
        this.planId = planId;
    }

    public String getEquipId() {
        return equipId;
    }

    public void setEquipId(String equipId) {
        this.equipId = equipId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PlanDetailId that = (PlanDetailId) o;
        return Objects.equals(planId, that.planId) && Objects.equals(equipId, that.equipId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(planId, equipId);
    }
}
