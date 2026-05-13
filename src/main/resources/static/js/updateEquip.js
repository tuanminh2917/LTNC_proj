// Initialize: Clear table bodies and add event listener for delete buttons
document.addEventListener('DOMContentLoaded', function() {
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

function handleSearch() {
    // 1. Lấy giá trị từ các ô input thông qua Selector chính xác hơn
    // Sử dụng ID của container cha (giả sử là #search-section) để tránh lấy nhầm input ở phần khác
    const container = document.querySelector('#search-section .input-group-container');
    
    const idValue = container.querySelector('.input-row:nth-child(1) input').value.trim();
    const nameValue = container.querySelector('.input-row:nth-child(2) input').value.trim();
    const countryValue = container.querySelector('.input-row:nth-child(3) input').value.trim();
    let dateValue = container.querySelector('.input-row:nth-child(4) input').value;
    
    // Lấy giá trị từ thẻ select (Đơn vị)
    const unitSelect = container.querySelector('select');
    let unitIdValue = parseInt(unitSelect.value); 
    if (isNaN(unitIdValue)) unitIdValue=null;

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
        userId: unitIdValue             // Lấy value (1, 2, 3...) từ <option>
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
    const unitMap = {
        "1": "Lãnh đạo Cục",
        "2": "Văn phòng Cục",
        "3": "Phòng Đăng ký thuốc",
        "4": "Phòng Quản lý giá thuốc",
        "5": "Phòng Quản lý chất lượng thuốc",
        "6": "Phòng Quản lý kinh doanh dược",
        "7": "Phòng Quản lý Mỹ phẩm",
        "8": "Phòng Pháp chế - Hội nhập",
        "9": "Trung tâm Đào tạo và hỗ trợ Doanh nghiệp dược, mỹ phẩm"
    };

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

        // 2. Thay đổi: Lấy tên đơn vị từ unitMap dựa trên item.userId
        // Nếu không tìm thấy tên tương ứng, sẽ hiển thị lại mã ID gốc hoặc để trống
        const unitName = unitMap[item.userId] || item.userId || 'Chưa xác định';
        row.insertCell(4).textContent = unitName;
    });
}

function handleUpdate() {
    const unitMap = {
        "Lãnh đạo Cục": "1",
        "Văn phòng Cục": "2",
        "Phòng Đăng ký thuốc": "3",
        "Phòng Quản lý giá thuốc" : "4",
        "Phòng Quản lý chất lượng thuốc" : "5",
        "Phòng Quản lý kinh doanh dược": "6",
        "Phòng Quản lý Mỹ phẩm": "7",
        "Phòng Pháp chế - Hội nhập": "8",
        "Trung tâm Đào tạo và hỗ trợ Doanh nghiệp dược, mỹ phẩm": "9"
    };
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
            const unitId = unitMap[cells[4].textContent.trim()];
            if (equipId && name && country && receiveDate && unitId) { // Only include rows with complete data
                updateList.push({
                    equipId: equipId,
                    equipName: name,
                    origin: country,
                    dateOfReceipt: receiveDate,
                    userId: unitId
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
    const unitMap = {
        "1": "Lãnh đạo Cục",
        "2": "Văn phòng Cục",
        "3": "Phòng Đăng ký thuốc",
        "4": "Phòng Quản lý giá thuốc",
        "5": "Phòng Quản lý chất lượng thuốc",
        "6": "Phòng Quản lý kinh doanh dược",
        "7": "Phòng Quản lý Mỹ phẩm",
        "8": "Phòng Pháp chế - Hội nhập",
        "9": "Trung tâm Đào tạo và hỗ trợ Doanh nghiệp dược, mỹ phẩm"
    };
    // Implement this logic to add the current input values to the update table
    // Validate input fields (input fields inside update-section )
    const equipId = document.querySelector('#update-section .input-row:nth-child(1) input').value.trim();
    const name = document.querySelector('#update-section .input-row:nth-child(2) input').value.trim();
    const country = document.querySelector('#update-section .input-row:nth-child(3) input').value.trim();
    const unitId = document.querySelector('#update-section select').value.trim();

    let unitName = unitMap[unitId];
    // ĐỔI THÀNH 'let' để có thể ghi đè ngày hôm nay nếu người dùng bỏ trống
    let receiveDate = document.querySelector('#update-section .input-row:nth-child(4) input').value;

    // Kiểm tra các trường bắt buộc nhập
    if (!equipId || !name || !country || !unitName) {
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

    // // handle unitId input
    // if (isNaN(unitId)) {
    //     alert('Mã đơn vị phải là số.');
    //     return;
    // }
    // // chuyển unitId sang số nguyên để đồng bộ với kiểu dữ liệu backend nếu cần
    // const unitIdInt = parseInt(unitId);

    // BƯỚC QUAN TRỌNG: Gửi một request nhanh lên server kiểm tra xem ID có tồn tại không
    // Bạn có thể tận dụng API tìm kiếm theo ID hoặc một api check tồn tại gọn nhẹ
    fetch(`/api/equipment/check/${equipId}`) 
        .then(response => {
            if (response.status === 404) {
                // Nếu server trả về 404 nghĩa là mã thiết bị không tồn tại
                throw new Error(`Mã thiết bị '${equipId}' không tồn tại trong hệ thống! Không thể thêm.`);
            }
            if (!response.ok) throw new Error('Lỗi kiểm tra thiết bị.');
            return response.json();
        })
        .then(existData => {
            // Nếu tồn tại hợp lệ, tiến hành chèn hàng vào bảng hiển thị như cũ
            const tableBody = document.querySelector('#update-section table tbody');
            const newRow = tableBody.insertRow();
            newRow.insertCell(0).textContent = equipId;
            newRow.insertCell(1).textContent = name;
            newRow.insertCell(2).textContent = country;
            newRow.insertCell(3).textContent = receiveDate;
            newRow.insertCell(4).textContent = unitName; // Đổ mã đơn vị vào bảng

            const deleteCell = newRow.insertCell(5);
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Xoá';
            deleteBtn.classList.add('btn', 'btn-delete-row');
            deleteCell.appendChild(deleteBtn);
            deleteBtn.addEventListener('click', deleteRow);
        })
        .catch(error => {
            alert(error.message); // Thông báo lỗi "Mã thiết bị không tồn tại" cho người dùng
        });
}

function deleteRow(event) {
    if (event.target.classList.contains('btn-delete-row')) {
        const row = event.target.closest('tr');
        row.remove();
    }
}