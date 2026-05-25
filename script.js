/**
 * Arwen's Blessing Generator — script.js
 * Frontend logic: starfield, blessing fetch, counter, audio, version
 */

'use strict';

// ═══════════════════════════════════════════════════════════════════
// STARFIELD — Drifting star particles (Elbereth's light)
// ═══════════════════════════════════════════════════════════════════

(function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let animFrame;

  // Resize canvas to viewport
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Create a single star with random properties
  function createStar() {
    return {
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      radius:  Math.random() * 1.2 + 0.2,
      opacity: Math.random() * 0.7 + 0.1,
      speed:   Math.random() * 0.08 + 0.01,    // drift speed
      drift:   (Math.random() - 0.5) * 0.03,   // horizontal drift
      pulse:   Math.random() * Math.PI * 2,     // phase offset for twinkle
      pulseSpeed: Math.random() * 0.012 + 0.004
    };
  }

  // Populate star array
  function initStars() {
    const count = Math.floor((canvas.width * canvas.height) / 4000);
    stars = Array.from({ length: Math.min(count, 280) }, createStar);
  }

  // Main draw loop
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const star of stars) {
      // Twinkle: modulate opacity with sine wave
      const twinkle = Math.sin(star.pulse) * 0.35 + 0.65;
      const alpha   = star.opacity * twinkle;

      // Occasionally draw as a tiny four-pointed star for variety
      if (star.radius > 1.0) {
        ctx.save();
        ctx.translate(star.x, star.y);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#d4c88a';
        // Draw a small plus / cross shape
        const r = star.radius;
        ctx.fillRect(-r * 0.35, -r * 1.4, r * 0.7, r * 2.8);
        ctx.fillRect(-r * 1.4, -r * 0.35, r * 2.8, r * 0.7);
        ctx.restore();
      } else {
        // Simple round star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 210, 170, ${alpha})`;
        ctx.fill();
      }

      // Update position — slow downward drift
      star.y     += star.speed;
      star.x     += star.drift;
      star.pulse += star.pulseSpeed;

      // Wrap around edges
      if (star.y > canvas.height + 2) {
        star.y = -2;
        star.x = Math.random() * canvas.width;
      }
      if (star.x < -2)                star.x = canvas.width + 1;
      if (star.x > canvas.width  + 2) star.x = -1;
    }

    animFrame = requestAnimationFrame(draw);
  }

  // Init
  resize();
  initStars();
  draw();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animFrame);
    resize();
    initStars();
    draw();
  });
})();


// ═══════════════════════════════════════════════════════════════════
// WEB AUDIO — Soft elvish chime using the Web Audio API
// No external files needed; synthesized purely in-browser.
// ═══════════════════════════════════════════════════════════════════

/**
 * Plays a delicate, ethereal chime — three harmonic tones that fade out,
 * evoking the silver bells of Rivendell.
 */
function playElvishChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ac = new AudioContext();

    // Unlock context if needed (for browsers requiring user interaction)
    if (ac.state === 'suspended') {
      ac.resume();
    }

    // Three harmonically related notes: root, major third, perfect fifth
    // ~C5 (523), E5 (659), G5 (784) Hz — a soft C major chord
    const notes = [523.25, 659.25, 783.99];
    const now   = ac.currentTime;

    notes.forEach((freq, i) => {
      const osc  = ac.createOscillator();
      const gain = ac.createGain();

      // Sine wave for purity; slight detune for warmth
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(i * 3, now); // subtle chorus

      // Envelope: fast attack, long natural decay
      const startTime = now + i * 0.12;   // stagger each note
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18 - i * 0.03, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 2.8);

      osc.connect(gain);
      gain.connect(ac.destination);

      osc.start(startTime);
      osc.stop(startTime + 3.0);
    });

    // Add a very soft reverb shimmer on the last note using a secondary osc
    const shimmer = ac.createOscillator();
    const shimmerGain = ac.createGain();
    shimmer.type = 'sine';
    shimmer.frequency.setValueAtTime(1046.5, now + 0.3); // C6 — an octave up
    shimmerGain.gain.setValueAtTime(0, now + 0.3);
    shimmerGain.gain.linearRampToValueAtTime(0.06, now + 0.35);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
    shimmer.connect(shimmerGain);
    shimmerGain.connect(ac.destination);
    shimmer.start(now + 0.3);
    shimmer.stop(now + 2.5);

  } catch (err) {
    // Audio is non-critical — fail silently
    console.warn('Elvish chime could not be played:', err.message);
  }
}


// ═══════════════════════════════════════════════════════════════════
// BLESSING FETCH — Core feature
// ═══════════════════════════════════════════════════════════════════

const blessingBtn         = document.getElementById('blessingBtn');
const btnText             = document.getElementById('btnText');
const blessingCardWrapper = document.getElementById('blessingCardWrapper');
const blessingSindarin    = document.getElementById('blessingSindarin');
const blessingEnglish     = document.getElementById('blessingEnglish');
const blessingContext     = document.getElementById('blessingContext');
const errorMessage        = document.getElementById('errorMessage');

const localBlessings = [
  {
    sindarin: 'Nai tiruvantel ar varyuvantel i Valar tielyanna',
    english: 'May the Valar protect you on your path',
    context: "Elrond's parting blessing — spoken at the gates of Rivendell to those departing on perilous quests"
  },
  {
    sindarin: 'Nai elen siluva lyenna',
    english: 'May a star shine upon you',
    context: 'A common Elvish blessing, invoking Elbereth Gilthoniel, Lady of Stars, whose light guides wanderers'
  },
  {
    sindarin: 'Cuio i Pheriain anann',
    english: 'May the Halflings live long',
    context: 'A blessing bestowed upon the Ring-bearers, Frodo and Samwise, after the destruction of the One Ring'
  },
  {
    sindarin: 'Nai aurelya nauva calima',
    english: 'May your day be bright',
    context: 'A gentle morning blessing exchanged among the Elves of Lothlórien, greeting the dawn in Caras Galadhon'
  },
  {
    sindarin: "Elen síla lúmenn' omentielvo",
    english: 'A star shines on the hour of our meeting',
    context: 'Spoken by Frodo to Gildor Inglorion — one of the oldest Elvish greetings, carrying the blessing of Elbereth'
  },
  {
    sindarin: 'Quel fara, mellon nín',
    english: 'Good hunting, my friend',
    context: 'A Sindarin farewell of blessing and fortune, often exchanged by the Wood-elves of Mirkwood before a journey'
  },
  {
    sindarin: 'Nai i hwindor nauvar vardar lye',
    english: 'May the breezes protect you',
    context: 'An old Rivendell blessing invoking the winds of the Misty Mountains as gentle guardians of travelers'
  },
  {
    sindarin: "Cormlle naa tanya tel'raa",
    english: 'Your heart is steadfast as stone',
    context: "Arwen's private blessing, whispered to Aragorn before the Grey Company departed for the Paths of the Dead"
  },
  {
    sindarin: "Lissenen ar' maska'lalaith tenna' lye omentuva",
    english: 'Sweet water and light laughter until we meet again',
    context: 'A Lothlórien farewell blessing from Galadriel, wishing peace and joy upon those she loved'
  },
  {
    sindarin: 'Nai Anar caluva tielyanna',
    english: 'May the Sun shine upon your path',
    context: "Spoken by Arwen Undómiel as she watched the Fellowship depart — her hope for Aragorn's safe return"
  },
  {
    sindarin: 'Ae ú-esteliach nad, estelio han',
    english: 'If you trust nothing else, trust this',
    context: "Arwen's vow to Aragorn at Rivendell — the blessing of her undying faith, stronger than the shadow"
  },
  {
    sindarin: 'Nai Valar nauvar as elye',
    english: 'May the Valar be with you',
    context: 'The oldest of Elvish blessings, invoking all the Powers of Arda to walk beside one on their road'
  }
];

let isLoading = false;

/**
 * Show the blessing card with new content.
 * Briefly removes and re-adds the .visible class to re-trigger the
 * CSS animation even when requesting multiple blessings in a row.
 */
function displayBlessing(data) {
  const { sindarin, english, context } = data.blessing;

  // Update text content
  blessingSindarin.textContent = sindarin;
  blessingEnglish.textContent  = english;
  blessingContext.textContent  = context;

  // Hide card momentarily then re-show to replay animation
  blessingCardWrapper.classList.remove('visible');
  blessingCardWrapper.style.display = 'none';

  // Force reflow so the browser registers the class removal
  void blessingCardWrapper.offsetWidth;

  blessingCardWrapper.style.display = '';
  blessingCardWrapper.classList.add('visible');

  // Hide any lingering error
  errorMessage.classList.remove('visible');
  errorMessage.setAttribute('aria-hidden', 'true');
}

/**
 * Show the error state.
 */
function showError() {
  errorMessage.classList.add('visible');
  errorMessage.removeAttribute('aria-hidden');
  blessingCardWrapper.classList.remove('visible');
}

function getLocalBlessing() {
  return localBlessings[Math.floor(Math.random() * localBlessings.length)];
}

/**
 * Set the button to its loading state.
 */
function setLoading(loading) {
  isLoading = loading;
  if (loading) {
    blessingBtn.classList.add('loading');
    btnText.textContent = 'Consulting the Evenstar…';
  } else {
    blessingBtn.classList.remove('loading');
    btnText.textContent = 'Receive Arwen\'s Blessing';
  }
}

/**
 * Fetch a random blessing from the API.
 * Increments the counter server-side automatically.
 */
async function fetchBlessing() {
  if (isLoading) return;

  setLoading(true);

  try {
    const response = await fetch('/api/blessing', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !data.blessing) {
      throw new Error('Invalid response from server');
    }

    displayBlessing(data);
    playElvishChime();

    if (typeof data.totalBlessings === 'number') {
      updateCounterDisplay(data.totalBlessings);
    }

  } catch (err) {
    console.error('Failed to fetch blessing:', err);
    displayBlessing({ blessing: getLocalBlessing() });
    playElvishChime();
  } finally {
    setLoading(false);
  }
}

// Attach click handler to button
blessingBtn.addEventListener('click', fetchBlessing);


// ═══════════════════════════════════════════════════════════════════
// COUNTER — Fetch and display current count on page load
// ═══════════════════════════════════════════════════════════════════

const counterText = document.getElementById('counterText');

/**
 * Update the counter display with a brief fade transition.
 */
function updateCounterDisplay(count) {
  counterText.classList.add('updating');

  setTimeout(() => {
    const noun = count === 1 ? 'blessing has' : 'blessings have';
    counterText.textContent = `${count.toLocaleString()} ${noun} been bestowed upon visitors today`;
    counterText.classList.remove('updating');
  }, 200);
}

/**
 * Fetch current counter from the API on page load (read-only, no increment).
 */
async function loadCounter() {
  try {
    const response = await fetch('/api/counter', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) return;

    const data = await response.json();
    if (data.success) {
      updateCounterDisplay(data.count);
    }
  } catch (err) {
    // Counter is non-critical — fail silently
    console.warn('Could not load counter:', err.message);
  }
}


// ═══════════════════════════════════════════════════════════════════
// VERSION — Fetch and display version badge in footer
// ═══════════════════════════════════════════════════════════════════

const versionNumber = document.getElementById('versionNumber');

/**
 * Fetch the current app version from the API and display it.
 * Confirms the correct deployment is live (CI/CD verification).
 */
async function loadVersion() {
  const endpoints = ['/api/version', '/api/version.json'];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) continue;

      const data = await response.json();
      if (data.success && data.version) {
        versionNumber.textContent = `v${data.version}`;
        return;
      }
    } catch (err) {
      console.warn(`Could not load version from ${endpoint}:`, err.message);
    }
  }

  versionNumber.textContent = 'v?';
}


// ═══════════════════════════════════════════════════════════════════
// INIT — Run on DOMContentLoaded
// ═══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  loadCounter();
  loadVersion();
});
