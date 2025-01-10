let combos = [];
let filteredCombos = []; // Biến lưu trữ kết quả lọc
let currentPage = 1; // Trang hiện tại
const itemsPerPage = 5; // Số mục trên mỗi trang

async function callAPI(endpoint, method, body = null, isFile = false) {
    const token = localStorage.getItem('token');
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    if (!isFile) {
        headers['Content-Type'] = 'application/json';
    }

    const options = {
        method: method,
        headers: headers,
    };

    if (body) {
        options.body = isFile ? body : JSON.stringify(body);
    }

    const response = await fetch(endpoint, options);
    if (response.ok) {
        return await response.json();
    } else {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
}

async function getAllCombos() {
    try {
        const comboData = await callAPI('https://symfony-9z0y.onrender.com/combos/bulk', 'GET');
        combos = comboData;
        console.log('Danh sách combo:', combos);

        // Fetch feedback for each combo
        for (const combo of combos) {
            const feedbackData = await callAPI(`https://symfony-9z0y.onrender.com/feedbacks/combo/${combo.comboId}`, 'GET');
            combo.averageRating = calculateAverageRating(feedbackData, combo.comboId);
        }

        filteredCombos = combos; // Ban đầu, hiển thị tất cả các combo
        renderComboList(filteredCombos); // Hiển thị danh sách combo khi mới vào trang
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
}

// Hàm tính trung bình rating
function calculateAverageRating(feedbacks, comboId) {
    const comboFeedbacks = feedbacks.filter(fb => fb.combo_id === comboId);
    if (comboFeedbacks.length === 0) return '0.0'; // Nếu không có phản hồi, trả về 0.0

    const sum = comboFeedbacks.reduce((acc, fb) => acc + fb.rating, 0);
    return (sum / comboFeedbacks.length).toFixed(1); // Làm tròn đến 1 chữ số thập phân
}

// Hàm hiển thị danh sách gói combo
function renderComboList(combosList) {
    const comboList = document.getElementById('combo-list');
    comboList.innerHTML = ''; // Xóa danh sách hiện tại

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedCombos = combosList.slice(start, end);

    if (paginatedCombos.length === 0) {
        comboList.innerHTML = `<p class="text-gray-500">Không tìm thấy gói combo phù hợp.</p>`;
        renderPagination(0); // Không hiển thị phân trang nếu không có combo
        return;
    }

    paginatedCombos.forEach(combo => {
        comboList.innerHTML += `
            <div class="bg-white p-4 rounded-lg shadow-md w-full">
                <div class="flex">
                    <!-- Ảnh Gói Combo -->
                    <img src="${combo.imgUrl}" alt="${combo.name}" class="w-32 h-32 object-cover rounded-lg mr-4">
                    
                    <!-- Thông tin gói combo -->
                    <div class="flex-1">
                        <h3 class="text-xl font-semibold">
                             <a href="combo-detail.html?id=${combo.comboId}" class="text-indigo-600 hover:underline">${combo.name}</a>    
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

    renderPagination(combosList.length);
}

// Hàm phân trang
function renderPagination(totalItems) {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalItems === 0 || totalPages <= 1) {
        pagination.innerHTML = ''; // Không cần pagination nếu chỉ có 1 trang
        return;
    }

    const prevButton = `<a id="prev-btn" href="#" class="flex items-center justify-center px-3 h-8 text-sm font-medium ${currentPage === 1 ? 'text-gray-300' : 'text-gray-500'}">
        <svg class="w-3.5 h-3.5 me-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
        </svg>
    </a>`;
    const nextButton = `<a id="next-btn" href="#" class="flex items-center justify-center px-3 h-8 text-sm font-medium ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-500'}">
        <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
        </svg>
    </a>`;
    pagination.innerHTML = prevButton + nextButton;

    document.getElementById('prev-btn').addEventListener('click', function (e) {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            renderComboList(filteredCombos);
        }
    });

    document.getElementById('next-btn').addEventListener('click', function (e) {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            renderComboList(filteredCombos);
        }
    });
}

// Hàm lọc gói combo theo điều kiện
function applyFilter() {
    const averageRatingInput = document.getElementById('averageRating');
    const averageRating = averageRatingInput ? parseFloat(averageRatingInput.value.trim()) : NaN;
    const price = parseInt(document.getElementById('price').value.trim(), 10);

    filteredCombos = combos.filter(combo => {
        const matchesRating = isNaN(averageRating) || parseFloat(combo.averageRating) >= averageRating; // Lọc theo đánh giá trung bình
        const matchesPrice = isNaN(price) || combo.price <= price; // Lọc theo giá

        return matchesRating && matchesPrice;
    });

    currentPage = 1; // Đặt lại trang khi lọc lại
    renderComboList(filteredCombos);
}

// Hàm sắp xếp danh sách gói combo
function applySort() {
    const sortOption = document.getElementById('sort').value;

    let sortedCombos = [...filteredCombos]; // Sử dụng danh sách đã lọc để sắp xếp

    switch (sortOption) {
        case 'price-asc':
            sortedCombos.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedCombos.sort((a, b) => b.price - a.price);
            break;
        case 'rating-desc':
            sortedCombos.sort((a, b) => b.averageRating - a.averageRating);
            break;
        default:
            break;
    }

    filteredCombos = sortedCombos; // Cập nhật lại danh sách đã sắp xếp
    currentPage = 1; // Đặt lại trang khi sắp xếp lại
    renderComboList(filteredCombos);
}

// Hàm định dạng thời gian
function formatDateToYMDHIS(datetimeLocalValue) {
    const date = new Date(datetimeLocalValue);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Gọi hàm để lấy dữ liệu khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    getAllCombos();
});
