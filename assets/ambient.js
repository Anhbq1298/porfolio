(() => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'ambient-toggle';
  button.setAttribute('aria-pressed', 'false');
  button.setAttribute('aria-label', 'Play ambient background music');
  button.title = 'Ambient music (off)';
  button.innerHTML = '<span class="ambient-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="ambient-label">Ambient</span>';
  document.body.append(button);

  const NOTES = { C3: 130.81, E3: 164.81, G3: 196, A3: 220, B3: 246.94, C4: 261.63, D4: 293.66, E4: 329.63, F3: 174.61, G4: 392, A2: 110, F2: 87.31, G2: 98 };
  const CHORDS = [
    ['C3', 'G3', 'E4', 'B3', 'D4'],   // Cmaj9
    ['A2', 'E3', 'G3', 'C4', 'B3'],   // Am9
    ['F2', 'C3', 'A3', 'E4', 'G3'],   // Fmaj9
    ['G2', 'D4', 'B3', 'E4', 'C4'],   // G6/9
  ];
  const STEP = 9; // seconds per chord

  let ctx, master, filter, timer, voices = [], index = 0, playing = false, started = false;

  function build() {
    ctx = new AudioCtx();
    master = ctx.createGain();
    master.gain.value = 0;

    filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1100;
    filter.Q.value = 0.4;

    // simple feedback delay for a soft, spacious tail
    const delay = ctx.createDelay(1.5);
    delay.delayTime.value = 0.43;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.42;
    const wet = ctx.createGain();
    wet.gain.value = 0.5;
    filter.connect(master);
    filter.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(master);
    master.connect(ctx.destination);

    // slow filter movement
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.05;
    lfoGain.gain.value = 350;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    // very quiet soft noise bed (the "white" in white music)
    const length = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.099046;
      b1 = 0.963 * b1 + white * 0.2965164;
      b2 = 0.57 * b2 + white * 1.0526913;
      data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.12;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 700;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.35;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noise.start();
  }

  function playChord(names) {
    const now = ctx.currentTime;
    const old = voices;
    voices = names.map((name, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 ? 'sine' : 'triangle';
      osc.frequency.value = NOTES[name];
      osc.detune.value = (Math.random() - 0.5) * 10;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.11 / names.length * 2, now + 3.5);
      gain.gain.linearRampToValueAtTime(0.0001, now + STEP + 3);
      osc.connect(gain);
      gain.connect(filter);
      osc.start(now);
      osc.stop(now + STEP + 3.2);
      return osc;
    });
    old.length = 0;
  }

  function loop() {
    playChord(CHORDS[index % CHORDS.length]);
    index += 1;
    timer = setTimeout(loop, STEP * 1000);
  }

  async function start() {
    if (!started) { build(); started = true; }
    await ctx.resume();
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 3);
    loop();
    playing = true;
  }

  function stop() {
    clearTimeout(timer);
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0, now + 1.2);
    setTimeout(() => { if (!playing) ctx.suspend(); }, 1400);
    playing = false;
  }

  button.addEventListener('click', async () => {
    if (playing) stop(); else await start();
    button.setAttribute('aria-pressed', String(playing));
    button.setAttribute('aria-label', playing ? 'Pause ambient background music' : 'Play ambient background music');
    button.title = 'Ambient music (' + (playing ? 'on' : 'off') + ')';
    button.classList.toggle('is-on', playing);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && playing) { stop(); button.setAttribute('aria-pressed', 'false'); button.classList.remove('is-on'); }
  });
})();
