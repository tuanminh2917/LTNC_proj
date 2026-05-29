// I. Variables and Constants
// // ==========================================
// // KHAI BÁO BIẾN TOÀN CỤC CHỨA CẤU HÌNH NGƯỜI DÙNG
// // ==========================================
let globalUserMapIdToName = {}; // Dùng cho renderSearchResults (ID -> Tên)
let globalUserMapNameToId = {}; // Dùng cho handleUpdate (Tên -> ID)

let globalUserList = []; // Dùng để lưu danh sách người dùng lấy từ server, phục vụ cho cả renderSearchResults và handleUpdate

// II. Functions calls

document.getElementById("home-link").addEventListener("click", function() {
    window.location.href = "/Dashboard";
});

// Gọi hàm kiểm tra đăng nhập khi trang được tải
checkLogin();

// Initialize: Clear table bodies and add event listener for delete buttons
document.addEventListener('DOMContentLoaded', function() {
    // GỌI HÀM BẤT ĐỒNG BỘ TẠI ĐÂY
    loadUserMapping();

    // Clear search results table
    const searchTableBody = document.querySelector('#search-section table tbody');
    searchTableBody.innerHTML = '<tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr>';

    // Clear update list table
    const updateTableBody = document.querySelector('#update-section table tbody');
    updateTableBody.innerHTML = '';

    // Add event listener for delete buttons in the update table
    document.querySelector('#update-section table tbody').addEventListener('click', deleteRow);
});

document.getElementById('searchBtn').addEventListener('click', function() {
    // Handle search functionality
    handleSearch();
});

// Add event listener for the "Add to Update List" button
document.querySelector('.btn.btn-update-list').addEventListener('click', function() {
    addToUpdateList();
});

document.getElementById('updateBtn').addEventListener('click', function() {
    // Handle update functionality
    handleUpdate();
});

// III. Functions definitions

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
        const loggedInUserRole = data.user.role || data.user.unit_role;
        const loggedInUserId = data.user.userId || data.user.unit_id;

        if (loggedInUserRole !== "Lãnh đạo" && loggedInUserRole !== "Văn phòng") {
            // Khóa select ở giá trị của đơn vị đang đăng nhập
            lockSelectElement('userOfficialName-update', loggedInUserId);
        }

    } catch (error) {
        console.error("Check login error:", error);
        alert("Không thể kiểm tra trạng thái đăng nhập");

        setTimeout(() => {
            window.location.href = "/Login";
        }, 1000);
    }
}



function handleSearch() {
    // 1. Lấy giá trị từ các ô input thông qua Selector chính xác hơn
    // Sử dụng ID của container cha (giả sử là #search-section) để tránh lấy nhầm input ở phần khác
    const container = document.querySelector('#search-section .input-group-container');
    
    const idValue = container.querySelector('.input-row:nth-child(1) input').value.trim();
    const nameValue = container.querySelector('.input-row:nth-child(2) input').value.trim();
    const countryValue = container.querySelector('.input-row:nth-child(3) input').value.trim();
    let dateValue = container.querySelector('.input-row:nth-child(4) input').value;
    
    // Lấy giá trị từ thẻ select (Đơn vị)
    const userSelect = container.querySelector('select');
    let userIdValue = parseInt(userSelect.value); 
    if (isNaN(userIdValue)) userIdValue=null;

    // 2. Xử lý logic ngày tháng
    if (!dateValue) {
        dateValue = null; 
    } else {
        const today = new Date();
        const inputDate = new Date(dateValue);
        if (isNaN(inputDate.getTime())) {
            alert('Ngày tiếp nhận không hợp lệ.');
            return;
        }
        if (inputDate > today) {
            alert('Ngày tiếp nhận không thể là ngày trong tương lai.');
            return;
        }
    }

    // 3. Chuẩn bị object gửi đi (Mapping chính xác với Entity Equipment.java)
    // Lưu ý: userId trong DB của bạn đang dùng String (VARCHAR) nên không cần parseInt
    const searchCriteria = {
        equipId: idValue || null,       
        equipName: nameValue || null,   
        origin: countryValue || null,   
        dateOfReceipt: dateValue,       
        userId: userIdValue             // Lấy value (1, 2, 3...) từ <option>
    };

    console.log('Dữ liệu tìm kiếm:', searchCriteria);

    // 4. Gửi Request đến Backend
    fetch('/api/equipment/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchCriteria)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        console.log('Kết quả:', data);
        // Kiểm tra nếu có hàm render thì mới gọi
        if (typeof renderSearchResults === "function") {
            renderSearchResults(data);
        } else {
            console.warn("Chưa định nghĩa hàm renderSearchResults để hiển thị dữ liệu.");
        }
    })
    .catch(error => {
        console.error('Lỗi:', error.message);
        alert('Lỗi tìm kiếm: ' + error.message);
    });
}

// Ham ho tro do du lieu vao bang tim kiem de ban kiem tra luon gieo dien
function renderSearchResults(equipments) {
    const tbody = document.querySelector('#search-section table tbody');
    tbody.innerHTML = ''; // Xóa các hàng trống hiện tại

    // 1. Tạo bản đồ mapping giữa ID và Tên đơn vị dựa trên HTML của bạn
    const userMap = globalUserMapIdToName; // Sử dụng biến toàn cục đã tải từ JSON;

    if (equipments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Không tìm thấy thiết bị nào</td></tr>';
        return;
    }

    equipments.forEach(item => {
        const row = tbody.insertRow();
        
        // Hiển thị các thông tin cơ bản
        row.insertCell(0).textContent = item.equipId || '';
        row.insertCell(1).textContent = item.equipName || '';
        row.insertCell(2).textContent = item.origin || '';
        row.insertCell(3).textContent = item.dateOfReceipt || '';

        // 2. Thay đổi: Lấy tên người dùng từ userMap dựa trên item.userId
        // Nếu không tìm thấy tên tương ứng, sẽ hiển thị lại mã ID gốc hoặc để trống
        const userOfficialName = userMap[item.userId] || item.userId || 'Chưa xác định';
        row.insertCell(4).textContent = userOfficialName;
    });
}

function handleUpdate() {
    const userMap = globalUserMapNameToId; // Sử dụng biến toàn cục đã tạo bản đồ đảo ngược (Tên -> ID)
    // Implement update logic here
    // Wrap all rows in the update table into an array of objects and log it to console
    const tableRows = document.querySelectorAll('#update-section table tbody tr');
    const updateList = [];
    tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length === 6) { // Ensure the row has the expected number of cells
            const equipId = cells[0].textContent.trim();
            const name = cells[1].textContent.trim();
            const country = cells[2].textContent.trim();
            const receiveDate = cells[3].textContent.trim();
            const userId = userMap[cells[4].textContent.trim()];
            if (equipId && name && country && receiveDate && userId) { // Only include rows with complete data
                updateList.push({
                    equipId: equipId,
                    equipName: name,
                    origin: country,
                    dateOfReceipt: receiveDate,
                    userId: userId
                });
            }
        }
    });
    // Log the update list to console
    console.log('Update list:', updateList);
    // send to the backend using fetch API
    fetch('/api/equipment/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateList)
    })
    .then(response => {
    if (!response.ok) {
        return response.text().then(text => { throw new Error(text) });
    }
    // SỬA TẠI ĐÂY: Nếu Backend trả về chuỗi text "Cap nhat thanh cong..."
    return response.text(); 
    })
    .then(message => {
        console.log('Kết quả từ server:', message);
        alert(message); // Hiển thị "Cập nhật thành công" lên màn hình
    })
    .catch(error => {
        console.error('Lỗi khi fetch:', error);
    });
}

function addToUpdateList() {
    // Handle adding to update list functionality
    const userMap = globalUserMapIdToName; // Sử dụng biến toàn cục đã tải từ JSON để lấy tên người dùng khi hiển thị trong bảng cập nhật
    // Implement this logic to add the current input values to the update table
    // Validate input fields (input fields inside update-section )
    const equipId = document.querySelector('#update-section .input-row:nth-child(1) input').value.trim();
    const name = document.querySelector('#update-section .input-row:nth-child(2) input').value.trim();
    const country = document.querySelector('#update-section .input-row:nth-child(3) input').value.trim();
    const userId = document.querySelector('#update-section select').value.trim();

    let userOfficialName = userMap[userId] || userId; // Lấy tên người dùng từ userMap, nếu không tìm thấy thì hiển thị ID
    // ĐỔI THÀNH 'let' để có thể ghi đè ngày hôm nay nếu người dùng bỏ trống
    let receiveDate = document.querySelector('#update-section .input-row:nth-child(4) input').value;

    // Kiểm tra các trường bắt buộc nhập
    if (!equipId || !name || !country || !userOfficialName) {
        alert('Vui lòng nhập đầy đủ thông tin thiết bị (Mã, Tên, Nước sản xuất, Đơn vị).');
        return;
    }

    const today = new Date();

    // Nếu người dùng không nhập ngày tháng, tự động lấy ngày hiện tại làm mặc định
    if (!receiveDate) {
        // Trích xuất chuỗi định dạng YYYY-MM-DD dựa trên múi giờ địa phương (Local Time)
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Tháng chạy từ 0-11 nên phải +1
        const dd = String(today.getDate()).padStart(2, '0');
        
        receiveDate = `${yyyy}-${mm}-${dd}`; // Kết quả: YYYY-MM-DD khớp chuẩn với Java LocalDate
    } else {
        // Nếu người dùng CÓ nhập ngày, tiến hành kiểm tra tính hợp lệ
        const inputDate = new Date(receiveDate);
        
        if (isNaN(inputDate.getTime())) {
            alert('Ngày tiếp nhận không hợp lệ.');
            return;
        }
        
        // Đặt giờ về 00:00:00 để so sánh chính xác theo ngày, tránh lệch múi giờ
        today.setHours(0, 0, 0, 0);
        inputDate.setHours(0, 0, 0, 0);
        
        if (inputDate > today) {
            alert('Ngày tiếp nhận không thể là ngày trong tương lai.');
            return;
        }
    }

    // Kiểm tra nếu mã thiết bị tồn tại hoặc người dùng có quyền cập nhật thiết bị đó trước khi thêm vào danh sách cập nhật
    isUpdatable(equipId).then(canUpdate => {
        if (canUpdate) {
            // Nếu có thể cập nhật, thêm vào bảng cập nhật
            const tbody = document.querySelector('#update-section table tbody');
            const row = tbody.insertRow();
            row.insertCell(0).textContent = equipId;
            row.insertCell(1).textContent = name;
            row.insertCell(2).textContent = country;
            row.insertCell(3).textContent = receiveDate;
            row.insertCell(4).textContent = userOfficialName; // Hiển thị tên người dùng thay vì ID
            const deleteCell = row.insertCell(5);
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Xóa';
            deleteBtn.classList.add('btn', 'btn-delete-row');
            deleteCell.appendChild(deleteBtn);
        }
    });
}

function deleteRow(event) {
    if (event.target.classList.contains('btn-delete-row')) {
        const row = event.target.closest('tr');
        row.remove();
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

async function isUpdatable(equipId) {
    let loggedInUserRole = document.getElementById("user_role").querySelector("span").textContent.trim();
    let loggedInUserId = document.getElementById("user_id").querySelector("span").textContent.trim();
    try {
        const response = await fetch(`/api/equipment/check/${equipId}`);
        if (response.status === 404) {
            alert(`Thiết bị với mã ${equipId} không tồn tại. Vui lòng kiểm tra lại mã thiết bị!`);
            return false; // Thiết bị không tồn tại, không thể cập nhật
        }
        if (!response.ok) {
            throw new Error('Lỗi khi kiểm tra thiết bị');
        }
        // kiểm tra userId của thiết bị trả về có khớp với đơn vị đang đăng nhập không
        const data = await response.json();
        console.log('Dữ liệu thiết bị kiểm tra:', data);
        if (loggedInUserRole === "Lãnh đạo" || loggedInUserRole === "Văn phòng") {
            // Nếu đơn vị có toàn quyền câp nhật
            console.log("Đơn vị có toàn quyền cập nhật");
            return true; // Cho phép cập nhật
        }
        if (data.userId === Number(loggedInUserId)) {
            console.log("Đơn vị có quyền cập nhật thiết bị này");
            return true; // Cho phép cập nhật
        }
        else {
            alert(`Bạn không có quyền cập nhật thiết bị này vì nó thuộc đơn vị khác!`);
            return false; // Không cho phép cập nhật
        }
    } catch (error) {
        console.error('Lỗi khi kiểm tra thiết bị:', error);
        return false; // Trong trường hợp lỗi, giả định không thể cập nhật để an toàn
    }
}