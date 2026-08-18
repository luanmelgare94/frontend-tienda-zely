const Layout = {
    SECTIONS: {
        dashboard: null,
        productos: 'productos',
        clientes: 'clientes',
        reg_ventas: 'ventas',
        ventas: 'ventas',
        cuenta_cliente: 'ventas',
        numero_serie: null
    },

    init(activePage, onReady) {
        const navbarContainer = document.getElementById('app-navbar');
        const sidebarContainer = document.getElementById('app-sidebar');

        if (!navbarContainer || !sidebarContainer) {
            if (typeof onReady === 'function') {
                onReady();
            }
            return;
        }

        const navbarRequest = fetch('partials/navbar.html').then((response) => response.text());
        const sidebarRequest = fetch('partials/sidebar.html').then((response) => response.text());

        Promise.all([navbarRequest, sidebarRequest])
            .then(([navbarHtml, sidebarHtml]) => {
                this.mountPartial(navbarContainer, navbarHtml);
                this.mountPartial(sidebarContainer, sidebarHtml);
                this.highlightActivePage(activePage);
                this.initPlugins();
                if (typeof onReady === 'function') {
                    onReady();
                }
            })
            .catch((error) => {
                console.error('No se pudo cargar el layout compartido', error);
                if (typeof onReady === 'function') {
                    onReady();
                }
            });
    },

    mountPartial(container, html) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html.trim();
        const element = wrapper.firstElementChild;
        if (element) {
            container.replaceWith(element);
        }
    },

    initPlugins() {
        $('[data-widget="treeview"]').each(function () {
            const $tree = $(this);
            if (!$tree.data('lte.treeview')) {
                $tree.Treeview('init');
            }
        });

        $('[data-widget="pushmenu"]').each(function () {
            const $button = $(this);
            if (!$button.data('lte.pushmenu')) {
                $button.PushMenu();
            }
        });
    },

    highlightActivePage(activePage) {
        const section = this.SECTIONS[activePage];
        const activeLink = document.querySelector(`[data-menu-link="${activePage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        if (section) {
            const sectionItem = document.querySelector(`[data-menu-section="${section}"]`);
            if (sectionItem) {
                sectionItem.classList.add('menu-open');
                const toggleLink = sectionItem.querySelector(`[data-menu-toggle="${section}"]`);
                if (toggleLink) {
                    toggleLink.classList.add('active');
                }
            }
        }
    }
};

$(function () {
    const activePage = $('body').data('page');
    const startPage = () => {
        if (typeof window.inicio === 'function') {
            window.inicio();
        }
    };

    if (activePage) {
        Layout.init(activePage, startPage);
    } else {
        startPage();
    }
});
