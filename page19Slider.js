class PartnerSlider {
    constructor() {
        this.currentLogoImg = document.getElementById('current-partner-logo');
        this.prevBtn = document.getElementById('page-19-prevBtn');
        this.nextBtn = document.getElementById('page-19-nextBtn');
        this.dotsContainer = document.getElementById('partner-dots');
        this.dotsPrev = document.getElementById('page-19-dots-prev');
        this.dotsNext = document.getElementById('page-19-dots-next');
        this.currentSlide = 0;
        this.totalSlides = 0;
        this.isAnimating = false;
        this.autoplayInterval = null;
        this.isInViewport = false;
        
        // Dots display settings - will be updated based on screen size
        this.visibleDots = 10;
        this.currentDotOffset = 0;
        this.dotWidth = 40; // Will be calculated based on screen size
        this.updateResponsiveSettings();
        
        // Sport partner images
        this.partnerImages = [
            { src: './assets/page_19/sport1.png', alt: 'Sport Partner 1' },
            { src: './assets/page_19/sport2.png', alt: 'Sport Partner 2' }
        ];
        
        this.totalSlides = this.partnerImages.length;
        this.init();
    }
    
    updateResponsiveSettings() {
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            this.visibleDots = 2; // Show 2 dots for 2 images
            this.dotWidth = 32; // 24px dot + 8px margin
        } else {
            this.visibleDots = 2; // Show 2 dots for 2 images
            this.dotWidth = 40; // 32px dot + 8px margin
        }
    }
    
    init() {
        console.log('PartnerSlider init called');
        console.log('Total slides:', this.totalSlides);
        console.log('Partner images:', this.partnerImages);
        
        this.generateDots();
        this.updateButtonStates();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        
        // Initialize with first image
        this.updateCurrentImage();
        this.updateDots();
        
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                // Update responsive settings and regenerate dots
                this.generateDots();
                this.updateDots();
                
                if (this.isInViewport) {
                    this.startAutoplay();
                }
            }, 150);
        });
    }
    
    generateDots() {
        console.log('generateDots called');
        console.log('dotsContainer:', this.dotsContainer);
        
        if (!this.dotsContainer) {
            console.error('dotsContainer not found!');
            return;
        }
        
        this.dotsContainer.innerHTML = '';
        
        // Update responsive settings
        this.updateResponsiveSettings();
        
        // Set container width based on screen size
        this.dotsContainer.parentElement.style.width = `${this.visibleDots * this.dotWidth}px`;
        
        const isMobile = window.innerWidth < 768;
        const dotSizeClass = isMobile ? 'w-6 h-6' : 'w-8 h-8';
        
        console.log('Creating dots for', this.partnerImages.length, 'images');
        
        this.partnerImages.forEach((image, index) => {
            console.log('Creating dot for image:', image.src);
            const dot = document.createElement('button');
            dot.className = `${dotSizeClass} rounded-full border-2 border-gray-300 overflow-hidden hover:scale-110 transition-all duration-200 flex-shrink-0`;
            dot.innerHTML = `
                <img src="${image.src}" alt="${image.alt}" class="w-full h-full object-contain opacity-50 transition-opacity duration-300">
            `;
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
            console.log('Dot created and appended');
        });
        
        this.updateDotsPosition();
    }
    
    updateDots() {
        if (!this.dotsContainer) return;
        
        const dots = this.dotsContainer.querySelectorAll('button');
        const isMobile = window.innerWidth < 768;
        const dotSizeClass = isMobile ? 'w-6 h-6' : 'w-8 h-8';
        
        dots.forEach((dot, index) => {
            const img = dot.querySelector('img');
            if (index === this.currentSlide) {
                // Active dot - full opacity and colored border
                dot.className = `${dotSizeClass} rounded-full border-2 border-[#182a41] overflow-hidden hover:scale-110 transition-all duration-200 flex-shrink-0`;
                img.className = 'w-full h-full object-contain opacity-100 transition-opacity duration-300';
            } else {
                // Inactive dot - faded
                dot.className = `${dotSizeClass} rounded-full border-2 border-gray-300 overflow-hidden hover:scale-110 transition-all duration-200 flex-shrink-0`;
                img.className = 'w-full h-full object-contain opacity-50 transition-opacity duration-300';
            }
        });
        
        // Auto-slide dots if current slide is outside visible range
        this.autoSlideDots();
    }
    
    updateDotsPosition() {
        if (!this.dotsContainer) return;
        
        const translateX = -this.currentDotOffset * this.dotWidth;
        this.dotsContainer.style.transform = `translateX(${translateX}px)`;
    }
    
    autoSlideDots() {
        // Calculate if current slide is visible in the dots
        const currentSlidePosition = this.currentSlide;
        const startVisible = this.currentDotOffset;
        const endVisible = this.currentDotOffset + this.visibleDots - 1;
        
        if (currentSlidePosition < startVisible) {
            // Current slide is before visible range - slide left
            this.currentDotOffset = Math.max(0, currentSlidePosition);
            this.updateDotsPosition();
        } else if (currentSlidePosition > endVisible) {
            // Current slide is after visible range - slide right
            this.currentDotOffset = Math.min(
                this.totalSlides - this.visibleDots,
                currentSlidePosition - this.visibleDots + 1
            );
            this.updateDotsPosition();
        }
    }
    
    slideDotsPrev() {
        if (this.currentDotOffset > 0) {
            this.currentDotOffset--;
            this.updateDotsPosition();
        }
    }
    
    slideDotsNext() {
        if (this.currentDotOffset < this.totalSlides - this.visibleDots) {
            this.currentDotOffset++;
            this.updateDotsPosition();
        }
    }
    
    updateCurrentImage() {
        if (!this.currentLogoImg || !this.partnerImages[this.currentSlide]) return;
        
        const currentImg = this.partnerImages[this.currentSlide];
        this.currentLogoImg.src = currentImg.src;
        this.currentLogoImg.alt = currentImg.alt;
    }
    
    setupEventListeners() {
        if (!this.prevBtn || !this.nextBtn) return;
        
        // Button hover animations
        [this.prevBtn, this.nextBtn].forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, { scale: 1.1, duration: 0.3, ease: "back.out(1.7)" });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { scale: 1, duration: 0.3, ease: "back.out(1.7)" });
            });
        });
        
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Dots navigation
        if (this.dotsPrev) {
            this.dotsPrev.addEventListener('click', () => this.slideDotsPrev());
        }
        if (this.dotsNext) {
            this.dotsNext.addEventListener('click', () => this.slideDotsNext());
        }
        
        // Touch/swipe support
        let startX = 0;
        let isDragging = false;
        
        this.currentLogoImg.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.stopAutoplay();
        });
        
        this.currentLogoImg.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            isDragging = false;
            if (this.isInViewport) {
                this.startAutoplay();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // Pause autoplay on hover
        if (this.currentLogoImg) {
            this.currentLogoImg.addEventListener('mouseenter', () => this.stopAutoplay());
            this.currentLogoImg.addEventListener('mouseleave', () => {
                if (this.isInViewport) {
                    this.startAutoplay();
                }
            });
        }
    }
    
    setupIntersectionObserver() {
        const targetElement = document.querySelector('.page-19');
        console.log('Setting up intersection observer for:', targetElement);
        if (!targetElement) {
            console.error('page-19 element not found for intersection observer');
            return;
        }
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isInViewport = entry.isIntersecting;
                
                if (entry.isIntersecting) {
                    // Page is in viewport - start autoplay on all devices
                    this.startAutoplay();
                } else {
                    // Page is out of viewport - stop autoplay
                    this.stopAutoplay();
                }
            });
        }, {
            threshold: 0.3
        });
        
        this.observer.observe(targetElement);
    }
    
    goToSlide(index, animate = true) {
        if (this.isAnimating || !this.currentLogoImg) return;
        
        this.currentSlide = index;
        
        if (animate) {
            this.isAnimating = true;
            
            // Slide out current image to the left
            gsap.to(this.currentLogoImg, {
                x: -300,
                opacity: 0,
                duration: 0.4,
                ease: "power2.in",
                onComplete: () => {
                    // Update image source
                    this.updateCurrentImage();
                    
                    // Position new image off-screen to the right
                    gsap.set(this.currentLogoImg, { x: 300, opacity: 0 });
                    
                    // Slide in new image from the right
                    gsap.to(this.currentLogoImg, {
                        x: 0,
                        opacity: 1,
                        duration: 0.5,
                        ease: "power2.out",
                        onComplete: () => {
                            this.isAnimating = false;
                        }
                    });
                }
            });
        } else {
            this.updateCurrentImage();
            gsap.set(this.currentLogoImg, { x: 0, opacity: 1 });
        }
        
        this.updateButtonStates();
        this.updateDots();
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex);
    }
    
    updateButtonStates() {
        if (!this.prevBtn || !this.nextBtn) return;
        
        // Since we have infinite loop, both buttons are always active
        gsap.to(this.prevBtn, {
            opacity: 1,
            duration: 0.3
        });
        
        gsap.to(this.nextBtn, {
            opacity: 1,
            duration: 0.3
        });
    }
    
    startAutoplay() {
        console.log('startAutoplay called, isInViewport:', this.isInViewport);
        if (!this.isInViewport) return;
        
        this.stopAutoplay();
        console.log('Starting autoplay with 2 second interval');
        this.autoplayInterval = setInterval(() => {
            console.log('Auto-advancing to next slide');
            this.nextSlide();
        }, 2000); // 2 second interval for automatic sliding
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}