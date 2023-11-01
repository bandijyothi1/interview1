const express = require('express');
const axios = require('axios');
const Push = require('node-pushover');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Initialize Pushover
const push = new Push({
    token: process.env.PUSHOVER_TOKEN,
    user: process.env.PUSHOVER_USER
});

// Endpoint for conducting Data Entry interview
app.post('/interview', async (req, res) => {
    const prompt = "Conduct an interview for a Data Entry position. Assess skills such as attention to detail, proficiency in Excel, and time management.";
    const maxTokens = 150;

    try {
        const apiKey = process.env.OPENAI_API_KEY;
        const config = {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        };

        const payload = {
            prompt,
            max_tokens: maxTokens
        };

        const apiResponse = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', payload, config);

        const interviewData = apiResponse.data.choices[0].text.trim();

        // Send interview data via Pushover
        push.send("Interview Results", interviewData, (err, result) => {
            if (err) {
                res.status(500).json({ error: "Failed to send notification" });
                return;
            }
            res.json({ interviewData, notification: "Sent" });
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
