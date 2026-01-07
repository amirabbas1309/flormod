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