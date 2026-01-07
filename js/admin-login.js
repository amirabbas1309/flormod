// Admin Panel Script

document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is logged in
    checkAdminAccess();
    
    // Initialize admin panel
    initAdminPanel();
    
    // Load mods data
    loadModsData();
    
    // Initialize session timer
    initSessionTimer();
    
    // Initialize charts
    initCharts();
});

// Check admin access
function checkAdminAccess() {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    const sessionStart = localStorage.getItem('sessionStart');
    
    if (loggedIn !== 'true' || !sessionStart) {
        // Redirect to login
        window.location.href = 'admin-login.html';
        return;
    }
    
    const sessionTime = parseInt(sessionStart);
    const currentTime = Date.now();
    const sessionDuration = 30 * 60 * 1000; // 30 minutes
    
    if (currentTime - sessionTime >= sessionDuration) {
        // Session expired
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('sessionStart');
        window.location.href = 'admin-login.html';
    }
}

// Initialize admin panel
function initAdminPanel() {
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const sectionTitle = document.getElementById('sectionTitle');
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    const quickButtons = document.querySelectorAll('.quick-btn');
    
    // Navigation click
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get target section
            const targetSection = this.getAttribute('data-section');
            
            // Update active nav
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
            
            // Update section title
            const titleText = this.querySelector('span').textContent;
            sectionTitle.textContent = titleText;
            
            // Close sidebar on mobile
            if (window.innerWidth <= 992) {
                sidebar.classList.remove('active');
            }
        });
    });
    
    // Quick actions
    quickButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            
            switch(action) {
                case 'add-mod':
                    navigateToSection('add-mod');
                    break;
                case 'view-mods':
                    navigateToSection('mods');
                    break;
                case 'backup':
                    backupData();
                    break;
                case 'clear-cache':
                    clearCache();
                    break;
            }
        });
    });
    
    // Menu toggle for mobile
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            showConfirmation('خروج از پنل', 'آیا از خروج از پنل مدیریت اطمینان دارید؟', function() {
                localStorage.removeItem('adminLoggedIn');
                localStorage.removeItem('sessionStart');
                window.location.href = 'admin-login.html';
            });
        });
    }
    
    // Search mods
    const modSearch = document.getElementById('modSearch');
    if (modSearch) {
        modSearch.addEventListener('input', function() {
            searchMods(this.value);
        });
    }
    
    // Add mod form
    const addModForm = document.getElementById('addModForm');
    if (addModForm) {
        addModForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewMod();
        });
    }
    
    // Preview button
    const previewBtn = document.getElementById('previewBtn');
    if (previewBtn) {
        previewBtn.addEventListener('click', showPreview);
    }
    
    // Close preview modal
    const closeModal = document.querySelector('.close-modal');
    const previewModal = document.getElementById('previewModal');
    
    if (closeModal && previewModal) {
        closeModal.addEventListener('click', function() {
            previewModal.classList.remove('active');
        });
        
        previewModal.addEventListener('click', function(e) {
            if (e.target === previewModal) {
                previewModal.classList.remove('active');
            }
        });
    }
    
    // Settings tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
            
            // Show target tab pane
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `${tabId}-tab`) {
                    pane.classList.add('active');
                }
            });
        });
    });
}

// Navigate to section
function navigateToSection(sectionId) {
    const navItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
    if (navItem) {
        navItem.click();
    }
}

// Load mods data
function loadModsData() {
    // Load from localStorage
    let mods = JSON.parse(localStorage.getItem('flormod_mods')) || [];
    
    // Update counters
    updateCounters(mods);
    
    // Load mods table
    loadModsTable(mods);
    
    // Load activity log
    loadActivityLog();
}

// Update counters
function updateCounters(mods) {
    const totalMods = mods.length;
    const modsCount = document.getElementById('modsCount');
    const totalModsElement = document.getElementById('totalMods');
    
    if (modsCount) modsCount.textContent = totalMods;
    if (totalModsElement) totalModsElement.textContent = totalMods.toLocaleString('fa-IR');
    
    // Update downloads (sum of all mod downloads)
    const totalDownloads = mods.reduce((sum, mod) => sum + (mod.downloads || 0), 0) + 54210;
    const totalDownloadsElement = document.getElementById('totalDownloads');
    if (totalDownloadsElement) {
        totalDownloadsElement.textContent = totalDownloads.toLocaleString('fa-IR');
    }
}

// Load mods table
function loadModsTable(mods) {
    const tbody = document.getElementById('modsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (mods.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-table">
                    <i class="fas fa-box-open"></i>
                    <p>هیچ مادی یافت نشد</p>
                </td>
            </tr>
        `;
        return;
    }
    
    mods.forEach((mod, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${(index + 1).toLocaleString('fa-IR')}</td>
            <td>
                <img src="${mod.image || 'images/default-mod.jpg'}" alt="${mod.title}">
            </td>
            <td>
                <strong>${mod.title}</strong>
                <div class="mod-category">${getCategoryName(mod.category)}</div>
            </td>
            <td>${mod.creator || 'نامشخص'}</td>
            <td>${mod.date || '--/--/----'}</td>
            <td>${(mod.downloads || 0).toLocaleString('fa-IR')}</td>
            <td>
                <span class="status-badge status-active">فعال</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view-btn" data-id="${mod.id}" title="مشاهده">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" data-id="${mod.id}" title="ویرایش">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${mod.id}" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    addActionListeners(mods);
    
    // Update table stats
    const tableCount = document.getElementById('modsTableCount');
    if (tableCount) {
        tableCount.textContent = `${mods.length.toLocaleString('fa-IR')} ماد یافت شد`;
    }
}

// Add action listeners
function addActionListeners(mods) {
    // View buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modId = this.getAttribute('data-id');
            const mod = mods.find(m => m.id == modId);
            if (mod) {
                window.open(`mod-${modId}.html`, '_blank');
            }
        });
    });
    
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modId = this.getAttribute('data-id');
            const mod = mods.find(m => m.id == modId);
            if (mod) {
                editMod(mod);
            }
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modId = this.getAttribute('data-id');
            const mod = mods.find(m => m.id == modId);
            if (mod) {
                deleteMod(mod);
            }
        });
    });
}

// Get category name
function getCategoryName(category) {
    const categories = {
        'vehicle': 'وسایل نقلیه',
        'weapon': 'سلاح‌ها',
        'character': 'شخصیت‌ها',
        'map': 'نقشه‌ها',
        'graphics': 'گرافیک',
        'military': 'نظامی'
    };
    
    return categories[category] || 'نامشخص';
}

// Search mods
function searchMods(query) {
    let mods = JSON.parse(localStorage.getItem('flormod_mods')) || [];
    
    if (!query.trim()) {
        loadModsTable(mods);
        return;
    }
    
    const filteredMods = mods.filter(mod => 
        mod.title.toLowerCase().includes(query.toLowerCase()) ||
        (mod.creator && mod.creator.toLowerCase().includes(query.toLowerCase())) ||
        (mod.description && mod.description.toLowerCase().includes(query.toLowerCase()))
    );
    
    loadModsTable(filteredMods);
}

// Add new mod
function addNewMod() {
    const form = document.getElementById('addModForm');
    const formData = new FormData(form);
    
    // Get form values
    const modData = {
        id: Date.now(),
        title: document.getElementById('modTitle').value,
        creator: document.getElementById('modCreator').value,
        fileSize: document.getElementById('modFileSize').value,
        category: document.getElementById('modCategory').value,
        password: document.getElementById('modPassword').value,
        image: document.getElementById('modMainImage').value,
        downloadLink: document.getElementById('modDownloadLink').value,
        gallery: [
            document.getElementById('modGallery1').value,
            document.getElementById('modGallery2').value,
            document.getElementById('modGallery3').value
        ].filter(url => url.trim()),
        description: document.getElementById('modDescription').value,
        features: document.getElementById('modFeatures').value
            .split('\n')
            .filter(line => line.trim()),
        tags: document.getElementById('modTags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag),
        date: getCurrentDate(),
        downloads: 0,
        rating: 4.0
    };
    
    // Load existing mods
    let mods = JSON.parse(localStorage.getItem('flormod_mods')) || [];
    
    // Add new mod
    mods.push(modData);
    
    // Save to localStorage
    localStorage.setItem('flormod_mods', JSON.stringify(mods));
    
    // Create mod page
    createModPage(modData);
    
    // Reset form
    form.reset();
    
    // Show success message
    showSuccess('ماد جدید با موفقیت اضافه شد');
    
    // Update mods table
    loadModsData();
    
    // Add to activity log
    addActivity('افزودن ماد', `ماد "${modData.title}" اضافه شد`);
}

// Create mod page
function createModPage(mod) {
    const pageContent = generateModPageHTML(mod);
    
    // In a real scenario, you would save this to a file
    // For this demo, we'll just store it in localStorage
    localStorage.setItem(`mod_page_${mod.id}`, pageContent);
    
    // Also update the main mods list for the website
    updateWebsiteModsList(mod);
}

// Generate mod page HTML
function generateModPageHTML(mod) {
    return `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${mod.title} | Flormod</title>
    
    <!-- font awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- custom css -->
    <link rel="stylesheet" href="css/style-mod-details.css">
    
    <!-- فونت فارسی -->
    <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" type="text/css" />
</head>
<body>

<!-- header section starts -->
<header>
    <div id="menu-bar" class="fas fa-bars"></div>
    
    <a href="index.html" class="logo">
        <img src="images/fit-logo.png" alt="Flormod Logo" class="logo-img">
        <span class="logo-text">Flormod</span>
    </a>
    
    <nav class="navbar">
        <a href="index.html"><i class="fas fa-home"></i> خانه</a>
        <a href="all-mods.html"><i class="fas fa-th-list"></i> همه مادها</a>
        <a href="popular-mods.html"><i class="fas fa-fire"></i> پرطرفدارها</a>
        <a href="faq.html"><i class="fas fa-question-circle"></i> سوالات متداول</a>
    </nav>
    
    <div class="icons">
        <a href="#" class="fas fa-search" id="search-btn"></a>
    </div>
    
    <!-- search form -->
    <form action="search-results.html" class="search-form" method="GET">
        <input type="search" id="search-box" name="q" placeholder="جستجوی ماد...">
        <label for="search-box" class="fas fa-search"></label>
    </form>
</header>
<!-- header section ends -->

<!-- breadcrumb -->
<div class="breadcrumb">
    <div class="container">
        <a href="index.html"><i class="fas fa-home"></i> خانه</a>
        <i class="fas fa-chevron-left"></i>
        <a href="all-mods.html">همه مادها</a>
        <i class="fas fa-chevron-left"></i>
        <span>${mod.title}</span>
    </div>
</div>

<!-- mod hero section -->
<section class="mod-hero">
    <div class="container">
        <div class="hero-content">
            <div class="hero-badge">${getCategoryName(mod.category)}</div>
            <h1 class="hero-title">${mod.title}</h1>
            <p class="hero-subtitle">${mod.description.substring(0, 100)}...</p>
            
            <div class="hero-meta">
                <div class="meta-item">
                    <i class="fas fa-gamepad"></i>
                    <span>بازی: Grand Theft Auto V</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span>تاریخ انتشار: ${mod.date}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-hdd"></i>
                    <span>حجم فایل: ${mod.fileSize} مگابایت</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-lock-open"></i>
                    <span>پسورد فایل: ${mod.password || 'ندارد'}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-user-cog"></i>
                    <span>سازنده: ${mod.creator}</span>
                </div>
            </div>
            
            <div class="hero-actions">
                <a href="#download" class="btn download-now">
                    <i class="fas fa-download"></i> دانلود ماد (${mod.fileSize} مگابایت)
                </a>
                <a href="#gallery" class="btn view-gallery">
                    <i class="fas fa-images"></i> گالری تصاویر
                </a>
            </div>
        </div>
        
        <div class="hero-image">
            <img src="${mod.image}" alt="${mod.title}">
            <div class="image-badge">
                <i class="fas fa-star"></i>
                امتیاز: ${mod.rating} از ۵.۰
            </div>
        </div>
    </div>
</section>

<!-- mod description -->
<section class="mod-description">
    <div class="container">
        <div class="description-content">
            <h2 class="section-title">توضیحات <span>${mod.title.split(' ')[0]}</span></h2>
            <div class="description-text">
                <p>${mod.description}</p>
                
                <div class="creator-info">
                    <h3><i class="fas fa-user-secret"></i> ساخته شده توسط: ${mod.creator}</h3>
                    <p>تیم توسعه‌دهنده با تجربه در ساخت مادهای حرفه‌ای</p>
                </div>
            </div>
        </div>
        
        <div class="features-list">
            <h3><i class="fas fa-star"></i> ویژگی‌های اصلی:</h3>
            <ul>
                ${mod.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
            </ul>
        </div>
    </div>
</section>

<!-- mod gallery -->
<section class="mod-gallery" id="gallery">
    <div class="container">
        <h2 class="section-title">گالری <span>تصاویر</span></h2>
        <p class="section-subtitle">${mod.gallery.length} تصویر از ${mod.title.split(' ')[0]} در بازی</p>
        
        <div class="gallery-content">
            <div class="main-gallery-image">
                <img src="${mod.gallery[0]}" alt="${mod.title} View 1" id="mainGalleryImage">
            </div>
            
            <div class="gallery-thumbnails">
                ${mod.gallery.map((img, index) => `
                <div class="thumbnail ${index === 0 ? 'active' : ''}" data-src="${img}">
                    <img src="${img}" alt="View ${index + 1}">
                </div>
                `).join('')}
            </div>
        </div>
    </div>
</section>

<!-- mod requirements -->
<section class="mod-requirements">
    <div class="container">
        <h2 class="section-title">پیش‌نیازهای <span>سیستم</span></h2>
        <p class="section-subtitle">حداقل نیازمندی‌های سیستم برای اجرای ماد</p>
        
        <div class="requirements-grid">
            <div class="requirement-card system">
                <div class="req-header">
                    <i class="fas fa-desktop"></i>
                    <h3>نیازمندی سیستم</h3>
                </div>
                <ul class="req-list">
                    <li><i class="fas fa-laptop"></i> <strong>سیستم‌عامل:</strong> Windows 10 64 Bit, Windows 8.1 64 Bit, Windows 8 64 Bit, Windows 7 64 Bit Service Pack 1, Windows Vista 64 Bit Service Pack 2</li>
                    <li><i class="fas fa-microchip"></i> <strong>CPU (پردازنده):</strong> Intel Core 2 Quad CPU Q6600 @ 2.40 GHz / AMD Phenom 9850 Quad-Core Processor @ 2.5 GHz</li>
                    <li><i class="fas fa-memory"></i> <strong>مموری:</strong> ۴GB RAM</li>
                    <li><i class="fas fa-video"></i> <strong>گرافیک:</strong> NVIDIA 9800 GT 1GB / AMD HD 4870 1GB</li>
                    <li><i class="fas fa-cogs"></i> <strong>دایرکت‌ایکس:</strong> DirectX 10</li>
                </ul>
            </div>
        </div>
        
        <div class="install-guide">
            <h3><i class="fas fa-wrench"></i> راهنمای نصب:</h3>
            <ol>
                <li>وارد پوشه بازی شوید، فولدر Update بازی را در فولدر Mods کپی کنید (اگر فولدر Mods ندارید دستی بسازید)</li>
                <li>ماشین هایی که با روش ADD-On نصب می‌شوند معمولاً دارای یک فولدر و یک فایل تکست هستند</li>
                <li>فولدر (mod) را در آدرس روبرو کپی کنید: <code>XXX:\\Grand Theft Auto V\\mods\\update\\x64\\dlcpacks</code></li>
                <li>وارد برنامه Open IV شوید، به آدرس روبرو بروید: <code>mods / update / update.rpf / common / data</code></li>
                <li>دکمه F6 رو بزنید تا Edit Mod فعال شود یا دستی فعال کنید!</li>
                <li>فایل dlclist.xml را پیدا و روی آن کلیک راست کرده و Edit را بزنید</li>
                <li>این خط رو مثل بقیه خط ها اضافه کنید:
                    <div class="code-block">
                        <code id="installCode">&lt;Item&gt;dlcpacks:\\mod\\&lt;/Item&gt;</code>
                        <button class="copy-btn" onclick="copyInstallCode()">
                            <i class="fas fa-copy"></i> کپی
                        </button>
                    </div>
                </li>
                <li>روی save بزنید و بازی را اجرا کنید و از آن لذت ببرید</li>
                <li>درصورت هرگونه مشکل به پشتیبانی در تلگرام به آیدی <a href="https://t.me/flormod" target="_blank">@flormod</a> مراجعه کنید</li>
            </ol>
        </div>
    </div>
</section>

<!-- mod download -->
<section class="mod-download" id="download">
    <div class="container">
        <h2 class="section-title">دانلود <span>ماد</span></h2>
        <p class="section-subtitle">دریافت فایل ماد با لینک مستقیم و بدون محدودیت</p>
        
        <div class="download-card">
            <div class="download-header">
                <div class="file-info">
                    <i class="fas fa-file-archive"></i>
                    <div>
                        <h3>${mod.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_')}.rar</h3>
                        <p class="file-size">حجم: ${mod.fileSize} مگابایت | فرمت: RAR | سازنده: ${mod.creator}</p>
                    </div>
                </div>
                <div class="file-stats">
                    <span class="stat"><i class="fas fa-download"></i> ${mod.downloads} دانلود</span>
                    <span class="stat"><i class="fas fa-star"></i> ${mod.rating} امتیاز</span>
                </div>
            </div>
            
            <div class="download-details">
                <div class="detail-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span>آخرین آپدیت: ${mod.date}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-code-branch"></i>
                    <span>ورژن: ۱.۰</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-lock-open"></i>
                    <span>پسورد: ${mod.password || 'ندارد'}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-shield-alt"></i>
                    <span>بدون ویروس | تست شده</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-tag"></i>
                    <span>دسته‌بندی: ${getCategoryName(mod.category)}</span>
                </div>
            </div>
            
            <div class="download-warning">
                <i class="fas fa-exclamation-triangle"></i>
                <p>⚠️ توجه: این ماد فقط برای استفاده در حالت آفلاین (Single Player) بازی مناسب است. استفاده در حالت آنلاین می‌تواند منجر به بن شدن حساب شما شود.</p>
            </div>
            
            <!-- دانلود اصلی -->
            <a href="${mod.downloadLink}" class="download-btn-main" download="${mod.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_')}.rar">
                <i class="fas fa-cloud-download-alt"></i>
                <span>دانلود مستقیم ماد (سرور اصلی)</span>
                <small>${mod.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_')}.rar - ${mod.fileSize}MB</small>
            </a>
            
            <div class="download-note">
                <p><i class="fas fa-info-circle"></i> در صورت مشکل در دانلود، از طریق پشتیبانی در تلگرام گزارش دهید.</p>
            </div>
        </div>
    </div>
</section>

<!-- footer -->
<footer class="footer">
    <div class="footer-content">
        <div class="footer-section">
            <div class="footer-logo">
                <img src="images/fit-logo.png" alt="Flormod Logo" class="footer-logo-img">
                <span class="logo-text">Flormod</span>
            </div>
            <p class="footer-description">
                ارائه بهترین مادهای حرفه‌ای برای GTA V با کیفیت عالی و پشتیبانی کامل.
            </p>
            <div class="footer-social">
                <a href="https://t.me/flormod_channel" target="_blank" class="social-link telegram">
                    <i class="fab fa-telegram"></i> کانال تلگرام
                </a>
                <a href="https://t.me/flormod" target="_blank" class="social-link support">
                    <i class="fas fa-headset"></i> پشتیبانی تلگرام
                </a>
            </div>
        </div>
        
        <div class="footer-section">
            <h3>لینک‌های سریع</h3>
            <ul>
                <li><a href="index.html">خانه</a></li>
                <li><a href="all-mods.html">همه مادها</a></li>
                <li><a href="popular-mods.html">پرطرفدارها</a></li>
                <li><a href="faq.html">سوالات متداول</a></li>
                <li><a href="rules.html">قوانین</a></li>
            </ul>
        </div>
        
        <div class="footer-section">
            <h3>مادهای مشابه</h3>
            <ul>
                <li><a href="mod-details.html">Apache هلیکوپتر</a></li>
                <li><a href="B2.html">وسیله نقلیه B2</a></li>
                <li><a href="M1114.html">M1114 Up Armored</a></li>
                <li><a href="M142.html">M142 HIMARS</a></li>
            </ul>
        </div>
        
        <div class="footer-section">
            <h3>ارتباط با ما</h3>
            <ul>
                <li><i class="fas fa-envelope"></i> support@flormod.com</li>
                <li><i class="fas fa-phone"></i> ۰۲۱-۱۲۳۴۵۶۷۸</li>
                <li><i class="fab fa-telegram"></i> @flormod_channel</li>
                <li><i class="fas fa-map-marker-alt"></i> تهران، ولیعصر</li>
            </ul>
        </div>
    </div>
    
    <div class="footer-bottom">
        <div class="copyright">
            © ۱۴۰۴ - ۱۴۰۲ Flormod. تمامی حقوق محفوظ است.
        </div>
        <div class="footer-credits">
            <span><i class="fas fa-calendar"></i> آخرین بروزرسانی: ${mod.date}</span>
        </div>
    </div>
</footer>

<!-- back to top -->
<div class="back-to-top" id="backToTop">
    <i class="fas fa-chevron-up"></i>
</div>

<script>
    // کپی کد نصب
    function copyInstallCode() {
        const code = document.getElementById('installCode');
        const textArea = document.createElement('textarea');
        textArea.value = code.textContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        const copyBtn = document.querySelector('.copy-btn');
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> کپی شد!';
        copyBtn.style.background = '#00aa00';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.background = '';
        }, 2000);
    }
    
    // گالری تصاویر
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainGalleryImage');
        
    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                mainImage.src = this.getAttribute('data-src');
            });
        });
    }
    
    // Back to top
    const backToTopBtn = document.getElementById('backToTop');
        
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
        
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
</script>

</body>
</html>
    `;
}

// Update website mods list
function updateWebsiteModsList(mod) {
    // This function would update the main website's mod list
    // For this demo, we'll store the mod info in localStorage
    let websiteMods = JSON.parse(localStorage.getItem('website_mods')) || [];
    websiteMods.push({
        id: mod.id,
        title: mod.title,
        description: mod.description.substring(0, 100) + '...',
        category: mod.category,
        image: mod.image,
        downloads: 0,
        rating: mod.rating,
        date: mod.date,
        tags: mod.tags,
        link: `mod-${mod.id}.html`
    });
    
    localStorage.setItem('website_mods', JSON.stringify(websiteMods));
}

// Edit mod
function editMod(mod) {
    // Fill form with mod data
    document.getElementById('modTitle').value = mod.title;
    document.getElementById('modCreator').value = mod.creator;
    document.getElementById('modFileSize').value = mod.fileSize;
    document.getElementById('modCategory').value = mod.category;
    document.getElementById('modPassword').value = mod.password || '';
    document.getElementById('modMainImage').value = mod.image;
    document.getElementById('modDownloadLink').value = mod.downloadLink;
    document.getElementById('modGallery1').value = mod.gallery[0] || '';
    document.getElementById('modGallery2').value = mod.gallery[1] || '';
    document.getElementById('modGallery3').value = mod.gallery[2] || '';
    document.getElementById('modDescription').value = mod.description;
    document.getElementById('modFeatures').value = mod.features.join('\n');
    document.getElementById('modTags').value = mod.tags.join(', ');
    
    // Change form submit to update instead of add
    const form = document.getElementById('addModForm');
    form.dataset.editId = mod.id;
    
    // Navigate to add mod section
    navigateToSection('add-mod');
    
    // Change submit button text
    const submitBtn = form.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-save"></i> به‌روزرسانی ماد';
    }
    
    showSuccess('فرم برای ویرایش پر شد. تغییرات را اعمال کنید.');
}

// Delete mod
function deleteMod(mod) {
    showConfirmation('حذف ماد', `آیا از حذف ماد "${mod.title}" اطمینان دارید؟ این عمل قابل بازگشت نیست.`, function() {
        // Load mods
        let mods = JSON.parse(localStorage.getItem('flormod_mods')) || [];
        
        // Remove mod
        mods = mods.filter(m => m.id !== mod.id);
        
        // Save to localStorage
        localStorage.setItem('flormod_mods', JSON.stringify(mods));
        
        // Remove from website mods
        let websiteMods = JSON.parse(localStorage.getItem('website_mods')) || [];
        websiteMods = websiteMods.filter(m => m.id !== mod.id);
        localStorage.setItem('website_mods', JSON.stringify(websiteMods));
        
        // Show success message
        showSuccess(`ماد "${mod.title}" با موفقیت حذف شد`);
        
        // Update mods table
        loadModsData();
        
        // Add to activity log
        addActivity('حذف ماد', `ماد "${mod.title}" حذف شد`);
    });
}

// Show preview
function showPreview() {
    const form = document.getElementById('addModForm');
    const formData = new FormData(form);
    
    // Get form values
    const previewData = {
        title: document.getElementById('modTitle').value || 'عنوان ماد',
        creator: document.getElementById('modCreator').value || 'سازنده',
        fileSize: document.getElementById('modFileSize').value || '20',
        category: document.getElementById('modCategory').value || 'vehicle',
        password: document.getElementById('modPassword').value || 'ندارد',
        image: document.getElementById('modMainImage').value || 'images/default-mod.jpg',
        description: document.getElementById('modDescription').value || 'توضیحات ماد',
        features: (document.getElementById('modFeatures').value || 'ویژگی ۱\nویژگی ۲\nویژگی ۳')
            .split('\n')
            .filter(line => line.trim())
    };
    
    // Generate preview HTML
    const previewHTML = `
        <div class="preview-content">
            <h4>پیش‌نمایش اطلاعات ماد:</h4>
            
            <div class="preview-section">
                <h5>اطلاعات اصلی:</h5>
                <div class="preview-row">
                    <strong>عنوان:</strong> ${previewData.title}
                </div>
                <div class="preview-row">
                    <strong>سازنده:</strong> ${previewData.creator}
                </div>
                <div class="preview-row">
                    <strong>حجم فایل:</strong> ${previewData.fileSize} مگابایت
                </div>
                <div class="preview-row">
                    <strong>دسته‌بندی:</strong> ${getCategoryName(previewData.category)}
                </div>
                <div class="preview-row">
                    <strong>پسورد:</strong> ${previewData.password}
                </div>
            </div>
            
            <div class="preview-section">
                <h5>توضیحات:</h5>
                <p>${previewData.description}</p>
            </div>
            
            <div class="preview-section">
                <h5>ویژگی‌ها:</h5>
                <ul>
                    ${previewData.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
            
            <div class="preview-section">
                <h5>تصویر:</h5>
                <div class="preview-image">
                    <img src="${previewData.image}" alt="تصویر ماد" style="max-width: 100%; border-radius: 0.5rem;">
                </div>
            </div>
            
            <div class="preview-note">
                <i class="fas fa-info-circle"></i>
                <p>این فقط یک پیش‌نمایش است. برای ذخیره‌سازی ماد، روی دکمه "ذخیره ماد" کلیک کنید.</p>
            </div>
        </div>
    `;
    
    // Show modal
    const previewModal = document.getElementById('previewModal');
    const previewContent = document.getElementById('previewContent');
    
    previewContent.innerHTML = previewHTML;
    previewModal.classList.add('active');
}

// Load activity log
function loadActivityLog() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    let activities = JSON.parse(localStorage.getItem('admin_activities')) || [
        {
            type: 'login',
            title: 'ورود به پنل',
            time: 'امروز ۱۰:۳۰'
        },
        {
            type: 'add',
            title: 'اضافه کردن ماد هلیکوپتر Apache',
            time: 'دیروز ۱۴:۴۵'
        },
        {
            type: 'edit',
            title: 'ویرایش اطلاعات ماد B2',
            time: '۲ روز پیش ۰۹:۲۰'
        }
    ];
    
    // Update activity list HTML
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.type}">
                <i class="fas fa-${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

// Get activity icon
function getActivityIcon(type) {
    const icons = {
        'login': 'sign-in-alt',
        'add': 'plus-circle',
        'edit': 'edit',
        'delete': 'trash',
        'backup': 'download',
        'settings': 'cog'
    };
    
    return icons[type] || 'circle';
}

// Add activity
function addActivity(type, title) {
    let activities = JSON.parse(localStorage.getItem('admin_activities')) || [];
    
    // Add new activity
    const now = new Date();
    const time = now.toLocaleDateString('fa-IR') + ' ' + now.toLocaleTimeString('fa-IR').substring(0, 5);
    
    activities.unshift({
        type: type,
        title: title,
        time: time
    });
    
    // Keep only last 50 activities
    activities = activities.slice(0, 50);
    
    // Save to localStorage
    localStorage.setItem('admin_activities', JSON.stringify(activities));
    
    // Reload activity list
    loadActivityLog();
}

// Initialize session timer
function initSessionTimer() {
    const timerElement = document.getElementById('sessionTimer');
    if (!timerElement) return;
    
    const sessionStart = parseInt(localStorage.getItem('sessionStart'));
    const sessionDuration = 30 * 60 * 1000; // 30 minutes
    
    function updateTimer() {
        const now = Date.now();
        const timeLeft = sessionStart + sessionDuration - now;
        
        if (timeLeft <= 0) {
            // Session expired
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('sessionStart');
            window.location.href = 'admin-login.html';
            return;
        }
        
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Update timer every second
    updateTimer();
    setInterval(updateTimer, 1000);
}

// Initialize charts
function initCharts() {
    // Downloads chart
    const downloadsCtx = document.getElementById('downloadsChart');
    if (downloadsCtx) {
        new Chart(downloadsCtx, {
            type: 'line',
            data: {
                labels: ['دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه', 'یکشنبه'],
                datasets: [{
                    label: 'تعداد دانلود',
                    data: [187, 156, 201, 189, 234, 210, 198],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString('fa-IR');
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Category chart
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['وسایل نقلیه', 'سلاح‌ها', 'شخصیت‌ها', 'نقشه‌ها', 'گرافیک'],
                datasets: [{
                    data: [35, 25, 15, 15, 10],
                    backgroundColor: [
                        '#3498db',
                        '#2ecc71',
                        '#9b59b6',
                        '#f39c12',
                        '#e74c3c'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        rtl: true
                    }
                }
            }
        });
    }
}

// Show confirmation modal
function showConfirmation(title, message, confirmCallback) {
    const modal = document.getElementById('confirmationModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const confirmBtn = document.getElementById('confirmAction');
    const cancelBtn = document.getElementById('cancelAction');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    modal.classList.add('active');
    
    // Set up event listeners
    function handleConfirm() {
        confirmCallback();
        modal.classList.remove('active');
        cleanup();
    }
    
    function handleCancel() {
        modal.classList.remove('active');
        cleanup();
    }
    
    function cleanup() {
        confirmBtn.removeEventListener('click', handleConfirm);
        cancelBtn.removeEventListener('click', handleCancel);
    }
    
    confirmBtn.addEventListener('click', handleConfirm);
    cancelBtn.addEventListener('click', handleCancel);
}

// Show success notification
function showSuccess(message) {
    const notification = document.getElementById('successNotification');
    const messageElement = document.getElementById('successMessage');
    
    messageElement.textContent = message;
    notification.classList.add('active');
    
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}

// Backup data
function backupData() {
    const data = {
        mods: JSON.parse(localStorage.getItem('flormod_mods')) || [],
        activities: JSON.parse(localStorage.getItem('admin_activities')) || [],
        websiteMods: JSON.parse(localStorage.getItem('website_mods')) || [],
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `flormod-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showSuccess('پشتیبان‌گیری با موفقیت انجام شد');
    addActivity('backup', 'پشتیبان‌گیری از داده‌ها');
}

// Clear cache
function clearCache() {
    showConfirmation('پاک‌سازی کش', 'آیا از پاک‌سازی کش سیستم اطمینان دارید؟', function() {
        // Clear all localStorage items except admin session
        const loggedIn = localStorage.getItem('adminLoggedIn');
        const sessionStart = localStorage.getItem('sessionStart');
        
        localStorage.clear();
        
        // Restore admin session
        if (loggedIn) localStorage.setItem('adminLoggedIn', loggedIn);
        if (sessionStart) localStorage.setItem('sessionStart', sessionStart);
        
        // Reload page
        location.reload();
    });
}

// Helper functions
function getCurrentDate() {
    const now = new Date();
    const persianDate = now.toLocaleDateString('fa-IR');
    return persianDate;
}

// Update the main page to show admin button
function updateMainPage() {
    // Add admin button to main page header
    const adminBtn = `
        <a href="admin-login.html" class="admin-access-btn" title="دسترسی ادمین">
            <i class="fas fa-user-shield"></i>
        </a>
    `;
    
    // Add CSS for admin button
    const style = document.createElement('style');
    style.textContent = `
        .admin-access-btn {
            position: fixed;
            bottom: 2rem;
            left: 2rem;
            width: 5rem;
            height: 5rem;
            background: linear-gradient(45deg, #2c3e50, #3498db);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            z-index: 999;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        }
        
        .admin-access-btn:hover {
            transform: scale(1.1) rotate(15deg);
            box-shadow: 0 8px 25px rgba(52, 152, 219, 0.4);
        }
    `;
    
    document.head.appendChild(style);
    
    // Add button to body
    document.body.insertAdjacentHTML('beforeend', adminBtn);
}