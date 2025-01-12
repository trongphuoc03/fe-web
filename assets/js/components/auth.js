// Hàm kiểm tra trạng thái đăng nhập từ localStorage
export async function checkLoginStatus() {
    return localStorage.getItem("isLoggedIn") === "true";
  }
  
  // Xử lý submit form login
  export async function handleLogin(event) {
    event.preventDefault();
  
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    console.log("Login attempt with email:", username);
  
    try {
      const response = await fetch("https://symfony-9z0y.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password: password }),
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Error details:", errorDetails);
        alert(`Login failed: ${errorDetails.message || "Invalid request"}`);
        return;
      }
  
      const result = await response.json();
      console.log('Login response:', result);
      
      if (result.token) {
          console.log("Login successful!");
          
          // Giải mã token để lấy thông tin người dùng
          const user = parseJwt(result.token).data; 
          console.log("Decoded user data:", user);
      
          // Lưu trạng thái và thông tin người dùng vào localStorage
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("user", JSON.stringify(user)); // Lưu thông tin user từ token
          localStorage.setItem("token", result.token);
      
          // Chuyển hướng dựa trên vai trò người dùng
          if (user.role === "admin") {
              window.location.href = "/fe-web/admin.html";
          } else {
              window.location.href = "/fe-web";
          }
      } else {
          alert("Login failed! Token not received.");
          console.log("Login failed!");
      }
      
    } catch (error) {
      console.error("Error during login:", error);
      alert(
        "An error occurred while processing your login. Please try again later."
      );
    }
  }
  
  // Xử lý submit form register
export async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('name').value;
    const email = document.getElementById('email-register').value;
    const password = document.getElementById('password-register').value;

    console.log('Register attempt with email:', email);

    try {
        const response = await fetch('https://symfony-9z0y.onrender.com/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password,
                email: email,
            }),
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Error details:', errorDetails);
            alert(`Registration failed: ${errorDetails.message || 'Unknown error'}`);
            return;
        }

        const result = await response.json();
        console.log('API Response:', result);

        // Kiểm tra xem phản hồi có chứa dữ liệu người dùng (id) không
        if (result.id) {
            alert('Registration successful! Please log in.');
            document.getElementById('register-form').style.display = 'none';
            document.getElementById('login-form').style.display = 'block';
            document.getElementById('form-title').textContent = 'Sign in to your account';
        } else {
            alert(`Registration failed: ${result.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred during registration. Please try again later.');
    }
}

  

  // Gắn sự kiện submit cho form
  document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
  
    if (loginForm) {
      loginForm.addEventListener("submit", handleLogin);
    }
  
    if (registerForm) {
      registerForm.addEventListener("submit", handleRegister);
    }
  });
  
  function parseJwt(token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
          atob(base64)
              .split('')
              .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
              .join('')
      );
      return JSON.parse(jsonPayload);
  }
  