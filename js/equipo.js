
// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 100);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.08 });
reveals.forEach(el => observer.observe(el));

// Cruz / menú mobile
const crossBtn = document.getElementById('crossBtn');
const navOverlay = document.getElementById('navOverlay');

crossBtn.addEventListener('click', () => {
    const isOpen = navOverlay.classList.toggle('open');
    crossBtn.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Cerrar al hacer clic en cualquier enlace del overlay
navOverlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navOverlay.classList.remove('open');
        crossBtn.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// Cerrar con Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        navOverlay.classList.remove('open');
        crossBtn.classList.remove('open');
        document.body.style.overflow = '';
    }
});
