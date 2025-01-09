document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');
    const promoId = urlParams.get('promoId');
    const paymentContainer = document.getElementById('payment-container');

    if (!orderId) {
        alert('No order ID provided.');
        window.location.href = 'orders.html';
        return;
    }

    try {
        const ordersResponse = await fetch('assets/data/booking.json');
        const orders = await ordersResponse.json();
        localStorage.setItem('Orders', JSON.stringify(orders));
        console.log("Orders have been loaded and saved:", orders);
        

        const bookingDetailsResponse = await fetch('assets/data/booking_details.json');
        const bookingDetails = await bookingDetailsResponse.json();

        const promosResponse = await fetch('assets/data/promos.json');
        const promos = await promosResponse.json();

        const flightsResponse = await fetch('assets/data/flight.json');
        const flights = await flightsResponse.json();

        const hotelsResponse = await fetch('assets/data/hotel.json');
        const hotels = await hotelsResponse.json();

        const activitiesResponse = await fetch('assets/data/activities.json');
        const activities = await activitiesResponse.json();

        const combosResponse = await fetch('assets/data/combos.json');
        const combos = await combosResponse.json();

        const order = orders.find(order => order.Booking_ID == orderId);
        if (!order) {
            paymentContainer.innerHTML = '<p>Order not found.</p>';
            return;
        }

        const orderDetails = bookingDetails.filter(detail => detail.Booking_ID == orderId);

        let promo = null;
        if (promoId) {
            promo = promos.find(promo => promo.id == promoId);
        } else if (order.Promo_ID) {
            promo = promos.find(promo => promo.id == order.Promo_ID);
        }

        const totalPrice = promo ? order.Total_Price * (1 - promo.discount / 100) : order.Total_Price;

        let actionButton = '';
        if (order.Status === 'pending' || order.Status === 'cancelled') {
            actionButton = `
                <button class="bg-green-500 text-white px-4 py-2 rounded mt-4" onclick="showPaymentOptions()">Pay Now</button>
                <button class="bg-yellow-500 text-white px-4 py-2 rounded mt-4 ml-2" onclick="showPromoOptions()">Add Promo</button>
            `;
        } else if (order.Status === 'done') {
            actionButton = `<button class="bg-gray-500 text-white px-4 py-2 rounded mt-4" disabled>Done</button>`;
        }

        paymentContainer.innerHTML = `
            <div class="bg-white p-4 rounded-lg shadow-md w-full mb-4">
                <h3 class="text-xl font-semibold">Order ID: ${orderId}</h3>
                <p class="text-sm text-gray-700 mt-2">Total Price: ${totalPrice.toLocaleString()} VNĐ</p>
                <p class="text-sm text-gray-700 mt-2">Booking Date: ${new Date(order.Booking_Date).toLocaleDateString()}</p>
                <p class="text-sm text-gray-700 mt-2">Promo: ${promo ? promo.name : 'No Promo'}</p>
                ${actionButton}
            </div>
            <div id="promo-options" class="hidden bg-white p-4 rounded-lg shadow-md w-full mb-4">
                <h3 class="text-xl font-semibold mb-4">Available Promos</h3>
                ${promos.filter(promo => promo.conditions === 'Public' || promo.conditions === order.User_MembershipLevel).map(promo => `
                    <div class="bg-white p-4 rounded-lg shadow-md w-full mb-4 flex justify-between items-center">
                        <div>
                            <h3 class="text-xl font-semibold">${promo.name}</h3>
                            <p class="text-sm text-gray-700 mt-2">${promo.description}</p>
                            <p class="text-sm text-gray-700 mt-2">Discount: ${promo.discount}%</p>
                            <p class="text-sm text-gray-700 mt-2">Expires on: ${new Date(promo.expiredDate).toLocaleDateString()}</p>
                        </div>
                        <button class="bg-blue-500 text-white px-4 py-2 rounded" onclick="applyPromo(${orderId}, ${promo.id})">Use Promo</button>
                    </div>
                `).join('')}
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md w-full mb-4">
                <h3 class="text-xl font-semibold">Order Details</h3>
                ${orderDetails.map(detail => {
                    const flight = flights.find(f => f.id == detail.Flight_ID);
                    const hotel = hotels.find(h => h.id == detail.Hotel_ID);
                    const activity = activities.find(a => a.id == detail.Activity_ID);
                    const combo = combos.find(c => c.id == detail.Combo_ID);

                    return `
                        <p class="text-sm text-gray-700 mt-2">Booking Detail ID: ${detail.Booking_Detail_ID}</p>
                        <p class="text-sm text-gray-700 mt-2">Flight: ${flight ? `${flight.startLocation} - ${flight.endLocation}` : 'N/A'}</p>
                        <p class="text-sm text-gray-700 mt-2">Hotel: ${hotel ? hotel.name : 'N/A'}</p>
                        <p class="text-sm text-gray-700 mt-2">Activity: ${activity ? activity.name : 'N/A'}</p>
                        <p class="text-sm text-gray-700 mt-2">Combo: ${combo ? combo.name : 'N/A'}</p>
                        <p class="text-sm text-gray-700 mt-2">Quantity: ${detail.Quantity}</p>
                    `;
                }).join('')}
            </div>
            <div id="payment-options" class="hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
                    <h3 class="text-xl font-semibold mb-4">Choose Payment Method</h3>
                    <button class="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full" onclick="payWithCreditCard(${orderId}, ${promo ? promo.id : 'null'})">Credit Card</button>
                    <button class="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full" onclick="payWithEWallet(${orderId}, ${promo ? promo.id : 'null'})">E-Wallet</button>
                    <button class="bg-red-500 text-white px-4 py-2 rounded mt-4 w-full" onclick="closePaymentOptions()">Cancel</button>
                </div>
            </div>
            <div id="credit-card-form" class="hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
                    <h3 class="text-xl font-semibold mb-4">Credit Card Payment</h3>
                    <input type="text" id="cc-number" class="border rounded p-2 w-full mb-4" placeholder="Card Number">
                    <input type="text" id="cc-expiry" class="border rounded p-2 w-full mb-4" placeholder="Expiry Date (MM/YY)">
                    <input type="text" id="cc-cvc" class="border rounded p-2 w-full mb-4" placeholder="CVC">
                    <button class="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full" onclick="processCreditCardPayment(${orderId}, ${promo ? promo.id : 'null'})">Submit Payment</button>
                    <button class="bg-red-500 text-white px-4 py-2 rounded mt-4 w-full" onclick="closeCreditCardForm()">Cancel</button>
                </div>
            </div>
            <div id="ewallet-form" class="hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
                    <h3 class="text-xl font-semibold mb-4">E-Wallet Payment</h3>
                    <input type="text" id="ewallet-id" class="border rounded p-2 w-full mb-4" placeholder="E-Wallet ID">
                    <input type="text" id="ewallet-password" class="border rounded p-2 w-full mb-4" placeholder="Password">
                    <button class="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full" onclick="processEWalletPayment(${orderId}, ${promo ? promo.id : 'null'})">Submit Payment</button>
                    <button class="bg-red-500 text-white px-4 py-2 rounded mt-4 w-full" onclick="closeEWalletForm()">Cancel</button>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading payment details:', error);
        paymentContainer.innerHTML = '<p>Error loading payment details. Please try again later.</p>';
    }
});

// Function to show payment options
function showPaymentOptions() {
    const paymentOptions = document.getElementById('payment-options');
    paymentOptions.classList.remove('hidden');
}

// Function to close payment options
function closePaymentOptions() {
    const paymentOptions = document.getElementById('payment-options');
    paymentOptions.classList.add('hidden');
}

// Function to show credit card form
function payWithCreditCard(orderId, promoId) {
    const creditCardForm = document.getElementById('credit-card-form');
    creditCardForm.classList.remove('hidden');
}

// Function to close credit card form
function closeCreditCardForm() {
    const creditCardForm = document.getElementById('credit-card-form');
    creditCardForm.classList.add('hidden');
}

// Function to process credit card payment
// Function to process credit card payment
function processCreditCardPayment(orderId, promoId) {
    const ccNumber = document.getElementById('cc-number').value;
    const ccExpiry = document.getElementById('cc-expiry').value;
    const ccCvc = document.getElementById('cc-cvc').value;

    // Kiểm tra xem số thẻ có hợp lệ (16 chữ số)
    const ccNumberPattern = /^\d{16}$/;
    if (!ccNumber || !ccNumberPattern.test(ccNumber)) {
        alert('Please enter a valid credit card number (16 digits).');
        return;
    }

    // Kiểm tra ngày hết hạn (MM/YY)
    const ccExpiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!ccExpiry || !ccExpiryPattern.test(ccExpiry)) {
        alert('Please enter a valid expiry date (MM/YY).');
        return;
    }

    // Kiểm tra mã bảo mật (CVV) 3 hoặc 4 chữ số
    const ccCvcPattern = /^\d{3,4}$/;
    if (!ccCvc || !ccCvcPattern.test(ccCvc)) {
        alert('Please enter a valid CVV (3 or 4 digits).');
        return;
    }

    // Simulate credit card payment process
    completePayment(orderId, promoId, 'Credit Card');
}



// Function to show e-wallet form
function payWithEWallet(orderId, promoId) {
    const ewalletForm = document.getElementById('ewallet-form');
    ewalletForm.classList.remove('hidden');
}

// Function to close e-wallet form
function closeEWalletForm() {
    const ewalletForm = document.getElementById('ewallet-form');
    ewalletForm.classList.add('hidden');
}

// Function to process e-wallet payment
// Function to process e-wallet payment
function processEWalletPayment(orderId, promoId) {
    const ewalletId = document.getElementById('ewallet-id').value;
    const ewalletPassword = document.getElementById('ewallet-password').value;

    // Kiểm tra xem ID ví điện tử có hợp lệ không (ví dụ: email hoặc số điện thoại)
    const ewalletIdPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // Kiểm tra email
    if (!ewalletId || !ewalletIdPattern.test(ewalletId)) {
        alert('Please enter a valid e-wallet ID (e.g., email).');
        return;
    }

    // Kiểm tra mật khẩu ví điện tử (tối thiểu 6 ký tự)
    if (!ewalletPassword || ewalletPassword.length < 6) {
        alert('Please enter a valid password (at least 6 characters).');
        return;
    }

    // Simulate e-wallet payment process
    completePayment(orderId, promoId, 'E-Wallet');
}


// Function to complete payment
function completePayment(orderId, promoId, paymentMethod) {
    const orders = JSON.parse(localStorage.getItem('Orders')) || [];
    console.log('Orders from localStorage:', orders); // Log dữ liệu orders

    const order = orders.find(order => order.Booking_ID == orderId);
    console.log('Order to process:', order); // Log order tìm thấy (hoặc undefined nếu không tìm thấy)

    const promos = JSON.parse(sessionStorage.getItem('promos')) || [];
    console.log('Promos from sessionStorage:', promos); // Log dữ liệu promos

    const promo = promos.find(promo => promo.id == promoId);
    console.log('Promo to apply:', promo); // Log promo tìm thấy (hoặc undefined nếu không tìm thấy)

    if (!orders || orders.length === 0) {
        alert('No orders found in the system.');
        console.error('Orders data is empty or not found in localStorage.');
        return;
    }

    if (!order) {
        alert('Order not found. Please check your order ID.');
        console.error('Order not found for orderId:', orderId);
        return;
    }

    if (promo) {
        const currentDate = new Date();
        const expiredDate = new Date(promo.expiredDate);
        console.log('Promo expiration check:', { currentDate, expiredDate });

        if (currentDate > expiredDate) {
            alert('This promo has expired and cannot be used.');
            return;
        }
    }

    // Cập nhật trạng thái và tính lại giá trị tổng đơn hàng
    if (order) {
        if (promo) {
            order.Total_Price = order.Total_Price * (1 - promo.discount / 100);
        }
        console.log('Initial Order Status:', order.Status); // Trước khi thay đổi trạng thái
        order.Status = 'done'; // Cập nhật trạng thái đơn hàng thành 'done'
        order.Payment_Method = paymentMethod;

        // Lưu lại dữ liệu orders đã thay đổi vào localStorage
        localStorage.setItem('Orders', JSON.stringify(orders)); // Lưu lại dữ liệu mới vào localStorage

        console.log('Updated order:', order); // Log thông tin đơn hàng sau khi cập nhật

        alert('Payment successful! Promo applied.');
        window.location.href = 'index.html'; // Chuyển hướng sau khi thanh toán thành công
    } else {
        alert('Error completing payment.');
        console.error('Failed to complete payment. Order:', order, 'Promo:', promo);
    }
}


// Function to show promo options
function showPromoOptions() {
    const promoOptions = document.getElementById('promo-options');
    if (promoOptions) {
        promoOptions.classList.remove('hidden');
    } else {
        console.error('Promo options container not found.');
    }
}

// Function to apply promo
function applyPromo(orderId, promoId) {
    const promos = JSON.parse(sessionStorage.getItem('promos')) || [];
    const promo = promos.find(promo => promo.id == promoId);

    if (promo) {
        const currentDate = new Date();
        const expiredDate = new Date(promo.expiredDate);

        if (currentDate > expiredDate) {
            alert('This promo has expired and cannot be used.');
            return;
        }
    }

    let url = `payment.html?order_id=${orderId}&promoId=${promoId}`;
    window.location.href = url;
}

// Function to view order details
function viewDetails(orderId) {
    window.location.href = `order-details.html?order_id=${orderId}`;
}

window.completePayment = completePayment;
window.showPromoOptions = showPromoOptions;
window.applyPromo = applyPromo;
window.viewDetails = viewDetails;
window.showPaymentOptions = showPaymentOptions;
window.payWithCreditCard = payWithCreditCard;
window.payWithEWallet = payWithEWallet;
window.closePaymentOptions = closePaymentOptions;
window.closeCreditCardForm = closeCreditCardForm;
window.closeEWalletForm = closeEWalletForm;
window.processCreditCardPayment = processCreditCardPayment;
window.processEWalletPayment = processEWalletPayment;