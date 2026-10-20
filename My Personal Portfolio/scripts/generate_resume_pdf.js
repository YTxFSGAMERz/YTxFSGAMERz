import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateResume() {
  const resumeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Farhan Shaikh — Resume</title>
  <style>
    @page {
      size: A4;
      margin: 12mm 14mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1a1e24;
      background: #ffffff;
      line-height: 1.38;
      font-size: 9.5pt;
    }
    .header {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 8px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .header-left h1 {
      font-size: 20pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      text-transform: uppercase;
    }
    .header-left .subtitle {
      font-size: 10pt;
      font-weight: 600;
      color: #0369a1;
      margin-top: 2px;
    }
    .contact-info {
      font-size: 8.5pt;
      text-align: right;
      color: #334155;
      line-height: 1.45;
    }
    .contact-info a {
      color: #0369a1;
      text-decoration: none;
      font-weight: 600;
    }
    .section {
      margin-bottom: 9px;
    }
    .section-title {
      font-size: 10pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #0f172a;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 2px;
      margin-bottom: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .section-title::after {
      content: "";
      height: 2px;
      background: #0369a1;
      flex-grow: 1;
      margin-left: 10px;
    }
    .summary-text {
      color: #334155;
      font-size: 9pt;
      line-height: 1.4;
      text-align: justify;
    }
    .skills-grid {
      display: grid;
      grid-template-columns: 140px 1fr;
      row-gap: 3px;
      font-size: 8.8pt;
    }
    .skill-cat {
      font-weight: 700;
      color: #0f172a;
    }
    .skill-items {
      color: #334155;
    }
    .project-item {
      margin-bottom: 6px;
    }
    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 9.2pt;
    }
    .project-title {
      font-weight: 700;
      color: #0f172a;
    }
    .project-title span {
      font-weight: 500;
      color: #0369a1;
      font-size: 8.5pt;
    }
    .project-links {
      font-size: 8pt;
      color: #64748b;
    }
    .project-links a {
      color: #0369a1;
      text-decoration: none;
      margin-left: 6px;
      font-weight: 600;
    }
    .project-desc {
      font-size: 8.5pt;
      color: #475569;
      margin-top: 1px;
      line-height: 1.35;
    }
    .honors-list {
      list-style-type: square;
      padding-left: 16px;
      font-size: 8.8pt;
      color: #334155;
      line-height: 1.4;
    }
    .badge {
      display: inline-block;
      background: #e0f2fe;
      color: #0369a1;
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 7.5pt;
      font-weight: 700;
      margin-left: 4px;
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="header-left">
      <h1>Farhan Shaikh</h1>
      <div class="subtitle">Computer Science Engineer • AI &amp; Cybersecurity Developer</div>
    </div>
    <div class="contact-info">
      <div><strong>Email:</strong> <a href="mailto:f98561965@gmail.com">f98561965@gmail.com</a></div>
      <div><strong>GitHub:</strong> <a href="https://github.com/YTxFSGAMERz">@YTxFSGAMERz</a> (64+ Repos)</div>
      <div><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/farhan-shaikh-fs">linkedin.com/in/farhan-shaikh-fs</a></div>
      <div><strong>Portfolio:</strong> <a href="https://ytxfsgamerz.github.io/">ytxfsgamerz.github.io</a></div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Professional Summary</div>
    <p class="summary-text">
      Computer Science Engineer specializing in Offensive Security (VAPT), NASA Planetary Mission Engineering, Local-First AI &amp; Autonomous Agents, Quantitative Systems (GPU VTK / NVENC 120 FPS), and Low-Level Systems Engineering (Rust / Linux eBPF / Windows Kernel). NASA Space Apps Challenge 2026 Developer, Smart India Hackathon (SIH 2026) Team Lead, author of published Rust package on crates.io (bdstorage), and active open-source contributor with 64+ repositories.
    </p>
  </div>

  <div class="section">
    <div class="section-title">Core Technical Arsenal</div>
    <div class="skills-grid">
      <div class="skill-cat">Offensive Security:</div>
      <div class="skill-items">Kali Linux, VAPT, Burp Suite Pro, Nmap, RapidOCR Sub-Span Redaction, CVSS v3.1 Deterministic Math, eBPF Kernel Probes, Threat Intelligence, OSINT</div>
      
      <div class="skill-cat">AI &amp; Neural Agents:</div>
      <div class="skill-items">Google Gemma 4 (Local Ollama), Claude &amp; Gemini APIs, PyTorch, LangChain, Multimodal Vision &amp; OCR, Vernacular NLP, Autonomous Scraping Swarms</div>
      
      <div class="skill-cat">Systems &amp; Low-Level:</div>
      <div class="skill-items">Python 3.11+, C#, C++, TypeScript, Rust (CAS Engine on crates.io), PyVista/VTK, PowerShell 7+, DISM Image Servicing, Linux Kernel Hooks, Docker, Git, CI/CD</div>
      
      <div class="skill-cat">Web &amp; 3D Graphics:</div>
      <div class="skill-items">React 19, FastAPI, Next.js, Vite, Tailwind CSS v4, Three.js &amp; WebGL 3D Planetary HUDs, GSAP, Lenis, REST/GraphQL</div>
      
      <div class="skill-cat">Quantitative Analysis:</div>
      <div class="skill-items">Statistical Econometrics, 4D Alpha Surface Waveforms, Lo-MacKinlay Variance Ratio, GARCH(1,1) Volatility Modeling, statsmodels</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Featured Engineering Builds &amp; Flagship Systems</div>

    <div class="project-item">
      <div class="project-header">
        <div class="project-title">Mars-GeoSpectra <span>— Martian EVA Mission Planning Workstation</span> <span class="badge">NASA SPACE APPS '26</span></div>
        <div class="project-links"><a href="https://github.com/YTxFSGAMERz/Mars-GeoSpectra">GitHub ↗</a></div>
      </div>
      <div class="project-desc">
        Martian surface exploration &amp; EVA planning workstation for Jezero Crater integrating 6 NASA datasets (MOLA elevation, CRISM mineralogy, HiRISE 25cm/px micro-topography, THEMIS thermal inertia, Perseverance telemetry). Computes modified Tobler's Hiking Function under 0.38g gravity with astronaut metabolic O2 constraints and 3D WebGL tactical HUD.
      </div>
    </div>

    <div class="project-item">
      <div class="project-header">
        <div class="project-title">KisanSetu-AI <span>— Agricultural Supply Chain &amp; Mandi Platform</span> <span class="badge">SIH '26 TEAM LEAD</span></div>
        <div class="project-links"><a href="https://frontend-seven-sooty-62.vercel.app">Live Demo ↗</a> <a href="https://github.com/YTxFSGAMERz/KisanSetu-AI">GitHub ↗</a></div>
      </div>
      <div class="project-desc">
        Smart India Hackathon 2026 Team Lead platform connecting Farmers, Buyers, and APMC Officers. Engineered AI slot allocation cutting physical mandi bottleneck queues by 65%, real-time price discovery regression, 11 relational ORM models, dual PostgreSQL &amp; MongoDB storage, and live WebSocket auction state machines.
      </div>
    </div>

    <div class="project-item">
      <div class="project-header">
        <div class="project-title">PenMunshi <span>— Offline VAPT Report Copilot</span> <span class="badge">OLLAMA GEMMA 4</span></div>
        <div class="project-links"><a href="https://github.com/YTxFSGAMERz/penmunshi">GitHub ↗</a></div>
      </div>
      <div class="project-desc">
        Offline-first pentest and VAPT report copilot powered by local Google Gemma 4 on Ollama with deterministic fact verification. Features sub-span RapidOCR opaque secret blackout with re-OCR verification loops, code-calculated CVSS v3.1 scores (0 hallucinations), Nmap/Burp scanner importers, and agency-grade DOCX/HTML deliverables with 100% data sovereignty.
      </div>
    </div>

    <div class="project-item">
      <div class="project-header">
        <div class="project-title">Quantum Market Pulse <span>— 4D Alpha Engine</span> <span class="badge">120 FPS NVENC</span></div>
        <div class="project-links"><a href="https://colab.research.google.com/github/YTxFSGAMERz/Quantum-Market-Pulse-4D-Alpha-Engine/blob/main/Colab.ipynb">Colab ↗</a> <a href="https://github.com/YTxFSGAMERz/Quantum-Market-Pulse-4D-Alpha-Engine">GitHub ↗</a></div>
      </div>
      <div class="project-desc">
        High-performance quantitative animation engine bridging PyVista GPU VTK surfaces and Matplotlib CPU rendering with ffmpeg NVENC hardware encoding (720×1280 9:16 @ 120 FPS). Computes 4D surface energy matrix E(t, a) with Gaussian wave smoothing across 3,400+ trading days of historical data.
      </div>
    </div>

    <div class="project-item">
      <div class="project-header">
        <div class="project-title">Event Intelligence Agent <span>— Autonomous Scout</span> <span class="badge">$2.4M+ TRACKED</span></div>
        <div class="project-links"><a href="https://github.com/YTxFSGAMERz/event-intelligence-agent">GitHub ↗</a></div>
      </div>
      <div class="project-desc">
        Autonomous reconnaissance agent tracking global hackathons, tech competitions, grants, and travel fellowships. Implements official authority verification heuristics, scheduled GitHub Actions runners, real-time Telegram bot alerts, and a searchable live web dashboard.
      </div>
    </div>

    <div class="project-item">
      <div class="project-header">
        <div class="project-title">GeoVigilant Argus <span>— Tactical 3D Planetary OSINT</span> <span class="badge">THREE.JS / WEBGL</span></div>
        <div class="project-links"><a href="https://geovigilant-argus.vercel.app">Live Demo ↗</a> <a href="https://github.com/YTxFSGAMERz/GeoVigilant-Argus">GitHub ↗</a></div>
      </div>
      <div class="project-desc">
        Tactical multi-domain geospatial intelligence platform rendering high-frequency ADS-B flight vectors, maritime AIS shipping tracks, satellite orbital paths, and global seismic sensor telemetry on a 60 FPS Three.js / WebGL tactical earth HUD.
      </div>
    </div>

    <div class="project-item">
      <div class="project-header">
        <div class="project-title">SecuScan <span>— Local-First Security Scanning Workspace</span> <span class="badge">FASTAPI + REACT</span></div>
        <div class="project-links"><a href="https://secuscan.in">Live Demo ↗</a> <a href="https://github.com/YTxFSGAMERz/SecuScan">GitHub ↗</a></div>
      </div>
      <div class="project-desc">
        Local-first vulnerability assessment workspace providing standardized execution controls, normalized findings, and 60 catalogued offensive integrations (Nmap, Nikto, Nuclei, Sqlmap, Masscan, SSLyze) without cloud telemetry.
      </div>
    </div>

    <div class="project-item">
      <div class="project-header">
        <div class="project-title">EnterpriseRAG-AI <span>— Linux eBPF Security &amp; Governance Mesh</span> <span class="badge">KERNEL eBPF</span></div>
        <div class="project-links"><a href="https://enterpriserag-ai.vercel.app">Live Demo ↗</a> <a href="https://github.com/YTxFSGAMERz/EnterpriseRAG-AI">GitHub ↗</a></div>
      </div>
      <div class="project-desc">
        Linux-native eBPF security mesh engineered to monitor and govern autonomous AI agent workloads in real time. Enforces kernel-level syscall tracing (kprobe/tracepoint), secret leak redaction, dynamic memory fencing, and vector retrieval validation.
      </div>
    </div>

    <div class="project-item">
      <div class="project-header">
        <div class="project-title">ScamShield <span>— Multimodal AI Fraud Defense</span> <span class="badge">GEMMA 4 VISION</span></div>
        <div class="project-links"><a href="https://scamshield-sandy.vercel.app">Live Demo ↗</a> <a href="https://github.com/YTxFSGAMERz/ScamShield">GitHub ↗</a></div>
      </div>
      <div class="project-desc">
        Multimodal fraud defense platform engineered with Gemma 4 Vision and vernacular NLP. Features real-time screenshot threat scanning, URL phishing detection, caller threat intel, and multi-language support (English, Hindi, Gujarati).
      </div>
    </div>

    <div class="project-item">
      <div class="project-header">
        <div class="project-title">WinAurex V2.0 <span>— Windows 10/11 Engineering Suite</span> <span class="badge">12★ STARS</span></div>
        <div class="project-links"><a href="https://winaurex.vercel.app">Live Demo ↗</a> <a href="https://github.com/YTxFSGAMERz/WinAurex">GitHub ↗</a></div>
      </div>
      <div class="project-desc">
        Open-source Windows execution engine with transactional Rollback Manifest System, MVVM WPF client, automated debloating, unattended bypass configurations (TPM/RAM/SecureBoot), and complete background telemetry stripping.
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Open-Source Publications, Honors &amp; Leadership</div>
    <ul class="honors-list">
      <li><strong>Smart India Hackathon (SIH 2026):</strong> Selected Team Lead &amp; Principal Architect for KisanSetu-AI national procurement network.</li>
      <li><strong>NASA Space Apps Challenge 2026:</strong> Architected Mars-GeoSpectra Martian exploration workstation leveraging 6 NASA planetary datasets.</li>
      <li><strong>Crates.io Published Package:</strong> Released <a href="https://crates.io/crates/bdstorage" style="color:#0369a1;font-weight:700;">bdstorage</a> — high-performance CLI Content-Addressable Storage (CAS) engine in Rust with system-wide file deduplication.</li>
      <li><strong>National Hackathon Winner:</strong> Web3 &amp; Security Track 36hr Hackathon (ScamShield fraud defense engine).</li>
      <li><strong>Hacktoberfest 2026:</strong> Contributor &amp; open-source developer for ScamShield and community repositories.</li>
      <li><strong>64+ Public Repositories:</strong> Maintained active portfolio of full-stack, AI, and cybersecurity tooling at <a href="https://github.com/YTxFSGAMERz" style="color:#0369a1;font-weight:700;">github.com/YTxFSGAMERz</a>.</li>
    </ul>
  </div>

</body>
</html>`;

  console.log('Launching browser to render Farhan_Shaikh_Resume.pdf...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true }).catch(async () => {
    return await chromium.launch({ headless: true });
  });
  const page = await browser.newPage();
  await page.setContent(resumeHtml, { waitUntil: 'networkidle' });
  
  const projectRoot = path.resolve(__dirname, '..');
  const destPublic = path.join(projectRoot, 'public', 'Farhan_Shaikh_Resume.pdf');
  const destDist = path.join(projectRoot, 'dist', 'Farhan_Shaikh_Resume.pdf');

  await page.pdf({
    path: destPublic,
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', bottom: '10mm', left: '12mm', right: '12mm' }
  });

  if (fs.existsSync(path.join(projectRoot, 'dist'))) {
    fs.copyFileSync(destPublic, destDist);
  }

  console.log('Successfully generated Farhan_Shaikh_Resume.pdf at:');
  console.log('-', destPublic);
  if (fs.existsSync(destDist)) {
    console.log('-', destDist);
  }

  await browser.close();
}

generateResume().catch(err => {
  console.error('Error generating resume:', err);
  process.exit(1);
});
