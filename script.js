document.addEventListener('DOMContentLoaded', () => {
    // Ambil semua elemen navbar
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('.content-section');
    const productList = document.getElementById('product-list');

    // Fungsi untuk menampilkan section tertentu
    function showSection(tab) {
        sections.forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById(tab).style.display = 'block';

        // Fungsi untuk memuat data produk
        function loadProducts(targetElement) {
            fetch('data/products.json')
                .then(response => response.json())
                .then(products => {
                    products.forEach(product => {
                        const productCard = document.createElement('div');
                        productCard.classList.add('product-card');

                        productCard.innerHTML = `
                            <img src="${product.image}" alt="${product.nama}">
                            <h3>${product.nama}</h3>
                            <h4>Rp.${product.harga.toLocaleString('id-ID')}</h4>
                            <div class="buttons">
                                <button class="detail" onclick='viewDetail(${JSON.stringify(product)})'>Detail</button>
                                <button class="whatsapp" onclick="orderViaWhatsApp('${product.nama}', ${product.harga})">Pesan via WhatsApp</button>
                            </div>
                        `;

                        targetElement.appendChild(productCard);
                    });
                })
                .catch(error => console.error('Error loading products:', error));
        }

        // Jika tab "products" dipilih, muat data produk
        if (tab === 'products' && productList.children.length === 0) {
            loadProducts(productList);
        }

        // Jika tab "home" dipilih, muat data produk ke home
        const productListHome = document.getElementById('product-list-home');
        if (tab === 'home' && productListHome.children.length === 0) {
            loadProducts(productListHome);
        }
    }

    // Tambahkan event listener untuk setiap link di navbar
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.getAttribute('data-tab');
            showSection(tab);
        });
    });

    // Tampilkan tab "home" secara default
    showSection('home');

    // Modal functionality
    const modal = document.getElementById('productModal');
    const closeModal = document.getElementsByClassName('close')[0];

    // Ketika tombol close diklik, tutup modal
    closeModal.onclick = function() {
        modal.style.display = 'none';
    }

    // Ketika pengguna mengklik di luar modal, tutup modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});

// Fungsi untuk melihat detail produk
function viewDetail(product) {
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');
    const modalPrice = document.getElementById('modalPrice');

    // Isi data ke dalam modal
    modalTitle.textContent = product.nama;
    modalImage.src = product.image;
    modalDescription.textContent = product.deskripsi;
    modalPrice.textContent = `Rp.${product.harga.toLocaleString('id-ID')}`;

    // Tampilkan modal
    modal.style.display = 'flex';
}

// Fungsi untuk memesan via WhatsApp
function orderViaWhatsApp(productName, productPrice) {
    const phoneNumber = '+6285222285578';
    const message = `Halo, saya ingin memesan:\n- Produk: ${productName}\n- Harga: Rp.${productPrice.toLocaleString('id-ID')}\nTolong konfirmasi ketersediaan dan detail pesanan. Terima kasih!`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}
