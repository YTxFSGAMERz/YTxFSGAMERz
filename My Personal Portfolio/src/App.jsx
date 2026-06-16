import React, { Suspense, useEffect } from 'react';
import { EmojiProvider } from 'react-apple-emojis';
import emojiData from 'react-apple-emojis/src/data.json';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css'; // Add lenis base css just in case
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import HUD from './components/ui/HUD';
import GlassNavbar from './components/ui/glass-navbar';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Services from './components/Services';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Traits from './components/Traits';
import Contact from './components/Contact';
import Footer from './components/Footer';
import DevModeOverlay from './components/ui/DevModeOverlay';
import BookingForm from './components/BookingForm';
import GhostCursor from './components/ui/GhostCursor';

const CustomBackground = React.lazy(() => import('./components/CustomBackground'));
import AppleFluidBackground from './components/ui/AppleFluidBackground';

const AppContent = () => {
  const { activeSection, setActiveSection, isLiteMode } = usePortfolio();

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      // Using lerp instead of duration makes it feel 1:1 on trackpads 
      // while still providing smooth interpolation for mouse wheels.
      lerp: 0.08, 
      wheelMultiplier: 1,
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleNavigate = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      // Lenis integrates well with native scrollIntoView if handled properly,
      // but native scrollIntoView is perfectly fine.
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <AppleFluidBackground />

      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: -1 }}>
        <GhostCursor
          trailLength={65}
          inertia={0.75}
          grainIntensity={0.08}
          bloomStrength={0.05}
          bloomRadius={0.5}
          brightness={0.6}
          color="#7b2cbf"
          edgeIntensity={0.1}
          mixBlendMode="normal"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="app-main" style={{ position: 'relative', zIndex: 1 }}>
        <GlassNavbar />
        <DevModeOverlay />
        <BookingForm />

      <main style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>
        {/* Pointer events none on main prevents blocking the 3D canvas globally.
                    The inner .container classes have pointer-events: auto to keep buttons clickable */}
        <Hero />
        <Traits />
        <About />
        <Skills />
        <Services />
        <Experience />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </div>
    </>
  );
};

function App() {
  return (
    <PortfolioProvider>
      <EmojiProvider data={emojiData}>
        <AppContent />
      </EmojiProvider>
    </PortfolioProvider>
  );
}

export default App;
