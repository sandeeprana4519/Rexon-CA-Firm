import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

const rootDir = import.meta.dirname || process.cwd();

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(rootDir, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(rootDir, 'index.html'),
          about: path.resolve(rootDir, 'about.html'),
          services: path.resolve(rootDir, 'services.html'),
          contact: path.resolve(rootDir, 'contact.html'),
          consultation: path.resolve(rootDir, 'consultation.html'),
          privacy: path.resolve(rootDir, 'privacy-policy.html'),
          terms: path.resolve(rootDir, 'terms.html'),
          disclaimer: path.resolve(rootDir, 'disclaimer.html'),
          incomeTax: path.resolve(rootDir, 'services/income-tax.html'),
          gst: path.resolve(rootDir, 'services/gst.html'),
          accounting: path.resolve(rootDir, 'services/accounting.html'),
          audit: path.resolve(rootDir, 'services/audit.html'),
          companyReg: path.resolve(rootDir, 'services/company-registration.html'),
          businessAdv: path.resolve(rootDir, 'services/business-advisory.html'),
          adminLogin: path.resolve(rootDir, 'admin/login.html'),
          adminDash: path.resolve(rootDir, 'admin/dashboard.html'),
          adminConsultations: path.resolve(rootDir, 'admin/consultations.html'),
          adminContacts: path.resolve(rootDir, 'admin/contacts.html'),
          adminCallbacks: path.resolve(rootDir, 'admin/callbacks.html'),
          adminAppointments: path.resolve(rootDir, 'admin/appointments.html'),
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

