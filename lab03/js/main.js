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
