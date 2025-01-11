document.addEventListener("DOMContentLoaded", function () {
  // Hàm hiển thị nội dung cho các section
  function showContent(sectionId) {
    const sections = document.querySelectorAll(".details-section");
    sections.forEach((section) => {
      section.classList.remove("active");
    });
    document.getElementById(sectionId).classList.add("active");
  }

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

  // Hàm tải và hiển thị các combo items từ API
  async function loadCombos() {
    try {
      const data = await callAPI('https://symfony-9z0y.onrender.com/combos/bulk', 'GET');
      const comboItemsContainer = document.getElementById("combo-items");
      comboItemsContainer.innerHTML = ""; // Xóa nội dung cũ

      const itemsPerPage = 5;
      let currentIndex = 0;
      const totalCombos = data;

      function displayCombos() {
        const combosToShow = [];
        for (let i = 0; i < itemsPerPage; i++) {
          const index = (currentIndex + i) % totalCombos.length;
          combosToShow.push(totalCombos[index]);
        }

        comboItemsContainer.innerHTML = "";
        combosToShow.forEach((combo) => {
          console.log('combo:', combo);
          const comboCard = document.createElement("div");
          comboCard.className = "carousel-item w-full";
          comboCard.innerHTML = `
            <a href="combo-detail.html?id=${combo.comboId}">
                <img class="p-4 rounded-t-lg" src="${combo.image_url}" alt="${combo.name}" />
            </a>
            <div class="px-3 pb-4">
                <a href="combo-detail.html?id=${combo.comboId}">
                    <h5 class="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">${combo.name}</h5>
                </a>
            </div>
          `;
          comboItemsContainer.appendChild(comboCard);
        });
      }

      displayCombos();

      document.getElementById("next-btn-combo").addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % totalCombos.length;
        displayCombos();
      });

      document.getElementById("prev-btn-combo").addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + totalCombos.length) % totalCombos.length;
        displayCombos();
      });

    } catch (error) {
      console.error("Error loading combos:", error);
    }
  }

  async function loadHotels() {
    try {
      const data = await callAPI('https://symfony-9z0y.onrender.com/hotels/bulk', 'GET');
      const hotelItemsContainer = document.getElementById("hotel-items");
      hotelItemsContainer.innerHTML = ""; // Xóa nội dung cũ

      const itemsPerPage = 5;
      let currentIndex = 0;
      const totalHotels = data;

      function displayHotels() {
        const hotelsToShow = [];
        for (let i = 0; i < itemsPerPage; i++) {
          const index = (currentIndex + i) % totalHotels.length;
          hotelsToShow.push(totalHotels[index]);
        }

        hotelItemsContainer.innerHTML = "";
        hotelsToShow.forEach((hotel) => {
          console.log('hotel:', hotel);
          const hotelCard = document.createElement("div");
          hotelCard.className = "carousel-item w-full";
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

      displayHotels();

      document.getElementById("next-btn-hotel").addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % totalHotels.length;
        displayHotels();
      });

      document.getElementById("prev-btn-hotel").addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + totalHotels.length) % totalHotels.length;
        displayHotels();
      });

    } catch (error) {
      console.error("Error loading hotels:", error);
    }
  }

  async function loadFlights() {
    try {
      const data = await callAPI('https://symfony-9z0y.onrender.com/flights/bulk', 'GET');
      const flightItemsContainer = document.getElementById("flight-items");
      flightItemsContainer.innerHTML = ""; // Xóa nội dung cũ

      const itemsPerPage = 5;
      let currentIndex = 0;
      const totalFlights = data;

      function displayFlights() {
        const flightsToShow = [];
        for (let i = 0; i < itemsPerPage; i++) {
          const index = (currentIndex + i) % totalFlights.length;
          flightsToShow.push(totalFlights[index]);
        }

        const passengerCount = 1;
        flightItemsContainer.innerHTML = "";
        flightsToShow.forEach((flight) => {
          console.log('flight:', flight);
          const flightCard = document.createElement("div");
          flightCard.className = "carousel-item w-full";
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

      displayFlights();

      document.getElementById("next-btn-flight").addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % totalFlights.length;
        displayFlights();
      });

      document.getElementById("prev-btn-flight").addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + totalFlights.length) % totalFlights.length;
        displayFlights();
      });

    } catch (error) {
      console.error("Error loading flights:", error);
    }
  }

  async function loadActivities() {
    try {
      const data = await callAPI('https://symfony-9z0y.onrender.com/activities/bulk', 'GET');
      const activitiesItemsContainer = document.getElementById("activities-items");
      activitiesItemsContainer.innerHTML = ""; // Xóa nội dung cũ

      const itemsPerPage = 5;
      let currentIndex = 0;
      const totalActivities = data;

      function displayActivities() {
        const activitiesToShow = [];
        for (let i = 0; i < itemsPerPage; i++) {
          const index = (currentIndex + i) % totalActivities.length;
          activitiesToShow.push(totalActivities[index]);
        }

        activitiesItemsContainer.innerHTML = "";
        activitiesToShow.forEach((activities) => {
          console.log('activities:', activities);
          const activityCard = document.createElement("div");
          activityCard.className = "carousel-item w-full";
          activityCard.innerHTML = `
            <a href="activity-detail.html?id=${activities.activityId}">
            </a>
            <div class="px-3 pb-4">
                <a href="activity-detail.html?id=${activities.activityId}">
                    <h5 class="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">${activities.name}</h5>
                </a>
            </div>
          `;
          activitiesItemsContainer.appendChild(activityCard);
        });
      }

      displayActivities();

      document.getElementById("next-btn-activities").addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % totalActivities.length;
        displayActivities();
      });

      document.getElementById("prev-btn-activities").addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + totalActivities.length) % totalActivities.length;
        displayActivities();
      });

    } catch (error) {
      console.error("Error loading activities:", error);
    }
  }

  // Gọi hàm loadCombos để tải dữ liệu khi DOM đã sẵn sàng
  loadCombos();
  loadHotels();
  loadFlights();
  loadActivities();
});
