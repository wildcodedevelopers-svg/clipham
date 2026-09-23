// Helper for topic chips
function setTopic(val) {
  const topicInput = document.getElementById('topicInput');
  if (topicInput) topicInput.value = val;
}

// Copy script helper
function copyScript() {
  const scriptBox = document.getElementById('scriptBox');
  if (scriptBox && scriptBox.value) {
    navigator.clipboard.writeText(scriptBox.value);
    alert('Script copied to clipboard!');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.getElementById('generateBtn');
  const topicInput = document.getElementById('topicInput');
  const scriptBox = document.getElementById('scriptBox');
  const captionPreview = document.getElementById('captionPreview');
  const statusText = document.getElementById('statusText');

  if (!generateBtn) return;

  generateBtn.addEventListener('click', async () => {
    const topic = topicInput.value.trim();

    if (!topic) {
      alert('Please enter a topic first!');
      return;
    }

    // UI Loading state
    generateBtn.disabled = true;
    generateBtn.textContent = '⏳ Generating Draft...';
    if (statusText) statusText.textContent = 'Generating AI Script...';

    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topic })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const { hook, scriptText, cta } = result.data;

        // Populate overlay caption preview
        if (captionPreview) captionPreview.textContent = hook.toUpperCase();

        // Populate script timeline textarea
        if (scriptBox) {
          scriptBox.value = `HOOK:\n${hook}\n\nNARRATION:\n${scriptText}\n\nCALL TO ACTION:\n${cta}`;
        }

        if (statusText) statusText.textContent = 'Draft Generated Successfully!';
      } else {
        alert(`Error: ${result.error || 'Failed to generate script'}`);
        if (statusText) statusText.textContent = 'Generation Failed';
      }
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Network error connecting to backend.');
      if (statusText) statusText.textContent = 'Network Error';
    } finally {
      generateBtn.disabled = false;
      generateBtn.textContent = '🚀 Generate Video Draft';
    }
  });
});

