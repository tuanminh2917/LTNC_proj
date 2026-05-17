const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const db = require("./db");

const app = express();

// Cho phép front-end gọi API từ Live Server
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    credentials: true
}));

// Cho phép server đọc dữ liệu JSON từ request body
app.use(express.json());

// Cấu hình session đăng nhập
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 // 1 giờ
    }
}));

// API kiểm tra server có chạy không
app.get("/", (req, res) => {
    res.send("Backend login is running...");
});

// API đăng nhập
app.post("/api/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // TODO 1: Kiểm tra dữ liệu đầu vào
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Thông tin chưa đầy đủ"
            });
        }

        // TODO 2: Tìm user trong database
        const [users] = await db.query(
            "SELECT * FROM `User` WHERE username = ?",
            [username]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tài khoản không tồn tại"
            });
        }

        const user = users[0];

        // TODO 3: Kiểm tra mật khẩu
        let isPasswordValid = false;

        // Nếu sau này mật khẩu được mã hóa bằng bcrypt
        if (
            typeof user.password === "string" &&
            (user.password.startsWith("$2a$") || user.password.startsWith("$2b$"))
        ) {
            isPasswordValid = await bcrypt.compare(password, user.password);
        } 
        // Hiện tại file SQL demo đang lưu mật khẩu dạng thường, ví dụ: 123
        else {
            isPasswordValid = password === user.password;
        }

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Sai mật khẩu"
            });
        }

        // TODO 4: Tạo session đăng nhập
        req.session.user = {
            user_id: user.user_id,
            username: user.username,
            official_name: user.official_name,
            role: user.role
        };

        // TODO 5: Trả kết quả đăng nhập thành công
        return res.status(200).json({
            success: true,
            message: "Đăng nhập thành công",
            user: req.session.user
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
});

// API kiểm tra người dùng đã đăng nhập chưa
app.get("/api/me", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Chưa đăng nhập"
        });
    }

    return res.status(200).json({
        success: true,
        user: req.session.user
    });
});

// API đăng xuất
app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Đăng xuất thất bại"
            });
        }

        res.clearCookie("connect.sid");

        return res.status(200).json({
            success: true,
            message: "Đăng xuất thành công"
        });
    });
});

// Chạy server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});