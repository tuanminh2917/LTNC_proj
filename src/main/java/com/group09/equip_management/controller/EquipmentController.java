package com.group09.equip_management.controller;

import com.group09.equip_management.entity.Equipment;
import com.group09.equip_management.service.EquipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    @Autowired
    private EquipmentService equipmentService;

    // Tiep nhan tieu chi tim kiem va map truc tiep vao object Equipment
    @PostMapping("/search")
    public ResponseEntity<List<Equipment>> searchEquipment(@RequestBody Equipment criteria) {
        // System.out.println("Received search criteria: " + criteria);
        List<Equipment> results = equipmentService.search(criteria);
        return ResponseEntity.ok(results);
    }

    // Tiep nhan mang JSON tu handleUpdate() va map thanh List<Equipment>
    @PostMapping("/update")
    public ResponseEntity<String> updateEquipmentList(@RequestBody List<Equipment> updateList) {
        equipmentService.updateAll(updateList);
        return ResponseEntity.ok("Cap nhat danh sach thanh cong!");
    }

    // API kiem tra nhanh su ton tai cua thiet bi bang ID
    @GetMapping("/check/{equipId}")
    public ResponseEntity<?> checkEquipmentExists(@PathVariable String equipId) {
        Optional<Equipment> equipmentOpt = equipmentService.findById(equipId);
        
        if (equipmentOpt.isEmpty()) {
            // Tra ve 404 dung theo mong doi cua khoi JavaScript fetch
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
        // Tra ve 200 OK kem theo thong tin thiet bi duoi dang JSON
        return ResponseEntity.ok(equipmentOpt.get());
    }

    @PostMapping("/add")
    public ResponseEntity<?> addEquipment(@RequestBody Equipment equipment) {
        try {
            Equipment savedEquipment = equipmentService.addEquipment(equipment);
            return ResponseEntity.ok(savedEquipment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Equipment>> getAllEquipment() {
        return ResponseEntity.ok(equipmentService.getAllEquipment());
    }
    }

