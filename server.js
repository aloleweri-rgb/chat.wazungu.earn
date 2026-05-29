require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the current directory
app.use(express.static('./'));

app.post('/api/pay', async (req, res) => {
    try {
        const { phone } = req.body;
        
        if (!phone) {
            return res.status(400).json({ success: false, message: 'Phone number is required' });
        }

        const PAYHERO_CHANNEL_ID = process.env.PAYHERO_CHANNEL_ID;
        const PAYHERO_API_KEY = process.env.PAYHERO_API_KEY;
        const PAYHERO_API_PASS = process.env.PAYHERO_API_PASS;

        const response = await fetch('https://backend.payhero.co.ke/api/v2/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(PAYHERO_API_KEY + ':' + PAYHERO_API_PASS).toString('base64')
            },
            body: JSON.stringify({
                amount: 100,
                phone_number: phone,
                channel_id: PAYHERO_CHANNEL_ID,
                provider: 'm-pesa',
                external_reference: 'ACT-' + Date.now(),
                callback_url: 'https://chat-wazungu.vercel.app/callback'
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Payment Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
