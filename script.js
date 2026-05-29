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
            // Replace these with your actual Payhero credentials
            const PAYHERO_CHANNEL_ID = 'YOUR_CHANNEL_ID'; 
            const PAYHERO_API_KEY = 'YOUR_API_KEY';
            const PAYHERO_API_PASS = 'YOUR_API_PASSWORD';

            // Payhero API Endpoint
            const response = await fetch('https://backend.payhero.co.ke/api/v2/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(PAYHERO_API_KEY + ':' + PAYHERO_API_PASS)
                },
                body: JSON.stringify({
                    amount: 100,
                    phone_number: phone,
                    channel_id: PAYHERO_CHANNEL_ID,
                    provider: 'm-pesa',
                    external_reference: 'ACT-' + Date.now(),
                    callback_url: 'https://chat-wazungu.vercel.app/callback' // Update with your actual callback URL
                })
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
