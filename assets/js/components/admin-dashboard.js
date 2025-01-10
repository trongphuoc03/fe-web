async function callAPI(endpoint, method, body = null, isFile = false) {
    const token = localStorage.getItem('token');
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
    const result = await response.json();
    document.getElementById("response").textContent = JSON.stringify(result, null, 2);
    return response; // Ensure the response object is returned
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

function showAddItemForm(itemType) {
    if (itemType === "Activity") {
        document.getElementById("addActivityModal").style.display = "block";
    }
}

function showEditItemForm(itemType) {
    if (itemType === "Activity") {
        getAllActivities("edit");
    }
}

function showDeleteItemForm(itemType) {
    if (itemType === "Activity") {
        getAllActivities("delete");
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

function createActivity() {
    const formData = new FormData();
    const file = document.getElementById("file").files[0];
    formData.append("file", file);
    formData.append("name", document.getElementById("name").value);
    formData.append("emptySlot", document.getElementById("emptySlot").value);
    formData.append("location", document.getElementById("location").value);
    formData.append(
        "description",
        document.getElementById("description").value
    );
    formData.append("price", document.getElementById("price").value);

    callAPI(
        "https://symfony-9z0y.onrender.com/activities",
        "POST",
        formData,
        true
    );
    closeModal("addActivityModal");
}

async function getAllActivities(action) {
    try {
        const response = await callAPI("https://symfony-9z0y.onrender.com/activities/bulk", "GET");
        const data = await response.json();
        if (Array.isArray(data)) {
            const list = action === "edit" ? document.getElementById("activityList") : document.getElementById("deleteList");
            list.innerHTML = "";
            data.forEach((activity) => {
                const button = document.createElement("button");
                button.innerHTML = activity.name;
                button.onclick = () => {
                    if (action === "edit") {
                        showEditForm(activity.id);
                    } else {
                        confirmDelete(activity.id);
                    }
                };
                list.appendChild(button);
            });
            document.getElementById(`${action}ActivityModal`).style.display = "block";
        } else {
            console.error("Data is not an array:", data);
        }
    } catch (error) {
        console.error("Error fetching activities:", error);
    }
}

function showEditForm(id) {
    callAPI(`https://symfony-9z0y.onrender.com/activities/${id}`, "GET").then(
        (activity) => {
            const editForm = document.getElementById("editForm");
            editForm.innerHTML = `
                <input type="text" id="updateName" value="${activity.name}" />
                <input type="number" id="updateEmptySlot" value="${activity.emptySlot}" />
                <input type="text" id="updateLocation" value="${activity.location}" />
                <textarea id="updateDescription">${activity.description}</textarea>
                <input type="number" id="updatePrice" value="${activity.price}" />
                <button type="button" onclick="updateActivity(${id})">Update Activity</button>
            `;
        }
    );
}

function updateActivity(id) {
    const body = {
        name: document.getElementById("updateName").value,
        emptySlot: document.getElementById("updateEmptySlot").value,
        location: document.getElementById("updateLocation").value,
        description: document.getElementById("updateDescription").value,
        price: document.getElementById("updatePrice").value,
    };
    callAPI(
        `https://symfony-9z0y.onrender.com/activities/${id}`,
        "PATCH",
        body
    );
    closeModal("editActivityModal");
}

function confirmDelete(id) {
    document.getElementById("deleteYesButton").onclick = () =>
        deleteActivity(id);
    document.getElementById("deleteActivityModal").style.display = "block";
}

function deleteActivity(id) {
    callAPI(`https://symfony-9z0y.onrender.com/activities/${id}`, "DELETE");
    closeModal("deleteActivityModal");
}