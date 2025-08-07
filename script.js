lucide.createIcons();
class FitnessHeroAnimations {
    constructor() {
            this.config = {
            heartRate: {
                base: 128,
                variation: 8,
                updateInterval: 1200
            }
        };
        this.tl = null
        this.cards = [
        {
            imageSrc: './assets/page_5/power_yoga.jpg',
            title: 'Power Yoga',
            listItems: ['Flexibility', 'Breath Control', 'Stress Relief'],
            index: 1
        },
        {
            imageSrc: './assets/page_5/weight_lifting.jpg',
            title: 'Weight Lifting',
            listItems: ['Strength Training', 'Form Guidance', 'Women Focused'],
            index: 2
        },
        {
            imageSrc: './assets/page_5/personal_training.jpg',
            title: 'Personal Training',
            listItems: ['1-on-1 Coaching', 'Custom Plans', 'Goal Tracking'],
            index: 3
        },
        {
            imageSrc: './assets/page_5/cardio_strength.jpg',
            title: 'Cardio & Strength',
            listItems: ['Hit Sessions', 'Fat Burn', 'Endurance'],
            index: 4
        },
        {
            imageSrc: './assets/page_5/strength_recovery.jpg',
            title: 'Strength & Recovery',
            listItems: ['Deep Stretching', 'Muscle Release', 'Injury Prevention'],
            index: 5
        },
        {
            imageSrc: './assets/page_5/dance_fitness.jpg',
            title: 'Dance Fitness',
            listItems: ['Fun workouts', 'High energy', 'Cultural vibes'],
            index: 6
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
    
    addClassCard({ imageSrc, title, listItems, index }) {
        const container = document.querySelector('.classes-container');
        if (!container) return;

        const card = document.createElement('div');
        card.className = 'hover-card classes_cards w-[45vw] lg:w-[30vw] h-[50vh] lg:hover:z-[3] cursor-pointer group flex-shrink-0';
        card.id = "hover-card-container-"+index
        card.innerHTML = `
            <div id="hover-card-${index}" class="card__content relative transition-transform duration-1000 w-full h-full">    
                <img id="hover-card-img-${index}" src="${imageSrc}" alt="${title}" class="card__front absolute z-[1] w-full h-full object-cover object-center ease-in-out rounded-none transition-all duration-800 lg:group-hover:scale-[1.05] lg:group-hover:z-[2]">                
                    <div id="hover-card-content-${index}" class="card__back h-full w-full absolute top-0 left-0 bg-[#c7b6a8] lg:translate-x-0 transition-transform transition-opacity duration-[600ms] ease-out shadow-[0_20px_40px_rgba(0,0,0,0.3)] will-change-[transform] will-change-[opacity] cursor-pointer flex flex-col justify-center items-center lg:group-hover:translate-x-[100%] lg:group-hover:z-[1]">
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
    init() {
        this.setupMobileMenu();
        this.startClockUpdate();
        this.initECGAnimation();
        this.addClassesCard();
        this.setUpGSAP();
        this.setUpLenis();
        this.observeFadeInElementsWithScrollTrigger();          
    }
    addClassesCard() {
        this.cards.forEach(card => this.addClassCard(card));
    }
    setUpResize() {
        window.addEventListener('resize', this.setViewportVars);
    }
    setUpClassesCards(fullTimeline, isMobile) {
        const cardWidthVW = isMobile ? 45 : 30;
        const cardMarginPx = 16;
        const vw = window.innerWidth / 100;
        const cardWidth = (cardWidthVW * vw + cardMarginPx)
        const totalWidth = this.cards.length * cardWidth;
        const visibleNumber = window.innerWidth / cardWidth
        const cards = gsap.utils.toArray(".classes_cards")
        const minVisibleNumber = Math.floor(visibleNumber)
        const visibleCards = cards.slice(0, Math.ceil(visibleNumber));
        // const cardContents = gsap.utils.toArray(".card__back")
        fullTimeline
            .to(".classes-container", {
                x: 10,
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
            cards.forEach((card, index) => {
                if (flipped == minVisibleNumber) {
                    // 1. Animate the classes container
                    fullTimeline.to(".classes-container", {
                        x: -cardWidth * index, // Move to the current card's position
                        ease: "power2.inOut",
                        duration: 1.5// Adjust this duration to control scroll speed
                    });
                    flipped = 0
                    }
                    // 2. Flip the current card over (rotationY: 180)
                    fullTimeline.to("#hover-card-" + (index + 1), {
                        rotationY: 180,
                        duration: 0.8, // The flip duration
                        ease: "power2.out",
                        transformOrigin: "center"
                    });

                    // 3. Add a delay (hold the flip) before flipping back
                    // This is handled by a separate tween with a duration, making the timeline longer.
                    fullTimeline.to({}, { duration: 5 }); // Adjust duration for the "hold" time

                    // 4. Flip the card back (rotationY: 0)
                    fullTimeline.to("#hover-card-" + (index + 1), {
                        rotationY: 0,
                        duration: 1, // The flip back duration
                        ease: "power2.out",
                        transformOrigin: "center"
                    }, "+=0.5"); // Add a small delay for a more natural feel
                    
                    flipped = flipped + 1
                });
            
            } else {
                let flipped = 0
                cards.forEach((card, index) => {
                if (flipped == minVisibleNumber - 1) {
                    // 1. Animate the classes container
                    fullTimeline.to(".classes-container", {
                        x: -cardWidth * index, // Move to the current card's position
                        ease: "power2.inOut",
                        duration: 1.5// Adjust this duration to control scroll speed
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
                    duration: 0.5
                })
                .set("#hover-card-content-" + itemIndex, { zIndex: 1 }, "-=0.4")
                .set("#hover-card-img-" + itemIndex, { zIndex: 2 }, "-=0.4")
                .set("#hover-card-container-" + itemIndex, { zIndex: 3 }, "-=0.4");
                if (index > 0) {
                    fullTimeline.set("#hover-card-content-" + index, { 
                        zIndex: 0, 
                        x: 0,
                        force3D: true,
                        backfaceVisibility: "hidden"
                    }, "-=0.3")
                    .set('#hover-card-img-' + index, { zIndex: 1}, "-=0.3")
                    .set("#hover-card-container-" + index, { zIndex: 0}, "-=0.3")
                }
                fullTimeline.to({}, { duration:1 });
                flipped = flipped + 1
                })
            }
            gsap.set(".classes-container", {x: totalWidth, opacity: 0 });
            gsap.set(visibleCards, {x: 100, opacity: 0 });
    }

    gsapWithMobile(isMobile) { 
        const fullTimeline = gsap.timeline();

            fullTimeline
            // Page 1 animation - slower fade out with better easing
            .to('#page1Img, #monitors, #learnMore', { 
                opacity: 0, 
                duration: 2.5,
                ease: "power2.inOut"
            })
            .to('.pin-text', {
                scale: 2,
                duration: 2.5,
                ease: "power3.inOut",
                ...(isMobile ? { y: "25vh" } : {})
            }, 
            "-=2")
            
            // Add a pause for dramatic effect
            .to({}, { duration: 0.5 })
            
            // Slide in page 2 with smoother easing and longer duration
            .to(".page-2", { 
                xPercent: 0, 
                duration: 2.5,
                ease: "power2.inOut"
            })
            
            // Hold on page 2 for better viewing
            .to({}, { duration: 1.5 })
            
            // Slide in page 3 with smooth transition
            .to(".page-3", { 
                xPercent: 0, 
                duration: 2.5,
                ease: "power2.inOut"
            })
            
            // Hold on page 3
            .to({}, { duration: 1.5 })
            
            // Page 4 - Your Strength intro animation
            .to(".page-4", { 
                yPercent: 0, 
                duration: 1.5,
                ease: "power2.inOut"
            })
            // Page 4 intro sequence - rotating elements
            .to(".page-4 button, #about-us", {
                opacity: 1,
                scale: 1,
                rotationX: 0,
                duration: 0.5,
                stagger: 0.3,
                ease: "back.out(1.7)"
            })
            .to({}, { duration: 1.5 })
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
            });

            this.setUpClassesCards(fullTimeline, isMobile);
            
            // Page 6 - Vision/Mission intro with spiral effect
            fullTimeline.to(".page-6", { 
                yPercent: 0, 
                duration: 1.5,
                ease: "power2.inOut"
            })
            .to(".visionMission", {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 1.5,
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
            .set("#missionImg", { zIndex: 2 }, "<")
            .set("#vision", { zIndex: 0, opacity: 0 }, "<")
            .set("#visionImg", { zIndex: 0 }, "<")
            .to({}, { duration: 2 })
            .to("#vision", {
                opacity: 1,
                zIndex: 1,
                ease: "power2.out",
                duration: 0.5
            })
            .set("#visionImg", { zIndex: 2 }, "<")
            .set("#mission", { zIndex: 0, opacity: 0 }, "<")
            .set("#missionImg", { zIndex: 0 }, "<");
            fullTimeline.to({}, { duration: 2 });
            }
            else {
                fullTimeline
                // Rotate mission card to 180 after 0.5s
                .to("#missionCard", {
                    rotationY: 180,
                    duration: 1,
                    ease: "power2.out",
                    transformOrigin: "center"
                })

                // Wait 3 seconds (add a dummy tween)
                .to({}, { duration: 5 })

                // Rotate mission card back to 0
                .to("#missionCard", {
                    rotationY: 0,
                    duration: 1,
                    ease: "power2.out",
                    transformOrigin: "center"
                })
                // Rotate vision card to 180
                .to("#visionCard", {
                    rotationY: 180,
                    duration: 1,
                    ease: "power2.out",
                    transformOrigin: "center"
                })

                // Wait 3 seconds
                .to({}, { duration: 5 })
                // Rotate vision card back to 0
                .to("#visionCard", {
                    rotationY: 0,
                    duration: 1,
                    ease: "power2.out",
                    transformOrigin: "center"
                });
            }
            // Page 7 - Aura Store with typewriter and slide effect
            fullTimeline.to(".page-7", { 
                yPercent: 0, 
                duration: 1.5,
                ease: "power2.inOut"
            })
            // Create typewriter effect for button
            .to(".page-7 button", {
                opacity: 1,
                x: 0,
                filter: "blur(0px)",
                duration: 1,
                ease: "power3.out"
            })
            // Slide in title with perspective effect
            .to(".page-7 h2", {
                opacity: 1,
                x: 0,
                rotationY: 0,
                duration: 1.2,
                ease: "power2.out"
            }, "-=0.5")
            // Slide in paragraph with stagger
            .to(".page-7 p", {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.6")
            // Animate the image with parallax zoom and fade
            .to(".page-7 img", {
                opacity: 1,
                scale: 1,
                filter: "brightness(1) contrast(1)",
                duration: 1.5,
                ease: "power2.out"
            }, "-=1")
            .to({}, { duration: 1 })
            
            // Page 10 - Events with cascade effect
            .to(".page-10", { 
                yPercent: 0, 
                duration: 1.5,
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
            .to({}, { duration: 2 })
            
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
            })
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
            fullTimeline.to({}, { duration: 1.5 })
            .to(".page-12", { xPercent: 0, duration: 1})
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
            fullTimeline.to({}, { duration: 1.5 })
            .to(".page-13", {xPercent: 0, duration: 1})
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
            fullTimeline.to({}, { duration: 1.5 })
            .to(".page-15", { yPercent: 0, duration: 0.5})
            
            // Page 12 Membership Animation
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

                fullTimeline.to(".membership-table-container", { 
                    xPercent: -50, 
                    scale: 1, 
                    duration: 1, 
                    ease: "power3.out" 
                })
            }

            fullTimeline.to(".page-17", {yPercent: 0, duration: 1})
            .to(".page-18", {yPercent: 0, duration: 1})


        gsap.set(".page-2, .page-12", { xPercent: -100 });
        gsap.set(".page-3, .page-11, .page-13", { xPercent: 100 });
        gsap.set(".page-4, .page-5, .page-6, .page-7, .page-10, .page-15, .page-17, .page-18", { yPercent: 100 });
        gsap.set(".visionMission,#events-1,#events-2", { opacity: 0 });
        gsap.set("#auraElite, #auraJunior", { xPercent: isMobile ? 0 : 120, scale: 2.5, y: isMobile ? "50vh" : "20vh", opacity: 0 });        
        gsap.set("#auraLuxury", { xPercent: 0, scale: 2.5, y: isMobile ? "50vh" : "20vh", opacity: 0 });        
        gsap.set("#auraContentText, #auraJuniorContentText, #auraLuxuryContentText, #events-3, #events-4, #events-5", {opacity: 0})

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

        ScrollTrigger.create({
            animation: fullTimeline,
            trigger: "#page-container",
            start: "top top",
            end: () => "+=" + (fullTimeline.duration() * (isMobile ? 2000 : 1500)), // multiplier is tweakable
            scrub: isMobile ? 0.3 : true,
            pin: true,
            anticipatePin: 1,
        });
        this.tl = fullTimeline
    }
    
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

    setUpLenis() {
        const isMobile = window.innerWidth < 1024;
        const lenis = new Lenis({
            duration: isMobile ? 3.5 : 2.2, // Slower duration for mobile
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            smoothTouch: true // ⬅️ optional, useful for mobile/touchpad
        });

        // 4. Listen for scroll events from Lenis to update ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        // 5. Ensure the browser's native scroll is disabled
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
        * Setup intersection observer for performance
        */
    observeFadeInElementsWithScrollTrigger() {
        const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
            const el = entry.target;
            const animation = el.getAttribute('data-animation-class');

            // Common from-state
            let fromVars = {
                opacity: entry.isIntersecting ? 0 : 1,
                ease: 'power3.out',
                duration: 1
            };

            if (animation === 'fade-in-up') {
                fromVars.y = 50;
            } else if (animation === 'fade-in-down') {
                fromVars.y = -50;
            } else if (animation === 'fade-in-left') {
                fromVars.x = -50;
            } else if (animation === 'fade-in-right') {
                fromVars.x = 50;
            }

            if (entry.isIntersecting) {
                // Animate into view
                gsap.to(el, {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    duration: fromVars.duration,
                    ease: fromVars.ease
                });
            } else {
                // Animate out of view
                gsap.to(el, {
                    opacity: 0,
                    x: fromVars.x || 0,
                    y: fromVars.y || 0,
                    duration: fromVars.duration,
                    ease: fromVars.ease
                });
            }
            });
        },
        {
            threshold: 0.5 // Triggers when 30% in/out of view
        }
        );

        // Attach observer to all animated elements
        document.querySelectorAll('[data-animation-class]').forEach((el) => {
            observer.observe(el);
        });

    }
    
    setViewportVars() {
        const vh = window.innerHeight;
        const vw = window.innerWidth;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        document.documentElement.style.setProperty('--vw', `${vw}px`);

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
}

document.addEventListener('DOMContentLoaded', () => {
    const fitnessHero = new FitnessHeroAnimations();
    window.fitnessHero = fitnessHero;
});