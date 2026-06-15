package com.group09.equip_management.controller;

import com.group09.equip_management.entity.Plan;
import com.group09.equip_management.service.PlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import com.group09.equip_management.entity.PlanDetail;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/plan")
public class PlanController {
    
    @Autowired
    private PlanService planService;

    @PostMapping("/search")
    public ResponseEntity<List<Plan>> searchPlans(@RequestBody Map<String, Object> searchParams) {
        
        String type = (String) searchParams.get("type");
        String status = (String) searchParams.get("status");
        
        Integer year = searchParams.get("year") != null && !searchParams.get("year").toString().trim().isEmpty() 
                ? Integer.parseInt(searchParams.get("year").toString().trim()) 
                : null;
        
        // Nhận key "createdDate" từ Bruno gửi lên thay vì "createdAt"
        LocalDate createdDate = null;
        if (searchParams.get("createdDate") != null && !searchParams.get("createdDate").toString().trim().isEmpty()) {
            try {
                createdDate = LocalDate.parse(searchParams.get("createdDate").toString().trim(), DateTimeFormatter.ISO_LOCAL_DATE);
            } catch (Exception e) {
                createdDate = null;
            }
        }
        
        String equipId = (String) searchParams.get("equipId");
        String conductor = (String) searchParams.get("conductor");
        
        String scopeOfWork = (String) searchParams.get("scopeOfWork");
        if (scopeOfWork != null && scopeOfWork.trim().isEmpty()) scopeOfWork = null;

        // Truyền biến mới vào Service
        List<Plan> filteredPlans = planService.searchPlans(type, status, year, createdDate, equipId, conductor, scopeOfWork);
        return new ResponseEntity<>(filteredPlans, HttpStatus.OK);
    }
    
    @GetMapping("/approve/{id}")
    public ResponseEntity<Plan> approvePlan(
        @PathVariable Integer id) {

        Plan plan = planService.approvePlan(id);

        return ResponseEntity.ok(plan);
    }
    @GetMapping("/reject/{id}")
    public ResponseEntity<Plan> rejectPlan(
        @PathVariable Integer id) {

        Plan plan = planService.rejectPlan(id);

        return ResponseEntity.ok(plan);

    }

    @PostMapping("/periodic")
    public ResponseEntity<?> createPeriodicPlan(@RequestBody Map<String, Object> requestBody) {
        try {
            Integer year = Integer.parseInt(requestBody.get("year").toString());

            List<Map<String, Object>> detailMaps =
                    (List<Map<String, Object>>) requestBody.get("details");

            List<PlanDetail> details = new ArrayList<>();

            for (Map<String, Object> item : detailMaps) {
                String equipId = item.get("equipId").toString().trim();
                String conductor = item.get("conductor").toString().trim();
                Integer expectedTime = Integer.parseInt(item.get("expectedTime").toString());
                String note = item.get("note") == null ? "" : item.get("note").toString().trim();
                String scopeOfWork = item.get("scopeOfWork").toString();

                details.add(new PlanDetail(equipId, conductor, expectedTime, note, scopeOfWork));
            }

            Plan createdPlan = planService.createPeriodicPlan(year, details);
            return new ResponseEntity<>(createdPlan, HttpStatus.CREATED);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            return new ResponseEntity<>(
                    Map.of("message", "Không thể tạo kế hoạch bảo dưỡng, thay thế định kỳ"),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @PostMapping("/unexpected-repair")
    public ResponseEntity<?> createUnexpectedRepairPlan(@RequestBody Map<String, Object> requestBody) {
        try {
            Integer year = Integer.parseInt(requestBody.get("year").toString());

            List<Map<String, Object>> detailMaps =
                    (List<Map<String, Object>>) requestBody.get("details");

            List<PlanDetail> details = new ArrayList<>();

            for (Map<String, Object> item : detailMaps) {
                String equipId = item.get("equipId").toString().trim();
                String conductor = item.get("conductor").toString().trim();
                Integer expectedTime = Integer.parseInt(item.get("expectedTime").toString());
                String note = item.get("note") == null ? "" : item.get("note").toString().trim();
                String scopeOfWork = item.get("scopeOfWork").toString().trim();

                details.add(new PlanDetail(equipId, conductor, expectedTime, note, scopeOfWork));
            }

            Plan createdPlan = planService.createUnexpectedRepairPlan(year, details);
            return new ResponseEntity<>(createdPlan, HttpStatus.CREATED);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    Map.of("message", "Không thể tạo kế hoạch sửa chữa đột xuất"),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}