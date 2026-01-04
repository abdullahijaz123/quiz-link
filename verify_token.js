const http = require('http');

const data = JSON.stringify({
    email: 'admin@quizlink.com',
    password: 'adminpassword'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, res => {
    let body = '';
    res.on('data', d => {
        body += d;
    });
    res.on('end', () => {
        console.log('Response Status:', res.statusCode);
        console.log('Response Body:', body);
    });
});

req.on('error', error => {
    console.error(error);
});

req.write(data);
req.end();
