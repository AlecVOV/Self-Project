document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('order-form');
    const deliveryRadio = document.getElementById("delivery");
    const pickupRadio = document.getElementById("pickup");
    const deliveryAddress = document.getElementById("delivery-address");
    const billingAddress = document.getElementById("billing-address");
    const sameAsDeliveryCheckbox = document.getElementById("same-as-deli");
    const payOnlineRadio = document.getElementById("pay-online");
    const payOnPickupRadio = document.getElementById("pay-on-pickup");
    const creditCardInfo = document.getElementById("credit-card-info");
    const cardNameInput = document.getElementById("cardName");
    const cardNumberInput = document.getElementById("cardNumber");
    const cvvInput = document.getElementById("cvv");
    const emailInput = document.getElementById("order-email");
    const phoneInput = document.getElementById("phone");
    const expirationMonth = document.getElementById("expirationMonth");
    const expirationYear = document.getElementById("expirationYear");
    const iceCreamTypes = ["FALOODEH", "FROZEN_YOGURT", "GELATO", "MOCHI", "ROLLED_ICE_CREAM", "SNOW_CREAM"];

    // Array to collect all validation errors
    let validationErrors = [];

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        clearAllErrors();
        validationErrors = [];
        
        // Validate common required fields first
        validateIceCreamQuantities();
        validateContactInfo();
        
        // Validate based on delivery method
        if (!pickupRadio.checked && !deliveryRadio.checked) {
            validationErrors.push('Please choose Delivery or Pickup.');
        } else {
            if (deliveryRadio.checked) {
                validateDeliveryAddress();
            }
            validateBillingAddress();
        }
        
        validatePaymentMethodSelection();
        
        // Only validate payment details if paying online
        if (payOnlineRadio.checked) {
            validatePaymentMethod();
        }
        
        // Check if there are any errors
        if (validationErrors.length > 0) {
            // Show all errors in an alert
            alert('Please fix the following errors:\n\n' + validationErrors.join('\n'));
        } else {
            // Form is valid, submit it
            console.log("Form is valid, submitting...");
            form.submit();
        }
    });

    // Function to validate ice cream quantities
    function validateIceCreamQuantities() {
        let iceCreamSelected = false;
        
        iceCreamTypes.forEach(function (type) {
            const checkbox = document.getElementById(type + "-checkbox");
            const quantityElement = document.getElementById(type + "-Quantity");
            if (!quantityElement) return;
            
            const quantity = quantityElement.value.trim();
            
            // Check if checkbox is checked or quantity is entered
            if (checkbox && checkbox.checked) {
                iceCreamSelected = true;
                if (quantity === '' || isNaN(quantity) || parseInt(quantity) <= 0) {
                    validationErrors.push(type.replace(/_/g, ' ') + ": Please enter a valid quantity (greater than 0).");
                }
            } else if (quantity !== '' && parseInt(quantity) > 0) {
                iceCreamSelected = true;
            }
        });

        if (!iceCreamSelected) {
            validationErrors.push('Please select at least one ice cream and enter its quantity.');
        }
    }

    // Function to validate billing address fields
    function validateBillingAddress() {
        const addressRegex = /^[a-zA-Z0-9\s,'-]+$/;
        const zipCodeRegex = /^\d{5}$/;

        const billing_street = document.getElementById('billing-street').value.trim();
        const billing_ward = document.getElementById('billing-ward').value.trim();
        const billing_district = document.getElementById('billing-district').value.trim();
        const billing_zipCode = document.getElementById('zipc2').value.trim();

        if (billing_street === '' || billing_ward === '' || billing_district === '' || billing_zipCode === '') {
            validationErrors.push('Please enter complete billing address details.');
            return;
        }
        
        if (!addressRegex.test(billing_street)) {
            validationErrors.push('Billing street contains invalid characters.');
        }
        
        if (!addressRegex.test(billing_ward)) {
            validationErrors.push('Billing ward contains invalid characters.');
        }
        
        if (!addressRegex.test(billing_district)) {
            validationErrors.push('Billing district contains invalid characters.');
        }
        
        if (!zipCodeRegex.test(billing_zipCode)) {
            validationErrors.push('Billing Zip Code must be exactly 5 digits.');
        }
    }

    // Function to validate delivery address fields
    function validateDeliveryAddress() {
        const addressRegex = /^[a-zA-Z0-9\s,'-]+$/;
        const zipCodeRegex = /^\d{5}$/;

        const delivery_street = document.getElementById('delivery-street').value.trim();
        const delivery_ward = document.getElementById('delivery-ward').value.trim();
        const delivery_district = document.getElementById('delivery-district').value.trim();
        const delivery_zipCode = document.getElementById('zipc1').value.trim();

        if (delivery_street === '' || delivery_ward === '' || delivery_district === '' || delivery_zipCode === '') {
            validationErrors.push('Please enter complete delivery address details.');
            return;
        }
        
        if (!addressRegex.test(delivery_street)) {
            validationErrors.push('Delivery street contains invalid characters.');
        }
        
        if (!addressRegex.test(delivery_ward)) {
            validationErrors.push('Delivery ward contains invalid characters.');
        }
        
        if (!addressRegex.test(delivery_district)) {
            validationErrors.push('Delivery district contains invalid characters.');
        }
        
        if (!zipCodeRegex.test(delivery_zipCode)) {
            validationErrors.push('Delivery Zip Code must be exactly 5 digits.');
        }
    }

    // Function to validate contact information
    function validateContactInfo() {
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        if (email === '') {
            validationErrors.push('Please enter an email address.');
        } else if (!emailRegex.test(email)) {
            validationErrors.push('Please enter a valid email address.');
        }

        if (phone === '') {
            validationErrors.push('Please enter a phone number.');
        } else if (!phoneRegex.test(phone)) {
            validationErrors.push('Phone number must be exactly 10 digits.');
        }
    }

    function validatePaymentMethodSelection() {
        if (!payOnPickupRadio.checked && !payOnlineRadio.checked) {
            validationErrors.push('Please choose a payment method.');
        }
    }

    // Function to validate payment method and credit card info
    function validatePaymentMethod() {
        if (!payOnlineRadio.checked) return;
        
        const cardType = document.querySelector('input[name="credit-card-type"]:checked');
        const selectedCardType = cardType ? cardType.value : '';
        const cardName = cardNameInput.value.trim();
        const cardNumber = cardNumberInput.value.trim();
        const cvv = cvvInput.value.trim();
        const month = expirationMonth.value;
        const year = expirationYear.value;

        // Check card type
        if (selectedCardType === '') {
            validationErrors.push('Please select a card type (Visa, MasterCard, or American Express).');
        }

        // Check card name
        if (cardName === '') {
            validationErrors.push('Please enter the name on the card.');
        }

        // Check card number
        if (cardNumber === '') {
            validationErrors.push('Please enter the card number.');
        } else if (!/^\d+$/.test(cardNumber)) {
            validationErrors.push('Card number must contain only digits.');
        } else {
            if ((selectedCardType === 'visa' || selectedCardType === 'master') && cardNumber.length !== 16) {
                validationErrors.push('Visa/MasterCard number must be exactly 16 digits.');
            } else if (selectedCardType === 'ae' && cardNumber.length !== 15) {
                validationErrors.push('American Express card number must be exactly 15 digits.');
            }
        }

        // Check expiry date
        if (month === '' || month === 'Month' || year === '' || year === 'Year') {
            validationErrors.push('Please select the card expiry month and year.');
        } else {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;
            const selectedYear = parseInt(year);
            const selectedMonth = parseInt(month);
            
            if (selectedYear < currentYear || (selectedYear === currentYear && selectedMonth < currentMonth)) {
                validationErrors.push('The card has expired. Please use a valid card.');
            }
        }

        // Check CVV - Amex uses 4 digits, others use 3
        if (cvv === '') {
            validationErrors.push('Please enter the CVV number.');
        } else if (!/^\d+$/.test(cvv)) {
            validationErrors.push('CVV must contain only digits.');
        } else {
            if (selectedCardType === 'ae' && cvv.length !== 4) {
                validationErrors.push('American Express CVV must be 4 digits.');
            } else if ((selectedCardType === 'visa' || selectedCardType === 'master') && cvv.length !== 3) {
                validationErrors.push('CVV must be 3 digits for Visa/MasterCard.');
            } else if (cvv.length < 3 || cvv.length > 4) {
                validationErrors.push('CVV must be 3 or 4 digits.');
            }
        }
    }

    // Function to clear all errors
    function clearAllErrors() {
        const errors = document.querySelectorAll('.error-message');
        errors.forEach(error => error.remove());
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => input.style.borderColor = '');
    }

    // Function to toggle delivery and billing address visibility
    function toggleAddresses() {
        if (pickupRadio.checked) {
            deliveryAddress.style.display = "none";
        } else if (deliveryRadio.checked) {
            deliveryAddress.style.display = "block";
        }
    }

    // Event listener for Pickup radio button
    pickupRadio.addEventListener("change", function () {
        toggleAddresses();
        sameAsDeliveryCheckbox.checked = false;
        // Clear delivery address fields when switching to pickup
        document.getElementById('delivery-street').value = '';
        document.getElementById('delivery-ward').value = '';
        document.getElementById('delivery-district').value = '';
        document.getElementById('zipc1').value = '';
    });

    // Event listener for Delivery radio button
    deliveryRadio.addEventListener("change", function () {
        toggleAddresses();
    });

    // Event listener for "Same as delivery address" checkbox
    sameAsDeliveryCheckbox.addEventListener("change", function () {
        if (sameAsDeliveryCheckbox.checked) {
            const deliveryStreet = document.getElementById('delivery-street').value.trim();
            const deliveryWard = document.getElementById('delivery-ward').value.trim();
            const deliveryDistrict = document.getElementById('delivery-district').value.trim();
            const deliveryZipCode = document.getElementById('zipc1').value.trim();

            if (deliveryStreet === '' || deliveryWard === '' || deliveryDistrict === '' || deliveryZipCode === '') {
                alert('Please enter your delivery address first before using this option.');
                sameAsDeliveryCheckbox.checked = false;
            } else {
                document.getElementById('billing-street').value = deliveryStreet;
                document.getElementById('billing-ward').value = deliveryWard;
                document.getElementById('billing-district').value = deliveryDistrict;
                document.getElementById('zipc2').value = deliveryZipCode;
            }
        } else {
            // Clear billing fields when unchecked
            document.getElementById('billing-street').value = '';
            document.getElementById('billing-ward').value = '';
            document.getElementById('billing-district').value = '';
            document.getElementById('zipc2').value = '';
        }
    });

    // Event listener for payment method radio buttons
    payOnPickupRadio.addEventListener("change", function () {
        creditCardInfo.style.display = "none";
    });

    payOnlineRadio.addEventListener("change", function () {
        creditCardInfo.style.display = "block";
    });

    // Hide the credit card + delivery address info section by default
    creditCardInfo.style.display = "none"; 
    deliveryAddress.style.display = "none"; 

    // Populate Months and Years in expiry date dropdowns
    const expirationMonthSelect = document.getElementById("expirationMonth");
    const expirationYearSelect = document.getElementById("expirationYear");

    function populateMonths() {
        // Clear existing options first
        expirationMonthSelect.innerHTML = '<option value="" disabled selected>Month</option>';
        
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        months.forEach(function (month, index) {
            const option = document.createElement("option");
            option.value = index + 1;
            option.textContent = month;
            expirationMonthSelect.appendChild(option);
        });
    }

    function populateYears() {
        // Clear existing options first
        expirationYearSelect.innerHTML = '<option value="" disabled selected>Year</option>';
        
        const currentYear = new Date().getFullYear();
        
        // Show current year and next 10 years
        for (let year = currentYear; year <= currentYear + 10; year++) {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            expirationYearSelect.appendChild(option);
        }
    }

    populateMonths();
    populateYears();
});