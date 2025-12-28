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
        "Ooh ooh! Welcome! I'm the official mascot around here.",
        "'HEYYY QUEEEN' - that's how legends begin, apparently.",
        "He showed up late to their first date. Bold move, king.",
        "Watching him fight sushi with chopsticks was peak entertainment.",
        "First kiss behind a Domino's? Romance isn't dead, folks!",
        "That vegan cheese was... questionable. She said yes anyway.",
        "November 27, 2022 - best decision she ever made, just saying.",
        "Don't get them started on JoJo's. You WILL be here for hours.",
        "6 Fortnite duo wins! They'd have more but... responsibilities.",
        "They still won't shut up about Pierce The Veil. Fair enough.",
        "4 trips together and I'm just stuck on this website. Cool cool.",
        "Her car has skull lights and anime stickers. Absolute queen.",
        "He tried to HANDSHAKE her after date one. Bless his heart.",
        "Her Monster High collection is worth more than my existence.",
        "She's rewatched Ouran so many times I lost count. Respect.",
        "Why am I the mascot? Monkeys are her favorite. Obviously."
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

        // Re-query all gallery items to include dynamically added photos
        const allItems = $$('.gallery-item');
        allItems.forEach(item => {
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
        // Re-query all gallery items to include dynamically added photos
        const allItems = $$('.gallery-item');
        this.visibleItems = Array.from(allItems).filter(item => !item.classList.contains('hidden'));
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

        // Remove all transition classes first
        this.slides.forEach(slide => {
            slide.classList.remove('active', 'prev', 'next');
        });

        // Add appropriate classes for transition
        if (direction === 'next') {
            currentSlide.classList.add('prev');
        } else {
            currentSlide.classList.add('next');
        }
        nextSlide.classList.add('active');

        this.dots[this.currentSlide].classList.remove('active');
        this.dots[index].classList.add('active');

        this.currentSlide = index;
        this.animateBars();

        setTimeout(() => {
            currentSlide.classList.remove('prev', 'next');
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
        this.files = []; // Store actual file objects for upload

        if (this.dropzone) {
            this.init();
            this.loadPersistedPhotos();
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
            this.files = [];
            this.updatePreview();
        });

        this.addBtn.addEventListener('click', () => {
            this.addToGallery();
        });
    }

    // Load persisted photos from server on page load
    async loadPersistedPhotos() {
        try {
            const response = await fetch('/api/photos');
            const photos = await response.json();

            const galleryGrid = $('#galleryGrid');

            photos.forEach((photo) => {
                this.addPhotoToGalleryDOM(galleryGrid, photo);
            });
        } catch (error) {
            console.log('Could not load persisted photos:', error);
        }
    }

    // Add a photo element to the gallery DOM
    addPhotoToGalleryDOM(galleryGrid, photo) {
        const item = document.createElement('div');
        item.className = 'gallery-item visible uploaded-photo';
        item.dataset.year = photo.year;
        item.dataset.photoId = photo.id;

        const caption = photo.caption || 'A beautiful memory';
        item.innerHTML =
            '<img src="' + photo.src + '" alt="' + caption + '" loading="lazy">' +
            '<div class="gallery-overlay"><p>' + caption + '</p></div>' +
            '<button class="gallery-delete-btn" title="Delete photo">&times;</button>';

        galleryGrid.appendChild(item);

        // Click to open lightbox
        item.addEventListener('click', (e) => {
            if (e.target.classList.contains('gallery-delete-btn')) return;

            const lightbox = $('#lightbox');
            const lightboxImg = $('#lightboxImg');
            const lightboxCaption = $('#lightboxCaption');

            lightboxImg.src = photo.src;
            lightboxCaption.textContent = caption;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Delete button handler
        const deleteBtn = item.querySelector('.gallery-delete-btn');
        deleteBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this photo?')) {
                await this.deletePhoto(photo.id, item);
            }
        });
    }

    // Delete a photo from server and DOM
    async deletePhoto(photoId, element) {
        try {
            const response = await fetch('/api/photos/' + photoId, {
                method: 'DELETE'
            });

            if (response.ok) {
                element.classList.add('deleting');
                setTimeout(() => {
                    element.remove();
                }, 300);
            } else {
                alert('Failed to delete photo');
            }
        } catch (error) {
            console.error('Error deleting photo:', error);
            alert('Error deleting photo');
        }
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
                    this.files.push(file);
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
                this.files.splice(index, 1);
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

    async addToGallery() {
        if (this.photos.length === 0) return;

        const galleryGrid = $('#galleryGrid');
        const count = this.photos.length;

        // Prepare FormData for upload
        const formData = new FormData();
        const metadata = [];

        this.files.forEach((file, index) => {
            formData.append('photos', file);
            metadata.push({
                year: this.photos[index].year,
                caption: this.photos[index].caption
            });
        });

        formData.append('metadata', JSON.stringify(metadata));

        try {
            const response = await fetch('/api/photos', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                // Add photos to gallery with server-assigned IDs
                result.photos.forEach((photo) => {
                    this.addPhotoToGalleryDOM(galleryGrid, photo);
                });

                this.photos = [];
                this.files = [];
                this.updatePreview();

                alert(count + ' photo(s) added to gallery and saved!');
            } else {
                alert('Error saving photos: ' + result.error);
            }
        } catch (error) {
            console.error('Error uploading photos:', error);
            alert('Error uploading photos. Make sure the server is running.');
        }
    }
}

// ==========================================================================
// Notes Manager
// ==========================================================================

class NotesManager {
    constructor() {
        this.notesGrid = $('#notesGrid');
        this.notesEmpty = $('#notesEmpty');
        this.noteModal = $('#noteModal');
        this.noteForm = $('#noteForm');
        this.filters = $$('.note-filter');
        this.addBtn = $('#addNoteBtn');
        this.currentFilter = 'all';
        this.notes = [];

        if (this.notesGrid) {
            this.init();
        }
    }

    init() {
        this.loadNotes();

        // Filter buttons
        this.filters.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.renderNotes();
            });
        });

        // Add note button
        this.addBtn.addEventListener('click', () => this.openModal());

        // Modal close
        $('#noteModalClose').addEventListener('click', () => this.closeModal());
        this.noteModal.addEventListener('click', (e) => {
            if (e.target === this.noteModal) this.closeModal();
        });

        // Form submit
        this.noteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNote();
        });
    }

    async loadNotes() {
        try {
            const response = await fetch('/api/notes');
            this.notes = await response.json();
            this.renderNotes();
        } catch (error) {
            console.log('Could not load notes:', error);
        }
    }

    renderNotes() {
        const filteredNotes = this.currentFilter === 'all'
            ? this.notes
            : this.notes.filter(n => n.tag === this.currentFilter);

        if (filteredNotes.length === 0) {
            this.notesGrid.innerHTML = '';
            this.notesEmpty.style.display = 'block';
            return;
        }

        this.notesEmpty.style.display = 'none';
        this.notesGrid.innerHTML = filteredNotes.map(note => this.createNoteCard(note)).join('');

        // Add event listeners
        this.notesGrid.querySelectorAll('.note-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                const noteId = btn.closest('.note-card').dataset.id;
                this.handleAction(action, noteId);
            });
        });
    }

    createNoteCard(note) {
        const age = this.getNoteAge(note.createdAt);
        const date = new Date(note.createdAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric'
        });

        return `
            <div class="note-card ${note.pinned ? 'pinned' : ''}" data-id="${note.id}" data-age="${age}">
                <span class="note-tag ${note.tag}">${note.tag}</span>
                <p class="note-content">${this.escapeHtml(note.content)}</p>
                <div class="note-meta">
                    <span class="note-date">${date}</span>
                    <div class="note-actions">
                        <button class="note-action-btn" data-action="pin" title="${note.pinned ? 'Unpin' : 'Pin'}">
                            ${note.pinned ? '📌' : '📍'}
                        </button>
                        <button class="note-action-btn" data-action="archive" title="Archive">📦</button>
                        <button class="note-action-btn" data-action="delete" title="Delete">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    }

    getNoteAge(createdAt) {
        const days = (Date.now() - new Date(createdAt)) / (1000 * 60 * 60 * 24);
        if (days > 30) return 'older';
        if (days > 14) return 'old';
        return '';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    openModal() {
        this.noteModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.noteModal.classList.remove('active');
        document.body.style.overflow = '';
        this.noteForm.reset();
    }

    async saveNote() {
        const content = $('#noteContent').value.trim();
        const tag = document.querySelector('input[name="noteTag"]:checked').value;
        const pinned = $('#notePinned').checked;

        if (!content) return;

        try {
            const response = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, tag, pinned })
            });

            const result = await response.json();
            if (result.success) {
                this.notes.unshift(result.note);
                if (pinned) {
                    this.notes.sort((a, b) => {
                        if (a.pinned && !b.pinned) return -1;
                        if (!a.pinned && b.pinned) return 1;
                        return 0;
                    });
                }
                this.renderNotes();
                this.closeModal();
            }
        } catch (error) {
            console.error('Error saving note:', error);
            alert('Error saving note');
        }
    }

    async handleAction(action, noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;

        if (action === 'delete') {
            if (!confirm('Delete this note?')) return;
            try {
                await fetch('/api/notes/' + noteId, { method: 'DELETE' });
                this.notes = this.notes.filter(n => n.id !== noteId);
                this.renderNotes();
            } catch (error) {
                console.error('Error deleting note:', error);
            }
        } else if (action === 'pin') {
            try {
                await fetch('/api/notes/' + noteId, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pinned: !note.pinned })
                });
                note.pinned = !note.pinned;
                this.notes.sort((a, b) => {
                    if (a.pinned && !b.pinned) return -1;
                    if (!a.pinned && b.pinned) return 1;
                    return 0;
                });
                this.renderNotes();
            } catch (error) {
                console.error('Error updating note:', error);
            }
        } else if (action === 'archive') {
            try {
                await fetch('/api/notes/' + noteId, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ archived: true })
                });
                this.notes = this.notes.filter(n => n.id !== noteId);
                this.renderNotes();
            } catch (error) {
                console.error('Error archiving note:', error);
            }
        }
    }
}

// ==========================================================================
// Letters Manager
// ==========================================================================

class LettersManager {
    constructor() {
        this.lettersGrid = $('#lettersGrid');
        this.lettersEmpty = $('#lettersEmpty');
        this.letterModal = $('#letterModal');
        this.letterForm = $('#letterForm');
        this.keepsakeModal = $('#keepsakeModal');
        this.addBtn = $('#addLetterBtn');
        this.keepsakeBtn = $('#keepsakeBtn');
        this.letters = [];
        this.currentKeepsakeIndex = 0;

        if (this.lettersGrid) {
            this.init();
        }
    }

    init() {
        this.loadLetters();

        // Add letter button
        this.addBtn.addEventListener('click', () => this.openModal());

        // Keepsake mode button
        this.keepsakeBtn.addEventListener('click', () => this.openKeepsakeMode());

        // Modal close
        $('#letterModalClose').addEventListener('click', () => this.closeModal());
        this.letterModal.addEventListener('click', (e) => {
            if (e.target === this.letterModal) this.closeModal();
        });

        // Keepsake modal close
        $('#keepsakeClose').addEventListener('click', () => this.closeKeepsakeMode());

        // Keepsake navigation
        $('#keepsakePrev').addEventListener('click', () => this.navigateKeepsake(-1));
        $('#keepsakeNext').addEventListener('click', () => this.navigateKeepsake(1));

        // Format toggle
        document.querySelectorAll('input[name="letterFormat"]').forEach(radio => {
            radio.addEventListener('change', () => this.toggleFormat());
        });

        // Image preview
        $('#letterImage').addEventListener('change', (e) => this.previewImage(e));

        // Form submit
        this.letterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveLetter();
        });

        // Keyboard navigation for keepsake mode
        document.addEventListener('keydown', (e) => {
            if (!this.keepsakeModal.classList.contains('active')) return;
            if (e.key === 'Escape') this.closeKeepsakeMode();
            if (e.key === 'ArrowLeft') this.navigateKeepsake(-1);
            if (e.key === 'ArrowRight') this.navigateKeepsake(1);
        });
    }

    async loadLetters() {
        try {
            const response = await fetch('/api/letters');
            this.letters = await response.json();
            this.renderLetters();
        } catch (error) {
            console.log('Could not load letters:', error);
        }
    }

    renderLetters() {
        if (this.letters.length === 0) {
            this.lettersGrid.innerHTML = '';
            this.lettersEmpty.style.display = 'block';
            this.keepsakeBtn.style.display = 'none';
            return;
        }

        this.lettersEmpty.style.display = 'none';
        this.keepsakeBtn.style.display = 'flex';
        this.lettersGrid.innerHTML = this.letters.map(letter => this.createLetterCard(letter)).join('');

        // Add click listeners
        this.lettersGrid.querySelectorAll('.letter-card').forEach((card, index) => {
            card.addEventListener('click', () => this.viewLetter(index));
        });
    }

    createLetterCard(letter) {
        const isLocked = letter.readWhen ? true : false;
        const dateDisplay = letter.dateWritten
            ? new Date(letter.dateWritten).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            : '';
        const preview = letter.format === 'text'
            ? (letter.content || '').substring(0, 100) + '...'
            : '[Image/Scan]';

        return `
            <div class="letter-card ${isLocked ? 'locked' : ''}" data-id="${letter.id}">
                <div class="letter-envelope"></div>
                <h4 class="letter-title">${this.escapeHtml(letter.title)}</h4>
                <p class="letter-preview">${this.escapeHtml(preview)}</p>
                <div class="letter-meta">
                    ${dateDisplay ? `<span class="letter-date">${dateDisplay}</span>` : ''}
                    ${letter.feeling ? `<span class="letter-feeling">${this.escapeHtml(letter.feeling)}</span>` : ''}
                </div>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    toggleFormat() {
        const format = document.querySelector('input[name="letterFormat"]:checked').value;
        $('#letterTextGroup').style.display = format === 'text' ? 'block' : 'none';
        $('#letterImageGroup').style.display = format === 'image' ? 'block' : 'none';
    }

    previewImage(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                $('#letterImagePreview').innerHTML = `<img src="${ev.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    }

    openModal() {
        this.letterModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.letterModal.classList.remove('active');
        document.body.style.overflow = '';
        this.letterForm.reset();
        $('#letterImagePreview').innerHTML = '';
        this.toggleFormat();
    }

    async saveLetter() {
        const title = $('#letterTitle').value.trim();
        const format = document.querySelector('input[name="letterFormat"]:checked').value;
        const dateWritten = $('#letterDate').value;
        const feeling = $('#letterFeeling').value.trim();
        const readWhen = $('#letterReadWhen').value;

        if (!title) return;

        try {
            let response;

            if (format === 'text') {
                const content = $('#letterContent').value.trim();
                response = await fetch('/api/letters', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, content, dateWritten, feeling, readWhen })
                });
            } else {
                const imageFile = $('#letterImage').files[0];
                if (!imageFile) {
                    alert('Please select an image');
                    return;
                }
                const formData = new FormData();
                formData.append('image', imageFile);
                formData.append('title', title);
                formData.append('dateWritten', dateWritten);
                formData.append('feeling', feeling);
                formData.append('readWhen', readWhen);

                response = await fetch('/api/letters/image', {
                    method: 'POST',
                    body: formData
                });
            }

            const result = await response.json();
            if (result.success) {
                this.letters.unshift(result.letter);
                this.renderLetters();
                this.closeModal();
            }
        } catch (error) {
            console.error('Error saving letter:', error);
            alert('Error saving letter');
        }
    }

    viewLetter(index) {
        const letter = this.letters[index];
        if (!letter) return;

        this.currentKeepsakeIndex = index;
        this.showLetterInKeepsake(letter);
        this.keepsakeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    openKeepsakeMode() {
        if (this.letters.length === 0) return;
        this.currentKeepsakeIndex = 0;
        this.showLetterInKeepsake(this.letters[0]);
        this.keepsakeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeKeepsakeMode() {
        this.keepsakeModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    showLetterInKeepsake(letter) {
        const content = $('#keepsakeLetterContent');
        const counter = $('#keepsakeCounter');

        counter.textContent = `${this.currentKeepsakeIndex + 1} / ${this.letters.length}`;

        // Check if locked
        if (letter.readWhen) {
            const lockMessages = {
                miss: 'This letter is for when you miss her',
                unsure: 'This letter is for when you feel unsure',
                happy: 'This letter is for when you\'re happy',
                sad: 'This letter is for when you need comfort'
            };

            content.innerHTML = `
                <div class="lock-screen">
                    <div class="lock-icon">🔐</div>
                    <p class="lock-message">${lockMessages[letter.readWhen] || 'This letter is locked'}</p>
                    <button class="unlock-btn" onclick="window.lettersManager.unlockLetter('${letter.id}')">
                        I'm ready to read this
                    </button>
                </div>
            `;
            return;
        }

        this.displayLetterContent(letter, content);
    }

    displayLetterContent(letter, container) {
        if (letter.format === 'image') {
            container.innerHTML = `
                <h3 class="letter-title">${this.escapeHtml(letter.title)}</h3>
                <img class="letter-image" src="${letter.imageSrc}" alt="${this.escapeHtml(letter.title)}">
                ${letter.feeling ? `<p class="letter-feeling-display">This made me feel: ${this.escapeHtml(letter.feeling)}</p>` : ''}
            `;
        } else {
            container.innerHTML = `
                <h3 class="letter-title">${this.escapeHtml(letter.title)}</h3>
                <div class="letter-body">${this.escapeHtml(letter.content)}</div>
                ${letter.feeling ? `<p class="letter-feeling-display">This made me feel: ${this.escapeHtml(letter.feeling)}</p>` : ''}
            `;
        }
    }

    unlockLetter(letterId) {
        const letter = this.letters.find(l => l.id === letterId);
        if (letter) {
            // Temporarily remove the lock for viewing
            const tempLetter = { ...letter, readWhen: '' };
            this.displayLetterContent(tempLetter, $('#keepsakeLetterContent'));
        }
    }

    navigateKeepsake(direction) {
        let newIndex = this.currentKeepsakeIndex + direction;
        if (newIndex < 0) newIndex = this.letters.length - 1;
        if (newIndex >= this.letters.length) newIndex = 0;

        this.currentKeepsakeIndex = newIndex;
        this.showLetterInKeepsake(this.letters[newIndex]);
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
    new NotesManager();
    window.lettersManager = new LettersManager();

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
