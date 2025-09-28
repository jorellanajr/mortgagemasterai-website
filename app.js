// Application State
let currentSiteMode = 'marketing'; // 'marketing' or 'demo'
let currentDemoSection = 'dashboard';
let selectedPlan = 'professional';

// Sample data for demo
const sampleLeads = [
    {
        id: 1,
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "(555) 123-4567",
        loanAmount: 450000,
        propertyType: "Primary Residence",
        creditScore: 740,
        status: "New",
        source: "Facebook Ads",
        aiScore: "Hot",
        lastContact: "2025-09-27",
        nextAction: "Initial call scheduled"
    },
    {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "(555) 987-6543",
        loanAmount: 325000,
        propertyType: "Investment",
        creditScore: 680,
        status: "Qualified",
        source: "Referral",
        aiScore: "Warm",
        lastContact: "2025-09-25",
        nextAction: "Send loan options"
    },
    {
        id: 3,
        name: "Mike Davis",
        email: "mike.davis@email.com",
        phone: "(555) 456-7890",
        loanAmount: 275000,
        propertyType: "Primary Residence",
        creditScore: 720,
        status: "In Process",
        source: "Google Ads",
        aiScore: "Hot",
        lastContact: "2025-09-26",
        nextAction: "Collect documents"
    },
    {
        id: 4,
        name: "Lisa Wilson",
        email: "lisa.wilson@email.com",
        phone: "(555) 555-1234",
        loanAmount: 520000,
        propertyType: "Primary Residence",
        creditScore: 760,
        status: "Contacted",
        source: "Instagram",
        aiScore: "Hot",
        lastContact: "2025-09-26",
        nextAction: "Schedule application meeting"
    },
    {
        id: 5,
        name: "Robert Taylor",
        email: "robert.t@email.com",
        phone: "(555) 777-8888",
        loanAmount: 180000,
        propertyType: "Condo",
        creditScore: 650,
        status: "Qualified",
        source: "Website",
        aiScore: "Warm",
        lastContact: "2025-09-24",
        nextAction: "Review credit report"
    }
];

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize marketing site interactions
    initializeMarketingSite();
    
    // Initialize demo platform
    initializeDemo();
    
    // Initialize modals
    initializeModals();
    
    // Set initial state to marketing site
    showMarketingSite();
}

// Marketing Site Functions
function initializeMarketingSite() {
    // Hero CTA buttons
    const getStartedBtn = document.getElementById('get-started-btn');
    const watchDemoBtn = document.getElementById('watch-demo-btn');
    const demoBtnNav = document.getElementById('demo-btn');
    const finalCtaBtn = document.getElementById('final-cta-btn');
    
    if (getStartedBtn) getStartedBtn.addEventListener('click', showSignupModal);
    if (watchDemoBtn) watchDemoBtn.addEventListener('click', showDemo);
    if (demoBtnNav) demoBtnNav.addEventListener('click', showDemo);
    if (finalCtaBtn) finalCtaBtn.addEventListener('click', showSignupModal);
    
    // Pricing plan buttons
    const signupBtns = document.querySelectorAll('.signup-btn');
    signupBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            selectedPlan = this.dataset.plan || 'professional';
            if (selectedPlan === 'enterprise') {
                // Handle enterprise contact sales
                alert('Enterprise sales contact functionality would be implemented here');
            } else {
                showSignupModal();
            }
        });
    });
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Demo Platform Functions
function initializeDemo() {
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            if (section) {
                showDemoSection(section);
                updateNavigation(this);
            }
        });
    });
    
    // Back to site button
    const backToSiteBtn = document.getElementById('back-to-site-btn');
    if (backToSiteBtn) {
        backToSiteBtn.addEventListener('click', showMarketingSite);
    }
    
    // Signup from demo buttons
    const signupFromDemoBtn = document.getElementById('signup-from-demo-btn');
    const signupNoticeBtn = document.getElementById('signup-notice-btn');
    
    if (signupFromDemoBtn) signupFromDemoBtn.addEventListener('click', showSignupModal);
    if (signupNoticeBtn) signupNoticeBtn.addEventListener('click', showSignupModal);
    
    // Initialize charts
    initializeCharts();
}

function showMarketingSite() {
    currentSiteMode = 'marketing';
    document.getElementById('marketing-site').classList.add('active');
    document.getElementById('platform-demo').classList.remove('active');
}

function showDemo() {
    currentSiteMode = 'demo';
    document.getElementById('marketing-site').classList.remove('active');
    document.getElementById('platform-demo').classList.add('active');
    
    // Show dashboard by default
    showDemoSection('dashboard');
}

function showDemoSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show target section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        currentDemoSection = sectionName;
    }
}

function updateNavigation(activeItem) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    activeItem.classList.add('active');
}

// Modal Functions
function initializeModals() {
    // Close modal buttons
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    // Close modal on outside click
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModals();
            }
        });
    });
    
    // Signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupSubmission);
    }
    
    // Explore platform button in success modal
    const explorePlatformBtn = document.getElementById('explore-platform-btn');
    if (explorePlatformBtn) {
        explorePlatformBtn.addEventListener('click', function() {
            closeModals();
            showDemo();
        });
    }
}

function showSignupModal() {
    const modal = document.getElementById('signup-modal');
    const planSelect = document.getElementById('plan');
    
    if (modal) {
        // Set the selected plan in the form
        if (planSelect) {
            planSelect.value = selectedPlan;
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.classList.remove('active'));
    document.body.style.overflow = 'auto';
}

function handleSignupSubmission(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData);
    
    // Basic validation (you'd implement proper validation)
    if (!userData.firstName || !userData.email || !userData.terms) {
        alert('Please fill in all required fields and accept the terms.');
        return;
    }
    
    // Simulate API call
    console.log('User signup data:', userData);
    
    // Show loading state (you'd implement this)
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;
    
    // Simulate successful signup after 2 seconds
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Close signup modal and show success
        document.getElementById('signup-modal').classList.remove('active');
        showSuccessModal();
        
        // In a real app, you'd redirect to dashboard or send confirmation email
    }, 2000);
}

// Chart Initialization
function initializeCharts() {
    // Only initialize charts if Chart.js is available and we're in demo mode
    if (typeof Chart === 'undefined') return;
    
    // Conversion Funnel Chart
    const conversionCtx = document.getElementById('conversionChart');
    if (conversionCtx) {
        new Chart(conversionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Qualified Leads', 'Applications', 'Approvals', 'Closings'],
                datasets: [{
                    data: [100, 75, 60, 45],
                    backgroundColor: [
                        '#3b82f6',
                        '#fbbf24',
                        '#10b981',
                        '#1f334b'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Revenue Growth Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue',
                    data: [12000, 15000, 13000, 18000, 19000, 21500],
                    borderColor: '#fbbf24',
                    backgroundColor: 'rgba(251, 191, 36, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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
                                return '$' + (value / 1000) + 'K';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function formatPhoneNumber(phone) {
    // Basic phone formatting
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key closes modals
    if (e.key === 'Escape') {
        closeModals();
    }
    
    // Demo navigation shortcuts
    if (currentSiteMode === 'demo') {
        switch(e.key) {
            case '1':
                showDemoSection('dashboard');
                break;
            case '2':
                showDemoSection('leads');
                break;
            case '3':
                showDemoSection('ai-tools');
                break;
            case '4':
                showDemoSection('client-portal');
                break;
            case '5':
                showDemoSection('analytics');
                break;
            case '6':
                showDemoSection('settings');
                break;
        }
    }
});

// Smooth scrolling utility
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Form validation utilities
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
}

// Animation utilities
function fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        element.style.opacity = progress;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

function fadeOut(element, duration = 300) {
    let start = performance.now();
    const initialOpacity = parseFloat(window.getComputedStyle(element).opacity);
    
    function animate(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        element.style.opacity = initialOpacity * (1 - progress);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.style.display = 'none';
        }
    }
    
    requestAnimationFrame(animate);
}

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatCurrency,
        formatDate,
        formatPhoneNumber,
        validateEmail,
        validatePhone
    };
}