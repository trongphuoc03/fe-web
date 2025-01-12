import { checkLoginStatus } from './auth.js';

// Tải phần header từ tệp 'header.html'
fetch('components/header.html')
    .then(response => response.text())
    .then(async html => {
        document.getElementById('header-container').innerHTML = html;

        // Lấy URL hiện tại
        const currentPage = window.location.pathname.split('/').pop();

        // Tìm tất cả các liên kết trong navbar
        const navLinks = document.querySelectorAll('#navbar-solid-bg a');

        // Duyệt qua từng liên kết để kiểm tra URL
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');

            if (linkHref === currentPage) {
                link.classList.add('active-link'); // Thêm class active vào liên kết tương ứng
            } else {
                link.classList.remove('active-link'); // Xóa class active khỏi các liên kết khác
            }

            // Xử lý khi click vào các tab
            link.addEventListener('click', () => {
                navLinks.forEach(nav => nav.classList.remove('active-link')); // Loại bỏ active từ tất cả
                link.classList.add('active-link'); // Chỉ áp dụng cho tab được click
            });
        });

        // Kiểm tra trạng thái người dùng (ví dụ: đã đăng nhập hay chưa)
        const isLoggedIn = await checkLoginStatus();
        console.log('isLoggedIn:', isLoggedIn);

        if (isLoggedIn) {
            // Lấy thông tin người dùng từ localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            console.log('Logged-in user:', user);
            console.log('Role:', user.role);

            // Hiển thị phần tử khi đã đăng nhập
            document.getElementById('logged-in').classList.remove('hidden');
            document.getElementById('logged-out').classList.add('hidden');

            // Kiểm tra vai trò của người dùng và thay đổi nội dung menu
            if (user.role === 'Admin') {
                // Nếu là admin, hiển thị các mục dành cho admin
                document.getElementById('admin-menu').classList.remove('hidden');

                document.getElementById('user-menu').classList.add('hidden');
                document.getElementById('user-orders').classList.add('hidden');
                document.getElementById('user-voucher').classList.add('hidden');

            } else {
                // Nếu là user, hiển thị các mục dành cho người dùng
                document.getElementById('admin-menu').classList.add('hidden');

                document.getElementById('user-menu').classList.remove('hidden');
                document.getElementById('user-orders').classList.remove('hidden');
                document.getElementById('user-voucher').classList.remove('hidden');
            }
        } else {
            // Hiển thị phần tử khi chưa đăng nhập
            document.getElementById('logged-in').classList.add('hidden');
            document.getElementById('logged-out').classList.remove('hidden');
        }

        // Add event listener for dropdown
        const dropdownButton = document.getElementById('dropdownButton');
        const dropdownMenu = document.getElementById('dropdownHover');

        if (dropdownButton && dropdownMenu) {
            console.log('Dropdown button and menu found');
            dropdownButton.addEventListener('click', function () {
                console.log('Dropdown button clicked');
                dropdownMenu.classList.toggle('hidden');
            });
        } else {
            console.error('Dropdown button or menu not found');
        }

        // Xử lý sự kiện logout
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', function () {
                localStorage.setItem('isLoggedIn', 'false');
                localStorage.removeItem('user');
                window.location.href = '/fe-web'; // Chuyển hướng về trang chủ hoặc trang đăng nhập
            });
        }
    })
    .catch(error => {
        console.error('Lỗi khi tải header:', error);
    });
