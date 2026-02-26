import React, { useState, useEffect, useRef } from 'react';
import { Home, User, FolderGit2, Code, BookOpen, Mail, Briefcase } from 'lucide-react';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [scrollDepth, setScrollDepth] = useState(0);
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            setScrolled(currentScroll > 50);

            // Calculate a normalized scroll depth from 0 to 1 over the first 500px of scroll
            const depth = Math.min(currentScroll / 500, 1);
            setScrollDepth(depth);

            // Determine active section
            const sections = ['home', 'about', 'skills', 'services', 'experience', 'projects', 'contact'];
            const scrollPosition = window.scrollY + (window.innerHeight / 2); // Trigger when section is at middle of screen

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    // Check if we have scrolled past the top of the section (minus offset)
                    if (scrollPosition >= element.offsetTop) {
                        setActiveSection(section);
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Revised navItems to match the screenshot vibe + our sections
    const navItemsFinal = [
        { id: 'home', icon: <Home size={24} />, label: 'Home' },
        { id: 'about', icon: <User size={24} />, label: 'About' },
        { id: 'skills', icon: <Code size={24} />, label: 'Skills' },
        { id: 'services', icon: <BookOpen size={24} />, label: 'Services' },
        { id: 'experience', icon: <Briefcase size={24} />, label: 'Experience' }, /* Swapped to match scroll order */
        { id: 'projects', icon: <FolderGit2 size={24} />, label: 'Projects' },
        { id: 'contact', icon: <Mail size={24} />, label: 'Contact' }
    ];

    const [lampStyle, setLampStyle] = useState({ left: '50%', opacity: 0 });
    const navRef = useRef(null);

    useEffect(() => {
        if (!navRef.current) return;
        const activeItem = navRef.current.querySelector(`[data-id="${activeSection}"]`);
        if (activeItem) {
            const { offsetLeft, offsetWidth } = activeItem;
            setLampStyle({
                left: `${offsetLeft + offsetWidth / 2}px`,
                opacity: 1
            });
        }
    }, [activeSection]);

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="container header-container">
                <nav
                    className="nav-dock"
                    ref={navRef}
                    style={{
                        backgroundColor: `rgba(15, 15, 20, ${0.4 + (scrollDepth * 0.4)})`,
                        backdropFilter: `blur(${10 + (scrollDepth * 20)}px)`,
                        WebkitBackdropFilter: `blur(${10 + (scrollDepth * 20)}px)`,
                        border: `1px solid rgba(255, 255, 255, ${0.05 + (scrollDepth * 0.05)})`
                    }}
                >
                    <div className="nav-lamp" style={{ left: lampStyle.left, opacity: lampStyle.opacity }}></div>
                    {navItemsFinal.map((item) => (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            data-id={item.id}
                            className={`nav-icon ${activeSection === item.id ? 'active' : ''}`}
                            onClick={() => setActiveSection(item.id)}
                        >
                            {item.icon}
                            <span className="nav-tooltip">{item.label}</span>
                        </a>
                    ))}
                </nav>
            </div>
        </header>
    );
};

export default Header;
