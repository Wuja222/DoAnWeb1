// common.js
// Các hàm tiện ích dùng chung cho trang Admin và toàn website.

// 1. Định dạng tiền tệ VNĐ (ví dụ: 1200000 -> "1.200.000 đ")
function formatMoney(amount) {
    const num = Number(amount) || 0;
    return num.toLocaleString("vi-VN") + " đ";
}

// 2. Tạo mã ngẫu nhiên theo tiền tố (ví dụ: generateCode("DH") -> "DH1234")
function generateCode(prefix) {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${random}`;
}

// 3. Lấy thời gian hiện tại định dạng dd/mm/yyyy hh:mm:ss
function getCurrentDateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

// 4. Lấy ngày hiện tại định dạng dd/mm/yyyy
function getCurrentDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
}

// 5. Hiển thị thông báo Toast nhanh gọn (thay vì alert chặn giao diện)
function showToast(message, type = "success") {
    let toastContainer = document.getElementById("toast-container");
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span>
        <span class="toast-msg">${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

