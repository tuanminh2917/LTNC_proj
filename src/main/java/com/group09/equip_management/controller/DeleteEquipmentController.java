package com.group09.equip_management.controller;

import com.group09.equip_management.entity.Equipment;
import com.group09.equip_management.service.DeleteEquipmentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/equipment")
public class DeleteEquipmentController {

    @Autowired
    private DeleteEquipmentService deleteEquipmentService;

    @DeleteMapping("/delete/{equipId}")
    public ResponseEntity<String> deleteEquipment(@PathVariable String equipId) {

        Optional<Equipment> equipmentOpt =
                deleteEquipmentService.findById(equipId);

        if (equipmentOpt.isEmpty()) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Khong tim thay thiet bi");
        }

        deleteEquipmentService.deleteEquipment(equipId);

        return ResponseEntity.ok("Xoa thiet bi thanh cong");
    }
}