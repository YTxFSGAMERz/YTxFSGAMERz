import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function generateOG() {
    console.log('Launching browser to render 1200x630 OG Preview...');
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    const page = await browser.newPage({
        viewport: { width: 1200, height: 630 },
        deviceScaleFactor: 2 // High-DPI 2x for ultra crisp rendering
    });

    const heroImgBase64 = fs.readFileSync(path.join(projectRoot, 'images/farhan-hero.jpg')).toString('base64');
    const symbolImgBase64 = fs.readFileSync(path.join(projectRoot, 'images/farhan-symbol.png')).toString('base64');

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&family=Space+Mono:wght@400;700&family=Orbitron:wght@700;900&display=swap');
            
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            body {
                width: 1200px;
                height: 630px;
                background: #08090d;
                color: #ffffff;
                font-family: 'Space Grotesk', sans-serif;
                overflow: hidden;
                position: relative;
                display: flex;
            }
            /* Cyber Grid Background */
            .grid-bg {
                position: absolute;
                inset: 0;
                background-image: 
                    linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px);
                background-size: 40px 40px;
                opacity: 0.8;
            }
            .ambient-glow-1 {
                position: absolute;
                top: -100px;
                left: -100px;
                width: 500px;
                height: 500px;
                background: radial-gradient(circle, rgba(170, 255, 0, 0.15) 0%, transparent 70%);
                pointer-events: none;
            }
            .ambient-glow-2 {
                position: absolute;
                bottom: -150px;
                right: 100px;
                width: 600px;
                height: 600px;
                background: radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, transparent 70%);
                pointer-events: none;
            }
            .ambient-glow-3 {
                position: absolute;
                top: 50px;
                right: -50px;
                width: 450px;
                height: 450px;
                background: radial-gradient(circle, rgba(176, 38, 255, 0.15) 0%, transparent 70%);
                pointer-events: none;
            }

            /* Container */
            .og-container {
                position: relative;
                z-index: 10;
                width: 100%;
                height: 100%;
                padding: 55px 65px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                border: 2px solid rgba(0, 240, 255, 0.2);
            }

            /* Left Info Column */
            .left-col {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 100%;
                max-width: 660px;
            }
            .brand-header {
                display: flex;
                align-items: center;
                gap: 16px;
            }
            .symbol-img {
                width: 54px;
                height: 54px;
                filter: drop-shadow(0 0 12px rgba(255, 30, 30, 0.8));
            }
            .brand-tagline {
                font-family: 'Space Mono', monospace;
                font-size: 13px;
                letter-spacing: 0.22em;
                color: #aaff00;
                text-transform: uppercase;
                background: rgba(170, 255, 0, 0.08);
                padding: 6px 14px;
                border: 1px solid rgba(170, 255, 0, 0.3);
                border-radius: 4px;
            }

            .main-titles {
                margin: 20px 0;
            }
            .hero-name {
                font-family: 'Orbitron', sans-serif;
                font-size: 62px;
                font-weight: 900;
                letter-spacing: 0.04em;
                line-height: 1.05;
                text-transform: uppercase;
                background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 40%, #00f0ff 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 0 0 30px rgba(0, 240, 255, 0.3);
            }
            .hero-alias {
                font-family: 'Space Mono', monospace;
                font-size: 18px;
                color: #00f0ff;
                margin-top: 8px;
                letter-spacing: 0.1em;
            }
            .hero-alias span {
                color: #aaff00;
            }
            .role-headline {
                font-size: 20px;
                font-weight: 700;
                color: #e2e8f0;
                letter-spacing: 0.05em;
                margin-top: 10px;
                text-transform: uppercase;
            }

            /* Achievements Badges */
            .badges-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-top: 15px;
            }
            .badge-item {
                display: flex;
                align-items: center;
                gap: 10px;
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid rgba(255, 255, 255, 0.12);
                padding: 10px 14px;
                border-radius: 6px;
                font-family: 'Space Mono', monospace;
                font-size: 12px;
                letter-spacing: 0.04em;
            }
            .badge-item.cyan {
                border-left: 3px solid #00f0ff;
                background: rgba(0, 240, 255, 0.05);
            }
            .badge-item.lime {
                border-left: 3px solid #aaff00;
                background: rgba(170, 255, 0, 0.05);
            }
            .badge-item.purple {
                border-left: 3px solid #b026ff;
                background: rgba(176, 38, 255, 0.05);
            }
            .badge-item.orange {
                border-left: 3px solid #ff7b00;
                background: rgba(255, 123, 0, 0.05);
            }

            /* Footer strip */
            .footer-strip {
                display: flex;
                align-items: center;
                gap: 20px;
                font-family: 'Space Mono', monospace;
                font-size: 12px;
                color: #94a3b8;
                padding-top: 12px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            .footer-strip b {
                color: #ffffff;
            }

            /* Right Photo Column */
            .right-col {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .photo-frame {
                position: relative;
                width: 320px;
                height: 420px;
                border-radius: 12px;
                overflow: hidden;
                border: 2px solid rgba(0, 240, 255, 0.5);
                box-shadow: 0 0 35px rgba(0, 240, 255, 0.25), inset 0 0 20px rgba(0, 0, 0, 0.8);
            }
            .photo-frame img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center 15%;
            }
            .photo-corner {
                position: absolute;
                width: 16px;
                height: 16px;
                border-color: #aaff00;
                border-style: solid;
            }
            .c-tl { top: 6px; left: 6px; border-width: 2px 0 0 2px; }
            .c-tr { top: 6px; right: 6px; border-width: 2px 2px 0 0; }
            .c-bl { bottom: 6px; left: 6px; border-width: 0 0 2px 2px; }
            .c-br { bottom: 6px; right: 6px; border-width: 0 2px 2px 0; }
            
            .photo-hud {
                position: absolute;
                bottom: 12px;
                left: 12px;
                right: 12px;
                background: rgba(8, 9, 13, 0.88);
                backdrop-filter: blur(8px);
                border: 1px solid rgba(0, 240, 255, 0.3);
                border-radius: 6px;
                padding: 8px 12px;
                display: flex;
                justify-content: space-between;
                font-family: 'Space Mono', monospace;
                font-size: 11px;
            }
            .hud-id { color: #00f0ff; }
            .hud-status { color: #aaff00; font-weight: 700; }

            .location-tag {
                margin-top: 12px;
                font-family: 'Space Mono', monospace;
                font-size: 11px;
                color: #64748b;
                letter-spacing: 0.15em;
            }
        </style>
    </head>
    <body>
        <div class="grid-bg"></div>
        <div class="ambient-glow-1"></div>
        <div class="ambient-glow-2"></div>
        <div class="ambient-glow-3"></div>

        <div class="og-container">
            <div class="left-col">
                <div class="brand-header">
                    <img src="data:image/png;base64,${symbolImgBase64}" class="symbol-img" alt="Emblem">
                    <div class="brand-tagline">OFFICIAL PORTFOLIO // FARHAN SHAIKH</div>
                </div>

                <div class="main-titles">
                    <h1 class="hero-name">FARHAN SHAIKH</h1>
                    <div class="hero-alias">IDENTITY: <span>FARHAN</span> • <span>@YTxFSGAMERz</span></div>
                    <div class="role-headline">AI &amp; CYBERSECURITY SYSTEMS ARCHITECT</div>
                </div>

                <div class="badges-grid">
                    <div class="badge-item cyan">
                        <span>🚀</span>
                        <span>NASA Space Apps '26 Finalist</span>
                    </div>
                    <div class="badge-item lime">
                        <span>🏆</span>
                        <span>Smart India Hackathon '26 Lead</span>
                    </div>
                    <div class="badge-item purple">
                        <span>📦</span>
                        <span>Crates.io Author (bdstorage CAS)</span>
                    </div>
                    <div class="badge-item orange">
                        <span>🛡️</span>
                        <span>Offensive Security &amp; VAPT</span>
                    </div>
                </div>

                <div class="footer-strip">
                    <div>URL: <b>ytxfsgamerz.github.io</b></div>
                    <div>•</div>
                    <div>GITHUB: <b>64+ Repositories</b></div>
                    <div>•</div>
                    <div>LOCATION: <b>India</b></div>
                </div>
            </div>

            <div class="right-col">
                <div class="photo-frame">
                    <img src="data:image/jpeg;base64,${heroImgBase64}" alt="Farhan Shaikh">
                    <div class="photo-corner c-tl"></div>
                    <div class="photo-corner c-tr"></div>
                    <div class="photo-corner c-bl"></div>
                    <div class="photo-corner c-br"></div>
                    <div class="photo-hud">
                        <span class="hud-id">ROOT // FARHAN</span>
                        <span class="hud-status">ONLINE [VERIFIED]</span>
                    </div>
                </div>
                <div class="location-tag">COORDINATES: 20°35'N 78°57'E // INDIA</div>
            </div>
        </div>
    </body>
    </html>
    `;

    await page.setContent(htmlContent, { waitUntil: 'networkidle' });
    
    // Save to both images/ and public/images/
    const targetPath1 = path.join(projectRoot, 'images/og-preview.png');
    const targetPath2 = path.join(projectRoot, 'public/images/og-preview.png');

    await page.screenshot({ path: targetPath1, type: 'png' });
    fs.copyFileSync(targetPath1, targetPath2);
    console.log(`Successfully generated OG preview banner: ${targetPath1} and ${targetPath2}`);

    await browser.close();
}

generateOG().catch(err => {
    console.error('Error generating OG preview:', err);
    process.exit(1);
});
