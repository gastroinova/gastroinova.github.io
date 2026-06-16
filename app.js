/* ==========================================================================
   GASTROINOVA - LOGICA DE LA APLICACION
   Microinteracciones, scroll cinematografico y formularios de contacto
   ========================================================================== */

const GASTROINOVA_CONTACT_EMAIL = "info@gastroinova.com";

document.addEventListener("DOMContentLoaded", () => {
    initHeaderScroll();
    initMobileMenu();
    initHeroTyping();
    initScrollProgress();
    initScrollReveal();
    initStatsCounter();
    initParallaxHero();
    initInteractiveSurfaces();
    initMagneticButtons();
    initSectionSpy();
    initContactForm();
});

function initHeaderScroll() {
    const header = document.querySelector(".main-header");
    if (!header) return;

    const updateHeader = () => {
        header.classList.toggle("scrolled", window.scrollY > 50);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
}

function initMobileMenu() {
    const toggle = document.getElementById("mobile-menu-toggle");
    const overlay = document.getElementById("mobile-menu-overlay");
    const links = document.querySelectorAll(".mobile-nav-link");
    if (!toggle || !overlay) return;

    const toggleMenu = () => {
        const isOpen = toggle.classList.toggle("open");
        overlay.classList.toggle("open", isOpen);
        document.body.style.overflow = isOpen ? "hidden" : "";
    };

    toggle.addEventListener("click", toggleMenu);
    links.forEach(link => link.addEventListener("click", () => {
        if (overlay.classList.contains("open")) toggleMenu();
    }));
}

function initHeroTyping() {
    const element = document.getElementById("typing-text");
    if (!element) return;

    const words = [
        "se mueva con personalidad.",
        "atraiga mas clientes.",
        "transmita valor al instante.",
        "convierta mejor cada visita."
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        element.textContent = isDeleting
            ? currentWord.substring(0, charIndex - 1)
            : currentWord.substring(0, charIndex + 1);

        charIndex += isDeleting ? -1 : 1;

        let typingSpeed = isDeleting ? 42 : 78;

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 1400;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 420;
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 800);
}

function initScrollProgress() {
    const progressBar = document.getElementById("scroll-progress");
    if (!progressBar) return;

    const updateProgress = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        progressBar.style.transform = `scaleX(${Math.min(progress, 100) / 100})`;
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
}

function initScrollReveal() {
    const selectors = [
        ".section-header",
        ".stat-card",
        ".service-card",
        ".experience-panel",
        ".workflow-card",
        ".contact-item",
        ".contact-form-block",
        ".footer-brand",
        ".footer-links",
        ".footer-contact"
    ];

    const elements = document.querySelectorAll(selectors.join(", "));
    elements.forEach((element, index) => {
        element.classList.add("reveal");
        element.style.setProperty("--reveal-delay", `${(index % 4) * 0.08}s`);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px"
    });

    elements.forEach(element => observer.observe(element));
}

function initStatsCounter() {
    const statNumbers = document.querySelectorAll(".stat-number");
    if (statNumbers.length === 0) return;

    const parseStat = (value) => {
        if (value.includes("/")) {
            return { type: "text", value };
        }

        const match = value.match(/([+]?)(\d+)([%x]?)/);
        if (!match) {
            return { type: "text", value };
        }

        return {
            type: "number",
            prefix: match[1] || "",
            number: Number(match[2]),
            suffix: match[3] || ""
        };
    };

    const animateCounter = (element) => {
        const config = parseStat(element.dataset.target || element.textContent.trim());
        if (config.type !== "number") return;

        const duration = 1800;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(config.number * eased);
            element.textContent = `${config.prefix}${current}${config.suffix}`;

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };

        requestAnimationFrame(tick);
    };

    statNumbers.forEach(element => {
        element.dataset.target = element.textContent.trim();
        const config = parseStat(element.dataset.target);
        if (config.type === "number") {
            element.textContent = `${config.prefix}0${config.suffix}`;
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    statNumbers.forEach(element => {
        if (!element.dataset.target.includes("/")) {
            observer.observe(element);
        }
    });
}

function initParallaxHero() {
    const hero = document.querySelector(".hero-section");
    const heroCard = document.querySelector(".hero-card");
    const glow = document.querySelector(".hero-bg-glow");
    if (!hero || !heroCard || !glow) return;

    window.addEventListener("scroll", () => {
        const offset = Math.min(window.scrollY, 500);
        heroCard.style.transform = `perspective(1000px) rotateY(${offset * -0.012}deg) rotateX(${4 - offset * 0.004}deg) translateY(${offset * 0.08}px)`;
        glow.style.transform = `translate3d(0, ${offset * 0.18}px, 0) scale(${1 + offset * 0.00045})`;
    }, { passive: true });

    hero.addEventListener("pointermove", (event) => {
        const bounds = hero.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        hero.style.setProperty("--hero-mouse-x", x.toFixed(3));
        hero.style.setProperty("--hero-mouse-y", y.toFixed(3));
    });
}

function initInteractiveSurfaces() {
    const surfaces = document.querySelectorAll(".interactive-surface");

    surfaces.forEach(surface => {
        surface.addEventListener("pointermove", (event) => {
            const bounds = surface.getBoundingClientRect();
            const x = event.clientX - bounds.left;
            const y = event.clientY - bounds.top;
            const rotateX = ((y / bounds.height) - 0.5) * -8;
            const rotateY = ((x / bounds.width) - 0.5) * 10;

            surface.style.setProperty("--spotlight-x", `${x}px`);
            surface.style.setProperty("--spotlight-y", `${y}px`);
            surface.style.setProperty("--surface-rotate-x", `${rotateX.toFixed(2)}deg`);
            surface.style.setProperty("--surface-rotate-y", `${rotateY.toFixed(2)}deg`);
        });

        surface.addEventListener("pointerleave", () => {
            surface.style.setProperty("--surface-rotate-x", "0deg");
            surface.style.setProperty("--surface-rotate-y", "0deg");
            surface.style.setProperty("--spotlight-x", "50%");
            surface.style.setProperty("--spotlight-y", "50%");
        });
    });
}

function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll(".magnetic-btn");

    magneticButtons.forEach(button => {
        button.addEventListener("pointermove", (event) => {
            const bounds = button.getBoundingClientRect();
            const x = event.clientX - bounds.left - bounds.width / 2;
            const y = event.clientY - bounds.top - bounds.height / 2;

            button.style.transform = `translate(${x * 0.14}px, ${y * 0.18}px)`;
        });

        button.addEventListener("pointerleave", () => {
            button.style.transform = "";
        });
    });
}

function initSectionSpy() {
    const links = [...document.querySelectorAll(".nav-link")];
    const sections = links
        .map(link => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            links.forEach(link => {
                link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
            });
        });
    }, {
        threshold: 0.45
    });

    sections.forEach(section => observer.observe(section));
}

function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const nameInput = document.getElementById("contact-name");
        const emailInput = document.getElementById("contact-email");
        const phoneInput = document.getElementById("contact-phone");
        const messageInput = document.getElementById("contact-message");

        let isValid = true;

        if (nameInput.value.trim().length === 0) {
            nameInput.parentElement.classList.add("invalid");
            isValid = false;
        } else {
            nameInput.parentElement.classList.remove("invalid");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
            emailInput.parentElement.classList.add("invalid");
            isValid = false;
        } else {
            emailInput.parentElement.classList.remove("invalid");
        }

        if (!isValid) return;

        const subject = `Nuevo contacto web - ${nameInput.value.trim()}`;
        let body = "Hola Gastroinova,\n\n";
        body += "Quiero mas informacion sobre vuestros servicios.\n\n";
        body += `Nombre: ${nameInput.value.trim()}\n`;
        body += `Email: ${emailInput.value.trim()}\n`;

        if (phoneInput.value.trim()) {
            body += `Telefono: ${phoneInput.value.trim()}\n`;
        }

        if (messageInput.value.trim()) {
            body += `Mensaje: ${messageInput.value.trim()}\n`;
        }

        window.location.href = `mailto:${GASTROINOVA_CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        showToast("Tu mensaje se ha preparado en tu correo.");
        form.reset();
    });
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
}
