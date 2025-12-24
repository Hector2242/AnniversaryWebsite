/**
 * Hector & Kaylee - Anniversary Website
 * Main JavaScript File
 *
 * Features:
 * - Floating hearts canvas animation
 * - Love timer countdown
 * - Smooth scroll navigation
 * - Gallery with filtering and lightbox
 * - Stat counter animations
 * - Monkey mascot with fun facts
 * - Music player toggle
 */

// ==========================================================================
// Configuration
// ==========================================================================

const CONFIG = {
    weddingMode: false, // Set to true when engaged
    startDate: new Date(2022, 10, 27, 19, 40), // November 27, 2022, 7:40 PM
    hearts: {
        count: 50,
        colors: ['#ff6b6b', '#ff8787', '#ffa8a8', '#ffc9c9', '#ffe3e3', '#d4af37']
    },
    monkeyFacts: [
        "Welcome to Hector & Kaylee's love story!",
        "Fun fact: They've been together for over 750 days!",
        "Kaylee's favorite anime? JoJo's, obviously!",
        "They survived their first escape room together!",
        "Pierce The Veil concert was LEGENDARY!",
        "The Idaho Potato at the fair was 100% worth it!",
        "Those organic drinks at the gardens? Never again!",
        "Monkeys are Kaylee's spirit animal!",
        "Their love story started November 27, 2022",
        "They've watched JoJo's through ALL the parts!"
    ]
};

// ==========================================================================
// Utility Functions
// ==========================================================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return '∞';
    }
    return num.toLocaleString();
}

// ==========================================================================
// Floating Hearts Canvas
// ==========================================================================

class HeartsCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.hearts = [];
        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.hearts = [];
        for (let i = 0; i < CONFIG.hearts.count; i++) {
            this.hearts.push(this.createHeart());
        }
    }

    createHeart(fromTop = false) {
        return {
            x: randomRange(0, this.canvas.width),
            y: fromTop ? -20 : randomRange(0, this.canvas.height),
            size: randomRange(8, 25),
            speedY: randomRange(0.2, 0.8),
            speedX: randomRange(-0.2, 0.2),
            opacity: randomRange(0.3, 0.7),
            rotation: randomRange(0, Math.PI * 2),
            rotationSpeed: randomRange(-0.02, 0.02),
            color: CONFIG.hearts.colors[Math.floor(Math.random() * CONFIG.hearts.colors.length)]
        };
    }

    drawHeart(x, y, size, rotation, opacity, color) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        this.ctx.globalAlpha = opacity;

        this.ctx.beginPath();
        const topCurveHeight = size * 0.3;
        this.ctx.moveTo(0, topCurveHeight);

        // Left curve
        this.ctx.bezierCurveTo(
            0, 0,
            -size / 2, 0,
            -size / 2, topCurveHeight
        );
        this.ctx.bezierCurveTo(
            -size / 2, size * 0.55,
            0, size * 0.75,
            0, size
        );

        // Right curve
        this.ctx.bezierCurveTo(
            0, size * 0.75,
            size / 2, size * 0.55,
            size / 2, topCurveHeight
        );
        this.ctx.bezierCurveTo(
            size / 2, 0,
            0, 0,
            0, topCurveHeight
        );

        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.restore();
    }

    update() {
        this.hearts.forEach((heart, index) => {
            heart.y -= heart.speedY;
            heart.x += heart.speedX;
            heart.rotation += heart.rotationSpeed;

            // Reset heart when it goes off screen
            if (heart.y < -heart.size * 2) {
                this.hearts[index] = this.createHeart(true);
                this.hearts[index].y = this.canvas.height + 20;
            }
        });
    }

    draw() {
        // Create gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#2d1f3d');
        gradient.addColorStop(1, '#1a1a2e');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw hearts
        this.hearts.forEach(heart => {
            this.drawHeart(heart.x, heart.y, heart.size, heart.rotation, heart.opacity, heart.color);
        });
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// ==========================================================================
// Love Timer
// ==========================================================================

class LoveTimer {
    constructor() {
        this.elements = {
            days: $('#timerDays'),
            hours: $('#timerHours'),
            minutes: $('#timerMinutes'),
            seconds: $('#timerSeconds'),
            statDays: $('#statDays')
        };

        this.update();
        setInterval(() => this.update(), 1000);
    }

    update() {
        const now = new Date();
        const diff = now - CONFIG.startDate;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (this.elements.days) {
            this.elements.days.textContent = days;
        }
        if (this.elements.hours) {
            this.elements.hours.textContent = hours.toString().padStart(2, '0');
        }
        if (this.elements.minutes) {
            this.elements.minutes.textContent = minutes.toString().padStart(2, '0');
        }
        if (this.elements.seconds) {
            this.elements.seconds.textContent = seconds.toString().padStart(2, '0');
        }
        if (this.elements.statDays) {
            this.elements.statDays.textContent = days;
        }
    }
}

// ==========================================================================
// Navigation
// ==========================================================================

class Navigation {
    constructor() {
        this.nav = $('#mainNav');
        this.toggle = $('#navToggle');
        this.links = $('#navLinks');
        this.navLinks = $$('.nav-link');
        this.sections = $$('section');

        this.init();
    }

    init() {
        // Scroll handler
        window.addEventListener('scroll', () => this.onScroll());

        // Mobile menu toggle
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
        }

        // Close menu when clicking a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.links.classList.remove('active');
                this.toggle.classList.remove('active');
            });
        });

        // Smooth scroll for anchor links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = $(href);
                    if (target) {
                        const offset = this.nav.offsetHeight;
                        const top = target.offsetTop - offset;
                        window.scrollTo({ top, behavior: 'smooth' });
                    }
                }
            });
        });

        this.onScroll();
    }

    onScroll() {
        // Add scrolled class to nav
        if (window.scrollY > 100) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }

        // Update active link based on section in view
        let current = '';
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    toggleMenu() {
        this.toggle.classList.toggle('active');
        this.links.classList.toggle('active');
    }
}

// ==========================================================================
// Gallery
// ==========================================================================

class Gallery {
    constructor() {
        this.grid = $('#galleryGrid');
        this.filters = $$('.filter-btn');
        this.items = $$('.gallery-item');
        this.lightbox = $('#lightbox');
        this.lightboxImg = $('#lightboxImg');
        this.lightboxCaption = $('#lightboxCaption');
        this.currentIndex = 0;
        this.visibleItems = [];

        this.init();
    }

    init() {
        // Filter buttons
        this.filters.forEach(btn => {
            btn.addEventListener('click', () => this.filter(btn.dataset.filter));
        });

        // Gallery items click
        this.items.forEach((item, index) => {
            item.addEventListener('click', () => this.openLightbox(index));
        });

        // Lightbox controls
        $('#lightboxClose').addEventListener('click', () => this.closeLightbox());
        $('#lightboxPrev').addEventListener('click', () => this.navigate(-1));
        $('#lightboxNext').addEventListener('click', () => this.navigate(1));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') this.closeLightbox();
            if (e.key === 'ArrowLeft') this.navigate(-1);
            if (e.key === 'ArrowRight') this.navigate(1);
        });

        // Close on background click
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) this.closeLightbox();
        });

        // Initialize visible items
        this.updateVisibleItems();
    }

    filter(year) {
        this.filters.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === year);
        });

        this.items.forEach(item => {
            if (year === 'all' || item.dataset.year === year) {
                item.classList.remove('hidden');
                setTimeout(() => item.classList.add('visible'), 10);
            } else {
                item.classList.remove('visible');
                setTimeout(() => item.classList.add('hidden'), 300);
            }
        });

        setTimeout(() => this.updateVisibleItems(), 350);
    }

    updateVisibleItems() {
        this.visibleItems = Array.from(this.items).filter(item => !item.classList.contains('hidden'));
    }

    openLightbox(index) {
        const item = this.items[index];
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-overlay p').textContent;

        this.lightboxImg.src = img.src;
        this.lightboxImg.alt = img.alt;
        this.lightboxCaption.textContent = caption;
        this.currentIndex = index;

        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    navigate(direction) {
        const currentItem = this.items[this.currentIndex];
        let newIndex = this.currentIndex;

        // Find next visible item
        do {
            newIndex += direction;
            if (newIndex < 0) newIndex = this.items.length - 1;
            if (newIndex >= this.items.length) newIndex = 0;
        } while (this.items[newIndex].classList.contains('hidden') && newIndex !== this.currentIndex);

        this.openLightbox(newIndex);
    }
}

// ==========================================================================
// Stat Counter Animation
// ==========================================================================

class StatCounter {
    constructor() {
        this.stats = $$('.stat-card');
        this.observed = new Set();

        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.observed.has(entry.target)) {
                    this.observed.add(entry.target);
                    this.animateCount(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.stats.forEach(stat => observer.observe(stat));
    }

    animateCount(card) {
        const numberEl = card.querySelector('.stat-number');
        const target = parseInt(card.dataset.count, 10);
        const duration = 2000;
        const start = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);

            numberEl.textContent = formatNumber(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                numberEl.textContent = formatNumber(target);
            }
        };

        requestAnimationFrame(animate);
    }
}

// ==========================================================================
// Bar Chart Animation
// ==========================================================================

class BarChartAnimation {
    constructor() {
        this.bars = $$('.bar-fill');
        this.observed = new Set();

        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.observed.has(entry.target)) {
                    this.observed.add(entry.target);
                    setTimeout(() => entry.target.classList.add('animated'), 100);
                }
            });
        }, { threshold: 0.5 });

        this.bars.forEach(bar => observer.observe(bar));
    }
}

// ==========================================================================
// Scroll Reveal
// ==========================================================================

class ScrollReveal {
    constructor() {
        this.elements = $$('.timeline-card, .gallery-item, .favorite-card');

        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        this.elements.forEach(el => observer.observe(el));
    }
}

// ==========================================================================
// Monkey Mascot
// ==========================================================================

class MonkeyMascot {
    constructor() {
        this.mascot = $('#monkeyMascot');
        this.icon = $('#monkeyIcon');
        this.bubble = $('#monkeyBubble');
        this.message = $('#monkeyMessage');
        this.close = $('#monkeyClose');
        this.factIndex = 0;

        this.init();
    }

    init() {
        // Show initial message after delay
        setTimeout(() => {
            this.showBubble();
        }, 2000);

        // Icon click
        this.icon.addEventListener('click', () => {
            if (this.bubble.classList.contains('active')) {
                this.hideBubble();
            } else {
                this.showBubble();
            }
        });

        // Close button
        this.close.addEventListener('click', (e) => {
            e.stopPropagation();
            this.hideBubble();
        });

        // Auto-rotate facts
        setInterval(() => {
            if (this.bubble.classList.contains('active')) {
                this.nextFact();
            }
        }, 8000);
    }

    showBubble() {
        this.bubble.classList.add('active');
    }

    hideBubble() {
        this.bubble.classList.remove('active');
    }

    nextFact() {
        this.factIndex = (this.factIndex + 1) % CONFIG.monkeyFacts.length;

        // Fade out
        this.message.style.opacity = 0;

        setTimeout(() => {
            this.message.textContent = CONFIG.monkeyFacts[this.factIndex];
            this.message.style.opacity = 1;
        }, 200);
    }
}

// ==========================================================================
// Music Player
// ==========================================================================

class MusicPlayer {
    constructor() {
        this.audio = $('#bgMusic');
        this.toggle = $('#musicToggle');
        this.isPlaying = false;

        this.init();
    }

    init() {
        // Set initial muted state
        this.toggle.classList.add('muted');

        // Toggle click
        this.toggle.addEventListener('click', () => this.togglePlay());

        // Auto-play on first interaction
        const autoPlay = () => {
            if (!this.isPlaying) {
                this.play();
            }
            document.removeEventListener('click', autoPlay);
        };
        document.addEventListener('click', autoPlay, { once: true });
    }

    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.toggle.classList.remove('muted');
        }).catch(err => {
            console.log('Audio autoplay prevented:', err);
        });
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.toggle.classList.add('muted');
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
}

// ==========================================================================
// Stats Carousel
// ==========================================================================

class StatsCarousel {
    constructor() {
        this.container = $('#statsCarousel');
        this.slides = $$('.carousel-slide');
        this.dots = $$('.carousel-dot');
        this.prevBtn = $('#statsPrev');
        this.nextBtn = $('#statsNext');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.isAnimating = false;

        if (this.container) {
            this.init();
        }
    }

    init() {
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        let touchStartX = 0;
        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });
        this.container.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) this.next();
                else this.prev();
            }
        });

        this.animateBars();
    }

    prev() {
        if (this.isAnimating) return;
        const newIndex = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.goToSlide(newIndex, 'prev');
    }

    next() {
        if (this.isAnimating) return;
        const newIndex = this.currentSlide === this.totalSlides - 1 ? 0 : this.currentSlide + 1;
        this.goToSlide(newIndex, 'next');
    }

    goToSlide(index, direction = 'next') {
        if (index === this.currentSlide || this.isAnimating) return;

        this.isAnimating = true;
        const currentSlide = this.slides[this.currentSlide];
        const nextSlide = this.slides[index];

        currentSlide.classList.remove('active');
        currentSlide.classList.add(direction === 'next' ? 'prev' : '');
        nextSlide.classList.add('active');

        this.dots[this.currentSlide].classList.remove('active');
        this.dots[index].classList.add('active');

        this.currentSlide = index;
        this.animateBars();

        setTimeout(() => {
            currentSlide.classList.remove('prev');
            this.isAnimating = false;
        }, 500);
    }

    animateBars() {
        const activeSlide = this.slides[this.currentSlide];
        const bars = activeSlide.querySelectorAll('.bar-fill-large');
        bars.forEach((bar, index) => {
            bar.classList.remove('animated');
            setTimeout(() => bar.classList.add('animated'), 100 + index * 100);
        });
    }
}

// ==========================================================================
// Photo Upload
// ==========================================================================

class PhotoUpload {
    constructor() {
        this.dropzone = $('#dropzone');
        this.fileInput = $('#fileInput');
        this.browseBtn = $('#browseBtn');
        this.previewContainer = $('#uploadPreview');
        this.previewGrid = $('#previewGrid');
        this.photoCount = $('#photoCount');
        this.clearBtn = $('#clearPhotos');
        this.addBtn = $('#addToGallery');
        this.yearTabs = $$('.upload-tab');

        this.selectedYear = '2022';
        this.photos = [];

        if (this.dropzone) {
            this.init();
        }
    }

    init() {
        this.yearTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.yearTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.selectedYear = tab.dataset.year;
            });
        });

        this.browseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.fileInput.click();
        });

        this.dropzone.addEventListener('click', () => {
            this.fileInput.click();
        });

        this.fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });

        this.dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropzone.classList.add('dragover');
        });

        this.dropzone.addEventListener('dragleave', () => {
            this.dropzone.classList.remove('dragover');
        });

        this.dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropzone.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });

        this.clearBtn.addEventListener('click', () => {
            this.photos = [];
            this.updatePreview();
        });

        this.addBtn.addEventListener('click', () => {
            this.addToGallery();
        });
    }

    handleFiles(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.photos.push({
                        src: e.target.result,
                        name: file.name,
                        year: this.selectedYear,
                        caption: ''
                    });
                    this.updatePreview();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    updatePreview() {
        if (this.photos.length === 0) {
            this.previewContainer.classList.remove('active');
            return;
        }

        this.previewContainer.classList.add('active');
        this.photoCount.textContent = '(' + this.photos.length + ')';

        let html = '';
        this.photos.forEach((photo, index) => {
            html += '<div class="preview-item" data-index="' + index + '">';
            html += '<img src="' + photo.src + '" alt="' + photo.name + '">';
            html += '<button class="preview-remove" data-index="' + index + '">&times;</button>';
            html += '<div class="preview-caption">';
            html += '<input type="text" placeholder="Add caption..." value="' + photo.caption + '" data-index="' + index + '">';
            html += '</div></div>';
        });
        this.previewGrid.innerHTML = html;

        this.previewGrid.querySelectorAll('.preview-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                this.photos.splice(index, 1);
                this.updatePreview();
            });
        });

        this.previewGrid.querySelectorAll('.preview-caption input').forEach(input => {
            input.addEventListener('input', (e) => {
                const index = parseInt(input.dataset.index);
                this.photos[index].caption = e.target.value;
            });
        });
    }

    addToGallery() {
        if (this.photos.length === 0) return;

        const galleryGrid = $('#galleryGrid');
        const count = this.photos.length;

        this.photos.forEach((photo) => {
            const item = document.createElement('div');
            item.className = 'gallery-item visible';
            item.dataset.year = photo.year;

            const caption = photo.caption || 'A beautiful memory';
            item.innerHTML = '<img src="' + photo.src + '" alt="' + caption + '">' +
                '<div class="gallery-overlay"><p>' + caption + '</p></div>';

            galleryGrid.appendChild(item);

            item.addEventListener('click', () => {
                const lightbox = $('#lightbox');
                const lightboxImg = $('#lightboxImg');
                const lightboxCaption = $('#lightboxCaption');

                lightboxImg.src = photo.src;
                lightboxCaption.textContent = caption;
                lightbox.classList.add('active');
            });
        });

        this.photos = [];
        this.updatePreview();

        alert(count + ' photo(s) added to gallery!');
    }
}

// ==========================================================================
// Wedding Mode
// ==========================================================================

function initWeddingMode() {
    if (CONFIG.weddingMode) {
        $$('.wedding-only').forEach(el => {
            el.style.display = '';
        });
    }
}

// ==========================================================================
// Initialize
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize canvas
    const canvas = $('#heartsCanvas');
    if (canvas) {
        new HeartsCanvas(canvas);
    }

    // Initialize components
    new LoveTimer();
    new Navigation();
    new Gallery();
    new StatCounter();
    new BarChartAnimation();
    new ScrollReveal();
    new MonkeyMascot();
    new MusicPlayer();
    new StatsCarousel();
    new PhotoUpload();

    // Wedding mode
    initWeddingMode();

    // Add visible class to gallery items initially
    setTimeout(() => {
        $$('.gallery-item').forEach((item, index) => {
            setTimeout(() => item.classList.add('visible'), index * 50);
        });
    }, 500);

    console.log('Hector & Kaylee Anniversary Website loaded');
});

// ==========================================================================
// Preload Images
// ==========================================================================

window.addEventListener('load', () => {
    const images = $$('img[loading="lazy"]');
    images.forEach(img => {
        const src = img.src;
        const preload = new Image();
        preload.src = src;
    });
});
