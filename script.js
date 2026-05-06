
  const WA_NUMBER = '2348104680447';
  const API_URL = 'https://sheetdb.io/api/v1/a27ldv5oaiivj';

  let allProducts = [];
  let activeCategory = 'all';

  const grid = document.getElementById("products-grid");

  async function fetchProducts() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Network error');

      const data = await res.json();

      // Normalize data (important!)
      allProducts = data.map(p => ({
        name: p.name || p.Name || "Unnamed",
        price: p.price || p.Price || "0",
        image: p.image || p.Image || "",
        category: (p.category || p.Category || "unisex").toLowerCase()
      }));

      renderProducts();

    } catch (e) {
      grid.innerHTML = `
        <div class="empty-wrap">
          <span>😕</span>
          <p>Couldn't load products right now.</p>
        </div>`;
    }
  }

  function renderProducts() {
    const filtered =
      activeCategory === "all"
        ? allProducts
        : allProducts.filter(p => p.category === activeCategory);

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-wrap">
          <span>🧺</span>
          <p>No products in this category yet.</p>
        </div>`;
      return;
    }

    grid.innerHTML = filtered.map(p => `
      <div class="product-card">
        <div class="product-img-wrap">
          ${
            p.image
              ? `<img class="product-img" src="${p.image}" alt="${p.name}" data-img="${p.image}" data-name="${p.name}">`
              : `<div class="product-img-placeholder">🧶</div>`
          }
        </div>

        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div class="product-price">₦${p.price}</div>
        </div>
      </div>
    `).join("");

    attachImageClickEvents();
  }

  function attachImageClickEvents() {
    document.querySelectorAll(".product-img").forEach(img => {
      img.addEventListener("click", () => {
        openModal(img.dataset.img, img.dataset.name);
      });
    });
  }

  // FILTER BUTTONS
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      activeCategory = btn.dataset.cat;
      renderProducts();
    });
  });

  // MODAL
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-img");
  const captionText = document.getElementById("modal-caption");

  function openModal(src, name) {
    modal.style.display = "flex";
    modalImg.src = src;
    captionText.innerText = name;
  }

  document.querySelector(".modal-close").onclick = () => {
    modal.style.display = "none";
  };

  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  };

  // INIT
  fetchProducts();
