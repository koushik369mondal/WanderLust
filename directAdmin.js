// Add this route to your app.js temporarily for direct admin access
const express = require('express');
const User = require('./models/user');

// Add this route to app.js before the error handlers
app.get('/direct-admin', async (req, res) => {
    try {
        const admin = await User.findOne({ username: 'admin' });
        if (admin) {
            req.login(admin, (err) => {
                if (err) {
                    console.log('Login error:', err);
                    return res.send('Login failed');
                }
                console.log('Admin logged in successfully');
                res.redirect('/admin/dashboard');
            });
        } else {
            res.send('Admin user not found');
        }
    } catch (error) {
        res.send('Error: ' + error.message);
    }
});

console.log('Add this route to your app.js and visit: http://localhost:8080/direct-admin');