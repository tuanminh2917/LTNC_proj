package com.group09.equip_management.repository;

import com.group09.equip_management.entity.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Integer> {

    @Query(value = "SELECT DISTINCT p.* FROM Plan p " +
                   "JOIN Plan_Detail pd ON p.plan_id = pd.plan_id " +
                   "WHERE " +
                   "(:type IS NULL OR :type = '' OR p.type = :type) AND " +
                   "(:status IS NULL OR :status = '' OR p.status = :status) AND " +
                   "(:year IS NULL OR p.year = :year) AND " +
                   "(:createdDate IS NULL OR p.created_date = :createdDate) AND " + // ĐỒNG BỘ Ở ĐÂY
                   "(:equipId IS NULL OR :equipId = '' OR pd.equip_id LIKE CONCAT('%', :equipId, '%')) AND " +
                   "(:conductor IS NULL OR :conductor = '' OR pd.conductor LIKE CONCAT('%', :conductor, '%'))",
           nativeQuery = true)
    List<Plan> searchPlans(@Param("type") String type,
                           @Param("status") String status,
                           @Param("year") Integer year,
                           @Param("createdDate") LocalDate createdDate, // Đổi tên Param
                           @Param("equipId") String equipId,
                           @Param("conductor") String conductor);

    // Ví dụ một câu JOIN 2 bảng lấy toàn bộ kế hoạch theo mã thiết bị (Native Query)
    @Query(value = "SELECT p.* FROM Plan p " +
                   "JOIN Plan_Detail pd ON p.plan_id = pd.plan_id " +
                   "WHERE pd.equip_id = :equipId", nativeQuery = true)
    List<Plan> findPlansByEquipmentId(@Param("equipId") String equipId);

    // Find all plans
    // Default JpaRepository.findAll() is sufficient, no custom query needed.
    List<Plan> findAll();

    // Find plans by year
    List<Plan> findByYear(@Param("year") Integer year);

    // Find plans by status
    List<Plan> findByStatus(@Param("status") String status);

    // Find plans by type
    List<Plan> findByType(@Param("type") String type);
}