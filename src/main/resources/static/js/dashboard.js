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
            window.location.href = "/login.html";
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
            window.location.href = "/login.html";
        }, 1000);
    }
}

async function logout() {
    try {
        await fetch("/api/logout", {
            method: "POST"
        });

        window.location.href = "/login.html";

    } catch (error) {
        console.error("Logout error:", error);
        messageElement.textContent = "Đăng xuất thất bại";
    }
}

logoutButton.addEventListener("click", logout);

checkLogin();