// Q-Day countdown — target: Jan 1, 2029
(function() {
  const target = new Date('2029-01-01T00:00:00Z').getTime();

  function pad(n, len) {
    return String(n).padStart(len, '0');
  }

  function update() {
    const el = document.getElementById('countdown');
    if (!el) return;
    const now = Date.now();
    const diff = Math.max(0, target - now);
    const days = Math.floor(diff / 86400000);
    const hrs  = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    const ms   = Math.floor((diff % 1000) / 10);
    el.textContent = `${pad(days,4)}:${pad(hrs,2)}:${pad(mins,2)}:${pad(secs,2)}:${pad(ms,2)}`;
  }

  update();
  setInterval(update, 50);
})();
