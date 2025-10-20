require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// ------------------ CONFIG ------------------ //
const VONAGE_API_KEY = process.env.VONAGE_API_KEY;
const VONAGE_API_SECRET = process.env.VONAGE_API_SECRET;
const VONAGE_NUMBER = process.env.VONAGE_NUMBER; // Your Vonage WhatsApp number (without +)
const RECIPIENT_NUMBER = '919944490717'; // Hardcoded Vishwa number

if (!VONAGE_API_KEY || !VONAGE_API_SECRET || !VONAGE_NUMBER) {
    console.error("Please set VONAGE_API_KEY, VONAGE_API_SECRET, and VONAGE_NUMBER as environment variables");
    process.exit(1);
}
// ------------------------------------------- //

app.get('/', (req, res) => {
    res.send('Vonage WhatsApp notification backend is running ✅');
});

app.post('/send-whatsapp', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) return res.status(400).json({ error: 'Missing "message" in request body' });

        const response = await axios.post(
            'https://messages-sandbox.nexmo.com/v1/messages',
            {
                from: VONAGE_NUMBER,
                to: RECIPIENT_NUMBER,
                message_type: "text",
                text: message, // <-- dynamic message content
                channel: "whatsapp"
            },
            {
                auth: { username: VONAGE_API_KEY, password: VONAGE_API_SECRET },
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            }
        );

        console.log("Message sent:", response.data);
        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error("Error sending message:", error.response?.data || error.message);
        res.status(500).json({ success: false, error: error.response?.data || error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

