// I. Initialization
const statusMap = {
    "pending": "Chờ phê duyệt",
    "approved": "Đã phê duyệt",
    "rejected": "Bị từ chối"
};
const typeMap = {
    "annually": "Định kỳ",
    "quarterly": "Đột xuất"
};

// II. Event listeners and function calls
checkLogin();

document.getElementById("searchPlanBtn").addEventListener("click", searchPlans);

// III. Functions definitions

// 1. Check login
async function checkLogin() {
    try {
        const response = await fetch("/api/me", { method: "GET" });
        const data = await response.json();

        if (!data.success) {
            window.location.href = "/Login";
            return;
        }

        document.getElementById("user_official_name").querySelector("span").textContent =
            data.user.officialName || data.user.unit_name;
        document.getElementById("user_id").querySelector("span").textContent =
            data.user.userId || data.user.unit_id;
        document.getElementById("user_role").querySelector("span").textContent =
            data.user.role || data.user.unit_role;

    } catch (error) {
        console.error("Check login error:", error);
        alert("Không thể kiểm tra trạng thái đăng nhập");
        setTimeout(() => { window.location.href = "/Login"; }, 1000);
    }
}

// 2. Tìm kiếm kế hoạch
async function searchPlans() {
    const type = document.getElementById("planTypeSelect").value;
    const status = document.getElementById("planStatusSelect").value;
    const year = document.getElementById("yearInput").value.trim();

    const body = {
        type: type || null,
        status: status || null,
        year: year ? parseInt(year) : null  // 🔧 Sửa chỗ này
    };

    try {
        const response = await fetch("/api/plan/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const plans = await response.json();
        displayPlans(plans);

    } catch (error) {
        console.error("Search error:", error);
        alert("Lỗi khi tìm kiếm kế hoạch");
    }
}

// 3. Render danh sách kế hoạch
function displayPlans(plans) {
    const container = document.querySelector(".plan-list");

    container.querySelectorAll(".plan-toggle, #empty-msg").forEach(el => el.remove());

    if (plans.length === 0) {
        const empty = document.createElement("p");
        empty.id = "empty-msg";
        empty.textContent = "Không tìm thấy kế hoạch nào.";
        container.appendChild(empty);
        return;
    }

    plans.forEach(plan => {
        const typeLabel = typeMap[plan.type] || plan.type;
        const statusColor = {
            "Chờ phê duyệt": "orange",
            "Đã phê duyệt": "green",
            "Bị từ chối": "red"
        }[plan.status] || "black";

        const rows = (plan.details || []).map((d, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${d.equipmentName || ""}</td>
                <td>${d.equipmentId || ""}</td>
                <td>${d.usageUnit || ""}</td>
                <td>${d.content || ""}</td>
                <td>${d.conductor || ""}</td>
                <td>${d.estimatedTime || ""}</td>
                <td>${d.note || ""}</td>
            </tr>
        `).join("");

        const approvalButtons = plan.status === "Chờ phê duyệt" ? `
            <div class="approval-buttons">
                <button class="approve-btn" data-plan-id="${plan.planId}">Phê duyệt</button>
                <button class="reject-btn" data-plan-id="${plan.planId}">Từ chối</button>
            </div>
        ` : "";

        const toggle = document.createElement("div");
        toggle.className = "plan-toggle";
        toggle.innerHTML = `
            <div class="plan-toggle-header">
                <span>${plan.planId} | Loại kế hoạch: ${typeLabel} | ${plan.year}</span>
                <button class="toggle-btn">Hiển thị</button>
            </div>
            <div class="plan-toggle-content" style="display: none;">
                <p>Trạng thái: <span class="plan-status" style="color: ${statusColor}; font-weight: bold;">${plan.status}</span></p>
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên trang thiết bị</th>
                            <th>Mã số</th>
                            <th>Đơn vị sử dụng</th>
                            <th>Nội dung</th>
                            <th>Đơn vị thực hiện</th>
                            <th>Thời gian dự kiến (tháng)</th>
                            <th>Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
                ${approvalButtons}
            </div>
        `;

        toggle.querySelector(".toggle-btn").addEventListener("click", function () {
            const content = this.parentElement.nextElementSibling;
            if (content.style.display === "none") {
                content.style.display = "block";
                this.textContent = "Ẩn";
            } else {
                content.style.display = "none";
                this.textContent = "Hiển thị";
            }
        });

        const approveBtn = toggle.querySelector(".approve-btn");
        if (approveBtn) {
            approveBtn.addEventListener("click", function () {
                approvePlan(this.dataset.planId, this);
            });
        }

        const rejectBtn = toggle.querySelector(".reject-btn");
        if (rejectBtn) {
            rejectBtn.addEventListener("click", function () {
                rejectPlan(this.dataset.planId, this);
            });
        }

        container.appendChild(toggle);
    });
}

// 4. Phê duyệt
async function approvePlan(planId, btn) {
    if (!confirm("Bạn có chắc muốn phê duyệt kế hoạch này?")) return;

    try {
        const response = await fetch(`/api/plan/approve/${planId}`, { method: "GET" });
        const updated = await response.json();

        alert("Phê duyệt thành công!");

        const content = btn.closest(".plan-toggle-content");
        content.querySelector(".plan-status").textContent = updated.status;
        content.querySelector(".plan-status").style.color = "green";
        content.querySelector(".approval-buttons").remove();

    } catch (error) {
        console.error("Approve error:", error);
        alert("Lỗi khi phê duyệt kế hoạch");
    }
}

// 5. Từ chối
async function rejectPlan(planId, btn) {
    if (!confirm("Bạn có chắc muốn từ chối kế hoạch này?")) return;

    try {
        const response = await fetch(`/api/plan/reject/${planId}`, { method: "GET" });
        const updated = await response.json();

        alert("Đã từ chối kế hoạch!");

        const content = btn.closest(".plan-toggle-content");
        content.querySelector(".plan-status").textContent = updated.status;
        content.querySelector(".plan-status").style.color = "red";
        content.querySelector(".approval-buttons").remove();

    } catch (error) {
        console.error("Reject error:", error);
        alert("Lỗi khi từ chối kế hoạch");
    }
}