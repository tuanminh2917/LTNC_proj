package com.group09.equip_management.repository;

import com.group09.equip_management.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, String> {

    // Dung nativeQuery = true de viet SQL thuan tuy dung voi ten cot trong Database cua ban
    @Query(value = "SELECT * FROM Equipment WHERE " +
           "(:id IS NULL OR :id = '' OR equip_id LIKE CONCAT('%', :id, '%')) AND " +
           "(:name IS NULL OR :name = '' OR equip_name LIKE CONCAT('%', :name, '%')) AND " +
           "(:origin IS NULL OR :origin = '' OR origin LIKE CONCAT('%', :origin, '%')) AND " +
           "(:rDate IS NULL OR date_of_receipt = :rDate)", 
           nativeQuery = true)
    List<Equipment> searchEquipment(@Param("id") String id, 
                                    @Param("name") String name, 
                                    @Param("origin") String origin, 
                                    @Param("rDate") LocalDate rDate);
}