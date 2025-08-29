class ScheduleSlider {
    constructor() {
        this.container = null;
        this.prevBtn = null;
        this.nextBtn = null;
        this.currentOffset = 0;
        this.itemWidth = 0;
        this.visibleItems = 0;
        this.totalItems = 0;
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.updateSliderState();
        
        // Update on window resize
        window.addEventListener('resize', () => {
            this.calculateDimensions();
            this.updateSliderState();
        });
    }

    setupElements() {
        this.container = document.querySelector('#schedule');
        this.prevBtn = document.querySelector('#page-9-prevBtn');
        this.nextBtn = document.querySelector('#page-9-nextBtn');
        
        if (!this.container) return;

        // Make sure buttons are visible initially
        if (this.prevBtn) {
            this.prevBtn.style.display = 'flex';
        }
        if (this.nextBtn) {
            this.nextBtn.style.display = 'flex';
        }

        // Calculate initial dimensions
        this.calculateDimensions();
    }

    calculateDimensions() {
        if (!this.container) return;

        // Get the parent container (with overflow-hidden)
        const parentContainer = this.container.parentElement;
        if (!parentContainer) return;
        
        const parentRect = parentContainer.getBoundingClientRect();
        const availableWidth = parentRect.width - 32; // Account for left/right margins (mx-4)
        
        // Get all schedule day columns
        const items = this.container.querySelectorAll('.flex.flex-col.gap-1');
        this.totalItems = items.length;
        
        if (this.totalItems === 0) return;

        // Calculate item width including gaps
        const firstItem = items[0];
        if (firstItem) {
            const itemRect = firstItem.getBoundingClientRect();
            const gap = 16; // space-x-4 = 1rem = 16px
            this.itemWidth = itemRect.width + gap;
        }

        // Calculate how many items can fit in the available width (be more conservative)
        this.visibleItems = Math.floor((availableWidth - 32) / this.itemWidth); // Extra margin for button space
        
        // Ensure we don't exceed total items and have at least 1 visible
        this.visibleItems = Math.max(1, Math.min(this.visibleItems, this.totalItems));
        
        // Responsive breakpoints for better mobile experience
        const screenWidth = window.innerWidth;
        if (screenWidth < 640) { // sm breakpoint
            this.visibleItems = Math.min(1, this.visibleItems);
        } else if (screenWidth < 768) { // md breakpoint
            this.visibleItems = Math.min(2, this.visibleItems);
        } else if (screenWidth < 1024) { // lg breakpoint
            this.visibleItems = Math.min(3, this.visibleItems);
        }
        
        // Debug log
    }

    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.slidePrev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.slideNext());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.container) return;
            
            // Only handle keyboard events if the schedule is visible
            const page9 = document.getElementById('page-9');
            if (!page9 || !page9.classList.contains('active')) return;
            
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.slidePrev();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.slideNext();
            }
        });

        // Touch/swipe support
        let startX = 0;
        let isDragging = false;

        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        this.container.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            // Minimum swipe distance of 50px
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.slideNext(); // Swipe left = next
                } else {
                    this.slidePrev(); // Swipe right = previous
                }
            }
            
            isDragging = false;
        }, { passive: true });
    }

    slidePrev() {
        if (this.currentOffset > 0) {
            this.currentOffset--;
            this.updateSliderPosition();
            this.updateSliderState();
        }
    }

    slideNext() {
        // Calculate max offset to ensure last column is fully visible
        // Reduce by 2 to prevent over-scrolling
        const maxOffset = Math.max(0, this.totalItems - this.visibleItems - 2);
        if (this.currentOffset < maxOffset) {
            this.currentOffset++;
            this.updateSliderPosition();
            this.updateSliderState();
        }
    }

    updateSliderPosition() {
        if (!this.container) return;
        
        const translateX = -(this.currentOffset * this.itemWidth);
        this.container.style.transform = `translateX(${translateX}px)`;
    }

    updateSliderState() {
        if (!this.container) return;

        this.calculateDimensions();
        
        // Determine if slider buttons should be visible
        const needsSlider = this.totalItems > this.visibleItems && this.totalItems > 0;
        
        if (this.prevBtn && this.nextBtn) {
            if (needsSlider) {
                this.prevBtn.style.display = 'flex';
                this.nextBtn.style.display = 'flex';
                
                // Update button states
                const maxOffset = Math.max(0, this.totalItems - this.visibleItems - 2);
                
                // Disable/enable prev button
                if (this.currentOffset <= 0) {
                    this.prevBtn.style.opacity = '0';
                    this.prevBtn.style.pointerEvents = 'none';
                } else {
                    this.prevBtn.style.opacity = '1';
                    this.prevBtn.style.pointerEvents = 'auto';
                }
                
                // Disable/enable next button
                if (this.currentOffset >= maxOffset) {
                    this.nextBtn.style.opacity = '0';
                    this.nextBtn.style.pointerEvents = 'none';
                } else {
                    this.nextBtn.style.opacity = '1';
                    this.nextBtn.style.pointerEvents = 'auto';
                }
            } else {
                // Hide buttons if slider not needed, but only if items exist
                if (this.totalItems > 0) {
                    this.prevBtn.style.display = 'none';
                    this.nextBtn.style.display = 'none';
                    
                    // Reset position if all items fit
                    this.currentOffset = 0;
                    this.container.style.transform = 'translateX(0px)';
                } else {
                    // Keep buttons visible for debugging if no items yet
                    this.prevBtn.style.display = 'flex';
                    this.nextBtn.style.display = 'flex';
                    this.prevBtn.style.opacity = '0';
                    this.nextBtn.style.opacity = '0';
                }
            }
        }
    }

    // Public method to refresh slider when schedule is updated
    refresh() {
        this.currentOffset = 0;
        this.calculateDimensions();
        this.updateSliderPosition();
        this.updateSliderState();
    }
}