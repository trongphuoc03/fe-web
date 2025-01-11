window.document.addEventListener("DOMContentLoaded", function () {
  async function callAPI(endpoint, method, body = null, isFile = false) {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    if (!isFile) {
      headers["Content-Type"] = "application/json";
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

  function formatDateToYMDHIS(datetimeLocalValue) {
    const date = new Date(datetimeLocalValue);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  function createActivity() {
    const formData = new FormData();
    const file = document.getElementById("file").files[0]; // Lấy file từ input
    formData.append("file", file); // Thêm file vào formData
    formData.append("name", document.getElementById("name").value);
    formData.append("emptySlot", document.getElementById("emptySlot").value);
    formData.append("location", document.getElementById("location").value);
    formData.append(
      "description",
      document.getElementById("description").value
    );
    formData.append("price", document.getElementById("price").value);

    // Gọi API để tạo hoạt động
    callAPI(
      "https://symfony-9z0y.onrender.com/activities",
      "POST",
      formData,
      true
    )
      .then((response) => {
        console.log("Activity created:", response);
        alert("Activity created successfully!"); // Thông báo thành công
      })
      .catch((error) => {
        console.error("Error creating activity:", error);
        alert("Error creating activity. Please try again."); // Thông báo lỗi
      });
  }

  function createFlight() {
    const formData = new FormData();
    const file = document.getElementById("file").files[0];
    formData.append("file", file);
    formData.append("brand", document.getElementById("brand").value);
    formData.append("emptySlot", document.getElementById("emptySlot").value);
    formData.append(
      "startTime",
      formatDateToYMDHIS(document.getElementById("startTime").value)
    );
    formData.append(
      "endTime",
      formatDateToYMDHIS(document.getElementById("endTime").value)
    );
    formData.append(
      "startLocation",
      document.getElementById("startLocation").value
    );
    formData.append(
      "endLocation",
      document.getElementById("endLocation").value
    );
    formData.append("price", document.getElementById("price").value);

    callAPI("https://symfony-9z0y.onrender.com/flights", "POST", formData, true)
      .then((response) => {
        alert("Flight created successfully!");
        console.log("Success:", response);
      })
      .catch((error) => {
        alert("Failed to create flight. Please try again.");
        console.error("Error:", error);
      });
  }

  function createCombo() {
    const formData = new FormData();
    const file = document.getElementById("comboFile").files[0];
    formData.append("file", file);
    formData.append("name", document.getElementById("comboName").value);
    formData.append(
      "description",
      document.getElementById("comboDescription").value
    );
    formData.append("price", document.getElementById("comboPrice").value);
    formData.append("flightId", document.getElementById("comboFlightId").value);
    formData.append("hotelId", document.getElementById("comboHotelId").value);
    formData.append(
      "activityId",
      document.getElementById("comboActivityId").value
    );

    callAPI("https://symfony-9z0y.onrender.com/combos", "POST", formData, true)
      .then((response) => {
        alert("Combo created successfully!");
        console.log("Success:", response);
      })
      .catch((error) => {
        alert("Failed to create combo. Please try again.");
        console.error("Error:", error);
      });
  }

  function createHotel() {
    const formData = new FormData();
    const file = document.getElementById("file").files[0];
    formData.append("file", file);
    formData.append("name", document.getElementById("name").value);
    formData.append("location", document.getElementById("location").value);
    formData.append("phone", document.getElementById("phone").value);
    formData.append("emptyRoom", document.getElementById("emptyRoom").value);
    formData.append("price", document.getElementById("price").value);
    formData.append(
      "description",
      document.getElementById("description").value
    );

    callAPI("https://symfony-9z0y.onrender.com/hotels", "POST", formData, true)
      .then((response) => {
        alert("Hotel created successfully!");
        console.log("Success:", response);
      })
      .catch((error) => {
        alert("Failed to create hotel. Please try again.");
        console.error("Error:", error);
      });
  }

  function createPromo() {
    const formData = new FormData();
    const file = document.getElementById("promoFile").files[0];
    formData.append("file", file);
    formData.append("name", document.getElementById("promoName").value);
    formData.append(
      "description",
      document.getElementById("promoDescription").value
    );
    formData.append("discount", document.getElementById("promoDiscount").value);
    formData.append(
      "expiredDate",
      formatDateToYMDHIS(document.getElementById("promoExpiredDate").value)
    );
    formData.append("amount", document.getElementById("promoAmount").value);
    formData.append(
      "conditions",
      document.getElementById("promoConditions").value
    );

    callAPI("https://symfony-9z0y.onrender.com/promos", "POST", formData, true)
      .then((response) => {
        alert("Promo created successfully!");
        console.log("Success:", response);
      })
      .catch((error) => {
        alert("Failed to create promo. Please try again.");
        console.error("Error:", error);
      });
  }

  function getAllActivities() {
    callAPI("https://symfony-9z0y.onrender.com/activities/bulk", "GET")
      .then((response) => {
        // Giả sử response.data chứa mảng các hoạt động
        const activities = response; // Dữ liệu đã trả về chính là mảng bạn cần
        console.log("Activities:", activities);

        const itemSelectEdit = document.getElementById("item-select-edit");
        const itemSelectDelete = document.getElementById("item-select-delete");

        // Đổ dữ liệu vào dropdown chọn hoạt động
        if (activities.length > 0) {
          activities.forEach((activity) => {
            if (itemSelectEdit) {
              const optionEdit = document.createElement("option");
              optionEdit.value = activity.activityId; // Sử dụng đúng thuộc tính id của activity
              optionEdit.textContent = activity.name;
              itemSelectEdit.appendChild(optionEdit);
            }

            if (itemSelectDelete) {
              const optionDelete = document.createElement("option");
              optionDelete.value = activity.activityId; // Sử dụng đúng thuộc tính id của activity
              optionDelete.textContent = activity.name;
              itemSelectDelete.appendChild(optionDelete);
            }
          });
        } else {
          console.error("Không có dữ liệu hoạt động để hiển thị.");
        }
      })
      .catch((error) => {
        console.error("Error fetching activities:", error);
      });
  }

  function getAllPromos() {
    callAPI("https://symfony-9z0y.onrender.com/promos/bulk", "GET")
      .then((response) => {
        // Giả sử response chứa mảng các promo
        const promos = response; // Dữ liệu đã trả về chính là mảng bạn cần
        console.log("Promos:", promos);

        const itemSelectEdit = document.getElementById("promo-select-edit");
        const itemSelectDelete = document.getElementById("promo-select-delete");

        // Đổ dữ liệu vào dropdown chọn promo
        if (promos.length > 0) {
          promos.forEach((promo) => {
            if (itemSelectEdit) {
              const optionEdit = document.createElement("option");
              optionEdit.value = promo.id; // Sử dụng đúng thuộc tính id của promo
              optionEdit.textContent = promo.name;
              itemSelectEdit.appendChild(optionEdit);
            }

            if (itemSelectDelete) {
              const optionDelete = document.createElement("option");
              optionDelete.value = promo.id; // Sử dụng đúng thuộc tính id của promo
              optionDelete.textContent = promo.name;
              itemSelectDelete.appendChild(optionDelete);
            }
          });
        } else {
          console.error("Không có dữ liệu promo để hiển thị.");
        }
      })
      .catch((error) => {
        console.error("Error fetching promos:", error);
      });
  }

  function getAllHotels() {
    callAPI("https://symfony-9z0y.onrender.com/hotels/bulk", "GET")
      .then((response) => {
        // Giả sử response.data chứa mảng các khách sạn
        const hotels = response; // Truy cập vào response.data
        console.log("Hotels:", hotels);

        const itemSelectEdit = document.getElementById("hotel-select-edit");
        const itemSelectDelete = document.getElementById("hotel-select-delete");

        // Đổ dữ liệu vào dropdown chọn khách sạn
        if (hotels.length > 0) {
          hotels.forEach((hotel) => {
            if (itemSelectEdit) {
              const optionEdit = document.createElement("option");
              optionEdit.value = hotel.id; // Sử dụng id của hotel
              optionEdit.textContent = hotel.name;
              itemSelectEdit.appendChild(optionEdit);
            }

            if (itemSelectDelete) {
              const optionDelete = document.createElement("option");
              optionDelete.value = hotel.id; // Sử dụng id của hotel
              optionDelete.textContent = hotel.name;
              itemSelectDelete.appendChild(optionDelete);
            }
          });
        } else {
          console.error("Không có dữ liệu khách sạn để hiển thị.");
        }
      })
      .catch((error) => {
        console.error("Error fetching hotels:", error);
      });
  }

  function getAllFlights() {
    callAPI("https://symfony-9z0y.onrender.com/flights/bulk", "GET")
      .then((response) => {
        // Giả sử response chứa mảng các flight
        const flights = response;
        console.log("Flights:", flights);

        const flightSelectEdit = document.getElementById("flight-select-edit");
        const flightSelectDelete = document.getElementById(
          "flight-select-delete"
        );

        // Đổ dữ liệu vào dropdown chọn flight
        if (flights.length > 0) {
          flights.forEach((flight) => {
            if (flightSelectEdit) {
              const optionEdit = document.createElement("option");
              optionEdit.value = flight.id; // Đảm bảo đúng field cho id
              optionEdit.textContent = flight.id;
              flightSelectEdit.appendChild(optionEdit);
            }

            if (flightSelectDelete) {
              const optionDelete = document.createElement("option");
              optionDelete.value = flight.id; // Đảm bảo đúng field cho id
              optionDelete.textContent = flight.id;
              flightSelectDelete.appendChild(optionDelete);
            }
          });
        } else {
          console.error("Không có dữ liệu flight để hiển thị.");
        }
      })
      .catch((error) => {
        console.error("Error fetching flights:", error);
      });
  }

  function getAllCombos() {
    callAPI("https://symfony-9z0y.onrender.com/combos/bulk", "GET")
      .then((response) => {
        // Giả sử response chứa mảng các combo
        const combos = response;
        console.log("Combos:", combos);

        const itemSelectEdit = document.getElementById("combo-select-edit");
        const itemSelectDelete = document.getElementById("combo-select-delete");

        // Đổ dữ liệu vào dropdown chọn combo
        if (combos.length > 0) {
          combos.forEach((combo) => {
            if (itemSelectEdit) {
              const optionEdit = document.createElement("option");
              optionEdit.value = combo.comboId;
              optionEdit.textContent = combo.name;
              itemSelectEdit.appendChild(optionEdit);
            }

            if (itemSelectDelete) {
              const optionDelete = document.createElement("option");
              optionDelete.value = combo.comboId;
              optionDelete.textContent = combo.name;
              itemSelectDelete.appendChild(optionDelete);
            }
          });
        } else {
          console.error("Không có dữ liệu combo để hiển thị.");
        }
      })
      .catch((error) => {
        console.error("Error fetching combos:", error);
      });
  }

  function getAllBookings() {
    callAPI("https://symfony-9z0y.onrender.com/bookings/bulk", "GET")
      .then((response) => {
        // Giả sử response chứa mảng các booking
        const bookings = response;
        console.log("Bookings:", bookings);

        const itemSelectEdit = document.getElementById("booking-select-edit");
        const itemSelectDelete = document.getElementById(
          "booking-select-delete"
        );

        // Đổ dữ liệu vào dropdown chọn booking
        if (bookings.length > 0) {
          bookings.forEach((booking) => {
            if (itemSelectEdit) {
              const optionEdit = document.createElement("option");
              optionEdit.value = booking.booking.id;
              optionEdit.textContent = booking.booking.id;
              itemSelectEdit.appendChild(optionEdit);
            }

            if (itemSelectDelete) {
              const optionDelete = document.createElement("option");
              optionDelete.value = booking.booking.id;
              optionDelete.textContent = booking.booking.id;
              itemSelectDelete.appendChild(optionDelete);
            }
          });
        } else {
          console.error("Không có dữ liệu booking để hiển thị.");
        }
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
      });
  }

  function updateActivity(EditActivityId) {
    if (!EditActivityId) {
      console.error("No activity selected.");
      return;
    }

    const body = {
      name: document.getElementById("name").value,
      location: document.getElementById("location").value,
      description: document.getElementById("description").value,
      price: document.getElementById("price").value,
    };

    callAPI(
      `https://symfony-9z0y.onrender.com/activities/${EditActivityId}`,
      "PATCH",
      body
    )
      .then((response) => {
        console.log("Activity updated:", response.data);
        alert("Activity updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating activity:", error);
      });
  }

  function updatePromo(EditPromoId) {
    if (!EditPromoId) {
      console.error("No promo selected.");
      return;
    }

    const body = {
      name: document.getElementById("updatePromoName").value,
      description: document.getElementById("updatePromoDescription").value,
      discount: document.getElementById("updatePromoDiscount").value,
      expiredDate: formatDateToYMDHIS(
        document.getElementById("updatePromoExpiredDate").value
      ),
      amount: document.getElementById("updatePromoAmount").value,
      conditions: document.getElementById("updatePromoConditions").value,
    };

    callAPI(
      `https://symfony-9z0y.onrender.com/promos/${EditPromoId}`,
      "PATCH",
      body
    )
      .then((response) => {
        console.log("Promo updated:", response.data);
        alert("Promo updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating promo:", error);
      });
  }

  function updateHotel(EditHotelId) {
    if (!EditHotelId) {
      console.error("No hotel selected.");
      return;
    }

    const body = {
      name: document.getElementById("updateName").value,
      location: document.getElementById("updateLocation").value,
      phone: document.getElementById("updatePhone").value,
      emptyRoom: document.getElementById("updateEmptyRoom").value,
      price: document.getElementById("updatePrice").value,
      description: document.getElementById("updateDescription").value,
    };

    callAPI(
      `https://symfony-9z0y.onrender.com/hotels/${EditHotelId}`,
      "PATCH",
      body
    )
      .then((response) => {
        console.log("Hotel updated:", response.data);
        alert("Hotel updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating hotel:", error);
      });
  }

  function updateFlight(EditFlightId) {
    if (!EditFlightId) {
      console.error("No flight selected.");
      return;
    }

    const body = {
      brand: document.getElementById("updateBrand").value,
      emptySlot: document.getElementById("updateEmptySlot").value,
      startTime: formatDateToYMDHIS(
        document.getElementById("updateStartTime").value
      ),
      endTime: formatDateToYMDHIS(
        document.getElementById("updateEndTime").value
      ),
      startLocation: document.getElementById("updateStartLocation").value,
      endLocation: document.getElementById("updateEndLocation").value,
      price: document.getElementById("updatePrice").value,
    };

    callAPI(
      `https://symfony-9z0y.onrender.com/flights/${EditFlightId}`,
      "PATCH",
      body
    )
      .then((response) => {
        console.log("Flight updated:", response.data);
        alert("Flight updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating flight:", error);
      });
  }

  function updateCombo(EditComboId) {
    if (!EditComboId) {
      console.error("No combo selected.");
      return;
    }

    const body = {
      name: document.getElementById("updateComboName").value,
      description: document.getElementById("updateComboDescription").value,
      price: document.getElementById("updateComboPrice").value,
    };

    callAPI(
      `https://symfony-9z0y.onrender.com/combos/${EditComboId}`,
      "PATCH",
      body
    )
      .then((response) => {
        console.log("Combo updated:", response.data);
        alert("Combo updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating combo:", error);
      });
  }

  function updateBooking(EditBookingId) {
    if (!EditBookingId) {
      console.error("No booking selected.");
      return;
    }

    const body = {
      totalPrice: document.getElementById("updateTotalPrice").value,
      status: document.getElementById("updateStatus").value,
    };

    callAPI(
      `https://symfony-9z0y.onrender.com/bookings/${EditBookingId}`,
      "PATCH",
      body
    )
      .then((response) => {
        console.log("Booking updated:", response.data);
        alert("Booking updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating booking:", error);
      });
  }

  function deleteActivity(DeleteActivityId) {
    if (!DeleteActivityId) {
      console.error("No activity selected.");
      return;
    }

    callAPI(
      `https://symfony-9z0y.onrender.com/activities/${DeleteActivityId}`,
      "DELETE"
    )
      .then((response) => {
        console.log("Activity deleted:", response.data);
        alert("Activity deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting activity:", error);
      });
  }

  function deleteBooking(DeleteBookingId) {
    if (!DeleteBookingId) {
      console.error("No booking selected.");
      return;
    }

    callAPI(
      `https://symfony-9z0y.onrender.com/bookings/${DeleteBookingId}`,
      "DELETE"
    )
      .then((response) => {
        console.log("Booking deleted:", response.data);
        alert("Booking deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting booking:", error);
      });
  }

  function deleteCombo(DeleteComboId) {
    if (!DeleteComboId) {
      console.error("No combo selected.");
      return;
    }

    callAPI(
      `https://symfony-9z0y.onrender.com/combos/${DeleteComboId}`,
      "DELETE"
    )
      .then((response) => {
        console.log("Combo deleted:", response.data);
        alert("Combo deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting combo:", error);
      });
  }

  function deleteFlight(DeleteFlightId) {
    if (!DeleteFlightId) {
      console.error("No flight selected.");
      return;
    }

    callAPI(
      `https://symfony-9z0y.onrender.com/flights/${DeleteFlightId}`,
      "DELETE"
    )
      .then((response) => {
        console.log("Flight deleted:", response.data);
        alert("Flight deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting flight:", error);
      });
  }

  function deleteHotel(DeleteHotelId) {
    if (!DeleteHotelId) {
      console.error("No hotel selected.");
      return;
    }

    callAPI(
      `https://symfony-9z0y.onrender.com/hotels/${DeleteHotelId}`,
      "DELETE"
    )
      .then((response) => {
        console.log("Hotel deleted:", response.data);
        alert("Hotel deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting hotel:", error);
      });
  }

  function deletePromo(DeletePromoId) {
    if (!DeletePromoId) {
      console.error("No promo selected.");
      return;
    }

    callAPI(
      `https://symfony-9z0y.onrender.com/promos/${DeletePromoId}`,
      "DELETE"
    )
      .then((response) => {
        console.log("Promo deleted:", response.data);
        alert("Promo deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting promo:", error);
      });
  }

  function showFeedbackDetails(feedbackId, feedbackInfoDiv) {
    callAPI(`https://symfony-9z0y.onrender.com/feedbacks/${feedbackId}`, "GET")
      .then((response) => {
        const feedback = response; // Giả sử phản hồi là một đối tượng
  
        // Hiển thị thông tin chi tiết trong phần feedback-info
        feedbackInfoDiv.innerHTML = `
          <h3>Feedback Details</h3>
          <p><strong>ID:</strong> ${feedback.id}</p>
          <p><strong>Comment:</strong> ${feedback.comment}</p>
          <p><strong>Created Date:</strong> ${feedback.createdDate}</p>
          <p><strong>Rated Type:</strong> ${feedback.ratedType}</p>
          <p><strong>Rating:</strong> ${feedback.rating}</p>
          <p><strong>Related ID:</strong> ${feedback.relatedId}</p>
          <p><strong>User ID:</strong> ${feedback.userId}</p>
        `;
        feedbackInfoDiv.classList.remove("hidden"); // Hiển thị phần nội dung feedback
      })
      .catch((error) => {
        console.error("Error fetching feedback details:", error);
      });
  }

  function bulkReadFeedback() {
    callAPI("https://symfony-9z0y.onrender.com/feedbacks/bulk", "GET")
      .then((response) => {
        // Giả sử response chứa mảng các feedback
        const feedbacks = response;
        console.log("Feedbacks:", feedbacks);

        const itemSelectEdit = document.getElementById("feedback-select-edit");
        const itemSelectDelete = document.getElementById(
          "feedback-select-delete"
        );

        // Đổ dữ liệu vào dropdown chọn feedback
        if (feedbacks.length > 0) {
          feedbacks.forEach((feedback) => {
            if (itemSelectEdit) {
              const optionEdit = document.createElement("option");
              optionEdit.value = feedback.id; // Sử dụng đúng thuộc tính id của feedback
              optionEdit.textContent =
                feedback.name || `Feedback ${feedback.id}`;
              itemSelectEdit.appendChild(optionEdit);
            }

            if (itemSelectDelete) {
              const optionDelete = document.createElement("option");
              optionDelete.value = feedback.id; // Sử dụng đúng thuộc tính id của feedback
              optionDelete.textContent =
                feedback.name || `Feedback ${feedback.id}`;
              itemSelectDelete.appendChild(optionDelete);
            }
          });
        } else {
          console.error("Không có dữ liệu feedback để hiển thị.");
        }
      })
      .catch((error) => {
        console.error("Error fetching feedbacks:", error);
      });
  }

  function deleteFeedback(DeleteFeedbackId) {
    if (!DeleteFeedbackId) {
      console.error("No feedback selected.");
      return;
    }
  
    callAPI(
      `https://symfony-9z0y.onrender.com/feedbacks/${DeleteFeedbackId}`,
      "DELETE"
    )
      .then((response) => {
        console.log("Feedback deleted:", response.data);
        alert("Feedback deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting feedback:", error);
      });
  }

  // Cập nhật hàm handleAction để sử dụng các API
  window.handleAction = function (actionType, itemType) {
    const contentContainer = document.getElementById("dynamic-content");
    contentContainer.innerHTML = ""; // Xóa nội dung cũ

    if (actionType === "add") {
      showAddForm(itemType, contentContainer);
    } else if (actionType === "edit") {
      showEditForm(itemType, contentContainer);
    } else if (actionType === "delete") {
      showDeleteConfirmation(itemType, contentContainer);
    } else {
      console.error(`Unknown action type: ${actionType}`);
    }
  };

  function showAddForm(itemType, container) {
    if (itemType === "Activity") {
      container.innerHTML = `
        <h2 class="text-2xl font-semibold mb-4">Add ${itemType}</h2>
        <form id="add-form" class="space-y-4">
            <input id="name" type="text" class="block w-full mb-2 border rounded p-2" placeholder="Name">
            <input id="location" type="text" class="block w-full mb-2 border rounded p-2" placeholder="Location">
            <input id="emptySlot" type="text" class="block w-full mb-2 border rounded p-2" placeholder="Empty Slot">
            <textarea id="description" class="block w-full mb-2 border rounded p-2" placeholder="Description"></textarea>
            <input id="price" type="number" class="block w-full mb-2 border rounded p-2" placeholder="Price">
            <input id="file" type="file" class="block w-full mb-2 border rounded p-2" placeholder="Upload File">
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        </form>
    `;

      const form = document.getElementById("add-form");
      form.onsubmit = function (event) {
        event.preventDefault(); // Ngăn reload trang
        createActivity(); // Gọi hàm createActivity để thêm mới hoạt động
        container.innerHTML = ""; // Xóa form sau khi thêm
      };
    }
    if (itemType === "Flight") {
      container.innerHTML = `
      <h2 class="text-2xl font-semibold mb-4">Add ${itemType}</h2>
      <form id="add-form" class="space-y-4">
          <input id="brand" type="text" class="block w-full mb-2 border rounded p-2" placeholder="Brand">
          <input id="emptySlot" type="text" class="block w-full mb-2 border rounded p-2" placeholder="Empty Slot">
          <input id="startTime" type="datetime-local" class="block w-full mb-2 border rounded p-2" placeholder="Start Time">
          <input id="endTime" type="datetime-local" class="block w-full mb-2 border rounded p-2" placeholder="End Time">
          <input id="startLocation" type="text" class="block w-full mb-2 border rounded p-2" placeholder="Start Location">
          <input id="endLocation" type="text" class="block w-full mb-2 border rounded p-2" placeholder="End Location">
          <input id="price" type="number" class="block w-full mb-2 border rounded p-2" placeholder="Price">
          <input id="file" type="file" class="block w-full mb-2 border rounded p-2" placeholder="Upload File">
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
      </form>
    `;

      const form = document.getElementById("add-form");
      form.onsubmit = function (event) {
        event.preventDefault(); // Ngăn reload trang
        createFlight(); // Gọi hàm createFlight để thêm mới hoạt động
        container.innerHTML = ""; // Xóa form sau khi thêm
      };
    }
    if (itemType === "Hotel") {
      container.innerHTML = `
  <h2 class="text-2xl font-semibold mb-4">Add ${itemType}</h2>
  <form id="add-form" class="space-y-4">
      <input id="name" type="text" class="block w-full mb-2 border rounded p-2" placeholder="Hotel Name">
      <input id="location" type="text" class="block w-full mb-2 border rounded p-2" placeholder="Location">
      <input id="phone" type="text" class="block w-full mb-2 border rounded p-2" placeholder="Phone">
      <input id="emptyRoom" type="number" class="block w-full mb-2 border rounded p-2" placeholder="Empty Rooms">
      <input id="price" type="number" class="block w-full mb-2 border rounded p-2" placeholder="Price">
      <textarea id="description" class="block w-full mb-2 border rounded p-2" placeholder="Description"></textarea>
      <input id="file" type="file" class="block w-full mb-2 border rounded p-2" placeholder="Upload File">
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
  </form>
`;

      const form = document.getElementById("add-form");
      form.onsubmit = function (event) {
        event.preventDefault(); // Ngăn reload trang
        createHotel(); // Gọi hàm createHotel đã định nghĩa ngoài
        container.innerHTML = ""; // Xóa form sau khi thêm
      };
    }
    if (itemType === "Combo") {
      container.innerHTML = `
  <h2 class="text-2xl font-semibold mb-4">Add ${itemType}</h2>
  <form id="add-form" class="space-y-4">
      <input id="comboName" type="text" class="block w-full mb-2 border rounded p-2" placeholder="Combo Name">
      <textarea id="comboDescription" class="block w-full mb-2 border rounded p-2" placeholder="Description"></textarea>
      <input id="comboPrice" type="number" class="block w-full mb-2 border rounded p-2" placeholder="Price">
      <input id="comboFlightId" type="text" class="block w-full mb-2 border rounded p-2" placeholder="Flight ID">
      <input id="comboHotelId" type="text" class="block w-full mb-2 border rounded p-2" placeholder="Hotel ID">
      <input id="comboActivityId" type="text" class="block w-full mb-2 border rounded p-2" placeholder="Activity ID">
      <input id="comboFile" type="file" class="block w-full mb-2 border rounded p-2" placeholder="Upload File">
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
  </form>
`;

      const form = document.getElementById("add-form");
      form.onsubmit = function (event) {
        event.preventDefault(); // Ngăn reload trang
        createCombo(); // Gọi hàm createCombo đã định nghĩa ngoài
        container.innerHTML = ""; // Xóa form sau khi thêm
      };
    }
    if (itemType === "Promo") {
      container.innerHTML = `
  <h2 class="text-2xl font-semibold mb-4">Add ${itemType}</h2>
  <form id="add-form" class="space-y-4">
      <input id="promoName" type="text" class="block w-full mb-2 border rounded p-2" placeholder="Promo Name">
      <textarea id="promoDescription" class="block w-full mb-2 border rounded p-2" placeholder="Description"></textarea>
      <input id="promoDiscount" type="number" class="block w-full mb-2 border rounded p-2" placeholder="Discount">
      <input id="promoExpiredDate" type="datetime-local" class="block w-full mb-2 border rounded p-2" placeholder="Expired Date">
      <input id="promoAmount" type="number" class="block w-full mb-2 border rounded p-2" placeholder="Amount">
      <textarea id="promoConditions" class="block w-full mb-2 border rounded p-2" placeholder="Conditions"></textarea>
      <input id="promoFile" type="file" class="block w-full mb-2 border rounded p-2" placeholder="Upload File">
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
  </form>
`;

      const form = document.getElementById("add-form");
      form.onsubmit = function (event) {
        event.preventDefault(); // Ngăn reload trang
        createPromo(); // Gọi hàm createPromo đã định nghĩa ngoài
        container.innerHTML = ""; // Xóa form sau khi thêm
      };
    }
  }

  function showEditForm(itemType, container) {
    if (itemType === "Activity") {
      container.innerHTML = `
        <h2 class="text-2xl font-semibold mb-4">Edit ${itemType}</h2>
        <form id="edit-form" class="space-y-4">
            <select id="item-select-edit" class="block w-full mb-2 border rounded p-2">
                <option value="" disabled selected>Select ${itemType} to edit</option>
                <!-- Các dịch vụ sẽ được hiển thị ở đây -->
            </select>
            <input id="name" type="text" class="block w-full mb-2 border rounded p-2" placeholder="New Name">
            <input id="location" type="text" class="block w-full mb-2 border rounded p-2" placeholder="New Location">
            <textarea id="description" class="block w-full mb-2 border rounded p-2" placeholder="New Description"></textarea>
            <input id="price" type="number" class="block w-full mb-2 border rounded p-2" placeholder="New Price">
            <button type="submit" class="bg-yellow-500 text-white px-4 py-2 rounded">Update</button>
        </form>
    `;

      // Lấy danh sách tất cả hoạt động và hiển thị trong dropdown
      getAllActivities(); // Gọi hàm để lấy danh sách

      const activitySelectEdit = document.getElementById("item-select-edit");

      let EditActivityId = null; // Khởi tạo biến EditActivityId

      // Thêm sự kiện 'change' để lưu lại id của đối tượng được chọn
      activitySelectEdit.addEventListener("change", function () {
        EditActivityId = activitySelectEdit.value; // Lưu id của đối tượng đã chọn
        console.log("Selected Activity ID:", EditActivityId); // In ra id đã chọn, có thể thay bằng hành động khác để xử lý
      });

      const form = document.getElementById("edit-form");
      form.onsubmit = function (event) {
        event.preventDefault();
        updateActivity(EditActivityId); // Truyền selectedId vào hàm updateActivity
        container.innerHTML = ""; // Xóa form sau khi cập nhật
      };
    }
    if (itemType === "Flight") {
      container.innerHTML = `
      <h2 class="text-2xl font-semibold mb-4">Edit ${itemType}</h2>
      <form id="edit-form" class="space-y-4">
          <select id="flight-select-edit" class="block w-full mb-2 border rounded p-2">
              <option value="" disabled selected>Select ${itemType} to edit</option>
              <!-- Các dịch vụ sẽ được hiển thị ở đây -->
          </select>
          <input id="updateBrand" type="text" class="block w-full mb-2 border rounded p-2" placeholder="New Brand">
          <input id="updateEmptySlot" type="text" class="block w-full mb-2 border rounded p-2" placeholder="New Empty Slot">
          <input id="updateStartTime" type="datetime-local" class="block w-full mb-2 border rounded p-2" placeholder="New Start Time">
          <input id="updateEndTime" type="datetime-local" class="block w-full mb-2 border rounded p-2" placeholder="New End Time">
          <input id="updateStartLocation" type="text" class="block w-full mb-2 border rounded p-2" placeholder="New Start Location">
          <input id="updateEndLocation" type="text" class="block w-full mb-2 border rounded p-2" placeholder="New End Location">
          <input id="updatePrice" type="number" class="block w-full mb-2 border rounded p-2" placeholder="New Price">
          <button type="submit" class="bg-yellow-500 text-white px-4 py-2 rounded">Update</button>
      </form>
    `;

      getAllFlights(); // Gọi hàm để lấy danh sách

      const flightSelectEdit = document.getElementById("flight-select-edit");

      let EditFlightId = null; // Khởi tạo biến EditFlightId

      flightSelectEdit.addEventListener("change", function () {
        EditFlightId = flightSelectEdit.value; // Lưu id của đối tượng đã chọn
        console.log("Selected Flight ID:", EditFlightId); // In ra id đã chọn, có thể thay bằng hành động khác để xử lý
      });

      const form = document.getElementById("edit-form");
      form.onsubmit = function (event) {
        event.preventDefault();
        updateFlight(EditFlightId); // Truyền selectedId vào hàm updateFlight
        container.innerHTML = ""; // Xóa form sau khi cập nhật
      };
    }
    if (itemType === "Hotel") {
      container.innerHTML = `
        <h2 class="text-2xl font-semibold mb-4">Edit ${itemType}</h2>
        <form id="edit-form" class="space-y-4">
            <select id="hotel-select-edit" class="block w-full mb-2 border rounded p-2">
                <option value="" disabled selected>Select ${itemType} to edit</option>
                <!-- Các khách sạn sẽ được hiển thị ở đây -->
            </select>
            <input id="updateName" type="text" class="block w-full mb-2 border rounded p-2" placeholder="New Name">
            <input id="updateLocation" type="text" class="block w-full mb-2 border rounded p-2" placeholder="New Location">
            <input id="updatePhone" type="text" class="block w-full mb-2 border rounded p-2" placeholder="New Phone">
            <input id="updateEmptyRoom" type="text" class="block w-full mb-2 border rounded p-2" placeholder="New Empty Room">
            <input id="updatePrice" type="number" class="block w-full mb-2 border rounded p-2" placeholder="New Price">
            <input id="updateDescription" type="text" class="block w-full mb-2 border rounded p-2" placeholder="New Description">
            <button type="submit" class="bg-yellow-500 text-white px-4 py-2 rounded">Update</button>
        </form>
      `;

      getAllHotels(); // Gọi hàm để lấy danh sách khách sạn

      const hotelSelectEdit = document.getElementById("hotel-select-edit");

      let EditHotelId = null; // Khởi tạo biến EditHotelId

      hotelSelectEdit.addEventListener("change", function () {
        EditHotelId = hotelSelectEdit.value; // Lưu id của khách sạn đã chọn
        console.log("Selected Hotel ID:", EditHotelId); // In ra id đã chọn
      });

      const form = document.getElementById("edit-form");
      form.onsubmit = function (event) {
        event.preventDefault();
        updateHotel(EditHotelId); // Truyền EditHotelId vào hàm updateHotel
        container.innerHTML = ""; // Xóa form sau khi cập nhật
      };
    }
    if (itemType === "Combo") {
      container.innerHTML = `
        <h2 class="text-2xl font-semibold mb-4">Edit ${itemType}</h2>
        <form id="edit-form" class="space-y-4">
            <select id="combo-select-edit" class="block w-full mb-2 border rounded p-2">
                <option value="" disabled selected>Select ${itemType} to edit</option>
                <!-- Các combo sẽ được hiển thị ở đây -->
            </select>
            <input id="updateComboName" type="text" class="block w-full mb-2 border rounded p-2" placeholder="New Combo Name">
            <input id="updateComboDescription" type="text" class="block w-full mb-2 border rounded p-2" placeholder="New Description">
            <input id="updateComboPrice" type="number" class="block w-full mb-2 border rounded p-2" placeholder="New Price">
            <button type="submit" class="bg-yellow-500 text-white px-4 py-2 rounded">Update</button>
        </form>
      `;

      getAllCombos(); // Gọi hàm để lấy danh sách combo

      const comboSelectEdit = document.getElementById("combo-select-edit");

      let EditComboId = null; // Khởi tạo biến EditComboId

      comboSelectEdit.addEventListener("change", function () {
        EditComboId = comboSelectEdit.value; // Lưu id của combo đã chọn
        console.log("Selected Combo ID:", EditComboId); // In ra id đã chọn
      });

      const form = document.getElementById("edit-form");
      form.onsubmit = function (event) {
        event.preventDefault();
        updateCombo(EditComboId); // Truyền EditComboId vào hàm updateCombo
        container.innerHTML = ""; // Xóa form sau khi cập nhật
      };
    }
    if (itemType === "Promo") {
      container.innerHTML = `
        <h2 class="text-2xl font-semibold mb-4">Edit ${itemType}</h2>
        <form id="edit-form" class="space-y-4">
            <select id="promo-select-edit" class="block w-full mb-2 border rounded p-2">
                <option value="" disabled selected>Select ${itemType} to edit</option>
                <!-- Các promo sẽ được hiển thị ở đây -->
            </select>
            <input id="updatePromoName" type="text" class="block w-full mb-2 border rounded p-2" placeholder="New Promo Name">
            <input id="updatePromoDescription" type="text" class="block w-full mb-2 border rounded p-2" placeholder="New Description">
            <input id="updatePromoDiscount" type="number" class="block w-full mb-2 border rounded p-2" placeholder="New Discount">
            <input id="updatePromoExpiredDate" type="datetime-local" class="block w-full mb-2 border rounded p-2" placeholder="New Expired Date">
            <input id="updatePromoAmount" type="number" class="block w-full mb-2 border rounded p-2" placeholder="New Amount">
            <input id="updatePromoConditions" type="text" class="block w-full mb-2 border rounded p-2" placeholder="New Conditions">
            <button type="submit" class="bg-yellow-500 text-white px-4 py-2 rounded">Update</button>
        </form>
      `;

      getAllPromos(); // Gọi hàm để lấy danh sách promo

      const promoSelectEdit = document.getElementById("promo-select-edit");

      let EditPromoId = null; // Khởi tạo biến EditPromoId

      promoSelectEdit.addEventListener("change", function () {
        EditPromoId = promoSelectEdit.value; // Lưu id của promo đã chọn
        console.log("Selected Promo ID:", EditPromoId); // In ra id đã chọn
      });

      const form = document.getElementById("edit-form");
      form.onsubmit = function (event) {
        event.preventDefault();
        updatePromo(EditPromoId); // Truyền EditPromoId vào hàm updatePromo
        container.innerHTML = ""; // Xóa form sau khi cập nhật
      };
    }
    if (itemType === "Booking") {
      container.innerHTML = `
        <h2 class="text-2xl font-semibold mb-4">Edit ${itemType}</h2>
        <form id="edit-form" class="space-y-4">
            <select id="booking-select-edit" class="block w-full mb-2 border rounded p-2">
                <option value="" disabled selected>Select ${itemType} to edit</option>
                <!-- Các booking sẽ được hiển thị ở đây -->
            </select>
            <input id="updateTotalPrice" type="number" class="block w-full mb-2 border rounded p-2" placeholder="New Total Price">
            <input id="updateStatus" type="text" class="block w-full mb-2 border rounded p-2" placeholder="New Status">
            <button type="submit" class="bg-yellow-500 text-white px-4 py-2 rounded">Update</button>
        </form>
      `;

      getAllBookings(); // Gọi hàm để lấy danh sách booking

      const bookingSelectEdit = document.getElementById("booking-select-edit");

      let EditBookingId = null; // Khởi tạo biến EditBookingId

      bookingSelectEdit.addEventListener("change", function () {
        EditBookingId = bookingSelectEdit.value; // Lưu id của booking đã chọn
        console.log("Selected Booking ID:", EditBookingId); // In ra id đã chọn
      });

      const form = document.getElementById("edit-form");
      form.onsubmit = function (event) {
        event.preventDefault();
        updateBooking(EditBookingId); // Truyền EditBookingId vào hàm updateBooking
        container.innerHTML = ""; // Xóa form sau khi cập nhật
      };
    }
    if (itemType === "Feedback") {
      container.innerHTML = `
        <h2 class="text-2xl font-semibold mb-4">View or Edit ${itemType}</h2>
        <form id="edit-form" class="space-y-4">
            <select id="feedback-select-edit" class="block w-full mb-2 border rounded p-2">
                <option value="" disabled selected>Select ${itemType} to view or edit</option>
                <!-- Các feedback sẽ được hiển thị ở đây -->
            </select>
            <button type="button" id="view-feedback" class="bg-blue-500 text-white px-4 py-2 rounded hidden">View Feedback</button>
        </form>
        <div id="feedback-info" class="mt-4 hidden">
            <!-- Feedback details will be displayed here -->
        </div>
      `;
    
      // Lấy phần tử feedback-info
      const feedbackInfoDiv = document.getElementById("feedback-info");
    
      // Gọi hàm để lấy tất cả feedback
      bulkReadFeedback(); 
    
      const feedbackSelectEdit = document.getElementById("feedback-select-edit");
      const viewFeedbackButton = document.getElementById("view-feedback");
    
      let EditFeedbackId = null; // Khởi tạo biến EditFeedbackId
    
      feedbackSelectEdit.addEventListener("change", function () {
        EditFeedbackId = feedbackSelectEdit.value; // Lưu id của feedback đã chọn
        console.log("Selected Feedback ID:", EditFeedbackId); // In ra id đã chọn
    
        if (EditFeedbackId) {
          // Hiển thị thông tin của feedback
          showFeedbackDetails(EditFeedbackId, feedbackInfoDiv);
          viewFeedbackButton.classList.remove("hidden"); // Hiển thị nút "View Feedback"
        }
      });
    
      // Khi nhấn nút "View Feedback", gọi hàm để xem feedback
      viewFeedbackButton.addEventListener("click", function () {
        showFeedbackDetails(EditFeedbackId, feedbackInfoDiv); // Gọi hàm để hiển thị feedback
      });
    
      const form = document.getElementById("edit-form");
      form.onsubmit = function (event) {
        event.preventDefault();
        updateFeedback(EditFeedbackId); // Truyền EditFeedbackId vào hàm updateFeedback
        container.innerHTML = ""; // Xóa form sau khi cập nhật
      };
    }
  }

  function showDeleteConfirmation(itemType, container) {
    if (itemType === "Activity") {
      container.innerHTML = `
        <h2 class="text-2xl font-semibold mb-4">Delete ${itemType}</h2>
        <form id="delete-form" class="space-y-4">
            <select id="item-select-delete" class="block w-full mb-2 border rounded p-2">
                <option value="" disabled selected>Select ${itemType} to delete</option>
                <!-- Các dịch vụ sẽ được hiển thị ở đây -->
            </select>
            <button type="submit" class="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
        </form>
    `;

      // Lấy danh sách tất cả hoạt động và hiển thị trong dropdown
      getAllActivities(); // Gọi hàm để lấy danh sách
      const activitySelectDelete =
        document.getElementById("item-select-delete");

      let DeleteActivityId = null; // Khởi tạo biến DeleteActivityId

      // Thêm sự kiện 'change' để lưu lại id của đối tượng được chọn
      activitySelectDelete.addEventListener("change", function () {
        DeleteActivityId = activitySelectDelete.value; // Lưu id của đối tượng đã chọn
        console.log("Selected Activity ID:", DeleteActivityId); // In ra id đã chọn, có thể thay bằng hành động khác để xử lý
      });

      const form = document.getElementById("delete-form");
      form.onsubmit = function (event) {
        event.preventDefault();
        deleteActivity(DeleteActivityId); // Truyền selectedId vào hàm updateActivity
        container.innerHTML = ""; // Xóa form sau khi cập nhật
      };
    }
    if (itemType === "Flight") {
      container.innerHTML = `
        <h2 class="text-2xl font-semibold mb-4">Delete ${itemType}</h2>
        <form id="delete-form" class="space-y-4">
            <select id="flight-select-delete" class="block w-full mb-2 border rounded p-2">
                <option value="" disabled selected>Select ${itemType} to delete</option>
                <!-- Các chuyến bay sẽ được hiển thị ở đây -->
            </select>
            <button type="submit" class="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
        </form>
      `;

      // Lấy danh sách tất cả chuyến bay và hiển thị trong dropdown
      getAllFlights(); // Gọi hàm để lấy danh sách
      const flightSelectDelete = document.getElementById(
        "flight-select-delete"
      );

      let DeleteFlightId = null; // Khởi tạo biến DeleteFlightId

      // Thêm sự kiện 'change' để lưu lại id của đối tượng được chọn
      flightSelectDelete.addEventListener("change", function () {
        DeleteFlightId = flightSelectDelete.value; // Lưu id của đối tượng đã chọn
        console.log("Selected Flight ID:", DeleteFlightId); // In ra id đã chọn
      });

      const form = document.getElementById("delete-form");
      form.onsubmit = function (event) {
        event.preventDefault();
        deleteFlight(DeleteFlightId); // Truyền DeleteFlightId vào hàm deleteFlight
        container.innerHTML = ""; // Xóa form sau khi cập nhật
      };
    }
    if (itemType === "Hotel") {
      container.innerHTML = `
        <h2 class="text-2xl font-semibold mb-4">Delete ${itemType}</h2>
        <form id="delete-form" class="space-y-4">
            <select id="hotel-select-delete" class="block w-full mb-2 border rounded p-2">
                <option value="" disabled selected>Select ${itemType} to delete</option>
                <!-- Các khách sạn sẽ được hiển thị ở đây -->
            </select>
            <button type="submit" class="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
        </form>
      `;

      // Lấy danh sách tất cả khách sạn và hiển thị trong dropdown
      getAllHotels(); // Gọi hàm để lấy danh sách
      const hotelSelectDelete = document.getElementById("hotel-select-delete");

      let DeleteHotelId = null; // Khởi tạo biến DeleteHotelId

      // Thêm sự kiện 'change' để lưu lại id của đối tượng được chọn
      hotelSelectDelete.addEventListener("change", function () {
        DeleteHotelId = hotelSelectDelete.value; // Lưu id của đối tượng đã chọn
        console.log("Selected Hotel ID:", DeleteHotelId); // In ra id đã chọn
      });

      const form = document.getElementById("delete-form");
      form.onsubmit = function (event) {
        event.preventDefault();
        deleteHotel(DeleteHotelId); // Truyền DeleteHotelId vào hàm deleteHotel
        container.innerHTML = ""; // Xóa form sau khi cập nhật
      };
    }
    if (itemType === "Combo") {
      container.innerHTML = `
        <h2 class="text-2xl font-semibold mb-4">Delete ${itemType}</h2>
        <form id="delete-form" class="space-y-4">
            <select id="combo-select-delete" class="block w-full mb-2 border rounded p-2">
                <option value="" disabled selected>Select ${itemType} to delete</option>
                <!-- Các combo sẽ được hiển thị ở đây -->
            </select>
            <button type="submit" class="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
        </form>
      `;

      // Lấy danh sách tất cả combo và hiển thị trong dropdown
      getAllCombos(); // Gọi hàm để lấy danh sách combo
      const comboSelectDelete = document.getElementById("combo-select-delete");

      let DeleteComboId = null; // Khởi tạo biến DeleteComboId

      // Thêm sự kiện 'change' để lưu lại id của đối tượng được chọn
      comboSelectDelete.addEventListener("change", function () {
        DeleteComboId = comboSelectDelete.value; // Lưu id của đối tượng đã chọn
        console.log("Selected Combo ID:", DeleteComboId); // In ra id đã chọn
      });

      const form = document.getElementById("delete-form");
      form.onsubmit = function (event) {
        event.preventDefault();
        deleteCombo(DeleteComboId); // Truyền DeleteComboId vào hàm deleteCombo
        container.innerHTML = ""; // Xóa form sau khi cập nhật
      };
    }
    if (itemType === "Promo") {
      container.innerHTML = `
        <h2 class="text-2xl font-semibold mb-4">Delete ${itemType}</h2>
        <form id="delete-form" class="space-y-4">
            <select id="promo-select-delete" class="block w-full mb-2 border rounded p-2">
                <option value="" disabled selected>Select ${itemType} to delete</option>
                <!-- Các chương trình khuyến mãi sẽ được hiển thị ở đây -->
            </select>
            <button type="submit" class="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
        </form>
      `;

      // Lấy danh sách tất cả chương trình khuyến mãi và hiển thị trong dropdown
      getAllPromos(); // Gọi hàm để lấy danh sách promo
      const promoSelectDelete = document.getElementById("promo-select-delete");

      let DeletePromoId = null; // Khởi tạo biến DeletePromoId

      // Thêm sự kiện 'change' để lưu lại id của đối tượng được chọn
      promoSelectDelete.addEventListener("change", function () {
        DeletePromoId = promoSelectDelete.value; // Lưu id của đối tượng đã chọn
        console.log("Selected Promo ID:", DeletePromoId); // In ra id đã chọn
      });

      const form = document.getElementById("delete-form");
      form.onsubmit = function (event) {
        event.preventDefault();
        deletePromo(DeletePromoId); // Truyền DeletePromoId vào hàm deletePromo
        container.innerHTML = ""; // Xóa form sau khi cập nhật
      };
    }
    if (itemType === "Booking") {
      container.innerHTML = `
        <h2 class="text-2xl font-semibold mb-4">Delete ${itemType}</h2>
        <form id="delete-form" class="space-y-4">
            <select id="booking-select-delete" class="block w-full mb-2 border rounded p-2">
                <option value="" disabled selected>Select ${itemType} to delete</option>
                <!-- Các booking sẽ được hiển thị ở đây -->
            </select>
            <button type="submit" class="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
        </form>
      `;

      // Lấy danh sách tất cả booking và hiển thị trong dropdown
      getAllBookings(); // Gọi hàm để lấy danh sách booking
      const bookingSelectDelete = document.getElementById(
        "booking-select-delete"
      );

      let DeleteBookingId = null; // Khởi tạo biến DeleteBookingId

      // Thêm sự kiện 'change' để lưu lại id của đối tượng được chọn
      bookingSelectDelete.addEventListener("change", function () {
        DeleteBookingId = bookingSelectDelete.value; // Lưu id của đối tượng đã chọn
        console.log("Selected Booking ID:", DeleteBookingId); // In ra id đã chọn
      });

      const form = document.getElementById("delete-form");
      form.onsubmit = function (event) {
        event.preventDefault();
        deleteBooking(DeleteBookingId); // Truyền DeleteBookingId vào hàm deleteBooking
        container.innerHTML = ""; // Xóa form sau khi cập nhật
      };
    }
    if (itemType === "Feedback") {
      container.innerHTML = `
        <h2 class="text-2xl font-semibold mb-4">Delete ${itemType}</h2>
        <form id="delete-form" class="space-y-4">
            <select id="feedback-select-delete" class="block w-full mb-2 border rounded p-2">
                <option value="" disabled selected>Select ${itemType} to delete</option>
                <!-- Các feedback sẽ được hiển thị ở đây -->
            </select>
            <button type="submit" class="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
        </form>
      `;
    
      // Lấy danh sách tất cả feedback và hiển thị trong dropdown
      bulkReadFeedback(); // Gọi hàm để lấy danh sách feedback
      const feedbackSelectDelete = document.getElementById("feedback-select-delete");
    
      let DeleteFeedbackId = null; // Khởi tạo biến DeleteFeedbackId
    
      // Thêm sự kiện 'change' để lưu lại id của đối tượng được chọn
      feedbackSelectDelete.addEventListener("change", function () {
        DeleteFeedbackId = feedbackSelectDelete.value; // Lưu id của feedback đã chọn
        console.log("Selected Feedback ID:", DeleteFeedbackId); // In ra id đã chọn
      });
    
      const form = document.getElementById("delete-form");
      form.onsubmit = function (event) {
        event.preventDefault();
        deleteFeedback(DeleteFeedbackId); // Truyền DeleteFeedbackId vào hàm deleteFeedback
        container.innerHTML = ""; // Xóa form sau khi cập nhật
      };
    }
  }
});
