/**
 * Trafexia Landing Page - Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initSmoothScroll();
    initTrafficAnimation();
    fetchGitHubStars();
});

/**
 * Fetch GitHub stars count
 */
async function fetchGitHubStars() {
    const navStarsCount = document.getElementById('navStarsCount');
    const heroStarsCount = document.getElementById('heroStarsCount');
    
    try {
        const response = await fetch('https://api.github.com/repos/danieldev23/trafexia', {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const stars = data.stargazers_count || 0;
            const formattedStars = formatNumber(stars);
            
            if (navStarsCount) navStarsCount.textContent = formattedStars;
            if (heroStarsCount) heroStarsCount.textContent = formattedStars;
        } else {
            // Fallback to 0 if API fails
            if (navStarsCount) navStarsCount.textContent = '0';
            if (heroStarsCount) heroStarsCount.textContent = '0';
        }
    } catch (error) {
        console.log('Could not fetch GitHub stars:', error);
        // Fallback to 0 if fetch fails
        if (navStarsCount) navStarsCount.textContent = '0';
        if (heroStarsCount) heroStarsCount.textContent = '0';
    }
}

/**
 * Format number for display (e.g., 1234 -> 1.2k)
 */
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
}

/**
 * Navigation functionality
 */
function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    // Scroll effect for navigation
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class
        if (currentScrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    });

    // Mobile menu toggle
    navToggle?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Toggle icon
        const icon = navToggle.querySelector('svg');
        if (navLinks.classList.contains('active')) {
            icon.setAttribute('data-lucide', 'x');
        } else {
            icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
    });

    // Close mobile menu when clicking on links
    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = navToggle?.querySelector('svg');
            if (icon) {
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        });
    });
}

/**
 * Scroll animations using Intersection Observer
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered delay based on element index
                const siblings = Array.from(entry.target.parentElement?.children || []);
                const index = siblings.filter(el => el.classList.contains('animate-on-scroll'))
                    .indexOf(entry.target);
                
                entry.target.style.transitionDelay = `${index * 0.08}s`;
                entry.target.classList.add('visible');
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const navHeight = document.getElementById('nav')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Traffic list animation in hero section
 */
function initTrafficAnimation() {
    const trafficItems = document.querySelectorAll('.traffic-item');
    
    if (trafficItems.length === 0) return;
    
    let currentIndex = 2; // Start with the "active" item
    
    // Simulate live traffic updates
    setInterval(() => {
        // Remove active class from all items
        trafficItems.forEach(item => item.classList.remove('active'));
        
        // Add active class to current item
        trafficItems[currentIndex].classList.add('active');
        
        // Move to next item
        currentIndex = (currentIndex + 1) % trafficItems.length;
    }, 2000);
}

/**
 * Parallax effect for hero section
 */
window.addEventListener('scroll', () => {
    const heroGlow = document.querySelector('.hero-glow');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroGlow) {
        const scrolled = window.scrollY;
        heroGlow.style.transform = `translateX(-50%) translateY(${scrolled * 0.3}px)`;
    }
    
    if (heroVisual) {
        const scrolled = window.scrollY;
        const opacity = 1 - scrolled / 800;
        const scale = 1 - scrolled * 0.0003;
        
        heroVisual.style.opacity = Math.max(0, opacity);
        heroVisual.style.transform = `scale(${Math.max(0.9, scale)})`;
    }
});

/**
 * Add hover effect to feature cards
 */
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.style.setProperty('--mouse-x', `${x}px`);
        this.style.setProperty('--mouse-y', `${y}px`);
    });
});

/**
 * Download button click tracking (placeholder for analytics)
 */
document.querySelectorAll('.btn-download').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const platform = this.closest('.platform-card')?.querySelector('h3')?.textContent;
        console.log(`Download clicked: ${platform}`);
        
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});

/**
 * Add keyboard navigation support
 */
document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        const navLinks = document.getElementById('navLinks');
        const navToggle = document.getElementById('navToggle');
        
        if (navLinks?.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = navToggle?.querySelector('svg');
            if (icon) {
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        }
    }
});

/**
 * Typing effect for hero subtitle (optional enhancement)
 */
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/**
 * Create particle effect in hero section
 */
function createParticles() {
    const hero = document.querySelector('.hero-bg');
    if (!hero) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(99, 102, 241, ${Math.random() * 0.5 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
            pointer-events: none;
        `;
        hero.appendChild(particle);
    }
}

// Add float animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize particles (optional - can be enabled if needed)
// createParticles();

/**
 * Add loading state management
 */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

/**
 * Performance optimization: Debounce scroll events
 */
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy operations
const debouncedScrollHandler = debounce(() => {
    // Any additional scroll-based effects can go here
}, 16);

window.addEventListener('scroll', debouncedScrollHandler, { passive: true });
