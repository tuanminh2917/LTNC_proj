package com.group09.equip_management.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
public class WebController {

    // Dieu huong nguoi dung den trang cap nhat thiet bi
    @GetMapping("/EquipmentList/Update")
    public String getUpdatePage() {
        // Tra ve duong dan tuong doi tinh tu thu muc static/
        // Spring Boot se tu dong tim file static/updateEquip.html
        return "/updateEquip.html";
    }

    @GetMapping("/EquipmentList/Add")
    public String getAddPage() {
        return "/addEquip.html";
    }

    @GetMapping("/EquipmentList/Delete")
    public String getDeletePage() {
        return "/deleteEquip.html";
    }

    @GetMapping("/EquipmentRecord")
    public String getEquipRecordPage() {
        return "/equipRecord.html";
    }

    // Điều hướng trang đăng nhập
    @GetMapping("/Login")
    public String getLoginPage() {
        return "/login.html";
    }

    // Điều hướng trang dashboard
    @GetMapping("/Dashboard")
    public String getDashboardPage() {
        return "/dashboard.html";
    }

    // Điều hướng trang kế hoạch bảo dưỡng, thay thế
    @GetMapping("/AnnuallyPlan")
    public String getAnnuallyPlanPage() {
        return "/annually-plan.html";
    }

    // Điều hướng trang kế hoạch sửa chữa
    @GetMapping("/RepairPlan")
    public String getRepairPlanPage() {
        return "/repair-plan.html";
    }

    // Điều hướng trang phê duyệt kế hoạch
    @GetMapping("/ApprovingPlan")
    public String getApprovingPlanPage() {
        return "/approving.html";
    }

    // Điều hướng trang chủ (cũng là dashboard)
    @GetMapping("/")
    public String getHomePage() {
        return "/dashboard.html";
    }
}