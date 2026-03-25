// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 1200);
});

// Mobile Drawer
const menuToggle = document.querySelector('.mobile-menu-toggle');
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');

function openDrawer() {
    mobileDrawer?.classList.add('open');
    drawerOverlay?.classList.add('open');
    menuToggle?.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeDrawer() {
    mobileDrawer?.classList.remove('open');
    drawerOverlay?.classList.remove('open');
    menuToggle?.classList.remove('open');
    document.body.style.overflow = '';
}

menuToggle?.addEventListener('click', () => {
    mobileDrawer?.classList.contains('open') ? closeDrawer() : openDrawer();
});

drawerOverlay?.addEventListener('click', closeDrawer);

document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
});

// Sticky / Transparent Header on Scroll
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, { passive: true });

// Scroll Reveal (Intersection Observer)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.breed-card, .about-img, .about-text, .section-header, .value-item, .hero-stats').forEach(el => {
    el.classList.add('reveal-init');
    observer.observe(el);
});

// Subtle Parallax on Hero Image (mouse movement)
const heroImg = document.querySelector('.image-frame img');
if (heroImg && window.innerWidth > 1024) {
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 12;
        const y = (e.clientY / window.innerHeight - 0.5) * 8;
        heroImg.style.transform = `translate(${x}px, ${y}px) scale(1.04)`;
    }, { passive: true });
}

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 100) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${current}` 
            ? 'var(--gold-light)' 
            : '';
    });
}, { passive: true });
