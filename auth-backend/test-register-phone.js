const http = require('http');

// Helper for requests
function makeRequest(options, postData) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ statusCode: res.statusCode, headers: res.headers, body: parsed });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
                }
            });
        });
        req.on('error', reject);
        if (postData) req.write(postData);
        req.end();
    });
}

async function test() {
    // 1. Register User
    const email = `test.phone.${Date.now()}@example.com`;
    const phone = "0555555555";
    console.log(`Registering user: ${email} with phone ${phone}...`);

    const regRes = await makeRequest({
        hostname: 'localhost', port: 5000, path: '/api/auth/register', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify({
        name: 'Test Phone User', email, password: 'Password123', phone, role: 'STUDENT'
    }));

    console.log('Register Result:', regRes.body);

    // 2. Login as Admin
    console.log('Logging in as Admin...');
    const loginRes = await makeRequest({
        hostname: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify({
        email: 'admin@platform.com', password: 'Test@123456'
    }));

    const token = loginRes.body.data?.accessToken;

    if (!token) {
        console.error('Failed to get admin token', loginRes.body);
        return;
    }

    // 3. Get All Students
    console.log('Fetching students...');
    const studentsRes = await makeRequest({
        hostname: 'localhost', port: 5000, path: '/api/admin/students', method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    // 4. Find our user
    const students = studentsRes.body.data || studentsRes.body;
    if (Array.isArray(students)) {
        const found = students.find(s => s.email === email);
        if (found) {
            console.log('Found User Config:', {
                name: found.name,
                email: found.email,
                phone: found.phone
            });

            if (found.phone === phone) {
                console.log('SUCCESS: Phone matches input.');
            } else {
                console.log(`FAILURE: Phone mismatch. Expected '${phone}', got '${found.phone}'.`);
            }
        } else {
            console.log('User not found in student list.');
        }
    } else {
        console.log('Unexpected students response:', typeof students);
    }
}

test().catch(console.error);
