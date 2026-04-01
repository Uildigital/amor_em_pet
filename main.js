// =========================================
// PREMIUM CURTAIN INTRO
// =========================================
(function () {
    const preloader = document.getElementById('preloader');
    const splashLogo = document.getElementById('splashLogo');
    const splashPct  = document.getElementById('splashPct');
    const splashNum  = document.getElementById('splashNum');
    const splashFill = document.getElementById('splashFill');
    if (!preloader) return;

    // --- Paw particles ---
    const PAWS = ['🐾'];
    const pawsContainer = [];
    for (let i = 0; i < 12; i++) {
        const paw = document.createElement('span');
        paw.className = 'paw-particle';
        paw.textContent = PAWS[0];
        const x = 10 + Math.random() * 80;
        const y = 15 + Math.random() * 70;
        const dur = (2 + Math.random() * 2).toFixed(2);
        const delay = (Math.random() * 2.5).toFixed(2);
        const rot = (Math.random() * 60 - 30).toFixed(0);
        paw.style.cssText = `left:${x}%;top:${y}%;--dur:${dur}s;--delay:${delay}s;--rot:${rot}deg;`;
        document.body.appendChild(paw);
        pawsContainer.push(paw);
    }

    // --- Counter animation ---
    let count = 0;
    const total = 100;
    const duration = 2000; // ms
    const interval = duration / total;
    const counter = setInterval(() => {
        count++;
        if (splashNum)  splashNum.textContent  = count;
        if (splashFill) splashFill.style.width = count + '%';
        if (count >= total) clearInterval(counter);
    }, interval);

    // Fire exit after ~2.3s (counter done + small pause)
    setTimeout(exitIntro, 2400);

    // Fallback: fire on window load if page loads fast
    window.addEventListener('load', () => {
        if (count < total) {
            clearInterval(counter);
            if (splashNum)  splashNum.textContent  = 100;
            if (splashFill) splashFill.style.width = '100%';
        }
        setTimeout(exitIntro, Math.max(0, 2400 - performance.now()));
    }, { once: true });

    // --- Exposed Trigger for Page Content ---
    window.addEventListener('preloader_finished', () => {
        initHeroAnimations();
    });
    
    function exitIntro() {
        preloader.classList.add('exit');
        pawsContainer.forEach(p => p.style.opacity = '0');
        setTimeout(() => {
            preloader.classList.add('gone');
            splashLogo?.remove();
            splashPct?.remove();
            pawsContainer.forEach(p => p.remove());
            window.dispatchEvent(new CustomEvent('preloader_finished'));
        }, 1200);
    }
}());

// =========================================
// CINEMATIC HERO ANIMATIONS (GSAP)
// =========================================
function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({
        defaults: { ease: "power4.out", duration: 1.2 }
    });

    // 1. Bg Zoom Out
    tl.to(".hero-main-bg", {
        scale: 1,
        duration: 3,
        ease: "power2.out"
    }, 0);

    // 2. Eyebrow
    tl.to(".hero-eyebrow-v2", {
        opacity: 1,
        y: 0,
        duration: 1
    }, 0.5);

    // 3. Title Lines (Staggered)
    tl.to(".title-line", {
        opacity: 1,
        y: 0,
        stagger: 0.15,
    }, "-=0.8");

    // 4. Description
    tl.to(".hero-desc-v2", {
        opacity: 1,
        y: 0,
    }, "-=0.9");

    // 5. Buttons & Stats
    tl.to([".hero-btns-v2", ".hero-stats-glass"], {
        opacity: 1,
        y: 0,
        stagger: 0.2
    }, "-=0.7");

    // 6. Header Slide Down
    tl.fromTo("#main-header", 
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 }, 
        "-=1"
    );

    // 7. Scroll Indicator
    tl.to(".scroll-down", {
        opacity: 1,
        duration: 1
    }, "-=0.5");
}


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

// Subtle Parallax on Hero (mouse movement)
const heroBg = document.querySelector('.hero-main-bg');
const heroContent = document.querySelector('.hero-content-v2');

if (heroBg && window.innerWidth > 1024) {
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 15;
        
        // Move background slightly opposite to mouse
        gsap.to(heroBg, {
            x: -x * 0.5,
            y: -y * 0.5,
            rotation: x * 0.01,
            duration: 1,
            ease: "power2.out"
        });

        // Move content slightly with mouse
        gsap.to(heroContent, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 1.5,
            ease: "power2.out"
        });
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
