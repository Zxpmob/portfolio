const configWrap = document.getElementById('configWrap');
const loginWrap = document.getElementById('loginWrap');
const dashWrap = document.getElementById('dashWrap');
const htmlRoot = document.getElementById('htmlRoot');

let currentLang = 'fa';
function applyLanguage(lang) {
  currentLang = lang;
  htmlRoot.setAttribute('lang', lang);
  htmlRoot.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
  document.querySelectorAll('[data-fa][data-en]').forEach(el => {
    el.textContent = el.getAttribute('data-' + lang);
  });
  document.querySelectorAll('[data-fa-ph][data-en-ph]').forEach(el => {
    el.setAttribute('placeholder', el.getAttribute('data-' + lang + '-ph'));
  });
  document.querySelector('.lang-fa').classList.toggle('active', lang === 'fa');
  document.querySelector('.lang-en').classList.toggle('active', lang === 'en');
}
document.getElementById('langToggle').addEventListener('click', () => {
  applyLanguage(currentLang === 'fa' ? 'en' : 'fa');
});

const isConfigured = typeof SUPABASE_URL !== 'undefined' &&
  SUPABASE_URL && !SUPABASE_URL.includes('YOUR-PROJECT');

if (!isConfigured) {
  configWrap.style.display = 'flex';
} else {
  const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  let editingProjectId = null;
  let projectsCache = [];
  let activeConvoId = null;
  let adminChatChannel = null;

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleString('fa-IR', { dateStyle: 'medium', timeStyle: 'short' });
  }

  function showLogin() {
    dashWrap.style.display = 'none';
    loginWrap.style.display = 'flex';
  }

  async function showDashboard() {
    loginWrap.style.display = 'none';
    dashWrap.style.display = 'block';
    await Promise.all([loadMessages(), loadProjects(), loadStats(), loadConversations()]);
  }

  // ---------- LOGIN ----------
  document.getElementById('loginBtn').addEventListener('click', attemptLogin);
  document.getElementById('loginPassword').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') attemptLogin();
  });

  async function attemptLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    errorEl.textContent = '';

    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      errorEl.textContent = currentLang === 'fa' ? 'ورود ناموفق بود — ایمیل یا رمز اشتباهه.' : 'Login failed — wrong email or password.';
      return;
    }
    showDashboard();
  }

  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await sb.auth.signOut();
    showLogin();
  });

  sb.auth.getSession().then(({ data }) => {
    if (data.session) showDashboard();
    else showLogin();
  });

  // ---------- TABS ----------
  document.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
    });
  });

  document.getElementById('refreshBtn').addEventListener('click', () => {
    loadMessages(); loadProjects(); loadStats(); loadConversations();
  });

  // ---------- MESSAGES ----------
  async function loadMessages() {
    const listEl = document.getElementById('msgList');
    listEl.innerHTML = '<div class="loading">...</div>';

    const { data, error } = await sb.from('messages').select('*').order('created_at', { ascending: false });

    if (error) {
      listEl.innerHTML = `<div class="empty-state">${currentLang === 'fa' ? 'خطا در دریافت پیام‌ها' : 'Error loading messages'}: ${error.message}</div>`;
      return;
    }
    if (!data || data.length === 0) {
      listEl.innerHTML = `<div class="empty-state">${currentLang === 'fa' ? 'هنوز پیامی ثبت نشده.' : 'No messages yet.'}</div>`;
      return;
    }
    listEl.innerHTML = data.map(m => `
      <div class="msg-card">
        <div class="msg-top">
          <span class="msg-name">${escapeHtml(m.name)}</span>
          <span class="msg-email">${escapeHtml(m.email)}</span>
          <span class="msg-date">${formatDate(m.created_at)}</span>
        </div>
        <div class="msg-body">${escapeHtml(m.message)}</div>
      </div>
    `).join('');
  }

  // ---------- PROJECTS ----------
  async function loadProjects() {
    const listEl = document.getElementById('projList');
    listEl.innerHTML = '<div class="loading">...</div>';

    const { data, error } = await sb.from('projects').select('*').order('created_at', { ascending: false });

    if (error) {
      listEl.innerHTML = `<div class="empty-state">${currentLang === 'fa' ? 'خطا در دریافت پروژه‌ها' : 'Error loading projects'}: ${error.message}</div>`;
      return;
    }
    projectsCache = data || [];
    if (projectsCache.length === 0) {
      listEl.innerHTML = `<div class="empty-state">${currentLang === 'fa' ? 'هنوز پروژه‌ای اضافه نشده — سایت به‌جاش نمونه‌های پیش‌فرض رو نشون می‌ده. با دکمه‌ی + یکی اضافه کن.' : 'No projects added yet — the site shows default samples instead. Use the + button to add one.'}</div>`;
      return;
    }
    listEl.innerHTML = projectsCache.map(p => `
      <div class="proj-card" data-id="${p.id}">
        <span class="proj-title">${escapeHtml(p.title)}</span>
        <div class="proj-desc">${escapeHtml(p.description || '')}</div>
        <div class="proj-tags">${(p.tags || '').split(',').filter(Boolean).map(t => `<span>${escapeHtml(t.trim())}</span>`).join('')}</div>
        <div class="proj-card-menu">
          <button class="btn-edit" data-action="edit" data-id="${p.id}">${currentLang === 'fa' ? 'ویرایش' : 'Edit'}</button>
          <button class="btn-delete" data-action="delete" data-id="${p.id}">${currentLang === 'fa' ? 'حذف' : 'Delete'}</button>
          <button class="btn-close-menu" data-action="close">${currentLang === 'fa' ? 'بستن' : 'Close'}</button>
        </div>
      </div>
    `).join('');

    listEl.querySelectorAll('.proj-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.proj-card-menu')) return; // clicks inside the menu handled separately
        listEl.querySelectorAll('.proj-card').forEach(c => {
          if (c !== card) { c.classList.remove('menu-open'); c.querySelector('.proj-card-menu').classList.remove('open'); }
        });
        card.classList.toggle('menu-open');
        card.querySelector('.proj-card-menu').classList.toggle('open');
      });
    });

    listEl.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', (e) => { e.stopPropagation(); startEditProject(btn.dataset.id); });
    });
    listEl.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!confirm(currentLang === 'fa' ? 'این پروژه حذف بشه؟' : 'Delete this project?')) return;
        await sb.from('projects').delete().eq('id', btn.dataset.id);
        loadProjects();
      });
    });
    listEl.querySelectorAll('[data-action="close"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.proj-card');
        card.classList.remove('menu-open');
        card.querySelector('.proj-card-menu').classList.remove('open');
      });
    });
  }

  // ---------- PROJECT MODAL ----------
  const projModalOverlay = document.getElementById('projModalOverlay');
  const deleteProjBtn = document.getElementById('deleteProjBtn');

  function openProjModal() {
    projModalOverlay.classList.add('open');
  }
  function closeProjModal() {
    projModalOverlay.classList.remove('open');
    resetProjectForm();
  }

  document.getElementById('openAddProjBtn').addEventListener('click', () => {
    resetProjectForm();
    openProjModal();
  });
  document.getElementById('projModalClose').addEventListener('click', closeProjModal);
  projModalOverlay.addEventListener('click', (e) => {
    if (e.target === projModalOverlay) closeProjModal();
  });

  function startEditProject(id) {
    const p = projectsCache.find(x => String(x.id) === String(id));
    if (!p) return;
    document.getElementById('projTitle').value = p.title || '';
    document.getElementById('projDesc').value = p.description || '';
    document.getElementById('projTags').value = p.tags || '';
    document.getElementById('projLink').value = p.link || '';
    editingProjectId = p.id;
    document.getElementById('projFormTitle').textContent = currentLang === 'fa' ? 'ویرایش پروژه' : 'Edit project';
    document.getElementById('addProjBtn').textContent = currentLang === 'fa' ? 'ثبت تغییرات' : 'Save changes';
    deleteProjBtn.style.display = 'block';
    openProjModal();
  }

  function resetProjectForm() {
    editingProjectId = null;
    document.getElementById('projTitle').value = '';
    document.getElementById('projDesc').value = '';
    document.getElementById('projTags').value = '';
    document.getElementById('projLink').value = '';
    document.getElementById('projFormTitle').textContent = currentLang === 'fa' ? 'افزودن پروژه‌ی جدید' : 'Add a new project';
    document.getElementById('addProjBtn').textContent = currentLang === 'fa' ? 'افزودن پروژه' : 'Add project';
    document.getElementById('projFormError').textContent = '';
    deleteProjBtn.style.display = 'none';
  }

  document.getElementById('addProjBtn').addEventListener('click', async () => {
    const errorEl = document.getElementById('projFormError');
    errorEl.textContent = '';

    const title = document.getElementById('projTitle').value.trim();
    const description = document.getElementById('projDesc').value.trim();
    const tags = document.getElementById('projTags').value.trim();
    const link = document.getElementById('projLink').value.trim();

    if (!title) {
      errorEl.textContent = currentLang === 'fa' ? 'عنوان پروژه رو وارد کن.' : 'Enter a project title.';
      return;
    }

    let error;
    if (editingProjectId) {
      ({ error } = await sb.from('projects').update({ title, description, tags, link }).eq('id', editingProjectId));
    } else {
      ({ error } = await sb.from('projects').insert({ title, description, tags, link }));
    }

    if (error) {
      errorEl.textContent = (currentLang === 'fa' ? 'خطا: ' : 'Error: ') + error.message;
      return;
    }

    closeProjModal();
    loadProjects();
  });

  deleteProjBtn.addEventListener('click', async () => {
    if (!editingProjectId) return;
    if (!confirm(currentLang === 'fa' ? 'این پروژه حذف بشه؟' : 'Delete this project?')) return;
    const { error } = await sb.from('projects').delete().eq('id', editingProjectId);
    if (error) {
      document.getElementById('projFormError').textContent = (currentLang === 'fa' ? 'خطا: ' : 'Error: ') + error.message;
      return;
    }
    closeProjModal();
    loadProjects();
  });

  // ---------- STATS ----------
  async function getCount(table, sinceIso) {
    let query = sb.from(table).select('*', { count: 'exact', head: true });
    if (sinceIso) query = query.gte('created_at', sinceIso);
    const { count, error } = await query;
    if (error) throw error;
    return count ?? 0;
  }

  async function loadStats() {
    const gridEl = document.getElementById('statsGrid');
    gridEl.innerHTML = '<div class="loading">...</div>';

    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const labels = currentLang === 'fa'
      ? ['کل بازدیدها', 'بازدید ۲۴ ساعت اخیر', 'کل پیام‌ها']
      : ['Total views', 'Views (last 24h)', 'Total messages'];
    const icons = [
      '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>',
      '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
      '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5h16v14H4z"/><path d="M4 6l8 7 8-7"/></svg>'
    ];

    const results = await Promise.allSettled([
      getCount('page_views'),
      getCount('page_views', since24h),
      getCount('messages')
    ]);

    const boxes = results.map((r, i) => {
      const iconHtml = `<div class="stat-icon">${icons[i]}</div>`;
      if (r.status === 'fulfilled') {
        return `<div class="stat-box">${iconHtml}<span class="num">${r.value}</span><span class="label">${labels[i]}</span></div>`;
      }
      const errMsg = (r.reason && r.reason.message) || (currentLang === 'fa' ? 'خطا' : 'error');
      return `<div class="stat-box">${iconHtml}<span class="num">—</span><span class="label">${labels[i]}</span><span class="label" style="color:#ff8a8a;display:block;margin-top:4px;">${errMsg}</span></div>`;
    });

    gridEl.innerHTML = boxes.join('');
  }

  // ---------- CHAT ----------
  let convosCache = [];

  function statusLabel(status) {
    const map = currentLang === 'fa'
      ? { pending: 'در انتظار', approved: 'تایید شده', rejected: 'رد شده' }
      : { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' };
    return map[status] || status;
  }

  async function loadConversations() {
    const listEl = document.getElementById('chatConvoList');
    listEl.innerHTML = '<div class="loading">...</div>';

    const { data, error } = await sb.from('conversations').select('*').order('last_message_at', { ascending: false });

    if (error) {
      listEl.innerHTML = `<div class="empty-state">${error.message}</div>`;
      return;
    }
    convosCache = data || [];
    if (convosCache.length === 0) {
      listEl.innerHTML = `<div class="empty-state">${currentLang === 'fa' ? 'هنوز مکالمه‌ای نیست.' : 'No conversations yet.'}</div>`;
      return;
    }
    listEl.innerHTML = convosCache.map(c => `
      <button class="convo-item status-${c.status}" data-id="${c.id}">
        <span class="convo-name">${escapeHtml(c.customer_name || 'User')}</span>
        <span class="convo-status-badge status-${c.status}">${statusLabel(c.status)}</span>
      </button>
    `).join('');

    listEl.querySelectorAll('.convo-item').forEach(btn => {
      btn.addEventListener('click', () => openConversation(btn.dataset.id));
    });
  }

  async function openConversation(id) {
    activeConvoId = id;
    const convo = convosCache.find(c => String(c.id) === String(id));
    if (!convo) return;

    document.querySelectorAll('.convo-item').forEach(b => b.classList.toggle('active', b.dataset.id === String(id)));

    const threadEl = document.getElementById('chatAdminThread');

    if (convo.status === 'pending' || convo.status === 'rejected') {
      const actionLabel = convo.status === 'pending'
        ? (currentLang === 'fa' ? 'تایید کن' : 'Approve')
        : (currentLang === 'fa' ? 'تایید مجدد' : 'Approve anyway');
      threadEl.innerHTML = `
        <div class="chat-thread-header">${escapeHtml(convo.customer_name || 'User')} <span class="convo-status-badge status-${convo.status}">${statusLabel(convo.status)}</span></div>
        <div class="request-preview">
          <p class="request-label">${currentLang === 'fa' ? 'متن درخواست:' : 'Request message:'}</p>
          <p class="request-text">${escapeHtml(convo.initial_message || '—')}</p>
        </div>
        <div class="approve-actions">
          <button class="btn-approve" id="approveBtn">${actionLabel}</button>
          ${convo.status === 'pending' ? `<button class="btn-reject" id="rejectBtn">${currentLang === 'fa' ? 'رد کن' : 'Reject'}</button>` : ''}
        </div>
      `;
      document.getElementById('approveBtn').addEventListener('click', () => setConversationStatus(id, 'approved'));
      const rejectBtn = document.getElementById('rejectBtn');
      if (rejectBtn) rejectBtn.addEventListener('click', () => setConversationStatus(id, 'rejected'));
      return;
    }

    // approved -> full chat thread
    threadEl.innerHTML = `
      <div class="chat-thread-header">${escapeHtml(convo.customer_name || 'User')} <span class="convo-status-badge status-approved">${statusLabel('approved')}</span></div>
      <div class="chat-messages" id="adminChatMessages"></div>
      <form class="chat-input-row" id="adminChatForm">
        <input type="text" id="adminChatInput" placeholder="${currentLang === 'fa' ? 'پاسخ بده...' : 'Reply...'}">
        <button type="submit">${currentLang === 'fa' ? 'ارسال' : 'Send'}</button>
      </form>
    `;

    await loadAdminMessages();

    document.getElementById('adminChatForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.getElementById('adminChatInput');
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      const { data: inserted } = await sb.from('chat_messages')
        .insert({ conversation_id: activeConvoId, sender: 'admin', message: text })
        .select().single();
      if (inserted) appendAdminMessage(inserted);
      sb.from('conversations').update({ last_message_at: new Date().toISOString() }).eq('id', activeConvoId).then(() => {});
    });

    subscribeAdminRealtime();
  }

  async function setConversationStatus(id, status) {
    const { error } = await sb.from('conversations').update({ status }).eq('id', id);
    if (error) { alert((currentLang === 'fa' ? 'خطا: ' : 'Error: ') + error.message); return; }
    await loadConversations();
    openConversation(id);
  }

  async function loadAdminMessages() {
    const { data } = await sb.from('chat_messages').select('*').eq('conversation_id', activeConvoId).order('created_at', { ascending: true });
    renderAdminMessages(data || []);
  }

  function renderAdminMessages(messages) {
    const el = document.getElementById('adminChatMessages');
    if (!el) return;
    el.innerHTML = messages.map(m => `
      <div class="chat-bubble ${m.sender === 'admin' ? 'chat-bubble-me' : 'chat-bubble-them'}"><p>${escapeHtml(m.message)}</p></div>
    `).join('');
    el.scrollTop = el.scrollHeight;
  }

  function appendAdminMessage(m) {
    const el = document.getElementById('adminChatMessages');
    if (!el) return;
    const div = document.createElement('div');
    div.className = 'chat-bubble ' + (m.sender === 'admin' ? 'chat-bubble-me' : 'chat-bubble-them');
    div.innerHTML = `<p>${escapeHtml(m.message)}</p>`;
    el.appendChild(div);
    el.scrollTop = el.scrollHeight;
  }

  function subscribeAdminRealtime() {
    if (adminChatChannel) sb.removeChannel(adminChatChannel);
    adminChatChannel = sb.channel('admin-chat-' + activeConvoId)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'chat_messages',
        filter: `conversation_id=eq.${activeConvoId}`
      }, (payload) => {
        if (payload.new.sender !== 'admin') appendAdminMessage(payload.new);
      })
      .subscribe();
  }

  // ---------- CHANGE PASSWORD ----------
  document.getElementById('changePwBtn').addEventListener('click', async () => {
    const errorEl = document.getElementById('pwError');
    const successEl = document.getElementById('pwSuccess');
    errorEl.textContent = '';
    successEl.textContent = '';

    const newPw = document.getElementById('newPassword').value;
    const confirmPw = document.getElementById('confirmPassword').value;

    if (newPw.length < 6) {
      errorEl.textContent = currentLang === 'fa' ? 'رمز عبور باید حداقل ۶ کاراکتر باشه.' : 'Password must be at least 6 characters.';
      return;
    }
    if (newPw !== confirmPw) {
      errorEl.textContent = currentLang === 'fa' ? 'تکرار رمز با رمز جدید یکی نیست.' : "Passwords don't match.";
      return;
    }

    const { error } = await sb.auth.updateUser({ password: newPw });
    if (error) {
      errorEl.textContent = (currentLang === 'fa' ? 'خطا: ' : 'Error: ') + error.message;
      return;
    }
    successEl.textContent = currentLang === 'fa' ? 'رمز عبور با موفقیت تغییر کرد.' : 'Password updated successfully.';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
  });
}
