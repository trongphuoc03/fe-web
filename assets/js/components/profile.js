// Kiểm tra token hợp lệ, giải mã và trả về userId nếu hợp lệ
function checkToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Token not found!");
    return null; // Nếu không có token, trả về null
  }

  console.log("Token found:", token);

  try {
    const decodedToken = parseJwt(token);
    const userId = decodedToken.data.id;
    console.log("User ID from token:", userId);

    // Kiểm tra thời gian hết hạn của token
    const currentTime = Math.floor(Date.now() / 1000);
    console.log("Current time:", currentTime);
    console.log("Token expiration time:", decodedToken.exp);
    if (decodedToken.exp < currentTime) {
      console.error("Token is expired");
      alert("Session expired. Please log in again.");
      return null; // Nếu token hết hạn, trả về null
    }

    return userId; // Trả về userId nếu token hợp lệ
  } catch (error) {
    console.error("Failed to decode token:", error);
    alert("Invalid token. Please log in again.");
    return null; // Nếu không giải mã được token, trả về null
  }
}

// Hàm giải mã JWT
function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`) // Giải mã base64
      .join("")
  );
  return JSON.parse(jsonPayload);
}

async function callAPI(endpoint, method, body = null) {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const options = {
    method: method,
    headers: headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(endpoint, options);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }
}

async function getMe() {
  try {
    const result = await callAPI(
      "https://symfony-9z0y.onrender.com/users",
      "GET"
    );
    console.log("User data:", result);
    document.getElementById("username").textContent = result.username;
    document.getElementById("email").textContent = result.email;
    document.getElementById("phone").textContent = result.phone;
    document.getElementById("address").textContent = result.address;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    if (error.message.includes("401")) {
      alert("Session expired. Please log in again.");
    }
  }
}

async function updateUserProfile(userId) {
  const username = document.getElementById("username-input").value;
  const email = document.getElementById("email-input").value;
  const phone = document.getElementById("phone-input").value;
  const address = document.getElementById("address-input").value;

  const body = {
    username: username,
    email: email,
    phone: phone,
    address: address,
  };

  try {
    const result = await callAPI(
      `https://symfony-9z0y.onrender.com/users/${userId}`,
      "PATCH",
      body
    );
    console.log("Updated user data:", result);
    alert("Profile updated successfully!");
    document.getElementById("username").textContent = result.username;
    document.getElementById("email").textContent = result.email;
    document.getElementById("phone").textContent = result.phone;
    document.getElementById("address").textContent = result.address;
  } catch (error) {
    console.error("Failed to update user data:", error);
    alert("Failed to update profile");
  }
}

async function changePassword(userId) {
  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (newPassword !== confirmPassword) {
    alert("New password and confirm password do not match.");
    return;
  }

  const body = {
    password: newPassword,
  };

  try {
    const result = await callAPI(
      `https://symfony-9z0y.onrender.com/users/${userId}`,
      "PATCH",
      body
    );
    console.log("Password change result:", result);
    alert("Password changed successfully!");
    document.getElementById("change-password-popup").classList.add("hidden");
  } catch (error) {
    console.error("Failed to change password:", error);
    alert("Failed to change password");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const userId = checkToken();

  if (userId) {
    await getMe(); // Call getMe instead of getUserById
  }

  const editButton = document.getElementById("edit-profile");
  const profileInfo = document.getElementById("profile-info");
  const profileForm = document.getElementById("profile-form");
  const cancelButton = document.getElementById("cancel-edit");
  const changePasswordButton = document.getElementById("change-password");
  const changePasswordPopup = document.getElementById("change-password-popup");
  const cancelChangePasswordPopupButton = document.getElementById(
    "cancel-change-password-popup"
  );
  const passwordForm = document.getElementById("password-form");

  if (editButton) {
    editButton.addEventListener("click", () => {
      profileInfo.classList.add("hidden");
      profileForm.classList.remove("hidden");
      document.getElementById("username-input").value =
        document.getElementById("username").textContent;
      document.getElementById("email-input").value =
        document.getElementById("email").textContent;
      document.getElementById("phone-input").value =
        document.getElementById("phone").textContent;
      document.getElementById("address-input").value =
        document.getElementById("address").textContent;
    });
  }

  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      profileForm.classList.add("hidden");
      profileInfo.classList.remove("hidden");
    });
  }

  if (profileForm) {
    profileForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await updateUserProfile(userId);
      profileForm.classList.add("hidden");
      profileInfo.classList.remove("hidden");
    });
  }

  if (changePasswordButton) {
    changePasswordButton.addEventListener("click", () => {
      changePasswordPopup.classList.remove("hidden");
    });
  }

  if (cancelChangePasswordPopupButton) {
    cancelChangePasswordPopupButton.addEventListener("click", () => {
      changePasswordPopup.classList.add("hidden");
    });
  }

  if (passwordForm) {
    passwordForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await changePassword(userId);
    });
  }
});
