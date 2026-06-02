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

    // Lưu hoặc cập nhật danh sách Record_Detail cho một thiết bị cụ thể
    @Transactional
    public boolean saveRecordByEquipId(String equipId, List<Record_Detail> recordList) {
        // Thêm mới những bản ghi mà rec_dec_id là null (tức là chưa tồn tại trong DB)
        for (Record_Detail record : recordList) {
            if (record.getRecDetId() == null) {
                record.setEquipId(equipId); // Đảm bảo gán equipId cho bản ghi mới
                recordRepository.save(record);
            }
        }

        // Cập nhật những bản ghi đã tồn tại (có rec_dec_id khác null)
        for (Record_Detail record : recordList) {
            if (record.getRecDetId() != null) {
                Optional<Record_Detail> existingRecordOpt = recordRepository.findById(record.getRecDetId());
                if (existingRecordOpt.isPresent()) {
                    Record_Detail existingRecord = existingRecordOpt.get();
                    existingRecord.setConductor(record.getConductor());
                    existingRecord.setScopeOfWork(record.getScopeOfWork());
                    existingRecord.setConductDay(record.getConductDay());
                    recordRepository.save(existingRecord);
                }
            }
        }

        // Xóa những bản ghi tồn tại trong cơ sở dữ liệu nhưng không có trong danh sách mới (tức là đã bị xóa)
        List<Record_Detail> existingRecords = recordRepository.findByEquipId(equipId);
        for (Record_Detail existingRecord : existingRecords) {
            boolean existsInNewList = recordList.stream()
                    .anyMatch(record -> record.getRecDetId() != null && record.getRecDetId().equals(existingRecord.getRecDetId()));
            if (!existsInNewList) {
                recordRepository.delete(existingRecord);
            }
        }
        
        // Trả về kết quả thành công sau khi đã xử lý xong tất cả các bản ghi
        return true;
    }
}
