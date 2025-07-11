// assets/alpha/js/modules/contact.js

/**
 * @file Control the client-side part of the contact form for the Alpha theme.
 * @module modules/contact
 *
 * @summary Manages all aspects of contact form submission, client-side
 * validation, data serialization, submission to a Make.com webhook,
 * UI feedback, rudimentary spam protection and a cooldown mechanism to prevent
 * abuse.
 *
 * @description
 * This module is designed to use a Make.com webhook URL.
 * It attaches event listeners to the contact form, validates user input for
 * required fields.
 * Upon successful validation, it sends the form data to the specified endpoint.
 *
 * The module updates the submit button's text to reflect the submission statsu. 
 * It utilizes HTML templates for success and failure
 * snackbar messages. If a network error occurs display an alternative contact
 * method (email).
 *
 * A cooldown period is enforced using `localStorage` to limit the frequency
 * of submissions from the same browser.
 *
 * The module relies on specific `data-alpha-*` attributes in the HTML to 
 * identify and interact with form elements, error message containers,
 * snackbar templates, and other UI components.
 *
 * @exports initContactForm - The function to initialize the contact form 
 * listeners and functionality.
 *
 * @requires ../utils.js - For the `$` DOM utility function.
 */

import { $ } from "../utils.js";

/**
 * Initializes the contact form, setting up event listeners, validation,
 * and submission handling.
 *
 * @param {string} endpointURL - The URL of the Make.com webhook. This is
 *                               provided by Hugo config file (`params.toml`).
 */

export const initContactForm = (endpointURL) => {
  const ELEMENTS = {
    form: $('[data-alpha="contact-form"]'),
    btn: $('[data-alpha="submitBtn"]'),
    honeypot: $('[data-alpha="surname"]'),
  };

  const ERROR_IDS = {
    name: $('[data-alpha="name-error"]'),
    email: $('[data-alpha="email-error"]'),
    subject: $('[data-alpha="subject-error"]'),
    message: $('[data-alpha="message-error"]'),
  };

  const COOLDOWN_MS = 30000;
  const COOLDOWN_KEY = "contactFormLastSubmission";
  const ENDPOINT = endpointURL;
  //console.log("Make.com Endpoint from module:", ENDPOINT);

  const SNACKBAR = {
    container: $('[data-alpha="snackbar-container"]'),
    success: $('[data-alpha="template-form-success"]'),
    failure: $('[data-alpha="template-form-fail"]'),
  };

  const ALT_CONTACT = {
    container: $('[data-alpha="fail-container"]'),
    template: $('[data-alpha="alternative-contact-template"]'),
    display: "contactEmailDisplay",
    user: "alpha",
    domain: "oxypteros.com",
  };

  let isSubmitting = false,
    cooldownTimer;

  function setButton(state, text) {
    if (ELEMENTS.btn) {
      ELEMENTS.btn.disabled = state;
      ELEMENTS.btn.textContent = text;
    }
  }

  function clearErrors() {
    Object.values(ERROR_IDS).forEach((id) => {
      const el = document.getElementById(id);
      if (el) (el.textContent = ""), el.classList.add("hidden");
    });
  }

  function showError(field, msg) {
    const el = document.getElementById(ERROR_IDS[field]);
    if (el) (el.textContent = msg), el.classList.remove("hidden");
  }

  function showSnackbar(template) {
    if (SNACKBAR.container && template) {
      SNACKBAR.container.innerHTML = "";
      SNACKBAR.container.appendChild(template.content.cloneNode(true));
      SNACKBAR.container
        .querySelector(".closeSnackbarBtn")
        ?.addEventListener("click", () => (SNACKBAR.container.innerHTML = ""));
      setTimeout(() => (SNACKBAR.container.innerHTML = ""), 7000);
    }
  }

  function showAltContact() {
    const { container, template, display, user, domain } = ALT_CONTACT;
    if (container && template) {
      container.innerHTML = "";
      const node = template.content.cloneNode(true);
      container.appendChild(node);
      const emailEl = container.querySelector(`#${display}`);
      if (emailEl)
        emailEl.innerHTML = `<a href="mailto:${user}@${domain}?subject=Contact Form Issue">${user}@${domain}</a>`;
    }
  }

  function validate(data) {
    clearErrors();
    let valid = true;
    if (!data.get("name")?.trim())
      showError("name", "Name is required"), (valid = false);
    const email = data.get("email")?.trim();
    if (!email) showError("email", "Email is required"), (valid = false);
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      showError("email", "Invalid email"), (valid = false);
    if (!data.get("subject")?.trim())
      showError("subject", "Subject is required"), (valid = false);
    if (!data.get("message")?.trim())
      showError("message", "Message is required"), (valid = false);
    return valid;
  }

  function setCooldown(ts) {
    const now = Date.now();
    const diff = now - ts;
    if (diff < COOLDOWN_MS) {
      let remaining = Math.ceil((COOLDOWN_MS - diff) / 1000);
      setButton(true, `Wait ${remaining}s`);
      clearInterval(cooldownTimer);
      cooldownTimer = setInterval(() => {
        remaining--;
        if (remaining <= 0) {
          clearInterval(cooldownTimer);
          setButton(false, "Send Message");
        } else {
          setButton(true, `Wait ${remaining}s`);
        }
      }, 1000);
      return true;
    }
    return false;
  }

  function init() {
    const { form, btn, honeypot } = ELEMENTS;
    if (!form || !btn) return console.warn("Missing form/button");

    const last = localStorage.getItem(COOLDOWN_KEY);
    if (last) setCooldown(+last);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      const now = Date.now();
      const last = +localStorage.getItem(COOLDOWN_KEY);
      if (now - last < COOLDOWN_MS) return setCooldown(last);

      if (honeypot?.value)
        return localStorage.setItem(COOLDOWN_KEY, now), setCooldown(now);

      const data = new FormData(form);
      if (!validate(data)) return;

      isSubmitting = true;
      setButton(true, "Sending...");
      const payload = new URLSearchParams();
      for (const [k, v] of data.entries()) {
        if (k !== honeypot?.name) payload.append(k, v);
      }

      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: payload.toString(),
        });

        if (res.ok) {
          showSnackbar(SNACKBAR.success);
          form.reset();
          localStorage.setItem(COOLDOWN_KEY, now.toString());
          setCooldown(now);
        } else {
          console.error("Submit error", res.status);
          showSnackbar(SNACKBAR.failure);
          setButton(false, "Send Message");
        }
      } catch (err) {
        console.error("Network error", err);
        showSnackbar(SNACKBAR.failure);
        showAltContact();
        setButton(false, "Send Message");
      } finally {
        isSubmitting = false;
      }
    });
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
  //console.log("contact.js imported");
};
