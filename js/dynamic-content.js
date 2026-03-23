// ============================================
// Dynamic Content Loader for Flora Art Casa
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

async function loadAllData() {
  const promises = Object.entries(DATA_FILES).map(async ([key, url]) => {
    try {
      const response = await fetch(url);
      if (response.ok) dataCache[key] = await response.json();
    } catch (e) { dataCache[key] = null; }
  });
  await Promise.all(promises);
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
  bar.innerHTML = '<span>' + text + (linkText ? '<a href="' + linkUrl + '">' + linkText + '</a>' : '') + '</span>' +
    '<button class="announce-close" onclick="this.parentElement.style.display=\'none\';document.documentElement.style.setProperty(\'--announce-h\',\'0px\');">&#10005;</button>';
}

function renderNavigation() {
  const data = dataCache.navigation;
  if (!data) return;
  const logoMark = document.querySelector('.header-logo .logo-mark');
  const logoText = document.querySelector('.header-logo span');
  if (data.logo && logoMark) logoMark.textContent = data.logo.icon || 'F';
  if (data.logo && logoText) logoText.textContent = data.logo.text || 'Flora Art Casa';
}

function renderHero() {
  const data = dataCache.hero;
  if (!data) return;
  const badge = document.querySelector('.hero-badge');
  const title = document.querySelector('.hero h1');
  const desc = document.querySelector('.hero p');
  if (data.badge && badge) badge.textContent = data.badge;
  if (data.title && title) title.innerHTML = data.title;
  if (data.description && desc) desc.textContent = data.description;
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
  if (data.label && label) label.textContent = data.label;
  if (data.title && title) title.textContent = data.title;
  if (data.description && desc) desc.textContent = data.description;
}

function renderWhyChoose() {
  const data = dataCache.whyChoose;
  if (!data) return;
  const whySection = document.querySelector('.why-section');
  if (!whySection) return;
  const label = whySection.querySelector('.section-label');
  const title = whySection.querySelector('.section-title');
  if (data.label && label) label.textContent = data.label;
  if (data.title && title) title.textContent = data.title;
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
  if (data.label && label) label.textContent = data.label;
  if (data.title && title) title.textContent = data.title;
  if (data.description && desc) desc.textContent = data.description;
}

function renderFooter() {
  const settings = dataCache.settings;
  if (!settings) return;
  const logo = document.querySelector('.footer-brand .footer-logo');
  if (logo && settings.company_name) logo.textContent = settings.company_name;
}

document.addEventListener('DOMContentLoaded', function() { loadAllData(); });
