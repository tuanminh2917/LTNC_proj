package com.group09.equip_management.service;

import com.group09.equip_management.entity.Plan;
import com.group09.equip_management.repository.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

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
    public Plan approvePlan(Integer planId) {

        Plan plan = planRepository.findById(planId)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy kế hoạch"));
    
        plan.setStatus("Đã phê duyệt");
    
        return planRepository.save(plan);
    }
    public Plan rejectPlan(Integer planId) {

        Plan plan = planRepository.findById(planId)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy kế hoạch"));
    
        plan.setStatus("Bị từ chối");
    
        return planRepository.save(plan);
    }
}