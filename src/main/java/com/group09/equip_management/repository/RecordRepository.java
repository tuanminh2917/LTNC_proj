package com.group09.equip_management.repository;

import com.group09.equip_management.entity.Record_Detail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface RecordRepository extends JpaRepository<Record_Detail, Long> {
    List<Record_Detail> findByEquipId(String equipId);

    List<Record_Detail> findByConductor(String conductor);

    List<Record_Detail> findByScopeOfWork(String scopeOfWork);

    List<Record_Detail> findByConductDay(LocalDate conductDay);
}
