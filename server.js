// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Endpoint 1: Generate AI Script Breakdown
app.post('/api/generate-script', async (req, res) => {
  const { topic, voice, style } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  // System Prompt template for viral short-form video structure
  const prompt = `You are a viral short-form video editor for TikTok and YouTube Shorts. 
  Create a high-retention 30-second video script for the topic: "${topic}".
  Return JSON with these fields:
  - hook: Strong 3-5 word opening text overlay.
  - scriptText: Full narration spoken text.
  - visualCues: Array of 3 background visual search terms.
  - cta: Short affiliate call to action.`;

  try {
    // Mock response simulating AI API return (replace with live API key call)
    const aiResponse = {
      hook: `UNBELIEVABLE ${topic.toUpperCase()} REVEAL!`,
      scriptText: `Did you know this about ${topic}? Most people get this completely wrong. If you want to master this, stay tuned until the end!`,
      visualCues: [`${topic} cinematic`, `${topic} close up`, `hyper car motion`],
      cta: `Click the link in bio for full details.`
    };

    res.json({ success: true, data: aiResponse });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate script' });
  }
});

// Endpoint 2: Render & Stitch MP4 Video
app.post('/api/render-video', async (req, res) => {
  const { scriptData } = req.body;

  // Render pipeline triggers FFmpeg rendering background job
  res.json({
    success: true,
    message: 'Rendering queued',
    jobId: `job_${Date.now()}`
  });
});

app.listen(PORT, () => {
  console.log(`CLIPHAM server running on http://localhost:${PORT}`);
});
