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
    // --- CANVAS INTERACTIVO (Fondo Hero - Efecto Agua/Partículas) ---
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        // Cargar SVG estéticos (minimalistas y finos)
        const svgNail = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="1.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>');
        const svgSparkle = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="1"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/></svg>');
        const svgDrop = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="1.5"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>');
        
        const images = [];
        [svgNail, svgSparkle, svgDrop].forEach(src => {
            const img = new Image();
            img.src = src;
            images.push(img);
        });

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
                this.size = Math.random() * 15 + 10;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 20) + 1;
                this.img = images[Math.floor(Math.random() * images.length)];
                this.angle = Math.random() * 360;
                this.rotationSpeed = (Math.random() - 0.5);
                this.opacity = Math.random() * 0.4 + 0.1; // Sutil y fino
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle * Math.PI / 180);
                if (this.img.complete) {
                    ctx.drawImage(this.img, -this.size / 2, -this.size / 2, this.size, this.size);
                }
                ctx.restore();
            }

            update() {
                this.angle += this.rotationSpeed;
                
                // Efecto "agua" al pasar el cursor
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let maxDistance = 150;
                let force = (maxDistance - distance) / maxDistance;
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;

                if (distance < maxDistance) {
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    if (this.x !== this.baseX) {
                        let dx = this.x - this.baseX;
                        this.x -= dx / 50;
                    }
                    if (this.y !== this.baseY) {
                        let dy = this.y - this.baseY;
                        this.y -= dy / 50;
                    }
                }

                // Flotar hacia arriba suavemente
                this.baseY -= 0.3;
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
            let numberOfParticles = (width * height) / 12000;
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
