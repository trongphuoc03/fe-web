document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const ordersContainer = document.getElementById('orders-container');

    try {
        const orders = await callAPI('https://symfony-9z0y.onrender.com/bookings/bulk', 'GET');
        const promos = await callAPI('https://symfony-9z0y.onrender.com/promos/bulk', 'GET');

        const userOrders = orders.filter(order => order.booking.userId === user.id);

        if (userOrders.length === 0) {
            ordersContainer.innerHTML = '<p>No orders found.</p>';
            return;
        }

        userOrders.forEach((order, index) => {
            const promo = promos.find(promo => promo.id === order.booking.promoId);
            const promoName = promo ? promo.name : 'No Promo';

            ordersContainer.innerHTML += `
                <div class="bg-white p-4 rounded-lg shadow-md w-full mb-4">
                    <div class="flex justify-between items-center">
                        <div class="flex-1">
                            <h3 class="text-xl font-semibold">
                                Order ID: ${index + 1}
                            </h3>
                            <p class="text-sm text-gray-700 mt-2">Total Price: ${order.booking.totalPrice.toLocaleString()} VNĐ</p>
                            <p class="text-sm text-gray-700 mt-2">Booking Date: ${new Date(order.booking.bookingDate).toLocaleDateString()}</p>
                            <p class="text-sm text-gray-700 mt-2">Promo: ${promoName}</p>
                            <p class="text-sm text-gray-700 mt-2">Status: ${order.booking.status}</p>
                        </div>
                        <button class="bg-blue-500 text-white px-4 py-2 rounded" onclick="redirectToPayment(${order.booking.id}, ${order.booking.promoId})">Payment</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading orders:', error);
        ordersContainer.innerHTML = '<p>Error loading orders. Please try again later.</p>';
    }
});

// Hàm chuyển hướng đến trang thanh toán với order_id và promoId
function redirectToPayment(orderId, promoId) {
    let url = `payment.html?order_id=${orderId}`;
    if (promoId) {
        url += `&promoId=${promoId}`;
    }
    window.location.href = url;
}

window.redirectToPayment = redirectToPayment;

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

function formatDateToYMDHIS(datetimeLocalValue) {
    const date = new Date(datetimeLocalValue);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
