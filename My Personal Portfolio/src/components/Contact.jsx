import React from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { supabase } from '../lib/supabase';

const Contact = () => {
    const sectionRef = useScrollAnimation();

    const [formData, setFormData] = React.useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            setErrorMsg('Please fill out all fields.');
            return;
        }

        setIsSubmitting(true);
        setErrorMsg('');

        try {
            const { error } = await supabase
                .from('contact_messages')
                .insert([
                    {
                        name: formData.name,
                        email: formData.email,
                        message: formData.message
                    }
                ]);

            if (error) throw error;

            setIsSuccess(true);
            setFormData({ name: '', email: '', message: '' }); // Clear form

            // Hide success message after 5 seconds
            setTimeout(() => {
                setIsSuccess(false);
            }, 5000);

        } catch (error) {
            setErrorMsg(error.message || 'An error occurred while sending your message.');
            console.error('Error submitting contact form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section ref={sectionRef} id="contact" className="section-padding fade-up">
            <div className="container">
                <h2 className="section-title">Let's Build the Future</h2>
                <div className="contact-wrapper glass-card">
                    <div className="contact-info">
                        <h3>Get in Touch</h3>
                        <p>
                            Whether you have a groundbreaking idea, a complex problem to solve, or just want to connect, I'm always open to new opportunities.
                        </p>
                        <div className="contact-links">
                            <a href="mailto:f98561965@gmail.com" className="contact-link">
                                <span style={{ fontSize: '1.2rem' }}>📧</span> f98561965@gmail.com
                            </a>
                            <a href="https://www.linkedin.com/in/farhan-shaikh-753551358/" target="_blank" rel="noopener noreferrer" className="contact-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#0077b5' }}>
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                                LinkedIn
                            </a>
                            <a href="https://github.com/Farhans123456" target="_blank" rel="noopener noreferrer" className="contact-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                GitHub
                            </a>
                        </div>
                    </div>
                    <div className="contact-form-placeholder">
                        {isSuccess ? (
                            <div className="success-message" style={{ textAlign: 'center', padding: '2rem' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#4ade80', marginBottom: '1rem', margin: '0 auto' }}>
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                <h3>Message Sent!</h3>
                                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                    Thank you for reaching out. I'll get back to you as soon as possible.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="simple-form">
                                {errorMsg && (
                                    <div className="error-message" style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                                        {errorMsg}
                                    </div>
                                )}
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    autoComplete="name"
                                    placeholder="Name"
                                    className="form-input"
                                    disabled={isSubmitting}
                                    required
                                />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    placeholder="Email"
                                    className="form-input"
                                    disabled={isSubmitting}
                                    required
                                />
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Message"
                                    className="form-textarea"
                                    disabled={isSubmitting}
                                    required
                                    style={{ minHeight: '150px' }}
                                ></textarea>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    style={{ width: '100%', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
