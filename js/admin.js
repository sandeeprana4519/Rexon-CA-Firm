/**
 * ADMIN PANEL SCRIPTS
 * Supabase Auth Authentication Guard & Real-Time Data Management
 * Handles login, session validation, metrics, tables, status updates, and logout.
 */

let adminSupabase = null;

function getAdminSupabase() {
  if (adminSupabase) return adminSupabase;

  if (typeof APP_CONFIG === 'undefined' || !APP_CONFIG.supabase) {
    return null;
  }

  const { url, anonKey } = APP_CONFIG.supabase;
  const isPlaceholder = !url || !anonKey || 
                        url === 'YOUR_SUPABASE_PROJECT_URL' || 
                        anonKey === 'YOUR_SUPABASE_ANON_KEY';

  if (isPlaceholder) {
    return null;
  }

  try {
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
      adminSupabase = window.supabase.createClient(url, anonKey);
      return adminSupabase;
    }
  } catch (err) {
    console.error('Error creating admin supabase client:', err);
  }
  return null;
}

/**
 * 1. Admin Authentication Check
 * Protects dashboard pages by redirecting unauthenticated users to login.html
 */
async function checkAdminAuth() {
  const isLoginPage = window.location.pathname.endsWith('login.html');
  const client = getAdminSupabase();

  if (!client) {
    // If running in demo/preview mode without Supabase keys:
    if (!isLoginPage) {
      const demoNotice = document.getElementById('demoModeBanner');
      if (demoNotice) demoNotice.style.display = 'block';
    }
    return;
  }

  try {
    const { data: { session } } = await client.auth.getSession();

    if (!session && !isLoginPage) {
      // User is not signed in -> redirect to login
      window.location.href = 'login.html';
    } else if (session && isLoginPage) {
      // User is already signed in -> redirect to dashboard
      window.location.href = 'dashboard.html';
    } else if (session) {
      // Display admin user email
      const userEmailEl = document.getElementById('adminUserEmail');
      if (userEmailEl && session.user) {
        userEmailEl.textContent = session.user.email;
      }
    }
  } catch (err) {
    console.error('Auth verification error:', err);
  }
}

/**
 * 2. Login Form Handler
 */
function initAdminLogin() {
  const form = document.getElementById('adminLoginForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value;
    const errorBox = document.getElementById('loginErrorBox');
    const submitBtn = form.querySelector('button[type="submit"]');

    if (errorBox) errorBox.style.display = 'none';

    const client = getAdminSupabase();
    if (!client) {
      if (errorBox) {
        errorBox.textContent = "Supabase credentials are not configured yet in js/config.js. Please insert your SUPABASE_URL and SUPABASE_ANON_KEY to enable real authentication.";
        errorBox.style.display = 'block';
      }
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Verifying...';

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.session) {
        window.location.href = 'dashboard.html';
      }
    } catch (err) {
      console.error('Login error:', err);
      if (errorBox) {
        errorBox.textContent = err.message || "Invalid email or password. Please verify credentials.";
        errorBox.style.display = 'block';
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  });
}

/**
 * 3. Logout Handler
 */
async function handleAdminLogout() {
  const client = getAdminSupabase();
  if (client) {
    await client.auth.signOut();
  }
  window.location.href = 'login.html';
}

/**
 * 4. Fetch All Submissions for Dashboard Metrics & Tables
 */
async function fetchTableData(tableName) {
  const client = getAdminSupabase();
  if (client) {
    const { data, error } = await client
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching ${tableName}:`, error);
      return [];
    }
    return data || [];
  } else {
    // Return mock data for preview testing
    const local = JSON.parse(localStorage.getItem(`ca_mock_${tableName}`) || '[]');
    return local;
  }
}

/**
 * 5. Update Status of a Record
 */
async function updateRecordStatus(tableName, id, newStatus) {
  const client = getAdminSupabase();
  if (client) {
    const { error } = await client
      .from(tableName)
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('Failed to update status: ' + error.message);
      return false;
    }
  } else {
    // Update in local mock
    const key = `ca_mock_${tableName}`;
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    const item = list.find(i => i.id === id);
    if (item) {
      item.status = newStatus;
      localStorage.setItem(key, JSON.stringify(list));
    }
  }

  if (typeof window.showToast === 'function') {
    window.showToast(`Status updated to "${newStatus}"`, 'success');
  }
  return true;
}

/**
 * 6. Populate Dashboard Overview
 */
async function loadDashboardMetrics() {
  const [consultations, contacts, callbacks, appointments] = await Promise.all([
    fetchTableData('consultation_requests'),
    fetchTableData('contact_messages'),
    fetchTableData('callback_requests'),
    fetchTableData('appointments')
  ]);

  const allRecords = [
    ...consultations.map(r => ({ ...r, _table: 'consultation_requests', _type: 'Consultation' })),
    ...contacts.map(r => ({ ...r, _table: 'contact_messages', _type: 'Contact' })),
    ...callbacks.map(r => ({ ...r, _table: 'callback_requests', _type: 'Callback' })),
    ...appointments.map(r => ({ ...r, _table: 'appointments', _type: 'Appointment' }))
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Compute stats
  const totalCount = allRecords.length;
  const newCount = allRecords.filter(r => r.status === 'new').length;
  const consultationCount = consultations.length;
  const appointmentCount = appointments.length;

  const statTotal = document.getElementById('statTotalEnquiries');
  const statNew = document.getElementById('statNewEnquiries');
  const statConsult = document.getElementById('statConsultations');
  const statAppt = document.getElementById('statAppointments');

  if (statTotal) statTotal.textContent = totalCount;
  if (statNew) statNew.textContent = newCount;
  if (statConsult) statConsult.textContent = consultationCount;
  if (statAppt) statAppt.textContent = appointmentCount;

  // Render recent submissions table
  renderSubmissionsTable('recentSubmissionsTable', allRecords.slice(0, 10), true);
}

/**
 * 7. Render Submissions Table
 */
function renderSubmissionsTable(tableId, records, showType = false) {
  const tbody = document.getElementById(tableId);
  if (!tbody) return;

  if (records.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:32px;color:#64748B;">No records found yet. Form submissions will appear here.</td></tr>`;
    return;
  }

  tbody.innerHTML = records.map(r => {
    const name = r.full_name || r.name || 'Anonymous';
    const contact = `<div style="font-weight:600;">${r.phone || 'N/A'}</div><div style="font-size:0.8125rem;color:#64748B;">${r.email || ''}</div>`;
    const service = r.service || r.subject || 'General Enquiry';
    const dateFormatted = new Date(r.created_at).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const statusOptions = ['new', 'contacted', 'in_progress', 'completed', 'cancelled']
      .map(s => `<option value="${s}" ${r.status === s ? 'selected' : ''}>${s.replace('_', ' ').toUpperCase()}</option>`)
      .join('');

    const tableName = r._table || document.body.getAttribute('data-active-table') || 'consultation_requests';

    return `
      <tr>
        <td style="font-weight:600;">
          ${name}
          ${showType ? `<div style="font-size:0.75rem;color:#123C69;font-weight:500;">${r._type}</div>` : ''}
        </td>
        <td>${contact}</td>
        <td>${service}</td>
        <td style="font-size:0.8125rem;color:#64748B;font-variant-numeric:tabular-nums;">${dateFormatted}</td>
        <td>
          <span class="badge-status badge-${r.status}">${r.status ? r.status.replace('_', ' ') : 'new'}</span>
        </td>
        <td>
          <select class="form-control" style="padding:4px 8px;font-size:0.8125rem;width:auto;" onchange="updateRecordStatus('${tableName}', '${r.id}', this.value)">
            ${statusOptions}
          </select>
        </td>
        <td>
          <button class="btn btn-outline btn-sm" onclick='viewRecordDetails(${JSON.stringify(r).replace(/'/g, "&#39;")})'>
            View
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * 8. Details Modal View
 */
window.viewRecordDetails = function(record) {
  const modal = document.getElementById('detailsModal');
  const content = document.getElementById('detailsModalContent');
  if (!modal || !content) return;

  const fields = Object.entries(record)
    .filter(([k]) => !k.startsWith('_'))
    .map(([k, v]) => `
      <div style="margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #E2E8F0;">
        <span style="font-size:0.75rem;text-transform:uppercase;color:#64748B;font-weight:700;">${k.replace(/_/g, ' ')}</span>
        <div style="font-size:0.9375rem;color:#1F2937;margin-top:2px;">${v || '<span style="color:#94A3B8;">None</span>'}</div>
      </div>
    `).join('');

  content.innerHTML = fields;
  modal.classList.add('open');
};

/**
 * 9. Export to CSV Helper
 */
window.exportTableToCSV = function(records, filename) {
  if (!records || records.length === 0) {
    alert("No records to export.");
    return;
  }

  const keys = Object.keys(records[0]).filter(k => !k.startsWith('_'));
  const headerRow = keys.join(',');
  const rows = records.map(r => keys.map(k => `"${(r[k] || '').toString().replace(/"/g, '""')}"`).join(','));
  const csv = [headerRow, ...rows].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
  initAdminLogin();

  const logoutBtn = document.getElementById('adminLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleAdminLogout();
    });
  }
});
