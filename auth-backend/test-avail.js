const https = require('http');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/institute/halls',
    method: 'GET'
};

const req = https.request(options, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log(data));
});
req.on('error', error => console.error(error));
req.end();
