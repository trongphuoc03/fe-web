document.addEventListener("DOMContentLoaded", function () {
    const comboId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('token');
    console.log('comboId:', comboId);

    const API_BASE_URL = 'https://symfony-9z0y.onrender.com';

    // Khai báo biến toàn cục
    let comboPricePerPerson = 0;

    // Lấy phần tử DOM
    const carousel = document.getElementById('carousel');
    const thumbnailContainer = document.getElementById('thumbnail-container');
    const bookTourButton = document.getElementById('book-tour-button');
    const feedbackList = document.getElementById('feedback-list');

    // Gọi API để lấy chi tiết combo
    async function getComboDetailById(comboId) {
        try {
            const response = await fetch(`${API_BASE_URL}/combo-details/${comboId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const comboDetail = await response.json();
            displayComboDetails(comboDetail);
        } catch (error) {
            console.error('Error fetching combo details:', error);
            displayError();
        }
    }

    // Hiển thị chi tiết combo
    function displayComboDetails(comboDetail) {
        const { combo, flight, hotel, activity } = comboDetail;

        // Hiển thị thông tin combo
        document.getElementById('combo-name').textContent = combo?.name || 'Không có thông tin combo';
        document.getElementById('combo-description').textContent = combo?.description || 'Không có mô tả combo';
        document.getElementById('combo-price').textContent = combo?.price
            ? combo.price.toLocaleString() + ' VNĐ'
            : 'Không có giá';
        comboPricePerPerson = combo?.price || 0;

        // Hiển thị hình ảnh
        if (combo?.imgUrl) {
            displayMainImage(combo.imgUrl);
            const thumbnail = document.createElement('img');
            thumbnail.src = combo.imgUrl;
            thumbnail.alt = 'Combo Image';
            thumbnail.className = 'object-cover rounded cursor-pointer border border-gray-300';
            thumbnail.style = 'width: 20%';
            thumbnailContainer.appendChild(thumbnail);
        } else {
            carousel.innerHTML = `<p>Không có hình ảnh cho combo này</p>`;
        }

        // Flight, Hotel, Activity thông tin
        feedbackList.innerHTML += `
            <h3 class="text-lg font-bold">Thông tin chi tiết</h3>
            ${flight ? `
                <p>Flight: ${flight.brand}, Từ: ${flight.startLocation}, Đến: ${flight.endLocation}</p>` : '<p>Không có thông tin chuyến bay</p>'}
            ${hotel ? `
                <p>Hotel: ${hotel.name}, Vị trí: ${hotel.location}</p>` : '<p>Không có thông tin khách sạn</p>'}
            ${activity ? `
                <p>Activity: ${activity.name}, Giá: ${activity.price}</p>` : '<p>Không có hoạt động liên quan</p>'}
        `;
    }

    // Hiển thị ảnh lớn trong carousel
    function displayMainImage(image) {
        carousel.innerHTML = `
            <img src="${image}" alt="combo Image" class="w-full h-full object-contain">
        `;
    }

    // Tính tổng giá
    function updateTotalPrice() {
        const numPeople = parseInt(document.getElementById("num-people").value, 10);
        const bookingDate = document.getElementById("booking-date").value;

        const totalPrice = bookingDate && numPeople > 0 ? numPeople * comboPricePerPerson : 0;
        document.getElementById("total-price").innerText = totalPrice
            ? totalPrice.toLocaleString() + " VNĐ"
            : "0 VNĐ";
    }

    // Xử lý đặt tour
    async function createBooking() {
        const comboId = new URLSearchParams(window.location.search).get('id');
        console.log('comboId1:', comboId);
        const formData = {
            flightId: null, // Đặt giá trị null
            hotelId: null,  // Đặt giá trị null
            activityId: null, // Đặt giá trị null
            comboId: comboId, // Lấy comboId từ URL
            promoId: null, // Đặt giá trị null
            quantity: parseInt(document.getElementById('num-people').value, 10), // Lấy số lượng người từ input
            checkInDate: document.getElementById('booking-date').value || null, // Lấy ngày check-in từ input
            checkOutDate:  document.getElementById('checkout-date').value || null // Đặt giá trị null
        };
        console.log('Booking data:', formData);
    
        try {
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const result = await response.json();
            alert('Đặt tour thành công!');
            console.log('Booking result:', result);
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Có lỗi xảy ra khi đặt tour!');
        }
    }
    
    // Gắn sự kiện cho nút "Đặt tour"
    document.getElementById('book-tour-button').addEventListener('click', createBooking);
    

    // Lắng nghe sự thay đổi input
    document.getElementById("booking-form").addEventListener("input", updateTotalPrice);

    // Gọi dữ liệu khi tải trang
    getComboDetailById(comboId);
});
