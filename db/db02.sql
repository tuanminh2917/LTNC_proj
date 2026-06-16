-- Chèn dữ liệu vào bảng User
INSERT INTO User (username, password, official_name, role) VALUES 
('ld_cuc', '123', 'Lãnh đạo Cục', 'Lãnh đạo'),
('vp_cuc', '123', 'Văn phòng Cục', 'Văn phòng'),
('p_dk_thuoc', '123', 'Phòng Đăng ký thuốc', 'Đơn vị'),
('p_ql_gia', '123', 'Phòng Quản lý giá thuốc', 'Đơn vị'),
('p_ql_cl', '123', 'Phòng Quản lý chất lượng thuốc', 'Đơn vị'),
('p_ql_kd', '123', 'Phòng Quản lý kinh doanh dược', 'Đơn vị'),
('p_ql_mp', '123', 'Phòng Quản lý Mỹ phẩm', 'Đơn vị'),
('p_pc_hn', '123', 'Phòng Pháp chế - Hội nhập', 'Đơn vị'),
('tt_dt_ht', '123', 'Trung tâm Đào tạo và hỗ trợ Doanh nghiệp dược, mỹ phẩm', 'Đơn vị');

-- Chèn dữ liệu vào bảng Equipment
INSERT INTO Equipment (equip_id, equip_name, origin, date_of_receipt, user_id) VALUES 
('EQ-001', 'Máy sắc ký lỏng hiệu năng cao (HPLC)', 'Đức', '2023-01-15', 5),
('EQ-002', 'Máy đo độ hòa tan', 'Mỹ', '2023-05-20', 5),
('EQ-003', 'Máy vi tính chuyên dụng', 'Nhật Bản', '2024-02-10', 2);

-- Chèn dữ liệu vào bảng Plan
INSERT INTO Plan (type, status, created_date, year) VALUES  
('Bảo dưỡng, thay thế', 'Chờ phê duyệt', '2025-02-01', 2025),  
('Sửa chữa', 'Đã phê duyệt', '2025-06-05', 2025); 
-- ('Định kỳ', 'Chờ phê duyệt', '2025-02-02', 2025); -- Dòng này sẽ kích hoạt lỗi UNIQUE mong muốn

-- Chèn dữ liệu vào bảng Plan_Detail
INSERT INTO Plan_Detail (plan_id, equip_id, conductor, scope_of_work, expected_time, note) VALUES 
(1, 'EQ-001', 'Phòng Quản lý chất lượng thuốc', 'Thay thế tổng quan', 6, 'Bảo trì định kỳ hàng năm'),
(1, 'EQ-002', 'Công ty thiết bị y tế ABC', 'Thay thế, sửa chữa cảm biến', 5, 'Kiểm tra độ chính xác');

-- Chèn dữ liệu vào bảng Record_Detail
INSERT INTO Record_Detail (equip_id, conductor, scope_of_work, conduct_day) VALUES 
('EQ-001', 'Phòng Quản lý chất lượng thuốc', 'Thay thế cột sắc ký và vệ sinh hệ thống bơm mẫu.', '2025-12-10'),
('EQ-003', 'FPT Services', 'Cài đặt lại hệ điều hành và nâng cấp RAM lên 16GB.', '2026-01-05');