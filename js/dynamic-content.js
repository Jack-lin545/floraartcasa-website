// ============================================
// Dynamic Content Loader for Flora Art Casa
// WITH INLINE EDITING PANEL
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
let currentSection = null;

document.addEventListener('DOMContentLoaded', function() {
  loadAllData().then(() => {
    createEditUI();
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
  bar.setAttribute('data-cms-section', 'announcement');
  bar.innerHTML = '<span>' + text + (linkText ? '<a href="' + linkUrl + '">' + linkText + '</a>' : '') + '</span>' +
    '<button class="announce-close" onclick="this.parentElement.style.display=\'none\';document.documentElement.style.setProperty(\'--announce-h\',\'0px\');">&#10005;</button>';
}

function renderNavigation() {
  const data = dataCache.navigation;
  if (!data) return;
  const logoMark = document.querySelector('.header-logo .logo-mark');
  const logoText = document.querySelector('.header-logo span');
  if (data.logo && logoMark) {
    logoMark.setAttribute('data-cms-section', 'navigation');
    logoMark.textContent = data.logo.icon || 'F';
  }
  if (data.logo && logoText) {
    logoText.setAttribute('data-cms-section', 'navigation');
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
    badge.setAttribute('data-cms-section', 'hero');
    badge.textContent = data.badge;
  }
  if (data.title && title) {
    title.setAttribute('data-cms-section', 'hero');
    title.innerHTML = data.title;
  }
  if (data.description && desc) {
    desc.setAttribute('data-cms-section', 'hero');
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
    label.setAttribute('data-cms-section', 'categories');
    label.textContent = data.label;
  }
  if (data.title && title) {
    title.setAttribute('data-cms-section', 'categories');
    title.textContent = data.title;
  }
  if (data.description && desc) {
    desc.setAttribute('data-cms-section', 'categories');
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
    label.setAttribute('data-cms-section', 'why-choose');
    label.textContent = data.label;
  }
  if (data.title && title) {
    title.setAttribute('data-cms-section', 'why-choose');
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
    label.setAttribute('data-cms-section', 'collections');
    label.textContent = data.label;
  }
  if (data.title && title) {
    title.setAttribute('data-cms-section', 'collections');
    title.textContent = data.title;
  }
  if (data.description && desc) {
    desc.setAttribute('data-cms-section', 'collections');
    desc.textContent = data.description;
  }
}

function renderFooter() {
  const settings = dataCache.settings;
  if (!settings) return;
  const logo = document.querySelector('.footer-brand .footer-logo');
  if (logo && settings.company_name) {
    logo.setAttribute('data-cms-section', 'settings');
    logo.textContent = settings.company_name;
  }
}

function createEditUI() {
  const editBtn = document.createElement('button');
  editBtn.id = 'cms-edit-toggle';
  editBtn.innerHTML = '✏️ Edit Page';
  editBtn.style.cssText = 'position:fixed;top:80px;right:20px;z-index:9999;padding:12px 24px;background:#2844A8;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;box-shadow:0 4px 12px rgba(0,0,0,0.15);';
  document.body.appendChild(editBtn);
  
  editBtn.addEventListener('click', function() {
    editMode = !editMode;
    toggleEditMode(editMode);
  });
  
  createEditPanel();
}

function createEditPanel() {
  const panel = document.createElement('div');
  panel.id = 'cms-edit-panel';
  panel.style.cssText = 'position:fixed;top:0;right:-400px;width:380px;height:100vh;background:white;z-index:10000;box-shadow:-4px 0 20px rgba(0,0,0,0.15);transition:right 0.3s;overflow-y:auto;padding:20px;font-family:system-ui,sans-serif;';
  panel.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:15px;border-bottom:1px solid #eee;"><h2 style="margin:0;font-size:18px;color:#2844A8;">✏️ Edit Content</h2><button id="cms-panel-close" style="background:none;border:none;font-size:24px;cursor:pointer;color:#666;">&times;</button></div><div id="cms-panel-content"></div><div style="margin-top:20px;padding-top:15px;border-top:1px solid #eee;"><button id="cms-save-btn" style="width:100%;padding:14px;background:#22c55e;color:white;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">💾 Save & Open Editor</button></div>';
  document.body.appendChild(panel);
  
  document.getElementById('cms-panel-close').addEventListener('click', function() {
    toggleEditMode(false);
  });
  
  document.getElementById('cms-save-btn').addEventListener('click', function() {
    window.open('/admin/#/collections/' + currentSection, '_blank');
  });
}

function toggleEditMode(enable) {
  const btn = document.getElementById('cms-edit-toggle');
  const panel = document.getElementById('cms-edit-panel');
  const editableElements = document.querySelectorAll('[data-cms-section]');
  
  if (enable) {
    btn.innerHTML = '✅ Editing';
    btn.style.background = '#22c55e';
    panel.style.right = '0';
    showEditForm();
    
    editableElements.forEach(el => {
      el.style.outline = '2px dashed #2844A8';
      el.style.cursor = 'pointer';
    });
  } else {
    btn.innerHTML = '✏️ Edit Page';
    btn.style.background = '#2844A8';
    panel.style.right = '-400px';
    
    editableElements.forEach(el => {
      el.style.outline = 'none';
      el.style.cursor = '';
    });
  }
}

function showEditForm() {
  const content = document.getElementById('cms-panel-content');
  const sections = ['announcement', 'navigation', 'hero', 'categories', 'why-choose', 'collections', 'settings'];
  
  let html = '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;">';
  sections.forEach(sec => {
    const active = currentSection === sec ? 'background:#2844A8;color:white;' : 'background:#f0f0f0;color:#333;';
    html += '<button class="cms-sec-btn" data-sec="' + sec + '" style="padding:8px 16px;border:none;border-radius:20px;font-size:13px;cursor:pointer;' + active + '">' + getSectionLabel(sec) + '</button>';
  });
  html += '</div>';
  
  setTimeout(() => {
    document.querySelectorAll('.cms-sec-btn').forEach(btn => {
      btn.onclick = function() {
        currentSection = this.getAttribute('data-sec');
        showEditForm();
      };
    });
  }, 100);
  
  if (currentSection) {
    html += renderSectionForm(currentSection);
  } else {
    html += '<p style="color:#666;text-align:center;padding:40px 0;">👆 Select a section to edit</p>';
  }
  
  content.innerHTML = html;
}

function getSectionLabel(sec) {
  const labels = {
    'announcement': '📢 公告栏',
    'navigation': '🔤 导航',
    'hero': '🎯 Hero区',
    'categories': '📂 分类',
    'why-choose': '⭐ 优势',
    'collections': '🎨 系列',
    'settings': '⚙️ 设置'
  };
  return labels[sec] || sec;
}

function renderSectionForm(section) {
  const data = dataCache[section];
  if (!data) return '<p>No data</p>';
  
  let html = '<h3 style="margin:0 0 15px 0;font-size:16px;color:#333;">' + getSectionLabel(section) + '</h3>';
  
  switch(section) {
    case 'announcement':
      html += createField('enabled', '启用', 'checkbox', data.enabled);
      html += createField('text', '公告文字', 'text', data.text);
      html += createField('link[text]', '链接文字', 'text', data.link ? data.link.text : '');
      html += createField('link[url]', '链接地址', 'text', data.link ? data.link.url : '');
      break;
    case 'navigation':
      html += createField('logo[icon]', 'Logo图标', 'text', data.logo ? data.logo.icon : '');
      html += createField('logo[text]', 'Logo文字', 'text', data.logo ? data.logo.text : '');
      break;
    case 'hero':
      html += createField('badge', '标签', 'text', data.badge);
      html += createField('title', '主标题', 'text', data.title);
      html += createField('description', '描述', 'textarea', data.description);
      html += createField('primaryButton', '主按钮', 'text', data.primaryButton);
      html += createField('secondaryButton', '副按钮', 'text', data.secondaryButton);
      break;
    case 'categories':
      html += createField('label', '小标题', 'text', data.label);
      html += createField('title', '大标题', 'text', data.title);
      html += createField('description', '描述', 'textarea', data.description);
      break;
    case 'why-choose':
      html += createField('label', '小标题', 'text', data.label);
      html += createField('title', '大标题', 'text', data.title);
      break;
    case 'collections':
      html += createField('label', '小标题', 'text', data.label);
      html += createField('title', '大标题', 'text', data.title);
      html += createField('description', '描述', 'textarea', data.description);
      break;
    case 'settings':
      html += createField('company_name', '公司名称', 'text', data.company_name);
      html += createField('email', '邮箱', 'text', data.email);
      html += createField('phone', '电话', 'text', data.phone);
      html += createFiel
...(truncated)...
