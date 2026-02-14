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

function App() {
  return (
    <div className="app-main">
      <Header />
      <main>
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
  )
}

export default App
