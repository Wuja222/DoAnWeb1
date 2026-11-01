// storage.js
// Các hàm dùng chung để đọc/ghi dữ liệu trong localStorage.
// Chuẩn quy ước nhóm Đồ Án Web 1: WatchStore.

function getData(key) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : [];
    } catch (error) {
        console.error(`Không thể đọc dữ liệu "${key}":`, error);
        return [];
    }
}

function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(`Không thể lưu dữ liệu "${key}":`, error);
        return false;
    }
}

function removeData(key) {
    localStorage.removeItem(key);
}

// Khởi tạo một khóa nếu khóa đó chưa tồn tại.
// Không ghi đè dữ liệu người dùng đã có.
function initStorage() {
    const defaultData = {
        products: [],
        cart: [],
        users: [],
        orders: [],
        imports: []
    };

    Object.entries(defaultData).forEach(([key, value]) => {
        if (localStorage.getItem(key) === null) {
            saveData(key, value);
        }
    });
}

