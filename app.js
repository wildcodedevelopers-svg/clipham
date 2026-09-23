function setTopic(text) {
  document.getElementById('topicInput').value = text;
}

function simGenerate() {
  const topic = document.getElementById('topicInput').value;
  const statusText = document.getElementById('statusText');
  const captionPreview = document.getElementById('captionPreview');
  const scriptBox = document.getElementById('scriptBox');
  const btn = document.getElementById('generateBtn');

  if (!topic) {
    alert('Please enter a topic first!');
    return;
  }

  btn.innerText = '⚡ Processing AI Script & Media...';
  statusText.innerText = 'Fetching High-Retention Assets...';

  setTimeout(() => {
    btn.innerText = '🚀 Generate Video Draft';
    statusText.innerText = 'Preview Loaded';
    captionPreview.innerText = 'THIS CHANGES EVERYTHING!';
    scriptBox.value = `[HOOK]: Stop scrolling if you care about performance.\n[BODY]: Here is why the ${topic} is breaking records this year.\n[CTA]: Check link in bio to monetize yours today.`;
  }, 1500);
}

function copyScript() {
  const scriptBox = document.getElementById('scriptBox');
  if (!scriptBox.value) return;
  navigator.clipboard.writeText(scriptBox.value);
  alert('Script copied to clipboard!');
}

function renderFinal() {
  alert('Initiating backend render... Dedicated video credits will be deducted.');
}
