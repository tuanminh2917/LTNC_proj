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

        if (loggedInUserRole !== "Lãnh đạo" && loggedInUserRole !== "Văn phòng") {
            // Khóa select ở giá trị của đơn vị đang đăng nhập
            lockSelectElement('userOfficialName', loggedInUserId);
        }

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