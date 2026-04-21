"use strict";

const btn = document.querySelector(".home__btn");

btn.addEventListener("click", (e) => {
  const previousText = btn.textContent;
  btn.textContent = "Воля! ти натиснув на мене";
  setTimeout(() => (btn.textContent = previousText), 1000);
});
