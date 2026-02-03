/**
 * Technical Due Diligence - Main JavaScript
 * Vanilla JS for navigation, forms, and interactivity
 */

(function() {
    'use strict';

    // DOM Ready
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initNavigation();
        initSmoothScroll();
        initFAQ();
        initForms();
        initHeader();
        initCurrentYear();
    }

    /**
     * Mobile Navigation Toggle
     */
    function initNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                navToggle.focus();
            }
        });
    }

    /**
     * Smooth Scrolling for Anchor Links
     */
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // Skip if it's just "#"
                if (href === '#') return;

                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();

                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without jumping
                    history.pushState(null, null, href);

                    // Set focus for accessibility
                    target.setAttribute('tabindex', '-1');
                    target.focus({ preventScroll: true });
                }
            });
        });
    }

    /**
     * FAQ Accordion
     */
    function initFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');

        faqQuestions.forEach(function(question) {
            question.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                const answerId = this.getAttribute('aria-controls');
                const answer = document.getElementById(answerId);

                // Close all other FAQs
                faqQuestions.forEach(function(q) {
                    if (q !== question) {
                        q.setAttribute('aria-expanded', 'false');
                        const otherAnswerId = q.getAttribute('aria-controls');
                        const otherAnswer = document.getElementById(otherAnswerId);
                        if (otherAnswer) {
                            otherAnswer.classList.remove('active');
                        }
                    }
                });

                // Toggle current FAQ
                this.setAttribute('aria-expanded', !isExpanded);
                if (answer) {
                    answer.classList.toggle('active');
                }
            });

            // Keyboard support
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }

    /**
     * Form Handling
     * Submits to Express backend API
     */
    function initForms() {
        const checklistForm = document.getElementById('checklist-form');
        const contactForm = document.getElementById('contact-form');

        if (checklistForm) {
            initChecklistForm(checklistForm);
        }

        if (contactForm) {
            initContactForm(contactForm);
        }
    }

    function initContactForm(form) {
        const successElement = document.getElementById('contact-success');
        const submitBtn = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (!form.checkValidity()) {
                return;
            }

            // Disable button and show loading state
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            const formData = {
                name: form.querySelector('#contact-name').value,
                email: form.querySelector('#contact-email').value,
                firm: form.querySelector('#contact-firm').value,
                message: form.querySelector('#contact-message').value
            };

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    showFormSuccess(form, successElement);
                } else {
                    throw new Error(result.error || 'Failed to send message');
                }
            } catch (error) {
                console.error('Form error:', error);
                alert('There was an error sending your message. Please try emailing directly at gadiguy@gmail.com');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });

        // Real-time validation
        setupValidation(form);
    }

    function initChecklistForm(form) {
        const successElement = document.getElementById('checklist-success');
        const submitBtn = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (!form.checkValidity()) {
                return;
            }

            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            const formData = {
                email: form.querySelector('#checklist-email').value,
                role: form.querySelector('#checklist-role').value
            };

            try {
                const response = await fetch('/api/checklist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    showFormSuccess(form, successElement);
                } else {
                    throw new Error(result.error || 'Failed to submit');
                }
            } catch (error) {
                console.error('Form error:', error);
                alert('There was an error. Please try again.');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });

        setupValidation(form);
    }

    function setupValidation(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(function(input) {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('invalid')) {
                    validateField(this);
                }
            });
        });
    }

    function validateField(field) {
        if (field.validity.valid) {
            field.classList.remove('invalid');
            field.classList.add('valid');
        } else {
            field.classList.remove('valid');
            field.classList.add('invalid');
        }
    }

    function showFormSuccess(form, successElement) {
        form.style.display = 'none';
        successElement.classList.remove('hidden');
        successElement.focus();
    }

    /**
     * Header Scroll Effect
     */
    function initHeader() {
        const header = document.querySelector('.header');
        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    /**
     * Set Current Year in Footer
     */
    function initCurrentYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

})();
