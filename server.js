const express = require('express');
const cors = require('cors');
const path = require('path');
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Endpoint 1: Generate AI Script
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
          Generate a high-retention script for the topic.
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
    console.error('OpenAI Script Error:', err);
    res.status(500).json({ error: 'Failed to generate script via OpenAI' });
  }
});

// Endpoint 2: Generate Voice Audio (OpenAI TTS)
app.post('/api/generate-voice', async (req, res) => {
  const { text, voice = 'onyx' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text prompt is required for TTS' });
  }

  try {
    // Generate voice MP3 using OpenAI TTS API
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1', // Fast latency for web apps
      voice: voice,   // Voice options: onyx, alloy, echo, fable, nova, shimmer
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer()); //
    const base64Audio = buffer.toString('base64'); //

    res.json({
      success: true,
      audioUrl: `data:audio/mp3;base64,${base64Audio}`
    });
  } catch (err) {
    console.error('OpenAI TTS Error:', err);
    res.status(500).json({ error: 'Failed to generate voice audio' });
  }
});

app.listen(PORT, () => {
  console.log(`CLIPHAM running on http://localhost:${PORT}`);
});
