let activities = [];
let filteredActivities = []; // Biến lưu trữ kết quả lọc
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

async function getAllActivities() {
    try {
        const activityData = await callAPI('https://symfony-9z0y.onrender.com/activities/bulk', 'GET');
        activities = activityData;
        console.log('Danh sách hoạt động:', activities);

        // Fetch feedback for each activity
        for (const activity of activities) {
            const feedbackData = await callAPI(`https://symfony-9z0y.onrender.com/feedbacks/activity/${activity.activityId}`, 'GET');
            console.log(`Phản hồi cho hoạt động ${activity.activityId}:`)
            activity.averageRating = calculateAverageRating(feedbackData, activity.activityId);
        }

        filteredActivities = activities; // Ban đầu, hiển thị tất cả các hoạt động
        renderActivityList(filteredActivities); // Hiển thị danh sách hoạt động khi mới vào trang
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
}

// Hàm tính trung bình rating
function calculateAverageRating(feedbacks, activityId) {
    const activityFeedbacks = feedbacks.filter(fb => fb.activity_id === activityId);
    if (activityFeedbacks.length === 0) return '0.0'; // Nếu không có phản hồi, trả về 0.0

    const sum = activityFeedbacks.reduce((acc, fb) => acc + fb.rating, 0);
    return (sum / activityFeedbacks.length).toFixed(1); // Làm tròn đến 1 chữ số thập phân
}

// Hàm hiển thị danh sách hoạt động
function renderActivityList(activitiesList) {
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = ''; // Xóa danh sách hiện tại

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedActivities = activitiesList.slice(start, end);

    if (paginatedActivities.length === 0) {
        activityList.innerHTML = `<p class="text-gray-500">Không tìm thấy hoạt động phù hợp.</p>`;
        renderPagination(0); // Không hiển thị phân trang nếu không có hoạt động
        return;
    }

    paginatedActivities.forEach(activity => {
        activityList.innerHTML += `
            <div class="bg-white p-4 rounded-lg shadow-md w-full">
                <div class="flex">
                    <!-- Ảnh hoạt động -->
                    <img src="${activity.imgUrl}" alt="${activity.name}" class="w-32 h-32 object-cover rounded-lg mr-4">

                    <!-- Thông tin hoạt động -->
                    <div class="flex-1">
                        <h3 class="text-xl font-semibold">
                            <a href="activity-detail.html?id=${activity.activityId}" class="text-indigo-600 hover:underline">${activity.name}</a>
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

    renderPagination(activitiesList.length);
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
            renderActivityList(filteredActivities);
        }
    });

    document.getElementById('next-btn').addEventListener('click', function (e) {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            renderActivityList(filteredActivities);
        }
    });
}

// Hàm lọc danh sách hoạt động theo điều kiện
function applyFilter() {
    const location = document.getElementById('location').value.trim().toLowerCase();
    const price = parseInt(document.getElementById('price').value.trim(), 10);

    filteredActivities = activities.filter(activity => {
        const matchesLocation = activity.location.toLowerCase().includes(location); // Lọc theo địa điểm
        const matchesPrice = isNaN(price) || activity.price <= price; // Lọc theo giá

        return matchesLocation && matchesPrice;
    });

    currentPage = 1; // Đặt lại trang khi lọc lại
    renderActivityList(filteredActivities);
}

// Hàm sắp xếp danh sách hoạt động
function applySort() {
    const sortOption = document.getElementById('sort').value;

    let sortedActivities = [...filteredActivities]; // Sử dụng danh sách đã lọc để sắp xếp

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

    filteredActivities = sortedActivities; // Cập nhật lại danh sách đã sắp xếp
    currentPage = 1; // Đặt lại trang khi sắp xếp lại
    renderActivityList(filteredActivities);
}

// Gọi hàm để lấy dữ liệu khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    getAllActivities();
});
