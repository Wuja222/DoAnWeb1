// data.js
// Dữ liệu mẫu và hàm khởi tạo dữ liệu cho website đồng hồ.
// Chuẩn cấu trúc nhóm: id, name, category, price, costPrice, quantity, image, description, isActive.

const sampleProducts = [
    {
        id: "DH001",
        name: "EFB-109D-5AV",
        category: "Nam",
        price: 3782250,
        costPrice: 2600000,
        quantity: 20,
        image: "images/EFB-109D-5AV.jpe",
        description: "Đồng hồ Casio Edifice nam dây kim loại cao cấp, chống nước 100m, kính sapphire chống trầy.",
        isActive: true
    },
    {
        id: "DH002",
        name: "EFB-730L-7AV",
        category: "Nữ",
        price: 3300000,
        costPrice: 2400000,
        quantity: 15,
        image: "images/EFB-730L-7AV.jpe",
        description: "Đồng hồ thanh lịch dành cho nữ, mặt kính chống trầy, máy pin năng lượng cao cấp.",
        isActive: true
    },
    {
        id: "DH003",
        name: "EFR-S567D-1AV",
        category: "Thể thao",
        price: 4200000,
        costPrice: 3100000,
        quantity: 4, // Số lượng thấp để demo cảnh báo tồn kho
        image: "images/EFR-S567D-1AV.jpe",
        description: "Đồng hồ bấm giờ thể thao siêu mỏng, vỏ thép không gỉ, kiểu dáng thể thao nam tính.",
        isActive: true
    },
    {
        id: "DH004",
        name: "GA-2100-1A1DR",
        category: "Thể thao",
        price: 3150000,
        costPrice: 2200000,
        quantity: 25,
        image: "images/GA-2100-1A1DR.jpe",
        description: "Đồng hồ G-Shock bát giác siêu bền, chống sốc, chống nước 200m, đèn LED đôi.",
        isActive: true
    },
    {
        id: "DH005",
        name: "Casio MTP-V001",
        category: "Nam",
        price: 850000,
        costPrice: 600000,
        quantity: 3, // Sắp hết hàng
        image: "images/EFB-109D-5AV.jpe",
        description: "Đồng hồ nam thiết kế đơn giản, thanh lịch, phù hợp đeo hàng ngày và công sở.",
        isActive: true
    },
    {
        id: "DH006",
        name: "Casio LTP-V007",
        category: "Nữ",
        price: 950000,
        costPrice: 680000,
        quantity: 0, // Hết hàng để demo cảnh báo hết hàng
        image: "images/EFB-730L-7AV.jpe",
        description: "Đồng hồ nữ mặt chữ nhật cổ điển, dây kim loại mảnh mai tôn nét đẹp nữ tính.",
        isActive: false // Demo sản phẩm đã ẩn
    }
];

const sampleUsers = [
    {
        id: "KH001",
        name: "Nguyễn Văn A",
        phone: "0912345678",
        email: "nguyenvana@gmail.com",
        address: "123 Cầu Giấy, Hà Nội",
        status: "Hoạt động",
        createdAt: "15/10/2026"
    },
    {
        id: "KH002",
        name: "Trần Thị B",
        phone: "0987654321",
        email: "tranthib@gmail.com",
        address: "456 Nguyễn Huệ, Quận 1, TP.HCM",
        status: "Hoạt động",
        createdAt: "18/10/2026"
    },
    {
        id: "KH003",
        name: "Lê Văn C",
        phone: "0905123456",
        email: "levanc@gmail.com",
        address: "789 Hùng Vương, Đà Nẵng",
        status: "Hoạt động",
        createdAt: "20/10/2026"
    },
    {
        id: "KH004",
        name: "Phạm Gia D",
        phone: "0934567890",
        email: "phamgiad@gmail.com",
        address: "12 Đại lộ Hòa Bình, Cần Thơ",
        status: "Bị khóa",
        createdAt: "22/10/2026"
    },
    {
        id: "KH005",
        name: "Hoàng Thị E",
        phone: "0971234567",
        email: "hoangthie@gmail.com",
        address: "34 Lạch Tray, Ngô Quyền, Hải Phòng",
        status: "Hoạt động",
        createdAt: "25/10/2026"
    }
];

const sampleOrders = [
    {
        id: "DH001",
        customer: {
            name: "Nguyễn Văn A",
            phone: "0912345678",
            address: "123 Cầu Giấy, Hà Nội",
            email: "nguyenvana@gmail.com"
        },
        items: [
            { id: "DH001", name: "EFB-109D-5AV", price: 3782250, quantity: 2 },
            { id: "DH005", name: "Casio MTP-V001", price: 850000, quantity: 1 }
        ],
        total: 8414500,
        paymentMethod: "COD",
        status: "Chờ xử lý",
        date: "01/11/2026 10:30:00"
    },
    {
        id: "DH002",
        customer: {
            name: "Trần Thị B",
            phone: "0987654321",
            address: "456 Nguyễn Huệ, Quận 1, TP.HCM",
            email: "tranthib@gmail.com"
        },
        items: [
            { id: "DH002", name: "EFB-730L-7AV", price: 3300000, quantity: 1 }
        ],
        total: 3300000,
        paymentMethod: "Chuyển khoản",
        status: "Đã giao",
        date: "30/10/2026 14:15:00"
    },
    {
        id: "DH003",
        customer: {
            name: "Lê Văn C",
            phone: "0905123456",
            address: "789 Hùng Vương, Đà Nẵng",
            email: "levanc@gmail.com"
        },
        items: [
            { id: "DH003", name: "EFR-S567D-1AV", price: 4200000, quantity: 1 },
            { id: "DH004", name: "GA-2100-1A1DR", price: 3150000, quantity: 1 }
        ],
        total: 7350000,
        paymentMethod: "COD",
        status: "Đang giao",
        date: "31/10/2026 09:00:00"
    },
    {
        id: "DH004",
        customer: {
            name: "Phạm Gia D",
            phone: "0934567890",
            address: "12 Đại lộ Hòa Bình, Cần Thơ",
            email: "phamgiad@gmail.com"
        },
        items: [
            { id: "DH004", name: "GA-2100-1A1DR", price: 3150000, quantity: 1 }
        ],
        total: 3150000,
        paymentMethod: "COD",
        status: "Đã hủy",
        date: "29/10/2026 16:45:00"
    },
    {
        id: "DH005",
        customer: {
            name: "Hoàng Thị E",
            phone: "0971234567",
            address: "34 Lạch Tray, Hải Phòng",
            email: "hoangthie@gmail.com"
        },
        items: [
            { id: "DH005", name: "Casio MTP-V001", price: 850000, quantity: 3 }
        ],
        total: 2550000,
        paymentMethod: "Chuyển khoản",
        status: "Đã giao",
        date: "28/10/2026 11:20:00"
    }
];

const sampleImports = [
    {
        id: "PN001",
        productId: "DH001",
        productName: "EFB-109D-5AV",
        quantity: 20,
        importPrice: 2600000,
        total: 52000000,
        supplier: "Công ty Cổ phần Anh Khuê Watch",
        importer: "Nhật Vinh",
        date: "20/10/2026"
    },
    {
        id: "PN002",
        productId: "DH002",
        productName: "EFB-730L-7AV",
        quantity: 15,
        importPrice: 2400000,
        total: 36000000,
        supplier: "Đại lý phân phối Casio VN",
        importer: "Nhật Vinh",
        date: "22/10/2026"
    },
    {
        id: "PN003",
        productId: "DH003",
        productName: "EFR-S567D-1AV",
        quantity: 10,
        importPrice: 3100000,
        total: 31000000,
        supplier: "Công ty Cổ phần Anh Khuê Watch",
        importer: "Nhật Vinh",
        date: "25/10/2026"
    }
];

// Khởi tạo dữ liệu ban đầu
function initData() {
    initStorage();

    // 1. Kiểm tra và khởi tạo products
    if (localStorage.getItem("products") === null || getData("products").length === 0) {
        saveData("products", sampleProducts);
    }

    // 2. Kiểm tra và khởi tạo users
    if (localStorage.getItem("users") === null || getData("users").length === 0) {
        saveData("users", sampleUsers);
    }

    // 3. Kiểm tra và khởi tạo orders
    if (localStorage.getItem("orders") === null || getData("orders").length === 0) {
        saveData("orders", sampleOrders);
    }

    // 4. Kiểm tra và khởi tạo imports
    if (localStorage.getItem("imports") === null || getData("imports").length === 0) {
        saveData("imports", sampleImports);
    }
}

// Reset toàn bộ dữ liệu về mẫu chuẩn ban đầu (hữu ích khi test hoặc demo cho giáo viên)
function resetAllSampleData() {
    saveData("products", sampleProducts);
    saveData("users", sampleUsers);
    saveData("orders", sampleOrders);
    saveData("imports", sampleImports);
    saveData("cart", []);
}

// Định dạng giá tiền Việt Nam
function formatPrice(price) {
    const amount = Number(price) || 0;
    return amount.toLocaleString("vi-VN") + " đ";
}

