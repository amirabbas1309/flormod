// FAQ Page Specific Scripts

document.addEventListener('DOMContentLoaded', function() {
    // Initialize FAQ functionality
    initFAQ();
    
    // Initialize search functionality
    initFAQSearch();
    
    // Initialize category filters
    initCategories();
});

function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    // باز کردن اولین سوال به طور پیش‌فرض
    if (faqQuestions.length > 0) {
        setTimeout(() => {
            faqQuestions[0].click();
        }, 500);
    }
    
    // افزودن انیمیشن به سوالات
    faqQuestions.forEach((question, index) => {
        // تاخیر انیمیشن
        question.parentElement.style.animationDelay = `${index * 0.1}s`;
        
        // افکت hover
        question.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(139, 0, 0, 0.1)';
        });
        
        question.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.backgroundColor = '';
            }
        });
    });
}

function initFAQSearch() {
    const searchInput = document.getElementById('faqSearch');
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        let foundResults = false;
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            
            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = 'block';
                
                // Highlight matching text
                if (searchTerm) {
                    highlightText(item, searchTerm);
                } else {
                    removeHighlight(item);
                }
                
                // باز کردن سوال اگر مطابقت دارد
                if (searchTerm && !item.querySelector('.faq-question').classList.contains('active')) {
                    item.querySelector('.faq-question').click();
                }
                
                foundResults = true;
            } else {
                item.style.display = 'none';
                removeHighlight(item);
            }
        });
        
        // نمایش پیام اگر نتیجه‌ای یافت نشد
        const noResultsMessage = document.querySelector('.no-results-message');
        if (!foundResults && searchTerm) {
            if (!noResultsMessage) {
                createNoResultsMessage();
            }
        } else if (noResultsMessage) {
            noResultsMessage.remove();
        }
    });
    
    function highlightText(element, searchTerm) {
        const question = element.querySelector('.faq-question h3');
        const answer = element.querySelector('.faq-answer');
        
        const questionHTML = question.innerHTML;
        const answerHTML = answer.innerHTML;
        
        const regex = new RegExp(searchTerm, 'gi');
        
        const highlightedQuestion = questionHTML.replace(
            regex,
            match => `<span class="search-highlight">${match}</span>`
        );
        
        const highlightedAnswer = answerHTML.replace(
            regex,
            match => `<span class="search-highlight">${match}</span>`
        );
        
        question.innerHTML = highlightedQuestion;
        answer.innerHTML = highlightedAnswer;
    }
    
    function removeHighlight(element) {
        const question = element.querySelector('.faq-question h3');
        const answer = element.querySelector('.faq-answer');
        
        // حذف highlight
        const highlightedSpans = element.querySelectorAll('.search-highlight');
        highlightedSpans.forEach(span => {
            const text = span.textContent;
            span.replaceWith(text);
        });
    }
    
    function createNoResultsMessage() {
        const container = document.querySelector('.faq-container');
        const message = document.createElement('div');
        message.className = 'no-results-message';
        message.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>هیچ سوالی یافت نشد</h3>
                <p>متأسفانه هیچ سوالی مطابق با جستجوی شما یافت نشد.</p>
                <button class="btn clear-search">پاک کردن جستجو</button>
            </div>
        `;
        
        container.parentNode.insertBefore(message, container);
        
        // دکمه پاک کردن جستجو
        message.querySelector('.clear-search').addEventListener('click', function() {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            searchInput.focus();
        });
    }
}

function initCategories() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const faqItems = document.querySelectorAll('.faq-item');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // حذف active از همه دکمه‌ها
            categoryBtns.forEach(b => b.classList.remove('active'));
            // اضافه کردن active به دکمه کلیک شده
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // فیلتر سوالات
            faqItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // پاک کردن جستجو
            const searchInput = document.getElementById('faqSearch');
            if (searchInput) {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
            }
        });
    });
}

// تابع کلیک بر روی سوالات
function setupFAQClick() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            // بستن سایر سوالات
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    const otherAnswer = otherQuestion.nextElementSibling;
                    const otherIcon = otherQuestion.querySelector('i');
                    otherAnswer.style.maxHeight = null;
                    otherAnswer.style.padding = '0 2rem';
                    otherIcon.classList.remove('fa-chevron-up');
                    otherIcon.classList.add('fa-chevron-down');
                    otherQuestion.classList.remove('active');
                }
            });
            
            // باز یا بسته کردن سوال فعلی
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
                answer.style.padding = '0 2rem';
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
                this.classList.remove('active');
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.padding = '2rem';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
                this.classList.add('active');
                
                // اسکرول به سوال اگر خارج از دید باشد
                const rect = this.getBoundingClientRect();
                if (rect.top < 100 || rect.bottom > window.innerHeight - 100) {
                    this.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }
        });
    });
}

// Initialize when page loads
window.addEventListener('load', function() {
    setupFAQClick();
    
    // Add CSS for search highlight
    const style = document.createElement('style');
    style.textContent = `
        .search-highlight {
            background-color: rgba(255, 215, 0, 0.3);
            padding: 0.2rem 0.4rem;
            border-radius: 0.3rem;
            color: var(--accent);
            font-weight: 600;
        }
        
        .no-results-message {
            text-align: center;
            padding: 4rem 2rem;
            background: var(--light);
            border-radius: 1rem;
            margin-bottom: 2rem;
            border: 1px solid var(--border);
        }
        
        .no-results-message .empty-state i {
            font-size: 4rem;
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
            opacity: 0.5;
        }
        
        .no-results-message .empty-state h3 {
            font-size: 2rem;
            color: var(--text);
            margin-bottom: 1rem;
        }
        
        .no-results-message .empty-state p {
            font-size: 1.4rem;
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
        }
        
        .no-results-message .clear-search {
            background: var(--primary);
            color: white;
            border: none;
            padding: 0.8rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-size: 1.4rem;
        }
    `;
    document.head.appendChild(style);
});