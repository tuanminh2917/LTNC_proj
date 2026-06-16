package com.group09.equip_management.service;

import com.group09.equip_management.entity.Plan;
import com.group09.equip_management.repository.PlanRepository;

import jakarta.transaction.Transactional;

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
        String equipId, String conductor, String scopeOfWork) {
        return planRepository.searchPlans(type, status, year, createdAt, equipId, conductor, scopeOfWork);
    }

    @Transactional
    public Plan createPeriodicPlan(Integer year, List<PlanDetail> details) {
        // 1. KIỂM TRA NGHIỆP VỤ: Tìm xem dưới DB đã có kế hoạch "Bảo dưỡng, thay thế" nào "Đã phê duyệt" cho năm này chưa
        // Bạn có thể viết thêm hàm này trong PlanRepository
        boolean isAlreadyApproved = planRepository.existsByTypeAndStatusAndYear(
                "Bảo dưỡng, thay thế", 
                "Đã phê duyệt", 
                year
        );

        // 2. CHẶN ĐỨNG: Nếu đã có rồi, không cho phép tạo nữa!
        if (isAlreadyApproved) {
            throw new IllegalArgumentException("Không thể thêm kế hoạch! Năm " + year + " đã tồn tại một kế hoạch Bảo dưỡng, thay thế đã được phê duyệt.");
        }


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
        plan.setType("Bảo dưỡng, thay thế");
        plan.setStatus("Chờ phê duyệt");
        plan.setCreatedDate(LocalDate.now());
        plan.setYear(year);
        plan.setDetails(details);

        return planRepository.save(plan);
    }

    public Plan createUnexpectedRepairPlan(Integer year, List<PlanDetail> details) {
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
        plan.setType("Sửa chữa");
        plan.setStatus("Chờ phê duyệt");
        plan.setCreatedDate(LocalDate.now());
        plan.setYear(year);
        plan.setDetails(details);

        return planRepository.save(plan);
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