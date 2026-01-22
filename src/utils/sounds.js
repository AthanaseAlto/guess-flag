const SOUNDS = {
  correct: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  wrong: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  start: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  finish: 'https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3',
};

class SoundManager {
  constructor() {
    this.audioCache = {};
    this.enabled = true;
    this.loadPreference();
  }

  loadPreference() {
    if (typeof localStorage === 'undefined') return;
    const stored = localStorage.getItem('soundEnabled');
    if (stored === null) return;
    this.enabled = stored === 'true';
  }

  play(soundName) {
    if (!this.enabled) return;

    if (!this.audioCache[soundName]) {
      this.audioCache[soundName] = new Audio(SOUNDS[soundName]);
    }

    const audio = this.audioCache[soundName];
    audio.currentTime = 0;
    audio.play().catch((e) => console.log('Audio play failed:', e));
  }

  setEnabled(value) {
    this.enabled = value;
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem('soundEnabled', String(value));
  }

  toggle() {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  getEnabled() {
    return this.enabled;
  }
}

export const soundManager = new SoundManager();
