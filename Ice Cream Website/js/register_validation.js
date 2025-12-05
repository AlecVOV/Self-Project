// Encapsulate form validation logic in an IIFE
const FormValidator = (function () {
    const formElements = {};
    const ValidationRules = {
        emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phonePattern: /^\d{10}$/,
        minimumAge: 13,
    };

    function init() {
        cacheDOM();
        setupDatePickers();
        bindEvents();
    }

    function cacheDOM() {
        formElements.form = document.getElementById('registration-form');
        formElements.daySelect = document.getElementById('day');
        formElements.monthSelect = document.getElementById('month');
        formElements.yearSelect = document.getElementById('year');
        formElements.username = document.getElementById('username');
        formElements.password = document.getElementById('password');
        formElements.retypePassword = document.getElementById('retype-password');
        formElements.email = document.getElementById('registration-email');
        formElements.phone = document.getElementById('phone-number');
        formElements.genderInputs = document.querySelectorAll('input[name="gender"]');
    }

    function setupDatePickers() {
        generateOptions(formElements.monthSelect, 1, 12, (i) => new Date(0, i - 1).toLocaleString('default', { month: 'long' }));
        generateOptions(formElements.daySelect, 1, 31);
        generateOptions(formElements.yearSelect, 1900, new Date().getFullYear());
        formElements.monthSelect.addEventListener('change', updateDays);
        formElements.yearSelect.addEventListener('change', updateDays);
    }

    function bindEvents() {
        formElements.form.addEventListener('submit', validateForm);
        formElements.username.addEventListener('blur', validateUsername);
        formElements.username.addEventListener('input', debounce(validateUsername, 300));
        formElements.password.addEventListener('input', validatePasswordStrength);
        formElements.retypePassword.addEventListener('blur', validatePasswordMatch);
        formElements.retypePassword.addEventListener('input', debounce(validatePasswordMatch, 300));
        formElements.email.addEventListener('blur', validateEmail);
        formElements.email.addEventListener('input', debounce(validateEmail, 300));
        formElements.phone.addEventListener('blur', validatePhone);
        formElements.phone.addEventListener('input', debounce(validatePhone, 300));
        formElements.daySelect.addEventListener('change', validateDateOfBirth);
        formElements.monthSelect.addEventListener('change', validateDateOfBirth);
        formElements.yearSelect.addEventListener('change', validateDateOfBirth);
    }

    // Debounce function for real-time validation
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function generateOptions(select, start, end, formatter = (i) => i) {
        select.innerHTML = '<option value="">Select</option>';
        for (let i = start; i <= end; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = formatter(i);
            select.appendChild(option);
        }
    }

    function updateDays() {
        const month = parseInt(formElements.monthSelect.value);
        const year = parseInt(formElements.yearSelect.value);
        if (month && year) {
            const lastDay = new Date(year, month, 0).getDate();
            generateOptions(formElements.daySelect, 1, lastDay);
        }
    }

    function validateUsername() {
        const username = formElements.username;
        if (username.value.trim() === '') {
            showError(username, 'Please enter a username.');
            return false;
        }
        showSuccess(username);
        return true;
    }

    function validateDateOfBirth() {
        const day = formElements.daySelect;
        const month = formElements.monthSelect;
        const year = formElements.yearSelect;
        if (!day.value || !month.value || !year.value) {
            showError(day.parentNode, 'Please select your complete date of birth.');
            return false;
        }
        const selectedDate = new Date(year.value, month.value - 1, day.value);
        const today = new Date();
        if (selectedDate > today) {
            showError(day.parentNode, 'Date of birth cannot be in the future.');
            return false;
        }
        const minAgeDate = new Date();
        minAgeDate.setFullYear(minAgeDate.getFullYear() - ValidationRules.minimumAge);
        if (selectedDate > minAgeDate) {
            showError(day.parentNode, `You must be at least ${ValidationRules.minimumAge} years old to register.`);
            return false;
        }
        showSuccess(day.parentNode);
        return true;
    }

    function validatePasswordStrength() {
        const password = formElements.password;
        const value = password.value;
        clearErrorFor(password);
        const strengthMeter = document.getElementById('password-strength') || createStrengthMeter(password);
        let strength = 0;
        if (value.match(/[A-Z]/)) strength++;
        if (value.match(/[a-z]/)) strength++;
        if (value.match(/[0-9]/)) strength++;
        if (value.match(/[^A-Za-z0-9]/)) strength++;
        if (value.length >= 12) strength++;
        const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        const strengthColors = ['#ff0000', '#ff8c00', '#ffff00', '#9acd32', '#008000'];
        if (value.length > 0) {
            strengthMeter.style.width = (strength * 20) + '%';
            strengthMeter.style.backgroundColor = strengthColors[strength - 1] || strengthColors[0];
            strengthMeter.textContent = strength > 0 ? strengthLabels[strength - 1] : '';
            strengthMeter.style.display = 'block';
        } else {
            strengthMeter.style.width = '0%';
            strengthMeter.textContent = '';
            strengthMeter.style.display = 'none';
        }
        if (value.trim() === '' || strength < 3) {
            showError(password, 'Password is too weak. Include uppercase, lowercase, numbers, and symbols.');
            return false;
        }
        return true;
    }

    function createStrengthMeter(passwordElement) {
        const meter = document.createElement('div');
        meter.id = 'password-strength';
        meter.className = 'password-strength-meter';
        meter.setAttribute('aria-live', 'polite');
        meter.style.cssText = 'height: 8px; border-radius: 4px; margin-top: 5px; transition: width 0.3s ease, background-color 0.3s ease;';
        passwordElement.parentNode.insertBefore(meter, passwordElement.nextSibling);
        return meter;
    }

    function validateGender() {
        const genderInputs = formElements.genderInputs;
        const genderContainer = document.getElementById('gender');
        let isSelected = false;
        
        genderInputs.forEach(input => {
            if (input.checked) isSelected = true;
        });
        
        if (!isSelected) {
            showError(genderContainer, 'Please select your gender.');
            return false;
        }
        showSuccess(genderContainer);
        return true;
    }

    function validatePasswordMatch() {
        const password = formElements.password;
        const retypePassword = formElements.retypePassword;
        if (retypePassword.value.trim() === '') {
            showError(retypePassword, 'Please retype your password.');
            return false;
        }
        if (password.value !== retypePassword.value) {
            showError(retypePassword, 'Passwords do not match. Please re-enter.');
            return false;
        }
        showSuccess(retypePassword);
        return true;
    }

    function validateEmail() {
        const email = formElements.email;
        if (email.value.trim() === '' || !ValidationRules.emailPattern.test(email.value)) {
            showError(email, 'Please enter a valid email address.');
            return false;
        }
        showSuccess(email);
        return true;
    }

    function validatePhone() {
        const phone = formElements.phone;
        if (phone.value.trim() === '' || !ValidationRules.phonePattern.test(phone.value)) {
            showError(phone, 'Please enter a valid 10-digit phone number.');
            return false;
        }
        showSuccess(phone);
        return true;
    }

    function validateForm(event) {
        event.preventDefault();
        clearErrors();
        const validations = [
            validateUsername(),
            validateGender(),
            validateDateOfBirth(),
            validatePasswordStrength(),
            validatePasswordMatch(),
            validateEmail(),
            validatePhone(),
        ];
        if (validations.every((result) => result)) {
            alert('Registration successful!');
            formElements.form.submit();
        }
    }

    function clearErrors() {
        const errors = document.querySelectorAll('.error-message');
        errors.forEach(error => error.remove());
        const inputs = formElements.form.querySelectorAll('input, select');
        inputs.forEach(input => input.style.borderColor = '');
    }

    function showError(element, message) {
        clearErrorFor(element);
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        element.style.borderColor = 'red';
        element.parentNode.insertBefore(errorElement, element.nextSibling);
    }

    function clearErrorFor(element) {
        const error = element.parentNode.querySelector('.error-message');
        if (error) error.remove();
        element.style.borderColor = '';
    }

    function showSuccess(element) {
        element.style.borderColor = '#4CAF50';
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', FormValidator.init);
