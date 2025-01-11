// document.addEventListener("DOMContentLoaded", function () {    
//     const activityId = new URLSearchParams(window.location.search).get('id');
//     // Khai báo biến toàn cục cho giá mỗi người
//     let activityPricePerPerson = 0;

//     // Lấy phần tử DOM
//     const carousel = document.getElementById('carousel');
//     const thumbnailContainer = document.getElementById('thumbnail-container');

//     // Cập nhật thông tin activity
//     fetch('assets/data/activities.json')
//         .then(response => response.json())
//         .then(activitys => {
            
//             const activity = activitys.find(c => c.id == activityId);

//             if (activity) {
//                 // Hiển thị thông tin activity
//                 document.getElementById('activity-name').textContent = activity.name;
//                 document.getElementById('activity-location').textContent = activity.location;
//                 document.getElementById('activity-price').textContent = activity.price.toLocaleString();
            
//                 document.getElementById('activity-description').textContent = activity.description;
//                 // Cập nhật giá mỗi người sau khi lấy dữ liệu activity
//                 activityPricePerPerson = activity.price;

//                 // Đặt giá ban đầu là 0
//                 document.getElementById("total-price").innerText = "0 VND"; // Giá ban đầu là 0
//             }

//             // Kiểm tra nếu có dữ liệu ảnh
//             if (activity && activity.images && activity.images.length > 0) {
//                 // Hiển thị ảnh đầu tiên trong carousel
//                 displayMainImage(activity.images[0]);

//                 // Thêm ảnh nhỏ vào thumbnail container
//                 activity.images.forEach((image, index) => {
//                     const thumbnail = document.createElement('img');
//                     thumbnail.src = image;
//                     thumbnail.alt = `Thumbnail ${index + 1}`;
//                     thumbnail.className = 'object-cover rounded cursor-pointer border border-gray-300';
//                     thumbnail.style = 'width: 20%'
//                     thumbnail.onclick = () => displayMainImage(image);

//                     thumbnailContainer.appendChild(thumbnail);
//                 });
//             } else {
//                 console.error('No images found for this activity.');
//             }
//         })
//         .catch(error => console.error('Lỗi khi tải dữ liệu activity:', error));


//     // Hàm hiển thị ảnh lớn trong carousel
//     function displayMainImage(image) {
//         carousel.innerHTML = `
//             <img src="${image}" alt="Activity Image" class="w-full h-full object-contain">
//         `;
//     }

        
//     // Hàm tính tổng giá
//     function updateTotalPrice() {
//         const numPeople = parseInt(document.getElementById("num-people").value, 10);
//         const bookingDate = document.getElementById("booking-date").value; // Lấy giá trị ngày

//         // Kiểm tra nếu ngày đã được chọn, nếu có thì tính giá
//         if (bookingDate && numPeople > 0) {
//             const totalPrice = numPeople * activityPricePerPerson;
//             document.getElementById("total-price").innerText = totalPrice.toLocaleString() + " VND";
//         } else {
//             // Nếu chưa chọn ngày hoặc số người là 0, thì giá sẽ là 0
//             document.getElementById("total-price").innerText = "0 VND";
//         }
//     }

//     // Lắng nghe sự thay đổi của ngày và số người
//     document.getElementById("booking-form").addEventListener("input", function () {
//         updateTotalPrice();  // Tính toán lại giá khi thay đổi số lượng người hoặc ngày
//     });

//     // Chức năng tăng/giảm số lượng người
//     document.getElementById("increment-button").addEventListener("click", function () {
//         const numPeopleInput = document.getElementById("num-people");
//         numPeopleInput.value = parseInt(numPeopleInput.value, 10) + 1;
//         updateTotalPrice();  // Tính lại giá khi số người thay đổi
//     });

//     document.getElementById("decrement-button").addEventListener("click", function () {
//         const numPeopleInput = document.getElementById("num-people");
//         if (numPeopleInput.value > 1) {
//             numPeopleInput.value = parseInt(numPeopleInput.value, 10) - 1;
//             updateTotalPrice();  // Tính lại giá khi số người thay đổi
//         }
//     });


//     // Function to save order to JSON file
//     function saveOrder(order) {
//         fetch('assets/data/orders.json', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(order)
//         })
//         .then(response => response.json())
//         .then(data => console.log('Order saved:', data))
//         .catch(error => console.error('Error saving order:', error));
//     }

//     // Event listener for "Add to Order" button
//     document.getElementById('add-to-order-button').addEventListener('click', function () {
//         const order = {
//             activityId: activityId,
//             bookingDate: document.getElementById("booking-date").value,
//             numPeople: parseInt(document.getElementById("num-people").value, 10),
//             totalPrice: document.getElementById("total-price").innerText,
//             status: 'pending'
//         };
//         saveOrder(order);
//     });

//     // Event listener for "Book Tour" button
//     document.getElementById('booking-button').addEventListener('click', function () {
//         const order = {
//             activityId: activityId,
//             bookingDate: document.getElementById("booking-date").value,
//             numPeople: parseInt(document.getElementById("num-people").value, 10),
//             totalPrice: document.getElementById("total-price").innerText,
//             status: 'pending'
//         };
//         saveOrder(order);

//         // Simulate payment success and update order status
//         setTimeout(() => {
//             order.status = 'done';
//             saveOrder(order);
//         }, 2000); // Simulate 2 seconds payment processing time
//     });


//     //-----------------------------------------------------------------------------------------

//     // Fetch dữ liệu từ file JSON feedback
//     fetch('assets/data/feedback.json')
//         .then(response => response.json())
//         .then(feedbacks => {
//             // Lọc feedback theo ID activity
//             const activityFeedbacks = feedbacks.filter(feedback => feedback.activity_id == activityId);
//             const feedbackList = document.getElementById('feedback-list');

//             activityFeedbacks.forEach(feedback => {
//                 const createdDate = new Date(feedback.created_date);
//                 const formattedDate = createdDate.toLocaleDateString('vi-VN'); // Định dạng ngày tháng
//                 const stars = generateStars(feedback.rating); // Tạo sao theo rating

//                 feedbackList.innerHTML += `
//                     <div class="flex items-center mb-4">
//                     <img class="w-10 h-10 me-4 rounded-full" src="data:image/jpeg;base64,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" alt="Profile">
//                     <div class="font-medium dark:text-white">
//                         <p>${feedback.name} ${stars}</p>
//                         <p class="block text-sm text-gray-500 dark:text-gray-400">${formattedDate}</p>
//                     </div>
//                     </div>
//                     <p class="mb-2 text-gray-500 dark:text-gray-400">${feedback.comment}</p>
//                 `;
//             });
//         })
//         .catch(error => console.error('Lỗi khi tải dữ liệu feedback:', error));

//     // Hàm tạo sao SVG theo rating
//     function generateStars(rating) {
//     let stars = '';
//     for (let i = 1; i <= 5; i++) {
//         stars += i <= rating
//             ? `<svg class="w-4 h-4 text-yellow-300 inline-block mr-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
//                     <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
//                 </svg>`
//             : `<svg class="w-4 h-4 text-gray-300 dark:text-gray-500 inline-block mr-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
//                     <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
//                 </svg>`;
//     }
//     return stars;
//     }
// });


document.addEventListener("DOMContentLoaded", function () {
const activityId = new URLSearchParams(window.location.search).get('id');
console.log(activityId);
const token = localStorage.getItem("token");
    const API_BASE_URL = "https://symfony-9z0y.onrender.com";

    // Khai báo biến toàn cục
    let activityPricePerPerson = 0;

    // Lấy phần tử DOM
    const carousel = document.getElementById("carousel");
    const thumbnailContainer = document.getElementById("thumbnail-container");
    const bookTourButton = document.getElementById("book-tour-button");
    const feedbackList = document.getElementById("feedback-list");

    // Gọi API để lấy chi tiết khách sạn
    async function getActivityDetailById(activityId) {
        try {
            const response = await fetch(`${API_BASE_URL}/activities/${activityId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const ActivityDetail = await response.json();
            console.log(ActivityDetail);
            displayActivityDetails(ActivityDetail);
        } catch (error) {
            console.error("Error fetching activity details:", error);
            displayError();
        }
    }

    // Hiển thị chi tiết khách sạn
    function displayActivityDetails(ActivityDetail) {
        const { name, location, description, price, imgUrl } = ActivityDetail;
        console.log(ActivityDetail);

        document.getElementById("activity-name").textContent = name || "Không có thông tin khách sạn";
        document.getElementById("activity-location").textContent = location || "Không có vị trí";
        document.getElementById("activity-description").textContent = description || "Không có mô tả";
        document.getElementById("activity-price").textContent = price
            ? price.toLocaleString() 
            : "Không có giá";

            activityPricePerPerson = price || 0;
        // Hiển thị hình ảnh
        if (imgUrl) {
            displayMainImage(imgUrl);
            const thumbnail = document.createElement("img");
            thumbnail.src = imgUrl;
            thumbnail.alt = "Activity Image";
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
            <img src="${image}" alt="Activity Image" class="w-full h-full object-contain">
        `;
    }


    // Cập nhật tổng tiền
    function updateTotalPrice() {
        const numPeople = parseInt(document.getElementById("num-people").value, 10);
        console.log(numPeople);


        const totalPrice = numPeople * activityPricePerPerson;
        console.log(totalPrice);
        document.getElementById("total-price").innerText = totalPrice
            ? totalPrice.toLocaleString() 
            : "0 VNĐ";
    }

    // Xử lý đặt phòng
    async function createBooking() {
        const formData = {
            flightId: null,
            hotelId: null,
            comboId: null,
            promoId: null,
            activityId: activityId,
            checkInDate: document.getElementById("booking-date").value || null,
            checkOutDate: document.getElementById("booking-date").value || null,
            quantity: parseInt(document.getElementById("num-people").value, 10),
        };
        console.log("Booking activity form data:", formData);

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
    getActivityDetailById(activityId);
});
