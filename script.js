// ============ LANGUAGE TOGGLE ============
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

// ============ CONTACT FORM ============
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
