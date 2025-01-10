export async function callAPI(endpoint, method, body = null, isFile = false) {
    const token = localStorage.getItem("token");
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
    const result = await response.json();
    document.getElementById('response').textContent = JSON.stringify(result, null, 2);
    return result;
}

export function formatDateToYMDHIS(datetimeLocalValue) {
    const date = new Date(datetimeLocalValue);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


export async function createBooking() {
    const formData = {
        flightId: document.getElementById('flightId')?.value || null,
        hotelId: document.getElementById('hotelId')?.value || null,
        activityId: document.getElementById('activityId')?.value || null,
        comboId: document.getElementById('comboId')?.value || null,
        promoId: document.getElementById('promoId')?.value || null,
        quantity: document.getElementById('quantity')?.value || null,
        checkInDate: formatDateToYMDHIS(document.getElementById('checkInDate')?.value || ''),
        checkOutDate: formatDateToYMDHIS(document.getElementById('checkOutDate')?.value || '')
    };

    console.log("Form Data: ", formData);

    if (!formData.flightId || !formData.hotelId || !formData.checkInDate) {
        console.error("Required fields are missing!");
        return;
    }

    await callAPI('https://symfony-9z0y.onrender.com/bookings', 'POST', formData);
}

export async function getAllBookings() {
    await callAPI('https://symfony-9z0y.onrender.com/bookings/bulk', 'GET');
}

export async function getBookingById() {
    const idElement = document.getElementById('bookingId');
    if (!idElement) {
        console.error("Element with id 'bookingId' not found!");
        return;
    }
    const id = idElement.value;

    console.log("Fetching booking with ID:", id);

    await callAPI(`https://symfony-9z0y.onrender.com/bookings/${id}`, 'GET');
}

export async function updateBooking() {
    const idElement = document.getElementById('updateBookingId');
    if (!idElement) {
        console.error("Element with id 'updateBookingId' not found!");
        return;
    }
    const id = idElement.value;

    const body = {
        totalPrice: document.getElementById('updateTotalPrice')?.value || null,
        status: document.getElementById('updateStatus')?.value || null
    };

    console.log("Updating booking with ID:", id, "Body:", body);

    await callAPI(`https://symfony-9z0y.onrender.com/bookings/${id}`, 'PATCH', body);
}

export async function deleteBooking() {
    const idElement = document.getElementById('deleteBookingId');
    if (!idElement) {
        console.error("Element with id 'deleteBookingId' not found!");
        return;
    }
    const id = idElement.value;

    console.log("Deleting booking with ID:", id);

    await callAPI(`https://symfony-9z0y.onrender.com/bookings/${id}`, 'DELETE');
}
