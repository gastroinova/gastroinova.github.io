/* ==========================================================================
   GASTROINOVA - LÓGICA DE LA APLICACIÓN
   Animaciones, Gestión del Carrito E-Shop y Flujo de WhatsApp
   ========================================================================== */

// --- DATOS DEL CATÁLOGO DE SERVICIOS ---
const PRODUCTS = [
    {
        id: "web-corporativa",
        title: "Plan Web Corporativa",
        price: 749,
        period: "pago único",
        description: "Diseño web personalizado, responsivo y optimizado para Google. Incluye dominio .com, hosting gestionado y SSL el primer año.",
        options: [
            { id: "mantenimiento-web", label: "Mantenimiento + Hosting mensual (SSL, backups, soporte)", price: 45 },
            { id: "seo-local-web", label: "Posicionamiento SEO local en Google Maps", price: 73 }
        ]
    },
    {
        id: "ecommerce-pro",
        title: "Pack E-Shop Pro (Tienda Online)",
        price: 1399,
        period: "pago único",
        description: "Tienda online profesional a medida, sin intermediarios. Panel autogestionable, pasarela de cobro, hosting dedicado y SSL incluidos.",
        options: [
            { id: "mantenimiento-eco", label: "Mantenimiento + Hosting E-commerce mensual (backups diarios, seguridad, soporte prioritario)", price: 82 },
            { id: "carga-productos", label: "Carga inicial de catálogo (hasta 50 productos con fotos y descripciones)", price: 179 }
        ],
        popular: true
    },
    {
        id: "menu-qr",
        title: "Plan Carta / Catálogo QR",
        price: 319,
        period: "pago único",
        description: "Carta digital interactiva con código QR personalizado. Actualización instantánea de precios y productos desde el móvil. Hosting incluido.",
        options: [
            { id: "mantenimiento-qr", label: "Plan de gestión mensual (actualizaciones ilimitadas + soporte)", price: 27 },
            { id: "pegatinas-qr", label: "Diseño e impresión de pegatinas QR físicas (x20)", price: 49 }
        ]
    },
    {
        id: "marketing-local",
        title: "Pack Marketing Digital Local",
        price: 275,
        period: "/mes",
        description: "Gestión profesional de redes sociales, SEO local en Google y optimización de Google Maps para captar clientes en tu zona.",
        options: [
            { id: "campanas-ads", label: "Gestión de campañas publicitarias con presupuesto incluido (Google/Meta Ads)", price: 183 },
            { id: "contenido-blog", label: "Creación de contenidos para blog y email marketing mensual", price: 91 }
        ]
    },
    {
        id: "pack-reservas",
        title: "Sistema de Reservas / Pedidos Online",
        price: 649,
        period: "pago único",
        description: "Tu propio sistema de reservas de mesa o pedidos online integrado en tu web. Sin comisiones de plataformas externas como Glovo o Just Eat.",
        options: [
            { id: "mantenimiento-reservas", label: "Mantenimiento mensual del sistema + soporte técnico", price: 36 },
            { id: "integracion-tpv", label: "Integración con TPV virtual (cobro online seguro)", price: 139 }
        ]
    },
    {
        id: "foto-video",
        title: "Pack Audiovisual Profesional",
        price: 419,
        period: "pago único",
        description: "Sesión fotográfica de productos o local más vídeo promocional de 30-60 segundos editado para redes sociales. Entrega en 5 días.",
        options: [
            { id: "reels-adicionales", label: "Pack de 4 vídeos cortos adicionales para TikTok/Instagram Reels", price: 139 },
            { id: "sesion-completa", label: "Sesión extendida: local completo, equipo y productos (día entero)", price: 229 }
        ]
    }
];


// --- ESTADO DE LA APLICACIÓN (CARRITO) ---
let cart = [];

// Teléfono oficial de WhatsApp de Gastroinova (Formato internacional, España: +34)
const GASTROINOVA_WA_PHONE = "34615423895";

// --- ELEMENTOS DEL DOM ---
document.addEventListener("DOMContentLoaded", () => {
    // Inicializar Componentes
    initHeaderScroll();
    initMobileMenu();
    initHeroTyping();
    renderProducts();
    initCartDrawer();
    initCheckoutModal();
    initContactForm();
});

// --- 1. COMPORTAMIENTO DE CABECERA (SCROLL) ---
function initHeaderScroll() {
    const header = document.querySelector(".main-header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
}

// --- 2. MENÚ MÓVIL COLLAPSIBLE ---
function initMobileMenu() {
    const toggle = document.getElementById("mobile-menu-toggle");
    const overlay = document.getElementById("mobile-menu-overlay");
    const links = document.querySelectorAll(".mobile-nav-link");

    const toggleMenu = () => {
        toggle.classList.toggle("open");
        overlay.classList.toggle("open");
        document.body.style.overflow = overlay.classList.contains("open") ? "hidden" : "";
    };

    toggle.addEventListener("click", toggleMenu);

    links.forEach(link => {
        link.addEventListener("click", () => {
            if (overlay.classList.contains("open")) {
                toggleMenu();
            }
        });
    });
}

// --- 3. ANIMACIÓN DE ESCRITURA EN EL HERO ---
function initHeroTyping() {
    const element = document.getElementById("typing-text");
    if (!element) return;

    const words = ["multiplica tus ventas.", "atrae más clientes.", "destaca en Google Maps.", "te ahorra comisiones."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pausa al final de la frase
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pausa antes de empezar a escribir de nuevo
        }

        setTimeout(type, typingSpeed);
    }

    // Iniciar animación
    setTimeout(type, 1000);
}

// --- 4. RENDERIZADO DEL CATÁLOGO DE LA E-SHOP ---
function renderProducts() {
    const container = document.getElementById("products-container");
    if (!container) return;

    container.innerHTML = PRODUCTS.map(product => {
        const isPopular = product.popular ? "popular" : "";
        
        // Generar HTML de las opciones/extras
        const optionsHtml = product.options.map(opt => `
            <label class="option-checkbox-label">
                <input type="checkbox" data-prod-id="${product.id}" data-opt-id="${opt.id}" value="${opt.price}">
                <span>${opt.label}</span>
                <span class="option-price">+${opt.price} €</span>
            </label>
        `).join("");

        return `
            <article class="product-card ${isPopular}" id="prod-card-${product.id}">
                <div class="product-header">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price-block">
                        <span class="product-price">${product.price} €</span>
                        <span class="product-period">${product.period}</span>
                    </div>
                </div>
                <p class="product-description">${product.description}</p>
                
                <div class="product-options-box">
                    <h4 class="options-title">Opciones adicionales:</h4>
                    ${optionsHtml}
                </div>

                <button class="btn btn-primary btn-block add-to-cart-btn" data-id="${product.id}">
                    Añadir al Carrito
                </button>
            </article>
        `;
    }).join("");

    // Registrar eventos para los botones de añadir al carrito
    document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const prodId = e.currentTarget.getAttribute("data-id");
            addToCart(prodId);
        });
    });
}

// --- 5. GESTIÓN DEL CARRITO (LÓGICA) ---
function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    // Buscar qué extras están seleccionados para este producto en la interfaz
    const selectedExtras = [];
    const checkboxes = document.querySelectorAll(`input[data-prod-id="${productId}"]:checked`);
    
    checkboxes.forEach(cb => {
        const optId = cb.getAttribute("data-opt-id");
        const option = product.options.find(o => o.id === optId);
        if (option) {
            selectedExtras.push({
                id: option.id,
                label: option.label,
                price: option.price
            });
        }
    });

    // Generar un identificador único para el item en el carrito basado en el id de producto y los extras seleccionados
    const extrasKey = selectedExtras.map(e => e.id).sort().join(",");
    const cartItemId = `${productId}-${extrasKey}`;

    // Comprobar si el mismo paquete con los mismos extras ya está en el carrito
    const existingItem = cart.find(item => item.cartItemId === cartItemId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            cartItemId: cartItemId,
            productId: product.id,
            title: product.title,
            basePrice: product.price,
            period: product.period,
            quantity: 1,
            extras: selectedExtras
        });
    }

    // Desmarcar todos los checkboxes tras añadir al carrito
    document.querySelectorAll(`input[data-prod-id="${productId}"]`).forEach(cb => cb.checked = false);

    // Actualizar visualmente la web
    updateCartUI();
    showToast(`¡${product.title} añadido al carrito!`);
    openCartSidebar();
}

function updateCartUI() {
    const countEl = document.getElementById("cart-count");
    const container = document.getElementById("cart-items-container");
    const totalEl = document.getElementById("cart-total-price");
    const checkoutBtn = document.getElementById("checkout-btn");

    if (cart.length === 0) {
        container.innerHTML = '<div class="cart-empty-msg">Tu carrito está vacío. ¡Elige un plan de servicios arriba para empezar!</div>';
        countEl.textContent = "0";
        totalEl.textContent = "0 €";
        checkoutBtn.disabled = true;
        return;
    }

    // Calcular el total
    let total = 0;
    let totalItems = 0;

    const itemsHtml = cart.map(item => {
        // Calcular precio de este item con sus extras
        const extrasTotal = item.extras.reduce((sum, e) => sum + e.price, 0);
        const itemPriceUnit = item.basePrice + extrasTotal;
        const itemSubtotal = itemPriceUnit * item.quantity;

        total += itemSubtotal;
        totalItems += item.quantity;

        // Generar texto descriptivo de extras
        const extrasText = item.extras.map(e => `+ ${e.label} (+${e.price} €)`).join("<br>");

        return `
            <div class="cart-item">
                <div class="cart-item-main">
                    <span class="cart-item-title">${item.title}</span>
                    <span class="cart-item-price">${itemSubtotal} €</span>
                </div>
                ${item.extras.length > 0 ? `<div class="cart-item-extras">${extrasText}</div>` : ""}
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-cart-id="${item.cartItemId}">-</button>
                        <span class="quantity-val">${item.quantity}</span>
                        <button class="quantity-btn plus" data-cart-id="${item.cartItemId}">+</button>
                    </div>
                    <button class="item-remove-btn" data-cart-id="${item.cartItemId}">Eliminar</button>
                </div>
            </div>
        `;
    }).join("");

    container.innerHTML = itemsHtml;
    countEl.textContent = totalItems;
    totalEl.textContent = `${total} €`;
    checkoutBtn.disabled = false;

    // Registrar listeners para controles de cantidad y eliminar
    document.querySelectorAll(".quantity-btn.plus").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const cId = e.currentTarget.getAttribute("data-cart-id");
            changeQuantity(cId, 1);
        });
    });

    document.querySelectorAll(".quantity-btn.minus").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const cId = e.currentTarget.getAttribute("data-cart-id");
            changeQuantity(cId, -1);
        });
    });

    document.querySelectorAll(".item-remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const cId = e.currentTarget.getAttribute("data-cart-id");
            removeFromCart(cId);
        });
    });
}

function changeQuantity(cartItemId, amount) {
    const item = cart.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        removeFromCart(cartItemId);
    } else {
        updateCartUI();
    }
}

function removeFromCart(cartItemId) {
    const item = cart.find(i => i.cartItemId === cartItemId);
    cart = cart.filter(i => i.cartItemId !== cartItemId);
    updateCartUI();
    if (item) {
        showToast(`Eliminado: ${item.title}`);
    }
}

// --- 6. APERTURA Y CIERRE DEL PANEL DEL CARRITO ---
function initCartDrawer() {
    const toggle = document.getElementById("cart-toggle");
    const close = document.getElementById("cart-close");
    const sidebar = document.getElementById("cart-sidebar");
    const overlay = document.getElementById("cart-sidebar-overlay");

    toggle.addEventListener("click", openCartSidebar);
    close.addEventListener("click", closeCartSidebar);
    overlay.addEventListener("click", closeCartSidebar);
}

function openCartSidebar() {
    document.getElementById("cart-sidebar").classList.add("open");
    document.getElementById("cart-sidebar-overlay").classList.add("active");
}

function closeCartSidebar() {
    document.getElementById("cart-sidebar").classList.remove("open");
    document.getElementById("cart-sidebar-overlay").classList.remove("active");
}

// --- 7. MODAL DE CHECKOUT Y ENVÍO A WHATSAPP ---
function initCheckoutModal() {
    const checkoutBtn = document.getElementById("checkout-btn");
    const closeBtn = document.getElementById("modal-close");
    const modal = document.getElementById("checkout-modal");
    const form = document.getElementById("checkout-form");

    // Abrir Modal
    checkoutBtn.addEventListener("click", () => {
        closeCartSidebar();
        openCheckoutModal();
    });

    // Cerrar Modal
    closeBtn.addEventListener("click", () => {
        modal.classList.remove("open");
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("open");
        }
    });

    // Formulario de Checkout
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (validateCheckoutForm()) {
            sendOrderToWhatsApp();
        }
    });
}

function openCheckoutModal() {
    const modal = document.getElementById("checkout-modal");
    const listEl = document.getElementById("modal-order-summary-list");
    const totalEl = document.getElementById("modal-total-price");

    // Rellenar resumen
    let total = 0;
    const itemsHtml = cart.map(item => {
        const extrasTotal = item.extras.reduce((sum, e) => sum + e.price, 0);
        const itemSubtotal = (item.basePrice + extrasTotal) * item.quantity;
        total += itemSubtotal;

        const extrasLabels = item.extras.map(e => `+ ${e.label}`).join(", ");
        const extrasDesc = item.extras.length > 0 ? `<div style="font-size: 0.8rem; color: var(--text-gray);">${extrasLabels}</div>` : "";

        return `
            <div class="summary-item-row" style="margin-bottom: 12px;">
                <div>
                    <span class="summary-name">${item.title}</span> <small>x${item.quantity}</small>
                    ${extrasDesc}
                </div>
                <span>${itemSubtotal} €</span>
            </div>
        `;
    }).join("");

    listEl.innerHTML = itemsHtml;
    totalEl.textContent = `${total} €`;

    modal.classList.add("open");
}

function validateCheckoutForm() {
    let isValid = true;

    const fields = [
        { id: "checkout-name", errorId: "checkout-name-error", validator: val => val.trim().length > 0 },
        { id: "checkout-business", errorId: "checkout-business-error", validator: val => val.trim().length > 0 },
        { id: "checkout-phone", errorId: "checkout-phone-error", validator: val => /^\+?[0-9\s-]{9,15}$/.test(val.trim()) },
        { id: "checkout-email", errorId: "checkout-email-error", validator: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) }
    ];

    fields.forEach(field => {
        const input = document.getElementById(field.id);
        const error = document.getElementById(field.errorId);
        const group = input.parentElement;

        if (field.validator(input.value)) {
            group.classList.remove("invalid");
        } else {
            group.classList.add("invalid");
            isValid = false;
        }
    });

    return isValid;
}

function sendOrderToWhatsApp() {
    const name = document.getElementById("checkout-name").value.trim();
    const business = document.getElementById("checkout-business").value.trim();
    const phone = document.getElementById("checkout-phone").value.trim();
    const email = document.getElementById("checkout-email").value.trim();
    const notes = document.getElementById("checkout-notes").value.trim();

    // Construir mensaje de WhatsApp
    let message = `🚀 *SOLICITUD DE DIGITALIZACIÓN - GASTROINOVA*\n\n`;
    message += `Hola Gastroinova, quiero solicitar un presupuesto formal para digitalizar mi comercio. Aquí tienes mis datos:\n\n`;
    message += `👤 *Nombre:* ${name}\n`;
    message += `🏢 *Negocio:* ${business}\n`;
    message += `📞 *Teléfono:* ${phone}\n`;
    message += `✉️ *Email:* ${email}\n`;
    if (notes) {
        message += `📝 *Notas:* ${notes}\n`;
    }
    message += `\n─────────────────────\n`;
    message += `🛒 *SERVICIOS CONFIGURADOS:*\n\n`;

    let total = 0;
    cart.forEach((item, index) => {
        const extrasTotal = item.extras.reduce((sum, e) => sum + e.price, 0);
        const unitPrice = item.basePrice + extrasTotal;
        const subtotal = unitPrice * item.quantity;
        total += subtotal;

        message += `${index + 1}. *${item.title}* (x${item.quantity})\n`;
        message += `   • Base: ${item.basePrice} € ${item.period}\n`;
        item.extras.forEach(ext => {
            message += `   • Extra: + ${ext.label} (+${ext.price} €)\n`;
        });
        message += `   *Subtotal:* ${subtotal} €\n\n`;
    });

    message += `─────────────────────\n`;
    message += `💰 *TOTAL ESTIMADO:* ${total} €\n`;
    message += `─────────────────────\n\n`;
    message += `Quedo a la espera de que vuestro equipo se ponga en contacto conmigo para revisar los detalles técnicos. ¡Gracias!`;

    // Codificar para URL
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://api.whatsapp.com/send?phone=${GASTROINOVA_WA_PHONE}&text=${encodedMessage}`;

    // Abrir WhatsApp en pestaña nueva
    window.open(waUrl, "_blank");

    // Limpiar carrito, cerrar modal y dar feedback
    cart = [];
    updateCartUI();
    document.getElementById("checkout-modal").classList.remove("open");
    document.getElementById("checkout-form").reset();
    showToast("¡Pedido enviado por WhatsApp con éxito!");
}



// --- 9. FORMULARIO DE CONTACTO EN LA LANDING ---
function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Validación básica
        let isValid = true;
        const nameInput = document.getElementById("contact-name");
        const emailInput = document.getElementById("contact-email");
        
        // Validar Nombre
        if (nameInput.value.trim().length === 0) {
            nameInput.parentElement.classList.add("invalid");
            isValid = false;
        } else {
            nameInput.parentElement.classList.remove("invalid");
        }

        // Validar Email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
            emailInput.parentElement.classList.add("invalid");
            isValid = false;
        } else {
            emailInput.parentElement.classList.remove("invalid");
        }

        if (isValid) {
            // Simular envío exitoso
            showToast("¡Mensaje recibido! Te contactaremos muy pronto.");
            form.reset();
        }
    });
}

// --- 10. MENSAJES TOAST (FEEDBACK) ---
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
}
