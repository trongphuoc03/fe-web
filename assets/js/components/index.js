document.addEventListener("DOMContentLoaded", function () {
  // Hàm hiển thị nội dung cho các section
  function showContent(sectionId) {
    const sections = document.querySelectorAll(".details-section");
    sections.forEach((section) => {
      section.classList.remove("active");
    });
    document.getElementById(sectionId).classList.add("active");
  }

  // Hàm tải và hiển thị các combo items từ JSON
  function loadCombos() {
    fetch("assets/data/combos.json")
      .then((response) => response.json())
      .then((data) => {
        const comboItemsContainer = document.getElementById("combo-items");
        comboItemsContainer.innerHTML = ""; // Xóa nội dung cũ

        // Số lượng combo items mỗi lần hiển thị
        const itemsPerPage = 5;
        let currentIndex = 0;

        // Lưu lại tổng số combo
        const totalCombos = data;

        // Hàm hiển thị các combo items cho trang hiện tại
        function displayCombos() {
          const combosToShow = [];
          // Chọn các combo items dựa trên chỉ số hiện tại
          for (let i = 0; i < itemsPerPage; i++) {
            const index = (currentIndex + i) % totalCombos.length; // Vòng lặp qua lại nếu vượt quá số lượng items
            combosToShow.push(totalCombos[index]);
          }

          // Xóa nội dung cũ và hiển thị các combo items mới
          comboItemsContainer.innerHTML = "";
          combosToShow.forEach((combo) => {
            const comboCard = document.createElement("div");
            comboCard.className = "carousel-item w-full"; // Thêm class để nhận diện combo item
            comboCard.innerHTML = `
                            <a href="combo-detail.html?id=${combo.id}">
                                <img class="p-4 rounded-t-lg" src="=${combo.name}" alt="${combo.name}" />
                            </a>
                            <div class="px-3 pb-4">
                                <a href="combo-detail.html?id=${combo.id}">
                                    <h5 class="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">${combo.name}</h5>
                                </a>
                            </div>
                        `;
            comboItemsContainer.appendChild(comboCard);
          });
        }

        // Hiển thị các combo items đầu tiên
        displayCombos();

        // Thêm sự kiện cho nút "Next" để chuyển đến trang tiếp theo
        document
          .getElementById("next-btn-combo")
          .addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % totalCombos.length; // Tăng chỉ số và quay lại nếu vượt qua cuối danh sách
            displayCombos();
          });

        // Thêm sự kiện cho nút "Previous" để quay lại trang trước
        document
          .getElementById("prev-btn-combo")
          .addEventListener("click", () => {
            currentIndex =
              (currentIndex - 1 + totalCombos.length) % totalCombos.length; // Giảm chỉ số và quay lại nếu đi qua đầu danh sách
            displayCombos();
          });

        // Khởi tạo carousel sau khi đã thêm các combo items
      })
      .catch((error) => {
        console.error("Error loading combos:", error);
      });
  }

  function loadHotels() {
    fetch("assets/data/hotel.json")
      .then((response) => response.json())
      .then((data) => {
        const hotelItemsContainer = document.getElementById("hotel-items");
        hotelItemsContainer.innerHTML = ""; // Xóa nội dung cũ

        // Số lượng hotel items mỗi lần hiển thị
        const itemsPerPage = 5;
        let currentIndex = 0;

        // Lưu lại tổng số hotel
        const totalHotels = data;

        // Hàm hiển thị các hotel items cho trang hiện tại
        function displayHotels() {
          const hotelsToShow = [];
          // Chọn các hotel items dựa trên chỉ số hiện tại
          for (let i = 0; i < itemsPerPage; i++) {
            const index = (currentIndex + i) % totalHotels.length; // Vòng lặp qua lại nếu vượt quá số lượng items
            hotelsToShow.push(totalHotels[index]);
          }

          // Xóa nội dung cũ và hiển thị các hotel items mới
          hotelItemsContainer.innerHTML = "";
          hotelsToShow.forEach((hotel) => {
            const hotelCard = document.createElement("div");
            hotelCard.className = "carousel-item w-full"; // Thêm class để nhận diện hotel item
            hotelCard.innerHTML = `
                            <a href="hotel-detail.html?id=${hotel.id}">
                                <img class="p-4 rounded-t-lg" src="${hotel.image_url}" alt="${hotel.name}" />
                            </a>
                            <div class="px-3 pb-4">
                                <a href="hotel-detail.html?id=${hotel.id}">
                                    <h5 class="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">${hotel.name}</h5>
                                </a>
                            </div>
                        `;
            hotelItemsContainer.appendChild(hotelCard);
          });
        }

        // Hiển thị các hotel items đầu tiên
        displayHotels();

        // Thêm sự kiện cho nút "Next" để chuyển đến trang tiếp theo
        document
          .getElementById("next-btn-hotel")
          .addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % totalHotels.length; // Tăng chỉ số và quay lại nếu vượt qua cuối danh sách
            displayHotels();
          });

        // Thêm sự kiện cho nút "Previous" để quay lại trang trước
        document
          .getElementById("prev-btn-hotel")
          .addEventListener("click", () => {
            currentIndex =
              (currentIndex - 1 + totalHotels.length) % totalHotels.length; // Giảm chỉ số và quay lại nếu đi qua đầu danh sách
            displayHotels();
          });

        // Khởi tạo carousel sau khi đã thêm các hotel items
      })
      .catch((error) => {
        console.error("Error loading hotels:", error);
      });
  }

  function loadFlights() {
    fetch("assets/data/flight.json")
      .then((response) => response.json())
      .then((data) => {
        const flightItemsContainer = document.getElementById("flight-items");
        flightItemsContainer.innerHTML = ""; // Xóa nội dung cũ

        // Số lượng flight items mỗi lần hiển thị
        const itemsPerPage = 5;
        let currentIndex = 0;

        // Lưu lại tổng số flight
        const totalFlights = data;

        // Hàm hiển thị các flight items cho trang hiện tại
        function displayFlights() {
          const flightsToShow = [];
          // Chọn các flight items dựa trên chỉ số hiện tại
          for (let i = 0; i < itemsPerPage; i++) {
            const index = (currentIndex + i) % totalFlights.length; // Vòng lặp qua lại nếu vượt quá số lượng items
            flightsToShow.push(totalFlights[index]);
          }

          // Xóa nội dung cũ và hiển thị các flight items mới
          const passengerCount = 1;
          flightItemsContainer.innerHTML = "";
          flightsToShow.forEach((flight) => {
            const flightCard = document.createElement("div");
            flightCard.className = "carousel-item w-full"; // Thêm class để nhận diện flight item
            flightCard.innerHTML = `
                            <div class="px-3 pb-4">
                                <a href="flight-detail.html?id=${flight.id}&passengerCount=${passengerCount}">
                                <h5 class="text-lg font-semibold tracking-tight text-gray-900 dark:text-white"> ${flight.startLocation} - ${flight.endLocation}</h5>
                                <h5 class="text-lg font-semibold tracking-tight text-gray-900 dark:text-white" >${new Date(flight.startTime).toLocaleDateString()}</h5>
                                <h5 class="text-lg font-semibold tracking-tight text-gray-900 dark:text-white" >${flight.brand} </h5>                                
                                </a>
                            </div>
                        `;
            flightItemsContainer.appendChild(flightCard);
          });
        }

        // Hiển thị các flight items đầu tiên
        displayFlights();

        // Thêm sự kiện cho nút "Next" để chuyển đến trang tiếp theo
        document
          .getElementById("next-btn-flight")
          .addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % totalFlights.length; // Tăng chỉ số và quay lại nếu vượt qua cuối danh sách
            displayFlights();
          });

        // Thêm sự kiện cho nút "Previous" để quay lại trang trước
        document
          .getElementById("prev-btn-flight")
          .addEventListener("click", () => {
            currentIndex =
              (currentIndex - 1 + totalFlights.length) % totalFlights.length; // Giảm chỉ số và quay lại nếu đi qua đầu danh sách
            displayFlights();
          });

        // Khởi tạo carousel sau khi đã thêm các flight items
      })
      .catch((error) => {
        console.error("Error loading flights:", error);
      });
  }

  function loadActivities() {
    fetch("assets/data/activities.json")
      .then((response) => response.json())
      .then((data) => {
        const activitiesItemsContainer = document.getElementById("activities-items");
        activitiesItemsContainer.innerHTML = ""; // Xóa nội dung cũ

        // Số lượng activitie items mỗi lần hiển thị
        const itemsPerPage = 5;
        let currentIndex = 0;

        // Lưu lại tổng số activitie
        const totalActivities = data;

        // Hàm hiển thị các activitie items cho trang hiện tại
        function displayActivities() {
          const activitiesToShow = [];
          // Chọn các activitie items dựa trên chỉ số hiện tại
          for (let i = 0; i < itemsPerPage; i++) {
            const index = (currentIndex + i) % totalActivities.length; // Vòng lặp qua lại nếu vượt quá số lượng items
            activitiesToShow.push(totalActivities[index]);
          }

          // Xóa nội dung cũ và hiển thị các activitie items mới
          activitiesItemsContainer.innerHTML = "";
          activitiesToShow.forEach((activities) => {
            const activityCard = document.createElement("div");
            activityCard.className = "carousel-item w-full"; // Thêm class để nhận diện activitie item
            activityCard.innerHTML = `
                            <a href="activity-detail.html?id=${activities.id}">
                            </a>
                            <div class="px-3 pb-4">
                                <a href="activity-detail.html?id=${activities.id}">
                                    <h5 class="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">${activities.name}</h5>
                                </a>
                            </div>
                        `;
            activitiesItemsContainer.appendChild(activityCard);
          });
        }

        // Hiển thị các hotel items đầu tiên
        displayActivities();

        // Thêm sự kiện cho nút "Next" để chuyển đến trang tiếp theo
        document
          .getElementById("next-btn-activities")
          .addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % totalActivities.length; // Tăng chỉ số và quay lại nếu vượt qua cuối danh sách
            displayActivities();
          });

        // Thêm sự kiện cho nút "Previous" để quay lại trang trước
        document
          .getElementById("prev-btn-activities")
          .addEventListener("click", () => {
            currentIndex =
              (currentIndex - 1 + totalActivities.length) % totalActivities.length; // Giảm chỉ số và quay lại nếu đi qua đầu danh sách
              displayActivities();
          });

        // Khởi tạo carousel sau khi đã thêm các hotel items
      })
      .catch((error) => {
        console.error("Error loading activities:", error);
      });
  }


  // Hàm khởi tạo tất cả các carousel với lớp chung
  function initializeAllCarousels() {
    // Tìm tất cả các phần tử có lớp 'carousel' (hoặc lớp chung cho carousel)
    const carouselElements = document.querySelectorAll(".carousel");

    carouselElements.forEach((carouselElement) => {
      initializeCarousel(carouselElement);
    });
  }

  function initializeCarousel(carouselElement) {
    if (!carouselElement) {
      console.error("Không tìm thấy phần tử carousel.");
      return;
    }

    // Kiểm tra xem carousel đã được khởi tạo chưa
    if (!carouselElement.hasAttribute("data-carousel-initialized")) {
      const carousel = new Carousel(carouselElement, {
        interval: 3000, // Thời gian giữa các slide (milliseconds)
        pause: "hover", // Tạm dừng carousel khi hover
        wrap: true, // Cho phép quay lại đầu sau khi hết slide
      });

      carouselElement.setAttribute("data-carousel-initialized", "true");
    }
  }

  // Gọi hàm để khởi tạo tất cả các carousel sau khi DOM đã sẵn sàng
  document.addEventListener("DOMContentLoaded", initializeAllCarousels);

  // Gọi hàm loadCombos để tải dữ liệu khi DOM đã sẵn sàng
  loadCombos();
  loadHotels();
  loadFlights();
  loadActivities();
});
