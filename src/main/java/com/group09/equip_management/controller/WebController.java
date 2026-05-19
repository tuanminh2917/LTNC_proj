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
    
}