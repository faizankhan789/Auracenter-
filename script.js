

lucide.createIcons();

/**
 * Main animation controller for the AuraCenter fitness website.
 * Handles GSAP-based scroll-triggered animations, video carousels, 
 * trainer/class card interactions, and responsive animations.
 * 
 * @class FitnessHeroAnimations
 * @author AuraCenter Team
 * @version 1.0.0
 */
class AuraCenter {
        /**
         * Initialize the AuraCenterWebsite controller with default configurations
         * and data sets for trainers, classes, and animation states.
         * 
         * @constructor
         */
        constructor() {
            this.config = {
                heartRate: {
                    base: 128,
                    variation: 8,
                    updateInterval: 1200
                }
            };
            this.multiplier = window.innerWidth < 1024 ? 400 : 600; // Reduce multiplier on mobile
            this.tl = null;
            this.trainers = [];
            this.videos = [];
            this.cards = [];
            this.schedule = [];
            this.lenis = null;
            this.state = {
                heartRate: this.config.heartRate.base,
                isVisible: true,
            };

            // Translation system
            this.currentLanguage = 'en';
            this.translations = translations;

            // Animation controllers
            this.animations = {
                ecg: null,
                intervals: new Map(),
            };

            // Initialize
            this.init();
        }

        /**
         * Load cards data from JSON file
         * 
         * @public
         * @method loadCardsData
         */
        async loadCardsData() {
            try {
                const response = await fetch('./assets/data/classes.json');
                if (response.ok) {
                    this.cards = await response.json();
                } else {
                    console.error('Failed to load classes data, using fallback');
                }
            } catch (error) {
                console.error('Error loading classes data:', error);
            }
            this.cards.forEach(card => this.addClassCard(card));
        }

        /**
         * Load videos data from JSON file
         * 
         * @public
         * @method loadVideosData
         */
        async loadVideosData() {
            try {
                const response = await fetch('./assets/data/videos.json');
                if (response.ok) {
                    this.videos = await response.json();
                } else {
                    console.error('Failed to load videos data, using fallback');
                }
            } catch (error) {
                console.error('Error loading videos data:', error);
            }
            this.videos.forEach((video, index) => {
                this.addVideo(video, index);
            });
        }

        /**
         * Load schedule data from JSON file
         * 
         * @public
         * @method loadScheduleData
         */
        async loadScheduleData() {
            try {
                const response = await fetch('./assets/data/schedule.json');
                if (response.ok) {
                    this.schedule = await response.json();
                } else {
                    console.error('Failed to load schedule data, using fallback');
                }
            } catch (error) {
                console.error('Error loading schedule data:', error);
            }
            this.addScheduleGrid()
        }

        /**
         * Load trainers data from JSON file
         * 
         * @public
         * @method loadTrainersData
         */
        async loadTrainersData() {
            try {
                const response = await fetch('./assets/data/trainers.json');
                if (response.ok) {
                    this.trainers = await response.json();
                } else {
                    console.error('Failed to load trainers data, using fallback');
                }
            } catch (error) {
                console.error('Error loading trainers data:', error);
            }
            this.trainers.forEach(trainer => this.addTrainerCard(trainer));
        }


        addVideo(src, index) {
            const container = document.querySelector('#video-carousel');
            if (!container) return;

            const video = document.createElement('div');
            video.className = 'video-slide flex-none w-screen h-screen relative flex items-center justify-center overflow-hidden';
            video.setAttribute('data-index', index);
            video.id="video-slide-" + index
            video.innerHTML = `
            <div class="video-wrapper w-full h-full flex items-center justify-center">
                    <iframe 
                        id="video-${index}"
                        class="w-full h-full object-cover block"
                        src="${src}?enablejsapi=1"
                        title="YouTube video player"
                        frameborder="0"
                        allow="clipboard-write; encrypted-media; gyroscope;"
                        allowfullscreen>
                    </iframe>
                </div>
            `;
            container.appendChild(video);

        }

        addTrainerCard({ imageSrc, name, title, qualifications, index }) {
            const container = document.querySelector('.trainers-container');
            if (!container) return;

            const card = document.createElement('div');
            card.className = 'trainer-card trainer_cards w-[50vw] lg:w-[30vw] h-[30vh] lg:hover:z-[3] cursor-pointer group flex-shrink-0';
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
                    <img src="${imageSrc}.png" alt="${title}"  loading="lazy"  class="absolute z-[1] w-full h-full object-cover object-center ease-in-out rounded-xl transition-all duration-800 lg:group-hover:scale-[1.05] lg:group-hover:z-[2]" loading="lazy">
                </picture>               
                    <div id="trainer-card-content-${index}" class="rounded-xl card__back justify-center h-full lg:h-[22vh] w-[45vw] px-4 py-4 lg:w-[30vw] absolute bottom-0 left-0 bg-[#c7b6a8] lg:translate-y-0 transition-transform transition-opacity duration-[600ms] ease-out shadow-[0_20px_40px_rgba(0,0,0,0.3)] will-change-[transform] will-change-[opacity] cursor-pointer flex flex-col justify-start items-start">
                        <h2 class="text-2xl md:text-2xl font-bold uppercase tracking-wide" style="line-height: 1">${name}</h2>
                        <p class="text-lg md:text-xl font-medium">${title}</p>
                        <ul class="mt-2">
                            ${qualifications.map(qual => `
                                <li class="flex items-center">
                                    <span class="mx-3 text-[#182a41] text-md md:text-lg">•</span>
                                    <span class="text-md md:text-lg leading-relaxed">${qual}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `;
            container.appendChild(card);
        }

        addClassCard({ imageSrc, title, listItems, index }) {
            const container = document.querySelector('.classes-container');
            if (!container) return;

            const card = document.createElement('div');
            card.className = 'hover-card classes_cards w-[50vw] lg:w-[30vw] h-[30vh] lg:h-[50vh] lg:hover:z-[3] cursor-pointer group flex-shrink-0';
            card.id = "hover-card-container-"+index
            card.innerHTML = `
                <div id="hover-card-${index}" class="card__content relative transition-transform duration-1000 w-full h-full">    
                <picture id="hover-card-img-${index}" class="card__front">
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
                    <img src="${imageSrc}.jpg" alt="${title}"  loading="lazy"  class="absolute z-[1] w-full h-full object-cover object-center ease-in-out rounded-xl transition-all duration-800 lg:group-hover:scale-[1.05] lg:group-hover:z-[2]" loading="lazy">
                </picture>
                    <div id="hover-card-content-${index}" class="rounded-xl card__back h-full w-full absolute top-0 left-0 bg-[#c7b6a8] lg:translate-x-0 transition-transform transition-opacity duration-[600ms] ease-out shadow-[0_20px_40px_rgba(0,0,0,0.3)] will-change-[transform] will-change-[opacity] cursor-pointer flex flex-col justify-center items-center lg:group-hover:translate-x-[100%] lg:group-hover:z-[1]">
                        <h3 class="text-center text-2xl font-bold mb-3 text-black">${title}</h3>
                        <ul class="space-y-2 text-lg text-black">
                        ${listItems.map(item => `
                            <li class="flex items-start">
                            <span class="w-2 h-2 bg-black rounded-full mt-2 mr-3"></span> ${item}
                            </li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
            container.appendChild(card);
        }

        addScheduleDay({ day, activities }) {
            const container = document.querySelector('#schedule');
            if (!container) return;

            const dayColumn = document.createElement('div');
            dayColumn.className = 'flex flex-col gap-1';
            
            const dayHeader = document.createElement('div');
            dayHeader.className = 'bg-[#c8e6dc] py-3 md:p-3 rounded-lg mb-1 truncate';
            dayHeader.innerHTML = `<h3 style="font-size: clamp(0.4rem, 1.4vw, 5rem)" class="font-bold tracking-wider text-[#2c3e50] text-center schedule-day">${day}</h3>`;
            
            const activitiesContainer = document.createElement('div');
            activitiesContainer.className = 'space-y-1';
            
            activities.forEach(activity => {
                const activityBlock = document.createElement('div');
                const bgColor = activity.type === 'white' ? 'bg-[#F0EDEB] border border-gray-200' : 'bg-[#24203c] text-white';
                const textColor = activity.type === 'white' ? 'text-gray-600' : 'text-gray-300';
                const nameColor = activity.type === 'white' ? 'text-gray-800' : 'text-white';
                activityBlock.className = `flex items-center lg:gap-3 lg:p-3 rounded-lg h-12 ${bgColor} hover:-translate-y-0.5 hover:shadow-md transition-all duration-300`;
                activityBlock.innerHTML = `
                    <div class="flex-shrink-0 flex items-center justify-center">
                        <img src="${activity.icon}" alt="Activity Icon" class="h-auto opacity-80" loading="lazy" style="width: clamp(0.75rem, 1.5vw, 5rem)">
                    </div>
                    <div class="flex-1 flex flex-col gap-1 overflow-hidden">
                        <div class="font-medium ${textColor} truncate" style="font-size: clamp(0.4rem, 0.8vw, 5rem)">${activity.time}</div>
                        <div class="font-semibold ${nameColor} leading-tight truncate schedule-class-name" style="font-size: clamp(0.5rem, 0.9vw, 5rem)">${activity.name}</div>
                    </div>
                `;
                activitiesContainer.appendChild(activityBlock);
            });
            
            dayColumn.appendChild(dayHeader);
            dayColumn.appendChild(activitiesContainer);
            container.appendChild(dayColumn);
        }

        setupMobileMenu() {
            const btn = document.getElementById('mobileMenuBtn');
            const menu = document.querySelector('.mobile-menu');
            if (!btn || !menu) return;

            const toggleMenu = (show) => {
                menu.classList.toggle('hidden', !show);
                setTimeout(() => menu.classList.toggle('active', show), show ? 10 : 300);
                document.body.classList.toggle('no-scroll', show);
            };

            btn.addEventListener('click', () => {
                toggleMenu(!menu.classList.contains('active'));
            });
        }

        /**
         * Initialize all animation components, UI elements, and event listeners.
         * This is the main entry point that sets up the entire animation system.
         * 
         * @public
         * @method init
         */
        async init() {
            this.setupMobileMenu();
            this.setupLanguageToggle();
            this.startClockUpdate();
            this.initECGAnimation();
            await this.loadCardsData();
            await this.loadVideosData();
            await this.loadScheduleData();
            await this.loadTrainersData();
            this.setupResponsiveHandler();

            this.setUpGSAP();
            this.setUpLenis();
            this.removeLoader();
        }

        removeLoader() {
            document.body.classList.remove('bodyLoading');
            document.getElementById('loader-parent')?.remove();
            document.getElementById('page-container')?.classList.remove('hidden');
            document.getElementById('header')?.classList.remove('hidden');
            document.querySelector('footer')?.classList.remove('hidden');
        }

        /**
         * Setup language toggle functionality
         */
        setupLanguageToggle() {
            const toggleButton = document.querySelector('#languageToggle');
            if (toggleButton) {
                toggleButton.addEventListener('click', () => {
                    this.toggleLanguage();
                });
            }
        }

        /**
         * Toggle between English and Arabic languages
         */
        toggleLanguage() {
            this.currentLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
            const button = document.querySelector('#languageToggle');
            
            if (button) {
                button.textContent = this.currentLanguage === 'en' ? 'عربي' : 'English';
            }
            
            this.translateContent();
        }

        /**
         * Translate all content on the page
         */
        translateContent() {
            const lang = this.currentLanguage;
            
            // Only change language attribute, keep layout the same
            document.documentElement.lang = lang;
            
            // Translate elements with data-translate attributes
            const translatableElements = document.querySelectorAll('[data-translate]');
            translatableElements.forEach(element => {
                const key = element.getAttribute('data-translate');
                if (this.translations[lang] && this.translations[lang][key]) {
                    element.innerHTML = this.translations[lang][key];
                }
            });
            
            // Translate schedule data
            this.translateScheduleData();
            
            // Translate dynamic content (classes, trainers)
            this.translateDynamicContent();
            
            // Translate form placeholders
            this.translatePlaceholders();
        }

        /**
         * Translate dynamically loaded content
         */
        translateDynamicContent() {
            const lang = this.currentLanguage;
            
            // Translate class cards
            if (this.cards && this.cards.length > 0) {
                this.cards.forEach((card, index) => {
                    const titleElement = document.querySelector(`#hover-card-content-${index + 1} h3`);
                    const listItems = document.querySelectorAll(`#hover-card-content-${index + 1} li`);
                    
                    if (titleElement) {
                        const classKey = this.getClassKey(card.title);
                        if (this.translations[lang][classKey]) {
                            titleElement.textContent = this.translations[lang][classKey];
                        }
                    }
                    
                    if (listItems && card.listItems) {
                        const itemsKey = this.getClassKey(card.title) + 'Items';
                        if (this.translations[lang][itemsKey]) {
                            listItems.forEach((li, liIndex) => {
                                if (this.translations[lang][itemsKey][liIndex]) {
                                    li.textContent = this.translations[lang][itemsKey][liIndex];
                                }
                            });
                        }
                    }
                });
            }
            
            // Translate trainer cards
            if (this.trainers && this.trainers.length > 0) {
                this.trainers.forEach((trainer) => {
                    const nameElement = document.querySelector(`#trainer-card-content-${trainer.index} h2`);
                    const titleElement = document.querySelector(`#trainer-card-content-${trainer.index} p:first-of-type`);
                    const qualificationElements = document.querySelectorAll(`#trainer-card-content-${trainer.index} ul li span:last-child`);
                    
                    if (nameElement && trainerTranslations[lang] && trainerTranslations[lang][trainer.name]) {
                        nameElement.textContent = trainerTranslations[lang][trainer.name];
                    }
                    
                    if (titleElement && trainerTitleTranslations[lang] && trainerTitleTranslations[lang][trainer.title]) {
                        titleElement.textContent = trainerTitleTranslations[lang][trainer.title];
                    }
                    
                    // Translate qualifications
                    if (qualificationElements.length > 0 && trainerQualificationsTranslations[lang]) {
                        qualificationElements.forEach((element, index) => {
                            const originalText = trainer.qualifications[index];
                            if (originalText && trainerQualificationsTranslations[lang][originalText]) {
                                element.textContent = trainerQualificationsTranslations[lang][originalText];
                            }
                        });
                    }
                });
            }
        }

        /**
         * Translate form placeholders
         */
        translatePlaceholders() {
            const lang = this.currentLanguage;
            const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
            
            placeholderElements.forEach(element => {
                const key = element.getAttribute('data-translate-placeholder');
                if (this.translations[lang] && this.translations[lang][key]) {
                    element.placeholder = this.translations[lang][key];
                }
            });
        }

        /**
         * Translate schedule data
         */
        translateScheduleData() {
            if (!this.schedule || this.schedule.length === 0) return;
            
            const lang = this.currentLanguage;
            
            // Translate day names
            const dayElements = document.querySelectorAll('.schedule-day');
            dayElements.forEach(dayEl => {
                const dayText = dayEl.textContent.trim(); // Get original text (e.g., "MONDAY")
                const dayKey = dayText.toLowerCase(); // Convert to lowercase key (e.g., "monday")
                
                // First try direct translation with lowercase key
                if (this.translations[lang][dayKey]) {
                    dayEl.textContent = this.translations[lang][dayKey];
                    return;
                }
                
                // If direct translation fails, try reverse lookup (for switching back to English)
                const fromLang = lang === 'en' ? 'ar' : 'en';
                if (this.translations[fromLang]) {
                    // Find the original English key by looking through the opposite language translations
                    const originalKey = Object.keys(this.translations[fromLang]).find(key => 
                        this.translations[fromLang][key] === dayText
                    );
                    
                    if (originalKey && this.translations[lang] && this.translations[lang][originalKey]) {
                        dayEl.textContent = this.translations[lang][originalKey];
                    }
                }
            });
            
            // Translate class names in schedule
            const classElements = document.querySelectorAll('.schedule-class-name');
            classElements.forEach(classEl => {
                const className = classEl.textContent.trim();
                
                // First try direct translation
                if (scheduleTranslations[lang] && scheduleTranslations[lang][className]) {
                    classEl.textContent = scheduleTranslations[lang][className];
                    return;
                }
                
                // If direct translation fails, try reverse lookup (for switching back to English)
                const fromLang = lang === 'en' ? 'ar' : 'en';
                if (scheduleTranslations[fromLang]) {
                    // Find the original English key by looking through the opposite language translations
                    const originalKey = Object.keys(scheduleTranslations[fromLang]).find(key => 
                        scheduleTranslations[fromLang][key] === className
                    );
                    
                    if (originalKey && scheduleTranslations[lang] && scheduleTranslations[lang][originalKey]) {
                        classEl.textContent = scheduleTranslations[lang][originalKey];
                    }
                }
            });
        }

        /**
         * Helper method to convert class title to translation key
         */
        getClassKey(title) {
            return title.toLowerCase()
                .replace(/\s+/g, '')
                .replace(/&/g, '')
                .replace(/[^\w]/g, '');
        }


        /**
         * Generate and render the schedule grid with mobile pagination support.
         * 
         * @public
         * @method addScheduleGrid
         */
        addScheduleGrid() {
            this.currentMobilePage = 0;
            this.currentMobileGroup = 0;
            
            this.screenWidth = window.innerWidth;

            // Define breakpoints and corresponding behavior
            this.isMobile = this.screenWidth < 640;
            this.isSmallTablet = this.screenWidth >= 640 && this.screenWidth < 768;
            this.isTablet = this.screenWidth >= 768 && this.screenWidth < 1024;
            this.isDesktop = this.screenWidth >= 1024;
            
            // Set columns per group based on screen size
            if (this.isMobile || this.isSmallTablet) {
                this.columnsPerGroup = 2;
                this.groupsPerPage = 3;
            } else if (this.isTablet) {
                this.columnsPerGroup = 3;
                this.groupsPerPage = 2;
            } else {
                // Desktop - show all columns
                this.columnsPerGroup = 6;
                this.groupsPerPage = 1;
            }
            this.renderSchedulePage();
        }


        setupResponsiveHandler() {
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    // Recalculate breakpoints and re-render schedule
                    const oldIsDesktop = this.isDesktop;
                    this.addScheduleGrid();
                    
                    // If switching between desktop and non-desktop, reset pagination
                    if (oldIsDesktop !== this.isDesktop) {
                        this.currentMobilePage = 0;
                        this.currentMobileGroup = 0;
                    }
                }, 300);
            });
        }

        renderSchedulePage() {
            const container = document.querySelector('#schedule');
            
            if (!container) return;
            
            // Clear existing content
            container.innerHTML = '';
            
            this.schedule.forEach(day => this.addScheduleDay(day));
        }

        /**
         * Animate page 1 elements with fade out and text scaling effects.
         * 
         * @private
         * @method page1Animation
         * @param {gsap.core.Timeline} fullTimeline - Main GSAP timeline
         * @param {boolean} isMobile - Device type flag
         */
        page1Animation(fullTimeline, isMobile) {
            fullTimeline
                .to('#page1Img, #monitors, #learnMore', { 
                    opacity: 0, 
                    duration: 0.5,
                    ease: "power2.inOut"
                })
                .to('.pin-text', {
                    scale: 2, // reduced scale for mobile
                    y: isMobile ? "25vh" : 0, // move down on mobile
                    transformOrigin: "center center", // prevents weird growth direction
                    duration: isMobile ? 1 : 1.5, // shorter for mobile to avoid lag
                    force3D: true, // ensures GPU acceleration
                    ease: "power3.inOut"
                }, "<")
                .to({}, { duration: 1 });
        }
        /**
         * Animate page 2 slide-in transition.
         * 
         * @private
         * @method page2Animation
         * @param {gsap.core.Timeline} fullTimeline - Main GSAP timeline
         * @param {boolean} isMobile - Device type flag
         */
        page2Animation(fullTimeline, isMobile) {
            fullTimeline
                .to(".page-2", { 
                    xPercent: 0, 
                    duration: 1,
                    ease: "power2.inOut"
                })        
                .to({}, { duration: 1 });
        }

        /**
         * Animate page 3 slide-in transition.
         * 
         * @private
         * @method page3Animation
         * @param {gsap.core.Timeline} fullTimeline - Main GSAP timeline
         * @param {boolean} isMobile - Device type flag
         */
        page3Animation(fullTimeline, isMobile) {
            fullTimeline
                .to(".page-3", { 
                    xPercent: 0, 
                    duration: 1,
                    ease: "power2.inOut"
                })
                .to({}, { duration: 1 });
        }


        /**
         * Animate page 5 classes section with card carousel and responsive interactions.
         * 
         * @private
         * @method page52nimation
         * @param {gsap.core.Timeline} fullTimelin2 - Main GSAP timeline
         * @param {boolean} isMobile - Device t2pe flag
         */
        page5Animation(fullTimeline, isMobile) {
            const cardWidthVW = isMobile ? 50 : 30;
            const cardMarginPx = 16;
            const vw = window.innerWidth / 100;
            const cardWidth = (cardWidthVW * vw + cardMarginPx)
            const totalWidth = this.cards.length * cardWidth;
            const visibleNumber = window.innerWidth / cardWidth
            const cards = gsap.utils.toArray(".classes_cards")
            const minVisibleNumber = Math.floor(visibleNumber)
            const visibleCards = cards.slice(0, Math.ceil(visibleNumber));
            fullTimeline
                .to(".classes-container", {
                    x: 20,
                    opacity: 1,
                    duration: isMobile ? 0.8 : 1,
                    ease: isMobile ? "power1.out" : "power2.out"
                })
                .to(visibleCards , {
                    x: 0,
                    opacity: 1,
                    duration: isMobile ? 0.3 : 0.5,
                    stagger: isMobile ? 0.3 : 0.6,
                    ease: "power2.out"
                }, "-=0.8");
                if (isMobile) {
                    let flipped = 0
                    for (let index = 0; index < cards.length; index++) {
                    if (flipped == minVisibleNumber) {
                        fullTimeline.to(".classes-container", {
                            x: -cardWidth * index,
                            ease: "power1.inOut",
                            duration: 1
                        });
                        flipped = 0
                    }
                        // Enable hardware acceleration for smooth mobile performance
                        gsap.set("#hover-card-" + (index + 1), { 
                            force3D: true,
                            backfaceVisibility: "hidden"
                        });
                        fullTimeline.fromTo("#hover-card-" + (index + 1),
                            { rotationY: 0, transformOrigin: "center" }, // starting point
                            { rotationY: 180, duration: 0.8, ease: "power2.out", force3D: true } // ending point
                        );

                        fullTimeline.to({}, { duration: 2 });
                        fullTimeline.fromTo("#hover-card-" + (index + 1),
                            { rotationY: 180, transformOrigin: "center" }, // starting point
                            { rotationY: 0, duration: 0.8, ease: "power2.out", force3D: true },
                            "+=0.8" // ending point
                        );
                        flipped = flipped + 1
                    }
                    // Add completion buffer for mobile
                    fullTimeline.to({}, { duration: 1 });
                } else {
                    let flipped = 0
                    for (let index = 0; index < cards.length; index++) {
                        if (flipped == minVisibleNumber - 1) {
                            fullTimeline.to(".classes-container", {
                                x: -cardWidth * index + 20,
                                ease: "power2.inOut",
                                duration: 0.8
                            });
                            flipped = 0
                        }
                        const itemIndex = index + 1  
                        fullTimeline.set("#hover-card-content-" + itemIndex, { 
                            force3D: "auto",
                            backfaceVisibility: "hidden"
                        })
                        .to("#hover-card-content-" + itemIndex, {
                            x: "95%",
                            ease: "power2.out",
                            duration: 0.8
                        })
                        .set("#hover-card-content-" + itemIndex, { zIndex: 1 }, "<")
                        .set("#hover-card-img-" + itemIndex, { zIndex: 2, scale: 1.05 }, "<")
                        .set("#hover-card-container-" + itemIndex, { zIndex: 3 }, "<");
                        if (index > 0) {
                            fullTimeline.set("#hover-card-content-" + index, { 
                                zIndex: 0, 
                                x: 0,
                                force3D: "auto",
                                backfaceVisibility: "hidden"
                            }, "<")
                            .set('#hover-card-img-' + index, { zIndex: 1, scale: 1}, "<")
                            .set("#hover-card-container-" + index, { zIndex: 0}, "<")
                        }
                        flipped = flipped + 1
                    }
                }
            gsap.set(".classes-container", {x: totalWidth, opacity: 0 });
            gsap.set(visibleCards, {x: 100, opacity: 0 });
        }

        /**
         * Animate page 6 vision/mission section with card flip effects.
         * 
         * @private
         * @method page6Animation
         * @param {gsap.core.Timeline} fullTimeline - Main GSAP timeline
         * @param {boolean} isMobile - Device type flag
         */
        page6Animation(fullTimeline, isMobile) {
            fullTimeline.to(".page-6", { 
                yPercent: 0, 
                duration: 1.5,
                ease: "power2.inOut"
            })
            if (!isMobile) {
                fullTimeline
                .to(".visionMission", {
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    duration: 1,
                    stagger: 0.4,
                    ease: "back.out(1.2)"
                })
                .to("#mission", {
                    opacity: 1,
                    zIndex: 1,
                    ease: "power2.out",
                    duration: 0.5
                })
                .set("#missionImg, #missionCard", { zIndex: 2 }, "<")
                .set("#vision", { zIndex: 0, opacity: 0 }, "<")
                .set("#visionImg, #visionCard", { zIndex: 0 }, "<")
                .to({}, { duration: 2 })
                .to("#vision", {
                    opacity: 1,
                    zIndex: 1,
                    ease: "power2.out",
                    duration: 0.5
                })
                .set("#visionImg, #visionCard", { zIndex: 2 }, "<")
                .set("#mission", { zIndex: 0, opacity: 0 }, "<")
                .set("#missionImg, #missionCard", { zIndex: 0 }, "<");
                fullTimeline.to({}, { duration: 2 });
            }
            else {
                fullTimeline
                .to("#missionCard", {
                    opacity: 1,
                    ease: "power2.out",
                    duration: 1
                })
                .to({}, { duration: 1 })
                .set("#missionCard .card__content", { 
                    force3D: true,
                    backfaceVisibility: "hidden"
                })
                .fromTo("#missionCard .card__content",
                    { rotationY: 0, transformOrigin: "center" }, // starting point
                    { rotationY: 180, duration: 0.8, ease: "power2.out", force3D: true } // ending point
                )
                .to({}, { duration: 2.5 })
                .to("#missionCard", {
                    opacity: 0,
                    ease: "power2.out",
                    duration: 0.5
                })
                .to("#visionCard", {
                    opacity: 1,
                    ease: "power2.out",
                    duration: 0.5
                })
                .to({}, { duration: 1.5 })
                .set("#visionCard .card__content", { 
                    force3D: true,
                    backfaceVisibility: "hidden"
                })
                .fromTo("#visionCard .card__content",
                    { rotationY: 0, transformOrigin: "center" }, // starting point
                    { rotationY: 180, duration: 0.8, ease: "power2.out", force3D: true } // ending point
                )
                .to({}, { duration: 2.5 })
            }
        }

/**
     * Animate page 7 Aura Store section with typewriter and slide effects.
     * 
     * @private
     * @method page7Animation
     * @param {gsap.core.Timeline} fullTimeline - Main GSAP timeline
     * @param {boolean} isMobile - Device type flag
     */
    page7Animation(fullTimeline, isMobile) {
        gsap.set(".page-7 button", { opacity: 0, x: -100, filter: "blur(10px)" })
        gsap.set(".page-7 h2", { opacity: 0, x: 200, rotationY: 45, transformPerspective: 1000 })
        gsap.set(".page-7 p", { opacity: 0, y: 50, scale: 0.9 })
        gsap.set(".page-7 img", { opacity: 0, scale: 1.3, filter: "brightness(0.7) contrast(1.2)" })

        fullTimeline
        .to(".page-7 button", {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 0.5,
            ease: "power3.out"
        })
        .to(".page-7 h2", {
            opacity: 1,
            x: 0,
            rotationY: 0,
            duration: 0.5,
            ease: "power2.out"
        })
        .to(".page-7 p", {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "power2.out"
        })
        .to(".page-7 img", {
            opacity: 1,
            scale: 1,
            filter: "brightness(1) contrast(1)",
            duration: 0.5,
            ease: "power2.out"
        })
        .to({}, { duration: 0.5 })
    }

        /**
         * Animate page 8 video carousel with entrance effects.
         * 
         * @private
         * @method page8Animation
         * @param {gsap.core.Timeline} fullTimeline - Main GSAP timeline
         * @param {boolean} isMobile - Device type flag
         */
        page8Animation(fullTimeline, isMobile) {
            fullTimeline
            .fromTo(".video-slide[data-index='0']", {
                scale: 0,
                opacity: 0,
                rotationY: 180
            }, {
                scale: 1,
                opacity: 1,
                rotationY: 0,
                duration: 2,
                ease: "back.out(1.2)",
                transformOrigin: "center"
            }, "-=1.2")
            for(let index = 1; index < this.videos.length; index++ ) {
                // Animate to next video (slower)
                fullTimeline
                    .to(".carousel-track", {
                        x: `-${index * 100}vw`,
                        duration: 0.8,
                        ease: "power2.inOut"
                    })
                    .to(`.video-slide[data-index='${index - 1}']`, {
                        scale: 0.7,
                        opacity: 0.5,
                        duration: 0.8,
                        ease: "power2.inOut"
                    }, "-=0.8").call(() => {
                        // Stop previous video when moving to next
                        if (index > 0) {
                            const prevVideo = document.getElementById(`video-${index - 1}`);
                            if (prevVideo && prevVideo.contentWindow) {
                                prevVideo.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                            }
                        }
                    })
                    .to(`.video-slide[data-index='${index}']`, {
                        scale: 1,
                        opacity: 1,
                        duration: 1.8,
                        ease: "power2.inOut"
                    }, "-=0.8")
            }
        }


        page10Animation(fullTimeline, isMobile) {
            // Page 10 - Events with cascade effect
            fullTimeline
            .to(".page-10 button", {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.2,
                ease: "elastic.out(1, 0.6)"
            })
            .to(".page-10 h1", {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.2,
                ease: "elastic.out(1, 0.6)"
            });
            if (isMobile) {
                fullTimeline
                .to("#events-1", { opacity: 1, duration: 0.5 })
                .to("#event-1", { y: "-27vh", duration: 0.5 })
                .to("#event-2", { y: "-30vh", x: "27vw", duration: 0.5 }, "<")
                .to("#event-3", { y: "-3vh", x: "27vw", duration: 0.5 }, "<")
                .to({}, { duration: 2 })
                .to("#events-1", { opacity: 0, duration: 0.5 })
                .to("#events-2", { opacity: 1, duration: 0.5 })
                .to("#event-6", { y: "-27vh", duration: 0.5 })
                .to("#event-7", { y: "-30vh", x: "27vw", duration: 0.5 }, "<")
                .to("#event-8", { y: "-3vh", x: "27vw", duration: 0.5 }, "<")

            }
            else {
                fullTimeline
                .to("#events-1,#events-2", { opacity: 1, duration: 0.5 })
                .to("#event-1, #event-6", { y: "-27vh", duration: 0.5 })
                .to("#event-2, #event-7", { y: "-30vh", x: "17vw", duration: 0.5 }, "<")
                .to("#event-3, #event-8", { y: "-3vh", x: "17vw", duration: 0.5 }, "<")
            }
            fullTimeline            
            .to({}, { duration: 0.5 })

        }

        page11Animation(fullTimeline, isMobile) {
            fullTimeline
            // Page 11 - Aura Elite with magnetic pull effect
            .to(".page-11", { 
                xPercent: 0, 
                duration: 1.5,
                ease: "power2.inOut"
            })
            // Add magnetic intro effect
            .set("#auraElite", { opacity: 0, x: -500, rotationY: 90, transformOrigin: "center" })
            .to("#auraElite", {
                opacity: 1,
                x: 0,
                rotationY: 0,
                duration: 1.5,
                ease: "power3.out"
            });
            if (isMobile) {
                fullTimeline.to("#auraElite", {scale: 1, y: 0, opacity: 1, duration: 0.5})
                .to("#auraContentText", {opacity: 1, duration: 0.5})
                .to({}, { duration: 2 })
                .to("#auraContentText", {opacity: 0, duration: 0.5})
                .to("#events-3", { opacity: 1, duration: 0.5 })
                .to("#event-10", { y: "-27vh", duration: 0.5 })
                .to("#event-11", { y: "-30vh", x: "27vw", duration: 0.5 }, "<")
                .to("#event-12", { y: "-3vh", x: "27vw", duration: 0.5 }, "<")
            }
            else {
                fullTimeline
                .to("#auraElite", {scale: 1, xPercent: 0, y: 0, opacity: 1, duration: 0.5})
                .to("#auraContentText", {opacity: 1, duration: 0.5})
                .to("#events-3", { opacity:1, duration: 0.5 })
                .to("#event-10", { y: "-27vh", duration: 0.5 })
                .to("#event-11", { y: "-30vh", x: "17vw", duration: 0.5 }, "<")
                .to("#event-12", { y: "-3vh", x: "17vw", duration: 0.5 }, "<")
            }
            fullTimeline.to({}, { duration: 1 })

        }

        page12Animation(fullTimeline, isMobile) {
            fullTimeline
            .to(".page-12", { xPercent: 0, duration: 1.5, ease: "power2.inOut" })
            if (isMobile) {
                fullTimeline.to("#auraLuxury", {scale: 1, y: 0, opacity: 1, duration: 0.5})
                .to("#auraLuxuryContentText", {opacity: 1, duration: 0.5})
                .to({}, { duration: 2 })
                .to("#auraLuxuryContentText", {opacity: 0, duration: 0.5})
                .to("#events-5", { opacity: 1, duration: 0.5 })
                .to("#event-18", { y: "-27vh", duration: 0.5 })
                .to("#event-19", { y: "-30vh", x: "27vw", duration: 0.5 }, "<")
                .to("#event-20", { y: "-3vh", x: "27vw", duration: 0.5 }, "<")
            }
            else {
                fullTimeline
                .to("#auraLuxury", {scale: 1, xPercent: 0, y: 0, opacity: 1, duration: 0.5})
                .to("#auraLuxuryContentText", {opacity: 1, duration: 0.5})
                .to("#events-5", { opacity:1, duration: 0.5 })
                .to("#event-18", { y: "-27vh", duration: 0.5 })
                .to("#event-19", { y: "-30vh", x: "-17vw", duration: 0.5 }, "<")
                .to("#event-20", { y: "-3vh", x: "-17vw", duration: 0.5 }, "<")
            }
            fullTimeline.to({}, { duration: 1 })
        }
        page13Animation(fullTimeline, isMobile) {
            fullTimeline
            .to(".page-13", { xPercent: 0, duration: 1.5, ease: "power2.inOut" })
            if (isMobile) {
                fullTimeline.to("#auraJunior", {scale: 1, y: 0, opacity: 1, duration: 0.5})
                .to("#auraJuniorContentText", {opacity: 1, duration: 0.5})
                .to({}, { duration: 2 })
                .to("#auraJuniorContentText", {opacity: 0, duration: 0.5})
                .to("#events-4", { opacity: 1, duration: 0.5 })
                .to("#event-14", { y: "-27vh", duration: 0.5 })
                .to("#event-15", { y: "-30vh", x: "27vw", duration: 0.5 }, "<")
                .to("#event-16", { y: "-3vh", x: "27vw", duration: 0.5 }, "<")
            }
            else {
                fullTimeline
                .to("#auraJunior", {scale: 1, xPercent: 0, y: 0, opacity: 1, duration: 0.5})
                .to("#auraJuniorContentText", {opacity: 1, duration: 0.5})
                .to("#events-4", { opacity:1, duration: 0.5 })
                .to("#event-14", { y: "-27vh", duration: 0.5 })
                .to("#event-15", { y: "-30vh", x: "17vw", duration: 0.5 }, "<")
                .to("#event-16", { y: "-3vh", x: "17vw", duration: 0.5 }, "<")
            }
            fullTimeline.to({}, { duration: 1 })
        }
        page14Animation(fullTimeline, isMobile) {
            const cardWidthVW = isMobile ? 50 : 30;
            const cardMarginPx = 16; // 2rem gap
            const vw = window.innerWidth / 100;
            const cardWidth = (cardWidthVW * vw + cardMarginPx);
            const trainers = gsap.utils.toArray(".trainer_cards");
            const visibleNumber = window.innerWidth / cardWidth;
            const minVisibleNumber = Math.floor(visibleNumber);
            const visibleCards = trainers.slice(0, Math.ceil(visibleNumber));
            
            // Set initial states for page 14 elements
            gsap.set(".page-14", { yPercent: 100 });
            gsap.set(".trainers-container", { x: -1000, opacity: 0 });
            gsap.set("#trainers-section h1:first-child", { opacity: 0, scale: 0.5, y: -50, rotationX: -45 });
            gsap.set("#trainers-section h1:last-child", { opacity: 0, scale: 0.5, x: -100, rotation: -15 });
            
            // Animate container and cards appearing
            fullTimeline
            .to(".page-14", { yPercent: 0, duration: 1.5, ease: "power2.inOut" })
                // Page 14 - Professional Trainers Entrance Animation
                .to("#trainers-section h1:first-child", {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 1.2,
                    ease: "power3.out"
                }, "-=0.5")
                .to("#trainers-section h1:last-child", {
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    rotation: 0,
                    duration: 0.8,
                    ease: "back.out(1.5)"
                }, "-=0.8")
                .to(".trainers-container", {
                    x: 0,
                    opacity: 1,
                    duration: isMobile ? 1 : 0.5,
                    ease: "power2.out"
                })
                .from(visibleCards, {
                    y: 50,
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "back.out(1.7)"
                }, "-=0.3");

            if (isMobile) {
                // Mobile: Flip cards (rotate) as we scroll through them
                let flipped = 0;
                for (let index = 0; index < trainers.length; index++) {
                    if (flipped === minVisibleNumber) {
                        fullTimeline.to(".trainers-container", {
                            x: -cardWidth * index,
                            ease: "power2.inOut",
                            duration: 1.5
                        });
                        flipped = 0;
                    }
                    
                    // Enable hardware acceleration for smooth mobile performance
                    gsap.set("#trainer-card-" + (index + 1), { 
                        force3D: true,
                        backfaceVisibility: "hidden"
                    });
                    fullTimeline.fromTo("#trainer-card-" + (index + 1),
                        { rotationY: 0, transformOrigin: "center" }, // starting point
                        { rotationY: 180, duration: 0.8, ease: "power2.out", force3D: true } // ending point
                    );

                    fullTimeline.to({}, { duration: 5 });
                    fullTimeline.fromTo("#trainer-card-" + (index + 1),
                        { rotationY: 180, transformOrigin: "center" }, // starting point
                        { rotationY: 0, duration: 0.8, ease: "power2.out", force3D: true },
                        "+=0.5" // ending point
                    );
                    
                    flipped++;
                }
            } else {
                // Desktop: Scroll through trainers with subtle animations
                trainers.forEach((card, index) => {                
                    // Scroll container to show cards properly
                    if (index === 2) {
                        // Show cards 3, 4, 5 (index 2, 3, 4)
                        fullTimeline.to(".trainers-container", {
                            x: -cardWidth * 1.5,
                            ease: "power2.inOut",
                            duration: 0.8
                        });
                    } else if (index === 4) {
                        // Show cards 5, 6 and ensure last card is fully visible
                        fullTimeline.to(".trainers-container", {
                            x: -cardWidth * 3,
                            ease: "power2.inOut",
                            duration: 0.8
                        });
                    }
                    
                    // Add subtle animation for focus - faster
                    fullTimeline
                        .to(`#trainer-card-container-${index + 1}`, {
                            y: -10,
                            boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
                            duration: 0.3,
                            ease: "power2.out"
                        })
                        .to(`#trainer-card-content-${index + 1}`, {
                            y: "100%",
                            zIndex: 0,
                            duration: 0.3
                        }, "-=0.2");
                    
                    // Hold the focus - shorter for desktop
                    fullTimeline.to({}, { duration: 0.8 });
                    
                    // Reset for next card - faster
                    fullTimeline
                        .to(`#trainer-card-container-${index + 1}`, {
                            y: 0,
                            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                            duration: 0.2,
                            ease: "power2.in"
                        }, "-=0.3")
                    .to(`#trainer-card-content-${index + 1}`, {
                            y: 0,
                            zIndex: 0,
                            duration: 0.2
                        }, "-=0.3");
                });
            }
        }

        page15Animation(fullTimeline, isMobile) {
            fullTimeline.to(".page-15", { yPercent: 0, duration: 1.5, ease: "power2.inOut" })
            // Page 15 Membership Animation - happens immediately after page appears
            .set("#membership-intro", { opacity: 0 })
            .set("#plan-button", { scale: 0, opacity: 0 })
            .set("#title-container", { scale: 0, opacity: 0 })
            .set("#subtitle", { scale: 0, opacity: 0 })
            .set("#membership-table-wrapper", { opacity: 0, scale: 0.8 })
            
            // Show intro container
            .to("#membership-intro", { opacity: 1, duration: 0.1 })
            
            // Animate intro elements scaling up
            .to("#plan-button", { 
                scale: 1, 
                opacity: 1, 
                duration: 0.5, 
                ease: "back.out(1.7)" 
            })
            .to("#title-container", { 
                scale: 1, 
                opacity: 1, 
                duration: 0.8, 
                ease: "power3.out" 
            }, "-=0.3")
            .to("#subtitle", { 
                scale: 1, 
                opacity: 1, 
                duration: 0.5, 
                ease: "power2.out" 
            }, "-=0.4")
            
            // Hold the intro for a moment
            .to({}, { duration: 1 })
            
            // Scale up the intro text dramatically while fading out
            .to("#plan-button", { 
                scale: 3, 
                opacity: 0, 
                duration: 0.8, 
                ease: "power2.in" 
            })
            .to("#title-container", { 
                scale: 2.5, 
                opacity: 0, 
                duration: 0.8, 
                ease: "power2.in" 
            }, "-=0.8")
            .to("#subtitle", { 
                scale: 2, 
                opacity: 0, 
                duration: 0.8, 
                ease: "power2.in" 
            }, "-=0.8")
            
            // Hide intro completely
            .set("#membership-intro", { display: "none" })
            
            // Reveal and animate the membership table
            .to("#membership-table-wrapper", { 
                opacity: 1, 
                scale: 1, 
                duration: 1, 
                ease: "power3.out" 
            })
            
            // Add stagger animation to membership cards
            .from(".membership-plan-card", {
                scale: 0.8,
                opacity: 0,
                duration: 0.5,
                stagger: 0.2,
                ease: "back.out(1.5)"
            }, "-=0.5")
            .to("#membership-table-wrapper", { 
                opacity: 1, 
                scale: 1, 
                duration: 1, 
                ease: "power3.out" 
            })
            fullTimeline.to({}, { duration: 2 }) // Hold on page 15 to view membership content
        }
        page16Animation(fullTimeline, isMobile) {
            // Page 16 - Podcast section initial states - ALL ELEMENTS HIDDEN
            gsap.set("#page16-heading", { opacity: 0, y: 50 });
            gsap.set("#page16-tagline", { opacity: 0, x: 50 });
            gsap.set("#page16-bg-img", { opacity: 0, y: 50 });
            gsap.set("#page16-guest-1", { opacity: 0, x: -50 });
            gsap.set("#page16-guest-2", { opacity: 0, y: 50 });
            gsap.set("#page16-guest-3", { opacity: 0, x: 50 });
            gsap.set("#page16-guest-4", { opacity: 0, y: -50 });
            gsap.set("#page16-img-31", { opacity: 0, x: -50 });
            gsap.set("#page16-img-32", { opacity: 0, x: 50 });
            gsap.set("#page16-youtube-btn", { opacity: 0, y: 50 });
            gsap.set("#page16-right-section", { opacity: 0, visibility: "hidden" }); // Keep right section hidden
            
            // Guest text overlays - hidden initially
            gsap.set("#page16-guest-1-text", { opacity: 0, y: 20 });
            gsap.set("#page16-guest-2-text", { opacity: 0, y: 20 });
            gsap.set("#page16-guest-3-text", { opacity: 0, y: 20 });
            gsap.set("#page16-guest-4-text", { opacity: 0, y: 20 });
            
            // Right section episode elements - hidden initially
            gsap.set("#page16-episode-1", { opacity: 0, y: 30 });
            gsap.set("#page16-episode-2", { opacity: 0, y: 30 });
            gsap.set("#page16-episode-3", { opacity: 0, y: 30 });
            gsap.set("#page16-show-more-btn", { opacity: 0, y: 30 });
            
            // Video section - hidden initially (must include scale: 0 to match timeline animation)
            gsap.set("#page16-video-section", { opacity: 0, scale: 0 });
            
            // Video grid elements - hidden initially for scroll animations
            gsap.set("#video-grid-classes", { opacity: 0, y: 50 });
            gsap.set("#video-grid-fitness", { opacity: 0, x: -50 });
            gsap.set("#video-grid-dance", { opacity: 0, y: 30 });
            gsap.set("#video-grid-cardio", { opacity: 0, y: -30 });
            gsap.set("#video-grid-yoga", { opacity: 0, x: 50 });
            
            // Mobile video grid elements - hidden initially for scroll animations
            gsap.set("#mobile-video-classes", { opacity: 0, y: 50 });
            gsap.set("#mobile-video-fitness", { opacity: 0, x: -50 });
            gsap.set("#mobile-video-yoga", { opacity: 0, x: 50 });
            gsap.set("#mobile-video-dance", { opacity: 0, y: 30 });
            gsap.set("#mobile-video-cardio", { opacity: 0, y: -30 });
            
            // Mobile right section - hidden initially
            gsap.set("#page16-mobile-right-section", { opacity: 0 });
            gsap.set("#page16-mobile-episode-1", { opacity: 0, y: 30 });
            gsap.set("#page16-mobile-episode-2", { opacity: 0, y: 30 });
            gsap.set("#page16-mobile-episode-3", { opacity: 0, y: 30 });
            gsap.set("#page16-mobile-show-more-btn", { opacity: 0, y: 30 });

            fullTimeline
            .to(".page-16", { yPercent: 0, duration: 1.5, ease: "power2.inOut" }, "-=1.5") // Show page 16
            .to("#page16-heading", {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
            })
            .to("#page16-tagline", {
                opacity: 1,
                x: 0,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.3")
            .to("#page16-bg-img", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.2")
            .to(["#page16-guest-1", "#page16-guest-2", "#page16-guest-3", "#page16-guest-4"], {
                opacity: 1,
                x: 0,
                y: 0,
                duration: 0.6,
                stagger: 0.3,
                ease: "power2.out"
            }, "-=0.2")
            .to(["#page16-guest-1-text", "#page16-guest-2-text", "#page16-guest-3-text", "#page16-guest-4-text"], {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.2,
                ease: "power2.out"
            }, "-=0.1")
            .to("#page16-img-31", {
                opacity: 1,
                x: 0,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.1")
            .to("#page16-img-32", {
                opacity: 1,
                x: 0,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.3")
            .to("#page16-youtube-btn", {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.2")
            .to("#page16-right-section", {
                opacity: 1,
                visibility: "visible",
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.1")
            .to("#page16-episode-1", {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.2")
            .to("#page16-episode-2", {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.3")
            .to("#page16-episode-3", {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.3")
            .to("#page16-show-more-btn", {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.3")
            
            // Mobile-specific: Replace left section with mobile right section
            if (isMobile) {
                fullTimeline.to("#page16-mobile-right-section", {
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=2.5") // Show mobile right section earlier, replacing left
                .to("#page16-mobile-episode-1", {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out"
                }, "-=0.2")
                .to("#page16-mobile-episode-2", {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out"
                }, "-=0.3")
                .to("#page16-mobile-episode-3", {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out"
                }, "-=0.3")
                .to("#page16-mobile-show-more-btn", {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out"
                }, "-=0.2")
            }
            
            fullTimeline.to({}, { duration: 1 }) // Hold to view sections
            
            // Hide podcast sections with dramatic scale-up effect (like membership page)
            .to("#page16-podcast-container", {
                scale: 2,
                opacity: 0,
                duration: 0.8,
                ease: "power2.in"
            })
            
            // Hide podcast container completely  
            .set("#page16-podcast-container", { display: "none" })
            
            // Show video section (like membership table replacement)
            .to("#page16-video-section", {
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "power3.out",
                onStart: () => console.log("Video section replacing podcast content"),
                onComplete: () => console.log("Video section replacement complete")
            })
            // Animate video grid elements one by one
            .to("#video-grid-classes", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.5")
            .to("#video-grid-dance", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.3")
            .to("#video-grid-cardio", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.3")
            .to("#video-grid-fitness", {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.3")
            .to("#video-grid-yoga", {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.3")
            
            // Mobile video animations (if mobile)
            if (isMobile) {
                fullTimeline
                .to("#mobile-video-classes", {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=2.0")
                .to("#mobile-video-dance", {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out"
                })
                .to("#mobile-video-cardio", {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out"
                })
                .to("#mobile-video-fitness", {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    ease: "power2.out"
                })
                .to("#mobile-video-yoga", {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    ease: "power2.out"
                })
            }
            
        }

        pageSection1Timeline(isMobile) {
            const timeline = gsap.timeline();
            // Initializations
            gsap.set(".page-2", { xPercent: -100 });
            gsap.set(".page-3", { xPercent: 100 });

            // Animations
            this.page1Animation(timeline, isMobile)
            this.page2Animation(timeline, isMobile)
            this.page3Animation(timeline, isMobile)
            
            ScrollTrigger.create({
                animation: timeline,
                trigger: "#page-section-1",
                start: "top top",
                end: () => "+=" + (timeline.duration() * this.multiplier),
                scrub: true,
                pin: true,
                anticipatePin: 1,
                refreshPriority: -1,
            });
        }

        pageSection2Timeline(isMobile) {
            const timeline = gsap.timeline();

            // Initializations
            gsap.set(".page-12", { xPercent: -100 });
            gsap.set(".page-11, .page-13", { xPercent: 100 });
            gsap.set("#events-1,#events-2", { opacity: 0 });
            gsap.set("#auraElite, #auraJunior", { xPercent: isMobile ? 0 : 50, scale: 2.5, y: isMobile ? "50vh" : "20vh", opacity: 0 });        
            gsap.set("#auraLuxury", { xPercent: 0, scale: 2.5, y: isMobile ? "50vh" : "20vh", opacity: 0 });        
            gsap.set("#auraContentText, #auraJuniorContentText, #auraLuxuryContentText, #events-3, #events-4, #events-5", {opacity: 0})
            gsap.set(".page-10 button, .page-10 h1", { opacity: 0, y: -200, scale: 1.5 })

            // Animations
            this.page10Animation(timeline, isMobile)
            this.page11Animation(timeline, isMobile)
            this.page12Animation(timeline, isMobile)
            this.page13Animation(timeline, isMobile)
            this.page14Animation(timeline, isMobile)
            
            ScrollTrigger.create({
                animation: timeline,
                trigger: "#page-section-2",
                start: "top top",
                end: () => "+=" + (timeline.duration() * this.multiplier),
                scrub: true,
                pin: true,
                anticipatePin: 1,
                refreshPriority: -8
            });
        }

        pageSection(isMobile, page, pageAnimation, refreshPriority) {
            const timeline = gsap.timeline();
            pageAnimation(timeline, isMobile)
            
            ScrollTrigger.create({
                animation: timeline,
                trigger: "#" + page,
                start: "top top",
                end: () => "+=" + (timeline.duration() * this.multiplier),
                scrub: true,
                pin: true,
                anticipatePin: 1,
                refreshPriority: refreshPriority
            });
        }
                /**
         * Animate page 4 "Your Strength" intro with rotating elements.
         * 
         * @private
         * @method page4Animation
         * @param {gsap.core.Timeline} fullTimeline - Main GSAP timeline
         * @param {boolean} isMobile - Device type flag
         */
        page4Animation(fullTimeline, isMobile) {
            gsap.set(".page-4 button, #about-us", { opacity: 0, scale: 0.8, rotationX: -45 })
            fullTimeline
                .to(".page-4 button, #about-us", {
                    opacity: 1,
                    scale: 1,
                    rotationX: 0,
                    duration: 0.5,
                    stagger: 0.3,
                    ease: "back.out(1.7)"
                })
                .to({}, { duration: 1.5 });
        }

        page9Animation(fullTimeline, isMobile) {
            gsap.set("#schedule, #schedule_title, #schedule_types, #schedule_heading", {
                opacity: 0,
                duration: 0.5  
            })
            fullTimeline
            .to("#schedule, #schedule_title, #schedule_types, #schedule_heading", {
                opacity: 1,
                duration: 0.5  
            })
            .to({}, {
                duration: 0.5
            })
        }
        /**
         * Optimize animation performance for mobile while preserving visual effects
         * @param {Object} element - GSAP target element
         * @param {Object} animation - Animation properties
         */
        optimizeForMobile(element, animation) {
            if (window.innerWidth < 1024) {
                // Enable hardware acceleration for smooth transforms
                gsap.set(element, { 
                    force3D: true,
                    backfaceVisibility: "hidden",
                    perspective: 1000,
                    transformStyle: "preserve-3d"
                });
            }
            return animation;
        }

        /**
         * Main GSAP animation orchestrator that coordinates all page animations.
         * Creates the master timeline and sets up ScrollTrigger configuration.
         * 
         * @private
         * @method gsapWithMobile
         * @param {boolean} isMobile - Device type flag for responsive animations
         */
        gsapWithMobile(isMobile) { 
            this.pageSection1Timeline(isMobile);
            this.pageSection(isMobile, "page-4", this.page4Animation, -2);
            this.pageSection(isMobile, "page-5", this.page5Animation.bind(this), -3);

            gsap.set(".visionMission", { opacity: 0, scale: isMobile ? 1 : 0.5, rotation: isMobile ? 0 : -180 })
            this.pageSection(isMobile, "page-6", this.page6Animation, -4);
            this.pageSection(isMobile, "page-7", this.page7Animation, -5);
            gsap.set(".carousel-track", { x: 0 })
            gsap.set(".video-slide", { scale: 0.7, opacity: 0.5 })
            gsap.set(".video-slide[data-index='0']", { scale: 1, opacity: 1, rotationY: 0 })
            this.pageSection(isMobile, "page-8", this.page8Animation.bind(this), -6);
            this.pageSection(isMobile, "page-9", this.page9Animation, -7);

            this.pageSection2Timeline(isMobile);
            this.pageSection(isMobile, "page-15", this.page15Animation, -10);
            this.pageSection(isMobile, "page-16", this.page16Animation, -11);
            this.pageSection(isMobile, "page-17", this.page17Animation, -12);
        }

        page17Animation(fullTimeline, isMobile) {
            // Set initial states for Page 17 elements
            gsap.set(".page-17", { yPercent: 100 });
            
            // Desktop elements
            gsap.set(".page-17 .hidden.md\\:flex button", { opacity: 0, y: 50, scale: 0.8 });
            gsap.set(".page-17 .hidden.md\\:flex h1", { opacity: 0, x: -100, rotationX: -45 });
            gsap.set(".page-17 .hidden.md\\:flex p", { opacity: 0, y: 30, scale: 0.9 });
            gsap.set(".page-17 .bg-slate-800\\/80.text-white", { opacity: 0, scale: 0.8, rotationY: 15 });
            gsap.set(".page-17 form", { opacity: 0, y: 50 });
            gsap.set(".page-17 form input", { opacity: 0, y: 20, scale: 0.95 });
            gsap.set(".page-17 form textarea", { opacity: 0, y: 20, scale: 0.95 });
            gsap.set(".page-17 form button[type='submit']", { opacity: 0, scale: 0.8, rotationZ: -5 });
            
            // Mobile elements
            gsap.set(".page-17 .flex.md\\:hidden button", { opacity: 0, y: -30, scale: 0.9 });
            gsap.set(".page-17 .flex.md\\:hidden h1", { opacity: 0, x: -50, rotationX: -30 });
            gsap.set(".page-17 .flex.md\\:hidden p", { opacity: 0, y: 20 });
            
            // Page entrance animation
            fullTimeline
            .to(".page-17", { yPercent: 0, duration: 1.5, ease: "power2.inOut" })
            
            // Desktop animations
            .to(".page-17 .hidden.md\\:flex button", {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "back.out(1.7)"
            }, "-=1")
            .to(".page-17 .hidden.md\\:flex h1", {
                opacity: 1,
                x: 0,
                rotationX: 0,
                duration: 1,
                ease: "power3.out"
            }, "-=0.6")
            .to(".page-17 .hidden.md\\:flex p", {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.8")
            
            // Mobile animations
            .to(".page-17 .flex.md\\:hidden button", {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "back.out(1.5)"
            }, "-=1.2")
            .to(".page-17 .flex.md\\:hidden h1", {
                opacity: 1,
                x: 0,
                rotationX: 0,
                duration: 1,
                ease: "power3.out"
            }, "-=0.8")
            .to(".page-17 .flex.md\\:hidden p", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.6")
            
            // Form header animation
            .to(".page-17 .bg-slate-800\\/80.text-white", {
                opacity: 1,
                scale: 1,
                rotationY: 0,
                duration: 0.8,
                ease: "back.out(1.3)"
            }, "-=0.5")
            
            // Form body animation
            .to(".page-17 form", {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.3")
            
            // Form inputs stagger animation
            .to(".page-17 form input", {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "back.out(1.7)"
            }, "-=0.2")
            .to(".page-17 form textarea", {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: "back.out(1.5)"
            }, "-=0.1")
            .to(".page-17 form button[type='submit']", {
                opacity: 1,
                scale: 1,
                rotationZ: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.8)"
            }, "-=0.2")
            
            // Hold the final state
            .to({}, { duration: 1 });
        }
        
        /**
         * Initialize GSAP library, register plugins, and set up responsive media queries.
         * Entry point for the animation system configuration.
         * 
         * @public
         * @method setUpGSAP
         */
        setUpGSAP () {
            gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
            
            // Mobile performance optimizations
            const isMobile = window.innerWidth < 1024;
            
            // Global ScrollTrigger config for smooth scrolling
            ScrollTrigger.config({
                autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
                ignoreMobileResize: false
            });
            
            // Smooth 60fps for all devices
            gsap.ticker.fps(60);
            
            // Optimized defaults for smooth animations
            gsap.defaults({ease: "power2.out", duration: isMobile ? 1.5 : 2});
            
            
            let mm = gsap.matchMedia();
            mm.add("(max-width: 1023px)", () => this.gsapWithMobile(true));
            mm.add("(min-width: 1024px)", () => this.gsapWithMobile(false));
            
        }

        /**
         * Configure Lenis smooth scroll library with responsive settings.
         * Integrates with GSAP ticker for optimized performance.
         * 
         * @public
         * @method setUpLenis
         */
        setUpLenis() {
            const isMobile = window.innerWidth < 1024;
            
            this.lenis = new Lenis({
                duration: isMobile ? 1.2 : 2.0, // Smooth but responsive on mobile
                easing: (t) => 1 - Math.pow(1 - t, 3), // Simpler cubic easing for mobile
                smooth: true,
                smoothTouch: isMobile ? true : true, // Enable smooth touch but optimized
                touchMultiplier: isMobile ? 2 : 1, // Higher sensitivity on mobile
                wheelMultiplier: 1,
                normalizeWheel: false, // Disable on both mobile and desktop for performance
                infinite: false,
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                syncTouch: false, // Disable sync for smoother performance
                touchInertiaMultiplier: isMobile ? 35 : 18, // Higher inertia for smoother feel
                eventsTarget: window,
                autoResize: true,
                lerp: isMobile ? 0.1 : 0.07, // Higher lerp for more responsive mobile scrolling
                __experimental__naiveDimensions: false, // Prevent scroll getting stuck at bottom
                wrapper: window,
                content: document.documentElement
            });

            // On desktop, keep it smooth
            this.lenis.on('scroll', ScrollTrigger.update);
            
        
            
            // Better RAF integration with GSAP
            gsap.ticker.add((time) => {
                this.lenis.raf(time * 1000);
            });
            
            // Optimize GSAP ticker for smooth scrolling
            gsap.ticker.lagSmoothing(0);
            
            // Add mobile-specific scroll optimizations
            const isMobileDevice = window.innerWidth < 1024;
            if (isMobileDevice) {
                // Prevent scroll bounce on mobile
                document.addEventListener('touchmove', (e) => {
                    if (e.touches.length > 1) {
                        e.preventDefault();
                    }
                }, { passive: false });
                
                // Optimize touch events for smoother scrolling
                document.addEventListener('touchstart', () => {
                    this.lenis.start();
                }, { passive: true });
                
                // Add escape mechanism for stuck footer
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Home' || (e.ctrlKey && e.key === 'Home')) {
                        // Go to top when Home key is pressed
                        this.lenis.scrollTo(0, { duration: 2 });
                    }
                });
            }
            
            // Handle resize events for responsive behavior
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                const currentIsMobile = window.innerWidth < 1024;
                resizeTimeout = setTimeout(() => {
                    this.lenis.resize();

                    // Optimize ScrollTrigger refresh for mobile
                    if (currentIsMobile) {
                        // Use batch refresh on mobile to reduce performance hit
                        requestAnimationFrame(() => {
                            ScrollTrigger.refresh(true);
                        });
                    } else {
                        ScrollTrigger.refresh();
                    }
                }, currentIsMobile ? 200 : 150); // Quick response for mobile
            });

        }
        

        /**
         * Initialize ECG (Electrocardiogram) canvas animation with heart rate simulation.
         * Creates a real-time animated heartbeat visualization.
         * 
         * @public
         * @method initECGAnimation
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

            const isMobile = window.innerWidth < 1024;
            let frameCount = 0;
            const frameSkip = isMobile ? 1 : 0; // Light frame skipping on mobile
            
            const drawECG = () => {
                if (!this.state.isVisible) {
                    animationId = requestAnimationFrame(drawECG);
                    return;
                }
                
                // Frame skipping for mobile performance
                if (isMobile && frameCount % (frameSkip + 1) !== 0) {
                    frameCount++;
                    animationId = requestAnimationFrame(drawECG);
                    return;
                }
                frameCount++;
                
                const rect = canvas.getBoundingClientRect();
                const width = rect.width;
                const height = rect.height;
                const centerY = height / 2;
                
                // Use willChange for better mobile performance
                if (isMobile) {
                    canvas.style.willChange = 'transform';
                }
                
                ctx.clearRect(0, 0, width, height);
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 1.5;
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#ef4444';
                ctx.beginPath();
                
                const step = isMobile ? 3 : 2; // Larger steps on mobile for performance
                for (let x = 0; x < width; x += step) {
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
                ctx.lineWidth = 3;
                ctx.stroke();
                animationOffset += isMobile ? 1.5 : 2; // Slightly slower on mobile
                animationId = requestAnimationFrame(drawECG);
            };
            this.animations.ecg = { draw: drawECG, resize: resizeCanvas, stop: () => cancelAnimationFrame(animationId) };
            drawECG();
        }

        /**
         * Start real-time clock updates with formatted display.
         * Updates clock element every second with current time.
         * 
         * @public
         * @method startClockUpdate
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
         * Safely update DOM element content with null checking.
         * 
         * @public
         * @method updateElement
         * @param {string} id - Element ID to update
         * @param {string} value - New text content value
         */
        updateElement(id, value) {
            const element = document.getElementById(id);
            if (element) { element.textContent = value; }
        }

    }
/**
 * Initialize the FitnessHeroAnimations when DOM is ready.
 * Creates global instance for debugging and external access.
 * 
 * @event DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
    const auraCenter = new AuraCenter();
    window.auraCenter = auraCenter;
    
    // Navigation functionality
    setupNavigation();
    
    // Add calibration helper for development
    window.calibrateNavigation = calibrateNavigation;
    
    // Add debug helper for Get Started button
    window.testGetStarted = () => {
        console.log('🧪 Testing Get Started button navigation...');
        const button = document.querySelector('button[data-page="17"]');
        if (button) {
            console.log('✅ Get Started button found');
            button.click();
        } else {
            console.log('❌ Get Started button not found');
        }
    };
});

/**
 * Calibration helper function to fine-tune navigation progress values
 * Usage: calibrateNavigation(9, 0.52) - test page 9 with 0.52 progress
 */
function calibrateNavigation(pageNumber, testProgress) {
    console.log(`🔧 Calibrating page ${pageNumber} with progress ${testProgress}`);
    
    if (window.auraCenter && window.auraCenter.tl) {
        const scrollTriggers = ScrollTrigger.getAll();
        const mainScrollTrigger = scrollTriggers.find(st => 
            st.trigger && st.trigger.id === "page-container"
        );
        
        if (mainScrollTrigger) {
            const scrollRange = mainScrollTrigger.end - mainScrollTrigger.start;
            const targetScrollPosition = mainScrollTrigger.start + (testProgress * scrollRange);
            
            console.log(`📍 Test scroll position: ${targetScrollPosition}`);
            
            const lenis = window.lenis;
            if (lenis && lenis.scrollTo) {
                lenis.scrollTo(targetScrollPosition, {
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
                
                // Log current timeline progress after animation
                setTimeout(() => {
                    console.log(`⏱️ Timeline progress after animation: ${window.auraCenter.tl.progress()}`);
                    console.log(`📱 Current scroll position: ${window.scrollY}`);
                }, 2000);
            }
        }
    }
}

/**
 * Setup navigation functionality for both desktop and mobile menus
 * Handles click events on navigation links with data-page attributes
 */
function setupNavigation() {
        // Get all navigation links and buttons
        const navLinks = document.querySelectorAll('.nav-link[data-page]');
        const navButtons = document.querySelectorAll('button[data-page]');
        const allNavElements = [...navLinks, ...navButtons];
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.querySelector('.mobile-menu');
        // Handle navigation link and button clicks
        allNavElements.forEach(element => {
            element.addEventListener('click', (e) => {
                const pageNumber = element.getAttribute('data-page')
                const offset = element.getAttribute('data-page')
                e.preventDefault();                
                // Wait a bit for animations to be ready, then navigate
                setTimeout(() => {
                    window.auraCenter.lenis.scrollTo("#page-" + pageNumber, {
                        offset: offset
                    })
                }, 100);
                
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            });
        });
        
        // Handle mobile menu toggle
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }



/**
 * Get the currently visible page based on scroll position
 * @returns {string} The current page number
 */
function getCurrentVisiblePage() {
    if (!window.auraCenter?.tl) return '1';
    
    const progress = window.auraCenter.tl.progress();
    const progressMap = {
        1: 0.0,     // Page 1 - Landing Page (Hero section with heart monitor)
        2: 0.055,   // Page 2 - Welcome to Auracenter (About intro)
        3: 0.11,    // Page 3 - We're Here to Serve You Well
        4: 0.295,   // Page 4 - Your Strength. Our Vision (Main about section)
        5: 0.14,    // Page 5 - Classes (Fitness Classes for Every Goal)
        6: 0.275,   // Page 6 - Vision/Mission (Interactive cards)
        7: 0.33,    // Page 7 - Aura Store (Upgrade Your Style with Aura Wear)
        8: 0.385,   // Page 8 - Videos (YouTube video carousel)
        9: 0.52,    // Page 9 - Schedule (Discipline Starts with a Plan)
        10: 0.555,  // Page 10 - Events (We Organize the Best Events)
        11: 0.61,   // Page 11 - Aura Elite (Premium fitness center)
        12: 0.650,  // Page 12 - Aura Luxury (Luxurious fitness experience)
        13: 0.69,   // Page 13 - Aura Juniors (Children's fitness programs)
        14: 0.725,  // Page 14 - Trainers (Our Professional Trainers)
        15: 0.83,   // Page 15 - Pricing (Choose Your Level/Membership plans)
        16: 0.885,  // Page 16 - Podcast (Lift. Learn. Lead!)
        17: 0.99,   // Page 17 - Contact Form (Get Appointment/Contact page)
        18: 0.995   // Page 18 - Footer (Final page with contact info)
    };
    
    let closestPage = '1';
    let closestDiff = 1;
    
    for (const [page, pageProgress] of Object.entries(progressMap)) {
        const diff = Math.abs(progress - pageProgress);
        if (diff < closestDiff) {
            closestDiff = diff;
            closestPage = page;
        }
    }
    
    return closestPage;
}

/**
 * Navigate to a specific page using timeline progress calculation
 * Works with pinned ScrollTrigger and Lenis smooth scrolling
 * @param {string} pageNumber - The page number to navigate to
 */
function navigateToPage(pageNumber) {
    console.log('navigateToPage called with:', pageNumber);
    
    const targetPage = document.getElementById(`page-${pageNumber}`);
    console.log('Target page found:', !!targetPage);
    console.log('AuraCenter instance:', !!window.auraCenter);
    console.log('Timeline:', !!window.auraCenter?.tl);
    
    if (targetPage && window.auraCenter && window.auraCenter.tl) {
        const targetIndex = parseInt(pageNumber) - 1;
        const totalPages = 18; // Total number of pages
        
        // Calculate the progress for the target page
        // Precise progress mapping for exact page landing
        const progressMap = {
            1: 0.0,     // Page 1 - Landing Page (Hero section with heart monitor)
            2: 0.055,   // Page 2 - Welcome to Auracenter (About intro)
            3: 0.11,    // Page 3 - We're Here to Serve You Well
            4: 0.295,   // Page 4 - Your Strength. Our Vision (Main about section)
            5: 0.14,    // Page 5 - Classes (Fitness Classes for Every Goal)
            6: 0.275,   // Page 6 - Vision/Mission (Interactive cards)
            7: 0.33,    // Page 7 - Aura Store (Upgrade Your Style with Aura Wear)
            8: 0.385,   // Page 8 - Videos (YouTube video carousel)
            9: 0.52,    // Page 9 - Schedule (Discipline Starts with a Plan)
            10: 0.555,  // Page 10 - Events (We Organize the Best Events)
            11: 0.61,   // Page 11 - Aura Elite (Premium fitness center)
            12: 0.650,  // Page 12 - Aura Luxury (Luxurious fitness experience)
            13: 0.688,   // Page 13 - Aura Juniors (Children's fitness programs)
            14: 0.725,  // Page 14 - Trainers (Our Professional Trainers)
            15: 0.83,   // Page 15 - Pricing (Choose Your Level/Membership plans)
            16: 0.885,  // Page 16 - Podcast (Lift. Learn. Lead!)
            17: 0.988,   // Page 17 - Contact Form (Get Appointment/Contact page)
            18: 0.995   // Page 18 - Footer (Final page with contact info)
        };
        
        const progress = progressMap[parseInt(pageNumber)] || (targetIndex / (totalPages - 1));
        console.log('Calculated progress:', progress, 'for page', pageNumber);
        
        // Get the ScrollTrigger instance
        const scrollTriggers = ScrollTrigger.getAll();
        console.log('Found ScrollTriggers:', scrollTriggers.length);
        
        const mainScrollTrigger = scrollTriggers.find(st => 
            st.trigger && st.trigger.id === "page-container"
        );
        console.log('Main ScrollTrigger found:', !!mainScrollTrigger);
        
        if (mainScrollTrigger) {
            // Calculate the scroll position based on ScrollTrigger's end point
            const scrollRange = mainScrollTrigger.end - mainScrollTrigger.start;
            const targetScrollPosition = mainScrollTrigger.start + (progress * scrollRange);
            
            console.log('Scroll range:', scrollRange);
            console.log('Target scroll position:', targetScrollPosition);
            console.log('Current scroll position:', window.scrollY);
            
            // Use Lenis for smooth scrolling to maintain consistency
            const lenis = window.lenis;
            console.log('Lenis instance:', !!lenis);
            
            if (lenis && lenis.scrollTo) {
                console.log('Using Lenis scrollTo');
                // Use Lenis scrollTo method
                lenis.scrollTo(targetScrollPosition, {
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            } else {
                console.log('Using GSAP scrollTo fallback');
                // Fallback: use GSAP ScrollTo
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: {
                        y: targetScrollPosition,
                        autoKill: false
                    },
                    ease: "power2.inOut",
                    onStart: () => console.log('GSAP scroll animation started'),
                    onComplete: () => console.log('GSAP scroll animation completed')
                });
            }
        } else {
            console.warn('ScrollTrigger instance not found for navigation');
            console.log('Available ScrollTriggers:', scrollTriggers.map(st => ({ 
                trigger: st.trigger?.id || st.trigger?.tagName, 
                start: st.start, 
                end: st.end 
            })));
        }
    } else {
        console.warn('Navigation failed: Timeline or target page not found');
        console.log('Missing components:', {
            targetPage: !!targetPage,
            auraCenter: !!window.auraCenter,
            timeline: !!window.auraCenter?.tl
        });
    }
}