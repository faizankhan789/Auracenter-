/**
 * Auracenter Fitness Website - Enhanced JavaScript
 * Updated for 5 pages with merged Page 5 (6 images)
 */

class FitnessHeroAnimations {
    constructor() {
        // Configuration
        this.config = {
            heartRate: {
                base: 128,
                variation: 8,
                updateInterval: 1200
            }
        };

        // State
        this.state = {
            heartRate: this.config.heartRate.base,
            isVisible: true,
            isMobile: window.innerWidth < 768,
            isTablet: window.innerWidth >= 768 && window.innerWidth < 1024
        };
        
        this.currentPage = 1;
        this.totalPages = 6; // Updated to 5 pages (merged page 5 & 6)
        this.isTransitioning = false;
        this.wheelThreshold = 30;
        this.wheelDelta = 0;
        this.lastWheelEvent = null;
        this.lenisInstances = {};

        // Animation controllers
        this.animations = {
            ecg: null,
            intervals: new Map(),
        };

        // Initialize
        this.init();
    }

    /**
     * Initialize all components
     */
    init() {
        this.checkPerformance();
        this.initPageTransitions();
        this.initLucideIcons();
        this.setupEventListeners();
        this.setupMobileMenu();
        this.detectDevice();
        this.startAnimations();
        
        console.log('🚀 Fitness Hero initialized successfully!');
    }

    /**
     * Check device performance capabilities
     */
    checkPerformance() {
        // Reduce animations on low-end devices
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection && connection.effectiveType === 'slow-2g') {
            document.body.classList.add('reduce-motion');
        }

        // Check if device prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduce-motion');
        }
    }

    /**
     * Initialize Page Transitions
     */
    initPageTransitions() {
        this.setupWheelNavigation();
        this.setupTouchNavigation();
        this.setupKeyboardNavigation();
        
        console.log('✅ Page transitions initialized');
    }

    setupWheelNavigation() {
        let wheelTimeout;

        // Listener to capture the last wheel event for direction
        window.addEventListener('wheel', (e) => {
            this.lastWheelEvent = e;
        }, { passive: true });
        
        window.addEventListener('wheel', (e) => {
            // If a Lenis instance is active for the current page, let it handle the scroll.
            if (this.lenisInstances[this.currentPage]) {
                return;
            }
            if (this.isTransitioning) return;
            
            e.preventDefault();
            
            clearTimeout(wheelTimeout);
            this.wheelDelta += e.deltaY;
            
            wheelTimeout = setTimeout(() => {
                if (Math.abs(this.wheelDelta) > this.wheelThreshold) {
                    if (this.wheelDelta > 0 && this.currentPage < this.totalPages) {
                        this.goToPage(this.currentPage + 1);
                    } else if (this.wheelDelta < 0 && this.currentPage > 1) {
                        this.goToPage(this.currentPage - 1);
                    }
                }
                this.wheelDelta = 0;
            }, 100);
        }, { passive: false });
    }

    setupTouchNavigation() {
        let startY = 0;
        let endY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (this.isTransitioning) return;
            
            endY = e.changedTouches[0].clientY;
            const deltaY = startY - endY;
            
            if (Math.abs(deltaY) > 50) {
                if (deltaY > 0 && this.currentPage < this.totalPages) {
                    this.goToPage(this.currentPage + 1);
                } else if (deltaY < 0 && this.currentPage > 1) {
                    this.goToPage(this.currentPage - 1);
                }
            }
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (this.isTransitioning) return;
            
            switch(e.key) {
                case 'ArrowDown':
                case 'PageDown':
                    e.preventDefault();
                    if (this.currentPage < this.totalPages) {
                        this.goToPage(this.currentPage + 1);
                    }
                    break;
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    if (this.currentPage > 1) {
                        this.goToPage(this.currentPage - 1);
                    }
                    break;
            }
        });
    }

    /**
     * Dynamically loads a script and returns a promise.
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                if (typeof Lenis !== 'undefined') {
                    resolve();
                    return;
                }
            }

            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.body.appendChild(script);
        });
    }

    async initHorizontalLenis(pageNumber) {
        try {
            if (typeof Lenis === 'undefined') {
                console.log('Lenis not found, attempting to load...');
                await this.loadScript('https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.min.js');
                console.log('✅ Lenis library loaded successfully.');
            }
            this.setupLenisInstance(pageNumber);
        } catch (error) {
            console.error(`❌ Error loading or initializing Lenis for page ${pageNumber}:`, error.message);
            console.error(`Horizontal scrolling for page ${pageNumber} will be disabled.`);
        }
    }

    setupLenisInstance(pageNumber) {
        const wrapper = document.querySelector(`.page-${pageNumber} .horizontal-scroll-wrapper`);
        const content = document.querySelector(`.page-${pageNumber} .horizontal-scroll-content`);

        if (!wrapper || !content) {
            console.error(`Wrapper or content not found for page ${pageNumber}.`);
            return;
        }

        if (this.lenisInstances[pageNumber]) {
            this.lenisInstances[pageNumber].destroy();
        }

        const lenis = new Lenis({
            wrapper: wrapper,
            content: content,
            orientation: 'horizontal',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            duration: 1.2,
            lerp: 0.1,
        });

        const anim = (time) => {
            lenis.raf(time);
            if (this.lenisInstances[pageNumber]) {
                this.lenisInstances[pageNumber].animationFrame = requestAnimationFrame(anim);
            }
        };
        
        const animationFrameId = requestAnimationFrame(anim);

        lenis.on('scroll', ({ scroll, limit }) => {
            if (this.isTransitioning) return;

            const atStart = scroll < 1;
            const atEnd = scroll > limit - 1;

            if (this.lastWheelEvent) {
                if (this.lastWheelEvent.deltaY < 0 && atStart && this.currentPage > 1) {
                    this.goToPage(this.currentPage - 1);
                } else if (this.lastWheelEvent.deltaY > 0 && atEnd && this.currentPage < this.totalPages) {
                    this.goToPage(this.currentPage + 1);
                }
            }
        });
        
        this.lenisInstances[pageNumber] = lenis;
        this.lenisInstances[pageNumber].animationFrame = animationFrameId;
        console.log(`✅ Lenis initialized for page ${pageNumber}`);
    }

    goToPage(pageNumber) {
        if (pageNumber === this.currentPage || this.isTransitioning) return;
        
        console.log(`🔄 Starting transition from page ${this.currentPage} to page ${pageNumber}`);
        this.isTransitioning = true;
        
        const oldPageNumber = this.currentPage;
        // Only page 5 now has horizontal scrolling
        if (oldPageNumber === 5 && this.lenisInstances[oldPageNumber]) {
            cancelAnimationFrame(this.lenisInstances[oldPageNumber].animationFrame);
            this.lenisInstances[oldPageNumber].destroy();
            delete this.lenisInstances[oldPageNumber];
            console.log(`🧹 Lenis instance for page ${oldPageNumber} destroyed.`);
        }

        const currentPageEl = document.querySelector(`.page.page-${this.currentPage}`);
        const targetPageEl = document.querySelector(`.page.page-${pageNumber}`);
    
        const isGoingDown = pageNumber > this.currentPage;
        
        this.resetPageAnimations(targetPageEl, pageNumber);
        
        targetPageEl.classList.remove('active');
        
        targetPageEl.style.transition = 'none';
        targetPageEl.style.transform = isGoingDown ? 'translateY(100%)' : 'translateY(-100%)';
        targetPageEl.style.opacity = '0';
        targetPageEl.style.zIndex = '3';
        targetPageEl.style.visibility = 'visible';
        
        targetPageEl.offsetHeight;
        
        targetPageEl.classList.add('active');
        targetPageEl.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                currentPageEl.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                currentPageEl.style.transform = isGoingDown ? 'translateY(-100%)' : 'translateY(100%)';
                currentPageEl.style.opacity = '0';
                
                targetPageEl.style.transform = 'translateY(0)';
                targetPageEl.style.opacity = '1';
                
                setTimeout(() => {
                    this.startPageAnimations(targetPageEl, pageNumber);
                    if (pageNumber === 5) { // Only page 5 has horizontal scrolling now
                        this.initHorizontalLenis(pageNumber);
                    }
                }, 200);
            });
        });
        
        setTimeout(() => {
            currentPageEl.classList.remove('active');
            currentPageEl.style.transform = '';
            currentPageEl.style.opacity = '';
            currentPageEl.style.transition = '';
            currentPageEl.style.zIndex = '';
            currentPageEl.style.visibility = '';
            
            targetPageEl.style.transform = '';
            targetPageEl.style.opacity = '';
            targetPageEl.style.transition = '';
            targetPageEl.style.zIndex = '';
            targetPageEl.style.visibility = '';
            
            this.isTransitioning = false;
            console.log(`✅ Transition completed to page ${pageNumber}`);
        }, 850);
        
        this.currentPage = pageNumber;

        // Update navigation active states
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(nav => {
            nav.classList.remove('text-white');
            nav.classList.add('text-gray-300');
        });
        const targetLinks = document.querySelectorAll(`.nav-link[data-page="${pageNumber}"]`);
        targetLinks.forEach(targetLink => {
            targetLink.classList.remove('text-gray-300');
            targetLink.classList.add('text-white');
        });
    }

    /**
     * Reset page animations to their initial state
     */
    resetPageAnimations(pageEl, pageNumber) {
        const animatedElements = pageEl.querySelectorAll('.fade-in-up');
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.animation = 'none';
            element.classList.remove('animate-in');
        });
        
        if (pageNumber === 1) {
            const heroTitle = pageEl.querySelector('.hero-title');
            if (heroTitle) { heroTitle.style.opacity = '0'; heroTitle.style.transform = 'translateY(30px)'; }
            const heroContent = pageEl.querySelector('.hero-content .flex-1');
            if (heroContent) { heroContent.style.opacity = '0'; heroContent.style.transform = 'translateY(30px)'; }
            const monitors = pageEl.querySelector('.monitors-container');
            if (monitors) { monitors.style.opacity = '0'; monitors.style.transform = 'translateY(30px)'; }
            const heroBackground = pageEl.querySelector('.hero-background');
            if (heroBackground) { heroBackground.style.opacity = '0'; heroBackground.style.transform = 'scale(1.05)'; heroBackground.classList.remove('loaded'); }
        }
        
        if (pageNumber === 2) {
            const aboutBox = pageEl.querySelector('.about-box');
            if (aboutBox) { aboutBox.style.opacity = '0'; aboutBox.style.transform = 'translateY(50px) scale(0.95)'; }
        }
        
        if (pageNumber === 3) {
            const classesBox = pageEl.querySelector('.classes-box');
            if (classesBox) { classesBox.style.opacity = '0'; classesBox.style.transform = 'translateY(50px) scale(0.95)'; }
        }
        
        if (pageNumber === 4) {
            const strengthText = pageEl.querySelector('.strength-text');
            const strengthImages = pageEl.querySelector('.strength-images');
            if (strengthText) { strengthText.style.opacity = '0'; strengthText.style.transform = 'translateX(50px) scale(0.95)'; }
            if (strengthImages) { strengthImages.style.opacity = '0'; strengthImages.style.transform = 'translateX(-50px) scale(0.95)'; }
        }
        
        if (pageNumber === 5) {
            const imageBlocks = pageEl.querySelectorAll('.image-block');
            imageBlocks.forEach(block => {
                block.style.opacity = '0';
                block.style.transform = 'translateY(50px) scale(0.95)';
            });
        }
        if (pageNumber === 6) {
        const missionCard = pageEl.querySelector('.mission-card');
        const visionCard = pageEl.querySelector('.vision-card');
        if (missionCard) { 
            missionCard.style.opacity = '0'; 
            missionCard.style.transform = 'translateX(-50px) scale(0.95)'; 
        }
        if (visionCard) { 
            visionCard.style.opacity = '0'; 
            visionCard.style.transform = 'translateX(50px) scale(0.95)'; 
        }
    }
    }

    /**
     * Start page animations with staggered delays
     */
    startPageAnimations(pageEl, pageNumber) {
        const animatedElements = pageEl.querySelectorAll('.fade-in-up');
        animatedElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.transition = 'all 0.8s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.classList.add('animate-in');
            }, index * 150);
        });
        
        if (pageNumber === 1) {
            const heroBackground = pageEl.querySelector('.hero-background');
            if (heroBackground) { 
                setTimeout(() => { 
                    heroBackground.style.transition = 'all 0.8s ease-in-out'; 
                    heroBackground.style.opacity = '1'; 
                    heroBackground.style.transform = 'scale(1)'; 
                    setTimeout(() => { heroBackground.classList.add('loaded'); }, 300); 
                }, 100); 
            }
            const heroContent = pageEl.querySelector('.hero-content .flex-1');
            if (heroContent) { setTimeout(() => { heroContent.style.transition = 'all 0.8s ease-out'; heroContent.style.opacity = '1'; heroContent.style.transform = 'translateY(0)'; }, 400); }
            const heroTitle = pageEl.querySelector('.hero-title');
            if (heroTitle) { setTimeout(() => { heroTitle.style.transition = 'all 0.8s ease-out'; heroTitle.style.opacity = '1'; heroTitle.style.transform = 'translateY(0)'; }, 600); }
            const button = pageEl.querySelector('.hero-content button');
            if (button) { setTimeout(() => { button.style.transition = 'all 0.8s ease-out'; button.style.opacity = '1'; button.style.transform = 'translateY(0)'; }, 800); }
            const monitors = pageEl.querySelector('.monitors-container');
            if (monitors) { setTimeout(() => { monitors.style.transition = 'all 0.8s ease-out'; monitors.style.opacity = '1'; monitors.style.transform = 'translateY(0)'; }, 1000); }
        }
        
        if (pageNumber === 2) {
            const aboutBox = pageEl.querySelector('.about-box');
            if (aboutBox) { setTimeout(() => { aboutBox.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; aboutBox.style.opacity = '1'; aboutBox.style.transform = 'translateY(0) scale(1)'; }, 300); }
        }
        
        if (pageNumber === 3) {
            const classesBox = pageEl.querySelector('.classes-box');
            if (classesBox) { setTimeout(() => { classesBox.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; classesBox.style.opacity = '1'; classesBox.style.transform = 'translateY(0) scale(1)'; }, 300); }
        }
        
        if (pageNumber === 4) {
            const strengthText = pageEl.querySelector('.strength-text');
            const strengthImages = pageEl.querySelector('.strength-images');
            if (strengthImages) { setTimeout(() => { strengthImages.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; strengthImages.style.opacity = '1'; strengthImages.style.transform = 'translateX(0) scale(1)'; }, 200); }
            if (strengthText) { setTimeout(() => { strengthText.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; strengthText.style.opacity = '1'; strengthText.style.transform = 'translateX(0) scale(1)'; }, 400); }
        }
        
        if (pageNumber === 5) {
            const imageBlocks = pageEl.querySelectorAll('.image-block');
            imageBlocks.forEach((block, index) => {
                setTimeout(() => {
                    block.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    block.style.opacity = '1';
                    block.style.transform = 'translateY(0) scale(1)';
                }, 300 + index * 100); // Staggered animation for 6 blocks
            });
        }
        if (pageNumber === 6) {
        const missionCard = pageEl.querySelector('.mission-card');
        const visionCard = pageEl.querySelector('.vision-card');
        
        if (missionCard) { 
            setTimeout(() => { 
                missionCard.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; 
                missionCard.style.opacity = '1'; 
                missionCard.style.transform = 'translateX(0) scale(1)'; 
            }, 200); 
        }
        
        if (visionCard) { 
            setTimeout(() => { 
                visionCard.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; 
                visionCard.style.opacity = '1'; 
                visionCard.style.transform = 'translateX(0) scale(1)'; 
            }, 400); 
        }
    }
    }
    setupMissionVisionInteractions() {
    const cards = document.querySelectorAll('.mission-card, .vision-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
        
        // Touch support
        card.addEventListener('touchstart', (e) => {
            e.preventDefault();
            card.classList.add('touch-active');
            card.style.transform = 'translateY(-5px) scale(1.01)';
        });
        
        card.addEventListener('touchend', () => {
            card.classList.remove('touch-active');
            card.style.transform = '';
        });
    });
}
    

    /**
     * Initialize Lucide Icons
     */
    initLucideIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
            console.log('✅ Lucide icons initialized');
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onPageLoad());
        } else {
            this.onPageLoad();
        }
        window.addEventListener('resize', this.debounce(() => this.onResize(), 250));
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.onResize(), 100);
        });
        document.addEventListener('visibilitychange', () => this.onVisibilityChange());
        this.setupMonitorInteractions();
        this.setupNavigationLinks();
        this.setupMissionVisionInteractions();
        this.setupSmoothScroll();
        this.setupIntersectionObserver();
        this.setupHoverCardInteractions(); // New method for hover cards
    }

    /**
     * Setup hover card interactions for enhanced UX
     */
    setupHoverCardInteractions() {
        const imageBlocks = document.querySelectorAll('.image-block.group');
        
        imageBlocks.forEach(block => {
            const hoverCard = block.querySelector('.hover-card');
            const image = block.querySelector('.image-block-img');
            
            if (!hoverCard || !image) return;
            
            // Mouse enter
            block.addEventListener('mouseenter', () => {
                // Add additional visual effects
                block.style.transform = 'translateY(-10px) scale(1.02)';
                
                // Enhance the hover card animation
                setTimeout(() => {
                    const listItems = hoverCard.querySelectorAll('li');
                    listItems.forEach((item, index) => {
                        item.style.animationDelay = `${0.1 + index * 0.1}s`;
                    });
                }, 100);
            });
            
            // Mouse leave
            block.addEventListener('mouseleave', () => {
                block.style.transform = '';
                
                // Reset list item animations
                const listItems = hoverCard.querySelectorAll('li');
                listItems.forEach(item => {
                    item.style.animationDelay = '';
                });
            });
            
            // Touch support for mobile
            block.addEventListener('touchstart', (e) => {
                e.preventDefault();
                block.classList.add('touch-active');
            });
            
            block.addEventListener('touchend', () => {
                setTimeout(() => {
                    block.classList.remove('touch-active');
                }, 2000); // Show for 2 seconds on touch
            });
        });
    }

    /**
     * Setup navigation links to work with page transitions
     */
    setupNavigationLinks() {
        const navLinks = document.querySelectorAll('.nav-link');
        const mobileMenu = document.querySelector('.mobile-menu');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                if (this.isTransitioning) return;

                const pageNumber = parseInt(e.currentTarget.dataset.page, 10);
                if (!isNaN(pageNumber)) {
                    this.goToPage(pageNumber);

                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                        document.body.classList.remove('no-scroll');
                        setTimeout(() => {
                            mobileMenu.classList.add('hidden');
                        }, 300);
                    }
                }
            });
        });
    }

    /**
     * Setup mobile menu
     */
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.querySelector('.mobile-menu');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                const isVisible = mobileMenu.classList.contains('active');
                
                if (isVisible) {
                    mobileMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                    setTimeout(() => {
                        mobileMenu.classList.add('hidden');
                    }, 300);
                } else {
                    mobileMenu.classList.remove('hidden');
                    setTimeout(() => {
                        mobileMenu.classList.add('active');
                    }, 10);
                    document.body.classList.add('no-scroll');
                }
            });

            document.addEventListener('click', (e) => {
                if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                    if (mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                        document.body.classList.remove('no-scroll');
                        setTimeout(() => {
                            mobileMenu.classList.add('hidden');
                        }, 300);
                    }
                }
            });
        }
    }

    /**
     * Detect device capabilities
     */
    detectDevice() {
        const updateDeviceState = () => {
            this.state.isMobile = window.innerWidth < 768;
            this.state.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        };
        updateDeviceState();
        window.addEventListener('resize', this.debounce(updateDeviceState, 250));
    }

    /**
     * Page load handler
     */
    onPageLoad() {
        this.initCanvasAnimations();
        this.startClockUpdate();
        document.body.classList.add('loaded');
        const page1 = document.querySelector('.page-1');
        if (page1 && this.currentPage === 1) {
            this.startPageAnimations(page1, 1);
        }
        console.log('✅ Page animations loaded');
    }

    /**
     * Window resize handler
     */
    onResize() {
        this.detectDevice();
        this.resizeCanvases();
    }

    /**
     * Visibility change handler
     */
    onVisibilityChange() {
        this.state.isVisible = !document.hidden;
        if (this.state.isVisible) {
            this.resumeAnimations();
            console.log('▶️ Animations resumed');
        } else {
            this.pauseAnimations();
            console.log('⏸️ Animations paused');
        }
    }

    /**
     * Initialize canvas animations
     */
    initCanvasAnimations() {
        this.initECGAnimation();
    }

    /**
     * Initialize ECG Animation
     */
    initECGAnimation() {
        const canvas = document.getElementById('ecgCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationOffset = 0;
        let animationId;

        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
        };
        resizeCanvas();

        const drawECG = () => {
            if (!this.state.isVisible) {
                animationId = requestAnimationFrame(drawECG);
                return;
            }
            const rect = canvas.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            const centerY = height / 2;
            ctx.clearRect(0, 0, width, height);
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = this.state.isMobile ? 1 : 1.5;
            ctx.shadowBlur = this.state.isMobile ? 4 : 8;
            ctx.shadowColor = '#ef4444';
            ctx.beginPath();
            for (let x = 0; x < width; x += 2) {
                let y = centerY;
                const relX = (x + animationOffset) % 120;
                if (relX < 10) { y = centerY; } 
                else if (relX < 15) { y = centerY - Math.sin((relX - 10) * Math.PI / 5) * 4; } 
                else if (relX < 20) { y = centerY; } 
                else if (relX < 22) { y = centerY + (relX - 20) * 2; } 
                else if (relX < 25) { y = centerY + 4 - (relX - 22) * 10; } 
                else if (relX < 28) { y = centerY - 26 + (relX - 25) * 10; } 
                else if (relX < 30) { y = centerY + 4 - (relX - 28) * 2; } 
                else if (relX < 45) { y = centerY - Math.sin((relX - 30) * Math.PI / 15) * 6; } 
                else { y = centerY; }
                if (x === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
            }
            ctx.stroke();
            ctx.strokeStyle = '#ef444440';
            ctx.lineWidth = this.state.isMobile ? 2 : 3;
            ctx.stroke();
            animationOffset += this.state.isMobile ? 1.5 : 2;
            animationId = requestAnimationFrame(drawECG);
        };
        this.animations.ecg = { draw: drawECG, resize: resizeCanvas, stop: () => cancelAnimationFrame(animationId) };
        drawECG();
    }

    /**
     * Start data animations
     */
    startDataAnimations() {
        this.animations.intervals.set('heartRate', setInterval(() => {
            if (!this.state.isVisible) return;
            const variation = (Math.random() - 0.5) * this.config.heartRate.variation;
            const newRate = Math.round(this.state.heartRate + variation);
            this.state.heartRate = Math.max(120, Math.min(140, newRate));
            this.updateElement('heartRate', this.state.heartRate);
        }, this.config.heartRate.updateInterval));
    }
	
    /**
     * Start clock update
     */
    startClockUpdate() {
        const updateClock = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            this.updateElement('clockTime', `${hours}:${minutes}`);
        };
        updateClock();
        this.animations.intervals.set('clock', setInterval(updateClock, 1000));
    }

    /**
     * Update element content safely
     */
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) { element.textContent = value; }
    }
	
    /**
     * Setup monitor interactions
     */
    setupMonitorInteractions() {
        const monitors = document.querySelectorAll('.heart-monitor, .workout-monitor');
        monitors.forEach(monitor => {
            monitor.addEventListener('mouseenter', (e) => {
                monitor.style.animationPlayState = 'paused';
                monitor.style.transform = this.state.isMobile ? 'scale(1.02) translateY(-2px)' : 'scale(1.03) translateY(-3px)';
                monitor.style.zIndex = '30';
            });
            monitor.addEventListener('mouseleave', () => {
                monitor.style.animationPlayState = 'running';
                monitor.style.transform = '';
                monitor.style.zIndex = '';
            });
            monitor.addEventListener('touchstart', (e) => {
                e.preventDefault();
                monitor.style.animationPlayState = 'paused';
                monitor.style.transform = 'scale(1.02) translateY(-2px)';
            });
            monitor.addEventListener('touchend', () => {
                monitor.style.animationPlayState = 'running';
                monitor.style.transform = '';
            });
        });
    }
    
    /**
     * Setup smooth scroll for anchor links
     */
    setupSmoothScroll() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    if (this.lenis) { this.lenis.scrollTo(target); } 
                    else { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
                }
            }
        });
    }

    /**
     * Setup intersection observer for performance
     */
    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
            document.querySelectorAll('.fade-in-up').forEach(el => { observer.observe(el); });
        }
    }

    /**
     * Resize all canvases
     */
    resizeCanvases() {
        if (this.animations.ecg?.resize) { this.animations.ecg.resize(); }
    }

    /**
     * Pause animations for performance
     */
    pauseAnimations() {
        this.animations.intervals.forEach(interval => { clearInterval(interval); });
    }

    /**
     * Resume animations
     */
    resumeAnimations() {
        this.startDataAnimations();
    }

    /**
     * Start all animations
     */
    startAnimations() {
		this.startDataAnimations();
        console.log('🎬 All animations started');
    }

    /**
     * Utility: Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Public method to destroy animations (cleanup)
     */
    destroy() {
        this.animations.intervals.forEach(interval => { clearInterval(interval); });
        this.animations.intervals.clear();
        if (this.animations.ecg?.stop) { this.animations.ecg.stop(); }
        Object.values(this.lenisInstances).forEach(instance => instance.destroy());
        console.log('🧹 Animations cleaned up');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const fitnessHero = new FitnessHeroAnimations();
    window.fitnessHero = fitnessHero;
    console.log('🚀 Fitness Hero Section initialized successfully!');
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) { console.log('⏸️ Page hidden - performance optimized'); } 
    else { console.log('▶️ Page visible - full performance restored'); }
});

if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`📊 Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
        }, 0);
    });
}
/**
 * Setup hover card interactions for enhanced UX
 */
setupHoverCardInteractions() 
{
    const imageBlocks = document.querySelectorAll('.image-block.group');
    
    imageBlocks.forEach(block => {
        const hoverCard = block.querySelector('.hover-card');
        const image = block.querySelector('.image-block-img');
        
        if (!hoverCard || !image) return;
        
        // Mouse enter
        block.addEventListener('mouseenter', () => {
            // Add additional visual effects
            block.style.transform = 'translateY(-10px) scale(1.02)';
            
            // Enhance the hover card animation
            setTimeout(() => {
                const listItems = hoverCard.querySelectorAll('li');
                listItems.forEach((item, index) => {
                    item.style.animationDelay = `${0.1 + index * 0.1}s`;
                });
            }, 100);
        });
        
        // Mouse leave
        block.addEventListener('mouseleave', () => {
            block.style.transform = '';
            
            // Reset list item animations
            const listItems = hoverCard.querySelectorAll('li');
            listItems.forEach(item => {
                item.style.animationDelay = '';
            });
        });
        
        // Touch support for mobile
        block.addEventListener('touchstart', (e) => {
            e.preventDefault();
            block.classList.add('touch-active');
        });
        
        block.addEventListener('touchend', () => {
            setTimeout(() => {
                block.classList.remove('touch-active');
            }, 2000); // Show for 2 seconds on touch
        });
    });

    // Gallery shift functionality for last image
    const lastImageBlock = document.querySelector('.page-5 .image-block:last-child');
    const scrollContent = document.querySelector('.page-5 .horizontal-scroll-content');

    if (lastImageBlock && scrollContent) {
        lastImageBlock.addEventListener('mouseenter', () => {
            scrollContent.classList.add('shift-for-last-image');
        });
        
        lastImageBlock.addEventListener('mouseleave', () => {
            scrollContent.classList.remove('shift-for-last-image');
        });
        
        // Touch support for mobile gallery shift
        lastImageBlock.addEventListener('touchstart', () => {
            scrollContent.classList.add('shift-for-last-image');
        });
        
        lastImageBlock.addEventListener('touchend', () => {
            setTimeout(() => {
                scrollContent.classList.remove('shift-for-last-image');
            }, 2000); // Keep shift for 2 seconds on touch
        });
        
        console.log('✅ Gallery shift for last image initialized');
    }
}

