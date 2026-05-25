// ── TIMING CONSTANTS ──
// Central place for all animation/transition durations (ms) and counts.
// Tweak here rather than hunting through the code.
const TIMING = {
  // Loader
  loaderFadeOut:      500,   // crack canvas + loader fade duration
  loaderHideDelay:    500,   // ms after fade before hiding + showing scene

  // Keyboard entrance
  keySpreadTotal:     580,   // total ms to spread all keys appearing
  keySpreadJitter:     30,   // random jitter added per key (ms)
  keyTotalKeys:        46,   // total number of keys on the keyboard
  showPressToStartDelay: 700, // ms after keys appear before space glows

  // Key press visual feedback
  keyPressedDuration: 120,   // ms the .pressed class stays on a key

  // Typing
  typingBaseDelay:    70,   // ms between typed characters
  typingJitter:        33,   // random extra ms per character
  typingDoneDelay:    700,   // ms after last char before morphToNav
  typingSkipDelay:    200,   // ms after skip before morphToNav

  // Nav morph
  morphHideDisplayDelay: 200,  // ms before keyboard starts hiding
  morphShowNavDelay:     700,  // ms before nav appears
  navBtnStagger:         120,  // ms between each nav button appearing
  navBtnStaggerOffset:    50,  // initial offset before first button
  chimeDelay:            400,  // ms after nav appears before startup chime
  bindNavDelay:          600,  // ms after nav appears before click handlers bind

  // Zoom / truck transition
  zoomCentreDuration:    800,  // ms for button to zoom to centre
  zoomShrinkDelay:       860,  // ms before button shrinks + fades
  zoomShrinkDuration:    250,  // ms for shrink animation
  zoomHideDelay:         300,  // ms after shrink before truck launches

  // Footer
  footerFadeInDelay:      50,  // ms before footer fades in (after display restore)
  footerFadeInDuration:  500,  // ms for footer opacity transition
  footerFadeOutDuration: 300,  // ms for footer to hide before truck

  // Back navigation
  backTooltipFadeDelay: 3000,  // ms tooltip stays visible before auto-fading
  backNavGuardDelay:     600,  // ms guard before click-anywhere-to-go-back activates
  backPageFadeDuration:  400,  // ms for page to fade out when going back
  backNavReturnDelay:    400,  // ms after page fade before nav pops back in
  backBtnStagger:        100,  // ms between each nav button re-appearing
  backBtnStaggerOffset:   50,  // initial offset before first button re-appears
  backFooterDelay:       200,  // ms before footer fades back in

  // Truck
  truckRevDelay:         100,  // ms delay before truck animation frame starts
  truckPageRevealDelay:  900,  // ms after truck completes before back-nav activates
  truckReverseDuration: 2000,  // ms for the reverse (back) truck wipe animation

  // Email copy feedback
  copiedResetDelay:     1800,  // ms "✓ Copied!" stays before reverting
  copiedAddressDelay:   3000,  // ms raw address stays if clipboard unavailable
};

// ── OWNER EMAIL ──
// Single source of truth — used by the copy button and the contact page content.
const OWNER_EMAIL = 'hi@losdenso.xyz';

// ── UTILITY: DEBOUNCE ──
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// ── CRACK LOADER ──
const crackCanvas = document.getElementById('crack-canvas');
const crackCtx = crackCanvas.getContext('2d');
let crackDone = false; // prevents resize from clearing canvas mid-animation
function resizeCrack(){ crackCanvas.width=window.innerWidth; crackCanvas.height=window.innerHeight; }
resizeCrack();
window.addEventListener('resize', debounce(() => { if(crackDone) resizeCrack(); }, 120));

const crackStages=[
  [[.5,.5,.48,.44],[.5,.5,.52,.44],[.5,.5,.48,.56],[.5,.5,.52,.56]],
  [[.5,.5,.42,.35],[.5,.5,.58,.35],[.5,.5,.42,.65],[.5,.5,.58,.65],[.5,.5,.35,.5],[.5,.5,.65,.5]],
  [[.5,.5,.28,.18],[.5,.5,.72,.18],[.5,.5,.28,.82],[.5,.5,.72,.82],[.5,.5,.15,.5],[.5,.5,.85,.5],[.5,.5,.5,.1],[.5,.5,.5,.9]],
  [[.28,.18,.12,.08],[.28,.18,.18,.35],[.72,.18,.88,.08],[.72,.18,.82,.35],[.28,.82,.12,.92],[.28,.82,.18,.65],[.72,.82,.88,.92],[.72,.82,.82,.65],[.15,.5,.05,.3],[.15,.5,.05,.7],[.85,.5,.95,.3],[.85,.5,.95,.7]],
  [[.12,.08,0,0],[.88,.08,1,0],[.12,.92,0,1],[.88,.92,1,1],[.18,.35,.05,.45],[.82,.35,.95,.45],[.18,.65,.05,.55],[.82,.65,.95,.55],[.5,.1,.3,0],[.5,.1,.7,0],[.5,.9,.3,1],[.5,.9,.7,1]],
  [[.42,.35,.35,.25],[.58,.35,.65,.25],[.42,.65,.35,.75],[.58,.65,.65,.75],[.35,.5,.2,.38],[.65,.5,.8,.38],[.35,.5,.2,.62],[.65,.5,.8,.62],[.3,.18,.22,.06],[.7,.18,.78,.06],[.3,.82,.22,.94],[.7,.82,.78,.94]],
  [[.2,.38,.08,.28],[.8,.38,.92,.28],[.2,.62,.08,.72],[.8,.62,.92,.72],[.22,.06,.1,0],[.78,.06,.9,0],[.22,.94,.1,1],[.78,.94,.9,1],[.35,.25,.25,.12],[.65,.25,.75,.12],[.35,.75,.25,.88],[.65,.75,.75,.88]],
];
let cStage=0, cLines=[], cProg=[], cTimer=0;
function cAddStage(s){ if(s>=crackStages.length)return; crackStages[s].forEach(l=>{cLines.push(l);cProg.push(0);}); }
function cStageOf(i){ let c=0; for(let s=0;s<crackStages.length;s++){c+=crackStages[s].length;if(i<c)return s;} return crackStages.length-1; }
function drawCracks(){
  const w=crackCanvas.width,h=crackCanvas.height;
  crackCtx.clearRect(0,0,w,h);
  for(let i=0;i<cLines.length;i++){
    const[x1p,y1p,x2p,y2p]=cLines[i],p=Math.min(cProg[i],1);
    crackCtx.beginPath();
    crackCtx.moveTo(x1p*w,y1p*h);
    crackCtx.lineTo((x1p+(x2p-x1p)*p)*w,(y1p+(y2p-y1p)*p)*h);
    crackCtx.lineWidth=Math.max(1,3.5-cStageOf(i)*.45);
    crackCtx.strokeStyle='#000'; crackCtx.lineCap='round'; crackCtx.stroke();
  }
}
cAddStage(0);
function crackLoop(){
  cTimer++;
  cProg=cProg.map(p=>p+.12+Math.random()*.06);
  if(cTimer>=14){cTimer=0;cStage++;cAddStage(cStage);}
  drawCracks();
  if(cStage<crackStages.length-1||cProg.some(p=>p<1)) requestAnimationFrame(crackLoop);
  else setTimeout(finishLoad,500);
}
crackLoop();
function finishLoad(){
  crackDone = true;
  const loader=document.getElementById('loader');
  crackCanvas.style.transition=`opacity ${TIMING.loaderFadeOut}ms`; crackCanvas.style.opacity='0';
  loader.style.transition=`opacity ${TIMING.loaderFadeOut}ms`; loader.style.opacity='0';
  setTimeout(()=>{crackCanvas.style.display='none';loader.style.display='none';showModeSelector();}, TIMING.loaderHideDelay);
}

// ── KEYBOARD ──
function playStartupChime() {
  try {
    const ac = getAudioCtx();
    const t = ac.currentTime;

    // A warm Windows/Mac-esque startup chord: C maj9 arpeggio
    // Notes: C4, E4, G4, B4, D5 — played with soft sine+triangle blend
    const notes = [261.63, 329.63, 392.00, 493.88, 587.33];
    const delays = [0, 0.07, 0.14, 0.22, 0.32];
    const durations = [1.6, 1.5, 1.4, 1.3, 1.8];

    // Reverb via convolver (simple impulse)
    const convLen = ac.sampleRate * 1.2;
    const convBuf = ac.createBuffer(2, convLen, ac.sampleRate);
    for(let ch=0;ch<2;ch++){
      const d=convBuf.getChannelData(ch);
      for(let i=0;i<convLen;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/convLen,2.5);
    }
    const conv = ac.createConvolver();
    conv.buffer = convBuf;
    const convGain = ac.createGain();
    convGain.gain.value = 0.28;
    conv.connect(convGain); convGain.connect(ac.destination);

    // Master
    const master = ac.createGain();
    master.gain.value = 0.38;
    master.connect(ac.destination);
    master.connect(conv);

    notes.forEach((freq, idx) => {
      const nt = t + delays[idx];
      const dur = durations[idx];

      // Sine layer — warm fundamental
      const osc1 = ac.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = freq;

      // Triangle layer — adds body
      const osc2 = ac.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.value = freq;
      osc2.detune.value = 4; // slight chorus

      const g1 = ac.createGain();
      g1.gain.setValueAtTime(0, nt);
      g1.gain.linearRampToValueAtTime(0.22, nt + 0.015);  // fast attack
      g1.gain.setValueAtTime(0.22, nt + 0.06);
      g1.gain.exponentialRampToValueAtTime(0.001, nt + dur);

      const g2 = ac.createGain();
      g2.gain.setValueAtTime(0, nt);
      g2.gain.linearRampToValueAtTime(0.10, nt + 0.02);
      g2.gain.exponentialRampToValueAtTime(0.001, nt + dur * 0.9);

      osc1.connect(g1); g1.connect(master);
      osc2.connect(g2); g2.connect(master);
      osc1.start(nt); osc1.stop(nt + dur + 0.05);
      osc2.start(nt); osc2.stop(nt + dur + 0.05);
    });

    // Subtle low hum to ground it (C2)
    const hum = ac.createOscillator();
    hum.type = 'sine';
    hum.frequency.value = 65.41;
    const humGain = ac.createGain();
    humGain.gain.setValueAtTime(0, t);
    humGain.gain.linearRampToValueAtTime(0.12, t + 0.08);
    humGain.gain.exponentialRampToValueAtTime(0.001, t + 1.1);
    hum.connect(humGain); humGain.connect(master);
    hum.start(t); hum.stop(t + 1.2);

  } catch(e) {}
}

// Subtle whoosh sound effect for truck movement
function playWhoosh(duration = 0.4, startFreq = 800, endFreq = 200) {
  try {
    const ac = getAudioCtx();
    const t = ac.currentTime;
    
    // Create a high-pass filtered noise burst for whoosh
    const noiseBuffer = ac.createBuffer(1, ac.sampleRate * duration, ac.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for(let i = 0; i < noiseBuffer.length; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = ac.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    
    // High-pass filter for crisp whoosh
    const filter = ac.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(startFreq, t);
    filter.frequency.exponentialRampToValueAtTime(endFreq, t + duration);
    filter.Q.value = 2;
    
    // Gain envelope: quick attack, smooth decay
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.05);  // quick attack
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    
    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);
    
    noiseSource.start(t);
    noiseSource.stop(t + duration);
  } catch(e) {}
}

function scaleKeyboard() {
  const kb = document.getElementById('keyboard-wrap');
  if(!kb) return;
  // Keyboard natural width ~455px (widest row), natural height ~240px
  const naturalW = 460;
  const naturalH = 260;
  const targetW = window.innerWidth * 0.75;
  const targetH = window.innerHeight * 0.55;
  const scale = Math.min(targetW / naturalW, targetH / naturalH, 1);
  kb.style.transform = 'scale(' + scale + ')';
}

// ── MODE SELECTOR ──
function bindCreativeButton() {
  const btn = document.getElementById('mode-creative');
  // Clone-replace to wipe any previously stacked listeners
  const fresh = btn.cloneNode(true);
  btn.parentNode.replaceChild(fresh, btn);
  fresh.addEventListener('click', () => selectCreativeMode());
}

// ── BUTTON NUDGE SCHEDULER ──
let _nudgeTimer = null;

function _nudgeWrap(wrap, holdMs = 1400) {
  // Don't nudge if user is hovering (desktop) — would fight the CSS hover state
  if(wrap.matches(':hover')) return;

  // Show tooltip via class
  wrap.classList.add('nudging');
  setTimeout(() => wrap.classList.remove('nudging'), holdMs);

  // Animate the button with Web Animations API so the CSS `animation` property
  // (fadeInUp) is never touched and can't restart when we clean up.
  const btn = wrap.querySelector('.mode-btn');
  if(!btn) return;
  btn.animate(
    [
      { transform: 'translateY(0)    rotate(0deg)' },
      { transform: 'translateY(-7px) rotate(-2deg)' },
      { transform: 'translateY(-3px) rotate(1.5deg)' },
      { transform: 'translateY(-6px) rotate(-1deg)' },
      { transform: 'translateY(-2px) rotate(0.5deg)' },
      { transform: 'translateY(-4px) rotate(0deg)' },
      { transform: 'translateY(0)    rotate(0deg)' },
    ],
    { duration: 700, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'none' }
  );
}

function _scheduleNudges(wraps) {
  if(_nudgeTimer) clearTimeout(_nudgeTimer);
  if(!wraps || !wraps.length) return;

  function runBurst() {
    wraps.forEach((w, i) => {
      setTimeout(() => _nudgeWrap(w), i * 420);
    });
  }

  // First burst fires 3.5 seconds after the selector appears
  const firstDelay = 3500;
  _nudgeTimer = setTimeout(() => {
    runBurst();
    function scheduleNext() {
      const interval = 7000 + Math.random() * 5000; // 7–12 s
      _nudgeTimer = setTimeout(() => {
        runBurst();
        scheduleNext();
      }, interval);
    }
    scheduleNext();
  }, firstDelay);
}

function _cancelNudges() {
  if(_nudgeTimer) { clearTimeout(_nudgeTimer); _nudgeTimer = null; }
  document.querySelectorAll('.mode-btn-wrap').forEach(w => w.classList.remove('nudging'));
}

function showModeSelector() {
  const selector = document.getElementById('mode-selector');
  selector.classList.add('visible');
  bindCreativeButton();

  const wraps = Array.from(document.querySelectorAll('.mode-btn-wrap'));

  // Touch devices: tap wrapper to flash tooltip
  wraps.forEach(wrap => {
    wrap.addEventListener('touchstart', () => {
      wraps.forEach(w => w.classList.remove('tooltip-visible'));
      wrap.classList.add('tooltip-visible');
      setTimeout(() => wrap.classList.remove('tooltip-visible'), 1800);
    }, { passive: true });
  });

  // Cancel nudges the moment the user hovers or clicks — they've seen them
  wraps.forEach(wrap => {
    wrap.addEventListener('mouseenter', _cancelNudges);
    wrap.addEventListener('click', _cancelNudges);
    wrap.addEventListener('touchstart', _cancelNudges, { passive: true });
  });

  _scheduleNudges(wraps);
}

function selectCreativeMode() {
  _cancelNudges();
  const selector = document.getElementById('mode-selector');
  selector.style.transition = 'opacity 0.4s ease';
  selector.style.opacity = '0';
  
  setTimeout(() => {
    selector.style.display = 'none';
    
    // Reset scene and related elements
    const scene = document.getElementById('scene');
    const trainSwitch = document.getElementById('train-switch-wrap');
    const footer = document.getElementById('foot-footer');
    
    // Reset scene — wipe ALL inline styles (clears poof transform/opacity/transition)
    scene.style.cssText = '';
    scene.classList.remove('visible');
    
    // Reset switch (clear poof animation transform/transition)
    if(trainSwitch) {
      trainSwitch.style.cssText = '';
      trainSwitch.classList.remove('visible');
    }
    
    // Reset footer (clear poof animation transform/transition)
    if(footer) {
      footer.style.cssText = '';
      footer.classList.remove('toes-only', 'peeked');
    }
    
    // Reset keyboard wrap (morphToNav hides these with inline display:none)
    const kb = document.getElementById('keyboard-wrap');
    if(kb) {
      kb.style.removeProperty('display');
      kb.classList.remove('hiding');
    }
    const disp = document.getElementById('typed-display');
    if(disp) disp.style.removeProperty('display');
    const cursor = document.getElementById('cursor');
    if(cursor) cursor.style.removeProperty('display');

    // Reset all keyboard keys
    document.querySelectorAll('#keyboard-wrap .key').forEach(key => {
      key.classList.remove('appeared', 'pressed', 'start-glow');
      key.style.removeProperty('--r');
    });
    
    // Reset nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('appeared', 'fade-out');
      btn.style.removeProperty('transform');
      btn.style.removeProperty('opacity');
      btn.style.removeProperty('display');
      btn.style.removeProperty('--r');
    });
    
    // Reset typed display
    const typedDisplay = document.getElementById('typed-display');
    if(typedDisplay) {
      typedDisplay.classList.remove('hiding');
      typedDisplay.style.removeProperty('opacity');
    }
    
    const typedText = document.getElementById('typed-text');
    if(typedText) typedText.textContent = '';
    
    // Reset nav wrap
    const navWrap = document.getElementById('nav-wrap');
    if(navWrap) {
      navWrap.classList.remove('visible');
      navWrap.style.removeProperty('opacity');
      navWrap.style.removeProperty('pointer-events');
    }
    
    // Reset global states
    backNavActive = false;
    trainSwitchInited = false; // allow dark-mode switch to re-init
    scrollDetectionActive = false;
    lastScrollTime = 0;
    if(scrollDetectionTimeout) clearTimeout(scrollDetectionTimeout);
    scrollDetectionTimeout = null;
    scrollCount = 0;
    if(scrollTooltip) { scrollTooltip.remove(); scrollTooltip = null; }
    _bhDestroy();
    _destroyScrollNudge();
    
    // Remove any existing scroll listeners (wheel + touch)
    _cleanupScrollListeners();
    
    showScene();
  }, 400);
}

function showScene(){
  const scene=document.getElementById('scene');
  scene.classList.add('visible');
  scaleKeyboard();
  window.addEventListener('resize', debounce(scaleKeyboard, 120));
  initFoot();
  // Footer hidden until nav is ready
  const _ffi = document.getElementById('foot-footer');
  if(_ffi) _ffi.style.display = 'none';
  // Wire email copy button once
  const emailLink = document.getElementById('email-link');
  if(emailLink) {
    emailLink.style.cursor = 'pointer';
    emailLink.addEventListener('click', () => {
      const EMAIL = OWNER_EMAIL;
      const orig = emailLink.textContent;
      const showCopied = () => {
        emailLink.textContent = '✓ Copied!';
        emailLink.style.background = '#000'; emailLink.style.color = '#fff';
        setTimeout(() => { emailLink.textContent = orig; emailLink.style.background=''; emailLink.style.color=''; }, TIMING.copiedResetDelay);
      };
      navigator.clipboard.writeText(EMAIL).then(showCopied).catch(() => {
        // Clipboard API unavailable (e.g. non-https) surface the address instead
        emailLink.textContent = EMAIL;
        setTimeout(() => { emailLink.textContent = orig; }, TIMING.copiedAddressDelay);
      });
    });
  }

  const keys=[];
  document.querySelectorAll('#keyboard-wrap .key').forEach((key,ki)=>{
    key.style.setProperty('--r',((Math.random()-.5)*40)+'deg');
    keys.push({el:key, delay: Math.round((ki/TIMING.keyTotalKeys)*TIMING.keySpreadTotal + Math.random()*TIMING.keySpreadJitter)});
  });
  keys.sort((a,b)=>a.delay-b.delay);
  keys.forEach(k=>setTimeout(()=>k.el.classList.add('appeared'),k.delay));
  setTimeout(showPressToStart, TIMING.showPressToStartDelay);
}

function showPressToStart() {
  const spaceKey = document.querySelector('#keyboard-wrap .key.space-key');
  const enterKey = document.getElementById('enter-key');
  if(!spaceKey) { startTyping(); return; }
  spaceKey.textContent = 'PRESS TO START';
  spaceKey.classList.add('start-glow');
  playKeyClick(true);

  function doStart() {
    spaceKey.classList.remove('start-glow');
    spaceKey.textContent = 'SPACE';
    spaceKey.classList.add('pressed');
    playKeyClick(true);
    setTimeout(()=>spaceKey.classList.remove('pressed'), TIMING.keyPressedDuration);
    spaceKey.removeEventListener('click', doStart);
    document.removeEventListener('keydown', onKey);
    if(enterKey) enterKey.removeEventListener('click', doSkip);
    startTyping();
  }
  function doSkip() {
    spaceKey.classList.remove('start-glow');
    spaceKey.textContent = 'SPACE';
    spaceKey.removeEventListener('click', doStart);
    document.removeEventListener('keydown', onKey);
    if(enterKey) enterKey.removeEventListener('click', doSkip);
    enterKey.classList.add('pressed');
    playKeyClick(false, true);
    setTimeout(()=>enterKey.classList.remove('pressed'), TIMING.keyPressedDuration);
    // startTyping hasn't run yet — go straight to nav
    morphToNav();
  }
  function onKey(e) {
    if(e.code === 'Space') { e.preventDefault(); doStart(); }
  }
  spaceKey.addEventListener('click', doStart);
  document.addEventListener('keydown', onKey);
  if(enterKey) enterKey.addEventListener('click', doSkip);
}

// ── KEY SOUND ──
let audioCtx = null;
function getAudioCtx() {
  if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  return audioCtx;
}
// Unlock AudioContext on first interaction — browsers suspend it until then
(function unlockAudio() {
  const unlock = () => {
    const ac = getAudioCtx();
    if(ac.state === 'suspended') ac.resume();
    document.removeEventListener('click', unlock);
    document.removeEventListener('keydown', unlock);
    document.removeEventListener('touchstart', unlock);
  };
  document.addEventListener('click', unlock);
  document.addEventListener('keydown', unlock);
  document.addEventListener('touchstart', unlock);
})();
function playKeyClick(isSpace=false, isEnter=false) {
  try {
    const ac = getAudioCtx();
    const t = ac.currentTime;

    // Noise burst (the "thock" body)
    const bufLen = ac.sampleRate * 0.04;
    const buf = ac.createBuffer(1, bufLen, ac.sampleRate);
    const data = buf.getChannelData(0);
    for(let i=0;i<bufLen;i++) data[i]=(Math.random()*2-1);
    const noise = ac.createBufferSource();
    noise.buffer = buf;

    // Bandpass — lower for space/enter, higher for regular keys
    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = isEnter ? 280 : isSpace ? 320 : 900 + Math.random()*300;
    bp.Q.value = isEnter ? 0.6 : isSpace ? 0.7 : 1.2;

    // Click transient — short sine blip at the start
    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isEnter ? 180 : isSpace ? 220 : 600+Math.random()*200, t);
    osc.frequency.exponentialRampToValueAtTime(80, t+0.025);

    // Envelope for noise
    const noiseGain = ac.createGain();
    noiseGain.gain.setValueAtTime(isEnter ? 0.55 : isSpace ? 0.45 : 0.35, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + (isEnter ? 0.12 : isSpace ? 0.1 : 0.06));

    // Envelope for transient
    const oscGain = ac.createGain();
    oscGain.gain.setValueAtTime(isEnter ? 0.5 : isSpace ? 0.4 : 0.3, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

    // Master gain
    const master = ac.createGain();
    master.gain.value = 0.55;

    noise.connect(bp); bp.connect(noiseGain); noiseGain.connect(master);
    osc.connect(oscGain); oscGain.connect(master);
    master.connect(ac.destination);

    noise.start(t); noise.stop(t+0.15);
    osc.start(t); osc.stop(t+0.04);
  } catch(e) {}
}


// ── NOSTALGIC NAV SOUND ──
function playNavClick() {
  try {
    const ac = getAudioCtx();
    const t = ac.currentTime;

    // Windows 95-esque: short chord blip — major triad C5/E5/G5 + click
    const notes = [523.25, 659.25, 783.99];
    const master = ac.createGain();
    master.gain.value = 0.4;
    master.connect(ac.destination);

    // Crisp noise click upfront
    const bufLen = Math.floor(ac.sampleRate * 0.025);
    const buf = ac.createBuffer(1, bufLen, ac.sampleRate);
    const d = buf.getChannelData(0);
    for(let i=0;i<bufLen;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/bufLen,3);
    const noise = ac.createBufferSource(); noise.buffer=buf;
    const nbp = ac.createBiquadFilter(); nbp.type='bandpass'; nbp.frequency.value=1200; nbp.Q.value=0.8;
    const ng = ac.createGain(); ng.gain.setValueAtTime(0.5,t); ng.gain.exponentialRampToValueAtTime(0.001,t+0.04);
    noise.connect(nbp); nbp.connect(ng); ng.connect(master);
    noise.start(t); noise.stop(t+0.04);

    notes.forEach((freq, i) => {
      const nt = t + i*0.025;
      const o1 = ac.createOscillator(); o1.type='sine'; o1.frequency.value=freq;
      const o2 = ac.createOscillator(); o2.type='triangle'; o2.frequency.value=freq; o2.detune.value=6;
      const g = ac.createGain();
      g.gain.setValueAtTime(0,nt);
      g.gain.linearRampToValueAtTime(0.18,nt+0.012);
      g.gain.exponentialRampToValueAtTime(0.001,nt+0.28);
      o1.connect(g); o2.connect(g); g.connect(master);
      o1.start(nt); o1.stop(nt+0.32);
      o2.start(nt); o2.stop(nt+0.32);
    });

    // Low thud
    const thud = ac.createOscillator(); thud.type='sine'; thud.frequency.setValueAtTime(180,t); thud.frequency.exponentialRampToValueAtTime(60,t+0.06);
    const tg = ac.createGain(); tg.gain.setValueAtTime(0.35,t); tg.gain.exponentialRampToValueAtTime(0.001,t+0.1);
    thud.connect(tg); tg.connect(master); thud.start(t); thud.stop(t+0.12);

  } catch(e) {}
}
// ── TYPING ──
const TARGET="https://LosDenso.xyz";
function flashKey(ch, isSpace=false, isEnter=false){
  const k=document.querySelector(`#keyboard-wrap .key[data-char="${ch.toLowerCase()}"]`)
         ||document.querySelector('#keyboard-wrap .key[data-char=" "]');
  if(!k)return;
  k.classList.add('pressed');
  setTimeout(()=>k.classList.remove('pressed'),TIMING.keyPressedDuration);
  playKeyClick(isSpace, isEnter);
}
function startTyping(){
  const span=document.getElementById('typed-text'); let i=0;
  let skipTyping = false; // scoped here — avoids stale state if startTyping is ever called again
  const enterKey=document.getElementById('enter-key');
  // Re-bind enter to skip mid-typing (doSkip in showPressToStart handles pre-start)
  if(enterKey) enterKey.addEventListener('click',()=>{
    skipTyping=true;
    enterKey.classList.add('pressed');
    setTimeout(()=>enterKey.classList.remove('pressed'),TIMING.keyPressedDuration);
    playKeyClick(false, true);
  });
  function next(){
    if(skipTyping){ span.textContent=TARGET; setTimeout(morphToNav,TIMING.typingSkipDelay); return; }
    if(i>=TARGET.length){setTimeout(morphToNav,TIMING.typingDoneDelay);return;}
    const ch=TARGET[i];
    span.textContent+=ch;
    flashKey(ch, ch===' ');
    i++;
    setTimeout(next,TIMING.typingBaseDelay+Math.random()*TIMING.typingJitter);
  }
  next();
}

// ── NAV MORPH ──
function morphToNav(){
  const kb=document.getElementById('keyboard-wrap');
  const nav=document.getElementById('nav-wrap');
  const disp=document.getElementById('typed-display');
  document.getElementById('cursor').style.display='none';
  disp.classList.add('hiding');
  setTimeout(()=>kb.classList.add('hiding'), TIMING.morphHideDisplayDelay);
  setTimeout(()=>{
    kb.style.display='none'; disp.style.display='none';
    nav.classList.add('visible');
    document.querySelectorAll('.nav-btn').forEach((btn,i)=>{
      btn.style.setProperty('--r',((Math.random()-.5)*30)+'deg');
      // Keyboard accessibility
      btn.setAttribute('role', 'button');
      btn.setAttribute('tabindex', '0');
      btn.addEventListener('keydown', e => {
        if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
      });
      setTimeout(()=>btn.classList.add('appeared'), i*TIMING.navBtnStagger + TIMING.navBtnStaggerOffset);
    });
    setTimeout(playStartupChime, TIMING.chimeDelay);
    setTimeout(bindNav, TIMING.bindNavDelay);
    // Show train switch
    setTimeout(()=>initTrainSwitch(), TIMING.bindNavDelay);
    // Show footer now that nav is visible
    const ff = document.getElementById('foot-footer');
    if(ff) { ff.style.removeProperty('display'); ff.style.opacity='0'; setTimeout(()=>{ ff.style.transition=`opacity ${TIMING.footerFadeInDuration}ms ease`; ff.style.opacity='1'; }, TIMING.footerFadeInDelay); }
  }, TIMING.morphShowNavDelay);
}
function _navHandler(page){ return function(){ playNavClick(); zoomPage(page); }; }
// _navHandlers stores the bound function reference for each button so we can
// cleanly removeEventListener before re-binding (prevents duplicate firings
// when the user navigates back and bindNav is called again).
let _navHandlers = {};
function bindNav(){
  ['about','projects','contact'].forEach(page=>{
    const id = 'btn-'+page;
    const el = document.getElementById(id);
    if(!el) return;
    // Remove any previous handler for this button
    if(_navHandlers[id]) el.removeEventListener('click', _navHandlers[id]);
    _navHandlers[id] = _navHandler(page);
    el.addEventListener('click', _navHandlers[id]);
  });
  
  // Initialize scroll detection for returning to mode selector
  initScrollToModeSelector();

  // Nudge hint — appears after the user idles on the nav page for a while
  initScrollNudgeHint();
}

let scrollDetectionActive = false;
let scrollTooltip = null;
let lastScrollTime = 0;
let scrollDetectionTimeout = null;
let scrollCount = 0;
const SCROLL_THRESHOLD = 5;

// ── BLACK HOLE + WARP EFFECT ──
let _bhRaf = null;
let _bhProgress = 0;      // 0..1, current animated value
let _bhTarget   = 0;      // 0..1, target driven by scrollCount
let _bhAnimating = false;

function getPoofEls() {
  return [
    document.getElementById('scene'),
    document.getElementById('foot-footer'),
    document.getElementById('train-switch-wrap'),
  ].filter(Boolean);
}

function _bhEase(t) { return t < 0.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2; }

// ── Update SVG warp filter at given progress ──
let _warpTime = 0;
function _updateWarp(progress) {
  const turb = document.getElementById('warp-turbulence');
  const disp = document.getElementById('warp-displace');
  if(!turb || !disp) return;

  // Slower time evolution — waves move lazily
  _warpTime += 0.004;
  // Lower base frequency = bigger, broader waves; gentle rise with progress
  const freq = 0.0018 + progress * 0.008;
  turb.setAttribute('baseFrequency', `${freq.toFixed(5)} ${(freq * 0.6).toFixed(5)}`);
  // Shift seed slowly so the distortion drifts rather than churning
  turb.setAttribute('seed', Math.floor(_warpTime * 3) % 99);

  // Softer max displacement — feels like space bending, not a blender
  const dispScale = progress * 90;
  disp.setAttribute('scale', dispScale.toFixed(1));

  getPoofEls().forEach(el => {
    el.style.filter = progress > 0.02 ? 'url(#blackhole-warp)' : '';
  });
}

// ── Spinning accretion disk angle ──
let _diskAngle = 0;

// ── Draw black hole canvas at given progress (0=gone, 1=fully open) ──
// (Override the earlier definition to add disk spin)
function _drawBlackHole(progress) {
  const cv = document.getElementById('blackhole-canvas');
  if(!cv) return;
  cv.width  = window.innerWidth;
  cv.height = window.innerHeight;
  const cx = cv.getContext('2d');
  const cx0 = window.innerWidth  / 2;
  const cy0 = window.innerHeight / 2;
  const maxR = Math.min(window.innerWidth, window.innerHeight) * 0.32 * progress;

  cx.clearRect(0, 0, cv.width, cv.height);
  if(progress <= 0.01) return;

  // Vignette — darkens the whole screen as the black hole grows
  const vigR = Math.max(cv.width, cv.height) * 0.85;
  const vig = cx.createRadialGradient(cx0, cy0, vigR * 0.05, cx0, cy0, vigR);
  const vigAlpha = Math.pow(progress, 0.55) * 0.97;
  vig.addColorStop(0,   `rgba(0,0,0,0)`);
  vig.addColorStop(0.35, `rgba(0,0,0,${vigAlpha * 0.55})`);
  vig.addColorStop(1,   `rgba(0,0,0,${vigAlpha})`);
  cx.fillStyle = vig;
  cx.fillRect(0, 0, cv.width, cv.height);

  // Event horizon — pure black circle
  cx.fillStyle = '#000';
  cx.beginPath();
  cx.arc(cx0, cy0, maxR * 0.68, 0, Math.PI * 2);
  cx.fill();

  // Photon ring — bright thin rim with rotating shimmer + bloom glow
  const shimmer = 0.75 + 0.25 * Math.sin(_diskAngle * 2.1);
  cx.save();
  cx.shadowColor = `rgba(255,240,180,0.9)`;
  cx.shadowBlur  = 14 * progress;
  const photon = cx.createRadialGradient(cx0, cy0, maxR * 0.64, cx0, cy0, maxR * 0.75);
  photon.addColorStop(0,   'rgba(0,0,0,0)');
  photon.addColorStop(0.5, `rgba(255,240,180,${0.9 * progress * shimmer})`);
  photon.addColorStop(1,   'rgba(0,0,0,0)');
  cx.fillStyle = photon;
  cx.beginPath();
  cx.arc(cx0, cy0, maxR * 0.75, 0, Math.PI * 2);
  cx.fill();
  cx.restore();

  // Inner black disk (on top of photon ring)
  cx.fillStyle = '#000';
  cx.beginPath();
  cx.arc(cx0, cy0, maxR * 0.62, 0, Math.PI * 2);
  cx.fill();
}

// ── Animate black hole toward target progress ──
function _bhLoop() {
  const diff = _bhTarget - _bhProgress;
  if(Math.abs(diff) < 0.005) {
    _bhProgress = _bhTarget;
  } else {
    // Slow drift toward target (0.05 forward, 0.03 back — very languid)
    const speed = _bhTarget > _bhProgress ? 0.05 : 0.03;
    _bhProgress += diff * speed;
  }

  // Advance disk spin — slows when progress is low
  _diskAngle += 0.012 * (0.3 + _bhProgress * 0.7);

  _drawBlackHole(_bhProgress);
  _updateWarp(_bhProgress);

  if(Math.abs(_bhTarget - _bhProgress) > 0.005 || _bhProgress > 0.005) {
    _bhRaf = requestAnimationFrame(_bhLoop);
  } else {
    // Fully settled at 0 — hide canvas and remove filter
    _bhProgress = 0;
    _drawBlackHole(0);
    _updateWarp(0);
    getPoofEls().forEach(el => { el.style.filter = ''; });
    const cv = document.getElementById('blackhole-canvas');
    if(cv) cv.style.display = 'none';
    _bhAnimating = false;
    _bhRaf = null;
  }
}

function _bhSetTarget(t) {
  _bhTarget = Math.max(0, Math.min(1, t));
  const cv = document.getElementById('blackhole-canvas');
  if(cv && _bhTarget > 0) cv.style.display = 'block';
  if(!_bhAnimating || !_bhRaf) {
    _bhAnimating = true;
    _bhRaf = requestAnimationFrame(_bhLoop);
  }
}

function _bhReset() {
  _bhTarget = 0;
  if(!_bhRaf) {
    _bhAnimating = true;
    _bhRaf = requestAnimationFrame(_bhLoop);
  }
}

function _bhDestroy() {
  _bhTarget = 0;
  _bhProgress = 0;
  _warpTime = 0;
  if(_bhRaf) { cancelAnimationFrame(_bhRaf); _bhRaf = null; }
  _bhAnimating = false;
  getPoofEls().forEach(el => { el.style.filter = ''; });
  const cv = document.getElementById('blackhole-canvas');
  if(cv) { cv.style.display = 'none'; const cx = cv.getContext('2d'); cx.clearRect(0,0,cv.width,cv.height); }
  const disp = document.getElementById('warp-displace');
  if(disp) disp.setAttribute('scale', '0');
}

// Apply one poof frame: progress 0 = normal, 1 = fully poofed
function applyPoofFrame(progress) {
  const scale   = 1 - progress * 0.3;
  const opacity = 1 - progress;
  const rot     = progress * 10;
  getPoofEls().forEach(el => {
    el.style.transition = 'none';
    el.style.transform  = `scale(${scale}) rotateZ(${rot}deg)`;
    el.style.opacity    = opacity;
  });
  _bhSetTarget(progress);
}

// Snap everything back to normal with a springy transition
function resetPoofState() {
  getPoofEls().forEach(el => {
    el.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease';
    el.style.transform  = 'scale(1) rotateZ(0deg)';
    el.style.opacity    = '1';
  });
  _bhReset();
}

function onScroll(e) {
    if(!scrollDetectionActive) return;

    const now = Date.now();
    const timeSinceLastScroll = now - lastScrollTime;

    // Reset counter if user paused more than 2 seconds
    if(timeSinceLastScroll > 2000) {
      scrollCount = 0;
      resetPoofState();
    }

    scrollCount++;
    lastScrollTime = now;

    // Drive poof animation frame-by-frame (don't apply on final step — returnToModeSelector handles that)
    if(scrollCount < SCROLL_THRESHOLD) {
      applyPoofFrame(scrollCount / SCROLL_THRESHOLD);
    }

    // Show/update progress tooltip
    if(!scrollTooltip) {
      scrollTooltip = document.createElement('div');
      scrollTooltip.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 999;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        font-weight: bold;
        letter-spacing: 1px;
        text-transform: uppercase;
        background: var(--fg);
        color: var(--bg);
        padding: 8px 14px;
        border-radius: 4px;
        white-space: nowrap;
        opacity: 0;
        transform: translate(-50%, 0);
        transition: opacity 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        bottom: 120px;
        left: 50%;
        top: auto;
      `;
      document.body.appendChild(scrollTooltip);
    }

    const remaining = SCROLL_THRESHOLD - scrollCount;
    const isTouchUX = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if(remaining > 0) {
      scrollTooltip.textContent = isTouchUX
        ? `Swipe up ${remaining} more time${remaining === 1 ? '' : 's'} to enter the black hole`
        : `Scroll ${remaining} more time${remaining === 1 ? '' : 's'} to enter the black hole`;
    }
    scrollTooltip.style.opacity = '1';

    if(scrollDetectionTimeout) clearTimeout(scrollDetectionTimeout);
    scrollDetectionTimeout = setTimeout(() => {
      scrollTooltip.style.opacity = '0';
      scrollCount = 0;
      resetPoofState();
    }, 2000);

    // Trigger once threshold is reached
    if(scrollCount >= SCROLL_THRESHOLD) {
      scrollCount = 0;
      returnToModeSelector();
      return;
    }

}

// ── TOUCH SWIPE-UP for black hole (mirrors wheel behaviour) ──
let _touchStartY = null;
let _touchStartX = null;
const SWIPE_THRESHOLD_PX = 40; // min vertical movement per swipe gesture

function onTouchStart(e) {
  if(!scrollDetectionActive) return;
  if(e.touches.length !== 1) return;
  _touchStartY = e.touches[0].clientY;
  _touchStartX = e.touches[0].clientX;
}

function onTouchEnd(e) {
  if(!scrollDetectionActive) return;
  if(_touchStartY === null) return;
  if(e.changedTouches.length !== 1) { _touchStartY = null; return; }

  const dy = _touchStartY - e.changedTouches[0].clientY; // positive = swiped up
  const dx = Math.abs(e.changedTouches[0].clientX - _touchStartX);
  _touchStartY = null;
  _touchStartX = null;

  // Only count predominantly-vertical upward swipes
  if(dy < SWIPE_THRESHOLD_PX || dx > dy * 0.8) return;

  // Reuse the same onScroll logic via a synthetic-like call
  onScroll({ _touch: true });
}

function initScrollToModeSelector() {
  scrollDetectionActive = true;
  lastScrollTime = 0;
  scrollCount = 0;
  window.addEventListener('wheel', onScroll, { passive: true });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
}

// Also clean up touch listeners wherever wheel is removed
const _origRemoveScroll = window.removeEventListener.bind(window);
function _cleanupScrollListeners() {
  window.removeEventListener('wheel', onScroll);
  window.removeEventListener('touchstart', onTouchStart);
  window.removeEventListener('touchend', onTouchEnd);
}

// ── SCROLL NUDGE HINT ──
// Shown in the nav page after the user idles for a while,
// prompting them to scroll/swipe up to go back to the mode selector.
let _scrollNudgeEl = null;
let _scrollNudgeIdleTimer = null;
let _scrollNudgeRepeatTimer = null;

function _destroyScrollNudge() {
  if(_scrollNudgeIdleTimer)  { clearTimeout(_scrollNudgeIdleTimer);  _scrollNudgeIdleTimer  = null; }
  if(_scrollNudgeRepeatTimer){ clearTimeout(_scrollNudgeRepeatTimer); _scrollNudgeRepeatTimer = null; }
  if(_scrollNudgeEl) {
    _scrollNudgeEl.classList.remove('visible');
    // Remove from DOM after fade-out transition
    setTimeout(() => { if(_scrollNudgeEl) { _scrollNudgeEl.remove(); _scrollNudgeEl = null; } }, 700);
  }
}

function _showScrollNudge() {
  if(!_scrollNudgeEl) return;
  _scrollNudgeEl.classList.add('visible');
  // Auto-hide after 4 seconds, then re-show periodically
  _scrollNudgeRepeatTimer = setTimeout(() => {
    if(!_scrollNudgeEl) return;
    _scrollNudgeEl.classList.remove('visible');
    // Schedule next appearance
    _scrollNudgeRepeatTimer = setTimeout(() => _showScrollNudge(), 5000 + Math.random() * 3000);
  }, 4000);
}

function initScrollNudgeHint() {
  _destroyScrollNudge(); // clean up any previous instance

  const isTouchUX = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const label = isTouchUX ? 'Swipe up to go back' : 'Scroll up to go back';

  const el = document.createElement('div');
  el.id = 'scroll-nudge';
  el.innerHTML = `
    <div id="scroll-nudge-arrow2"></div>
    <div id="scroll-nudge-arrow"></div>
    <div id="scroll-nudge-text">${label}</div>
  `;
  document.body.appendChild(el);
  _scrollNudgeEl = el;

  // Show after 8 s of the user sitting idle on the nav page
  _scrollNudgeIdleTimer = setTimeout(_showScrollNudge, 8000);

  // Dismiss immediately if the user starts interacting with the scroll gesture
  const dismiss = () => _destroyScrollNudge();
  window.addEventListener('wheel',      dismiss, { once: true, passive: true });
  window.addEventListener('touchstart', dismiss, { once: true, passive: true });
  // Also dismiss if they click a nav button
  document.querySelectorAll('.nav-btn').forEach(b =>
    b.addEventListener('click', dismiss, { once: true })
  );
}

// ── WARP JUMP — black hole swallows screen, then flashing stars ──
function playWarpJump(onComplete) {
  // Cancel existing BH loop — we take over
  if(_bhRaf) { cancelAnimationFrame(_bhRaf); _bhRaf = null; }
  _bhAnimating = false;

  const cv = document.getElementById('blackhole-canvas');
  if(!cv) { onComplete(); return; }
  cv.style.display = 'block';
  cv.width  = window.innerWidth;
  cv.height = window.innerHeight;
  const cx  = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  const cx0 = W / 2, cy0 = H / 2;
  // Furthest corner distance — radius needed to cover the whole screen
  const fullR = Math.sqrt(cx0*cx0 + cy0*cy0) * 1.05;

  // Black hole starts at its current drawn size (progress=1 → maxR = min(W,H)*0.32)
  const startR = Math.min(W, H) * 0.32;

  const SWALLOW_MS = 600;  // time for BH to expand and fill screen
  const STAR_COUNT = 80;
  const FLASH_MS   = 60;   // star re-randomise interval
  const TOTAL_MS   = 1100; // star phase duration
  const FADE_MS    = 350;  // final fade-out

  // ── Phase 1: swallow ──
  let swallowStart = null;

  function swallowFrame(ts) {
    if(!swallowStart) swallowStart = ts;
    const t = Math.min((ts - swallowStart) / SWALLOW_MS, 1);
    // Accelerating ease — slow at first, slams shut at the end
    const ease = t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2;

    const r = startR + (fullR - startR) * ease;

    cx.clearRect(0, 0, W, H);

    // Vignette still present (full alpha since we're at progress=1)
    const vigR2 = Math.max(W, H) * 0.85;
    const vig = cx.createRadialGradient(cx0, cy0, vigR2 * 0.05, cx0, cy0, vigR2);
    vig.addColorStop(0,    'rgba(0,0,0,0)');
    vig.addColorStop(0.35, 'rgba(0,0,0,0.53)');
    vig.addColorStop(1,    'rgba(0,0,0,0.97)');
    cx.fillStyle = vig;
    cx.fillRect(0, 0, W, H);

    // Photon ring — shrinks to nothing as BH fills screen
    const ringAlpha = 1 - ease;
    if(ringAlpha > 0.01) {
      const shimmer = 0.75 + 0.25 * Math.sin(_diskAngle * 2.1);
      _diskAngle += 0.018; // spin faster as it grows
      cx.save();
      cx.shadowColor = `rgba(255,240,180,0.9)`;
      cx.shadowBlur  = 14;
      const photon = cx.createRadialGradient(cx0, cy0, r * 0.85, cx0, cy0, r);
      photon.addColorStop(0,   'rgba(0,0,0,0)');
      photon.addColorStop(0.5, `rgba(255,240,180,${0.9 * shimmer * ringAlpha})`);
      photon.addColorStop(1,   'rgba(0,0,0,0)');
      cx.fillStyle = photon;
      cx.beginPath();
      cx.arc(cx0, cy0, r, 0, Math.PI * 2);
      cx.fill();
      cx.restore();
    }

    // The growing black disk
    cx.fillStyle = '#000';
    cx.beginPath();
    cx.arc(cx0, cy0, r * 0.93, 0, Math.PI * 2);
    cx.fill();

    if(t < 1) {
      requestAnimationFrame(swallowFrame);
    } else {
      // Screen is fully black — start star phase
      cx.fillStyle = '#000';
      cx.fillRect(0, 0, W, H);
      startStarPhase();
    }
  }

  requestAnimationFrame(swallowFrame);

  // ── Phase 2: stars ──
  function startStarPhase() {
    // Draw black base on the canvas so it stays solid behind the star divs
    cx.fillStyle = '#000';
    cx.fillRect(0, 0, W, H);

    // Star overlay sitting on top of the (now black) BH canvas
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:96;pointer-events:none;
      opacity:1;transition:opacity ${FADE_MS}ms ease;
    `;
    document.body.appendChild(overlay);

    const stars = Array.from({ length: STAR_COUNT }, () => {
      const s = document.createElement('div');
      s.style.cssText = `position:absolute;border-radius:50%;background:#fff;pointer-events:none;`;
      overlay.appendChild(s);
      return s;
    });

    function randomiseStar(s) {
      const size = 1 + Math.random() * 3;
      s.style.width  = size + 'px';
      s.style.height = size + 'px';
      s.style.left   = (Math.random() * 100) + '%';
      s.style.top    = (Math.random() * 100) + '%';
      s.style.opacity = (0.4 + Math.random() * 0.6).toFixed(2);
      s.style.boxShadow = size > 2.5
        ? `0 0 ${Math.round(size * 2)}px rgba(255,255,255,0.8)`
        : 'none';
    }

    stars.forEach(randomiseStar);

    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += FLASH_MS;
      stars.forEach(s => { if(Math.random() < 0.4) randomiseStar(s); });
      if(elapsed >= TOTAL_MS) {
        clearInterval(interval);
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
          cv.style.display = 'none';
          cx.clearRect(0, 0, W, H);
          onComplete();
        }, FADE_MS);
      }
    }, FLASH_MS);
  }
}

function returnToModeSelector() {
  scrollDetectionActive = false;
  _cleanupScrollListeners();
  _destroyScrollNudge();
  
  const scene = document.getElementById('scene');
  const footer = document.getElementById('foot-footer');
  const switchWrap = document.getElementById('train-switch-wrap');
  
  if(scrollTooltip) {
    scrollTooltip.remove();
    scrollTooltip = null;
  }
  
  // Poof animation - everything disappears quickly before warp jump
  const duration = 0.35;
  const elements = [scene, footer, switchWrap].filter(el => el);
  
  elements.forEach((el) => {
    el.style.transition = `opacity ${duration}s ease, transform ${duration}s cubic-bezier(0.34,1.56,0.64,1)`;
    el.style.opacity = '0';
    el.style.transform = `scale(0.7) rotateZ(${Math.random() * 20 - 10}deg)`;
  });

  // After UI has poofed, run the warp-jump sequence, then show mode selector
  setTimeout(() => {
    playWarpJump(() => {
      _bhDestroy();
      // Hide nav scene and footer
      scene.classList.remove('visible');
      scene.style.display = 'none';
      if(footer) {
        footer.style.display = 'none';
        footer.classList.remove('toes-only', 'peeked');
      }
      if(switchWrap) {
        switchWrap.classList.remove('visible');
      }

      // Reset nav button styles
      document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('fade-out', 'appeared');
        btn.style.removeProperty('transform');
        btn.style.removeProperty('opacity');
        btn.style.removeProperty('display');
        btn.style.removeProperty('transition');
      });

      // Show mode selector with fade in
      const selector = document.getElementById('mode-selector');
      selector.style.display = '';
      selector.style.transition = '';
      selector.style.opacity = '0';
      selector.classList.add('visible');
      bindCreativeButton();
      // Re-attach touch listeners and restart nudge scheduler
      const _rWraps = Array.from(document.querySelectorAll('.mode-btn-wrap'));
      _rWraps.forEach(wrap => {
        wrap.addEventListener('mouseenter', _cancelNudges);
        wrap.addEventListener('click', _cancelNudges);
        wrap.addEventListener('touchstart', _cancelNudges, { passive: true });
      });
      _scheduleNudges(_rWraps);

      requestAnimationFrame(() => {
        selector.style.transition = 'opacity 0.5s ease';
        selector.style.opacity = '1';
      });

      backNavActive = false;
    });
  }, duration * 1000);
}

// ── SHARED TRUCK HELPERS ──
// Used by both launchTruckCanvas (forward) and launchReverseTruck (back).

function truckEaseInOutCubic(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2; }
function truckEaseOutCubic(t)   { return 1 - Math.pow(1-t, 3); }
function truckEaseInQuart(t)    { return t*t*t*t; }

// Rope physics — creates a verlet chain of `segs` segments between two pinned endpoints.
const TRUCK_ROPE_SEGS = 12;
function truckInitRope(ax, ay, bx, by) {
  const pts = [];
  for(let i = 0; i <= TRUCK_ROPE_SEGS; i++) {
    const t = i / TRUCK_ROPE_SEGS;
    pts.push({ x:ax+(bx-ax)*t, y:ay+(by-ay)*t, px:ax+(bx-ax)*t, py:ay+(by-ay)*t, pinned:(i===0||i===TRUCK_ROPE_SEGS) });
  }
  return pts;
}
function truckUpdateRope(pts, ax, ay, bx, by) {
  // Target segment length = straight-line distance between anchors / number of segments.
  // This keeps the rope taut (not drooping excessively) regardless of viewport size.
  const totalDist = Math.sqrt((bx-ax)*(bx-ax)+(by-ay)*(by-ay));
  const targetLen = totalDist / TRUCK_ROPE_SEGS;
  pts[0].x = ax; pts[0].y = ay;
  pts[TRUCK_ROPE_SEGS].x = bx; pts[TRUCK_ROPE_SEGS].y = by;
  for(let iter = 0; iter < 4; iter++) {
    for(let i = 0; i < TRUCK_ROPE_SEGS; i++) {
      const a = pts[i], b = pts[i+1];
      const dx = b.x-a.x, dy = b.y-a.y;
      const dist = Math.sqrt(dx*dx+dy*dy)||1;
      const diff = (dist-targetLen)/dist*0.5;
      if(!a.pinned){a.x+=dx*diff;a.y+=dy*diff;}
      if(!b.pinned){b.x-=dx*diff;b.y-=dy*diff;}
    }
  }
  for(let i = 1; i < TRUCK_ROPE_SEGS; i++) {
    const p = pts[i];
    const vx = p.x-p.px, vy = p.y-p.py;
    p.px=p.x; p.py=p.y;
    p.x+=vx*0.85; p.y+=vy*0.85+0.25; // gravity
  }
  pts[0].x=ax; pts[0].y=ay;
  pts[TRUCK_ROPE_SEGS].x=bx; pts[TRUCK_ROPE_SEGS].y=by;
}
function truckDrawRope(ctx, pts) {
  if(pts.length < 2) return;
  ctx.save();
  ctx.strokeStyle='#000'; ctx.lineWidth=2.5; ctx.lineCap='round';
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for(let i = 1; i <= TRUCK_ROPE_SEGS; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.stroke();
  ctx.restore();
}

// Dust particles — spawnFn returns a new particle; direction controlled by caller.
function truckSpawnDust(particles, x, y, speed, dirX) {
  for(let i = 0; i < 3; i++) {
    particles.push({
      x, y: y + (Math.random()-0.5)*6,
      vx: dirX * (1.5+Math.random()*2) * speed,
      vy: -(0.5+Math.random()*1.5),
      life: 1, decay: 0.025+Math.random()*0.02,
      r: 4+Math.random()*8
    });
  }
}
function truckUpdateParticles(particles) {
  for(let i = particles.length-1; i >= 0; i--) {
    const p = particles[i];
    p.x+=p.vx; p.y+=p.vy; p.vy+=0.06;
    p.life-=p.decay; p.r*=0.97;
    if(p.life <= 0) particles.splice(i, 1);
  }
}
function truckDrawParticles(ctx, particles) {
  particles.forEach(p => {
    ctx.save(); ctx.globalAlpha=p.life*0.4; ctx.fillStyle='#888';
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); ctx.restore();
  });
}

// ── ZOOM + TRUCK TRANSITION (canvas-drawn) ──
function disassembleSwitch() {
  const tsw = document.getElementById('train-switch-wrap');
  const sc = document.getElementById('train-switch-canvas');
  if(!tsw || !sc) return;
  
  // Disable interaction
  sc.style.pointerEvents = 'none';
  
  // Animate canvas scatter/break apart
  const keys = sc.querySelectorAll('canvas');
  sc.style.opacity = '0';
  sc.style.transition = 'opacity 0.3s ease';
  
  // Fade out label
  const label = tsw.querySelector('#train-switch-label');
  if(label) {
    label.style.opacity = '0';
    label.style.transition = 'opacity 0.3s ease';
  }
  
  // Scale down and rotate on disassembly
  tsw.style.transition = 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease';
  tsw.style.transform = 'scale(0.7) rotateZ(15deg)';
  tsw.style.opacity = '0';
  
  setTimeout(() => {
    tsw.classList.remove('visible');
    tsw.style.pointerEvents = 'none';
  }, 350);
}

function reassembleSwitch() {
  const tsw = document.getElementById('train-switch-wrap');
  const sc = document.getElementById('train-switch-canvas');
  if(!tsw || !sc) return;
  
  // Fully reset all inline styles from previous disassembly
  tsw.style.removeProperty('opacity');
  tsw.style.removeProperty('transform');
  tsw.style.removeProperty('transition');
  sc.style.removeProperty('opacity');
  sc.style.removeProperty('transition');
  sc.style.removeProperty('pointerEvents');
  
  const label = tsw.querySelector('#train-switch-label');
  if(label) {
    label.style.removeProperty('opacity');
    label.style.removeProperty('transition');
  }
  
  // Start as small dot
  tsw.style.transition = 'none';
  tsw.style.opacity = '0';
  tsw.style.transform = 'scale(0.1) rotateZ(-20deg)';
  tsw.classList.add('visible');
  
  // Trigger reflow to apply initial state
  void tsw.offsetWidth;
  
  // Animate growth from dot to full size (0.4s to match nav button animation)
  tsw.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease';
  tsw.style.opacity = '1';
  tsw.style.transform = 'scale(1) rotateZ(0deg)';
  
  // Re-enable interaction after animation completes
  setTimeout(() => {
    sc.style.pointerEvents = 'all';
  }, 400);
}

function zoomPage(page) {
  const btnId = page === 'about' ? 'btn-about' : page === 'projects' ? 'btn-projects' : 'btn-contact';
  const btn = document.getElementById(btnId);
  const others = ['btn-about','btn-projects','btn-contact'].filter(id=>id!==btnId);
  others.forEach(id=>document.getElementById(id).classList.add('fade-out'));

  // Disassemble the switch
  disassembleSwitch();

  const r = btn.getBoundingClientRect();
  const tx = window.innerWidth/2 - (r.left + r.width/2);
  const ty = window.innerHeight/2 - (r.top + r.height/2);

  btn.style.transition = `transform ${TIMING.zoomCentreDuration}ms cubic-bezier(.4,0,.2,1), opacity ${TIMING.zoomCentreDuration/2}ms ease`;
  btn.style.transform = `translate(${tx}px,${ty}px) scale(1.12)`;

  setTimeout(()=>{
    btn.style.transition = `transform ${TIMING.zoomShrinkDuration}ms ease, opacity ${TIMING.zoomShrinkDuration}ms ease`;
    btn.style.transform = `translate(${tx}px,${ty}px) scale(0.9)`;
    btn.style.opacity = '0';
    setTimeout(()=>{ btn.style.display='none'; launchTruckCanvas(page); }, TIMING.zoomHideDelay);
  }, TIMING.zoomShrinkDelay);
}

function launchTruckCanvas(page='about') {
  // Disable scroll detection when entering a page
  scrollDetectionActive = false;
  
  const canvas = document.getElementById('truck-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';
  // Hide footer during truck animation, will reappear as toes-only after
  const _ff = document.getElementById('foot-footer');
  if(_ff) {
    _ff.classList.remove('toes-only','peeked');
    _ff.style.transition=`opacity ${TIMING.footerFadeOutDuration}ms ease`;
    _ff.style.opacity='0';
    setTimeout(()=>{ _ff.style.display='none'; }, TIMING.footerFadeOutDuration);
  }

  // Resize canvas if orientation changes mid-animation
  const onResize = debounce(() => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }, 150);
  window.addEventListener('resize', onResize);

  // Page content per section
  const pageContent = {
    about: `
      <div class="about-content">
        <h1>ABOUT ME</h1>
        <p>I am Densley, an aspiring Linux System Administrator based in Malaysia.</p>
        <div class="placeholder-text">[ More details soon. ]</div>
      </div>`,
    projects: `
      <div class="about-content">
        <h1>PROJECTS</h1>
        <p>A collection of things I have built and shipped.</p>
        <div class="placeholder-text">[ in progress ]</div>
      </div>`,
    contact: `
      <div class="about-content">
        <h1>CONTACT</h1>
        <p>Let's build something together.</p>
        <div class="placeholder-text">[ mail me: ${OWNER_EMAIL} ]</div>
      </div>`,
  };

  // About page (hidden initially)
  const aboutPage = document.createElement('div');
  aboutPage.id = 'about-page';
  aboutPage.innerHTML = (pageContent[page] || pageContent.about);
  document.body.appendChild(aboutPage);

  // Truck geometry (in canvas coords)
  const W = canvas.width, H = canvas.height;
  const groundY = H/2 + 70;
  const truckW = 200, truckH = 80;
  const startX = W/2 - truckW/2;
  const targetX = W + 60; // drive off right
  const ropeTargetLen = W / 22; // scales with viewport width

  // Particles system
  const particles = [];

  // Screen shake state
  let shakeX=0, shakeY=0, shakeDecay=0;
  function triggerShake(magnitude) {
    shakeX = (Math.random()-0.5)*magnitude;
    shakeY = (Math.random()-0.5)*magnitude;
    shakeDecay = magnitude;
  }

  // Rope physics points (simple verlet chain)
  const ropeStartX = startX; // left edge of trailer
  const ropeStartY = groundY - truckH + 40;
  let ropePoints = truckInitRope(ropeStartX, ropeStartY, 0, ropeStartY);

  // Draw the canvas-drawn truck
  let wheelAngle = 0;
  function drawTruck(x, y, speed) {
    const tw=truckW, th=truckH;
    const wheelR=16, wheelY=y+th-4;
    const cabW=52, cabH=66;

    ctx.save();
    // Shadow
    ctx.fillStyle='rgba(0,0,0,0.08)';
    ctx.beginPath();
    ctx.ellipse(x+tw*0.45, wheelY+wheelR+2, tw*0.45, 8, 0, 0, Math.PI*2);
    ctx.fill();

    // Trailer body
    ctx.fillStyle='#fff';
    ctx.strokeStyle='#000';
    ctx.lineWidth=3;
    ctx.beginPath();
    ctx.rect(x, y+10, tw-cabW+8, th-20);
    ctx.fill(); ctx.stroke();

    // Trailer label
    ctx.fillStyle='#000';
    ctx.font='bold 11px "Courier New",monospace';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText('LOS DENSO', x+(tw-cabW+8)/2, y+th/2);

    // Trailer hatch lines for detail
    ctx.strokeStyle='rgba(0,0,0,0.12)';
    ctx.lineWidth=1;
    for(let lx=x+15;lx<x+tw-cabW;lx+=18){
      ctx.beginPath(); ctx.moveTo(lx,y+12); ctx.lineTo(lx,y+th-12); ctx.stroke();
    }

    // Cab body
    ctx.fillStyle='#fff';
    ctx.strokeStyle='#000';
    ctx.lineWidth=3;
    const cabX=x+tw-cabW;
    ctx.beginPath();
    ctx.moveTo(cabX+8, y+10);
    ctx.lineTo(cabX+cabW-4, y+10);
    ctx.lineTo(cabX+cabW-4, y+th-10);
    ctx.lineTo(cabX, y+th-10);
    ctx.lineTo(cabX, y+30);
    ctx.quadraticCurveTo(cabX, y+10, cabX+8, y+10);
    ctx.fill(); ctx.stroke();

    // Cab window
    ctx.fillStyle='#000';
    ctx.beginPath();
    ctx.rect(cabX+6, y+14, 30, 20);
    ctx.fill();
    // Window shine
    ctx.fillStyle='rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.rect(cabX+8, y+16, 8, 6);
    ctx.fill();

    // Exhaust pipe
    ctx.strokeStyle='#000'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(cabX+cabW-10, y+10); ctx.lineTo(cabX+cabW-10, y-6); ctx.stroke();
    // Smoke puffs
    if(speed>0.5) {
      ctx.fillStyle=`rgba(0,0,0,${0.12+Math.random()*0.08})`;
      ctx.beginPath();
      ctx.arc(cabX+cabW-10 + (Math.random()-0.5)*4, y-6-Math.random()*8, 4+Math.random()*4, 0, Math.PI*2);
      ctx.fill();
    }

    // Wheels
    wheelAngle += speed*0.09;
    [x+25, x+tw-cabW-16, x+tw-18].forEach((wx,wi)=>{
      // Tire
      ctx.fillStyle='#000';
      ctx.beginPath(); ctx.arc(wx, wheelY, wheelR, 0, Math.PI*2); ctx.fill();
      // Rim
      ctx.fillStyle='#fff';
      ctx.beginPath(); ctx.arc(wx, wheelY, wheelR*0.55, 0, Math.PI*2); ctx.fill();
      // Spokes
      ctx.strokeStyle='#000'; ctx.lineWidth=2;
      for(let s=0;s<4;s++){
        const a=wheelAngle+s*Math.PI/2;
        ctx.beginPath();
        ctx.moveTo(wx+Math.cos(a)*wheelR*0.2, wheelY+Math.sin(a)*wheelR*0.2);
        ctx.lineTo(wx+Math.cos(a)*wheelR*0.5, wheelY+Math.sin(a)*wheelR*0.5);
        ctx.stroke();
      }
      // Hubcap dot
      ctx.fillStyle='#000';
      ctx.beginPath(); ctx.arc(wx,wheelY,3,0,Math.PI*2); ctx.fill();
    });

    ctx.restore();
  }

  // Animation state
  const duration = 2200;
  let startTime = null;
  let phase = 'rev'; // rev → drive
  let revDuration = 600;
  let revStart = null;
  let hasShaken = false;

  let truckX = startX;

  function frame(ts) {
    if(!startTime) startTime=ts;
    const elapsed = ts-startTime;

    // Shake decay
    if(shakeDecay>0){ shakeX=(Math.random()-0.5)*shakeDecay; shakeY=(Math.random()-0.5)*shakeDecay; shakeDecay*=0.82; }
    else { shakeX=0; shakeY=0; }

    ctx.save();
    ctx.translate(shakeX, shakeY);
    ctx.clearRect(-10,-10,W+20,H+20);

    // Ground line
    ctx.strokeStyle='#000'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(0, groundY+16); ctx.lineTo(W, groundY+16); ctx.stroke();

    let speed = 0;

    if(phase==='rev') {
      // Rev: small backward lurch before driving
      if(!revStart) {
        revStart=ts;
        playWhoosh(0.35, 600, 180);  // Play whoosh during rev
      }
      const rp=Math.min((ts-revStart)/revDuration,1);
      const lurch = Math.sin(rp*Math.PI)*8;
      truckX = startX - lurch;
      speed = lurch*0.2;

      if(rp>=1){ phase='drive'; startTime=ts; triggerShake(12); playWhoosh(0.5, 900, 250); }  // Whoosh as truck launches
    } else {
      // Drive phase
      const p = Math.min(elapsed/duration,1);
      const ease = truckEaseInOutCubic(p);
      truckX = startX + (targetX-startX)*ease;
      speed = (targetX-startX)/duration * 60;

      // Reveal page: starts after truck has moved a bit
      const revealEdge = Math.max(0, truckX - 60);
      aboutPage.style.clipPath=`inset(0 ${Math.max(0,W-revealEdge)}px 0 0)`;

      // Shake on snap
      if(!hasShaken && p>0.08){ hasShaken=true; triggerShake(7); }

      // Spawn dust under rear wheels
      if(p<0.95 && Math.random()<0.4) {
        truckSpawnDust(particles, truckX+22, groundY+12, Math.min(p*3+0.5,2), -1);
      }

      if(p>=1) {
        window.removeEventListener('resize', onResize);
        aboutPage.style.clipPath='none';
        canvas.style.display='none';
        document.getElementById('scene').style.display='none';
        // Trigger entrance animations on about content
        const content = aboutPage.querySelector('.about-content');
        if(content) requestAnimationFrame(()=>content.classList.add('animate'));
        // Show "click to go back" tooltip then wire up back navigation
        setTimeout(()=>initBackToNav(aboutPage), TIMING.truckPageRevealDelay);
        // Restore footer in toes-only mode — toes peek, hover pops it out
        const _ff2 = document.getElementById('foot-footer');
        if(_ff2) {
          _ff2.style.display = '';
          _ff2.style.opacity = '1';
          _ff2.style.transition = `transform 0.55s cubic-bezier(0.34,1.56,0.64,1)`;
          setTimeout(()=>{
            _ff2.classList.add('toes-only');
            // Hover to pop out / retract (mouse)
            _ff2._toesEnter = () => { _ff2.classList.add('peeked'); };
            _ff2._toesLeave = () => { _ff2.classList.remove('peeked'); };
            _ff2.addEventListener('mouseenter', _ff2._toesEnter);
            _ff2.addEventListener('mouseleave', _ff2._toesLeave);
            // Touch: tap the toes strip to toggle peek open/close
            _ff2._toesTouch = (e) => {
              // Only toggle if tapping the footer itself (not a link/button inside)
              const isPeeked = _ff2.classList.contains('peeked');
              if(!isPeeked) {
                _ff2.classList.add('peeked');
              } else if(!e.target.closest('a, [id="email-link"]')) {
                // Second tap on background closes it; tapping a link lets it through
                _ff2.classList.remove('peeked');
              }
            };
            _ff2.addEventListener('touchstart', _ff2._toesTouch, { passive: true });
          }, TIMING.footerFadeInDelay);
        }
        ctx.restore();
        return;
      }
    }

    // Update particles
    truckUpdateParticles(particles);

    // Rope: from left edge of page to rear of trailer
    const ropePageX = Math.max(0, truckX - 60);
    const ropePageY = groundY - 30;
    const ropeTruckX = truckX + 2;
    const ropeTruckY = groundY - truckH + 38;
    truckUpdateRope(ropePoints, ropeTruckX, ropeTruckY, ropePageX, ropePageY, ropeTargetLen);

    // Vertical edge line: the leading edge of the about page, connected to the rope
    if(ropePageX > 0) {
      ctx.save();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ropePageX, 0);
      ctx.lineTo(ropePageX, H);
      ctx.stroke();
      // Small knot/hook where rope meets the vertical line
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(ropePageX, ropePageY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    truckDrawParticles(ctx, particles);
    truckDrawRope(ctx, ropePoints);
    drawTruck(truckX, groundY-truckH, speed);

    ctx.restore();
    requestAnimationFrame(frame);
  }

  // Small rev delay to let button fade out
  setTimeout(()=>requestAnimationFrame(frame), TIMING.truckRevDelay);
}


// ── REVERSE TRUCK TRANSITION (back to nav) ──
// A truck drives in from the right, hooks the page, and drags it off-screen right.
// Mirrors the forward transition so going back feels as intentional as going forward.
function launchReverseTruck(pageEl, onComplete) {
  const canvas = document.getElementById('truck-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';

  // Resize canvas if orientation changes mid-animation
  const onResize = debounce(() => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }, 150);
  window.addEventListener('resize', onResize);

  const W = canvas.width, H = canvas.height;
  const duration   = TIMING.truckReverseDuration;
  const truckW     = 200, truckH = 80;
  const groundY    = H / 2 + 70;
  const ropeTargetLen = W / 22; // scales with viewport width
  // Truck enters from right edge, parks at centre-right, then drags page off
  const enterX     = W + truckW;         // start off-screen right
  const parkedX    = W / 2 + 40;        // where it stops briefly before pulling
  const exitX      = W + truckW + 60;   // final off-screen position (dragging page)

  let startTime    = null;
  let wheelAngle   = 0;
  let phase        = 'enter';            // enter → pause → pull
  let pauseStart   = null;
  const pauseMs    = 260;               // brief stop before yanking the page
  let truckX       = enterX;
  let shakeX = 0, shakeY = 0, shakeDecay = 0;
  const particles  = [];
  let hasPlayedEnterWhoosh = false;
  let hasPlayedPullWhoosh = false;
  function triggerShake(mag) { shakeDecay = mag; }

  // Rope: initially not connected, will appear when truck parks
  let ropePoints = null;
  let ropeConnected = false;

  function drawTruck(x, y, speed) {
    const tw=truckW, th=truckH;
    const wheelR=16, wheelY=y+th-4;
    const cabW=52;

    ctx.save();
    // Shadow
    ctx.fillStyle='rgba(0,0,0,0.08)';
    ctx.beginPath();
    ctx.ellipse(x+tw*0.45, wheelY+wheelR+2, tw*0.45, 8, 0, 0, Math.PI*2);
    ctx.fill();

    // Trailer body
    ctx.fillStyle='#fff'; ctx.strokeStyle='#000'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.rect(x+cabW-8, y+10, tw-cabW+8, th-20); ctx.fill(); ctx.stroke();

    // Trailer label
    ctx.fillStyle='#000'; ctx.font='bold 11px "Courier New",monospace';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('LOS DENSO', x+cabW+(tw-cabW)/2-4, y+th/2);

    // Hatch lines
    ctx.strokeStyle='rgba(0,0,0,0.12)'; ctx.lineWidth=1;
    for(let lx=x+cabW+6; lx<x+tw; lx+=18){
      ctx.beginPath(); ctx.moveTo(lx,y+12); ctx.lineTo(lx,y+th-12); ctx.stroke();
    }

    // Cab (mirrored — cab on the LEFT since truck faces right)
    ctx.fillStyle='#fff'; ctx.strokeStyle='#000'; ctx.lineWidth=3;
    const cabX=x;
    ctx.beginPath();
    ctx.moveTo(cabX+cabW-8, y+10);
    ctx.lineTo(cabX+4, y+10);
    ctx.quadraticCurveTo(cabX, y+10, cabX, y+30);
    ctx.lineTo(cabX, y+th-10);
    ctx.lineTo(cabX+cabW-8, y+th-10);
    ctx.fill(); ctx.stroke();

    // Window
    ctx.fillStyle='#000';
    ctx.beginPath(); ctx.rect(cabX+8, y+14, 30, 20); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.3)';
    ctx.beginPath(); ctx.rect(cabX+10, y+16, 8, 6); ctx.fill();

    // Exhaust (left side since cab faces right)
    ctx.strokeStyle='#000'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(cabX+10, y+10); ctx.lineTo(cabX+10, y-6); ctx.stroke();
    if(speed > 0.5) {
      ctx.fillStyle=`rgba(0,0,0,${0.12+Math.random()*0.08})`;
      ctx.beginPath();
      ctx.arc(cabX+10+(Math.random()-0.5)*4, y-6-Math.random()*8, 4+Math.random()*4, 0, Math.PI*2);
      ctx.fill();
    }

    // Wheels
    wheelAngle -= speed * 0.09; // spinning backwards (moving right)
    [x+tw-25, x+cabW+16, x+18].forEach(wx=>{
      ctx.fillStyle='#000';
      ctx.beginPath(); ctx.arc(wx, wheelY, wheelR, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle='#fff';
      ctx.beginPath(); ctx.arc(wx, wheelY, wheelR*0.55, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle='#000'; ctx.lineWidth=2;
      for(let s=0;s<4;s++){
        const a=wheelAngle+s*Math.PI/2;
        ctx.beginPath();
        ctx.moveTo(wx+Math.cos(a)*wheelR*0.2, wheelY+Math.sin(a)*wheelR*0.2);
        ctx.lineTo(wx+Math.cos(a)*wheelR*0.5, wheelY+Math.sin(a)*wheelR*0.5);
        ctx.stroke();
      }
      ctx.fillStyle='#000';
      ctx.beginPath(); ctx.arc(wx,wheelY,3,0,Math.PI*2); ctx.fill();
    });
    ctx.restore();
  }

  let hasShaken = false;

  function frame(ts) {
    if(!startTime) startTime = ts;

    if(shakeDecay > 0){ shakeX=(Math.random()-0.5)*shakeDecay; shakeY=(Math.random()-0.5)*shakeDecay; shakeDecay*=0.82; }
    else { shakeX=0; shakeY=0; }

    ctx.save();
    ctx.translate(shakeX, shakeY);
    ctx.clearRect(-10,-10,W+20,H+20);

    // Ground line
    ctx.strokeStyle='#000'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(0,groundY+16); ctx.lineTo(W,groundY+16); ctx.stroke();

    let speed = 0;

    if(phase === 'enter') {
      // Truck drives in from right, decelerates to parkedX
      const elapsed = ts - startTime;
      const enterDuration = duration * 0.38;
      const p = Math.min(elapsed / enterDuration, 1);
      const ease = truckEaseOutCubic(p);
      truckX = enterX + (parkedX - enterX) * ease;
      speed  = Math.abs((parkedX - enterX) / enterDuration * 60 * (1 - ease));

      if(!hasPlayedEnterWhoosh) { hasPlayedEnterWhoosh=true; playWhoosh(0.45, 950, 300); }
      if(!hasShaken && p > 0.92) { hasShaken=true; triggerShake(10); }

      if(p >= 1) {
        phase      = 'pause';
        pauseStart = ts;
        hasShaken  = false;
        triggerShake(6);
      }
    }
    else if(phase === 'pause') {
      truckX = parkedX;
      speed  = 0;
      if(ts - pauseStart >= pauseMs) { phase = 'pull'; startTime = ts; playWhoosh(0.6, 850, 200); }
    }
    else if(phase === 'pull') {
      // Truck and page both slide off right
      const elapsed = ts - startTime;
      const p = Math.min(elapsed / (duration * 0.62), 1);
      const ease = truckEaseInOutCubic(p);
      truckX = parkedX + (exitX - parkedX) * ease;
      speed  = (exitX - parkedX) / duration * 60;

      if(!hasShaken && p > 0.06) { hasShaken=true; triggerShake(8); }

      // Page follows, offset slightly behind the truck
      const pageOffset = Math.max(0, truckX - parkedX - 40);
      pageEl.style.transform = `translateX(${pageOffset}px)`;
      pageEl.style.clipPath   = `inset(0 0 0 0)`;   // ensure it's visible while sliding

      if(p < 0.95 && Math.random() < 0.4) {
        truckSpawnDust(particles, truckX + truckW - 20, groundY + 12, Math.min(p*3+0.5, 2), 1);
      }

      if(p >= 1) {
        window.removeEventListener('resize', onResize);
        canvas.style.display = 'none';
        onComplete();
        ctx.restore();
        return;
      }
    }

    // Particles
    truckUpdateParticles(particles);

    // Rope: truck front → page (only appears when pulling)
    if(phase === 'pull') {
      // Initialize rope on first pull phase if not already done
      if(!ropeConnected) {
        ropePoints = truckInitRope(truckX, groundY - truckH + 38, W, groundY - 30);
        ropeConnected = true;
      }
      
      const ropeTruckX = truckX;                    // front of cab
      const ropeTruckY = groundY - truckH + 38;
      const ropePageX  = Math.min(W, parkedX - 40 + Math.max(0, truckX - parkedX - 40));
      const ropePageY  = groundY - 30;
      truckUpdateRope(ropePoints, ropeTruckX, ropeTruckY, ropePageX, ropePageY, ropeTargetLen);

      // Vertical leading edge of page
      if(ropePageX < W + 20) {
        ctx.save();
        ctx.strokeStyle='#000'; ctx.lineWidth=3;
        ctx.beginPath(); ctx.moveTo(ropePageX, 0); ctx.lineTo(ropePageX, H); ctx.stroke();
        ctx.fillStyle='#000';
        ctx.beginPath(); ctx.arc(ropePageX, ropePageY, 5, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      }

      truckDrawRope(ctx, ropePoints);
    }
    drawTruck(truckX, groundY - truckH, speed);
    ctx.restore();
    requestAnimationFrame(frame);
  }

  setTimeout(()=>requestAnimationFrame(frame), TIMING.truckRevDelay);
}


// ── BACK TO NAV ──
let backNavActive = false; // guard against double-activation
function initBackToNav(pageEl) {
  if(backNavActive) return;
  backNavActive = true;
  // Create tooltip — use touch-aware label
  const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const tip = document.createElement('div');
  tip.id = 'back-tooltip';
  tip.textContent = isTouchDevice ? 'Tap anywhere to go back' : 'Click anywhere to go back';
  document.body.appendChild(tip);

  // Follow mouse (desktop only; on touch it stays centred via CSS)
  function onMove(e) {
    tip.style.left = e.clientX + 'px';
    tip.style.top  = e.clientY + 'px';
  }
  if(!isTouchDevice) document.addEventListener('mousemove', onMove);

  // Show it
  requestAnimationFrame(()=>tip.classList.add('visible'));

  // Fade out after configured delay
  const fadeTimer = setTimeout(()=>{
    tip.classList.remove('visible');
    tip.classList.add('fade-out');
  }, TIMING.backTooltipFadeDelay);

  // Click anywhere = go back
  function goBack(e) {
    // Ignore clicks on footer or footer elements
    const footer = document.getElementById('foot-footer');
    if(footer && footer.contains(e.target)) return;
    
    clearTimeout(fadeTimer);
    if(!isTouchDevice) document.removeEventListener('mousemove', onMove);
    document.removeEventListener('click', goBack);
    tip.remove();

    // Clean up toes-only mode and its hover/touch listeners
    const _ffb = document.getElementById('foot-footer');
    if(_ffb) {
      if(_ffb._toesEnter) { _ffb.removeEventListener('mouseenter', _ffb._toesEnter); delete _ffb._toesEnter; }
      if(_ffb._toesLeave) { _ffb.removeEventListener('mouseleave', _ffb._toesLeave); delete _ffb._toesLeave; }
      if(_ffb._toesTouch) { _ffb.removeEventListener('touchstart', _ffb._toesTouch); delete _ffb._toesTouch; }
      _ffb.classList.remove('toes-only','peeked');
      _ffb.style.transition=`opacity ${TIMING.footerFadeOutDuration}ms ease`;
      _ffb.style.opacity='0';
      setTimeout(()=>{ _ffb.style.display='none'; }, TIMING.footerFadeOutDuration);
    }

    // Reverse truck wipe — matches the energy of the forward transition
    launchReverseTruck(pageEl, ()=>{
      pageEl.remove();

      // Restore scene
      const scene = document.getElementById('scene');
      scene.style.removeProperty('display');
      scene.classList.add('visible');

      // Reset nav buttons
      const nav = document.getElementById('nav-wrap');
      document.querySelectorAll('.nav-btn').forEach(btn=>{
        btn.classList.remove('fade-out', 'appeared');
        btn.style.removeProperty('transform');
        btn.style.removeProperty('opacity');
        btn.style.removeProperty('display');
        btn.style.removeProperty('transition');
      });

      nav.style.opacity = '0';
      nav.style.pointerEvents = 'none';
      nav.classList.add('visible');

      requestAnimationFrame(()=>{
        nav.style.removeProperty('opacity');
        nav.style.removeProperty('pointer-events');
        document.querySelectorAll('.nav-btn').forEach((btn,i)=>{
          btn.style.setProperty('--r', ((Math.random()-.5)*20)+'deg');
          setTimeout(()=>btn.classList.add('appeared'), i*TIMING.backBtnStagger + TIMING.backBtnStaggerOffset);
        });
        // Play startup chime when returning to nav
        setTimeout(playStartupChime, TIMING.chimeDelay);
        setTimeout(bindNav, TIMING.backNavReturnDelay);
        // Re-show train switch with reassembly animation
        const tsw = document.getElementById('train-switch-wrap');
        if(tsw) {
          setTimeout(() => reassembleSwitch(), TIMING.backNavReturnDelay);
        }
        backNavActive = false; // ready for next navigation
        const _ffr = document.getElementById('foot-footer');
        if(_ffr) { _ffr.style.display=''; setTimeout(()=>{ _ffr.style.transition=`opacity ${TIMING.footerFadeInDuration}ms ease`; _ffr.style.opacity='1'; }, TIMING.backFooterDelay); }
      });
    });
  }

  // Small delay so the page-reveal click doesn't immediately trigger goBack
  setTimeout(()=>document.addEventListener('click', goBack), TIMING.backNavGuardDelay);
}

// ── TRAIN SWITCH (dark mode toggle) ──
let trainSwitchInited = false;
let isDark = false;

function playSwitchSound(isUp) {
  try {
    const now = audioCtx.currentTime;
    
    // Thocky bass click using low frequency sine
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    
    osc.connect(oscGain);
    oscGain.connect(audioCtx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);
    
    oscGain.gain.setValueAtTime(0.2, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    osc.start(now);
    osc.stop(now + 0.05);
  } catch(e) {
    // Audio context may fail on some browsers/contexts, silently continue
  }
}

function initTrainSwitch() {
  if(trainSwitchInited) {
    // Already inited — just make it visible again
    const tsw = document.getElementById('train-switch-wrap');
    if(tsw) tsw.classList.add('visible');
    return;
  }
  trainSwitchInited = true;

  const wrap = document.getElementById('train-switch-wrap');
  const sc   = document.getElementById('train-switch-canvas');
  if(!wrap || !sc) return;
  wrap.classList.add('visible');

  const W = 60, H = 60;
  const dpr = window.devicePixelRatio || 1;
  sc.width  = W * dpr; sc.height = H * dpr;
  sc.style.width = W + 'px'; sc.style.height = H + 'px';
  const cx = sc.getContext('2d');
  cx.scale(dpr, dpr);

  // Switch state: 0 = up (light), 1 = down (dark)
  let leverT = 0; // 0..1, animated
  let leverTarget = 0;
  let leverRaf = null;
  let busy = false;

  function drawSwitch(t) {
    cx.clearRect(0, 0, W, H);
    const fg = isDark ? '#f0f0f0' : '#000';
    const bg = isDark ? '#0a0a0a' : '#fff';

    // Base plate
    cx.fillStyle = bg;
    cx.strokeStyle = fg;
    cx.lineWidth = 2;
    cx.beginPath();
    cx.roundRect(14, 38, 32, 16, 4);
    cx.fill(); cx.stroke();

    // Pivot dot
    cx.fillStyle = fg;
    cx.beginPath(); cx.arc(30, 44, 3, 0, Math.PI*2); cx.fill();

    // Lever — rotates from -40deg (up/light) to +40deg (down/dark)
    const angle = (-40 + t * 80) * Math.PI / 180;
    const len = 20;
    const ex = 30 + Math.sin(angle) * len;
    const ey = 44 - Math.cos(angle) * len;

    cx.strokeStyle = fg; cx.lineWidth = 3; cx.lineCap = 'round';
    cx.beginPath(); cx.moveTo(30, 44); cx.lineTo(ex, ey); cx.stroke();

    // Knob at tip
    cx.fillStyle = t > 0.5 ? '#ccff00' : fg;
    cx.strokeStyle = fg; cx.lineWidth = 1.5;
    cx.beginPath(); cx.arc(ex, ey, 5, 0, Math.PI*2); cx.fill(); cx.stroke();

    // Small label ticks: sun (left) / moon (right)
    cx.fillStyle = fg; cx.font = '8px monospace'; cx.textAlign = 'center';
    cx.fillText('☀', 18, 35);
    cx.fillText('☾', 42, 35);
  }

  function animateLever() {
    const speed = 0.07;
    if(Math.abs(leverT - leverTarget) < 0.01) {
      leverT = leverTarget;
      drawSwitch(leverT);
      leverRaf = null;
      return;
    }
    leverT += (leverTarget - leverT) * speed * 2.5;
    drawSwitch(leverT);
    leverRaf = requestAnimationFrame(animateLever);
  }

  drawSwitch(0);

  sc.addEventListener('click', () => {
    if(busy) return;
    busy = true;
    
    // Play switch sound immediately
    playSwitchSound(isDark);
    
    leverTarget = isDark ? 0 : 1;
    if(!leverRaf) leverRaf = requestAnimationFrame(animateLever);
    
    // Kick off the train animation
    runTrainTransition(() => {
      isDark = !isDark;
      document.body.classList.toggle('dark', isDark);
      drawSwitch(leverT);
      busy = false;
    });
  });
}

// ── TRAIN TRANSITION ANIMATION ──
function runTrainTransition(onDarkToggle) {
  const canvas = document.getElementById('train-canvas');
  if(!canvas) { onDarkToggle(); return; }
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';

  const W = canvas.width, H = canvas.height;
  const fg = isDark ? '#f0f0f0' : '#000';
  const bg = isDark ? '#0a0a0a' : '#fff';

  // Grab nav button rects before we manipulate them
  const btns = ['btn-about','btn-projects','btn-contact'].map(id => {
    const el = document.getElementById(id);
    const r  = el ? el.getBoundingClientRect() : null;
    return { el, r };
  });

  // Hide nav buttons while we animate on canvas
  btns.forEach(b => { if(b.el) b.el.style.visibility = 'hidden'; });
  // Hide train switch temporarily (using CSS class for smooth animation)
  const tsw = document.getElementById('train-switch-wrap');
  if(tsw) {
    tsw.classList.remove('visible');
    tsw.style.pointerEvents = 'none';
  }

  // --- Geometry ---
  // Car sizes match button sizes: 140x56
  const carW = 140, carH = 56, carGap = 16;
  const numCars = 3;
  // Starting X for first car = left edge of first button in viewport
  const startX = btns[0].r ? btns[0].r.left : W/2 - (numCars*(carW+carGap))/2;
  const trainY  = btns[0].r ? btns[0].r.top  : H/2 - carH/2;

  // Labels for each car
  const labels = ['ABOUT ME', 'PROJECTS', 'CONTACT'];

  // Track Y = bottom of cars
  const trackY = trainY + carH;

  // Phase: 'assemble' → 'run' → 'transition' → 'return' → 'done'
  // assemble: connectors appear between cars (instant, drawn)
  // run: train slides right off screen, tracks extend right
  // transition: dark mode flips, train re-enters from left
  // return: train slides back to centre, cars dissolve into buttons
  let phase = 'run';
  let trainX = startX;   // left edge of engine (first car)
  const exitX   = W + 50;              // fully off right
  const enterX  = -(numCars*(carW+carGap) + 100); // fully off left

  let trackProgress = 0; // 0..1, how far the tracks have drawn (right side)
  let runProgress   = 0;
  let transProgress = 0;
  let returnProgress = 0;
  let darkToggled = false;

  // Smoke particles
  const smoke = [];
  function spawnSmoke(x, y) {
    for(let i = 0; i < 2; i++) {
      smoke.push({ x, y: y + (Math.random()-0.5)*4,
        vx: -(1+Math.random()*1.5), vy: -(0.5+Math.random()),
        life: 1, r: 4+Math.random()*5 });
    }
  }
  function updateSmoke() {
    for(let i = smoke.length-1; i >= 0; i--) {
      const s = smoke[i];
      s.x += s.vx; s.y += s.vy; s.vy *= 0.97;
      s.life -= 0.022; s.r *= 0.99;
      if(s.life <= 0) smoke.splice(i, 1);
    }
  }
  function drawSmoke() {
    smoke.forEach(s => {
      ctx.save(); ctx.globalAlpha = s.life * 0.35;
      ctx.fillStyle = isDark ? '#888' : '#888';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    });
  }

  // Draw a single train car at position x, y
  function drawCar(x, y, label, isEngine) {
    const cFg = isDark ? '#f0f0f0' : '#000';
    const cBg = isDark ? '#111'    : '#fff';
    const wheelR = 8;
    const wheelY = y + carH + wheelR - 2;

    // Body
    ctx.fillStyle = cBg; ctx.strokeStyle = cFg; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.roundRect(x, y, carW, carH, 6); ctx.fill(); ctx.stroke();
    // Box shadow feel
    ctx.fillStyle = 'rgba(0,0,0,0.0)'; // shadow via stroke offset

    // Label
    ctx.fillStyle = cFg;
    ctx.font = 'bold 11px "Courier New",monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(label, x + carW/2, y + carH/2);

    // Engine chimney
    if(isEngine) {
      ctx.fillStyle = cFg; ctx.strokeStyle = cFg; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.rect(x + 10, y - 12, 8, 14); ctx.fill();
    }

    // Wheels
    [x + 18, x + carW - 18].forEach(wx => {
      ctx.fillStyle = cFg;
      ctx.beginPath(); ctx.arc(wx, wheelY, wheelR, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = cBg;
      ctx.beginPath(); ctx.arc(wx, wheelY, wheelR * 0.45, 0, Math.PI*2); ctx.fill();
    });
  }

  // Draw connector between cars
  function drawConnector(x1, y) {
    const cFg = isDark ? '#f0f0f0' : '#000';
    ctx.strokeStyle = cFg; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y + carH/2 - 6);
    ctx.lineTo(x1 + carGap, y + carH/2 - 6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x1, y + carH/2 + 6);
    ctx.lineTo(x1 + carGap, y + carH/2 + 6);
    ctx.stroke();
    // Coupler box
    ctx.fillStyle = cFg;
    ctx.beginPath(); ctx.rect(x1 + carGap/2 - 4, y + carH/2 - 8, 8, 16); ctx.fill();
  }

  // Draw tracks from trackStartX to trackEndX
  function drawTracks(startTX, endTX, ty) {
    const cFg = isDark ? '#555' : '#bbb';
    const railOff = 6; // half-spacing between rails
    const sleeperW = 16, sleeperSpacing = 22;

    // Rails
    ctx.strokeStyle = isDark ? '#888' : '#888'; ctx.lineWidth = 3;
    [ty - railOff, ty + railOff].forEach(ry => {
      ctx.beginPath(); ctx.moveTo(startTX, ry); ctx.lineTo(endTX, ry); ctx.stroke();
    });

    // Sleepers
    ctx.strokeStyle = isDark ? '#555' : '#555'; ctx.lineWidth = 4; ctx.lineCap = 'square';
    for(let sx = startTX; sx < endTX; sx += sleeperSpacing) {
      ctx.beginPath();
      ctx.moveTo(sx, ty - railOff - 4);
      ctx.lineTo(sx, ty + railOff + 4);
      ctx.stroke();
    }
  }

  let wheelAngle = 0;

  function easeInOut(t) { return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2; }
  function easeOut(t)   { return 1 - Math.pow(1-t, 3); }

  let lastTs = null;

  function frame(ts) {
    if(!lastTs) lastTs = ts;
    const dt = Math.min((ts - lastTs) / (1000/60), 3);
    lastTs = ts;

    ctx.clearRect(0, 0, W, H);

    // --- PHASE: run (train exits right, tracks extend) ---
    if(phase === 'run') {
      runProgress = Math.min(runProgress + 0.008 * dt, 1);
      trackProgress = Math.min(trackProgress + 0.014 * dt, 1);

      const speed = easeInOut(runProgress);
      trainX = startX + (exitX - startX) * speed;
      wheelAngle += speed * 2 * dt;

      // Tracks extend full width left→right
      const trackEnd = W * easeOut(trackProgress);
      drawTracks(0, trackEnd, trackY + 10);

      // Draw train
      for(let i = 0; i < numCars; i++) {
        const cx2 = trainX + i*(carW+carGap);
        drawCar(cx2, trainY, labels[i], i === 0);
        if(i < numCars-1) drawConnector(cx2 + carW, trainY);
        // Smoke from engine
        if(i === 0 && Math.random() < 0.4) spawnSmoke(trainX + 14, trainY - 14);
      }
      updateSmoke(); drawSmoke();

      // Wheel rotation overlay
      for(let i = 0; i < numCars; i++) {
        const cx2 = trainX + i*(carW+carGap);
        const wheelY2 = trainY + carH + 8 - 2;
        const cFg = isDark ? '#f0f0f0' : '#000';
        [cx2+18, cx2+carW-18].forEach(wx => {
          ctx.strokeStyle = isDark ? '#111' : '#fff'; ctx.lineWidth = 1.5;
          for(let s = 0; s < 4; s++) {
            const a = wheelAngle + s*Math.PI/2;
            ctx.beginPath();
            ctx.moveTo(wx + Math.cos(a)*3, wheelY2 + Math.sin(a)*3);
            ctx.lineTo(wx + Math.cos(a)*6.5, wheelY2 + Math.sin(a)*6.5);
            ctx.stroke();
          }
        });
      }

      if(runProgress >= 1) {
        phase = 'transition';
        transProgress = 0;
      }
    }

    // --- PHASE: transition (dark mode flip, flash, train re-enters) ---
    else if(phase === 'transition') {
      transProgress = Math.min(transProgress + 0.02 * dt, 1);

      // Keep tracks full width during transition
      drawTracks(0, W, trackY + 10);

      // Flash overlay at midpoint
      if(transProgress > 0.3 && !darkToggled) {
        darkToggled = true;
        onDarkToggle(); // flip dark mode
      }

      // Flash: bright white/dark flash
      const flashT = transProgress < 0.5
        ? transProgress / 0.5
        : 1 - (transProgress - 0.5) / 0.5;
      if(flashT > 0) {
        ctx.save();
        ctx.globalAlpha = flashT * 0.85;
        ctx.fillStyle = isDark ? '#0a0a0a' : '#fff';
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      // Train enters from left during second half
      if(transProgress > 0.5) {
        const enterProgress = (transProgress - 0.5) / 0.5;
        trainX = enterX + (startX - enterX) * easeOut(enterProgress);
        wheelAngle -= easeOut(enterProgress) * 1.5 * dt;

        for(let i = 0; i < numCars; i++) {
          const cx2 = trainX + i*(carW+carGap);
          drawCar(cx2, trainY, labels[i], i === 0);
          if(i < numCars-1) drawConnector(cx2 + carW, trainY);
          if(i === 0 && Math.random() < 0.3) spawnSmoke(trainX + 14, trainY - 14);
        }
        updateSmoke(); drawSmoke();
      }

      if(transProgress >= 1) {
        phase = 'return';
        returnProgress = 0;
        trainX = startX; // snap to final position
      }
    }

    // --- PHASE: return (train parks, buttons reappear) ---
    else if(phase === 'return') {
      returnProgress = Math.min(returnProgress + 0.018 * dt, 1);

      // Tracks fade out full width
      const cFgTrack = isDark ? '#f0f0f0' : '#000';
      ctx.save();
      ctx.globalAlpha = 1 - easeOut(returnProgress);
      drawTracks(0, W, trackY + 10);
      ctx.restore();

      // Cars dissolve (fade out)
      ctx.save();
      ctx.globalAlpha = 1 - easeOut(returnProgress);
      for(let i = 0; i < numCars; i++) {
        const cx2 = startX + i*(carW+carGap);
        drawCar(cx2, trainY, labels[i], i === 0);
        if(i < numCars-1) drawConnector(cx2 + carW, trainY);
      }
      ctx.restore();

      if(returnProgress >= 1) {
        phase = 'done';
        canvas.style.display = 'none';
        ctx.clearRect(0, 0, W, H);
        // Restore nav buttons
        btns.forEach(b => { if(b.el) b.el.style.visibility = ''; });
        // Restore train switch with animation
        if(tsw) {
          tsw.classList.add('visible');
          tsw.style.pointerEvents = '';
        }
        return;
      }
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

// ── FOOT FOOTER ──
let _footRafId = null; // module-level so re-entry can cancel the previous loop
function initFoot() {
  const fc = document.getElementById('foot-canvas');
  if(!fc) return;
  // Cancel any existing foot animation loop before starting a fresh one
  if(_footRafId) { cancelAnimationFrame(_footRafId); _footRafId = null; }
  const cx = fc.getContext('2d');

  // Scale canvas for HiDPI/Retina displays — keeps drawing coords at logical pixels
  // while the backing store is at physical resolution (prevents blurriness).
  const dpr = window.devicePixelRatio || 1;
  const logicalW = 100, logicalH = 80;
  fc.width  = logicalW * dpr;
  fc.height = logicalH * dpr;
  fc.style.width  = logicalW + 'px';
  fc.style.height = logicalH + 'px';
  cx.scale(dpr, dpr);

  const W = logicalW, H = logicalH;

  // phases: idle | wiggle | flip-to-back | showing-back | flip-to-front
  let phase = 'idle';
  let flipAngle = 0;
  let wiggleT = 0;
  let footAlpha = 0;
  let isHovered = false;
  let nextIdleWiggle = 180;   // frames until next idle wiggle burst
  let idleWiggleActive = false;
  let idleWiggleDuration = 0;
  let flipBack = false;       // true = flipping back to front

  const toeWiggle = [0,0,0,0,0];
  const toePhase  = [0, 0.4, 0.8, 1.2, 1.6];

  // Foot coords tuned for 100x80 canvas — wider foot, proper toe proportions
  // Foot body centred ~(50,52), toes across top
  const toeData = [
    { x:28, y:18, rx:7,  ry:9  },
    { x:39, y:13, rx:7,  ry:9  },
    { x:51, y:12, rx:6.5,ry:8.5},
    { x:62, y:14, rx:6,  ry:8  },
    { x:71, y:20, rx:5,  ry:7  },
  ];

  function drawFoot(scaleX=1) {
    cx.save();
    cx.translate(W/2, H/2); cx.scale(scaleX, 1); cx.translate(-W/2, -H/2);
    cx.fillStyle='#fff'; cx.strokeStyle='#000'; cx.lineWidth=2;

    // Heel — flatter ellipse, less dominant
    cx.beginPath(); cx.ellipse(50,68,24,11,0,0,Math.PI*2); cx.fill(); cx.stroke();
    // Main foot body — wider and shorter
    cx.beginPath();
    cx.moveTo(26,62);
    cx.bezierCurveTo(18,48,22,30,33,24);
    cx.bezierCurveTo(43,19,60,19,70,26);
    cx.bezierCurveTo(79,33,80,50,74,62);
    cx.bezierCurveTo(65,70,35,70,26,62);
    cx.fill(); cx.stroke();

    toeData.forEach((td,i) => {
      const off = toeWiggle[i];
      cx.beginPath(); cx.ellipse(td.x,td.y+off,td.rx,td.ry,-0.15+i*0.06,0,Math.PI*2);
      cx.fillStyle='#fff'; cx.fill(); cx.strokeStyle='#000'; cx.lineWidth=2; cx.stroke();
      cx.beginPath(); cx.ellipse(td.x,td.y+off-td.ry*0.28,td.rx*0.55,td.ry*0.32,-0.15+i*0.06,0,Math.PI*2);
      cx.fillStyle='#ddd'; cx.fill(); cx.strokeStyle='#aaa'; cx.lineWidth=0.8; cx.stroke();
      cx.strokeStyle='#000'; cx.lineWidth=2;
    });

    // Subtle foot lines
    cx.strokeStyle='rgba(0,0,0,0.10)'; cx.lineWidth=1.2;
    cx.beginPath(); cx.moveTo(33,48); cx.quadraticCurveTo(50,44,68,48); cx.stroke();
    cx.beginPath(); cx.moveTo(35,56); cx.quadraticCurveTo(50,53,66,56); cx.stroke();
    cx.restore();
  }

  function drawBack(scaleX=1) {
    cx.save();
    cx.translate(W/2,H/2); cx.scale(scaleX,1); cx.translate(-W/2,-H/2);
    cx.fillStyle='#000'; cx.strokeStyle='#000'; cx.lineWidth=2;
    cx.beginPath(); cx.ellipse(50,68,24,11,0,0,Math.PI*2); cx.fill();
    cx.beginPath();
    cx.moveTo(26,62);
    cx.bezierCurveTo(18,48,22,30,33,24);
    cx.bezierCurveTo(43,19,60,19,70,26);
    cx.bezierCurveTo(79,33,80,50,74,62);
    cx.bezierCurveTo(65,70,35,70,26,62);
    cx.fill();
    toeData.forEach(td => {
      cx.beginPath(); cx.ellipse(td.x,td.y,td.rx,td.ry,-0.15,0,Math.PI*2); cx.fill();
    });
    cx.restore();
  }

  function setWiggle(amt) {
    toePhase.forEach((p,i) => { toeWiggle[i] = Math.sin(wiggleT*3+p)*amt; });
  }

  function doFlipStep(towardBack, dt=1) {
    flipAngle = Math.min(1, flipAngle + 0.05*dt);
    const ease = flipAngle < 0.5
      ? 4*flipAngle*flipAngle*flipAngle
      : 1-Math.pow(-2*flipAngle+2,3)/2;
    const scaleX = Math.cos(ease*Math.PI);

    if(towardBack) {
      if(scaleX >= 0) { wiggleT+=0.12*dt; setWiggle(5*(1-ease*2)); drawFoot(scaleX); }
      else { cx.clearRect(0,0,W,H); cx.save(); cx.translate(W/2,H/2); cx.scale(-scaleX,1); cx.translate(-W/2,-H/2); cx.globalAlpha=footAlpha; drawBack(); cx.restore(); }
    } else {
      // flipping back to front — mirror the logic
      if(scaleX >= 0) { drawBack(scaleX); }
      else { cx.clearRect(0,0,W,H); cx.save(); cx.translate(W/2,H/2); cx.scale(-scaleX,1); cx.translate(-W/2,-H/2); cx.globalAlpha=footAlpha; drawFoot(); cx.restore(); }
    }

    return flipAngle >= 1;
  }

  const links = document.getElementById('foot-links');
  let flipBackTimer = null;

  let lastTs = null;
  // Loop pause/resume — avoids burning RAF cycles when tab is hidden
  let loopPaused = false;
  // Use module-level _footRafId so re-entry can cancel this loop
  function pauseLoop()  { loopPaused = true;  if(_footRafId) { cancelAnimationFrame(_footRafId); _footRafId = null; } }
  function resumeLoop() { if(!loopPaused) return; loopPaused = false; lastTs = null; _footRafId = requestAnimationFrame(loop); }

  // Pause when tab is hidden, resume when visible again
  document.addEventListener('visibilitychange', () => {
    document.hidden ? pauseLoop() : resumeLoop();
  });

  // Pause when canvas scrolls out of view
  if(typeof IntersectionObserver !== 'undefined') {
    new IntersectionObserver(([entry]) => {
      entry.isIntersecting ? resumeLoop() : pauseLoop();
    }, { threshold: 0 }).observe(fc);
  }

  function loop(ts) {
    // Cap delta to 50ms (1 frame at 20fps) to prevent catch-up bursts after pause
    const dt = lastTs ? Math.min((ts - lastTs) / (1000/60), 3) : 1;
    lastTs = ts;

    cx.clearRect(0,0,W,H);
    if(footAlpha < 1) footAlpha = Math.min(1, footAlpha + 0.04*dt);
    cx.globalAlpha = footAlpha;

    if(phase === 'idle') {
      nextIdleWiggle -= dt;
      if(nextIdleWiggle <= 0 && !idleWiggleActive) {
        idleWiggleActive = true; idleWiggleDuration = 0;
      }
      if(idleWiggleActive) {
        idleWiggleDuration += dt;
        wiggleT += 0.12*dt;
        setWiggle(5);
        if(idleWiggleDuration > 55) {
          idleWiggleActive = false;
          nextIdleWiggle = 180 + Math.random()*120;
          toeWiggle.fill(0);
        }
      } else {
        toeWiggle.forEach((_,i)=>{ toeWiggle[i]*=Math.pow(0.8,dt); });
      }
      drawFoot(1);
    }
    else if(phase === 'wiggle') {
      wiggleT += 0.12*dt;
      setWiggle(5);
      if(wiggleT > 9) { phase='flip-to-back'; flipAngle=0; wiggleT=0; }
      drawFoot(1);
    }
    else if(phase === 'flip-to-back') {
      const done = doFlipStep(true, dt);
      if(done) {
        phase = 'showing-back';
        if(links) links.classList.add('visible');
        if(!isHovered) scheduleFlipBack();
      }
    }
    else if(phase === 'showing-back') {
      cx.save(); cx.translate(W/2,H/2); cx.scale(-1,1); cx.translate(-W/2,-H/2);
      drawBack(); cx.restore();
    }
    else if(phase === 'flip-to-front') {
      const done = doFlipStep(false, dt);
      if(done) {
        phase = 'idle';
        flipAngle = 0; wiggleT = 0;
        toeWiggle.fill(0);
        nextIdleWiggle = 120;
        if(links) links.classList.remove('visible');
      }
    }

    cx.globalAlpha = 1;
    _footRafId = requestAnimationFrame(loop);
  }

  function scheduleFlipBack() {
    clearTimeout(flipBackTimer);
    flipBackTimer = setTimeout(() => {
      if(phase === 'showing-back' && !isHovered) {
        phase = 'flip-to-front'; flipAngle = 0;
      }
    }, 2500);
  }

  _footRafId = requestAnimationFrame(loop);

  fc.style.cursor = 'pointer';
  fc.addEventListener('mouseenter', () => {
    isHovered = true;
    clearTimeout(flipBackTimer);
    if(phase === 'idle') { phase='wiggle'; wiggleT=0; }
    else if(phase === 'flip-to-front') { phase='showing-back'; flipAngle=0; if(links) links.classList.add('visible'); }
  });
  fc.addEventListener('mouseleave', () => {
    isHovered = false;
    if(phase === 'showing-back') scheduleFlipBack();
  });
  fc.addEventListener('click', () => {
    if(phase === 'wiggle' || phase === 'idle') { phase='flip-to-back'; flipAngle=0; wiggleT=0; }
  });
  // Touch: tap to flip to back (shows links), tap again to flip back to front
  fc.addEventListener('touchstart', (e) => {
    e.preventDefault(); // prevent ghost click
    if(phase === 'idle' || phase === 'wiggle') {
      isHovered = true;
      clearTimeout(flipBackTimer);
      phase = 'flip-to-back'; flipAngle = 0; wiggleT = 0;
    } else if(phase === 'showing-back') {
      isHovered = false;
      scheduleFlipBack();
    } else if(phase === 'flip-to-front') {
      isHovered = true;
      clearTimeout(flipBackTimer);
      phase = 'showing-back'; flipAngle = 0;
      if(links) links.classList.add('visible');
    }
  }, { passive: false });
}
