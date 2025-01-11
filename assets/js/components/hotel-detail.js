document.addEventListener("DOMContentLoaded", function () {
    const hotelId = new URLSearchParams(window.location.search).get("id");
    const token = localStorage.getItem("token");
    const API_BASE_URL = "https://symfony-9z0y.onrender.com";

    // Khai báo biến toàn cục
    let pricePerNight = 0;

    // Lấy phần tử DOM
    const carousel = document.getElementById("carousel");
    const thumbnailContainer = document.getElementById("thumbnail-container");
    const bookTourButton = document.getElementById("book-tour-button");
    const feedbackList = document.getElementById("feedback-list");

    // Gọi API để lấy chi tiết khách sạn
    async function getHotelDetailById(hotelId) {
        try {
            const response = await fetch(`${API_BASE_URL}/hotels/${hotelId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const hotelDetail = await response.json();
            displayHotelDetails(hotelDetail);
        } catch (error) {
            console.error("Error fetching hotel details:", error);
            displayError();
        }
    }

    // Hiển thị chi tiết khách sạn
    function displayHotelDetails(hotelDetail) {
        const { name, location, description, price, imgUrl, phone } = hotelDetail;

        document.getElementById("hotel-name").textContent = name || "Không có thông tin khách sạn";
        document.getElementById("hotel-location").textContent = location || "Không có vị trí";
        document.getElementById("hotel-description").textContent = description || "Không có mô tả";
        document.getElementById("hotel-phone").textContent = phone || "Không có mô tả";
        document.getElementById("hotel-price").textContent = price
            ? price.toLocaleString() 
            : "Không có giá";
        pricePerNight = price || 0;

        // Hiển thị hình ảnh
        if (imgUrl) {
            displayMainImage(imgUrl);
            const thumbnail = document.createElement("img");
            thumbnail.src = imgUrl;
            thumbnail.alt = "Hotel Image";
            thumbnail.className = "object-cover rounded cursor-pointer border border-gray-300";
            thumbnail.style = "width: 20%";
            thumbnailContainer.appendChild(thumbnail);
        } else {
            carousel.innerHTML = `<p>Không có hình ảnh cho khách sạn này</p>`;
        }
    }

    // Hiển thị ảnh lớn trong carousel
    function displayMainImage(image) {
        carousel.innerHTML = `
            <img src="${image}" alt="Hotel Image" class="w-full h-full object-contain">
        `;
    }

    // Tính số đêm
    function calculateNumNights(checkinDate, checkoutDate) {
        const diffTime = Math.abs(new Date(checkoutDate) - new Date(checkinDate));
        return diffTime ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
    }

    // Cập nhật tổng tiền
    function updateTotalPrice() {
        const checkinDate = document.getElementById("checkin-date").value;
        const checkoutDate = document.getElementById("checkout-date").value;
        const numPeople = parseInt(document.getElementById("num-people").value, 10);

        const numNights = calculateNumNights(checkinDate, checkoutDate);
        document.getElementById("num-nights").innerText = numNights;
        const totalPrice = numNights * pricePerNight * numPeople;
        document.getElementById("total-price").innerText = totalPrice
            ? totalPrice.toLocaleString() 
            : "0 VNĐ";
    }

    // Xử lý đặt phòng
    async function createBooking() {
        const formData = {
            flightId: null,
            activityId: null,
            comboId: null,
            promoId: null,
            hotelId: hotelId,
            checkInDate: document.getElementById("checkin-date").value || null,
            checkOutDate: document.getElementById("checkout-date").value || null,
            quantity: parseInt(document.getElementById("num-people").value, 10),
        };
        console.log("Booking hotel form data:", formData);

        try {
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            // if (!response.ok) {
            //     throw new Error(`HTTP error! Status: ${response.status}`);
            // }

            const result = await response.json();
            alert("Đặt phòng thành công!");
            console.log("Booking result:", result);
        } catch (error) {
            console.error("Error creating booking:", error);
            alert("Có lỗi xảy ra khi đặt phòng!");
        }
    }

    // Gắn sự kiện cho nút "Đặt tour"
    bookTourButton.addEventListener("click", createBooking);

    // Lắng nghe sự thay đổi input
    document.getElementById("booking-form").addEventListener("input", updateTotalPrice);

    // Gọi dữ liệu khi tải trang
    getHotelDetailById(hotelId);
});
