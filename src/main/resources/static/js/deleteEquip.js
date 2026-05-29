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

let currentEquipId = null;

document.getElementById('searchBtn').addEventListener('click', handleSearch);

document.getElementById('deleteBtn').addEventListener('click', handleDelete);

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

    } catch (error) {
        console.error("Check login error:", error);
        messageElement.textContent = "Không thể kiểm tra trạng thái đăng nhập";

        setTimeout(() => {
            window.location.href = "/Login";
        }, 1000);
    }
}

function handleSearch() {

    const equipId = document.getElementById('equipId').value.trim();

    if (!equipId) {

        alert('Vui lòng nhập mã thiết bị.');

        return;
    }

    fetch(`/api/equipment/check/${equipId}`)

    .then(response => {

        if (response.status === 404) {

            throw new Error('Không tìm thấy thiết bị.');
        }

        if (!response.ok) {

            throw new Error('Lỗi tìm kiếm thiết bị.');
        }

        return response.json();
    })

    .then(data => {

        currentEquipId = data.equipId;

        renderEquipment(data);
    })

    .catch(error => {

        alert(error.message);
    });
}

function renderEquipment(item) {

    const unitMap = globalUserMapIdToName; // Sử dụng bản đồ đã tải bất đồng bộ từ file JSON

    const tbody = document.getElementById('resultBody');

    tbody.innerHTML = '';

    const row = tbody.insertRow();

    row.insertCell(0).textContent = item.equipId || '';
    row.insertCell(1).textContent = item.equipName || '';
    row.insertCell(2).textContent = item.origin || '';
    row.insertCell(3).textContent = item.dateOfReceipt || '';
    row.insertCell(4).textContent = unitMap[item.userId] || '';
}

async function handleDelete() {
    // 1. Kiểm tra ID thiết bị
    if (!currentEquipId) {
        alert('Vui lòng tìm thiết bị trước.');
        return;
    }

    try {
        // 2. Kiểm tra quyền xóa (Dùng await để lấy kết quả trực tiếp)
        const canDelete = await isDeletable(currentEquipId);

        // Nếu canDelete là false (đã hiện alert bên trong isDeletable), thoát hàm ngay lập tức
        if (!canDelete) {
            return; 
        }

        // 3. Nếu quyền hợp lệ mới hỏi xác nhận
        const confirmDelete = confirm(
            `Bạn có chắc muốn xóa thiết bị '${currentEquipId}' không?`
        );

        if (!confirmDelete) {
            return;
        }

        // 4. Thực hiện lệnh xóa
        const response = await fetch(`/api/equipment/delete/${currentEquipId}`, {
            method: 'DELETE'
        });

        const message = await response.text();

        if (!response.ok) {
            throw new Error(message);
        }

        // 5. Xử lý sau khi xóa thành công
        alert(message);
        document.getElementById('resultBody').innerHTML = '';
        document.getElementById('equipId').value = '';
        currentEquipId = null;

    } catch (error) {
        console.error('Lỗi khi xóa:', error);
        alert(error.message);
    }
}

async function isDeletable(equipId) {
    let loggedInUserId = document.getElementById("user_id").querySelector("span").textContent.trim();
    let loggedInUserRole = document.getElementById("user_role").querySelector("span").textContent.trim();
    try {
        const response = await fetch(`/api/equipment/check/${equipId}`);
        if (response.status === 404) {
            alert(`Thiết bị với mã ${equipId} không tồn tại. Vui lòng kiểm tra lại mã thiết bị!`);
            return false; // Thiết bị không tồn tại, không thể xóa
        }
        if (!response.ok) {
            throw new Error('Lỗi khi kiểm tra thiết bị');
        }
        // kiểm tra userId của thiết bị trả về có khớp với người dùng đang đăng nhập không
        const data = await response.json();
        console.log('Dữ liệu thiết bị kiểm tra:', data);
        if (loggedInUserRole === "Lãnh đạo" || loggedInUserRole === "Văn phòng") {
            // Nếu người dùng có toàn quyền câp nhật
            console.log("Người dùng có toàn quyền xóa");
            return true; // Cho phép xóa
        }
        if (data.userId === Number(loggedInUserId)) {
            console.log("Người dùng có quyền xóa thiết bị này");
            return true; // Cho phép xóa
        }
        else {
            alert(`Bạn không có quyền xóa thiết bị này vì nó thuộc đơn vị khác!`);
            return false; // Không cho phép xóa
        }
    } catch (error) {
        console.error('Lỗi khi kiểm tra thiết bị:', error);
        return false; // Trong trường hợp lỗi, giả định không thể xóa để an toàn
    }
}