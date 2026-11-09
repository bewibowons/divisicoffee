/*==================================================*
 * DIVISI COFFEE
 * script.js
 *==================================================*/

/*==================================================*
 * PAGE NAVIGATION
 *==================================================*/

function showPage(pageId) {
  // Ambil semua page
  const pages = document.querySelectorAll(".page");

  // Hilangkan class active dari semua page
  pages.forEach((page) => {
    page.classList.remove("active");
  });

  // Tampilkan page yang dipilih
  const targetPage = document.getElementById(pageId);

  if (targetPage) {
    targetPage.classList.add("active");
  }

  // Ganti logo sesuai halaman
  changeLogo(pageId);

  // Update navbar aktif
  updateNavbar(pageId);
}

/*==================================================*
 * LOGO SETIAP PAGE
 *==================================================*/

const pageLogos = {
  // Logo Home
  home: "images/divmenu.png",

  // Logo Menu
  menu: "images/divmenu.png",

  // Logo About
  about: "images/divabout.png",

  // Logo Contact
  contact: "images/divcontact.png",
};

function changeLogo(pageId) {
  const logoImage = document.querySelector(".logo img");

  // Kalau logo tidak ditemukan
  if (!logoImage) {
    return;
  }

  // Cari logo berdasarkan page
  const newLogo = pageLogos[pageId];

  // Kalau logo tersedia
  if (newLogo) {
    logoImage.src = newLogo;
  }
}

/*==================================================*
 * NAVBAR ACTIVE
 *==================================================*/

function updateNavbar(pageId) {
  const navLinks = document.querySelectorAll(".nav-menu a");

  navLinks.forEach((link) => {
    // Hapus active dari semua menu
    link.classList.remove("active");

    // Ambil isi onclick
    const onclickValue = link.getAttribute("onclick");

    // Cek menu yang sesuai
    if (onclickValue && onclickValue.includes("'" + pageId + "'")) {
      link.classList.add("active");
    }
  });
}

/*==================================================*
 * BUTTON HOVER EFFECT
 *==================================================*/

const buttons = document.querySelectorAll(".btn-primary, .btn-secondary");

buttons.forEach((button) => {
  button.addEventListener("mouseenter", () => {
    button.style.transform = "translateY(-4px)";
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "translateY(0)";
  });
});

/*==================================================*
 * LOGO CLICK
 *==================================================*/

const logo = document.querySelector(".logo");

if (logo) {
  logo.addEventListener("click", function (e) {
    e.preventDefault();

    showPage("home");
  });
}

/*==================================================*
 * ESC KEY
 *==================================================*/

// Tekan ESC untuk kembali ke Home

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    showPage("home");
  }
});

/*==================================================*
 * PAGE NAVIGATION
 *==================================================*/

function showPage(pageId) {
  // Ambil semua page
  const pages = document.querySelectorAll(".page");

  // Hilangkan active dari semua page
  pages.forEach((page) => {
    page.classList.remove("active");
  });

  // Tampilkan page yang dipilih
  const targetPage = document.getElementById(pageId);

  if (targetPage) {
    targetPage.classList.add("active");
  }

  // Ganti logo dan warna sesuai halaman
  changeLogo(pageId);

  function changeNavbarTheme(pageId) {
    const header = document.querySelector("header");
    if (!header) {
      return;
    }
    // Hapus semua tema sebelumnya
    header.classList.remove("nav-home", "nav-menu", "nav-about", "nav-contact");
    // Tambahkan tema sesuai halaman
    header.classList.add("nav-" + pageId);
  }
  // Ganti warna navbar sesuai halaman
  changeNavbarTheme(pageId);

  // Update menu aktif
  updateNavbar(pageId);
}
/*==================================================*
 * DEFAULT PAGE
 *==================================================*/

// Saat website pertama kali dibuka,
// tampilkan Home

document.addEventListener("DOMContentLoaded", function () {
  showPage("home");

  const menuCards = Array.from(document.querySelectorAll(".menu-card")).filter(
    (card) => card.querySelector(".menu-composition"),
  );

  function selectMenuCard(selectedCard) {
    const willSelect = !selectedCard.classList.contains("is-selected");

    menuCards.forEach((card) => {
      card.classList.remove("is-selected");
      card.setAttribute("aria-pressed", "false");
    });

    if (willSelect) {
      selectedCard.classList.add("is-selected");
      selectedCard.setAttribute("aria-pressed", "true");
    }
  }

  menuCards.forEach((card) => {
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-pressed", "false");

    card.addEventListener("click", () => selectMenuCard(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectMenuCard(card);
      }
    });
  });

  const cart = new Map();
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const clearCartButton = document.getElementById("clear-cart");
  const whatsappCheckout = document.getElementById("whatsapp-checkout");
  const whatsappNumber = "6285817595861";

  function rupiah(value) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  function updateCart() {
    const products = Array.from(cart.values());
    const itemCount = products.reduce(
      (total, item) => total + item.quantity,
      0,
    );
    const totalPrice = products.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    cartCount.textContent = itemCount;
    cartTotal.textContent = rupiah(totalPrice);

    if (!products.length) {
      cartItems.innerHTML = '<p class="cart-empty">Keranjang masih kosong.</p>';
      whatsappCheckout.classList.add("disabled");
      whatsappCheckout.href = "#";
      return;
    }

    cartItems.innerHTML = products
      .map(
        (item) => `
          <div class="cart-item">
            <div class="cart-item-info">
              <strong>${item.name}</strong>
              <span>${rupiah(item.price * item.quantity)}</span>
            </div>
            <div class="cart-controls">
              <button type="button" data-action="minus" data-name="${item.name}" aria-label="Kurangi ${item.name}">−</button>
              <strong>${item.quantity}</strong>
              <button type="button" data-action="plus" data-name="${item.name}" aria-label="Tambah ${item.name}">+</button>
            </div>
          </div>`,
      )
      .join("");

    const orderLines = products.map(
      (item, index) =>
        `${index + 1}. ${item.name} x${item.quantity} = ${rupiah(item.price * item.quantity)}`,
    );
    const message = [
      "Halo Div, mau pesan dong:",
      "",
      ...orderLines,
      "",
      `Total: ${rupiah(totalPrice)}`,
      "",
      "Nama:",
      "Alamat pengantaran:",
      "Metode pembayaran:",
    ].join("\n");

    whatsappCheckout.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    whatsappCheckout.target = "_blank";
    whatsappCheckout.rel = "noopener noreferrer";
    whatsappCheckout.classList.remove("disabled");
  }

  document.querySelectorAll(".add-cart-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const card = button.closest(".menu-card");
      const name = card.dataset.name;
      const price = Number(card.dataset.price);
      const currentItem = cart.get(name);

      cart.set(name, {
        name,
        price,
        quantity: currentItem ? currentItem.quantity + 1 : 1,
      });

      button.classList.add("added");
      button.textContent = "✓ Ditambahkan";
      window.setTimeout(() => {
        button.classList.remove("added");
        button.textContent = "+ Keranjang";
      }, 900);

      updateCart();
    });
  });

  cartItems.addEventListener("click", (event) => {
    const control = event.target.closest("button[data-action]");
    if (!control) return;

    const item = cart.get(control.dataset.name);
    if (!item) return;

    item.quantity += control.dataset.action === "plus" ? 1 : -1;
    if (item.quantity <= 0) cart.delete(item.name);
    updateCart();
  });

  clearCartButton.addEventListener("click", () => {
    cart.clear();
    updateCart();
  });

  const testimonialForm = document.getElementById("testimonial-form");
  const testimonialImage = document.getElementById("testimonial-image");
  const testimonialList = document.getElementById("testimonial-list");
  const uploadLabel = document.querySelector(".upload-field span");
  const testimonialSubmit = testimonialForm.querySelector('button[type="submit"]');
  const testimonialStatus = document.createElement("p");
  testimonialStatus.className = "testimonial-status";
  testimonialStatus.setAttribute("role", "status");
  testimonialStatus.setAttribute("aria-live", "polite");
  testimonialForm.appendChild(testimonialStatus);
  const supabaseConfig = window.DIVISI_SUPABASE || {};
  const supabaseReady =
    supabaseConfig.url &&
    supabaseConfig.anonKey &&
    !supabaseConfig.url.includes("PROJECT_ID") &&
    !supabaseConfig.anonKey.includes("PASTE_");
  const testimonialsEndpoint = supabaseReady
    ? `${supabaseConfig.url.replace(/\/$/, "")}/rest/v1/testimonials`
    : "";
  const storageBucket = "testimonials";
  const customerRatings = [];

  function supabaseHeaders(extra = {}) {
    return {
      apikey: supabaseConfig.anonKey,
      Authorization: `Bearer ${supabaseConfig.anonKey}`,
      ...extra,
    };
  }

  function renderTestimonial(testimonial) {
    const card = document.createElement("article");
    card.className = "testimonial-card";

    if (testimonial.image_url) {
      const photo = document.createElement("img");
      photo.src = testimonial.image_url;
      photo.alt = `Foto testimoni ${testimonial.name}`;
      card.appendChild(photo);
    } else {
      const avatar = document.createElement("div");
      avatar.className = "testimonial-avatar";
      avatar.textContent = testimonial.name.charAt(0).toUpperCase();
      card.appendChild(avatar);
    }

    const content = document.createElement("div");
    const customerName = document.createElement("h4");
    const stars = document.createElement("div");
    const customerReview = document.createElement("p");
    const rating = Number(testimonial.rating);

    customerName.textContent = testimonial.name;
    stars.className = "testimonial-stars";
    stars.textContent = "★".repeat(rating);
    stars.setAttribute("aria-label", `${rating} dari 5 bintang`);
    customerReview.textContent = testimonial.review;
    content.append(customerName, stars, customerReview);
    card.appendChild(content);
    testimonialList.appendChild(card);
    customerRatings.push(rating);
  }

  async function loadTestimonials() {
    if (!supabaseReady) {
      testimonialStatus.textContent =
        "Penyimpanan testimoni belum dikonfigurasi.";
      return;
    }

    try {
      const response = await fetch(
        `${testimonialsEndpoint}?select=name,rating,review,image_url&order=created_at.desc&limit=100`,
        { headers: supabaseHeaders() },
      );
      if (!response.ok) throw new Error("Gagal memuat testimoni.");
      const testimonials = await response.json();
      testimonials.forEach(renderTestimonial);
      updateRatingSummary();
    } catch (error) {
      testimonialStatus.textContent =
        "Testimoni belum bisa dimuat. Coba refresh halaman nanti.";
      console.error(error);
    }
  }

  function updateRatingSummary() {
    const total = customerRatings.length;
    const average = total
      ? customerRatings.reduce((sum, rating) => sum + rating, 0) / total
      : 0;
    const roundedAverage = Math.round(average);

    document.getElementById("rating-average").textContent = average.toFixed(1);
    document.getElementById("rating-summary-stars").textContent =
      "★".repeat(roundedAverage) + "☆".repeat(5 - roundedAverage);
    document.getElementById("rating-total").textContent = total
      ? `${total} ulasan customer`
      : "Belum ada ulasan";

    for (let value = 1; value <= 5; value += 1) {
      const count = customerRatings.filter((rating) => rating === value).length;
      const percentage = total ? (count / total) * 100 : 0;
      document.querySelector(`[data-rating-count="${value}"]`).textContent = count;
      document.querySelector(`[data-rating-bar="${value}"]`).style.width =
        `${percentage}%`;
    }
  }

  testimonialImage.addEventListener("change", () => {
    const file = testimonialImage.files[0];
    uploadLabel.textContent = file ? file.name : "Pilih foto pengalamanmu";
  });

  testimonialForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!supabaseReady) {
      testimonialStatus.textContent =
        "Database belum disiapkan. Isi URL dan publishable key Supabase dulu.";
      return;
    }

    const name = document.getElementById("testimonial-name").value.trim();
    const review = document.getElementById("testimonial-review").value.trim();
    const rating = testimonialForm.querySelector('input[name="rating"]:checked');
    const file = testimonialImage.files[0];
    if (!rating) return;
    if (file && (!file.type.startsWith("image/") || file.size > 3 * 1024 * 1024)) {
      testimonialStatus.textContent = "Foto harus berupa gambar maksimal 3 MB.";
      return;
    }

    testimonialSubmit.disabled = true;
    testimonialStatus.textContent = "Mengirim testimoni…";
    (async () => {
      let imageUrl = null;
      try {
        if (file) {
          const extension = file.name.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
          const objectPath = `${crypto.randomUUID()}.${extension}`;
          const uploadResponse = await fetch(
            `${supabaseConfig.url.replace(/\/$/, "")}/storage/v1/object/${storageBucket}/${objectPath}`,
            {
              method: "POST",
              headers: supabaseHeaders({ "Content-Type": file.type, "x-upsert": "false" }),
              body: file,
            },
          );
          if (!uploadResponse.ok) throw new Error("Foto gagal diunggah.");
          imageUrl = `${supabaseConfig.url.replace(/\/$/, "")}/storage/v1/object/public/${storageBucket}/${objectPath}`;
        }

        const response = await fetch(testimonialsEndpoint, {
          method: "POST",
          headers: supabaseHeaders({
            "Content-Type": "application/json",
            Prefer: "return=representation",
          }),
          body: JSON.stringify({ name, rating: Number(rating.value), review, image_url: imageUrl }),
        });
        if (!response.ok) throw new Error("Testimoni gagal disimpan.");
        const [savedTestimonial] = await response.json();
        renderTestimonial(savedTestimonial);
        updateRatingSummary();
        testimonialForm.reset();
        uploadLabel.textContent = "Pilih foto pengalamanmu";
        testimonialStatus.textContent = "Makasih! Testimoni kamu berhasil dikirim.";
      } catch (error) {
        testimonialStatus.textContent =
          "Testimoni belum terkirim. Periksa pengaturan database atau coba lagi.";
        console.error(error);
      } finally {
        testimonialSubmit.disabled = false;
      }
    })();
  });

  loadTestimonials();
});
