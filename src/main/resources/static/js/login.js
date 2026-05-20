const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // TODO 1: Kiểm tra dữ liệu đầu vào phía front-end
    if (!username || !password) {
        showMessage("Vui lòng nhập đầy đủ tài khoản và mật khẩu", "error");
        return;
    }

    try {
        // TODO 2: Gửi dữ liệu đăng nhập sang back-end Spring Boot
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        // TODO 3: Xử lý khi đăng nhập thất bại
        if (!data.success) {
            showMessage(data.message, "error");
            return;
        }

        // TODO 4: Xử lý khi đăng nhập thành công
        showMessage("Đăng nhập thành công. Đang chuyển hướng...", "success");

        setTimeout(() => {
            window.location.href = "/Dashboard";
        }, 800);

    } catch (error) {
        console.error("Login error:", error);
        showMessage("Không thể kết nối đến server", "error");
    }
});

function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
}