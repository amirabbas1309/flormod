// Popular Mods Page Specific Scripts

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips for rank badges
    initTooltips();
    
    // Initialize mod cards animations
    initModCards();
    
    // Initialize filters
    initFilters();
});

function initTooltips() {
    const rankBadges = document.querySelectorAll('.popular-rank');
    
    rankBadges.forEach(badge => {
        const rankText = badge.textContent.trim();
        let tooltipText = '';
        
        if (rankText.includes('#1')) {
            tooltipText = 'پرطرفدارترین ماد';
        } else if (rankText.includes('#2')) {
            tooltipText = 'دومین ماد پرطرفدار';
        } else if (rankText.includes('#3')) {
            tooltipText = 'سومین ماد پرطرفدار';
        } else {
            tooltipText = 'ماد پرطرفدار';
        }
        
        badge.setAttribute('title', tooltipText);
    });
}

function initModCards() {
    const modCards = document.querySelectorAll('.popular-card');
    
    modCards.forEach((card, index) => {
        // Add delay for animation
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Add hover effect for download stats
        const downloadStat = card.querySelector('.stat:nth-child(1)');
        if (downloadStat) {
            downloadStat.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
                this.style.color = 'var(--primary)';
            });
            
            downloadStat.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.color = '';
            });
        }
        
        // Add click effect for view button
        const viewBtn = card.querySelector('.view-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            });
        }
    });
}

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const modCards = document.querySelectorAll('.popular-card');
    const sortSelect = document.getElementById('sortSelect');
    
    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter mod cards
            modCards.forEach(card => {
                if (filter === 'all' || card.classList.contains(filter)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            const container = document.querySelector('.popular-grid');
            const cards = Array.from(document.querySelectorAll('.popular-card'));
            
            cards.sort((a, b) => {
                switch(sortBy) {
                    case 'downloads':
                        return parseInt(b.getAttribute('data-downloads')) - parseInt(a.getAttribute('data-downloads'));
                    case 'rating':
                        return parseFloat(b.getAttribute('data-rating')) - parseFloat(a.getAttribute('data-rating'));
                    case 'newest':
                        return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
                    default:
                        return 0;
                }
            });
            
            // Reorder cards in DOM
            cards.forEach(card => {
                container.appendChild(card);
                
                // Add reorder animation
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                }, 10);
            });
        });
    }
}

// Stats counter animation
function initStatsCounter() {
    const statsCards = document.querySelectorAll('.stats-card h3');
    
    statsCards.forEach(stat => {
        const target = parseFloat(stat.textContent.replace(/,/g, ''));
        const duration = 1500;
        const step = target / (duration / 16);
        
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current).toLocaleString('fa-IR');
        }, 16);
    });
}

// Initialize when page loads
window.addEventListener('load', function() {
    initStatsCounter();
});