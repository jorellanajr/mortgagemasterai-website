// Application State
let currentSection = 'dashboard';
let leads = [
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
    }
];

let isDragging = false;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeKanban();
    initializeModals();
    initializeTabs();
    initializeToggleSwitches();
    initializeCharts();
    initializeLeadActions();
    updateLeadCounts();
});

// Navigation System
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.dataset.section;
            
            // Update navigation state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Update section visibility
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetSection).classList.add('active');
            
            currentSection = targetSection;

            // Trigger chart resize if switching to analytics
            if (targetSection === 'analytics') {
                setTimeout(() => {
                    Object.values(Chart.instances).forEach(chart => {
                        if (chart) chart.resize();
                    });
                }, 100);
            }
        });
    });
}

// Kanban Board Functionality
function initializeKanban() {
    const leadCards = document.querySelectorAll('.lead-card');
    const leadsContainers = document.querySelectorAll('.leads-container');

    leadCards.forEach(card => {
        card.draggable = true;
        
        card.addEventListener('dragstart', function(e) {
            isDragging = true;
            e.dataTransfer.setData('text/plain', this.dataset.id);
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        card.addEventListener('dragend', function() {
            isDragging = false;
            this.classList.remove('dragging');
        });

        // Click to open modal (only when not dragging)
        card.addEventListener('click', function(e) {
            if (!isDragging && !e.target.classList.contains('btn-icon')) {
                setTimeout(() => {
                    if (!isDragging) {
                        openLeadModal(this.dataset.id);
                    }
                }, 50);
            }
        });
    });

    leadsContainers.forEach(container => {
        container.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            this.classList.add('drag-over');
        });

        container.addEventListener('dragleave', function(e) {
            // Only remove drag-over if we're actually leaving the container
            if (!this.contains(e.relatedTarget)) {
                this.classList.remove('drag-over');
            }
        });

        container.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            const leadId = e.dataTransfer.getData('text/plain');
            const newStatus = this.dataset.status;
            const leadCard = document.querySelector(`[data-id="${leadId}"]`);
            
            if (leadCard && leadCard.parentElement !== this) {
                // Update lead status in data
                const lead = leads.find(l => l.id == leadId);
                if (lead && lead.status !== newStatus) {
                    lead.status = newStatus;
                    
                    // Move card to new container
                    this.appendChild(leadCard);
                    updateLeadCounts();
                    
                    // Show success feedback
                    showNotification(`${lead.name} moved to ${newStatus}`, 'success');
                }
            }
            
            isDragging = false;
        });
    });
}

// Modal System
function initializeModals() {
    const modal = document.getElementById('leadModal');
    const closeBtn = modal.querySelector('.modal-close');
    const backdrop = modal.querySelector('.modal-backdrop');

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

function openLeadModal(leadId) {
    const lead = leads.find(l => l.id == leadId);
    if (!lead) return;

    const modal = document.getElementById('leadModal');
    
    // Populate modal with lead data
    document.getElementById('modalLeadName').textContent = `${lead.name} - Lead Details`;
    document.getElementById('modalEmail').value = lead.email;
    document.getElementById('modalPhone').value = lead.phone;
    document.getElementById('modalLoanAmount').value = `$${lead.loanAmount.toLocaleString()}`;
    document.getElementById('modalPropertyType').value = lead.propertyType;

    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('leadModal').classList.add('hidden');
}

// Tab System
function initializeTabs() {
    const tabGroups = document.querySelectorAll('.portal-tabs, .modal-tabs');
    
    tabGroups.forEach(group => {
        const tabs = group.querySelectorAll('.tab-btn');
        const tabContents = group.parentElement.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetTab = this.dataset.tab;
                
                // Update tab state
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Update content visibility
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === targetTab) {
                        content.classList.add('active');
                    }
                });
            });
        });
    });
}

// Toggle Switches
function initializeToggleSwitches() {
    const toggles = document.querySelectorAll('.toggle-switch input');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const toolCard = this.closest('.tool-card');
            const toolName = toolCard.querySelector('h3').textContent;
            const isEnabled = this.checked;
            
            if (toolCard) {
                if (isEnabled) {
                    toolCard.classList.add('active');
                    showNotification(`${toolName} activated`, 'success');
                } else {
                    toolCard.classList.remove('active');
                    showNotification(`${toolName} deactivated`, 'info');
                }
            }
        });
    });
}

// Charts Initialization
function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                datasets: [{
                    label: 'Revenue',
                    data: [15000, 18000, 16000, 22000, 19000, 25000, 23000, 21500, 21500],
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Monthly Revenue Trend'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    // Conversion Funnel Chart
    const conversionCtx = document.getElementById('conversionChart');
    if (conversionCtx) {
        new Chart(conversionCtx, {
            type: 'bar',
            data: {
                labels: ['Leads', 'Contacted', 'Qualified', 'In Process', 'Closed'],
                datasets: [{
                    label: 'Count',
                    data: [100, 75, 45, 30, 24],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Conversion Funnel'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Lead Sources Chart
    const leadSourceCtx = document.getElementById('leadSourceChart');
    if (leadSourceCtx) {
        new Chart(leadSourceCtx, {
            type: 'doughnut',
            data: {
                labels: ['Referrals', 'Google Ads', 'Facebook Ads', 'Website', 'Other'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Lead Sources'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Lead Actions
function initializeLeadActions() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-icon')) {
            e.stopPropagation();
            const leadCard = e.target.closest('.lead-card');
            const leadId = leadCard.dataset.id;
            const lead = leads.find(l => l.id == leadId);
            
            if (e.target.title === 'Call') {
                showNotification(`Calling ${lead.name}...`, 'info');
            } else if (e.target.title === 'Email') {
                showNotification(`Opening email to ${lead.name}...`, 'info');
            } else if (e.target.title === 'Notes') {
                openLeadModal(leadId);
            }
        }
    });

    // Quick action buttons
    const quickActions = document.querySelectorAll('.action-btn');
    quickActions.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            
            // Only show notification for specific buttons that don't conflict with drag
            if (action.includes('Add New Lead') || action.includes('Schedule Follow-up') || 
                action.includes('Generate Report') || action.includes('AI Assistant')) {
                showNotification(`${action} feature opened`, 'info');
            }
        });
    });
}

// Utility Functions
function updateLeadCounts() {
    const statusCounts = {};
    
    // Initialize counts
    ['New', 'Contacted', 'Qualified', 'In Process', 'Closed', 'Dead'].forEach(status => {
        statusCounts[status] = 0;
    });
    
    // Count leads by status
    leads.forEach(lead => {
        statusCounts[lead.status] = (statusCounts[lead.status] || 0) + 1;
    });
    
    // Update UI
    Object.keys(statusCounts).forEach(status => {
        const column = document.querySelector(`[data-status="${status}"]`);
        if (column) {
            const countElement = column.querySelector('.lead-count');
            if (countElement) {
                countElement.textContent = statusCounts[status];
            }
        }
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 16px',
        backgroundColor: type === 'success' ? 'var(--color-success)' : 
                        type === 'error' ? 'var(--color-error)' : 
                        type === 'warning' ? 'var(--color-warning)' : 'var(--color-info)',
        color: 'white',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '300px',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });

    // Style close button
    const closeBtn = notification.querySelector('.notification-close');
    Object.assign(closeBtn.style, {
        background: 'none',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        fontSize: '18px',
        padding: '0',
        marginLeft: '8px'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    closeBtn.addEventListener('click', () => removeNotification(notification));
    
    // Auto remove after 3 seconds
    setTimeout(() => removeNotification(notification), 3000);
}

function removeNotification(notification) {
    if (notification && notification.parentElement) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 300);
    }
}

// Form Interactions
document.addEventListener('change', function(e) {
    if (e.target.classList.contains('form-control')) {
        // Add form validation feedback here
        e.target.classList.add('touched');
    }
});

// Rate Card Selection
document.addEventListener('click', function(e) {
    if (e.target.closest('.rate-card')) {
        const rateCard = e.target.closest('.rate-card');
        const allRateCards = document.querySelectorAll('.rate-card');
        
        allRateCards.forEach(card => card.classList.remove('selected'));
        rateCard.classList.add('selected');
        
        const rateName = rateCard.querySelector('h4').textContent;
        showNotification(`Selected ${rateName} rate option`, 'success');
    }
});

// Client Selection
document.addEventListener('click', function(e) {
    if (e.target.closest('.client-item')) {
        const clientItem = e.target.closest('.client-item');
        const allClientItems = document.querySelectorAll('.client-item');
        
        allClientItems.forEach(item => item.classList.remove('active'));
        clientItem.classList.add('active');
        
        const clientName = clientItem.querySelector('h4').textContent;
        showNotification(`Viewing ${clientName}'s details`, 'info');
    }
});

// Tool Configuration
document.addEventListener('click', function(e) {
    if (e.target.textContent === 'Configure' && e.target.classList.contains('btn')) {
        const toolCard = e.target.closest('.tool-card');
        const toolName = toolCard.querySelector('h3').textContent;
        showNotification(`Opening ${toolName} configuration...`, 'info');
    }
});

// Settings Form Handling
document.addEventListener('click', function(e) {
    if (e.target.textContent === 'Save Changes' || 
        e.target.textContent === 'Upgrade Plan') {
        e.preventDefault();
        showNotification('Changes saved successfully!', 'success');
    }
});

// Header Add Lead Button
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn--primary') && e.target.textContent.includes('Add Lead')) {
        showNotification('Add Lead form would open here', 'info');
    }
});

// Search and Filter (placeholder for future enhancement)
function initializeSearch() {
    // This would handle search functionality
    // Implementation would depend on specific search requirements
}

// Export functionality for reports
function exportReport(type) {
    showNotification(`Exporting ${type} report...`, 'info');
    // Implementation would handle actual export logic
}

// Real-time updates simulation
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Simulate receiving new leads or status updates
        // This would integrate with real backend APIs
    }, 30000);
}

// Initialize real-time features
// simulateRealTimeUpdates();

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    showNotification('An error occurred. Please try again.', 'error');
});

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`Application loaded in ${Math.round(loadTime)}ms`);
});