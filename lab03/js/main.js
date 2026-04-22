"use strict";

document.addEventListener("DOMContentLoaded", init);

function init() {
  initActiveNav();
  initMenuToggle();
  initThemeToggle();
  initBackToTop();
  initAccordion();
  initFilters();
  initModal();
  initContactForm();
}

function initActiveNav() {
  const links = document.querySelectorAll(".header__nav-link");
  if (!links.length) return;

  const path = window.location.pathname.split("/").pop();

  links.forEach((link) => {
    console.log("href: ", link.getAttribute("href"));
    if (link.getAttribute("href").split("/").pop() === path) {
      link.classList.add("active");
    }
  });
}

function initMenuToggle() {
  const btn = document.querySelector(".burger");
  const menu = document.querySelector(".burger-nav");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", isOpen);
  });

  menu.addEventListener("click", (e) => {
    if (e.target.closest("li")) {
      menu.classList.remove("is-open");
      btn.setAttribute("aria-expanded", false);
    }
  });
}

function initThemeToggle() {
  const btn = document.querySelector("[data-theme-toggle]");
  const sun = document.querySelector(".theme-toggle-sun");
  const moon = document.querySelector(".theme-toggle-moon");

  if (!btn || !sun || !moon) return;

  const saved = localStorage.getItem("siteTheme");

  if (saved === "dark") {
    document.body.classList.add("theme-dark");
  }

  updateIcons();

  btn.addEventListener("click", () => {
    document.body.classList.toggle("theme-dark");

    const isDark = document.body.classList.contains("theme-dark");
    localStorage.setItem("siteTheme", isDark ? "dark" : "light");

    updateIcons();
  });

  function updateIcons() {
    const isDark = document.body.classList.contains("theme-dark");

    sun.style.display = isDark ? "none" : "block";
    moon.style.display = isDark ? "block" : "none";
  }
}

function initBackToTop() {
  const btn = document.querySelector("[data-top]");
  const year = document.querySelector("[data-footer]");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (!btn) return;

  console.log(window.scrollY);

  window.addEventListener("scroll", () => {
    btn.hidden = window.scrollY < 200;
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initAccordion() {
  const items = document.querySelectorAll("[data-acc]");
  if (!items.length) return;

  items.forEach((item) => {
    const btn = item.querySelector("[data-acc-btn]");
    const content = item.querySelector("[data-acc-content]");

    btn.addEventListener("click", () => {
      const isOpen = item.classList.toggle("is-open");
      content.hidden = !isOpen;
    });
  });
}

function initFilters() {
  const input = document.querySelector("[data-table-search]");
  const rows = document.querySelectorAll(".home__table tbody tr");

  if (!input || !rows.length) return;

  input.addEventListener("input", () => {
    const value = input.value.toLowerCase().trim();

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();

      const match = text.includes(value);
      row.hidden = !match;
    });
  });
}

function initModal() {
  const figures = document.querySelectorAll(".home__figure img");
  const modal = document.querySelector("[data-modal]");
  const modalImg = modal?.querySelector(".modal__img");
  const caption = modal?.querySelector(".modal__caption");
  const closeBtn = modal?.querySelector("[data-modal-close]");

  if (!figures.length || !modal) return;

  figures.forEach((img) => {
    img.style.cursor = "pointer";

    img.addEventListener("click", () => {
      modal.classList.add("is-open");
      modal.hidden = false;

      modalImg.src = img.src;
      modalImg.alt = img.alt;

      const figcaption = img.closest("figure")?.querySelector("figcaption");
      caption.textContent = figcaption?.textContent || "";
    });
  });

  closeBtn.addEventListener("click", close);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  function close() {
    modal.classList.remove("is-open");

    setTimeout(() => {
      modal.hidden = true;
    }, 300);
  }
}

// form submit + validation
function initContactForm() {
  const form = document.querySelector(".contact__form");
  if (!form) return;

  const nameInput = form.querySelector("#name");
  const emailInput = form.querySelector("#email");
  const telInput = form.querySelector("#tel");
  const topicSelect = form.querySelector("#topic");
  const messageInput = form.querySelector("#message");
  const agreeInput = form.querySelector("[name='agree']");
  const radios = form.querySelectorAll("[name='contactWay']");

  const STORAGE_KEY = "contactDraft";

  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

  if (saved.name) nameInput.value = saved.name;
  if (saved.email) emailInput.value = saved.email;
  if (saved.tel) telInput.value = saved.tel;
  if (saved.topic) topicSelect.value = saved.topic;
  if (saved.message) messageInput.value = saved.message;

  if (saved.contactWay) {
    radios.forEach((r) => {
      r.checked = r.value === saved.contactWay;
    });
  }

  if (saved.agree) {
    agreeInput.checked = true;
  }

  form.addEventListener("input", () => {
    const selectedRadio = form.querySelector("[name='contactWay']:checked");

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        name: nameInput.value,
        email: emailInput.value,
        tel: telInput.value,
        topic: topicSelect.value,
        message: messageInput.value,
        contactWay: selectedRadio?.value,
        agree: agreeInput.checked,
      }),
    );
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    clearErrors();

    let valid = true;

    if (nameInput.value.trim().length < 2) {
      showError(nameInput, "Ім’я має бути не менше 2 символів");
      valid = false;
    }

    if (!emailInput.value.includes("@")) {
      showError(emailInput, "Некоректний email");
      valid = false;
    }

    if (!agreeInput.checked) {
      showError(agreeInput, "Потрібно погодитися з правилами");
      valid = false;
    }

    if (!valid) return;

    const data = new FormData(form);

    showResult(data);

    localStorage.removeItem(STORAGE_KEY);
    form.reset();
  });

  form.addEventListener("reset", () => {
    localStorage.removeItem(STORAGE_KEY);
    clearErrors();
  });

  function showError(input, message) {
    const fieldset = input.closest(".contact__fieldset");

    const err = document.createElement("div");
    err.className = "contact__error";
    err.textContent = message;

    fieldset.appendChild(err);
  }

  function clearErrors() {
    form.querySelectorAll(".contact__error").forEach((e) => e.remove());
  }

  function showResult(data) {
    let result = document.querySelector(".contact__result");

    if (!result) {
      result = document.createElement("div");
      result.className = "contact__result";
      form.appendChild(result);
    }

    result.innerHTML = `
      <h3>Дані відправлено:</h3>
      <p><b>Ім’я:</b> ${data.get("name")}</p>
      <p><b>Email:</b> ${data.get("email")}</p>
      <p><b>Телефон:</b> ${data.get("tel") || "-"}</p>
      <p><b>Тема:</b> ${data.get("topic")}</p>
      <p><b>Спосіб зв'язку:</b> ${data.get("contactWay")}</p>
      <p><b>Повідомлення:</b> ${data.get("message") || "-"}</p>
    `;
  }
}
