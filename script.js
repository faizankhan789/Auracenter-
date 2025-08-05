
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
            imageSrc: './assets/9.jpg',
            title: 'Power Yoga',
            listItems: ['Flexibility', 'Breath Control', 'Stress Relief']
        },
        {
            imageSrc: './assets/10.jpg',
            title: 'Weight Lifting',
            listItems: ['Strength Training', 'Form Guidance', 'Women Focused']
        },
        {
            imageSrc: './assets/11.jpg',
            title: 'Personal Training',
            listItems: ['1-on-1 Coaching', 'Custom Plans', 'Goal Tracking']
        },
        {
            imageSrc: './assets/12.jpg',
            title: 'Cardio & Strength',
            listItems: ['Hit Sessions', 'Fat Burn', 'Endurance']
        },
        {
            imageSrc: './assets/13.jpg',
            title: 'Strength & Recovery',
            listItems: ['Deep Stretching', 'Muscle Release', 'Injury Prevention']
        },
        {
            imageSrc: './assets/14.jpg',
            title: 'Dance Fitness',
            listItems: ['Fun workouts', 'High energy', 'Cultural vibes']
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
        card.className = 'hover-card w-[50vw] md:w-[30vw] h-[50vh] md:hover:z-[4] cursor-pointer group flex-shrink-0';

        card.innerHTML = `
            <div class="card__content relative transition-transform duration-1000 w-full h-full">    
                <img src="${imageSrc}" alt="${title}" class="card__front absolute z-[1] md:group-hover:z-[3] w-full h-full object-cover object-center ease-in-out rounded-none transition-all duration-800 md:group-hover:scale-[1.05]">                
                <div class="card__back md:group-hover:transform md:group-hover:translate-x-[85%]  md:group-hover:z-[2] h-full w-full absolute top-0 left-0 bg-[#c7b6a8] md:translate-x-0 transition-transform transition-opacity duration-600 ease-out shadow-[0_20px_40px_rgba(0,0,0,0.3)] will-change-transform will-change-opacity cursor-pointer flex flex-col justify-center items-center">
                    <h3 class="text-center text-3xl font-bold mb-3 text-black">${title}</h3>
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

        document.addEventListener('click', (e) => {
            if (!btn.contains(e.target) && !menu.contains(e.target) && menu.classList.contains('active')) {
                toggleMenu(false);
            }
        });
    }
    init() {
        this.setupMobileMenu();
        this.startClockUpdate();
        this.initECGAnimation();
        this.addClassesCard();
        this.setUpLenis();
        this.setUpGSAP();
        this.observeFadeInElementsWithScrollTrigger();

        // this.setViewportVars();
        // this.setUpResize();                    
    }
    addClassesCard() {
        this.cards.forEach(card => this.addClassCard(card));
    }
    setUpResize() {
        window.addEventListener('resize', this.setViewportVars);
    }
    gsapWithMobile(isMobile) { 
        const cardWidthVW = isMobile ? 50 : 30;
        const cardMarginPx = 16;
        const vw = window.innerWidth / 100;
        const cardWidth = (cardWidthVW * vw + cardMarginPx)
        const totalWidth = this.cards.length * cardWidth;
        const visibleNumber = window.innerWidth / cardWidth
        const cards = gsap.utils.toArray(".hover-card")
        const visibleCards = cards.slice(0, Math.ceil(visibleNumber));

        const fullTimeline = gsap.timeline();
        fullTimeline
        // Page 1 animation
        .to('#page1Img, #monitors, #learnMore', { opacity: 0, duration: 1 })
        .to('.pin-text', {
            scale: 2,
            duration: 1,
            ...(isMobile ? { yPercent: 300 } : {})
        }, 
        "-=0.5")
        // Slide in page 2 and page 3
        .to(".page-2", { xPercent: 0, duration: 1 })  // animate into view
        .to(".page-3", { xPercent: 0, duration: 1 }) // animate into view
        .to(".page-4", { yPercent: 0, duration: 1 }) // animate into view
        .to(".page-5", { yPercent: 0, duration: 1 })
        .to('#sliderIcons', { opacity: 1, duration: 1 })
        .to(".classes-container", {
            x: 10,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        })
        .to(visibleCards , {
            x: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.5,
            ease: "power2.out"
        }, "-=0.8")
        .to(".classes-container", {
            x: -totalWidth * 0.8,
            ease: "none",
            duration: this.cards.length / 2
        });
        gsap.set(".page-2", { xPercent: -100 });
        gsap.set(".page-3", { xPercent: 100 });
        gsap.set(".page-4", { yPercent: 100 });
        gsap.set(".page-5", { yPercent: 100 });
        gsap.set("#sliderIcons", {opacity: 0 });
        gsap.set(".classes-container", {x: totalWidth, opacity: 0 });
        gsap.set(visibleCards, {x: 100, opacity: 0 });
        ScrollTrigger.create({
            animation: fullTimeline,
            trigger: "#page-container",
            start: "top top",
            end: "+=5000", // enough scroll space
            scrub: true,
            pin: true,
            anticipatePin: 1,
            // markers: true
        });
        this.tl = fullTimeline
    }
    setUpGSAP () {
        gsap.registerPlugin(ScrollTrigger);
        gsap.defaults({ease: "none", duration: 2});
        
        let mm = gsap.matchMedia();
        mm.add("(max-width: 640px)", () => this.gsapWithMobile(true));
        mm.add("(min-width: 641px)", () => this.gsapWithMobile(false));
        
        
        window.addEventListener('load', () => {
            ScrollTrigger.refresh();
        });
    }

    setUpLenis() {
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smooth: true

        });

        // Update ScrollTrigger to use Lenis's scroll events
        this.lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => this.lenis.raf(time * 1000));
        requestAnimationFrame(this.raf);
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
            threshold: 0.7 // Triggers when 30% in/out of view
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
    document.getElementById("forwardIcon").addEventListener('click', () => {
        const now = window.fitnessHero.tl.time();
        window.fitnessHero.tl.tweenFromTo(now, now + 1);
    });
    document.getElementById("backIcon").addEventListener('click', () => {
        const now = window.fitnessHero.tl.time();
        window.fitnessHero.tl.tweenFromTo(now, now - 1);
    });
});