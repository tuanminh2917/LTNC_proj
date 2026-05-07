#  Hướng Dẫn Phát Triển Dự Án (Dành cho Developer)

Tài liệu này quy định các tiêu chuẩn về cấu trúc mã nguồn, quy trình làm việc với Git và các lưu ý kỹ thuật để đảm bảo tính nhất quán giữa các thành viên trong nhóm.

---

##  1. Tổ Chức Mã Nguồn (Project Structure)

Dự án tuân thủ cấu trúc chuẩn của **Maven** và **Spring Boot**. Việc nắm rõ vị trí lưu trữ file giúp tránh việc đặt sai chỗ gây lỗi biên dịch.

###  Cấu trúc thư mục tổng quát
```text
EQUIP-MANAGEMENT/
├── src/
│   ├── main/
│   │   ├── java/com/group09/equip_management/  <-- [BACK-END]
│   │   │   ├── EquipManagementApplication.java # File khởi chạy chính
│   │   │   ├── controller/      # Tiếp nhận Request API
│   │   │   ├── service/         # Xử lý logic nghiệp vụ
│   │   │   ├── repository/      # Tương tác Database
│   │   │   └── entity/          # Khai báo cấu trúc dữ liệu
│   │   └── resources/
│   │       ├── static/          <-- [FRONT-END STATIC]
│   │       │   ├── css/         # Các file .css
│   │       │   ├── js/          # Các file .js (front-end script)
│   │       │   ├── images/      # Hình ảnh, icon...
│   │       │   └── index.html     # Các file giao diện tĩnh
│   │       └── application.properties # Cấu hình Server chung
└── pom.xml                      # Quản lý thư viện (Dependencies)
└── README-dev.md                               # Tài liệu hướng dẫn này
```

### Quy định về Front-end
**Không để chung:** Tuyệt đối không viết CSS hoặc JS trực tiếp vào file HTML (internal/inline style).

#### Tách biệt:

HTML lưu tại gốc thư mục `/static/`.

CSS phải nằm trong `/static/css/`.

JS phải nằm trong `/static/js/`.

Đường dẫn: Khi gọi file trong HTML, sử dụng đường dẫn tương đối, ví dụ: `<link rel="stylesheet" href="/css/styles.css">`.

### Quy định về Back-end
Để mã nguồn dễ bảo trì, mọi thành viên phải tuân thủ kiến trúc đa tầng:

#### Phân lớp rõ rệt:

`Controller`: Chỉ làm nhiệm vụ tiếp nhận Request và trả về Response. Tuyệt đối không viết logic tính toán tại đây.

`Service`: Nơi tập trung toàn bộ logic nghiệp vụ (tính toán, kiểm tra điều kiện).

`Repository`: Chỉ chứa các hàm truy vấn dữ liệu.

`Entity`: Khai báo cấu trúc bảng/đối tượng.

#### Quy tắc đặt tên:

**Tên Class:** Dùng PascalCase (ví dụ: UserController).

**Hậu tố Class:** Phải phản ánh đúng lớp của nó (ví dụ: UserService, UserRepository).

**Tên biến/hàm:** Dùng camelCase (ví dụ: getUserById).


## 2. Quy Trình Sử Dụng Git & GitHub
Để tránh xung đột (conflict) và mất mã nguồn, mọi thành viên phải tuân thủ quy trình nhánh (branching strategy).

###  Quy tắc nhánh trên máy cục bộ (Local)
Mỗi thành viên cần duy trì **tối thiểu 2 nhánh**:

**Nhánh `main` (hoặc `master`):** Chỉ dùng để cập nhật mã nguồn mới nhất từ nhóm về. Không trực tiếp code trên nhánh này.

**Nhánh riêng (ví dụ: `dev-name` hoặc `feature-abc`):** Nhánh để bạn làm việc cá nhân.

### Quy trình cập nhật mã nguồn hàng ngày
Khi bạn muốn bắt đầu làm việc hoặc cập nhật code của đồng đội:

- Chuyển sang nhánh chính: `git checkout main`

- Lấy code mới nhất về: `git pull origin main`

- Chuyển về nhánh cá nhân: `git checkout dev-yourname`

- Gộp code mới từ main vào nhánh cá nhân: `git merge main`

### 👨‍✈️ Vai trò nhóm trưởng (Maintainer)
Nhóm trưởng chịu trách nhiệm gộp code của thành viên vào nhánh chính:

- Thành viên đẩy nhánh cá nhân lên GitHub: `git push origin dev-yourname`.

- Nhóm trưởng kiểm tra code thông qua **Pull Request (PR)** trên giao diện GitHub.

- Nếu ổn, nhóm trưởng nhấn **Merge Pull Request** để gộp vào main.

### ⚠️ Xử lý xung đột (Conflict)
Xung đột xảy ra khi 2 người cùng sửa 1 dòng code.

Dấu hiệu: Khi `git merge`, Terminal báo `"CONFLICT"`.

**Cách xử lý:** 
1. Mở file bị lỗi trên VS Code.
2. VS Code sẽ hiện 3 lựa chọn: _Accept Current Change_ (giữ của bạn), _Accept Incoming Change_ (lấy của bạn kia), hoặc _Accept Both_.
3. Sau khi sửa xong, thực hiện: `git add .` -> `git commit -m "Fix conflict"` -> `git push`.

## 🛠 3. Các Lưu Ý Kỹ Thuật Khác
### ☕ Phiên bản Java (JDK)
Dự án thống nhất sử dụng **JDK 21 LTS**.

Kiểm tra trong `pom.xml`:  `<java.version>21</java.version>`.

Trước khi chạy, dùng lệnh `./mvnw clean` để xóa các file rác cũ.