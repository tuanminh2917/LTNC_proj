package com.group09.equip_management.repository;

import com.group09.equip_management.entity.PlanDetail;
import com.group09.equip_management.entity.PlanDetailId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanDetailRepository extends JpaRepository<PlanDetail, PlanDetailId> {
    // JpaRepository nhận vào ID là kiểu PlanDetailId vừa tạo ở trên
}