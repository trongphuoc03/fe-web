// Hàm lấy dữ liệu từ file JSON
let activities = [];

Promise.all([
    fetch('assets/data/activities.json').then(response => response.json()),
    fetch('assets/data/feedback.json').then(response => response.json())
])
.then(([activityData, feedbackData]) => {
    activities = activityData;
    
    // Gán rating trung bình cho từng hoạt động
    activities.forEach(activity => {
        activity.averageRating = calculateAverageRating(feedbackData, activity.id);
    });
    
    renderActivityList(activities); // Hiển thị toàn bộ hoạt động khi mới vào trang
})
.catch(error => console.error('Lỗi khi tải dữ liệu:', error));

// Hàm tính trung bình rating
function calculateAverageRating(feedbacks, activityId) {
    const activityFeedbacks = feedbacks.filter(fb => fb.activity_id === activityId);
    if (activityFeedbacks.length === 0) return '0.0'; // Nếu không có phản hồi, trả về 0.0

    const sum = activityFeedbacks.reduce((acc, fb) => acc + fb.rating, 0);
    return (sum / activityFeedbacks.length).toFixed(1); // Làm tròn đến 1 chữ số thập phân
}

// Hàm hiển thị danh sách hoạt động
function renderActivityList(filteredActivities) {
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = ''; // Xóa danh sách hiện tại

    if (filteredActivities.length === 0) {
        activityList.innerHTML = `<p class="text-gray-500">Không tìm thấy hoạt động phù hợp.</p>`;
        return;
    }

    filteredActivities.forEach(activity => {
        activityList.innerHTML += `
            <div class="bg-white p-4 rounded-lg shadow-md w-full">
                <div class="flex">
                    <!-- Ảnh hoạt động -->
                    <img src="${activity.images[0]}" alt="${activity.name}" class="w-32 h-32 object-cover rounded-lg mr-4">

                    
                    <!-- Thông tin hoạt động -->
                    <div class="flex-1">
                        <h3 class="text-xl font-semibold">
                            <a href="activity-detail.html?id=${activity.id}" class="text-indigo-600 hover:underline">${activity.name}</a>
                        </h3>
                        
                        
                        <!-- Hiển thị đánh giá trung bình -->
                        <div class="rating flex items-center">
                            <span class="text-yellow-500 text-lg font-semibold mr-2">${activity.averageRating}</span>
                            <svg class="w-5 h-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 15l-5.5 3.3 1.1-6.3L.4 7.7l6.4-.9L10 1.4l2.2 5.4 6.4.9-4.6 4.3 1.1 6.3z"/>
                            </svg>
                        </div>
                        
                        <p class="text-sm text-gray-700 mt-2"> ${activity.price.toLocaleString()} VNĐ</p>
                        
                    </div>
                </div>
            </div>
        `;
    });
}

// Hàm lọc danh sách hoạt động theo điều kiện
function applyFilter() {
    const location = document.getElementById('location').value.trim().toLowerCase();
    const price = parseInt(document.getElementById('price').value.trim(), 10);

    const filteredActivities = activities.filter(activity => {
        const matchesLocation = activity.location.toLowerCase().includes(location); // Lọc theo địa điểm
        const matchesPrice = isNaN(price) || activity.price <= price; // Lọc theo giá

        return matchesLocation && matchesPrice;
    });

    // Hiển thị danh sách hoạt động đã lọc
    renderActivityList(filteredActivities);
}

// Hàm sắp xếp danh sách hoạt động
function applySort() {
    const sortOption = document.getElementById('sort').value;

    let sortedActivities = [...activities];

    switch (sortOption) {
        case 'price-asc':
            sortedActivities.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedActivities.sort((a, b) => b.price - a.price);
            break;
        case 'rating-desc':
            sortedActivities.sort((a, b) => b.averageRating - a.averageRating);
            break;
        default:
            break;
    }

    // Hiển thị danh sách hoạt động đã sắp xếp
    renderActivityList(sortedActivities);
}
