/**
 * Authentication View
 * Purpose: Render and handle authentication UI
 */

import { login, loginWithProvider } from '../auth/login.js';
import { register } from '../auth/register.js';
import { isValidEmail } from '../utils/validators.js';
import { showToast } from '../ui/toast.js';

/**
 * Initialize auth view
 */
export function initAuthView() {
    console.log('Initializing auth view...');

    const authView = document.querySelector('[data-view="auth"]');

    if (!authView) {
        console.error('Auth view not found');
        return;
    }

    // Handle login form
    const loginForm = authView.querySelector('#login-form');

    if (!loginForm) {
        console.error('Login form not found');
        return;
    }

    console.log('Login form found, attaching listener');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Login form submitted');

        const email = loginForm.querySelector('#email').value;
        const password = loginForm.querySelector('#password').value;

        console.log('Attempting login with:', email);

        if (!isValidEmail(email)) {
            showToast('Please enter a valid email', 'error');
            return;
        }

        const result = await login(email, password);

        if (result.success) {
            showToast('Login successful!', 'success');
        } else {
            showToast(result.error?.message || 'Login failed', 'error');
        }
    });

    // Handle register form
    const registerForm = authView.querySelector('#register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;

            if (!isValidEmail(email)) {
                showToast('Please enter a valid email', 'error');
                return;
            }

            if (password.length < 8) {
                showToast('Password must be at least 8 characters', 'error');
                return;
            }

            const result = await register(email, password);

            if (result.success) {
                showToast('Registration successful! Please check your email.', 'success');
            } else {
                showToast(result.error?.message || 'Registration failed', 'error');
            }
        });
    }

    // Handle OAuth buttons
    const googleBtn = authView.querySelector('#google-login');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => handleOAuthLogin('google'));
    }

    console.log('Auth view initialized successfully');
}

async function handleOAuthLogin(provider) {
    const result = await loginWithProvider(provider);

    if (!result.success) {
        showToast(result.error.message, 'error');
    }
}
