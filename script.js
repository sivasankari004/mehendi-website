// Mehendi Magic website interactions
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.textContent = isOpen ? "✕" : "☰";
    });
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "☰";
      });
    });
  }

  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Category filter buttons
  const filterButtons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll(".full-grid [data-category]");
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(item => item.classList.toggle("active", item === button));
      cards.forEach(card => {
        card.classList.toggle("is-hidden", filter !== "all" && card.dataset.category !== filter);
      });
    });
  });

  // Preselect a category when a visitor clicks an enquiry link.
  const serviceSelect = document.querySelector("#service");
  if (serviceSelect) {
    const params = new URLSearchParams(window.location.search);
    const requestedService = params.get("service");
    if (requestedService) {
      const option = [...serviceSelect.options].find(item => item.text.toLowerCase() === requestedService.toLowerCase());
      if (option) serviceSelect.value = option.value;
    }

    const dateField = document.querySelector("#date");
    if (dateField) {
      const today = new Date();
      const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      dateField.min = localDate;
    }
  }

  // Demo booking form: prepare a WhatsApp message.
  const form = document.querySelector("#booking-form");
  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      // IMPORTANT: Replace this with the business WhatsApp number, country code included.
      // Example format for India: 919876543210 (digits only; no +, spaces or hyphens).
      const WHATSAPP_NUMBER = "91XXXXXXXXXX";

      if (WHATSAPP_NUMBER.includes("X")) {
        const status = form.querySelector(".form-status");
        status.textContent = "Before using bookings, open script.js and replace WHATSAPP_NUMBER with your business WhatsApp number.";
        return;
      }

      const data = new FormData(form);
      const message = [
        "Hello Mehendi Magic! I'd like to enquire about an appointment.",
        `Name: ${data.get("name")}`,
        `Phone: ${data.get("phone")}`,
        `Mehendi style: ${data.get("service")}`,
        `Event date: ${data.get("date") || "Not decided yet"}`,
        `Details: ${data.get("message") || "No extra details"}`
      ].join("\\n");
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }
});