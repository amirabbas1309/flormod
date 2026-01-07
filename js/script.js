// Menu Toggle
let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.navbar');

if (menu && navbar) {
    menu.onclick = () => {
        menu.classList.toggle('fa-times');
        navbar.classList.toggle('active');
    };
}

// Close menu on scroll
window.onscroll = () => {
    if (menu) menu.classList.remove('fa-times');
    if (navbar) navbar.classList.remove('active');
    
    // Back to top button
    let backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        if (window.scrollY > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    }
};

// Search Form Toggle
let searchBtn = document.querySelector('#search-btn');
let searchForm = document.querySelector('.search-form');

if (searchBtn && searchForm) {
    searchBtn.onclick = (e) => {
        e.preventDefault();
        searchForm.classList.toggle('active');
        if (menu) menu.classList.remove('fa-times');
        if (navbar) navbar.classList.remove('active');
    };
}

// Close search form when clicking outside
document.addEventListener('click', (e) => {
    if (searchBtn && searchForm) {
        if (!searchBtn.contains(e.target) && !searchForm.contains(e.target)) {
            searchForm.classList.remove('active');
        }
    }
});

// Close search form on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchForm) {
        searchForm.classList.remove('active');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu
            if (menu) menu.classList.remove('fa-times');
            if (navbar) navbar.classList.remove('active');
        }
    });
});

// Gallery Image Switcher
document.querySelectorAll('.thumbnail').forEach(thumb => {
    thumb.addEventListener('click', function() {
        // Remove active class from all thumbnails
        document.querySelectorAll('.thumbnail').forEach(t => {
            t.classList.remove('active');
        });
        
        // Add active class to clicked thumbnail
        this.classList.add('active');
        
        // Change main image
        const mainImage = document.getElementById('main-gallery-img');
        if (mainImage) {
            mainImage.src = this.getAttribute('data-src');
        }
    });
});

// Add hover effect to feature cards
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add ripple effect to buttons
    document.querySelectorAll('.btn, .download-btn-main, .btn-view-details').forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple effect
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .ripple {
            position: absolute;
            background: rgba(255, 255, 255, 0.7);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // Initialize search functionality
    initSearch();
});

// Search functionality
function initSearch() {
    const searchForm = document.querySelector('.search-form');
    const searchBox = document.querySelector('#search-box');
    
    if (searchForm && searchBox) {
        // ذخیره آخرین جستجو
        const lastSearch = localStorage.getItem('lastSearch');
        if (lastSearch && searchBox) {
            searchBox.value = lastSearch;
        }
        
        // پیشنهادات جستجو
        const searchSuggestions = {
            'هلیکوپتر': 'ماد AH-64D Apache',
            'helicopter': 'ماد AH-64D Apache',
            'chapter': 'ماد AH-64D Apache',
            'gta v': 'همه مادهای GTA V',
            'جی تی ای': 'همه مادهای GTA V',
            'grand theft auto': 'همه مادهای GTA V',
            'ماشین': 'مادهای وسایل نقلیه',
            'سلاح': 'مادهای سلاح',
            'نقشه': 'مادهای نقشه',
            'گرافیک': 'مادهای گرافیک',
            'شخصیت': 'مادهای شخصیت'
        };
        
        searchBox.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            // در اینجا می‌توانید پیشنهادات جستجو را نمایش دهید
        });
        
        // جستجوی هوشمند
        searchForm.addEventListener('submit', function(e) {
            const searchTerm = searchBox.value.trim().toLowerCase();
            if (searchTerm) {
                localStorage.setItem('lastSearch', searchTerm);
                
                // جستجوهای خاص
                if (searchSuggestions[searchTerm]) {
                    console.log('جستجوی خاص:', searchSuggestions[searchTerm]);
                }
                
                // هدایت به صفحه نتایج
                window.location.href = `search-results.html?q=${encodeURIComponent(searchTerm)}`;
            }
            e.preventDefault();
        });
    }
}

// Initialize everything
window.addEventListener('load', () => {
    console.log('Flormod سایت بارگذاری شد!');
    
    // شمارنده آمار (اگر در صفحه باشد)
    initCounters();
    
    // گالری تصاویر (اگر در صفحه باشد)
    initGallery();
    
    // اسلایدشو (اگر در صفحه باشد)
    initSlideshow();
});

// شمارنده آمار
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current).toLocaleString('fa-IR');
        }, 16);
    });
}

// گالری تصاویر
function initGallery() {
    const galleryModal = document.getElementById('galleryModal');
    if (!galleryModal) return;
    
    const modalImage = document.getElementById('modalImage');
    const closeModal = document.querySelector('.close-modal');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');
    const galleryImages = document.querySelectorAll('.gallery-image');
    
    let currentGalleryImages = [];
    let currentImageIndex = 0;
    
    const galleryData = {
        apache: ['images/apache-1.jpg', 'images/apache-2.jpg', 'images/apache-3.jpg'],
        lambo: ['images/car1.jpg', 'images/car2.jpg', 'images/car3.jpg'],
        weapon: ['images/weapon1.jpg', 'images/weapon2.jpg', 'images/weapon3.jpg'],
        map: ['images/map1.jpg', 'images/map2.jpg', 'images/map3.jpg'],
        graphics: ['images/graphics1.jpg', 'images/graphics2.jpg', 'images/graphics3.jpg'],
        character: ['images/character1.jpg', 'images/character2.jpg', 'images/character3.jpg']
    };
    
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            const galleryType = this.getAttribute('data-gallery');
            currentGalleryImages = galleryData[galleryType] || [];
            currentImageIndex = 0;
            
            if (currentGalleryImages.length > 0) {
                modalImage.src = currentGalleryImages[0];
                galleryModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            galleryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    galleryModal.addEventListener('click', function(e) {
        if (e.target === galleryModal) {
            galleryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentGalleryImages.length > 0) {
                currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
                modalImage.src = currentGalleryImages[currentImageIndex];
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentGalleryImages.length > 0) {
                currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
                modalImage.src = currentGalleryImages[currentImageIndex];
            }
        });
    }
    
    // بستن با کلید Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && galleryModal.style.display === 'flex') {
            galleryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// اسلایدشو
function initSlideshow() {
    let slides = document.querySelectorAll('.slide-container');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    let slideInterval;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
        currentSlide = index;
    }
    
    function next() {
        let nextSlide = (currentSlide + 1) % slides.length;
        showSlide(nextSlide);
    }
    
    function prev() {
        let prevSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevSlide);
    }
    
    function startSlideshow() {
        slideInterval = setInterval(next, 5000);
    }
    
    // دکمه‌های کنترل
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    
    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);
    
    // توقف اسلایدشو هنگام هاور
    const homeSection = document.querySelector('.home');
    if (homeSection) {
        homeSection.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        homeSection.addEventListener('mouseleave', () => {
            startSlideshow();
        });
    }
    
    startSlideshow();
}

// Back to top
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
// به انتهای فایل script.js این کد را اضافه کنید:

// افکت هور روی مادهای صفحه اصلی
function initModHoverEffects() {
    const modCards = document.querySelectorAll('.mod-card');
    
    modCards.forEach(card => {
        const image = card.querySelector('.mod-image');
        const modImage = card.querySelector('.mod-image img');
        
        if (image && modImage) {
            // نور متحرک روی تصویر
            image.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // ایجاد افکت نور
                const light = document.createElement('div');
                light.style.cssText = `
                    position: absolute;
                    top: ${y - 50}px;
                    left: ${x - 50}px;
                    width: 100px;
                    height: 100px;
                    background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
                    pointer-events: none;
                    z-index: 1;
                `;
                
                this.appendChild(light);
                
                // حذف نور قبلی
                const existingLights = this.querySelectorAll('div[style*="radial-gradient"]');
                if (existingLights.length > 1) {
                    existingLights[0].remove();
                }
                
                // حرکت جزئی تصویر
                const xPercent = (x / rect.width) * 100;
                const yPercent = (y / rect.height) * 100;
                
                modImage.style.transform = `
                    scale(1.1) 
                    translate(${(xPercent - 50) * 0.01}px, ${(yPercent - 50) * 0.01}px)
                `;
            });
            
            image.addEventListener('mouseleave', function() {
                modImage.style.transform = 'scale(1) translate(0, 0)';
                
                // حذف همه نورها
                const lights = this.querySelectorAll('div[style*="radial-gradient"]');
                lights.forEach(light => light.remove());
            });
            
            // افکت حرکت کارت
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-15px) rotateX(2deg) rotateY(-2deg)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
            });
        }
    });
}

// در تابع window.addEventListener('load') فراخوانی کنید:
window.addEventListener('load', function() {
    // ... کدهای موجود ...
    
    initModHoverEffects();
});