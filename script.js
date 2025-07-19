document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registrationForm');
    const drinkChoiceGroup = document.getElementById('drinkChoiceGroup');
    const drinkRadios = document.querySelectorAll('input[name="drinks"]');

    // Modals
    const successModal = document.getElementById('successModal');
    const errorModal = document.getElementById('errorModal');
    const closeSuccess = document.getElementById('closeSuccess');
    const closeError = document.getElementById('closeError');

    // Show/hide drink choice based on radio button selection
    drinkRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.value === 'yes') {
                drinkChoiceGroup.style.display = 'block';
            } else {
                drinkChoiceGroup.style.display = 'none';
            }
        });
    });

    // Form submission handler
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (validateForm()) {
            submitForm();
        }
    });

    function validateForm() {
        let isValid = true;
        // Reset errors
        document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

        // Name validation
        const name = document.getElementById('name');
        const nameError = document.getElementById('nameError');
        if (name.value.trim() === '' || !/^[a-zA-Z\s]+$/.test(name.value)) {
            nameError.textContent = 'Name is required and must be alphabetic.';
            nameError.style.display = 'block';
            isValid = false;
        }

        // Phone validation
        const phone = document.getElementById('phone');
        const phoneError = document.getElementById('phoneError');
        if (!/^\d{10}$/.test(phone.value)) {
            phoneError.textContent = 'Please enter a valid 10-digit phone number.';
            phoneError.style.display = 'block';
            isValid = false;
        }

        // Roll number validation
        const rollNumber = document.getElementById('rollNumber');
        const rollNumberError = document.getElementById('rollNumberError');
        if (rollNumber.value.trim() === '') {
            rollNumberError.textContent = 'Roll number is required.';
            rollNumberError.style.display = 'block';
            isValid = false;
        }

        // Drink choice validation
        const drinksYes = document.querySelector('input[name="drinks"][value="yes"]').checked;
        const drinkChoice = document.getElementById('drinkChoice');
        const drinkChoiceError = document.getElementById('drinkChoiceError');
        if (drinksYes && drinkChoice.value.trim() === '') {
            drinkChoiceError.textContent = 'Please specify your drink choice.';
            drinkChoiceError.style.display = 'block';
            isValid = false;
        }

        return isValid;
    }

    async function submitForm() {
        const formData = new FormData(form);
        const object = {};
        formData.forEach((value, key) => {
            // Handle optional suggestion box
            if (key === 'suggestions' && value.trim() === '') {
                object[key] = null;
            } else {
                object[key] = value;
            }
        });

        // If no drinks, don't include the empty drinkChoice
        if (object.drinks === 'no') {
            delete object.drinkChoice;
        }

        const json = JSON.stringify(object);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            });

            if (response.ok) {
                showSuccessModal();
                form.reset();
                drinkChoiceGroup.style.display = 'none'; // Reset conditional field
            } else {
                showErrorModal();
            }
        } catch (error) {
            showErrorModal();
        }
    }

    function showSuccessModal() {
        successModal.style.display = 'flex';
    }

    function showErrorModal() {
        errorModal.style.display = 'flex';
    }

    // Close modal events
    closeSuccess.onclick = () => successModal.style.display = 'none';
    closeError.onclick = () => errorModal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target == successModal) {
            successModal.style.display = 'none';
        }
        if (event.target == errorModal) {
            errorModal.style.display = 'none';
        }
    };
});