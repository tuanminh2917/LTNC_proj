package com.group09.equip_management.controller;

import com.group09.equip_management.entity.Record_Detail;
import com.group09.equip_management.service.RecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/records")
public class RecordController {

    @Autowired
    private RecordService recordService;

    @GetMapping("/equip/{equipId}")
    public ResponseEntity<List<Record_Detail>> getRecordsByEquipId(@PathVariable String equipId) {
        List<Record_Detail> records = recordService.getRecordsByEquipId(equipId);
        return new ResponseEntity<>(records, HttpStatus.OK);
    }

    @GetMapping("/conductor/{conductor}")
    public ResponseEntity<List<Record_Detail>> getRecordsByConductor(@PathVariable String conductor) {
        List<Record_Detail> records = recordService.getRecordsByConductor(conductor);
        return new ResponseEntity<>(records, HttpStatus.OK);
    }

    @GetMapping("/scope/{scopeOfWork}")
    public ResponseEntity<List<Record_Detail>> getRecordsByScopeOfWork(@PathVariable String scopeOfWork) {
        List<Record_Detail> records = recordService.getRecordsByScopeOfWork(scopeOfWork);
        return new ResponseEntity<>(records, HttpStatus.OK);
    }

    @GetMapping("/day/{conductDay}")
    public ResponseEntity<List<Record_Detail>> getRecordsByConductDay(@PathVariable String conductDay) {
        // Note: You might need to convert the string to LocalDate based on your date format
        // This is a simplified example
        List<Record_Detail> records = recordService.getRecordsByConductDay(LocalDate.parse(conductDay));
        return new ResponseEntity<>(records, HttpStatus.OK);
    }

    @PostMapping("/add/{equipId}")
    public ResponseEntity<Boolean> addRecords(@PathVariable String equipId, @RequestBody List<Record_Detail> recordList) {
        boolean isAdded = recordService.addRecordsByEquipId(equipId, recordList);
        return new ResponseEntity<>(isAdded, HttpStatus.CREATED);
    }

    @PostMapping("/save/{equipId}")
    public ResponseEntity<Boolean> saveRecord(@PathVariable String equipId, @RequestBody List<Record_Detail> recordList) {
        boolean isSaved = recordService.saveRecordByEquipId(equipId, recordList);
        return new ResponseEntity<>(isSaved, HttpStatus.CREATED);
    }
}
