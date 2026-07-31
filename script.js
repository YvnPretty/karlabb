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

    // --- CANVAS INTERACTIVO (Fondo Hero) ---
    try {
        const canvas = document.getElementById('bg-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let width, height;
            let particles = [];

            function resize() {
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
            }
            window.addEventListener('resize', resize);
            resize(); // Llamada inicial

            let mouse = { x: -1000, y: -1000 };
            document.addEventListener('mousemove', (e) => {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            });
            document.addEventListener('mouseleave', () => {
                mouse.x = -1000;
                mouse.y = -1000;
            });

            class Particle {
                constructor() {
                    this.x = Math.random() * width;
                    this.y = Math.random() * height;
                    this.size = Math.random() * 20 + 15; // Tamaño aún más grande (Gama Plus)
                    this.baseX = this.x;
                    this.baseY = this.y;
                    this.density = (Math.random() * 15) + 5;
                    this.imageIndex = Math.floor(Math.random() * 11); // 11 charms en total
                    this.angle = Math.random() * 360; // Para rotación
                    this.rotationSpeed = (Math.random() - 0.5) * 2;
                    this.opacity = Math.random() * 0.5 + 0.3; // 0.3 a 0.8
                }

                draw() {
                    ctx.save();
                    ctx.globalAlpha = this.opacity;
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.angle * Math.PI / 180);
                    
                    // Dibujar charm (sin fotos polaroids)
                    if (window.particleImages && window.particleImages[this.imageIndex] && window.particleImages[this.imageIndex].complete) {
                        const img = window.particleImages[this.imageIndex];
                        const renderSize = this.size * 2.5;
                        
                        // Estilo suelto para los charms transparentes (más elegante)
                        ctx.shadowColor = 'rgba(0,0,0,0.2)';
                        ctx.shadowBlur = 10;
                        ctx.shadowOffsetY = 5;
                        
                        ctx.drawImage(img, -renderSize/2, -renderSize/2, renderSize, renderSize);
                    } else {
                        // Fallback temporal si la imagen no ha cargado
                        ctx.fillStyle = '#E5C0C8'; // Color blush premium
                        ctx.beginPath();
                        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    ctx.restore();
                }

                update() {
                    this.angle += this.rotationSpeed; // Actualizar rotación
                    
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let maxDistance = 250; // Gran radio de interacción
                    
                    if (distance < maxDistance) {
                        let forceDirectionX = dx / distance;
                        let forceDirectionY = dy / distance;
                        let force = (maxDistance - distance) / maxDistance;
                        let directionX = forceDirectionX * force * this.density;
                        let directionY = forceDirectionY * force * this.density;
                        
                        this.x -= directionX;
                        this.y -= directionY;
                    } else {
                        // Retorno suave a su trayectoria
                        if (this.x !== this.baseX) {
                            this.x -= (this.x - this.baseX) / 20;
                        }
                        if (this.y !== this.baseY) {
                            this.y -= (this.y - this.baseY) / 20;
                        }
                    }

                    // Flote constante hacia arriba
                    this.baseY -= 1; // Más rápido para que sea obvio
                    if (this.baseY < -50) {
                        this.baseY = height + 50;
                        this.baseX = Math.random() * width;
                        this.x = this.baseX;
                        this.y = this.baseY;
                    }
                }
            }

            // Precargar solo Charms
            window.particleImages = [];
            const imageUrls = [
                'assets/charm1.png', 
                'assets/charm2.png', 
                'assets/charm3.png', 
                'assets/charm4.png', 
                'assets/charm5.png', 
                'assets/charm6.png', 
                'assets/charm7.png', 
                'assets/charm8.png', 
                'assets/charm9.png', 
                'assets/charm10.png', 
                'assets/charm11.png'
            ];
            imageUrls.forEach(url => {
                const img = new Image();
                img.src = url;
                window.particleImages.push(img);
            });

            function init() {
                resize(); // Asegurar tamaño justo antes de crear partículas
                particles = [];
                let numberOfParticles = Math.min((width * height) / 12000, 40); // Menos partículas porque son fotos reales
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

            // Iniciar de forma segura
            setTimeout(() => {
                init();
                animate();
            }, 500); // Dar más tiempo al DOM/CSS para renderizar
        }
    } catch (e) {
        console.error("Error en canvas interactivo:", e);
    }
});


// --- Lógica del Visor de Catálogo (Lightbox Modal) ---
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.modal-close');
    const galleryImages = document.querySelectorAll('.gallery-img');

    // Abrir modal al hacer clic en imagen
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = 'block';
            // Pequeño timeout para que la transición de opacidad funcione
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            modalImg.src = this.src;
        });
    });

    // Cerrar modal al hacer clic en la X
    closeBtn.addEventListener('click', closeModal);

    // Cerrar con click fuera
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Esperar a que termine la transición
    }
});

// --- Lógica de Reseñas (Local Storage) ---
document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('reviewForm');
    const reviewsContainer = document.getElementById('reviewsContainer');
    const STORAGE_KEY = 'karillusion_reviews';

    // Función para crear tarjeta de reseña
    function createReviewCard(name, rating, text) {
        const div = document.createElement('div');
        div.className = 'review-card';
        const stars = '⭐'.repeat(rating);
        div.innerHTML = `
            <div class="review-header">
                <span class="review-name">${name}</span>
                <span class="review-stars">${stars}</span>
            </div>
            <p class="review-text">"${text}"</p>
        `;
        return div;
    }

    // Cargar reseñas guardadas
    function loadReviews() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const reviews = JSON.parse(saved);
            reviews.forEach(r => {
                reviewsContainer.insertBefore(createReviewCard(r.name, r.rating, r.text), reviewsContainer.firstChild);
            });
        }
    }

    if(reviewForm) {
        loadReviews();

        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reviewName').value;
            const rating = parseInt(document.getElementById('reviewRating').value);
            const text = document.getElementById('reviewText').value;

            // Mostrar en pantalla inmediatamente
            const card = createReviewCard(name, rating, text);
            reviewsContainer.insertBefore(card, reviewsContainer.firstChild);

            // Guardar en LocalStorage
            const saved = localStorage.getItem(STORAGE_KEY);
            const reviews = saved ? JSON.parse(saved) : [];
            reviews.push({name, rating, text});
            localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));

            // Limpiar form y agradecer
            reviewForm.reset();
            alert('¡Gracias por tu reseña! Significa mucho para nosotros.');
        });
    }
});

// --- Lógica del Botón Mágico (Barniz de Uñas) ---
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const docEl = document.documentElement;
    const THEME_KEY = 'karillusion_theme';

    function setTheme(theme) {
        if (theme === 'dark') {
            docEl.classList.add('dark-theme');
            if(themeIcon) themeIcon.src = 'assets/polish_dark.png';
        } else {
            docEl.classList.remove('dark-theme');
            if(themeIcon) themeIcon.src = 'assets/polish_light.png';
        }
        localStorage.setItem(THEME_KEY, theme);
    }

    // Inicializar
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    setTheme(savedTheme);

    // Evento Click
    if(themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = docEl.classList.contains('dark-theme') ? 'dark' : 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // Animación de rebote al hacer click
            themeIcon.style.transform = 'scale(0.8)';
            setTimeout(() => {
                setTheme(newTheme);
                themeIcon.style.transform = 'scale(1.2) rotate(-10deg)';
                setTimeout(() => {
                    themeIcon.style.transform = '';
                }, 200);
            }, 150);
        });
    }

    // --- Animaciones Scroll Fade-Up ---
    const fadeElements = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    fadeElements.forEach(el => observer.observe(el));
});
