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
    const authView = document.querySelector('[data-view="auth"]');

    // Handle login form
    const loginForm = authView.querySelector('#login-form');
    loginForm?.addEventListener('submit', handleLogin);

    // Handle register form
    const registerForm = authView.querySelector('#register-form');
    registerForm?.addEventListener('submit', handleRegister);

    // Handle OAuth buttons
    const googleBtn = authView.querySelector('#google-login');
    googleBtn?.addEventListener('click', () => handleOAuthLogin('google'));
}

async function handleLogin(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!isValidEmail(email)) {
        showToast('Please enter a valid email', 'error');
        return;
    }

    const result = await login(email, password);

    if (result.success) {
        showToast('Login successful!', 'success');
    } else {
        showToast(result.error.message, 'error');
    }
}

async function handleRegister(e) {
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
        showToast(result.error.message, 'error');
    }
}

async function handleOAuthLogin(provider) {
    const result = await loginWithProvider(provider);

    if (!result.success) {
        showToast(result.error.message, 'error');
    }
}
