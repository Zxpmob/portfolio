// ============ CODE RAIN BACKGROUND ============
(function initCodeRain() {
  const canvas = document.getElementById('codeRain');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const chars = '{}[]()<>/;:=+-*&|!?01#$%^~fn=>letconstif'.split('');
  const fontSize = 15;
  let columns, drops;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns).fill(0).map(() => Math.random() * -50);
  }
  resize();
  window.addEventListener('resize', resize);

  // Paint a solid dark base immediately so there's no flash before animation starts.
  ctx.fillStyle = '#060613';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (reduceMotion) return; // static dark background only, no motion

  function draw() {
    ctx.fillStyle = 'rgba(6, 6, 19, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      const gradient = ctx.createLinearGradient(0, y - fontSize, 0, y);
      gradient.addColorStop(0, 'rgba(167, 139, 250, 0)');
      gradient.addColorStop(1, 'rgba(124, 108, 246, 0.85)');
      ctx.fillStyle = gradient;
      ctx.fillText(char, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += 0.12 + Math.random() * 0.1;
    }

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
const translations = {
  fa: { dir: 'rtl', lang: 'fa' },
  en: { dir: 'ltr', lang: 'en' }
};

let currentLang = 'fa';
const htmlRoot = document.getElementById('html-root');
const langToggle = document.getElementById('langToggle');
const langFaTag = document.querySelector('.lang-fa');
const langEnTag = document.querySelector('.lang-en');

function applyLanguage(lang) {
  currentLang = lang;
  htmlRoot.setAttribute('lang', translations[lang].lang);
  htmlRoot.setAttribute('dir', translations[lang].dir);

  document.querySelectorAll('[data-fa][data-en]').forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });

  document.querySelectorAll('[data-fa-ph][data-en-ph]').forEach(el => {
    el.setAttribute('placeholder', el.getAttribute(`data-${lang}-ph`));
  });

  const statusEl = document.getElementById('formStatus');
  if (statusEl && statusEl.dataset.fa && statusEl.dataset.en) {
    statusEl.textContent = lang === 'fa' ? statusEl.dataset.fa : statusEl.dataset.en;
  }

  langFaTag.classList.toggle('active', lang === 'fa');
  langEnTag.classList.toggle('active', lang === 'en');
}

langToggle.addEventListener('click', () => {
  applyLanguage(currentLang === 'fa' ? 'en' : 'fa');
});

// ============ MOBILE NAV ============
const navBurger = document.getElementById('navBurger');
const mainNav = document.getElementById('mainNav');
navBurger.addEventListener('click', () => {
  mainNav.classList.toggle('nav-open');
  navBurger.classList.toggle('active');
});
document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('nav-open');
    navBurger.classList.remove('active');
  });
});

// ============ CURSOR GLOW ============
const cursorGlow = document.getElementById('cursorGlow');
if (window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
    cursorGlow.classList.add('active');
  });
  document.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
}

// ============ SOCIAL / CONTACT BUTTONS ============
// data-action="link" -> opens data-href in a new tab
// data-action="copy" -> copies data-value to clipboard
// Either way, a tooltip slides up above the button to confirm the action.
function wireActionButton(el) {
  const action = el.getAttribute('data-action');
  const tipEl = el.querySelector('.social-tip');
  const originalTipFa = tipEl ? tipEl.getAttribute('data-fa') : null;
  const originalTipEn = tipEl ? tipEl.getAttribute('data-en') : null;

  el.addEventListener('click', async (e) => {
    e.preventDefault();

    if (action === 'link') {
      window.open(el.getAttribute('data-href'), '_blank', 'noopener');
    } else if (action === 'copy') {
      const value = el.getAttribute('data-value');
      try {
        await navigator.clipboard.writeText(value);
        if (tipEl) {
          tipEl.textContent = currentLang === 'fa' ? 'کپی شد!' : 'Copied!';
        }
      } catch (err) {
        if (tipEl) {
          tipEl.textContent = value;
        }
      }
    }

    el.classList.add('tip-active');
    clearTimeout(el._tipTimeout);
    el._tipTimeout = setTimeout(() => {
      el.classList.remove('tip-active');
      setTimeout(() => {
        if (tipEl && originalTipFa && originalTipEn) {
          tipEl.textContent = currentLang === 'fa' ? originalTipFa : originalTipEn;
        }
      }, 300);
    }, 1800);
  });
}

document.querySelectorAll('[data-action]').forEach(wireActionButton);

// ============ SCROLL REVEAL ============
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ============ ANIMATED COUNTERS ============
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      let current = 0;
      const duration = 1000;
      const stepTime = 16;
      const steps = duration / stepTime;
      const increment = target / steps;

      const tick = () => {
        current += increment;
        if (current >= target) {
          el.textContent = target;
        } else {
          el.textContent = Math.floor(current);
          requestAnimationFrame(() => setTimeout(tick, stepTime));
        }
      };
      tick();
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// ============ HEADER SHADOW ON SCROLL ============
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 20 ? '0 10px 30px -20px rgba(0,0,0,.6)' : 'none';
});

// ============ NAV ACTIVE LINK ON SCROLL ============
const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
const sections = Array.from(navLinks).map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = '#' + entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === id);
      });
    }
  });
}, { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' });

sections.forEach(sec => navObserver.observe(sec));

// ============ SUPABASE CLIENT ============
const isSupabaseConfigured = typeof SUPABASE_URL !== 'undefined' &&
  SUPABASE_URL && !SUPABASE_URL.includes('YOUR-PROJECT') &&
  typeof supabase !== 'undefined';
let sbClient = null;
if (isSupabaseConfigured) {
  try {
    sbClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    console.error('Supabase failed to initialize:', err);
  }
}

// ============ AUTH: MODAL OPEN/CLOSE + TABS ============
const authBtn = document.getElementById('authBtn');
const authModalOverlay = document.getElementById('authModalOverlay');
const authModalClose = document.getElementById('authModalClose');
const authDropdown = document.getElementById('authDropdown');
const authDropdownName = document.getElementById('authDropdownName');
const authBtnIconGuest = document.getElementById('authBtnIconGuest');
const authBtnAvatar = document.getElementById('authBtnAvatar');
const logoutBtn = document.getElementById('logoutBtn');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

let isLoggedIn = false;

function openAuthModal() {
  authModalOverlay.classList.add('open');
}
function closeAuthModal() {
  authModalOverlay.classList.remove('open');
}

if (authBtn) {
  authBtn.addEventListener('click', () => {
    if (isLoggedIn) {
      authDropdown.classList.toggle('open');
    } else {
      openAuthModal();
    }
  });
}
if (authModalClose) authModalClose.addEventListener('click', closeAuthModal);
if (authModalOverlay) {
  authModalOverlay.addEventListener('click', (e) => {
    if (e.target === authModalOverlay) closeAuthModal();
  });
}
document.addEventListener('click', (e) => {
  if (authDropdown && !authDropdown.contains(e.target) && e.target !== authBtn && !authBtn.contains(e.target)) {
    authDropdown.classList.remove('open');
  }
});

document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const isLogin = tab.dataset.tab === 'login';
    loginForm.style.display = isLogin ? 'flex' : 'none';
    signupForm.style.display = isLogin ? 'none' : 'flex';
  });
});

// ============ AUTH: UI STATE ============
function updateAuthUI(user) {
  isLoggedIn = !!user;
  if (isLoggedIn) {
    authBtnIconGuest.style.display = 'none';
    authBtnAvatar.style.display = 'flex';
    const meta = user.user_metadata || {};
    const fullName = [meta.first_name, meta.last_name].filter(Boolean).join(' ') || user.email;
    authDropdownName.textContent = fullName;
  } else {
    authBtnIconGuest.style.display = 'block';
    authBtnAvatar.style.display = 'none';
    authDropdown.classList.remove('open');
  }
}

if (sbClient) {
  sbClient.auth.getSession().then(({ data }) => {
    updateAuthUI(data.session ? data.session.user : null);
  });
  sbClient.auth.onAuthStateChange((_event, session) => {
    updateAuthUI(session ? session.user : null);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    if (sbClient) await sbClient.auth.signOut();
    authDropdown.classList.remove('open');
  });
}

// ============ AUTH: LOGIN FORM ============
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('loginFormError');
    errorEl.textContent = '';

    if (!sbClient) {
      errorEl.textContent = currentLang === 'fa' ? 'سیستم ورود هنوز تنظیم نشده.' : 'Login system not configured yet.';
      return;
    }

    const email = loginForm.querySelector('[name="email"]').value.trim();
    const password = loginForm.querySelector('[name="password"]').value;

    const { error } = await sbClient.auth.signInWithPassword({ email, password });
    if (error) {
      errorEl.textContent = currentLang === 'fa' ? 'ورود ناموفق بود — ایمیل یا رمز اشتباهه.' : 'Login failed — wrong email or password.';
      return;
    }
    closeAuthModal();
    loginForm.reset();
  });
}

// ============ AUTH: SIGNUP FORM ============
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('signupFormError');
    const successEl = document.getElementById('signupFormSuccess');
    errorEl.textContent = '';
    successEl.textContent = '';

    if (!sbClient) {
      errorEl.textContent = currentLang === 'fa' ? 'سیستم ثبت‌نام هنوز تنظیم نشده.' : 'Signup system not configured yet.';
      return;
    }

    const firstName = signupForm.querySelector('[name="firstName"]').value.trim();
    const lastName = signupForm.querySelector('[name="lastName"]').value.trim();
    const phone = signupForm.querySelector('[name="phone"]').value.trim();
    const nationalId = signupForm.querySelector('[name="nationalId"]').value.trim();
    const email = signupForm.querySelector('[name="email"]').value.trim();
    const password = signupForm.querySelector('[name="password"]').value;

    const { data, error } = await sbClient.auth.signUp({
      email, password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          national_id: nationalId
        }
      }
    });

    if (error) {
      errorEl.textContent = currentLang === 'fa' ? ('ثبت‌نام ناموفق: ' + error.message) : ('Signup failed: ' + error.message);
      return;
    }

    if (data.session) {
      closeAuthModal();
      signupForm.reset();
    } else {
      successEl.textContent = currentLang === 'fa'
        ? 'ثبت‌نام شد! ایمیلت رو برای تایید چک کن.'
        : 'Signed up! Check your email to confirm your account.';
      signupForm.reset();
    }
  });
}

// ============ DYNAMIC PROJECTS FROM SUPABASE ============
async function loadDynamicProjects() {
  if (!sbClient) return;
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  const { data, error } = await sbClient
    .from('projects')
    .select('*')
    .order('created_at', { ascending: true });

  if (error || !data || data.length === 0) return; // keep fallback sample cards

  grid.innerHTML = data.map((p, i) => `
    <article class="project-card reveal in-view">
      <div class="project-glow"></div>
      <div class="project-index">${String(i + 1).padStart(2, '0')}</div>
      <h3 class="project-title">${escapeHtmlGlobal(p.title)}</h3>
      <p class="project-desc">${escapeHtmlGlobal(p.description || '')}</p>
      <div class="project-tags">${(p.tags || '').split(',').filter(Boolean).map(t => `<span>${escapeHtmlGlobal(t.trim())}</span>`).join('')}</div>
      ${p.link ? `<a href="${escapeHtmlGlobal(p.link)}" target="_blank" rel="noopener" class="project-link"><span>${currentLang === 'fa' ? 'مشاهده' : 'View'}</span> →</a>` : ''}
    </article>
  `).join('');
}

function escapeHtmlGlobal(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

loadDynamicProjects();

// ============ PAGE VIEW TRACKING ============
if (sbClient) {
  sbClient.from('page_views').insert({ page: window.location.pathname })
    .then(({ error }) => {
      if (error) console.error('Page view logging failed:', error.message);
    });
} else {
  console.warn('Page view not logged: Supabase client not initialized.');
}


// Sends the message to your Supabase "messages" table (see supabase-config.js).
// If Supabase isn't configured yet, or the request fails, falls back to mailto.
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const submitBtn = contactForm.querySelector('.form-submit');
  const submitLabel = submitBtn.querySelector('span[data-fa]');
  const statusEl = document.getElementById('formStatus');

  function setStatus(fa, en, isError) {
    if (!statusEl) return;
    statusEl.textContent = currentLang === 'fa' ? fa : en;
    statusEl.dataset.fa = fa;
    statusEl.dataset.en = en;
    statusEl.classList.toggle('form-status-error', !!isError);
    statusEl.classList.add('visible');
  }

  function mailtoFallback(name, email, message) {
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:pczxpmob@gmail.com?subject=${subject}&body=${body}`;
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('[name="name"]').value.trim();
    const email = contactForm.querySelector('[name="email"]').value.trim();
    const message = contactForm.querySelector('[name="message"]').value.trim();

    const configured = typeof SUPABASE_URL !== 'undefined' &&
      SUPABASE_URL && !SUPABASE_URL.includes('YOUR-PROJECT');

    if (!configured) {
      mailtoFallback(name, email, message);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.style.opacity = '.6';

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ name, email, message })
      });

      if (!res.ok) throw new Error('insert failed');

      setStatus('پیام شما ثبت شد، به‌زودی جواب می‌دم!', 'Your message was sent — I\'ll get back to you soon!', false);
      contactForm.reset();
    } catch (err) {
      setStatus('ارسال ناموفق بود — برنامه‌ی ایمیل باز می‌شود.', 'Sending failed — opening your email app instead.', true);
      mailtoFallback(name, email, message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '';
    }
  });
}
