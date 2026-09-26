/**
 * FORM HANDLING & SUPABASE INTEGRATION
 * Connects frontend forms to Supabase database tables:
 * - consultation_requests
 * - contact_messages
 * - callback_requests
 * - appointments
 */

// Initialize Supabase Client
let supabaseClient = null;

function getSupabase() {
  if (supabaseClient) return supabaseClient;

  if (typeof APP_CONFIG === 'undefined' || !APP_CONFIG.supabase) {
    console.error('APP_CONFIG.supabase is missing.');
    return null;
  }

  const { url, anonKey } = APP_CONFIG.supabase;

  // Check if credentials are still placeholder
  const isPlaceholder = !url || !anonKey || 
                        url === 'YOUR_SUPABASE_PROJECT_URL' || 
                        anonKey === 'YOUR_SUPABASE_ANON_KEY';

  if (isPlaceholder) {
    console.info('Supabase credentials are placeholder. Running in local test/preview mode.');
    return null;
  }

  try {
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
      supabaseClient = window.supabase.createClient(url, anonKey);
      return supabaseClient;
    } else {
      console.warn('Supabase JS library not loaded from CDN.');
      return null;
    }
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

// Local mock storage for preview testing before user enters credentials
function saveMockSubmission(table, data) {
  try {
    const key = `ca_mock_${table}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const record = {
      id: 'demo-' + Math.random().toString(36).substr(2, 9),
      ...data,
      status: 'new',
      created_at: new Date().toISOString()
    };
    existing.unshift(record);
    localStorage.setItem(key, JSON.stringify(existing));
    return record;
  } catch (e) {
    console.error('Local mock storage error:', e);
    return null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initConsultationForm();
  initContactForm();
  initCallbackForm();
  initAppointmentForm();
  setMinDateAttributes();
});

// Enforce future dates in date inputs
function setMinDateAttributes() {
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(input => {
    input.setAttribute('min', today);
  });
}

/**
 * 1. Consultation Form Handler
 */
function initConsultationForm() {
  const form = document.getElementById('consultationForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    setButtonLoading(submitBtn, true);

    const formData = {
      full_name: form.fullName.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      service: form.service.value,
      preferred_date: form.preferredDate.value || null,
      preferred_time: form.preferredTime.value || null,
      message: form.message ? form.message.value.trim() : null,
      status: 'new'
    };

    try {
      const client = getSupabase();
      if (client) {
        const { error } = await client
          .from('consultation_requests')
          .insert([formData]);
        if (error) throw error;
      } else {
        saveMockSubmission('consultation_requests', formData);
      }

      showFormSuccess(form, {
        title: "Consultation Request Received",
        message: "Thank you! Your consultation request has been submitted successfully. Our team will contact you shortly to confirm.",
        whatsappText: `Hi, I just submitted a consultation request for ${formData.service}. My name is ${formData.full_name}.`
      });
      form.reset();
    } catch (err) {
      console.error('Error submitting consultation:', err);
      showFormError(form, "Unable to submit your request at this moment. Please call us directly or message us on WhatsApp.");
    } finally {
      setButtonLoading(submitBtn, false, originalText);
    }
  });
}

/**
 * 2. Contact Form Handler
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    setButtonLoading(submitBtn, true);

    const formData = {
      name: form.name.value.trim(),
      phone: form.phone ? form.phone.value.trim() : null,
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
      status: 'new'
    };

    try {
      const client = getSupabase();
      if (client) {
        const { error } = await client
          .from('contact_messages')
          .insert([formData]);
        if (error) throw error;
      } else {
        saveMockSubmission('contact_messages', formData);
      }

      showFormSuccess(form, {
        title: "Message Sent Successfully",
        message: "Your message has been received successfully. Our office will respond within 1 business day.",
        whatsappText: `Hi, I sent an enquiry regarding "${formData.subject}".`
      });
      form.reset();
    } catch (err) {
      console.error('Error submitting contact form:', err);
      showFormError(form, "Could not send your message. Please reach us via phone or WhatsApp.");
    } finally {
      setButtonLoading(submitBtn, false, originalText);
    }
  });
}

/**
 * 3. Callback Form Handler
 */
function initCallbackForm() {
  const form = document.getElementById('callbackForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    setButtonLoading(submitBtn, true);

    const formData = {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      preferred_time: form.preferredTime.value,
      service: form.service.value,
      status: 'new'
    };

    try {
      const client = getSupabase();
      if (client) {
        const { error } = await client
          .from('callback_requests')
          .insert([formData]);
        if (error) throw error;
      } else {
        saveMockSubmission('callback_requests', formData);
      }

      showFormSuccess(form, {
        title: "Callback Scheduled",
        message: `Thank you, ${formData.name}. We will call you at ${formData.phone} during your preferred slot (${formData.preferred_time}).`,
        whatsappText: `Hi, I requested a callback for ${formData.service}.`
      });
      form.reset();
    } catch (err) {
      console.error('Error submitting callback request:', err);
      showFormError(form, "Callback request failed. Please give us a direct call.");
    } finally {
      setButtonLoading(submitBtn, false, originalText);
    }
  });
}

/**
 * 4. Appointment Form Handler
 */
function initAppointmentForm() {
  const form = document.getElementById('appointmentForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    setButtonLoading(submitBtn, true);

    const formData = {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      service: form.service.value,
      appointment_date: form.appointmentDate.value,
      appointment_time: form.appointmentTime.value,
      message: form.message ? form.message.value.trim() : null,
      status: 'new'
    };

    try {
      const client = getSupabase();
      if (client) {
        const { error } = await client
          .from('appointments')
          .insert([formData]);
        if (error) throw error;
      } else {
        saveMockSubmission('appointments', formData);
      }

      showFormSuccess(form, {
        title: "Appointment Request Submitted",
        message: `Your appointment request for ${formData.appointment_date} at ${formData.appointment_time} has been received. Note: This is an appointment request; our office will confirm the calendar slot with you shortly.`,
        whatsappText: `Hi, I submitted an appointment request for ${formData.appointment_date} (${formData.appointment_time}) regarding ${formData.service}.`
      });
      form.reset();
    } catch (err) {
      console.error('Error submitting appointment:', err);
      showFormError(form, "Could not submit appointment request. Please contact us directly.");
    } finally {
      setButtonLoading(submitBtn, false, originalText);
    }
  });
}

/**
 * Validation Helpers
 */
function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('input, select, textarea');

  inputs.forEach(input => {
    input.classList.remove('is-invalid');
    const val = input.value.trim();

    // Required check
    if (input.hasAttribute('required') && !val) {
      input.classList.add('is-invalid');
      isValid = false;
      return;
    }

    // Email check
    if (input.type === 'email' && val) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        input.classList.add('is-invalid');
        isValid = false;
      }
    }

    // Phone check (Indian & International format)
    if (input.type === 'tel' && val) {
      const cleanPhone = val.replace(/[\s\-\(\)\+]/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        input.classList.add('is-invalid');
        isValid = false;
      }
    }
  });

  if (!isValid && typeof window.showToast === 'function') {
    window.showToast("Please check the highlighted fields.", "error");
  }
  return isValid;
}

function setButtonLoading(button, isLoading, originalText = '') {
  if (isLoading) {
    button.disabled = true;
    button.setAttribute('data-original-html', button.innerHTML);
    button.innerHTML = `
      <svg class="animate-spin" style="width:18px;height:18px;display:inline-block;vertical-align:middle;margin-right:8px;animation:spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10" stroke-width="4" stroke="currentColor" stroke-opacity="0.3"></circle>
        <path d="M4 12a8 8 0 018-8" stroke-width="4" stroke="currentColor"></path>
      </svg> Submitting...
    `;
  } else {
    button.disabled = false;
    button.innerHTML = originalText || button.getAttribute('data-original-html') || 'Submit';
  }
}

function showFormSuccess(form, options) {
  let alertBox = form.querySelector('.form-alert-container');
  if (!alertBox) {
    alertBox = document.createElement('div');
    alertBox.className = 'form-alert-container';
    form.prepend(alertBox);
  }

  const waNumber = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.whatsappRaw) ? APP_CONFIG.whatsappRaw : '919876543210';
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(options.whatsappText || '')}`;

  alertBox.innerHTML = `
    <div class="alert alert-success" style="flex-direction:column;align-items:flex-start;gap:12px;">
      <div style="font-weight:700;font-size:1.0625rem;">${options.title}</div>
      <div>${options.message}</div>
      <div style="display:flex;gap:12px;margin-top:8px;flex-wrap:wrap;">
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">
          Follow up on WhatsApp
        </a>
        <a href="tel:${(typeof APP_CONFIG !== 'undefined' && APP_CONFIG.phoneRaw) ? APP_CONFIG.phoneRaw : ''}" class="btn btn-outline btn-sm">
          Call Office
        </a>
      </div>
    </div>
  `;

  if (typeof window.showToast === 'function') {
    window.showToast(options.title, 'success');
  }

  alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showFormError(form, message) {
  let alertBox = form.querySelector('.form-alert-container');
  if (!alertBox) {
    alertBox = document.createElement('div');
    alertBox.className = 'form-alert-container';
    form.prepend(alertBox);
  }

  alertBox.innerHTML = `
    <div class="alert alert-error">
      <div>${message}</div>
    </div>
  `;

  if (typeof window.showToast === 'function') {
    window.showToast("Submission failed. Please check form.", 'error');
  }
}
