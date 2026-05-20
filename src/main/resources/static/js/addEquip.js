// ==========================================
// 1. KHAI BÁO BIẾN TOÀN CỤC CHỨA CẤU HÌNH ĐƠN VỊ
// ==========================================
let globalUnitMapIdToName = {}; // Dùng cho renderSearchResults (ID -> Tên)
let globalUnitMapNameToId = {}; // Dùng cho handleUpdate (Tên -> ID)

// ==========================================
// 2. HÀM BẤT ĐỒNG BỘ ĐỌC FILE JSON TỪ SERVER
// ==========================================
function loadUnitMapping() {
    // Gọi fetch bất đồng bộ tới file json đặt tại Front-end
    return fetch('/userMapping.json')
        .then(response => {
            if (!response.ok) throw new Error('Không thể tải file userMapping.json');
            return response.json();
        })
        .then(jsonData => {
            // json của bạn là một mảng gồm 2 object giống nhau, ta lấy object đầu tiên [0]
            globalUnitMapIdToName = jsonData[0]; 
            
            // Tự động tạo bản đồ đảo ngược (Tên -> ID) để phục vụ hàm handleUpdate
            globalUnitMapNameToId = {};
            for (const [key, value] of Object.entries(globalUnitMapIdToName)) {
                globalUnitMapNameToId[value] = key; 
            }
            console.log("Đã tải xong cấu hình đơn vị bất đồng bộ!");
        })
        .catch(error => {
            console.error("Lỗi cấu hình hệ thống:", error);
            alert("Không thể tải danh sách đơn vị. Vui lòng làm mới trang.");
        });
}

loadUnitMapping(); // Gọi hàm này ngay khi script được tải để đảm bảo dữ liệu sẵn sàng cho các hàm khác

document.getElementById("home-link").addEventListener("click", function() {
    window.location.href = "/Dashboard";
});

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
        
        document.getElementById("unit_name").querySelector("span").textContent = data.user.officialName || data.user.unit_name;
        document.getElementById("unit_id").querySelector("span").textContent = data.user.userId || data.user.unit_id;

        // Trong checkLogin() sau khi nhận dữ liệu 'data'
        const loggedInUnitId = data.user.userId || data.user.unit_id;

        if (loggedInUnitId != 1 && loggedInUnitId != 2) {
            // Khóa select ở giá trị của đơn vị đang đăng nhập
            lockSelectElement('userOfficialName', loggedInUnitId);
        }

    } catch (error) {
        console.error("Check login error:", error);
        messageElement.textContent = "Không thể kiểm tra trạng thái đăng nhập";

        setTimeout(() => {
            window.location.href = "/Login";
        }, 1000);
    }
}

// Gọi hàm kiểm tra đăng nhập khi trang được tải
checkLogin();

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('addBtn').addEventListener('click', handleAddEquipment);
    document.getElementById('resetBtn').addEventListener('click', clearForm);
    document.getElementById('reloadBtn').addEventListener('click', loadEquipmentList);

    // Kiểm tra mã đơn vị
    const userId = document.getElementById('unit_id').querySelector("span").textContent;
    if (userId !== "1" && userId !== "2") { 
        // Nếu không phải Lãnh đạo Cục hoặc Văn phòng Cục
        // Đặt giá trị mặc định cho dropdown
        document.getElementById('userOfficialName').value = userId === "1" ? "Lãnh đạo Cục" : "Văn phòng Cục";
    }

    loadEquipmentList();
});

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
    const unitMap = globalUnitMapIdToName; // Sử dụng bản đồ đã tải bất đồng bộ từ file JSON
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
            <td>${unitMap[equipment.userId] ?? ''}</td>
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