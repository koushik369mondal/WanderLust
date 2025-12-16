const mongoose = require('mongoose');

exports.getStatus = (req, res) => {
    const status = {
        app: 'WanderLust API',
        version: '1.0.0',
        serverTime: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: {
            connected: mongoose.connection.readyState === 1,
            state: getConnectionState(mongoose.connection.readyState),
            host: mongoose.connection.host || 'Not connected',
            name: mongoose.connection.name || 'Not connected'
        },
        uptime: process.uptime(),
        memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
        }
    };

    res.json(status);
};

// Helper function to get connection state name
function getConnectionState(state) {
    const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    return states[state] || 'unknown';
}
