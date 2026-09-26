/**
 * CENTRAL CONFIGURATION FILE
 * -------------------------------------------------------------
 * Replace all placeholder values below with your actual firm details.
 * Any updates here automatically propagate to all pages, headers, footers,
 * contact links, WhatsApp triggers, and Supabase connections.
 * -------------------------------------------------------------
 */

const APP_CONFIG = {
  // Brand & Firm Information
  firmName: "Rexon CA Firm", // Firm Name
  caName: "CA Rajesh Sharma, FCA", // Replace with: [NAME]
  designation: "Senior Chartered Accountant & Tax Consultant", // Replace with: [CHARTERED ACCOUNTANT / ACCOUNTANT / TAX CONSULTANT]
  experience: "15+ Years", // Replace with: [XX+ YEARS]
  
  // Contact Information
  phone: "+91 98765 43210", // Replace with: [PHONE NUMBER]
  phoneRaw: "919876543210", // Digits only for tel: links
  whatsapp: "+91 98765 43210", // Replace with: [WHATSAPP NUMBER]
  whatsappRaw: "919876543210", // Digits only with country code for wa.me links
  email: "contact@apexca.in", // Replace with: [EMAIL ADDRESS]
  
  // Office Location
  address: "Suite 402, Financial Tower, Corporate Boulevard", // Replace with: [FULL OFFICE ADDRESS]
  city: "Mumbai", // Replace with: [CITY]
  state: "Maharashtra", // Replace with: [STATE]
  pin: "400051", // Replace with: [PIN CODE]
  website: "https://www.apexca.in", // Replace with: [DOMAIN]
  workingHours: "Mon - Sat: 9:30 AM - 7:00 PM (Closed on Sundays)", // Replace with: [WORKING HOURS]
  
  // ICAI / Regulatory Note
  membershipNotice: "Strictly adhering to the Code of Ethics laid down by the Institute of Chartered Accountants of India (ICAI).",
  
  // Supabase Configuration
  supabase: {
    url: "https://tkxmfrkpkguqzmkawgop.supabase.co",
    anonKey: "sb_publishable_uAK4KAqYGzMPrREhg2oFEw_lo7fI7kk",
  }
};

// Freeze configuration to prevent unauthorized modification during runtime
if (typeof Object.freeze === 'function') {
  Object.freeze(APP_CONFIG);
  Object.freeze(APP_CONFIG.supabase);
}

// Export for module bundlers or window global
if (typeof window !== 'undefined') {
  window.APP_CONFIG = APP_CONFIG;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = APP_CONFIG;
}
