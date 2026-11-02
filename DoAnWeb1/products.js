(function () {
    // Lấy mã sản phẩm từ URL, khởi tạo dữ liệu và đọc danh sách dùng chung.
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    initData();
    const products = getData("products");

    const message = document.getElementById("product-message");
    const productDetail = document.getElementById("product-detail");
    const quantityInput = document.getElementById("product-cart-quantity");
    const addToCartButton = document.getElementById("add-to-cart-button");
    const cartMessage = document.getElementById("cart-message");
    const image = document.getElementById("product-image");
    const imageMessage = document.getElementById("product-image-message");

    // Tìm sản phẩm bằng ID sau khi loại bỏ khoảng trắng thừa.
    function findProductById(id) {
        const normalizedId = String(id ?? "").trim();

        if (!normalizedId) {
            return undefined;
        }

        return products.find(function (item) {
            return item && item.id !== undefined &&
                String(item.id).trim() === normalizedId;
        });
    }

    // Dừng sớm nếu URL thiếu ID, không có sản phẩm hoặc sản phẩm không hoạt động.
    if (!productId || !productId.trim()) {
        message.textContent = "URL chưa có mã sản phẩm.";
        return;
    }

    const product = findProductById(productId);

    if (!product) {
        message.textContent = "Không tìm thấy sản phẩm.";
        return;
    }

    if (product.isActive !== true) {
        message.textContent = "Sản phẩm hiện không còn kinh doanh.";
        return;
    }

    // Hiển thị thông tin sản phẩm; giá dùng hàm định dạng có sẵn của dự án.
    message.textContent = "";
    productDetail.hidden = false;

    document.getElementById("product-name").textContent = product.name;

    document.getElementById("product-price").textContent =
        formatPrice(product.price);

    document.getElementById("product-description").textContent =
        product.description;

    document.getElementById("product-category").textContent =
        product.category;

    document.getElementById("product-quantity").textContent =
        product.quantity;

    // Hiển thị ảnh theo đường dẫn trong thuộc tính image.
    if (product.image) {
        image.alt = product.name;

        image.addEventListener("error", function () {
            image.hidden = true;
            imageMessage.hidden = false;
        });

        image.src = product.image;
        image.hidden = false;
    } else {
        imageMessage.hidden = false;
    }

    // Giới hạn số lượng mua theo tồn kho hiện tại.
    const stock = Number(product.quantity);
    const availableStock = Number.isFinite(stock) ? Math.max(0, stock) : 0;

    quantityInput.max = String(availableStock);
    quantityInput.disabled = availableStock < 1;
    addToCartButton.disabled = availableStock < 1;

    if (availableStock < 1) {
        quantityInput.value = "0";
        cartMessage.textContent = "Sản phẩm hiện đã hết hàng.";
    }

    // Thêm vào khóa cart theo cấu trúc mà cart.js đang sử dụng: { id, quantity }.
    addToCartButton.addEventListener("click", function () {
        const requestedQuantity = Number(quantityInput.value);

        if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
            cartMessage.textContent =
                "Vui lòng nhập số lượng nguyên lớn hơn 0.";
            return;
        }

        const cart = getData("cart");

        if (!Array.isArray(cart)) {
            cartMessage.textContent = "Dữ liệu giỏ hàng không hợp lệ.";
            return;
        }

        const existingItem = cart.find(function (item) {
            return item && String(item.id) === String(product.id);
        });

        const currentQuantity = existingItem
            ? Number(existingItem.quantity)
            : 0;

        if (!Number.isInteger(currentQuantity) || currentQuantity < 0) {
            cartMessage.textContent =
                "Số lượng sản phẩm trong giỏ không hợp lệ.";
            return;
        }

        if (currentQuantity + requestedQuantity > availableStock) {
            cartMessage.textContent =
                `Kho chỉ còn tối đa ${availableStock} sản phẩm.`;
            return;
        }

        if (existingItem) {
            existingItem.quantity = currentQuantity + requestedQuantity;
        } else {
            cart.push({
                id: product.id,
                quantity: requestedQuantity
            });
        }

        if (saveData("cart", cart)) {
            cartMessage.textContent = "Đã thêm sản phẩm vào giỏ hàng.";
        } else {
            cartMessage.textContent = "Không thể lưu sản phẩm vào giỏ hàng.";
        }
    });
})();