import React from 'react';
import TiltCard from './TiltCard';
import useScrollAnimation from '../hooks/useScrollAnimation';
import AppleEmoji from './AppleEmoji';

const services = [
    {
        title: "Cybersecurity Architecture",
        description: "Fortifying digital ecosystems through Zero Trust frameworks, offensive defense strategies, and advanced vulnerability assessments.",
        icon: <AppleEmoji char="🛡️" width={44} />
    },
    {
        title: "AI & Neural Networks",
        description: "Architecting autonomous intelligent systems and predictive models that transform raw data into decisive strategic advantages.",
        icon: <AppleEmoji char="🧠" width={44} />
    },
    {
        title: "High-Performance Engineering",
        description: "Building scalable, fault-tolerant full-stack applications designed for speed, reliability, and massive user loads.",
        icon: <AppleEmoji char="⚡" width={44} />
    },
    {
        title: "Next-Gen Prototyping",
        description: "Rapidly translating theoretical concepts into bleeding-edge, deployable technologies that define the future market.",
        icon: <AppleEmoji char="🚀" width={44} />
    }
];

const Services = () => {
    const sectionRef = useScrollAnimation();

    return (
        <section ref={sectionRef} id="services" className="section-padding fade-up">
            <div className="container">
                <h2 className="section-title">Services & Expertise</h2>
                <div className="services-grid">
                    {services.map((service, index) => (
                        <TiltCard key={index} className="service-card glass-card">
                            <div className="service-icon">{service.icon}</div>
                            <h3 className="service-title">{service.title}</h3>
                            <p className="service-description">{service.description}</p>
                        </TiltCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
