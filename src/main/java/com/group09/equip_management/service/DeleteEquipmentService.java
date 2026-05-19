package com.group09.equip_management.service;

import com.group09.equip_management.entity.Equipment;
import com.group09.equip_management.repository.EquipmentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class DeleteEquipmentService {

    @Autowired
    private EquipmentRepository equipmentRepository;

    public Optional<Equipment> findById(String equipId) {

        return equipmentRepository.findById(equipId);
    }

    @Transactional
    public void deleteEquipment(String equipId) {

        equipmentRepository.deleteById(equipId);
    }
}