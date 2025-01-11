document.addEventListener("DOMContentLoaded", function () {
    const API_BASE_URL = 'https://symfony-9z0y.onrender.com';
    const token = localStorage.getItem('token');

    const params = new URLSearchParams(window.location.search);
    const flightId = params.get('id');
    const passengerCount = params.get('passengerCount') || 1;

    const flightInfoContainer = document.getElementById('flight-info');
    const passengerListContainer = document.getElementById('passenger-list');

    // Fetch flight details from API
    async function fetchFlightDetails() {
        try {
            const response = await fetch(`${API_BASE_URL}/flights/${flightId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const flight = await response.json();
            displayFlightDetails(flight);
        } catch (error) {
            console.error('Failed to fetch flight details:', error);
            flightInfoContainer.innerHTML = '<p class="text-red-500">Không tìm thấy thông tin chuyến bay.</p>';
        }
    }

    // Display flight details
    function displayFlightDetails(flight) {
        document.getElementById('flight-brand').textContent = `Hãng hàng không: ${flight.brand}`;
        document.getElementById('flight-route').textContent = `Từ: ${flight.startLocation} → Đến: ${flight.endLocation}`;
        document.getElementById('flight-time').textContent = `Thời gian: ${new Date(flight.startTime).toLocaleString()} - ${new Date(flight.endTime).toLocaleString()}`;
        document.getElementById('flight-price').textContent = `Giá vé: ${flight.price.toLocaleString()} VNĐ/khách`;
        document.getElementById('passenger-count').textContent = `Số lượng: ${passengerCount} hành khách`;
        updateTotalPrice(flight.price);

        generatePassengerForms(passengerCount);
    }

    // Generate passenger forms
    function generatePassengerForms(count) {
        passengerListContainer.innerHTML = '';
        for (let i = 0; i < count; i++) {
            passengerListContainer.innerHTML += `
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

    // Update total price
    function updateTotalPrice(pricePerPassenger) {
        const totalPrice = pricePerPassenger * passengerCount;
        document.getElementById('total-price').textContent = `Tổng: ${totalPrice.toLocaleString()} VNĐ`;
    }

    // Create booking
    // async function createBooking() {
    //     const passengers = [];

    //     for (let i = 0; i < passengerCount; i++) {
    //         passengers.push({
    //             name: document.getElementById(`passenger-name-${i}`).value,
    //             id: document.getElementById(`passenger-id-${i}`).value,
    //             dob: document.getElementById(`passenger-dob-${i}`).value,
    //             gender: document.getElementById(`passenger-gender-${i}`).value,
    //         });
    //     }

    //     const bookingData = {
    //         flightId: flightId,
    //         passengerCount: parseInt(passengerCount, 10),
    //         passengers: passengers,
    //     };

    //     try {
    //         const response = await fetch(`${API_BASE_URL}/bookings`, {
    //             method: 'POST',
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(bookingData),
    //         });

    //         if (!response.ok) {
    //             throw new Error(`Error: ${response.status}`);
    //         }

    //         const result = await response.json();
    //         alert('Đặt vé thành công!');
    //         console.log('Booking result:', result);
    //     } catch (error) {
    //         console.error('Error creating booking:', error);
    //         alert('Đặt vé thất bại!');
    //     }
    // }
    async function createBooking() {
        const passengers = [];
    
        for (let i = 0; i < passengerCount; i++) {
            passengers.push({
                name: document.getElementById(`passenger-name-${i}`).value,
                id: document.getElementById(`passenger-id-${i}`).value,
                dob: document.getElementById(`passenger-dob-${i}`).value,
                gender: document.getElementById(`passenger-gender-${i}`).value,
            });
        }
    
        const formData = {
            flightId: flightId,
            // passengers: passengers,
            quantity: 1,
            promoId: null,
            activityId: null,
            comboId: null,
            hotelId: null,
        };
    
        try {
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.message || `HTTP error! Status: ${response.status}`);
            }
    
            const result = await response.json();
            alert("Booking successful!");
            console.log("Booking result:", result);
        } catch (error) {
            console.error("Error creating booking:", error);
            alert("An error occurred while booking the flight!");
        }
    }
    

    document.getElementById('booking-button').addEventListener('click', createBooking);

    fetchFlightDetails();
});
