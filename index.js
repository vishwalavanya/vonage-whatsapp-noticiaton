// index.js
const express = require('express');
const axios = require('axios');

const app = express();

// ------------------ CONFIG ------------------ //
// These will be set in Render environment variables
const VONAGE_API_KEY = process.env.VONAGE_API_KEY;
const VONAGE_API_SECRET = process.env.VONAGE_API_SECRET;
const VONAGE_NUMBER = process.env.VONAGE_NUMBER; // Your Vonage/WhatsApp number (without +)

// Hardcoded recipient (your WhatsApp number)
const RECIPIENT_NUMBER = '9944490717'; 

if (!VONAGE_API_KEY || !VONAGE_API_SECRET || !VONAGE_NUMBER) {
    console.error("Please set VONAGE_API_KEY, VONAGE_API_SECRET, and VONAGE_NUMBER as environment variables");
    process.exit(1);
}
// ------------------------------------------- //

app.get('/', async (req, res) => {
    try {
        const message = "Hello! This is an automatic WhatsApp notification from Vonage.";

        const response = await axios.post(
            'https://messages-sandbox.nexmo.com/v1/messages',
            {
                from: VONAGE_NUMBER,
                to: RECIPIENT_NUMBER,
                message_type: "text",
                text: message,
                channel: "whatsapp"
            },
            {
                auth: { username: VONAGE_API_KEY, password: VONAGE_API_SECRET },
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
            }
        );

        console.log("Message sent:", response.data);
        res.send("WhatsApp notification sent successfully!");
    } catch (error) {
        console.error("Error sending message:", error.response?.data || error.message);
        res.status(500).send("Failed to send WhatsApp notification");
    }
});

// Listen on port provided by Render or default 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
