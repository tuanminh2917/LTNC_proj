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
    // Lay gia tri tu cac o input va xoa khoang trang thua
    const idValue = document.querySelector('#search-section .input-row:nth-child(1) input').value.trim();
    const nameValue = document.querySelector('#search-section .input-row:nth-child(2) input').value.trim();
    const countryValue = document.querySelector('#search-section .input-row:nth-child(3) input').value.trim();
    let dateValue = document.querySelector('#search-section .input-row:nth-child(4) input').value;
    const unitIdValue = document.querySelector('#search-section .input-row:nth-child(5) input').value.trim();

    // Xu ly truong hop nguoi dung bo trong o chon ngay
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

    // Xử lÝ: chUYỂN ĐỔI USer id sang int
    if (unitIdValue) {
        if (isNaN(userId)) {
            alert('Mã đơn vị không hợp lệ.');
            return;
        }
        const userId = parseInt(unitIdValue);
    }

    // BAT BUOC: Cac key phai khop 100% voi ten thuoc tinh trong file Equipment.java
    const searchCriteria = {
        equipId: idValue,         // Khop voi private String equipId
        equipName: nameValue,     // Khop voi private String equipName
        origin: countryValue,     // Khop voi private String origin
        dateOfReceipt: dateValue, // Khop voi private LocalDate dateOfReceipt
        userId: unitIdValue       // Khop voi private String userId
    };

    console.log('Dữ liệu JSON gửi đi:', JSON.stringify(searchCriteria));

    // Gui den API cua Spring Boot
    fetch('/api/equipment/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchCriteria)
    })
    .then(response => {
        if (!response.ok) {
            // Neu van loi, dong nay se in ra thong bao loi chi tiet hon tu server
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        console.log('Kết quả tìm kiếm nhận về:', data);
        
        // Goi ham hien thi du lieu len bang (neu co)
        renderSearchResults(data);
    })
    .catch(error => {
        console.error('Lỗi hệ thống:', error.message);
        alert('Có lỗi xảy ra khi tìm kiếm, vui lòng kiểm tra console.');
    });
}

// Ham ho tro do du lieu vao bang tim kiem de ban kiem tra luon gieo dien
function renderSearchResults(equipments) {
    const tbody = document.querySelector('#search-section table tbody');
    tbody.innerHTML = ''; // Xoa cac hang trong hien tai

    if (equipments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Không tìm thấy thiết bị nào</td></tr>';
        return;
    }

    equipments.forEach(item => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = item.equipId || '';
        row.insertCell(1).textContent = item.equipName || '';
        row.insertCell(2).textContent = item.origin || '';
        row.insertCell(3).textContent = item.dateOfReceipt || '';
        row.insertCell(4).textContent = item.userId || '';
    });
}

function handleUpdate() {
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
            const unitId = cells[4].textContent.trim();
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
    // Implement this logic to add the current input values to the update table
    // Validate input fields (input fields inside update-section )
    const equipId = document.querySelector('#update-section .input-row:nth-child(1) input').value.trim();
    const name = document.querySelector('#update-section .input-row:nth-child(2) input').value.trim();
    const country = document.querySelector('#update-section .input-row:nth-child(3) input').value.trim();
    const unitId = document.querySelector('#update-section .input-row:nth-child(5) input').value.trim();
    // ĐỔI THÀNH 'let' để có thể ghi đè ngày hôm nay nếu người dùng bỏ trống
    let receiveDate = document.querySelector('#update-section .input-row:nth-child(4) input').value;

    // Kiểm tra các trường bắt buộc nhập
    if (!equipId || !name || !country || !unitId) {
        alert('Vui lòng nhập đầy đủ thông tin thiết bị (Mã, Tên, Nước sản xuất, Mã đơn vị).');
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

    // handle unitId input
    if (isNaN(unitId)) {
        alert('Mã đơn vị phải là số.');
        return;
    }
    // chuyển unitId sang số nguyên để đồng bộ với kiểu dữ liệu backend nếu cần
    const unitIdInt = parseInt(unitId);

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
            newRow.insertCell(4).textContent = unitIdInt; // Đổ mã đơn vị vào bảng

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