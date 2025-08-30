class CardSlider {
    constructor(type, data, lang = 'en') {
        const page = type == 'classes' ? 'page-5' : 'page-14';
        this.lang = lang;
        this.data = data;
        this.type = type;
        this.processor = type == 'classes' ? this.addClassCard : this.addTrainerCard;
        this.container = document.getElementById(`${page}-slider`);
        this.prevBtn = document.getElementById(`${page}-prevBtn`);
        this.nextBtn = document.getElementById(`${page}-nextBtn`);
        this.currentIndex = 0;
        this.cardWidth = 0;
        this.visibleCards = 1;
        this.totalCards = 0;
        this.isAnimating = false;
        
        this.init();
    }

    setupSlider() {
        this.calculateDimensions();
        this.updateButtonStates();
        this.setupEventListeners();
        if (window.innerWidth < 768)
            this.startAutoplay();
    }

    async init() {
        this.generateCards();
        setTimeout(() => {
            this.setupSlider();
        }, 100)
    
        // Setup intersection observer for viewport-based autoplay
        this.setupIntersectionObserver();
        
        // Setup resize handler
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                if (window.innerWidth < 768) {
                    this.calculateDimensions();
                    this.goToSlide(this.currentIndex, false);
                } else {
                    this.stopAutoplay();
                }
            }, 150);
        });
    }
    
    generateCards() {
        this.data.forEach((classData, index) => {
            this.processor(classData, index === this.data.length - 1);
        });
        this.totalCards = this.data.length;
    }
    
    addTrainerCard({ imageSrc, name, title, qualifications, index }, isLast) {
            const container = document.querySelector('.trainers-container');
            if (!container) return;
            const card = document.createElement('div');
            card.className = 'trainer_card trainer_cards w-[50vw] md:w-[30vw] h-[30vh] md:h-[50vh] md:hover:z-[3] cursor-pointer group flex-shrink-0';
            card.id = "trainer-card-container-"+index
            card.innerHTML = `
                <div id="trainer-card-${index}" class="card__content relative transition-transform duration-1000 w-full h-full">    
                    <picture id="trainer-card-img-${index}" class="card__front">
                    <source 
                        type="image/avif"
                        srcset="
                        ${imageSrc}-640.avif 640w,
                        ${imageSrc}-768.avif 768w,
                        ${imageSrc}-1024.avif 1024w,
                        ${imageSrc}-1920.avif 1920w
                        "
                        sizes="(max-width: 640px) 640px,
                            (max-width: 768px) 768px,
                            (max-width: 1024px) 1024px,
                            1920px">
                
                    <source 
                        type="image/jpeg"
                        srcset="
                        ${imageSrc}-640.jpg 640w,
                        ${imageSrc}-768.jpg 768w,
                        ${imageSrc}-1024.jpg 1024w,
                        ${imageSrc}-1920.jpg 1920w
                        "
                        sizes="(max-width: 640px) 640px,
                            (max-width: 768px) 768px,
                            (max-width: 1024px) 1024px,
                            1920px">  
                    <img src="${imageSrc}.png" alt="${title[this.lang]}"  loading="lazy"  class="absolute z-[1] w-full h-full object-cover object-center ease-in-out rounded-xl transition-all duration-800 md:group-hover:scale-[1.05] md:group-hover:z-[2]" loading="lazy">
                </picture>               
                    <div id="trainer-card-content-${index}" class="rounded-xl card__back justify-center h-full w-full px-4 py-4 absolute bottom-0 left-0 bg-[#c7b6a8] md:translate-y-0 md:group-hover:translate-y-[100%] transition-transform transition-opacity duration-[600ms] ease-out shadow-[0_20px_40px_rgba(0,0,0,0.3)] will-change-[transform] will-change-[opacity] cursor-pointer flex flex-col justify-start items-start">
                        <h2 class="text-lg md:text-xl font-bold uppercase tracking-wide" style="line-height: 1">${name[this.lang]}</h2>
                        <p class="text-base md:text-lg font-medium">${title[this.lang]}</p>
                        <ul class="space-y-2 text-black list-disc px-4">
                            ${this.addTrainerListItem(qualifications)}
                        </ul>
                    </div>
                </div>
            `;
            container.appendChild(card);
    }

    addTrainerListItem(qualifications) {
        return `
                                        ${qualifications[this.lang].map(qual => `
                                <li class="text-sm md:text-md">${qual}</li>
                            `).join('')}

        `
    }
    addClassListItem(listItems) {
        return `${listItems[this.lang]
                            .map(
                                (item) => `
                                <li class="text-sm md:text-lg">
                                    ${item}
                                </li>`,
                            )
                            .join("")}`
    }

    addClassCard({ imageSrc, title, listItems, index }, isLast) {
        const container = document.querySelector(".classes-container");
        if (!container) return;

        const card = document.createElement("div");
        card.className =
            "hover-card classes_cards w-[50vw] md:w-[30vw] h-[30vh] md:h-[50vh] md:hover:z-[3] cursor-pointer group flex-shrink-0";
        card.id = "hover-card-container-" + index;
        card.innerHTML = `
                    <div id="hover-card-${index}" class="card__content relative transition-transform duration-1000 w-full h-full">    
                <picture id="trainer-card-img-${index}" class="card__front">
                        <source 
                            type="image/avif"
                            srcset="
                            ${imageSrc}-640.avif 640w,
                            ${imageSrc}-768.avif 768w,
                            ${imageSrc}-1024.avif 1024w,
                            ${imageSrc}-1920.avif 1920w
                            "
                            sizes="(max-width: 640px) 640px,
                                (max-width: 768px) 768px,
                                (max-width: 1024px) 1024px,
                                1920px">
                    
                        <source 
                            type="image/jpeg"
                            srcset="
                            ${imageSrc}-640.jpg 640w,
                            ${imageSrc}-768.jpg 768w,
                            ${imageSrc}-1024.jpg 1024w,
                            ${imageSrc}-1920.jpg 1920w
                            "
                            sizes="(max-width: 640px) 640px,
                                (max-width: 768px) 768px,
                                (max-width: 1024px) 1024px,
                                1920px">  
                        <img src="${imageSrc}.png" alt="${title[this.lang]}"  loading="lazy"  class="absolute z-[1] w-full h-full object-cover object-center ease-in-out rounded-xl transition-all duration-800 md:group-hover:scale-[1.05] md:group-hover:z-[2]" loading="lazy">
                    </picture>  
                        <div id="hover-card-content-${index}" class="rounded-xl card__back h-full w-full absolute top-0 left-0 bg-[#c7b6a8] md:translate-x-0 transition-transform transition-opacity duration-[800ms] ease-out shadow-[0_20px_40px_rgba(0,0,0,0.3)] will-change-[transform] will-change-[opacity] cursor-pointer flex flex-col justify-center items-center ` + (isLast ? "md:group-hover:translate-x-[-100%]" : "md:group-hover:translate-x-[100%]") + ` md:group-hover:z-[1]">
                            <h3 class="text-lg md:text-2xl text-center font-bold mb-3 text-black">${title[this.lang]}</h3>
                            <ul class="space-y-2 text-black list-disc">
                                ${this.addClassListItem(listItems)}
                            </ul>
                        </div>
                    </div>
                `;
        container.appendChild(card);
    }
    
    calculateDimensions() {
        let containerWidth = this.container.parentElement.offsetWidth;
        // Fallback if parent width is 0 - use viewport width
        if (containerWidth === 0) {
            containerWidth = window.innerWidth - 32; // Account for margins
        }
        const isMobile = window.innerWidth < 768;
        const vwUnit = window.innerWidth / 100;
        const cardWidthVw = isMobile ? 50 : 30; // 50vw on mobile, 30vw on desktop
        this.cardWidth = (cardWidthVw * vwUnit) + 16; // convert vw to px + margin
        
        this.visibleCards = Math.floor(containerWidth / this.cardWidth);
        this.maxIndex = Math.max(0, this.totalCards - this.visibleCards);
    }
    
    setupEventListeners() {
        // Button animations
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
        
        // Touch/swipe support
        let startX = 0;
        let isDragging = false;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });
        
        this.container.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            isDragging = false;
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // Pause autoplay on hover - matching page17Slide pattern
        const sliderContainer = document.querySelector(this.type == 'classes' ? "#page-5-slider" : "#page-14-slider");
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => this.stopAutoplay());
            sliderContainer.addEventListener('mouseleave', () => {
                if (this.isInViewport && window.innerWidth < 768) {
                    this.startAutoplay();
                }
            });
        }
    }
    
    /**
     * Setup intersection observer to start autoplay only when page is in viewport
     */
    setupIntersectionObserver() {
        const targetElement = document.querySelector(this.type == 'classes' ? ".page-5" : ".page-14");
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
    
    goToSlide(index, animate = true) {
        if (this.isAnimating) return;
        
        this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
        const translateX = -this.currentIndex * this.cardWidth;
        
        if (animate) {
            this.isAnimating = true;
            gsap.to(this.container, {
                x: translateX,
                duration: 0.6,
                ease: "power3.out",
                onComplete: () => {
                    this.isAnimating = false;
                }
            });
        } else {
            gsap.set(this.container, { x: translateX });
        }
        
        this.updateButtonStates();
    }
    
    nextSlide() {
        if (this.currentIndex < this.maxIndex) {
            this.goToSlide(this.currentIndex + 1);
        }
    }
    
    prevSlide() {
        if (this.currentIndex > 0) {
            this.goToSlide(this.currentIndex - 1);
        }
    }
    
    /**
     * Translate dynamically loaded content
     */
    translateDynamicContent(lang) {
        this.lang = lang;
        
        if (!this.data || this.data.length === 0) return;
        
        if (this.type === 'classes') {
            this.translateClassCards();
        } else {
            this.translateTrainerCards();
        }
    }
    
    /**
     * Translate class cards content
     */
    translateClassCards() {
        this.data.forEach((card, index) => {
            const cardIndex = card.index || index + 1;
            const titleElement = document.querySelector(`#hover-card-content-${cardIndex} h3`);
            const ulElement = document.querySelector(`#hover-card-content-${cardIndex} ul`);
            
            if (titleElement && card.title) {
                titleElement.textContent = card.title[this.lang] || card.title;
            }
            
            if (ulElement && card.listItems) {
                ulElement.innerHTML = this.addClassListItem(card.listItems);
            }
        });
    }
    
    /**
     * Translate trainer cards content
     */
    translateTrainerCards() {
        this.data.forEach((trainer) => {
            const nameElement = document.querySelector(`#trainer-card-content-${trainer.index} h2`);
            const titleElement = document.querySelector(`#trainer-card-content-${trainer.index} p:first-of-type`);
            const qualificationElement = document.querySelector(`#trainer-card-content-${trainer.index} ul`);
            
            if (nameElement && trainer.name) {
                nameElement.textContent = trainer.name[this.lang] || trainer.name;
            }
            
            if (titleElement && trainer.title) {
                titleElement.textContent = trainer.title[this.lang] || trainer.title;
            }
            
            if (qualificationElement && trainer.qualifications) {
                qualificationElement.innerHTML = this.addTrainerListItem(trainer.qualifications);
            }
        });
    }
    updateButtonStates() {
        // Update button opacity based on availability
        
        gsap.to(this.prevBtn, {
            opacity: this.currentIndex > 0 ? 1 : 0,
            duration: 0.3
        });
        
        gsap.to(this.nextBtn, {
            opacity: this.currentIndex < this.maxIndex ? 1 : 0,
            duration: 0.3
        });
    }
    
    /**
     * Start automatic sliding - matching page17Slide pattern
     */
    startAutoplay() {
        // Only start autoplay if in viewport and on mobile
        if (!this.isInViewport || window.innerWidth >= 768) return;
        
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            if (this.currentIndex < this.maxIndex) {
                this.nextSlide();
            } else {
                this.goToSlide(0); // Loop back to start
            }
        }, 2000); // 2 seconds
    }
    
    /**
     * Stop automatic sliding - matching page17Slide pattern
     */
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}
