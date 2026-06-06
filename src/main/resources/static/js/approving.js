// I. Initialization
// 1. Variables and constants
// 2. Xóa dữ liệu mẫu (nếu có)

// II. Event listeners and function calls
// 1. Function calls
checkLogin();
// 2. Event listeners
// JavaScript để xử lý toggle hiển thị nội dung kế hoạch
document.querySelectorAll('.toggle-btn').forEach(button => {
    button.addEventListener('click', () => {
        const content = button.parentElement.nextElementSibling;
        if (content.style.display === 'none') {
            content.style.display = 'block';
            button.textContent = 'Ẩn';
        } else {
            content.style.display = 'none';
            button.textContent = 'Hiển thị';
        }
        });
});

// III. Functions defintions
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

// 2. Hàm hiển thị kế hoạch (dựa trên dữ liệu thực tế từ backend) (tạm thời chỉ khai báo, chưa có logic cụ thể)
function displayPlans(plans) {
    // Xóa kế hoạch cũ (nếu có)
    // Lấy kế hoạch mới từ backend và hiển thị chúng trong phần .plan-list
}