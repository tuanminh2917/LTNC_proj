package com.group09.equip_management.service;

import com.group09.equip_management.entity.Plan;
import com.group09.equip_management.repository.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import com.group09.equip_management.entity.PlanDetail;
import java.time.LocalDate;

@Service
public class PlanService {

    @Autowired
    private PlanRepository planRepository;

    // Lấy thông tin kế hoạch kèm chi tiết bên trong nó
    public Plan getPlanWithDetails(Integer planId) {
        return planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kế hoạch với ID: " + planId));
    }

    // Tìm kiếm tất cả
    public List<Plan> getAllPlans()
    {
        return planRepository.findAll();
    }

    // Tìm kiếm các kế hoạch liên quan tới một thiết bị cụ thể
    public List<Plan> getPlansByEquip(String equipId) {
        return planRepository.findPlansByEquipmentId(equipId);
    }

    // Tìm kiếm các kế hoạch theo năm
    public List<Plan> getPlansByYear(Integer year) {
        return planRepository.findByYear(year);
    }

    // Tìm kiếm các kế hoạch theo trạng thái
    public List<Plan> getPlansByStatus(String status)
    {
        return planRepository.findByStatus(status);
    }

    // Tìm kiếm theo loại
    public List<Plan> getPlansByType(String type){
        return planRepository.findByType(type);
    }

    public List<Plan> searchPlans(String type, String status, 
        Integer year, java.time.LocalDate createdAt, 
        String equipId, String conductor) {
        return planRepository.searchPlans(type, status, year, createdAt, equipId, conductor);
    }

    public Plan createPeriodicPlan(Integer year, List<PlanDetail> details) {
        if (year == null) {
            throw new IllegalArgumentException("Năm kế hoạch không được để trống");
        }

        int currentYear = LocalDate.now().getYear();

        if (year < currentYear) {
            throw new IllegalArgumentException("Năm kế hoạch không được nhỏ hơn năm hiện tại");
        }

        if (details == null || details.isEmpty()) {
            throw new IllegalArgumentException("Kế hoạch phải có ít nhất một dòng thiết bị");
        }

        Plan plan = new Plan();
        plan.setType("Định kỳ");
        plan.setStatus("Chờ phê duyệt");
        plan.setCreatedDate(LocalDate.now());
        plan.setYear(year);
        plan.setDetails(details);

        return planRepository.save(plan);
    }
}