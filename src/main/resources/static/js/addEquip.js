document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('addBtn').addEventListener('click', handleAddEquipment);
    document.getElementById('resetBtn').addEventListener('click', clearForm);
    document.getElementById('reloadBtn').addEventListener('click', loadEquipmentList);

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

function clearForm() {
    document.getElementById('equipId').value = '';
    document.getElementById('equipName').value = '';
    document.getElementById('origin').value = '';
    document.getElementById('dateOfReceipt').value = '';
    document.getElementById('userOfficialName').value = '';
}