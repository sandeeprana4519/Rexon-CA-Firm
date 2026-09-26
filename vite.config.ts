import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          services: path.resolve(__dirname, 'services.html'),
          contact: path.resolve(__dirname, 'contact.html'),
          consultation: path.resolve(__dirname, 'consultation.html'),
          privacy: path.resolve(__dirname, 'privacy-policy.html'),
          terms: path.resolve(__dirname, 'terms.html'),
          disclaimer: path.resolve(__dirname, 'disclaimer.html'),
          incomeTax: path.resolve(__dirname, 'services/income-tax.html'),
          gst: path.resolve(__dirname, 'services/gst.html'),
          accounting: path.resolve(__dirname, 'services/accounting.html'),
          audit: path.resolve(__dirname, 'services/audit.html'),
          companyReg: path.resolve(__dirname, 'services/company-registration.html'),
          businessAdv: path.resolve(__dirname, 'services/business-advisory.html'),
          adminLogin: path.resolve(__dirname, 'admin/login.html'),
          adminDash: path.resolve(__dirname, 'admin/dashboard.html'),
          adminConsultations: path.resolve(__dirname, 'admin/consultations.html'),
          adminContacts: path.resolve(__dirname, 'admin/contacts.html'),
          adminCallbacks: path.resolve(__dirname, 'admin/callbacks.html'),
          adminAppointments: path.resolve(__dirname, 'admin/appointments.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

