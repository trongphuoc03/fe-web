// Get the flight ID and passenger count from the URL
const params = new URLSearchParams(window.location.search);
const flightId = params.get('id');
const passengerCount = params.get('passengerCount');

// Fetch flight data from a JSON file (or API)
fetch('assets/data/flight.json')
    .then(response => response.json())
    .then(flights => {
        const flight = flights.find(flight => flight.id == flightId);
        
        if (flight) {
            // Populate flight details in the HTML
            document.getElementById('flight-brand').innerText = `Hãng hàng không: ${flight.brand}`;
            document.getElementById('flight-route').innerText = `Từ: ${flight.startLocation} → Đến: ${flight.endLocation}`;
            document.getElementById('flight-time').innerText = `Thời gian khởi hành: ${new Date(flight.startTime).toLocaleString()}`;
            document.getElementById('flight-price').innerText = `Giá vé: ${flight.price.toLocaleString()} VNĐ/khách`;
            document.getElementById('passenger-count').innerText = `Số lượng: ${passengerCount} hành khách`;

            // Generate passenger input fields based on the selected passenger count
            generatePassengerForms(passengerCount);
            
            // Update total price based on the selected number of passengers
            updateTotalPrice(flight.price);
        } else {
            document.getElementById('flight-info').innerHTML = `<p class="text-red-500">Không tìm thấy chuyến bay.</p>`;
        }
    })
    .catch(error => console.error('Lỗi khi tải dữ liệu:', error));

// Function to generate passenger input forms
function generatePassengerForms(passengerCount) {
    const passengerList = document.getElementById('passenger-list');
    passengerList.innerHTML = ''; // Clear previous passenger forms
    
    for (let i = 0; i < passengerCount; i++) {
        passengerList.innerHTML += `
            <div class="mb-4">
                <h3 class="text-lg font-semibold">Hành khách ${i + 1}</h3>
                <div class="mb-2">
                    <label for="passenger-name-${i}" class="block">Họ và tên:</label>
                    <input type="text" id="passenger-name-${i}" class="w-full p-2 border rounded" required>
                </div>
                <div class="mb-2">
                    <label for="passenger-id-${i}" class="block">Số CMND/CCCD:</label>
                    <input type="text" id="passenger-id-${i}" class="w-full p-2 border rounded" required>
                </div>
                <div class="mb-2">
                    <label for="passenger-dob-${i}" class="block">Ngày sinh:</label>
                    <input type="date" id="passenger-dob-${i}" class="w-full p-2 border rounded" required>
                </div>
                <div class="mb-2">
                    <label for="passenger-gender-${i}" class="block">Giới tính:</label>
                    <select id="passenger-gender-${i}" class="w-full p-2 border rounded" required>
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                    </select>
                </div>
            </div>
        `;
    }
}

// Hàm tính tổng tiền
function updateTotalPrice(flightPrice) {
    const numPassengers = parseInt(passengerCount, 10); // Sử dụng passengerCount đã lấy từ URL
    const totalPrice = numPassengers * flightPrice; // Tính tổng tiền
    document.getElementById("total-price").textContent = `Tổng: ${totalPrice.toLocaleString()} VNĐ`;
}

// Lắng nghe sự thay đổi của số hành khách và tính lại tổng tiền (nếu có form nhập số lượng hành khách)
document.getElementById("num-passengers")?.addEventListener("input", function () {
    const flightPrice = parseInt(document.getElementById('flight-price').textContent.replace(/[^\d]/g, ''), 10);
    updateTotalPrice(flightPrice);  // Tính lại giá khi số lượng hành khách thay đổi
});
