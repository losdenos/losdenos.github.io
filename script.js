// ── CRACK LOADER ──
const crackCanvas = document.getElementById('crack-canvas');
const crackCtx = crackCanvas.getContext('2d');
function resizeCrack(){ crackCanvas.width=window.innerWidth; crackCanvas.height=window.innerHeight; }
resizeCrack();
window.addEventListener('resize', resizeCrack);

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
  const loader=document.getElementById('loader');
  crackCanvas.style.transition='opacity .5s'; crackCanvas.style.opacity='0';
  loader.style.transition='opacity .5s'; loader.style.opacity='0';
  setTimeout(()=>{crackCanvas.style.display='none';loader.style.display='none';showScene();},500);
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

function showScene(){
  const scene=document.getElementById('scene');
  scene.classList.add('visible');
  scaleKeyboard();
  window.addEventListener('resize', scaleKeyboard);
  initFoot();
  // Footer hidden until nav is ready
  const _ffi = document.getElementById('foot-footer');
  if(_ffi) _ffi.style.display = 'none';
  // Wire email copy button once
  const emailLink = document.getElementById('email-link');
  if(emailLink) {
    emailLink.style.cursor = 'pointer';
    emailLink.addEventListener('click', () => {
      const text = 'hi@losdenso.xyz';
      try {
        const el = document.createElement('textarea');
        el.value = text; el.style.position='fixed'; el.style.opacity='0';
        document.body.appendChild(el); el.focus(); el.select();
        document.execCommand('copy'); document.body.removeChild(el);
        const orig = emailLink.textContent;
        emailLink.textContent = '✓ Copied!';
        emailLink.style.background = '#000'; emailLink.style.color = '#fff';
        setTimeout(() => { emailLink.textContent = orig; emailLink.style.background=''; emailLink.style.color=''; }, 1800);
      } catch(err) {
        navigator.clipboard && navigator.clipboard.writeText(text).then(() => {
          emailLink.textContent = '✓ Copied!';
          setTimeout(() => { emailLink.textContent = '⌥ Email'; }, 1800);
        });
      }
    });
  }

  const keys=[];
  document.querySelectorAll('#keyboard-wrap .key').forEach((key,ki)=>{
    key.style.setProperty('--r',((Math.random()-.5)*40)+'deg');
    // Spread 46 keys across 580ms total (last key at ~580ms, showPressToStart at 700ms)
    keys.push({el:key, delay: Math.round((ki/46)*580 + Math.random()*30)});
  });
  keys.sort((a,b)=>a.delay-b.delay);
  keys.forEach(k=>setTimeout(()=>k.el.classList.add('appeared'),k.delay));
  setTimeout(showPressToStart, 700);
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
    setTimeout(()=>spaceKey.classList.remove('pressed'), 120);
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
    setTimeout(()=>enterKey.classList.remove('pressed'), 120);
    skipTyping = true;
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
const TARGET='Welcome to LosDenso';
let skipTyping = false;
function flashKey(ch, isSpace=false, isEnter=false){
  const k=document.querySelector(`#keyboard-wrap .key[data-char="${ch.toLowerCase()}"]`)
         ||document.querySelector('#keyboard-wrap .key[data-char=" "]');
  if(!k)return;
  k.classList.add('pressed');
  setTimeout(()=>k.classList.remove('pressed'),120);
  playKeyClick(isSpace, isEnter);
}
function startTyping(){
  const span=document.getElementById('typed-text'); let i=0;
  const enterKey=document.getElementById('enter-key');
  // Re-bind enter to skip mid-typing (doSkip in showPressToStart handles pre-start)
  if(enterKey) enterKey.addEventListener('click',()=>{
    skipTyping=true;
    enterKey.classList.add('pressed');
    setTimeout(()=>enterKey.classList.remove('pressed'),120);
    playKeyClick(false, true);
  });
  function next(){
    if(skipTyping){ span.textContent=TARGET; setTimeout(morphToNav,200); return; }
    if(i>=TARGET.length){setTimeout(morphToNav,900);return;}
    const ch=TARGET[i];
    span.textContent+=ch;
    flashKey(ch, ch===' ');
    i++;
    setTimeout(next,120+Math.random()*80);
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
  setTimeout(()=>kb.classList.add('hiding'),200);
  setTimeout(()=>{
    kb.style.display='none'; disp.style.display='none';
    nav.classList.add('visible');
    document.querySelectorAll('.nav-btn').forEach((btn,i)=>{
      btn.style.setProperty('--r',((Math.random()-.5)*30)+'deg');
      setTimeout(()=>btn.classList.add('appeared'),i*120+50);
    });
    setTimeout(playStartupChime, 400);
    setTimeout(bindNav,600);
    // Show footer now that nav is visible
    const ff = document.getElementById('foot-footer');
    if(ff) { ff.style.removeProperty('display'); ff.style.opacity='0'; setTimeout(()=>{ ff.style.transition='opacity 0.5s ease'; ff.style.opacity='1'; },50); }
  },700);
}
function _navHandler(page){ return function(){ playNavClick(); zoomPage(page); }; }
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
}

// ── ZOOM + TRUCK TRANSITION (canvas-drawn) ──
function zoomPage(page) {
  const btnId = page === 'about' ? 'btn-about' : page === 'projects' ? 'btn-projects' : 'btn-contact';
  const btn = document.getElementById(btnId);
  const others = ['btn-about','btn-projects','btn-contact'].filter(id=>id!==btnId);
  others.forEach(id=>document.getElementById(id).classList.add('fade-out'));

  const r = btn.getBoundingClientRect();
  const tx = window.innerWidth/2 - (r.left + r.width/2);
  const ty = window.innerHeight/2 - (r.top + r.height/2);

  btn.style.transition = 'transform 0.8s cubic-bezier(.4,0,.2,1), opacity 0.4s ease';
  btn.style.transform = `translate(${tx}px,${ty}px) scale(1.12)`;

  setTimeout(()=>{
    btn.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
    btn.style.transform = `translate(${tx}px,${ty}px) scale(0.9)`;
    btn.style.opacity = '0';
    setTimeout(()=>{ btn.style.display='none'; launchTruckCanvas(page); }, 300);
  }, 860);
}

function launchTruckCanvas(page='about') {
  const canvas = document.getElementById('truck-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';
  // Hide footer during truck animation
  const _ff = document.getElementById('foot-footer');
  if(_ff) { _ff.style.transition='opacity 0.3s ease'; _ff.style.opacity='0'; setTimeout(()=>{ _ff.style.display='none'; },300); }

  // Page content per section
  const pageContent = {
    about: `
      <div class="about-content">
        <h1>ABOUT ME</h1>
        <p>I am LosDenso, a creator of digital experiences.</p>
        <div class="placeholder-text">[ your detailed bio goes here ]</div>
      </div>`,
    projects: `
      <div class="about-content">
        <h1>PROJECTS</h1>
        <p>A collection of things I have built and shipped.</p>
        <div class="placeholder-text">[ your projects go here ]</div>
      </div>`,
    contact: `
      <div class="about-content">
        <h1>CONTACT</h1>
        <p>Let's build something together.</p>
        <div class="placeholder-text">[ your contact details go here ]</div>
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

  // Particles system
  const particles = [];
  function spawnDust(x, y, speed) {
    for(let i=0;i<3;i++) {
      particles.push({
        x, y: y + (Math.random()-0.5)*6,
        vx: -(1.5+Math.random()*2) * speed,
        vy: -(0.5+Math.random()*1.5),
        life: 1, decay: 0.025+Math.random()*0.02,
        r: 4+Math.random()*8
      });
    }
  }

  // Screen shake state
  let shakeX=0, shakeY=0, shakeDecay=0;
  function triggerShake(magnitude) {
    shakeX = (Math.random()-0.5)*magnitude;
    shakeY = (Math.random()-0.5)*magnitude;
    shakeDecay = magnitude;
  }

  // Rope physics points (simple verlet chain)
  const ROPE_SEGS = 12;
  let ropePoints = [];
  function initRope(ax,ay,bx,by) {
    ropePoints = [];
    for(let i=0;i<=ROPE_SEGS;i++) {
      const t=i/ROPE_SEGS;
      ropePoints.push({ x:ax+(bx-ax)*t, y:ay+(by-ay)*t, px:ax+(bx-ax)*t, py:ay+(by-ay)*t, pinned:(i===0||i===ROPE_SEGS) });
    }
  }
  function updateRope(ax,ay,bx,by) {
    ropePoints[0].x=ax; ropePoints[0].y=ay;
    ropePoints[ROPE_SEGS].x=bx; ropePoints[ROPE_SEGS].y=by;
    for(let iter=0;iter<4;iter++) {
      for(let i=0;i<ROPE_SEGS;i++) {
        const a=ropePoints[i], b=ropePoints[i+1];
        const dx=b.x-a.x, dy=b.y-a.y;
        const dist=Math.sqrt(dx*dx+dy*dy)||1;
        const targetLen=20, diff=(dist-targetLen)/dist*0.5;
        if(!a.pinned){a.x+=dx*diff;a.y+=dy*diff;}
        if(!b.pinned){b.x-=dx*diff;b.y-=dy*diff;}
      }
    }
    for(let i=1;i<ROPE_SEGS;i++) {
      const p=ropePoints[i];
      const vx=p.x-p.px, vy=p.y-p.py;
      p.px=p.x; p.py=p.y;
      p.x+=vx*0.85; p.y+=vy*0.85+0.25; // gravity
    }
    ropePoints[0].x=ax; ropePoints[0].y=ay;
    ropePoints[ROPE_SEGS].x=bx; ropePoints[ROPE_SEGS].y=by;
  }

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

  function drawRope() {
    if(ropePoints.length<2) return;
    ctx.save();
    ctx.strokeStyle='#000'; ctx.lineWidth=2.5; ctx.lineCap='round';
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(ropePoints[0].x, ropePoints[0].y);
    for(let i=1;i<=ROPE_SEGS;i++){
      ctx.lineTo(ropePoints[i].x, ropePoints[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawParticles() {
    particles.forEach(p=>{
      ctx.save();
      ctx.globalAlpha=p.life*0.4;
      ctx.fillStyle='#888';
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      ctx.restore();
    });
  }

  // Animation state
  const duration = 2200;
  let startTime = null;
  let phase = 'rev'; // rev → drive
  let revDuration = 600;
  let revStart = null;
  let hasShaken = false;

  // Rope anchor points
  const ropeStartX = startX; // left edge of trailer
  const ropeStartY = groundY - truckH + 40;
  initRope(ropeStartX, ropeStartY, 0, ropeStartY);

  function easeInOutCubic(t){ return t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2; }
  function easeInQuart(t){ return t*t*t*t; }

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
      if(!revStart) revStart=ts;
      const rp=Math.min((ts-revStart)/revDuration,1);
      const lurch = Math.sin(rp*Math.PI)*8;
      truckX = startX - lurch;
      speed = lurch*0.2;

      if(rp>=1){ phase='drive'; startTime=ts; triggerShake(12); }
    } else {
      // Drive phase
      const p = Math.min(elapsed/duration,1);
      const ease = easeInOutCubic(p);
      truckX = startX + (targetX-startX)*ease;
      speed = (targetX-startX)/duration * 60;

      // Reveal page: starts after truck has moved a bit
      const revealEdge = Math.max(0, truckX - 60);
      aboutPage.style.clipPath=`inset(0 ${Math.max(0,W-revealEdge)}px 0 0)`;

      // Shake on snap
      if(!hasShaken && p>0.08){ hasShaken=true; triggerShake(7); }

      // Spawn dust under rear wheels
      if(p<0.95 && Math.random()<0.4) {
        spawnDust(truckX+22, groundY+12, Math.min(p*3+0.5,2));
      }

      if(p>=1) {
        aboutPage.style.clipPath='none';
        canvas.style.display='none';
        document.getElementById('scene').style.display='none';
        // Trigger entrance animations on about content
        const content = aboutPage.querySelector('.about-content');
        if(content) requestAnimationFrame(()=>content.classList.add('animate'));
        // Show "click to go back" tooltip then wire up back navigation
        setTimeout(()=>initBackToNav(aboutPage), 900);
        // Restore footer above the content page
        const _ff2 = document.getElementById('foot-footer');
        if(_ff2) { _ff2.style.display=''; _ff2.style.opacity='0'; setTimeout(()=>{ _ff2.style.transition='opacity 0.5s ease'; _ff2.style.opacity='1'; },100); }
        ctx.restore();
        return;
      }
    }

    // Update particles
    for(let i=particles.length-1;i>=0;i--){
      const p2=particles[i];
      p2.x+=p2.vx; p2.y+=p2.vy; p2.vy+=0.06;
      p2.life-=p2.decay; p2.r*=0.97;
      if(p2.life<=0) particles.splice(i,1);
    }

    // Rope: from left edge of page to rear of trailer
    const ropePageX = Math.max(0, truckX - 60);
    const ropePageY = groundY - 30;
    const ropeTruckX = truckX + 2;
    const ropeTruckY = groundY - truckH + 38;
    updateRope(ropeTruckX, ropeTruckY, ropePageX, ropePageY);

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

    drawParticles();
    drawRope();
    drawTruck(truckX, groundY-truckH, speed);

    ctx.restore();
    requestAnimationFrame(frame);
  }

  // Small rev delay to let button fade out
  setTimeout(()=>requestAnimationFrame(frame), 100);
}


// ── BACK TO NAV ──
function initBackToNav(pageEl) {
  // Create tooltip
  const tip = document.createElement('div');
  tip.id = 'back-tooltip';
  tip.textContent = 'Click anywhere to go back';
  document.body.appendChild(tip);

  // Follow mouse
  function onMove(e) {
    tip.style.left = e.clientX + 'px';
    tip.style.top  = e.clientY + 'px';
  }
  document.addEventListener('mousemove', onMove);

  // Show it
  requestAnimationFrame(()=>tip.classList.add('visible'));

  // Fade out after 3s
  const fadeTimer = setTimeout(()=>{
    tip.classList.remove('visible');
    tip.classList.add('fade-out');
  }, 3000);

  // Click anywhere = go back
  function goBack() {
    clearTimeout(fadeTimer);
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('click', goBack);
    tip.remove();

    // Fade out the page and footer together
    pageEl.style.transition = 'opacity 0.4s ease';
    pageEl.style.opacity = '0';
    const _ffb = document.getElementById('foot-footer');
    if(_ffb) { _ffb.style.transition='opacity 0.3s ease'; _ffb.style.opacity='0'; }
    setTimeout(()=>{
      pageEl.remove();

      // Restore scene (it was hidden via display:none)
      const scene = document.getElementById('scene');
      scene.style.removeProperty('display');
      // scene already has .visible class from before — just make sure
      scene.classList.add('visible');

      // Reset all nav buttons — clear all inline styles cleanly
      const nav = document.getElementById('nav-wrap');
      document.querySelectorAll('.nav-btn').forEach(btn=>{
        btn.classList.remove('fade-out', 'appeared');
        // Remove only transform/opacity/display inline styles, not --r
        btn.style.removeProperty('transform');
        btn.style.removeProperty('opacity');
        btn.style.removeProperty('display');
        btn.style.removeProperty('transition');
      });

      // Hide nav without fighting CSS class transitions
      nav.style.opacity = '0';
      nav.style.pointerEvents = 'none';
      nav.classList.add('visible'); // keep it in flow, just invisible via inline

      // Small frame delay then pop buttons in
      requestAnimationFrame(()=>{
        nav.style.removeProperty('opacity');
        nav.style.removeProperty('pointer-events');
        document.querySelectorAll('.nav-btn').forEach((btn,i)=>{
          btn.style.setProperty('--r', ((Math.random()-.5)*20)+'deg');
          setTimeout(()=>btn.classList.add('appeared'), i*100+50);
        });
        setTimeout(bindNav, 400);
        // Fade footer back in with nav
        const _ffr = document.getElementById('foot-footer');
        if(_ffr) { _ffr.style.display=''; setTimeout(()=>{ _ffr.style.transition='opacity 0.5s ease'; _ffr.style.opacity='1'; },200); }
      });
    }, 400);
  }

  // Small delay so the page-reveal click doesn't immediately trigger goBack
  setTimeout(()=>document.addEventListener('click', goBack), 600);
}

// ── FOOT FOOTER ──
function initFoot() {
  const fc = document.getElementById('foot-canvas');
  if(!fc) return;
  const cx = fc.getContext('2d');
  const W = fc.width, H = fc.height;

  // phases: idle | wiggle | flip-to-back | showing-back | flip-to-front
  let phase = 'idle';
  let flipAngle = 0;
  let wiggleT = 0;
  let footAlpha = 0;
  let isHovered = false;
  let idleWiggleT = 0;        // runs always in idle for periodic wiggles
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

  function loop(ts) {
    // Cap delta to 50ms (1 frame at 20fps) to prevent catch-up bursts
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
    requestAnimationFrame(loop);
  }

  function scheduleFlipBack() {
    clearTimeout(flipBackTimer);
    flipBackTimer = setTimeout(() => {
      if(phase === 'showing-back' && !isHovered) {
        phase = 'flip-to-front'; flipAngle = 0;
      }
    }, 2500);
  }

  loop();

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
}
