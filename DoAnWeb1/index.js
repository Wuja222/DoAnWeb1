// TẠO DỮ LIỆU MẪU

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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
  },
];

const MIN_PRICE = 0;
const MAX_PRICE = 999999999999;

if (!localStorage.getItem("products")) {
  localStorage.setItem("products", JSON.stringify(sampleProducts));
}

let products = JSON.parse(localStorage.getItem("products")) || [];
const featuredProducts = new Map(
  sampleProducts.map((product) => [product.id, product]),
);

products = products.map((product) => {
  const featuredProduct = featuredProducts.get(product.id);

  return featuredProduct
    ? {
        ...product,
        name: featuredProduct.name,
        category: featuredProduct.category,
        price: featuredProduct.price,
        image: featuredProduct.image,
      }
    : product;
});
localStorage.setItem("products", JSON.stringify(products));

function formatPrice(price) {
  return price.toLocaleString("vi-VN") + " VNĐ";
}

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

  document.getElementById("productList").innerHTML = html;
}

function searchProduct() {
  let keyword = document.getElementById("searchInput").value.toLowerCase();

  let result = products.filter(
    (product) =>
      product.name.toLowerCase().includes(keyword) && product.isActive,
  );

  renderProducts(result);
}

function filterProducts() {
  let category = document.getElementById("categoryFilter").value;
  let minPrice = Number(document.getElementById("minPrice").value);
  let maxPrice = Number(document.getElementById("maxPrice").value);
  let priceFilterError = document.getElementById("priceFilterError");

  if (
    !Number.isFinite(minPrice) ||
    !Number.isFinite(maxPrice) ||
    minPrice < MIN_PRICE ||
    maxPrice > MAX_PRICE ||
    minPrice > maxPrice
  ) {
    priceFilterError.textContent =
      `Vui lòng nhập khoảng từ ${formatPrice(MIN_PRICE)} đến ${formatPrice(MAX_PRICE)}, ` +
      "trong đó giá từ không lớn hơn giá đến.";
    document.getElementById("productList").innerHTML = "";
    return;
  }

  priceFilterError.textContent = "";

  let result = products.filter(
    (product) =>
      product.isActive &&
      (category === "" || product.category === category) &&
      product.price >= minPrice &&
      product.price <= maxPrice,
  );

  renderProducts(result);
}

function updateMaxPrice(value) {
  const maxPrice = Number(value);

  document.getElementById("maxPrice").value = maxPrice;
  document.getElementById("maxPriceDisplay").textContent =
    formatPrice(maxPrice);
  filterProducts();
}

function syncMaxPrice(value) {
  const maxPrice = Number(value);

  if (Number.isFinite(maxPrice)) {
    document.getElementById("maxPriceRange").value = Math.min(
      Math.max(maxPrice, MIN_PRICE),
      MAX_PRICE,
    );
    document.getElementById("maxPriceDisplay").textContent =
      formatPrice(maxPrice);
  }

  filterProducts();
}

function resetFilter() {
  document.getElementById("categoryFilter").value = "";
  document.getElementById("minPrice").value = MIN_PRICE;
  document.getElementById("maxPrice").value = MAX_PRICE;
  document.getElementById("maxPriceRange").value = MAX_PRICE;
  document.getElementById("maxPriceDisplay").textContent =
    formatPrice(MAX_PRICE);
  document.getElementById("priceFilterError").textContent = "";

  document.getElementById("searchInput").value = "";

  renderProducts(products);
}

function viewDetail(id) {
  alert("Mã đồng hồ: " + id);

  // Sau này có thể chuyển sang:
  // location.href =
  // "product-detail.html?id=" + id;
}

renderProducts(products);
