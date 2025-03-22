// Updated script.js with improvements
let pageNumber = 1;
let pageSize = 20;
let isLoading = false;

const productGrid = document.getElementById("productGrid");
const pageSizeSelector = document.getElementById("pageSize");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupValue = document.getElementById("popupValue");
const closePopup = document.querySelector(".close");

// Fetch products from API
async function fetchProducts(pageNumber, pageSize) {
  try {
    const response = await fetch(
      `https://brandstestowy.smallhost.pl/api/random?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    productGrid.innerHTML =
      "<p class='error-message'>Nie udało się załadować produktów. Spróbuj ponownie później.</p>";
    return [];
  }
}

// Render products
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

// Show popup with product details
function showPopup(product) {
  console.log("Product data:", product); // Debugging line to inspect API data
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
}

// Close popup
closePopup.addEventListener("click", () => {
  popup.style.display = "none";
});

// Load more products on scroll
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

// Change page size
pageSizeSelector.addEventListener("change", (e) => {
  pageSize = e.target.value;
  productGrid.innerHTML = "";
  pageNumber = 1;
  fetchProducts(pageNumber, pageSize).then((data) => renderProducts(data));
});

// Initial load
fetchProducts(pageNumber, pageSize).then((data) => renderProducts(data));

// Mobile Menu Toggle
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");

hamburger.addEventListener("click", () => {
  nav.classList.toggle("active");
});
