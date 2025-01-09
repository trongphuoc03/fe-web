document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const promoId = new URLSearchParams(window.location.search).get('promoId');
    const ordersContainer = document.getElementById('orders-container');

    try {
        const ordersResponse = await fetch('assets/data/booking.json');
        const orders = await ordersResponse.json();

        const promosResponse = await fetch('assets/data/promos.json');
        const promos = await promosResponse.json();

        const userOrders = orders.filter(order => order.User_ID === user.id);

        if (userOrders.length === 0) {
            ordersContainer.innerHTML = '<p>No orders found.</p>';
            return;
        }

        userOrders.forEach((order, index) => {
            const promo = promos.find(promo => promo.id === order.Promo_ID);
            const promoName = promo ? promo.name : 'No Promo';

            ordersContainer.innerHTML += `
                <div class="bg-white p-4 rounded-lg shadow-md w-full mb-4">
                    <div class="flex justify-between items-center">
                        <div class="flex-1">
                            <h3 class="text-xl font-semibold">
                                Order ID: ${index + 1}
                            </h3>
                            <p class="text-sm text-gray-700 mt-2">Total Price: ${order.Total_Price.toLocaleString()} VNĐ</p>
                            <p class="text-sm text-gray-700 mt-2">Booking Date: ${new Date(order.Booking_Date).toLocaleDateString()}</p>
                            <p class="text-sm text-gray-700 mt-2">Promo: ${promoName}</p>
                            <p class="text-sm text-gray-700 mt-2">Status: ${order.Status}</p>
                        </div>
                        <button class="bg-blue-500 text-white px-4 py-2 rounded" onclick="redirectToPayment(${order.Booking_ID}, ${promoId})">Payment</button>
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