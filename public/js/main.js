/**
 * MAIN SCRIPTS FOR CA FIRM PORTAL
 * Handles dynamic config population, mobile navigation, sticky header,
 * FAQ accordions, modals, and toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
  initDynamicConfig();
  initStickyHeader();
  initMobileMenu();
  initFaqAccordions();
  initModals();
});

/**
 * 1. Populate all placeholder elements in DOM from js/config.js
 */
function initDynamicConfig() {
  if (typeof APP_CONFIG === 'undefined') {
    console.warn('APP_CONFIG is not defined. Ensure js/config.js is loaded.');
    return;
  }

  // Populate text placeholders
  document.querySelectorAll('[data-config]').forEach(el => {
    const key = el.getAttribute('data-config');
    if (key === 'addressFull') {
      el.textContent = `${APP_CONFIG.address}, ${APP_CONFIG.city}, ${APP_CONFIG.state} - ${APP_CONFIG.pin}`;
    } else if (key in APP_CONFIG) {
      el.textContent = APP_CONFIG[key];
    }
  });

  // Populate actionable links (tel, mailto, whatsapp)
  document.querySelectorAll('[data-config-link]').forEach(el => {
    const linkType = el.getAttribute('data-config-link');
    if (linkType === 'phone') {
      el.setAttribute('href', `tel:${APP_CONFIG.phoneRaw || APP_CONFIG.phone.replace(/[^0-9+]/g, '')}`);
    } else if (linkType === 'whatsapp') {
      const defaultMsg = encodeURIComponent("Hello, I would like to know more about your CA and accounting services.");
      const waNumber = APP_CONFIG.whatsappRaw || APP_CONFIG.whatsapp.replace(/[^0-9]/g, '');
      el.setAttribute('href', `https://wa.me/${waNumber}?text=${defaultMsg}`);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    } else if (linkType === 'email') {
      el.setAttribute('href', `mailto:${APP_CONFIG.email}`);
    }
  });

  // Update copyright year and firm name
  document.querySelectorAll('[data-config-copyright]').forEach(el => {
    el.textContent = `© ${new Date().getFullYear()} ${APP_CONFIG.firmName}. All Rights Reserved.`;
  });
}

/**
 * 2. Sticky Header elevation on scroll
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/**
 * 3. Mobile Hamburger Menu
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.main-nav');
  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('mobile-active');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !toggleBtn.contains(e.target) && nav.classList.contains('mobile-active')) {
      nav.classList.remove('mobile-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * 4. FAQ Accordion Interaction
 */
function initFaqAccordions() {
  const accordions = document.querySelectorAll('.accordion-header');
  accordions.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isActive = item.classList.contains('active');

      // Close other accordion items in the same container
      const parentAccordion = item.closest('.accordion');
      if (parentAccordion) {
        parentAccordion.querySelectorAll('.accordion-item').forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherContent = other.querySelector('.accordion-content');
            if (otherContent) otherContent.style.maxHeight = null;
          }
        });
      }

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}

/**
 * 5. Callback & General Modals
 */
function initModals() {
  // Triggers
  document.querySelectorAll('[data-modal-target]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal-target');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close Buttons
  document.querySelectorAll('.modal-close, [data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Close on Backdrop Click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });
}

/**
 * Global Toast Notification
 */
window.showToast = function(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:8px;max-width:90%;width:420px;';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgColor = type === 'success' ? '#15803D' : (type === 'error' ? '#B91C1C' : '#0B1F3A');
  toast.style.cssText = `background:${bgColor};color:#FFFFFF;padding:12px 18px;border-radius:8px;font-size:0.9375rem;box-shadow:0 10px 25px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:space-between;animation:modalFadeIn 0.2s ease;`;
  toast.innerHTML = `<span>${message}</span><button style="background:transparent;border:none;color:#FFF;cursor:pointer;font-size:1.1rem;margin-left:12px;">&times;</button>`;
  
  toast.querySelector('button').onclick = () => toast.remove();
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
};
