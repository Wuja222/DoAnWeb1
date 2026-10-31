// data.js
// Dữ liệu mẫu và hàm khởi tạo dữ liệu cho website đồng hồ.
// Cần nạp storage.js trước data.js.

const sampleProducts = [
    {
        id: "DH001",
        name: "EFB-109D-5AV",
        category: "Nam",
        price: 3782250,
        costPrice: 2600000,
        quantity: 20,
        image: "EFB-109D-5AV.jpe",
        description: "Đồng hồ Casio nam cổ điển",
        isActive: true
    },
    {
        id: "DH002",
        name: "EFB-730L-7AV",
        category: "Nữ",
        price: 3300000,
        costPrice: 2800000,
        quantity: 15,
        image: "EFB-730L-7AV.jpe",
        description: "Đồng hồ năng lượng ánh sáng",
        isActive: true
    },
    {
        id: "DH003",
        name: "EFR-S567D-1AV",
        category: "Thể thao",
        price: 4200000,
        costPrice: 3500000,
        quantity: 10,
        image: "EFR-S567D-1AV.jpe",
        description: "Đồng hồ Seiko thể thao",
        isActive: true
    },
    {
        id: "DH004",
        name: "GA-2100-1A1DR",
        category: "Nam",
        price: 1156000,
        costPrice: 700000,
        quantity: 25,
        image: "GA-2100-1A1DR.jpe",
        description: "Đồng hồ nữ thời trang",
        isActive: true
    }
];

// Chỉ tạo dữ liệu mẫu khi chưa có khóa products.
// Nếu đã có dữ liệu, hàm này giữ nguyên dữ liệu cũ.
function initData() {
    initStorage();

    if (localStorage.getItem("products") === null ||
        getData("products").length === 0) {
        saveData("products", sampleProducts);
    }
}

// Chỉ gọi hàm này khi chủ động muốn thay danh sách sản phẩm hiện tại
// bằng 4 sản phẩm mẫu. Thao tác này sẽ ghi đè khóa products.
function resetSampleProducts() {
    saveData("products", sampleProducts);
}

// Định dạng giá tiền Việt Nam.
function formatPrice(price) {
    const amount = Number(price) || 0;
    return amount.toLocaleString("vi-VN") + " VNĐ";
}
