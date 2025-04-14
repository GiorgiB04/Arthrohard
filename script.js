let pageNumber = 1;
let pageSize = 20;
let isLoading = false;

const productGrid = document.getElementById("productGrid");
const pageSizeSelector = document.getElementById("pageSize");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupValue = document.getElementById("popupValue");
const closePopup = document.querySelector(".close");
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");

// ✅ Inject overlay dynamically
const overlay = document.createElement("div");
overlay.id = "overlay";
overlay.className = "nav-overlay";
document.body.appendChild(overlay);

// 🔁 Fetch products from API
async function fetchProducts(pageNumber, pageSize) {
  try {
    const response = await fetch(
      `https://brandstestowy.smallhost.pl/api/random?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    productGrid.innerHTML =
      "<p class='error-message'>Nie udało się załadować produktów. Spróbuj ponownie później.</p>";
    return [];
  }
}

// 🔁 Render products
function renderProducts(products) {
  if (!Array.isArray(products)) {
    console.error("Expected an array of products, but got:", products);
    return;
  }

  products.forEach((product) => {
    const productBox = document.createElement("div");
    productBox.className = "product-box";
    productBox.innerHTML = `<h3>${product.name || ""}</h3><p>ID: ${
      product.id
    }</p>`;
    productBox.addEventListener("click", () => showPopup(product));
    productGrid.appendChild(productBox);
  });
}

// 🔁 Show popup and block scroll
function showPopup(product) {
  popupTitle.textContent = product.name || `ID: ${product.id}`;
  let description =
    `Nazwa: ${product.text}` ||
    product.description ||
    product.details ||
    product.info ||
    "Brak dostępnych szczegółów";

  popupValue.textContent = description.trim()
    ? description
    : "Brak dostępnych szczegółów";

  popup.style.display = "flex";
  document.body.classList.add("noscroll");
}

// 🔁 Close popup
function closePopupHandler() {
  popup.style.display = "none";
  document.body.classList.remove("noscroll");
}
closePopup.addEventListener("click", closePopupHandler);
popup.addEventListener("click", (event) => {
  if (event.target === popup) closePopupHandler();
});

// 🔁 Load more products on scroll
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    !isLoading
  ) {
    isLoading = true;
    pageNumber++;
    fetchProducts(pageNumber, pageSize).then((data) => {
      renderProducts(data);
      isLoading = false;
    });
  }
});

// 🔁 Page size change
pageSizeSelector.addEventListener("change", (e) => {
  pageSize = e.target.value;
  productGrid.innerHTML = "";
  pageNumber = 1;
  fetchProducts(pageNumber, pageSize).then((data) => renderProducts(data));
});

// 🔁 Initial load
fetchProducts(pageNumber, pageSize).then((data) => renderProducts(data));

// ✅ Toggle mobile nav and scroll
hamburger.addEventListener("click", () => {
  nav.classList.toggle("active");
  const menuIsActive = nav.classList.contains("active");
  document.body.classList.toggle("noscroll", menuIsActive);
  overlay.classList.toggle("active", menuIsActive);
});

// ✅ Close nav when clicking outside
document.addEventListener("click", (event) => {
  const isClickInsideNav = nav.contains(event.target);
  const isClickOnHamburger = hamburger.contains(event.target);

  if (
    !isClickInsideNav &&
    !isClickOnHamburger &&
    nav.classList.contains("active")
  ) {
    nav.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("noscroll");
  }
});

// ✅ ScrollSpy: highlight nav link based on section in view
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav_link");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
});

// ✅ Parallax Scroll Effect for piesiek_section
// ✅ Parallax scroll for piesiek_section
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const section = document.getElementById("piesiek_section");

  if (!section) return;

  const sectionTop = section.offsetTop;
  const sectionHeight = section.offsetHeight;
  const windowHeight = window.innerHeight;

  // Check if section is in view
  if (
    scrollY + windowHeight > sectionTop &&
    scrollY < sectionTop + sectionHeight
  ) {
    const offset = scrollY - sectionTop;

    const piesekImg = document.querySelector(".piesek_img");
    const piesekLeft = document.querySelector(".piesek_img_left");
    const piesekRight = document.querySelector(".piesek_img_right");

    if (piesekImg) {
      piesekImg.style.transform = `translate(-50%, calc(-50% + ${
        offset * 0.1
      }px))`;
    }
    if (piesekLeft) {
      piesekLeft.style.transform = `translateY(${offset * 0.3}px)`;
    }
    if (piesekRight) {
      piesekRight.style.transform = `translateY(${offset * -0.3}px)`;
    }
  }
});

// ✅ Final: True Scroll-based Parallax for piesiek_section
window.addEventListener("scroll", () => {
  const piesiekSection = document.getElementById("piesiek_section");
  if (!piesiekSection) return;

  const piesekRect = piesiekSection.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Check if section is visible
  if (piesekRect.top < windowHeight && piesekRect.bottom > 0) {
    const scrollProgress = 1 - piesekRect.top / windowHeight;

    const piesekCenter = document.querySelector(".piesek_img");
    const piesekLeft = document.querySelector(".piesek_img_left");
    const piesekRight = document.querySelector(".piesek_img_right");

    if (piesekCenter) {
      piesekCenter.style.transform = `translate(-50%, calc(-50% + ${
        scrollProgress * 30
      }px))`;
    }
    if (piesekLeft) {
      piesekLeft.style.transform = `translateY(${scrollProgress * 60}px)`;
    }
    if (piesekRight) {
      piesekRight.style.transform = `translateY(${scrollProgress * -70}px)`;
    }
  }
});

// ✅ DEBUG version of Parallax Effect
window.addEventListener("scroll", () => {
  const section = document.getElementById("piesiek_section");
  if (!section) return;

  const rect = section.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Check if piesiek_section is in viewport
  if (rect.top < windowHeight && rect.bottom > 0) {
    const progress = 1 - rect.top / windowHeight;

    const piesekImg = document.querySelector(".piesek_img");
    const piesekLeft = document.querySelector(".piesek_img_left");
    const piesekRight = document.querySelector(".piesek_img_right");

    console.log("📌 Scroll progress:", progress);

    if (piesekImg) {
      piesekImg.style.transform = `translate(-50%, calc(-50% + ${
        progress * 30
      }px))`;
      console.log("🎯 piesek_img moved");
    }

    if (piesekLeft) {
      piesekLeft.style.transform = `translateY(${progress * 60}px)`;
      console.log("⬇️ piesek_img_left moved");
    }

    if (piesekRight) {
      piesekRight.style.transform = `translateY(${progress * -70}px)`;
      console.log("⬆️ piesek_img_right moved");
    }
  }
});
