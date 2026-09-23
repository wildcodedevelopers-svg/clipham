const express = require('express');
const cors = require('cors');
const path = require('path');
const { OpenAI } = require('openai');

const app = express();
// Use Render's PORT or fallback to 10000
const PORT = process.env.PORT || 10000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Endpoint: Generate Script
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
          content: `You are an expert viral short-form video creator. 
          Generate a high-retention script for the requested topic.
          Return ONLY a valid JSON object with:
          - "hook": Short energetic text overlay (3-5 words).
          - "scriptText": Spoken narration for 30 seconds.
          - "cta": Short call-to-action.`
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

// Explicitly bind to 0.0.0.0 for Render
app.listen(PORT, '0.0.0.0', () => {
  console.log(`CLIPHAM running on port ${PORT}`);
});
