
// ĐỊNH DẠNG TIỀN TỆ
function formatPrice(number) {
    return Number(number).toLocaleString("vi-VN") + " đ";
}


// 1. HIỂN THỊ GIỎ HÀNG
function renderCart() {
    const cart = getData("cart");
    const products = getData("products");

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

            const product = products.find(
                p => String(p.id) === String(item.id)
            );

            if (!product) return "";

            const lineTotal = product.price * item.quantity;

            total += lineTotal;
            totalQuantity += item.quantity;

            return `
                <tr>
                    <td>
                        <div class="product-info">
                            <img src="${product.image}"
                                 class="product-small-img"
                                 alt="${product.name}">

                            <div class="product-info-text">
                                <strong>${product.name}</strong>
                                <span class="product-type">
                                    ${product.category || "Đồng hồ"}
                                </span>
                            </div>
                        </div>
                    </td>

                    <td class="product-price">
                        ${formatPrice(product.price)}
                    </td>

                    <td>
                        <div class="product-quantity">
                            <button class="qty-btn"
                                onclick="changeQuantity('${item.id}', -1)">
                                -
                            </button>

                            <input class="qty-input"
                                type="number"
                                min="1"
                                max="${product.quantity}"
                                value="${item.quantity}"
                                onchange="setQuantity('${item.id}', this.value)">

                            <button class="qty-btn"
                                onclick="changeQuantity('${item.id}', 1)">
                                +
                            </button>
                        </div>
                    </td>

                    <td class="product-line-total">
                        ${formatPrice(lineTotal)}
                    </td>

                    <td>
                        <button class="remove-btn"
                            onclick="deleteProduct('${item.id}')">
                            🗑
                        </button>
                    </td>
                </tr>
            `;
        }).join("");
    }

    grandTotal.textContent = formatPrice(total);

    const totalLabel = document.querySelector(".cart-total-row strong");

    if (totalLabel) {
        totalLabel.textContent =
            `Tổng tiền (${totalQuantity} sản phẩm):`;
    }

    if (typeof updateCartBadge === "function") {
        updateCartBadge();
    }
}


// 2. TĂNG / GIẢM SỐ LƯỢNG
function changeQuantity(id, amount) {
    let cart = getData("cart");
    const products = getData("products");

    const item = cart.find(
        c => String(c.id) === String(id)
    );

    const product = products.find(
        p => String(p.id) === String(id)
    );

    if (!item || !product) return;

    if (product.quantity < 1) {
        alert("Sản phẩm đã hết hàng!");
        return;
    }

    const newQty = item.quantity + amount;

    if (newQty < 1) {
        item.quantity = 1;
    } else if (newQty > product.quantity) {
        alert(`Kho chỉ còn tối đa ${product.quantity} sản phẩm!`);
        item.quantity = product.quantity;
    } else {
        item.quantity = newQty;
    }

    saveData("cart", cart);

    renderCart();
}


// 3. NHẬP TRỰC TIẾP SỐ LƯỢNG
function setQuantity(id, value) {
    let cart = getData("cart");
    const products = getData("products");

    const item = cart.find(
        c => String(c.id) === String(id)
    );

    const product = products.find(
        p => String(p.id) === String(id)
    );

    if (!item || !product) return;

    if (product.quantity < 1) {
        alert("Sản phẩm đã hết hàng!");
        item.quantity = 0;
        saveData("cart", cart);
        renderCart();
        return;
    }

    let qty = parseInt(value, 10);

    if (isNaN(qty) || qty < 1) {
        qty = 1;
    }

    if (qty > product.quantity) {
        alert(`Kho chỉ còn tối đa ${product.quantity} sản phẩm!`);
        qty = product.quantity;
    }

    item.quantity = qty;

    saveData("cart", cart);

    renderCart();
}


// 4. XÓA SẢN PHẨM
function deleteProduct(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ không?")) {
        return;
    }

    let cart = getData("cart");

    cart = cart.filter(
        item => String(item.id) !== String(id)
    );

    saveData("cart", cart);

    renderCart();
}


// 5. ĐẶT HÀNG
function checkout() {
    const cart = getData("cart");
    const products = getData("products");

    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }

    const name = document.getElementById("cust-name").value.trim();
    const phone = document.getElementById("cust-phone").value.trim();
    const address = document.getElementById("cust-address").value.trim();
    const email = document.getElementById("cust-email").value.trim();

    // KIỂM TRA THÔNG TIN
    if (!name || !phone || !address) {
        alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
        return;
    }

    if (!/^[0-9]{10,11}$/.test(phone)) {
        alert("Số điện thoại không hợp lệ!");
        return;
    }

    // KIỂM TRA TỒN KHO
    for (let item of cart) {
        const prod = products.find(
            p => String(p.id) === String(item.id)
        );

        if (!prod || prod.quantity < item.quantity) {
            alert(
                `Sản phẩm "${prod ? prod.name : item.id}" không đủ tồn kho!`
            );
            return;
        }
    }

    // PHƯƠNG THỨC THANH TOÁN
    const paymentInput = document.querySelector(
        'input[name="payment"]:checked'
    );

    const paymentMethod = paymentInput
        ? paymentInput.value
        : "COD";

    // TẠO CHI TIẾT ĐƠN HÀNG
    const orderItems = cart.map(item => {
        const prod = products.find(
            p => String(p.id) === String(item.id)
        );

        return {
            id: prod.id,
            name: prod.name,
            price: prod.price,
            quantity: item.quantity
        };
    });

    const total = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // XÁC NHẬN ĐẶT HÀNG
    const confirmOrder = confirm(
        "XÁC NHẬN ĐẶT HÀNG\n\n" +
        "Khách hàng: " + name + "\n" +
        "Số điện thoại: " + phone + "\n" +
        "Địa chỉ: " + address + "\n" +
        "Tổng thanh toán: " + formatPrice(total)
    );

    if (!confirmOrder) return;

    // TẠO ĐƠN HÀNG
    const order = {
        id: "DH_" + Date.now(),

        customer: {
            name: name,
            phone: phone,
            address: address,
            email: email
        },

        items: orderItems,
        total: total,
        paymentMethod: paymentMethod,
        status: "Chờ xử lý",
        date: new Date().toLocaleString("vi-VN")
    };

    // LƯU ĐƠN HÀNG
    const orders = getData("orders");

    orders.push(order);

    saveData("orders", orders);

    // TRỪ TỒN KHO
    cart.forEach(item => {
        const prod = products.find(
            p => String(p.id) === String(item.id)
        );

        if (prod) {
            prod.quantity -= item.quantity;
        }
    });

    saveData("products", products);

    // XÓA GIỎ HÀNG
    saveData("cart", []);

    alert(
        "Đặt hàng thành công!\n" +
        "Mã đơn hàng: " + order.id
    );

    document.querySelector(".shipping-form").reset();

    renderCart();
}


// 6. KHỞI TẠO TRANG
document.addEventListener("DOMContentLoaded", function () {
    renderCart();

    const checkoutBtn = document.getElementById("checkout-btn");

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", checkout);
    }
});
