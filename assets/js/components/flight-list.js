let flights = [];
let filteredFlights = []; // Biến lưu trữ kết quả lọc
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

async function getAllFlights() {
    try {
        const flightData = await callAPI('https://symfony-9z0y.onrender.com/flights/bulk', 'GET');
        flights = flightData;
        console.log('Danh sách chuyến bay:', flights);

        filteredFlights = flights; // Ban đầu, hiển thị tất cả các chuyến bay
        renderFlightList(filteredFlights); // Hiển thị danh sách chuyến bay khi mới vào trang
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
    }
}

// Hàm hiển thị danh sách chuyến bay
function renderFlightList(flightsList) {
    const passengerCount = document.getElementById('passengerCount').value;
    const flightList = document.getElementById('flight-list');
    flightList.innerHTML = ''; // Xóa danh sách hiện tại

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedFlights = flightsList.slice(start, end);

    if (paginatedFlights.length === 0) {
        flightList.innerHTML = `<p class="text-gray-500">Không tìm thấy chuyến bay phù hợp.</p>`;
        renderPagination(0); // Không hiển thị phân trang nếu không có chuyến bay
        return;
    }

    paginatedFlights.forEach(flight => {
        flightList.innerHTML += `
            <button class="flex bg-white p-4  rounded-lg shadow-md w-full flex items-center space-x-4">
                <button class="flex" style="width:20%">
                    <!-- Ảnh Hãng -->
                    <img src="${flight.image}" alt="${flight.brand}" class="w-10 h-10 me-4 rounded-full mr-4 mt-2">

                    <!-- Thông tin hãng -->
                    <h3 class="w-1/3 text-lg font-semibold">${flight.brand}</h3>
                </button>

                <!-- Thông tin chuyến bay -->
                <button class="flex items-center" style="width:50%">
                    <button lass="flex-1" style="width:40%">
                    <p class="text-sm text-gray-500">${flight.startLocation} </p>
                    <p class="text-sm text-gray-500">${formatDateToYMDHIS(flight.startTime)}</p>
                    </button>

                    <svg class="w-6 h-6 text-gray-800 dark:text-white mr-4 ml-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 12H5m14 0-4 4m0-4-4-4" />
                    </svg>


                    <button class="flex-1 p-6" style="width:30%">
                    <p class="text-sm text-gray-500">${flight.endLocation} </p>
                    <p class="text-sm text-gray-500">${formatDateToYMDHIS(flight.endTime)}</p>
                    </button>
                </button>

                <!-- Giá và Nút chọn -->
                <button class="flex items-center" style="width:20%">
                    <p class="text-sm text-gray-700 mt-2" style="width:90%; font-size: 16px;"> ${flight.price.toLocaleString()} VNĐ</p>

                    <a href="flight-detail.html?id=${flight.id}&passengerCount=${passengerCount}"
                    class="bg-indigo-600 text-white py-1 px-3 rounded-lg mt-2 hover:bg-indigo-700 inline-block">Chọn</a>
                </button>
            </button>
        `;
    });

    renderPagination(flightsList.length);
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
            renderFlightList(filteredFlights);
        }
    });

    document.getElementById('next-btn').addEventListener('click', function (e) {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            renderFlightList(filteredFlights);
        }
    });
}

// Hàm lọc và sắp xếp chuyến bay theo các tiêu chí
function applyFilter() {
    const startLocation = document.getElementById('startLocation').value.trim().toLowerCase();
    const endLocation = document.getElementById('endLocation').value.trim().toLowerCase();
    const startDate = document.getElementById('startDate').value.trim();
    const passengerCount = parseInt(document.getElementById('passengerCount').value.trim(), 10);

    let isValid = true;

    // Kiểm tra các tiêu chí tìm kiếm
    if (startLocation === '') {
        document.getElementById('error-startLocation').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('error-startLocation').classList.add('hidden');
    }

    if (endLocation === '') {
        document.getElementById('error-endLocation').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('error-endLocation').classList.add('hidden');
    }

    if (startDate === '') {
        document.getElementById('error-startDate').classList.remove('hidden');
        isValid = false;
    } else {
        document.getElementById('error-startDate').classList.add('hidden');
    }

    // Nếu có lỗi, dừng lại và không tiếp tục tìm kiếm
    if (!isValid) {
        return;
    }

    const brand = document.getElementById('brand').value.trim().toLowerCase();
    const price = parseInt(document.getElementById('price').value.trim(), 10);

    // Lọc danh sách chuyến bay theo tiêu chí tìm kiếm
    filteredFlights = flights.filter(flight => {
        const matchesStartLocation = flight.startLocation.toLowerCase().includes(startLocation);
        const matchesEndLocation = flight.endLocation.toLowerCase().includes(endLocation);
        const matchesStartDate = new Date(flight.startTime).toISOString().slice(0, 10) === startDate;
        const matchesBrand = brand === '' || flight.brand.toLowerCase().includes(brand);
        const matchesPrice = isNaN(price) || flight.price <= price;

        return matchesStartLocation && matchesEndLocation && matchesStartDate && matchesBrand && matchesPrice;
    });

    currentPage = 1; // Đặt lại trang khi lọc lại
    renderFlightList(filteredFlights);
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

// Hàm để tăng số lượng hành khách
document.getElementById('increment-button').addEventListener('click', function () {
    let passengerCount = document.getElementById('passengerCount');
    let value = parseInt(passengerCount.value);
    passengerCount.value = isNaN(value) ? 1 : value + 1;
});

// Hàm để giảm số lượng hành khách
document.getElementById('decrement-button').addEventListener('click', function () {
    let passengerCount = document.getElementById('passengerCount');
    let value = parseInt(passengerCount.value);
    if (value > 1) {
        passengerCount.value = value - 1;
    }
});

// Hàm xử lý khi thay đổi lựa chọn sắp xếp
document.getElementById('sort').addEventListener('change', applyFilter);

// Gọi hàm để lấy dữ liệu khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    getAllFlights();
});
