const usernameElement = document.getElementById("username");
const officialNameElement = document.getElementById("officialName");
const roleElement = document.getElementById("role");
const messageElement = document.getElementById("message");
const logoutButton = document.getElementById("logoutBtn");

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

        usernameElement.textContent = data.user.username;

        // Hỗ trợ cả 2 kiểu tên field:
        // officialName: kiểu thường dùng trong Java/Spring Boot
        // official_name: kiểu cũ từ Node.js/MySQL demo
        officialNameElement.textContent = data.user.officialName || data.user.official_name;
        roleElement.textContent = data.user.role;

    } catch (error) {
        console.error("Check login error:", error);
        messageElement.textContent = "Không thể kiểm tra trạng thái đăng nhập";

        setTimeout(() => {
            window.location.href = "/Login";
        }, 1000);
    }
}

async function logout() {
    try {
        await fetch("/api/logout", {
            method: "POST"
        });

        window.location.href = "/Login";

    } catch (error) {
        console.error("Logout error:", error);
        messageElement.textContent = "Đăng xuất thất bại";
    }
}

logoutButton.addEventListener("click", logout);

let isEquipmentListMenuOpen = false;

function toggleEquipmentListMenu() {
    const submenu = document.getElementById('equipmentSubmenu');
    if (!submenu) {
        console.error("Không tìm thấy submenu với id 'equipmentSubmenu'");
        return;
    }

    if (!isAbleToAccess(['Lãnh đạo'])) { // Chỉ cho phép truy cập nếu không phải là Lãnh đạo Cục (unit_id 1)
        return; // Không mở menu nếu người dùng không có quyền truy cập
     }

    if (!isEquipmentListMenuOpen) {
        isEquipmentListMenuOpen = true;
        submenu.classList.toggle('active');

        document.getElementById("addEquip").addEventListener("click", () => {
            window.location.href = "/EquipmentList/Add";
        });

        document.getElementById("updateEquip").addEventListener("click", () => {
            window.location.href = "/EquipmentList/Update";
        });
        document.getElementById("deleteEquip").addEventListener("click", () => {
            window.location.href = "/EquipmentList/Delete";
        });
    } else {
        isEquipmentListMenuOpen = false;
        // deactivate menu
        submenu.classList.toggle('active');
    }
}

function isAbleToAccess(unableRoles) { // unableRoles là mảng chứa các role không được phép truy cập
    // Lấy role của người dùng hiện tại
    const unitId = document.getElementById('role').textContent.trim(); // Giả sử role được hiển thị trong phần tử có id 'role'
    // Kiểm tra nếu role của người dùng nằm trong danh sách unableRoles thì trả về false
    if (unableRoles.includes(unitId)) {
        alert("Bạn không có quyền truy cập chức năng này.");
        return false; // Không cho phép truy cập
    }
    return true; // Cho phép truy cập
}

checkLogin();