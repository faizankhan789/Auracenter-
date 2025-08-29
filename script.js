

/**
 * Main animation controller for the AuraCenter fitness website.
 * Handles GSAP-based scroll-triggered animations, video carousels, 
 * trainer/class card interactions, and responsive animations.
 * 
 * @class AuraCenterWebsite
 * @author AuraCenter Team
 * @version 1.0.0
 */
class AuraCenterWebsite {
        /**
         * Initialize the AuraCenterWebsite controller with default configurations
         * and data sets for trainers, classes, and animation states.
         * 
         * @constructor
         */
        constructor() {
            // Json data
            this.classes = [];
            this.videos = [];
            this.schedule = [];
            this.trainers = [];
            this.jsonFolder = "./assets/data/"
            
            // Lenis
            this.lenis = null;
            this.isMobile = window.innerWidth < 768;

            // Translation system
            this.currentLanguage = 'en';
            this.translations = {};

            this.multiplier = window.innerWidth < 768 ? 600 : 600; // Reduce multiplier on mobile
            // Initialize
            this.init();
        }


    /**
     * Load data from JSON file
     * 
     * @public
     * @method loadCardsData
     */
    async loadData(jsonFile, propertyName) {
        this[propertyName] = []; // Clear the target property
        try {
            const response = await fetch(`${this.jsonFolder}${jsonFile}.json`);
            if (response.ok) {
                this[propertyName] = await response.json(); // Assign to class attribute
            } else {
                console.error('Failed to load data, using fallback');
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }


        addVideo(item, index) {
        const container = document.querySelector("#page-8-slider");
        if (!container) return;

        const video = document.createElement("div");
        video.className =
            "video-slide flex-none w-screen h-screen relative flex items-center justify-center overflow-hidden";
        video.setAttribute("data-index", index);
        video.id = "video-slide-" + index;
        video.innerHTML = `
                <div class="video-wrapper w-full h-full flex items-center justify-center">
                    <video 
                        id="video-${index}" 
                        class="w-full h-full object-cover block" 
                        preload="none" 
                        poster="${item.poster}" 
                        controls
                    >
                        <source src="${item.src}" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    </div>
                `;
        container.appendChild(video);
        }

        addScheduleDay({ day, activities }, index) {
            const container = document.querySelector('#schedule');
            if (!container) return;

            const dayColumn = document.createElement('div');
            dayColumn.className = 'flex flex-col gap-1';
            
            const dayHeader = document.createElement('div');
            dayHeader.className = 'bg-[#c8e6dc] p-2 sm:p-3 rounded-lg mb-1';
            dayHeader.innerHTML = `
                <h3 class="font-bold tracking-wider text-[#2c3e50] text-center text-xs sm:text-sm lg:text-base" id="schedule-day-${index}">
                    ${day[this.currentLanguage]}
                </h3>
            `;
            
            const activitiesContainer = document.createElement('div');
            activitiesContainer.className = 'space-y-1';
            
            activities.forEach((activity, activityIndex) => {
                const activityBlock = document.createElement('div');
                const bgColor = activity.type === 'white' 
                    ? 'bg-[#F0EDEB] border border-gray-200' 
                    : 'bg-[#24203c] text-white';
                const textColor = activity.type === 'white' ? 'text-gray-600' : 'text-gray-300';
                const nameColor = activity.type === 'white' ? 'text-gray-800' : 'text-white';
                
                activityBlock.className = `flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg min-h-[3rem] sm:min-h-[3.5rem] ${bgColor} hover:-translate-y-0.5 hover:shadow-md transition-all duration-300`;
                activityBlock.innerHTML = `
                    <div class="flex-shrink-0 flex items-center justify-center">
                        <img src="${activity.icon}" 
                            alt="Activity Icon" 
                            class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 opacity-80" 
                            loading="lazy">
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="${textColor} text-xs md:text-md font-medium truncate">
                            ${activity.time}
                        </div>
                        <div class="${nameColor} text-xs md:text-md font-semibold leading-tight truncate" id="schedule-${index}-activity-${activityIndex}">
                            ${activity.name[this.currentLanguage]}
                        </div>
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
        setupNavigation() {
            // Get all navigation links and buttons
            const navLinks = document.querySelectorAll('.nav-link[data-page]');
            const navButtons = document.querySelectorAll('button[data-page]');
            const allNavElements = [...navLinks, ...navButtons];
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const mobileMenu = document.querySelector('.mobile-menu');
            const pageToOffset = {
                4: 600,
                5: 1500,
                9: 500,
                14: 1000
            }
            // Handle navigation link and button clicks
            allNavElements.forEach(element => {
                element.addEventListener('click', (e) => {
                    const pageNumber = element.getAttribute('data-page')
                    e.preventDefault();                
                    // Wait a bit for animations to be ready, then navigate
                    setTimeout(() => {
                        window.auraCenter.lenis.scrollTo("#page-" + pageNumber, {
                            offset: pageToOffset[pageNumber]
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
         * Initialize all animation components, UI elements, and event listeners.
         * This is the main entry point that sets up the entire animation system.
         * 
         * @public
         * @method init
         */
        async init() {
            this.setupNavigation();
            this.setupMobileMenu();
            this.setupLanguageToggle();
            new MonitorManager();
            await this.loadData('translations', 'translations');
            await this.loadData('classes', 'classes');
            await this.loadData('trainers', 'trainers');
            await this.loadData('schedule', 'schedule');
            await this.loadData('videos', 'videos');
            
            this.initSliders();
            this.renderVideosPage();
            this.renderSchedulePage();
            this.setUpGSAP();
            this.setUpLenis();
            this.removeLoader();
        }
        
        page1Animation(fullTimeline) {
            fullTimeline
            .to(["#page1Img", "#monitors", "#learnMore"], {
                autoAlpha: 0,
                duration: 0.5,
                ease: "power2.in",
                stagger: 0.05,
            })
            .to(
                ".pin-text",
                {
                    scale: 1.6,
                    y: window.innerWidth < 1024 ? "15vh" : 0,
                    duration: 1,
                    ease: "power3.inOut",
                },
                "<",
            );
        }
        page2Animation(fullTimeline) {
            const pageElement = ".page-2";
            // Batch set initial state with performance optimizations
            gsap.set(pageElement, {
                xPercent: -100
            });

            fullTimeline
                .to(pageElement, {
                    xPercent: 0,
                    duration: 0.8, // Faster on mobile
                    ease: "power1.out",
                })
                .to({}, {duration: 1});
        }
        page3Animation(fullTimeline) {
            const pageElement = ".page-3";
            // Batch set initial state with performance optimizations
            gsap.set(pageElement, {
                xPercent: 100
            });

            fullTimeline
            .to(pageElement, {
                xPercent: 0,
                duration: 0.8, // Faster on mobile
                ease: "power1.out",
            })
            .to({}, {duration: 1.5});
        }
        page4Animation(fullTimeline) {
            // Batch set initial state with performance optimizations
            const buttons = ".page-4 button";
            const aboutUs = "#about-us";
            const allElements = [buttons, aboutUs];
            // Desktop: Use 3D transforms for enhanced effect
            gsap.set(allElements, {
                opacity: 0,
                scale: 0.8,
                rotationX: -45,
                transformOrigin: "center center",
                willChange: "transform, opacity",
                force3D: true,
                backfaceVisibility: "hidden",
            });
            fullTimeline
            .to(allElements, {
                opacity: 1,
                scale: 1,
                rotationX: 0,
                duration: 0.5,
                stagger: 0.3,
                ease: "power2.out",
            })        
            .to({}, {duration: 1});

        }
        page5Animation(fullTimeline) {
            const pageElement = ".page-5";
            // Batch set initial state with performance optimizations
            gsap.set(pageElement, {
                yPercent: 100
            });
            fullTimeline.to(pageElement, {
                yPercent: 0,
                duration: 0.8, // Faster on mobile
                ease: "power1.out",
            });
            const container = document.querySelector(".classes-container");
            const vwUnit = window.innerWidth / 100;
            const cardWidthVw = 30; // 50vw on mobile, 30vw on desktop
            const cardWidth = (cardWidthVw * vwUnit) + 16; // convert vw to px + margin
            const containerWidth = window.innerWidth - 32;
            const visibleCards = Math.floor(containerWidth / cardWidth);

            // Pre-set initial states for better batching
            gsap.set(container, { x: containerWidth, opacity: 0 });
            gsap.set(visibleCards, { x: 100, opacity: 0 });

            fullTimeline
            .to(container, {
                x: 20,
                opacity: 1,
                duration: 1,
                ease: "power2.out",
            })
            .to(
                visibleCards,
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.5,
                    ease: "power2.out",
                },
                "-=0.8",
            )
            .to(container, {
                x: -(this.classes.length - visibleCards) * cardWidth,
                duration: 1.5,
                ease: "power3.inOut",
            });
        }
        page6Animation(fullTimeline) {
            const pageElement = ".page-6";
            const visionMission = '.visionMission';
            gsap.set(pageElement, {
                yPercent: 100,
            });
            
            gsap.set(visionMission, {
                opacity: 0,
                scale: 0.5,
                rotation: -180,
            });

            fullTimeline.to(pageElement, {
                yPercent: 0,
                duration: 0.8,
                ease: "power2.inOut",
            })            
            .to(visionMission, {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.8,
                stagger: 0.4,
                ease: "power2.inOut",
            }, "-=0.4")
            .to("#mission", {
                opacity: 1,
                zIndex: 1,
                ease: "power2.out",
                duration: 0.5,
            })
            .set("#missionImg, #missionCard", { zIndex: 2 }, "<")
            .set("#vision", { zIndex: 0, opacity: 0 }, "<")
            .set("#visionImg, #visionCard", { zIndex: 0 }, "<")
            .to({}, { duration: 0.8 })
            .to("#vision", {
                opacity: 1,
                zIndex: 1,
                ease: "power2.out",
                duration: 0.5,
            })
            .set("#visionImg, #visionCard", { zIndex: 2 }, "<")
            .set("#mission", { zIndex: 0, opacity: 0 }, "<")
            .set("#missionImg, #missionCard", { zIndex: 0 }, "<");
        }
        page7Animation(fullTimeline) {
            const elements = {
                page: ".page-7",
                button: ".page-7 button",
                heading: ".page-7 h2",
                paragraph: ".page-7 p",
                image: ".page-7 img"
            };
            // Initial states
            gsap.set(elements.page, { yPercent: 100 })
                gsap.set(elements.button, { opacity: 0, x: -100, filter: "blur(10px)" })
                gsap.set(elements.heading, { opacity: 0, x: 200, rotationY: 45, transformPerspective: 1000 })
                gsap.set(elements.paragraph, { opacity: 0, y: 50, scale: 0.9 })
                gsap.set(elements.image, { opacity: 0, scale: 1.3, filter: "brightness(0.7) contrast(1.2)" });
                            // Animation sequence
            fullTimeline
                .to(elements.page, {
                    yPercent: 0,
                    duration: 0.8,
                    ease: "power1.out",
                })
                .to(elements.button, {
                    opacity: 1,
                    x: 0,
                    filter: "blur(0px)",
                    duration: 0.5,
                    ease: "power2.out"
                })
                .to(elements.heading, {
                    opacity: 1,
                    x: 0,
                    rotationY: 0,
                    duration: 0.5,
                    ease: "power2.out"
                })
                .to(elements.paragraph, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out"
                })
                .to(elements.image, {
                    opacity: 1,
                    scale: 1,
                    filter: "brightness(1) contrast(1)",
                    duration: 0.5,
                    ease: "power2.out"
                })
                .to({}, { duration: 0.5 });
        }

        page8Animation(fullTimeline) {
            const pageElement = ".page-8";
            gsap.set(pageElement, { yPercent: 100 });
            fullTimeline.to(pageElement, {
                yPercent: 0,
                duration: 0.8,
                ease: "power1.out",
            })
            .fromTo(
                ".video-slide[data-index='0']",
                {
                    scale: 0,
                    opacity: 0,
                    rotationY: 180,
                },
                {
                    scale: 1,
                    opacity: 1,
                    rotationY: 0,
                    duration: 0.8,
                    ease: "back.out(1.2)",
                    transformOrigin: "center",
                }, "<");
            let currentX = 0;
            for (let index = 1; index < this.videos.length; index++) {
                // Animate to next video (slower)
                fullTimeline
                .fromTo(
                    ".carousel-track",
                    {
                    x: currentX + "vw",
                    },
                    {
                    x: `-${index * 100}vw`,
                    duration: 0.8,
                    ease: "power2.inOut",
                    },
                )
                .fromTo(
                    `.video-slide[data-index='${index - 1}']`,
                    {
                    scale: 1,
                    opacity: 1,
                    },
                    {
                    scale: 0.7,
                    opacity: 0.5,
                    duration: 0.8,
                    ease: "power2.inOut",
                    },
                    "-=0.8",
                )
                .fromTo(
                    `.video-slide[data-index='${index}']`,
                    {
                    scale: 0,
                    },
                    {
                    scale: 1,
                    opacity: 1,
                    duration: 0.5,
                    ease: "power2.inOut",
                    },
                    "-=0.8",
                );
                currentX = -index * 100;
            }
        }

        page9Animation(fullTimeline) {
            const elements = "#scheduleContainer, #schedule_title, #schedule_types, #schedule_heading";
            // Single batch operation
            gsap.set(elements, {
                opacity: 0,
                y: 20,
            });
            fullTimeline
            .to(elements, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: "power1.out",
            })
            .to({}, {duration: 0.8});
        }

        page10Animation(fullTimeline) {
            // Page 10 - Events with cascade effect
            gsap.set(".page-10", {yPercent: 100});
            fullTimeline
            .to(".page-10", {
                yPercent: 0,
                duration: 0.5,
                ease: "power1.out"
            })
            .to(".page-10 button", {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                ease: "elastic.out(1, 0.6)"
            })
            .to(".page-10 h1", {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                ease: "elastic.out(1, 0.6)"
            });
            fullTimeline
                .to("#events-1,#events-2", { opacity: 1, duration: 0.5 })
                .to("#event-1, #event-6", { y: "-27vh", duration: 0.5 })
                .to("#event-2, #event-7", { y: "-30vh", x: "17vw", duration: 0.5 }, "<")
                .to("#event-3, #event-8", { y: "-3vh", x: "17vw", duration: 0.5 }, "<")
            
            fullTimeline.to({}, { duration: 0.5 })
        }
        
        page14Animation(fullTimeline) {
            // Batch set initial state with performance optimizations
            const container = document.querySelector(".trainers-container");
            const vwUnit = window.innerWidth / 100;
            const cardWidthVw = 30; // 50vw on mobile, 30vw on desktop
            const cardWidth = (cardWidthVw * vwUnit) + 16; // convert vw to px + margin
            const containerWidth = window.innerWidth - 32;
            const visibleCards = Math.floor(containerWidth / cardWidth);

            // Initial states
            gsap.set(container, { x: -1000, opacity: 0 });
            gsap.set("#trainers-section h1:first-child", {
                opacity: 0,
                scale: 0.5,
                y: -50,
                rotationX: -45,
            });
            gsap.set("#trainers-section h1:last-child", {
                opacity: 0,
                scale: 0.5,
                x: -100,
                rotation: -15,
            });

            // Headings animation
            fullTimeline
                .to(
                "#trainers-section h1:first-child",
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 1.2,
                    ease: "power3.out",
                },
                "-=0.5",
                )
                .to(
                "#trainers-section h1:last-child",
                {
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    rotation: 0,
                    duration: 0.8,
                    ease: "back.out(1.5)",
                },
                "-=0.8",
                )
                .to(container, {
                    x: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: "power2.out",
                })
                .from(visibleCards,{
                    y: 50,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.15,
                    ease: "back.out(1.7)",
                }, "-=0.3")
                .to(container, {
                    x: -(this.trainers.length - visibleCards) * cardWidth,
                    duration: 1.5,
                    ease: "power3.inOut",
                });
        }

        page15Animation(fullTimeline) {
            // Mobile-optimized configuration
            const config = {
                duration: 0.5,
                stagger: 0.2,
                maxScale: 3, // Reduced scaling on mobile
                ease: {
                    intro: "back.out(1.7)",
                    power: "power3.out",
                    exit: "power2.in",
                },
            };

            // Element groups for better organization
            const elements = {
                intro: "#membership-intro",
                introElements: ["#plan-button", "#title-container", "#subtitle"],
                table: "#membership-table-wrapper",
                cards: ".membership-plan-card",
                page: ".page-15"
            };
            gsap.set(elements.page, { yPercent: 100 });
            gsap.set(elements.intro, { opacity: 0 });
            gsap.set(elements.introElements, { scale: 0, opacity: 0 });
            gsap.set(elements.table, { opacity: 0, scale: 0.8 });

            // Desktop: Full dramatic effect
            fullTimeline
                .to(elements.page, {yPercent: 0, duration: 0.8, ease: "power1.out"})
                .to(elements.intro, { opacity: 1, duration: 0.1 })
                .to("#plan-button", {
                    scale: 1,
                    opacity: 1,
                    duration: config.duration,
                    ease: config.ease.intro,
                })
                .to(
                    "#title-container",
                    {
                    scale: 1,
                    opacity: 1,
                    duration: config.duration * 1.5,
                    ease: config.ease.power,
                    },
                    "-=0.3",
                )
                .to(
                    "#subtitle",
                    {
                        scale: 1,
                        opacity: 1,
                        duration: config.duration,
                        ease: "power2.out",
                    },
                    "-=0.4",
                )
                .to({}, { duration: 0.8 })
                .to(elements.introElements, {
                    scale: [3, 2.5, 2], // Array for different scales
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.05,
                    ease: config.ease.exit,
                })
                .set(elements.intro, { display: "none" })
                .to(elements.table, {
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: config.ease.power,
                })
                .from(
                    elements.cards,
                    {
                    scale: 0.8,
                    opacity: 0,
                    duration: config.duration,
                    stagger: config.stagger,
                    ease: config.ease.intro,
                    },
                    "-=0.5",
                )
                .to({}, { duration: 0.8 });
        }

        page16Animation(fullTimeline) {
    // Helper: apply initial states to multiple elements
    const setInitialStates = (elements, props) => elements.forEach(el => gsap.set(el, props));

    // Initial states configuration
    const initialStates = [
        { els: ["#page16-heading"], props: { opacity: 0, y: 50 } },
        { els: ["#page16-tagline"], props: { opacity: 0, x: 50 } },
        { els: ["#page16-bg-img"], props: { opacity: 0, y: 50 } },
        { els: ["#page16-guest-1"], props: { opacity: 0, x: -50 } },
        { els: ["#page16-guest-2"], props: { opacity: 0, y: 50 } },
        { els: ["#page16-guest-3"], props: { opacity: 0, x: 50 } },
        { els: ["#page16-guest-4"], props: { opacity: 0, y: -50 } },
        { els: ["#page16-img-31"], props: { opacity: 0, x: -50 } },
        { els: ["#page16-img-32"], props: { opacity: 0, x: 50 } },
        { els: ["#page16-youtube-btn"], props: { opacity: 0, y: 50 } },
        { els: ["#page16-right-section"], props: { opacity: 0, visibility: "hidden" } },
        { els: ["#page16-guest-1-text", "#page16-guest-2-text", "#page16-guest-3-text", "#page16-guest-4-text"], props: { opacity: 0, y: 20 } },
        { els: ["#page16-episode-1", "#page16-episode-2", "#page16-episode-3", "#page16-show-more-btn"], props: { opacity: 0, y: 30 } },
        { els: ["#page16-video-section"], props: { opacity: 0, scale: 0 } },
        { els: ["#video-grid-classes"], props: { opacity: 0, y: 50 } },
        { els: ["#video-grid-fitness"], props: { opacity: 0, x: -50 } },
        { els: ["#video-grid-dance"], props: { opacity: 0, y: 30 } },
        { els: ["#video-grid-cardio"], props: { opacity: 0, y: -30 } },
        { els: ["#video-grid-yoga"], props: { opacity: 0, x: 50 } },
        { els: ["#mobile-video-classes"], props: { opacity: 0, y: 50 } },
        { els: ["#mobile-video-fitness"], props: { opacity: 0, x: -50 } },
        { els: ["#mobile-video-yoga"], props: { opacity: 0, x: 50 } },
        { els: ["#mobile-video-dance"], props: { opacity: 0, y: 30 } },
        { els: ["#mobile-video-cardio"], props: { opacity: 0, y: -30 } },
        { els: ["#page16-mobile-right-section"], props: { opacity: 0 } },
        { els: ["#page16-mobile-episode-1", "#page16-mobile-episode-2", "#page16-mobile-episode-3", "#page16-mobile-show-more-btn"], props: { opacity: 0, y: 30 } }
    ];

    initialStates.forEach(({ els, props }) => setInitialStates(els, props));

    // Timeline animations
    fullTimeline
        .to("#page16-heading", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .to("#page16-tagline", { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, "-=0.3")
        .to("#page16-bg-img", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.2")
        .to(["#page16-guest-1", "#page16-guest-2", "#page16-guest-3", "#page16-guest-4"], {
            opacity: 1, x: 0, y: 0, duration: 0.6, stagger: 0.3, ease: "power2.out"
        }, "-=0.2")
        .to(["#page16-guest-1-text", "#page16-guest-2-text", "#page16-guest-3-text", "#page16-guest-4-text"], {
            opacity: 1, y: 0, duration: 0.5, stagger: 0.2, ease: "power2.out"
        }, "-=0.1")
        .to(["#page16-img-31", "#page16-img-32"], { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", stagger: 0.2 }, "-=0.2")
        .to("#page16-youtube-btn", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.2")
        .to("#page16-right-section", { opacity: 1, visibility: "visible", duration: 0.8, ease: "power2.out" }, "-=0.1")
        .to(["#page16-episode-1", "#page16-episode-2", "#page16-episode-3", "#page16-show-more-btn"], {
            opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: "power2.out"
        }, "-=0.3")
        .to({}, { duration: 1 }) // Hold to view sections
        .to("#page16-podcast-container", { scale: 2, opacity: 0, duration: 0.8, ease: "power2.in" })
        .set("#page16-podcast-container", { display: "none" })
        .to("#page16-video-section", {
            opacity: 1, scale: 1, duration: 1, ease: "power3.out",
            onStart: () => console.log("Video section replacing podcast content"),
            onComplete: () => console.log("Video section replacement complete")
        })
        .to(["#video-grid-classes", "#video-grid-dance", "#video-grid-cardio", "#video-grid-fitness", "#video-grid-yoga"], {
            opacity: 1, x: 0, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out"
        }, "-=0.5");
}


        page17Animation(fullTimeline) {
            const pageElement = ".page-17";
            // Batch set initial state with performance optimizations
            gsap.set(pageElement, {
                yPercent: 100
            });
            fullTimeline.to(pageElement, {
                yPercent: 0,
                duration: 0.8, // Faster on mobile
                ease: "power1.out",
            })
        }
        pageSection1Timeline() {
            const timeline = gsap.timeline();

            // Animations
            this.page1Animation(timeline);
            this.page2Animation(timeline);
            this.page3Animation(timeline);

            ScrollTrigger.create({
                animation: timeline,
                trigger: "#page-section-1",
                start: "top top",
                end: () => "+=" + timeline.duration() * this.multiplier,
                scrub: true,
                pin: true,
                anticipatePin: 1,
                refreshPriority: -1,
            });
        }

        pageSection2Timeline() {
            const timeline = gsap.timeline();
            // Animations
            this.page4Animation(timeline);
            this.page5Animation(timeline);
            this.page6Animation(timeline);
            this.page7Animation(timeline);
            this.page8Animation(timeline);
            ScrollTrigger.create({
                animation: timeline,
                trigger: "#page-section-2",
                start: "top top",
                end: () => "+=" + timeline.duration() * this.multiplier,
                scrub: true,
                pin: true,
                anticipatePin: 1,
                refreshPriority: -2,
            });
        }
       
        pageSection3Timeline() {
            const timeline = gsap.timeline();
            // Animations
            this.page9Animation(timeline);
            this.page10Animation(timeline);
            ScrollTrigger.create({
                animation: timeline,
                trigger: "#page-section-3",
                start: "top top",
                end: () => "+=" + timeline.duration() * this.multiplier,
                scrub: true,
                pin: true,
                anticipatePin: 1,
                refreshPriority: -3,
            });
        }
        pageSection4Timeline() {
            const timeline = gsap.timeline();
            // Animations
            this.page14Animation(timeline);
            this.page15Animation(timeline);
            ScrollTrigger.create({
                animation: timeline,
                trigger: "#page-section-4",
                start: "top top",
                end: () => "+=" + timeline.duration() * this.multiplier,
                scrub: true,
                pin: true,
                anticipatePin: 1,
                refreshPriority: -4,
            });
        }
        pageSection5Timeline() {
            const timeline = gsap.timeline();
            // Animations
            this.page16Animation(timeline);
            this.page17Animation(timeline);
            ScrollTrigger.create({
                animation: timeline,
                trigger: "#page-section-5",
                start: "top top",
                end: () => "+=" + timeline.duration() * this.multiplier,
                scrub: true,
                pin: true,
                anticipatePin: 1,
                refreshPriority: -5,
            });
        }

        gsapDesktop() {
            this.pageSection1Timeline();
            this.pageSection2Timeline();
            this.pageSection3Timeline();
            this.pageSection4Timeline();
            this.pageSection5Timeline();
        }
        gsapWithMobile() {
            const timeline = gsap.timeline({
                repeat: -1,        // Infinite loop
                repeatDelay: 1,    // Optional delay between loops
                paused: true       // Start paused, controlled by observer
            });

            timeline
                .to("#events-1", { opacity: 1, duration: 0.5 })
                .to("#event-1", { y: "-27vh", duration: 0.5 })
                .to("#event-2", { y: "-30vh", x: "27vw", duration: 0.5 }, "<")
                .to("#event-3", { y: "-3vh", x: "27vw", duration: 0.5 }, "<")
                .to({}, { duration: 2 })
                .to("#events-1", { opacity: 0, duration: 0.5 })
                .to("#events-2", { opacity: 1, duration: 0.5 }, "<")
                .to("#event-6", { y: "-27vh", duration: 0.5 })
                .to("#event-7", { y: "-30vh", x: "27vw", duration: 0.5 }, "<")
                .to("#event-8", { y: "-3vh", x: "27vw", duration: 0.5 }, "<");

            const target = document.querySelector("#page-10");
            if (target) {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                timeline.play(); // Start or resume
                            } else {
                                timeline.pause(); // Pause when out of view
                            }
                        });
                    },
                    { threshold: 0.3 } // Play when 30% of the section is visible
                );
                observer.observe(target);
            }
        }

        setUpGSAP() {
            gsap.registerPlugin(ScrollTrigger);
            let mm = gsap.matchMedia();
            mm.add("(min-width: 768px)", () => this.gsapDesktop());
            mm.add("(max-width: 767px)", () => this.gsapWithMobile());
        }

        setUpLenis() {
            this.lenis = new Lenis({
                duration: this.isMobile ? 1.8 : 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothTouch: this.isMobile,
                wheelMultiplier: this.isMobile ? 0.6 : 1.2,
                touchMultiplier: this.isMobile ? 0.6 : 1.2,
                lerp: this.isMobile ? 0.12 : 0.08,
            });

            // RAF loop - Essential for Lenis to work
            const raf = (time) => {
                this.lenis.raf(time);
                requestAnimationFrame(raf);
            };
            requestAnimationFrame(raf);

            // Simple resize handling
            window.addEventListener("resize", () => {
                this.lenis.resize();
            }, { passive: true });

            // Cleanup
            this.cleanupLenis = () => {
                this.lenis.destroy();
            };

            window.addEventListener("beforeunload", this.cleanupLenis);
        }
        removeLoader() {
            document.body.classList.remove('bodyLoading');
            document.getElementById('loader-parent')?.remove();
            document.getElementById('page-container')?.classList.remove('hidden');
            document.getElementById('header')?.classList.remove('hidden');
            document.querySelector('footer')?.classList.remove('hidden');
        }

        /**
         * Initialize all sliders for the website
         * 
         * @public
         * @method initSliders
         */
        initSliders() {
            // Initialize classes slider for page-5
            this.classesSlider = new CardSlider('classes', this.classes);
            
            // Initialize trainers slider for page-14
            this.trainersSlider =  new CardSlider('trainers', this.trainers);

            // Initialize video slider for page-16
            new VideoSlider('episodes', 5);
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
                button.textContent = this.currentLanguage === 'en' ? 'English': 'عربي';
            }
            
            this.translateContent();
        }

        /**
         * Translate all content on the page
         */
        translateContent() {            
            // Only change language attribute, keep layout the same
            document.documentElement.lang = this.currentLanguage;
            
            // Translate elements with data-translate attributes
            const translatableElements = document.querySelectorAll('[data-translate]');
            translatableElements.forEach(element => {
                const key = element.getAttribute('data-translate');
                const hasPlaceholder = element.getAttribute('placeholder')
                if (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key]) {
                    if (hasPlaceholder) {
                        element.placeholder = this.translations[this.currentLanguage][key];
                    } else{
                        element.innerHTML = this.translations[this.currentLanguage][key];                    
                    }
                }
            });

            this.classesSlider.translateDynamicContent(this.currentLanguage);
            this.trainersSlider.translateDynamicContent(this.currentLanguage);
            this.translateSchedule();
        }

        translateSchedule() {
            this.schedule.forEach((item, index) => {
                const day = item.day;
                const activities = item.activities;
                const dayElement = document.getElementById(`schedule-day-${index}`);
                if (dayElement) {
                    dayElement.textContent = day[this.currentLanguage];
                }
                activities.forEach((activity, activityIndex) => {
                    const activityName = document.getElementById(`schedule-${index}-activity-${activityIndex}`);
                    if (activityName) {
                        activityName.textContent = activity.name[this.currentLanguage];
                    }
                });
            });
        }
        renderSchedulePage() {
            const container = document.querySelector('#schedule');
            if (!container) return;
            
            container.innerHTML = '';
            this.schedule.forEach((day, index) => this.addScheduleDay(day, index));
        
            // Refresh slider after rendering schedule
            setTimeout(() => {
                this.scheduleSlider = new ScheduleSlider();
            }, 100);
        }
        renderVideosPage() {
            this.videos.forEach(video => this.addVideo(video));
        }
    }
/**
 * Initialize the FitnessHeroAnimations when DOM is ready.
 * Creates global instance for debugging and external access.
 * 
 * @event DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    const auraCenter = new AuraCenterWebsite();
    window.auraCenter = auraCenter;
});