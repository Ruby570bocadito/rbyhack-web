/**
 * i18n.js — Sistema de internacionalización
 * Carga traducciones desde JSON y actualiza la página según el idioma seleccionado.
 */
const I18n = {
  currentLang: 'es',
  translations: {},

  init() {
    const saved = localStorage.getItem('lang') || 'es';
    this.setLang(saved);
    this.bindSwitchers();
  },

  async setLang(lang) {
    if (this.currentLang === lang && Object.keys(this.translations).length) return;
    this.currentLang = lang;
    localStorage.setItem('lang', lang);

    if (!this.translations[lang]) {
      try {
        const resp = await fetch(`lang/${lang}.json`);
        this.translations[lang] = await resp.json();
      } catch (e) {
        console.error('Failed to load language:', lang, e);
        return;
      }
    }

    document.documentElement.lang = lang;
    this.updateUI();
    this.updateSwitchers();
  },

  updateUI() {
    const strings = this.translations[this.currentLang];
    if (!strings) return;

    // Update <title>
    document.title = strings.site_title;

    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (strings[key] !== undefined) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = strings[key];
        } else if (el.tagName === 'OPTION' && el.value === '' && strings[key]) {
          el.textContent = strings[key];
        } else {
          el.textContent = strings[key];
        }
      }
    });

    // Update elements using data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (strings[key] !== undefined) {
        el.placeholder = strings[key];
      }
    });

    // Update select options (service options)
    document.querySelectorAll('option[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (strings[key] !== undefined) {
        el.textContent = strings[key];
      }
    });
  },

  updateSwitchers() {
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === this.currentLang);
    });
  },

  bindSwitchers() {
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setLang(btn.getAttribute('data-lang'));
      });
    });
  },

  t(key) {
    return this.translations[this.currentLang]?.[key] || key;
  }
};
