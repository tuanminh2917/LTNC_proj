-- Tạo cơ sở dữ liệu
CREATE DATABASE IF NOT EXISTS DrugManagement;
USE DrugManagement;

-- 1. Bảng User (Phòng ban, đơn vị)
CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    official_name VARCHAR(255) NOT NULL,
    role ENUM('Lãnh đạo','Văn phòng', 'Đơn vị') NOT NULL
);

-- 2. Bảng Equipment (Thiết bị)
CREATE TABLE Equipment (
    equip_id VARCHAR(50) PRIMARY KEY,
    equip_name VARCHAR(255) NOT NULL,
    origin VARCHAR(100),
    date_of_receipt DATE,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE SET NULL
);

-- 3. Bảng Plan (Kế hoạch)
CREATE TABLE Plan (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('Bảo dưỡng, thay thế', 'Sửa chữa') NOT NULL,
    status ENUM('Chờ phê duyệt', 'Đã phê duyệt', 'Bị từ chối') NOT NULL,
    created_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    year INT NOT NULL,
    
    UNIQUE INDEX unique_approved_maintenance_year (
		(CASE WHEN type = 'Bảo dưỡng, thay thế' AND status = 'Đã phê duyệt' THEN year ELSE NULL END)
	)
);

-- 4. Bảng Plan_Detail (Chi tiết kế hoạch)
-- Bảng này sử dụng Composite Primary Key (plan_id, equip_id)
CREATE TABLE Plan_Detail (
    plan_id INT,
    equip_id VARCHAR(50),
    conductor VARCHAR(255) not null,
    expected_time INT NOT NULL check (expected_time BETWEEN 1 AND 12),
    scope_of_work TEXT not null,
    note TEXT,
    PRIMARY KEY (plan_id, equip_id),
    FOREIGN KEY (plan_id) REFERENCES Plan(plan_id) ON DELETE CASCADE,
    FOREIGN KEY (equip_id) REFERENCES Equipment(equip_id) ON DELETE CASCADE
);

-- 5. Bảng Record_Detail (Lịch sử sửa chữa, bảo dưỡng)
CREATE TABLE Record_Detail (
    rec_det_id INT AUTO_INCREMENT PRIMARY KEY,
    equip_id VARCHAR(50),
    conductor VARCHAR(255),
    scope_of_work TEXT, -- Nội dung sửa chữa dài
    conduct_day DATE,
    FOREIGN KEY (equip_id) REFERENCES Equipment(equip_id) ON DELETE CASCADE
);