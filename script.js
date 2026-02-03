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
     * Client-side validation and success state
     * Ready for Netlify Forms (forms work automatically when deployed to Netlify)
     */
    function initForms() {
        const checklistForm = document.getElementById('checklist-form');
        const contactForm = document.getElementById('contact-form');

        if (checklistForm) {
            initForm(checklistForm, 'checklist-success');
        }

        if (contactForm) {
            initForm(contactForm, 'contact-success');
        }
    }

    function initForm(form, successId) {
        const successElement = document.getElementById(successId);

        form.addEventListener('submit', function(e) {
            // Validate form
            if (!form.checkValidity()) {
                return;
            }

            // For demo purposes (local testing), show success message
            // On Netlify, the form will actually submit and show Netlify's success page
            // unless you handle it with JavaScript

            // Check if we're on Netlify (production) or local
            const isNetlify = window.location.hostname !== 'localhost' &&
                              window.location.hostname !== '127.0.0.1' &&
                              !window.location.hostname.includes('.local');

            if (!isNetlify) {
                // Local demo behavior
                e.preventDefault();
                showFormSuccess(form, successElement);
            } else {
                // On Netlify, let the form submit normally
                // Or use AJAX to submit and show custom success
                e.preventDefault();
                submitFormToNetlify(form, successElement);
            }
        });

        // Real-time validation feedback
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
     * Submit form to Netlify using fetch
     * This allows us to show a custom success message instead of redirecting
     */
    function submitFormToNetlify(form, successElement) {
        const formData = new FormData(form);

        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        })
        .then(function(response) {
            if (response.ok) {
                showFormSuccess(form, successElement);
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(function(error) {
            console.error('Form error:', error);
            // Show a generic error - in production you might want a better UX
            alert('There was an error submitting the form. Please try again or email directly.');
        });
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
