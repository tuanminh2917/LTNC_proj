// I. Variables and Constants

// ==========================================
// KHAI BÁO BIẾN TOÀN CỤC CHỨA CẤU HÌNH ĐƠN VỊ
// ==========================================
let globalUserMapIdToName = {}; // Dùng cho renderSearchResults (ID -> Tên)
let globalUserMapNameToId = {}; // Dùng cho handleUpdate (Tên -> ID)

let globalUserList = [];

// II. Functions calls

loadUserMapping(); // Gọi hàm này ngay khi script được tải để đảm bảo dữ liệu sẵn sàng cho các hàm khác

document.getElementById("home-link").addEventListener("click", function() {
    window.location.href = "/Dashboard";
});

// Gọi hàm kiểm tra đăng nhập khi trang được tải
checkLogin();

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('addBtn').addEventListener('click', handleAddEquipment);
    document.getElementById('addBatch').addEventListener('click', handleImportEquipmentExcel);
    document.getElementById('resetBtn').addEventListener('click', clearForm);
    document.getElementById('reloadBtn').addEventListener('click', loadEquipmentList);

    // Kiểm tra mã người dùng
    const userId = document.getElementById('user_id').querySelector("span").textContent;
    const userRole = document.getElementById('user_role').querySelector("span").textContent;
    if (userRole !== "Lãnh đạo" && userRole !== "Văn phòng") {
        // Nếu không phải Lãnh đạo Cục hoặc Văn phòng Cục
        // Đặt giá trị mặc định cho dropdown
        document.getElementById('userOfficialName').value = userId === "1" ? "Lãnh đạo Cục" : "Văn phòng Cục";
    }

    loadEquipmentList();
});

// III. Functions definitions

// ==========================================
// HÀM BẤT ĐỒNG BỘ ĐỌC FILE JSON TỪ SERVER
// ==========================================
function loadUserMapping() {
    // fetch đến route: /api/users/all
    return fetch('/api/users/all')
        .then(response => {
            if (!response.ok) throw new Error('Không thể tải danh sách người dùng từ server');
        return response.json();
        })
        .then(users => {
            // Xử lý dữ liệu người dùng ở đây
            console.log("Danh sách người dùng:", users);
            // Đưa dữ liệu vào các biến toàn cục để sử dụng trong các hàm khác
            globalUserList = users;
            globalUserMapIdToName = {};
            globalUserMapNameToId = {};
            users.forEach(user => {
                globalUserMapIdToName[user.userId] = user.officialName || user.unit_name;
                globalUserMapNameToId[user.officialName || user.unit_name] = user.userId;
            });
        })
        .catch(error => {
            console.error("Lỗi khi tải danh sách người dùng:", error);
            alert("Không thể tải danh sách người dùng. Vui lòng làm mới trang.");
        });
};



// Kiểm tra trạng thái đăng nhập khi trang được tải
async function checkLogin() {
    try {
        const response = await fetch("/api/me", {
            method: "GET"
        });

        const data = await response.json();

        console.log("Dữ liệu người dùng:", data);

        if (!data.success) {
            window.location.href = "/Login";
            return;
        }
        
        document.getElementById("user_official_name").querySelector("span").textContent = data.user.officialName || data.user.unit_name;
        document.getElementById("user_id").querySelector("span").textContent = data.user.userId || data.user.unit_id;
        document.getElementById("user_role").querySelector("span").textContent = data.user.role || data.user.unit_role;

        // Trong checkLogin() sau khi nhận dữ liệu 'data'
        const loggedInUserId = data.user.userId || data.user.unit_id;
        const loggedInUserRole = data.user.role || data.user.unit_role;

        console.log(loggedInUserId);

        if (loggedInUserRole !== "Lãnh đạo" && loggedInUserRole !== "Văn phòng") {
            // Khóa select ở giá trị của đơn vị đang đăng nhập
            lockSelectElement('userOfficialName', loggedInUserId);
        }

        console.log(document.getElementById('userOfficialName').value);

    } catch (error) {
        console.error("Check login error:", error);
        messageElement.textContent = "Không thể kiểm tra trạng thái đăng nhập";

        setTimeout(() => {
            window.location.href = "/Login";
        }, 1000);
    }
}



async function loadEquipmentList() {
    const tableBody = document.getElementById('equipmentTableBody');

    tableBody.innerHTML = `
        <tr>
            <td colspan="5" class="empty-row">Đang tải dữ liệu...</td>
        </tr>
    `;

    try {
        const response = await fetch('/api/equipment/all');

        if (!response.ok) {
            throw new Error('Không thể tải danh sách thiết bị.');
        }

        const equipmentList = await response.json();
        renderEquipmentTable(equipmentList);
    } catch (error) {
        console.error('Lỗi tải danh sách thiết bị:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-row error-text">Không thể tải danh sách thiết bị.</td>
            </tr>
        `;
    }
}

function renderEquipmentTable(equipmentList) {
    const userMap = globalUserMapIdToName; // Sử dụng bản đồ đã tải bất đồng bộ từ file JSON
    const tableBody = document.getElementById('equipmentTableBody');
    tableBody.innerHTML = '';

    if (!equipmentList || equipmentList.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-row">Chưa có thiết bị nào trong hệ thống.</td>
            </tr>
        `;
        return;
    }

    equipmentList.forEach(equipment => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${equipment.equipId ?? ''}</td>
            <td>${equipment.equipName ?? ''}</td>
            <td>${equipment.origin ?? ''}</td>
            <td>${equipment.dateOfReceipt ?? ''}</td>
            <td>${userMap[equipment.userId] ?? ''}</td>
        `;

        tableBody.appendChild(row);
    });
}

async function handleAddEquipment() {
    const equipId = document.getElementById('equipId').value.trim();
    const equipName = document.getElementById('equipName').value.trim();
    const origin = document.getElementById('origin').value.trim();
    const dateOfReceipt = document.getElementById('dateOfReceipt').value;
    const userIdValue = document.getElementById('userOfficialName').value.trim();

    if (!equipId || !equipName || !origin || !dateOfReceipt || !userIdValue) {
        alert('Vui lòng nhập đầy đủ thông tin thiết bị.');
        return;
    }

    // if (isNaN(userIdValue)) {
    //     alert('Mã đơn vị phải là số.');
    //     return;
    // }

    const today = new Date();
    const inputDate = new Date(dateOfReceipt);

    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate > today) {
        alert('Ngày tiếp nhận không thể là ngày trong tương lai.');
        return;
    }

    const equipment = {
        equipId: equipId,
        equipName: equipName,
        origin: origin,
        dateOfReceipt: dateOfReceipt,
        userId: parseInt(userIdValue)
    };

    console.log(equipment);

    try {
        const response = await fetch('/api/equipment/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(equipment)
        });

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message);
        }

        alert('Thêm thiết bị thành công.');
        clearForm();
        loadEquipmentList();
    } catch (error) {
        console.error('Lỗi thêm thiết bị:', error);
        alert(error.message || 'Có lỗi xảy ra khi thêm thiết bị.');
    }
}

async function handleImportEquipmentExcel() {
    // Giả định bạn có một thẻ <input type="file" id="excelFileInput" accept=".xlsx, .xls"> trong HTML
    const fileInput = document.getElementById('excelFileInput'); 
    const file = fileInput ? fileInput.files[0] : null;

    if (!file) {
        alert('Vui lòng chọn file Excel trước khi thực hiện nhập dữ liệu.');
        return;
    }

    // Hàm bổ trợ đọc file Excel bằng FileReader dưới dạng Promise để dùng được async/await
    const readExcel = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (err) => reject(err);
        });
    };

    try {
        const arrayBuffer = await readExcel(file);
        const data = new Uint8Array(arrayBuffer);
        
        // Đọc dữ liệu từ file, sử dụng cellDates: true để SheetJS tự chuyển đổi cột ngày tháng sang Object Date
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Chuyển đổi sheet thành mảng các Object JSON dựa trên dòng tiêu đề (Header)
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
            alert('File Excel không có dữ liệu hoặc sai định dạng cấu trúc hàng.');
            return;
        }

        // --- 1. CHUẨN BỊ MAP CHUYỂN ĐỔI TÊN ĐƠN VỊ SANG ID (KHÔNG PHÂN BIỆT HOA THƯỜNG) ---
        const lowerCaseUserMap = {};
        if (typeof globalUserMapNameToId === 'object') {
            for (const key in globalUserMapNameToId) {
                // Chuyển hết key (tên đơn vị) về chữ thường để so sánh không phân biệt hoa thường
                lowerCaseUserMap[key.toLowerCase().trim()] = globalUserMapNameToId[key];
            }
        }

        // --- 2. LẤY THÔNG TIN VAI TRÒ HIỆN TẠI (ROLE) TỪ DOM ---
        const userRoleElement = document.getElementById('user_role');
        const userRoleSpan = userRoleElement ? userRoleElement.querySelector("span") : null;
        const currentRoleText = userRoleSpan ? userRoleSpan.textContent.trim() : "";
        const isVanPhong = currentRoleText === "Văn phòng";

        const validEquipments = []; // Mảng chứa danh sách thiết bị hợp lệ sẵn sàng gửi lên API
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // --- 3. TIẾN HÀNH KIỂM TRA (VALIDATE) TOÀN BỘ CÁC HÀNG TRONG FILE EXCEL ---
        for (let i = 0; i < jsonData.length; i++) {
            const row = jsonData[i];
            const rowNum = i + 2; // Số dòng thực tế trong file Excel (Tiêu đề là dòng 1, data tính từ dòng 2)

            // Lấy dữ liệu theo đúng tên 5 cột yêu cầu
            const equipId = row["Mã thiết bị"]?.toString().trim();
            const equipName = row["Tên thiết bị"]?.toString().trim();
            const origin = row["Nước sản xuất"]?.toString().trim();
            const dateOfReceiptRaw = row["Ngày tiếp nhận"];
            const unitName = row["Đơn vị"]?.toString().trim();

            // Ràng buộc: Tất cả các ô không được để trống
            if (!equipId || !equipName || !origin || !dateOfReceiptRaw || !unitName) {
                alert(`Dòng ${rowNum}: Vui lòng điền đầy đủ thông tin (Mã TB, Tên TB, Nước sản xuất, Ngày tiếp nhận, Đơn vị).`);
                return; // Ngừng toàn bộ tiến trình nếu có 1 hàng vi phạm
            }

            // Ràng buộc: Kiểm tra vai trò quản lý đơn vị
            if (!isVanPhong && unitName.toLowerCase() !== currentRoleText.toLowerCase()) {
                alert(`Dòng ${rowNum}: Đơn vị "${unitName}" không khớp với vai trò của bạn ("${currentRoleText}"). Bạn không có quyền thêm thiết bị cho đơn vị khác`);
                return; 
            }

            // Ràng buộc: Ánh xạ tên đơn vị sang mã đơn vị (ID) không phân biệt hoa thường
            const mappedUserId = lowerCaseUserMap[unitName.toLowerCase()];
            if (!mappedUserId) {
                alert(`Dòng ${rowNum}: Không tìm thấy mã đơn vị phù hợp cho tên: "${unitName}". Vui lòng kiểm tra lại chính tả.`);
                return;
            }

            // Ràng buộc: Kiểm tra định dạng ngày tiếp nhận và ngày trong tương lai
            let inputDate;
            if (dateOfReceiptRaw instanceof Date) {
                inputDate = new Date(dateOfReceiptRaw);
            } else {
                inputDate = new Date(dateOfReceiptRaw); // Fallback nếu dữ liệu là dạng chuỗi string
            }

            if (isNaN(inputDate.getTime())) {
                alert(`Dòng ${rowNum}: Ngày tiếp nhận không đúng định dạng ngày tháng.`);
                return;
            }

            inputDate.setHours(0, 0, 0, 0);
            if (inputDate > today) {
                alert(`Dòng ${rowNum}: Ngày tiếp nhận không thể là ngày trong tương lai.`);
                return;
            }

            // Chuẩn hóa ngày về dạng chuỗi YYYY-MM-DD để gửi lên API cho đồng bộ dữ liệu cũ
            const year = inputDate.getFullYear();
            const month = String(inputDate.getMonth() + 1).padStart(2, '0');
            const day = String(inputDate.getDate()).padStart(2, '0');
            const dateOfReceiptStr = `${year}-${month}-${day}`;

            // Đưa dữ liệu đã sạch (Clean Data) vào hàng đợi chuẩn bị gửi
            validEquipments.push({
                equipId: equipId,
                equipName: equipName,
                origin: origin,
                dateOfReceipt: dateOfReceiptStr,
                userId: parseInt(mappedUserId)
            });
        }

        // --- 4. GỌI ENDPOINT API ĐỂ THÊM VÀO CƠ SỞ DỮ LIỆU ---
        // Đoạn này chỉ chạy khi toàn bộ các hàng phía trên đã vượt qua bộ lọc validate thành công
        try {
            const response = await fetch('/api/equipment/add-batch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(validEquipments) // Gửi thẳng mảng dữ liệu lên
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message);
            }

            alert(`Nhập dữ liệu thành công! Đã thêm tổng cộng ${validEquipments.length} thiết bị từ file Excel.`);
            
            if (fileInput) fileInput.value = '';
            if (typeof loadEquipmentList === 'function') {
                loadEquipmentList();
            }
        } catch (error) {
            console.error('Lỗi khi lưu danh sách vào DB:', error);
            alert(`Có lỗi xảy ra khi lưu vào hệ thống: ${error.message}`);
        }

    } catch (error) {
        console.error('Lỗi quá trình import Excel:', error);
        alert(error.message || 'Có lỗi xảy ra trong quá trình xử lý file Excel.');
    }
}

function lockSelectElement(elementId, valueToLock) {
    const el = document.getElementById(elementId);
    if (!el) return;

    // 1. Gán giá trị bạn muốn cố định
    el.value = valueToLock;

    // 2. Chặn tương tác thay đổi giá trị
    // Lưu lại vị trí đang chọn khi người dùng click vào
    el.onfocus = function() { 
        this.defaultIndex = this.selectedIndex; 
    };
    // Nếu người dùng cố tình chọn cái khác, lập tức trả về vị trí cũ
    el.onchange = function() { 
        this.selectedIndex = this.defaultIndex; 
    };
    
    // 3. Thay đổi giao diện để người dùng biết là không sửa được
    el.style.backgroundColor = "#e9ecef"; // Màu xám nhạt (giống readonly)
    el.style.cursor = "not-allowed";      // Biểu tượng chuột cấm
}

function clearForm() {
    document.getElementById('equipId').value = '';
    document.getElementById('equipName').value = '';
    document.getElementById('origin').value = '';
    document.getElementById('dateOfReceipt').value = '';
    document.getElementById('userOfficialName').value = '';
}