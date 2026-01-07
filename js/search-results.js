// Search Results Page Specific Scripts

document.addEventListener('DOMContentLoaded', function() {
    // Initialize search results
    initSearchResults();
    
    // Initialize filters and sorting
    initFilters();
    
    // Initialize search suggestions
    initSuggestions();
});

function initSearchResults() {
    // دریافت پارامتر جستجو از URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q') || '';
    
    // نمایش عبارت جستجو شده
    updateSearchDisplay(searchQuery);
    
    // جستجو و نمایش نتایج
    performSearch(searchQuery);
}

function updateSearchDisplay(searchQuery) {
    const searchTermDisplay = document.getElementById('searchTermDisplay');
    const searchBox = document.getElementById('search-box');
    
    if (searchQuery) {
        if (searchTermDisplay) {
            searchTermDisplay.textContent = `"${searchQuery}"`;
        }
        if (searchBox) {
            searchBox.value = searchQuery;
            searchBox.focus();
        }
    }
}

function performSearch(query) {
    const resultsContainer = document.getElementById('searchResults');
    const noResults = document.getElementById('noResults');
    const specialResults = document.getElementById('specialResults');
    const resultCount = document.getElementById('countNumber');
    
    if (!query.trim()) {
        // اگر جستجو خالی باشد
        showAllMods();
        return;
    }
    
    const lowerQuery = query.toLowerCase();
    
    // جستجوهای خاص
    const specialSearchResults = handleSpecialSearches(lowerQuery);
    if (specialSearchResults) {
        displaySpecialResults(specialSearchResults, query);
        return;
    }
    
    // جستجوی عادی
    const searchResults = searchInMods(lowerQuery);
    displayResults(searchResults, resultCount, resultsContainer, noResults);
}

function handleSpecialSearches(query) {
    const specialSearches = {
        'هلیکوپتر': 'apache',
        'helicopter': 'apache',
        'chapter': 'apache',
        'gta v': 'all',
        'جی تی ای': 'all',
        'grand theft auto': 'all'
    };
    
    if (specialSearches[query]) {
        return specialSearches[query];
    }
    
    return null;
}

function searchInMods(query) {
    // این داده‌ها باید با داده‌های واقعی جایگزین شوند
    const allMods = getMockModsData();
    
    return allMods.filter(mod => {
        return (
            mod.title.toLowerCase().includes(query) ||
            mod.description.toLowerCase().includes(query) ||
            mod.tags.some(tag => tag.toLowerCase().includes(query))
        );
    });
}

function getMockModsData() {
    return [
        {
            id: 1,
            title: "ماد هلیکوپتر AH-64D Apache",
            description: "هلیکوپتر نظامی پیشرفته با سیستم تسلیحات کامل و گرافیک 4K",
            category: "vehicle",
            image: "images/apache.jpg",
            downloads: 157,
            rating: 3.6,
            date: "1404/09/28",
            tags: ["هلیکوپتر", "helicopter", "apache", "نظامی", "وسایل نقلیه"],
            link: "mod-details.html"
        },
        // ... بقیه مادها
    ];
}

function displayResults(results, countElement, container, noResultsElement) {
    container.innerHTML = '';
    
    if (results.length === 0) {
        noResultsElement.style.display = 'block';
        countElement.textContent = '۰';
    } else {
        noResultsElement.style.display = 'none';
        countElement.textContent = results.length.toLocaleString('fa-IR');
        
        results.forEach((mod, index) => {
            const modCard = createModCard(mod, index);
            container.appendChild(modCard);
        });
    }
}

function displaySpecialResults(specialType, query) {
    const specialContainer = document.getElementById('specialResults');
    const resultsContainer = document.getElementById('searchResults');
    const noResults = document.getElementById('noResults');
    const resultCount = document.getElementById('countNumber');
    
    resultsContainer.style.display = 'none';
    noResults.style.display = 'none';
    specialContainer.style.display = 'block';
    
    let specialContent = '';
    let count = 0;
    
    if (specialType === 'apache') {
        count = 1;
        specialContent = `
            <div class="special-result">
                <div class="special-header">
                    <i class="fas fa-helicopter"></i>
                    <h3>نتایج برای جستجوی "${query}"</h3>
                </div>
                <div class="special-card">
                    <div class="special-image">
                        <img src="images/apache.jpg" alt="AH-64D Apache">
                        <div class="special-badge">
                            <i class="fas fa-bolt"></i> جستجوی مرتبط
                        </div>
                    </div>
                    <div class="special-content">
                        <h4>ماد هلیکوپتر AH-64D Apache</h4>
                        <p>هلیکوپتر نظامی پیشرفته با سیستم تسلیحات کامل - دقیقاً همان چیزی که جستجو کردید!</p>
                        <div class="special-info">
                            <span><i class="fas fa-download"></i> ۱۵۷ دانلود</span>
                            <span><i class="fas fa-star"></i> ۳.۶ امتیاز</span>
                            <span><i class="fas fa-gamepad"></i> GTA V</span>
                        </div>
                        <a href="mod-details.html" class="btn special-btn">
                            <i class="fas fa-external-link-alt"></i> مشاهده ماد Apache
                        </a>
                    </div>
                </div>
                <div class="special-note">
                    <i class="fas fa-info-circle"></i>
                    <p>همچنین می‌توانید <a href="popular-mods.html">مادهای پرطرفدار</a> را برای یافتن هلیکوپترهای دیگر بررسی کنید.</p>
                </div>
            </div>
        `;
    } else if (specialType === 'all') {
        const allMods = getMockModsData();
        count = allMods.length;
        specialContent = `
            <div class="special-result">
                <div class="special-header">
                    <i class="fas fa-gamepad"></i>
                    <h3>همه مادهای GTA V</h3>
                </div>
                <div class="special-grid">
                    ${allMods.map(mod => `
                        <div class="special-mod-card">
                            <img src="${mod.image}" alt="${mod.title}">
                            <h5>${mod.title}</h5>
                            <a href="${mod.link}" class="btn small-btn">مشاهده</a>
                        </div>
                    `).join('')}
                </div>
                <div class="special-note">
                    <i class="fas fa-info-circle"></i>
                    <p>تمام ${count} ماد موجود برای GTA V در Flormod</p>
                </div>
            </div>
        `;
    }
    
    specialContainer.innerHTML = specialContent;
    resultCount.textContent = count.toLocaleString('fa-IR');
}

function createModCard(mod, index) {
    const div = document.createElement('div');
    div.className = `mod-card ${mod.category}`;
    div.style.animationDelay = `${index * 0.1}s`;
    
    div.innerHTML = `
        <div class="mod-image">
            <img src="${mod.image}" alt="${mod.title}">
        </div>
        <div class="mod-content">
            <h3 class="mod-title">${mod.title}</h3>
            <p class="mod-desc">${mod.description}</p>
            <div class="mod-info">
                <span class="mod-category">
                    <i class="fas fa-tag"></i> 
                    ${getCategoryName(mod.category)}
                </span>
                <span class="mod-stats">
                    <i class="fas fa-download"></i> ${mod.downloads} دانلود
                </span>
            </div>
            <div class="mod-tags">
                ${mod.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="mod-actions">
                <a href="${mod.link}" class="btn read-more-btn">
                    <i class="fas fa-external-link-alt"></i> مشاهده ماد
                </a>
            </div>
        </div>
    `;
    
    return div;
}

function getCategoryName(category) {
    const categories = {
        'vehicle': 'وسایل نقلیه',
        'weapon': 'سلاح‌ها',
        'character': 'شخصیت‌ها',
        'map': 'نقشه‌ها',
        'graphics': 'گرافیک'
    };
    return categories[category] || 'متفرقه';
}

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sortResults');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            applyFilters();
        });
    });
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            applyFilters();
        });
    }
}

function applyFilters() {
    const activeFilter = document.querySelector('.filter-btn.active');
    const sortSelect = document.getElementById('sortResults');
    
    if (!activeFilter) return;
    
    const filter = activeFilter.getAttribute('data-filter');
    const sortBy = sortSelect ? sortSelect.value : 'relevant';
    
    // اعمال فیلتر و مرتب‌سازی
    filterAndSortResults(filter, sortBy);
}

function filterAndSortResults(filter, sortBy) {
    const modCards = document.querySelectorAll('.mod-card');
    const resultsContainer = document.getElementById('searchResults');
    
    // فیلتر
    let filteredCards = Array.from(modCards);
    
    if (filter !== 'all') {
        filteredCards = filteredCards.filter(card => card.classList.contains(filter));
    }
    
    // مرتب‌سازی
    filteredCards.sort((a, b) => {
        switch(sortBy) {
            case 'downloads':
                const aDownloads = parseInt(a.getAttribute('data-downloads') || '0');
                const bDownloads = parseInt(b.getAttribute('data-downloads') || '0');
                return bDownloads - aDownloads;
            case 'popular':
                const aRating = parseFloat(a.getAttribute('data-rating') || '0');
                const bRating = parseFloat(b.getAttribute('data-rating') || '0');
                return bRating - aRating;
            case 'newest':
                const aDate = new Date(a.getAttribute('data-date') || '0');
                const bDate = new Date(b.getAttribute('data-date') || '0');
                return bDate - aDate;
            default:
                return 0;
        }
    });
    
    // نمایش مجدد
    filteredCards.forEach(card => {
        resultsContainer.appendChild(card);
        
        // انیمیشن
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = 'fadeInUp 0.5s ease forwards';
        }, 10);
    });
}

function initSuggestions() {
    const suggestionTags = document.querySelectorAll('.suggestion-tag');
    
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            const searchTerm = this.textContent;
            
            // به‌روزرسانی جستجو
            const searchBox = document.getElementById('search-box');
            if (searchBox) {
                searchBox.value = searchTerm;
            }
            
            // اجرای جستجو
            performSearch(searchTerm);
            
            // به‌روزرسانی نمایش
            updateSearchDisplay(searchTerm);
            
            // اسکرول به بالا
            window.scrollTo({
                top: document.querySelector('.search-results').offsetTop - 100,
                behavior: 'smooth'
            });
        });
    });
}

function showAllMods() {
    const allMods = getMockModsData();
    const resultsContainer = document.getElementById('searchResults');
    const noResults = document.getElementById('noResults');
    const resultCount = document.getElementById('countNumber');
    const searchTermDisplay = document.getElementById('searchTermDisplay');
    
    if (searchTermDisplay) {
        searchTermDisplay.textContent = "همه مادها";
    }
    
    displayResults(allMods, resultCount, resultsContainer, noResults);
}

// Initialize when page loads
window.addEventListener('load', function() {
    // Add additional CSS for special results
    const style = document.createElement('style');
    style.textContent = `
        .special-result {
            background: var(--light);
            padding: 3rem;
            border-radius: 1rem;
            border: 2px solid var(--primary);
        }
        
        .special-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid var(--border);
        }
        
        .special-header i {
            font-size: 2.5rem;
            color: var(--primary);
        }
        
        .special-header h3 {
            font-size: 2.2rem;
            color: var(--text);
            margin: 0;
        }
        
        .special-card {
            display: flex;
            gap: 2rem;
            background: rgba(139, 0, 0, 0.05);
            padding: 2rem;
            border-radius: 1rem;
            margin-bottom: 2rem;
            border: 1px solid var(--border);
        }
        
        .special-image {
            flex: 0 0 30rem;
            position: relative;
            border-radius: 0.5rem;
            overflow: hidden;
        }
        
        .special-image img {
            width: 100%;
            height: 20rem;
            object-fit: cover;
        }
        
        .special-badge {
            position: absolute;
            top: 1rem;
            left: 1rem;
            background: linear-gradient(45deg, var(--primary), var(--secondary));
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .special-content {
            flex: 1;
        }
        
        .special-content h4 {
            font-size: 2rem;
            color: var(--text);
            margin-bottom: 1rem;
        }
        
        .special-content p {
            font-size: 1.5rem;
            color: var(--text-secondary);
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }
        
        .special-info {
            display: flex;
            gap: 2rem;
            margin-bottom: 1.5rem;
            font-size: 1.4rem;
            color: var(--text-secondary);
        }
        
        .special-info span {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .special-info i {
            color: var(--primary);
        }
        
        .special-btn {
            background: linear-gradient(45deg, var(--primary), var(--secondary));
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            display: inline-flex;
            align-items: center;
            gap: 1rem;
            font-size: 1.5rem;
            font-weight: 600;
        }
        
        .special-note {
            background: rgba(139, 0, 0, 0.1);
            padding: 1.5rem;
            border-radius: 0.5rem;
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            border-right: 4px solid var(--primary);
        }
        
        .special-note i {
            color: var(--primary);
            font-size: 1.6rem;
            margin-top: 0.2rem;
        }
        
        .special-note p {
            font-size: 1.4rem;
            color: var(--text-secondary);
            margin: 0;
        }
        
        .special-note a {
            color: var(--primary);
            text-decoration: underline;
        }
        
        .special-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(25rem, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }
        
        .special-mod-card {
            background: rgba(139, 0, 0, 0.05);
            padding: 1.5rem;
            border-radius: 0.5rem;
            text-align: center;
            border: 1px solid var(--border);
            transition: all 0.3s ease;
        }
        
        .special-mod-card:hover {
            transform: translateY(-5px);
            border-color: var(--primary);
        }
        
        .special-mod-card img {
            width: 100%;
            height: 15rem;
            object-fit: cover;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
        }
        
        .special-mod-card h5 {
            font-size: 1.6rem;
            color: var(--text);
            margin-bottom: 1rem;
            line-height: 1.4;
        }
        
        .small-btn {
            padding: 0.6rem 1.2rem;
            font-size: 1.3rem;
        }
        
        @media (max-width: 768px) {
            .special-card {
                flex-direction: column;
            }
            
            .special-image {
                flex: 0 0 auto;
            }
            
            .special-info {
                flex-wrap: wrap;
                gap: 1rem;
            }
        }
    `;
    document.head.appendChild(style);
});