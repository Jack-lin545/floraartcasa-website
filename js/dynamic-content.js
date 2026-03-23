// ============================================
// Dynamic Content Loader for Flora Art Casa
// WITH INLINE EDITING
// ============================================

const DATA_FILES = {
  announcement: 'data/announcement.json',
  navigation: 'data/navigation.json',
  hero: 'data/hero.json',
  categories: 'data/categories.json',
  products: 'data/products.json',
  whyChoose: 'data/why-choose.json',
  collections: 'data/collections.json',
  settings: 'data/settings.json'
};

const dataCache = {};
let editMode = false;

document.addEventListener('DOMContentLoaded', function() {
  loadAllData().then(() => {
    initInlineEditing();
  });
});

async function loadAllData() {
  const promises = Object.entries(DATA_FILES).map(async ([key, url]) => {
    try {
      const response = await fetch(url);
      if (response.ok) dataCache[key] = await response.json();
    } catch (e) { dataCache[key] = null; }
  });
  await Promise.all(promises);
  renderAll();
}

function renderAll() {
  renderAnnouncement();
  renderNavigation();
  renderHero();
  renderCategories();
  renderWhyChoose();
  renderCollections();
  renderFooter();
}

function renderAnnouncement() {
  const data = dataCache.announcement;
  if (!data) return;
  const bar = document.getElementById('announcement-bar');
  if (!bar) return;
  if (data.enabled === false) {
    bar.style.display = 'none';
    document.documentElement.style.setProperty('--announce-h', '0px');
    return;
  }
  const text = data.text || '';
  const linkText = data.link ? data.link.text : '';
  const linkUrl = data.link ? data.link.url : '#';
  bar.setAttribute('data-cms-edit', 'announcement');
  bar.innerHTML = '<span>' + text + (linkText ? '<a href="' + linkUrl + '">' + linkText + '</a>' : '') + '</span>' +
    '<button class="announce-close" onclick="this.parentElement.style.display=\'none\';document.documentElement.style.setProperty(\'--announce-h\',\'0px\');">&#10005;</button>';
}

function renderNavigation() {
  const data = dataCache.navigation;
  if (!data) return;
  const logoMark = document.querySelector('.header-logo .logo-mark');
  const logoText = document.querySelector('.header-logo span');
  if (data.logo && logoMark) {
    logoMark.setAttribute('data-cms-edit', 'navigation');
    logoMark.textContent = data.logo.icon || 'F';
  }
  if (data.logo && logoText) {
    logoText.setAttribute('data-cms-edit', 'navigation');
    logoText.textContent = data.logo.text || 'Flora Art Casa';
  }
}

function renderHero() {
  const data = dataCache.hero;
  if (!data) return;
  const badge = document.querySelector('.hero-badge');
  const title = document.querySelector('.hero h1');
  const desc = document.querySelector('.hero p');
  if (data.badge && badge) {
    badge.setAttribute('data-cms-edit', 'hero');
    badge.textContent = data.badge;
  }
  if (data.title && title) {
    title.setAttribute('data-cms-edit', 'hero');
    title.innerHTML = data.title;
  }
  if (data.description && desc) {
    desc.setAttribute('data-cms-edit', 'hero');
    desc.textContent = data.description;
  }
}

function renderCategories() {
  const data = dataCache.categories;
  if (!data) return;
  const sections = document.querySelectorAll('.section');
  let catSection = null;
  sections.forEach(sec => { if (sec.querySelector('.categories-grid')) catSection = sec; });
  if (!catSection) return;
  const label = catSection.querySelector('.section-label');
  const title = catSection.querySelector('.section-title');
  const desc = catSection.querySelector('.section-desc');
  if (data.label && label) {
    label.setAttribute('data-cms-edit', 'categories');
    label.textContent = data.label;
  }
  if (data.title && title) {
    title.setAttribute('data-cms-edit', 'categories');
    title.textContent = data.title;
  }
  if (data.description && desc) {
    desc.setAttribute('data-cms-edit', 'categories');
    desc.textContent = data.description;
  }
}

function renderWhyChoose() {
  const data = dataCache.whyChoose;
  if (!data) return;
  const whySection = document.querySelector('.why-section');
  if (!whySection) return;
  const label = whySection.querySelector('.section-label');
  const title = whySection.querySelector('.section-title');
  if (data.label && label) {
    label.setAttribute('data-cms-edit', 'why-choose');
    label.textContent = data.label;
  }
  if (data.title && title) {
    title.setAttribute('data-cms-edit', 'why-choose');
    title.textContent = data.title;
  }
}

function renderCollections() {
  const data = dataCache.collections;
  if (!data) return;
  const sections = document.querySelectorAll('.section');
  let collSection = null;
  sections.forEach(sec => { if (sec.querySelector('.collections-row')) collSection = sec; });
  if (!collSection) return;
  const label = collSection.querySelector('.section-label');
  const title = collSection.querySelector('.section-title');
  const desc = collSection.querySelector('.section-desc');
  if (data.label && label) {
    label.setAttribute('data-cms-edit', 'collections');
    label.textContent = data.label;
  }
  if (data.title && title) {
    title.setAttribute('data-cms-edit', 'collections');
    title.textContent = data.title;
  }
  if (data.description && desc) {
    desc.setAttribute('data-cms-edit', 'collections');
    desc.textContent = data.description;
  }
}

function renderFooter() {
  const settings = dataCache.settings;
  if (!settings) return;
  const logo = document.querySelector('.footer-brand .footer-logo');
  if (logo && settings.company_name) {
    logo.setAttribute('data-cms-edit', 'settings');
    logo.textContent = settings.company_name;
  }
}

function initInlineEditing() {
  const editBtn = document.createElement('button');
  editBtn.id = 'cms-edit-toggle';
  editBtn.innerHTML = '✏️ Edit';
  editBtn.style.cssText = 'position:fixed;top:80px;right:20px;z-index:9999;padding:10px 20px;background:#2844A8;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;font-weight:600;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
  document.body.appendChild(editBtn);
  
  editBtn.addEventListener('click', function() {
    editMode = !editMode;
    toggleEditMode(editMode);
  });
}

function toggleEditMode(enable) {
  const btn = document.getElementById('cms-edit-toggle');
  const editableElements = document.querySelectorAll('[data-cms-edit]');
  
  if (enable) {
    btn.innerHTML = '✅ Editing';
    btn.style.background = '#22c55e';
    editableElements.forEach(el => {
      el.style.outline = '2px dashed #2844A8';
      el.style.cursor = 'pointer';
      el.title = 'Click to edit in CMS';
    });
  } else {
    btn.innerHTML = '✏️ Edit';
    btn.style.background = '#2844A8';
    editableElements.forEach(el => {
      el.style.outline = 'none';
      el.style.cursor = '';
      el.title = '';
    });
  }
  
  editableElements.forEach(el => {
    el.onclick = function(e) {
      if (!editMode) return;
      e.preventDefault();
      e.stopPropagation();
      const section = el.getAttribute('data-cms-edit');
      openCMS(section);
    };
  });
}

function openCMS(section) {
  const sectionMap = {
    'announcement': '/admin/#/collections/announcement',
    'navigation': '/admin/#/collections/navigation',
    'hero': '/admin/#/collections/hero',
    'categories': '/admin/#/collections/categories',
    'products': '/admin/#/collections/products',
    'why-choose': '/admin/#/collections/why-choose',
    'collections': '/admin/#/collections/collections',
    'settings': '/admin/#/collections/settings'
  };
  
  const cmsPath = sectionMap[section] || '/admin/';
  window.open(cmsPath, '_blank');
}
