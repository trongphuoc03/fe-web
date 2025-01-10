document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("order_id");
  const promoId = urlParams.get("promoId");
  const paymentContainer = document.getElementById("payment-container");

  if (!orderId) {
    alert("No order ID provided.");
    window.location.href = "orders.html";
    return;
  }

  try {
    const order = await callAPI(
      `https://symfony-9z0y.onrender.com/bookings/${orderId}`,
      "GET"
    );
    const promos = await callAPI(
      "https://symfony-9z0y.onrender.com/promos/bulk",
      "GET"
    );
    console.log("Order:", order);
    console.log("Booking Details", order.bookingDetail);
    console.log("Promos:", promos);

    let promo = null;
    if (promoId) {
      promo = promos.find((promo) => promo.id == promoId);
    } else if (order.booking.promoId) {
      promo = promos.find((promo) => promo.id == order.booking.promoId);
    }

    const totalPrice = promo
      ? order.booking.totalPrice * (1 - promo.discount / 100)
      : order.booking.totalPrice;

    let actionButton = "";
    if (order.booking.status === "Pending") {
      actionButton = `
                <button class="bg-green-500 text-white px-4 py-2 rounded mt-4" onclick="showPaymentOptions()">Pay Now</button>
                <button class="bg-yellow-500 text-white px-4 py-2 rounded mt-4 ml-2" onclick="showPromoOptions()">Add Promo</button>
            `;
    } else if (order.booking.status === "Done") {
      actionButton = `<button class="bg-gray-500 text-white px-4 py-2 rounded mt-4" disabled>Done</button>`;
    }

    paymentContainer.innerHTML = `
            <div class="bg-white p-4 rounded-lg shadow-md w-full mb-4">
                <h3 class="text-xl font-semibold">Order ID: ${orderId}</h3>
                <p class="text-sm text-gray-700 mt-2">Total Price: ${totalPrice.toLocaleString()} VNĐ</p>
                <p class="text-sm text-gray-700 mt-2">Booking Date: ${new Date(
                  order.booking.bookingDate
                ).toLocaleDateString()}</p>
                <p class="text-sm text-gray-700 mt-2">Promo: ${
                  promo ? promo.name : "No Promo"
                }</p>
                ${actionButton}
            </div>
            <div id="promo-options" class="hidden bg-white p-4 rounded-lg shadow-md w-full mb-4">
                <h3 class="text-xl font-semibold mb-4">Available Promos</h3>
                ${promos
                  .filter(
                    (promo) =>
                      promo.conditions === "Public" ||
                      promo.conditions === order.booking.userMembershipLevel
                  )
                  .map(
                    (promo) => `
                    <div class="bg-white p-4 rounded-lg shadow-md w-full mb-4 flex justify-between items-center">
                        <div>
                            <h3 class="text-xl font-semibold">${promo.name}</h3>
                            <p class="text-sm text-gray-700 mt-2">${
                              promo.description
                            }</p>
                            <p class="text-sm text-gray-700 mt-2">Discount: ${
                              promo.discount
                            }%</p>
                            <p class="text-sm text-gray-700 mt-2">Expires on: ${new Date(
                              promo.expiredDate
                            ).toLocaleDateString()}</p>
                        </div>
                        <button class="bg-blue-500 text-white px-4 py-2 rounded" onclick="applyPromo(${orderId}, ${
                      promo.id
                    })">Use Promo</button>
                    </div>
                `
                  )
                  .join("")}
            </div>
<div class="bg-white p-4 rounded-lg shadow-md w-full mb-4">
    <h3 class="text-xl font-semibold">Order Details</h3>
    <p class="text-sm text-gray-700 mt-2">Booking Detail ID: ${
      order.bookingDetail.id
    }</p>
    <p class="text-sm text-gray-700 mt-2">Flight ID: ${
      order.bookingDetail.flightId || "N/A"
    }</p>
    <p class="text-sm text-gray-700 mt-2">Hotel ID: ${
      order.bookingDetail.hotelId || "N/A"
    }</p>
    <p class="text-sm text-gray-700 mt-2">Activity ID: ${
      order.bookingDetail.activityId || "N/A"
    }</p>
    <p class="text-sm text-gray-700 mt-2">Quantity: ${
      order.bookingDetail.quantity
    }</p>
    <p class="text-sm text-gray-700 mt-2">Check-in Date: ${new Date(
      order.bookingDetail.checkInDate
    ).toLocaleString()}</p>
    <p class="text-sm text-gray-700 mt-2">Check-out Date: ${new Date(
      order.bookingDetail.checkOutDate
    ).toLocaleString()}</p>
</div>

            <div id="payment-options" class="hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
                    <h3 class="text-xl font-semibold mb-4">Choose Payment Method</h3>
                    <button class="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full" onclick="payWithCreditCard(${orderId}, ${
      promo ? promo.id : "null"
    })">Credit Card</button>
                    <button class="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full" onclick="payWithEWallet(${orderId}, ${
      promo ? promo.id : "null"
    })">E-Wallet</button>
                    <button class="bg-red-500 text-white px-4 py-2 rounded mt-4 w-full" onclick="closePaymentOptions()">Cancel</button>
                </div>
            </div>
            <div id="credit-card-form" class="hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
                    <h3 class="text-xl font-semibold mb-4">Credit Card Payment</h3>
                    <input type="text" id="cc-number" class="border rounded p-2 w-full mb-4" placeholder="Card Number">
                    <input type="text" id="cc-expiry" class="border rounded p-2 w-full mb-4" placeholder="Expiry Date (MM/YY)">
                    <input type="text" id="cc-cvc" class="border rounded p-2 w-full mb-4" placeholder="CVC">
                    <button class="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full" onclick="processCreditCardPayment(${orderId}, ${
      promo ? promo.id : "null"
    })">Submit Payment</button>
                    <button class="bg-red-500 text-white px-4 py-2 rounded mt-4 w-full" onclick="closeCreditCardForm()">Cancel</button>
                </div>
            </div>
            <div id="ewallet-form" class="hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
                    <h3 class="text-xl font-semibold mb-4">E-Wallet Payment</h3>
                    <input type="text" id="ewallet-id" class="border rounded p-2 w-full mb-4" placeholder="E-Wallet ID">
                    <input type="text" id="ewallet-password" class="border rounded p-2 w-full mb-4" placeholder="Password">
                    <button class="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full" onclick="processEWalletPayment(${orderId}, ${
      promo ? promo.id : "null"
    })">Submit Payment</button>
                    <button class="bg-red-500 text-white px-4 py-2 rounded mt-4 w-full" onclick="closeEWalletForm()">Cancel</button>
                </div>
            </div>
        `;
  } catch (error) {
    console.error("Error loading payment details:", error);
    paymentContainer.innerHTML =
      "<p>Error loading payment details. Please try again later.</p>";
  }
});

// Function to show payment options
function showPaymentOptions() {
  const paymentOptions = document.getElementById("payment-options");
  paymentOptions.classList.remove("hidden");
}

// Function to close payment options
function closePaymentOptions() {
  const paymentOptions = document.getElementById("payment-options");
  paymentOptions.classList.add("hidden");
}

// Function to show credit card form
function payWithCreditCard(orderId, promoId) {
  const creditCardForm = document.getElementById("credit-card-form");
  creditCardForm.classList.remove("hidden");
}

// Function to close credit card form
function closeCreditCardForm() {
  const creditCardForm = document.getElementById("credit-card-form");
  creditCardForm.classList.add("hidden");
}

// Function to process credit card payment
function processCreditCardPayment(orderId, promoId) {
  const ccNumber = document.getElementById("cc-number").value;
  const ccExpiry = document.getElementById("cc-expiry").value;
  const ccCvc = document.getElementById("cc-cvc").value;

  // Validate credit card details
  if (!ccNumber || !ccExpiry || !ccCvc) {
    alert("Please fill in all credit card details.");
    return;
  }

  // Simulate credit card payment process
  completePayment(orderId, promoId, "Credit Card");
}

// Function to show e-wallet form
function payWithEWallet(orderId, promoId) {
  const ewalletForm = document.getElementById("ewallet-form");
  ewalletForm.classList.remove("hidden");
}

// Function to close e-wallet form
function closeEWalletForm() {
  const ewalletForm = document.getElementById("ewallet-form");
  ewalletForm.classList.add("hidden");
}

// Function to process e-wallet payment
function processEWalletPayment(orderId, promoId) {
  const ewalletId = document.getElementById("ewallet-id").value;
  const ewalletPassword = document.getElementById("ewallet-password").value;

  // Validate e-wallet details
  if (!ewalletId || !ewalletPassword) {
    alert("Please fill in all e-wallet details.");
    return;
  }

  // Simulate e-wallet payment process
  completePayment(orderId, promoId, "E-Wallet");
}

// Function to complete payment
async function completePayment(orderId, promoId, paymentMethod) {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const body = {
      userId: user.id,
      bookingId: orderId,
      paymentMethod: paymentMethod,
    };
    if (body !== null) {
      console.log("Payment details:", body);
      alert("Payment successful!");
      window.location.href = "index.html";
    }
  } catch (error) {
    console.error("Error completing payment:", error);
    alert("Error completing payment. Please try again later.");
  }
}

// Function to show promo options
function showPromoOptions() {
  const promoOptions = document.getElementById("promo-options");
  promoOptions.classList.remove("hidden");
}

// Function to apply promo
function applyPromo(orderId, promoId) {
  let url = `payment.html?order_id=${orderId}&promoId=${promoId}`;
  window.location.href = url;
}

window.showPaymentOptions = showPaymentOptions;
window.closePaymentOptions = closePaymentOptions;
window.payWithCreditCard = payWithCreditCard;
window.closeCreditCardForm = closeCreditCardForm;
window.processCreditCardPayment = processCreditCardPayment;
window.payWithEWallet = payWithEWallet;
window.closeEWalletForm = closeEWalletForm;
window.processEWalletPayment = processEWalletPayment;
window.completePayment = completePayment;
window.showPromoOptions = showPromoOptions;
window.applyPromo = applyPromo;

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

  console.log("Making API call to:", endpoint);
  console.log("Request options:", options);

  const response = await fetch(endpoint, options);
  if (response.ok) {
    return await response.json();
  } else {
    const errorText = await response.text();
    console.error(
      "API call failed:",
      response.status,
      response.statusText,
      errorText
    );
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }
}
