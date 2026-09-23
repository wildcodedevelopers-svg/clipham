const express = require('express');
const cors = require('cors');
const path = require('path');
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI client using the environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Endpoint: Generate AI Script
app.post('/api/generate-script', async (req, res) => {
  const { topic, voice, style } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert viral short-form video creator for TikTok and YouTube Shorts.
          Generate a high-retention script for the requested topic.
          Your output MUST be a valid JSON object with these exact keys:
          - "hook": A high-energy, 3 to 6 word opening text overlay.
          - "scriptText": The main spoken narration (30-45 seconds long).
          - "cta": A strong short call to action for profile bio clicks.`
        },
        {
          role: 'user',
          content: `Topic: ${topic}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const aiData = JSON.parse(response.choices[0].message.content);

    res.json({
      success: true,
      data: aiData
    });
  } catch (err) {
    console.error('OpenAI Error:', err);
    res.status(500).json({ error: 'Failed to generate script via OpenAI' });
  }
});

app.listen(PORT, () => {
  console.log(`CLIPHAM running on http://localhost:${PORT}`);
});
