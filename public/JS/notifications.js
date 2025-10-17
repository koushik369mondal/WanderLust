// Real-time Notification System JavaScript
class NotificationManager {
    constructor() {
        this.socket = null;
        this.currentUserId = null;
        this.unreadCount = 0;
        this.toastContainer = null;
        this.init();
    }

    init() {
        // Initialize Socket.io connection
        this.initSocket();
        
        // Initialize DOM elements
        this.initDOM();
        
        // Bind event listeners
        this.bindEvents();
        
        // Request notification permissions
        this.requestNotificationPermission();
        
        console.log('📢 Notification Manager initialized');
    }

    initSocket() {
        // Initialize Socket.io connection
        this.socket = io();
        
        this.socket.on('connect', () => {
            console.log('🔌 Connected to notification server');
            
            // Authenticate user if logged in
            if (this.currentUserId) {
                this.socket.emit('authenticate', this.currentUserId);
            }
            
            // Request current unread count
            if (this.currentUserId) {
                this.socket.emit('get_unread_count', this.currentUserId);
            }
        });

        this.socket.on('disconnect', () => {
            console.log('🔌 Disconnected from notification server');
        });

        // Listen for new notifications
        this.socket.on('new_notification', (notification) => {
            console.log('🔔 New notification received:', notification);
            this.handleNewNotification(notification);
        });

        // Listen for unread count updates
        this.socket.on('unread_count_update', (count) => {
            console.log('📊 Unread count updated:', count);
            this.updateUnreadCount(count);
        });

        // Handle notification read response
        this.socket.on('notification_read_response', (response) => {
            if (response.success) {
                console.log('✅ Notification marked as read');
            }
        });
    }

    initDOM() {
        // Get current user ID from DOM or global variable
        const userElement = document.querySelector('[data-user-id]');
        if (userElement) {
            this.currentUserId = userElement.getAttribute('data-user-id');
        }

        // Initialize toast container
        this.toastContainer = document.getElementById('notificationToastContainer');
        if (!this.toastContainer) {
            this.toastContainer = this.createToastContainer();
        }

        // Initialize notification badge
        this.initNotificationBadge();
    }

    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'notificationToastContainer';
        container.className = 'position-fixed top-0 end-0 p-3';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
        return container;
    }

    initNotificationBadge() {
        // Create notification icon in navbar if it doesn't exist
        const navbar = document.querySelector('.navbar');
        if (navbar && this.currentUserId) {
            let notificationIcon = navbar.querySelector('.notification-badge');
            
            if (!notificationIcon) {
                const navLinks = navbar.querySelector('.navbar-nav');
                if (navLinks) {
                    const iconHTML = `
                        <li class="nav-item notification-badge me-2" id="notificationIcon">
                            <a class="nav-link position-relative" href="/notifications" title="Notifications">
                                <i class="fas fa-bell"></i>
                                <span id="notificationCount" class="badge bg-danger d-none"></span>
                            </a>
                        </li>
                    `;
                    navLinks.insertAdjacentHTML('beforeend', iconHTML);
                    notificationIcon = navbar.querySelector('.notification-badge');
                }
            }

            // Add click handler for notification dropdown (optional)
            if (notificationIcon) {
                notificationIcon.addEventListener('click', (e) => {
                    if (e.target.closest('a').getAttribute('href') === '/notifications') {
                        return; // Let the link work normally
                    }
                    e.preventDefault();
                    this.toggleNotificationDropdown();
                });
            }
        }
    }

    bindEvents() {
        // Mark as read buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.mark-read-btn')) {
                const btn = e.target.closest('.mark-read-btn');
                const notificationId = btn.getAttribute('data-id');
                this.markAsRead(notificationId);
            }
        });

        // Dismiss notification buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.dismiss-btn')) {
                const btn = e.target.closest('.dismiss-btn');
                const notificationId = btn.getAttribute('data-id');
                this.dismissNotification(notificationId);
            }
        });

        // Mark all as read button
        const markAllReadBtn = document.getElementById('markAllRead');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', () => {
                this.markAllAsRead();
            });
        }

        // Test notification button
        const testBtn = document.getElementById('testNotification');
        if (testBtn) {
            testBtn.addEventListener('click', () => {
                this.sendTestNotification();
            });
        }

        // Notification item clicks (redirect to URL)
        document.addEventListener('click', (e) => {
            const notificationItem = e.target.closest('.notification-item');
            if (notificationItem && !e.target.closest('.notification-actions')) {
                const url = notificationItem.getAttribute('data-url');
                const notificationId = notificationItem.getAttribute('data-id');
                
                // Mark as read first
                if (notificationItem.classList.contains('unread')) {
                    this.markAsRead(notificationId, false); // Don't show success message
                }
                
                // Navigate to URL if it exists and is not root
                if (url && url !== '/') {
                    window.location.href = url;
                }
            }
        });
    }

    handleNewNotification(notification) {
        // Update unread count
        this.unreadCount++;
        this.updateUnreadCount(this.unreadCount);

        // Show toast notification
        this.showToast(notification);

        // Show browser notification if permitted
        this.showBrowserNotification(notification);

        // Add to notifications list if on notifications page
        this.addToNotificationsList(notification);
    }

    showToast(notification) {
        const toastId = 'toast_' + Date.now();
        const toastHTML = `
            <div id="${toastId}" class="toast notification-toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true" data-bs-delay="5000">
                <div class="toast-header">
                    <i class="fas fa-bell me-2"></i>
                    <strong class="me-auto">${this.escapeHtml(notification.title)}</strong>
                    <small class="text-muted">${notification.timeAgo || 'Just now'}</small>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${this.escapeHtml(notification.message)}
                    ${notification.data && notification.data.url && notification.data.url !== '/' ? 
                        `<div class="mt-2">
                            <a href="${notification.data.url}" class="btn btn-sm btn-primary">View</a>
                        </div>` : ''}
                </div>
            </div>
        `;

        this.toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement);
        toast.show();

        // Remove toast element after it's hidden
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    showBrowserNotification(notification) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const browserNotification = new Notification(notification.title, {
                body: notification.message,
                icon: '/images/wanderlust-icon.png',
                badge: '/images/wanderlust-badge.png',
                tag: notification.id,
                requireInteraction: notification.priority === 'urgent'
            });

            browserNotification.onclick = () => {
                window.focus();
                if (notification.data && notification.data.url && notification.data.url !== '/') {
                    window.location.href = notification.data.url;
                } else {
                    window.location.href = '/notifications';
                }
                browserNotification.close();
            };

            // Auto-close after 10 seconds
            setTimeout(() => {
                browserNotification.close();
            }, 10000);
        }
    }

    addToNotificationsList(notification) {
        const notificationsList = document.getElementById('notificationsList');
        if (notificationsList) {
            const notificationHTML = this.createNotificationHTML(notification);
            notificationsList.insertAdjacentHTML('afterbegin', notificationHTML);
        }
    }

    createNotificationHTML(notification) {
        let iconClass = 'fas fa-bell';
        let iconColor = 'text-primary';
        
        switch(notification.type) {
            case 'new_review':
                iconClass = 'fas fa-star';
                iconColor = 'text-warning';
                break;
            case 'badge_earned':
                iconClass = 'fas fa-trophy';
                iconColor = 'text-success';
                break;
            case 'listing_liked':
                iconClass = 'fas fa-heart';
                iconColor = 'text-danger';
                break;
            case 'wishlist_item_discount':
                iconClass = 'fas fa-tag';
                iconColor = 'text-info';
                break;
            case 'system_announcement':
                iconClass = 'fas fa-bullhorn';
                iconColor = 'text-secondary';
                break;
            case 'welcome':
                iconClass = 'fas fa-hand-paper';
                iconColor = 'text-success';
                break;
        }

        return `
            <div class="notification-item unread ${notification.priority}" 
                 data-id="${notification.id}" 
                 data-url="${notification.data?.url || '/'}">
                
                <div class="notification-icon">
                    <i class="${iconClass} ${iconColor}"></i>
                </div>

                <div class="notification-content">
                    <div class="notification-header">
                        <h6 class="notification-title mb-1">${this.escapeHtml(notification.title)}</h6>
                        <span class="notification-time text-muted">${notification.timeAgo || 'Just now'}</span>
                    </div>
                    
                    <p class="notification-message mb-2">${this.escapeHtml(notification.message)}</p>
                    
                    ${notification.sender ? `
                        <div class="notification-sender">
                            <small class="text-muted">
                                From: <strong>${this.escapeHtml(notification.sender.username)}</strong>
                            </small>
                        </div>
                    ` : ''}
                </div>

                <div class="notification-actions">
                    <button class="btn btn-sm btn-outline-primary mark-read-btn" 
                            data-id="${notification.id}">
                        <i class="fas fa-check"></i>
                    </button>
                    
                    <button class="btn btn-sm btn-outline-danger dismiss-btn" 
                            data-id="${notification.id}">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    ${notification.data?.url && notification.data.url !== '/' ? `
                        <a href="${notification.data.url}" 
                           class="btn btn-sm btn-outline-secondary">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                    ` : ''}
                </div>

                ${notification.priority === 'high' || notification.priority === 'urgent' ? `
                    <div class="priority-indicator ${notification.priority}"></div>
                ` : ''}
            </div>
        `;
    }

    updateUnreadCount(count) {
        this.unreadCount = count;
        const badge = document.getElementById('notificationCount');
        
        if (badge) {
            if (count > 0) {
                badge.textContent = count > 99 ? '99+' : count;
                badge.classList.remove('d-none');
            } else {
                badge.classList.add('d-none');
            }
        }

        // Update page title if there are unread notifications
        if (count > 0) {
            document.title = `(${count}) ${document.title.replace(/^\(\d+\)\s/, '')}`;
        } else {
            document.title = document.title.replace(/^\(\d+\)\s/, '');
        }
    }

    async markAsRead(notificationId, showMessage = true) {
        try {
            const response = await fetch(`/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            
            if (result.success) {
                // Update UI
                const notificationElement = document.querySelector(`[data-id="${notificationId}"]`);
                if (notificationElement) {
                    notificationElement.classList.remove('unread');
                    notificationElement.classList.add('read');
                    
                    // Remove unread indicator
                    const unreadIndicator = notificationElement.querySelector('::before');
                    if (unreadIndicator) {
                        notificationElement.style.setProperty('--before-display', 'none');
                    }
                    
                    // Hide mark as read button
                    const markReadBtn = notificationElement.querySelector('.mark-read-btn');
                    if (markReadBtn) {
                        markReadBtn.style.display = 'none';
                    }
                }

                if (showMessage) {
                    this.showAlert('Notification marked as read', 'success');
                }
            } else {
                if (showMessage) {
                    this.showAlert('Error marking notification as read', 'error');
                }
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
            if (showMessage) {
                this.showAlert('Error marking notification as read', 'error');
            }
        }
    }

    async markAllAsRead() {
        try {
            const response = await fetch('/notifications/read-all', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            
            if (result.success) {
                // Update all unread notifications in UI
                const unreadNotifications = document.querySelectorAll('.notification-item.unread');
                unreadNotifications.forEach(notification => {
                    notification.classList.remove('unread');
                    notification.classList.add('read');
                    
                    const markReadBtn = notification.querySelector('.mark-read-btn');
                    if (markReadBtn) {
                        markReadBtn.style.display = 'none';
                    }
                });

                // Hide "Mark All as Read" button
                const markAllBtn = document.getElementById('markAllRead');
                if (markAllBtn) {
                    markAllBtn.style.display = 'none';
                }

                this.showAlert('All notifications marked as read', 'success');
            } else {
                this.showAlert('Error marking notifications as read', 'error');
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            this.showAlert('Error marking notifications as read', 'error');
        }
    }

    async dismissNotification(notificationId) {
        try {
            const response = await fetch(`/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            
            if (result.success) {
                // Remove notification from UI
                const notificationElement = document.querySelector(`[data-id="${notificationId}"]`);
                if (notificationElement) {
                    notificationElement.style.opacity = '0';
                    notificationElement.style.transform = 'translateX(100%)';
                    
                    setTimeout(() => {
                        notificationElement.remove();
                    }, 300);
                }

                this.showAlert('Notification dismissed', 'success');
            } else {
                this.showAlert('Error dismissing notification', 'error');
            }
        } catch (error) {
            console.error('Error dismissing notification:', error);
            this.showAlert('Error dismissing notification', 'error');
        }
    }

    async sendTestNotification() {
        try {
            const response = await fetch('/notifications/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: 'Test Notification',
                    message: 'This is a test notification from the WanderLust notification system!',
                    type: 'system_announcement'
                })
            });

            const result = await response.json();
            
            if (result.success) {
                this.showAlert('Test notification sent!', 'success');
            } else {
                this.showAlert('Error sending test notification', 'error');
            }
        } catch (error) {
            console.error('Error sending test notification:', error);
            this.showAlert('Error sending test notification', 'error');
        }
    }

    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                console.log('📱 Notification permission:', permission);
            });
        }
    }

    showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type === 'error' ? 'danger' : 'success'} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 300px;';
        
        // Safely set text content to prevent XSS
        const messageSpan = document.createElement('span');
        messageSpan.textContent = message; // Use textContent instead of innerHTML
        
        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'btn-close';
        closeButton.setAttribute('data-bs-dismiss', 'alert');
        
        alertDiv.appendChild(messageSpan);
        alertDiv.appendChild(closeButton);
        
        document.body.appendChild(alertDiv);
        
        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    toggleNotificationDropdown() {
        // Implementation for notification dropdown (optional)
        // This would show a quick preview of recent notifications
        console.log('🔔 Toggle notification dropdown');
    }
}

// Initialize notification manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if user is logged in
    const userElement = document.querySelector('[data-user-id]') || 
                       (window.currentUser && window.currentUser._id ? { getAttribute: () => window.currentUser._id } : null);
    
    if (userElement) {
        window.notificationManager = new NotificationManager();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationManager;
}