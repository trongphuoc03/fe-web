document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        document.getElementById('username').textContent = user.username;
        document.getElementById('email').textContent = user.email;
        document.getElementById('phone').textContent = user.phone;
        document.getElementById('address').textContent = user.address;
        document.getElementById('membershipLevel').textContent = user.membershipLevel;
    }

    const profileInfo = document.getElementById('profile-info');
    const profileForm = document.getElementById('profile-form');
    const editProfileButton = document.getElementById('edit-profile');
    const cancelEditButton = document.getElementById('cancel-edit');

    editProfileButton.addEventListener('click', () => {
        profileInfo.classList.add('hidden');
        profileForm.classList.remove('hidden');

        document.getElementById('username-input').value = user.username;
        document.getElementById('email-input').value = user.email;
        document.getElementById('phone-input').value = user.phone;
        document.getElementById('address-input').value = user.address;
    });

    cancelEditButton.addEventListener('click', () => {
        profileInfo.classList.remove('hidden');
        profileForm.classList.add('hidden');
    });

    profileForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const updatedUser = {
            ...user,
            username: document.getElementById('username-input').value,
            email: document.getElementById('email-input').value,
            phone: document.getElementById('phone-input').value,
            address: document.getElementById('address-input').value
        };

        // Cập nhật thông tin người dùng trong localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Profile updated successfully!');

        document.getElementById('username').textContent = updatedUser.username;
        document.getElementById('email').textContent = updatedUser.email;
        document.getElementById('phone').textContent = updatedUser.phone;
        document.getElementById('address').textContent = updatedUser.address;

        profileInfo.classList.remove('hidden');
        profileForm.classList.add('hidden');
    });

    const changePasswordButton = document.getElementById('change-password');
    const passwordPopup = document.getElementById('password-popup');
    const changePasswordPopup = document.getElementById('change-password-popup');
    const currentPasswordForm = document.getElementById('current-password-form');
    const cancelPasswordPopupButton = document.getElementById('cancel-password-popup');
    const cancelChangePasswordPopupButton = document.getElementById('cancel-change-password-popup');

    changePasswordButton.addEventListener('click', () => {
        passwordPopup.classList.remove('hidden');
    });

    cancelPasswordPopupButton.addEventListener('click', () => {
        passwordPopup.classList.add('hidden');
    });

    cancelChangePasswordPopupButton.addEventListener('click', () => {
        changePasswordPopup.classList.add('hidden');
    });

    currentPasswordForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const currentPassword = document.getElementById('current-password').value;

        if (currentPassword === user.password) {
            passwordPopup.classList.add('hidden');
            changePasswordPopup.classList.remove('hidden');
        } else {
            alert('Incorrect current password!');
        }
    });

    const passwordForm = document.getElementById('password-form');
    passwordForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // Cập nhật mật khẩu trong localStorage
        const updatedUser = {
            ...user,
            password: newPassword
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Password changed successfully!');
        passwordForm.reset();
        changePasswordPopup.classList.add('hidden');
    });
});