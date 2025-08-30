class SponsorSlider {
    constructor() {
        this.currentLogoImg = document.getElementById('current-sponsor-logo');
        this.prevBtn = document.getElementById('page-16-prevBtn');
        this.nextBtn = document.getElementById('page-16-nextBtn');
        this.dotsContainer = document.getElementById('sponsor-dots');
        this.dotsPrev = document.getElementById('dots-prev');
        this.dotsNext = document.getElementById('dots-next');
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
        
        // All sponsor images
        this.sponsorImages = [
            { src: './assets/page_16/tamara.png', alt: 'Tamara' },
            { src: './assets/page_16/snb.png', alt: 'SNB' },
            { src: './assets/page_16/sela.png', alt: 'Sela' },
            { src: './assets/page_16/napco.png', alt: 'Napco' },
            { src: './assets/page_16/imc.png', alt: 'IMC' },
            { src: './assets/page_16/نون.png', alt: 'Noon' },
            { src: './assets/page_16/ساعد (1).png', alt: 'Saed' },
            { src: './assets/page_16/_e2.png', alt: 'E2' },
            { src: './assets/page_16/1111.png', alt: 'Company 1111' },
            { src: './assets/page_16/222.png', alt: 'Company 222' },
            { src: './assets/page_16/444.png', alt: 'Company 444' },
            { src: './assets/page_16/٥٥.png', alt: 'Company 55' },
            { src: './assets/page_16/44dbcf_102a56347d064d588ece70edf5aac088~mv2.png', alt: 'Partner Logo' },
            { src: './assets/page_16/44dbcf_2014df59b7a34fd283def9da1dfd2b24_mv2.png', alt: 'Partner Logo' },
            { src: './assets/page_16/44dbcf_2a6571b6b917440baf6bd531e4adcef2~mv2.png', alt: 'Partner Logo' },
            { src: './assets/page_16/44dbcf_3213a96af51e46ebaebfe27b6c9a1584_mv2.png', alt: 'Partner Logo' },
            { src: './assets/page_16/44dbcf_4d803d8313b84e2aa05ba66bdfe36a6e~mv2.png', alt: 'Partner Logo' },
            { src: './assets/page_16/44dbcf_597c7182d6fe4acda3b494508301637b~mv2.png', alt: 'Partner Logo' },
            { src: './assets/page_16/44dbcf_67d00b8c079844c29cf22a6e77a75836~mv2.png', alt: 'Partner Logo' },
            { src: './assets/page_16/44dbcf_691ffe08c0724eabb4225d68b1a1062a~mv2.png', alt: 'Partner Logo' },
            { src: './assets/page_16/44dbcf_6df7d2fd90da42ef9ee09b9fb6702c57~mv2.png', alt: 'Partner Logo' },
            { src: './assets/page_16/44dbcf_6f323aa89ae7408fb6d9fdc4b29348cf~mv2.png', alt: 'Partner Logo' },
            { src: './assets/page_16/44dbcf_6fe86fd925d545f786c3a9038e0fb8c9~mv2.png', alt: 'Partner Logo' },
            { src: './assets/page_16/44dbcf_719ca68e631e41a28a4612127cb23baemv2.png', alt: 'Partner Logo' },
            { src: './assets/page_16/44dbcf_72df45989c1146e0be94493145971023~mv2.png', alt: 'Partner Logo' },
            { src: './assets/page_16/44dbcf_846d655d7a0744718a86ddf812b7b6ac~mv2.png', alt: 'Partner Logo' },
            { src: './assets/page_16/44dbcf_9a387606620c42d689bada1297bc11a1~mv2.png', alt: 'Partner Logo' },
            { src: './assets/page_16/44dbcf_9c7f5d57704841b3afa7cb30014c55b2mv2.png', alt: 'Partner Logo' },
            { src: './assets/page_16/44dbcf_a6b14394d30a461187759e88117f9419_mv2.png', alt: 'Partner Logo' },
            { src: './assets/page_16/44dbcf_d64b96ce451444c4b07a697c33b8bf03_mv2.png', alt: 'Partner Logo' },
            { src: './assets/page_16/44dbcf_de3a2d19a6cd4f8f9ef97d29edba353a_mv2.png', alt: 'Partner Logo' },
            { src: './assets/page_16/44dbcf_e4f3cda065be4c868d1a80c2a4b70eff_mv2.png', alt: 'Partner Logo' },
            { src: './assets/page_16/44dbcf_ec0827d74cdf4f9b83f4bf059ff22686_mv2.png', alt: 'Partner Logo' },
            { src: './assets/page_16/44dbcf_f9364a576bbb4a618e304883b47100d4_mv2.png', alt: 'Partner Logo' }
        ];
        
        this.totalSlides = this.sponsorImages.length;
        this.init();
    }
    
    updateResponsiveSettings() {
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            this.visibleDots = 8; // Show 8 dots on mobile for better fit
            this.dotWidth = 32; // 24px dot + 8px margin
        } else {
            this.visibleDots = 10; // Show 10 dots on desktop
            this.dotWidth = 40; // 32px dot + 8px margin
        }
    }
    
    init() {
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
        if (!this.dotsContainer) return;
        
        this.dotsContainer.innerHTML = '';
        
        // Update responsive settings
        this.updateResponsiveSettings();
        
        // Set container width based on screen size
        this.dotsContainer.parentElement.style.width = `${this.visibleDots * this.dotWidth}px`;
        
        const isMobile = window.innerWidth < 768;
        const dotSizeClass = isMobile ? 'w-6 h-6' : 'w-8 h-8';
        
        this.sponsorImages.forEach((image, index) => {
            const dot = document.createElement('button');
            dot.className = `${dotSizeClass} rounded-full border-2 border-gray-300 overflow-hidden hover:scale-110 transition-all duration-200 flex-shrink-0`;
            dot.innerHTML = `
                <img src="${image.src}" alt="${image.alt}" class="w-full h-full object-contain opacity-50 transition-opacity duration-300">
            `;
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
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
        if (!this.currentLogoImg || !this.sponsorImages[this.currentSlide]) return;
        
        const currentImg = this.sponsorImages[this.currentSlide];
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
        const targetElement = document.querySelector('.page-16');
        if (!targetElement) return;
        
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
        if (!this.isInViewport) return;
        
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
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