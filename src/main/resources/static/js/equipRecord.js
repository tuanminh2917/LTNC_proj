// I. Variables and Constants
const homeLink = document.getElementById('home-link');
const addBtn = document.querySelector('.add-btn');
const saveBtn = document.querySelector('.save-btn');

const userOfficialNameField = document.querySelector('#user_official_name span');
const userIdField = document.querySelector('#user_id span');
const userRoleField = document.querySelector('#user_role span');

const equipNameField = document.querySelector('#equip-name-field');
const equipIdField = document.querySelector('#equip-id-field');
const receiveDateField = document.querySelector('#receive-date-field');
const userField = document.querySelector('#user-field');

// Xóa toàn bộ hàng mẫu trong bảng khi trang được tải
const tbody = document.querySelector("table tbody");
tbody.innerHTML = "";

// II. Event Listeners and Functions calls
// 1. Home link click event
homeLink.addEventListener('click', () => {
    window.location.href = '/';
});

// 2. Check session to populate user info
(async () => {
    await checkLogin();
    console.log(userOfficialNameField.textContent);
    userField.textContent = userOfficialNameField.textContent; // Điền tên đơn vị sử dụng bằng tên người dùng đã đăng nhập
})();

// 3. equipIdField 'enter' key event to fetch equipment info
equipIdField.addEventListener('keypress', async (event) => {
    handleEquipIdKeyPress(event);
});

// 4. Save button click event to save records
saveBtn.addEventListener('click', async function() {
    handleSaveButtonClick();
});

// III. Functions definitions

// 1. Check login status and populate user info
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
        

    } catch (error) {
        console.error("Check login error:", error);
        alert("Không thể kiểm tra trạng thái đăng nhập");

        setTimeout(() => {
            window.location.href = "/Login";
        }, 1000);
    }
}

// 2. Handle 'enter' key press on equipIdField to fetch equipment info and records

async function handleEquipIdKeyPress(event) {
    if (event.key === 'Enter') {
        const equipId = equipIdField.value.trim();
        if (equipId) {
            try {
                const response = await fetch(`/api/equipment/check/${equipId}`, {
                    method: "GET"
                });

                const data = await response.json();

                console.log("Dữ liệu thiết bị:", data);

                if (data) {
                    if (data.userId !== Number(userIdField.textContent)) {
                        console.log("User ID của thiết bị:", data.userId);
                        console.log("User ID của người dùng:", userIdField.textContent);
                        alert("Bạn không có quyền truy cập thông tin thiết bị này.");
                        equipNameField.textContent = "";
                        receiveDateField.textContent = "";
                        return;
                    }
                    // Điền dòng thông tin thiết bị vào các trường tương ứng
                    equipNameField.textContent = data.equipName || "Không có tên thiết bị";
                    receiveDateField.textContent = data.dateOfReceipt || "Không có ngày nhận";
                } else {
                    alert("Không tìm thấy thông tin thiết bị với mã số đã nhập.");
                    equipNameField.textContent = "";
                    receiveDateField.textContent = "";
                }

                // Điền hồ sơ trang thiết bị vào bảng
                const responseRecords = await fetch(`/api/records/equip/${equipId}`, {
                    method: "GET"
                });
                const recordsData = await responseRecords.json();
                console.log("Dữ liệu hồ sơ thiết bị:", recordsData);
                if (recordsData) {
                    const records = recordsData || [];
                    console.log("Danh sách hồ sơ thiết bị:", records);
                    const tbody = document.querySelector("table tbody");
                    tbody.innerHTML = ""; // Xóa các hàng cũ trước khi thêm mới

                    records.forEach((record, index) => {
                        const row = document.createElement("tr");

                        const sttCell = document.createElement("td");
                        sttCell.textContent = record.recDetId || null; // Sử dụng recDetId làm mã bản ghi, nếu không có thì để trống
                        row.appendChild(sttCell);

                        const dateCell = document.createElement("td");
                        dateCell.contentEditable = "true";
                        dateCell.classList.add("editable-cell");
                        dateCell.textContent = record.conductDay || "";
                        row.appendChild(dateCell);

                        const contentCell = document.createElement("td");
                        contentCell.contentEditable = "true";
                        contentCell.classList.add("editable-cell");
                        contentCell.textContent = record.scopeOfWork || "";
                        row.appendChild(contentCell);

                        const personCell = document.createElement("td");
                        personCell.contentEditable = "true";
                        personCell.classList.add("editable-cell");
                        personCell.textContent = record.conductor || "";
                        row.appendChild(personCell);

                        const actionCell = document.createElement("td");
                        const deleteButton = document.createElement("button");
                        deleteButton.textContent = "Xóa";
                        actionCell.appendChild(deleteButton);
                        row.appendChild(actionCell);

                        tbody.appendChild(row);
                    });
                } else {
                    alert("Không thể lấy hồ sơ thiết bị. Vui lòng thử lại sau.");
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin thiết bị:", error);
                alert("Đã xảy ra lỗi khi lấy thông tin thiết bị. Vui lòng thử lại sau.");
            }
        }
    }
}

// 3. Handle save button click to save records
async function handleSaveButtonClick() {
    const equipId = equipIdField.value.trim();
    if (!equipId) {
        alert("Vui lòng nhập mã số thiết bị trước khi lưu.");
        return;
    }

    const tbody = document.querySelector("table tbody");
    const rows = tbody.querySelectorAll("tr");
    const recordsToSave = [];

    for (const row of rows) {
        const cells = row.querySelectorAll("td");

        if (cells.length >= 4) {
            const recDetId = cells[0].textContent.trim();
            const conductDay = cells[1].textContent.trim();
            const scopeOfWork = cells[2].textContent.trim();
            const conductor = cells[3].textContent.trim();

            if (!conductDay) {
                alert("Ngày thực hiện không được để trống.");
                cells[1].focus();
                return;
            }

            if (!scopeOfWork) {
                alert("Nội dung công việc không được để trống.");
                cells[2].focus();
                return;
            }

            if (!conductor) {
                alert("Người thực hiện không được để trống.");
                cells[3].focus();
                return;
            }

            recordsToSave.push({
                recDetId: recDetId || null,
                conductDay: conductDay,
                scopeOfWork: scopeOfWork,
                conductor: conductor
            });
        }
    }

    try {
        const response = await fetch(`/api/records/save/${equipId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(recordsToSave)
        });

        const data = await response.json();

        if (data) {
            alert("Hồ sơ trang thiết bị đã được lưu thành công.");
        } else {
            alert("Không thể lưu hồ sơ trang thiết bị. Vui lòng thử lại sau.");
        }
    } catch (error) {
        console.error("Lỗi khi lưu hồ sơ trang thiết bị:", error);
        alert("Đã xảy ra lỗi khi lưu hồ sơ trang thiết bị. Vui lòng thử lại sau.");
    }
}

// 4. Function to lock select element (nếu cần thiết)

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

// 5. Function to handle "Add" button click to add new record row

// 6. Function to handle "Delete" button click to delete a record row

// 7. Function to handle Update process