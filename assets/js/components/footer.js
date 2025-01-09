// Tải phần footer từ tệp 'footer.html'
fetch('components/footer.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('footer').innerHTML = html;
    })
    .catch(error => {
        console.error('Lỗi khi tải footer:', error);
    });