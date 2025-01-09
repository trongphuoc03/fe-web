// Hàm lấy dữ liệu từ file JSON
let hotels = [];

Promise.all([
    fetch('assets/data/hotel.json').then(response => response.json()),
    fetch('assets/data/feedback.json').then(response => response.json())
])
.then(([hotelData, feedbackData]) => {
    hotels = hotelData;
    
    // Gán rating trung bình cho từng khách sạn
    hotels.forEach(hotel => {
        hotel.averageRating = calculateAverageRating(feedbackData, hotel.id);
    });
    
    renderHotelList(hotels); // Hiển thị toàn bộ khách sạn khi mới vào trang
})
.catch(error => console.error('Lỗi khi tải dữ liệu:', error));

// Hàm tính trung bình rating
function calculateAverageRating(feedbacks, hotelId) {
    const hotelFeedbacks = feedbacks.filter(fb => fb.hotel_id === hotelId);
    if (hotelFeedbacks.length === 0) return '0.0'; // Nếu không có phản hồi, trả về 0.0

    const sum = hotelFeedbacks.reduce((acc, fb) => acc + fb.rating, 0);
    return (sum / hotelFeedbacks.length).toFixed(1); // Làm tròn đến 1 chữ số thập phân
}

// Hàm hiển thị danh sách khách sạn
function renderHotelList(filteredHotels) {
    const hotelList = document.getElementById('hotel-list');
    hotelList.innerHTML = ''; // Xóa danh sách hiện tại

    filteredHotels.forEach(hotel => {
        hotelList.innerHTML += `
            <div class="bg-white p-4 rounded-lg shadow-md">
                <img src="${hotel.images[0]}" alt="${hotel.name}" class="rounded-lg mb-4">
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
}

// Hàm lọc danh sách khách sạn theo tiêu chí tìm kiếm
function applyFilter() {
    const location = document.getElementById('location').value.toLowerCase();
    const price = document.getElementById('price').value;

    const filteredHotels = hotels.filter(hotel => {
        return (
            (location === '' || hotel.location.toLowerCase().includes(location)) &&
            (price === '' || hotel.price <= price)
        );
    });

    renderHotelList(filteredHotels);
}

// Hàm áp dụng sắp xếp dựa trên lựa chọn
function applySort() {
    const sortOption = document.getElementById('sort').value;
    let sortedHotels = [...hotels]; // Sao chép mảng để không làm thay đổi dữ liệu gốc

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

    renderHotelList(sortedHotels);
}
