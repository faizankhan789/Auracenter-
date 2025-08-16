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
     * Initialize the FitnessHeroAnimations controller with default configurations
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
        this.tl = null
        this.trainers = [
    {
        imageSrc: './assets/page_14/MARIE',
        name: 'MARIE',
        title: 'Fitness Trainer',
        qualifications: ['FEA: exercise coaching', 'Physical education', 'Nutrition specialist'],
        index: 1
    },
    {
        imageSrc: './assets/page_14/ABIR_LABIDHI',
        name: 'ABIR LABIDHI',
        title: 'Yoga Expert',
        qualifications: ['Certified Yoga Instructor', 'Meditation Coach', '10+ years experience'],
        index: 2
    },
    {
        imageSrc: './assets/page_14/SARAH_HOSNY',
        name: 'SARAH HOSNY',
        title: 'Strength Coach',
        qualifications: ['Powerlifting Certified', 'Sports Science Degree', 'Injury Prevention'],
        index: 3
    },
    {
        imageSrc: './assets/page_14/ABEER_RAHIM',
        name: 'ABEER RAHIM',
        title: 'Cardio Specialist',
        qualifications: ['HIIT Certified', 'Marathon Runner', 'Group Fitness Expert'],
        index: 4
    },
    {
        imageSrc: './assets/page_14/HADEEL_YOUSSEF',
        name: 'HADEEL YOUSSEF',
        title: 'Nutrition Coach',
        qualifications: ['Registered Dietitian', 'Sports Nutrition', 'Meal Planning Expert'],
        index: 5
    },
    {
        imageSrc: './assets/page_14/ROBA_SAMIR',
        name: 'ROBA SAMIR',
        title: 'Dance Fitness',
        qualifications: ['Zumba Certified', 'Contemporary Dance', 'Choreography Expert'],
        index: 6
    }
        ];
        this.videos = [
            "https://www.youtube.com/embed/W1WChNEbKLE",
            "https://www.youtube.com/embed/W1WChNEbKLE",
            "https://www.youtube.com/embed/HfPzZseycQs",
            "https://www.youtube.com/embed/HlrlPU4XSgA",
            "https://www.youtube.com/embed/O7B2Bcdpzn4",
            "https://www.youtube.com/embed/6FwJF7hKskA",
            "https://www.youtube.com/embed/cj_dtXO5N60",
            "https://www.youtube.com/embed/a4CyifxUPN8",
            "https://www.youtube.com/embed/uTduDcQAmC0",
            "https://www.youtube.com/embed/jXhuFe2AAIk"
        ];
        this.cards = [
        {
            imageSrc: './assets/page_5/power_yoga',
            title: 'Power Yoga',
            listItems: ['Flexibility', 'Breath Control', 'Stress Relief'],
            index: 1
        },
        {
            imageSrc: './assets/page_5/weight_lifting',
            title: 'Weight Lifting',
            listItems: ['Strength Training', 'Form Guidance', 'Women Focused'],
            index: 2
        },
        {
            imageSrc: './assets/page_5/personal_training',
            title: 'Personal Training',
            listItems: ['1-on-1 Coaching', 'Custom Plans', 'Goal Tracking'],
            index: 3
        },
        {
            imageSrc: './assets/page_5/cardio_strength',
            title: 'Cardio & Strength',
            listItems: ['Hit Sessions', 'Fat Burn', 'Endurance'],
            index: 4
        },
        {
            imageSrc: './assets/page_5/strength_recovery',
            title: 'Strength & Recovery',
            listItems: ['Deep Stretching', 'Muscle Release', 'Injury Prevention'],
            index: 5
        },
        {
            imageSrc: './assets/page_5/dance_fitness',
            title: 'Dance Fitness',
            listItems: ['Fun workouts', 'High energy', 'Cultural vibes'],
            index: 6
        }
        ];
        this.schedule = [
            {
                day: 'MONDAY',
                activities: [
                    { time: '06:00 - 07:00', name: 'MORNING STRENGTH', icon: './assets/page_9/dumbell.png', type: 'white' },
                    { time: '08:00 - 09:00', name: 'AQUA FITNESS', icon: './assets/page_9/weight.png', type: '#24203c' },
                    { time: '10:00 - 11:00', name: 'CARDIO BLAST', icon: './assets/page_9/heart.png', type: 'white' },
                    { time: '17:00 - 18:00', name: 'POWER LIFTING', icon: './assets/page_9/dumbell.png', type: 'dark' },
                    { time: '18:30 - 19:30', name: 'YOGA FLOW', icon: './assets/page_9/weight.png', type: 'white' },
                    { time: '20:00 - 21:00', name: 'EVENING STRETCH', icon: './assets/page_9/heart.png', type: 'dark' }
                ]
            },
            {
                day: 'TUESDAY',
                activities: [
                    { time: '06:00 - 07:00', name: 'BOOT CAMP', icon: './assets/page_9/dumbell.png', type: 'white' },
                    { time: '08:00 - 09:00', name: 'WATER AEROBICS', icon: './assets/page_9/weight.png', type: 'dark' },
                    { time: '10:30 - 11:30', name: 'DANCE FITNESS', icon: './assets/page_9/heart.png', type: 'white' },
                    { time: '17:00 - 18:00', name: 'CIRCUIT TRAINING', icon: './assets/page_9/dumbell.png', type: 'dark' },
                    { time: '18:30 - 19:30', name: 'PILATES', icon: './assets/page_9/weight.png', type: 'white' },
                    { time: '20:00 - 21:00', name: 'STRENGTH & TONE', icon: './assets/page_9/heart.png', type: 'dark' }
                ]
            },
            {
                day: 'WEDNESDAY',
                activities: [
                    { time: '06:00 - 07:00', name: 'AQUA ZUMBA', icon: './assets/page_9/dumbell.png', type: 'white' },
                    { time: '08:00 - 09:00', name: 'HIIT CARDIO', icon: './assets/page_9/weight.png', type: 'dark' },
                    { time: '10:00 - 11:00', name: 'FUNCTIONAL FITNESS', icon: './assets/page_9/heart.png', type: 'white' },
                    { time: '17:00 - 18:00', name: 'VINYASA YOGA', icon: './assets/page_9/dumbell.png', type: 'dark' },
                    { time: '18:30 - 19:30', name: 'BODY SCULPT', icon: './assets/page_9/weight.png', type: 'white' },
                    { time: '20:00 - 21:00', name: 'MEDITATION', icon: './assets/page_9/heart.png', type: 'dark' }
                ]
            },
            {
                day: 'THURSDAY',
                activities: [
                    { time: '06:00 - 07:00', name: 'MORNING PUMP', icon: './assets/page_9/dumbell.png', type: 'white' },
                    { time: '08:00 - 09:00', name: 'AQUA THERAPY', icon: './assets/page_9/weight.png', type: 'dark' },
                    { time: '10:30 - 11:30', name: 'CARDIO MIX', icon: './assets/page_9/heart.png', type: 'white' },
                    { time: '17:00 - 18:00', name: 'KETTLEBELL', icon: './assets/page_9/dumbell.png', type: 'dark' },
                    { time: '18:30 - 19:30', name: 'BARRE CLASS', icon: './assets/page_9/weight.png', type: 'white' },
                    { time: '20:00 - 21:00', name: 'CORE POWER', icon: './assets/page_9/heart.png', type: 'dark' }
                ]
            },
            {
                day: 'SATURDAY',
                activities: [
                    { time: '08:00 - 09:00', name: 'WEEKEND WARRIOR', icon: './assets/page_9/dumbell.png', type: 'white' },
                    { time: '09:30 - 10:30', name: 'AQUA FUN', icon: './assets/page_9/weight.png', type: 'dark' },
                    { time: '11:00 - 12:00', name: 'ZUMBA PARTY', icon: './assets/page_9/heart.png', type: 'white' },
                    { time: '16:00 - 17:00', name: 'STRENGTH BASICS', icon: './assets/page_9/dumbell.png', type: 'dark' },
                    { time: '17:30 - 18:30', name: 'RESTORATIVE YOGA', icon: './assets/page_9/weight.png', type: 'white' },
                    { time: '20:00 - 21:00', name: 'EVENING STRETCH', icon: './assets/page_9/heart.png', type: 'dark' }
                ]
            },
            {
                day: 'SUNDAY',
                activities: [
                    { time: '09:00 - 10:00', name: 'SUNDAY SCULPT', icon: './assets/page_9/dumbell.png', type: 'white' },
                    { time: '10:30 - 11:30', name: 'WATER WELLNESS', icon: './assets/page_9/weight.png', type: 'dark' },
                    { time: '12:00 - 13:00', name: 'GENTLE CARDIO', icon: './assets/page_9/heart.png', type: 'white' },
                    { time: '16:00 - 17:00', name: 'FULL BODY', icon: './assets/page_9/dumbell.png', type: 'dark' },
                    { time: '17:30 - 18:30', name: 'SUNSET YOGA', icon: './assets/page_9/weight.png', type: 'white' },
                    { time: '19:00 - 20:00', name: 'RECOVERY SESSION', icon: './assets/page_9/heart.png', type: 'dark' }
                ]
            }
        ];
        this.lenis = null;
        this.state = {
            heartRate: this.config.heartRate.base,
            isVisible: true,
        };

        // Animation controllers
        this.animations = {
            ecg: null,
            intervals: new Map(),
        };

        // Initialize
        this.init();
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
                    class="w-auto h-full object-cover block"
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
        card.className = 'trainer-card trainer_cards w-[45vw] lg:w-[30vw] h-[45vh] lg:hover:z-[3] cursor-pointer group flex-shrink-0';
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
                <img src="${imageSrc}" alt="${title}"  loading="lazy"  class="absolute z-[1] w-full h-full object-cover object-center ease-in-out rounded-xl transition-all duration-800 lg:group-hover:scale-[1.05] lg:group-hover:z-[2]">
            </picture>               
                <div id="trainer-card-content-${index}" class="rounded-xl card__back justify-center h-full lg:h-[22vh] w-[45vw] px-4 py-4 lg:w-[30vw] absolute bottom-0 left-0 bg-[#c7b6a8] lg:translate-y-0 transition-transform transition-opacity duration-[600ms] ease-out shadow-[0_20px_40px_rgba(0,0,0,0.3)] will-change-[transform] will-change-[opacity] cursor-pointer flex flex-col justify-start items-start">
                    <h2 class="text-2xl font-bold uppercase tracking-wide" style="line-height: 1">${name}</h2>
                    <p class="text-xl font-medium">${title}</p>
                    <ul class="mt-2">
                        ${qualifications.map(qual => `
                            <li class="flex items-center">
                                <span class="mx-3 text-[#182a41] text-lg">•</span>
                                <span class="text-lg leading-relaxed">${qual}</span>
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
        card.className = 'hover-card classes_cards w-[45vw] lg:w-[30vw] h-[50vh] lg:hover:z-[3] cursor-pointer group flex-shrink-0';
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
                <img src="${imageSrc}" alt="${title}"  loading="lazy"  class="absolute z-[1] w-full h-full object-cover object-center ease-in-out rounded-xl transition-all duration-800 lg:group-hover:scale-[1.05] lg:group-hover:z-[2]">
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
        dayHeader.className = 'bg-[#c8e6dc] p-3 rounded-lg mb-1';
        const headerTextClass = this.isMobile ? 'text-xs' : 'text-sm';
        dayHeader.innerHTML = `<h3 class="font-bold ${headerTextClass} tracking-wider text-[#2c3e50] text-center">${day}</h3>`;
        
        const activitiesContainer = document.createElement('div');
        activitiesContainer.className = 'space-y-1';
        
        activities.forEach(activity => {
            const activityBlock = document.createElement('div');
            const bgColor = activity.type === 'white' ? 'bg-[#F0EDEB] border border-gray-200' : 'bg-[#24203c] text-white';
            const textColor = activity.type === 'white' ? 'text-gray-600' : 'text-gray-300';
            const nameColor = activity.type === 'white' ? 'text-gray-800' : 'text-white';
            
            const timeClass = this.isMobile ? 'text-[8px]' : 'text-xs';
            const activityNameClass = this.isMobile ? 'text-[9px]' : 'text-sm';
            
            activityBlock.className = `flex items-center gap-3 p-3 rounded-lg h-12 ${bgColor} hover:-translate-y-0.5 hover:shadow-md transition-all duration-300`;
            activityBlock.innerHTML = `
                <div class="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                    <img src="${activity.icon}" alt="Activity Icon" class="w-5 h-5 opacity-80">
                </div>
                <div class="flex-1 flex flex-col gap-1 overflow-hidden">
                    <div class="${timeClass} font-medium ${textColor} truncate">${activity.time}</div>
                    <div class="${activityNameClass} font-semibold ${nameColor} leading-tight ${this.isMobile ? 'line-clamp-1' : ''}">${activity.name}</div>
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
    init() {
        this.setupMobileMenu();
        this.startClockUpdate();
        this.initECGAnimation();
        this.addClassesCard();
        this.addVideos()
        this.addTrainersCards();
        this.addScheduleGrid();
        this.removeLoader();
        this.setUpGSAP();
        this.setUpLenis();
    }

    removeLoader() {
        document.body.classList.remove('bodyLoading');
        document.getElementById('loader')?.classList.add('hidden');
        document.getElementById('page-container')?.classList.remove('hidden');
        document.getElementById('header')?.classList.remove('hidden');
    }

    /**
     * Generate and append all trainer cards to the DOM.
     * 
     * @public
     * @method addTrainersCards
     */
    addTrainersCards() {
       this.trainers.forEach(trainer => this.addTrainerCard(trainer));
    }

    addVideos() {
        this.videos.forEach((video, index) => {
            this.addVideo(video, index);
        });
    }
    /**
     * Generate and append all class cards to the DOM.
     * 
     * @public
     * @method addClassesCard
     */
    addClassesCard() {
        this.cards.forEach(card => this.addClassCard(card));
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
        this.isMobile = window.innerWidth < 768;
        this.columnsPerGroup = 2; // 2 columns per group on mobile
        this.groupsPerPage = 3; // 3 groups (6 columns) per page on mobile
        
        if (this.isMobile) {
            this.setupMobileScrollPagination();
        }
        
        this.renderSchedulePage();
    }



    setupMobileScrollPagination() {
        const scheduleContainer = document.querySelector('#schedule');
        if (!scheduleContainer) return;
        
        let touchStartY = 0;
        let isScrolling = false;
        
        // Touch events for mobile
        scheduleContainer.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            e.stopPropagation(); // Prevent interference with page scroll
        }, { passive: false });
        
        scheduleContainer.addEventListener('touchend', (e) => {
            if (isScrolling) return;
            
            const touchEndY = e.changedTouches[0].clientY;
            const deltaY = touchStartY - touchEndY;
            
            if (Math.abs(deltaY) > 50) { // Minimum swipe distance
                e.preventDefault(); // Prevent page scroll
                e.stopPropagation(); // Prevent interference with page scroll
                isScrolling = true;
                
                if (deltaY > 0) {
                    this.nextMobileGroup();
                } else {
                    this.prevMobileGroup();
                }
                
                setTimeout(() => { isScrolling = false; }, 500);
            }
        }, { passive: false });
        
        // Mouse wheel for testing on desktop
        scheduleContainer.addEventListener('wheel', (e) => {
            if (!this.isMobile) return; // Only on mobile
            if (isScrolling) return;
            
            e.preventDefault();
            isScrolling = true;
            
            if (e.deltaY > 0) {
                this.nextMobileGroup();
            } else {
                this.prevMobileGroup();
            }
            
            setTimeout(() => { isScrolling = false; }, 500);
        });
    }
    
    nextMobileGroup() {
        const totalColumns = this.schedule.length;
        const totalPages = Math.ceil(totalColumns / (this.groupsPerPage * this.columnsPerGroup));
        
        this.currentMobileGroup++;
        
        if (this.currentMobileGroup >= this.groupsPerPage) {
            this.currentMobileGroup = 0;
            this.currentMobilePage = (this.currentMobilePage + 1) % totalPages;
        }
        
        this.renderSchedulePage();
    }
    
    prevMobileGroup() {
        const totalColumns = this.schedule.length;
        const totalPages = Math.ceil(totalColumns / (this.groupsPerPage * this.columnsPerGroup));
        
        this.currentMobileGroup--;
        
        if (this.currentMobileGroup < 0) {
            this.currentMobileGroup = this.groupsPerPage - 1;
            this.currentMobilePage = this.currentMobilePage - 1;
            if (this.currentMobilePage < 0) this.currentMobilePage = totalPages - 1;
        }
        
        this.renderSchedulePage();
    }

    renderSchedulePage() {
        const container = document.querySelector('#schedule');
        
        if (!container) return;
        
        // Clear existing content
        container.innerHTML = '';
        
        if (this.isMobile) {
            // Mobile: Show only 2 columns at a time based on current group and page
            const startIndex = (this.currentMobilePage * this.groupsPerPage * this.columnsPerGroup) + 
                              (this.currentMobileGroup * this.columnsPerGroup);
            const endIndex = Math.min(startIndex + this.columnsPerGroup, this.schedule.length);
            const daysToShow = this.schedule.slice(startIndex, endIndex);
            
            daysToShow.forEach(day => this.addScheduleDay(day));
        } else {
            // Desktop: Show all days
            this.schedule.forEach(day => this.addScheduleDay(day));
        }
        
        // Refresh ScrollTrigger to ensure page transitions continue working
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
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
                scale: 2,
                duration: 1.5,
                ease: "power3.inOut",
                ...(isMobile ? { y: "25vh" } : {})
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
                duration: 2.5,
                ease: "power2.inOut"
            })        
            .to({}, { duration: 1.5 });
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
                duration: 2.5,
                ease: "power2.inOut"
            })
            .to({}, { duration: 1.5 });
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
        fullTimeline
            .to(".page-4", { 
                yPercent: 0, 
                duration: 1,
                ease: "power2.inOut"
            })
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

    /**
     * Animate page 5 classes section with card carousel and responsive interactions.
     * 
     * @private
     * @method page5Animation
     * @param {gsap.core.Timeline} fullTimeline - Main GSAP timeline
     * @param {boolean} isMobile - Device type flag
     */
    page5Animation(fullTimeline, isMobile) {
        const cardWidthVW = isMobile ? 45 : 30;
        const cardMarginPx = 16;
        const vw = window.innerWidth / 100;
        const cardWidth = (cardWidthVW * vw + cardMarginPx)
        const totalWidth = this.cards.length * cardWidth;
        const visibleNumber = window.innerWidth / cardWidth
        const cards = gsap.utils.toArray(".classes_cards")
        const minVisibleNumber = Math.floor(visibleNumber)
        const visibleCards = cards.slice(0, Math.ceil(visibleNumber));
        fullTimeline
            // Page 5 - Our Classes intro animation with wave effect
            .to(".page-5", { 
                yPercent: 0, 
                duration: 1.5,
                ease: "power2.inOut"
            })
            // Page 5 intro sequence - wave reveal
            .to("#classes-section", {
                opacity: 1,
                y: 0,
                skewY: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: "elastic.out(1, 0.8)"
            })
            .to(".classes-container", {
                x: 20,
                opacity: 1,
                duration: isMobile ? 1 : 1,
                ease: "power2.out"
            })
            .to(visibleCards , {
                x: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.6,
                ease: "power2.out"
            }, "-=0.8");
            if (isMobile) {
                let flipped = 0
                for (let index = 0; index < cards.length; index++) {
                if (flipped == minVisibleNumber) {
                    fullTimeline.to(".classes-container", {
                        x: -cardWidth * index,
                        ease: "power2.inOut",
                        duration: 1.5
                    });
                    flipped = 0
                    }
                    fullTimeline.to("#hover-card-" + (index + 1), {
                        rotationY: 180,
                        duration: 0.8,
                        ease: "power2.out",
                        transformOrigin: "center"
                    });

                    fullTimeline.to({}, { duration: 5 });
                    fullTimeline.to("#hover-card-" + (index + 1), {
                        rotationY: 0,
                        duration: 1,
                        ease: "power2.out",
                        transformOrigin: "center"
                    }, "+=0.5");
                    
                    flipped = flipped + 1
                }
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
                        force3D: true,
                        backfaceVisibility: "hidden"
                    })
                    .to("#hover-card-content-" + itemIndex, {
                        x: "95%",
                        ease: "power2.out",
                        duration: 0.3
                    })
                    .set("#hover-card-content-" + itemIndex, { zIndex: 1 }, "-=0.4")
                    .set("#hover-card-img-" + itemIndex, { zIndex: 2, scale: 1.05 }, "-=0.4")
                    .set("#hover-card-container-" + itemIndex, { zIndex: 3 }, "-=0.4");
                    if (index > 0) {
                        fullTimeline.set("#hover-card-content-" + index, { 
                            zIndex: 0, 
                            x: 0,
                            force3D: true,
                            backfaceVisibility: "hidden"
                        }, "-=0.3")
                        .set('#hover-card-img-' + index, { zIndex: 1, scale: 1}, "-=0.3")
                        .set("#hover-card-container-" + index, { zIndex: 0}, "-=0.3")
                    }
                    fullTimeline.to({}, { duration: 0.8 });
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
        .to(".visionMission", {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1,
            stagger: 0.4,
            ease: "back.out(1.2)"
        });
        if (!isMobile) {
            fullTimeline.to("#mission", {
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
            .to("#missionCard .card__content", {
                rotationY: 180,
                duration: 0.5,
                ease: "power2.out",
                transformOrigin: "center"
            })

            .to({}, { duration: 2 })
            .to("#missionCard .card__content", {
                rotationY: 0,
                duration: 0.5,
                ease: "power2.out",
                transformOrigin: "center"
            })
            .to("#visionCard .card__content", {
                rotationY: 180,
                duration: 0.5,
                ease: "power2.out",
                transformOrigin: "center"
            })

            .to({}, { duration: 2 })
            .to("#visionCard .card__content", {
                rotationY: 0,
                duration: 0.5,
                ease: "power2.out",
                transformOrigin: "center"
            });
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
        fullTimeline.to(".page-7", { 
            yPercent: 0, 
            duration: 1.5,
            ease: "power2.inOut"
        })
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
        .to(".page-8", { 
            yPercent: 0, 
            duration: 1.5,
            ease: "power2.inOut"
        })
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
            transformOrigin: "center center"
        }, "-=1.2")
    }

    page9Animation(fullTimeline, isMobile) {
        // Initial states are already set in the main gsap.set section   
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
        fullTimeline.to(".page-9",{
                yPercent: 0, 
                duration: 1.5,
                ease: "power2.inOut"
            })
        fullTimeline.to("#schedule, #schedule_title, #schedule_types, #schedule_heading", {
            opacity: 1,
            duration: 0.5  
        })
        .to({}, {
            duration: 0.5
        })
    }

    page10Animation(fullTimeline, isMobile) {
        // Page 10 - Events with cascade effect
        fullTimeline.to(".page-10", { 
            yPercent: 0, 
            duration: 0.8,
            ease: "power2.inOut"
        })
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
        const cardWidthVW = isMobile ? 45 : 30;
        const cardMarginPx = 16; // 2rem gap
        const vw = window.innerWidth / 100;
        const cardWidth = (cardWidthVW * vw + cardMarginPx);
        const trainers = gsap.utils.toArray(".trainer_cards");
        const visibleNumber = window.innerWidth / cardWidth;
        const minVisibleNumber = Math.floor(visibleNumber);
        const visibleCards = trainers.slice(0, Math.ceil(visibleNumber));
        
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
            trainers.forEach((card, index) => {
                if (flipped === minVisibleNumber) {
                    fullTimeline.to(".trainers-container", {
                        x: -cardWidth * index,
                        ease: "power2.inOut",
                        duration: 1.5
                    });
                    flipped = 0;
                }
                
                // Flip animation for mobile
                fullTimeline.to(`#trainer-card-${index + 1}`, {
                    rotationY: 180,
                    duration: 0.8,
                    ease: "power2.out",
                    transformOrigin: "center"
                });
                
                fullTimeline.to({}, { duration: 3 }); // Hold
                
                fullTimeline.to(`#trainer-card-${index + 1}`, {
                    rotationY: 0,
                    duration: 1,
                    ease: "power2.out",
                    transformOrigin: "center"
                }, "+=0.5");
                
                flipped++;
            });
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
        if (isMobile) {
            fullTimeline.to(".membership-table-container", { 
                xPercent: -20, 
                scale: 1, 
                duration: 1, 
                ease: "power3.out" 
            })
            .to(".membership-table-container", { 
                xPercent: -50, 
                scale: 1, 
                duration: 1, 
                ease: "power3.out" 
            })
        }
        fullTimeline.to({}, { duration: 2 }) // Hold on page 15 to view membership content
    }
    page16Animation(fullTimeline, isMobile) {
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
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.3")
            .to("#mobile-video-cardio", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.3")
            .to("#mobile-video-fitness", {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.3")
            .to("#mobile-video-yoga", {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.3")
        }
    }
    /**
     * Set initial GSAP states for all animated elements.
     * Configures starting positions, scales, and opacity values.
     * 
     * @private
     * @method gsapInitialization
     * @param {boolean} isMobile - Device type flag for responsive settings
     */
    gsapInitialization(isMobile) {
        gsap.set(".page-2, .page-12", { xPercent: -100 });
        gsap.set(".page-3, .page-11, .page-13", { xPercent: 100 });
        gsap.set(".page-4, .page-5, .page-6, .page-7, .page-8,.page-9, .page-10, .page-14, .page-15, .page-16, .page-17, .page-18", { yPercent: 100 });
        gsap.set("#schedule, #schedule_title, #schedule_types, #schedule_heading", {
            opacity: 0,
            duration: 0.5  
        })
        gsap.set(".visionMission,#events-1,#events-2", { opacity: 0 });
        gsap.set("#auraElite, #auraJunior", { xPercent: isMobile ? 0 : 120, scale: 2.5, y: isMobile ? "50vh" : "20vh", opacity: 0 });        
        gsap.set("#auraLuxury", { xPercent: 0, scale: 2.5, y: isMobile ? "50vh" : "20vh", opacity: 0 });        
        gsap.set("#auraContentText, #auraJuniorContentText, #auraLuxuryContentText, #events-3, #events-4, #events-5", {opacity: 0})
        gsap.set(".trainers-container", { x: -1000, opacity: 0 });
        // Additional initial states for enhanced animations
        gsap.set(".page-5 h1", { opacity: 1, y: 0, skewY: 0 });
        gsap.set(".page-7 button", { opacity: 0, x: -100, filter: "blur(10px)" })
        gsap.set(".page-7 h2", { opacity: 0, x: 200, rotationY: 45, transformPerspective: 1000 })
        gsap.set(".page-7 p", { opacity: 0, y: 50, scale: 0.9 })
        gsap.set(".page-7 img", { opacity: 0, scale: 1.3, filter: "brightness(0.7) contrast(1.2)" })
        gsap.set(".page-10 button, .page-10 h1", { opacity: 0, y: -200, scale: 1.5 })
        gsap.set(".page-4 button, #about-us", { opacity: 0, scale: 0.8, rotationX: -45 })
        gsap.set("#classes-section", { opacity: 0, y: -100, skewY: 10 })
        gsap.set(".visionMission", { opacity: 0, scale: 0.5, rotation: -180 })
        
        // Page 8 - Video Carousel initial states
        gsap.set(".carousel-track", { x: 0 })
        gsap.set(".video-slide", { scale: 0.7, opacity: 0.5 })
        gsap.set(".video-slide[data-index='0']", { scale: 0, opacity: 0, rotationY: 180 })
        
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
        
        // Page 14 - Professional Trainers initial states
        gsap.set("#trainers-section h1:first-child", { opacity: 0, scale: 0.7, y: -50, rotationX: -30 })
        gsap.set("#trainers-section h1:last-child", { opacity: 0, scale: 0.5, x: 100, rotation: 15 })
        gsap.set(".trainers-container", { opacity: 0, scale: 0.9, y: 80 })
        gsap.set("#schedule, #schedule_title, #schedule_types, #schedule_heading", { opacity: 0 })
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
        const fullTimeline = gsap.timeline();
        this.page1Animation(fullTimeline, isMobile);
        this.page2Animation(fullTimeline, isMobile);
        this.page3Animation(fullTimeline, isMobile);
        this.page4Animation(fullTimeline, isMobile);
        this.page5Animation(fullTimeline, isMobile);            
        this.page6Animation(fullTimeline, isMobile);
        this.page7Animation(fullTimeline, isMobile);
        this.page8Animation(fullTimeline, isMobile);            
        this.page9Animation(fullTimeline, isMobile);
        this.page10Animation(fullTimeline, isMobile);
        this.page11Animation(fullTimeline, isMobile);
        this.page12Animation(fullTimeline, isMobile);
        this.page13Animation(fullTimeline, isMobile);
        this.page14Animation(fullTimeline, isMobile);
        this.page15Animation(fullTimeline, isMobile);
        this.page16Animation(fullTimeline, isMobile);
        fullTimeline
            .to(".page-17", { yPercent: 0, duration: 1.5, ease: "power2.inOut" })
            .to(".page-18", { yPercent: 0, duration: 1.5, ease: "power2.inOut" })
        this.gsapInitialization(isMobile)
        const multiplier = isMobile ? 2200 : 1800;
        ScrollTrigger.create({
            animation: fullTimeline,
            trigger: "#page-container",
            start: "top top",
            end: () => "+=" + (fullTimeline.duration() * multiplier),
            scrub: isMobile ? 0.3 : true,
            pin: true,
            anticipatePin: 1,
        });
        this.tl = fullTimeline
    }
    
    /**
     * Initialize GSAP library, register plugins, and set up responsive media queries.
     * Entry point for the animation system configuration.
     * 
     * @public
     * @method setUpGSAP
     */
    setUpGSAP () {
        gsap.registerPlugin(ScrollTrigger);
        gsap.defaults({ease: "none", duration: 2});
        
        let mm = gsap.matchMedia();
        mm.add("(max-width: 1023px)", () => this.gsapWithMobile(true));
        mm.add("(min-width: 1024px)", () => this.gsapWithMobile(false));
        
        
        window.addEventListener('load', () => {
            ScrollTrigger.refresh();
        });
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
        const lenis = new Lenis({
            duration: isMobile ? 5 : 2.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            smoothTouch: true
        });

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

    }
    
    // Function to smoothly scroll
    raf = (time) => {
        this.lenis.raf(time);
        requestAnimationFrame(this.raf);
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
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 8;
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
            ctx.lineWidth = 3;
            ctx.stroke();
            animationOffset += 2;
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
    window.auraCenter = auraCenter
});