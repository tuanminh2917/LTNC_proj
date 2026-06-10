// I. Variables and Constants
const homeLink = document.getElementById("home-link");
const addBtn = document.querySelector(".add-btn");
const saveBtn = document.querySelector(".save-btn");

const userOfficialNameField = document.querySelector("#user_official_name span");
const userIdField = document.querySelector("#user_id span");
const userRoleField = document.querySelector("#user_role span");

const equipNameField = document.querySelector("#equip-name-field");
const equipIdField = document.querySelector("#equip-id-field");
const receiveDateField = document.querySelector("#receive-date-field");
const userField = document.querySelector("#user-field");

const tbody = document.querySelector("table tbody");
tbody.innerHTML = "";

// II. Event Listeners

homeLink.addEventListener("click", () => {
    window.location.href = "/";
});

(async () => {
    await checkLogin();
    userField.textContent = userOfficialNameField.textContent;
})();

equipIdField.addEventListener("keypress", async (event) => {
    await handleEquipIdKeyPress(event);
});

addBtn.addEventListener("click", () => {
    handleAddButtonClick();
});

tbody.addEventListener("dblclick", (event) => {
    handleNewRowDoubleClick(event);
});

saveBtn.addEventListener("click", async () => {
    await handleSaveButtonClick();
});

// III. Functions

async function checkLogin() {
    try {
        const response = await fetch("/api/me", {
            method: "GET"
        });

        const data = await response.json();

        if (!data.success) {
            window.location.href = "/Login";
            return;
        }

        userOfficialNameField.textContent = data.user.officialName || data.user.unit_name;
        userIdField.textContent = data.user.userId || data.user.unit_id;
        userRoleField.textContent = data.user.role || data.user.unit_role;

    } catch (error) {
        console.error("Check login error:", error);
        alert("Không thể kiểm tra trạng thái đăng nhập");

        setTimeout(() => {
            window.location.href = "/Login";
        }, 1000);
    }
}

async function handleEquipIdKeyPress(event) {
    if (event.key !== "Enter") {
        return;
    }

    const equipId = equipIdField.value.trim();

    if (!equipId) {
        alert("Vui lòng nhập mã số thiết bị.");
        return;
    }

    await loadEquipmentAndRecords(equipId);
}

async function loadEquipmentAndRecords(equipId) {
    try {
        const response = await fetch(`/api/equipment/check/${equipId}`, {
            method: "GET"
        });

        if (!response.ok) {
            clearEquipmentInfo();
            alert("Không thể lấy thông tin thiết bị.");
            return;
        }

        const equipment = await response.json();

        if (!equipment) {
            clearEquipmentInfo();
            alert("Không tìm thấy thông tin thiết bị với mã số đã nhập.");
            return;
        }

        if (equipment.userId !== Number(userIdField.textContent)) {
            clearEquipmentInfo();
            alert("Bạn không có quyền truy cập thông tin thiết bị này.");
            return;
        }

        equipNameField.textContent = equipment.equipName || "Không có tên thiết bị";
        receiveDateField.textContent = equipment.receiveDate || equipment.dateOfReceipt || "Không có ngày nhận";

        await loadRecords(equipId);

    } catch (error) {
        console.error("Lỗi khi lấy thông tin thiết bị:", error);
        clearEquipmentInfo();
        alert("Đã xảy ra lỗi khi lấy thông tin thiết bị.");
    }
}

async function loadRecords(equipId) {
    try {
        const response = await fetch(`/api/records/equip/${equipId}`, {
            method: "GET"
        });

        if (!response.ok) {
            tbody.innerHTML = "";
            alert("Không thể lấy hồ sơ thiết bị.");
            return;
        }

        const records = await response.json();
        renderRecords(records || []);

    } catch (error) {
        console.error("Lỗi khi lấy hồ sơ thiết bị:", error);
        tbody.innerHTML = "";
        alert("Đã xảy ra lỗi khi lấy hồ sơ thiết bị.");
    }
}

function renderRecords(records) {
    tbody.innerHTML = "";

    records.forEach((record) => {
        const row = document.createElement("tr");
        // Bắt buộc phải có class này để thỏa mãn điều kiện kiểm tra dòng của hàm handleNewRowDoubleClick
        row.classList.add("new-record-row"); 

        // 1. Ô ID (Không cho phép sửa)
        const idCell = document.createElement("td");
        idCell.textContent = record.recDetId || "";
        row.appendChild(idCell);

        // 2. Ô Ngày thực hiện (Cho phép sửa dạng input[type="date"])
        const dateCell = document.createElement("td");
        dateCell.textContent = record.conductDay || "";
        dateCell.classList.add("editable-new-cell"); // Thêm class để cho phép sửa
        dateCell.addEventListener("dblclick", handleNewRowDoubleClick); // Gắn sự kiện sửa
        row.appendChild(dateCell);

        // 3. Ô Nội dung công việc (Cho phép sửa dạng textarea)
        const contentCell = document.createElement("td");
        contentCell.textContent = record.scopeOfWork || "";
        contentCell.classList.add("editable-new-cell");
        contentCell.addEventListener("dblclick", handleNewRowDoubleClick);
        row.appendChild(contentCell);

        // 4. Ô Người thực hiện (Cho phép sửa dạng textarea)
        const personCell = document.createElement("td");
        personCell.textContent = record.conductor || "";
        personCell.classList.add("editable-new-cell");
        personCell.addEventListener("dblclick", handleNewRowDoubleClick);
        row.appendChild(personCell);

        // 5. Ô Nút hành động Xóa
        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Xóa";
        deleteButton.addEventListener('click', () => row.remove());
        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        tbody.appendChild(row);
    });
}

function clearEquipmentInfo() {
    equipNameField.textContent = "";
    receiveDateField.textContent = "";
    tbody.innerHTML = "";
}

// Add-a-Row: thêm một dòng trống ở cuối bảng.
function handleAddButtonClick() {
    const equipId = equipIdField.value.trim();

    if (!equipId) {
        alert("Vui lòng nhập mã số thiết bị trước khi thêm hồ sơ.");
        return;
    }

    if (!equipNameField.textContent.trim() || !receiveDateField.textContent.trim()) {
        alert("Vui lòng nhập mã thiết bị hợp lệ trước khi thêm hồ sơ.");
        return;
    }

    const row = document.createElement("tr");
    row.classList.add("new-record-row");

    const idCell = document.createElement("td");
    idCell.textContent = "";
    row.appendChild(idCell);

    const dateCell = document.createElement("td");
    dateCell.textContent = "";
    dateCell.classList.add("editable-new-cell");
    row.appendChild(dateCell);

    const contentCell = document.createElement("td");
    contentCell.textContent = "";
    contentCell.classList.add("editable-new-cell");
    row.appendChild(contentCell);

    const personCell = document.createElement("td");
    personCell.textContent = "";
    personCell.classList.add("editable-new-cell");
    row.appendChild(personCell);

    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Xóa";
    deleteButton.addEventListener('click', () => row.remove());
    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);

    tbody.appendChild(row);
}

// Add-a-Row: chỉ cho double click sửa các ô thuộc dòng mới.
function handleNewRowDoubleClick(event) {
    const cell = event.target;
    const row = cell.closest("tr");

    if (!row || !row.classList.contains("new-record-row")) {
        return;
    }

    if (!cell.classList.contains("editable-new-cell")) {
        return;
    }

    if (cell.querySelector("input") || cell.querySelector("textarea")) {
        return;
    }

    const oldValue = cell.textContent.trim();
    const cellIndex = cell.cellIndex;

    let editor;

    if (cellIndex === 1) {
        editor = document.createElement("input");
        editor.type = "date";
        editor.value = oldValue;
    } else {
        editor = document.createElement("textarea");
        editor.value = oldValue;
        editor.rows = 2;
    }

    editor.classList.add("cell-editor");

    cell.textContent = "";
    cell.appendChild(editor);
    editor.focus();

    editor.addEventListener("blur", () => {
        cell.textContent = editor.value.trim();
    });

    editor.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            editor.blur();
        }
    });
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

    rows.forEach((row, index) => {
        // Ngoại trừ mã bản ghi, kiểm tra xem các ô còn lại có null không. Nếu có, alert và return để dừng quá trình lưu.
        const cells = row.querySelectorAll("td");
        // Kiểm tra xem các ô còn lại có null không
        if (cells.length >= 4) {
            if (!cells[1].textContent.trim()) {
                alert("Ngày thực hiện không được để trống.");
                return;
            }
            if (!cells[2].textContent.trim()) {
                alert("Nội dung công việc không được để trống.");
                return;
            }
            if (!cells[3].textContent.trim()) {
                alert("Người thực hiện không được để trống.");
                return;
            }
            const record = {
                recDetId: cells[0].textContent.trim() || null, // Mã bản ghi, nếu có
                conductDay: cells[1].textContent.trim(),
                scopeOfWork: cells[2].textContent.trim(),
                conductor: cells[3].textContent.trim()
            };
            recordsToSave.push(record);
        }
    });

    console.log(recordsToSave);

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
