// KHỞI TẠO VÀ LẤY DỮ LIỆU

initData();

let products = getData("products");

// ĐỊNH DẠNG GIÁ TIỀN

// RENDER DANH SÁCH SẢN PHẨM

function renderProducts(data) {
    let html = "";

    data.forEach((product) => {
        if (!product.isActive) return;

        html += `
            <div class="product-card">

                ${
                    product.image
                    ? `<img src="${product.image}" alt="${product.name}">`
                    : `<div class="no-image">Chưa có ảnh</div>`
                }

                <div class="product-info">

                    <h4>${product.name}</h4>

                    <p class="category">
                        ${product.category}
                    </p>

                    <p class="price">
                        ${formatPrice(product.price)}
                    </p>

                    <button onclick="viewDetail('${product.id}')">
                        Xem chi tiết
                    </button>

                </div>

            </div>
        `;
    });

    document.getElementById("productList").innerHTML =
        html || "<p>Không có sản phẩm nào!</p>";
}

// TÌM KIẾM SẢN PHẨM

function searchProduct() {
    let keyword = document
        .getElementById("searchInput")
        .value.toLowerCase();

    let result = products.filter(
        (product) =>
            product.name.toLowerCase().includes(keyword) &&
            product.isActive
    );

    renderProducts(result);
}

// LỌC THEO DANH MỤC

function filterProducts() {
    let category = document.getElementById("categoryFilter").value;

    if (category === "") {
        renderProducts(products);
        return;
    }

    let result = products.filter(
        (product) =>
            product.category === category &&
            product.isActive
    );

    renderProducts(result);
}

// ĐẶT LẠI BỘ LỌC

function resetFilter() {
    document.getElementById("categoryFilter").value = "";
    document.getElementById("searchInput").value = "";

    renderProducts(products);
}

// XEM CHI TIẾT SẢN PHẨM

function viewDetail(id) {
    alert("Mã đồng hồ: " + id);
}

// HIỂN THỊ SẢN PHẨM KHI MỞ TRANG

renderProducts(products);
