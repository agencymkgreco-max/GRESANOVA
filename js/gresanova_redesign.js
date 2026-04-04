/**
 * CURSOR PERSONALIZADO Y ANILLO
 * Mantiene el efecto de seguimiento suavizado y escalado.
 */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0; // Posición real del mouse
let ringX = 0, ringY = 0;   // Posición del anillo con retraso

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // El cursor pequeño sigue al mouse instantáneamente (-6 para centrarlo)
    cursor.style.left = `${mouseX - 6}px`;
    cursor.style.top = `${mouseY - 6}px`;
});

const animateRing = () => {
    // Interpolación lineal del 12% para el efecto de suavizado
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    
    // Posicionamiento del anillo (-18 para centrarlo)
    ring.style.left = `${ringX - 18}px`;
    ring.style.top = `${ringY - 18}px`;
    
    requestAnimationFrame(animateRing);
};
animateRing();

// Eventos de hover para elementos interactivos
const interactiveElements = document.querySelectorAll('a, button, .service-card, .value-item, .impacto-card');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
        ring.style.transform = 'scale(1.5)';
        ring.style.borderColor = 'rgba(0, 212, 255, 0.8)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        ring.style.transform = 'scale(1)';
        ring.style.borderColor = 'rgba(0, 212, 255, 0.5)';
    });
});

/**
 * SISTEMA DE PARTÍCULAS (FONDO CANVAS)
 */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let width, height;

const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
};
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.color = Math.random() > 0.5 ? '0,212,255' : '26,108,246';
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        // Reinicia si sale de los límites
        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
        ctx.fill();
    }
}

const particles = [];
for (let i = 0; i < 120; i++) {
    particles.push(new Particle());
}

const drawLines = () => {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0,212,255,${0.08 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
};

const animateCanvas = () => {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    drawLines();
    requestAnimationFrame(animateCanvas);
};
animateCanvas();

/**
 * FLUJO DE DATOS (DATA STREAMS)
 */
const streamContainer = document.getElementById('dataStreams');

const createStream = () => {
    const el = document.createElement('div');
    const duration = Math.random() * 4 + 3;
    
    el.className = 'stream-line';
    el.style.left = `${Math.random() * 100}vw`;
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${Math.random() * 5}s`;
    el.style.opacity = Math.random() * 0.3 + 0.05;
    el.style.height = `${Math.random() * 100 + 50}px`;
    
    streamContainer.appendChild(el);
    // Elimina el elemento después de que termina la animación
    setTimeout(() => el.remove(), (duration + 5) * 1000);
};
setInterval(createStream, 600);

/**
 * CONTADORES NUMÉRICOS ANIMADOS
 */
const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const startTime = Date.now();

    const update = () => {
        const progress = Math.min((Date.now() - startTime) / duration, 1);
        const easing = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
        
        el.textContent = Math.round(easing * target);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // Añade el sufijo correspondiente al terminar
            el.textContent = target + (el.classList.contains('stat-number') ? '+' : '%');
        }
    };
    update();
};

// Observador para activar animaciones al hacer scroll
const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = true;
            animateCounter(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number, .counter-val').forEach(c => counterObserver.observe(c));

// Observador para revelar la línea de tiempo
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.2 });

document.querySelectorAll('.timeline-item').forEach(el => revealObserver.observe(el));

/**
 * FORMULARIO DE CONTACTO
 */
function handleSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.form-submit');
    
    btn.textContent = 'ENVIANDO...';
    btn.style.opacity = '0.6';

    setTimeout(() => {
        btn.textContent = '✓ MENSAJE ENVIADO';
        btn.style.background = 'rgba(37,211,102,0.2)';
        btn.style.color = '#25d366';
        e.target.reset();

        setTimeout(() => {
            btn.textContent = 'Enviar Mensaje →';
            btn.style.background = '';
            btn.style.color = '';
            btn.style.opacity = '1';
        }, 3000);
    }, 1500);
}

/**
 * NAVEGACIÓN Y MENÚ MÓVIL
 */
const mainNav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
    mainNav.classList.toggle('scrolled', window.scrollY > 60);
});

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
});

mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

/**
 * EFECTO GLITCH DEL LOGO
 */
const logoText = document.getElementById('logoText');
const scheduleGlitch = () => {
    setTimeout(() => {
        logoText.classList.add('glitching');
        logoText.addEventListener('animationend', () => {
            logoText.classList.remove('glitching');
            scheduleGlitch();
        }, { once: true });
    }, 3500 + Math.random() * 5500);
};
scheduleGlitch();