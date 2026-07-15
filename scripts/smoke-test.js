/**
 * Smoke Test (Node.js)
 * Purpose: Verify boot-critical artifacts are served and contain expected content.
 */

const http = require('http');
const { spawn } = require('child_process');

const PORT = 8000;
const BASE_URL = `http://127.0.0.1:${PORT}`;

// Artifacts to check
const CHECKS = [
    { url: '/', contains: "import('./js/main.js", name: 'Index' }, // Flexible: matches with or without version param
    { url: '/js/main.js', contains: 'Initializing Resume_Builder', name: 'Main JS' },
    { url: '/js/config/demo.js', contains: 'DEMO_MODE', name: 'Demo Config' },
    { url: '/js/auth/login.js', contains: 'DEMO', name: 'Login Logic' },
    { url: '/js/config/supabase.js', contains: 'supabase', name: 'Supabase Config' },

    // Upload View Readiness (CRITICAL)
    { url: '/js/views/uploadView.js', contains: 'initUploadView', name: 'Upload View Module' },
    { url: '/js/utils/constants.js', contains: 'UPLOAD', name: 'Constants' },
    { url: '/js/main.js', contains: 'initUploadView', name: 'Main Init Upload' },

    // Editor & Labeling Readiness (TASK-031)
    { url: '/js/views/editorView.js', contains: 'initEditorView', name: 'Editor View Module' },
    { url: '/js/cv/labeler.js', contains: 'labelCvText', name: 'CV Labeler Module' },
    { url: '/js/views/editorView.js', contains: 'optimizeBtn', name: 'Optimize Button Wiring' }
];

let serverProcess = null;

async function startServer() {
    console.log('Starting temporary server...');
    const candidates = process.platform === 'win32'
        ? [['python', ['-m', 'http.server', PORT]], ['py', ['-3', '-m', 'http.server', PORT]]]
        : [['python3', ['-m', 'http.server', PORT]], ['python', ['-m', 'http.server', PORT]]];

    for (const [command, args] of candidates) {
        const child = spawn(command, args, { cwd: 'src', stdio: 'ignore' });
        serverProcess = child;

        for (let attempt = 0; attempt < 20; attempt += 1) {
            if (child.exitCode !== null) break;
            try {
                await fetchUrl('/');
                return child;
            } catch {
                await new Promise((resolve) => setTimeout(resolve, 150));
            }
        }

        if (child.exitCode === null) child.kill();
    }

    serverProcess = null;
    throw new Error('Unable to start a local Python HTTP server.');
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
