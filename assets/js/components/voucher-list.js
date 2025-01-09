document.addEventListener('DOMContentLoaded', async () => {
    // Lấy thông tin người dùng từ sessionStorage
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        alert('Please log in to view your vouchers.');
        window.location.href = 'login.html';
        return;
    }

    const voucherContainer = document.getElementById('voucher-container');

    try {
        // Lấy danh sách các voucher từ promos.json
        const response = await fetch('assets/data/promos.json');
        const promos = await response.json();

        // Lưu trữ dữ liệu promos trong sessionStorage
        sessionStorage.setItem('promos', JSON.stringify(promos));

        // Lọc các voucher dựa trên cấp độ thành viên của người dùng
        const userPromos = promos.filter(promo => promo.conditions === user.membershipLevel || promo.conditions === 'Public');

        if (userPromos.length === 0) {
            voucherContainer.innerHTML = '<p>No vouchers available for your membership level.</p>';
            return;
        }

        // Hiển thị các voucher phù hợp
        userPromos.forEach(promo => {
            voucherContainer.innerHTML += `
                <div class="bg-white p-4 rounded-lg shadow-md w-full mb-4 flex justify-between items-center">
                    <div>
                        <h3 class="text-xl font-semibold">${promo.name}</h3>
                        <p class="text-sm text-gray-700 mt-2">${promo.description}</p>
                        <p class="text-sm text-gray-700 mt-2">Discount: ${promo.discount}%</p>
                        <p class="text-sm text-gray-700 mt-2">Expires on: ${new Date(promo.expiredDate).toLocaleDateString()}</p>
                    </div>
                    <button class="bg-blue-500 text-white px-4 py-2 rounded" onclick="usePromo(${promo.id})">Use Promo</button>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading vouchers:', error);
        voucherContainer.innerHTML = '<p>Error loading vouchers. Please try again later.</p>';
    }
});

// Hàm sử dụng voucher
function usePromo(promoId) {
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

    window.location.href = `orders.html?promoId=${promoId}`;
}

window.usePromo = usePromo;