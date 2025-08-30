class VideoSlider {
    constructor(type, totalSlides) {
        const page = type == 'videos' ? 'page-8' : 'page-17';
        this.type = type;
        this.slider = document.getElementById(`${page}-slider`);
        this.prevBtn = document.getElementById(`${page}-prevBtn`);
        this.nextBtn = document.getElementById(`${page}-nextBtn`);
        this.currentSlide = 0;
        this.totalSlides = totalSlides;
        this.isAnimating = false;
        
        // Touch/swipe variables
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.isDragging = false;
        this.threshold = 50; // Minimum distance for swipe
        
        this.init();
    }
    
    init() {
        this.addEventListeners();
        this.updateButtonStates();
        
        // Setup intersection observer for viewport-based autoplay
        this.setupIntersectionObserver();
        
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                if (window.innerWidth >= 768) {
                    this.stopAutoplay();
                }
            }, 150);
        });

        // Initialize GSAP
        gsap.set(this.slider, { x: 0 });
    }
    
    addEventListeners() {
        // Navigation arrows with GSAP hover animations
        this.prevBtn.addEventListener('mouseenter', () => {
            gsap.to(this.prevBtn, { scale: 1.1, duration: 0.2, ease: "power2.out" });
        });
        this.prevBtn.addEventListener('mouseleave', () => {
            gsap.to(this.prevBtn, { scale: 1, duration: 0.2, ease: "power2.out" });
        });
        this.nextBtn.addEventListener('mouseenter', () => {
            gsap.to(this.nextBtn, { scale: 1.1, duration: 0.2, ease: "power2.out" });
        });
        this.nextBtn.addEventListener('mouseleave', () => {
            gsap.to(this.nextBtn, { scale: 1, duration: 0.2, ease: "power2.out" });
        });
        
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Touch events for mobile
        this.slider.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.slider.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        this.slider.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        
        // Mouse events for desktop
        this.slider.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.slider.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.slider.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.slider.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // Pause autoplay on hover
        this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
        this.slider.addEventListener('mouseleave', () => {
            if (this.isInViewport && window.innerWidth < 768) {
                this.startAutoplay();
            }
        });
        
        // Add GSAP hover animations to cards
        const cards = this.slider.querySelectorAll('.w-full.max-w-sm');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, { scale: 1.05, duration: 0.3, ease: "power2.out" });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out" });
            });
        });
        
        // Add GSAP animations to play buttons
        const playButtons = this.slider.querySelectorAll('button[class*="rounded-full"][class*="w-20"]');
        playButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                gsap.to(button, { scale: 1.1, duration: 0.2, ease: "back.out(1.7)" });
            });
            button.addEventListener('mouseleave', () => {
                gsap.to(button, { scale: 1, duration: 0.2, ease: "back.out(1.7)" });
            });
        });
    }
    
    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
        this.isDragging = true;
        this.stopAutoplay();
    }
    
    handleTouchMove(e) {
        if (!this.isDragging) return;
        this.currentX = e.touches[0].clientX;
        this.currentY = e.touches[0].clientY;
    }
    
    handleTouchEnd(e) {
        if (!this.isDragging) return;
        this.isDragging = false;
        
        const deltaX = this.currentX - this.startX;
        const deltaY = Math.abs(this.currentY - this.startY);
        
        // Check if it's a horizontal swipe
        if (Math.abs(deltaX) > this.threshold && Math.abs(deltaX) > deltaY) {
            if (deltaX > 0) {
                this.prevSlide();
            } else {
                this.nextSlide();
            }
        }
        
        this.startAutoplay();
    }
    
    /**
     * Setup intersection observer to start autoplay only when page is in viewport
     */
    setupIntersectionObserver() {
        const targetElement = document.querySelector(this.type == 'videos' ? '.page-8' : '.page-17');
        if (!targetElement) return;
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isInViewport = entry.isIntersecting;
                
                if (entry.isIntersecting) {
                    // Page is in viewport - start autoplay if mobile
                    if (window.innerWidth < 768) {
                        this.startAutoplay();
                    }
                } else {
                    // Page is out of viewport - stop autoplay
                    this.stopAutoplay();
                }
            });
        }, {
            threshold: 0.3 // Trigger when 30% of the page is visible
        });
        
        this.observer.observe(targetElement);
    }
    
    handleMouseDown(e) {
        this.startX = e.clientX;
        this.isDragging = true;
        gsap.set(this.slider, { cursor: 'grabbing' });
    }
    
    handleMouseMove(e) {
        if (!this.isDragging) return;
        this.currentX = e.clientX;
    }
    
    handleMouseUp(e) {
        if (!this.isDragging) return;
        this.isDragging = false;
        gsap.set(this.slider, { cursor: 'grab' });
        
        const deltaX = this.currentX - this.startX;
        
        if (Math.abs(deltaX) > this.threshold) {
            if (deltaX > 0) {
                this.prevSlide();
            } else {
                this.nextSlide();
            }
        }
    }
    
    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        
        this.isAnimating = true;
        this.currentSlide = index;
        
        const translateX = -index * window.innerWidth;
        
        // Use GSAP for smooth animation
        gsap.to(this.slider, {
            x: translateX,
            duration: 0.8,
            ease: "power3.out",
            onComplete: () => {
                this.isAnimating = false;
            }
        });
        
        // Update button states
        this.updateButtonStates();
        
        // Add stagger animation to slide content
        const currentSlideElement = this.slider.children[index];
        const card = currentSlideElement.querySelector(this.type == 'videos' ? '.video-wrapper' : '.max-w-sm');
        // Animate card entrance
        gsap.fromTo(card, 
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, delay: 0.3, ease: "back.out(1.7)" }
        );
    }
    
    nextSlide() {
        if (this.isAnimating) return;
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        if (this.isAnimating) return;
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex);
    }
    
    updateButtonStates() {
        // Update button opacity based on current slide position
        // Since VideoSlider uses infinite looping, we could show both buttons always
        // Or hide them based on first/last slide if desired
        
        gsap.to(this.prevBtn, {
            opacity: this.currentSlide > 0 ? 1 : 0.5,
            duration: 0.3
        });
        
        gsap.to(this.nextBtn, {
            opacity: this.currentSlide < this.totalSlides - 1 ? 1 : 0.5,
            duration: 0.3
        });
    }
    
    startAutoplay() {
        // Only start autoplay if in viewport and on mobile
        if (!this.isInViewport || window.innerWidth >= 768) return;
        
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, 3000);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}