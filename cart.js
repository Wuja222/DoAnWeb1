// Định dạng tiền tệ Việt Nam (VD: 850000 -> "850.000 đ")
function formatPrice(number) {
    return Number(number).toLocaleString("vi-VN") + " đ";
}

// 1. Hiển thị danh sách sản phẩm trong giỏ hàng
function renderCart() {
    const cart = StorageAPI.getCart();
    const products = StorageAPI.getProducts();
    const cartTable = document.getElementById("cart-items-table");
    const grandTotal = document.getElementById("cart-grand-total");

    if (!cartTable || !grandTotal) return;

    let total = 0;
    let totalQuantity = 0;

    if (cart.length === 0) {
        cartTable.innerHTML = `
            <tr>
                <td colspan="5" class="empty-cart">
                    Giỏ hàng của bạn đang trống!
                </td>
            </tr>
        `;
    } else {
        cartTable.innerHTML = cart.map(item => {
            // Lấy dữ liệu chi tiết của sản phẩm từ bảng products
            const product = products.find(p => String(p.id) === String(item.id));
            
            // Nếu sản phẩm không tồn tại hoặc bị xóa
            if (!product) return "";

            const lineTotal = product.price * item.quantity;
            total += lineTotal;
            totalQuantity += item.quantity;

            return `
                <tr>
                    <td>
                        <div class="product-info">
                            <img src="${product.image}" class="product-small-img" alt="${product.name}">
                            <div class="product-info-text">
                                <strong>${product.name}</strong>
                                <span class="product-type">${product.category || "Đồng hồ"}</span>
                            </div>
                        </div>
                    </td>
                    <td class="product-price">${formatPrice(product.price)}</td>
                    <td>
                        <div class="product-quantity">
                            <button class="qty-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
                            <input class="qty-input" type="number" min="1" max="${product.quantity}" value="${item.quantity}" onchange="setQuantity('${item.id}', this.value)">
                            <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
                        </div>
                    </td>
                    <td class="product-line-total">${formatPrice(lineTotal)}</td>
                    <td>
                        <button class="remove-btn" title="Xóa" onclick="deleteProduct('${item.id}')">🗑</button>
                    </td>
                </tr>
            `;
        }).join("");
    }

    grandTotal.textContent = formatPrice(total);

    const totalLabel = document.querySelector(".cart-total-row strong");
    if (totalLabel) {
        totalLabel.textContent = `Tổng tiền (${totalQuantity} sản phẩm)`;
    }

    updateCartBadge();
}

// 2. Tăng / giảm số lượng (+ / -)
function changeQuantity(id, amount) {
    let cart = StorageAPI.getCart();
    const products = StorageAPI.getProducts();
    const item = cart.find(c => String(c.id) === String(id));
    const product = products.find(p => String(p.id) === String(id));

    if (!item || !product) return;

    const newQty = item.quantity + amount;

    if (newQty < 1) {
        item.quantity = 1;
    } else if (newQty > product.quantity) {
        alert(`Kho chỉ còn tối đa ${product.quantity} sản phẩm!`);
        item.quantity = product.quantity;
    } else {
        item.quantity = newQty;
    }

    StorageAPI.saveCart(cart);
    renderCart();
}

// 3. Nhập trực tiếp số lượng vào ô input
function setQuantity(id, value) {
    let cart = StorageAPI.getCart();
    const products = StorageAPI.getProducts();
    const item = cart.find(c => String(c.id) === String(id));
    const product = products.find(p => String(p.id) === String(id));

    if (!item || !product) return;

    let qty = parseInt(value, 10);
    if (isNaN(qty) || qty < 1) qty = 1;

    if (qty > product.quantity) {
        alert(`Kho chỉ còn tối đa ${product.quantity} sản phẩm!`);
        qty = product.quantity;
    }

    item.quantity = qty;
    StorageAPI.saveCart(cart);
    renderCart();
}

// 4. Xóa sản phẩm khỏi giỏ hàng
function deleteProduct(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ không?")) return;

    let cart = StorageAPI.getCart();
    cart = cart.filter(item => String(item.id) !== String(id));

    StorageAPI.saveCart(cart);
    renderCart();
}

// 5. Xử lý đặt hàng: Kiểm tra thông tin -> Trừ kho -> Lưu đơn hàng
function checkout() {
    const cart = StorageAPI.getCart();
    const products = StorageAPI.getProducts();

    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }

    const name = document.getElementById("cust-name").value.trim();
    const phone = document.getElementById("cust-phone").value.trim();
    const address = document.getElementById("cust-address").value.trim();

    // Kiểm tra các trường bắt buộc
    if (!name || !phone || !address) {
        alert("Vui lòng nhập đầy đủ các thông tin bắt buộc (*)");
        return;
    }

    // Kiểm tra số điện thoại (10 - 11 số)
    if (!/^[0-9]{10,11}$/.test(phone)) {
        alert("Số điện thoại không hợp lệ (yêu cầu 10 - 11 chữ số)!");
        return;
    }

    // Kiểm tra tồn kho trước khi chốt đơn
    for (let item of cart) {
        const prod = products.find(p => String(p.id) === String(item.id));
        if (!prod || prod.quantity < item.quantity) {
            alert(`Sản phẩm "${prod ? prod.name : item.id}" không đủ tồn kho để giao!`);
            return;
        }
    }

    const paymentInput = document.querySelector('input[name="payment"]:checked');
    const paymentMethod = paymentInput ? (paymentInput.value === "COD" ? "Thanh toán khi nhận hàng (COD)" : "Chuyển khoản ngân hàng") : "Thanh toán khi nhận hàng (COD)";

    // Tạo danh sách sản phẩm chi tiết của đơn
    const orderItems = cart.map(item => {
        const prod = products.find(p => String(p.id) === String(item.id));
        return {
            id: prod.id,
            name: prod.name,
            price: prod.price,
            quantity: item.quantity
        };
    });

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const confirmOrder = confirm(
        "XÁC NHẬN ĐẶT HÀNG\n\n" +
        "Khách hàng: " + name + "\n" +
        "Số điện thoại: " + phone + "\n" +
        "Địa chỉ: " + address + "\n" +
        "Tổng thanh toán: " + formatPrice(total)
    );

    if (!confirmOrder) return;

    // 1. Tạo đơn hàng mới theo quy ước của nhóm
    const order = {
        id: "DH_" + Date.now(),
        customer: { name, phone, address },
        items: orderItems,
        total: total,
        paymentMethod: paymentMethod,
        status: "Chờ xử lý",
        date: new Date().toLocaleString("vi-VN")
    };

    // 2. Lưu vào mảng orders
    const orders = StorageAPI.getOrders();
    orders.push(order);
    StorageAPI.saveOrders(orders);

    // 3. Trừ tồn kho trong mảng products
    cart.forEach(item => {
        const prod = products.find(p => String(p.id) === String(item.id));
        if (prod) {
            prod.quantity -= item.quantity;
        }
    });
    StorageAPI.saveProducts(products);

    // 4. Xóa sạch giỏ hàng
    StorageAPI.saveCart([]);

    alert("Đặt hàng thành công!\nMã đơn hàng của bạn là: " + order.id);

    // Reset lại form và vẽ lại giao diện
    document.querySelector(".shipping-form").reset();
    renderCart();
}

// 6. Gán sự kiện khi tải trang
document.addEventListener("DOMContentLoaded", function () {
    renderCart();

    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", checkout);
    }
});