(() => {
    const views = document.querySelectorAll('[data-view]');
    const loginSection = document.getElementById('login-section');
    const businessForm = document.getElementById('business-login-form');
    const demoMessage = document.getElementById('demo-message');
    
    // Flag per evitare di inizializzare i grafici più volte
    let chartsInitialized = false;
    let chartInitAttempts = 0;

    function showView(viewId) {
        views.forEach((view) => {
            const isActive = view.id === viewId;
            view.classList.toggle('active-view', isActive);
            view.classList.toggle('hidden-view', !isActive);
            view.setAttribute('aria-hidden', String(!isActive));
        });

        const activeView = document.getElementById(viewId);
        activeView?.querySelector('button, input, a')?.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    document.querySelectorAll('.nav-link[data-target]').forEach((button) => {
        button.addEventListener('click', () => showView(button.dataset.target));
    });

    document.querySelectorAll('[data-target]').forEach((button) => {
        button.addEventListener('click', () => showView(button.dataset.target));
    });

    document.querySelectorAll('[data-back-to-menu]').forEach((button) => {
        button.addEventListener('click', () => showView('login-section'));
    });

    document.querySelectorAll('.trust-item').forEach((item) => {
        item.addEventListener('click', () => {
            const isExpanded = item.getAttribute('aria-expanded') === 'true';

            document.querySelectorAll('.trust-item').forEach((otherItem) => {
                otherItem.setAttribute('aria-expanded', 'false');
            });

            item.setAttribute('aria-expanded', String(!isExpanded));
        });
    });

    const aboutTabs = document.querySelectorAll('[data-about-tab]');
    const aboutPanels = document.querySelectorAll('[data-about-panel]');

    function setupTabs(tabs, panels, tabAttribute, panelAttribute) {
        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const target = tab.dataset[tabAttribute];

                tabs.forEach((otherTab) => {
                    const isActive = otherTab === tab;
                    otherTab.classList.toggle('is-active', isActive);
                    otherTab.setAttribute('aria-selected', String(isActive));
                });

                panels.forEach((panel) => {
                    const isActive = panel.dataset[panelAttribute] === target;
                    panel.classList.toggle('is-active', isActive);
                    panel.hidden = !isActive;
                });
            });
        });
    }

    aboutTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.aboutTab;

            aboutTabs.forEach((otherTab) => {
                const isActive = otherTab === tab;
                otherTab.classList.toggle('is-active', isActive);
                otherTab.setAttribute('aria-selected', String(isActive));
            });

            aboutPanels.forEach((panel) => {
                const isActive = panel.dataset.aboutPanel === target;
                panel.classList.toggle('is-active', isActive);
                panel.hidden = !isActive;
            });
        });
    });

    setupTabs(document.querySelectorAll('[data-product-tab]'), document.querySelectorAll('[data-product-panel]'), 'productTab', 'productPanel');

    const productImage = document.getElementById('product-visual-image');
    const productButtons = document.querySelectorAll('[data-product-tab]');

    productButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const imageSrc = button.dataset.productImage || 'basilico-bg.jpg';
            const imageLabel = button.textContent.trim();
            if (productImage) {
                productImage.src = imageSrc;
                productImage.alt = `${imageLabel} del Gruppo BF`;
            }
        });
    });

    const journeySteps = document.querySelectorAll('[data-journey-step]');
    const journeyPanels = document.querySelectorAll('[data-journey-panel]');

    journeySteps.forEach((step) => {
        step.addEventListener('click', () => {
            const target = step.dataset.journeyStep;

            journeySteps.forEach((otherStep) => {
                const isActive = otherStep === step;
                otherStep.classList.toggle('is-active', isActive);
                otherStep.setAttribute('aria-expanded', String(isActive));
            });

            journeyPanels.forEach((panel) => {
                const isActive = panel.dataset.journeyPanel === target;
                panel.hidden = !isActive;
                panel.classList.toggle('is-active', isActive);
            });
        });
    });

    const traceTabs = document.querySelectorAll('[data-trace-tab]');
    const tracePanels = document.querySelectorAll('[data-trace-panel]');

    traceTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.traceTab;

            traceTabs.forEach((otherTab) => {
                const isActive = otherTab === tab;
                otherTab.classList.toggle('is-active', isActive);
                otherTab.setAttribute('aria-selected', String(isActive));
            });

            tracePanels.forEach((panel) => {
                const isActive = panel.dataset.tracePanel === target;
                panel.classList.toggle('is-active', isActive);
                panel.hidden = !isActive;
            });
        });
    });

    businessForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!businessForm.checkValidity()) {
            businessForm.reportValidity();
            return;
        }

        demoMessage.hidden = false;
        showView('business-section');
        
        // Inizializza i grafici solo se non è già stato fatto
        // e solo quando la sezione è ormai visibile nel DOM
        initChartsWhenReady();
    });

    // ==========================================
    // INIZIALIZZAZIONE GRAFICI
    // ==========================================
    function initChartsWhenReady() {
        if (chartsInitialized || chartInitAttempts >= 10) return;

        if (typeof Chart === 'undefined') {
            chartInitAttempts += 1;
            setTimeout(initChartsWhenReady, 250);
            return;
        }

        setTimeout(() => {
            initCharts();
            chartsInitialized = true;
        }, 100);
    }

    function initCharts() {
        const chartDefaults = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
        };

        function createChart(id, config) {
            const canvas = document.getElementById(id);
            if (!canvas || typeof Chart === 'undefined') return;
            new Chart(canvas, { ...config, options: { ...chartDefaults, ...config.options } });
        }

        createChart('chartAdozione', {
            type: 'doughnut',
            data: {
                labels: ['Adottato (74%)', 'Non adottato (26%)'],
                datasets: [{ data: [74, 26], backgroundColor: ['#0284c7', '#e2e8f0'], borderWidth: 0 }]
            }
        });

        createChart('chartCertificazioni', {
            type: 'doughnut',
            data: {
                labels: ['Certificati (24%)', 'Non certificati (76%)'],
                datasets: [{ data: [24, 76], backgroundColor: ['#2c5e3b', '#e2e8f0'], borderWidth: 0 }]
            }
        });

        createChart('waterChart', {
            type: 'bar',
            data: {
                labels: ['Standard', 'Agricoltura BF'],
                datasets: [{ label: 'Indice consumo', data: [100, 35], backgroundColor: ['#ef4444', '#2c5e3b'], borderRadius: 6 }]
            },
            options: { plugins: { legend: { display: false } } }
        });

        createChart('co2Chart', {
            type: 'line',
            data: {
                labels: ['2023', '2024', '2025', '2026'],
                datasets: [{ label: 'CO2 (t)', data: [120, 95, 70, 48], borderColor: '#0284c7', backgroundColor: 'rgba(2, 132, 199, 0.1)', fill: true, tension: 0.3 }]
            },
            options: { plugins: { legend: { display: false } } }
        });

        createChart('energyChart', {
            type: 'bar',
            data: {
                labels: ['Rinnovabili', 'Tradizionale'],
                datasets: [{ label: 'Copertura (%)', data: [80, 20], backgroundColor: ['#eab308', '#94a3b8'], borderRadius: 6 }]
            },
            options: { indexAxis: 'y', plugins: { legend: { display: false } } }
        });

        createChart('esgChart', {
            type: 'doughnut',
            data: {
                labels: ['Ambientale', 'Sociale', 'Governance'],
                datasets: [{ data: [50, 30, 20], backgroundColor: ['#2c5e3b', '#38bdf8', '#eab308'], borderWidth: 2 }]
            }
        });
    }

    showView(loginSection.id);
})();