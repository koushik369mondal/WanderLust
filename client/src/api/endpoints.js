import api from './axios';

// Auth APIs
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    googleAuth: () => api.get('/auth/google'),
    getCurrentUser: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
};

// User APIs
export const userAPI = {
    getProfile: (id) => api.get(`/users/${id}`),
    updateProfile: (id, data) => api.put(`/users/${id}`, data),
    getWishlist: () => api.get('/users/wishlist'),
    addToWishlist: (listingId) => api.post('/users/wishlist', { listingId }),
    removeFromWishlist: (listingId) => api.delete(`/users/wishlist/${listingId}`),
    getAchievements: () => api.get('/users/achievements'),
    updateSettings: (data) => api.put('/users/settings', data),
};

// Listing APIs
export const listingAPI = {
    getAll: (params) => api.get('/listings', { params }),
    getById: (id) => api.get(`/listings/${id}`),
    create: (data) => api.post('/listings', data),
    update: (id, data) => api.put(`/listings/${id}`, data),
    delete: (id) => api.delete(`/listings/${id}`),
    like: (id) => api.post(`/listings/${id}/like`),
    unlike: (id) => api.delete(`/listings/${id}/like`),
    compare: (ids) => api.post('/listings/compare', { ids }),
    getSimilar: (id) => api.get(`/listings/${id}/similar`),
};

// Review APIs
export const reviewAPI = {
    getByListing: (listingId) => api.get(`/reviews/listing/${listingId}`),
    create: (data) => api.post('/reviews', data),
    update: (id, data) => api.put(`/reviews/${id}`, data),
    delete: (id) => api.delete(`/reviews/${id}`),
    markHelpful: (id) => api.post(`/reviews/${id}/helpful`),
};

// Trip APIs
export const tripAPI = {
    getAll: () => api.get('/trips'),
    getById: (id) => api.get(`/trips/${id}`),
    create: (data) => api.post('/trips', data),
    update: (id, data) => api.put(`/trips/${id}`, data),
    delete: (id) => api.delete(`/trips/${id}`),
    estimateCosts: (data) => api.post('/trips/estimate', data),
    downloadPDF: (id) => api.get(`/trips/${id}/pdf`, { responseType: 'blob' }),
};

// Booking APIs
export const bookingAPI = {
    getAll: () => api.get('/bookings'),
    getById: (id) => api.get(`/bookings/${id}`),
    create: (data) => api.post('/bookings', data),
    cancel: (id) => api.put(`/bookings/${id}/cancel`),
};

// Journal APIs
export const journalAPI = {
    getAll: () => api.get('/journal'),
    getById: (id) => api.get(`/journal/${id}`),
    create: (data) => api.post('/journal', data),
    update: (id, data) => api.put(`/journal/${id}`, data),
    delete: (id) => api.delete(`/journal/${id}`),
};

// Goal APIs
export const goalAPI = {
    getAll: () => api.get('/goals'),
    create: (data) => api.post('/goals', data),
    update: (id, data) => api.put(`/goals/${id}`, data),
    delete: (id) => api.delete(`/goals/${id}`),
    markComplete: (id) => api.put(`/goals/${id}/complete`),
};

// Safety Alert APIs
export const safetyAPI = {
    getAll: (params) => api.get('/safety', { params }),
    getById: (id) => api.get(`/safety/${id}`),
    create: (data) => api.post('/safety', data),
    vote: (id, type) => api.post(`/safety/${id}/vote`, { type }),
};

// Notification APIs
export const notificationAPI = {
    getAll: () => api.get('/notifications'),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
    delete: (id) => api.delete(`/notifications/${id}`),
};

// Weather API
export const weatherAPI = {
    getCurrent: (city) => api.get('/weather/current', { params: { city } }),
    getForecast: (city) => api.get('/weather/forecast', { params: { city } }),
};

// Currency API
export const currencyAPI = {
    convert: (from, to, amount) => api.get('/currency/convert', { params: { from, to, amount } }),
    getRates: () => api.get('/currency/rates'),
};

// Holiday API
export const holidayAPI = {
    getByCountry: (country, year) => api.get('/holidays', { params: { country, year } }),
};

// AI APIs
export const aiAPI = {
    chat: (message, context) => api.post('/ai/chat', { message, context }),
    generatePackingList: (data) => api.post('/ai/packing-list', data),
    translate: (text, targetLang) => api.post('/ai/translate', { text, targetLang }),
    getSummary: (listingId) => api.get(`/ai/summary/${listingId}`),
};

// Admin APIs
export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getUsers: (params) => api.get('/admin/users', { params }),
    suspendUser: (id, data) => api.put(`/admin/users/${id}/suspend`, data),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    getListings: (params) => api.get('/admin/listings', { params }),
    featureListing: (id) => api.put(`/admin/listings/${id}/feature`),
    deleteListing: (id) => api.delete(`/admin/listings/${id}`),
    getReports: () => api.get('/admin/reports'),
};

// Leaderboard API
export const leaderboardAPI = {
    getTop: (limit = 50) => api.get('/users/leaderboard', { params: { limit } }),
};

export default api;
