/**
 * Smoke Test (Node.js)
 * Purpose: Verify boot-critical artifacts are served and contain expected content.
 */

const http = require('http');
const { spawn } = require('child_process');

const PORT = 8000;
const BASE_URL = `http://localhost:${PORT}`;

// Artifacts to check
const CHECKS = [
    { url: '/', contains: "import('./js/main.js')", name: 'Index' },
    { url: '/js/main.js', contains: 'Initializing Resume_Builder', name: 'Main JS' },
    { url: '/js/config/demo.js', contains: 'DEMO_MODE', name: 'Demo Config' },
    { url: '/js/auth/login.js', contains: 'DEMO', name: 'Login Logic' },
    { url: '/js/config/supabase.js', contains: 'supabase', name: 'Supabase Config' },

    // Upload View Readiness (CRITICAL)
    { url: '/js/views/uploadView.js', contains: 'initUploadView', name: 'Upload View Module' },
    { url: '/js/utils/constants.js', contains: 'UPLOAD', name: 'Constants' },
    { url: '/js/main.js', contains: 'initUploadView', name: 'Main Init Upload' }
];

let serverProcess = null;

async function startServer() {
    console.log('Starting temporary server...');
    // Try Python first (per environment preference)
    return new Promise((resolve, reject) => {
        const python = spawn('python3', ['-m', 'http.server', PORT]);

        python.stdout.on('data', (data) => { if (data.toString().includes('Serving')) resolve(python); });
        python.stderr.on('data', (data) => { if (data.toString().includes('Serving')) resolve(python); });

        // Fallback to 'python' if 'python3' fails immediately
        python.on('error', () => {
            const python2 = spawn('python', ['-m', 'http.server', PORT]);
            python2.stdout.on('data', (data) => { if (data.toString().includes('Serving')) resolve(python2); });
            python2.stderr.on('data', (data) => { if (data.toString().includes('Serving')) resolve(python2); });
            serverProcess = python2;
        });

        serverProcess = python;
        // Give it 2 seconds to fail or succeed if stdout is silent
        setTimeout(() => resolve(serverProcess), 2000);
    });
}

function fetchUrl(path) {
    return new Promise((resolve, reject) => {
        http.get(`${BASE_URL}${path}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, content: data }));
        }).on('error', reject);
    });
}

async function runTests() {
    let failed = false;

    // Check if server is running, if not start one
    try {
        await fetchUrl('/');
        console.log('Server already running.');
    } catch (e) {
        await startServer();
        console.log('Server started.');
    }

    console.log('Running checks...');

    for (const check of CHECKS) {
        try {
            const res = await fetchUrl(check.url);
            if (res.status !== 200) {
                console.error(`❌ FAIL: ${check.name} (${check.url}) returned ${res.status}`);
                failed = true;
                continue;
            }
            if (!res.content.includes(check.contains)) {
                console.error(`❌ FAIL: ${check.name} missing marker "${check.contains}"`);
                failed = true;
                continue;
            }
            console.log(`✅ PASS: ${check.name}`);
        } catch (e) {
            console.error(`❌ FAIL: ${check.name} request error: ${e.message}`);
            failed = true;
        }
    }

    // Cleanup
    if (serverProcess) {
        serverProcess.kill();
        console.log('Server stopped.');
    }

    if (failed) {
        console.error('Smoke test FAILED.');
        process.exit(1);
    } else {
        console.log('Smoke test PASSED.');
        process.exit(0);
    }
}

runTests();
