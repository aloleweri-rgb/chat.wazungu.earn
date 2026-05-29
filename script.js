document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const password = document.getElementById('password');
    
    // Reset errors
    document.querySelectorAll('.input-group').forEach(group => {
        group.classList.remove('error-active');
    });

    if (!username.value.trim()) {
        username.closest('.input-group').classList.add('error-active');
        isValid = false;
    }

    if (!email.value.trim() || !email.value.includes('@')) {
        email.closest('.input-group').classList.add('error-active');
        isValid = false;
    }

    const phoneValue = phone.value.trim();
    if (!phoneValue || !(phoneValue.startsWith('07') || phoneValue.startsWith('01')) || phoneValue.length < 10) {
        phone.closest('.input-group').classList.add('error-active');
        isValid = false;
    }

    if (!password.value.trim() || password.value.length < 6) {
        password.closest('.input-group').classList.add('error-active');
        isValid = false;
    }

    if (isValid) {
        // Proceed to the next step
        window.location.href = 'payment.html';
    }
});

document.querySelector('.sign-in-link').addEventListener('click', function(e) {
    e.preventDefault();
    // Redirect to Sign in
    window.location.href = 'signin.html';
});

// Payhero Integration
const payButton = document.getElementById('payButton');
if (payButton) {
    payButton.addEventListener('click', async function() {
        const phoneInput = document.getElementById('mpesa-number');
        const phone = phoneInput ? phoneInput.value.trim() : '';

        if (!phone || phone.length < 9) {
            alert('Please enter a valid M-PESA number');
            return;
        }

        // Change button state
        const originalText = payButton.innerHTML;
        payButton.innerHTML = 'Initiating...';
        payButton.disabled = true;
        payButton.style.opacity = '0.7';

        try {
            // Call our local backend to avoid CORS and securely handle API keys
            const response = await fetch('http://localhost:3000/api/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phone: phone })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert('M-PESA prompt sent! Please enter your PIN on your phone to complete the payment.');
            } else {
                alert('Failed to initiate payment: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Payment Error:', error);
            alert('An error occurred while initiating payment. Check console for details.');
        } finally {
            // Restore button state
            payButton.innerHTML = originalText;
            payButton.disabled = false;
            payButton.style.opacity = '1';
        }
    });
}
