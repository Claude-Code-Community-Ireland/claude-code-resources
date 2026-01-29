// Claude Code Resources - Search & Filter

let catalog = { resources: [], stats: {} };

async function loadCatalog() {
  try {
    const response = await fetch('catalog.json');
    catalog = await response.json();
    updateStats();
    populateCategories();
    renderResources(catalog.resources);
  } catch (e) {
    console.error('Error loading catalog:', e);
    document.getElementById('resources').innerHTML =
      '<p class="no-results">Error loading resources. Please try again later.</p>';
  }
}

function updateStats() {
  document.getElementById('total-count').textContent = catalog.stats.total || 0;
  document.getElementById('skill-count').textContent = catalog.stats.byType?.skill || 0;
  document.getElementById('agent-count').textContent = catalog.stats.byType?.agent || 0;
  document.getElementById('claudemd-count').textContent = catalog.stats.byType?.['claude-md'] || 0;
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

function renderResources(resources) {
  const container = document.getElementById('resources');
  const noResults = document.getElementById('no-results');

  if (resources.length === 0) {
    container.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');

  container.innerHTML = resources.map(resource => `
    <div class="resource-card" data-id="${resource.id}">
      <span class="resource-type">${resource.type}</span>
      <h3 class="resource-name">${escapeHtml(resource.name)}</h3>
      <p class="resource-description">${escapeHtml(resource.description)}</p>
      <div class="resource-tags">
        ${resource.tags.slice(0, 4).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
      </div>
    </div>
  `).join('');

  // Add click handlers
  container.querySelectorAll('.resource-card').forEach(card => {
    card.addEventListener('click', () => showResourceDetails(card.dataset.id));
  });
}

function filterResources() {
  const search = document.getElementById('search').value.toLowerCase();
  const typeFilter = document.getElementById('type-filter').value;
  const categoryFilter = document.getElementById('category-filter').value;

  const filtered = catalog.resources.filter(resource => {
    const matchesSearch = !search ||
      resource.name.toLowerCase().includes(search) ||
      resource.description.toLowerCase().includes(search) ||
      resource.tags.some(t => t.toLowerCase().includes(search));

    const matchesType = !typeFilter || resource.type === typeFilter;
    const matchesCategory = !categoryFilter || resource.category === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  renderResources(filtered);
}

function showResourceDetails(id) {
  const resource = catalog.resources.find(r => r.id === id);
  if (!resource) return;

  const modal = document.getElementById('modal');
  const body = document.getElementById('modal-body');

  body.innerHTML = `
    <span class="resource-type">${resource.type}</span>
    <h2 style="margin: 15px 0">${escapeHtml(resource.name)}</h2>
    <p style="color: var(--text-muted); margin-bottom: 20px">${escapeHtml(resource.description)}</p>

    <div style="margin-bottom: 20px">
      <strong>Author:</strong> ${escapeHtml(resource.author?.name || 'Unknown')}
      ${resource.author?.github ? `(<a href="https://github.com/${resource.author.github}" target="_blank">@${resource.author.github}</a>)` : ''}
    </div>

    <div style="margin-bottom: 20px">
      <strong>Category:</strong> ${escapeHtml(resource.category)}
    </div>

    <div style="margin-bottom: 20px">
      <strong>Tags:</strong>
      <div class="resource-tags" style="margin-top: 8px">
        ${resource.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
      </div>
    </div>

    ${resource.source?.url ? `
      <div style="margin-bottom: 20px">
        <strong>Source:</strong>
        <a href="${escapeHtml(resource.source.url)}" target="_blank">${escapeHtml(resource.source.url)}</a>
      </div>
    ` : ''}

    <div style="margin-top: 30px">
      <a href="https://github.com/Claude-Code-Community-Ireland/claude-code-resources/tree/main/${resource.path}"
         target="_blank"
         style="display: inline-block; background: var(--primary); color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">
        View on GitHub
      </a>
    </div>
  `;

  modal.classList.remove('hidden');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

// Event listeners
document.getElementById('search').addEventListener('input', filterResources);
document.getElementById('type-filter').addEventListener('change', filterResources);
document.getElementById('category-filter').addEventListener('change', filterResources);

document.getElementById('modal-close').addEventListener('click', () => {
  document.getElementById('modal').classList.add('hidden');
});

document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target.id === 'modal') {
    document.getElementById('modal').classList.add('hidden');
  }
});

// Initialize
loadCatalog();
