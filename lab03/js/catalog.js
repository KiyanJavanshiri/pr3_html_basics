"use strict";

document.addEventListener("DOMContentLoaded", init);
async function init() {
  await initCatalogPage();
}

async function initCatalogPage() {
  const catalogContainer = document.querySelector("[data-catalog]");
  if (!catalogContainer) return;
  const items = await loadItems();
  renderCatalog(items);
  initCatalogControls(items);
  initModal(items);
}

// ! fetching data
async function loadItems() {
  const container = document.querySelector("[data-catalog]");

  try {
    showLoading();

    const res = await fetch("../data/items.json");

    if (!res.ok) {
      throw new Error("Помилка завантаження");
    }

    const data = await res.json();

    hideLoading();
    return data;
  } catch (err) {
    showError(err.message);
    return [];
  }
}

function showLoading() {
  document.querySelector("[data-loading]").style.display = "block";
}

function hideLoading() {
  document.querySelector("[data-loading]").style.display = "none";
}

function showError(message) {
  const errorBlock = document.querySelector("[data-error]");
  errorBlock.textContent = message;
  errorBlock.style.display = "block";

  document.querySelector("[data-catalog]").style.display = "none";
}

let visibleCount = 4;

function renderCatalog(items) {
  const container = document.querySelector("[data-catalog]");

  const visibleItems = items.slice(0, visibleCount);

  container.innerHTML = visibleItems.map(createCard).join("");
}

// ! creating card
function createCard(item) {
  return `
    <div class="card">
      <img 
        class="card__image" 
        src="${item.image}" 
        alt="${item.title}" 
      />

      <div class="card__body">
        <h3 class="card__title">${item.title}</h3>

        <p class="card__category">
          ${item.category}
        </p>

        <p class="card__description">
          ${item.description}
        </p>

        <div class="card__footer">
          <span class="card__price">
            $${item.price}
          </span>

          <button 
            class="card__btn card__btn--favorite"
            data-id="${item.id}"
          >
            ❤️
          </button>
        </div>
      </div>
    </div>
  `;
}

// ! filter + sorting
function initCatalogControls(allItems) {
  const searchInput = document.querySelector("[data-search]");
  const categorySelect = document.querySelector("[data-category]");
  const sortSelect = document.querySelector("[data-sort]");

  let state = {
    search: "",
    category: "all",
    sort: "default",
  };

  function update() {
    let filtered = [...allItems];

    if (state.search) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(state.search) ||
          item.description.toLowerCase().includes(state.search),
      );
    }

    if (state.category !== "all") {
      filtered = filtered.filter((item) => item.category === state.category);
    }

    filtered = sortItems(filtered, state.sort);

    renderCatalog(filtered);
  }

  searchInput.addEventListener("input", (e) => {
    state.search = e.target.value.toLowerCase();
    update();
  });

  categorySelect.addEventListener("change", (e) => {
    state.category = e.target.value;
    update();
  });

  sortSelect.addEventListener("change", (e) => {
    state.sort = e.target.value;
    update();
  });
}

// ! sorting
function sortItems(items, type) {
  const sorted = [...items];

  switch (type) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);

    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);

    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);

    case "title":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));

    default:
      return items;
  }
}

// ! favorite
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function toggleFavorite(id) {
  let favorites = getFavorites();

  if (favorites.includes(id)) {
    favorites = favorites.filter((fav) => fav !== id);
  } else {
    favorites.push(id);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("card__btn")) {
    const id = Number(e.target.dataset.id);
    toggleFavorite(id);
  }
});

// ! pagination
document.querySelector("[data-load-more]").addEventListener("click", () => {
  visibleCount += 4;
  initCatalogPage();
});

// ! modal
function initModal(items) {
  const modal = document.querySelector("[data-modal]");

  modal.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-modal-close")) {
      closeModal();
    }
  });

  document.addEventListener("click", (e) => {
    const card = e.target.closest(".card");

    if (e.target.closest(".card__btn")) return;

    if (!card) return;
    const id = Number(card.querySelector("[data-id]").dataset.id);

    const item = items.find((el) => el.id === id);

    if (item) {
      openModal(item);
    }
  });
}

function openModal(item) {
  const modal = document.querySelector("[data-modal]");

  modal.classList.remove("catalog__modal--hidden");

  modal.querySelector("[data-modal-image]").src = item.image;
  modal.querySelector("[data-modal-title]").textContent = item.title;
  modal.querySelector("[data-modal-category]").textContent = item.category;
  modal.querySelector("[data-modal-description]").textContent =
    item.description;
  modal.querySelector("[data-modal-price]").textContent = `$${item.price}`;
}

function closeModal() {
  const modal = document.querySelector("[data-modal]");
  modal.classList.add("catalog__modal--hidden");
}
