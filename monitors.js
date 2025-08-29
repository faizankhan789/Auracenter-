/**
 * Monitors.js - Clock and ECG Animation Management
 * Handles real-time displays and monitoring animations
 * 
 */
class MonitorManager {
    constructor() {
        this.animations = {
            ecg: null,
            intervals: new Map()
        };
        this.state = {
            isVisible: true
        };
        this.init();
    }

    /**
     * Initialize all monitors
     * 
     * @public
     * @method init
     */
    init() {
        this.startClockUpdate();
        this.initECGAnimation();
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
        
        this.animations.ecg = { 
            draw: drawECG, 
            resize: resizeCanvas, 
            stop: () => cancelAnimationFrame(animationId) 
        };
        
        drawECG();
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

    /**
     * Set visibility state for animations
     * 
     * @public
     * @method setVisibility
     * @param {boolean} visible - Whether monitors should be visible/active
     */
    setVisibility(visible) {
        this.state.isVisible = visible;
    }

    /**
     * Stop all monitor animations and intervals
     * 
     * @public
     * @method destroy
     */
    destroy() {
        // Stop clock interval
        const clockInterval = this.animations.intervals.get('clock');
        if (clockInterval) {
            clearInterval(clockInterval);
            this.animations.intervals.delete('clock');
        }

        // Stop ECG animation
        if (this.animations.ecg && this.animations.ecg.stop) {
            this.animations.ecg.stop();
        }

        // Clear all intervals
        this.animations.intervals.forEach((interval) => {
            clearInterval(interval);
        });
        this.animations.intervals.clear();
    }

    /**
     * Resize ECG canvas (for window resize events)
     * 
     * @public
     * @method resize
     */
    resize() {
        if (this.animations.ecg && this.animations.ecg.resize) {
            this.animations.ecg.resize();
        }
    }
}