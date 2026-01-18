/**
 * Utkarsh Paliwal Portfolio - Main JavaScript
 * Minimal, purposeful interactions
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initSmoothScroll();
        initScrollAnimations();
        initNavHighlight();
        initTerminalTyping();
        initThemeToggle();
    }

    /**
     * Smooth scroll for anchor links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                
                if (targetId === '#') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Fade in elements as they scroll into view
     */
    function initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe section headers and cards
        const animatedElements = document.querySelectorAll(
            '.section-header, .strength-card, .project-card, .work-item, .looking-item, .case-section, .outcome'
        );

        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.5s ease ${index % 6 * 0.1}s, transform 0.5s ease ${index % 6 * 0.1}s`;
            observer.observe(el);
        });

        // Add CSS for visible state
        const style = document.createElement('style');
        style.textContent = `
            .is-visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Highlight current nav section
     */
    function initNavHighlight() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

        function highlightNav() {
            const scrollPos = window.scrollY + 150;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        // Add active style
        const style = document.createElement('style');
        style.textContent = `
            .nav-links a.active:not(.nav-cta) {
                color: var(--accent-primary);
            }
        `;
        document.head.appendChild(style);

        window.addEventListener('scroll', throttle(highlightNav, 100));
        highlightNav();
    }

    /**
     * Terminal typing animation
     */
    function initTerminalTyping() {
        const typingElement = document.querySelector('.typing');
        if (!typingElement) return;

        const commands = [
            'cat skills.txt',
            'ls -la projects/',
            'git log --oneline',
            './deploy.sh',
            'tail -f /var/log/app.log'
        ];

        let currentCommand = 0;

        function typeCommand() {
            const command = commands[currentCommand];
            let charIndex = 0;
            typingElement.textContent = '';

            const typeInterval = setInterval(() => {
                if (charIndex < command.length) {
                    typingElement.textContent = command.substring(0, charIndex + 1) + '_';
                    charIndex++;
                } else {
                    clearInterval(typeInterval);
                    typingElement.textContent = command;
                    
                    // Wait, then clear and type next command
                    setTimeout(() => {
                        typingElement.textContent = '_';
                        currentCommand = (currentCommand + 1) % commands.length;
                        setTimeout(typeCommand, 1000);
                    }, 3000);
                }
            }, 100);
        }

        // Start after initial delay
        setTimeout(typeCommand, 2000);
    }

    /**
     * Theme Toggle
     */
    function initThemeToggle() {
        const toggle = document.getElementById('theme-toggle');
        const icon = toggle.querySelector('.theme-icon');
        
        // Check for saved theme preference or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        
        toggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
        
        function setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            icon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    /**
     * Throttle function for scroll events
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Add parallax effect to hero section (subtle)
     */
    function initParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
        }, 16));
    }

})();
