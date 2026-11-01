# ĐẶC TẢ YÊU CẦU KỸ THUẬT - TRANG QUẢN TRỊ (ADMIN)
**Dự án:** Website Bán Đồng Hồ (WatchStore)  
**Phân công thực hiện:** Nhật Vinh (admin.html, admin.js, admin.css)  
**Mục tiêu:** Xây dựng module Admin hoàn chỉnh, đẹp mắt theo mẫu thiết kế, code chuẩn môn Web 1 (HTML/CSS/JS thuần, dễ hiểu, dễ giải thích khi thi/vấn đáp).

---

## 1. QUY ƯỚC CHUNG CỦA DỰ ÁN (BẮT BUỘC TUÂN THỦ)

### 1.1. Cấu trúc đối tượng Sản phẩm (Product)
Tất cả các thành viên (Khang, Hoàng Gia, Anh Tú, Nhật Vinh, Gia Huy) dùng chung cấu trúc:
- `id` (String): Mã đồng hồ (ví dụ: `"DH001"`, `"DH002"`)
- `name` (String): Tên đồng hồ (ví dụ: `"Casio MTP-V001"`, `"EFB-109D-5AV"`)
- `category` (String): Loại đồng hồ (`"Nam"`, `"Nữ"`, `"Thể thao"`)
- `price` (Number): Giá bán (VNĐ)
- `costPrice` (Number): Giá nhập (VNĐ)
- `quantity` (Number): Số lượng tồn kho
- `image` (String): Đường dẫn ảnh (ví dụ: `"images/EFB-109D-5AV.jpe"`)
- `description` (String): Mô tả đồng hồ
- `isActive` (Boolean): `true` = đang bán, `false` = đã ẩn (không hiển thị ngoài trang chủ)

### 1.2. Các khóa lưu trữ localStorage
Hệ thống sử dụng duy nhất `localStorage` (không dùng CSDL backend):
1. `products`: Mảng chứa các sản phẩm.
2. `cart`: Mảng chứa giỏ hàng `[{ id, quantity }]`.
3. `users`: Mảng chứa danh sách tài khoản / khách hàng `[{ id, name, phone, email, address, status, createdAt }]`.
4. `orders`: Mảng chứa các đơn hàng khách đã đặt từ `cart.html`.
5. `imports`: Mảng chứa các phiếu nhập hàng vào kho.

### 1.3. Các hàm dùng chung (từ storage.js & data.js)
- `getData(key)`: Lấy mảng dữ liệu từ localStorage theo key (trả về `[]` nếu chưa có).
- `saveData(key, data)`: Lưu mảng dữ liệu vào localStorage theo key.
- `formatPrice(number)`: Định dạng số thành tiền Việt Nam (ví dụ: `850.000 đ`).

---

## 2. KIẾN TRÚC GIAO DIỆN TRANG ADMIN (admin.html)

Giao diện được thiết kế theo đúng hình mẫu (Mockup 4 - Trang quản trị):
- **Cột bên trái (Sidebar):** 
  - Logo/Thương hiệu: `Admin WatchStore`
  - Menu điều hướng các tab chức năng:
    1. **Tổng quan** (Dashboard)
    2. **Quản lý sản phẩm** (Products)
    3. **Quản lý đơn hàng** (Orders)
    4. **Quản lý khách hàng** (Customers)
    5. **Phiếu nhập hàng** (Imports)
    6. **Tồn kho & Cảnh báo** (Inventory)
    7. **Giá bán & Lợi nhuận** (Profit & Pricing)
    8. **Cài đặt & Dữ liệu** (Settings / Reset data)
    9. **Đăng xuất / Về trang chủ** (Về `index.html`)
- **Phần nội dung chính (Main Content):**
  - **Header trên cùng:** Hiển thị tên trang hiện tại, ô tìm kiếm nhanh, thông tin người đăng nhập ("Xin chào, admin" + Avatar).
  - **Vùng hiển thị nội dung theo Tab:** Bấm menu bên sidebar để chuyển đổi qua lại giữa các màn hình chức năng mà không cần tải lại trang (Single Page Admin).

---

## 3. CHI TIẾT TỪNG CHỨC NĂNG

### 3.1. Tab 1: Tổng quan (Dashboard)
- **4 Thẻ thống kê (Stats Cards):**
  1. *Tổng sản phẩm:* Số lượng sản phẩm có trong kho (`products.length`).
  2. *Tổng khách hàng:* Số khách hàng trong hệ thống (`users.length` hoặc lọc unique từ `orders`).
  3. *Tổng đơn hàng:* Số đơn hàng đã phát sinh (`orders.length`).
  4. *Doanh thu:* Tổng tiền các đơn hàng đã thanh toán / đã giao (hoặc toàn bộ đơn hợp lệ).
- **Bảng "Đơn hàng gần đây":**
  - Hiển thị 5 đơn hàng mới nhất (Mã ĐH, Tên khách hàng, Ngày đặt, Tổng tiền, Trạng thái, Nút xem chi tiết).
- **Bảng "Tồn kho cảnh báo":**
  - Hiển thị các sản phẩm có số lượng tồn kho thấp (<= 5 cái) hoặc hết hàng (0 cái) để admin nắm bắt kịp thời.
- **Biểu đồ doanh thu trực quan:**
  - Thiết kế biểu đồ cột bằng CSS Flexbox đơn giản (không cần thư viện nặng), trực quan hóa doanh thu theo ngày/tháng/danh mục.

### 3.2. Tab 2: Quản lý sản phẩm
- **Thanh công cụ (Toolbar):**
  - Nút "+ Thêm sản phẩm mới" (mở Modal Form).
  - Ô tìm kiếm sản phẩm theo tên hoặc mã SP.
  - Bộ lọc sản phẩm theo Danh mục (Tất cả, Nam, Nữ, Thể thao).
  - Bộ lọc theo Trạng thái (Tất cả, Đang bán, Đã ẩn).
- **Bảng danh sách sản phẩm:**
  - Cột: Mã SP | Ảnh | Tên đồng hồ | Loại | Giá bán | Giá nhập | Tồn kho | Trạng thái | Thao tác.
  - Trạng thái hiển thị badge xanh lá (Đang bán) hoặc xám/đỏ (Đã ẩn).
  - Cột thao tác gồm:
    - Nút Sửa: Mở Modal chỉnh sửa thông tin.
    - Nút Ẩn / Hiện: Đổi nhanh `isActive` giữa `true` và `false`.
    - Nút Xóa: Hỏi xác nhận trước khi xóa sản phẩm khỏi `products`.
- **Modal Thêm / Sửa sản phẩm:**
  - Form gồm các ô: Mã SP (tự sinh hoặc nhập), Tên đồng hồ, Loại (Nam, Nữ, Thể thao), Giá bán, Giá nhập, Số lượng ban đầu, Đường dẫn ảnh (cho phép chọn ảnh mẫu hoặc nhập URL), Mô tả.

### 3.3. Tab 3: Quản lý đơn hàng
- **Bộ lọc & Tìm kiếm:**
  - Lọc theo trạng thái: Tất cả, Chờ xử lý, Đã xác nhận, Đang giao, Đã giao, Đã hủy.
  - Tìm kiếm theo Mã đơn hàng hoặc Tên/SĐT khách hàng.
- **Bảng danh sách đơn hàng:**
  - Cột: Mã đơn | Khách hàng | Số điện thoại | Ngày đặt | Tổng tiền | Phương thức TT | Trạng thái | Thao tác.
- **Chức năng cập nhật trạng thái đơn:**
  - Cho phép admin cập nhật tiến trình: Chờ xử lý -> Đã xác nhận -> Đang giao -> Đã giao (hoặc Đã hủy).
  - Nếu chuyển sang "Đã hủy", có tùy chọn tự động hoàn lại số lượng sản phẩm vào kho `products`.
- **Modal Xem chi tiết đơn hàng:**
  - Hiển thị đầy đủ: Thông tin người nhận, SĐT, Địa chỉ, Danh sách các đồng hồ đã mua (Ảnh, Tên, Đơn giá, Số lượng, Thành tiền), Ghi chú, Trạng thái.

### 3.4. Tab 4: Quản lý khách hàng
- **Nguồn dữ liệu:** Khóa `users` trong localStorage, tự động đồng bộ khi có khách mới đặt hàng.
- **Chức năng:**
  - Xem danh sách: Mã KH, Tên, SĐT, Địa chỉ, Số đơn đã mua, Tổng chi tiêu.
  - Tìm kiếm khách hàng theo tên hoặc số điện thoại.
  - Khóa / Mở khóa tài khoản khách hàng.

### 3.5. Tab 5: Quản lý phiếu nhập hàng (Imports)
- **Nguồn dữ liệu:** Khóa `imports` trong localStorage.
- **Chức năng:**
  - Nút "+ Tạo phiếu nhập hàng":
    - Chọn sản phẩm cần nhập (tự động điền giá nhập cũ hoặc cho phép cập nhật giá nhập mới).
    - Nhập số lượng cần nhập thêm vào kho.
    - Nhập nhà cung cấp, người lập phiếu (Nhật Vinh).
  - **Tự động hóa kho:** Khi bấm "Lưu phiếu nhập", hệ thống tự động:
    1. Tăng số lượng `quantity` của sản phẩm tương ứng trong mảng `products`.
    2. Cập nhật `costPrice` mới (nếu có).
    3. Thêm một bản ghi vào mảng `imports`.
    4. Lưu lại localStorage.
  - Bảng lịch sử nhập hàng: Mã phiếu | Mã & Tên SP | Số lượng nhập | Đơn giá nhập | Thành tiền | Ngày nhập | Người nhập.

### 3.6. Tab 6: Tồn kho & Cảnh báo
- Phân loại rõ ràng:
  - Hàng còn nhiều (> 10 cái).
  - Hàng sắp hết (1 -> 5 cái) -> Hiển thị cảnh báo màu vàng cam.
  - Hàng hết tồn kho (0 cái) -> Hiển thị cảnh báo màu đỏ.
- Nút bấm nhanh: "Nhập hàng ngay" mở sẵn form nhập hàng cho sản phẩm đó.

### 3.7. Tab 7: Báo cáo Giá bán & Lợi nhuận
- Phân tích chi tiết:
  - Lợi nhuận trên từng sản phẩm = `Giá bán (price) - Giá nhập (costPrice)`.
  - Tỷ suất lợi nhuận (%) = `((Giá bán - Giá nhập) / Giá bán) * 100`.
  - Doanh thu thực tế: Tính từ các đơn hàng "Đã giao".
  - Tổng lợi nhuận gộp thực tế: Tổng doanh thu đã giao - Tổng giá vốn tương ứng.
- Rất dễ giải thích công thức với giáo viên chấm thi!

### 3.8. Tab 8: Cài đặt & Khôi phục dữ liệu
- Nút "Khôi phục dữ liệu mẫu ban đầu": Giúp reset nhanh về bộ dữ liệu mẫu chuẩn (bao gồm 4-6 sản phẩm, đơn hàng mẫu, phiếu nhập mẫu) để phục vụ chấm điểm và chạy demo.
- Nút "Xóa toàn bộ dữ liệu": Dọn dẹp localStorage khi cần thử nghiệm từ con số 0.

---

## 4. TIÊU CHUẨN CODE (CHO MÔN WEB 1)

1. **HTML5:**
   - Cấu trúc rõ ràng, dùng semantic tags (`<header>`, `<aside>`, `<nav>`, `<main>`, `<section>`, `<table>`, `<dialog>` / `<div class="modal">`).
   - Có đầy đủ ID và Class ngữ nghĩa rõ ràng, không viết tắt khó hiểu.

2. **CSS3:**
   - Dùng CSS Variables cho màu sắc chủ đạo (`--bg-sidebar: #1e293b`, `--primary: #2563eb`, `--text-dark: #1e293b`, v.v.).
   - Dùng Flexbox và CSS Grid đơn giản.
   - Hiệu ứng hover nhẹ nhàng, bảng biểu căn lề ngay ngắn, có scroll ngang khi xem trên màn hình nhỏ.

3. **JavaScript:**
   - Dùng hàm rõ ràng (`function showTab(tabId)`, `function renderProducts()`, `function openProductModal()`, v.v.).
   - Xử lý mảng bằng các phương thức cơ bản: `forEach`, `filter`, `find`, `map`, `reduce`.
   - Mỗi hàm có chú thích tiếng Việt giải thích chức năng để Nhật Vinh tự tin thuyết minh.
   - Tuyệt đối không dùng thư viện ngoài phức tạp (như React, Angular, jQuery nặng hay ChartJS). Tất cả dùng DOM thuần của trình duyệt!

