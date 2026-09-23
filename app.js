// app.js - Connected to CLIPHAM Express Backend

function setTopic(text) {
  document.getElementById('topicInput').value = text;
}

async function simGenerate() {
  const topic = document.getElementById('topicInput').value;
  const voice = document.getElementById('voiceSelect').value;
  const style = document.getElementById('captionStyle').value;
  const statusText = document.getElementById('statusText');
  const captionPreview = document.getElementById('captionPreview');
  const scriptBox = document.getElementById('scriptBox');
  const btn = document.getElementById('generateBtn');

  if (!topic) {
    alert('Please enter a topic first!');
    return;
  }

  // UI state updates
  btn.disabled = true;
  btn.innerText = '⚡ Requesting AI Engine...';
  statusText.innerText = 'Generating Viral Script...';

  try {
    // Real API request to server.js backend
    const response = await fetch('/api/generate-script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, voice, style })
    });

    const result = await response.json();

    if (result.success) {
      const data = result.data;
      
      // Update preview canvas and script box dynamically
      btn.innerText = '🚀 Generate Video Draft';
      statusText.innerText = 'Preview Loaded';
      captionPreview.innerText = data.hook;
      
      scriptBox.value = `[HOOK]: ${data.hook}\n\n[NARRATION]: ${data.scriptText}\n\n[CTA]: ${data.cta}`;
    } else {
      throw new Error(result.error || 'Server processing failed');
    }
  } catch (err) {
    console.error('Generation Error:', err);
    statusText.innerText = 'Error Generating Preview';
    alert('Failed to connect to backend server.');
  } finally {
    btn.disabled = false;
    btn.innerText = '🚀 Generate Video Draft';
  }
}

function copyScript() {
  const scriptBox = document.getElementById('scriptBox');
  if (!scriptBox.value) return;
  navigator.clipboard.writeText(scriptBox.value);
  alert('Script copied to clipboard!');
}

async function renderFinal() {
  const scriptText = document.getElementById('scriptBox').value;
  
  if (!scriptText) {
    alert('Generate a script draft before rendering!');
    return;
  }

  alert('Initiating HD MP4 rendering queue on Node.js backend...');
}

