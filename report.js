// Parse URL params
const params = new URLSearchParams(window.location.search);
const company  = params.get('company')  || 'Accenture';
const industry = params.get('industry') || 'Financial Services';
const lifespan = params.get('lifespan') || 'medium';
const asset    = params.get('asset')    || 'Financial Records';
const cloud    = params.get('cloud')    || 'AWS';

// Score engine
function calcScore() {
  let base = 50;
  if (lifespan === 'long')  base += 20;
  if (lifespan === 'vlong') base += 30;
  if (lifespan === 'short') base -= 10;
  if (cloud === 'AWS' || cloud === 'Google Cloud') base += 10;
  if (cloud === 'On-premise') base += 20;
  if (industry === 'Financial Services' || industry === 'Defense' || industry === 'Government') base += 15;
  if (industry === 'Healthcare') base += 10;
  return Math.min(98, Math.max(20, base));
}

const score = calcScore();
const riskLabel = score >= 70 ? 'Critical Risk' : score >= 45 ? 'Moderate Risk' : 'Low Risk';
const riskClass = score >= 70 ? '' : score >= 45 ? 'moderate' : 'low';
const harvestPct = Math.round(score * 0.87);
const timeToAct = score >= 70 ? '12-18 months' : score >= 45 ? '18-36 months' : '36+ months';

// Populate header
document.getElementById('company-name').textContent = company;
const labelEl = document.getElementById('risk-label');
labelEl.textContent = riskLabel;
if (riskClass) labelEl.classList.add(riskClass);

document.getElementById('report-summary').textContent =
  `${company} has a ${score >= 70 ? 'moderate to high' : score >= 45 ? 'moderate' : 'low'} quantum vulnerability due to its reliance on traditional encryption practices and the ${lifespan === 'short' ? 'relatively short' : 'extended'} data lifespan against an evolving quantum threat landscape.`;

document.getElementById('qscore-val').textContent = score;
document.getElementById('qscore-val').style.color = score >= 70 ? '#ef4444' : score >= 45 ? '#f59e0b' : '#10b981';
document.getElementById('harvest-val').textContent = harvestPct + '%';
document.getElementById('time-val').textContent = timeToAct;
document.getElementById('jewel-desc').textContent =
  `${company}'s ${asset} could be targeted for future decryption since they are currently encrypted with traditional algorithms vulnerable to quantum attacks.`;

// Gauge (semicircle via canvas)
function drawGauge(score) {
  const canvas = document.getElementById('gaugeCanvas');
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height - 10;
  const r = 90;
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;
  const scoreAngle = startAngle + (score / 100) * Math.PI;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Track
  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, endAngle);
  ctx.lineWidth = 14;
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineCap = 'round';
  ctx.stroke();

  // Fill
  const color = score >= 70 ? '#ef4444' : score >= 45 ? '#f59e0b' : '#10b981';
  ctx.beginPath();
  ctx.arc(cx, cy, r, startAngle, scoreAngle);
  ctx.lineWidth = 14;
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.stroke();
}

drawGauge(score);

// Radar chart
const radarCtx = document.getElementById('radarChart').getContext('2d');
const radarData = {
  labels: ['Encryption', 'Data Lifespan', 'Cloud Posture', 'Supply Chain', 'Regulatory'],
  datasets: [{
    data: [
      Math.min(95, score + 5),
      lifespan === 'vlong' ? 90 : lifespan === 'long' ? 75 : lifespan === 'medium' ? 55 : 35,
      cloud === 'On-premise' ? 85 : cloud === 'AWS' ? 80 : 65,
      Math.round(score * 0.85),
      industry === 'Financial Services' ? 60 : industry === 'Government' ? 55 : 45,
    ],
    backgroundColor: 'rgba(34,211,238,0.12)',
    borderColor: '#22d3ee',
    borderWidth: 1.5,
    pointBackgroundColor: '#22d3ee',
    pointRadius: 3,
  }]
};

new Chart(radarCtx, {
  type: 'radar',
  data: radarData,
  options: {
    responsive: true,
    scales: {
      r: {
        min: 0, max: 100,
        ticks: { display: false, stepSize: 25 },
        grid: { color: 'rgba(255,255,255,0.08)' },
        angleLines: { color: 'rgba(255,255,255,0.08)' },
        pointLabels: { color: '#9ca3af', font: { size: 11 } },
      }
    },
    plugins: { legend: { display: false } }
  }
});

// Bar chart
const barLabels = ['Encryption', 'Data Lifespan', 'Cloud\nPosture', 'Supply Chain', 'Regulatory'];
const barScores = [
  Math.min(95, score + 5),
  lifespan === 'vlong' ? 90 : lifespan === 'long' ? 75 : lifespan === 'medium' ? 55 : 35,
  cloud === 'On-premise' ? 85 : cloud === 'AWS' ? 80 : 65,
  Math.round(score * 0.85),
  industry === 'Financial Services' ? 60 : 45,
];

const barDetails = [
  { title: 'Encryption', desc: `${company} relies on RSA-2048 and traditional encryption methods that will become vulnerable once CRQC is achieved.` },
  { title: 'Data Lifespan', desc: `Data with a ${lifespan === 'vlong' ? '25+ year' : lifespan === 'long' ? '10-25 year' : lifespan === 'medium' ? '5-10 year' : 'short'} lifespan faces compounding harvest-now-decrypt-later risk.` },
  { title: 'Cloud Posture', desc: `${cloud} is actively researching post-quantum cryptography, but readiness for full implementation remains uncertain.` },
  { title: 'Supply Chain', desc: `Third-party vendors and supply chain partners may introduce additional quantum vulnerability exposure.` },
  { title: 'Regulatory', desc: `${industry} sector faces evolving NIST PQC compliance requirements that will mandate migration timelines.` },
];

function getBarColor(val) {
  if (val >= 75) return '#ef4444';
  if (val >= 55) return '#92400e';
  return '#78350f';
}

const barCtx = document.getElementById('barChart').getContext('2d');
const barChart = new Chart(barCtx, {
  type: 'bar',
  data: {
    labels: ['Encryption', 'Data Lifespan', 'Cloud Posture', 'Supply Chain', 'Regulatory'],
    datasets: [{
      data: barScores,
      backgroundColor: barScores.map(getBarColor),
      hoverBackgroundColor: barScores.map(v => {
        if (v >= 75) return '#f87171';
        if (v >= 55) return '#b45309';
        return '#92400e';
      }),
      borderRadius: 4,
      barThickness: 18,
    }]
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    onClick(_, elements) {
      if (!elements.length) return;
      const i = elements[0].index;
      const detail = barDetails[i];
      const sev = barScores[i] >= 75 ? 'CRITICAL VULNERABILITY' : barScores[i] >= 55 ? 'HIGH VULNERABILITY' : 'MODERATE VULNERABILITY';
      document.getElementById('drill-title').textContent = detail.title;
      document.getElementById('drill-score').textContent = barScores[i];
      document.getElementById('drill-score').style.color = getBarColor(barScores[i]);
      document.getElementById('drill-severity').textContent = sev;
      document.getElementById('drill-desc').textContent = detail.desc;
      document.getElementById('drill-card').style.display = 'block';
    },
    scales: {
      x: {
        min: 0, max: 100,
        ticks: { color: '#6b7280', font: { size: 11 } },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
      y: {
        ticks: { color: '#9ca3af', font: { size: 11 } },
        grid: { display: false },
      }
    },
    plugins: { legend: { display: false }, tooltip: { enabled: false } }
  }
});

// Findings data
const allFindings = [
  { level: 'critical', title: 'Vulnerable Encryption Methods', desc: `The current encryption used for ${asset} is exposed to potential future quantum decryption, raising concerns about data integrity.` },
  { level: 'high', title: 'Inadequate Cloud Security Measures', desc: `While ${cloud} has initiatives for quantum resilience, the immediate applicability of these measures to protect ${company}'s data is untested.` },
  { level: 'moderate', title: 'Uncertain Data Harvesting Strategy', desc: `Though data lifespan is ${lifespan === 'short' ? 'short' : 'extended'}, adversaries may still collect encrypted data with the aim to decrypt later, especially targeting valuable ${asset}.` },
  { level: 'low', title: 'Regulatory Timeline Uncertainty', desc: `NIST PQC standards enforcement timelines remain uncertain, creating planning challenges for ${industry} sector compliance.` },
];

const allRecs = [
  { level: 'critical', title: 'Transition to Post-Quantum Cryptography', desc: `Begin adopting quantum-safe encryption methods ASAP to protect ${asset} against potential decryption in the future.`, timeline: 'Timeline: 0-6 months' },
  { level: 'high', title: `Enhance ${cloud} Security Policies`, desc: `Collaborate with ${cloud} to understand and implement current post-quantum measures and develop a tailored cloud security strategy.`, timeline: 'Timeline: 6-12 months' },
  { level: 'medium', title: 'Establish Data Protection Protocols', desc: `Revise current data protection policies to include strategies against data harvesting, while aligning data lifespan protocols with quantum readiness.`, timeline: 'Timeline: 12-18 months' },
  { level: 'low', title: 'Monitor Regulatory Developments', desc: `Assign a team to track NIST PQC and sector-specific regulatory changes and maintain a readiness roadmap.`, timeline: 'Timeline: Ongoing' },
];

function dotClass(level) {
  return { critical: 'dot-critical', high: 'dot-high', moderate: 'dot-moderate', low: 'dot-low' }[level] || 'dot-low';
}

function renderFindings(filter) {
  const list = document.getElementById('findings-list');
  const items = filter === 'all' ? allFindings : allFindings.filter(f => f.level === filter);
  list.innerHTML = items.map(f => `
    <div class="finding-item">
      <div class="finding-dot ${dotClass(f.level)}"></div>
      <div>
        <div class="finding-item-title">${f.title}</div>
        <div class="finding-item-desc">${f.desc}</div>
      </div>
    </div>
  `).join('');
}

function renderRecs(filter) {
  const list = document.getElementById('recs-list');
  const items = filter === 'all' ? allRecs : allRecs.filter(r => r.level === filter || (filter === 'medium' && r.level === 'medium'));
  list.innerHTML = items.map(r => `
    <div class="rec-item">
      <div class="rec-header">
        <div class="rec-title">${r.title}</div>
        <span class="rec-badge badge-${r.level === 'medium' ? 'medium' : r.level}">${r.level.toUpperCase()}</span>
      </div>
      <div class="rec-desc">${r.desc}</div>
      <div class="rec-timeline">${r.timeline}</div>
    </div>
  `).join('');
}

function filterFindings(level, btn) {
  document.querySelectorAll('#findings-filters .fpill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderFindings(level);
}

function filterRecs(level, btn) {
  document.querySelectorAll('#recs-filters .fpill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderRecs(level);
}

renderFindings('all');
renderRecs('all');

// Ask question
const qaBank = [
  { k: ['biggest', 'vulnerability', 'worst', 'top', 'main'], a: () => `${company}'s biggest vulnerability is its reliance on traditional encryption for ${asset}. With a Q-Score of ${score}/100, the harvest-now-decrypt-later threat is your most urgent risk — adversaries may already be collecting your encrypted data.` },
  { k: ['encrypt', 'rsa', 'algorithm', 'crypto'], a: () => `Current encryption methods protecting ${asset} use algorithms that will become vulnerable once a Cryptographically Relevant Quantum Computer (CRQC) is achieved. Transitioning to NIST-approved post-quantum algorithms (CRYSTALS-Kyber, CRYSTALS-Dilithium) within 6 months is recommended.` },
  { k: ['cloud', cloud.toLowerCase(), 'aws', 'azure', 'google'], a: () => `${cloud} is actively developing quantum-resilient infrastructure, but organization-level PQC migration is not yet automatic — you must opt in. Your cloud posture scores ${cloud === 'On-premise' ? '85' : cloud === 'AWS' ? '80' : '65'}/100 for vulnerability, requiring a tailored security strategy.` },
  { k: ['time', 'when', 'how long', 'urgent', 'deadline'], a: () => `Your recommended action window is ${timeToAct}. After this, the cost and complexity of migration increases significantly as NIST PQC mandates take effect across the ${industry} sector.` },
  { k: ['harvest', 'steal', 'collect', 'store'], a: () => `Harvest-now-decrypt-later (HNDL) is a real and active threat. With a ${harvestPct}% harvest risk score, it is likely that nation-state adversaries are already archiving ${company}'s encrypted ${asset} for decryption once quantum computers mature.` },
  { k: ['score', 'q-score', 'number', 'rating', 'mean'], a: () => `Your Q-Score of ${score}/100 represents your overall quantum vulnerability. Scores above 70 indicate critical risk requiring immediate action. The score is calculated from your encryption posture, data lifespan requirements, cloud provider readiness, and industry threat exposure.` },
];

function askQuestion() {
  const input = document.getElementById('ask-input');
  const q = input.value.trim().toLowerCase();
  if (!q) return;

  const match = qaBank.find(entry => entry.k.some(k => q.includes(k)));
  const answer = match
    ? match.a()
    : `Based on the assessment for ${company}: your Q-Score is ${score}/100 (${riskLabel}), with a primary exposure in ${asset}. The most urgent action is initiating a post-quantum cryptography migration within ${timeToAct}. For more specific questions, try asking about encryption, cloud posture, harvest risk, or timelines.`;

  document.getElementById('ask-response').innerHTML = `<div class="ask-answer">${answer}</div>`;
  input.value = '';
}

document.getElementById('ask-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') askQuestion();
});
