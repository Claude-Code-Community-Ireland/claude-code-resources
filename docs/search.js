let catalog = { resources: [], stats: {} };

const TYPE_ICONS = {
  skill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
  agent: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"></path><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"></path></svg>',
  'claude-md': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>',
  prd: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>',
  prompt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>',
  hook: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>',
  workflow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>',
  'mcp-server': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>'
};

const TYPE_LABELS = {
  skill: 'Skill', agent: 'Agent', 'claude-md': 'CLAUDE.md',
  prd: 'PRD', prompt: 'Prompt', hook: 'Hook',
  workflow: 'Workflow', 'mcp-server': 'MCP Server'
};

const TYPE_COLORS = {
  skill: 'type-infra', agent: 'type-persona', 'claude-md': 'type-doc',
  prd: 'type-spec', prompt: 'type-terminal', hook: 'type-link',
  workflow: 'type-flow', 'mcp-server': 'type-server'
};

const VALID_TYPES = new Set(Object.keys(TYPE_LABELS));

let activeTypeFilter = '';
let lastFocusedCard = null;
let searchTimer = null;

async function loadCatalog() {
  try {
    const response = await fetch('catalog.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    catalog = await response.json();
    updateStats();
    populateCategories();
    renderResources(catalog.resources);
    updateResultCount(catalog.resources.length);
  } catch (e) {
    console.error('Error loading catalog:', e);
    const container = document.getElementById('resources');
    container.textContent = '';
    const p = document.createElement('p');
    p.className = 'no-results';
    p.textContent = 'Error loading resources. Please try again later.';
    container.appendChild(p);
  }
}

function updateStats() {
  const total = catalog.stats.total || 0;
  animateNumber('total-count', total);
  animateNumber('skill-count', catalog.stats.byType?.skill || 0);
  animateNumber('agent-count', catalog.stats.byType?.agent || 0);
  animateNumber('claudemd-count', catalog.stats.byType?.['claude-md'] || 0);
  const inline = document.getElementById('total-count-inline');
  if (inline) inline.textContent = total;
}

function animateNumber(elementId, target) {
  const el = document.getElementById(elementId);
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (el) el.textContent = target;
    return;
  }
  const duration = 600;
  const start = performance.now();
  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function populateCategories() {
  const select = document.getElementById('category-filter');
  const categories = Object.keys(catalog.stats.byCategory || {}).sort();
  for (const category of categories) {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    select.appendChild(option);
  }
}

function safeType(raw) {
  const t = raw || 'skill';
  return VALID_TYPES.has(t) ? t : 'skill';
}

function createCardElement(resource) {
  const type = safeType(resource.type);
  const icon = TYPE_ICONS[type];
  const label = TYPE_LABELS[type];

  const article = document.createElement('article');
  article.className = 'resource-card';
  article.dataset.id = resource.id;
  article.tabIndex = 0;
  article.setAttribute('role', 'button');
  article.setAttribute('aria-label', `View ${resource.name}`);

  const header = document.createElement('div');
  header.className = 'card-header';

  const iconDiv = document.createElement('div');
  iconDiv.className = `card-icon type-${type}`;
  iconDiv.setAttribute('aria-hidden', 'true');
  iconDiv.innerHTML = icon;

  const titleGroup = document.createElement('div');
  titleGroup.className = 'card-title-group';

  const typeEl = document.createElement('div');
  typeEl.className = 'card-type';
  typeEl.textContent = label;

  const nameEl = document.createElement('h3');
  nameEl.className = 'card-name';
  nameEl.textContent = resource.name;

  titleGroup.appendChild(typeEl);
  titleGroup.appendChild(nameEl);
  header.appendChild(iconDiv);
  header.appendChild(titleGroup);

  const desc = document.createElement('p');
  desc.className = 'card-desc';
  desc.textContent = resource.description;

  const tagsDiv = document.createElement('div');
  tagsDiv.className = 'card-tags';
  (resource.tags || []).slice(0, 3).forEach(tag => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = tag;
    tagsDiv.appendChild(span);
  });

  article.appendChild(header);
  article.appendChild(desc);
  article.appendChild(tagsDiv);

  article.addEventListener('click', () => { lastFocusedCard = article; showResourceDetails(resource.id); });
  article.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      lastFocusedCard = article;
      showResourceDetails(resource.id);
    }
  });

  return article;
}

function renderResources(resources) {
  const container = document.getElementById('resources');
  const noResults = document.getElementById('no-results');
  container.textContent = '';

  if (resources.length === 0) {
    noResults.classList.remove('hidden');
    return;
  }
  noResults.classList.add('hidden');

  const fragment = document.createDocumentFragment();
  resources.forEach((resource) => {
    fragment.appendChild(createCardElement(resource));
  });
  container.appendChild(fragment);
}

function filterResources() {
  const search = document.getElementById('search').value.toLowerCase().trim();
  const typeFilter = activeTypeFilter;
  const categoryFilter = document.getElementById('category-filter').value;

  const filtered = catalog.resources.filter(resource => {
    const matchesSearch = !search ||
      resource.name.toLowerCase().includes(search) ||
      resource.description.toLowerCase().includes(search) ||
      (resource.tags || []).some(t => t.toLowerCase().includes(search));
    const matchesType = !typeFilter || resource.type === typeFilter;
    const matchesCategory = !categoryFilter || resource.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  renderResources(filtered);
  updateResultCount(filtered.length);
}

function updateResultCount(count) {
  const el = document.getElementById('result-count');
  const total = catalog.stats.total || 0;
  el.textContent = count === total ? '' : `${count} of ${total} resources`;
}

function showResourceDetails(id) {
  const resource = catalog.resources.find(r => r.id === id);
  if (!resource) return;

  const modal = document.getElementById('modal');
  const body = document.getElementById('modal-body');
  const type = safeType(resource.type);
  const color = TYPE_COLORS[type];

  body.textContent = '';

  const badge = document.createElement('div');
  badge.className = `modal-type-badge type-${type}`;
  badge.style.background = `var(--${color}-surface)`;
  badge.style.color = `var(--${color})`;
  const badgeIcon = document.createElement('span');
  badgeIcon.style.cssText = 'width:14px;height:14px;display:inline-flex';
  badgeIcon.innerHTML = TYPE_ICONS[type];
  badge.appendChild(badgeIcon);
  badge.appendChild(document.createTextNode(' ' + (TYPE_LABELS[type] || type)));

  const title = document.createElement('h2');
  title.className = 'modal-title';
  title.id = 'modal-title';
  title.textContent = resource.name;

  const desc = document.createElement('p');
  desc.className = 'modal-desc';
  desc.textContent = resource.description;

  const meta = document.createElement('div');
  meta.className = 'modal-meta';

  const authorRow = createMetaRow('Author');
  const authorVal = authorRow.querySelector('.modal-meta-value');
  authorVal.textContent = resource.author?.name || 'Unknown';
  if (resource.author?.github) {
    const authorLink = document.createElement('a');
    authorLink.href = `https://github.com/${encodeURIComponent(resource.author.github)}`;
    authorLink.target = '_blank';
    authorLink.rel = 'noopener';
    authorLink.textContent = ` @${resource.author.github}`;
    authorVal.appendChild(authorLink);
  }
  meta.appendChild(authorRow);

  const catRow = createMetaRow('Category');
  catRow.querySelector('.modal-meta-value').textContent = resource.category || '\u2014';
  meta.appendChild(catRow);

  if (resource.source?.license) {
    const licRow = createMetaRow('License');
    licRow.querySelector('.modal-meta-value').textContent = resource.source.license;
    meta.appendChild(licRow);
  }

  const tagsDiv = document.createElement('div');
  tagsDiv.className = 'modal-tags';
  (resource.tags || []).forEach(tag => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = tag;
    tagsDiv.appendChild(span);
  });

  const action = document.createElement('a');
  action.href = `https://github.com/Claude-Code-Community-Ireland/claude-code-resources/tree/main/${encodeURI(resource.path)}`;
  action.target = '_blank';
  action.rel = 'noopener';
  action.className = 'modal-action';
  const actionIcon = document.createElement('span');
  actionIcon.style.cssText = 'width:16px;height:16px;display:inline-flex';
  actionIcon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>';
  action.appendChild(actionIcon);
  action.appendChild(document.createTextNode(' View on GitHub'));

  body.appendChild(badge);
  body.appendChild(title);
  body.appendChild(desc);
  body.appendChild(meta);
  body.appendChild(tagsDiv);
  body.appendChild(action);

  modal.classList.remove('hidden');
  document.getElementById('modal-close').focus();
  document.body.style.overflow = 'hidden';
}

function createMetaRow(label) {
  const row = document.createElement('div');
  row.className = 'modal-meta-row';
  const labelEl = document.createElement('span');
  labelEl.className = 'modal-meta-label';
  labelEl.textContent = label;
  const valueEl = document.createElement('span');
  valueEl.className = 'modal-meta-value';
  row.appendChild(labelEl);
  row.appendChild(valueEl);
  return row;
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  document.body.style.overflow = '';
  if (lastFocusedCard) {
    lastFocusedCard.focus();
    lastFocusedCard = null;
  }
}

function trapFocus(e) {
  const modal = document.getElementById('modal');
  if (modal.classList.contains('hidden')) return;
  const focusable = modal.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])');
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

document.addEventListener('keydown', trapFocus);
document.getElementById('search').addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(filterResources, 150);
});
document.getElementById('category-filter').addEventListener('change', filterResources);

document.querySelectorAll('.chip[data-type]').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip[data-type]').forEach(c => {
      c.classList.remove('active');
      c.setAttribute('aria-pressed', 'false');
    });
    chip.classList.add('active');
    chip.setAttribute('aria-pressed', 'true');
    activeTypeFilter = chip.dataset.type;
    filterResources();
  });
});

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('modal');
    if (!modal.classList.contains('hidden')) closeModal();
  }
  if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
    const active = document.activeElement;
    if (active.tagName !== 'INPUT' && active.tagName !== 'TEXTAREA' && active.tagName !== 'SELECT') {
      e.preventDefault();
      document.getElementById('search').focus();
    }
  }
});

document.getElementById('modal').classList.add('hidden');
loadCatalog();
