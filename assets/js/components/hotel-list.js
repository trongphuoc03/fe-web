let hotels = [];
let filteredHotels = []; // Biến lưu trữ kết quả lọc
let currentPage = 1; // Trang hiện tại
const itemsPerPage = 6; // Số mục trên mỗi trang

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

async function getAllHotels() {
    try {
        const hotelData = await callAPI('https://symfony-9z0y.onrender.com/hotels/bulk', 'GET');
        hotels = hotelData;
        console.log('Danh sách khách sạn:', hotels);

        // Fetch feedback for each hotel
        for (const hotel of hotels) {
            const feedbackData = await callAPI(`https://symfony-9z0y.onrender.com/feedbacks/hotel/${hotel.id}`, 'GET');
            hotel.averageRating = calculateAverageRating(feedbackData, hotel.id);
        }

        filteredHotels = hotels; // Ban đầu, hiển thị tất cả các khách sạn
        renderHotelList(filteredHotels); // Hiển thị danh sách khách sạn khi mới vào trang
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
}

// Hàm tính trung bình rating
function calculateAverageRating(feedbacks, hotelId) {
    const hotelFeedbacks = feedbacks.filter(fb => fb.hotel_id === hotelId);
    if (hotelFeedbacks.length === 0) return '0.0'; // Nếu không có phản hồi, trả về 0.0

    const sum = hotelFeedbacks.reduce((acc, fb) => acc + fb.rating, 0);
    return (sum / hotelFeedbacks.length).toFixed(1); // Làm tròn đến 1 chữ số thập phân
}

// Hàm hiển thị danh sách khách sạn
function renderHotelList(hotelsList) {
    const hotelList = document.getElementById('hotel-list');
    hotelList.innerHTML = ''; // Xóa danh sách hiện tại

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedHotels = hotelsList.slice(start, end);

    if (paginatedHotels.length === 0) {
        hotelList.innerHTML = `<p class="text-gray-500">Không tìm thấy khách sạn phù hợp.</p>`;
        renderPagination(0); // Không hiển thị phân trang nếu không có khách sạn
        return;
    }

    paginatedHotels.forEach(hotel => {
        hotelList.innerHTML += `
            <div class="bg-white p-4 rounded-lg shadow-md">
                <img src="${hotel.imgUrl}" alt="${hotel.name}" class="rounded-lg mb-4">
                <h3 class="text-lg font-semibold">
                    <a href="hotel-detail.html?id=${hotel.id}" class="text-indigo-600 hover:underline">
                        ${hotel.name}
                    </a>
                </h3>
                
                <div class="rating flex items-center">
                    <span class="text-yellow-500 text-lg font-semibold mr-2">${hotel.averageRating}</span>
                    <svg class="w-5 h-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 15l-5.5 3.3 1.1-6.3L.4 7.7l6.4-.9L10 1.4l2.2 5.4 6.4.9-4.6 4.3 1.1 6.3z"/>
                    </svg>
                </div>

                <p class="text-sm mt-2 text-gray-700">${hotel.price.toLocaleString()} VNĐ</p>
            </div>
        `;
    });

    renderPagination(hotelsList.length);
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
            renderHotelList(filteredHotels);
        }
    });

    document.getElementById('next-btn').addEventListener('click', function (e) {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            renderHotelList(filteredHotels);
        }
    });
}

// Hàm lọc danh sách khách sạn theo tiêu chí tìm kiếm
function applyFilter() {
    const location = document.getElementById('location').value.toLowerCase();
    const price = document.getElementById('price').value;

    filteredHotels = hotels.filter(hotel => {
        return (
            (location === '' || hotel.location.toLowerCase().includes(location)) &&
            (price === '' || hotel.price <= price)
        );
    });

    currentPage = 1; // Đặt lại trang khi lọc lại
    renderHotelList(filteredHotels);
}

// Hàm áp dụng sắp xếp dựa trên lựa chọn
function applySort() {
    const sortOption = document.getElementById('sort').value;
    let sortedHotels = [...filteredHotels]; // Sử dụng danh sách đã lọc để sắp xếp

    switch (sortOption) {
        case 'price-asc':
            sortedHotels.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedHotels.sort((a, b) => b.price - a.price);
            break;
        case 'rating-desc':
            sortedHotels.sort((a, b) => b.averageRating - a.averageRating);
            break;
        default:
            break; // Không làm gì nếu chọn "Mặc định"
    }

    filteredHotels = sortedHotels; // Cập nhật lại danh sách đã sắp xếp
    currentPage = 1; // Đặt lại trang khi sắp xếp lại
    renderHotelList(filteredHotels);
}

// Gọi hàm để lấy dữ liệu khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    getAllHotels();
});
