const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 10000;

// Initialize Google Gemini API client using key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Endpoint: Generate Script using Gemini 2.5 Flash
app.post('/api/generate-script', async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    const prompt = `You are an expert viral short-form video creator. 
Generate a high-retention script for the following topic: "${topic}".
Return ONLY a raw, valid JSON object with no markdown formatting or backticks.
Format:
{
  "hook": "Short energetic text overlay (3-5 words)",
  "scriptText": "Spoken narration for 30 seconds",
  "cta": "Short call-to-action"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const aiData = JSON.parse(response.text);

    res.json({
      success: true,
      data: aiData
    });
  } catch (err) {
    console.error('Gemini API Error:', err);
    res.status(500).json({ error: 'Failed to generate script via Gemini API' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CLIPHAM running on port ${PORT}`);
});
