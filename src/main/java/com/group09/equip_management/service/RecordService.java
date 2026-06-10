package com.group09.equip_management.service;

import com.group09.equip_management.entity.Record_Detail;
import com.group09.equip_management.repository.RecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

@Service
public class RecordService {

    @Autowired
    private RecordRepository recordRepository;

    public List<Record_Detail> getRecordsByEquipId(String equipId) {
        return recordRepository.findByEquipId(equipId);
    }

    public List<Record_Detail> getRecordsByConductor(String conductor) {
        return recordRepository.findByConductor(conductor);
    }

    public List<Record_Detail> getRecordsByScopeOfWork(String scopeOfWork) {
        return recordRepository.findByScopeOfWork(scopeOfWork);
    }

    public List<Record_Detail> getRecordsByConductDay(LocalDate conductDay) {
        return recordRepository.findByConductDay(conductDay);
    }
    // thêm hồ sơ mới cho một thiết bị
    @Transactional
    public boolean addRecordsByEquipId(String equipId, List<Record_Detail> recordList) {
        if (equipId == null || equipId.trim().isEmpty()) {
            return false;
        }

        if (recordList == null || recordList.isEmpty()) {
            return false;
        }

        for (Record_Detail record : recordList) {
            record.setRecDetId(null);
            record.setEquipId(equipId);
            recordRepository.save(record);
        }

        return true;
    }

    // Lưu hoặc cập nhật danh sách Record_Detail cho một thiết bị cụ thể
    @Transactional
    public boolean saveRecordByEquipId(String equipId, List<Record_Detail> recordList) {
        // 1. XÓA TRƯỚC: Lấy toàn bộ dữ liệu đang có dưới DB lên
        List<Record_Detail> dbRecords = recordRepository.findByEquipId(equipId);
        
        for (Record_Detail dbRecord : dbRecords) {
            // Kiểm tra xem bản ghi dưới DB còn nằm trong danh sách Front-end gửi lên không
            boolean stillExists = recordList.stream()
                    .anyMatch(record -> record.getRecDetId() != null && record.getRecDetId().equals(dbRecord.getRecDetId()));
            
            // Nếu Front-end đã xóa bỏ nó ra khỏi danh sách -> Xóa dưới DB
            if (!stillExists) {
                recordRepository.delete(dbRecord);
            }
        }

        // Cần flush một nhịp để DB thực thi lệnh xóa hoàn toàn trước khi xử lý dữ liệu mới
        recordRepository.flush(); 

        // 2. CẬP NHẬT & THÊM MỚI
        for (Record_Detail record : recordList) {
            if (record.getRecDetId() == null) {
                // Trường hợp THÊM MỚI: Chỉ xử lý khi Id là null
                record.setEquipId(equipId);
                recordRepository.save(record);
            } else {
                // Trường hợp CẬP NHẬT: Tìm bản ghi gốc để map dữ liệu qua
                Optional<Record_Detail> existingRecordOpt = recordRepository.findById(record.getRecDetId());
                if (existingRecordOpt.isPresent()) {
                    Record_Detail existingRecord = existingRecordOpt.get();
                    existingRecord.setConductor(record.getConductor());
                    existingRecord.setScopeOfWork(record.getScopeOfWork());
                    existingRecord.setConductDay(record.getConductDay());
                    // Không cần gọi .save() nữa vì nhờ @Transactional, 
                    // Hibernate tự động cập nhật khi đối tượng managed bị thay đổi dữ liệu (Dirty Checking)
                }
            }
        }

        return true;
    }
}
