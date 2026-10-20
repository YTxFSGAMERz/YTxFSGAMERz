/* ============================================
   FARHAN SHAIKH PORTFOLIO — JAVASCRIPT ENGINE
   Smooth Scroll, GSAP Animations, Particles,
   Custom Cursor, Scroll Effects
   ============================================ */

// ====== FORCE INITIAL SCROLL POSITION TO TOP (HERO SECTION) ======
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Clear any accidental URL hash on fresh startup so page never jumps
if (window.location.hash) {
    try {
        history.replaceState(null, null, window.location.pathname);
    } catch(e) {}
    window.scrollTo(0, 0);
}

window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

// ====== DYNAMIC TAB FAVICON (RED CHAKRI SYMBOL) ======
(function setFavicon() {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
        link = document.createElement('link');
        link.type = 'image/png';
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = 'images/farhan-symbol.png';
})();

// ====== GLOBAL SCI-FI SOUND FX & AUDIO UNLOCK ENGINE ======
let audioCtx = null;
let sfxEnabled = true;
let hasAudioPlayedSuccessfully = false;
let initialAudioBlocked = false;

// Preload high-impact sound files
const sfxWhooshAudio = new Audio('media/whoosh.wav');
const sfxSlashAudio = new Audio('media/slash.wav');
const sfxDockAudio = new Audio('media/dock.wav');
const sfxClickAudio = new Audio('media/hacker_best_01_cyber_click.wav');
const sfxHoverAudio = new Audio('media/hacker_best_06_neural_glitch.wav');

sfxWhooshAudio.preload = 'auto';
sfxSlashAudio.preload = 'auto';
sfxDockAudio.preload = 'auto';
sfxClickAudio.preload = 'auto';
sfxHoverAudio.preload = 'auto';

function unlockAudio() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
    }
}

// ====== BACKGROUND SOUNDTRACK ENGINE (MIST INSTRUMENTAL CYBER AMBIENT) ======
const TARGET_BG_MUSIC_VOLUME = 0.65; // High-fidelity boosted cyber ambient level
let isBgMusicPlaying = false;
let bgMusicFadeTimer = null;

function playBackgroundMusic(fade = true) {
    if (!sfxEnabled) return;
    const bgAudio = document.getElementById('bgMusicAudio');
    if (!bgAudio) return;

    bgAudio.loop = true;

    // If already playing smoothly, do not interrupt or restart
    if (isBgMusicPlaying && !bgAudio.paused) {
        return;
    }

    if (fade) {
        bgAudio.volume = 0;
    } else {
        bgAudio.volume = TARGET_BG_MUSIC_VOLUME;
    }

    try {
        const promise = bgAudio.play();
        if (promise !== undefined) {
            promise.then(() => {
                isBgMusicPlaying = true;
                if (fade) {
                    if (bgMusicFadeTimer) clearInterval(bgMusicFadeTimer);
                    let vol = 0;
                    const step = 0.05;
                    bgMusicFadeTimer = setInterval(() => {
                        vol += step;
                        if (vol >= TARGET_BG_MUSIC_VOLUME) {
                            vol = TARGET_BG_MUSIC_VOLUME;
                            clearInterval(bgMusicFadeTimer);
                            bgMusicFadeTimer = null;
                        }
                        bgAudio.volume = vol;
                    }, 40);
                }
            }).catch(() => {
                // If browser autoplay policy blocked unmuted sound on initial page load,
                // start playing instantly on the very first gesture (click, tap, keypress, or touching preloader)
                const onFirstPlayGesture = () => {
                    if (sfxEnabled && (!isBgMusicPlaying || bgAudio.paused)) {
                        bgAudio.volume = TARGET_BG_MUSIC_VOLUME;
                        bgAudio.play().then(() => {
                            isBgMusicPlaying = true;
                        }).catch(() => {});
                    }
                    window.removeEventListener('pointerdown', onFirstPlayGesture);
                    window.removeEventListener('mousedown', onFirstPlayGesture);
                    window.removeEventListener('click', onFirstPlayGesture);
                    window.removeEventListener('keydown', onFirstPlayGesture);
                    window.removeEventListener('touchstart', onFirstPlayGesture);
                };
                window.addEventListener('pointerdown', onFirstPlayGesture, { once: true, passive: true });
                window.addEventListener('mousedown', onFirstPlayGesture, { once: true, passive: true });
                window.addEventListener('click', onFirstPlayGesture, { once: true, passive: true });
                window.addEventListener('keydown', onFirstPlayGesture, { once: true, passive: true });
                window.addEventListener('touchstart', onFirstPlayGesture, { once: true, passive: true });
            });
        }
    } catch(err) {}
}

function pauseBackgroundMusic() {
    const bgAudio = document.getElementById('bgMusicAudio');
    if (bgAudio) {
        if (bgMusicFadeTimer) {
            clearInterval(bgMusicFadeTimer);
            bgMusicFadeTimer = null;
        }
        bgAudio.pause();
        isBgMusicPlaying = false;
    }
}

function toggleBackgroundMusic(enabled) {
    if (enabled) {
        playBackgroundMusic(false);
    } else {
        pauseBackgroundMusic();
    }
}

// First genuine user gesture handler
function onFirstUserGesture() {
    unlockAudio();
    if (sfxEnabled && !isBgMusicPlaying) {
        playBackgroundMusic(false);
    }

    // If initial auto-launch sound was blocked by browser autoplay policy:
    if (initialAudioBlocked && !hasAudioPlayedSuccessfully) {
        initialAudioBlocked = false;
        hasAudioPlayedSuccessfully = true;
        // Re-launch weapon sequence with full audio on first interaction
        setTimeout(() => {
            if (typeof launchBoomerangChakri === 'function') {
                launchBoomerangChakri(true);
            }
        }, 60);
    }
}

// Listen for genuine user activation events immediately
['pointerdown', 'mousedown', 'keydown', 'touchstart', 'click'].forEach(evt => {
    window.addEventListener(evt, onFirstUserGesture, { passive: true });
});

// Also listen on preloader element directly as soon as possible
document.addEventListener('DOMContentLoaded', () => {
    const preloaderEl = document.getElementById('preloader');
    if (preloaderEl) {
        ['pointerdown', 'mousedown', 'touchstart', 'click'].forEach(evt => {
            preloaderEl.addEventListener(evt, onFirstUserGesture, { passive: true });
        });
    }
});

// Try immediate startup unlock & music play as soon as script runs
try {
    unlockAudio();
    playBackgroundMusic(true);
} catch(e) {}

// ====== 4K FARHAN CYBER-LAPTOP LIVE RECON & DOLLY ZOOM ENGINE ======
(function initReconPreloader() {
    let preloaderCompleted = false;
    let hasInitiatedHacking = false;

    const preloader = document.getElementById('preloader');
    const stage = document.getElementById('laptopCinemaStage');
    const flash = document.getElementById('preloaderZoomFlash');
    const enterBtn = document.getElementById('preloaderEnterBtn');
    const enterBtnWrapper = document.getElementById('preloaderEnterBtnWrapper');

    // Audio SFX Triggers
    function playSfx(id, vol = 0.3) {
        try {
            if (typeof unlockAudio === 'function') unlockAudio();
            const el = document.getElementById(id);
            if (el) {
                const clone = el.cloneNode();
                clone.volume = Math.min(1, Math.max(0, vol));
                clone.muted = false;
                clone.play().catch(() => {});
            }
        } catch(e) {}
    }

    function playTerminalPing() {
        playSfx('sfxClick', 0.3);
    }

    function playAccessGrantedSound() {
        playSfx('sfxAccessGranted', 0.95);
    }

    // Hollywood Camera Dolly Zoom Fly-Through Execution
    function finishPreloader() {
        if (preloaderCompleted) return;
        preloaderCompleted = true;

        const kaliAccessVal = document.getElementById('kaliAccessVal');
        if (kaliAccessVal) {
            kaliAccessVal.textContent = 'GRANTED [ROOT #]';
            kaliAccessVal.className = 'k-val green-blink';
        }

        playAccessGrantedSound();

        // 1. Kick off Hollywood 3D Forward Dolly Zoom deep into the laptop display!
        if (stage) {
            stage.classList.add('is-zooming');
        }

        // 2. High-energy flash sweep at peak zoom penetration
        setTimeout(() => {
            if (flash) flash.classList.add('active');
        }, 400);

        // 3. Smooth seamless reveal into portfolio hero section
        setTimeout(() => {
            window.scrollTo(0, 0);
            if (preloader) {
                preloader.classList.add('hidden');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }
            if (typeof initAnimations === 'function') initAnimations();
            window.scrollTo(0, 0);
            if (typeof lenis !== 'undefined' && lenis) {
                lenis.scrollTo(0, { immediate: true });
            }
            if (typeof playBackgroundMusic === 'function' && !isBgMusicPlaying) {
                playBackgroundMusic(true);
            }
        }, 580);
    }
    window.finishPreloader = finishPreloader;

    // Triggered strictly upon user action (Click / Tap / Enter)
    function initiateHackingAndEnter() {
        if (preloaderCompleted) return;
        if (hasInitiatedHacking) {
            // Second click/press fast-tracks into portfolio
            finishPreloader();
            return;
        }
        hasInitiatedHacking = true;

        // 1. Legally Unlock Audio via user gesture & ensure song is playing immediately
        if (typeof unlockAudio === 'function') unlockAudio();
        if (typeof onFirstUserGesture === 'function') onFirstUserGesture();
        if (typeof playBackgroundMusic === 'function' && !isBgMusicPlaying) {
            playBackgroundMusic(false);
        }

        // 2. Tactile 3D Keypress Depression Animation & SFX
        if (enterBtn) {
            enterBtn.classList.add('is-pressed');
        }
        playSfx('sfxKeypress', 0.95);
        playSfx('sfxClick', 0.45);
        playSfx('sfxHover', 0.5);

        // Smoothly fade out switch assembly after mechanical bottom-out
        setTimeout(() => {
            if (enterBtnWrapper) {
                enterBtnWrapper.classList.remove('visible');
                enterBtnWrapper.classList.add('fade-out');
            }
            if (enterBtn) {
                enterBtn.classList.remove('visible');
                enterBtn.classList.add('fade-out');
            }
        }, 160);

        // Update BIOS subtitle to indicate booting has started
        const biosBrandSub = document.getElementById('biosBrandSub');
        if (biosBrandSub) {
            biosBrandSub.textContent = 'AUTHORIZING • BOOTING KALI LINUX...';
        }

        // 3. Run authentic BIOS splash & Kali Linux terminal boot sequence on the laptop screen
        runKaliTerminalSequence();
    }

    // User interaction listeners: Button, Screen Tap, or Enter/Space Key
    if (enterBtn) {
        enterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            initiateHackingAndEnter();
        });
        enterBtn.addEventListener('touchend', (e) => {
            e.stopPropagation();
            initiateHackingAndEnter();
        });
    }

    if (preloader) {
        preloader.addEventListener('click', () => {
            initiateHackingAndEnter();
        });
        preloader.addEventListener('touchend', () => {
            initiateHackingAndEnter();
        });
    }

    window.addEventListener('keydown', (e) => {
        if (!preloaderCompleted && (e.key === 'Enter' || e.key === ' ' || e.code === 'Space')) {
            if (enterBtn) enterBtn.classList.add('is-pressed');
            initiateHackingAndEnter();
        }
    });

    // 100% Real Browser & Hardware Telemetry Extractor
    async function extractLiveTelemetry() {
        const data = {
            os: 'LINUX / UNIX OS',
            device: 'CYBER WORKSTATION',
            battery: 'AC_GRID [CHARGING]',
            gpu: 'HARDWARE ACCELERATOR',
            cores: navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} CORES` : 'MULTI-CORE CPU',
            ram: navigator.deviceMemory ? `${navigator.deviceMemory} GB RAM` : 'SYSTEM MEMORY',
            location: 'TRIANGULATING...',
            isp: 'HIGH-SPEED CARRIER',
            ip: '192.168.1.109'
        };

        const ua = navigator.userAgent;

        // Try modern User-Agent Client Hints first (Chrome / Android / Edge)
        let brandModel = '';
        if (navigator.userAgentData && typeof navigator.userAgentData.getHighEntropyValues === 'function') {
            try {
                const hints = await Promise.race([
                    navigator.userAgentData.getHighEntropyValues(['model', 'platform', 'platformVersion']),
                    new Promise(res => setTimeout(() => res(null), 250))
                ]);
                if (hints && hints.model) {
                    brandModel = hints.model.trim();
                }
            } catch(e) {}
        }

        // OS & Phone / Hardware Model Detection
        if (/Android/i.test(ua)) {
            const androidVer = (ua.match(/Android\s([0-9.]+)/i) || [])[1] || '';
            data.os = `ANDROID ${androidVer}`.trim();

            if (brandModel) {
                data.device = brandModel.toUpperCase();
            } else if (/Redmi|POCO|Xiaomi|MI\s/i.test(ua)) {
                const m = ua.match(/(?:Redmi|POCO|Xiaomi|MI)[\s_-]?([A-Za-z0-9\s_-]+?)(?:Build|\/|\)|;)/i);
                data.device = m ? m[0].replace(/\s*Build.*$/i, '').replace(/[;)]/g, '').trim().toUpperCase() : 'XIAOMI / REDMI DEVICE';
            } else if (/SM-[A-Z0-9]+|Samsung/i.test(ua)) {
                const m = ua.match(/(?:SM-[A-Za-z0-9]+|Samsung[\s_-]?[A-Za-z0-9]+)/i);
                data.device = m ? m[0].trim().toUpperCase() : 'SAMSUNG GALAXY';
            } else if (/OnePlus|ONEPLUS/i.test(ua)) {
                data.device = 'ONEPLUS SMARTPHONE';
            } else if (/Pixel/i.test(ua)) {
                const m = ua.match(/Pixel\s[0-9a-zA-Z\s]+/i);
                data.device = m ? m[0].trim().toUpperCase() : 'GOOGLE PIXEL';
            } else if (/Vivo|V\d{4}/i.test(ua)) {
                data.device = 'VIVO SMARTPHONE';
            } else if (/OPPO|CPH\d{4}/i.test(ua)) {
                data.device = 'OPPO SMARTPHONE';
            } else if (/Realme|RMX\d{4}/i.test(ua)) {
                data.device = 'REALME SMARTPHONE';
            } else {
                data.device = 'ANDROID SMARTPHONE';
            }
        } else if (/iPhone|iPad|iPod/i.test(ua)) {
            data.os = 'APPLE iOS';
            data.device = /iPad/i.test(ua) ? 'APPLE iPAD' : 'APPLE iPHONE';
        } else if (/Windows NT 10.0/i.test(ua)) {
            data.os = 'WINDOWS 11 / 10';
            data.device = 'x64 PC WORKSTATION';
        } else if (/Windows/i.test(ua)) {
            data.os = 'WINDOWS OS';
            data.device = 'PC WORKSTATION';
        } else if (/Macintosh|Mac OS X/i.test(ua)) {
            data.os = 'APPLE macOS';
            data.device = 'MAC WORKSTATION';
        } else if (/Linux/i.test(ua)) {
            data.os = 'LINUX OS';
            data.device = 'LINUX WORKSTATION';
        }

        // Live Battery API (100% Real)
        try {
            if ('getBattery' in navigator) {
                const battery = await Promise.race([
                    navigator.getBattery(),
                    new Promise(res => setTimeout(() => res(null), 250))
                ]);
                if (battery) {
                    const pct = Math.round(battery.level * 100);
                    const state = battery.charging ? '⚡' : 'BAT';
                    data.battery = `${pct}% [${state}]`;
                }
            }
        } catch(e) {}

        // WebGL GPU Renderer (100% Real)
        try {
            const c = document.createElement('canvas');
            const gl = c.getContext('webgl', { powerPreference: 'high-performance' }) || c.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    let renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
                    renderer = renderer
                        .replace(/ANGLE \((.+?), (.+?), .+\)/, '$2')
                        .replace(/ANGLE \((.+?), (.+?)\)/, '$2')
                        .replace(/Direct3D11 vs_[0-9_]+ ps_[0-9_]+/, '')
                        .replace(/vs_[0-9_]+ ps_[0-9_]+/, '')
                        .trim();
                    if (renderer) data.gpu = renderer.toUpperCase();
                }
            }
        } catch(e) {}

        // Real IP & Geolocation (Instant timezone heuristic + non-aborting online fetch)
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'ASIA/KOLKATA';
            const parts = tz.split('/');
            const regionName = (parts[1] || parts[0]).replace(/_/g, ' ').toUpperCase();
            data.location = `${regionName} [${tz.toUpperCase()}]`;
            data.isp = 'LOCAL SECURE NODE';
        } catch(e) {
            data.location = 'GLOBAL NODE // ASIA';
            data.isp = 'ENCRYPTED ROUTE';
        }

        const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
        if (!isLocalHost && navigator.onLine) {
            try {
                const res = await Promise.race([
                    fetch('https://ipapi.co/json/').catch(() => null),
                    new Promise(res => setTimeout(() => res(null), 800))
                ]);

                if (res && res.ok) {
                    const geo = await res.json();
                    if (geo.ip) data.ip = geo.ip;
                    const city = (geo.city || '').toUpperCase();
                    const country = (geo.country_name || geo.country || '').toUpperCase();
                    const org = (geo.org || geo.asn || '').replace(/^AS\d+\s*/i, '').replace(/\[.*\]/g, '').trim().toUpperCase();

                    if (city || country) {
                        data.location = `${city ? city + ', ' : ''}${country}`;
                        data.isp = org ? org.slice(0, 18) : 'BROADBAND CARRIER';
                    }
                }
            } catch(e) {}
        }

        return data;
    }



    // Initial Laptop Cinematic Entry: Docks at center and waits on Standby
    function setupLaptopDocking() {
        if (setupLaptopDocking.done) return;
        setupLaptopDocking.done = true;

        // Guarantee custom cursor is active immediately
        if (typeof initCursor === 'function') {
            initCursor();
        }

        // Immediately trigger background music playback on page render/docking
        if (typeof playBackgroundMusic === 'function' && !isBgMusicPlaying) {
            playBackgroundMusic(true);
        }

        // 1. Kick off Cinematic Slide-In Entry (immediate frame)
        requestAnimationFrame(() => {
            if (stage) {
                stage.classList.remove('is-entering');
                stage.classList.add('is-docked');
            }
        });

        // 2. Tactile Keyboard RGB Flare (T=260ms)
        setTimeout(() => {
            const rgbSurge = document.getElementById('keyboardRgbSurge');
            if (rgbSurge) rgbSurge.classList.add('ignited');
        }, 260);

        // 3. Ensure laptop screen CRT & viewport is powered on and displaying the standby BIOS screen
        const viewport = document.getElementById('laptopScreenViewport');
        const powerLine = document.getElementById('screenPowerLine');
        const wakeFlash = document.getElementById('screenWakeFlash');
        const crtFlicker = document.getElementById('screenCrtFlicker');

        if (powerLine) powerLine.classList.add('active');
        if (wakeFlash) wakeFlash.classList.add('active');
        if (crtFlicker) crtFlicker.classList.add('active');

        if (viewport) {
            viewport.classList.remove('is-sleeping');
            viewport.classList.add('is-waking');
        }

        // Ensure BIOS stage is displayed on standby and Kali window is hidden
        const biosStage = document.getElementById('biosBootStage');
        const kaliWindow = document.getElementById('kaliTerminalWindow');
        const biosLoaderBar = document.getElementById('biosLoaderBar');
        if (biosStage) {
            biosStage.style.display = 'flex';
            biosStage.classList.remove('fade-out');
        }
        if (biosLoaderBar) {
            biosLoaderBar.style.width = '0%';
        }
        if (kaliWindow) {
            kaliWindow.style.display = 'none';
        }

        // 4. Reveal the 3D Mechanical Enter Keycap Trigger: "CLICK HERE TO ENTER" immediately
        setTimeout(() => {
            if (!hasInitiatedHacking) {
                if (enterBtnWrapper) enterBtnWrapper.classList.add('visible');
                if (enterBtn) enterBtn.classList.add('visible');
            }
        }, 60);
    }

    // Authentic Kali Linux Terminal CLI Boot & System Recon Sequence
    async function runKaliTerminalSequence() {
        // Start extracting real telemetry immediately in background
        const telemetryPromise = extractLiveTelemetry();

        const biosStage = document.getElementById('biosBootStage');
        const biosLoaderBar = document.getElementById('biosLoaderBar');
        const kaliWindow = document.getElementById('kaliTerminalWindow');
        const kaliTypedText = document.getElementById('kaliTypedText');
        const kaliCursor = document.getElementById('kaliCursor');
        const kaliTelemetryBlock = document.getElementById('kaliTelemetryBlock');
        const kaliDeviceVal = document.getElementById('kaliDeviceVal');
        const kaliBatteryVal = document.getElementById('kaliBatteryVal');
        const kaliIpVal = document.getElementById('kaliIpVal');
        const kaliLocationVal = document.getElementById('kaliLocationVal');
        const kaliAccessVal = document.getElementById('kaliAccessVal');

        // Initial state: Show BIOS Brand Splash, ensure Kali Terminal is hidden
        if (biosStage) {
            biosStage.style.display = 'flex';
            biosStage.classList.remove('fade-out');
        }
        if (biosLoaderBar) {
            biosLoaderBar.style.width = '0%';
        }
        if (kaliWindow) {
            kaliWindow.style.display = 'none';
        }
        if (kaliTypedText) {
            kaliTypedText.textContent = '';
        }
        if (kaliTelemetryBlock) {
            kaliTelemetryBlock.style.display = 'none';
        }

        // STEP 1: Wait for vintage CRT black-and-white phosphor flicker to complete (~260ms)
        await new Promise(r => setTimeout(r, 260));
        if (preloaderCompleted) return;

        // STEP 2: OEM Brand Boot Splash Screen (Like ASUS ROG / Alienware turning on)
        // High-tech laser loading bar fills smoothly 0% -> 100%
        if (biosLoaderBar) {
            biosLoaderBar.style.width = '100%';
        }
        playSfx('sfxHover', 0.45);

        // Keep the stunning brand welcome screen visible for user dopamine hit (~750ms)
        await new Promise(r => setTimeout(r, 750));
        if (preloaderCompleted) return;

        // STEP 3: Smooth Dissolve / Transition from Brand Splash to Kali Linux Terminal
        if (biosStage) {
            biosStage.classList.add('fade-out');
        }
        playSfx('sfxClick', 0.3);

        await new Promise(r => setTimeout(r, 260));
        if (preloaderCompleted) return;

        if (biosStage) {
            biosStage.style.display = 'none';
        }
        if (kaliWindow) {
            kaliWindow.style.display = 'flex';
        }

        // Short pause after terminal window pops open (~120ms)
        await new Promise(r => setTimeout(r, 120));
        if (preloaderCompleted) return;

        // STEP 4: Realistic Kali Linux typewriter typing
        const cmdToType = "system_farhan";

        for (let i = 0; i < cmdToType.length; i++) {
            if (preloaderCompleted) return;
            if (kaliTypedText) {
                kaliTypedText.textContent += cmdToType[i];
            }
            if (i % 2 === 0) {
                playSfx('sfxClick', 0.15);
            }
            await new Promise(r => setTimeout(r, 28)); // ~300ms total
        }

        // Slight pause after typing command before execution
        await new Promise(r => setTimeout(r, 120));
        if (preloaderCompleted) return;

        // Fetch telemetry result (already resolved in background)
        const telemetry = await telemetryPromise;
        if (preloaderCompleted) return;

        // STEP 5: Populate real user telemetry (Device, Battery, IP, Location, Root)
        if (kaliDeviceVal) {
            const shortOs = telemetry.os.replace('WINDOWS 11 / 10', 'WIN 11/10').replace('WINDOWS', 'WIN');
            kaliDeviceVal.textContent = `${telemetry.device.replace(' WORKSTATION', '')} // ${shortOs}`.slice(0, 26);
        }
        if (kaliBatteryVal) {
            kaliBatteryVal.textContent = telemetry.battery;
        }
        if (kaliIpVal) {
            kaliIpVal.textContent = telemetry.ip.length > 22 ? telemetry.ip.slice(0, 19) + '...' : telemetry.ip;
        }
        if (kaliLocationVal) {
            kaliLocationVal.textContent = telemetry.location.replace('GLOBAL NODE // ', '').slice(0, 24);
        }
        if (kaliAccessVal) {
            kaliAccessVal.textContent = 'GRANTED [ROOT #]';
        }

        // Reveal the clean telemetry data block
        if (kaliTelemetryBlock) {
            kaliTelemetryBlock.style.display = 'flex';
        }
        playTerminalPing();

        // STEP 6: Hold display for visitor to absorb their real data, then launch Dolly Zoom into portfolio!
        setTimeout(() => {
            finishPreloader();
        }, 580);
    }

    // Initialize Docking Immediately (Instant render on mobile & laptop - zero delay!)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupLaptopDocking);
    } else {
        setupLaptopDocking();
    }
})();

// ====== LENIS SMOOTH SCROLL ======
let lenis;
function initLenis() {
    // Mobile / Touch check: let mobile use native GPU-composited hardware scrolling for zero lag on any weak phone
    const isTouchOrMobile = (window.innerWidth <= 768) || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouchOrMobile) {
        return;
    }

    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
    });

    lenis.scrollTo(0, { immediate: true });

    // Connect Lenis to GSAP ScrollTrigger and F1 Scrollbar
    lenis.on('scroll', (e) => {
        ScrollTrigger.update();
        if (typeof window.updateF1ScrollPos === 'function') {
            window.updateF1ScrollPos(e.scroll);
        }
    });

    // Drive Lenis tick synchronized with GSAP ticker (prevents duplicate rAF loops)
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
}

// ====== CUSTOM CURSOR ======
let isCursorInitialized = false;
function initCursor() {
    if (isCursorInitialized) return;
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');

    if (!dot || !ring) return;

    // Mobile / touch device check — strictly disable custom cursor on touchscreens
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia('(hover: none) and (pointer: coarse)').matches || (window.innerWidth <= 768);
    if (isTouchDevice) {
        dot.remove();
        ring.remove();
        document.body.classList.remove('cursor-active');
        return;
    }

    isCursorInitialized = true;
    document.body.classList.add('cursor-active');

    // Ensure cursor elements are direct children of body and body has no transform
    if (dot.parentElement !== document.body) {
        document.body.appendChild(dot);
    }
    if (ring.parentElement !== document.body) {
        document.body.appendChild(ring);
    }
    document.body.style.removeProperty('transform');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;
    let hasMoved = false;

    const onPointerMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!hasMoved) {
            hasMoved = true;
            dotX = mouseX;
            dotY = mouseY;
            ringX = mouseX;
            ringY = mouseY;
            dot.style.opacity = '1';
            ring.style.opacity = '0.75';
        }
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let cursorThemeTick = 0;
    function animateCursor() {
        dotX += (mouseX - dotX) * 0.85;
        dotY += (mouseY - dotY) * 0.85;
        dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;

        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects on all interactive elements including preloader button
    const hoverElements = document.querySelectorAll('a, button, #preloaderEnterBtn, .preloader-enter-trigger, .keycap-btn, .bento-card, .project-card, .project-link-btn, .tech-pill, .skill-tag, .cta-btn, .cyber-btn, .cyber-row-item, .hud-pill-btn, .cyber-back-top, .nav-logo, .hero-name-sliced, .f1-car-wrapper, .f1-track-line, .cyber-arsenal-card, .cyber-radar-widget, .cyber-pixel-stack, .stage-pill-badge, .hero-cybernaut-badge, .projects-glitch-wrapper');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('hover');
            ring.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            dot.classList.remove('hover');
            ring.classList.remove('hover');
        });
    });

    // High-Contrast Theme Switching for All Neon Green Sections (Cyber Arsenal, Skills & Tools, Footer)
    const greenSections = document.querySelectorAll('.cyber-grid-stage, .skills-section, .cyber-footer-section');
    const bendingZone = document.getElementById('bendingZone');

    function checkCursorTheme(x, y) {
        if (x < 0 || y < 0) return;
        const target = document.elementFromPoint(x, y);
        if (!target) return;

        const isOverGreen = !!target.closest('.cyber-grid-stage, .skills-section, .cyber-footer-section');
        if (isOverGreen) {
            dot.classList.add('dark-mode');
            ring.classList.add('dark-mode');
        } else {
            dot.classList.remove('dark-mode');
            ring.classList.remove('dark-mode');
        }

        if (target.closest('#bendingZone')) {
            ring.classList.add('canvas-mode');
        } else {
            ring.classList.remove('canvas-mode');
        }
    }

    // Real-time cursor theme updates on mousemove, pointermove and scroll
    window.addEventListener('pointermove', (e) => checkCursorTheme(e.clientX, e.clientY), { passive: true });
    window.addEventListener('mousemove', (e) => checkCursorTheme(e.clientX, e.clientY), { passive: true });
    window.addEventListener('scroll', () => checkCursorTheme(mouseX, mouseY), { passive: true });

    // Double-layer section listeners for instant edge responsiveness
    greenSections.forEach(sec => {
        sec.addEventListener('mouseenter', () => {
            dot.classList.add('dark-mode');
            ring.classList.add('dark-mode');
        });
        sec.addEventListener('mouseleave', (e) => {
            const related = e.relatedTarget;
            if (related && related.closest && related.closest('.cyber-grid-stage, .skills-section, .cyber-footer-section')) return;
            dot.classList.remove('dark-mode');
            ring.classList.remove('dark-mode');
        });
    });

    if (bendingZone) {
        bendingZone.addEventListener('mouseenter', () => {
            ring.classList.add('canvas-mode');
        });
        bendingZone.addEventListener('mouseleave', () => {
            ring.classList.remove('canvas-mode');
        });
    }

    // ====== 1-SECOND CLICK CHAKRI STRIKE (SILENT) ======
    // On click anywhere on the website, green dot transforms into spinning Chakri inside the cursor for exactly 1 second!
    let chakriStrikeTimer = null;

    const triggerChakriStrike = (e) => {
        // Exclude terminal windows and interactive inputs from violent chakri strike
        if (e && e.target && e.target.closest && e.target.closest('#kaliCliModal, #archCliModal, .kali-cli-window, input, textarea, .kali-cli-content')) {
            return;
        }

        // Randomize strike rotational velocity slightly (0.32s - 0.48s)
        const randSpeed = (0.32 + Math.random() * 0.16).toFixed(2) + 's';
        dot.style.setProperty('--strike-speed', randSpeed);

        dot.classList.add('chakri-strike');
        ring.classList.add('chakri-strike');

        if (chakriStrikeTimer) clearTimeout(chakriStrikeTimer);
        chakriStrikeTimer = setTimeout(() => {
            dot.classList.remove('chakri-strike');
            ring.classList.remove('chakri-strike');
        }, 1000);
    };

    window.addEventListener('pointerdown', triggerChakriStrike, { capture: true, passive: true });
}

// Start custom cursor tracking immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursor);
} else {
    initCursor();
}

// ====== LIVE TIME ======
function initClock() {
    const timeEl = document.getElementById('navTime');
    if (!timeEl) return;

    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        timeEl.textContent = `${hours}:${mins}:${secs}`;
    }
    updateTime();
    setInterval(updateTime, 1000);
}

// ====== FLOATING SIDE MENU ======
function initMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const menuClose = document.getElementById('menuClose');
    const menuBackdrop = document.getElementById('menuBackdrop');
    const menu = document.getElementById('fullscreenMenu');
    const menuLinks = document.querySelectorAll('.side-nav-item, .menu-link');
    const socialLinks = document.querySelectorAll('.connect-link, .menu-social-link');

    if (!menuBtn || !menu) return;

    function openMenu() {
        playMenuClickSound();
        menu.classList.add('active');
        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden';

        // Animate links in with stagger
        gsap.fromTo(menuLinks,
            { x: 30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power3.out', delay: 0.1 }
        );
    }

    function closeMenu() {
        playMenuClickSound();
        menu.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
    }
    window.closeMenu = closeMenu;

    // Hover & click sounds for MENU button
    menuBtn.addEventListener('mouseenter', () => playMenuHoverSound());
    menuBtn.addEventListener('click', openMenu);

    if (menuClose) {
        menuClose.addEventListener('mouseenter', () => playMenuHoverSound());
        menuClose.addEventListener('click', closeMenu);
    }

    if (menuBackdrop) {
        menuBackdrop.addEventListener('click', closeMenu);
    }

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Update active state on hover among nav items
    menuLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            playMenuHoverSound();
            menuLinks.forEach(l => l.classList.remove('is-active'));
            link.classList.add('is-active');
        });

        link.addEventListener('click', (e) => {
            e.preventDefault();
            playMenuClickSound();
            closeMenu();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                setTimeout(() => {
                    if (typeof lenis !== 'undefined' && lenis) {
                        lenis.scrollTo(target, { offset: -50 });
                    } else {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 250);
            }
        });
    });

    socialLinks.forEach(social => {
        social.addEventListener('mouseenter', () => playMenuHoverSound());
        social.addEventListener('click', () => playMenuClickSound());
    });
}

// ====== INTERACTIVE CYBER DOT MATRIX (HERO BACKGROUND) ======
function initHeroDotMatrix() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    // Mobile & touch device check — touchscreens have no cursor hover, avoid heavy continuous canvas loop
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 768);
    if (isTouchDevice) {
        canvas.style.display = 'none';
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let dots = [];
    let activeDots = [];
    const spacing = 22; // tight cyber grid spacing
    let cols = 0;
    let rows = 0;
    let offsetX = 0;
    let offsetY = 0;
    let isLoopRunning = false;
    let isHeroVisible = true;

    // Track mouse & velocity
    const mouse = {
        x: -9999,
        y: -9999,
        prevX: -9999,
        prevY: -9999,
        vx: 0,
        vy: 0,
        speed: 0,
        active: false,
        lastMoveTime: 0
    };

    function wakeHeroLoop() {
        if (!isLoopRunning && isHeroVisible) {
            isLoopRunning = true;
            requestAnimationFrame(animate);
        }
    }

    function buildGrid() {
        width = window.innerWidth;
        height = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.resetTransform();
        ctx.scale(dpr, dpr);

        dots = [];
        activeDots = [];
        cols = Math.ceil(width / spacing);
        rows = Math.ceil(height / spacing);

        offsetX = (width - (cols - 1) * spacing) / 2;
        offsetY = (height - (rows - 1) * spacing) / 2;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = offsetX + c * spacing;
                const y = offsetY + r * spacing;

                dots.push({
                    originX: x,
                    originY: y,
                    x: x,
                    y: y,
                    vx: 0,
                    vy: 0,
                    energy: 0,
                    isActive: false
                });
            }
        }
        ctx.clearRect(0, 0, width, height);
    }

    buildGrid();
    window.addEventListener('resize', buildGrid);

    // Pause canvas completely when hero is scrolled out of viewport
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isHeroVisible = entry.isIntersecting;
            if (isHeroVisible && (activeDots.length > 0 || mouse.active)) {
                wakeHeroLoop();
            }
        });
    }, { threshold: 0.05 });
    heroObserver.observe(canvas);

    // Mouse tracking: wake loop only on active movement
    window.addEventListener('mousemove', (e) => {
        const now = performance.now();
        if (!mouse.active) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.prevX = e.clientX;
            mouse.prevY = e.clientY;
            mouse.active = true;
            mouse.lastMoveTime = now;
            wakeHeroLoop();
            return;
        }

        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.lastMoveTime = now;
        wakeHeroLoop();
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
        mouse.active = false;
        mouse.speed = 0;
    });

    // Render loop
    function animate() {
        if (!isHeroVisible) {
            isLoopRunning = false;
            return;
        }

        const now = performance.now();
        const timeSinceMove = now - mouse.lastMoveTime;

        if (mouse.active && timeSinceMove < 150) {
            mouse.vx = mouse.x - mouse.prevX;
            mouse.vy = mouse.y - mouse.prevY;
            mouse.speed = Math.hypot(mouse.vx, mouse.vy);
            mouse.prevX = mouse.x;
            mouse.prevY = mouse.y;
        } else {
            mouse.speed *= 0.6;
            if (mouse.speed < 0.05) mouse.speed = 0;
        }

        // Always clear canvas to keep background pitch black
        ctx.clearRect(0, 0, width, height);

        // Extended interaction radius around cursor (R = 105px)
        const R = 105;

        // ONLY excite dots if cursor is actively moving!
        if (mouse.active && mouse.speed > 0.4 && cols > 0 && rows > 0) {
            const centerC = Math.round((mouse.x - offsetX) / spacing);
            const centerR = Math.round((mouse.y - offsetY) / spacing);
            const reach = 5; // R is 105px, spacing is 22px => check 5 cells in each direction

            for (let r = Math.max(0, centerR - reach); r <= Math.min(rows - 1, centerR + reach); r++) {
                for (let c = Math.max(0, centerC - reach); c <= Math.min(cols - 1, centerC + reach); c++) {
                    const idx = r * cols + c;
                    const d = dots[idx];
                    if (!d) continue;

                    const dx = d.originX - mouse.x;
                    const dy = d.originY - mouse.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < R && dist > 0) {
                        const q = 1 - dist / R;
                        const force = q * q * 4.2;
                        const nx = dx / dist;
                        const ny = dy / dist;

                        d.vx += nx * force * 0.22;
                        d.vy += ny * force * 0.22;

                        // Pure electric blue excitation proportional to movement
                        const speedBoost = Math.min(1.2, mouse.speed * 0.12 + 0.35);
                        d.energy = Math.min(1, Math.max(d.energy, q * speedBoost));

                        if (!d.isActive) {
                            d.isActive = true;
                            activeDots.push(d);
                        }
                    }
                }
            }
        }

        // Update and render ONLY active energized dots
        for (let i = activeDots.length - 1; i >= 0; i--) {
            const d = activeDots[i];

            // Spring return
            d.vx += (d.originX - d.x) * 0.22;
            d.vy += (d.originY - d.y) * 0.22;
            d.vx *= 0.72;
            d.vy *= 0.72;

            d.x += d.vx;
            d.y += d.vy;

            // Decay energy rapidly so it vanishes when cursor stops
            d.energy *= 0.85;

            // Render tiny dot only if visible
            if (d.energy > 0.03) {
                ctx.beginPath();
                const radius = 0.75 + d.energy * 0.55; // Tiny micro dot (0.75px - 1.3px)
                ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
                // STRICTLY Pure Electric Blue — ZERO mixing color!
                const alpha = Math.min(1, d.energy * 0.95);
                ctx.fillStyle = `rgba(0, 160, 255, ${alpha.toFixed(2)})`;
                ctx.fill();
            } else if (Math.hypot(d.x - d.originX, d.y - d.originY) < 0.2 && Math.hypot(d.vx, d.vy) < 0.05) {
                // Fully returned & cooled down — remove from active list
                d.x = d.originX;
                d.y = d.originY;
                d.vx = 0;
                d.vy = 0;
                d.energy = 0;
                d.isActive = false;
                activeDots.splice(i, 1);
            }
        }

        // Check if loop can go to sleep when no active dots and mouse idle
        if (activeDots.length === 0 && (!mouse.active || mouse.speed === 0)) {
            ctx.clearRect(0, 0, width, height);
            isLoopRunning = false;
            return;
        }

        requestAnimationFrame(animate);
    }
}

// ====== GSAP ANIMATIONS ======
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.clearScrollMemory) {
        ScrollTrigger.clearScrollMemory('manual');
    }
    window.scrollTo(0, 0);

    initLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true });
    initCursor();
    initClock();
    initMenu();
    initHeroDotMatrix();
    initCyberBendingLetters();
    initPhotoGlitch();
    initGlitchEffect();
    initWeaponChakri();
    initF1Scrollbar();
    initGlobalClickSound();
    initMagneticGravity();
    initScrambleTextReveal();

    // ---- Hero Animations ----
    const heroTL = gsap.timeline({ delay: 0.15 });

    heroTL
        .to('.hero-name-sliced', {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power4.out',
            onComplete: () => {
                setTimeout(() => {
                    if (typeof launchBoomerangChakri === 'function') {
                        launchBoomerangChakri();
                    }
                }, 60);
            }
        })
        .to('.hero-intro', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.6')
        .to('.hero-badge', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.6')
        .to('.hero-sub', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.6')
        .to('.hero-photo-wrapper', {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
        }, '-=1');

    // ---- Hero Photo Parallax ----
    gsap.to('.hero-photo-wrapper', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });

    // ---- Manifesto Word Reveal ----
    const mwords = document.querySelectorAll('.mword');
    mwords.forEach((word, i) => {
        ScrollTrigger.create({
            trigger: word,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
            onEnter: () => word.classList.add('active'),
            onLeaveBack: () => word.classList.remove('active'),
            onUpdate: (self) => {
                if (self.progress > 0.3) {
                    word.classList.add('active');
                } else {
                    word.classList.remove('active');
                }
            }
        });
    });

    // ---- About Section ----
    gsap.from('.about-label', {
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.manifesto-about',
            start: 'top 75%'
        }
    });

    gsap.from('.about-text p', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.manifesto-about',
            start: 'top 70%'
        }
    });




    // ---- Contact Section Entrance (Only if old template exists) ----
    if (document.querySelector('.contact-section')) {
        gsap.from('.contact-line', {
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact-section',
                start: 'top 70%'
            }
        });

        gsap.from('.cta-btn', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact-buttons',
                start: 'top 85%'
            }
        });

        gsap.from('.contact-col', {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact-links',
                start: 'top 85%'
            }
        });
    }

    // ---- Skill Tags Hover Sound Effect Simulation ----
    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            gsap.fromTo(tag, 
                { scale: 0.95 },
                { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' }
            );
        });
    });


    // ---- Magnetic Button Effect ----
    document.querySelectorAll('.cta-btn, .nav-menu-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });

    // ---- 100% Boundary-less Floating Nav & Pure Red Chakri ----
    const nav = document.getElementById('mainNav');
    if (nav) {
        nav.style.background = 'transparent';
        nav.style.backdropFilter = 'none';
        nav.style.webkitBackdropFilter = 'none';
        nav.style.mixBlendMode = 'difference';
    }
}

// ====== COUNTER ANIMATION HELPER ======
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (target - start) * eased);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ====== CINEMATIC CRT PHOTO MONITOR & SLICE GLITCH ======
function initPhotoGlitch() {
    if (window._photoGlitchInitialized) return;
    window._photoGlitchInitialized = true;

    const photoFrame = document.getElementById('heroPhotoFrame');
    const slice1 = document.getElementById('heroGlitchSlice1');
    const slice2 = document.getElementById('heroGlitchSlice2');
    const greenLayer = document.getElementById('heroGlitchGreen');
    const purpleLayer = document.getElementById('heroGlitchPurple');

    if (!photoFrame) return;

    let isGlitching = false;

    // Exact RGB Chromatic Glitch: Green shifted left, Purple shifted right + slice bands
    function triggerDigitalGlitch(isDouble = false) {
        if (isGlitching) return;
        isGlitching = true;

        // Moderate chromatic offset (4px to 6.5px - crisp medium intensity, keeps face handsome)
        const shiftX = Math.floor(Math.random() * 3) + 4; // 4 to 6px
        const shiftY = (Math.random() - 0.5) * 2; // -1 to 1px

        // Green (Left) & Purple (Right) Chromatic Separation
        if (greenLayer) {
            greenLayer.style.transform = `translate(${-shiftX}px, ${shiftY.toFixed(1)}px)`;
            greenLayer.style.opacity = '0.95';
        }
        if (purpleLayer) {
            purpleLayer.style.transform = `translate(${shiftX}px, ${(-shiftY).toFixed(1)}px)`;
            purpleLayer.style.opacity = '0.75';
        }

        // Horizontal Cyber Slice Glitch (thin horizontal bands)
        if (slice1) {
            const y1 = Math.floor(Math.random() * 65) + 10;
            const h1 = Math.floor(Math.random() * 9) + 5;
            const sliceShift = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 5 + 4);
            slice1.style.clipPath = `polygon(0 ${y1}%, 100% ${y1}%, 100% ${y1 + h1}%, 0 ${y1 + h1}%)`;
            slice1.style.transform = `translateX(${sliceShift}px)`;
            slice1.style.opacity = '0.9';
        }

        if (slice2 && Math.random() > 0.4) {
            const y2 = Math.floor(Math.random() * 70) + 15;
            const h2 = Math.floor(Math.random() * 7) + 4;
            const sliceShift2 = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 4 + 3);
            slice2.style.clipPath = `polygon(0 ${y2}%, 100% ${y2}%, 100% ${y2 + h2}%, 0 ${y2 + h2}%)`;
            slice2.style.transform = `translateX(${sliceShift2}px)`;
            slice2.style.opacity = '0.85';
        }

        // Crisp frame micro-jolt
        photoFrame.classList.add('micro-twitch');

        // First twitch duration: 75ms
        setTimeout(() => {
            // Step 2: Brief counter-jitter (authentic CRT video stutter)
            const shiftX2 = Math.floor(Math.random() * 3) + 2.5;
            if (greenLayer) greenLayer.style.transform = `translate(${-shiftX2}px, 0)`;
            if (purpleLayer) purpleLayer.style.transform = `translate(${shiftX2}px, 0)`;

            setTimeout(() => {
                // Completely clean up! Back to 100% pristine original photo!
                if (greenLayer) {
                    greenLayer.style.opacity = '0';
                    greenLayer.style.transform = 'none';
                }
                if (purpleLayer) {
                    purpleLayer.style.opacity = '0';
                    purpleLayer.style.transform = 'none';
                }
                if (slice1) {
                    slice1.style.opacity = '0';
                    slice1.style.transform = 'none';
                }
                if (slice2) {
                    slice2.style.opacity = '0';
                    slice2.style.transform = 'none';
                }
                photoFrame.classList.remove('micro-twitch');
                isGlitching = false;

                // Occasional quick secondary stutter
                if (isDouble) {
                    setTimeout(() => {
                        triggerDigitalGlitch(false);
                    }, 55);
                }
            }, 65);
        }, 75);
    }

    // Periodic ambient glitch with 3.2s to 4.2s peaceful rest interval
    function scheduleAmbientGlitch() {
        const delay = Math.random() * 1000 + 3200; // 3.2s to 4.2s rest
        setTimeout(() => {
            const isDouble = Math.random() > 0.6;
            triggerDigitalGlitch(isDouble);
            scheduleAmbientGlitch();
        }, delay);
    }

    scheduleAmbientGlitch();

    // ====== LOCALIZED LIQUID CURSOR RIPPLE (PURE LIGHT PURPLE) ======
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches || 
                    ('ontouchstart' in window && window.innerWidth <= 768);

    const cursorRipple = document.getElementById('heroCursorLiquid');
    const rippleRing = document.getElementById('liquidRippleRing');

    // On mobile / touch devices: skip hover listeners completely for 100% safety & performance
    if (isTouch) {
        return;
    }

    // State for smooth elastic spring physics
    let tiltX = 0, tiltY = 0;
    let targetTiltX = 0, targetTiltY = 0;
    let ringScale = 1.0, targetRingScale = 1.0;
    let ringScaleVel = 0;

    let lastMouseX = 0, lastMouseY = 0;
    let lastMoveTime = performance.now();
    let lastHoverGlitch = 0;
    let isHovered = false;
    let isSpringRunning = false;

    function wakeSpring() {
        if (!isSpringRunning && !isTouch) {
            isSpringRunning = true;
            requestAnimationFrame(liquidSpringTicker);
        }
    }

    photoFrame.addEventListener('mouseenter', (e) => {
        isHovered = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        lastMoveTime = performance.now();
        targetRingScale = 1.05;
        wakeSpring();
    });

    photoFrame.addEventListener('mousemove', (e) => {
        const rect = photoFrame.getBoundingClientRect();
        const relX = Math.round(e.clientX - rect.left);
        const relY = Math.round(e.clientY - rect.top);
        const normX = relX / rect.width - 0.5; // -0.5 to 0.5
        const normY = relY / rect.height - 0.5;

        // Calculate cursor velocity for elastic water ring expansion
        const now = performance.now();
        const dt = Math.max(1, now - lastMoveTime);
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        const speed = Math.hypot(dx, dy) / dt; // px per ms

        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        lastMoveTime = now;

        // Position localized pure purple light spotlight strictly at cursor point
        if (cursorRipple) {
            cursorRipple.style.setProperty('--mx', `${relX}px`);
            cursorRipple.style.setProperty('--my', `${relY}px`);
        }

        // Elastic water ripple expands slightly with mouse speed (max 1.4x), then springs back
        targetRingScale = Math.min(1.4, 1.0 + speed * 0.4);

        // Very subtle micro 3D tilt (max 2.2 degrees only - keeps face completely natural & undistorted!)
        targetTiltX = normX * 2.5;
        targetTiltY = -normY * 2.5;

        // Occasional subtle cyber glitch slice on active movement
        if (now - lastHoverGlitch > 2000 && Math.random() > 0.7) {
            lastHoverGlitch = now;
            triggerDigitalGlitch(false);
        }

        wakeSpring();
    });

    photoFrame.addEventListener('mouseleave', () => {
        isHovered = false;
        targetTiltX = 0;
        targetTiltY = 0;
        targetRingScale = 1.0;
        wakeSpring();
    });

    // Spring loop for localized elastic ripple & smooth micro-tilt (sleeps when at rest)
    function liquidSpringTicker() {
        if (isTouch) {
            isSpringRunning = false;
            return;
        }

        // Elastic spring damping for the liquid ripple ring
        const springForce = (targetRingScale - ringScale) * 0.16;
        ringScaleVel = (ringScaleVel + springForce) * 0.78;
        ringScale += ringScaleVel;

        if (rippleRing) {
            rippleRing.style.setProperty('--rscale', ringScale.toFixed(3));
        }

        // Soft spring tilt for photo card (never twists face)
        if (!isGlitching) {
            tiltX += (targetTiltX - tiltX) * 0.12;
            tiltY += (targetTiltY - tiltY) * 0.12;
            photoFrame.style.transform = `perspective(800px) rotateY(${tiltX.toFixed(2)}deg) rotateX(${tiltY.toFixed(2)}deg)`;
        }

        // Gradually return ring scale to 1.0 when cursor slows
        if (targetRingScale > 1.0) {
            targetRingScale += (1.0 - targetRingScale) * 0.08;
        }

        // Check resting state to enter deep sleep
        if (!isHovered &&
            Math.abs(tiltX) < 0.02 &&
            Math.abs(tiltY) < 0.02 &&
            Math.abs(ringScale - 1.0) < 0.01 &&
            Math.abs(ringScaleVel) < 0.01) {
            tiltX = 0;
            tiltY = 0;
            ringScale = 1.0;
            ringScaleVel = 0;
            photoFrame.style.transform = `perspective(800px) rotateY(0deg) rotateX(0deg)`;
            if (rippleRing) rippleRing.style.setProperty('--rscale', '1.0');
            isSpringRunning = false;
            return;
        }

        requestAnimationFrame(liquidSpringTicker);
    }
}

// ====== GLITCH EFFECT & DOPAMINE HACKER DECRYPT ON HERO NAME ======
function initGlitchEffect() {
    if (window._nameGlitchInitialized) return;
    window._nameGlitchInitialized = true;

    const heroName = document.getElementById('heroNameSliced');
    if (!heroName) return;

    const sliceTop = heroName.querySelector('.hero-slice-top');
    const sliceBottom = heroName.querySelector('.hero-slice-bottom');
    const targetText = sliceTop ? (sliceTop.getAttribute('data-text') || 'FARHAN') : 'FARHAN';
    const glyphs = '01X7#$*!?/@&%';
    let isScrambling = false;

    // High-Speed Cyber Decrypt Matrix Scramble (Cognitive curiosity & instant reward)
    function triggerHackerDecrypt() {
        if (isScrambling) return;
        isScrambling = true;

        if (typeof playSfx === 'function') {
            playSfx('sfxHover', 0.22);
        }

        let iteration = 0;
        const maxIterations = 5;
        const interval = setInterval(() => {
            const scrambled = targetText
                .split('')
                .map((letter, index) => {
                    if (index < iteration) {
                        return targetText[index];
                    }
                    return glyphs[Math.floor(Math.random() * glyphs.length)];
                })
                .join('');

            if (sliceTop) {
                sliceTop.textContent = scrambled;
                sliceTop.setAttribute('data-text', scrambled);
            }
            if (sliceBottom) {
                sliceBottom.textContent = scrambled;
                sliceBottom.setAttribute('data-text', scrambled);
            }

            iteration += 1;
            if (iteration > maxIterations) {
                clearInterval(interval);
                if (sliceTop) {
                    sliceTop.textContent = targetText;
                    sliceTop.setAttribute('data-text', targetText);
                }
                if (sliceBottom) {
                    sliceBottom.textContent = targetText;
                    sliceBottom.setAttribute('data-text', targetText);
                }
                isScrambling = false;
            }
        }, 32); // 32ms cadence -> exactly 160ms total duration!
    }

    function triggerNameGlitch(isDouble = false) {
        heroName.classList.add('is-glitching');
        setTimeout(() => {
            heroName.classList.remove('is-glitching');
            if (isDouble) {
                setTimeout(() => {
                    heroName.classList.add('is-glitching');
                    setTimeout(() => {
                        heroName.classList.remove('is-glitching');
                    }, 65);
                }, 60);
            }
        }, 75);
    }

    // Ambient periodic digital glitch
    setInterval(() => {
        if (Math.random() > 0.85) {
            triggerNameGlitch(Math.random() > 0.5);
        }
    }, 3200);

    // Interactive Hover: Cyber Decrypt Scramble + Micro Glitch
    heroName.addEventListener('mouseenter', () => {
        triggerHackerDecrypt();
        triggerNameGlitch(true);
    });

    // Interactive Click / Tap: Tactile Mechanical Switch Punch + Click SFX + Launch
    heroName.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof unlockAudio === 'function') unlockAudio();

        heroName.classList.add('is-punch');
        setTimeout(() => heroName.classList.remove('is-punch'), 120);

        if (typeof playSfx === 'function') {
            playSfx('sfxClick', 0.55);
        }

        triggerHackerDecrypt();

        // Launch Chakri Glaive on click for high dopamine visual payoff!
        if (typeof launchBoomerangChakri === 'function') {
            launchBoomerangChakri(true);
        }
    });

    // Touch device support for mobile
    heroName.addEventListener('touchstart', () => {
        heroName.classList.add('is-punch');
    }, { passive: true });

    heroName.addEventListener('touchend', () => {
        heroName.classList.remove('is-punch');
        triggerHackerDecrypt();
    }, { passive: true });
}

// ====== (Audio & Background Music Engine hoisted to top of script for immediate startup playback) ======

// Centralized robust audio track player
function playSfxTrack(domId, fallbackAudioObj, volume = 0.95) {
    if (!sfxEnabled) return;

    const el = document.getElementById(domId);
    if (el) {
        try {
            el.volume = volume;
            el.currentTime = 0;
            const p = el.play();
            if (p && typeof p.then === 'function') {
                p.then(() => {
                    hasAudioPlayedSuccessfully = true;
                    initialAudioBlocked = false;
                }).catch(() => {
                    playFallbackAudio(fallbackAudioObj, volume);
                });
                return;
            }
        } catch(e) {
            playFallbackAudio(fallbackAudioObj, volume);
            return;
        }
    }

    playFallbackAudio(fallbackAudioObj, volume);
}

function playProceduralSynthTone(volume = 0.3, freq = 680) {
    if (!sfxEnabled) return;
    try {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) audioCtx = new AudioContextClass();
        }
        if (audioCtx && audioCtx.state === 'running') {
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.45, now + 0.06);
            gain.gain.setValueAtTime(Math.min(volume * 0.35, 0.25), now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.06);
        }
    } catch(e) {}
}

function playFallbackAudio(fallbackAudioObj, volume) {
    if (!fallbackAudioObj) {
        initialAudioBlocked = true;
        playProceduralSynthTone(volume);
        return;
    }
    try {
        fallbackAudioObj.volume = volume;
        fallbackAudioObj.currentTime = 0;
        const p = fallbackAudioObj.play();
        if (p && typeof p.then === 'function') {
            p.then(() => {
                hasAudioPlayedSuccessfully = true;
                initialAudioBlocked = false;
            }).catch(() => {
                initialAudioBlocked = true;
                playProceduralSynthTone(volume);
            });
        }
    } catch(e) {
        initialAudioBlocked = true;
        playProceduralSynthTone(volume);
    }
}

// ====== AESTHETIC CYBER HACKER SOUND FX (HOVER & CLICK ENGINES) ======
let lastHoverSoundTime = 0;
function playMenuHoverSound() {
    if (!sfxEnabled) return;
    const nowMs = Date.now();
    if (nowMs - lastHoverSoundTime < 45) return; // Debounce 45ms for buttery smooth rapid scrubbing
    lastHoverSoundTime = nowMs;

    unlockAudio();

    if (typeof triggerHoverGlitchLock === 'function') {
        triggerHoverGlitchLock();
    }

    try {
        const clone = sfxHoverAudio.cloneNode();
        clone.volume = 0.85;
        clone.play().catch(() => {});
    } catch(e) {}
}

// ====== STUDIO HACKER TERMINAL AUDIO REGISTRY (5 BEST + 1 BONUS) ======
const studioHackerClicks = {
    1: sfxClickAudio, // hacker_best_01_cyber_click.wav (The Default & Primary Choice)
    2: sfxClickAudio,
    3: sfxDockAudio,
    4: sfxClickAudio,
    5: sfxSlashAudio,
    6: sfxHoverAudio  // hacker_best_06_neural_glitch.wav
};
Object.values(studioHackerClicks).forEach(a => {
    a.preload = 'auto';
    a.volume = 1.0;
});

let lastClickSoundTime = 0;
function playMenuClickSound() {
    if (!sfxEnabled) return;
    const nowMs = Date.now();
    if (nowMs - lastClickSoundTime < 25) return; // Prevent double-trigger within 25ms
    lastClickSoundTime = nowMs;

    unlockAudio();

    // Play active chosen studio hacker sound (default: Sample 1 ARWES Cyber-Click)
    try {
        const activeChoice = localStorage.getItem('farhan_selected_click_sfx') || '1';
        const a = studioHackerClicks[activeChoice] || sfxClickAudio;
        if (a) {
            const clone = a.cloneNode();
            clone.volume = 1.0;
            clone.play().catch(() => {});
        }
    } catch(e) {}
}

// ====== GLOBAL HACKER TERMINAL CLICK & HOVER ATTACHMENT ======
function initGlobalClickSound() {
    if (window._globalClickSoundAttached) return;
    window._globalClickSoundAttached = true;

    // Attach click sound across all interactive elements
    document.addEventListener('click', (e) => {
        const target = e.target.closest('button, a, .cta-btn, .nav-menu-btn, .nav-sfx-btn, .side-nav-item, .cyber-hero-card, .bento-card, .skill-tag, .connect-link, .menu-link, .nav-logo, .nav-emblem-anchor, .cyber-action-btn, .back-to-top, .hero-cybernaut-badge, .project-card-frame, .hud-pill-btn, .stage-pill-badge, .f1-car-wrapper');
        if (target) {
            playMenuClickSound();
        }
    }, { capture: true, passive: true });

    // Attach hover glitch sound across all interactive elements
    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('button, a, .cta-btn, .nav-menu-btn, .nav-sfx-btn, .side-nav-item, .cyber-hero-card, .bento-card, .skill-tag, .connect-link, .menu-link, .nav-logo, .nav-emblem-anchor, .cyber-action-btn, .back-to-top, .hero-cybernaut-badge, .project-card-frame, .hud-pill-btn, .stage-pill-badge, .f1-car-wrapper');
        if (target && target !== window._lastHoveredTarget) {
            window._lastHoveredTarget = target;
            playMenuHoverSound();
        }
    }, { capture: true, passive: true });
}

// ====== WEAPON CHAKRI BOOMERANG SLASH ENGINE ======
let launchBoomerangChakri = () => {};

function initWeaponChakri() {
    if (window._weaponChakriInitialized) return;
    window._weaponChakriInitialized = true;

    const canvas = document.getElementById('weaponCanvas');
    const flyingWeapon = document.getElementById('flyingWeapon');
    const weaponBlade = document.getElementById('weaponBlade');
    const navLogoSymbol = document.getElementById('navLogoSymbol');
    const heroNameSliced = document.getElementById('heroNameSliced');
    const slashSeam = document.getElementById('heroSlashSeam');

    if (!canvas || !flyingWeapon || !weaponBlade || !navLogoSymbol || !heroNameSliced) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.resetTransform();
        ctx.scale(dpr, dpr);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let particles = [];
    let shockwaves = [];
    let isFlying = false;

    // ====== PROCEDURAL & HI-FI WEAPON SOUND FX ENGINE ======
    // (SFX Toggle Button in Navbar)
    const sfxToggleBtn = document.getElementById('sfxToggleBtn');
    if (sfxToggleBtn) {
        sfxToggleBtn.addEventListener('mouseenter', () => playMenuHoverSound());
        sfxToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            unlockAudio();
            sfxEnabled = !sfxEnabled;
            const sideSfxLabel = document.getElementById('sideMenuSfxLabel');
            const sideSfxIcon = document.getElementById('sideMenuSfxIcon');
            if (sfxEnabled) {
                sfxToggleBtn.classList.remove('sfx-muted');
                sfxToggleBtn.querySelector('.sfx-icon').textContent = '🔊';
                if (sideSfxLabel) sideSfxLabel.textContent = 'SOUND FX: ON';
                if (sideSfxIcon) sideSfxIcon.textContent = '🔊';
                playChakriDockSound();
                if (typeof toggleBackgroundMusic === 'function') {
                    toggleBackgroundMusic(true);
                }
            } else {
                sfxToggleBtn.classList.add('sfx-muted');
                sfxToggleBtn.querySelector('.sfx-icon').textContent = '🔇';
                if (sideSfxLabel) sideSfxLabel.textContent = 'SOUND FX: OFF';
                if (sideSfxIcon) sideSfxIcon.textContent = '🔇';
                if (typeof toggleBackgroundMusic === 'function') {
                    toggleBackgroundMusic(false);
                }
            }
        });
    }

    // 1. Whoosh / Air-Cutting Blade Sound (Hawa me ghoomne ki aawaz)
    function playChakriWhooshSound() {
        if (!sfxEnabled) return;

        playSfxTrack('sfxWhoosh', sfxWhooshAudio, 0.95);

        // Layered Web Audio synth if running
        if (audioCtx && audioCtx.state === 'running') {
            try {
                const now = audioCtx.currentTime;
                const bufferSize = Math.floor(audioCtx.sampleRate * 0.48);
                const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                const noise = audioCtx.createBufferSource();
                noise.buffer = buffer;

                const filter = audioCtx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.Q.value = 3.8;
                filter.frequency.setValueAtTime(320, now);
                filter.frequency.exponentialRampToValueAtTime(1800, now + 0.22);
                filter.frequency.exponentialRampToValueAtTime(260, now + 0.48);

                const gain = audioCtx.createGain();
                gain.gain.setValueAtTime(0.01, now);
                gain.gain.linearRampToValueAtTime(0.42, now + 0.18);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

                const osc = audioCtx.createOscillator();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(140, now);
                osc.frequency.exponentialRampToValueAtTime(420, now + 0.2);
                osc.frequency.exponentialRampToValueAtTime(90, now + 0.48);

                const oscGain = audioCtx.createGain();
                oscGain.gain.setValueAtTime(0.12, now);
                oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(audioCtx.destination);

                osc.connect(oscGain);
                oscGain.connect(audioCtx.destination);

                noise.start(now);
                osc.start(now);
                noise.stop(now + 0.48);
                osc.stop(now + 0.48);
            } catch(e) {}
        }
    }

    // 2. Razor Slice Sound (Katne ki aawaz - Katana / Laser Metal Slice)
    function playChakriSlashSound() {
        if (!sfxEnabled) return;

        playSfxTrack('sfxSlash', sfxSlashAudio, 1.0);

        // Layered Web Audio synth if running
        if (audioCtx && audioCtx.state === 'running') {
            try {
                const now = audioCtx.currentTime;

                const osc1 = audioCtx.createOscillator();
                const osc2 = audioCtx.createOscillator();
                osc1.type = 'sine';
                osc2.type = 'triangle';
                osc1.frequency.setValueAtTime(3400, now);
                osc1.frequency.exponentialRampToValueAtTime(950, now + 0.38);
                osc2.frequency.setValueAtTime(5100, now);
                osc2.frequency.exponentialRampToValueAtTime(1400, now + 0.38);

                const metalGain = audioCtx.createGain();
                metalGain.gain.setValueAtTime(0.5, now);
                metalGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

                osc1.connect(metalGain);
                osc2.connect(metalGain);
                metalGain.connect(audioCtx.destination);
                osc1.start(now);
                osc2.start(now);
                osc1.stop(now + 0.38);
                osc2.stop(now + 0.38);

                const bufferSize = Math.floor(audioCtx.sampleRate * 0.28);
                const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                const noise = audioCtx.createBufferSource();
                noise.buffer = buffer;

                const noiseFilter = audioCtx.createBiquadFilter();
                noiseFilter.type = 'highpass';
                noiseFilter.frequency.setValueAtTime(2200, now);

                const noiseGain = audioCtx.createGain();
                noiseGain.gain.setValueAtTime(0.65, now);
                noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

                noise.connect(noiseFilter);
                noiseFilter.connect(noiseGain);
                noiseGain.connect(audioCtx.destination);
                noise.start(now);
                noise.stop(now + 0.28);

                const sub = audioCtx.createOscillator();
                sub.type = 'sine';
                sub.frequency.setValueAtTime(190, now);
                sub.frequency.exponentialRampToValueAtTime(45, now + 0.22);

                const subGain = audioCtx.createGain();
                subGain.gain.setValueAtTime(0.65, now);
                subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

                sub.connect(subGain);
                subGain.connect(audioCtx.destination);
                sub.start(now);
                sub.stop(now + 0.22);
            } catch(e) {}
        }
    }

    // 3. Return Aerodynamic Hum (Hawa me curve/wapas aane ki aawaz)
    function playChakriReturnSound() {
        if (!sfxEnabled) return;

        if (audioCtx && audioCtx.state === 'running') {
            try {
                const now = audioCtx.currentTime;
                const osc = audioCtx.createOscillator();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(290, now);
                osc.frequency.exponentialRampToValueAtTime(130, now + 0.75);

                const gain = audioCtx.createGain();
                gain.gain.setValueAtTime(0.01, now);
                gain.gain.linearRampToValueAtTime(0.2, now + 0.2);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.75);
            } catch(e) {}
        }
    }

    // 4. Docking Latch & Chime (Jagah par aane ki sci-fi lock aawaz)
    function playChakriDockSound() {
        if (!sfxEnabled) return;

        playSfxTrack('sfxDock', sfxDockAudio, 0.95);

        // Layered Web Audio synth if running
        if (audioCtx && audioCtx.state === 'running') {
            try {
                const now = audioCtx.currentTime;

                const clickOsc = audioCtx.createOscillator();
                clickOsc.type = 'square';
                clickOsc.frequency.setValueAtTime(1500, now);
                clickOsc.frequency.exponentialRampToValueAtTime(240, now + 0.05);

                const clickGain = audioCtx.createGain();
                clickGain.gain.setValueAtTime(0.35, now);
                clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

                clickOsc.connect(clickGain);
                clickGain.connect(audioCtx.destination);
                clickOsc.start(now);
                clickOsc.stop(now + 0.05);

                const chime = audioCtx.createOscillator();
                chime.type = 'sine';
                chime.frequency.setValueAtTime(980, now + 0.02);
                chime.frequency.setValueAtTime(1960, now + 0.06);

                const chimeGain = audioCtx.createGain();
                chimeGain.gain.setValueAtTime(0.001, now);
                chimeGain.gain.linearRampToValueAtTime(0.28, now + 0.06);
                chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

                chime.connect(chimeGain);
                chimeGain.connect(audioCtx.destination);
                chime.start(now + 0.02);
                chime.stop(now + 0.45);
            } catch(e) {}
        }
    }

    let isWeaponLoopRunning = false;
    function wakeWeaponLoop() {
        if (!isWeaponLoopRunning) {
            isWeaponLoopRunning = true;
            requestAnimationFrame(renderCanvas);
        }
    }

    // Spark / Particle System
    function spawnSparks(x, y, count = 48, baseAngle = -0.06, spread = Math.PI / 3, speedMultiplier = 1) {
        for (let i = 0; i < count; i++) {
            const angle = baseAngle + (Math.random() - 0.5) * spread;
            const speed = (Math.random() * 9 + 4) * speedMultiplier;
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 2.4 + 1.2,
                color: Math.random() > 0.35 ? 'rgba(255, 35, 35,' : 'rgba(255, 190, 50,',
                alpha: 1,
                decay: Math.random() * 0.035 + 0.02
            });
        }
        wakeWeaponLoop();
    }
    window.spawnWeaponSparks = spawnSparks;

    function spawnTrail(x, y) {
        for (let i = 0; i < 2; i++) {
            particles.push({
                x: x + (Math.random() - 0.5) * 16,
                y: y + (Math.random() - 0.5) * 16,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                size: Math.random() * 2.2 + 0.8,
                color: 'rgba(255, 30, 30,',
                alpha: 0.9,
                decay: 0.05
            });
        }
        wakeWeaponLoop();
    }

    // Render loop for particles & shockwaves (runs strictly while particles or shockwaves exist)
    function renderCanvas() {
        ctx.clearRect(0, 0, width, height);

        // Render shockwaves
        for (let i = shockwaves.length - 1; i >= 0; i--) {
            const sw = shockwaves[i];
            sw.radius += sw.speed;
            sw.alpha *= sw.decay;

            if (sw.alpha > 0.01) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 35, 35, ${sw.alpha.toFixed(2)})`;
                ctx.lineWidth = sw.width;
                ctx.shadowColor = '#FF1E1E';
                ctx.shadowBlur = 15;
                ctx.stroke();
                ctx.restore();
            } else {
                shockwaves.splice(i, 1);
            }
        }

        // Render particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.95;
            p.vy *= 0.95;
            p.alpha -= p.decay;

            if (p.alpha > 0.01) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `${p.color} ${p.alpha.toFixed(2)})`;
                ctx.shadowColor = '#FF2A2A';
                ctx.shadowBlur = 8;
                ctx.fill();
            } else {
                particles.splice(i, 1);
            }
        }

        if (shockwaves.length > 0 || particles.length > 0) {
            requestAnimationFrame(renderCanvas);
        } else {
            isWeaponLoopRunning = false;
            ctx.clearRect(0, 0, width, height);
        }
    }

    // The Boomerang Flight Sequence
    launchBoomerangChakri = function(force = false) {
        if (isFlying && !force) return;
        isFlying = true;

        // Play launch whoosh sound!
        playChakriWhooshSound();

        // Stop any autonomous idle spin and hide during flight
        stopRandomChakriSpin();
        navLogoSymbol.style.opacity = '0';
        navLogoSymbol.classList.remove('dock-pulse');

        // Get live coordinates
        const dockRect = navLogoSymbol.getBoundingClientRect();
        const dockX = dockRect.left + dockRect.width / 2;
        const dockY = dockRect.top + dockRect.height / 2;

        const targetRect = heroNameSliced.getBoundingClientRect();
        const cutX = targetRect.left + targetRect.width * 0.48;
        const cutY = targetRect.top + targetRect.height * 0.54;

        // Path Definition:
        // P0 (Launch): Offscreen bottom-left of FARHAN
        const P0 = { x: Math.max(-100, cutX - 550), y: cutY + 160 };
        // P1 (Slice Cut through FARHAN):
        const P1 = { x: cutX, y: cutY };
        // P2 (Overshoot / Boomerang Apex to the right):
        const P2 = { x: Math.min(window.innerWidth - 60, cutX + 380), y: cutY - 140 };
        // P3 (High Loop across top viewport):
        const P3 = { x: (cutX + dockX) * 0.5 + 40, y: Math.max(20, dockY - 30) };
        // P4 (Dock into Navbar):
        const P4 = { x: dockX, y: dockY };

        // Make flying weapon visible
        flyingWeapon.style.display = 'block';
        flyingWeapon.style.opacity = '1';

        let hasCut = false;
        let hasReturned = false;
        let progressObj = { t: 0 };

        // Catmull-Rom or composite Bezier interpolation
        function getPointOnSpline(t) {
            // Segment 1: P0 -> P1 (Launch to Cut) t: 0.0 to 0.32
            if (t <= 0.32) {
                const subT = t / 0.32;
                const easedT = Math.pow(subT, 1.8);
                return {
                    x: P0.x + (P1.x - P0.x) * easedT,
                    y: P0.y + (P1.y - P0.y) * easedT,
                    scale: 0.7 + easedT * 0.45
                };
            }
            // Segment 2: P1 -> P2 (Cut through to Apex Curve) t: 0.32 to 0.62
            else if (t <= 0.62) {
                const subT = (t - 0.32) / 0.30;
                const cpX = P1.x + (P2.x - P1.x) * 0.85;
                const cpY = P1.y - 40;
                const inv = 1 - subT;
                const x = inv * inv * P1.x + 2 * inv * subT * cpX + subT * subT * P2.x;
                const y = inv * inv * P1.y + 2 * inv * subT * cpY + subT * subT * P2.y;
                return {
                    x: x,
                    y: y,
                    scale: 1.15 - subT * 0.25
                };
            }
            // Segment 3: P2 -> P3 -> P4 (Boomerang Return to Dock) t: 0.62 to 1.0
            else {
                const subT = (t - 0.62) / 0.38;
                const inv = 1 - subT;
                const x = inv * inv * P2.x + 2 * inv * subT * P3.x + subT * subT * P4.x;
                const y = inv * inv * P2.y + 2 * inv * subT * P3.y + subT * subT * P4.y;
                return {
                    x: x,
                    y: y,
                    scale: 0.9 - subT * 0.55 // scales down to match 22px nav size
                };
            }
        }

        // GSAP Flight Timeline
        gsap.to(progressObj, {
            t: 1,
            duration: 2.35,
            ease: 'none',
            onUpdate: () => {
                const pt = getPointOnSpline(progressObj.t);

                // Update position
                flyingWeapon.style.transform = `translate(${pt.x - 34}px, ${pt.y - 34}px) scale(${pt.scale})`;

                // Spawn fiery trail
                spawnTrail(pt.x, pt.y);

                // Check for THE SLICE CUT! (at t >= 0.32)
                if (!hasCut && progressObj.t >= 0.32) {
                    hasCut = true;

                    // Play razor metal slash sound!
                    playChakriSlashSound();

                    // 1. Slash sparks explosion
                    spawnSparks(cutX, cutY, 48, -0.06, Math.PI / 3, 1.4);

                    // 2. Camera / screen micro-shake (targeted on hero, never touching body)
                    const heroEl = document.getElementById('hero');
                    if (heroEl) {
                        gsap.fromTo(heroEl, 
                            { x: 3.5, y: -2 }, 
                            { x: 0, y: 0, duration: 0.12, ease: 'rough', clearProps: 'transform' }
                        );
                    }
                    document.body.style.removeProperty('transform');

                    // 3. Impact flash on FARHAN
                    heroNameSliced.classList.add('impact-flash');
                    setTimeout(() => {
                        heroNameSliced.classList.remove('impact-flash');
                    }, 80);

                    // 4. Slices shift into permanent sliced design
                    heroNameSliced.classList.add('is-sliced');

                    // 5. Laser incision seam ignites
                    if (slashSeam) {
                        slashSeam.style.opacity = '1';
                    }
                }

                // Check for boomerang return curve (at t >= 0.62)
                if (!hasReturned && progressObj.t >= 0.62) {
                    hasReturned = true;
                    playChakriReturnSound();
                }
            },
            onComplete: () => {
                // Play docking lock sound!
                playChakriDockSound();

                // Dock into navbar!
                flyingWeapon.style.display = 'none';
                flyingWeapon.style.opacity = '0';

                // Reveal nav symbol with pulse, then launch autonomous randomized spin!
                navLogoSymbol.style.opacity = '1';
                navLogoSymbol.classList.add('dock-pulse');
                setTimeout(() => {
                    navLogoSymbol.classList.remove('dock-pulse');
                    startRandomChakriSpin();
                }, 500);

                // Docking shockwave ring
                shockwaves.push({
                    x: dockX,
                    y: dockY,
                    radius: 8,
                    speed: 3.2,
                    alpha: 1,
                    decay: 0.92,
                    width: 2.5
                });
                wakeWeaponLoop();

                isFlying = false;
            }
        });
    };

    // ====== PROCEDURAL RANDOM CHAKRI AUTONOMOUS SPIN ENGINE ======
    // Unpredictable dynamic spin patterns: varying turns, velocities, easing, and pause intervals!
    let randomChakriTween = null;
    let randomChakriTimeout = null;
    let currentChakriAngle = 0;

    function startRandomChakriSpin() {
        stopRandomChakriSpin();
        if (!navLogoSymbol) return;

        navLogoSymbol.classList.add('rhythmic-spin');

        function scheduleNextRandomSpin() {
            if (!navLogoSymbol || isFlying) return;

            // Rich assortment of unpredictable spin behaviors:
            const patterns = [
                // 1. Snappy 360° flick with crisp deceleration
                { turns: 1, minDur: 0.45, maxDur: 0.65, ease: 'power3.out', minPause: 320, maxPause: 580 },
                // 2. High-velocity double 720° overclock burst
                { turns: 2, minDur: 0.72, maxDur: 0.95, ease: 'power4.out', minPause: 500, maxPause: 850 },
                // 3. Smooth mechanical 360° gyro glide
                { turns: 1, minDur: 0.85, maxDur: 1.15, ease: 'power2.inOut', minPause: 280, maxPause: 480 },
                // 4. Turbo triple 1080° whirl with long after-cool pause
                { turns: 3, minDur: 1.05, maxDur: 1.35, ease: 'expo.out', minPause: 700, maxPause: 1150 },
                // 5. Punchy counter-clockwise realignment twitch
                { turns: -1, minDur: 0.5, maxDur: 0.72, ease: 'back.out(1.5)', minPause: 350, maxPause: 600 },
                // 6. Rapid double twitch with ultra-short stutter halt
                { turns: 2, minDur: 0.62, maxDur: 0.82, ease: 'circ.out', minPause: 220, maxPause: 380 }
            ];

            const p = patterns[Math.floor(Math.random() * patterns.length)];
            const duration = p.minDur + Math.random() * (p.maxDur - p.minDur);
            const pauseTime = p.minPause + Math.random() * (p.maxPause - p.minPause);

            currentChakriAngle += p.turns * 360;

            // Flare up drop-shadow during active spin
            gsap.to(navLogoSymbol, {
                filter: 'drop-shadow(0 0 14px rgba(255, 40, 40, 1)) drop-shadow(0 0 28px rgba(255, 0, 0, 0.85))',
                duration: 0.2,
                ease: 'none'
            });

            randomChakriTween = gsap.to(navLogoSymbol, {
                rotation: currentChakriAngle,
                duration: duration,
                ease: p.ease,
                onComplete: () => {
                    if (isFlying) return;
                    // Soft idle reactor glow during rest pause
                    gsap.to(navLogoSymbol, {
                        filter: 'drop-shadow(0 0 8px rgba(255, 30, 30, 0.85)) drop-shadow(0 0 16px rgba(255, 0, 0, 0.65))',
                        duration: 0.25,
                        ease: 'none'
                    });
                    // Random pause before next unpredictable spin!
                    randomChakriTimeout = setTimeout(scheduleNextRandomSpin, pauseTime);
                }
            });
        }

        scheduleNextRandomSpin();
    }

    function stopRandomChakriSpin() {
        if (randomChakriTimeout) {
            clearTimeout(randomChakriTimeout);
            randomChakriTimeout = null;
        }
        if (randomChakriTween) {
            randomChakriTween.kill();
            randomChakriTween = null;
        }
        if (navLogoSymbol) {
            navLogoSymbol.classList.remove('rhythmic-spin');
        }
    }

    // Nav symbol hover & click
    navLogoSymbol.addEventListener('mouseenter', () => {
        playMenuHoverSound();
        if (!isFlying) {
            currentChakriAngle += 360;
            gsap.to(navLogoSymbol, {
                rotation: currentChakriAngle,
                duration: 0.45,
                ease: 'power3.out'
            });
        }
    });

    navLogoSymbol.addEventListener('click', (e) => {
        e.stopPropagation();
        unlockAudio();
        launchBoomerangChakri(true);
    });

    // If page is already sliced (e.g. re-initialized), keep random spin active and visible
    if (heroNameSliced && heroNameSliced.classList.contains('is-sliced')) {
        navLogoSymbol.style.opacity = '1';
        startRandomChakriSpin();
    } else {
        navLogoSymbol.style.opacity = '0';
    }
}

// Wire up weapon and F1 scrollbar engine immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initWeaponChakri();
        initF1Scrollbar();
    });
} else {
    initWeaponChakri();
    initF1Scrollbar();
}

// Initialize visual effects after window load
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    initWeaponChakri();
    initGlitchEffect();
    initPhotoGlitch();
    initF1Scrollbar();
});

// ====== FARHAN INTERACTIVE BENDING MATRIX ENGINE ======
function initCyberBendingLetters() {
    const canvas = document.getElementById('cyberBendingCanvas');
    const container = document.getElementById('bendingZone');
    const backToTop = document.getElementById('cyberBackToTop');

    if (!canvas || !container) return;

    // Prevent double initialization
    if (window._cyberBendingInitialized) return;
    window._cyberBendingInitialized = true;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed text matching portfolio owner
    const currentText = 'PORTFOLIO/FARHAN';

    let width = 0;
    let height = 0;
    let dpr = 1;
    let dots = [];
    let shockwaves = [];
    let animId = null;
    let isZoneVisible = false;
    let isBendingLoopRunning = false;

    // Mouse tracking
    const mouse = {
        x: -9999,
        y: -9999,
        targetX: -9999,
        targetY: -9999,
        active: false
    };

    function startBendingLoop() {
        if (!isBendingLoopRunning && isZoneVisible) {
            isBendingLoopRunning = true;
            animId = requestAnimationFrame(render);
        }
    }

    function stopBendingLoop() {
        if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
        }
        isBendingLoopRunning = false;
    }

    // Observe container visibility so canvas does not run when user is elsewhere on page
    const zoneObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isZoneVisible = entry.isIntersecting;
            if (isZoneVisible) {
                startBendingLoop();
            } else {
                stopBendingLoop();
            }
        });
    }, { threshold: 0.05 });
    zoneObserver.observe(container);

    // Build letter matrix with uniform square dots
    function buildLetterMatrix() {
        const rect = container.getBoundingClientRect();
        width = Math.floor(rect.width);
        height = Math.floor(rect.height);
        dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.resetTransform();
        ctx.scale(dpr, dpr);

        if (width < 50 || height < 50) return;

        // Offscreen canvas for sampling
        const off = document.createElement('canvas');
        off.width = width;
        off.height = height;
        const offCtx = off.getContext('2d', { willReadFrequently: true });
        if (!offCtx) return;

        // Fit text cleanly edge-to-edge (~92% width)
        let fontSize = Math.floor(height * 0.72);
        offCtx.font = `900 ${fontSize}px 'Space Grotesk', 'Orbitron', 'Impact', sans-serif`;
        let measured = offCtx.measureText(currentText);

        if (measured.width > width * 0.94) {
            fontSize = Math.floor(fontSize * ((width * 0.94) / measured.width));
            offCtx.font = `900 ${fontSize}px 'Space Grotesk', 'Orbitron', 'Impact', sans-serif`;
            measured = offCtx.measureText(currentText);
        } else if (measured.width < width * 0.85) {
            fontSize = Math.floor(fontSize * ((width * 0.90) / measured.width));
            offCtx.font = `900 ${fontSize}px 'Space Grotesk', 'Orbitron', 'Impact', sans-serif`;
            measured = offCtx.measureText(currentText);
        }

        offCtx.fillStyle = '#000000';
        offCtx.textAlign = 'center';
        offCtx.textBaseline = 'middle';
        offCtx.fillText(currentText, width / 2, height / 2 + fontSize * 0.04);

        // Density step calculation for halftone matrix
        const step = Math.max(6, Math.min(9, Math.floor(width / 155)));
        const dotSize = Math.max(4, step * 0.78);

        const imgData = offCtx.getImageData(0, 0, width, height).data;
        const newDots = [];

        // Sample points across grid
        for (let y = Math.floor(step / 2); y < height; y += step) {
            for (let x = Math.floor(step / 2); x < width; x += step) {
                const pxIndex = (y * width + x) * 4;
                const alpha = imgData[pxIndex + 3];

                if (alpha > 50) {
                    newDots.push({
                        originX: x,
                        originY: y,
                        x: x,
                        y: y,
                        vx: 0,
                        vy: 0,
                        size: dotSize
                    });
                }
            }
        }

        dots = newDots;
    }

    // Animation & Physics Render Loop
    function render() {
        // Smooth mouse target follow
        if (mouse.active) {
            mouse.x += (mouse.targetX - mouse.x) * 0.35;
            mouse.y += (mouse.targetY - mouse.y) * 0.35;
        }

        ctx.clearRect(0, 0, width, height);

        // Tight interaction radius (bends ONLY when cursor is directly on/touching the letters)
        const R = 48; 
        const maxPush = 9.5; // Very subtle & clean deflection (letters stay 100% crisp and readable)

        // Process shockwaves
        for (let i = shockwaves.length - 1; i >= 0; i--) {
            const sw = shockwaves[i];
            sw.radius += sw.speed;
            sw.strength *= 0.92;
            if (sw.radius > sw.maxRadius || sw.strength < 0.1) {
                shockwaves.splice(i, 1);
            }
        }

        function getThemeColors() {
            if (document.body.classList.contains('theme-acid')) {
                return {
                    resting: '#000000',
                    active: '#000000',
                    shadow: 'rgba(0, 0, 0, 0.35)',
                    blur: 2
                };
            } else if (document.body.classList.contains('theme-synthwave')) {
                return {
                    resting: '#00f0ff',
                    active: '#ff007f',
                    shadow: 'rgba(0, 240, 255, 0.55)',
                    blur: 4
                };
            }
            return {
                resting: '#96f315',
                active: '#ffffff',
                shadow: 'rgba(150, 243, 21, 0.45)',
                blur: 3
            };
        }

        const themeColors = getThemeColors();
        ctx.fillStyle = mouse.active ? themeColors.active : themeColors.resting;
        ctx.shadowColor = themeColors.shadow;
        ctx.shadowBlur = themeColors.blur;
        for (let i = 0; i < dots.length; i++) {
            const d = dots[i];
            const dx = d.originX - mouse.x;
            const dy = d.originY - mouse.y;
            const dist = Math.hypot(dx, dy);

            let targetX = d.originX;
            let targetY = d.originY;

            // Bends strictly when cursor is directly over or touching the letter dots
            if (mouse.active && dist < R && dist > 0) {
                const q = 1 - dist / R;
                // Smoothstep curve for soft, seamless bending without breaking letter lines
                const force = q * q * (3 - 2 * q);
                const push = force * maxPush;
                const nx = dx / dist;
                const ny = dy / dist;

                targetX = d.originX + nx * push;
                targetY = d.originY + ny * push;
            }

            // Spring physics towards target
            d.vx += (targetX - d.x) * 0.28;
            d.vy += (targetY - d.y) * 0.28;

            // Apply shockwave ripples if active
            for (let s = 0; s < shockwaves.length; s++) {
                const sw = shockwaves[s];
                const swDx = d.x - sw.x;
                const swDy = d.y - sw.y;
                const swDist = Math.hypot(swDx, swDy);
                const ringDist = Math.abs(swDist - sw.radius);

                if (ringDist < 30 && swDist > 0) {
                    const ringForce = (1 - ringDist / 30) * sw.strength;
                    d.vx += (swDx / swDist) * ringForce;
                    d.vy += (swDy / swDist) * ringForce;
                }
            }

            // Damping
            d.vx *= 0.72;
            d.vy *= 0.72;

            d.x += d.vx;
            d.y += d.vy;

            // Draw crisp square dot
            const half = d.size / 2;
            ctx.beginPath();
            ctx.roundRect(d.x - half, d.y - half, d.size, d.size, 1.2);
            ctx.fill();
        }

        // Check if all dots have fully returned to resting positions
        let maxMovement = 0;
        for (let i = 0; i < dots.length; i++) {
            const d = dots[i];
            const m = Math.abs(d.vx) + Math.abs(d.vy) + Math.abs(d.x - d.originX) + Math.abs(d.y - d.originY);
            if (m > maxMovement) maxMovement = m;
        }

        if (!mouse.active && shockwaves.length === 0 && maxMovement < 0.18) {
            ctx.clearRect(0, 0, width, height);
            const restColors = getThemeColors();
            ctx.fillStyle = restColors.resting;
            ctx.shadowColor = restColors.shadow;
            ctx.shadowBlur = restColors.blur;
            for (let i = 0; i < dots.length; i++) {
                const d = dots[i];
                d.x = d.originX;
                d.y = d.originY;
                d.vx = 0;
                d.vy = 0;
                const half = d.size / 2;
                ctx.beginPath();
                ctx.roundRect(d.x - half, d.y - half, d.size, d.size, 1.2);
                ctx.fill();
            }
            stopBendingLoop();
            return;
        }

        animId = requestAnimationFrame(render);
    }

    // Mouse & Touch Interaction Listeners
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouse.targetX = e.clientX - rect.left;
        mouse.targetY = e.clientY - rect.top;
        if (!mouse.active) {
            mouse.x = mouse.targetX;
            mouse.y = mouse.targetY;
        }
        mouse.active = true;
        startBendingLoop();
    });

    container.addEventListener('mouseleave', () => {
        mouse.active = false;
        mouse.targetX = -9999;
        mouse.targetY = -9999;
    });

    container.addEventListener('click', (e) => {
        const rect = container.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        shockwaves.push({
            x: clickX,
            y: clickY,
            radius: 8,
            maxRadius: Math.max(width, height) * 0.75,
            speed: 14,
            strength: 15
        });
        startBendingLoop();
    });

    // Touch support for mobile devices
    container.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            const rect = container.getBoundingClientRect();
            mouse.targetX = e.touches[0].clientX - rect.left;
            mouse.targetY = e.touches[0].clientY - rect.top;
            if (!mouse.active) {
                mouse.x = mouse.targetX;
                mouse.y = mouse.targetY;
            }
            mouse.active = true;
            startBendingLoop();
        }
    }, { passive: true });

    container.addEventListener('touchend', () => {
        mouse.active = false;
    });

    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            if (lenis) {
                lenis.scrollTo(0, { duration: 1.2 });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // Responsive resize handler
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            buildLetterMatrix();
        }, 150);
    });

    // Font readiness check
    if (document.fonts) {
        document.fonts.ready.then(() => {
            buildLetterMatrix();
        });
    }

    // Initial build and render
    buildLetterMatrix();
    if (animId) cancelAnimationFrame(animId);
    render();

    // Dynamic redraw hook for theme switcher
    window._redrawCyberBending = function() {
        startBendingLoop();
    };
}

// ====== F1 KICK SAUBER HIGH-SPEED INTERACTIVE SCROLLBAR ENGINE ======
function initF1Scrollbar() {
    if (window._f1ScrollbarInitialized) return;
    window._f1ScrollbarInitialized = true;

    // Mobile / touch screen check — keep native scrolling clean on mobile
    if (window.innerWidth <= 768 || window.matchMedia('(hover: none) and (pointer: coarse)').matches || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)) {
        const container = document.getElementById('f1Scrollbar');
        if (container) container.style.display = 'none';
        window.updateF1ScrollPos = function() {};
        return;
    }

    const container = document.getElementById('f1Scrollbar');
    const trackLine = document.getElementById('f1TrackLine');
    const trackFill = document.getElementById('f1TrackFill');
    const carWrapper = document.getElementById('f1CarWrapper');
    const bikeRotator = document.getElementById('f1BikeRotator') || carWrapper;
    const telemetryHud = document.getElementById('f1TelemetryHud');
    const speedVal = document.getElementById('f1SpeedVal');
    const drsLabel = document.getElementById('f1DrsLabel');
    const exhaustPlume = document.getElementById('f1ExhaustPlume');

    if (!container || !carWrapper || !trackLine) return;

    // Unified Animation & Dynamics State
    const carAnim = {
        progress: 0,
        targetProgress: 0,
        angle: 180,           // 180° = South (traveling DOWN), 0° / 360° = North (traveling UP)
        driftX: 0,            // Cornering drift offset in px
        currentDirection: 'down',
        isHairpinTurning: false,
        speed: 0,
        velocity: 0,
        isDragging: false,
        dragStartY: 0,
        dragStartProgress: 0
    };

    let lastScrollY = window.scrollY || 0;
    let lastScrollTime = performance.now();
    let hudHideTimer = null;

    // Track geometry
    const carHeight = 88;
    const topPadding = 24;
    const bottomPadding = 24;

    function getTrackRange() {
        return Math.max(100, window.innerHeight - carHeight - (topPadding + bottomPadding));
    }

    function getMaxScroll() {
        return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    }

    // Telemetry HUD Update
    function updateTelemetry(speed) {
        if (!telemetryHud || !speedVal) return;
        speedVal.textContent = speed;

        if (speed > 25) {
            telemetryHud.classList.add('active');
            clearTimeout(hudHideTimer);
            hudHideTimer = setTimeout(() => {
                telemetryHud.classList.remove('active');
                if (exhaustPlume && !carAnim.isHairpinTurning) exhaustPlume.classList.remove('active');
            }, 1200);
        }

        if (drsLabel) {
            if (speed > 160) drsLabel.classList.add('drs-active');
            else drsLabel.classList.remove('drs-active');
        }

        if (exhaustPlume) {
            if (speed > 70 || carAnim.isHairpinTurning) exhaustPlume.classList.add('active');
            else exhaustPlume.classList.remove('active');
        }
    }

    // Smooth Flip Turn at Bottom (180° -> 0°) - Strictly centered & straight
    function executeBottomHairpinTurn() {
        if (carAnim.isHairpinTurning) return;
        carAnim.isHairpinTurning = true;
        carAnim.currentDirection = 'up';

        if (exhaustPlume) exhaustPlume.classList.add('active');
        updateTelemetry(220);

        gsap.killTweensOf(carAnim);
        carAnim.driftX = 0;
        gsap.to(carAnim, {
            angle: 0,
            duration: 0.22,
            ease: 'power2.inOut',
            onUpdate: wakeF1Ticker,
            onComplete: () => {
                carAnim.angle = 0;
                carAnim.driftX = 0;
                carAnim.isHairpinTurning = false;
                if (bikeRotator && bikeRotator !== carWrapper) {
                    bikeRotator.style.transform = 'rotate(0deg)';
                }
                if (exhaustPlume && carAnim.speed < 70) exhaustPlume.classList.remove('active');
            }
        });
    }

    // Smooth Flip Turn at Top (0° -> 180°) - Strictly centered & straight
    function executeTopHairpinTurn() {
        if (carAnim.isHairpinTurning) return;
        carAnim.isHairpinTurning = true;
        carAnim.currentDirection = 'down';

        if (exhaustPlume) exhaustPlume.classList.add('active');
        updateTelemetry(220);

        gsap.killTweensOf(carAnim);
        carAnim.driftX = 0;
        gsap.to(carAnim, {
            angle: 180,
            duration: 0.22,
            ease: 'power2.inOut',
            onUpdate: wakeF1Ticker,
            onComplete: () => {
                carAnim.angle = 180;
                carAnim.driftX = 0;
                carAnim.isHairpinTurning = false;
                if (bikeRotator && bikeRotator !== carWrapper) {
                    bikeRotator.style.transform = 'rotate(180deg)';
                }
                if (exhaustPlume && carAnim.speed < 70) exhaustPlume.classList.remove('active');
            }
        });
    }

    // Mid-track Turnaround (smooth flip without sideways drift or tilt)
    function executeMidTrackTurn(toDirection) {
        if (carAnim.isHairpinTurning) return;
        carAnim.currentDirection = toDirection;
        const targetAngle = toDirection === 'down' ? 180 : 0;

        gsap.killTweensOf(carAnim);
        carAnim.driftX = 0;
        gsap.to(carAnim, {
            angle: targetAngle,
            duration: 0.20,
            ease: 'power2.inOut',
            onUpdate: wakeF1Ticker,
            onComplete: () => {
                carAnim.angle = targetAngle;
                carAnim.driftX = 0;
                if (bikeRotator && bikeRotator !== carWrapper) {
                    bikeRotator.style.transform = `rotate(${targetAngle}deg)`;
                }
            }
        });
    }

    // Central Scroll Update Handler (invoked by Lenis, window scroll, wheel, pointer)
    function onScrollUpdate(currentY) {
        const now = performance.now();
        const dt = Math.max(1, now - lastScrollTime);
        const dy = currentY - lastScrollY;

        // Skip micro jitter from duplicate event dispatches
        if (Math.abs(dy) < 0.1 && dt < 4) return;

        const maxScroll = getMaxScroll();
        carAnim.targetProgress = Math.max(0, Math.min(1, currentY / maxScroll));

        // Real-time speed calculation
        carAnim.velocity = dy / dt;
        const absVel = Math.abs(carAnim.velocity);
        carAnim.speed = Math.min(345, Math.round(absVel * 54 + (absVel > 0.03 ? 120 : 0)));

        lastScrollY = currentY;
        lastScrollTime = now;

        updateTelemetry(carAnim.speed);
        handleScrollDynamics(dy);
        wakeF1Ticker();
    }

    // Export globally for Lenis and any external triggers
    window.updateF1ScrollPos = onScrollUpdate;

    // Connect to Lenis scroll if already initialized
    if (typeof lenis !== 'undefined' && lenis) {
        lenis.on('scroll', (e) => {
            onScrollUpdate(e.scroll);
        });
    }

    // Window native scroll listener
    window.addEventListener('scroll', () => {
        const sc = typeof lenis !== 'undefined' && lenis ? lenis.scroll : (window.scrollY || document.documentElement.scrollTop || 0);
        onScrollUpdate(sc);
    }, { passive: true });

    // Wheel event listener for instant responsiveness & boundary hairpin checks
    window.addEventListener('wheel', (e) => {
        const sc = typeof lenis !== 'undefined' && lenis ? lenis.scroll : (window.scrollY || document.documentElement.scrollTop || 0);
        onScrollUpdate(sc);

        // Instant boundary hairpin check on wheel flick
        if (e.deltaY < -2 && carAnim.currentDirection === 'down' && carAnim.targetProgress >= 0.93) {
            executeBottomHairpinTurn();
        } else if (e.deltaY > 2 && carAnim.currentDirection === 'up' && carAnim.targetProgress <= 0.07) {
            executeTopHairpinTurn();
        }
        wakeF1Ticker();
    }, { passive: true });

    let isF1TickerRunning = false;
    function wakeF1Ticker() {
        if (!isF1TickerRunning) {
            isF1TickerRunning = true;
            requestAnimationFrame(ticker);
        }
    }

    // Direction & Hairpin Turn Logic
    function handleScrollDynamics(dy) {
        if (dy > 1.2) {
            // User is scrolling DOWN
            if (carAnim.currentDirection !== 'down' && !carAnim.isHairpinTurning) {
                if (carAnim.targetProgress <= 0.06) {
                    executeTopHairpinTurn();
                } else {
                    executeMidTrackTurn('down');
                }
            }
        } else if (dy < -1.2) {
            // User is scrolling UP
            if (carAnim.currentDirection !== 'up' && !carAnim.isHairpinTurning) {
                if (carAnim.targetProgress >= 0.94) {
                    executeBottomHairpinTurn();
                } else {
                    executeMidTrackTurn('up');
                }
            }
        }
    }

    // Main Animation Render Loop (runs strictly while car is moving / animating)
    function ticker() {
        // Fast, smooth progress interpolation
        if (carAnim.isDragging) {
            carAnim.progress = carAnim.targetProgress;
        } else {
            carAnim.progress += (carAnim.targetProgress - carAnim.progress) * 0.35;
        }

        // Compute exact track position
        const trackRange = getTrackRange();
        const yPos = topPadding + carAnim.progress * trackRange;

        // Strictly straight F1 car - NO yaw tilt, NO driftX offset
        carAnim.driftX = 0;
        const displayAngle = carAnim.angle;

        // Apply vertical translation to carWrapper down the track (NO rotation on wrapper)
        carWrapper.style.transform = `translate3d(0, ${yPos.toFixed(1)}px, 0)`;

        // Rotate ONLY the bike chassis inside, so HUD remains perfectly upright and on the left
        if (bikeRotator && bikeRotator !== carWrapper) {
            bikeRotator.style.transform = `rotate(${displayAngle.toFixed(1)}deg)`;
        } else {
            carWrapper.style.transform = `translate3d(0, ${yPos.toFixed(1)}px, 0) rotate(${displayAngle.toFixed(1)}deg)`;
        }

        // Update track neon fill line
        if (trackFill) {
            trackFill.style.height = `${(carAnim.progress * 100).toFixed(1)}%`;
        }

        const isSettled = !carAnim.isDragging && !carAnim.isHairpinTurning &&
            Math.abs(carAnim.targetProgress - carAnim.progress) < 0.0004 &&
            Math.abs(carAnim.velocity) < 0.01;

        if (isSettled) {
            carAnim.progress = carAnim.targetProgress;
            carWrapper.style.transform = `translate3d(0, ${yPos.toFixed(1)}px, 0)`;
            if (bikeRotator && bikeRotator !== carWrapper) {
                bikeRotator.style.transform = `rotate(${carAnim.angle.toFixed(1)}deg)`;
            }
            if (trackFill) trackFill.style.height = `${(carAnim.progress * 100).toFixed(1)}%`;
            isF1TickerRunning = false;
            return;
        }

        requestAnimationFrame(ticker);
    }

    // Initial positioning
    const initialSc = window.scrollY || 0;
    onScrollUpdate(initialSc);
    carAnim.progress = carAnim.targetProgress;
    const initialTrackRange = getTrackRange();
    const initialYPos = topPadding + carAnim.progress * initialTrackRange;
    carWrapper.style.transform = `translate3d(0px, ${initialYPos.toFixed(1)}px, 0)`;
    if (bikeRotator && bikeRotator !== carWrapper) {
        bikeRotator.style.transform = `rotate(${carAnim.angle}deg)`;
    }

    // ---- Double Click on F1 Car: Turbo Launch to Top / Bottom ----
    carWrapper.addEventListener('dblclick', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (exhaustPlume) exhaustPlume.classList.add('active');
        if (telemetryHud) {
            telemetryHud.classList.add('active');
            if (speedVal) speedVal.textContent = '350';
            if (drsLabel) drsLabel.classList.add('drs-active');
        }

        const maxScroll = getMaxScroll();
        if (carAnim.progress < 0.5) {
            // Turbo launch down
            if (typeof lenis !== 'undefined' && lenis) {
                lenis.scrollTo(maxScroll, { duration: 1.3 });
            } else {
                window.scrollTo({ top: maxScroll, behavior: 'smooth' });
            }
        } else {
            // Turbo launch up
            if (typeof lenis !== 'undefined' && lenis) {
                lenis.scrollTo(0, { duration: 1.3 });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }

        setTimeout(() => {
            if (exhaustPlume) exhaustPlume.classList.remove('active');
            if (telemetryHud) telemetryHud.classList.remove('active');
        }, 1600);
    });

    // ---- Draggable F1 Car Controller ----
    carWrapper.addEventListener('pointerdown', (e) => {
        carAnim.isDragging = true;
        carAnim.dragStartY = e.clientY;
        carAnim.dragStartProgress = carAnim.progress;
        carWrapper.setPointerCapture(e.pointerId);
        telemetryHud.classList.add('active');
        wakeF1Ticker();
        e.preventDefault();
    });

    window.addEventListener('pointermove', (e) => {
        if (!carAnim.isDragging) return;
        const trackRange = getTrackRange();
        const deltaY = e.clientY - carAnim.dragStartY;
        const deltaProgress = deltaY / trackRange;
        const newProgress = Math.max(0, Math.min(1, carAnim.dragStartProgress + deltaProgress));

        const maxScroll = getMaxScroll();
        const targetScroll = newProgress * maxScroll;

        if (typeof lenis !== 'undefined' && lenis) {
            lenis.scrollTo(targetScroll, { immediate: true });
        } else {
            window.scrollTo(0, targetScroll);
        }

        onScrollUpdate(targetScroll);
        wakeF1Ticker();
    });

    const stopDrag = () => {
        if (carAnim.isDragging) {
            carAnim.isDragging = false;
            setTimeout(() => {
                if (telemetryHud) telemetryHud.classList.remove('active');
            }, 1000);
        }
    };
    window.addEventListener('pointerup', stopDrag);
    window.addEventListener('pointercancel', stopDrag);

    // ---- Click to Jump on Track Line ----
    trackLine.addEventListener('click', (e) => {
        const rect = trackLine.getBoundingClientRect();
        const clickY = e.clientY - rect.top;
        const clickProgress = Math.max(0, Math.min(1, clickY / rect.height));
        const maxScroll = getMaxScroll();
        const targetScroll = clickProgress * maxScroll;

        if (typeof lenis !== 'undefined' && lenis) {
            lenis.scrollTo(targetScroll, { duration: 1.1 });
        } else {
            window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        }
    });

    // Window resize handler
    window.addEventListener('resize', () => {
        const trackRange = getTrackRange();
        const yPos = topPadding + carAnim.progress * trackRange;
        carWrapper.style.transform = `translate3d(0, ${yPos.toFixed(1)}px, 0)`;
        if (bikeRotator && bikeRotator !== carWrapper) {
            bikeRotator.style.transform = `rotate(${carAnim.angle}deg)`;
        }
    });
}

// ====== FARHAN NEON CYBER MATRIX & ARSENAL STAGE ======
function initCyberArsenalGrid() {
    const stage = document.getElementById('skills') || document.getElementById('cyberArsenal');
    if (!stage) return;

    // 1. Interactive Click-to-Recon Launchers on all cards
    const arsenalCards = stage.querySelectorAll('.cyber-arsenal-card');
    const CARD_TO_CMD = {
        'kali': 'whoami',
        'gemma': 'penmunshi',
        'automation': 'event-intel',
        'nmap': 'scan',
        'quant': 'rwh',
        'threejs': 'argus',
        'rust': 'bdstorage',
        'winaurex': 'winaurex'
    };

    arsenalCards.forEach(card => {
        if (card._arsenalClickBound) return;
        card._arsenalClickBound = true;
        card.addEventListener('click', () => {
            const cardKey = card.getAttribute('data-card');
            const dataCmd = card.getAttribute('data-cmd');
            const cmd = dataCmd || CARD_TO_CMD[cardKey] || 'help';
            if (typeof playSfxTrack === 'function') {
                playSfxTrack('sfxClick', null, 0.45);
            }
            if (typeof window.openKaliTerminal === 'function') {
                window.openKaliTerminal(cmd);
            }
        });
    });

    // 2. Sound Effects on Hover
    const cyberCards = stage.querySelectorAll('.cyber-arsenal-card, .cyber-radar-widget, .cyber-pixel-stack, .stage-pill-badge');
    cyberCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (typeof playMenuHoverSound === 'function') {
                playMenuHoverSound();
            }
        });
    });

    // 3. Telemetry Loading Animation on Viewport Entry
    let hasAnimated = false;
    function triggerCyberAnimations() {
        if (hasAnimated) return;
        hasAnimated = true;

        // Animate Loading Bars with stagger
        const fillBars = stage.querySelectorAll('.loading-fill');
        fillBars.forEach((bar, idx) => {
            const finalWidth = bar.style.width || '100%';
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = finalWidth;
            }, 120 + idx * 110);
        });
    }

    // Connect with GSAP ScrollTrigger if available, else IntersectionObserver
    if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
        ScrollTrigger.create({
            trigger: stage,
            start: 'top 80%',
            once: true,
            onEnter: triggerCyberAnimations
        });
    } else if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    triggerCyberAnimations();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.15 });
        observer.observe(stage);
    } else {
        triggerCyberAnimations();
    }
}

// =========================================================================
// ====== IDEA 2: SYNESTHESIA AUDIO-VISUAL SHOCKWAVE & GLITCH ENGINE ======
// =========================================================================
let triggerSynesthesiaShockwave = () => {};
let triggerHoverGlitchLock = () => {};

function initSynesthesiaEffect() {
    if (window._synesthesiaInitialized) return;
    window._synesthesiaInitialized = true;

    const synCanvas = document.getElementById('synesthesiaCanvas');
    const scanlineEl = document.getElementById('synesthesiaScanline');
    const cursorRingEl = document.getElementById('cursorRing');
    const navLogoSymbol = document.getElementById('navLogoSymbol');

    if (!synCanvas) return;
    const ctx = synCanvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        synCanvas.width = Math.floor(width * dpr);
        synCanvas.height = Math.floor(height * dpr);
        ctx.resetTransform();
        ctx.scale(dpr, dpr);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Shockwave particle pool
    const shockwaves = [];
    let isLoopRunning = false;

    class CyberShockwave {
        constructor(x, y, isChakri = false) {
            this.x = x;
            this.y = y;
            this.isChakri = isChakri;
            this.maxRadius = isChakri ? 120 : 75;
            this.duration = isChakri ? 480 : 360;
            this.startTime = performance.now();
            this.sparks = [];

            // Spawn directional cyber sparks
            const sparkCount = isChakri ? 10 : 6;
            for (let i = 0; i < sparkCount; i++) {
                const angle = (Math.PI * 2 / sparkCount) * i + (Math.random() * 0.4 - 0.2);
                const speed = 1.8 + Math.random() * 2.2;
                this.sparks.push({
                    x: this.x,
                    y: this.y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: 1.5 + Math.random() * 1.5,
                    life: 1.0,
                    decay: 0.03 + Math.random() * 0.03
                });
            }
        }

        update(now) {
            const elapsed = now - this.startTime;
            this.progress = Math.min(elapsed / this.duration, 1);
            // Ease out quad
            this.eased = 1 - (1 - this.progress) * (1 - this.progress);
            this.radius = this.eased * this.maxRadius;
            this.alpha = (1 - this.progress);

            // Update sparks
            this.sparks.forEach(s => {
                s.x += s.vx;
                s.y += s.vy;
                s.vx *= 0.94;
                s.vy *= 0.94;
                s.life -= s.decay;
            });

            return this.progress < 1;
        }

        draw(c) {
            c.save();

            // Inner Ring: Neon Crimson Laser (#ff2a4a)
            c.beginPath();
            c.arc(this.x, this.y, Math.max(0.1, this.radius * 0.78), 0, Math.PI * 2);
            c.strokeStyle = `rgba(255, 42, 74, ${this.alpha * 0.9})`;
            c.lineWidth = 2.2 * (1 - this.progress * 0.5);
            c.shadowColor = '#ff2a4a';
            c.shadowBlur = 10;
            c.stroke();

            // Outer Ring: Cyber Lime Glow (#aaff00)
            c.beginPath();
            c.arc(this.x, this.y, Math.max(0.1, this.radius), 0, Math.PI * 2);
            c.strokeStyle = `rgba(170, 255, 0, ${this.alpha * 0.75})`;
            c.lineWidth = 1.5;
            c.shadowColor = '#aaff00';
            c.shadowBlur = 8;
            c.stroke();

            // 4 Micro Tactical Crosshairs at 0, 90, 180, 270 deg
            const crossDist = this.radius + 6;
            const crossLen = 6 * (1 - this.progress);
            c.lineWidth = 1.2;
            c.strokeStyle = `rgba(255, 255, 255, ${this.alpha * 0.9})`;
            
            // East
            c.beginPath();
            c.moveTo(this.x + crossDist, this.y);
            c.lineTo(this.x + crossDist + crossLen, this.y);
            c.stroke();
            // West
            c.beginPath();
            c.moveTo(this.x - crossDist, this.y);
            c.lineTo(this.x - crossDist - crossLen, this.y);
            c.stroke();
            // North
            c.beginPath();
            c.moveTo(this.x, this.y - crossDist);
            c.lineTo(this.x, this.y - crossDist - crossLen);
            c.stroke();
            // South
            c.beginPath();
            c.moveTo(this.x, this.y + crossDist);
            c.lineTo(this.x, this.y + crossDist + crossLen);
            c.stroke();

            // Draw micro cyber sparks
            this.sparks.forEach(s => {
                if (s.life > 0) {
                    c.beginPath();
                    c.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
                    c.fillStyle = this.isChakri ? `rgba(255, 42, 74, ${s.life})` : `rgba(170, 255, 0, ${s.life})`;
                    c.shadowColor = this.isChakri ? '#ff2a4a' : '#aaff00';
                    c.shadowBlur = 6;
                    c.fill();
                }
            });

            c.restore();
        }
    }

    function synesthesiaLoop(now) {
        ctx.clearRect(0, 0, width, height);

        for (let i = shockwaves.length - 1; i >= 0; i--) {
            const sw = shockwaves[i];
            const alive = sw.update(now);
            if (alive) {
                sw.draw(ctx);
            } else {
                shockwaves.splice(i, 1);
            }
        }

        if (shockwaves.length > 0) {
            requestAnimationFrame(synesthesiaLoop);
        } else {
            isLoopRunning = false;
            ctx.clearRect(0, 0, width, height);
        }
    }

    triggerSynesthesiaShockwave = function(x, y, isChakri = false) {
        shockwaves.push(new CyberShockwave(x, y, isChakri));
        if (!isLoopRunning) {
            isLoopRunning = true;
            requestAnimationFrame(synesthesiaLoop);
        }

        // Trigger Sub-millisecond Telemetry Ocular Glitch
        document.body.classList.add('synesthesia-active');
        if (scanlineEl) {
            scanlineEl.style.opacity = '1';
            scanlineEl.style.top = y + 'px';
            scanlineEl.style.transform = 'translateY(0)';
            setTimeout(() => {
                scanlineEl.style.opacity = '0';
            }, 75);
        }
        setTimeout(() => {
            document.body.classList.remove('synesthesia-active');
        }, 75);

        // If clicking Chakri, trigger hyper-spin
        if (isChakri && navLogoSymbol) {
            navLogoSymbol.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
            navLogoSymbol.style.transform = 'rotate(720deg) scale(1.22)';
            setTimeout(() => {
                navLogoSymbol.style.transform = '';
            }, 450);
        }
    };

    triggerHoverGlitchLock = function() {
        if (!cursorRingEl) return;
        cursorRingEl.classList.add('hover-glitch-lock');
        setTimeout(() => {
            cursorRingEl.classList.remove('hover-glitch-lock');
        }, 85);
    };

    // Attach global click event to spawn shockwave at cursor coordinate
    window.addEventListener('click', (e) => {
        if (e && e.target && e.target.closest && e.target.closest('#kaliCliModal, #archCliModal, .kali-cli-window, .kali-cli-content')) {
            return;
        }
        const isChakri = !!e.target.closest('#navLogoSymbol, #navEmblemAnchor');
        triggerSynesthesiaShockwave(e.clientX, e.clientY, isChakri);
    }, { passive: true, capture: true });
}

// =========================================================================
// ====== IDEA 4: 3D HOLOGRAPHIC GYRO TILT & METALLIC SHEEN ENGINE   ======
// =========================================================================
function init3DHolographicCards() {
    // Only on non-touch devices with fine cursor for maximum precision
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.cyber-arsenal-card, .bento-card, .cyber-pixel-stack, .cyber-radar-widget, .project-card');
    if (!cards.length) return;

    cards.forEach((card) => {
        if (card.dataset.holoBound === 'true') return;
        card.dataset.holoBound = 'true';
        card.classList.add('has-gyro-tilt');

        // 1. Inject Holographic Specular Sheen layer if not present
        if (!card.querySelector('.card-holo-glare')) {
            const glare = document.createElement('div');
            glare.className = 'card-holo-glare';
            glare.setAttribute('aria-hidden', 'true');
            card.appendChild(glare);
        }

        // 2. Inject 4 Tactical Corner Crosshairs if not present
        if (!card.querySelector('.card-crosshair')) {
            ['ch-tl', 'ch-tr', 'ch-bl', 'ch-br'].forEach(corner => {
                const cross = document.createElement('div');
                cross.className = `card-crosshair ${corner}`;
                cross.setAttribute('aria-hidden', 'true');
                card.appendChild(cross);
            });
        }

        const glare = card.querySelector('.card-holo-glare');
        let isHovered = false;

        card.addEventListener('mouseenter', () => {
            isHovered = true;
            card.style.transition = 'transform 0.15s ease-out, box-shadow 0.25s ease';
            if (glare) glare.style.opacity = '0.9';
        });

        card.addEventListener('mousemove', (e) => {
            if (!isHovered) return;
            const rect = card.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width;  // 0 to 1
            const py = (e.clientY - rect.top) / rect.height; // 0 to 1

            // Max 15 degree 3D rotation
            const tiltX = ((0.5 - py) * 16).toFixed(2);
            const tiltY = ((px - 0.5) * 16).toFixed(2);

            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.boxShadow = `${(-tiltY * 1.5).toFixed(1)}px ${(tiltX * 1.5 + 14).toFixed(1)}px 32px rgba(0, 0, 0, 0.28)`;

            if (glare) {
                glare.style.background = `radial-gradient(circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, rgba(255,255,255,0.48) 0%, rgba(170,255,0,0.22) 28%, rgba(255,42,74,0.14) 52%, transparent 74%)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            isHovered = false;
            card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.boxShadow = '';
            if (glare) {
                glare.style.opacity = '0';
            }
        });
    });
}

// ========================================================
// 7-CHAKRI FOOTER BARRAGE (DISABLED AS REQUESTED)
// ========================================================
function initChakriFooterBarrage() {
    window.launchFooterChakriBarrage = () => {};
    window.clearFooterChakriBarrage = () => {};
    const embeddedStage = document.getElementById('embeddedStage');
    if (embeddedStage) embeddedStage.innerHTML = '';
    const canvas = document.getElementById('chakriVfxCanvas');
    if (canvas) canvas.style.display = 'none';
    return; // Strictly disabled as requested by user

    const footerBottomBar = document.getElementById('footerBottomBar');
    if (!footerBottomBar || !embeddedStage) return;
    if (window._chakriFooterBarrageInitialized) return;
    window._chakriFooterBarrageInitialized = true;

    // --- Audio Context & Elements ---
    let audioCtx = null;
    function getAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) audioCtx = new AudioContext();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    // Audio unlock on user interaction
    const unlockAudio = () => {
        getAudioContext();
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
    window.addEventListener('keydown', unlockAudio, { once: true, passive: true });
    window.addEventListener('scroll', unlockAudio, { once: true, passive: true });

    const sfxWhoosh = document.getElementById('sfxChakriWhoosh');
    const sfxSlash = document.getElementById('sfxChakriSlash');
    const sfxCyberBlade = document.getElementById('sfxChakriBlade');
    const sfxThock = document.getElementById('sfxChakriThock');
    const sfxPunchySnap = document.getElementById('sfxChakriSnap');
    const sfxDock = document.getElementById('sfxChakriDock');

    // --- 60FPS VFX Canvas (Auto-Sleep for 0% CPU Idle) ---
    let ctx = null;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];
    let shockwaves = [];
    let smokePlumes = [];
    let isVfxLoopRunning = false;

    if (canvas) {
        ctx = canvas.getContext('2d');
        const resizeVfxCanvas = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            if (ctx) {
                ctx.resetTransform();
                ctx.scale(dpr, dpr);
            }
        };
        window.addEventListener('resize', resizeVfxCanvas, { passive: true });
        resizeVfxCanvas();
    }

    function ensureVfxRunning() {
        if (!isVfxLoopRunning && ctx) {
            isVfxLoopRunning = true;
            requestAnimationFrame(renderVfx);
        }
    }

    function spawnSparkBurst(x, y, count, baseAngle) {
        if (!ctx) return;
        for (let i = 0; i < count; i++) {
            const spread = (Math.random() - 0.5) * 1.5;
            const angle = baseAngle + spread;
            const speed = Math.random() * 18 + 7;
            const isNeonGreen = Math.random() > 0.45;
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: isNeonGreen ? '#96f315' : '#ffffff',
                size: Math.random() * 2.8 + 1.2,
                life: 1,
                decay: Math.random() * 0.038 + 0.024,
                length: Math.random() * 12 + 6,
                gravity: 0.45
            });
        }
        shockwaves.push({
            x: x,
            y: y,
            radius: 12,
            maxRadius: 170,
            speed: 15,
            alpha: 1,
            decay: 0.042
        });
        spawnSmokeEmber(x, y);
        ensureVfxRunning();
    }

    function spawnSmokeEmber(x, y) {
        for (let i = 0; i < 8; i++) {
            smokePlumes.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y,
                vx: (Math.random() - 0.5) * 1.2,
                vy: -(Math.random() * 2.0 + 0.8),
                radius: Math.random() * 6 + 4,
                growth: 0.28,
                alpha: 0.65,
                decay: 0.015,
                color: Math.random() > 0.5 ? 'rgba(255, 60, 40,' : 'rgba(60, 60, 60,'
            });
        }
        ensureVfxRunning();
    }

    function renderVfx() {
        if (!ctx) return;
        // Auto-sleep if no particles active (0% CPU/GPU overhead when idle!)
        if (shockwaves.length === 0 && particles.length === 0 && smokePlumes.length === 0) {
            ctx.clearRect(0, 0, width, height);
            isVfxLoopRunning = false;
            return;
        }

        ctx.clearRect(0, 0, width, height);

        // 1. Shockwaves
        for (let i = shockwaves.length - 1; i >= 0; i--) {
            const sw = shockwaves[i];
            ctx.save();
            ctx.beginPath();
            ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 42, 74, ${sw.alpha})`;
            ctx.lineWidth = 3.5;
            ctx.shadowColor = '#ff2a4a';
            ctx.shadowBlur = 18;
            ctx.stroke();
            ctx.restore();

            sw.radius += sw.speed;
            sw.speed *= 0.94;
            sw.alpha -= sw.decay;
            if (sw.alpha <= 0) shockwaves.splice(i, 1);
        }

        // 2. Sparks
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - p.vx * (p.length / 10), p.y - p.vy * (p.length / 10));
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size * p.life;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.restore();

            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.vx *= 0.97;
            p.life -= p.decay;
            if (p.life <= 0) particles.splice(i, 1);
        }

        // 3. Smoke & Embers
        for (let i = smokePlumes.length - 1; i >= 0; i--) {
            const sm = smokePlumes[i];
            ctx.save();
            ctx.beginPath();
            ctx.arc(sm.x, sm.y, sm.radius, 0, Math.PI * 2);
            ctx.fillStyle = `${sm.color} ${sm.alpha})`;
            ctx.fill();
            ctx.restore();

            sm.x += sm.vx;
            sm.y += sm.vy;
            sm.radius += sm.growth;
            sm.alpha -= sm.decay;
            if (sm.alpha <= 0) smokePlumes.splice(i, 1);
        }

        if (shockwaves.length > 0 || particles.length > 0 || smokePlumes.length > 0) {
            requestAnimationFrame(renderVfx);
        } else {
            isVfxLoopRunning = false;
            ctx.clearRect(0, 0, width, height);
        }
    }

    // --- Cinematic Cleavage Sound ---
    function playDeepEmbedSound(index, xPct = 0.5) {
        // High Razor Steel Cut Edge
        if (sfxSlash) {
            try {
                const slashTrack = sfxSlash.cloneNode();
                slashTrack.volume = 0.85;
                slashTrack.playbackRate = 0.94 + ((index % 3) * 0.07);
                slashTrack.play().catch(() => {});
            } catch(e) {}
        }

        // High-Tensile Steel Slicing Bite
        if (sfxCyberBlade) {
            try {
                const bladeTrack = sfxCyberBlade.cloneNode();
                bladeTrack.volume = 0.65;
                bladeTrack.playbackRate = 1.0 + (index * 0.04);
                bladeTrack.play().catch(() => {});
            } catch(e) {}
        }

        // Dense Physical Thock
        if (sfxThock) {
            try {
                const thockTrack = sfxThock.cloneNode();
                thockTrack.volume = 0.92;
                thockTrack.playbackRate = 0.92 + (index * 0.03);
                thockTrack.play().catch(() => {});
            } catch(e) {}
        }

        // Heavy Material Fracture Crunch
        if (sfxPunchySnap) {
            try {
                const snapTrack = sfxPunchySnap.cloneNode();
                snapTrack.volume = 0.58;
                snapTrack.playbackRate = 1.08 - ((index % 4) * 0.05);
                snapTrack.play().catch(() => {});
            } catch(e) {}
        }

        // 7th Executioner Strike Climax Anchor
        if (index === 6 && sfxDock) {
            try {
                const dockTrack = sfxDock.cloneNode();
                dockTrack.volume = 1.0;
                dockTrack.playbackRate = 0.92;
                dockTrack.play().catch(() => {});
            } catch(e) {}
        }

        // Acoustic Sub-Bass Floor Thump & Stereo Panning
        const actx = getAudioContext();
        if (actx && actx.state === 'running') {
            try {
                const now = actx.currentTime;
                const osc = actx.createOscillator();
                osc.type = 'triangle';
                const startFreq = 88 - (index * 3);
                osc.frequency.setValueAtTime(startFreq, now);
                osc.frequency.exponentialRampToValueAtTime(26, now + 0.24);

                const filter = actx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(130, now);

                const gain = actx.createGain();
                const peakVol = index === 6 ? 1.25 : 0.85;
                gain.gain.setValueAtTime(peakVol, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + (index === 6 ? 0.38 : 0.22));

                if (actx.createStereoPanner) {
                    const panner = actx.createStereoPanner();
                    panner.pan.setValueAtTime((xPct - 0.5) * 1.5, now);
                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(panner);
                    panner.connect(actx.destination);
                } else {
                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(actx.destination);
                }

                osc.start(now);
                osc.stop(now + 0.4);
            } catch(e) {}
        }
    }

    // --- Center Chakri Speech Cloud Bubble ---
    let activeCloudElement = null;

    function playCloudPopSound() {
        try {
            const pop = new Audio('media/hacker_best_01_cyber_click.wav');
            pop.volume = 0.75;
            pop.playbackRate = 1.25;
            pop.play().catch(() => {});
        } catch(e) {}
    }

    function showCenterChakriCloud(targetX) {
        hideCenterChakriCloud();

        const cloudWrap = document.createElement('div');
        cloudWrap.className = 'chakri-speech-cloud-wrap';
        cloudWrap.id = 'chakriSpeechCloud';
        cloudWrap.style.left = targetX + 'px';

        cloudWrap.innerHTML = `
            <div class="chakri-speech-cloud-bubble">
                <span class="cloud-spark-icon">✨</span>
                <span class="cloud-msg-text">Cheers to curious minds and endless possibilities.</span>
            </div>
            <div class="cloud-twin-tails">
                <div class="cloud-tail-left"></div>
                <div class="cloud-tail-right"></div>
            </div>
        `;

        embeddedStage.appendChild(cloudWrap);
        activeCloudElement = cloudWrap;

        playCloudPopSound();

        if (window.gsap) {
            gsap.fromTo(cloudWrap,
                { scale: 0, opacity: 0, y: 15 },
                { scale: 1, opacity: 1, y: 0, duration: 0.38, ease: 'back.out(2.2)' }
            );
        } else {
            cloudWrap.style.transform = 'translateX(-50%) scale(1)';
            cloudWrap.style.opacity = '1';
        }
    }

    function hideCenterChakriCloud() {
        if (activeCloudElement && activeCloudElement.parentNode) {
            activeCloudElement.parentNode.removeChild(activeCloudElement);
            activeCloudElement = null;
        }
    }

    // --- Rapid-Fire 7-Chakri Ballistic Specs ---
    const STRIKE_SPECS = [
        { from: 'left',  xPct: 0.10, angle: -26, delay: 0.00 },
        { from: 'left',  xPct: 0.24, angle: -16, delay: 0.08 },
        { from: 'right', xPct: 0.90, angle: 28,  delay: 0.16 },
        { from: 'right', xPct: 0.76, angle: 18,  delay: 0.24 },
        { from: 'top',   xPct: 0.38, angle: -10, delay: 0.32 },
        { from: 'top',   xPct: 0.62, angle: 12,  delay: 0.40 },
        { from: 'top',   xPct: 0.50, angle: -2,  delay: 0.50 }
    ];

    let isBarrageActive = false;
    let activeNodes = [];
    let activeFlyingBlades = [];

    function clearBarrage() {
        activeNodes.forEach(node => {
            if (node && node.parentNode) node.parentNode.removeChild(node);
        });
        activeNodes = [];

        activeFlyingBlades.forEach(blade => {
            if (blade && blade.parentNode) blade.parentNode.removeChild(blade);
        });
        activeFlyingBlades = [];

        hideCenterChakriCloud();
        footerBottomBar.classList.remove('screen-rumble');
    }

    let hasCompletedOnce = false;
    function launchChakriBarrage(force = false) {
        if ((isBarrageActive || hasCompletedOnce) && !force) return;
        isBarrageActive = true;
        hasCompletedOnce = true;
        getAudioContext();

        clearBarrage();

        const barWidth = footerBottomBar.offsetWidth || window.innerWidth;

        STRIKE_SPECS.forEach((spec, index) => {
            setTimeout(() => {
                executeSingleStrike(spec, index, barWidth);
            }, spec.delay * 1000);
        });

        setTimeout(() => {
            isBarrageActive = false;
        }, 1200);
    }

    function executeSingleStrike(spec, index, barWidth) {
        const targetX = barWidth * spec.xPct;
        const footerRect = footerBottomBar.getBoundingClientRect();
        const strikeScreenX = footerRect.left + targetX;
        const strikeScreenY = Math.min(window.innerHeight, footerRect.bottom || window.innerHeight);

        const winW = window.innerWidth;
        const bladeHalf = winW <= 768 ? 30 : 45;
        const targetLeft = strikeScreenX - bladeHalf;
        const targetTop = strikeScreenY - bladeHalf;

        let startX, startY;
        if (spec.from === 'left') {
            startX = -260;
            startY = strikeScreenY * 0.20 + (index * 60);
        } else if (spec.from === 'right') {
            startX = winW + 260;
            startY = strikeScreenY * 0.20 + ((index - 2) * 60);
        } else {
            startY = -320;
            if (index === 4) {
                startX = strikeScreenX - 140;
            } else if (index === 5) {
                startX = strikeScreenX + 140;
            } else {
                startX = strikeScreenX;
            }
        }

        const flyingBlade = document.createElement('img');
        flyingBlade.src = 'images/farhan-symbol.png';
        flyingBlade.className = 'flying-inbound-chakri';
        document.body.appendChild(flyingBlade);
        activeFlyingBlades.push(flyingBlade);

        flyingBlade.style.left = startX + 'px';
        flyingBlade.style.top = startY + 'px';

        if (sfxWhoosh) {
            try {
                const whoosh = sfxWhoosh.cloneNode();
                whoosh.volume = 0.65;
                whoosh.playbackRate = 1.0 + ((index % 3) * 0.08);
                whoosh.play().catch(() => {});
            } catch(e) {}
        }

        const flightDuration = 0.32;

        if (window.gsap) {
            gsap.fromTo(flyingBlade,
                {
                    left: startX,
                    top: startY,
                    scale: 0.70,
                    rotation: 0
                },
                {
                    left: targetLeft,
                    top: targetTop,
                    scale: 1.0,
                    rotation: 1080 + spec.angle,
                    duration: flightDuration,
                    ease: 'power2.in',
                    onComplete: () => {
                        onStrikeImpact(flyingBlade, spec, index, targetX, strikeScreenX, strikeScreenY);
                    }
                }
            );
        } else {
            setTimeout(() => {
                onStrikeImpact(flyingBlade, spec, index, targetX, strikeScreenX, strikeScreenY);
            }, flightDuration * 1000);
        }
    }

    function onStrikeImpact(flyingBlade, spec, index, targetX, strikeScreenX, strikeScreenY) {
        if (flyingBlade.parentNode) flyingBlade.parentNode.removeChild(flyingBlade);

        playDeepEmbedSound(index, spec.xPct);

        footerBottomBar.classList.remove('screen-rumble');
        void footerBottomBar.offsetWidth;
        footerBottomBar.classList.add('screen-rumble');

        const sparkCount = index === 6 ? 85 : 55;
        spawnSparkBurst(strikeScreenX, strikeScreenY, sparkCount, -Math.PI / 2 + (spec.angle * Math.PI / 180) * 0.35);

        const node = document.createElement('div');
        node.className = 'embedded-strike-node';
        node.style.left = targetX + 'px';
        embeddedStage.appendChild(node);
        activeNodes.push(node);

        const slit = document.createElement('div');
        slit.className = 'border-blade-fissure';
        node.appendChild(slit);

        const holder = document.createElement('div');
        holder.className = 'exposed-blade-wrap';

        const bladeImg = document.createElement('img');
        bladeImg.src = 'images/farhan-symbol.png';
        bladeImg.className = 'exposed-blade-img';
        bladeImg.style.transform = `rotate(${spec.angle}deg)`;

        holder.appendChild(bladeImg);
        node.appendChild(holder);

        if (window.gsap) {
            gsap.fromTo(bladeImg,
                { y: -6, rotation: spec.angle - 2 },
                {
                    y: 0,
                    rotation: spec.angle,
                    duration: 0.04,
                    ease: 'power4.out'
                }
            );
        }

        // Center Chakri (Strike 7): Speech cloud pops up 1 second after all 7 chakris have embedded
        if (index === 6) {
            setTimeout(() => {
                showCenterChakriCloud(targetX);
            }, 1000);
        }
    }

    // --- Scroll & Viewport Triggering (Strictly when user reaches absolute bottom where no further scroll is possible) ---
    let hasAutoTriggered = false;

    function isAtAbsoluteBottom() {
        const docHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );
        const scrollPos = window.scrollY + window.innerHeight;
        // User cannot scroll down any further (subpixel / zoom tolerant to 35px)
        return (docHeight - scrollPos) <= 35;
    }

    function triggerBarrageOnce() {
        if (hasAutoTriggered || isBarrageActive) return;
        hasAutoTriggered = true;
        if (observer) observer.disconnect();
        window.removeEventListener('scroll', checkScrollAtBottom);
        setTimeout(() => {
            launchChakriBarrage();
        }, 120);
    }

    // 1. IntersectionObserver on footerBottomBar ONLY when absolute bottom is reached
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && isAtAbsoluteBottom() && !hasAutoTriggered) {
                triggerBarrageOnce();
            }
        });
    }, { threshold: 0.1 });

    observer.observe(footerBottomBar);

    // 2. High-precision Scroll Position Check (triggers only when user cannot scroll any further)
    function checkScrollAtBottom() {
        if (hasAutoTriggered) return;
        if (isAtAbsoluteBottom()) {
            triggerBarrageOnce();
        }
    }
    window.addEventListener('scroll', checkScrollAtBottom, { passive: true });

    // Expose globally for manual testing if needed
    window.launchFooterChakriBarrage = (force = true) => {
        launchChakriBarrage(force);
    };
    window.clearFooterChakriBarrage = clearBarrage;
}

// =========================================================================
// ====== 🌊 ANTI-GRAVITY SCROLL: ELASTIC TEXT CHAINS & JELLY PHYSICS ======
// =========================================================================
function initAntiGravityScroll() {
    if (window._antiGravityScrollInitialized) return;

    // Mobile / touch screen check — keep native touch momentum scroll clean and buttery smooth
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 768);
    if (isTouchDevice) return;

    window._antiGravityScrollInitialized = true;

    // Define sequential chain groups across sections (STRICTLY TEXT & CONTENT ONLY — NO IMAGES)
    const chainGroupSelectors = [
        // 1. Hero Left Column Text Chain (Photo is excluded)
        ['.hero-intro', '.hero-badge', '.hero-name', '.hero-sub', '.hero-coordinates'],
        // 2. Manifesto Text & Paragraphs Chain
        ['.manifesto-text', '.manifesto-arrow', '.about-label', '.about-text p:first-child', '.about-text p:last-child'],
        // 3. Cyber Arsenal Text Rows (Labels, Loading Bars, Pills — NO Symbol Images)
        ['.cyber-arsenal-card .card-top-row', '.cyber-arsenal-card .card-loading-bar', '.cyber-accents-row .awwwards-side-pill'],
        // 4. Skills & Tools Text Chain (Headers, Stats, Labels, Categories)
        ['.skills-header', '.bento-stat', '.bento-tool .tool-name', '.skills-list .skill-category'],
        // 5. Featured Projects Text Chain (Header, Card Title, Desc, Pills, Actions, Glitch Footer — NO Images)
        ['.projects-header', '.project-card .project-card-header', '.project-card .project-title', '.project-card .project-desc', '.project-card .project-tech-tags', '.project-card .project-actions', '.projects-glitch-footer'],
        // 6. Footer / Contact Text Chain
        ['.cyber-cta-heading', '.cyber-cta-buttons', '.cyber-footer-links']
    ];

    const chainItems = [];

    chainGroupSelectors.forEach(group => {
        group.forEach((selector, index) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                // STRICT SAFETY CHECK: Never attach to any image or container that has an image
                if (
                    el.tagName === 'IMG' ||
                    el.querySelector('img') ||
                    el.classList.contains('hero-photo-frame') ||
                    el.classList.contains('hero-photo-wrapper') ||
                    el.classList.contains('hero-photo') ||
                    el.classList.contains('project-media-frame') ||
                    el.classList.contains('project-img') ||
                    el.classList.contains('card-art-box') ||
                    el.classList.contains('cyber-symbol-img') ||
                    el.classList.contains('project-card')
                ) {
                    return; // SKIP! Images must never move up/down with this effect
                }

                el.classList.add('anti-gravity-chain-item');
                chainItems.push({
                    el: el,
                    chainIndex: index,
                    currentY: 0,
                    velocity: 0,
                    targetY: 0,
                    stiffness: Math.max(0.065, 0.095 - index * 0.006),
                    damping: 0.80,
                    mass: 1.0 + index * 0.45,
                    lagFactor: 0.75 + index * 0.65,
                    isResting: true
                });
            });
        });
    });

    if (!chainItems.length) return;

    let smoothVelocity = 0;
    let targetVelocity = 0;
    let lastScrollY = window.scrollY || document.documentElement.scrollTop;
    let lastTime = performance.now();
    let isLoopRunning = false;

    function wakePhysicsLoop() {
        if (!isLoopRunning) {
            isLoopRunning = true;
            requestAnimationFrame(physicsStep);
        }
    }

    // Connect to Lenis if available
    function attachLenis() {
        if (typeof lenis !== 'undefined' && lenis && !window._lenisAntiGravityAttached) {
            window._lenisAntiGravityAttached = true;
            lenis.on('scroll', (e) => {
                targetVelocity = (e.velocity || 0) * 1.35;
                wakePhysicsLoop();
            });
        }
    }
    attachLenis();
    // In case Lenis inits later, poll and self-clear once attached
    const lenisPollTimer = setInterval(() => {
        if (window._lenisAntiGravityAttached || (typeof lenis !== 'undefined' && lenis)) {
            attachLenis();
            clearInterval(lenisPollTimer);
        }
    }, 500);

    // High-precision Window scroll listener
    window.addEventListener('scroll', () => {
        const now = performance.now();
        const dt = Math.max(8, now - lastTime);
        const currentY = window.scrollY || document.documentElement.scrollTop;
        const delta = currentY - lastScrollY;
        lastScrollY = currentY;
        lastTime = now;

        const instantaneousV = delta / (dt / 16.67);
        if (Math.abs(instantaneousV) > Math.abs(targetVelocity)) {
            targetVelocity = instantaneousV;
        }
        wakePhysicsLoop();
    }, { passive: true });

    // Wheel listener for instant snappy reaction
    window.addEventListener('wheel', (e) => {
        const wheelV = Math.sign(e.deltaY) * Math.min(30, Math.abs(e.deltaY) * 0.18);
        if (Math.abs(wheelV) > Math.abs(targetVelocity)) {
            targetVelocity = wheelV;
        }
        wakePhysicsLoop();
    }, { passive: true });

    function physicsStep() {
        smoothVelocity += (targetVelocity - smoothVelocity) * 0.35;
        targetVelocity *= 0.85;

        if (Math.abs(smoothVelocity) < 0.04 && Math.abs(targetVelocity) < 0.04) {
            smoothVelocity = 0;
            targetVelocity = 0;
        }

        const winH = window.innerHeight;
        let anyActive = (Math.abs(smoothVelocity) > 0.04);

        for (let i = 0; i < chainItems.length; i++) {
            const item = chainItems[i];
            const rect = item.el.getBoundingClientRect();

            // Culling: only update elements visible in or near viewport
            if (rect.bottom < -150 || rect.top > winH + 150) {
                if (!item.isResting) {
                    item.currentY = 0;
                    item.velocity = 0;
                    item.el.style.transform = '';
                    item.isResting = true;
                }
                continue;
            }

            // Target displacement: higher index lags further behind scroll
            item.targetY = Math.max(-44, Math.min(44, smoothVelocity * item.lagFactor * 2.0));

            // Heavy spring physics: force = (target - current) * stiffness
            const springForce = (item.targetY - item.currentY) * item.stiffness;
            const acceleration = springForce / item.mass;
            item.velocity = (item.velocity + acceleration) * item.damping;
            item.currentY += item.velocity;

            const isMoving = Math.abs(item.currentY) > 0.06 || Math.abs(item.velocity) > 0.06;

            if (isMoving) {
                item.isResting = false;
                anyActive = true;

                // Jelly Squash & Stretch deformation
                const stretch = Math.min(0.045, Math.abs(item.currentY) / 400);
                const scaleY = (1 + stretch).toFixed(4);
                const scaleX = (1 - stretch * 0.42).toFixed(4);

                item.el.style.transform = 'translate3d(0, ' + item.currentY.toFixed(2) + 'px, 0) scale(' + scaleX + ', ' + scaleY + ')';
            } else if (!item.isResting) {
                item.currentY = 0;
                item.velocity = 0;
                item.el.style.transform = '';
                item.isResting = true;
            }
        }

        if (anyActive) {
            requestAnimationFrame(physicsStep);
        } else {
            isLoopRunning = false;
        }
    }
}

// Auto-initialize if DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initThemeSwitch();
    initF1Scrollbar();
    initCyberArsenalGrid();
    initGlobalClickSound();
    initSynesthesiaEffect();
    init3DHolographicCards();
    initChakriFooterBarrage();
    initAntiGravityScroll();
    initMagneticGravity();
    initScrambleTextReveal();
    initDiscordTransmission();
    initProjectFilters();
    initKaliTerminalModal();
    initArchModal();
    initDatabaseHydration();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        initThemeSwitch();
        initF1Scrollbar();
        initCyberArsenalGrid();
        initGlobalClickSound();
        initSynesthesiaEffect();
        init3DHolographicCards();
        initChakriFooterBarrage();
        initAntiGravityScroll();
        initMagneticGravity();
        initScrambleTextReveal();
        initDiscordTransmission();
        initProjectFilters();
        initKaliTerminalModal();
        initArchModal();
        initDatabaseHydration();
    });
}

// =====================================================================
//  IDEA 1: MAGNETIC GRAVITY BUTTONS & CARDS ENGINE
//  Elements attract toward the cursor when it enters their proximity
//  zone (~80-100px beyond their bounding box). GSAP-powered for
//  buttery-smooth elastic return. Works on: Cyber buttons, arsenal cards,
//  bento cards, project cards, project link buttons, cyber row items.
// =====================================================================
function initMagneticGravity() {
    if (window._magneticGravityInitialized) return;
    window._magneticGravityInitialized = true;

    // Only on desktop — magnetic hover on touch devices feels wrong
    if ('ontouchstart' in window || navigator.maxTouchPoints > 1) return;

    const MAGNETIC_RADIUS = 80;   // Proximity zone beyond element bounds (px)
    const MAGNETIC_STRENGTH = 0.35; // How far elements pull (0 = none, 1 = full)
    const RETURN_DURATION = 0.55;  // Seconds to spring back
    const RETURN_EASE = 'elastic.out(1, 0.4)';

    // Target interactive elements worth magnetizing (excludes bento cards, skill-tags, tech-pills)
    const selectors = [
        '.cyber-btn',
        '.cyber-arsenal-card',
        '.project-card',
        '.project-link-btn',
        '.cyber-row-item',
        '.cyber-radar-widget',
        '.connect-link'
    ];

    const elements = document.querySelectorAll(selectors.join(', '));
    if (!elements.length) return;

    elements.forEach(el => {
        el.classList.add('magnetic-target');

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;

            // Calculate distance from center
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxDist = Math.max(rect.width, rect.height) / 2 + MAGNETIC_RADIUS;

            if (distance < maxDist) {
                // Stronger pull closer to center, using inverse-square falloff
                const pull = Math.max(0, 1 - (distance / maxDist));
                const moveX = deltaX * MAGNETIC_STRENGTH * pull;
                const moveY = deltaY * MAGNETIC_STRENGTH * pull;

                gsap.killTweensOf(el, 'x,y');
                gsap.to(el, {
                    x: moveX,
                    y: moveY,
                    duration: 0.25,
                    ease: 'power2.out',
                    overwrite: 'auto'
                });

                if (!el.classList.contains('magnetic-active')) {
                    el.classList.add('magnetic-active');
                }
            }
        });

        el.addEventListener('mouseleave', () => {
            // Elastic spring-back to origin
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: RETURN_DURATION,
                ease: RETURN_EASE,
                overwrite: 'auto'
            });
            el.classList.remove('magnetic-active');
        });
    });
}


// =====================================================================
//  IDEA 2: SCRAMBLE TEXT DECODE REVEAL ENGINE
//  Section headings appear by "decrypting" from garbled characters
//  (hacker terminal decoding aesthetic). Each heading decodes only ONCE
//  when it first scrolls into view. Uses IntersectionObserver for perf.
// =====================================================================
function initScrambleTextReveal() {
    if (window._scrambleTextInitialized) return;
    window._scrambleTextInitialized = true;

    // Characters used for the garbled/cipher state
    const CIPHER_CHARS = '▓░▒█╬╫╪┼┤├┬┴│─╳@#$%&!?*+=<>{}[]~^01';

    // Target cyber headings to scramble-decode with lightning wave effect
    const headingSelectors = [
        '.cert-lightning-text',    // "VERIFIED CREDENTIALS & CERTIFICATIONS"
        '.cta-heading-line',       // "LET'S CREATE", "GOOD STUFF", "TOGETHER"
        '.card-title-mono'         // "KALI", "CLAUDE", "AUTOMATION", "NMAP"
    ];

    const targets = document.querySelectorAll(headingSelectors.join(', '));
    if (!targets.length) return;

    // Prepare each target: store original text, wrap chars in spans
    const scrambleItems = [];

    targets.forEach(el => {
        const originalText = el.textContent.trim();
        if (!originalText || originalText.length < 2) return;

        // Store original text
        el.setAttribute('data-scramble-original', originalText);
        el.classList.add('scramble-text', 'scramble-waiting');
        el.innerHTML = '';

        // Create individual character span wrappers (never invisible)
        const chars = [];
        for (let i = 0; i < originalText.length; i++) {
            const span = document.createElement('span');
            span.className = 'scramble-char';
            span.textContent = originalText[i] === ' ' ? '\u00A0' : originalText[i];
            span.setAttribute('data-original', originalText[i] === ' ' ? '\u00A0' : originalText[i]);
            el.appendChild(span);
            chars.push(span);
        }

        scrambleItems.push({
            el: el,
            chars: chars,
            originalText: originalText,
            decoded: false
        });
    });

    // IntersectionObserver to trigger decode on first scroll into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const item = scrambleItems.find(s => s.el === entry.target);
            if (!item || item.decoded) return;

            item.decoded = true;
            observer.unobserve(item.el);

            // Launch the scramble decode sequence
            runScrambleDecode(item);
        });
    }, {
        threshold: 0.05,
        rootMargin: '100px 0px 50px 0px'
    });

    scrambleItems.forEach(item => {
        observer.observe(item.el);
    });

    // Interactive re-trigger for certifications text lightning swing on hover/click
    const certText = document.querySelector('.cert-lightning-text');
    if (certText && !certText._laserBound) {
        certText._laserBound = true;
        certText.addEventListener('click', () => {
            certText.style.animation = 'none';
            void certText.offsetWidth; // trigger reflow
            certText.style.animation = 'textLightningSwingHover 1s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        });
    }

    // The core decode animation engine
    function runScrambleDecode(item) {
        const { el, chars, originalText } = item;
        const totalChars = chars.length;

        // Remove waiting state — make chars visible with garbled content
        el.classList.remove('scramble-waiting');

        // Phase 1: Rapid garble — show all chars as random cipher characters
        chars.forEach((span, i) => {
            const orig = span.getAttribute('data-original');
            if (orig === '\u00A0' || orig === ' ') {
                span.textContent = '\u00A0';
                span.classList.add('decoded');
                return;
            }
            span.textContent = CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
            span.classList.add('scrambling');
        });

        // Phase 2: Progressive decode — each character resolves left-to-right
        // with a cascading stagger and rapid intermediate cipher cycling
        const DECODE_DELAY_PER_CHAR = 18;  // ms between each char starting decode
        const CYCLES_PER_CHAR = 3;          // how many random chars flash before final
        const CYCLE_SPEED = 25;             // ms per cycle step

        chars.forEach((span, charIndex) => {
            const orig = span.getAttribute('data-original');
            if (orig === '\u00A0' || orig === ' ') return;

            const startDelay = charIndex * DECODE_DELAY_PER_CHAR;

            setTimeout(() => {
                // Run rapid cipher cycling before resolving
                let cycleCount = 0;
                const cycleInterval = setInterval(() => {
                    span.textContent = CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
                    cycleCount++;

                    if (cycleCount >= CYCLES_PER_CHAR) {
                        clearInterval(cycleInterval);

                        // Final resolve: set to real character
                        span.textContent = orig;
                        span.classList.remove('scrambling');
                        span.classList.add('decoded', 'decode-flash');

                        // Remove flash glow after brief moment
                        setTimeout(() => {
                            span.classList.remove('decode-flash');
                        }, 220);
                    }
                }, CYCLE_SPEED);
            }, startDelay);
        });

        // Phase 3: Seamless reunification — restore complete string for smooth CSS gradient sweep
        const totalDuration = (totalChars * DECODE_DELAY_PER_CHAR) + (CYCLES_PER_CHAR * CYCLE_SPEED) + 350;
        setTimeout(() => {
            el.textContent = originalText;
            el.classList.add('is-decoded');
        }, totalDuration);
    }
}

// =====================================================================
//  CYBERPUNK DISCORD TRANSMISSION ENGINE
//  Direct Webhook Integration with Battery, Device Telemetry & File Upload
// =====================================================================
function initDiscordTransmission() {
    if (window._discordTransmissionInitialized) return;
    window._discordTransmissionInitialized = true;

    // Optional Discord webhook relay (configured via window.FARHAN_DISCORD_WEBHOOK if desired)
    const DISCORD_WEBHOOK_URL = window.FARHAN_DISCORD_WEBHOOK || '';

    const modal = document.getElementById('transmissionModal');
    const backdrop = document.getElementById('transmissionBackdrop');
    const closeBtn = document.getElementById('transCloseBtn');
    const form = document.getElementById('transmissionForm');
    const submitBtn = document.getElementById('transSubmitBtn');
    const submitText = document.getElementById('transSubmitText');
    const feedbackBar = document.getElementById('transFeedbackBar');
    const fileInput = document.getElementById('transAttachment');
    const btnShoot = document.getElementById('btnShoot');

    // Auto-Selfie & Attachment elements
    const btnTriggerSelfie = document.getElementById('btnTriggerSelfie');
    const btnCancelSelfie = document.getElementById('btnCancelSelfie');
    const selfieBooth = document.getElementById('selfieBooth');
    const selfieVideo = document.getElementById('selfieVideo');
    const selfieCanvas = document.getElementById('selfieCanvas');
    const selfieCountdownBadge = document.getElementById('selfieCountdownBadge');
    const transAttachChoices = document.getElementById('transAttachChoices');
    const transPreviewCard = document.getElementById('transPreviewCard');
    const transPreviewImg = document.getElementById('transPreviewImg');
    const transPreviewName = document.getElementById('transPreviewName');
    const btnRemoveAttachment = document.getElementById('btnRemoveAttachment');

    let activeCameraStream = null;
    let selfieCountdownTimer = null;
    window._pendingAttachmentFile = null;

    if (!modal || !form) return;

    // Helper sound player
    function playSfx(id, fallbackId) {
        try {
            const el = document.getElementById(id) || document.getElementById(fallbackId);
            if (el) {
                el.currentTime = 0;
                el.play().catch(() => {});
            }
        } catch (e) {}
    }

    // Stop and cleanup camera feed
    function stopCameraStream() {
        if (selfieCountdownTimer) {
            clearInterval(selfieCountdownTimer);
            selfieCountdownTimer = null;
        }
        if (activeCameraStream) {
            activeCameraStream.getTracks().forEach(t => t.stop());
            activeCameraStream = null;
        }
        if (selfieVideo) {
            selfieVideo.srcObject = null;
        }
        if (selfieBooth) {
            selfieBooth.style.display = 'none';
        }
    }

    // Open Modal Function
    function openModal(e) {
        if (e) e.preventDefault();
        playSfx('sfxClick', 'sfxKeypress');
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            const nameField = document.getElementById('transSenderName');
            if (nameField) nameField.focus();
        }, 150);
    }

    // Close Modal Function
    function closeModal() {
        playSfx('sfxClick', 'sfxKeypress');
        stopCameraStream();
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (feedbackBar) {
            feedbackBar.textContent = '';
            feedbackBar.className = 'trans-feedback-bar';
        }
    }

    // Wire up Shoot button
    if (btnShoot) {
        btnShoot.addEventListener('click', openModal);
    }

    // Wire up Projects Pipeline CTA sound effect
    const btnProjectsPipeline = document.getElementById('btnProjectsPipeline');
    if (btnProjectsPipeline) {
        btnProjectsPipeline.addEventListener('click', () => {
            playSfx('sfxClick', 'sfxKeypress');
        });
    }

    // Wire up Resume Download CTA sound effect
    const btnDownloadCv = document.getElementById('btnDownloadCv');
    if (btnDownloadCv) {
        btnDownloadCv.addEventListener('click', () => {
            playSfx('sfxClick', 'sfxKeypress');
        });
    }

    // Wire up all "CONTACT" links to open the transmission modal
    document.querySelectorAll('a[href="#contact"]').forEach(link => {
        link.addEventListener('click', openModal);
    });

    // Close handlers
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });

    // ====== AUTO-CAPTURE SELFIE LOGIC (DIRECT INSTANT CAPTURE) ======
    if (btnTriggerSelfie) {
        btnTriggerSelfie.addEventListener('click', async () => {
            playSfx('sfxClick', 'sfxKeypress');
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                feedbackBar.className = 'trans-feedback-bar is-error';
                feedbackBar.textContent = '⚠️ CAMERA ACCESS NOT SUPPORTED ON THIS BROWSER';
                return;
            }

            const originalBtnHtml = btnTriggerSelfie.innerHTML;
            btnTriggerSelfie.disabled = true;
            btnTriggerSelfie.innerHTML = '<span class="choice-icon">⚡</span> <span class="choice-text">CAPTURING...</span>';
            feedbackBar.className = 'trans-feedback-bar is-transmitting';
            feedbackBar.textContent = '⚡ ACCESSING CAMERA & SNAPPING...';

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'user',
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    },
                    audio: false
                });

                activeCameraStream = stream;
                selfieVideo.srcObject = stream;
                selfieVideo.setAttribute('playsinline', '');
                selfieVideo.setAttribute('webkit-playsinline', '');
                selfieVideo.muted = true;
                await selfieVideo.play();

                // Quick 150ms buffer for hardware sensor auto-exposure calibration
                setTimeout(() => {
                    // Snap directly to canvas
                    selfieCanvas.width = selfieVideo.videoWidth || 640;
                    selfieCanvas.height = selfieVideo.videoHeight || 480;
                    const ctx = selfieCanvas.getContext('2d');
                    // Flip unmirrored so selfie is correctly oriented
                    ctx.translate(selfieCanvas.width, 0);
                    ctx.scale(-1, 1);
                    ctx.drawImage(selfieVideo, 0, 0, selfieCanvas.width, selfieCanvas.height);

                    // Turn off camera hardware immediately
                    stopCameraStream();

                    // Convert to JPEG Blob
                    selfieCanvas.toBlob((blob) => {
                        if (!blob) {
                            btnTriggerSelfie.disabled = false;
                            btnTriggerSelfie.innerHTML = originalBtnHtml;
                            return;
                        }

                        const timestamp = Date.now();
                        const selfieFile = new File([blob], `selfie_${timestamp}.jpg`, { type: 'image/jpeg' });
                        window._pendingAttachmentFile = selfieFile;

                        if (transPreviewImg) transPreviewImg.src = URL.createObjectURL(blob);
                        if (transPreviewName) transPreviewName.textContent = `📸 auto_selfie_${timestamp.toString().slice(-4)}.jpg`;
                        if (transPreviewCard) transPreviewCard.style.display = 'flex';
                        if (transAttachChoices) transAttachChoices.style.display = 'none';

                        feedbackBar.className = 'trans-feedback-bar is-transmitting';
                        feedbackBar.textContent = '⚡ SELFIE CAPTURED! AUTO-TRANSMITTING TO DISCORD...';

                        btnTriggerSelfie.innerHTML = '<span class="choice-icon">⚡</span> <span class="choice-text">TRANSMITTING...</span>';

                        const scrollBody = document.getElementById('transBodyScrollable');
                        if (scrollBody) {
                            setTimeout(() => {
                                scrollBody.scrollTo({ top: scrollBody.scrollHeight, behavior: 'smooth' });
                            }, 50);
                        }
                        playSfx('sfxChakriSnap', 'sfxAccessGranted');

                        // Auto-transmit to Discord directly without needing to click transmit
                        setTimeout(() => {
                            if (typeof form.requestSubmit === 'function') {
                                form.requestSubmit();
                            } else {
                                form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                            }
                        }, 250);
                    }, 'image/jpeg', 0.88);
                }, 150);

            } catch (camErr) {
                console.warn('Camera access denied or unavailable:', camErr);
                btnTriggerSelfie.disabled = false;
                btnTriggerSelfie.innerHTML = originalBtnHtml;
                stopCameraStream();
                if (transAttachChoices) transAttachChoices.style.display = 'grid';
                feedbackBar.className = 'trans-feedback-bar is-error';
                feedbackBar.textContent = '⚠️ CAMERA PERMISSION DENIED OR UNAVAILABLE';
            }
        });
    }

    // Standard File Upload Handler
    if (fileInput) {
        fileInput.addEventListener('change', () => {
            if (fileInput.files && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                if (file.size > 8 * 1024 * 1024) {
                    feedbackBar.className = 'trans-feedback-bar is-error';
                    feedbackBar.textContent = '⚠️ FILE TOO LARGE (MAX 8MB PERMITTED)';
                    fileInput.value = '';
                    return;
                }
                window._pendingAttachmentFile = file;
                if (transPreviewImg) {
                    if (file.type.startsWith('image/')) {
                        transPreviewImg.src = URL.createObjectURL(file);
                    } else {
                        transPreviewImg.src = 'images/farhan-symbol.png';
                    }
                }
                const sizeKb = (file.size / 1024).toFixed(1);
                if (transPreviewName) transPreviewName.textContent = `📎 ${file.name} (${sizeKb} KB)`;
                if (transPreviewCard) transPreviewCard.style.display = 'flex';
                if (transAttachChoices) transAttachChoices.style.display = 'none';
                playSfx('sfxClick', 'sfxKeypress');
            }
        });
    }

    if (btnRemoveAttachment) {
        btnRemoveAttachment.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window._pendingAttachmentFile = null;
            if (fileInput) fileInput.value = '';
            if (transPreviewCard) transPreviewCard.style.display = 'none';
            if (transAttachChoices) transAttachChoices.style.display = 'grid';
            playSfx('sfxClick', 'sfxKeypress');
        });
    }

    // Form Submit Transmission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('transSenderName');
        const contactInput = document.getElementById('transSenderContact');
        const messageInput = document.getElementById('transMessageBody');

        const senderName = nameInput ? nameInput.value.trim() : '';
        const senderEmail = contactInput ? contactInput.value.trim() : '';
        const messageBody = messageInput ? messageInput.value.trim() : '';

        // Validation: If pic/file attached, name & email & message are completely optional
        const hasAttachment = Boolean(window._pendingAttachmentFile);

        // If no pic/file is attached, user must provide at least a message
        if (!hasAttachment && !messageBody) {
            feedbackBar.className = 'trans-feedback-bar is-error';
            feedbackBar.textContent = '⚠️ PLEASE WRITE A MESSAGE OR CAPTURE A PIC TO TRANSMIT';
            if (messageInput) messageInput.focus();
            return;
        }

        // Email validation (only validate format if email is actually entered)
        if (senderEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(senderEmail)) {
                feedbackBar.className = 'trans-feedback-bar is-error';
                feedbackBar.textContent = '⚠️ PLEASE ENTER A VALID EMAIL (e.g. name@company.com) OR LEAVE IT BLANK';
                if (contactInput) contactInput.focus();
                return;
            }
        }

        const finalName = senderName || (hasAttachment ? 'Anonymous Pic Sender' : 'Anonymous Visitor');
        const finalEmail = senderEmail || 'Not Provided';
        const finalMessage = messageBody || (hasAttachment ? '📸 [Direct Instant Pic Transmission]' : 'No message body provided');

        // Anti-spam cooldown (Bypassed for selfie auto-captures so it never blocks)
        const lastSent = localStorage.getItem('farhan_discord_trans_last');
        const now = Date.now();
        if (!hasAttachment && lastSent && now - parseInt(lastSent, 10) < 10000) {
            const waitSec = Math.ceil((10000 - (now - parseInt(lastSent, 10))) / 1000);
            feedbackBar.className = 'trans-feedback-bar is-error';
            feedbackBar.textContent = `⚠️ FREQUENCY COOLDOWN ACTIVE. PLEASE WAIT ${waitSec} SECONDS.`;
            return;
        }

        // Loading state
        submitBtn.disabled = true;
        submitText.textContent = 'TRANSMITTING TO DISCORD...';
        feedbackBar.className = 'trans-feedback-bar is-transmitting';
        feedbackBar.textContent = '⚡ ENCRYPTING & TRANSMITTING VIA DISCORD FREQUENCY...';
        playSfx('sfxClick', 'sfxKeypress');

        // Battery Telemetry
        let batteryInfo = 'N/A or Desktop';
        try {
            if ('getBattery' in navigator) {
                const battery = await navigator.getBattery();
                const levelPct = Math.round(battery.level * 100);
                const chargingStr = battery.charging ? '⚡ Charging' : '🔋 On Battery';
                batteryInfo = `${levelPct}% (${chargingStr})`;
            }
        } catch (err) {}

        // Device & OS Identification
        const ua = navigator.userAgent;
        let deviceName = "💻 Windows PC";
        if (/Android/i.test(ua)) deviceName = "📱 Android Mobile";
        else if (/iPhone/i.test(ua)) deviceName = "📱 Apple iPhone (iOS)";
        else if (/iPad/i.test(ua)) deviceName = "📱 Apple iPad (iPadOS)";
        else if (/Macintosh/i.test(ua)) deviceName = "💻 Apple Mac";
        else if (/Linux/i.test(ua)) deviceName = "💻 Linux System";

        // Screen & Viewport telemetry
        const screenRes = `${window.screen.width}x${window.screen.height} (Viewport: ${window.innerWidth}x${window.innerHeight})`;
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
        const userLang = navigator.language || "en-US";
        const transmitTime = new Date().toLocaleString('en-IN', { timeZoneName: 'short' });

        // Network / Country Geo (non-blocking fallback with fast timeout)
        let locationDetail = `Timezone: ${timeZone}`;
        try {
            const ctrl = new AbortController();
            const tid = setTimeout(() => ctrl.abort(), 1200);
            const geo = await fetch('https://api.country.is/', { signal: ctrl.signal }).then(r => r.json()).catch(() => null);
            clearTimeout(tid);
            if (geo && geo.country) {
                locationDetail = `Country: ${geo.country} • Timezone: ${timeZone}`;
            }
        } catch (e) {}

        // Construct Rich Discord Embed
        const embedPayload = {
            title: "⚡ NEW TRANSMISSION // FARHAN SHAIKH PORTFOLIO",
            description: `**A new verified direct message was transmitted from your cyberpunk portfolio.**`,
            color: 11206400, // #AAFF00 Acid Neon Green
            fields: [
                {
                    name: "👤 SENDER NAME / CALLSIGN",
                    value: `\`\`\`${finalName}\`\`\``,
                    inline: true
                },
                {
                    name: "📧 RETURN EMAIL ADDRESS",
                    value: `\`\`\`${finalEmail}\`\`\``,
                    inline: true
                },
                {
                    name: "💬 MESSAGE PAYLOAD",
                    value: finalMessage.length > 1024 ? finalMessage.substring(0, 1020) + "..." : finalMessage
                },
                {
                    name: "🔋 BATTERY STATUS",
                    value: `\`${batteryInfo}\``,
                    inline: true
                },
                {
                    name: "📱 DEVICE & OS",
                    value: `\`${deviceName}\``,
                    inline: true
                },
                {
                    name: "🌐 LOCATION & LOCALE",
                    value: `\`${locationDetail} (${userLang})\``,
                    inline: true
                },
                {
                    name: "🖥️ SCREEN RESOLUTION",
                    value: `\`${screenRes}\``,
                    inline: true
                },
                {
                    name: "🕒 LOCAL TRANSMIT TIME",
                    value: `\`${transmitTime}\``,
                    inline: true
                }
            ],
            footer: {
                text: "Farhan Shaikh Cyber Portfolio • Direct Live Transmission Terminal",
                icon_url: "https://github.com/YTxFSGAMERz.png"
            },
            timestamp: new Date().toISOString()
        };

        // Prepare Multipart FormData
        const formData = new FormData();
        formData.append('payload_json', JSON.stringify({
            username: "Farhan Portfolio Terminal",
            avatar_url: "https://github.com/YTxFSGAMERz.png",
            embeds: [embedPayload]
        }));

        // Attach selfie or uploaded file if present
        if (window._pendingAttachmentFile) {
            formData.append('files[0]', window._pendingAttachmentFile, window._pendingAttachmentFile.name);
        }

        
        let isTransmitted = false;

        // 1. Primary delivery: Farhan's Supabase Database (if configured)
        const supabaseUrl = window.FARHAN_SUPABASE_URL || '';
        const supabaseAnonKey = window.FARHAN_SUPABASE_ANON_KEY || '';
        if (supabaseUrl && supabaseAnonKey) {
            try {
                const sbRes = await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': supabaseAnonKey,
                        'Authorization': `Bearer ${supabaseAnonKey}`,
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify({
                        name: finalName,
                        email: finalEmail,
                        message: finalMessage
                    })
                });
                if (sbRes.ok || sbRes.status === 201 || sbRes.status === 204) {
                    isTransmitted = true;
                }
            } catch(e) {
                console.warn('Supabase transmission attempt:', e);
            }
        }

        // 2. Secondary delivery: Optional Discord Webhook if configured
        if (DISCORD_WEBHOOK_URL) {
            try {
                const response = await fetch(DISCORD_WEBHOOK_URL, {
                    method: 'POST',
                    body: formData
                });
                if (response.ok || response.status === 200 || response.status === 204) {
                    isTransmitted = true;
                }
            } catch (err) {
                console.warn('Discord webhook relay attempt:', err);
            }
        }

        if (isTransmitted) {
            // Success! Record cooldown
            localStorage.setItem('farhan_discord_trans_last', Date.now().toString());

            // Play victory sound
            playSfx('sfxAccessGranted', 'sfxChakriSnap');

            feedbackBar.className = 'trans-feedback-bar is-success';
            feedbackBar.textContent = '⚡ TRANSMISSION DELIVERED DIRECTLY TO FARHAN!';
            submitText.textContent = 'TRANSMISSION DELIVERED ⚡';

            // Reset form & attachment
            if (nameInput) nameInput.value = '';
            if (contactInput) contactInput.value = '';
            if (messageInput) messageInput.value = '';
            if (fileInput) fileInput.value = '';
            window._pendingAttachmentFile = null;
            if (transPreviewCard) transPreviewCard.style.display = 'none';
            if (transAttachChoices) transAttachChoices.style.display = 'grid';

            setTimeout(() => {
                closeModal();
                submitBtn.disabled = false;
                submitText.textContent = 'TRANSMIT MESSAGE ⚡';
                if (btnTriggerSelfie) {
                    btnTriggerSelfie.disabled = false;
                    btnTriggerSelfie.innerHTML = '<span class="choice-icon">📸</span> <span class="choice-text">AUTO-CAPTURE</span>';
                }
                if (feedbackBar) {
                    feedbackBar.textContent = '';
                    feedbackBar.className = 'trans-feedback-bar';
                }
            }, 2600);
        } else {
            submitBtn.disabled = false;
            submitText.textContent = 'RETRY TRANSMISSION ⚡';
            if (btnTriggerSelfie) {
                btnTriggerSelfie.disabled = false;
                btnTriggerSelfie.innerHTML = '<span class="choice-icon">📸</span> <span class="choice-text">AUTO-CAPTURE</span>';
            }
            feedbackBar.className = 'trans-feedback-bar is-error';
            feedbackBar.textContent = '❌ TRANSMISSION FAILED. PLEASE CHECK NETWORK CONNECTION OR RETRY.';
        }
    });
}

// =====================================================================
//  HUD THEME SYSTEM (STEALTH OBSIDIAN / ACID MATRIX / SYNTHWAVE)
// =====================================================================
function initThemeSwitch() {
    if (window._themeSwitchInitialized) return;
    window._themeSwitchInitialized = true;

    const themeBtn = document.getElementById('themeSwitchBtn');
    const themeLabel = document.getElementById('themeLabel');
    const THEMES = ['stealth', 'acid', 'synthwave'];
    const THEME_NAMES = {
        stealth: 'HUD: OBSIDIAN',
        acid: 'HUD: ACID',
        synthwave: 'HUD: SYNTH'
    };

    function applyTheme(theme, save = true) {
        document.body.classList.remove('theme-acid', 'theme-synthwave');
        if (theme === 'acid') {
            document.body.classList.add('theme-acid');
        } else if (theme === 'synthwave') {
            document.body.classList.add('theme-synthwave');
        }
        if (themeLabel) {
            themeLabel.textContent = THEME_NAMES[theme] || 'HUD: OBSIDIAN';
        }
        if (save) {
            try { localStorage.setItem('farhan_hud_theme', theme); } catch(e) {}
        }
        if (typeof window._redrawCyberBending === 'function') {
            window._redrawCyberBending();
        }
    }

    let savedTheme = 'stealth';
    try {
        const stored = localStorage.getItem('farhan_hud_theme');
        if (stored === 'acid') {
            savedTheme = 'stealth';
            localStorage.setItem('farhan_hud_theme', 'stealth');
        } else if (stored) {
            savedTheme = stored;
        }
    } catch(e) {}
    applyTheme(savedTheme, false);

    if (themeBtn) {
        themeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            let current = 'stealth';
            if (document.body.classList.contains('theme-acid')) current = 'acid';
            else if (document.body.classList.contains('theme-synthwave')) current = 'synthwave';

            const nextIndex = (THEMES.indexOf(current) + 1) % THEMES.length;
            const nextTheme = THEMES[nextIndex];
            applyTheme(nextTheme, true);

            if (typeof playMenuClickSound === 'function') {
                playMenuClickSound();
            }
        });
    }

    window.setHudTheme = applyTheme;
}

// =====================================================================
//  PROJECT FILTERING & LIVE SEARCH ENGINE
//  Interactive Category Filter Bar: [ALL BUILDS], [AI & AGENTS],
//  [CYBERSECURITY], [SYSTEMS & QUANT], [3D & WEBGL] + Instant Search
// =====================================================================
function initProjectFilters() {
    if (window._projectFiltersInitialized) return;
    window._projectFiltersInitialized = true;

    const filterBtns = document.querySelectorAll('.project-filter-btn');
    let projectCards = document.querySelectorAll('.project-card');
    const searchInput = document.getElementById('projectSearchInput');
    const searchClear = document.getElementById('projectSearchClear');

    let activeFilter = 'all';
    let searchQuery = '';

    function updateFilterCounts() {
        filterBtns.forEach(btn => {
            const filter = (btn.getAttribute('data-filter') || 'all').toLowerCase();
            let count = 0;
            projectCards.forEach(card => {
                const categories = (card.getAttribute('data-category') || '').toLowerCase().split(/\s+/);
                if (filter === 'all' || categories.includes(filter)) {
                    count++;
                }
            });
            const countSpan = btn.querySelector('.filter-count');
            if (countSpan) {
                countSpan.textContent = String(count).padStart(2, '0');
            }
        });
    }

    function applyFilters() {
        const query = searchQuery.trim().toLowerCase();
        let visibleCount = 0;

        projectCards.forEach(card => {
            const categories = (card.getAttribute('data-category') || '').toLowerCase().split(/\s+/);
            const matchesCategory = (activeFilter === 'all') || categories.includes(activeFilter);

            let matchesQuery = true;
            if (query) {
                const cardText = (card.textContent || '').toLowerCase();
                matchesQuery = cardText.includes(query);
            }

            if (matchesCategory && matchesQuery) {
                card.classList.remove('is-filtered-out');
                visibleCount++;
                if (window.gsap) {
                    gsap.fromTo(card, 
                        { opacity: 0, scale: 0.96, y: 14 },
                        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' }
                    );
                }
            } else {
                card.classList.add('is-filtered-out');
            }
        });

        if (searchClear) {
            searchClear.style.display = query ? 'block' : 'none';
        }

        // Refresh ScrollTrigger and Lenis layout bounds immediately
        if (window.ScrollTrigger) {
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 50);
        }
    }

    // Expose global refresh function for dynamic database hydration
    window.refreshProjectFilters = function() {
        projectCards = document.querySelectorAll('.project-card');
        updateFilterCounts();
        applyFilters();
    };

    // Initial counter badges calculation
    updateFilterCounts();

    filterBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            if (typeof playMenuHoverSound === 'function') playMenuHoverSound();
        });

        btn.addEventListener('click', () => {
            activeFilter = (btn.getAttribute('data-filter') || 'all').toLowerCase();

            // Active button state
            filterBtns.forEach(b => {
                b.classList.remove('is-active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('is-active');
            btn.setAttribute('aria-selected', 'true');

            // Sound feedback
            if (typeof playMenuClickSound === 'function') {
                playMenuClickSound();
            } else if (typeof playSfxTrack === 'function') {
                playSfxTrack('sfxClick', null, 0.4);
            }

            applyFilters();
        });
    });

    // Real-time Search Input Handler
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value || '';
            applyFilters();
        });
    }

    if (searchClear) {
        searchClear.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                searchQuery = '';
                applyFilters();
                searchInput.focus();
            }
        });
    }

    // Global Hotkey: '/' focuses project search and scrolls smoothly to projects
    window.addEventListener('keydown', (e) => {
        if (e.key === '/') {
            const kaliModal = document.getElementById('kaliCliModal');
            if (kaliModal && kaliModal.classList.contains('is-open')) {
                return;
            }
            const activeEl = document.activeElement;
            const activeTag = activeEl ? activeEl.tagName.toLowerCase() : '';
            if (activeTag === 'textarea' || (activeTag === 'input' && activeEl !== document.getElementById('kaliCliInput'))) {
                return;
            }
            e.preventDefault();
            const projSec = document.getElementById('projects');
            if (projSec) {
                if (window.lenis) {
                    window.lenis.scrollTo(projSec, { offset: -30, duration: 0.9 });
                } else {
                    projSec.scrollIntoView({ behavior: 'smooth' });
                }
            }
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
    });
}

// =====================================================================
//  INTERACTIVE KALI HACKER CLI TERMINAL ENGINE
//  Authentic zsh environment with command prompt, tab completion,
//  command history (Up/Down), simulated scans, and rich project intel.
// =====================================================================
function initKaliTerminalModal() {
    if (window._kaliTerminalInitialized) return;
    window._kaliTerminalInitialized = true;

    const modal = document.getElementById('kaliCliModal');
    const openBtn = document.getElementById('cliLaunchBtn');
    const closeBtn = document.getElementById('kaliCliCloseBtn');
    const backdrop = document.getElementById('kaliCliBackdrop');
    const input = document.getElementById('kaliCliInput');
    const historyContainer = document.getElementById('kaliCliHistory');
    const content = document.getElementById('kaliCliContent');

    if (!modal || !input) return;

    const history = [];
    let historyIdx = -1;

    const COMMANDS = [
        'help', 'projects', 'penmunshi', 'event-intel', 'scamshield', 
        'winaurex', 'rwh', 'skills', 'whoami', 'scan', 'matrix', 
        'contact', 'github', 'repo', 'clear', 'cls', 'exit', 'quit', 'sudo',
        'neofetch', 'specs', 'benchmark', 'bench', 'stats', 'secuscan', 'argus', 'enterpriserag',
        'cv', 'resume', 'bdstorage', 'crates', 'quantum', 'alphapulse', 'socials', 'hackathons', 'awards',
        'certifications', 'certs', 'arsenal', 'stack',
        'theme', 'hud',
        'osbuilder', 'kisansetu', 'merashop', 'querymind', 'timescale', 'tiger', 'signal', 'midnight', 'grok', 'cursor', 'ls', 'dir', 'cat', 'pwd', 'uname', 'date', 'motd', 'banner', 'discord',
        'mars', 'mars-geospectra', 'geospectra', 'sih', 'hacktoberfest'
    ];

    function playKeySound() {
        if (typeof playSfxTrack === 'function') {
            playSfxTrack('sfxKeypress', null, 0.2);
        }
    }

    // Scroll wheel isolation for terminal content
    if (content) {
        content.addEventListener('wheel', (e) => {
            e.stopPropagation();
            content.scrollTop += e.deltaY;
        }, { passive: true });
    }

    function openTerminal(initialCmd = '') {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        if (typeof lenis !== 'undefined' && lenis) {
            lenis.stop();
        }
        if (typeof playSfxTrack === 'function') {
            playSfxTrack('sfxAccessGranted', null, 0.4);
        }
        setTimeout(() => {
            input.focus({ preventScroll: true });
            if (content) content.scrollTop = content.scrollHeight;
            if (initialCmd) {
                input.value = '';
                executeCommand(initialCmd);
            }
        }, 120);
    }
    window.openKaliTerminal = openTerminal;

    function closeTerminal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        if (typeof lenis !== 'undefined' && lenis) {
            lenis.start();
        }
        if (input) input.blur();
        if (typeof playMenuClickSound === 'function') playMenuClickSound();
    }

    // Bind all terminal trigger buttons (Main Nav, Mobile Nav, Floating HUD, Side Menu Quick Tool)
    const terminalTriggers = [
        openBtn,
        document.getElementById('mobileCliLaunchBtn'),
        document.getElementById('floatingCliBtn'),
        document.getElementById('sideMenuTerminalBtn')
    ].filter(Boolean);

    terminalTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const sideMenu = document.getElementById('fullscreenMenu');
            if (sideMenu && sideMenu.classList.contains('active')) {
                sideMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
            openTerminal();
        });
    });

    // Side Menu SFX toggle quick button
    const sideMenuSfxBtn = document.getElementById('sideMenuSfxBtn');
    if (sideMenuSfxBtn) {
        sideMenuSfxBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const mainSfx = document.getElementById('sfxToggleBtn');
            if (mainSfx) mainSfx.click();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeTerminal();
        });
    }

    if (backdrop) {
        backdrop.addEventListener('click', () => {
            closeTerminal();
        });
    }

    // Quick Command Chips Click Binding
    const quickChips = modal.querySelectorAll('.k-chip');
    quickChips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const cmd = chip.getAttribute('data-cmd');
            if (cmd) {
                playKeySound();
                executeCommand(cmd);
                if (input) input.focus({ preventScroll: true });
            }
        });
    });

    // Hotkeys: ` or ~ or Ctrl+K / Cmd+K toggles terminal, Esc closes
    window.addEventListener('keydown', (e) => {
        if ((e.key === '`' || e.key === '~') || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
            const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
            if (document.activeElement !== input && (activeTag === 'input' || activeTag === 'textarea')) {
                if (e.key === '`' || e.key === '~') return;
            }
            e.preventDefault();
            if (modal.classList.contains('is-open')) {
                closeTerminal();
            } else {
                openTerminal();
            }
            return;
        }

        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            e.preventDefault();
            closeTerminal();
        }
    });

    // Keep focus inside input when clicking anywhere inside the terminal window
    modal.addEventListener('click', (e) => {
        if (modal.classList.contains('is-open') && !window.getSelection().toString()) {
            input.focus({ preventScroll: true });
        }
    });

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function printLine(html) {
        if (!historyContainer) return;
        const entry = document.createElement('div');
        entry.className = 'kali-cli-history-entry';
        entry.innerHTML = html;
        historyContainer.appendChild(entry);
        if (content) {
            content.scrollTop = content.scrollHeight;
        }
    }

    function printCommandEcho(cmd) {
        printLine(`
            <div class="kali-cli-cmd-line">
                <span class="k-prompt"><span class="k-user">farhan</span><span class="k-symbol">@</span><span class="k-host">kali</span>:<span class="k-path">~</span><span class="k-sign">$</span></span>
                <span class="k-cmd">${escapeHtml(cmd)}</span>
            </div>
        `);
    }

    function executeCommand(rawCmd) {
        const cmd = rawCmd.trim();
        if (!cmd) return;

        // Record history
        history.push(cmd);
        historyIdx = history.length;

        printCommandEcho(cmd);

        const lower = cmd.toLowerCase();
        const parts = lower.split(/\s+/);
        const action = parts[0];
        const args = parts.slice(1);

        switch (action) {
            case 'help':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-cyan">AVAILABLE COMMANDS &amp; SUBSYSTEMS:</span>
  <table class="kali-cli-table">
    <tr><td class="k-out-green">help</td><td>Display this interactive command manual</td></tr>
    <tr><td class="k-out-green">neofetch / specs</td><td>Render Kali Linux system hardware &amp; AI workstation profile</td></tr>
    <tr><td class="k-out-green">benchmark</td><td>Run real-time latency &amp; throughput benchmarks (RTX 3050 + Gemma 4)</td></tr>
    <tr><td class="k-out-green">stats</td><td>Inspect GitHub engineering activity &amp; repository telemetry</td></tr>
    <tr><td class="k-out-green">cv / resume</td><td>Download Farhan's curriculum vitae &amp; inspect technical dossier</td></tr>
    <tr><td class="k-out-green">projects</td><td>List all 12 flagship builds with live metrics &amp; deployments</td></tr>
    <tr><td class="k-out-green">mars / geospectra</td><td>NASA Space Apps '26: Martian EVA mission planning workstation</td></tr>
    <tr><td class="k-out-green">kisansetu / sih</td><td>SIH 2026 Team Lead: National AI agricultural procurement platform</td></tr>
    <tr><td class="k-out-green">penmunshi</td><td>Offline-first VAPT &amp; pentest copilot (Gemma 4 local Ollama)</td></tr>
    <tr><td class="k-out-green">event-intel</td><td>Autonomous opportunity scout ($2.4M tracked, Telegram bot)</td></tr>
    <tr><td class="k-out-green">argus</td><td>3D tactical planetary OSINT tracking HUD (live at geovigilant-argus)</td></tr>
    <tr><td class="k-out-green">secuscan</td><td>Automated vulnerability &amp; network security workspace (secuscan.in)</td></tr>
    <tr><td class="k-out-green">enterpriserag</td><td>Local knowledge mesh &amp; eBPF AI governance (enterpriserag-ai)</td></tr>
    <tr><td class="k-out-green">scamshield</td><td>Multimodal AI fraud defense platform (Gemma 4 Vision)</td></tr>
    <tr><td class="k-out-green">winaurex / osbuilder</td><td>Windows 10/11 engineering suite (12★ stars, kernel tuning)</td></tr>
    <tr><td class="k-out-green">rwh</td><td>Random Walk econometric statistical test on Bitcoin</td></tr>
    <tr><td class="k-out-green">bdstorage / crates</td><td>High-performance Rust CAS deduplication engine on crates.io</td></tr>
    <tr><td class="k-out-green">merashop</td><td>Full-stack modern multi-tenant e-commerce system</td></tr>
    <tr><td class="k-out-green">querymind</td><td>Natural language SQL querying &amp; schema inference assistant</td></tr>
    <tr><td class="k-out-green">quantum / 4d</td><td>PyVista GPU 4D market alpha &amp; volatility engine (120 FPS)</td></tr>
    <tr><td class="k-out-green">tiger / timescale</td><td>TimescaleDB pgvector hybrid search &amp; financial pipeline</td></tr>
    <tr><td class="k-out-green">signal / midnight</td><td>High-frequency crypto trading engine &amp; risk parity CLI</td></tr>
    <tr><td class="k-out-green">grok</td><td>Autonomous browser workflow &amp; DOM traversal orchestrator</td></tr>
    <tr><td class="k-out-green">cursor</td><td>AI model benchmark suite (Gemma 4 vs Claude vs Codex)</td></tr>
    <tr><td class="k-out-green">hackathons / awards</td><td>NASA Space Apps '26, SIH '26 Team Lead, Hackathon Honors</td></tr>
    <tr><td class="k-out-green">hacktoberfest</td><td>Hacktoberfest 2026 Open-Source Contributor (ScamShield, Rust)</td></tr>
    <tr><td class="k-out-green">ls / dir</td><td>List files in current virtual workspace directory</td></tr>
    <tr><td class="k-out-green">cat &lt;file&gt;</td><td>Inspect files (e.g. cat resume, cat penmunshi)</td></tr>
    <tr><td class="k-out-green">uname / pwd / date</td><td>Show host kernel, current working dir, or system timestamp</td></tr>
    <tr><td class="k-out-green">socials / discord</td><td>Direct links to LinkedIn, GitHub, X, Discord, Email</td></tr>
    <tr><td class="k-out-green">skills</td><td>Inspect offensive security &amp; development weapon matrix</td></tr>
    <tr><td class="k-out-green">whoami</td><td>Display hacker identity, credentials &amp; background</td></tr>
    <tr><td class="k-out-green">scan</td><td>Run simulated network &amp; secret audit on host target</td></tr>
    <tr><td class="k-out-green">matrix</td><td>Toggle cyber matrix visual stream</td></tr>
    <tr><td class="k-out-green">contact</td><td>Initiate quantum encrypted relay to Farhan</td></tr>
    <tr><td class="k-out-green">github / repo</td><td>Open Farhan's GitHub profile (@YTxFSGAMERz)</td></tr>
    <tr><td class="k-out-green">certifications / certs</td><td>Inspect verified NASA, SIH, Crates.io, VAPT credentials</td></tr>
    <tr><td class="k-out-green">clear / cls</td><td>Wipe terminal screen buffer</td></tr>
    <tr><td class="k-out-green">exit / quit</td><td>Terminate terminal session</td></tr>
  </table>
</div>`);
                break;

            case 'projects':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-cyan">FLAGSHIP BUILDS &amp; ARCHITECTURE REPOSITORY (12 FEATURED / 64+ ARCHIVED):</span><br><br>
  1. <span class="k-out-green">[AI + WEBGL + SYSTEMS]</span> <span class="k-out-amber">Mars-GeoSpectra</span> - NASA Space Apps Challenge 2026 Martian Mission Planning Workstation (Jezero Crater EVAs, Tobler 0.38g Routing, 3D WebGL HUD)<br>
     &nbsp;&nbsp;&gt; Repo: <a href="https://github.com/YTxFSGAMERz/Mars-GeoSpectra" target="_blank" class="k-out-link">github.com/YTxFSGAMERz/Mars-GeoSpectra</a><br><br>
  2. <span class="k-out-green">[AI + SYSTEMS]</span> <span class="k-out-amber">KisanSetu-AI</span> - Smart India Hackathon (SIH 2026) Team Lead Platform (AI Slot Allocation, WebSocket State Machines, 3 Role Portals)<br>
     &nbsp;&nbsp;&gt; Live: <a href="https://frontend-seven-sooty-62.vercel.app" target="_blank" class="k-out-link">frontend-seven-sooty-62.vercel.app</a> | Repo: <a href="https://github.com/YTxFSGAMERz/KisanSetu-AI" target="_blank" class="k-out-link">github.com/YTxFSGAMERz/KisanSetu-AI</a><br><br>
  3. <span class="k-out-green">[AI + CYBER]</span> <span class="k-out-amber">PenMunshi</span> - Local VAPT Copilot (Gemma 4 on Ollama, RapidOCR Sub-Span Redaction, CVSS v3.1 Math)<br>
     &nbsp;&nbsp;&gt; Repo: <a href="https://github.com/YTxFSGAMERz/penmunshi" target="_blank" class="k-out-link">github.com/YTxFSGAMERz/penmunshi</a><br><br>
  4. <span class="k-out-green">[AI + SYSTEMS]</span> <span class="k-out-amber">Event Intelligence Agent</span> - Autonomous Opportunity Scout ($2.4M+ Tracked, Telegram Bot Alerts)<br>
     &nbsp;&nbsp;&gt; Live: <a href="https://event-intelligence-dashboard-indol.vercel.app" target="_blank" class="k-out-link">event-intelligence-dashboard-indol.vercel.app</a> | Repo: <a href="https://github.com/YTxFSGAMERz/event-intelligence-agent" target="_blank" class="k-out-link">github.com/YTxFSGAMERz/event-intelligence-agent</a><br><br>
  5. <span class="k-out-green">[3D + CYBER]</span> <span class="k-out-amber">GeoVigilant Argus</span> - 3D Geospatial Intelligence HUD &amp; ADS-B / AIS Planetary Tracker<br>
     &nbsp;&nbsp;&gt; Live: <a href="https://geovigilant-argus.vercel.app" target="_blank" class="k-out-link">geovigilant-argus.vercel.app</a> | Repo: <a href="https://github.com/YTxFSGAMERz/GeoVigilant-Argus" target="_blank" class="k-out-link">github.com/YTxFSGAMERz/GeoVigilant-Argus</a><br><br>
  6. <span class="k-out-green">[SYSTEMS + 3D + AI]</span> <span class="k-out-amber">Quantum Market Pulse</span> - 4D Market Energy Engine &amp; 120 FPS Compositor (PyVista GPU VTK, Colab)<br>
     &nbsp;&nbsp;&gt; Colab: <a href="https://colab.research.google.com/github/YTxFSGAMERz/Quantum-Market-Pulse-4D-Alpha-Engine/blob/main/Colab.ipynb" target="_blank" class="k-out-link">colab.google/Quantum-Alpha</a> | Repo: <a href="https://github.com/YTxFSGAMERz/Quantum-Market-Pulse-4D-Alpha-Engine" target="_blank" class="k-out-link">github.com/YTxFSGAMERz/Quantum-Market-Pulse-4D-Alpha-Engine</a><br><br>
  7. <span class="k-out-green">[CYBER + SYSTEMS]</span> <span class="k-out-amber">SecuScan</span> - Multi-Tool Security &amp; VAPT Intelligence Workspace (60+ Tools, FastAPI + React 19)<br>
     &nbsp;&nbsp;&gt; Live: <a href="https://secuscan.in" target="_blank" class="k-out-link">secuscan.in</a> | Repo: <a href="https://github.com/YTxFSGAMERz/SecuScan" target="_blank" class="k-out-link">github.com/YTxFSGAMERz/SecuScan</a><br><br>
  8. <span class="k-out-green">[AI + SYSTEMS]</span> <span class="k-out-amber">EnterpriseRAG-AI</span> - Air-Gapped Knowledge Mesh with Linux-Native eBPF Security Governance<br>
     &nbsp;&nbsp;&gt; Live: <a href="https://enterpriserag-ai.vercel.app" target="_blank" class="k-out-link">enterpriserag-ai.vercel.app</a> | Repo: <a href="https://github.com/YTxFSGAMERz/EnterpriseRAG-AI" target="_blank" class="k-out-link">github.com/YTxFSGAMERz/EnterpriseRAG-AI</a><br><br>
  9. <span class="k-out-green">[AI + CYBER]</span> <span class="k-out-amber">ScamShield</span> - Multimodal AI Fraud Defense (Gemma 4 Vision, Multi-Lingual EN/HI/GU)<br>
     &nbsp;&nbsp;&gt; Live: <a href="https://scamshield-sandy.vercel.app" target="_blank" class="k-out-link">scamshield-sandy.vercel.app</a> | Repo: <a href="https://github.com/YTxFSGAMERz/ScamShield" target="_blank" class="k-out-link">github.com/YTxFSGAMERz/ScamShield</a><br><br>
  10. <span class="k-out-green">[SYSTEMS]</span> <span class="k-out-amber">WinAurex</span> - Windows 10/11 Engineering Suite (12★ Stars, TPM/RAM Bypass, Kernel Tuning)<br>
      &nbsp;&nbsp;&gt; Live: <a href="https://winaurex.vercel.app" target="_blank" class="k-out-link">winaurex.vercel.app</a> | Repo: <a href="https://github.com/YTxFSGAMERz/WinAurex" target="_blank" class="k-out-link">github.com/YTxFSGAMERz/WinAurex</a><br><br>
  11. <span class="k-out-green">[SYSTEMS + QUANT]</span> <span class="k-out-amber">Random Walk Hypothesis</span> - Econometric Statistical Testing on Bitcoin (ADF, Variance Ratio, GARCH)<br>
      &nbsp;&nbsp;&gt; Live: <a href="https://ytxfsgamerz.github.io/Random-Walk-Hypothesis/" target="_blank" class="k-out-link">ytxfsgamerz.github.io/Random-Walk-Hypothesis</a> | Repo: <a href="https://github.com/YTxFSGAMERz/Random-Walk-Hypothesis" target="_blank" class="k-out-link">github.com/YTxFSGAMERz/Random-Walk-Hypothesis</a><br><br>
  12. <span class="k-out-green">[SYSTEMS]</span> <span class="k-out-amber">bdstorage</span> - High-Performance Content-Addressable Storage (CAS) Engine in Rust<br>
      &nbsp;&nbsp;&gt; Crates.io: <a href="https://crates.io/crates/bdstorage" target="_blank" class="k-out-link">crates.io/crates/bdstorage</a> | Repo: <a href="https://github.com/YTxFSGAMERz/bdstorage" target="_blank" class="k-out-link">github.com/YTxFSGAMERz/bdstorage</a>
</div>`);
                break;

            case 'penmunshi':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-amber">TARGET INTEL: PENMUNSHI // VAPT REPORT COPILOT</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">Architecture:</span> 100% Offline-First Pentest Copilot powered by Google Gemma 4 on Ollama.<br>
  • <span class="k-out-green">OCR Redaction:</span> RapidOCR sub-span pixel blackout with loopback re-scan verification ensuring 0 client leak.<br>
  • <span class="k-out-green">CVSS Engine:</span> Pure deterministic code-calculated CVSS v3.1 math (zero LLM hallucinations on severity).<br>
  • <span class="k-out-green">Scanner Ingestion:</span> Automated parsers for Nmap XML, Burp Suite XML, and retest diffing engine.<br>
  • <span class="k-out-green">Export Output:</span> Agency-grade DOCX and HTML client deliverable reports.<br>
  • <span class="k-out-green">Repository:</span> <a href="https://github.com/YTxFSGAMERz/penmunshi" target="_blank" class="k-out-link">https://github.com/YTxFSGAMERz/penmunshi</a>
</div>`);
                break;

            case 'event-intel':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-amber">TARGET INTEL: EVENT INTELLIGENCE AGENT</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">Scope:</span> Autonomous opportunity scout tracking $2.4M+ in prizes, hackathons, fellowships &amp; travel grants.<br>
  • <span class="k-out-green">Verification:</span> Official source HTML parsing + hallucination filtering before alert dispatch.<br>
  • <span class="k-out-green">Relay:</span> Telegram Bot push alerts triggered via automated GitHub Actions cron (*/10m).<br>
  • <span class="k-out-green">Repository:</span> <a href="https://github.com/YTxFSGAMERz/event-intelligence-agent" target="_blank" class="k-out-link">https://github.com/YTxFSGAMERz/event-intelligence-agent</a>
</div>`);
                break;

            case 'scamshield':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-amber">TARGET INTEL: SCAMSHIELD // MULTIMODAL FRAUD DEFENSE</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">Core:</span> Multimodal fraud detection leveraging Gemma 4 Vision &amp; NLP pipelines.<br>
  • <span class="k-out-green">Ingestion:</span> WhatsApp payment screenshot scanner, phishing URL heuristics, caller threat intel.<br>
  • <span class="k-out-green">Languages:</span> English, Hindi, and Gujarati vernacular dialect support.<br>
  • <span class="k-out-green">Repository:</span> <a href="https://github.com/YTxFSGAMERz/ScamShield" target="_blank" class="k-out-link">https://github.com/YTxFSGAMERz/ScamShield</a>
</div>`);
                break;

            case 'winaurex':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-amber">TARGET INTEL: WINAUREX // WINDOWS 10/11 SUITE (12★)</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">Stack:</span> PowerShell 7+, DISM API, Windows System Services Automation.<br>
  • <span class="k-out-green">Features:</span> Kernel optimization, telemetry stripping, unattended TPM 2.0 / RAM bypass routines.<br>
  • <span class="k-out-green">Status:</span> Open-source utility with 12 GitHub stars.<br>
  • <span class="k-out-green">Repository:</span> <a href="https://github.com/YTxFSGAMERz/WinAurex" target="_blank" class="k-out-link">https://github.com/YTxFSGAMERz/WinAurex</a>
</div>`);
                break;

            case 'rwh':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-amber">TARGET INTEL: RANDOM WALK HYPOTHESIS ON BITCOIN</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">Discipline:</span> Quantitative finance &amp; econometrics.<br>
  • <span class="k-out-green">Statistical Battery:</span> Augmented Dickey-Fuller (ADF), Lo-MacKinlay Variance Ratio, Autocorrelation ACF/PACF, Runs Test.<br>
  • <span class="k-out-green">Volatility Model:</span> GARCH(1,1) clustered volatility testing on BTC-USD high-frequency time series.<br>
  • <span class="k-out-green">Repository:</span> <a href="https://github.com/YTxFSGAMERz/Random-Walk-Hypothesis" target="_blank" class="k-out-link">https://github.com/YTxFSGAMERz/Random-Walk-Hypothesis</a>
</div>`);
                break;

            case 'skills':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-cyan">FARHAN SHAIKH // ARSENAL MATRIX:</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">Offensive Security:</span> KALI, VAPT, Burp Suite Pro, Metasploit, Nmap, Wireshark, Ghidra, Hydra<br>
  • <span class="k-out-green">AI &amp; Neural Engineering:</span> Gemma 4, Ollama, PyTorch, LangChain, Transformers, RapidOCR, OpenCV<br>
  • <span class="k-out-green">Core Languages:</span> Python, C++, TypeScript, JavaScript, Rust, Bash, PowerShell, SQL<br>
  • <span class="k-out-green">Web &amp; 3D Graphics:</span> Three.js, WebGL, GSAP, Lenis, Vite, Tailwind, HTML5 Canvas<br>
  • <span class="k-out-green">Systems &amp; DevOps:</span> Linux Kernel, Docker, Git, GitHub Actions CI/CD, Netlify, Cloudflare
</div>`);
                break;

            case 'whoami':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-green">IDENTITY:</span> Farhan Shaikh (@YTxFSGAMERz)<br>
  <span class="k-out-green">ROLE:</span> Computer Science Engineer • Offensive Security Researcher • AI Agent Architect<br>
  <span class="k-out-green">LOCATION:</span> Mumbai, Maharashtra, India<br>
  <span class="k-out-green">MISSION:</span> Building unbreachable systems, offline-first autonomous AI copilots, and high-performance tactical interfaces.
</div>`);
                break;

            case 'scan':
                printLine(`<div class="kali-cli-cmd-output"><span class="k-out-amber">[+] INITIATING STEALTH SYN SCAN ACROSS PORTFOLIO GRID...</span></div>`);
                setTimeout(() => {
                    printLine(`<div class="kali-cli-cmd-output"><span class="k-out-cyan">[~] Probing sub-domains and local ports (22, 80, 443, 8080, 11434 [Ollama])...</span></div>`);
                }, 400);
                setTimeout(() => {
                    printLine(`<div class="kali-cli-cmd-output"><span class="k-out-green">[+] 11434/tcp OPEN  ollama/gemma4-local (PenMunshi Copilot Link)</span><br><span class="k-out-green">[+] 443/tcp   OPEN  https (TLS 1.3 Strict-Transport-Security)</span><br><span class="k-out-green">[+] 64/64     REPOS VERIFIED ON GITHUB</span><br><span class="k-out-cyan">[✓] AUDIT COMPLETE: 0 CRITICAL CVEs EXPOSED. SYSTEM INTEGRITY OPTIMAL.</span></div>`);
                }, 1000);
                break;

            case 'matrix':
                printLine(`
<div class="kali-cli-cmd-output k-out-green" style="font-family: monospace; font-size: 0.75rem; line-height: 1.1;">
01000110 01000001 01010010 01001000 01000001 01001110<br>
[+] MATRIX STREAM CONNECTED TO KALI CORE<br>
λ = 532nm // NEON EMISSION ACTIVE // ENCRYPTION: AES-256-GCM
</div>`);
                break;

            case 'neofetch':
            case 'specs':
                printLine(`
<div class="kali-cli-cmd-output" style="font-family: monospace; font-size: 0.8rem; line-height: 1.25;">
<pre style="margin: 0; color: #00ff66;">
       .---.            <span style="color:#00ffff;">farhan</span><span style="color:#ffffff;">@</span><span style="color:#00ff66;">kali-workstation</span>
      /     \\           --------------------------
     | () () |          <span style="color:#00ffff;">OS:</span> Kali GNU/Linux Rolling x86_64
      \\  -  /           <span style="color:#00ffff;">Host:</span> Precision CyberDeck RTX-3050 (12-Core)
     .-\`"'"'-.          <span style="color:#00ffff;">Kernel:</span> 6.8.0-kali-custom-ebpf
    /         \\         <span style="color:#00ffff;">Uptime:</span> 24/7 Continuous Mission
   |           |        <span style="color:#00ffff;">Shell:</span> zsh 5.9 (x86_64-debian-linux-gnu)
   |           |        <span style="color:#00ffff;">DE:</span> Tactical Neon Matrix (GSAP / WebGL / Three.js)
    \\         /         <span style="color:#00ffff;">CPU:</span> Intel Core i5-12500H (16 Threads) @ 4.5GHz
     \`-------'          <span style="color:#00ffff;">GPU:</span> NVIDIA GeForce RTX 3050 Mobile 6GB GDDR6
                        <span style="color:#00ffff;">Memory:</span> 16384MiB / 32768MiB DDR5
                        <span style="color:#00ffff;">AI Engine:</span> Local Gemma 4 (Ollama) + PyTorch CUDA
                        <span style="color:#00ffff;">Security:</span> VAPT Copilot, RapidOCR Redaction, DISM API
                        <span style="color:#00ffff;">Git Repos:</span> 64+ Repositories (@YTxFSGAMERz)
</pre>
</div>`);
                break;

            case 'benchmark':
            case 'bench':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-amber">[+] HARDWARE &amp; AI INFERENCE BENCHMARK RUNTIME:</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">Gemma 4 Local (Ollama):</span> <span class="k-out-cyan">42.8 tokens/sec</span> (CUDA FP16 on RTX 3050 GPU)<br>
  • <span class="k-out-green">RapidOCR Sub-Span Redaction:</span> <span class="k-out-cyan">14.2 ms / page</span> (100% secret recall, 0 leaks)<br>
  • <span class="k-out-green">XML Parser (Nmap / Burp):</span> <span class="k-out-cyan">1,480 rules / sec</span> (Deterministic memory streaming)<br>
  • <span class="k-out-green">Lo-MacKinlay Variance Ratio:</span> <span class="k-out-cyan">VR = 1.32</span> (Random Walk rejected @ 99% CI)<br>
  • <span class="k-out-green">WinAurex Kernel Debloat:</span> <span class="k-out-cyan">2.1 GB idle RAM</span> (Stripped 100% background telemetry)<br>
  • <span class="k-out-green">Portfolio Engine Framerate:</span> <span class="k-out-cyan">60.0 FPS stable</span> (Three.js WebGL &amp; GSAP pipelines)
</div>`);
                break;

            case 'stats':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-cyan">ENGINEERING TELEMETRY &amp; GITHUB REPOSITORY AUDIT:</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">Public Repositories:</span> 64+ Active Repositories (<a href="https://github.com/YTxFSGAMERz" target="_blank" class="k-out-link">@YTxFSGAMERz</a>)<br>
  • <span class="k-out-green">NASA Space Apps '26:</span> Mars-GeoSpectra (Martian EVA Mission Planning Workstation)<br>
  • <span class="k-out-green">SIH 2026 Team Lead:</span> KisanSetu-AI (National Agricultural Procurement Platform)<br>
  • <span class="k-out-green">Flagship AI &amp; Cyber Builds:</span> penmunshi, event-intelligence-agent, ScamShield<br>
  • <span class="k-out-green">Flagship Systems Builds:</span> WinAurex (12★ Stars), Random-Walk-Hypothesis, bdstorage<br>
  • <span class="k-out-green">Flagship 3D Geospatial:</span> Vigilant-Sphere-GeoSpectra (Argus Eye)<br>
  • <span class="k-out-green">Continuous Scout Reach:</span> $2.4M+ in prizes, hackathons &amp; fellowships indexed<br>
  • <span class="k-out-green">Data Sovereignty:</span> 100% Local Inference, Zero Third-Party Cloud Leaks
</div>`);
                break;

            case 'secuscan':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-amber">TARGET INTEL: SECUSCAN // OFFENSIVE SECURITY WORKSPACE</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">Scope:</span> Full-spectrum vulnerability scanning, DNS reconnaissance, SSL cipher analysis, and payload generator.<br>
  • <span class="k-out-green">Engine:</span> FastAPI async backend + React 19 UI with 60+ modular offensive security tools.<br>
  • <span class="k-out-green">Live Platform:</span> <a href="https://secuscan.in" target="_blank" class="k-out-link">https://secuscan.in</a><br>
  • <span class="k-out-green">Repository:</span> <a href="https://github.com/YTxFSGAMERz/SecuScan" target="_blank" class="k-out-link">https://github.com/YTxFSGAMERz/SecuScan</a>
</div>`);
                break;

            case 'argus':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-amber">TARGET INTEL: GEOVIGILANT ARGUS // 3D OSINT TRACKING HUD</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">Visual Core:</span> WebGL &amp; Three.js interactive tactical globe running at 60 FPS.<br>
  • <span class="k-out-green">Tracking:</span> Live commercial &amp; military ADS-B flight vectors, maritime AIS tracks, satellite orbital paths.<br>
  • <span class="k-out-green">Live Platform:</span> <a href="https://geovigilant-argus.vercel.app" target="_blank" class="k-out-link">https://geovigilant-argus.vercel.app</a><br>
  • <span class="k-out-green">Repository:</span> <a href="https://github.com/YTxFSGAMERz/GeoVigilant-Argus" target="_blank" class="k-out-link">https://github.com/YTxFSGAMERz/GeoVigilant-Argus</a>
</div>`);
                break;

            case 'enterpriserag':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-amber">TARGET INTEL: ENTERPRISE RAG // AIR-GAPPED KNOWLEDGE MESH</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">Core:</span> Air-gapped retrieval-augmented generation running entirely on local Ollama weights.<br>
  • <span class="k-out-green">Governance:</span> Linux-native eBPF socket monitoring to enforce zero-leak data boundaries.<br>
  • <span class="k-out-green">Live Platform:</span> <a href="https://enterpriserag-ai.vercel.app" target="_blank" class="k-out-link">https://enterpriserag-ai.vercel.app</a><br>
  • <span class="k-out-green">Repository:</span> <a href="https://github.com/YTxFSGAMERz/EnterpriseRAG-AI" target="_blank" class="k-out-link">https://github.com/YTxFSGAMERz/EnterpriseRAG-AI</a>
</div>`);
                break;

            case 'bdstorage':
            case 'crates':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-amber">TARGET INTEL: BDSTORAGE // RUST CAS ENGINE (CRATES.IO)</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">Ecosystem:</span> High-throughput content-addressable storage engine published on Crates.io.<br>
  • <span class="k-out-green">Architecture:</span> BLAKE3 chunk hashing, rolling deduplication, and zero-copy block streaming.<br>
  • <span class="k-out-green">Crates.io:</span> <a href="https://crates.io/crates/bdstorage" target="_blank" class="k-out-link">https://crates.io/crates/bdstorage</a><br>
  • <span class="k-out-green">Repository:</span> <a href="https://github.com/YTxFSGAMERz/bdstorage" target="_blank" class="k-out-link">https://github.com/YTxFSGAMERz/bdstorage</a>
</div>`);
                break;

            case 'quantum':
            case '4d':
            case 'alphapulse':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-amber">TARGET INTEL: QUANTUM ALPHA // 4D MARKET TOPOLOGY ENGINE</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">Core:</span> High-performance GPU-accelerated market energy engine compositing 3,400+ trading days.<br>
  • <span class="k-out-green">Architecture:</span> PyVista VTK 3D GPU surface meshing with 120 FPS FFmpeg NVENC pipeline.<br>
  • <span class="k-out-green">Math:</span> E(t, a) = 0.35·vol + 0.25·|mom| + 0.25·vol_spike + 0.15·sent with hyperbolic tangent α physics.<br>
  • <span class="k-out-green">Colab:</span> Interactive GPU notebook available with 1-click execution.<br>
  • <span class="k-out-green">Repository:</span> <a href="https://github.com/YTxFSGAMERz/Quantum-Market-Pulse-4D-Alpha-Engine" target="_blank" class="k-out-link">https://github.com/YTxFSGAMERz/Quantum-Market-Pulse-4D-Alpha-Engine</a>
</div>`);
                break;

            case 'socials':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-cyan">FARHAN SHAIKH // DIRECT SATELLITE LINKS:</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">LinkedIn:</span> <a href="https://linkedin.com/in/farhan-shaikh-fs" target="_blank" class="k-out-link">linkedin.com/in/farhan-shaikh-fs</a><br>
  • <span class="k-out-green">GitHub:</span> <a href="https://github.com/YTxFSGAMERz" target="_blank" class="k-out-link">github.com/YTxFSGAMERz</a> (64+ Repos)<br>
  • <span class="k-out-green">Crates.io:</span> <a href="https://crates.io/crates/bdstorage" target="_blank" class="k-out-link">crates.io/crates/bdstorage</a><br>
  • <span class="k-out-green">Twitter/X:</span> <a href="https://x.com/YTxFSGAMERz" target="_blank" class="k-out-link">x.com/YTxFSGAMERz</a><br>
  • <span class="k-out-green">Discord:</span> <a href="https://discord.com/users/1354206425068343419" target="_blank" class="k-out-link">discord.com/users/1354206425068343419</a> (@1.n.only.fs)<br>
  • <span class="k-out-green">Email:</span> <a href="mailto:f98561965@gmail.com" class="k-out-link">f98561965@gmail.com</a>
</div>`);
                break;

            case 'hackathons':
            case 'awards':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-cyan">AWARDS, HACKATHONS &amp; RECOGNITION DOSSIER:</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">NASA Space Apps Challenge 2026:</span> Architected <span class="k-out-amber">Mars-GeoSpectra</span> (Martian EVA mission workstation for Jezero Crater with 6 NASA datasets &amp; Tobler 0.38g metabolic routing)<br>
  • <span class="k-out-green">Smart India Hackathon (SIH 2026):</span> Team Lead &amp; Principal Architect for <span class="k-out-amber">KisanSetu-AI</span> (National agricultural procurement platform with AI slot ranking &amp; 3 role portals)<br>
  • <span class="k-out-green">Winner:</span> Web3 &amp; Security Track — National Level 36hr Hackathon (ScamShield fraud defense engine)<br>
  • <span class="k-out-green">Finalist:</span> AI Agents &amp; Automation National Hackathon (Event Intelligence Agent — $2.4M opportunities tracked)<br>
  • <span class="k-out-green">Crates.io Author:</span> Published <span class="k-out-amber">bdstorage</span> (Fast, zero-copy Rust content-addressable storage)<br>
  • <span class="k-out-green">GitHub Ecosystem:</span> 64+ public repositories, 12★ on WinAurex kernel suite, Hacktoberfest 2026 open-source contributor<br>
  • <span class="k-out-green">Live Production:</span> SecuScan (secuscan.in), EnterpriseRAG (enterpriserag-ai.vercel.app), KisanSetu-AI, Argus Eye (geovigilant-argus.vercel.app)
</div>`);
                break;

            case 'certifications':
            case 'certs':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-cyan">VERIFIED CREDENTIALS &amp; CERTIFICATIONS DOSSIER:</span><br>
  ------------------------------------------------------------<br>
  1. <span class="k-out-green">NASA Space Apps Challenge 2026</span> [NASA-SAC-2026-JEZERO-EVA]<br>
     Role: Planetary Mission Architect &amp; 3D Workstation Lead (Mars-GeoSpectra)<br>
     Authority: NASA Earth Science &amp; Planetary Exploration Division<br>
  2. <span class="k-out-green">Smart India Hackathon (SIH 2026)</span> [SIH-2026-NAT-LEAD-0842]<br>
     Role: Selected Team Lead &amp; Principal Systems Architect (KisanSetu-AI)<br>
     Authority: Ministry of Education &amp; AICTE, Govt. of India<br>
  3. <span class="k-out-green">Crates.io Published Package Author</span> [CRATES-IO-BDSTORAGE-VERIFIED]<br>
     Role: Lead Systems Developer &amp; Author of 'bdstorage' (Rust CAS Deduplication)<br>
     Authority: Rust Foundation / Crates.io Registry<br>
  4. <span class="k-out-green">Offensive Security &amp; VAPT Practitioner</span> [SEC-VAPT-LOCAL-60TOOLS-PASS]<br>
     Role: Local Security Workspace (SecuScan) &amp; eBPF Linux Kernel Tracing Mesh<br>
     Authority: Cybersecurity &amp; VAPT Practice Standards<br>
  5. <span class="k-out-green">Full-Stack Multimodal AI Specialist</span> [AI-GEMMA4-RAG-SYS-2026]<br>
     Role: Vision-Language &amp; Real-Time Agent Architect (ScamShield / PenMunshi)<br>
     Authority: DeepLearning.AI / Google Developer Ecosystem<br>
  6. <span class="k-out-green">Hacktoberfest 2026 Super Contributor</span> [HFEST-2026-64REPOS-OPEN]<br>
     Role: Open-Source Maintainer &amp; Verified Contributor across 64+ Repositories<br>
     Authority: DigitalOcean, GitHub &amp; Open Source Initiative<br>
  ------------------------------------------------------------<br>
  <span class="k-out-amber">[~] Jump to section:</span> <a href="#certifications" onclick="window.closeKaliTerminal ? window.closeKaliTerminal() : null;" class="k-out-link">Inspect Certifications Grid ↗</a>
</div>`);
                break;

            case 'admin':
            case 'cms':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-red">bash: ${escapeHtml(cmd)}: command not found</span><br>
  Type <span class="k-out-cyan">help</span> to view available system commands.
</div>`);
                break;

            case 'cv':
            case 'resume':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-cyan">FARHAN SHAIKH // CURRICULUM VITAE &amp; TECHNICAL DOSSIER:</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">Name:</span> Farhan Shaikh (@YTxFSGAMERz)<br>
  • <span class="k-out-green">Specialization:</span> Offensive Security (VAPT) • Autonomous AI Agents • Rust Systems<br>
  • <span class="k-out-green">Education:</span> Bachelor of Engineering in Computer Engineering (2022 - 2026)<br>
  • <span class="k-out-green">Key Honors:</span> 2x Hackathon Finalist, Winner (Web3 / Security Track), 64+ Repositories<br>
  • <span class="k-out-green">Crates.io Package:</span> <a href="https://crates.io/crates/bdstorage" target="_blank" class="k-out-link">bdstorage</a> (High-Performance Content-Addressable Storage Engine)<br>
  • <span class="k-out-green">Direct Download:</span> <a href="Farhan_Shaikh_Resume.pdf" download="Farhan_Shaikh_Resume.pdf" target="_blank" class="k-out-link">[DOWNLOAD FARHAN_SHAIKH_RESUME.PDF]</a><br>
  [~] Triggering dossier download stream...
</div>`);
                const cvAnchor = document.createElement('a');
                cvAnchor.href = 'Farhan_Shaikh_Resume.pdf';
                cvAnchor.download = 'Farhan_Shaikh_Resume.pdf';
                cvAnchor.target = '_blank';
                document.body.appendChild(cvAnchor);
                cvAnchor.click();
                document.body.removeChild(cvAnchor);
                break;

            case 'contact':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-cyan">INITIATING SECURE TRANSMISSION CHANNEL...</span><br>
  • Email: <a href="mailto:f98561965@gmail.com" class="k-out-link">f98561965@gmail.com</a> / <a href="mailto:shaikhfarhan4639@gmail.com" class="k-out-link">shaikhfarhan4639@gmail.com</a><br>
  • GitHub: <a href="https://github.com/YTxFSGAMERz" target="_blank" class="k-out-link">@YTxFSGAMERz</a> (64+ Repositories)<br>
  • LinkedIn: <a href="https://linkedin.com/in/farhan-shaikh-fs" target="_blank" class="k-out-link">linkedin.com/in/farhan-shaikh-fs</a><br>
  • X/Twitter: <a href="https://x.com/YTxFSGAMERz" target="_blank" class="k-out-link">x.com/YTxFSGAMERz</a><br>
  • Discord: <a href="https://discord.com/users/1354206425068343419" target="_blank" class="k-out-link">discord.com/users/1354206425068343419</a> (@1.n.only.fs)<br>
  [~] Opening interactive contact overlay in background...
</div>`);
                const transBtn = document.getElementById('btnShoot') || document.getElementById('openDiscordTransmissionBtn');
                if (transBtn) transBtn.click();
                break;

            case 'github':
            case 'repo':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-green">[+] REDIRECTING TO GITHUB ARCHIVE:</span> <a href="https://github.com/YTxFSGAMERz" target="_blank" class="k-out-link">https://github.com/YTxFSGAMERz</a>
</div>`);
                window.open('https://github.com/YTxFSGAMERz', '_blank');
                break;

            case 'sudo':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-red">[!] User farhan is already root. Nice try. This incident will be reported to /dev/null.</span>
</div>`);
                break;

            case 'osbuilder':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-amber">TARGET INTEL: WINAUREX DISM IMAGE BUILDER</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">Core:</span> Windows 10/11 Automated Unattended Image Customizer.<br>
  • <span class="k-out-green">Features:</span> Strips Bloatware, Injects TPM/SecureBoot Bypass, Drivers &amp; Tweaks.<br>
  • <span class="k-out-green">Live Web:</span> <a href="https://winaurex.vercel.app/" target="_blank" class="k-out-link">https://winaurex.vercel.app/</a><br>
  • <span class="k-out-green">Repository:</span> <a href="https://github.com/YTxFSGAMERz/WinAurex" target="_blank" class="k-out-link">https://github.com/YTxFSGAMERz/WinAurex</a>
</div>`);
                break;

            case 'mars':
            case 'mars-geospectra':
            case 'geospectra':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-amber">TARGET INTEL: MARS-GEOSPECTRA // NASA SPACE APPS CHALLENGE 2026</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">Mission:</span> Martian planetary EVA exploration &amp; traverse planning workstation for Jezero Crater.<br>
  • <span class="k-out-green">Data Ingestion:</span> 6 NASA planetary datasets integrated (MOLA elevation, CRISM hyperspectral mineralogy, HiRISE 25cm/px micro-topography, THEMIS thermal inertia, Perseverance rover telemetry).<br>
  • <span class="k-out-green">Biophysical Routing:</span> Modified Tobler's Hiking Function calibrated for Martian 0.38g gravity, terrain roughness penalties, and astronaut metabolic O2 budget.<br>
  • <span class="k-out-green">HUD &amp; AI Copilot:</span> 3D WebGL tactical surface HUD with Grounded EVA Planning Agent (zero hallucination constraint engine).<br>
  • <span class="k-out-green">Repository:</span> <a href="https://github.com/YTxFSGAMERz/Mars-GeoSpectra" target="_blank" class="k-out-link">https://github.com/YTxFSGAMERz/Mars-GeoSpectra</a>
</div>`);
                break;

            case 'kisansetu':
            case 'sih':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-amber">TARGET INTEL: KISANSETU-AI // SMART INDIA HACKATHON 2026 (TEAM LEAD)</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">Leadership:</span> Smart India Hackathon (SIH 2026) Team Lead &amp; Principal Systems Architect.<br>
  • <span class="k-out-green">Scope:</span> Enterprise agricultural supply chain platform connecting 3 distinct role portals: Farmers, Buyers, APMC Officers.<br>
  • <span class="k-out-green">Core Engine:</span> AI-driven slot allocation reducing mandi bottlenecks by 65%, real-time price discovery regression, multilingual vernacular copilot.<br>
  • <span class="k-out-green">Architecture:</span> 11 relational ORM models, dual PostgreSQL &amp; MongoDB storage, WebSocket bidirectional state machine for live auction bids.<br>
  • <span class="k-out-green">Live Platform:</span> <a href="https://frontend-seven-sooty-62.vercel.app" target="_blank" class="k-out-link">https://frontend-seven-sooty-62.vercel.app</a><br>
  • <span class="k-out-green">Repository:</span> <a href="https://github.com/YTxFSGAMERz/KisanSetu-AI" target="_blank" class="k-out-link">https://github.com/YTxFSGAMERz/KisanSetu-AI</a>
</div>`);
                break;

            case 'hacktoberfest':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-amber">TARGET INTEL: HACKTOBERFEST 2026 // OPEN-SOURCE INITIATIVE</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">Status:</span> Active Contributor &amp; Open-Source Maintainer.<br>
  • <span class="k-out-green">Key Repositories:</span> ScamShield (multimodal AI fraud defense), bdstorage (Rust CAS deduplication engine), WinAurex (12★ stars).<br>
  • <span class="k-out-green">Philosophy:</span> Production-grade open-source security engineering, zero-telemetry utilities, and sovereign AI copilots.<br>
  • <span class="k-out-green">GitHub Archive:</span> <a href="https://github.com/YTxFSGAMERz" target="_blank" class="k-out-link">https://github.com/YTxFSGAMERz</a>
</div>`);
                break;

            case 'merashop':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-amber">TARGET INTEL: MERASHOP // MULTI-TENANT COMMERCE</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">Stack:</span> Next.js / React 19, Tailwind CSS, Supabase backend.<br>
  • <span class="k-out-green">Scope:</span> Instant digital storefront generator with WhatsApp checkout &amp; localized catalog.<br>
  • <span class="k-out-green">Live Platform:</span> <a href="https://merashop.vercel.app" target="_blank" class="k-out-link">https://merashop.vercel.app</a>
</div>`);
                break;

            case 'querymind':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-amber">TARGET INTEL: QUERY-MIND // AI DATABASE ASSISTANT</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">Scope:</span> Natural language to SQL compiler with automatic foreign key relation mapping.<br>
  • <span class="k-out-green">Live Platform:</span> <a href="https://query-mind.netlify.app/" target="_blank" class="k-out-link">https://query-mind.netlify.app/</a>
</div>`);
                break;

            case 'timescale':
            case 'tiger':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-cyan">TARGET INTEL: TIMESCALEDB HYBRID VECTOR &amp; FINANCIAL PIPELINES</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">Architecture:</span> Real-time financial stream ingestion &amp; pgvector semantic search.<br>
  • <span class="k-out-green">Subsystem:</span> Hypertables, continuous compression, and microsecond telemetry ingest.<br>
  • <span class="k-out-green">Use Cases:</span> BTC high-frequency order books, ADS-B vector storage, eBPF network metrics.<br>
  • <span class="k-out-green">Repositories:</span><br>
  &nbsp;&nbsp;&gt; <a href="https://github.com/YTxFSGAMERz/tiger-ai-vector-search" target="_blank" class="k-out-link">github.com/YTxFSGAMERz/tiger-ai-vector-search</a><br>
  &nbsp;&nbsp;&gt; <a href="https://github.com/YTxFSGAMERz/tiger-realtime-financial-pipeline" target="_blank" class="k-out-link">github.com/YTxFSGAMERz/tiger-realtime-financial-pipeline</a>
</div>`);
                break;

            case 'signal':
            case 'midnight':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-amber">TARGET INTEL: MIDNIGHT SIGNAL CLI // QUANT TRADING ENGINE</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">Core:</span> High-frequency cryptocurrency trading and quantitative signal CLI.<br>
  • <span class="k-out-green">Algorithms:</span> Volatility breakout detection, order book liquidity imbalance, and real-time risk parity sizing.<br>
  • <span class="k-out-green">Execution:</span> Millisecond-level event loops with simulated slippage calibration.<br>
  • <span class="k-out-green">Repository:</span> <a href="https://github.com/YTxFSGAMERz/midnight-signal-cli" target="_blank" class="k-out-link">https://github.com/YTxFSGAMERz/midnight-signal-cli</a>
</div>`);
                break;

            case 'grok':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-amber">TARGET INTEL: GROK BROWSER WORKFLOW // AUTONOMOUS AGENT</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">Core:</span> Autonomous browser-driven agent workflow orchestration with dynamic DOM traversal.<br>
  • <span class="k-out-green">Stealth &amp; Resilience:</span> Headless automation, session persistence, and anti-fingerprinting safeguards.<br>
  • <span class="k-out-green">Repository:</span> <a href="https://github.com/YTxFSGAMERz/grok-browser-workflow" target="_blank" class="k-out-link">https://github.com/YTxFSGAMERz/grok-browser-workflow</a>
</div>`);
                break;

            case 'cursor':
            case 'cursor-benchmark':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-amber">TARGET INTEL: CURSOR MODEL BENCHMARK // LLM EVALUATION</span><br>
  ------------------------------------------------------------<br>
  • <span class="k-out-green">Scope:</span> Rigorous comparative benchmark suite evaluating Gemma 4, Claude 3.5 Sonnet, and OpenAI Codex.<br>
  • <span class="k-out-green">Metrics:</span> Code generation latency, refactoring precision, AST token density, and reasoning depth.<br>
  • <span class="k-out-green">Repository:</span> <a href="https://github.com/YTxFSGAMERz/cursor-model-benchmark" target="_blank" class="k-out-link">https://github.com/YTxFSGAMERz/cursor-model-benchmark</a>
</div>`);
                break;

            case 'discord':
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-cyan">[+] CONNECTING TO FARHAN'S CYBERNETIC DISCORD:</span><br>
  • Direct User ID: <a href="https://discord.com/users/1354206425068343419" target="_blank" class="k-out-link">https://discord.com/users/1354206425068343419</a><br>
  • Handle: <span class="k-out-green">@1.n.only.fs</span>
</div>`);
                break;

            case 'ls':
            case 'dir':
                printLine(`
<div class="kali-cli-cmd-output" style="font-family: monospace; font-size: 0.8rem; line-height: 1.4;">
<span style="color: #64748b;">total 128</span><br>
<span style="color: #00ffff;">drwxr-xr-x</span> 4 farhan farhan  4096 Oct 16 2026 <span style="color: #00ff66;">./</span><br>
<span style="color: #00ffff;">drwxr-xr-x</span> 8 root   root    4096 Oct 16 2026 <span style="color: #00ff66;">../</span><br>
<span style="color: #64748b;">-rwxr-xr-x</span> 1 farhan farhan 98200 Oct 16 2026 <span style="color: #aaff00;">penmunshi.py*</span><br>
<span style="color: #64748b;">-rwxr-xr-x</span> 1 farhan farhan 84310 Oct 16 2026 <span style="color: #aaff00;">mars_geospectra_eva.ts*</span><br>
<span style="color: #64748b;">-rwxr-xr-x</span> 1 farhan farhan 79140 Oct 16 2026 <span style="color: #aaff00;">kisansetu_procurement.py*</span><br>
<span style="color: #64748b;">-rwxr-xr-x</span> 1 farhan farhan 64120 Oct 16 2026 <span style="color: #aaff00;">event_scout_agent.py*</span><br>
<span style="color: #64748b;">-rwxr-xr-x</span> 1 farhan farhan 71200 Oct 16 2026 <span style="color: #aaff00;">secuscan_core.py*</span><br>
<span style="color: #64748b;">-rwxr-xr-x</span> 1 farhan farhan 49000 Oct 16 2026 <span style="color: #aaff00;">argus_geospatial.ts*</span><br>
<span style="color: #64748b;">-rwxr-xr-x</span> 1 farhan farhan 88200 Oct 16 2026 <span style="color: #aaff00;">winaurex_builder.ps1*</span><br>
<span style="color: #64748b;">-rwxr-xr-x</span> 1 farhan farhan 54000 Oct 16 2026 <span style="color: #aaff00;">bdstorage_cas.rs*</span><br>
<span style="color: #64748b;">-rwxr-xr-x</span> 1 farhan farhan 32180 Oct 16 2026 <span style="color: #aaff00;">random_walk_btc.py*</span><br>
<span style="color: #64748b;">-rwxr-xr-x</span> 1 farhan farhan 45012 Oct 16 2026 <span style="color: #aaff00;">scamshield_engine.py*</span><br>
<span style="color: #64748b;">-rw-r--r--</span> 1 farhan farhan 18450 Oct 16 2026 <span style="color: #ffffff;">Farhan_Shaikh_Resume.pdf</span>
</div>`);
                break;

            case 'cat':
                const targetFile = args[0] || '';
                if (!targetFile) {
                    printLine(`<div class="kali-cli-cmd-output"><span class="k-out-amber">Usage:</span> cat &lt;filename&gt;<br>Example: <span class="k-out-green">cat Farhan_Shaikh_Resume.pdf</span> or <span class="k-out-green">cat penmunshi.py</span></div>`);
                } else if (targetFile.toLowerCase().includes('resume') || targetFile.toLowerCase().includes('cv')) {
                    executeCommand('cv');
                } else if (targetFile.toLowerCase().includes('mars') || targetFile.toLowerCase().includes('geospectra')) {
                    printLine(`
<div class="kali-cli-cmd-output" style="font-family: monospace; font-size: 0.75rem; color: #ff9900;">
// Mars-GeoSpectra Tobler 0.38g Routing Loop (Excerpt)<br>
export function toblerMarsVelocity(slopeAngleRad: number): number {<br>
&nbsp;&nbsp;&nbsp;&nbsp;const marsGravityMod = 0.38 / 1.0;<br>
&nbsp;&nbsp;&nbsp;&nbsp;const baseSpeedKmH = 6.0 * Math.exp(-3.5 * Math.abs(Math.tan(slopeAngleRad) + 0.05));<br>
&nbsp;&nbsp;&nbsp;&nbsp;return (baseSpeedKmH / 3.6) * (1.0 + 0.15 * (1.0 - marsGravityMod));<br>
}
</div>`);
                } else if (targetFile.toLowerCase().includes('kisansetu') || targetFile.toLowerCase().includes('procurement')) {
                    printLine(`
<div class="kali-cli-cmd-output" style="font-family: monospace; font-size: 0.75rem; color: #00ffaa;">
# KisanSetu-AI Mandi Slot Allocation Engine (Excerpt)<br>
async def optimize_mandi_allocation(farmer_queue, yard_capacity):<br>
&nbsp;&nbsp;&nbsp;&nbsp;ranked = sorted(farmer_queue, key=lambda f: (f.perishability_score * 0.45 + f.distance_km * 0.35 + f.holding_cost * 0.20), reverse=True)<br>
&nbsp;&nbsp;&nbsp;&nbsp;return [assign_timeslot(f, yard_capacity.get_next_available()) for f in ranked]
</div>`);
                } else if (targetFile.toLowerCase().includes('penmunshi')) {
                    printLine(`
<div class="kali-cli-cmd-output" style="font-family: monospace; font-size: 0.75rem; color: #aaff00;">
# PenMunshi Copilot Core Loop (Excerpt)<br>
from ollama import Client as OllamaClient<br>
from rapidocr_onnxruntime import RapidOCR<br><br>
def redact_and_score(evidence_image, nmap_report):<br>
&nbsp;&nbsp;&nbsp;&nbsp;ocr = RapidOCR()<br>
&nbsp;&nbsp;&nbsp;&nbsp;boxes, _ = ocr(evidence_image)<br>
&nbsp;&nbsp;&nbsp;&nbsp;sanitized = apply_blackout_bounds(evidence_image, boxes)<br>
&nbsp;&nbsp;&nbsp;&nbsp;cvss = deterministic_cvss_v31(nmap_report.metrics)<br>
&nbsp;&nbsp;&nbsp;&nbsp;return OllamaClient().generate(model='gemma4:latest', prompt=f"{sanitized} {cvss}")
</div>`);
                } else if (targetFile.toLowerCase().includes('bdstorage')) {
                    printLine(`
<div class="kali-cli-cmd-output" style="font-family: monospace; font-size: 0.75rem; color: #00f3ff;">
// bdstorage CAS chunker (Excerpt)<br>
use blake3::Hasher;<br>
use fastcdc::v2020::FastCDC;<br><br>
pub fn store_content(buffer: &amp;[u8]) -&gt; Vec&lt;[u8; 32]&gt; {<br>
&nbsp;&nbsp;&nbsp;&nbsp;let chunker = FastCDC::new(buffer, 16384, 65536, 262144);<br>
&nbsp;&nbsp;&nbsp;&nbsp;chunker.map(|c| Hasher::new().update(&amp;buffer[c.offset..c.offset + c.length]).finalize().into()).collect()<br>
}
</div>`);
                } else {
                    printLine(`<div class="kali-cli-cmd-output"><span class="k-out-red">cat: ${escapeHtml(targetFile)}: Permission denied or simulated EOF</span></div>`);
                }
                break;

            case 'pwd':
                printLine(`<div class="kali-cli-cmd-output"><span class="k-out-green">/home/farhan/arsenal</span></div>`);
                break;

            case 'uname':
                printLine(`<div class="kali-cli-cmd-output"><span class="k-out-green">Linux kali 6.8.0-kali-custom-ebpf #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux</span></div>`);
                break;

            case 'date':
                printLine(`<div class="kali-cli-cmd-output"><span class="k-out-cyan">${new Date().toString()}</span></div>`);
                break;

            case 'motd':
            case 'banner':
                printLine(`
<div class="kali-cli-banner" style="margin-bottom: 8px;">
  _____ _    ____  _   _    _    _   _ 
 |  ___/ \\  |  _ \\| | | |  / \\  | \\ | |
 | |_ / _ \\ | |_) | |_| | / _ \\ |  \\| |
 |  _/ ___ \\|  _ &lt;|  _  |/ ___ \\| |\\  |
 |_|/_/   \\_\\_| \\_\\_| |_/_/   \\_\\_| \\_|  v4.4.0 // KALI LINUX ROOT
════════════════════════════════════════════════════════════════
Farhan Shaikh Cybernetic Terminal Shell Online.
</div>`);
                break;
            case 'theme':
            case 'hud':
                const themeTarget = args[0] ? args[0].toLowerCase() : '';
                if (themeTarget && ['stealth', 'acid', 'synthwave'].includes(themeTarget)) {
                    if (typeof window.setHudTheme === 'function') {
                        window.setHudTheme(themeTarget, true);
                        printLine(`<div class="kali-cli-cmd-output"><span class="k-out-green">[+] HUD theme locked to: ${themeTarget.toUpperCase()}</span></div>`);
                    }
                } else {
                    const themeBtn = document.getElementById('themeSwitchBtn');
                    if (themeBtn) themeBtn.click();
                    const cur = document.body.classList.contains('theme-acid') ? 'ACID' : (document.body.classList.contains('theme-synthwave') ? 'SYNTHWAVE' : 'STEALTH OBSIDIAN');
                    printLine(`<div class="kali-cli-cmd-output"><span class="k-out-cyan">[+] Switched HUD theme to: ${cur}</span><br><span style="color:#64748b;">(Hint: You can also specify 'theme stealth', 'theme acid', or 'theme synthwave')</span></div>`);
                }
                break;

            case 'clear':
            case 'cls':
                if (historyContainer) historyContainer.innerHTML = '';
                break;

            case 'exit':
            case 'quit':
                closeTerminal();
                break;

            default:
                printLine(`
<div class="kali-cli-cmd-output">
  <span class="k-out-red">zsh: command not found: ${escapeHtml(cmd)}</span><br>
  Type <span class="k-out-green">help</span> to view available operations.
</div>`);
                break;
        }
    }

    input.addEventListener('keydown', (e) => {
        playKeySound();

        // Enter key -> submit command
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = input.value;
            input.value = '';
            executeCommand(val);
            return;
        }

        // History Up Arrow
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length > 0 && historyIdx > 0) {
                historyIdx--;
                input.value = history[historyIdx] || '';
            }
            return;
        }

        // History Down Arrow
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIdx < history.length - 1) {
                historyIdx++;
                input.value = history[historyIdx] || '';
            } else {
                historyIdx = history.length;
                input.value = '';
            }
            return;
        }

        // Tab Autocomplete
        if (e.key === 'Tab') {
            e.preventDefault();
            const current = input.value.trim().toLowerCase();
            if (!current) return;
            const match = COMMANDS.find(c => c.startsWith(current));
            if (match) {
                input.value = match;
            }
            return;
        }
    });
}

// =====================================================================
//  INTERACTIVE ARCHITECTURE & TELEMETRY MODAL ENGINE
//  Deep-dive system blueprints, dataflow diagrams, and empirical metrics
// =====================================================================
function initArchModal() {
    if (window._archModalInitialized) return;
    window._archModalInitialized = true;

    const modal = document.getElementById('archModal');
    const backdrop = document.getElementById('archModalBackdrop');
    const closeBtn = document.getElementById('archModalCloseBtn');
    const titleEl = document.getElementById('archModalTitle');
    const subtitleEl = document.getElementById('archModalSubtitle') || document.getElementById('archModalTagline');
    const badgesEl = document.getElementById('archModalBadges');
    const descEl = document.getElementById('archModalDesc');
    const diagramEl = document.getElementById('archModalDiagram');
    const metricsEl = document.getElementById('archModalMetrics');
    const terminalBtn = document.getElementById('archLaunchTerminalBtn');
    const githubBtn = document.getElementById('archGithubLink') || document.getElementById('archGithubBtn');
    const demoBtn = document.getElementById('archDemoLink');
    const inspectBtns = document.querySelectorAll('.project-inspect-btn');

    if (!modal) return;

    const ARCH_DATA = {
        penmunshi: {
            title: 'PENMUNSHI // VAPT REPORT COPILOT',
            tagline: '100% OFFLINE-FIRST PENTEST ENGINE // LOCAL GEMMA 4 ON OLLAMA',
            desc: 'PenMunshi is an offline-first vulnerability assessment and penetration testing report copilot. Engineered specifically to solve enterprise data privacy mandates where client vulnerability data cannot touch third-party clouds. Integrates sub-span OCR blackout, deterministic CVSS v3.1 mathematical verification, and automated Nmap/Burp scanner ingestion into client-ready DOCX deliverables.',
            diagram: `┌─────────────────────┐       ┌────────────────────────┐       ┌──────────────────────┐
│   Nmap / Burp XML   │ ────► │  In-Memory Rule Parser │ ────► │  CVSS v3.1 Code Math │
│   Evidence Screen   │       │ (RapidOCR Pixel Mask)  │       │ (Zero Hallucination) │
└─────────────────────┘       └────────────────────────┘       └──────────────────────┘
                                          │                                │
                                          ▼                                ▼
                             ┌────────────────────────┐       ┌──────────────────────┐
                             │ Local Gemma 4 (Ollama) │ ────► │ Agency DOCX & HTML   │
                             │ Zero Third-Party Leaks │       │ Client Deliverables  │
                             └────────────────────────┘       └──────────────────────┘`,
            metrics: [
                { val: '100%', label: 'Data Sovereignty (Zero Cloud API Calls)' },
                { val: '0.00', label: 'CVSS Error (Deterministic Math)' },
                { val: '100%', label: 'Secret Recall (RapidOCR Blackout)' },
                { val: 'DOCX / HTML', label: 'Agency Client Deliverables' }
            ],
            badges: ['LOCAL GEMMA 4', 'OLLAMA', 'RAPIDOCR', 'CVSS V3.1 MATH'],
            cmd: 'penmunshi',
            github: 'https://github.com/YTxFSGAMERz/penmunshi'
        },
        eventintel: {
            title: 'EVENT INTELLIGENCE AGENT // SCOUT',
            tagline: '24/7 AUTONOMOUS OPPORTUNITY AGENT // $2.4M+ PRIZES MONITORED',
            desc: 'Autonomous agent continuously scraping, deduplicating, and verifying high-stakes hackathons, engineering grants, research fellowships, and accelerator deadlines worldwide. Employs hallucination verification against official authority domains before dispatching encrypted real-time alerts via Telegram Bot.',
            diagram: `┌────────────────────┐       ┌────────────────────────┐       ┌──────────────────────┐
│ Global Feeds & Web │ ────► │ Headless Content Miner │ ────► │ Source Verification  │
│ Hackathons/Grants  │       │ (DOM & API Ingestion)  │       │ (Official Authority) │
└────────────────────┘       └────────────────────────┘       └──────────────────────┘
                                          │                               │
                                          ▼                               ▼
                             ┌────────────────────────┐      ┌──────────────────────┐
                             │ GitHub Actions (Cron)  │ ────►│ Telegram Push Relay  │
                             │ Autonomous 24/7 Run    │      │ Instant Team Alert   │
                             └────────────────────────┘      └──────────────────────┘`,
            metrics: [
                { val: '$2.4M+', label: 'Prize Pools & Grants Indexed' },
                { val: '10-min', label: 'Autonomous Cron Interval' },
                { val: '0%', label: 'False Positives (Verified Checks)' },
                { val: 'Telegram', label: 'Real-time Bot Push Relay' }
            ],
            badges: ['AUTONOMOUS RECON', 'TELEGRAM BOT', 'GITHUB ACTIONS', '$2.4M+ INDEXED'],
            cmd: 'event-intel',
            github: 'https://github.com/YTxFSGAMERz/event-intelligence-agent'
        },
        geovigilant: {
            title: 'GEOVIGILANT ARGUS // 3D PLANETARY OSINT',
            tagline: 'TACTICAL MULTI-DOMAIN OSINT & TELEMETRY // THREE.JS & WEBGL',
            desc: 'High-framerate 3D globe visualization rendering global intelligence, ADS-B commercial & military flight vectors, AIS maritime vessels, and orbital satellite telemetry in real-time. Built with custom WebGL shaders, GPU instancing, and interactive tactical coordinates.',
            diagram: `┌──────────────────────┐       ┌──────────────────────┐       ┌─────────────────────┐
│ Real-Time ADS-B/AIS  │ ────► │ Telemetry Ingestion  │ ────► │ GPU Instanced Mesh  │
│ Global Vector Feeds  │       │ GeoJSON Projection   │       │ Custom GLSL Shaders │
└──────────────────────┘       └──────────────────────┘       └─────────────────────┘
                                          │                              │
                                          ▼                              ▼
                             ┌──────────────────────┐       ┌─────────────────────┐
                             │ Three.js 3D Globe    │ ────► │ 60 FPS Tactical HUD │
                             │ Orbital Trajectories │       │ Live Interactive UI │
                             └──────────────────────┘       └─────────────────────┘`,
            metrics: [
                { val: '60 FPS', label: 'WebGL Hardware Acceleration' },
                { val: '10k+', label: 'Instanced Planetary Points' },
                { val: '< 50ms', label: 'Coordinate Project Latency' },
                { val: '3D HUD', label: 'Tactical Camera Rig' }
            ],
            badges: ['THREE.JS', 'WEBGL', 'ADS-B / AIS', 'OSINT'],
            cmd: 'argus',
            github: 'https://github.com/YTxFSGAMERz/GeoVigilant-Argus',
            demo: 'https://geovigilant-argus.vercel.app'
        },
        secuscan: {
            title: 'SECUSCAN // LOCAL VULNERABILITY WORKSPACE',
            tagline: 'LOCAL-FIRST OFFENSIVE SCANNING // FASTAPI + REACT/TS // 60 TOOLS',
            desc: 'Local-first security scanning workspace providing standardized execution controls, normalized vulnerability findings, and 60 catalogued offensive integrations (Nmap, Nikto, Nuclei, Sqlmap, Masscan, SSLyze). Orchestrated with FastAPI backend and high-performance React/TypeScript UI without third-party cloud leakage.',
            diagram: `┌──────────────────────┐       ┌──────────────────────┐       ┌─────────────────────┐
│ 60 Catalogued Tools  │ ────► │ FastAPI Orchestrator │ ────► │ Memory Normalized   │
│ Nmap/Nuclei/Nikto    │       │ Isolated Execution   │       │ Vulnerability Engine│
└──────────────────────┘       └──────────────────────┘       └─────────────────────┘
                                          │                              │
                                          ▼                              ▼
                             ┌──────────────────────┐       ┌─────────────────────┐
                             │ React / TS Workspace │ ────► │ Live CVE Dashboard  │
                             │ Local-First Control  │       │ Instant HTML Report │
                             └──────────────────────┘       └─────────────────────┘`,
            metrics: [
                { val: '60+', label: 'Integrated Security Tools' },
                { val: '< 12ms', label: 'Finding Normalization' },
                { val: '100%', label: 'Local-First Data Privacy' },
                { val: 'FastAPI', label: 'Async Python Backend' }
            ],
            badges: ['FASTAPI', 'REACT 19', '60 SCANNERS', 'LOCAL-FIRST'],
            cmd: 'secuscan',
            github: 'https://github.com/YTxFSGAMERz/SecuScan',
            demo: 'https://secuscan.in'
        },
        enterpriserag: {
            title: 'ENTERPRISERAG-AI // eBPF GOVERNANCE MESH',
            tagline: 'LINUX-NATIVE SECURITY & GOVERNANCE MESH FOR AI AGENT WORKLOADS',
            desc: 'Zero-overhead Linux-native eBPF security mesh engineered to monitor, sandbox, and govern autonomous AI agent workloads in real time. Enforces kernel-level syscall tracing, secret leak redaction, dynamic memory fencing, and vector retrieval validation before LLM inference.',
            diagram: `┌──────────────────────┐       ┌──────────────────────┐       ┌─────────────────────┐
│ Autonomous AI Agent  │ ────► │ eBPF Kernel Probes   │ ────► │ Syscall Fencing &   │
│ Tool Calls & Memory  │       │ (kprobe / tracepoint)│       │ Secret Redactor     │
└──────────────────────┘       └──────────────────────┘       └─────────────────────┘
                                          │                              │
                                          ▼                              ▼
                             ┌──────────────────────┐       ┌─────────────────────┐
                             │ Low-Latency Vector   │ ────► │ Real-Time Telemetry │
                             │ Retrieval Validator  │       │ Audit Enforcement   │
                             └──────────────────────┘       └─────────────────────┘`,
            metrics: [
                { val: '< 1.2μs', label: 'eBPF Kernel Probe Latency' },
                { val: '100%', label: 'Syscall Trace Coverage' },
                { val: '0 Byte', label: 'Unverified External Leak' },
                { val: 'Live Mesh', label: 'Air-Gapped Governance' }
            ],
            badges: ['LINUX EBPF', 'KPROBE/TRACEPOINT', 'AI GOVERNANCE', 'LOCAL OLLAMA'],
            cmd: 'enterpriserag',
            github: 'https://github.com/YTxFSGAMERz/EnterpriseRAG-AI',
            demo: 'https://enterpriserag-ai.vercel.app'
        },
        scamshield: {
            title: 'SCAMSHIELD // MULTIMODAL FRAUD DEFENSE',
            tagline: 'NEURAL FRAUD TRIAGE // GEMMA 4 VISION + MULTI-LINGUAL NLP',
            desc: 'Consumer & enterprise defense shield detecting fraudulent payment screenshots, spoofed bank receipts, and phishing messages. Features visual tampering analysis on UPI/bank transaction proofs and vernacular NLP models trained on regional Indian dialects (Hindi, Gujarati, English).',
            diagram: `┌──────────────────────┐       ┌──────────────────────┐       ┌─────────────────────┐
│ UPI / Bank Receipts  │ ────► │ Gemma 4 Vision Model │ ────► │ Font & Pixel Error  │
│ Phishing Message SMS │       │ Layout & Text Parse  │       │ Tamper Detection    │
└──────────────────────┘       └──────────────────────┘       └─────────────────────┘
                                          │                              │
                                          ▼                              ▼
                             ┌──────────────────────┐       ┌─────────────────────┐
                             │ Vernacular NLP Engine│ ────► │ Instant Threat Score│
                             │ (EN, HI, GU Dialects)│       │ Phish Block Action  │
                             └──────────────────────┘       └─────────────────────┘`,
            metrics: [
                { val: '3 Dialects', label: 'Multi-Lingual Engine (EN/HI/GU)' },
                { val: '< 80ms', label: 'Inference Time / Proof' },
                { val: '100%', label: 'Font & Layout Verification' },
                { val: 'Vision+NLP', label: 'Multimodal Dual-Verification' }
            ],
            badges: ['GEMMA 4 VISION', 'VERNACULAR NLP', 'HACKTOBERFEST', 'FRAUD DEFENSE'],
            cmd: 'scamshield',
            github: 'https://github.com/YTxFSGAMERz/ScamShield',
            demo: 'https://scamshield-sandy.vercel.app'
        },
        winaurex: {
            title: 'WINAUREX // WINDOWS 11 IMAGE LAB',
            tagline: 'KERNEL DEBLOAT SUITE // 8★ GITHUB STARS // UNATTENDED DISM',
            desc: 'Autonomous image servicing tool engineered in modern PowerShell and DISM. Strips bloatware, telemetry, Cortana, and background tracking services, while offering unattended ISO creation with hardware requirement bypasses (TPM 2.0, SecureBoot, RAM checks).',
            diagram: `┌──────────────────────┐       ┌──────────────────────┐       ┌─────────────────────┐
│ Windows 11 Stock ISO │ ────► │ Mount WIM / DISM API │ ────► │ Telemetry & AppX    │
│ Install.wim Source   │       │ Package Extraction   │       │ Stripping Routines  │
└──────────────────────┘       └──────────────────────┘       └─────────────────────┘
                                          │                              │
                                          ▼                              ▼
                             ┌──────────────────────┐       ┌─────────────────────┐
                             │ Unattend.xml Bypass  │ ────► │ 2.1GB Idle RAM ISO  │
                             │ (TPM 2.0, RAM, CPU)  │       │ Zero Telemetry Pack │
                             └──────────────────────┘       └─────────────────────┘`,
            metrics: [
                { val: '8★ Stars', label: 'Verified Community Stars' },
                { val: '2.1 GB', label: 'Idle Memory (vs 4.8GB stock)' },
                { val: '0 kB', label: 'Background Telemetry Outflow' },
                { val: '100%', label: 'Automated Unattended ISO' }
            ],
            badges: ['POWERSHELL 7+', 'DISM API', '8★ GITHUB', 'KERNEL DEBLOAT'],
            cmd: 'winaurex',
            github: 'https://github.com/YTxFSGAMERz/WinAurex',
            demo: 'https://winaurex.vercel.app'
        },
        randomwalk: {
            title: 'RANDOM WALK // STATISTICAL BTC MODEL',
            tagline: 'ECONOMETRIC MARKET EFFICIENCY TESTING // 4,735+ DAILY OBS',
            desc: 'Rigorous econometric investigation of the Efficient Market Hypothesis (EMH) on Bitcoin high-frequency and daily pricing. Combines Augmented Dickey-Fuller unit root tests, Lo-MacKinlay Variance Ratio tests (showing VR = 1.32 rejecting random walk at 99% confidence), and GARCH(1,1) clustered volatility analysis.',
            diagram: `┌──────────────────────┐       ┌──────────────────────┐       ┌─────────────────────┐
│ BTC-USD Time Series  │ ────► │ Augmented Dickey-    │ ────► │ Lo-MacKinlay        │
│ 4,735 Observations   │       │ Fuller Unit Root     │       │ Variance Ratio Test │
└──────────────────────┘       └──────────────────────┘       └─────────────────────┘
                                          │                              │
                                          ▼                              ▼
                             ┌──────────────────────┐       ┌─────────────────────┐
                             │ Non-Parametric Runs  │ ────► │ GARCH(1,1) Vol Model│
                             │ Autocorrelation PACF │       │ Fat-Tail Residuals  │
                             └──────────────────────┘       └─────────────────────┘`,
            metrics: [
                { val: '4,735', label: 'Daily Observations Analyzed' },
                { val: 'VR = 1.32', label: 'Variance Ratio (Rejects RWH)' },
                { val: '99%', label: 'Statistical Confidence Level' },
                { val: 'GARCH(1,1)', label: 'Clustered Volatility Fit' }
            ],
            badges: ['PYTHON STATSMODELS', 'GARCH(1,1)', 'BTC-USD TIME-SERIES', 'LO-MACKINLAY'],
            cmd: 'rwh',
            github: 'https://github.com/YTxFSGAMERz/Random-Walk-Hypothesis'
        },
        bdstorage: {
            title: 'BDSTORAGE // RUST CAS ENGINE',
            tagline: 'HIGH-PERFORMANCE CONTENT-ADDRESSABLE STORAGE // PUBLISHED ON CRATES.IO',
            desc: 'High-throughput Content-Addressable Storage (CAS) engine published on Crates.io. Engineered in modern Rust with system-wide rolling file deduplication, BLAKE3 chunk hashing, lockless concurrent B-tree indexing, and zero-copy block streaming for multi-gigabyte filesystems.',
            diagram: `┌──────────────────────┐       ┌──────────────────────┐       ┌─────────────────────┐
│ Ingest File Stream   │ ────► │ BLAKE3 Dynamic Chunk │ ────► │ Content-Addressable │
│ Zero-Copy Read (mmap)│       │ CDC FastCDC Engine   │       │ CAS Hash Registry   │
└──────────────────────┘       └──────────────────────┘       └─────────────────────┘
                                          │                              │
                                          ▼                              ▼
                             ┌──────────────────────┐       ┌─────────────────────┐
                             │ Lockless Dedup Cache │ ────► │ 100% Unique Blocks  │
                             │ System Deduplication │       │ Crates.io Published │
                             └──────────────────────┘       └─────────────────────┘`,
            metrics: [
                { val: 'Crates.io', label: 'Published Rust Crate' },
                { val: 'BLAKE3', label: 'Cryptographic Hashing' },
                { val: '100%', label: 'Deduplication Precision' },
                { val: 'Zero-Copy', label: 'Memory-Mapped I/O' }
            ],
            badges: ['RUST 2021', 'CRATES.IO', 'BLAKE3', 'CAS DEDUP', 'SYSTEMS'],
            cmd: 'bdstorage',
            github: 'https://github.com/YTxFSGAMERz/bdstorage',
            demo: 'https://crates.io/crates/bdstorage'
        },
        quantum: {
            title: 'QUANTUM ALPHA // 4D MARKET TOPOLOGY',
            tagline: 'GPU-ACCELERATED PYVISTA VTK 3D ENERGY ENGINE // 120 FPS COMPOSITOR',
            desc: 'High-performance quantitative animation and market intelligence engine rendering 3,400+ trading days across BTC, ETH, SPY, and Gold as a dynamic 4D energy topology. Re-engineered from 10-hour CPU Matplotlib into a sub-second parallel GPU VTK/PyVista compositor running at 120 FPS.',
            diagram: `┌──────────────────────┐       ┌──────────────────────┐       ┌─────────────────────┐
│ Multi-Asset 3400d DB │ ────► │ Feature Tensor Grid  │ ────► │ 4D Energy Matrix    │
│ BTC / ETH / SPY / GLD│       │ Volatility, Mom, RSI │       │ E(t, a) Field Calc  │
└──────────────────────┘       └──────────────────────┘       └─────────────────────┘
                                          │                              │
                                          ▼                              ▼
                             ┌──────────────────────┐       ┌─────────────────────┐
                             │ PyVista GPU (VTK)    │ ────► │ 120 FPS Compositor  │
                             │ 90x90 Spline Surface │       │ FFmpeg NVENC Video  │
                             └──────────────────────┘       └─────────────────────┘`,
            metrics: [
                { val: '120 FPS', label: 'Hardware Compositing Rate' },
                { val: '3,400+', label: 'Trading Days Modeled' },
                { val: 'PyVista GPU', label: 'VTK Topological Meshing' },
                { val: 'E(t, a)', label: '4D Vector Energy Scale' }
            ],
            badges: ['PYTHON 3.11', 'PYVISTA GPU', 'VTK', '120 FPS', 'QUANT FIN'],
            cmd: 'quantum',
            github: 'https://github.com/YTxFSGAMERz/Quantum-Market-Pulse-4D-Alpha-Engine',
            demo: 'https://colab.research.google.com/github/YTxFSGAMERz/Quantum-Market-Pulse-4D-Alpha-Engine/blob/main/Colab.ipynb'
        },
        marsgeospectra: {
            title: 'MARS-GEOSPECTRA // NASA 3D MISSION WORKSTATION',
            tagline: 'NASA SPACE APPS CHALLENGE 2026 // JEZERO CRATER EVA PLANNER',
            desc: 'Planetary mission-planning workstation engineered for future human Marswalk EVAs around Jezero Crater (NASA Mars 2020 Perseverance). Synthesizes 6 NASA mission datasets (MOLA laser altimetry, CRISM hyperspectral minerals, HiRISE 0.25m/px, CTX, THEMIS infrared, and Perseverance MEDA in-situ atmospheric telemetry) with a multi-objective A* terrain routing engine adapting Tobler kinematics to Mars 0.38g gravity, interactive 3D WebGL simulation HUD, and a Grounded AI Mission Scientist.',
            diagram: `┌──────────────────────┐       ┌──────────────────────┐       ┌─────────────────────┐
│ 6 NASA Orbiter PDS   │ ────► │ Multi-Objective A*   │ ────► │ 3D Jezero DEM HUD   │
│ MOLA/CRISM/HiRISE/MED│       │ Kinematics Model (0.38g)│    │ Interactive WebGL   │
└──────────────────────┘       └──────────────────────┘       └─────────────────────┘
                                          │                              │
                                          ▼                              ▼
                             ┌──────────────────────┐       ┌─────────────────────┐
                             │ Grounded AI Scientist│ ────► │ Field EVA Dossier   │
                             │ Zero Hallucination   │       │ Real-Time Scrubber  │
                             └──────────────────────┘       └─────────────────────┘`,
            metrics: [
                { val: '0.38g', label: 'Mars Gravity Kinematics' },
                { val: '6 Missions', label: 'NASA Datasets (MOLA, CRISM, MEDA)' },
                { val: '0.25m/px', label: 'HiRISE Sub-Meter Altimetry' },
                { val: 'NASA 2026', label: 'Space Apps Global Challenge' }
            ],
            badges: ['NASA SPACE APPS 2026', '3D WEBGL', 'A* TERRAIN ROUTING', 'JEZERO CRATER', 'GROUNDED AI'],
            cmd: 'mars',
            github: 'https://github.com/YTxFSGAMERz/Mars-GeoSpectra'
        },
        kisansetu: {
            title: 'KISANSETU-AI // AGRICULTURE ECOSYSTEM',
            tagline: 'SMART INDIA HACKATHON 2026 TEAM LEAD // FULL-STACK AGRI PLATFORM',
            desc: 'National smart agriculture procurement and logistics ecosystem built for Smart India Hackathon 2026 (Led by Farhan). Features a three-layer AI slot ranking engine minimizing Mandi congestion, live WebSocket queue state machine with digital weighbridge grading, MSP payment calculation, 11 async SQLAlchemy ORM tables, and 3 dedicated role portals (Farmer, Procurement Officer, Gov Admin).',
            diagram: `┌──────────────────────┐       ┌──────────────────────┐       ┌─────────────────────┐
│ 15 Mandis & 19 Crops │ ────► │ 3-Layer Scoring Alg  │ ────► │ Live Queue State    │
│ 1200+ Dynamic Slots  │       │ Congestion (0-100)   │       │ WebSocket Broadcast │
└──────────────────────┘       └──────────────────────┘       └─────────────────────┘
                                          │                              │
                                          ▼                              ▼
                             ┌──────────────────────┐       ┌─────────────────────┐
                             │ FastAPI + SQLAlchemy │ ────► │ 3 Role Portals      │
                             │ 11 Async ORM Tables  │       │ Farmer/Officer/Gov  │
                             └──────────────────────┘       └─────────────────────┘`,
            metrics: [
                { val: 'SIH 2026', label: 'Team Lead Project' },
                { val: '11 Tables', label: 'Async SQLAlchemy ORM Models' },
                { val: '< 50ms', label: 'WebSocket Event Broadcast' },
                { val: '3 Portals', label: 'Farmer, Officer & National Admin' }
            ],
            badges: ['SMART INDIA HACKATHON', 'TEAM LEAD', 'FASTAPI', 'NEXT.JS 15', 'WEBSOCKETS'],
            cmd: 'kisansetu',
            github: 'https://github.com/YTxFSGAMERz/KisanSetu-AI',
            demo: 'https://frontend-seven-sooty-62.vercel.app'
        }
    };

    let activeCmd = 'penmunshi';

    function openModal(projectKey) {
        const data = ARCH_DATA[projectKey] || ARCH_DATA.penmunshi;
        activeCmd = data.cmd;

        if (titleEl) titleEl.textContent = data.title;
        if (subtitleEl) subtitleEl.textContent = data.tagline;
        if (descEl) descEl.textContent = data.desc;
        if (diagramEl) diagramEl.textContent = data.diagram;
        if (githubBtn) githubBtn.href = data.github;

        if (badgesEl && data.badges) {
            badgesEl.innerHTML = data.badges.map(b => `<span class="arch-badge-chip">${b}</span>`).join('');
        }

        if (demoBtn) {
            if (data.demo) {
                demoBtn.style.display = 'inline-flex';
                demoBtn.href = data.demo;
            } else {
                demoBtn.style.display = 'none';
            }
        }

        if (metricsEl) {
            metricsEl.innerHTML = data.metrics.map(m => `
                <div class="arch-metric-card">
                    <span class="arch-metric-val">${m.val}</span>
                    <span class="arch-metric-label">${m.label}</span>
                </div>
            `).join('');
        }

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        if (typeof playSfxTrack === 'function') {
            playSfxTrack('sfxAccessGranted', null, 0.4);
        }
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        if (typeof playMenuClickSound === 'function') playMenuClickSound();
    }

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.project-inspect-btn');
        if (btn) {
            e.preventDefault();
            const projectKey = btn.getAttribute('data-project');
            openModal(projectKey);
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });

    if (terminalBtn) {
        terminalBtn.addEventListener('click', () => {
            closeModal();
            if (typeof window.openKaliTerminal === 'function') {
                window.openKaliTerminal(activeCmd);
            }
        });
    }
}

// =====================================================================
//  DATABASE HYDRATION & ADMIN INTEGRATION ENGINE
//  Loads local database from localStorage or data/portfolio-database.json
//  and dynamically updates Certifications, Projects, and Stats.
// =====================================================================
function initDatabaseHydration() {
    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    async function applyDatabaseData(data) {
        if (!data) return;

        // 1. Dynamic Certifications
        if (Array.isArray(data.certifications)) {
            const certsGrid = document.getElementById('certificationsGrid');
            if (certsGrid) {
                if (data.certifications.length === 0) {
                    certsGrid.innerHTML = `
                        <div class="empty-cms-state" style="grid-column: 1 / -1; padding: 50px 24px; text-align: center; border: 1px dashed rgba(0, 240, 255, 0.35); background: rgba(5, 10, 20, 0.7); border-radius: 8px;">
                            <span style="font-size: 32px; display: block; margin-bottom: 12px;">🎖️</span>
                            <h3 style="font-family: 'Space Grotesk', sans-serif; font-size: 20px; color: var(--neon-cyan, #00f0ff); margin-bottom: 8px; letter-spacing: 0.1em; text-transform: uppercase;">CREDENTIALS ARCHIVE // STANDBY</h3>
                            <p style="font-family: 'Space Mono', monospace; font-size: 13px; color: rgba(255,255,255,0.7); max-width: 520px; margin: 0 auto 20px; line-height: 1.6;">Verified honors and certifications record is synchronizing. Explore credentials and endorsements on LinkedIn.</p>
                            <a href="https://www.linkedin.com/in/farhan-shaikh-fs" target="_blank" rel="noopener noreferrer" class="cyber-btn" style="display: inline-block; padding: 10px 24px; font-size: 12px; text-decoration: none;">VERIFY ON LINKEDIN ↗</a>
                        </div>
                    `;
                } else {
                    certsGrid.innerHTML = data.certifications.map(c => `
                        <article class="cert-card" data-badge-color="${escapeHtml(c.badgeColor || 'cyan')}">
                            <span class="card-bracket tl"></span>
                            <span class="card-bracket tr"></span>
                            <span class="card-bracket bl"></span>
                            <span class="card-bracket br"></span>
                            <div class="cert-card-header">
                                <div class="cert-meta-left">
                                    <span class="cert-date-chip">${escapeHtml(c.date || '')}</span>
                                    <span class="cert-issuer">${escapeHtml(c.issuer || '')}</span>
                                </div>
                                <span class="cert-badge-tag badge-${escapeHtml(c.badgeColor || 'cyan')}">${escapeHtml(c.badge || 'VERIFIED')}</span>
                            </div>
                            <h3 class="cert-title">${escapeHtml(c.title || '')}</h3>
                            <div class="cert-role-line">
                                <span class="cert-role-icon">⚡</span>
                                <span class="cert-role-text">${escapeHtml(c.role || '')}</span>
                            </div>
                            <p class="cert-desc">${escapeHtml(c.description || '')}</p>
                            <div class="cert-skills-strip">
                                ${(c.skills || []).map(s => `<span class="cert-skill-pill">${escapeHtml(s)}</span>`).join('')}
                            </div>
                            <div class="cert-card-footer">
                                <span class="cert-id-tag"><span class="id-dim">ID:</span> ${escapeHtml(c.credentialId || '')}</span>
                                <a href="${escapeHtml(c.verifyUrl || '#')}" target="_blank" rel="noopener noreferrer" class="cert-verify-btn">
                                    <span>VERIFY CREDENTIAL</span>
                                    <span class="cert-verify-arrow">↗</span>
                                </a>
                            </div>
                        </article>
                    `).join('');
                }
            }
        }

        // 2. Profile stats
        if (data.profile && data.profile.stats) {
            const metricsBar = document.querySelector('.cyber-arsenal-metrics-bar');
            if (metricsBar) {
                const s = data.profile.stats;
                const pills = metricsBar.querySelectorAll('.metric-pill');
                if (pills.length >= 4) {
                    pills[0].innerHTML = `<span class="m-dot"></span>${escapeHtml(s.modules || '08')} ARSENAL MODULES`;
                    pills[1].innerHTML = `<span class="m-dot"></span>${escapeHtml(s.repos || '64+')} OPEN-SOURCE REPOS`;
                    pills[2].innerHTML = `<span class="m-dot"></span>NASA SPACE APPS &amp; SIH LEAD`;
                    pills[3].innerHTML = `<span class="m-dot"></span>CRATES.IO PUBLISHED CAS`;
                }
            }
        }

        // 3. Dynamic Projects Hydration (Full Admin CMS Live Sync)
        if (Array.isArray(data.projects)) {
            const projectsGrid = document.getElementById('projectsGrid');
            if (projectsGrid) {
                if (data.projects.length === 0) {
                    projectsGrid.innerHTML = `
                        <div class="empty-cms-state" style="grid-column: 1 / -1; padding: 50px 24px; text-align: center; border: 1px dashed rgba(150, 243, 21, 0.35); background: rgba(5, 10, 20, 0.7); border-radius: 8px;">
                            <span style="font-size: 32px; display: block; margin-bottom: 12px;">⚡</span>
                            <h3 style="font-family: 'Space Grotesk', sans-serif; font-size: 20px; color: var(--neon-green, #96f315); margin-bottom: 8px; letter-spacing: 0.1em; text-transform: uppercase;">PROJECT ARCHIVE // STANDBY</h3>
                            <p style="font-family: 'Space Mono', monospace; font-size: 13px; color: rgba(255,255,255,0.7); max-width: 520px; margin: 0 auto 20px; line-height: 1.6;">Repositories are currently undergoing scheduled deployment. Explore live source archives directly on GitHub.</p>
                            <a href="https://github.com/YTxFSGAMERz" target="_blank" rel="noopener noreferrer" class="cyber-btn" style="display: inline-block; padding: 10px 24px; font-size: 12px; text-decoration: none;">EXPLORE GITHUB ARCHIVE (64+) ↗</a>
                        </div>
                    `;
                } else {
                    projectsGrid.innerHTML = data.projects.map((p, idx) => {
                        const num = escapeHtml(p.number || String(idx + 1).padStart(2, '0'));
                        const inspectBtn = p.inspectId ? `
                            <button type="button" class="project-inspect-btn" data-project="${escapeHtml(p.inspectId)}" title="Inspect ${escapeHtml(p.title)} Architecture">
                                <span class="btn-corner tl"></span><span class="btn-corner tr"></span><span class="btn-corner bl"></span><span class="btn-corner br"></span>
                                <span class="inspect-icon">⚙</span>
                                <span>INSPECT // ARCHITECTURE</span>
                            </button>
                        ` : '';
                        const repoBtn = p.githubUrl ? `
                            <a href="${escapeHtml(p.githubUrl)}" target="_blank" rel="noopener noreferrer" class="project-link-btn" title="View GitHub Repository">
                                <span class="btn-corner tl"></span><span class="btn-corner tr"></span><span class="btn-corner bl"></span><span class="btn-corner br"></span>
                                <span>GITHUB ↗</span>
                            </a>
                        ` : '';
                        const liveBtn = p.liveUrl ? `
                            <a href="${escapeHtml(p.liveUrl)}" target="_blank" rel="noopener noreferrer" class="project-link-btn" style="border-color: rgba(150, 243, 21, 0.4); color: var(--neon-green);" title="Open Live Deployment">
                                <span class="btn-corner tl"></span><span class="btn-corner tr"></span><span class="btn-corner bl"></span><span class="btn-corner br"></span>
                                <span>LIVE DEMO ↗</span>
                            </a>
                        ` : '';

                        return `
                            <article class="project-card" data-category="${escapeHtml(p.category || 'all')}">
                                <span class="card-bracket tl"></span>
                                <span class="card-bracket tr"></span>
                                <span class="card-bracket bl"></span>
                                <span class="card-bracket br"></span>

                                <div class="project-card-header">
                                    <div class="project-badge">
                                        <span class="badge-dot pulse-green"></span>
                                        <span class="badge-code">${escapeHtml(p.badge || 'PROJECT')}</span>
                                    </div>
                                    <span class="project-number">PROJECT // ${num}</span>
                                </div>

                                <div class="project-media-frame">
                                    <div class="media-sheen"></div>
                                    <img src="${escapeHtml(p.image || 'images/project_default.svg')}" alt="${escapeHtml(p.title)}" class="project-img" loading="lazy" onerror="this.onerror=null; this.src='images/project_default.svg';">
                                </div>

                                <div class="project-content">
                                    <h3 class="project-title">${escapeHtml(p.title || '')}</h3>
                                    <p class="project-desc">${escapeHtml(p.description || '')}</p>

                                    <div class="project-tech-tags">
                                        ${(p.techStack || []).map(t => `<span class="tech-pill">${escapeHtml(t)}</span>`).join('')}
                                    </div>

                                    <div class="project-actions">
                                        <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                                            ${inspectBtn}
                                            ${repoBtn}
                                            ${liveBtn}
                                        </div>
                                        ${p.specTag ? `<div class="project-spec-tag">${escapeHtml(p.specTag)}</div>` : ''}
                                    </div>
                                </div>
                            </article>
                        `;
                    }).join('');
                }

                if (typeof window.refreshProjectFilters === 'function') {
                    window.refreshProjectFilters();
                }
                if (typeof init3DHolographicCards === 'function') {
                    init3DHolographicCards();
                }
            }
        }

        // 4. Dynamic Skills & Tools Hydration (Cyber Arsenal)
        if (Array.isArray(data.skills)) {
            const arsenalRows = document.getElementById('cyberArsenalRows');
            if (arsenalRows) {
                if (data.skills.length === 0) {
                    arsenalRows.innerHTML = `
                        <div class="empty-cms-state" style="padding: 50px 24px; text-align: center; border: 1px dashed rgba(150, 243, 21, 0.35); background: rgba(5, 10, 20, 0.7); border-radius: 8px; margin-bottom: 24px;">
                            <span style="font-size: 32px; display: block; margin-bottom: 12px;">⚡</span>
                            <h3 style="font-family: 'Space Grotesk', sans-serif; font-size: 20px; color: var(--neon-green, #96f315); margin-bottom: 8px; letter-spacing: 0.1em; text-transform: uppercase;">ARSENAL MODULES // STANDBY</h3>
                            <p style="font-family: 'Space Mono', monospace; font-size: 13px; color: rgba(255,255,255,0.7); max-width: 520px; margin: 0 auto 20px; line-height: 1.6;">Technical capabilities and framework stack are reloading.</p>
                        </div>
                    `;
                } else {
                    const rowsHtml = [];
                    for (let i = 0; i < data.skills.length; i += 4) {
                        const chunk = data.skills.slice(i, i + 4);
                        const cardsHtml = chunk.map(s => {
                            const badgeCls = s.badgeType === 'red' ? 'card-tag-red' : (s.badgeType === 'green' ? 'card-tag-green' : 'card-pill-dark');
                            const symClass = s.id === 'automation' ? 'cyber-symbol-auto cyber-symbol-automation' : (s.id ? `cyber-symbol-${escapeHtml(s.id)}` : '');
                            const pWidth = escapeHtml(s.progressWidth || s.loadingPct || '95%');
                            return `
                                <div class="cyber-arsenal-card cyber-card-tech" data-card="${escapeHtml(s.id || '')}" data-cmd="${escapeHtml(s.cliCommand || 'help')}">
                                    <div class="card-inner">
                                        <div class="card-top-row">
                                            <span class="card-title-mono">${escapeHtml(s.title || '')}</span>
                                            <span class="${badgeCls}">${escapeHtml(s.badge || '')}</span>
                                        </div>
                                        <div class="card-art-box">
                                            <img src="${escapeHtml(s.image || 'images/project_default.svg')}" alt="${escapeHtml(s.title || '')}" class="cyber-symbol-img ${symClass}" loading="lazy" onerror="this.onerror=null; this.src='images/project_default.svg';">
                                        </div>
                                        <div class="card-loading-bar">
                                            <div class="loading-track">
                                                <div class="loading-fill fill-striped" style="width: ${pWidth};"></div>
                                            </div>
                                            <div class="loading-meta">
                                                <span class="loading-label">${escapeHtml(s.loadingLabel || '')}</span>
                                                <span class="loading-pct">${escapeHtml(s.loadingPct || '')}</span>
                                            </div>
                                            <span class="card-cli-action">&gt;_ RECON</span>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('');
                        rowsHtml.push(`<div class="cyber-bento-row cyber-four-cards" style="margin-bottom: 20px;">${cardsHtml}</div>`);
                    }
                    arsenalRows.innerHTML = rowsHtml.join('');
                }

                // Update the arsenal metrics pill
                const metricsBar = document.querySelector('.cyber-arsenal-metrics-bar');
                if (metricsBar) {
                    const firstPill = metricsBar.querySelector('.metric-pill');
                    if (firstPill) {
                        const countStr = String(data.skills.length).padStart(2, '0');
                        firstPill.innerHTML = `<span class="m-dot"></span>${countStr} ARSENAL MODULES`;
                    }
                }

                // Re-initialize click, hover listeners, and 3D specular shine / glare
                initCyberArsenalGrid();
                if (typeof init3DHolographicCards === 'function') {
                    init3DHolographicCards();
                }
            }
        }
    }

    // Auto-heal known project images if localStorage had outdated file paths
    const KNOWN_PROJECT_IMAGES = {
        'penmunshi': 'images/project_penmunshi.svg',
        'event-intel': 'images/project_eventintel.svg',
        'argus': 'images/project_geovigilant.png',
        'quantum': 'images/project_quantum.svg',
        'secuscan': 'images/project_secuscan.svg',
        'enterpriserag': 'images/project_enterpriserag.svg',
        'scamshield': 'images/project_scamshield.png',
        'winaurex': 'images/project_winaurex_banner.png',
        'rwh': 'images/project_randomwalk.png',
        'bdstorage': 'images/rust_symbol.svg',
        'marsgeospectra': 'images/project_marsgeospectra.png',
        'kisansetu': 'images/project_kisansetu.png'
    };

    function healDatabaseImages(database) {
        if (!database || !Array.isArray(database.projects)) return;
        database.projects.forEach(p => {
            if (KNOWN_PROJECT_IMAGES[p.id] && (!p.image || p.image.includes('_intel') || p.image.includes('project_argus') || p.image.includes('scamshield.svg') || p.image.includes('winaurex.svg') || p.image.includes('rwh.svg') || p.image.includes('bdstorage.svg') || p.image.includes('mars.png'))) {
                p.image = KNOWN_PROJECT_IMAGES[p.id];
            }
        });
    }

    // Load from local storage or json file with self-healing validation
    const local = localStorage.getItem('portfolio_database');
    let loadedFromLocal = false;
    if (local) {
        try {
            const parsed = JSON.parse(local);
            // Self-healing: Ensure local cache actually contains valid populated projects
            if (parsed && Array.isArray(parsed.projects) && parsed.projects.length > 0) {
                healDatabaseImages(parsed);
                applyDatabaseData(parsed);
                loadedFromLocal = true;
            } else {
                localStorage.removeItem('portfolio_database');
            }
        } catch (e) {
            console.warn('Failed parsing local database cache:', e);
            localStorage.removeItem('portfolio_database');
        }
    }

    if (!loadedFromLocal) {
        fetch('data/portfolio-database.json')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) {
                    healDatabaseImages(data);
                    applyDatabaseData(data);
                }
            })
            .catch(() => {});
    }

    // Live Cross-Tab Synchronization via Web Storage Events
    window.addEventListener('storage', (e) => {
        if (e.key === 'portfolio_database') {
            try {
                const updated = e.newValue ? JSON.parse(e.newValue) : null;
                if (updated && Array.isArray(updated.projects) && updated.projects.length > 0) {
                    healDatabaseImages(updated);
                    applyDatabaseData(updated);
                }
            } catch (err) {
                console.warn('Failed syncing storage update:', err);
            }
        }
    });
}



