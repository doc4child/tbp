/**
 * Mobile Optimizations for Teddy Bear Pediatrics
 * Handles iOS/Android specific enhancements and adaptive behavior
 */

(function() {
    'use strict';

    const MobileOptimizations = {
        /**
         * Initialize all mobile optimizations
         */
        init: function() {
            this.detectDevice();
            this.setupLazyLoading();
            this.enhanceAccessibility();
            this.optimizeTouch();
            this.handleViewportChanges();
        },

        /**
         * Detect device type and apply specific fixes
         */
        detectDevice: function() {
            const ua = navigator.userAgent.toLowerCase();
            const isIOS = /iphone|ipad|ipod/.test(ua);
            const isAndroid = /android/.test(ua);
            
            if (isIOS) {
                document.documentElement.classList.add('is-ios');
                this.fixIOSIssues();
            }
            
            if (isAndroid) {
                document.documentElement.classList.add('is-android');
                this.fixAndroidIssues();
            }
        },

        /**
         * Fix iOS-specific issues
         */
        fixIOSIssues: function() {
            // Prevent double-tap zoom delay
            document.addEventListener('touchend', function(e) {
                const now = new Date().getTime();
                if (now - MobileOptimizations.lastTouchEnd <= 300) {
                    e.preventDefault();
                }
                MobileOptimizations.lastTouchEnd = now;
            }, false);

            // Fix momentum scrolling
            const scrollableElements = document.querySelectorAll('.container, .contact-info');
            scrollableElements.forEach(element => {
                element.style.WebkitOverflowScrolling = 'touch';
            });
        },

        lastTouchEnd: 0,

        /**
         * Fix Android-specific issues
         */
        fixAndroidIssues: function() {
            // Optimize touch feedback
            const buttons = document.querySelectorAll('button, .button-cls, a');
            buttons.forEach(button => {
                button.style.touchAction = 'manipulation';
            });

            // Prevent text selection issues
            if (navigator.userAgent.indexOf('Chrome') === -1) {
                document.body.style.WebkitUserSelect = 'none';
            }
        },

        /**
         * Setup lazy loading for images
         */
        setupLazyLoading: function() {
            // Check if IntersectionObserver is supported
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver(function(entries) {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.removeAttribute('data-src');
                                img.classList.add('lazy-loaded');
                            }
                            imageObserver.unobserve(img);
                        }
                    });
                }, {
                    rootMargin: '50px'
                });

                // Observe all images with data-src
                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            }
        },

        /**
         * Enhance accessibility for mobile
         */
        enhanceAccessibility: function() {
            // Ensure all interactive elements have proper focus handling
            const interactiveElements = document.querySelectorAll(
                'button, a, [role="button"], input, select, textarea'
            );

            interactiveElements.forEach(element => {
                // Ensure minimum touch target size feedback
                element.addEventListener('focus', function() {
                    this.setAttribute('data-focus', 'true');
                });

                element.addEventListener('blur', function() {
                    this.removeAttribute('data-focus');
                });
            });

            // Add keyboard navigation support
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    // Close any open menus or dialogs
                    document.activeElement?.blur();
                }
            });
        },

        /**
         * Optimize touch behavior
         */
        optimizeTouch: function() {
            // Handle touch feedback for buttons
            const buttons = document.querySelectorAll('button, .button-cls, a.button');
            
            buttons.forEach(button => {
                let touchStart = false;

                button.addEventListener('touchstart', function() {
                    touchStart = true;
                    this.classList.add('touch-active');
                }, { passive: true });

                button.addEventListener('touchend', function() {
                    this.classList.remove('touch-active');
                    touchStart = false;
                }, { passive: true });

                button.addEventListener('touchcancel', function() {
                    this.classList.remove('touch-active');
                    touchStart = false;
                }, { passive: true });
            });
        },

        /**
         * Handle viewport changes (rotation, resize)
         */
        handleViewportChanges: function() {
            let resizeTimer;
            const handleResize = () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    // Recalculate layouts if needed
                    document.documentElement.style.setProperty(
                        '--viewport-height',
                        window.innerHeight + 'px'
                    );
                }, 100);
            };

            window.addEventListener('resize', handleResize, { passive: true });
            window.addEventListener('orientationchange', handleResize, { passive: true });

            // Set initial viewport height
            document.documentElement.style.setProperty(
                '--viewport-height',
                window.innerHeight + 'px'
            );
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            MobileOptimizations.init();
        });
    } else {
        MobileOptimizations.init();
    }

    // Expose for testing
    window.MobileOptimizations = MobileOptimizations;
})();
