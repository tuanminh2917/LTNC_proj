// I. Variables and Constants
const homeLink = document.getElementById("home-link");

const addRowBtn = document.querySelector('.add-row-btn');
const saveBtn = document.querySelector('.save-btn');

let globalUserMapIdToName = {}; // Dùng cho renderSearchResults (ID -> Tên)
let globalUserMapNameToId = {}; // Dùng cho handleUpdate (Tên -> ID)

let globalUserList = [];

// II. Event Listeners and function calls
// 1. Function calls

loadUserMapping(); // Gọi hàm này khi trang được tải để lấy dữ liệu người dùng từ server và lưu vào biến toàn cục

checkLogin(); // Gọi hàm này khi trang được tải để kiểm tra trạng thái đăng nhập và hiển thị thông tin người dùng

// 2. Event listener để khởi tạo dữ liệu người dùng từ server khi trang được tải

homeLink.addEventListener("click", () => {
    window.location.href = "/";
});

// Initialize năm hiện tại vào dòng "Năm ____"
document.addEventListener('DOMContentLoaded', () => {
    const yearInput = document.querySelector('#yearInput');
    const currentYear = new Date().getFullYear();
    yearInput.value = currentYear;
});

// Logic kích đúp chuột vào ô để chuyển thành Textarea sửa trực tiếp dữ liệu
document.addEventListener('DOMContentLoaded', () => {
    // Viết liền nhau nghĩa là: KHÔNG PHẢI stt VÀ KHÔNG PHẢI action VÀ KHÔNG PHẢI name...
    const editableCells = document.querySelectorAll('td:not(.col-stt):not(.col-action):not(.col-name):not(.col-user)'); // Chỉ cho phép chỉnh sửa các ô không phải cột STT, cột tên, cột đơn vị và cột hành động

    editableCells.forEach(cell => {
        cell.addEventListener('dblclick', function() {
            // Nếu ô đang chứa textarea chỉnh sửa thì không tạo thêm nữa
            if (this.querySelector('textarea')) return;

            const originalText = this.innerText;
            const textarea = document.createElement('textarea');
            textarea.value = originalText;
            
            // Xóa văn bản tĩnh và chèn ô nhập liệu động vào ô
            this.innerText = '';
            this.appendChild(textarea);
            textarea.focus();

            // Xử lý lưu lại khi người dùng bấm chuột ra ngoài (blur)
            const saveAndClose = () => {
                const updatedText = textarea.value.trim();
                this.innerText = updatedText;
            };

            textarea.addEventListener('blur', saveAndClose);

            // Xử lý lưu khi ấn nút Enter (Nhấn Shift + Enter nếu muốn xuống dòng trong ô)
            textarea.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    textarea.blur(); // Gọi hàm blur để tự động kích hoạt lưu dữ liệu
                }
            });
        });
    });
});

// Thêm eventListener cho nút "Lưu kế hoạch" để thu thập dữ liệu từ bảng và gửi về server
saveBtn.addEventListener('click', saveData);

// Thêm eventListener cho nút "Thêm dòng" để thêm dòng mới vào bảng
addRowBtn.addEventListener('click', addRow);

// Logic khi người dùng nhập mã số thiết bị vào cột "Mã số" thì tự động điền tên thiết bị vào cột "Tên trang thiết bị" dựa trên mã số đã nhập
document.addEventListener('input', function(e) {
    if (e.target.matches('.col-id textarea')) {
        const idInput = e.target;
        const idValue = idInput.value.trim();
        // Gửi idValue về server để lấy tên thiết bị tương ứng (endpoint là api/equipment/check/{idValue})
        fetch(`/api/equipment/check/${idValue}`)
            .then(response => response.json())
            .then(data => {
                const nameCell = idInput.closest('tr').querySelector('.col-name');
                const userCell = idInput.closest('tr').querySelector('.col-user');
                if (data && data.equipName) {
                    nameCell.innerText = data.equipName; // Điền tên thiết bị vào cột "Tên trang thiết bị"
                    userCell.innerText = globalUserMapIdToName[data.userId] || ''; // Điền tên đơn vị sử dụng vào cột "Đơn vị sử dụng" nếu có mapping, nếu không có thì để trống
                } else {
                    alert('Không tìm thấy thiết bị với mã số đã nhập. Vui lòng kiểm tra lại mã số.');
                    nameCell.innerText = ''; // Xóa tên thiết bị nếu mã số không hợp lệ
                    userCell.innerText = ''; // Xóa tên đơn vị sử dụng nếu mã số không hợp lệ
                }
            })
            .catch(error => {
                console.error('Error fetching equipment name:', error);
            });
    }
});

// III. Functions definition

// Logic thêm dòng mới vào bảng
function addRow() {
    const tableBody = document.querySelector('table tbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td class="col-stt"></td>
        <td class="col-name"></td>
        <td class="col-id"></td>
        <td class="col-user"></td>
        <td class="col-content"></td>
        <td class="col-conductor"></td>
        <td class="col-time"></td>
        <td class="col-note"></td>
        <td class="col-action">
            <button onclick="deleteRow(this)">Xóa</button>
        </td>
    `;

    tableBody.appendChild(newRow);
    updateRowNumbers();

    const editableCells = newRow.querySelectorAll(
        'td:not(.col-stt):not(.col-action):not(.col-name):not(.col-user)'
    );

    editableCells.forEach(cell => {
        attachDoubleClickEditor(cell);
    });
}

function attachDoubleClickEditor(cell) {
    cell.addEventListener('dblclick', function() {
        if (this.querySelector('textarea')) return;

        const originalText = this.innerText;
        const textarea = document.createElement('textarea');
        textarea.value = originalText;

        this.innerText = '';
        this.appendChild(textarea);
        textarea.focus();

        const saveAndClose = () => {
            const updatedText = textarea.value.trim();
            this.innerText = updatedText;
        };

        textarea.addEventListener('blur', saveAndClose);

        textarea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                textarea.blur();
            }
        });
    });
}

// Logic xóa dòng khi bấm nút "Xóa"
function deleteRow(button) {
    const row = button.closest('tr');
    row.remove();
    updateRowNumbers(); // Cập nhật lại số thứ tự sau khi xóa dòng
}

// Hàm cập nhật lại số thứ tự (STT) cho các dòng trong bảng
function updateRowNumbers() {
    const rows = document.querySelectorAll('table tbody tr');
    rows.forEach((row, index) => {
        const sttCell = row.querySelector('.col-stt');
        sttCell.textContent = index + 1; // Cập nhật số thứ tự bắt đầu từ 1
    });
}

// Hàm thu thập dữ liệu từ bảng và gửi về server
async function saveData() {
    const yearInput = document.querySelector('#yearInput');
    const yearText = yearInput.value.trim();
    const currentYear = new Date().getFullYear();

    if (!yearText) {
        alert("Năm kế hoạch không được để trống.");
        return;
    }

    const year = Number(yearText);

    if (!Number.isInteger(year)) {
        alert("Năm kế hoạch phải là số nguyên.");
        return;
    }

    if (year < currentYear) {
        alert("Năm kế hoạch không được nhỏ hơn năm hiện tại.");
        return;
    }

    const rows = document.querySelectorAll('table tbody tr');

    if (rows.length === 0) {
        alert("Kế hoạch phải có ít nhất một dòng thiết bị.");
        return;
    }

    const details = [];

    for (const row of rows) {
        const equipId = row.querySelector('.col-id').innerText.trim();
        const equipName = row.querySelector('.col-name').innerText.trim();
        const unitName = row.querySelector('.col-user').innerText.trim();
        const scopeOfWork = row.querySelector('.col-content').innerText.trim();
        const conductor = row.querySelector('.col-conductor').innerText.trim();
        const expectedTimeText = row.querySelector('.col-time').innerText.trim();
        const note = row.querySelector('.col-note').innerText.trim();

        const isEmptyRow =
            !equipId &&
            !equipName &&
            !unitName &&
            !scopeOfWork &&
            !conductor &&
            !expectedTimeText &&
            !note;

        if (isEmptyRow) {
            continue;
        }

        if (!equipId) {
            alert("Mã số thiết bị không được để trống.");
            return;
        }

        if (!equipName || !unitName) {
            alert(`Thiết bị ${equipId} chưa được hệ thống xác nhận.`);
            return;
        }

        if (!scopeOfWork) {
            alert("Nội dung không được để trống.");
            return;
        }

        if (!conductor) {
            alert("Đơn vị thực hiện không được để trống.");
            return;
        }

        if (!expectedTimeText) {
            alert("Thời gian dự kiến không được để trống.");
            return;
        }

        const expectedTime = Number(expectedTimeText);

        if (!Number.isInteger(expectedTime) || expectedTime < 1 || expectedTime > 12) {
            alert("Thời gian dự kiến phải là số nguyên từ 1 đến 12.");
            return;
        }

        details.push({
            equipId: equipId,
            conductor: conductor,
            expectedTime: expectedTime,
            scopeOfWork: scopeOfWork,
            note: note ? `${scopeOfWork} - ${note}` : scopeOfWork
        });
    }

    if (details.length === 0) {
        alert("Kế hoạch phải có ít nhất một dòng thiết bị hợp lệ.");
        return;
    }

    console.log(JSON.stringify({
                year: year,
                details: details
            }));

    try {
        const response = await fetch("/api/plan/periodic", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                year: year,
                details: details
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Kế hoạch bảo dưỡng, thay thế định kỳ đã được tạo thành công.");
        } else {
            alert(data.message || "Không thể tạo kế hoạch. Vui lòng thử lại sau.");
        }

    } catch (error) {
        console.error("Lỗi khi lưu kế hoạch:", error);
        alert("Đã xảy ra lỗi khi lưu kế hoạch.");
    }
}

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