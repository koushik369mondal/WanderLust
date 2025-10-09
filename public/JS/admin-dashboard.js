// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Chart.js default configuration
    Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#6c757d';
    
    // Load quick stats and engagement metrics
    async function loadQuickStats() {
        try {
            const [statsResponse, engagementResponse] = await Promise.all([
                fetch('/admin/api/analytics/quick-stats'),
                fetch('/admin/api/analytics/engagement-metrics')
            ]);
            
            const stats = await statsResponse.json();
            const engagement = await engagementResponse.json();
            
            // Update stat cards
            updateStatCard('totalUsers', stats.totalUsers);
            updateStatCard('totalListings', stats.totalListings);
            updateStatCard('totalReviews', stats.totalReviews);
            updateStatCard('avgRating', stats.avgRating);
            updateStatCard('activeUsers', engagement.activeUsers);
            
            // Update growth indicators
            updateGrowthIndicator('userGrowth', `+${stats.newUsersThisMonth} this month`, stats.newUsersThisMonth > 0);
            updateGrowthIndicator('listingGrowth', `+${stats.newListingsThisMonth} this month`, stats.newListingsThisMonth > 0);
            updateGrowthIndicator('reviewGrowth', `${stats.growthRate}% growth`, stats.growthRate > 0);
            
        } catch (error) {
            console.error('Error loading quick stats:', error);
            showError('Failed to load dashboard statistics');
        }
    }

    // Helper function to update stat cards
    function updateStatCard(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = typeof value === 'number' ? value.toLocaleString() : value;
        }
    }

    // Helper function to update growth indicators
    function updateGrowthIndicator(elementId, text, isPositive) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
            element.classList.toggle('positive', isPositive);
            element.classList.toggle('negative', !isPositive && text.includes('-'));
        }
    }

    // Load user growth chart
    async function loadUserGrowthChart() {
        try {
            const response = await fetch('/admin/api/analytics/user-growth');
            const data = await response.json();
            
            const ctx = document.getElementById('userGrowthChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map(item => formatMonth(item.month)),
                    datasets: [{
                        label: 'New Users',
                        data: data.map(item => item.users),
                        borderColor: '#fe424d',
                        backgroundColor: 'rgba(254, 66, 77, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#fe424d',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    }]
                },
                options: getLineChartOptions('New Users', '#fe424d')
            });
        } catch (error) {
            console.error('Error loading user growth chart:', error);
            showChartError('userGrowthChart');
        }
    }

    // Load review trends chart
    async function loadReviewTrendsChart() {
        try {
            const response = await fetch('/admin/api/analytics/review-trends');
            const data = await response.json();
            
            const ctx = document.getElementById('reviewTrendsChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map(item => formatMonth(item.month)),
                    datasets: [{
                        label: 'Reviews',
                        data: data.map(item => item.reviews),
                        borderColor: '#4facfe',
                        backgroundColor: 'rgba(79, 172, 254, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#4facfe',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    }]
                },
                options: getLineChartOptions('Reviews', '#4facfe')
            });
        } catch (error) {
            console.error('Error loading review trends chart:', error);
            showChartError('reviewTrendsChart');
        }
    }

    // Load top destinations chart
    async function loadTopDestinationsChart() {
        try {
            const response = await fetch('/admin/api/analytics/top-destinations');
            const data = await response.json();
            
            const ctx = document.getElementById('topDestinationsChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.map(item => item._id || 'Unknown'),
                    datasets: [{
                        label: 'Average Rating',
                        data: data.map(item => item.avgRating),
                        backgroundColor: generateColors(data.length),
                        borderRadius: 6,
                        borderSkipped: false
                    }]
                },
                options: getBarChartOptions('Average Rating', 5)
            });
        } catch (error) {
            console.error('Error loading top destinations chart:', error);
            showChartError('topDestinationsChart');
        }
    }

    // Load top contributors chart
    async function loadTopContributorsChart() {
        try {
            const response = await fetch('/admin/api/analytics/top-contributors');
            const data = await response.json();
            
            const ctx = document.getElementById('topContributorsChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.map(item => item.username),
                    datasets: [{
                        label: 'Total Contributions',
                        data: data.map(item => item.totalContributions),
                        backgroundColor: generateColors(data.length, 'contributors'),
                        borderRadius: 6,
                        borderSkipped: false
                    }]
                },
                options: getBarChartOptions('Total Contributions')
            });
        } catch (error) {
            console.error('Error loading top contributors chart:', error);
            showChartError('topContributorsChart');
        }
    }

    // Load category distribution chart
    async function loadCategoryChart() {
        try {
            const response = await fetch('/admin/api/analytics/engagement-metrics');
            const data = await response.json();
            
            const ctx = document.getElementById('categoryChart').getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: data.topCategories.map(item => item._id || 'Other'),
                    datasets: [{
                        data: data.topCategories.map(item => item.count),
                        backgroundColor: [
                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                            '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
                        ],
                        borderWidth: 3,
                        borderColor: '#fff',
                        hoverBorderWidth: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true,
                                font: {
                                    size: 11
                                }
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: '#fe424d',
                            borderWidth: 1,
                            cornerRadius: 8,
                            displayColors: true
                        }
                    },
                    cutout: '60%'
                }
            });
        } catch (error) {
            console.error('Error loading category chart:', error);
            showChartError('categoryChart');
        }
    }

    // Load revenue metrics chart
    async function loadRevenueChart() {
        try {
            const response = await fetch('/admin/api/analytics/revenue-metrics');
            const data = await response.json();
            
            const ctx = document.getElementById('revenueChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map(item => formatMonth(item.month)),
                    datasets: [{
                        label: 'Avg Price (₹)',
                        data: data.map(item => item.avgPrice),
                        borderColor: '#28a745',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y'
                    }, {
                        label: 'New Listings',
                        data: data.map(item => item.listings),
                        borderColor: '#007bff',
                        backgroundColor: 'rgba(0, 123, 255, 0.1)',
                        tension: 0.4,
                        fill: false,
                        yAxisID: 'y1'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                padding: 20
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: '#fe424d',
                            borderWidth: 1,
                            cornerRadius: 8
                        }
                    },
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Average Price (₹)'
                            },
                            grid: {
                                color: 'rgba(0,0,0,0.1)'
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Number of Listings'
                            },
                            grid: {
                                drawOnChartArea: false,
                            },
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error loading revenue chart:', error);
            showChartError('revenueChart');
        }
    }

    // Update average listing price in stats
    async function updateAvgPrice() {
        try {
            const response = await fetch('/admin/api/analytics/revenue-metrics');
            const data = await response.json();
            if (data.length > 0) {
                const latestData = data[data.length - 1];
                updateStatCard('avgListingPrice', `₹${latestData.avgPrice.toLocaleString()}`);
            }
        } catch (error) {
            console.error('Error loading avg price:', error);
        }
    }

    // Helper functions
    function formatMonth(monthStr) {
        const [year, month] = monthStr.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }

    function generateColors(count, type = 'default') {
        const colorSets = {
            default: ['#f093fb', '#f5576c', '#4facfe', '#43e97b', '#ffd93d', '#6c5ce7', '#fd79a8', '#00b894', '#e17055', '#74b9ff'],
            contributors: ['#43e97b', '#38f9d7', '#4facfe', '#f093fb', '#ffd93d', '#6c5ce7', '#fd79a8', '#00b894', '#e17055', '#74b9ff']
        };
        
        const colors = colorSets[type] || colorSets.default;
        return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
    }

    function getLineChartOptions(label, borderColor) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: borderColor,
                    borderWidth: 1,
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        };
    }

    function getBarChartOptions(label, maxValue = null) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: maxValue,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        };
    }

    function showLoading() {
        document.querySelectorAll('.stat-content h3').forEach(el => {
            el.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        });
    }

    function showError(message) {
        console.error(message);
        // You can implement a toast notification here
    }

    function showChartError(chartId) {
        const canvas = document.getElementById(chartId);
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#dc3545';
            ctx.font = '14px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('Failed to load chart', canvas.width / 2, canvas.height / 2);
        }
    }

    // Initialize dashboard
    function initializeDashboard() {
        showLoading();
        
        // Load all data
        loadQuickStats();
        loadUserGrowthChart();
        loadReviewTrendsChart();
        loadTopDestinationsChart();
        loadTopContributorsChart();
        loadCategoryChart();
        loadRevenueChart();
        updateAvgPrice();
    }

    // Auto-refresh data every 5 minutes
    function startAutoRefresh() {
        setInterval(() => {
            loadQuickStats();
            updateAvgPrice();
        }, 300000); // 5 minutes
    }

    // Management Section Variables
    let currentUsersPage = 1;
    let currentListingsPage = 1;
    let currentReviewsPage = 1;
    let usersSearchTimeout;
    let listingsSearchTimeout;
    let reviewsSearchTimeout;

    // Sidebar navigation with section switching
    function initializeSidebar() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.getAttribute('href').substring(1); // Remove #

                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');

                // Hide all sections
                document.querySelectorAll('.management-section').forEach(section => {
                    section.style.display = 'none';
                });

                // Show overview or specific section
                if (target === 'overview') {
                    // Overview is always visible, just scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    const section = document.getElementById(target + '-section');
                    if (section) {
                        section.style.display = 'block';
                        section.scrollIntoView({ behavior: 'smooth' });

                        // Load section data
                        loadSectionData(target);
                    }
                }
            });
        });
    }

    // Load data for specific sections
    function loadSectionData(section) {
        switch(section) {
            case 'users':
                loadUsers();
                break;
            case 'destinations':
                loadListings();
                break;
            case 'reviews':
                loadReviews();
                break;
            case 'settings':
                loadSettings();
                break;
            case 'activity':
                loadActivity();
                break;
        }
    }

    // Users Management Functions
    async function loadUsers(page = 1, search = '', sortBy = 'joinDate', sortOrder = 'desc') {
        try {
            const params = new URLSearchParams({
                page,
                limit: 20,
                search,
                sortBy,
                sortOrder
            });

            const response = await fetch(`/admin/api/users?${params}`);
            const data = await response.json();

            renderUsersTable(data.users);
            renderPagination('users', data.pagination);
        } catch (error) {
            console.error('Error loading users:', error);
            showError('Failed to load users');
        }
    }

    function renderUsersTable(users) {
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.joinDate}</td>
                <td>${user.lastActive}</td>
                <td>
                    <span class="badge ${user.isAdmin ? 'bg-success' : 'bg-secondary'}">
                        ${user.isAdmin ? 'Admin' : 'User'}
                    </span>
                </td>
                <td>${user.vacationSlots || 0}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="toggleAdmin('${user._id}', ${user.isAdmin})">
                            <i class="fa-solid ${user.isAdmin ? 'fa-user-minus' : 'fa-user-plus'}"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteUser('${user._id}', '${user.username}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Listings Management Functions
    async function loadListings(page = 1, search = '', category = '', sortBy = 'createdAt', sortOrder = 'desc') {
        try {
            const params = new URLSearchParams({
                page,
                limit: 20,
                search,
                category,
                sortBy,
                sortOrder
            });

            const response = await fetch(`/admin/api/listings?${params}`);
            const data = await response.json();

            renderListingsTable(data.listings);
            renderPagination('listings', data.pagination);
        } catch (error) {
            console.error('Error loading listings:', error);
            showError('Failed to load listings');
        }
    }

    function renderListingsTable(listings) {
        const tbody = document.getElementById('listingsTableBody');
        tbody.innerHTML = listings.map(listing => `
            <tr>
                <td>${listing.title}</td>
                <td>${listing.location}, ${listing.country}</td>
                <td><span class="badge bg-info">${listing.category}</span></td>
                <td>₹${listing.price.toLocaleString()}</td>
                <td>${listing.owner}</td>
                <td>${listing.reviewCount}</td>
                <td>
                    <span class="badge ${listing.featured ? 'bg-warning' : 'bg-light text-dark'}">
                        ${listing.featured ? 'Featured' : 'Regular'}
                    </span>
                </td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-warning" onclick="toggleFeatured('${listing._id}', ${listing.featured})">
                            <i class="fa-solid ${listing.featured ? 'fa-star-half-stroke' : 'fa-star'}"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteListing('${listing._id}', '${listing.title}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Reviews Management Functions
    async function loadReviews(page = 1, search = '', rating = '', sortBy = 'createdAt', sortOrder = 'desc') {
        try {
            const params = new URLSearchParams({
                page,
                limit: 20,
                search,
                rating,
                sortBy,
                sortOrder
            });

            const response = await fetch(`/admin/api/reviews?${params}`);
            const data = await response.json();

            renderReviewsTable(data.reviews);
            renderPagination('reviews', data.pagination);
        } catch (error) {
            console.error('Error loading reviews:', error);
            showError('Failed to load reviews');
        }
    }

    function renderReviewsTable(reviews) {
        const tbody = document.getElementById('reviewsTableBody');
        tbody.innerHTML = reviews.map(review => `
            <tr>
                <td>${review.author}</td>
                <td>${review.listing}</td>
                <td>
                    <div class="rating-stars">
                        ${renderStars(review.rating)}
                        <span class="ms-1">${review.rating}/5</span>
                    </div>
                </td>
                <td>
                    <div class="comment-preview" title="${review.comment}">
                        ${review.comment.length > 50 ? review.comment.substring(0, 50) + '...' : review.comment}
                    </div>
                </td>
                <td>${review.createdAt}</td>
                <td>
                    <span class="badge ${review.flagged ? 'bg-danger' : 'bg-success'}">
                        ${review.flagged ? 'Flagged' : 'Active'}
                    </span>
                </td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-warning" onclick="toggleFlag('${review._id}', ${review.flagged})">
                            <i class="fa-solid ${review.flagged ? 'fa-flag' : 'fa-flag-o'}"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteReview('${review._id}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    function renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="fa-solid fa-star ${i <= rating ? 'text-warning' : 'text-muted'}"></i>`;
        }
        return stars;
    }

    // Settings Management Functions
    async function loadSettings() {
        try {
            const response = await fetch('/admin/api/settings');
            const settings = await response.json();

            document.getElementById('maintenanceMode').checked = settings.maintenanceMode;
            document.getElementById('allowRegistration').checked = settings.allowRegistration;
            document.getElementById('maxListingsPerUser').value = settings.maxListingsPerUser;
            document.getElementById('featuredListingLimit').value = settings.featuredListingLimit;
        } catch (error) {
            console.error('Error loading settings:', error);
            showError('Failed to load settings');
        }
    }

    async function saveSettings() {
        const settings = {
            maintenanceMode: document.getElementById('maintenanceMode').checked,
            allowRegistration: document.getElementById('allowRegistration').checked,
            maxListingsPerUser: parseInt(document.getElementById('maxListingsPerUser').value),
            featuredListingLimit: parseInt(document.getElementById('featuredListingLimit').value)
        };

        try {
            // For now, just show success - in a real app, you'd save to backend
            showSuccess('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            showError('Failed to save settings');
        }
    }

    function resetSettings() {
        document.getElementById('maintenanceMode').checked = false;
        document.getElementById('allowRegistration').checked = true;
        document.getElementById('maxListingsPerUser').value = 10;
        document.getElementById('featuredListingLimit').value = 5;
    }

    // Activity Logs Functions
    async function loadActivity() {
        try {
            const response = await fetch('/admin/api/activity');
            const data = await response.json();

            renderActivityFeed(data.activities);
        } catch (error) {
            console.error('Error loading activity:', error);
            showError('Failed to load activity logs');
        }
    }

    function renderActivityFeed(activities) {
        const feed = document.getElementById('activityFeed');
        feed.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fa-solid ${getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <p class="activity-message">${activity.message}</p>
                    <small class="activity-time">${formatActivityTime(activity.timestamp)}</small>
                </div>
            </div>
        `).join('');
    }

    function getActivityIcon(type) {
        const icons = {
            user_registration: 'fa-user-plus',
            listing_created: 'fa-plus-circle'
        };
        return icons[type] || 'fa-info-circle';
    }

    function formatActivityTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    // Action Handlers
    async function toggleAdmin(userId, currentStatus) {
        const action = currentStatus ? 'remove admin privileges from' : 'grant admin privileges to';
        const user = await getUserById(userId);

        if (confirm(`Are you sure you want to ${action} ${user.username}?`)) {
            try {
                const response = await fetch(`/admin/api/users/${userId}/make-admin`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                const result = await response.json();

                if (result.success) {
                    loadUsers(currentUsersPage);
                    showSuccess(`Admin status updated for ${user.username}`);
                } else {
                    showError(result.error || 'Failed to update admin status');
                }
            } catch (error) {
                console.error('Error toggling admin:', error);
                showError('Failed to update admin status');
            }
        }
    }

    async function deleteUser(userId, username) {
        if (confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
            try {
                const response = await fetch(`/admin/api/users/${userId}`, {
                    method: 'DELETE'
                });
                const result = await response.json();

                if (result.success) {
                    loadUsers(currentUsersPage);
                    showSuccess(`User "${username}" deleted successfully`);
                } else {
                    showError(result.error || 'Failed to delete user');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                showError('Failed to delete user');
            }
        }
    }

    async function toggleFeatured(listingId, currentStatus) {
        const action = currentStatus ? 'unfeature' : 'feature';
        const listing = await getListingById(listingId);

        if (confirm(`Are you sure you want to ${action} "${listing.title}"?`)) {
            try {
                const response = await fetch(`/admin/api/listings/${listingId}/feature`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                const result = await response.json();

                if (result.success) {
                    loadListings(currentListingsPage);
                    showSuccess(`Listing "${listing.title}" ${action}d successfully`);
                } else {
                    showError(result.error || 'Failed to update listing');
                }
            } catch (error) {
                console.error('Error toggling featured:', error);
                showError('Failed to update listing');
            }
        }
    }

    async function deleteListing(listingId, title) {
        if (confirm(`Are you sure you want to delete listing "${title}"? This action cannot be undone.`)) {
            try {
                const response = await fetch(`/admin/api/listings/${listingId}`, {
                    method: 'DELETE'
                });
                const result = await response.json();

                if (result.success) {
                    loadListings(currentListingsPage);
                    showSuccess(`Listing "${title}" deleted successfully`);
                } else {
                    showError(result.error || 'Failed to delete listing');
                }
            } catch (error) {
                console.error('Error deleting listing:', error);
                showError('Failed to delete listing');
            }
        }
    }

    async function toggleFlag(reviewId, currentStatus) {
        const action = currentStatus ? 'unflag' : 'flag';
        if (confirm(`Are you sure you want to ${action} this review?`)) {
            try {
                const response = await fetch(`/admin/api/reviews/${reviewId}/flag`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                const result = await response.json();

                if (result.success) {
                    loadReviews(currentReviewsPage);
                    showSuccess(`Review ${action}ged successfully`);
                } else {
                    showError(result.error || 'Failed to update review');
                }
            } catch (error) {
                console.error('Error toggling flag:', error);
                showError('Failed to update review');
            }
        }
    }

    async function deleteReview(reviewId) {
        if (confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
            try {
                const response = await fetch(`/admin/api/reviews/${reviewId}`, {
                    method: 'DELETE'
                });
                const result = await response.json();

                if (result.success) {
                    loadReviews(currentReviewsPage);
                    showSuccess('Review deleted successfully');
                } else {
                    showError(result.error || 'Failed to delete review');
                }
            } catch (error) {
                console.error('Error deleting review:', error);
                showError('Failed to delete review');
            }
        }
    }

    // Helper functions for actions
    async function getUserById(userId) {
        // This would need a separate API endpoint in a real app
        // For now, return a placeholder
        return { username: 'User' };
    }

    async function getListingById(listingId) {
        // This would need a separate API endpoint in a real app
        // For now, return a placeholder
        return { title: 'Listing' };
    }

    // Pagination
    function renderPagination(type, pagination) {
        const container = document.getElementById(`${type}Pagination`);
        const controls = document.getElementById(`${type}PaginationControls`);

        if (pagination.pages <= 1) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'block';

        let html = '';
        const { page, pages } = pagination;

        // Previous button
        html += `<li class="page-item ${page === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage('${type}', ${page - 1})">Previous</a>
        </li>`;

        // Page numbers
        for (let i = Math.max(1, page - 2); i <= Math.min(pages, page + 2); i++) {
            html += `<li class="page-item ${i === page ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage('${type}', ${i})">${i}</a>
            </li>`;
        }

        // Next button
        html += `<li class="page-item ${page === pages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage('${type}', ${page + 1})">Next</a>
        </li>`;

        controls.innerHTML = html;
    }

    function changePage(type, page) {
        switch(type) {
            case 'users':
                currentUsersPage = page;
                loadUsers(page);
                break;
            case 'listings':
                currentListingsPage = page;
                loadListings(page);
                break;
            case 'reviews':
                currentReviewsPage = page;
                loadReviews(page);
                break;
        }
    }

    // Search and Filter Event Listeners
    function initializeSearchAndFilters() {
        // User search
        document.getElementById('userSearch').addEventListener('input', function() {
            clearTimeout(usersSearchTimeout);
            usersSearchTimeout = setTimeout(() => {
                currentUsersPage = 1;
                loadUsers(1, this.value, document.getElementById('userSortBy').value, document.getElementById('userSortOrder').value);
            }, 500);
        });

        document.getElementById('clearUserSearch').addEventListener('click', function() {
            document.getElementById('userSearch').value = '';
            currentUsersPage = 1;
            loadUsers(1);
        });

        document.getElementById('userSortBy').addEventListener('change', function() {
            currentUsersPage = 1;
            loadUsers(1, document.getElementById('userSearch').value, this.value, document.getElementById('userSortOrder').value);
        });

        document.getElementById('userSortOrder').addEventListener('change', function() {
            currentUsersPage = 1;
            loadUsers(1, document.getElementById('userSearch').value, document.getElementById('userSortBy').value, this.value);
        });

        // Listing search and filters
        document.getElementById('listingSearch').addEventListener('input', function() {
            clearTimeout(listingsSearchTimeout);
            listingsSearchTimeout = setTimeout(() => {
                currentListingsPage = 1;
                loadListings(1, this.value, document.getElementById('listingCategory').value, document.getElementById('listingSortBy').value, document.getElementById('listingSortOrder').value);
            }, 500);
        });

        document.getElementById('clearListingSearch').addEventListener('click', function() {
            document.getElementById('listingSearch').value = '';
            currentListingsPage = 1;
            loadListings(1);
        });

        document.getElementById('listingCategory').addEventListener('change', function() {
            currentListingsPage = 1;
            loadListings(1, document.getElementById('listingSearch').value, this.value, document.getElementById('listingSortBy').value, document.getElementById('listingSortOrder').value);
        });

        document.getElementById('listingSortBy').addEventListener('change', function() {
            currentListingsPage = 1;
            loadListings(1, document.getElementById('listingSearch').value, document.getElementById('listingCategory').value, this.value, document.getElementById('listingSortOrder').value);
        });

        document.getElementById('listingSortOrder').addEventListener('change', function() {
            currentListingsPage = 1;
            loadListings(1, document.getElementById('listingSearch').value, document.getElementById('listingCategory').value, document.getElementById('listingSortBy').value, this.value);
        });

        // Review search and filters
        document.getElementById('reviewSearch').addEventListener('input', function() {
            clearTimeout(reviewsSearchTimeout);
            reviewsSearchTimeout = setTimeout(() => {
                currentReviewsPage = 1;
                loadReviews(1, this.value, document.getElementById('reviewRating').value, document.getElementById('reviewSortBy').value, document.getElementById('reviewSortOrder').value);
            }, 500);
        });

        document.getElementById('clearReviewSearch').addEventListener('click', function() {
            document.getElementById('reviewSearch').value = '';
            currentReviewsPage = 1;
            loadReviews(1);
        });

        document.getElementById('reviewRating').addEventListener('change', function() {
            currentReviewsPage = 1;
            loadReviews(1, document.getElementById('reviewSearch').value, this.value, document.getElementById('reviewSortBy').value, document.getElementById('reviewSortOrder').value);
        });

        document.getElementById('reviewSortBy').addEventListener('change', function() {
            currentReviewsPage = 1;
            loadReviews(1, document.getElementById('reviewSearch').value, document.getElementById('reviewRating').value, this.value, document.getElementById('reviewSortOrder').value);
        });

        document.getElementById('reviewSortOrder').addEventListener('change', function() {
            currentReviewsPage = 1;
            loadReviews(1, document.getElementById('reviewSearch').value, document.getElementById('reviewRating').value, document.getElementById('reviewSortBy').value, this.value);
        });

        // Settings buttons
        document.getElementById('saveSettings').addEventListener('click', saveSettings);
        document.getElementById('resetSettings').addEventListener('click', resetSettings);
    }

    // Notification functions
    function showSuccess(message) {
        // You can implement a toast notification here
        console.log('Success:', message);
        alert(message);
    }

    function showError(message) {
        console.error('Error:', message);
        alert('Error: ' + message);
    }

    // Make functions global for onclick handlers
    window.toggleAdmin = toggleAdmin;
    window.deleteUser = deleteUser;
    window.toggleFeatured = toggleFeatured;
    window.deleteListing = deleteListing;
    window.toggleFlag = toggleFlag;
    window.deleteReview = deleteReview;
    window.changePage = changePage;

    // Initialize everything
    initializeDashboard();
    startAutoRefresh();
    initializeSidebar();
    initializeSearchAndFilters();

    // Add resize handler for responsive charts
    window.addEventListener('resize', function() {
        Chart.helpers.each(Chart.instances, function(instance) {
            instance.resize();
        });
    });
});
