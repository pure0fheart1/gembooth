// GemBooth Dashboard - Frontend JavaScript

// State
let currentSection = 'overview';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    loadSection('overview');
});

// Setup navigation click handlers
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.dataset.section;

            // Update active state
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Load section
            loadSection(section);
        });
    });
}

// Load section content
async function loadSection(section) {
    currentSection = section;
    showLoading();

    try {
        const content = await fetchSectionContent(section);
        renderSection(section, content);
    } catch (error) {
        console.error('Error loading section:', error);
        showError('Failed to load section. Please try again.');
    } finally {
        hideLoading();
    }
}

// Fetch section content from API
async function fetchSectionContent(section) {
    const response = await fetch(`/api/${section}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

// Render section based on type
function renderSection(section, data) {
    const wrapper = document.getElementById('content-wrapper');
    wrapper.innerHTML = '';
    wrapper.classList.add('fade-in');

    switch (section) {
        case 'overview':
            renderOverview(wrapper, data);
            break;
        case 'api-keys':
            renderApiKeys(wrapper, data);
            break;
        case 'supabase':
            renderSupabase(wrapper, data);
            break;
        case 'stripe':
            renderStripe(wrapper, data);
            break;
        case 'commands':
            renderCommands(wrapper, data);
            break;
        case 'links':
            renderLinks(wrapper, data);
            break;
        case 'ai-modes':
            renderAiModes(wrapper, data);
            break;
        case 'troubleshooting':
            renderTroubleshooting(wrapper, data);
            break;
    }
}

// Render Overview
function renderOverview(wrapper, data) {
    wrapper.innerHTML = `
        <h1 class="page-title">📊 Project Overview</h1>

        <div class="cards-container">
            <div class="card">
                <div class="card-header">
                    <span class="card-icon">📋</span>
                    <h2 class="card-title">Project Info</h2>
                </div>
                <div class="card-content">
                    <div class="info-row">
                        <span class="info-label">Name</span>
                        <span class="info-value">${data.project.name}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Version</span>
                        <span class="info-value">${data.project.version}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Tech Stack</span>
                        <span class="info-value">${data.project.tech_stack}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Last Updated</span>
                        <span class="info-value info">${data.project.last_updated}</span>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-icon">📊</span>
                    <h2 class="card-title">Quick Stats</h2>
                </div>
                <div class="card-content">
                    <div class="info-row">
                        <span class="info-label">Database Tables</span>
                        <span class="info-value success">${data.stats.database_tables} tables</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Edge Functions</span>
                        <span class="info-value success">${data.stats.edge_functions} functions</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Storage Buckets</span>
                        <span class="info-value success">${data.stats.storage_buckets} buckets</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">AI Modes</span>
                        <span class="info-value success">${data.stats.ai_modes} modes</span>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-icon">🔍</span>
                    <h2 class="card-title">Configuration Status</h2>
                </div>
                <div class="card-content">
                    <div class="info-row">
                        <span class="info-label">Environment</span>
                        <span class="info-value ${data.status.environment.includes('✅') ? 'success' : 'error'}">${data.status.environment}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Gemini API</span>
                        <span class="info-value ${data.status.gemini.includes('✅') ? 'success' : 'error'}">${data.status.gemini}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Supabase</span>
                        <span class="info-value ${data.status.supabase.includes('✅') ? 'success' : 'error'}">${data.status.supabase}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Stripe</span>
                        <span class="info-value ${data.status.stripe.includes('✅') ? 'success' : 'error'}">${data.status.stripe}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Render API Keys
function renderApiKeys(wrapper, data) {
    wrapper.innerHTML = `
        <h1 class="page-title">🔑 API Keys & Secrets</h1>

        <div class="cards-container">
            <div class="card">
                <div class="card-header">
                    <span class="card-icon">🤖</span>
                    <h2 class="card-title">Google Gemini AI</h2>
                </div>
                <div class="card-content">
                    <div class="info-row">
                        <span class="info-label">API Key</span>
                        <span class="info-value info">${data.gemini.api_key}</span>
                    </div>
                    <div style="margin-top: 1rem;">
                        <a href="${data.gemini.url}" target="_blank" class="link-text">🔗 Get API Key</a>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-icon">🗄️</span>
                    <h2 class="card-title">Supabase</h2>
                </div>
                <div class="card-content">
                    <div class="info-row">
                        <span class="info-label">Project URL</span>
                        <span class="info-value info">${data.supabase.url}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Anon Key</span>
                        <span class="info-value info">${data.supabase.anon_key}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Service Role</span>
                        <span class="info-value info">${data.supabase.service_role_key}</span>
                    </div>
                    <div class="alert warning" style="margin-top: 1rem;">
                        ⚠️ Never expose Service Role Key to browser!
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-icon">💳</span>
                    <h2 class="card-title">Stripe Payment</h2>
                </div>
                <div class="card-content">
                    <div class="info-row">
                        <span class="info-label">Publishable Key</span>
                        <span class="info-value info">${data.stripe.publishable_key}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Secret Key</span>
                        <span class="info-value info">${data.stripe.secret_key}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Webhook Secret</span>
                        <span class="info-value info">${data.stripe.webhook_secret}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Render Supabase
function renderSupabase(wrapper, data) {
    let html = `
        <h1 class="page-title">🗄️ Supabase Backend</h1>

        <div class="table-container">
            <div class="table-header">
                <h2 class="table-title">📊 Database Tables</h2>
            </div>
    `;

    data.tables.forEach(table => {
        html += `
            <div class="table-row">
                <div class="table-cell name">${table.name}</div>
                <div class="table-cell description">${table.description}</div>
            </div>
        `;
    });

    html += `</div>`;

    html += `
        <div class="table-container">
            <div class="table-header">
                <h2 class="table-title">⚙️ Edge Functions</h2>
            </div>
    `;

    data.edge_functions.forEach(func => {
        html += `
            <div class="table-row">
                <div class="table-cell name">${func.name}</div>
                <div class="table-cell description">${func.description}</div>
            </div>
        `;
    });

    html += `</div>`;

    html += `
        <div class="table-container">
            <div class="table-header">
                <h2 class="table-title">📦 Storage Buckets</h2>
            </div>
    `;

    data.storage_buckets.forEach(bucket => {
        html += `
            <div class="table-row">
                <div class="table-cell name">${bucket.name}</div>
                <div class="table-cell description">${bucket.description}</div>
            </div>
        `;
    });

    html += `</div>`;

    wrapper.innerHTML = html;
}

// Render Stripe
function renderStripe(wrapper, data) {
    let html = `
        <h1 class="page-title">💳 Stripe Integration</h1>

        <div class="cards-container">
            <div class="card">
                <div class="card-header">
                    <span class="card-icon">💳</span>
                    <h2 class="card-title">Test Credit Cards</h2>
                </div>
                <div class="card-content">
    `;

    data.test_cards.forEach(card => {
        html += `
            <div class="info-row">
                <span class="info-label">${card.name}</span>
                <span class="info-value ${card.name === 'Success' ? 'success' : 'warning'}">${card.number}</span>
            </div>
        `;
    });

    html += `
                    <div class="alert info" style="margin-top: 1rem;">
                        Use any future expiry, any CVC, any ZIP
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <span class="card-icon">💰</span>
                    <h2 class="card-title">Subscription Tiers</h2>
                </div>
                <div class="card-content">
    `;

    data.tiers.forEach(tier => {
        html += `
            <div class="info-row">
                <span class="info-label">${tier.name} (${tier.price})</span>
                <span class="info-value">${tier.limits}</span>
            </div>
        `;
    });

    html += `
                </div>
            </div>
        </div>
    `;

    wrapper.innerHTML = html;
}

// Render Commands
function renderCommands(wrapper, data) {
    let html = `<h1 class="page-title">⚡ Quick Commands</h1>`;

    const sections = [
        { key: 'development', title: '⚡ Development', icon: '⚡' },
        { key: 'supabase', title: '🗄️ Supabase', icon: '🗄️' },
        { key: 'deployment', title: '🚀 Deployment', icon: '🚀' },
        { key: 'stripe', title: '💳 Stripe', icon: '💳' }
    ];

    sections.forEach(section => {
        if (data[section.key] && data[section.key].length > 0) {
            html += `
                <div class="table-container">
                    <div class="table-header">
                        <h2 class="table-title">${section.title}</h2>
                    </div>
                    <div style="padding: 1.5rem;">
            `;

            data[section.key].forEach(cmd => {
                html += `
                    <div class="command-item">
                        <div class="command-description">${cmd.description}</div>
                        <div class="command-box">
                            <span class="command-text">$ ${cmd.command}</span>
                            <button class="copy-btn" onclick="copyToClipboard('${cmd.command}')">📋 Copy</button>
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        }
    });

    wrapper.innerHTML = html;
}

// Render Links
function renderLinks(wrapper, data) {
    let html = `<h1 class="page-title">🔗 Quick Links</h1>`;

    const sections = [
        { key: 'supabase', title: '🗄️ Supabase Dashboards' },
        { key: 'stripe', title: '💳 Stripe Dashboards' },
        { key: 'external', title: '📚 External Resources' }
    ];

    html += `<div class="cards-container">`;

    sections.forEach(section => {
        if (data[section.key] && data[section.key].length > 0) {
            html += `
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">${section.title}</h2>
                    </div>
                    <div class="card-content">
            `;

            data[section.key].forEach(link => {
                html += `
                    <div class="link-item">
                        <span class="link-icon">🔗</span>
                        <a href="${link.url}" target="_blank" class="link-text">${link.name}</a>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        }
    });

    html += `</div>`;

    wrapper.innerHTML = html;
}

// Render AI Modes
function renderAiModes(wrapper, data) {
    let html = `
        <h1 class="page-title">🎨 AI Transformation Modes</h1>
        <div class="modes-grid">
    `;

    data.modes.forEach(mode => {
        html += `
            <div class="mode-card">
                <div class="mode-header">
                    <span class="mode-emoji">${mode.emoji}</span>
                    <span class="mode-name">${mode.name}</span>
                </div>
                <div class="mode-description">${mode.description}</div>
            </div>
        `;
    });

    html += `</div>`;

    wrapper.innerHTML = html;
}

// Render Troubleshooting
function renderTroubleshooting(wrapper, data) {
    let html = `<h1 class="page-title">🔧 Troubleshooting Guide</h1>`;

    data.issues.forEach(issue => {
        html += `
            <div class="issue-card">
                <div class="issue-problem">
                    ❗ ${issue.problem}
                </div>
                <ul class="solution-list">
        `;

        issue.solutions.forEach(solution => {
            html += `<li class="solution-item">${solution}</li>`;
        });

        html += `
                </ul>
            </div>
        `;
    });

    wrapper.innerHTML = html;
}

// Utility: Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show temporary success message
        const btn = event.target;
        const originalText = btn.innerHTML;
        btn.innerHTML = '✓ Copied!';
        btn.style.background = '#10b981';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
    });
}

// Loading functions
function showLoading() {
    document.getElementById('loading').classList.add('show');
}

function hideLoading() {
    document.getElementById('loading').classList.remove('show');
}

// Error display
function showError(message) {
    const wrapper = document.getElementById('content-wrapper');
    wrapper.innerHTML = `
        <div class="alert error" style="margin-top: 2rem;">
            ❌ ${message}
        </div>
    `;
}
