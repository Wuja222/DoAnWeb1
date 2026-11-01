# KẾ HOẠCH TRIỂN KHAI (PLAN) - MODULE ADMIN TRANG WEB BÁN ĐỒNG HỒ
**Thực hiện:** Nhật Vinh  
**Môi trường:** Thư mục `/vinh`  
**Mục tiêu:** Xây dựng hoàn chỉnh trang quản trị, liên kết dữ liệu với toàn bộ hệ thống (index, products, cart), chuẩn hóa code Web 1 dễ hiểu, có tài liệu hướng dẫn thi vấn đáp.

---

## CÁC GIAI ĐOẠN THỰC HIỆN (PHASES)

### Giai đoạn 1: Chuẩn bị Dữ liệu & Nền tảng (Data & Storage)
- [x] Tạo cấu trúc thư mục `/vinh` và chuẩn bị tài nguyên hình ảnh (`/vinh/images/`).
- [ ] Xây dựng file `storage.js` và `data.js` chuẩn trong `/vinh`:
  - Đồng bộ hoàn toàn với `storage.js` của nhóm (`getData`, `saveData`, `removeData`, `initStorage`).
  - Mở rộng dữ liệu mẫu trong `data.js` để có đầy đủ 5 khóa: `products`, `cart`, `users`, `orders`, `imports`. Đảm bảo khi mở trang Admin lần đầu tiên là có ngay số liệu thống kê sinh động (khớp với mockup: 20 sản phẩm / 4 sản phẩm mẫu, danh sách khách hàng, đơn hàng có trạng thái).
- [ ] Tạo file `common.js` chứa các hàm tiện ích dùng chung: format tiền tệ, định dạng ngày tháng, thông báo toast hoặc alert thân thiện.

### Giai đoạn 2: Xây dựng Giao diện HTML (admin.html)
- [ ] Khung layout chính:
  - Sidebar cố định bên trái với Menu 8 tab: Tổng quan, Sản phẩm, Đơn hàng, Khách hàng, Nhập hàng, Tồn kho, Lợi nhuận, Cài đặt.
  - Header trên cùng hiển thị tiêu đề tab hiện tại và thông tin Admin ("Nhật Vinh").
  - Khung nội dung chính (`main`) chia thành các section tương ứng với từng tab (ẩn/hiện bằng CSS class `active`).
- [ ] Xây dựng cấu trúc HTML cho từng tab:
  - **Tab Tổng quan:** 4 thẻ KPI cards, Bảng đơn hàng gần đây, Bảng tồn kho cảnh báo, Biểu đồ doanh thu dạng thanh cột.
  - **Tab Sản phẩm:** Toolbar (Nút Thêm, ô tìm kiếm, dropdown danh mục, lọc trạng thái) và Bảng danh sách sản phẩm.
  - **Tab Đơn hàng:** Toolbar lọc theo trạng thái đơn và Bảng danh sách đơn hàng.
  - **Tab Khách hàng:** Toolbar tìm kiếm và Bảng quản lý khách hàng.
  - **Tab Phiếu nhập:** Toolbar tạo phiếu nhập và Bảng lịch sử nhập hàng.
  - **Tab Tồn kho:** Thẻ tóm tắt và Bảng cảnh báo kho.
  - **Tab Giá bán & Lợi nhuận:** Thẻ phân tích tài chính và Bảng chi tiết lợi nhuận từng sản phẩm.
  - **Tab Cài đặt:** Các nút tiện ích quản lý dữ liệu demo.
- [ ] Xây dựng các Modal Dialog (Popup):
  - Modal Thêm / Sửa sản phẩm.
  - Modal Chi tiết đơn hàng & cập nhật trạng thái.
  - Modal Lập phiếu nhập hàng.
  - Modal Thêm / Sửa khách hàng.

### Giai đoạn 3: Thiết kế Giao diện CSS (admin.css)
- [ ] Thiết lập bảng màu chuẩn (`:root` variables) theo tông màu sang trọng: Dark Navy (`#0f172a`, `#1e293b`), Trắng/Xám sáng (`#f8fafc`, `#ffffff`), Điểm nhấn xanh dương/vàng kim (`#2563eb`, `#d97706`).
- [ ] Layout Flexbox & Grid cho Sidebar, Header và Nội dung chính.
- [ ] Thiết kế các thẻ chỉ số KPI (Cards) có icon, số liệu to rõ, màu nền dịu mắt.
- [ ] Thiết kế bảng dữ liệu (Table) hiện đại: header nổi bật, đường kẻ mờ, hover đổi màu dòng, căn chỉnh số tiền sang phải.
- [ ] Thiết kế các huy hiệu trạng thái (Badges):
  - Xanh lá: "Đang bán", "Đã giao", "Hoạt động".
  - Vàng cam: "Chờ xử lý", "Sắp hết hàng".
  - Xanh dương: "Đang giao", "Đã xác nhận".
  - Đỏ: "Đã hủy", "Đã ẩn", "Hết hàng", "Bị khóa".
- [ ] Thiết kế Modal popup đẹp mắt: nền tối phủ mờ (overlay), hộp thoại nổi giữa màn hình, hiệu ứng trượt nhẹ.
- [ ] Responsive căn bản: Đảm bảo giao diện không vỡ khi co giãn màn hình hoặc mở trên máy tính bảng/laptop.

### Giai đoạn 4: Viết Logic JavaScript (admin.js)
- [ ] **Module 1: Điều hướng Tab (Tab Navigation):**
  - Chuyển đổi qua lại giữa các section bằng class `active`.
  - Cập nhật tiêu đề trang tương ứng.
- [ ] **Module 2: Tổng quan Dashboard:**
  - Tính toán tự động: Tổng số SP, Tổng số KH, Tổng đơn hàng, Tổng doanh thu.
  - Render bảng 5 đơn hàng gần nhất.
  - Render bảng top 5 sản phẩm cảnh báo tồn kho.
  - Render biểu đồ cột doanh thu 7 ngày hoặc theo danh mục bằng CSS flexbox thuần.
- [ ] **Module 3: Quản lý Sản phẩm (CRUD):**
  - `renderProductTable(data)`: Hiển thị bảng sản phẩm.
  - Tìm kiếm sản phẩm theo tên / mã.
  - Lọc theo danh mục & trạng thái `isActive`.
  - `openProductModal(id)`: Mở form thêm mới (nếu id rỗng) hoặc sửa (nếu có id).
  - `saveProduct()`: Validate dữ liệu và lưu vào `products` trong localStorage.
  - `toggleProductStatus(id)`: Đổi nhanh trạng thái `isActive` (Ẩn/Hiện).
  - `deleteProduct(id)`: Xác nhận xóa sản phẩm khỏi kho.
- [ ] **Module 4: Quản lý Đơn hàng:**
  - `renderOrderTable(filterStatus, keyword)`: Hiển thị danh sách đơn hàng.
  - `viewOrderDetail(orderId)`: Mở modal xem thông tin khách, chi tiết các món hàng và tổng tiền.
  - `updateOrderStatus(orderId, newStatus)`: Cập nhật trạng thái đơn, xử lý hoàn tồn kho nếu đơn bị Hủy.
- [ ] **Module 5: Quản lý Khách hàng:**
  - `renderCustomerTable()`: Hiển thị danh sách khách hàng từ `users`.
  - `toggleCustomerStatus(userId)`: Khóa hoặc mở khóa khách hàng.
- [ ] **Module 6: Phiếu nhập hàng (Imports):**
  - `renderImportTable()`: Hiển thị lịch sử các phiếu nhập.
  - `openImportModal()`: Mở form tạo phiếu nhập mới.
  - `saveImport()`: Tự động cộng số lượng tồn kho `quantity` vào sản phẩm tương ứng trong `products` và lưu phiếu vào `imports`.
- [ ] **Module 7: Tồn kho & Cảnh báo:**
  - Lọc các sản phẩm tồn kho <= 5 hoặc = 0.
  - Nút chuyển nhanh sang nhập hàng.
- [ ] **Module 8: Phân tích Giá bán & Lợi nhuận:**
  - Tính lợi nhuận từng sản phẩm: `price - costPrice`.
  - Tính tổng lợi nhuận gộp từ các đơn hàng thành công.
- [ ] **Module 9: Cài đặt & Khôi phục mẫu:**
  - Reset dữ liệu về ban đầu khi cần thuyết trình.

### Giai đoạn 5: Kiểm thử Toàn diện & Tối ưu
- [ ] Kiểm tra liên thông dữ liệu:
  - Khi thêm/sửa/xóa sản phẩm ở Admin -> kiểm tra xem localStorage có cập nhật đúng cấu trúc nhóm quy định không.
  - Khi đặt hàng từ `cart.html` -> kiểm tra xem `admin.html` có hiện ngay đơn hàng mới và doanh thu tăng lên không.
  - Khi tạo phiếu nhập ở Admin -> kiểm tra số lượng tồn kho của sản phẩm có tăng lên không.
- [ ] Kiểm tra các tình huống ngoại lệ (Edge Cases):
  - Dữ liệu trống (chưa có đơn nào, chưa có sản phẩm nào).
  - Nhập số âm hoặc để trống ô bắt buộc khi thêm sản phẩm.
  - Xóa sản phẩm đang có trong đơn hàng.

### Giai đoạn 6: Tài liệu Hướng dẫn Vấn đáp cho Nhật Vinh
- [ ] Tạo file `vinh/HUONG_DAN_THUYET_MINH.md`:
  - Giải thích cấu trúc mã nguồn.
  - Giải thích từng hàm quan trọng trong `admin.js`.
  - Bộ 10 câu hỏi giáo viên hay hỏi nhất khi bảo vệ đồ án Web 1 và câu trả lời mẫu chi tiết.

