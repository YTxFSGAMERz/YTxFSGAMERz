import React from 'react';

const traits = [
    "Analytical Thinker",
    "Builder Mindset",
    "Entrepreneurial Curiosity",
    "Calm Under Pressure",
    "Purpose-Driven"
];

const Traits = () => {
    return (
        <section id="traits" className="traits-strip">
            <div className="traits-container">
                {/* Duplicated for seamless scrolling effect if we add animation later */}
                {traits.map((trait, index) => (
                    <div key={index} className="trait-item">
                        <span className="trait-dot">•</span>
                        <span className="trait-text">{trait}</span>
                    </div>
                ))}
                {traits.map((trait, index) => (
                    <div key={`dup-${index}`} className="trait-item">
                        <span className="trait-dot">•</span>
                        <span className="trait-text">{trait}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Traits;
