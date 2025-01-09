// Hàm lấy dữ liệu từ file JSON
let combos = [];

Promise.all([
    fetch('assets/data/combos.json').then(response => response.json()),
    fetch('assets/data/feedback.json').then(response => response.json())
])
.then(([comboData, feedbackData]) => {
    combos = comboData;
    
    // Gán rating trung bình cho từng combo
    combos.forEach(combo => {
        combo.averageRating = calculateAverageRating(feedbackData, combo.id);
    });
    
    renderComboList(combos); // Hiển thị toàn bộ combo khi mới vào trang
})
.catch(error => console.error('Lỗi khi tải dữ liệu:', error));

// Hàm tính trung bình rating
function calculateAverageRating(feedbacks, comboId) {
    const comboFeedbacks = feedbacks.filter(fb => fb.combo_id === comboId);
    if (comboFeedbacks.length === 0) return '0.0'; // Nếu không có phản hồi, trả về 0.0

    const sum = comboFeedbacks.reduce((acc, fb) => acc + fb.rating, 0);
    return (sum / comboFeedbacks.length).toFixed(1); // Làm tròn đến 1 chữ số thập phân
}

// Hàm hiển thị danh sách gói combo
function renderComboList(filteredCombos) {
    const comboList = document.getElementById('combo-list');
    comboList.innerHTML = ''; // Xóa danh sách hiện tại

    if (filteredCombos.length === 0) {
        comboList.innerHTML = `<p class="text-gray-500">Không tìm thấy gói combo phù hợp.</p>`;
        return;
    }

    filteredCombos.forEach(combo => {
        comboList.innerHTML += `
            <div class="bg-white p-4 rounded-lg shadow-md w-full">
                <div class="flex">
                    <!-- Ảnh Gói Combo -->
                    <img src="${combo.images[0]}" alt="${combo.name}" class="w-32 h-32 object-cover rounded-lg mr-4">
                    
                    <!-- Thông tin gói combo -->
                    <div class="flex-1">
                        <h3 class="text-xl font-semibold">
                             <a href="combo-detail.html?id=${combo.id}" class="text-indigo-600 hover:underline">${combo.name}</a>    
                        
                        </h3>
                        
                        
                        <!-- Hiển thị đánh giá trung bình -->
                        <div class="rating  flex items-center">
                            <span class="text-yellow-500 text-lg font-semibold mr-2">${combo.averageRating}</span>
                            <svg class="w-5 h-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 15l-5.5 3.3 1.1-6.3L.4 7.7l6.4-.9L10 1.4l2.2 5.4 6.4.9-4.6 4.3 1.1 6.3z"/>
                            </svg>
                        </div>
                        <p class="text-sm text-gray-700 mt-2"> ${combo.price.toLocaleString()} VNĐ</p>
                       
                    </div>
                </div>
            </div>
        `;
    });
}

// Hàm lọc gói combo theo điều kiện
function applyFilter() {
    const location = document.getElementById('location').value.trim().toLowerCase();
    const price = parseInt(document.getElementById('price').value.trim(), 10);

    const filteredCombos = combos.filter(combo => {
        const matchesLocation = combo.location.toLowerCase().includes(location); // Lọc theo tên gói combo
        const matchesPrice = isNaN(price) || combo.price <= price; // Lọc theo giá

        return matchesLocation && matchesPrice;
    });

    // Hiển thị danh sách gói combo đã lọc
    renderComboList(filteredCombos);
}

// Hàm sắp xếp danh sách gói combo
function applySort() {
    const sortOption = document.getElementById('sort').value;

    let sortedCombos = [...combos];

    switch (sortOption) {
        case 'price-asc':
            sortedCombos.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedCombos.sort((a, b) => b.price - a.price);
            break;
        case 'rating-desc':
            sortedCombos.sort((a, b) => b.averageRating - a.averageRating);  // Sửa lại từ sortedHotels thành sortedCombos
            break;
        default:
            break;
    }

    // Hiển thị danh sách gói combo đã sắp xếp
    renderComboList(sortedCombos);
}
