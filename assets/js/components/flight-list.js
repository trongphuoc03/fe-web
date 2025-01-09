// Dữ liệu chuyến bay
let flights = [];
fetch('assets/data/flight.json')
    .then(response => response.json())
    .then(data => {
        flights = data;
        renderFlightList(flights); // Hiển thị toàn bộ chuyến bay khi mới vào trang
    })
    .catch(error => console.error('Lỗi khi tải dữ liệu:', error));

// Hàm hiển thị danh sách chuyến bay
function renderFlightList(filteredFlights) {
    const passengerCount = document.getElementById('passengerCount').value;
    const flightList = document.getElementById('flight-list');
    flightList.innerHTML = ''; // Xóa danh sách hiện tại

    if (filteredFlights.length === 0) {
        flightList.innerHTML = `<p class="text-gray-500">Không tìm thấy chuyến bay phù hợp.</p>`;
        return;
    }

    filteredFlights.forEach(flight => {
        flightList.innerHTML += `
            <div class="flex bg-white p-4  rounded-lg shadow-md w-full flex items-center space-x-4">
                <div class="flex" style="width:20%">
                    <!-- Ảnh Hãng -->
                    <img src="${flight.image}" alt="${flight.brand}" class="w-10 h-10 me-4 rounded-full mr-4 mt-2">

                    <!-- Thông tin hãng -->
                    <h3 class="w-1/3 text-lg font-semibold">${flight.brand}</h3>
                </div>

                <!-- Thông tin chuyến bay -->
                <div class="flex items-center" style="width:50%">
                    <div lass="flex-1" style="width:40%">
                    <p class="text-sm text-gray-500">${flight.startLocation} </p>
                    <p class="text-sm text-gray-500">${new Date(flight.startTime).toLocaleString()}</p>
                    </div>

                    <svg class="w-6 h-6 text-gray-800 dark:text-white mr-4 ml-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 12H5m14 0-4 4m4-4-4-4" />
                    </svg>


                    <div class="flex-1 p-6" style="width:30%">
                    <p class="text-sm text-gray-500">${flight.endLocation} </p>
                    <p class="text-sm text-gray-500">${new Date(flight.endTime).toLocaleString()}</p>
                    </div>
                </div>

                <!-- Giá và Nút chọn -->
                <div class="flex items-center" style="width:20%">
                    <p class="text-sm text-gray-700 mt-2" style="width:90%; font-size: 16px;"> ${flight.price.toLocaleString()} VNĐ</p>

                    <a href="flight-detail.html?id=${flight.id}&passengerCount=${passengerCount}"
                    class="bg-indigo-600 text-white py-1 px-3 rounded-lg mt-2 hover:bg-indigo-700 inline-block">Chọn</a>
                </div>
            </div>
        `;
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
    const filteredFlights = flights.filter(flight => {
        const matchesStartLocation = flight.startLocation.toLowerCase().includes(startLocation);
        const matchesEndLocation = flight.endLocation.toLowerCase().includes(endLocation);
        const matchesStartDate = new Date(flight.startTime).toISOString().slice(0, 10) === startDate;
        const matchesBrand = brand === '' || flight.brand.toLowerCase().includes(brand);
        const matchesPrice = isNaN(price) || flight.price <= price;

        return matchesStartLocation && matchesEndLocation && matchesStartDate && matchesBrand && matchesPrice;
    });

    // Lấy giá trị sắp xếp từ dropdown
    const sortValue = document.getElementById('sort').value;

    if (sortValue === 'price-asc') {
        filteredFlights.sort((a, b) => a.price - b.price); // Giá tăng dần
    } else if (sortValue === 'price-desc') {
        filteredFlights.sort((a, b) => b.price - a.price); // Giá giảm dần
    }

    // Hiển thị danh sách chuyến bay đã lọc và sắp xếp
    renderFlightList(filteredFlights);
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
