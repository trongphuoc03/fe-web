document.addEventListener("DOMContentLoaded", function () {    
    // Lấy ID khách sạn từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const hotelId = urlParams.get('id');

    let pricePerNight = 0; // Khởi tạo giá khách sạn


    // Lấy phần tử DOM
    const carousel = document.getElementById('carousel');
    const thumbnailContainer = document.getElementById('thumbnail-container');

    // Fetch dữ liệu từ file JSON khách sạn
    fetch('assets/data/hotel.json')
        .then(response => response.json())
        .then(hotels => {
            // Tìm khách sạn theo ID
            const hotel = hotels.find(h => h.id == hotelId);

            if (hotel) {
                // Hiển thị thông tin khách sạn
                document.getElementById('hotel-name').textContent = hotel.name;
                document.getElementById('hotel-description').textContent = hotel.description;
                document.getElementById('hotel-price').textContent = hotel.price.toLocaleString();
            
                document.getElementById('hotel-location').textContent = hotel.location;
                pricePerNight = hotel.price; // Lưu giá phòng để tính tổng tiền
            }

            // Kiểm tra nếu có dữ liệu ảnh
            if (hotel && hotel.images && hotel.images.length > 0) {
                // Hiển thị ảnh đầu tiên trong carousel
                displayMainImage(hotel.images[0]);

                // Thêm ảnh nhỏ vào thumbnail container
                hotel.images.forEach((image, index) => {
                    const thumbnail = document.createElement('img');
                    thumbnail.src = image;
                    thumbnail.alt = `Thumbnail ${index + 1}`;
                    thumbnail.className = 'object-cover rounded cursor-pointer border border-gray-300';
                    thumbnail.style = 'width: 20%'
                    thumbnail.onclick = () => displayMainImage(image);

                    thumbnailContainer.appendChild(thumbnail);
                });
            } else {
                console.error('No images found for this hotel.');
            }
        })
        .catch(error => console.error('Lỗi khi tải dữ liệu khách sạn:', error));

    // Hàm hiển thị ảnh lớn trong carousel
    function displayMainImage(image) {
        carousel.innerHTML = `
            <img src="${image}" alt="hotel Image" class="w-full h-full object-contain">
        `;
    }

    // Lắng nghe sự thay đổi của các input trong form
    document.getElementById("booking-form").addEventListener("input", function () {
        const checkinDateInput = document.getElementById("checkin-date");
        const checkoutDateInput = document.getElementById("checkout-date");
        const checkinDate = new Date(checkinDateInput.value);
        const checkoutDate = new Date(checkoutDateInput.value);
        const numPeople = parseInt(document.getElementById("num-people").value, 10);

        // Kiểm tra ngày trả phòng hợp lệ
        if (checkoutDate <= checkinDate) {
            alert("Ngày trả phòng phải sau ngày nhận phòng!");
            checkoutDateInput.value = ""; // Xóa ngày trả nếu sai
            document.getElementById("num-nights").innerText = 0;
            document.getElementById("total-price").innerText = "0 VND";
            return;
        }

        // Tính số đêm nếu ngày hợp lệ
        const numNights = calculateNumNights(checkinDate, checkoutDate);

        // Cập nhật số đêm vào form
        document.getElementById("num-nights").innerText = numNights;

        // Tính tổng tiền
        updateTotalPrice(numNights, numPeople);
    });

    // Hàm tính số đêm giữa check-in và check-out
    function calculateNumNights(checkinDate, checkoutDate) {
        const diffTime = Math.abs(checkoutDate - checkinDate);
        return diffTime ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
    }

    // Hàm cập nhật tổng tiền
    function updateTotalPrice(numNights, numPeople) {
        const totalPrice = numNights * pricePerNight * numPeople;
        document.getElementById("total-price").innerText = totalPrice ? totalPrice.toLocaleString() + " VND" : "0 VND";
    }

    // Lắng nghe sự thay đổi của số người
    document.getElementById("num-people").addEventListener("input", function () {
        const checkinDateInput = document.getElementById("checkin-date");
        const checkoutDateInput = document.getElementById("checkout-date");
        const checkinDate = new Date(checkinDateInput.value);
        const checkoutDate = new Date(checkoutDateInput.value);
        const numPeople = parseInt(document.getElementById("num-people").value, 10);

        // Tính số đêm nếu ngày hợp lệ
        const numNights = calculateNumNights(checkinDate, checkoutDate);

        // Tính tổng tiền
        updateTotalPrice(numNights, numPeople);
    });

    // Hàm để tăng số lượng hành khách
    document.getElementById('increment-button').addEventListener('click', function () {
        let passengerCount = document.getElementById('num-people');
        let value = parseInt(passengerCount.value);
        passengerCount.value = isNaN(value) ? 1 : value + 1;

        // Tính lại tổng tiền sau khi tăng số người
        const checkinDateInput = document.getElementById("checkin-date");
        const checkoutDateInput = document.getElementById("checkout-date");
        const checkinDate = new Date(checkinDateInput.value);
        const checkoutDate = new Date(checkoutDateInput.value);
        const numPeople = parseInt(passengerCount.value, 10);

        const numNights = calculateNumNights(checkinDate, checkoutDate);
        updateTotalPrice(numNights, numPeople);
    });

    // Hàm để giảm số lượng hành khách
    document.getElementById('decrement-button').addEventListener('click', function () {
        let passengerCount = document.getElementById('num-people');
        let value = parseInt(passengerCount.value);
        if (value > 1) {
            passengerCount.value = value - 1;
        }

        // Tính lại tổng tiền sau khi giảm số người
        const checkinDateInput = document.getElementById("checkin-date");
        const checkoutDateInput = document.getElementById("checkout-date");
        const checkinDate = new Date(checkinDateInput.value);
        const checkoutDate = new Date(checkoutDateInput.value);
        const numPeople = parseInt(passengerCount.value, 10);

        const numNights = calculateNumNights(checkinDate, checkoutDate);
        updateTotalPrice(numNights, numPeople);
    });

    // Function to save order to JSON file
    function saveOrder(order) {
        fetch('assets/data/orders.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        })
        .then(response => response.json())
        .then(data => console.log('Order saved:', data))
        .catch(error => console.error('Error saving order:', error));
    }

    // Event listener for "Add to Order" button
    document.getElementById('add-to-order-button').addEventListener('click', function () {
        const order = {
            hotelId: hotelId,
            checkinDate: document.getElementById("checkin-date").value,
            checkoutDate: document.getElementById("checkout-date").value,
            numPeople: parseInt(document.getElementById("num-people").value, 10),
            totalPrice: document.getElementById("total-price").innerText,
            status: 'pending'
        };
        saveOrder(order);
    });

    // Event listener for "Book Tour" button
    document.getElementById('booking-button').addEventListener('click', function () {
        const order = {
            hotelId: hotelId,
            checkinDate: document.getElementById("checkin-date").value,
            checkoutDate: document.getElementById("checkout-date").value,
            numPeople: parseInt(document.getElementById("num-people").value, 10),
            totalPrice: document.getElementById("total-price").innerText,
            status: 'pending'
        };
        saveOrder(order);

        // Simulate payment success and update order status
        setTimeout(() => {
            order.status = 'done';
            saveOrder(order);
        }, 2000); // Simulate 2 seconds payment processing time
    });


    //---------------------------------------------------------------------------------------
    // Fetch dữ liệu từ file JSON feedback
    fetch('assets/data/feedback.json')
        .then(response => response.json())
        .then(feedbacks => {
            // Lọc feedback theo ID khách sạn
            const hotelFeedbacks = feedbacks.filter(feedback => feedback.hotel_id == hotelId);
            const feedbackList = document.getElementById('feedback-list');

            hotelFeedbacks.forEach(feedback => {
                const createdDate = new Date(feedback.created_date);
                const formattedDate = createdDate.toLocaleDateString('vi-VN'); // Định dạng ngày tháng
                const stars = generateStars(feedback.rating); // Tạo sao theo rating

                feedbackList.innerHTML += `
                    <div class="flex items-center mb-4">
                    <img class="w-10 h-10 me-4 rounded-full" src="data:image/jpeg;base64,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" alt="Profile">
                    <div class="font-medium dark:text-white">
                        <p>${feedback.name} ${stars}</p>
                        <p class="block text-sm text-gray-500 dark:text-gray-400">${formattedDate}</p>
                    </div>
                    </div>
                    <p class="mb-2 text-gray-500 dark:text-gray-400">${feedback.comment}</p>
                `;
            });
        })
        .catch(error => console.error('Lỗi khi tải dữ liệu feedback:', error));

    // Hàm tạo sao SVG theo rating
    function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating
            ? `<svg class="w-4 h-4 text-yellow-300 inline-block mr-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                </svg>`
            : `<svg class="w-4 h-4 text-gray-300 dark:text-gray-500 inline-block mr-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                </svg>`;
    }
    return stars;
    }
});