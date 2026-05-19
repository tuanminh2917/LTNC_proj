package com.group09.equip_management.service;

import com.group09.equip_management.entity.Equipment;
import com.group09.equip_management.repository.EquipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class EquipmentService {

    @Autowired
    private EquipmentRepository equipmentRepository;

    // Ham tim kiem thiet bi theo ID an toan bang Optional
    public Optional<Equipment> findById(String equipId) {
        return equipmentRepository.findById(equipId);
    }

    // Ham lay tat ca thiet bi
    public List<Equipment> getAllEquipment() {
        return equipmentRepository.findAll();
    }

    public List<Equipment> search(Equipment criteria) {
        // Kiem tra neu tat ca cac truong tim kiem deu bo trong
        if ((criteria.getEquipId() == null || criteria.getEquipId().isEmpty()) &&
            (criteria.getEquipName() == null || criteria.getEquipName().isEmpty()) &&
            (criteria.getOrigin() == null || criteria.getOrigin().isEmpty()) &&
            (criteria.getDateOfReceipt() == null) &&
            (criteria.getUserId() == null)){

            return equipmentRepository.findAll();
        }

        // Goi ham tim kiem linh hoat tu Repository
        return equipmentRepository.searchEquipment(
            criteria.getEquipId(),
            criteria.getEquipName(),
            criteria.getOrigin(),
            criteria.getDateOfReceipt(),
            criteria.getUserId()
        );
    }

    @Transactional
    public void updateAll(List<Equipment> updateList) {
        for (Equipment equipment : updateList) {
            // Vi equipId truyen len la String ID da ton tai trong he thong
            // Nen ham save() se tu dong thuc hien lenh UPDATE chu khong INSERT moi
            equipmentRepository.save(equipment);
        }
    }

    @Transactional
    public Equipment addEquipment(Equipment equipment) {
        if (equipment.getEquipId() == null || equipment.getEquipId().trim().isEmpty()) {
            throw new RuntimeException("Mã thiết bị không được để trống.");
        }

        if (equipment.getEquipName() == null || equipment.getEquipName().trim().isEmpty()) {
            throw new RuntimeException("Tên thiết bị không được để trống.");
        }

        if (equipment.getOrigin() == null || equipment.getOrigin().trim().isEmpty()) {
            throw new RuntimeException("Nước sản xuất không được để trống.");
        }

        if (equipment.getDateOfReceipt() == null) {
            throw new RuntimeException("Ngày tiếp nhận không được để trống.");
        }

        if (equipment.getUserId() == null) {
            throw new RuntimeException("Mã đơn vị không được để trống.");
        }

        if (equipmentRepository.existsById(equipment.getEquipId())) {
            throw new RuntimeException("Mã thiết bị đã tồn tại trong hệ thống.");
        }

        return equipmentRepository.save(equipment);
    }

    @Transactional
    public void deleteEquipment(String equipId) {

        equipmentRepository.deleteById(equipId);
    }
}