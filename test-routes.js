const http = require('http');

// Test if routes are accessible
const testRoute = (path) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8080,
            path: path,
            method: 'GET',
            headers: {
                'User-Agent': 'Test Script'
            }
        };

        const req = http.request(options, (res) => {
            console.log(`Route: ${path}`);
            console.log(`Status: ${res.statusCode}`);
            console.log(`Location: ${res.headers.location || 'N/A'}`);
            console.log('---');

            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve({ status: res.statusCode, location: res.headers.location, data: data.substring(0, 200) });
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.end();
    });
};

async function testRoutes() {
    try {
        console.log('Testing routes...\n');

        // Test achievements route
        await testRoute('/achievements');

        // Test leaderboard route
        await testRoute('/leaderboard');

        // Test login page (should work)
        await testRoute('/login');

    } catch (error) {
        console.error('Error testing routes:', error);
    }
}

testRoutes();
