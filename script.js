/**
 * Auracenter Fitness Website - Enhanced JavaScript
 * Optimized for performance and responsiveness
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
		this.totalPages = 4;
		this.isTransitioning = false;
		this.wheelThreshold = 30;
		this.wheelDelta = 0;

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
     * Initialize Lenis Smooth Scrolling
     */
initPageTransitions() {
    this.setupWheelNavigation();
    this.setupTouchNavigation();
    this.setupKeyboardNavigation();
    
    
    console.log('✅ Page transitions initialized');
}
setupWheelNavigation() {
    let wheelTimeout;
    
    window.addEventListener('wheel', (e) => {
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
        }, 100); // Reduced from 150 to 100 for more responsive transitions
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


goToPage(pageNumber) {
    if (pageNumber === this.currentPage || this.isTransitioning) return;
    
    console.log(`🔄 Starting transition from page ${this.currentPage} to page ${pageNumber}`);
    this.isTransitioning = true;
    
    const currentPageEl = document.querySelector(`.page.page-${this.currentPage}`);
    const targetPageEl = document.querySelector(`.page.page-${pageNumber}`);
  
    
    // Determine transition direction
    const isGoingDown = pageNumber > this.currentPage;
    console.log(`Direction: ${isGoingDown ? 'Down' : 'Up'}`);
    
    // ADD THIS: Reset animations for the target page BEFORE showing it
    this.resetPageAnimations(targetPageEl, pageNumber);
    
    // Remove active class from target page first
    targetPageEl.classList.remove('active');
    
    // Set initial position for target page (off-screen)
    targetPageEl.style.transition = 'none';
    targetPageEl.style.transform = isGoingDown ? 'translateY(100%)' : 'translateY(-100%)';
    targetPageEl.style.opacity = '0';
    targetPageEl.style.zIndex = '3';
    targetPageEl.style.visibility = 'visible';
    
    // Force reflow
    targetPageEl.offsetHeight;
    
    // Add active class and enable transitions
    targetPageEl.classList.add('active');
    targetPageEl.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    // Start the animation
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            // Animate current page out
            currentPageEl.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            currentPageEl.style.transform = isGoingDown ? 'translateY(-100%)' : 'translateY(100%)';
            currentPageEl.style.opacity = '0';
            
            // Animate target page in
            targetPageEl.style.transform = 'translateY(0)';
            targetPageEl.style.opacity = '1';
            
            // ADD THIS: Start page animations after slide transition begins
            setTimeout(() => {
                this.startPageAnimations(targetPageEl, pageNumber);
            }, 200); // Start animations 200ms after slide begins
        });
    });
    
    // Clean up after animation completes
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
}

/**
 * Reset page animations to their initial state
 */
resetPageAnimations(pageEl, pageNumber) {
    // Reset all fade-in-up elements
    const animatedElements = pageEl.querySelectorAll('.fade-in-up');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.animation = 'none';
        element.classList.remove('animate-in');
    });
    
    // Special handling for page 1 (hero elements)
    if (pageNumber === 1) {
        // Reset hero title
        const heroTitle = pageEl.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.style.opacity = '0';
            heroTitle.style.transform = 'translateY(30px)';
        }
        
        // Reset ALL text content in hero
        const heroContent = pageEl.querySelector('.hero-content .flex-1');
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(30px)';
        }
        
        // Reset monitors container
        const monitors = pageEl.querySelector('.monitors-container');
        if (monitors) {
            monitors.style.opacity = '0';
            monitors.style.transform = 'translateY(30px)';
        }
        
        // Reset background overlay image
        const heroBackground = pageEl.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.opacity = '0';
            heroBackground.style.transform = 'scale(1.05)';
        }
        
        // Reset background overlay (the person image)
        const heroOverlay = pageEl.querySelector('.hero-background::before');
        // Since we can't directly select ::before, we'll use a class approach
        if (heroBackground) {
            heroBackground.classList.remove('loaded');
        }
    }
    
    // Page 2 elements
    if (pageNumber === 2) {
        const aboutBox = pageEl.querySelector('.about-box');
        if (aboutBox) {
            aboutBox.style.opacity = '0';
            aboutBox.style.transform = 'translateY(50px) scale(0.95)';
        }
    }
	// Page 3 elements (add this after Page 2 handling)
if (pageNumber === 3) {
    const classesBox = pageEl.querySelector('.classes-box');
    if (classesBox) {
        classesBox.style.opacity = '0';
        classesBox.style.transform = 'translateY(50px) scale(0.95)';
    }
}
// Add this after Page 3 handling
if (pageNumber === 4) {
    const strengthText = pageEl.querySelector('.strength-text');
    const strengthImages = pageEl.querySelector('.strength-images');
    
    if (strengthText) {
        strengthText.style.opacity = '0';
        strengthText.style.transform = 'translateX(50px) scale(0.95)';
    }
    
    if (strengthImages) {
        strengthImages.style.opacity = '0';
        strengthImages.style.transform = 'translateX(-50px) scale(0.95)';
    }
}
}

/**
 * Start page animations with staggered delays
 */
startPageAnimations(pageEl, pageNumber) {
    // Animate all fade-in-up elements
    const animatedElements = pageEl.querySelectorAll('.fade-in-up');
    animatedElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.transition = 'all 0.8s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.classList.add('animate-in');
        }, index * 150);
    });
    
    // Special handling for page 1 (hero elements)
    if (pageNumber === 1) {
        // Animate background first
        const heroBackground = pageEl.querySelector('.hero-background');
        if (heroBackground) {
            setTimeout(() => {
                heroBackground.style.transition = 'all 0.8s ease-in-out';
                heroBackground.style.opacity = '1';
                heroBackground.style.transform = 'scale(1)';
                // Add loaded class to trigger ::before animation
                setTimeout(() => {
                    heroBackground.classList.add('loaded');
                }, 300);
            }, 100);
        }
        
        // Animate hero content (text area)
        const heroContent = pageEl.querySelector('.hero-content .flex-1');
        if (heroContent) {
            setTimeout(() => {
                heroContent.style.transition = 'all 0.8s ease-out';
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 400);
        }
        
        // Animate hero title specifically
        const heroTitle = pageEl.querySelector('.hero-title');
        if (heroTitle) {
            setTimeout(() => {
                heroTitle.style.transition = 'all 0.8s ease-out';
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'translateY(0)';
            }, 600);
        }
        
        // Animate button
        const button = pageEl.querySelector('.hero-content button');
        if (button) {
            setTimeout(() => {
                button.style.transition = 'all 0.8s ease-out';
                button.style.opacity = '1';
                button.style.transform = 'translateY(0)';
            }, 800);
        }
        
        // Animate monitors last
        const monitors = pageEl.querySelector('.monitors-container');
        if (monitors) {
            setTimeout(() => {
                monitors.style.transition = 'all 0.8s ease-out';
                monitors.style.opacity = '1';
                monitors.style.transform = 'translateY(0)';
            }, 1000);
        }
    }
    
    // Page 2 animations
    if (pageNumber === 2) {
        const aboutBox = pageEl.querySelector('.about-box');
        if (aboutBox) {
            setTimeout(() => {
                aboutBox.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                aboutBox.style.opacity = '1';
                aboutBox.style.transform = 'translateY(0) scale(1)';
            }, 300);
        }
    }
	// Page 3 animations (add this after Page 2 handling)
if (pageNumber === 3) {
    const classesBox = pageEl.querySelector('.classes-box');
    if (classesBox) {
        setTimeout(() => {
            classesBox.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            classesBox.style.opacity = '1';
            classesBox.style.transform = 'translateY(0) scale(1)';
        }, 300);
    }
}
// Add this after Page 3 handling
// CORRECT - These match your HTML classes!
// THIS IS CORRECT - It shows the content with animation!
if (pageNumber === 4) {
    const strengthText = pageEl.querySelector('.strength-text');
    const strengthImages = pageEl.querySelector('.strength-images');
    
    if (strengthImages) {
        setTimeout(() => {
            strengthImages.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            strengthImages.style.opacity = '1';  // ✅ Shows it
            strengthImages.style.transform = 'translateX(0) scale(1)';  // ✅ Moves to position
        }, 200);
    }
    
    if (strengthText) {
        setTimeout(() => {
            strengthText.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            strengthText.style.opacity = '1';  // ✅ Shows it
            strengthText.style.transform = 'translateX(0) scale(1)';  // ✅ Moves to position
        }, 400);
    }
}
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
    /**
 * Setup event listeners
 */
setupEventListeners() {
    // Page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.onPageLoad());
    } else {
        this.onPageLoad();
    }

    // Window events
    window.addEventListener('resize', this.debounce(() => this.onResize(), 250));
    window.addEventListener('orientationchange', () => {
        setTimeout(() => this.onResize(), 100);
    });

    // Visibility API
    document.addEventListener('visibilitychange', () => this.onVisibilityChange());

    // Monitor interactions
    this.setupMonitorInteractions();

    // Navigation links functionality
    this.setupNavigationLinks();

    // Smooth scroll for anchor links
    this.setupSmoothScroll();

    // Intersection Observer for animations
    this.setupIntersectionObserver();
}

/**
 * Setup navigation links to work with page transitions
 */


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

            // Close menu when clicking outside
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
            
            // Update monitors positioning based on device
    
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
    
    // Trigger fade-in animations for initial page load
    document.body.classList.add('loaded');
    
    // Start animations for page 1 on initial load
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
        
        // Reinitialize Lenis if needed
        if (this.lenis && this.state.isMobile) {
            this.lenis.destroy();
            this.lenis = null;
        } else if (!this.lenis && !this.state.isMobile) {
            this.initLenis();
        }
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

        // Set canvas size with device pixel ratio
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

        // ECG drawing function
        const drawECG = () => {
            if (!this.state.isVisible) {
                animationId = requestAnimationFrame(drawECG);
                return;
            }

            const rect = canvas.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            const centerY = height / 2;

            // Clear canvas
            ctx.clearRect(0, 0, width, height);
            
            // Set line style
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = this.state.isMobile ? 1 : 1.5;
            ctx.shadowBlur = this.state.isMobile ? 4 : 8;
            ctx.shadowColor = '#ef4444';
            
            // Draw ECG wave
            ctx.beginPath();
            
            for (let x = 0; x < width; x += 2) {
                let y = centerY;
                
                // Create realistic ECG pattern
                const relX = (x + animationOffset) % 120;
                
                if (relX < 10) {
                    y = centerY;
                } else if (relX < 15) {
                    // P wave
                    y = centerY - Math.sin((relX - 10) * Math.PI / 5) * 4;
                } else if (relX < 20) {
                    y = centerY;
                } else if (relX < 22) {
                    // Q dip
                    y = centerY + (relX - 20) * 2;
                } else if (relX < 25) {
                    // R peak
                    y = centerY + 4 - (relX - 22) * 10;
                } else if (relX < 28) {
                    // S dip
                    y = centerY - 26 + (relX - 25) * 10;
                } else if (relX < 30) {
                    y = centerY + 4 - (relX - 28) * 2;
                } else if (relX < 45) {
                    // T wave
                    y = centerY - Math.sin((relX - 30) * Math.PI / 15) * 6;
                } else {
                    y = centerY;
                }
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
            
            // Draw glow effect
            ctx.strokeStyle = '#ef444440';
            ctx.lineWidth = this.state.isMobile ? 2 : 3;
            ctx.stroke();
            
            animationOffset += this.state.isMobile ? 1.5 : 2;
            animationId = requestAnimationFrame(drawECG);
        };

        this.animations.ecg = {
            draw: drawECG,
            resize: resizeCanvas,
            stop: () => cancelAnimationFrame(animationId)
        };

        drawECG();
    }

    /**
     * Start data animations
     */
    startDataAnimations() {
        // Heart rate variation
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
        if (element) {
            element.textContent = value;
        }
    }
	
	

    /**
     * Setup monitor interactions
     */
    setupMonitorInteractions() {
    const monitors = document.querySelectorAll('.heart-monitor, .workout-monitor');
    
    monitors.forEach(monitor => {
        // Mouse events
        monitor.addEventListener('mouseenter', (e) => {
            // Pause bouncing animation but keep internal animations
            monitor.style.animationPlayState = 'paused';
            
            // Apply hover transform
            monitor.style.transform = this.state.isMobile ? 
                'scale(1.02) translateY(-2px)' : 
                'scale(1.03) translateY(-3px)';
            
            monitor.style.zIndex = '30';
        });
        
        monitor.addEventListener('mouseleave', () => {
            // Resume bouncing animation
            monitor.style.animationPlayState = 'running';
            
            // Reset transform
            monitor.style.transform = '';
            monitor.style.zIndex = '';
        });
        
        // Touch events for mobile
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
                    if (this.lenis) {
                        this.lenis.scrollTo(target);
                    } else {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
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
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe fade-in elements
            document.querySelectorAll('.fade-in-up').forEach(el => {
                observer.observe(el);
            });
        }
    }

    /**
     * Resize all canvases
     */
    resizeCanvases() {
        if (this.animations.ecg?.resize) {
            this.animations.ecg.resize();
        }
    }

    /**
     * Pause animations for performance
     */
    pauseAnimations() {
        // Pause intervals
        this.animations.intervals.forEach(interval => {
            clearInterval(interval);
        });
        
        // Canvas animations will automatically pause due to visibility check
    }

    /**
     * Resume animations
     */
    resumeAnimations() {
        // Restart data animations
        this.startDataAnimations();
        
        // Canvas animations will automatically resume due to visibility check
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
        // Clear all intervals
        this.animations.intervals.forEach(interval => {
            clearInterval(interval);
        });
        this.animations.intervals.clear();

        // Stop canvas animations
        if (this.animations.ecg?.stop) {
            this.animations.ecg.stop();
        }

        // Destroy Lenis
        if (this.lenis) {
            this.lenis.destroy();
        }

        console.log('🧹 Animations cleaned up');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main application
    const fitnessHero = new FitnessHeroAnimations();
    

   
    
    // Make globally accessible for debugging
    window.fitnessHero = fitnessHero;

    
    console.log('🚀 Fitness Hero Section initialized successfully!');
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('⏸️ Page hidden - performance optimized');
    } else {
        console.log('▶️ Page visible - full performance restored');
    }
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`📊 Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
        }, 0);
    });
}
