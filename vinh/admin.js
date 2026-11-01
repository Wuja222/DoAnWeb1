// ==========================================================================
// admin.js - LOGIC ĐIỀU HÀNH TRANG QUẢN TRỊ WATCHSTORE
// Tác giả: Nhật Vinh (Đồ án Web 1)
// Đáp ứng tiêu chuẩn: Đơn giản, rõ ràng, dễ giải thích khi vấn đáp Web 1.
// ==========================================================================

// Biến toàn cục lưu trữ ID đơn hàng đang xem trong modal
let currentViewingOrderId = null;

// ==========================================================================
// 1. KHỞI TẠO HỆ THỐNG KHI TRANG TẢI XONG
// ==========================================================================
document.addEventListener("DOMContentLoaded", function () {
    // 1. Khởi tạo dữ liệu mẫu nếu localStorage chưa có (từ data.js & storage.js)
    if (typeof initData === "function") {
        initData();
    }

    // 2. Gán sự kiện click cho các mục menu trên sidebar để chuyển tab
    setupSidebarNavigation();

    // 3. Gán sự kiện cho nút toggle menu trên thiết bị di động
    setupMobileToggle();

    // 4. Tải dữ liệu ban đầu cho Tab Tổng quan (Dashboard)
    renderDashboard();

    // 5. Nạp danh sách sản phẩm mẫu vào dropdown chọn ảnh và chọn nhập hàng
    populateProductSelectOptions();
});

// ==========================================================================
// 2. ĐIỀU HƯỚNG TAB (SIDEBAR NAVIGATION)
// ==========================================================================
function setupSidebarNavigation() {
    const menuItems = document.querySelectorAll(".sidebar-menu .menu-item");
    menuItems.forEach(item => {
        item.addEventListener("click", function () {
            const tabId = this.getAttribute("data-tab");
            if (tabId) {
                switchTab(tabId);
            }
        });
    });
}

function switchTab(tabId) {
    // 1. Cập nhật trạng thái active trên sidebar
    const menuItems = document.querySelectorAll(".sidebar-menu .menu-item");
    menuItems.forEach(item => {
        if (item.getAttribute("data-tab") === tabId) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });

    // 2. Ẩn tất cả tab pane và chỉ hiển thị tab được chọn
    const tabPanes = document.querySelectorAll(".tab-pane");
    tabPanes.forEach(pane => pane.classList.remove("active"));

    const targetPane = document.getElementById(`tab-${tabId}`);
    if (targetPane) {
        targetPane.classList.add("active");
    }

    // 3. Cập nhật tiêu đề trên Topbar
    const titleMap = {
        dashboard: "Tổng quan hệ thống",
        products: "Quản lý sản phẩm đồng hồ",
        orders: "Quản lý danh sách đơn hàng",
        customers: "Quản lý khách hàng",
        imports: "Quản lý phiếu nhập hàng",
        inventory: "Theo dõi tồn kho & Cảnh báo",
        profit: "Báo cáo giá bán & Biên lợi nhuận",
        settings: "Cài đặt hệ thống & Dữ liệu"
    };

    const titleEl = document.getElementById("page-title");
    if (titleEl && titleMap[tabId]) {
        titleEl.textContent = titleMap[tabId];
    }

    // 4. Render lại dữ liệu tương ứng với tab vừa mở
    switch (tabId) {
        case "dashboard":
            renderDashboard();
            break;
        case "products":
            renderProductTable();
            break;
        case "orders":
            renderOrderTable();
            break;
        case "customers":
            renderCustomerTable();
            break;
        case "imports":
            renderImportTable();
            break;
        case "inventory":
            renderInventoryTable();
            break;
        case "profit":
            renderProfitTable();
            break;
    }
}

// Hỗ trợ thu gọn/mở rộng sidebar trên mobile
function setupMobileToggle() {
    const toggleBtn = document.getElementById("toggle-sidebar-btn");
    const sidebar = document.querySelector(".sidebar");
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener("click", function () {
            sidebar.classList.toggle("open");
        });
    }
}

// ==========================================================================
// 3. TAB 1: TỔNG QUAN (DASHBOARD)
// ==========================================================================
function renderDashboard() {
    const products = getData("products");
    const users = getData("users");
    const orders = getData("orders");

    // 1. Tính toán 4 thẻ KPI
    const totalProducts = products.length;
    const totalCustomers = users.length;
    const totalOrders = orders.length;

    // Doanh thu: tính tổng tiền các đơn hàng đã giao thành công (hoặc mọi đơn trừ Đã hủy)
    const validOrders = orders.filter(o => o.status === "Đã giao");
    const totalRevenue = validOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    // Cập nhật lên giao diện
    const elProd = document.getElementById("dash-total-products");
    const elCust = document.getElementById("dash-total-customers");
    const elOrd = document.getElementById("dash-total-orders");
    const elRev = document.getElementById("dash-total-revenue");

    if (elProd) elProd.textContent = totalProducts;
    if (elCust) elCust.textContent = totalCustomers;
    if (elOrd) elOrd.textContent = totalOrders;
    if (elRev) elRev.textContent = formatPrice(totalRevenue);

    // 2. Render 5 đơn hàng gần đây nhất
    const recentOrdersTable = document.getElementById("dash-recent-orders");
    if (recentOrdersTable) {
        // Lấy tối đa 5 đơn hàng mới nhất
        const recentOrders = [...orders].reverse().slice(0, 5);

        if (recentOrders.length === 0) {
            recentOrdersTable.innerHTML = `<tr><td colspan="6" class="text-muted text-center" style="text-align:center; padding: 20px;">Chưa có đơn hàng nào!</td></tr>`;
        } else {
            recentOrdersTable.innerHTML = recentOrders.map(order => {
                const customerName = order.customer ? order.customer.name : "Khách vãng lai";
                return `
                    <tr>
                        <td><strong>#${order.id}</strong></td>
                        <td>${customerName}</td>
                        <td>${order.date || "Vừa xong"}</td>
                        <td><strong>${formatPrice(order.total)}</strong></td>
                        <td>${getStatusBadge(order.status)}</td>
                        <td>
                            <button class="btn btn-sm btn-outline" onclick="viewOrderDetail('${order.id}')">
                                <i class="fa-solid fa-eye"></i> Xem
                            </button>
                        </td>
                    </tr>
                `;
            }).join("");
        }
    }

    // 3. Render bảng tồn kho cảnh báo (sản phẩm có số lượng <= 5)
    const inventoryTable = document.getElementById("dash-inventory-list");
    if (inventoryTable) {
        const warningProducts = products.filter(p => p.quantity <= 5).slice(0, 5);
        if (warningProducts.length === 0) {
            inventoryTable.innerHTML = `<tr><td colspan="4" class="text-success text-center" style="text-align:center; padding: 16px;">Tất cả sản phẩm đều đủ tồn kho!</td></tr>`;
        } else {
            inventoryTable.innerHTML = warningProducts.map(p => {
                let badge = "";
                if (p.quantity === 0) {
                    badge = `<span class="badge badge-danger">Hết hàng</span>`;
                } else {
                    badge = `<span class="badge badge-warning">Còn ${p.quantity} chiếc</span>`;
                }
                return `
                    <tr>
                        <td><strong>${p.name}</strong></td>
                        <td><code>${p.id}</code></td>
                        <td>${p.quantity}</td>
                        <td>${badge}</td>
                    </tr>
                `;
            }).join("");
        }
    }

    // 4. Render biểu đồ phân bổ doanh thu theo loại đồng hồ (Nam, Nữ, Thể thao)
    renderCategoryChart(orders);
}

// Biểu đồ cột CSS Flexbox
function renderCategoryChart(orders) {
    const chartContainer = document.getElementById("dash-category-chart");
    if (!chartContainer) return;

    // Tính doanh thu theo từng danh mục từ các đơn hàng "Đã giao"
    const catSales = { "Nam": 0, "Nữ": 0, "Thể thao": 0 };
    const products = getData("products");

    orders.forEach(order => {
        if (order.status !== "Đã hủy" && Array.isArray(order.items)) {
            order.items.forEach(item => {
                const p = products.find(prod => String(prod.id) === String(item.id));
                const cat = (p && p.category) ? p.category : "Nam";
                const itemTotal = (item.price || 0) * (item.quantity || 1);
                if (catSales[cat] !== undefined) {
                    catSales[cat] += itemTotal;
                } else {
                    catSales["Nam"] += itemTotal;
                }
            });
        }
    });

    const maxSale = Math.max(...Object.values(catSales), 1);

    chartContainer.innerHTML = Object.entries(catSales).map(([cat, amount]) => {
        // Chiều cao theo % (tối đa 100%, tối thiểu 15% để thấy cột)
        const percent = Math.max(Math.round((amount / maxSale) * 100), 12);
        return `
            <div class="chart-bar-wrapper">
                <span class="chart-bar-value">${formatPrice(amount)}</span>
                <div class="chart-bar" style="height: ${percent}%;"></div>
                <span class="chart-bar-label">${cat}</span>
            </div>
        `;
    }).join("");
}

// ==========================================================================
// 4. TAB 2: QUẢN LÝ SẢN PHẨM (PRODUCTS CRUD)
// ==========================================================================
function renderProductTable(customList = null) {
    const products = customList !== null ? customList : getData("products");
    const tbody = document.getElementById("product-table-body");
    if (!tbody) return;

    if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted" style="text-align: center; padding: 24px;">Không tìm thấy sản phẩm nào!</td></tr>`;
        return;
    }

    tbody.innerHTML = products.map(p => {
        const statusBadge = p.isActive
            ? `<span class="badge badge-success">Đang bán</span>`
            : `<span class="badge badge-gray">Đã ẩn</span>`;

        const imageSrc = p.image || "images/EFB-109D-5AV.jpe";

        return `
            <tr>
                <td><code>${p.id}</code></td>
                <td>
                    <img src="${imageSrc}" alt="${p.name}" class="table-thumb" onerror="this.src='images/EFB-109D-5AV.jpe'">
                </td>
                <td><strong>${p.name}</strong></td>
                <td>${p.category || "Nam"}</td>
                <td><strong>${formatPrice(p.price)}</strong></td>
                <td class="text-muted">${formatPrice(p.costPrice)}</td>
                <td>
                    <span class="${p.quantity <= 5 ? (p.quantity === 0 ? 'text-danger font-bold' : 'text-warning font-bold') : ''}">
                        ${p.quantity}
                    </span>
                </td>
                <td>${statusBadge}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-icon-edit" title="Sửa thông tin" onclick="openProductModal('${p.id}')">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn-icon btn-icon-toggle" title="${p.isActive ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'}" onclick="handleToggleProductActive('${p.id}')">
                            <i class="fa-solid ${p.isActive ? 'fa-eye-slash' : 'fa-eye'}"></i>
                        </button>
                        <button class="btn-icon btn-icon-delete" title="Xóa sản phẩm" onclick="handleDeleteProduct('${p.id}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

// Tìm kiếm và lọc sản phẩm
function handleProductFilter() {
    const keyword = (document.getElementById("prod-search").value || "").toLowerCase().trim();
    const category = document.getElementById("prod-cat-filter").value;
    const status = document.getElementById("prod-status-filter").value;

    let products = getData("products");

    let filtered = products.filter(p => {
        const matchKeyword = p.name.toLowerCase().includes(keyword) || p.id.toLowerCase().includes(keyword);
        const matchCategory = category === "" || p.category === category;
        const matchStatus = status === "" || (status === "active" && p.isActive) || (status === "hidden" && !p.isActive);
        return matchKeyword && matchCategory && matchStatus;
    });

    renderProductTable(filtered);
}

// Mở Modal Thêm hoặc Sửa sản phẩm
function openProductModal(productId = null) {
    const modal = document.getElementById("modal-product");
    const form = document.getElementById("product-form");
    const titleEl = document.getElementById("modal-product-title");
    const idInput = document.getElementById("prod-id");

    form.reset();
    document.getElementById("prod-preview-img").style.display = "none";

    if (productId) {
        // Chế độ SỬA
        const products = getData("products");
        const prod = products.find(p => String(p.id) === String(productId));
        if (!prod) return;

        titleEl.textContent = "Chỉnh sửa thông tin sản phẩm";
        document.getElementById("prod-form-mode").value = "edit";

        idInput.value = prod.id;
        idInput.readOnly = true; // Không cho sửa ID khi update

        document.getElementById("prod-name").value = prod.name;
        document.getElementById("prod-category").value = prod.category || "Nam";
        document.getElementById("prod-price").value = prod.price;
        document.getElementById("prod-cost").value = prod.costPrice;
        document.getElementById("prod-quantity").value = prod.quantity;
        document.getElementById("prod-image").value = prod.image;
        document.getElementById("prod-description").value = prod.description || "";
        document.getElementById("prod-is-active").checked = prod.isActive;

        previewProductImage(prod.image);
    } else {
        // Chế độ THÊM MỚI
        titleEl.textContent = "Thêm sản phẩm mới";
        document.getElementById("prod-form-mode").value = "add";

        // Tự sinh mã sản phẩm mới
        const products = getData("products");
        const nextNum = products.length + 1;
        idInput.value = "DH" + String(nextNum).padStart(3, "0");
        idInput.readOnly = false;

        document.getElementById("prod-is-active").checked = true;
    }

    modal.classList.add("active");
}

function closeProductModal() {
    const modal = document.getElementById("modal-product");
    if (modal) modal.classList.remove("active");
}

// Xem trước hình ảnh khi nhập URL hoặc chọn ảnh
function previewProductImage(url) {
    const img = document.getElementById("prod-preview-img");
    if (!url) {
        img.style.display = "none";
        return;
    }
    img.src = url;
    img.style.display = "block";
    img.onerror = function () {
        img.style.display = "none";
    };
}

function selectSampleImage(sampleUrl) {
    if (sampleUrl) {
        document.getElementById("prod-image").value = sampleUrl;
        previewProductImage(sampleUrl);
    }
}

// Lưu sản phẩm (Thêm hoặc Sửa)
function handleSaveProduct(event) {
    event.preventDefault();

    const mode = document.getElementById("prod-form-mode").value;
    const id = document.getElementById("prod-id").value.trim();
    const name = document.getElementById("prod-name").value.trim();
    const category = document.getElementById("prod-category").value;
    const price = Number(document.getElementById("prod-price").value) || 0;
    const costPrice = Number(document.getElementById("prod-cost").value) || 0;
    const quantity = Number(document.getElementById("prod-quantity").value) || 0;
    const image = document.getElementById("prod-image").value.trim();
    const description = document.getElementById("prod-description").value.trim();
    const isActive = document.getElementById("prod-is-active").checked;

    if (!id || !name) {
        alert("Vui lòng nhập đầy đủ Mã sản phẩm và Tên đồng hồ!");
        return;
    }

    let products = getData("products");

    if (mode === "add") {
        // Kiểm tra trùng ID
        const exists = products.some(p => String(p.id).toLowerCase() === id.toLowerCase());
        if (exists) {
            alert(`Mã sản phẩm "${id}" đã tồn tại! Vui lòng chọn mã khác.`);
            return;
        }

        const newProduct = {
            id: id,
            name: name,
            category: category,
            price: price,
            costPrice: costPrice,
            quantity: quantity,
            image: image,
            description: description,
            isActive: isActive
        };

        products.push(newProduct);
        showToast(`Đã thêm mới đồng hồ "${name}" thành công!`, "success");
    } else {
        // Cập nhật sản phẩm
        const index = products.findIndex(p => String(p.id) === String(id));
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name: name,
                category: category,
                price: price,
                costPrice: costPrice,
                quantity: quantity,
                image: image,
                description: description,
                isActive: isActive
            };
            showToast(`Đã cập nhật sản phẩm "${name}"!`, "success");
        }
    }

    saveData("products", products);
    closeProductModal();
    renderProductTable();
    populateProductSelectOptions();
}

// Ẩn / Hiện nhanh trạng thái sản phẩm
function handleToggleProductActive(productId) {
    let products = getData("products");
    const prod = products.find(p => String(p.id) === String(productId));
    if (!prod) return;

    prod.isActive = !prod.isActive;
    saveData("products", products);

    showToast(`Đã ${prod.isActive ? 'mở bán' : 'ẩn'} sản phẩm "${prod.name}"`, "info");
    renderProductTable();
}

// Xóa sản phẩm
function handleDeleteProduct(productId) {
    let products = getData("products");
    const prod = products.find(p => String(p.id) === String(productId));
    if (!prod) return;

    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${prod.name}" (${prod.id}) khỏi hệ thống không?`)) {
        return;
    }

    products = products.filter(p => String(p.id) !== String(productId));
    saveData("products", products);

    showToast(`Đã xóa sản phẩm thành công!`, "error");
    renderProductTable();
    populateProductSelectOptions();
}


// ==========================================================================
// 5. TAB 3: QUẢN LÝ ĐƠN HÀNG (ORDERS MANAGEMENT)
// ==========================================================================
function renderOrderTable(customList = null) {
    const orders = customList !== null ? customList : getData("orders");
    const tbody = document.getElementById("order-table-body");
    if (!tbody) return;

    if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted" style="text-align: center; padding: 24px;">Không có đơn hàng nào!</td></tr>`;
        return;
    }

    // Đưa đơn mới lên đầu
    const sortedOrders = [...orders].reverse();

    tbody.innerHTML = sortedOrders.map(order => {
        const customerName = order.customer ? order.customer.name : "Khách lẻ";
        const phone = order.customer ? order.customer.phone : "--";

        return `
            <tr>
                <td><strong>#${order.id}</strong></td>
                <td>${customerName}</td>
                <td>${phone}</td>
                <td>${order.date || "Vừa đặt"}</td>
                <td><strong>${formatPrice(order.total)}</strong></td>
                <td><span class="badge badge-gray">${order.paymentMethod || "COD"}</span></td>
                <td>${getStatusBadge(order.status)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewOrderDetail('${order.id}')">
                        <i class="fa-solid fa-eye"></i> Chi tiết
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

// Bộ lọc đơn hàng
function handleOrderFilter() {
    const keyword = (document.getElementById("order-search").value || "").toLowerCase().trim();
    const status = document.getElementById("order-status-filter").value;

    let orders = getData("orders");

    let filtered = orders.filter(o => {
        const custName = o.customer ? o.customer.name.toLowerCase() : "";
        const custPhone = o.customer ? o.customer.phone : "";
        const matchKeyword = o.id.toLowerCase().includes(keyword) || custName.includes(keyword) || custPhone.includes(keyword);
        const matchStatus = status === "" || o.status === status;
        return matchKeyword && matchStatus;
    });

    renderOrderTable(filtered);
}

// Xem chi tiết đơn hàng trong Modal
function viewOrderDetail(orderId) {
    const orders = getData("orders");
    const order = orders.find(o => String(o.id) === String(orderId));
    if (!order) return;

    currentViewingOrderId = order.id;

    document.getElementById("modal-order-id").textContent = order.id;
    document.getElementById("modal-order-customer").textContent = order.customer ? order.customer.name : "--";
    document.getElementById("modal-order-phone").textContent = order.customer ? order.customer.phone : "--";
    document.getElementById("modal-order-address").textContent = order.customer ? order.customer.address : "--";
    document.getElementById("modal-order-email").textContent = (order.customer && order.customer.email) ? order.customer.email : "(Không cung cấp)";

    document.getElementById("modal-order-date").textContent = order.date || "--";
    document.getElementById("modal-order-payment").textContent = order.paymentMethod || "COD";
    document.getElementById("modal-order-status-badge").innerHTML = getStatusBadge(order.status);
    document.getElementById("modal-order-change-status").value = order.status || "Chờ xử lý";

    // Danh sách mặt hàng
    const itemsTbody = document.getElementById("modal-order-items-body");
    if (itemsTbody && Array.isArray(order.items)) {
        itemsTbody.innerHTML = order.items.map(item => {
            const lineTotal = (item.price || 0) * (item.quantity || 1);
            return `
                <tr>
                    <td><code>${item.id}</code></td>
                    <td><strong>${item.name}</strong></td>
                    <td>${formatPrice(item.price)}</td>
                    <td>${item.quantity}</td>
                    <td><strong>${formatPrice(lineTotal)}</strong></td>
                </tr>
            `;
        }).join("");
    }

    document.getElementById("modal-order-grand-total").textContent = formatPrice(order.total);

    const modal = document.getElementById("modal-order");
    modal.classList.add("active");
}

function closeOrderModal() {
    const modal = document.getElementById("modal-order");
    if (modal) modal.classList.remove("active");
    currentViewingOrderId = null;
}

// Cập nhật trạng thái đơn hàng
function handleSaveOrderStatus() {
    if (!currentViewingOrderId) return;

    const newStatus = document.getElementById("modal-order-change-status").value;
    let orders = getData("orders");
    const order = orders.find(o => String(o.id) === String(currentViewingOrderId));
    if (!order) return;

    const oldStatus = order.status;
    order.status = newStatus;

    // Nếu đơn hàng bị HỦY từ trạng thái đang xử lý -> hoàn lại số lượng tồn kho
    if (newStatus === "Đã hủy" && oldStatus !== "Đã hủy") {
        let products = getData("products");
        if (Array.isArray(order.items)) {
            order.items.forEach(item => {
                const prod = products.find(p => String(p.id) === String(item.id));
                if (prod) {
                    prod.quantity += (item.quantity || 1);
                }
            });
            saveData("products", products);
            showToast(`Đã hoàn lại tồn kho cho các sản phẩm của đơn hàng #${order.id}`, "info");
        }
    }

    saveData("orders", orders);
    showToast(`Đã chuyển đơn hàng #${order.id} sang trạng thái: "${newStatus}"`, "success");

    document.getElementById("modal-order-status-badge").innerHTML = getStatusBadge(newStatus);
    renderOrderTable();
}


// ==========================================================================
// 6. TAB 4: QUẢN LÝ KHÁCH HÀNG (CUSTOMERS MANAGEMENT)
// ==========================================================================
function renderCustomerTable(customList = null) {
    const users = customList !== null ? customList : getData("users");
    const orders = getData("orders");
    const tbody = document.getElementById("customer-table-body");
    if (!tbody) return;

    if (users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted" style="text-align: center; padding: 24px;">Không có khách hàng nào!</td></tr>`;
        return;
    }

    tbody.innerHTML = users.map(user => {
        // Tính số đơn và tổng chi tiêu từ danh sách orders
        const userOrders = orders.filter(o => o.customer && (o.customer.phone === user.phone || o.customer.email === user.email));
        const orderCount = userOrders.length;
        const totalSpent = userOrders.filter(o => o.status !== "Đã hủy").reduce((sum, o) => sum + (Number(o.total) || 0), 0);

        const statusBadge = user.status === "Bị khóa"
            ? `<span class="badge badge-danger">Bị khóa</span>`
            : `<span class="badge badge-success">Hoạt động</span>`;

        return `
            <tr>
                <td><code>${user.id}</code></td>
                <td><strong>${user.name}</strong></td>
                <td>${user.phone || "--"}</td>
                <td>${user.email || "--"}</td>
                <td>${user.address || "--"}</td>
                <td><span class="badge badge-info">${orderCount} đơn</span></td>
                <td><strong>${formatPrice(totalSpent)}</strong></td>
                <td>${statusBadge}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-icon-toggle" title="${user.status === 'Bị khóa' ? 'Mở khóa' : 'Khóa tài khoản'}" onclick="handleToggleCustomerStatus('${user.id}')">
                            <i class="fa-solid ${user.status === 'Bị khóa' ? 'fa-lock-open' : 'fa-lock'}"></i>
                        </button>
                        <button class="btn-icon btn-icon-delete" title="Xóa khách hàng" onclick="handleDeleteCustomer('${user.id}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function handleCustomerFilter() {
    const keyword = (document.getElementById("cust-search").value || "").toLowerCase().trim();
    let users = getData("users");
    let filtered = users.filter(u => {
        return u.name.toLowerCase().includes(keyword) || (u.phone && u.phone.includes(keyword)) || (u.email && u.email.toLowerCase().includes(keyword));
    });
    renderCustomerTable(filtered);
}

function openCustomerModal() {
    const modal = document.getElementById("modal-customer");
    const form = document.getElementById("customer-form");
    form.reset();

    // Sinh mã KH
    const users = getData("users");
    document.getElementById("modal-cust-id").value = "KH" + String(users.length + 1).padStart(3, "0");
    modal.classList.add("active");
}

function closeCustomerModal() {
    const modal = document.getElementById("modal-customer");
    if (modal) modal.classList.remove("active");
}

function handleSaveCustomer(event) {
    event.preventDefault();
    const id = document.getElementById("modal-cust-id").value.trim();
    const name = document.getElementById("modal-cust-name").value.trim();
    const phone = document.getElementById("modal-cust-phone").value.trim();
    const email = document.getElementById("modal-cust-email").value.trim();
    const address = document.getElementById("modal-cust-address").value.trim();

    let users = getData("users");
    const newUser = {
        id: id,
        name: name,
        phone: phone,
        email: email,
        address: address,
        status: "Hoạt động",
        createdAt: getCurrentDate()
    };

    users.push(newUser);
    saveData("users", users);

    showToast(`Đã thêm khách hàng "${name}" thành công!`, "success");
    closeCustomerModal();
    renderCustomerTable();
}

function handleToggleCustomerStatus(userId) {
    let users = getData("users");
    const user = users.find(u => String(u.id) === String(userId));
    if (!user) return;

    user.status = user.status === "Bị khóa" ? "Hoạt động" : "Bị khóa";
    saveData("users", users);

    showToast(`Đã ${user.status === 'Bị khóa' ? 'khóa' : 'mở khóa'} khách hàng "${user.name}"!`, "info");
    renderCustomerTable();
}

function handleDeleteCustomer(userId) {
    let users = getData("users");
    const user = users.find(u => String(u.id) === String(userId));
    if (!user) return;

    if (!confirm(`Bạn có chắc chắn muốn xóa khách hàng "${user.name}" không?`)) return;

    users = users.filter(u => String(u.id) !== String(userId));
    saveData("users", users);

    showToast("Đã xóa khách hàng!", "error");
    renderCustomerTable();
}


// ==========================================================================
// 7. TAB 5: PHIẾU NHẬP HÀNG (IMPORTS MANAGEMENT)
// ==========================================================================
function renderImportTable(customList = null) {
    const imports = customList !== null ? customList : getData("imports");
    const tbody = document.getElementById("import-table-body");
    const summaryEl = document.getElementById("import-total-summary");
    if (!tbody) return;

    if (imports.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted" style="text-align: center; padding: 24px;">Chưa có phiếu nhập hàng nào!</td></tr>`;
        if (summaryEl) summaryEl.textContent = "Tổng tiền nhập hàng: 0 đ";
        return;
    }

    let grandTotal = 0;
    const sortedImports = [...imports].reverse();

    tbody.innerHTML = sortedImports.map(imp => {
        grandTotal += (Number(imp.total) || 0);
        return `
            <tr>
                <td><strong>#${imp.id}</strong></td>
                <td><strong>${imp.productName || imp.productId}</strong></td>
                <td><span class="badge badge-info">+${imp.quantity} chiếc</span></td>
                <td>${formatPrice(imp.importPrice)}</td>
                <td><strong>${formatPrice(imp.total)}</strong></td>
                <td>${imp.supplier || "--"}</td>
                <td>${imp.importer || "Nhật Vinh"}</td>
                <td>${imp.date || "--"}</td>
                <td>
                    <button class="btn-icon btn-icon-delete" title="Xóa phiếu" onclick="handleDeleteImport('${imp.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join("");

    if (summaryEl) {
        summaryEl.textContent = `Tổng tiền nhập hàng: ${formatPrice(grandTotal)}`;
    }
}

function handleImportFilter() {
    const keyword = (document.getElementById("import-search").value || "").toLowerCase().trim();
    let imports = getData("imports");
    let filtered = imports.filter(i => {
        return i.id.toLowerCase().includes(keyword) || (i.productName && i.productName.toLowerCase().includes(keyword));
    });
    renderImportTable(filtered);
}

function openImportModal(preselectedProductId = null) {
    const modal = document.getElementById("modal-import");
    const form = document.getElementById("import-form");
    form.reset();

    // Sinh mã phiếu nhập
    const imports = getData("imports");
    document.getElementById("import-id").value = "PN" + String(imports.length + 1).padStart(3, "0");

    populateProductSelectOptions();

    if (preselectedProductId) {
        document.getElementById("import-product-select").value = preselectedProductId;
        handleSelectImportProduct(preselectedProductId);
    } else {
        calculateImportTotal();
    }

    modal.classList.add("active");
}

function closeImportModal() {
    const modal = document.getElementById("modal-import");
    if (modal) modal.classList.remove("active");
}

function populateProductSelectOptions() {
    const select = document.getElementById("import-product-select");
    if (!select) return;

    const products = getData("products");
    select.innerHTML = `<option value="">-- Chọn sản phẩm có sẵn --</option>` +
        products.map(p => `<option value="${p.id}">${p.name} (${p.id}) - Tồn kho: ${p.quantity}</option>`).join("");
}

function handleSelectImportProduct(productId) {
    if (!productId) return;
    const products = getData("products");
    const prod = products.find(p => String(p.id) === String(productId));
    if (prod) {
        // Tự động điền giá nhập cũ để tham khảo
        document.getElementById("import-price").value = prod.costPrice || 0;
        calculateImportTotal();
    }
}

function calculateImportTotal() {
    const qty = Number(document.getElementById("import-qty").value) || 0;
    const price = Number(document.getElementById("import-price").value) || 0;
    const total = qty * price;
    const display = document.getElementById("import-total-display");
    if (display) display.textContent = formatPrice(total);
}

// Lưu phiếu nhập và TỰ ĐỘNG CỘNG TỒN KHO VÀO SẢN PHẨM
function handleSaveImport(event) {
    event.preventDefault();

    const id = document.getElementById("import-id").value.trim();
    const productId = document.getElementById("import-product-select").value;
    const quantity = Number(document.getElementById("import-qty").value) || 0;
    const importPrice = Number(document.getElementById("import-price").value) || 0;
    const supplier = document.getElementById("import-supplier").value.trim();
    const importer = document.getElementById("import-person").value.trim();

    if (!productId || quantity <= 0) {
        alert("Vui lòng chọn sản phẩm và nhập số lượng lớn hơn 0!");
        return;
    }

    let products = getData("products");
    const prod = products.find(p => String(p.id) === String(productId));
    if (!prod) {
        alert("Không tìm thấy sản phẩm trong kho!");
        return;
    }

    // 1. TỰ ĐỘNG TĂNG SỐ LƯỢNG TỒN KHO VÀ CẬP NHẬT GIÁ NHẬP
    prod.quantity += quantity;
    if (importPrice > 0) {
        prod.costPrice = importPrice; // Cập nhật lại giá nhập mới nhất
    }
    saveData("products", products);

    // 2. LƯU BẢN GHI PHIẾU NHẬP
    let imports = getData("imports");
    const newImport = {
        id: id,
        productId: prod.id,
        productName: prod.name,
        quantity: quantity,
        importPrice: importPrice,
        total: quantity * importPrice,
        supplier: supplier,
        importer: importer,
        date: getCurrentDate()
    };

    imports.push(newImport);
    saveData("imports", imports);

    showToast(`Đã nhập thêm ${quantity} chiếc "${prod.name}" vào kho!`, "success");
    closeImportModal();
    renderImportTable();
}

function handleDeleteImport(importId) {
    if (!confirm(`Bạn có chắc muốn xóa lịch sử phiếu nhập #${importId} không?`)) return;
    let imports = getData("imports");
    imports = imports.filter(i => String(i.id) !== String(importId));
    saveData("imports", imports);
    showToast("Đã xóa phiếu nhập!", "error");
    renderImportTable();
}


// ==========================================================================
// 8. TAB 6: TỒN KHO & CẢNH BÁO
// ==========================================================================
function renderInventoryTable() {
    const products = getData("products");
    const tbody = document.getElementById("inventory-table-body");
    const filterType = document.getElementById("inv-filter-type") ? document.getElementById("inv-filter-type").value : "all";

    // Thống kê
    const totalQty = products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
    const lowCount = products.filter(p => p.quantity > 0 && p.quantity <= 5).length;
    const outCount = products.filter(p => p.quantity === 0).length;

    const elTotal = document.getElementById("inv-total-quantity");
    const elLow = document.getElementById("inv-low-count");
    const elOut = document.getElementById("inv-out-count");

    if (elTotal) elTotal.textContent = totalQty;
    if (elLow) elLow.textContent = lowCount;
    if (elOut) elOut.textContent = outCount;

    if (!tbody) return;

    let displayList = products;
    if (filterType === "low") {
        displayList = products.filter(p => p.quantity > 0 && p.quantity <= 5);
    } else if (filterType === "out") {
        displayList = products.filter(p => p.quantity === 0);
    }

    if (displayList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="text-align: center; padding: 24px;">Không có sản phẩm nào phù hợp điều kiện lọc!</td></tr>`;
        return;
    }

    tbody.innerHTML = displayList.map(p => {
        let statusBadge = "";
        if (p.quantity === 0) {
            statusBadge = `<span class="badge badge-danger">Hết hàng</span>`;
        } else if (p.quantity <= 5) {
            statusBadge = `<span class="badge badge-warning">Sắp hết hàng (${p.quantity})</span>`;
        } else {
            statusBadge = `<span class="badge badge-success">Dồi dào</span>`;
        }

        const imageSrc = p.image || "images/EFB-109D-5AV.jpe";

        return `
            <tr>
                <td><code>${p.id}</code></td>
                <td><img src="${imageSrc}" alt="${p.name}" class="table-thumb" onerror="this.src='images/EFB-109D-5AV.jpe'"></td>
                <td><strong>${p.name}</strong></td>
                <td>${p.category || "Nam"}</td>
                <td><strong class="${p.quantity <= 5 ? (p.quantity === 0 ? 'text-danger' : 'text-warning') : 'text-success'}">${p.quantity} chiếc</strong></td>
                <td>${statusBadge}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="openImportModal('${p.id}')">
                        <i class="fa-solid fa-plus"></i> Nhập hàng ngay
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}


// ==========================================================================
// 9. TAB 7: GIÁ BÁN & LỢI NHUẬN
// ==========================================================================
function renderProfitTable() {
    const products = getData("products");
    const orders = getData("orders");

    // 1. Tính toán tài chính thực tế từ các đơn hàng thành công (Đã giao)
    const deliveredOrders = orders.filter(o => o.status === "Đã giao");
    let totalSales = 0;
    let totalCost = 0;

    deliveredOrders.forEach(order => {
        totalSales += (Number(order.total) || 0);
        if (Array.isArray(order.items)) {
            order.items.forEach(item => {
                const prod = products.find(p => String(p.id) === String(item.id));
                const itemCostPrice = prod ? (prod.costPrice || 0) : 0;
                totalCost += itemCostPrice * (item.quantity || 1);
            });
        }
    });

    const totalGrossProfit = totalSales - totalCost;
    const avgMargin = totalSales > 0 ? Math.round((totalGrossProfit / totalSales) * 100) : 0;

    const elSales = document.getElementById("profit-total-sales");
    const elCost = document.getElementById("profit-total-cost");
    const elProf = document.getElementById("profit-total-profit");
    const elAvg = document.getElementById("profit-margin-avg");

    if (elSales) elSales.textContent = formatPrice(totalSales);
    if (elCost) elCost.textContent = formatPrice(totalCost);
    if (elProf) elProf.textContent = formatPrice(totalGrossProfit);
    if (elAvg) elAvg.textContent = `${avgMargin}%`;

    // 2. Render bảng phân tích biên lợi nhuận trên từng mẫu đồng hồ
    const tbody = document.getElementById("profit-table-body");
    if (!tbody) return;

    tbody.innerHTML = products.map(p => {
        const cost = Number(p.costPrice) || 0;
        const sell = Number(p.price) || 0;
        const profit = sell - cost;
        const marginPercent = sell > 0 ? Math.round((profit / sell) * 100) : 0;

        let ratingBadge = "";
        if (marginPercent >= 35) {
            ratingBadge = `<span class="badge badge-success">Lợi nhuận cao</span>`;
        } else if (marginPercent >= 20) {
            ratingBadge = `<span class="badge badge-info">Lợi nhuận khá</span>`;
        } else {
            ratingBadge = `<span class="badge badge-warning">Lợi nhuận mỏng</span>`;
        }

        return `
            <tr>
                <td><code>${p.id}</code></td>
                <td><strong>${p.name}</strong></td>
                <td>${formatPrice(cost)}</td>
                <td><strong>${formatPrice(sell)}</strong></td>
                <td class="text-success"><strong>+${formatPrice(profit)}</strong></td>
                <td><strong>${marginPercent}%</strong></td>
                <td>${ratingBadge}</td>
            </tr>
        `;
    }).join("");
}


// ==========================================================================
// 10. TAB 8: CÀI ĐẶT & QUẢN LÝ DỮ LIỆU LOCALSTORAGE
// ==========================================================================
function handleResetSampleData() {
    if (!confirm("Bạn có chắc chắn muốn khôi phục lại toàn bộ dữ liệu mẫu ban đầu?\nCác sản phẩm hoặc đơn hàng bạn tự thêm sẽ được đưa về mặc định.")) {
        return;
    }

    if (typeof resetAllSampleData === "function") {
        resetAllSampleData();
        showToast("Đã khôi phục dữ liệu mẫu thành công!", "success");
        renderDashboard();
    }
}

function handleClearAllData() {
    if (!confirm("CẢNH BÁO: Thao tác này sẽ xóa sạch toàn bộ localStorage của website!\nBạn có chắc chắn muốn xóa không?")) {
        return;
    }

    localStorage.clear();
    initStorage();
    showToast("Đã xóa sạch dữ liệu localStorage!", "error");
    renderDashboard();
}


// ==========================================================================
// 11. HÀM TIỆN ÍCH DÙNG TRONG ADMIN
// ==========================================================================
function getStatusBadge(status) {
    switch (status) {
        case "Chờ xử lý":
            return `<span class="badge badge-warning">Chờ xử lý</span>`;
        case "Đã xác nhận":
            return `<span class="badge badge-info">Đã xác nhận</span>`;
        case "Đang giao":
            return `<span class="badge badge-info">Đang giao</span>`;
        case "Đã giao":
            return `<span class="badge badge-success">Đã giao</span>`;
        case "Đã hủy":
            return `<span class="badge badge-danger">Đã hủy</span>`;
        default:
            return `<span class="badge badge-gray">${status || "Không rõ"}</span>`;
    }
}

