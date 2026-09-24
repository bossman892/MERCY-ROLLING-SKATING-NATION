// main.js - Complete JavaScript for Mercy Roll Nation Website

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // =============================================
    // 0. DEVICE DETECTION & INITIALIZATION
    // =============================================
    const isTouchDevice = () => {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    };

    const isTablet = () => {
        return /iPad|Android(?!.*Mobi)|tablet/i.test(navigator.userAgent);
    };

    const isMobile = () => {
        return /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    // Add device classes to body
    if (isTouchDevice()) document.body.classList.add('touch-device');
    if (isTablet()) document.body.classList.add('tablet-device');
    if (isMobile()) document.body.classList.add('mobile-device');

    // Prevent zoom on double-tap for touch devices
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // =============================================
    // 1. MOBILE MENU TOGGLE
    // =============================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('flex');
            mobileMenuBtn.innerHTML = '<span class="material-symbols-outlined text-3xl">close</span>';
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
            mobileMenuBtn.innerHTML = '<span class="material-symbols-outlined text-3xl">menu</span>';
            document.body.style.overflow = '';
        }
    }

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) toggleMenu();
            });
        });
    }

    // =============================================
    // 2. BOOKING FORM SUBMISSION
    // =============================================
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullNameInput = document.getElementById('bookingFullName');
            const programInput = document.getElementById('bookingProgram');
            const dateInput = document.getElementById('bookingDate');
            const timeInput = document.getElementById('bookingTime');

            if (!fullNameInput || !programInput || !dateInput || !timeInput) {
                alert('The booking form is unavailable. Please refresh and try again.');
                return;
            }

            const fullName = fullNameInput.value.trim();
            const program = programInput.value;
            const date = dateInput.value;
            const time = timeInput.value;
            
            // Validation
            if (!fullName || !program || !date || !time) {
                alert('Please fill out all required fields.');
                return;
            }

            // Build WhatsApp message
            const message = `Hello Mercy Roll Nation, I would like to book a session. Name: ${fullName}, Program: ${program}, Date: ${date}, Time: ${time}`;
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/254703169974?text=${encodedMessage}`;
            
            window.open(whatsappUrl, '_blank');
        });
    }

    // =============================================
    // 3. SET MIN DATE FOR BOOKING
    // =============================================
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const now = new Date();
        const localMonth = String(now.getMonth() + 1).padStart(2, '0');
        const localDay = String(now.getDate()).padStart(2, '0');
        const today = `${now.getFullYear()}-${localMonth}-${localDay}`;
        dateInput.setAttribute('min', today);

        dateInput.addEventListener('click', () => {
            if (typeof dateInput.showPicker === 'function') {
                dateInput.showPicker();
            }
        });
    }

    // =============================================
    // 4. SMOOTH SCROLLING FOR ANCHOR LINKS
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =============================================
    // 5. ACTIVE NAVIGATION STATE
    // =============================================
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    // Get current page filename
    let currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    // Handle query strings or hash
    if (currentPath.includes('?')) {
        currentPath = currentPath.split('?')[0];
    }
    if (currentPath.includes('#')) {
        currentPath = currentPath.split('#')[0];
    }

    // If no extension, assume .html
    if (!currentPath.includes('.html') && currentPath !== '') {
        currentPath = currentPath + '.html';
    }

    console.log('📍 Current page:', currentPath);

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        let cleanHref = href.split('?')[0].split('#')[0];
        
        let isActive = false;
        
        // Exact match
        if (cleanHref === currentPath) {
            isActive = true;
        }
        // If current is index.html and link is '#'
        else if (currentPath === 'index.html' && href === '#') {
            isActive = true;
        }
        // If current is index.html and link is 'index.html'
        else if (currentPath === 'index.html' && cleanHref === 'index.html') {
            isActive = true;
        }
        // If no extension in href, add .html for comparison
        else if (!cleanHref.includes('.html') && cleanHref !== '#' && cleanHref !== '') {
            const hrefWithExt = cleanHref + '.html';
            if (hrefWithExt === currentPath) {
                isActive = true;
            }
        }
        
        // Apply active state
        if (isActive) {
            link.classList.remove('text-on-surface-variant');
            link.classList.add('text-primary-container');
        } else {
            link.classList.remove('text-primary-container');
            link.classList.add('text-on-surface-variant');
        }
    });

    // =============================================
    // 6. SCROLL-TRIGGERED ENTRANCE ANIMATIONS
    // =============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(section => {
        // Check if section is already visible
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            section.classList.add('is-visible');
        } else {
            sectionObserver.observe(section);
        }
    });

    // =============================================
    // 7. HEADER SCROLL EFFECT
    // =============================================
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            header.classList.add('shadow-lg');
            header.classList.remove('shadow-none');
        } else {
            header.classList.remove('shadow-lg');
            header.classList.add('shadow-none');
        }
        
        lastScrollY = currentScrollY;
    });

    // =============================================
    // 8. CART COUNTER (Demo)
    // =============================================
    const cartCounter = document.querySelector('.group .absolute');
    if (cartCounter) {
        // Load cart count from localStorage
        const savedCount = localStorage.getItem('cartCount');
        if (savedCount !== null) {
            cartCounter.textContent = savedCount;
        }
        
        // Click cart icon to increment
        const cartIcon = document.querySelector('.group .material-symbols-outlined');
        if (cartIcon) {
            cartIcon.parentElement.addEventListener('click', function(e) {
                e.preventDefault();
                let count = parseInt(cartCounter.textContent) || 0;
                count += 1;
                cartCounter.textContent = count;
                localStorage.setItem('cartCount', count.toString());
                
                // Visual feedback
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
            });
        }
    }

    // =============================================
    // 9. SEARCH FUNCTIONALITY (Demo)
    // =============================================
    const searchIcon = document.querySelector('.material-symbols-outlined.text-on-surface.cursor-pointer');
    if (searchIcon) {
        // Skip cart icon by checking parent
        if (!searchIcon.closest('.group')) {
            searchIcon.addEventListener('click', function() {
                const searchQuery = prompt('Search Mercy Roll Nation:');
                if (searchQuery && searchQuery.trim() !== '') {
                    alert(`Searching for: "${searchQuery.trim()}"`);
                }
            });
        }
    }

    // =============================================
    // 10. SOCIAL MEDIA SHARE (Demo)
    // =============================================
    const socialIcons = document.querySelectorAll('.flex.gap-4 .material-symbols-outlined');
    socialIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const iconType = this.textContent;
            let url = '';
            switch(iconType) {
                case 'share':
                    url = 'https://www.instagram.com/mercyrollnation';
                    break;
                case 'group':
                    url = 'https://www.facebook.com/mercyrollnation';
                    break;
                case 'mail':
                    url = 'mailto:mercyrollnation@gmail.com';
                    break;
                default:
                    return;
            }
            if (url) {
                window.open(url, '_blank');
            }
        });
    });

    // =============================================
    // 11. SERVICE CARD HOVER EFFECTS
    // =============================================
    const serviceCards = document.querySelectorAll('.bg-surface-container.border-l-4');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.transition = 'transform 0.3s ease';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // =============================================
    // 12. KEYBOARD ACCESSIBILITY
    // =============================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMenu();
        }
    });

    // =============================================
    // 13. CONSOLE LOG (Branding)
    // =============================================
    console.log('%c 🛼 Mercy Roll Nation ', 'background: #e61e2a; color: #ffffff; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 4px;');
    console.log('%c Rolling Skills, Building Confidence. ', 'color: #e7bdb9; font-size: 14px;');
    console.log('%c Join the movement! ', 'color: #acc7ff; font-size: 12px;');
    console.log('✅ main.js loaded successfully!');
    console.log(`📍 Current page: ${currentPath}`);

    // =============================================
    // 14. PERFORMANCE: DEBOUNCE SCROLL EVENTS
    // =============================================
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                ticking = false;
            });
            ticking = true;
        }
    });

    // =============================================
    // 15. DYNAMIC PAGE TITLE UPDATE
    // =============================================
    const pageTitles = {
        'index.html': 'Mercy Roll Nation - Home',
        'about.html': 'Mercy Roll Nation - About Us',
        'gallery.html': 'Mercy Roll Nation - Gallery',
        'shop.html': 'Mercy Roll Nation - Shop',
        'contact.html': 'Mercy Roll Nation - Contact'
    };
    
    if (pageTitles[currentPath]) {
        document.title = pageTitles[currentPath];
    }

    // =============================================
    // 16. FORM INPUT VALIDATION FEEDBACK
    // =============================================
    const formInputs = document.querySelectorAll('#bookingForm input, #bookingForm select');
    formInputs.forEach(input => {
        input.addEventListener('invalid', function(e) {
            this.classList.add('border-error');
            this.classList.remove('border-outline-variant');
        });
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.remove('border-error');
                this.classList.add('border-outline-variant');
            }
        });
    });

}); // End DOMContentLoaded