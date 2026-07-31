document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    const navbar = document.querySelector('.navbar');

    // Toggle Menú Móvil
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        // Prevenir scroll cuando el menú está abierto
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });

    // Cerrar Menú Móvil al hacer clic en un enlace
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Efecto sutil en la Navbar al hacer scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '0.5rem var(--spacing-sm)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.padding = '1.5rem var(--spacing-sm)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Intersection Observer para animaciones al hacer scroll (Fade In)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Seleccionar elementos para animar
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (!section.classList.contains('hero')) {
            section.style.opacity = 0;
            section.style.transform = 'translateY(40px)'; // Mayor distancia para más dramatismo
            section.style.transition = 'opacity 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            observer.observe(section);
        }
    });

    // --- SCROLL LENTO (Smooth Scroll Premium) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            // Calcular posición teniendo en cuenta la altura del navbar fijo
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1500; // 1.5 segundos para un scroll verdaderamente "lento" y elegante
            let start = null;

            function step(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                
                // Función de aceleración suave (easeInOutQuart)
                const easeInOutQuart = progress < duration / 2
                    ? 8 * Math.pow(progress / duration, 4)
                    : 1 - Math.pow(-2 * (progress / duration) + 2, 4) / 2;
                
                window.scrollTo(0, startPosition + distance * easeInOutQuart);
                
                if (progress < duration) {
                    window.requestAnimationFrame(step);
                } else {
                    window.history.pushState(null, null, targetId);
                }
            }
            window.requestAnimationFrame(step);
        });
    });

    // --- CANVAS INTERACTIVO (Fondo Hero - Efecto Agua/Partículas) ---
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = document.querySelector('.hero').offsetHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        let mouse = { x: -1000, y: -1000 };
        document.querySelector('.hero').addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY - document.querySelector('.hero').getBoundingClientRect().top;
        });
        document.querySelector('.hero').addEventListener('mouseleave', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 16 + 8; // Tamaño más grande (8 a 24) para que se vean sí o sí
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 20) + 1;
                this.type = Math.floor(Math.random() * 3); // 0: gota, 1: destello, 2: círculo
                this.angle = Math.random() * 360;
                this.rotationSpeed = (Math.random() - 0.5) * 2;
                this.opacity = Math.random() * 0.5 + 0.3; // Más opacidad para ser visible
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle * Math.PI / 180);
                ctx.fillStyle = '#d4af37'; // Color dorado de la marca
                
                ctx.beginPath();
                if (this.type === 0) {
                    // Gota invertida (Spa)
                    ctx.moveTo(0, -this.size);
                    ctx.bezierCurveTo(this.size, 0, this.size, this.size, 0, this.size);
                    ctx.bezierCurveTo(-this.size, this.size, -this.size, 0, 0, -this.size);
                    ctx.fill();
                } else if (this.type === 1) {
                    // Destello / Estrella (Fino)
                    ctx.moveTo(0, -this.size);
                    ctx.quadraticCurveTo(0, 0, this.size, 0);
                    ctx.quadraticCurveTo(0, 0, 0, this.size);
                    ctx.quadraticCurveTo(0, 0, -this.size, 0);
                    ctx.quadraticCurveTo(0, 0, 0, -this.size);
                    ctx.fill();
                } else {
                    // Círculo / Burbuja
                    ctx.arc(0, 0, this.size / 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            }

            update() {
                this.angle += this.rotationSpeed;
                
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let maxDistance = 200; // Radio de interacción más grande
                let force = (maxDistance - distance) / maxDistance;
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;

                if (distance < maxDistance) {
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    if (this.x !== this.baseX) {
                        let dx = this.x - this.baseX;
                        this.x -= dx / 20;
                    }
                    if (this.y !== this.baseY) {
                        let dy = this.y - this.baseY;
                        this.y -= dy / 20;
                    }
                }

                this.baseY -= 0.5; // Flotan hacia arriba más rápido
                if (this.baseY < -50) {
                    this.baseY = height + 50;
                    this.baseX = Math.random() * width;
                    this.x = this.baseX;
                    this.y = this.baseY;
                }
            }
        }

        function init() {
            particles = [];
            let numberOfParticles = (width * height) / 8000; // Más densidad de partículas
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            requestAnimationFrame(animate);
        }

        setTimeout(() => {
            init();
            animate();
        }, 300);
    }
});
