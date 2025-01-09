// Function to show add item form
function showAddItemForm(itemType) {
    const popupForm = document.getElementById('item-add-form');
    const itemTypeSpan = document.getElementById('item-type-add');
    const addFormFields = document.getElementById('add-form-fields');

    itemTypeSpan.textContent = itemType;
    addFormFields.innerHTML = generateFormFields(itemType);

    popupForm.classList.remove('hidden');
}

// Function to show edit item form
function showEditItemForm(itemType) {
    const popupForm = document.getElementById('item-edit-form');
    const itemTypeSpan = document.getElementById('item-type-edit');
    const editFormFields = document.getElementById('edit-form-fields');

    itemTypeSpan.textContent = itemType;
    editFormFields.innerHTML = generateFormFields(itemType);

    // Load existing data into form fields
    loadItemData(itemType, editFormFields);

    popupForm.classList.remove('hidden');
}

// Function to show delete item form
function showDeleteItemForm(itemType) {
    const itemListContainer = document.getElementById('item-list-container-delete');
    const deletePopup = document.getElementById('item-delete-popup');
    const itemTypeNameDelete = document.getElementById('item-type-name-delete');

    itemTypeNameDelete.textContent = itemType;

    // Load items to delete
    loadItemData(itemType, itemListContainer, true);

    deletePopup.classList.remove('hidden');
}

// Function to generate form fields based on item type
function generateFormFields(itemType) {
    switch (itemType) {
        case 'Combo':
            return `
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" class="border rounded p-2 block w-full mb-4">
                <label for="description">Description:</label>
                <textarea id="description" name="description" class="border rounded p-2 block w-full mb-4"></textarea>
                <label for="price">Price:</label>
                <input type="number" id="price" name="price" class="border rounded p-2 block w-full mb-4">
                <label for="location">Location:</label>
                <input type="text" id="location" name="location" class="border rounded p-2 block w-full mb-4">
                <label for="images">Images (comma separated URLs):</label>
                <input type="text" id="images" name="images" class="border rounded p-2 block w-full mb-4">
            `;
        case 'Activity':
            return `
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" class="border rounded p-2 block w-full mb-4">
                <label for="location">Location:</label>
                <input type="text" id="location" name="location" class="border rounded p-2 block w-full mb-4">
                <label for="price">Price:</label>
                <input type="number" id="price" name="price" class="border rounded p-2 block w-full mb-4">
                <label for="description">Description:</label>
                <textarea id="description" name="description" class="border rounded p-2 block w-full mb-4"></textarea>
                <label for="images">Images (comma separated URLs):</label>
                <input type="text" id="images" name="images" class="border rounded p-2 block w-full mb-4">
            `;
        case 'Flight':
            return `
                <label for="brand">Brand:</label>
                <input type="text" id="brand" name="brand" class="border rounded p-2 block w-full mb-4">
                <label for="startLocation">Start Location:</label>
                <input type="text" id="startLocation" name="startLocation" class="border rounded p-2 block w-full mb-4">
                <label for="endLocation">End Location:</label>
                <input type="text" id="endLocation" name="endLocation" class="border rounded p-2 block w-full mb-4">
                <label for="startTime">Start Time:</label>
                <input type="datetime-local" id="startTime" name="startTime" class="border rounded p-2 block w-full mb-4">
                <label for="endTime">End Time:</label>
                <input type="datetime-local" id="endTime" name="endTime" class="border rounded p-2 block w-full mb-4">
                <label for="price">Price:</label>
                <input type="number" id="price" name="price" class="border rounded p-2 block w-full mb-4">
                <label for="availableSeats">Available Seats:</label>
                <input type="number" id="availableSeats" name="availableSeats" class="border rounded p-2 block w-full mb-4">
                <label for="image">Image URL:</label>
                <input type="text" id="image" name="image" class="border rounded p-2 block w-full mb-4">
            `;
        case 'Hotel':
            return `
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" class="border rounded p-2 block w-full mb-4">
                <label for="location">Location:</label>
                <input type="text" id="location" name="location" class="border rounded p-2 block w-full mb-4">
                <label for="price">Price:</label>
                <input type="number" id="price" name="price" class="border rounded p-2 block w-full mb-4">
                <label for="description">Description:</label>
                <textarea id="description" name="description" class="border rounded p-2 block w-full mb-4"></textarea>
                <label for="images">Images (comma separated URLs):</label>
                <input type="text" id="images" name="images" class="border rounded p-2 block w-full mb-4">
            `;
        default:
            return '';
    }
}

// Function to load item data into form fields
function loadItemData(itemType, container, isDelete = false) {
    fetch(`assets/data/${itemType.toLowerCase()}.json`)
        .then(response => response.json())
        .then(items => {
            if (isDelete) {
                container.innerHTML = '';
                items.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `${item.name} <button class="delete-item-button" data-id="${item.id}">🗑️</button>`;
                    container.appendChild(listItem);
                });

                // Add event listeners to delete buttons
                document.querySelectorAll('.delete-item-button').forEach(button => {
                    button.addEventListener('click', () => deleteItem(itemType, button.getAttribute('data-id')));
                });
            } else {
                // Populate form fields with item data for editing
                const item = items[0]; // Assuming we are editing the first item for simplicity
                for (const key in item) {
                    const input = container.querySelector(`[name="${key}"]`);
                    if (input) {
                        input.value = item[key];
                    }
                }
            }
        })
        .catch(error => console.error(`Error loading ${itemType} data:`, error));
}

// Function to delete item
function deleteItem(itemType, itemId) {
    fetch(`assets/data/${itemType.toLowerCase()}.json`)
        .then(response => response.json())
        .then(items => {
            const updatedItems = items.filter(item => item.id !== itemId);
            return fetch(`assets/data/${itemType.toLowerCase()}.json`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedItems)
            });
        })
        .then(response => {
            if (response.ok) {
                alert(`${itemType} deleted successfully!`);
                loadItemData(itemType, document.getElementById('item-list-container-delete'), true);
            } else {
                alert('Failed to delete ' + itemType);
            }
        })
        .catch(error => console.error(`Error deleting ${itemType}:`, error));
}

// Hàm tải dữ liệu đối tượng
async function loadItemData(itemType) {
    try {
        const response = await fetch(`assets/data/${itemType.toLowerCase()}.json`);
        const items = await response.json();

        const itemList = document.getElementById('item-list');
        itemList.innerHTML = ''; // Xóa danh sách cũ

        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item.name;
            itemList.appendChild(listItem);
        });
    } catch (error) {
        console.error(`Error loading ${itemType} data:`, error);
    }
}

// Function for calculating booking statistics
function calculateStatistics() {
    const startDate = new Date(document.getElementById('start-date').value);
    const endDate = new Date(document.getElementById('end-date').value);

    if (!startDate || !endDate || startDate > endDate) {
        alert('Please select a valid date range.');
        return;
    }

    const orders = JSON.parse(localStorage.getItem('Orders')) || [];
    let totalOrders = 0;
    let totalRevenue = 0;

    orders.forEach(order => {
        const bookingDate = new Date(order.Booking_Date);
        if (bookingDate >= startDate && bookingDate <= endDate) {
            totalOrders++;
            totalRevenue += order.Total_Price;
        }
    });

    document.getElementById('statistics-result').innerHTML = `
        <p>Total Orders: ${totalOrders}</p>
        <p>Total Revenue: ${totalRevenue.toLocaleString()} VNĐ</p>
    `;
}

window.showAddItemForm = showAddItemForm;
window.showEditItemForm = showEditItemForm;
window.showDeleteItemForm = showDeleteItemForm;
window.calculateStatistics = calculateStatistics;