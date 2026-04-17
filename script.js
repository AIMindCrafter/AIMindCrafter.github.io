document.addEventListener('DOMContentLoaded', () => {

    // 1. Typing Effect for Hero Section
    const roleElement = document.querySelector('.typing-effect');
    // Fixed: first role now matches the static HTML text to prevent a flash of wrong content
    const roles = ['AI Engineer | Generative AI | LLMs | AI Agents', 'Machine Learning Expert', 'Deep Learning Specialist', 'LangChain & LangGraph Builder'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        if (!roleElement) return;
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            roleElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Faster deleting
        } else {
            roleElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at the end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before new word
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // Start typing effect slightly after load
    // Clear the static text first to prevent flash-of-content
    if (roleElement) {
        roleElement.textContent = '';
        setTimeout(typeEffect, 300);
    }

    // 2. Intersection Observer for Fade-in Animations
    const faders = document.querySelectorAll('.project-card, .skills-container, .job-card, .cert-card');

    // Add base class for CSS transitions to work
    faders.forEach(fader => {
        fader.classList.add('fade-in');
    });

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // 3. Skill Bar Animation on Scroll
    const skillBars = document.querySelectorAll('.skill-bar .fill');

    // Reset widths initially
    skillBars.forEach(bar => {
        bar.dataset.width = bar.style.width;
        bar.style.width = '0%';
    });

    const skillOptions = {
        threshold: 0.5,
        rootMargin: "0px"
    };

    const animateSkills = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                bar.style.transition = 'width 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
                bar.style.width = bar.dataset.width;
                observer.unobserve(bar);
            }
        });
    }, skillOptions);

    skillBars.forEach(bar => {
        animateSkills.observe(bar);
    });

    // 4. Smooth Scrolling for Navigation (includes hero card links)
    document.querySelectorAll('.nav-links a, .cta-buttons a[href^="#"], .hero-card-actions a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            const navHeight = document.querySelector('.glass-nav').offsetHeight;

            window.scrollTo({
                top: targetElement.offsetTop - navHeight,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navLinks = document.getElementById('navLinks');
            const menuToggle = document.getElementById('menuToggle');
            if (navLinks && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    });

    // 5. Glass Nav Background Blur on Scroll
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(10, 10, 15, 0.85)';
            nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            nav.style.background = 'rgba(20, 20, 30, 0.6)';
            nav.style.boxShadow = 'none';
        }
    });

    // 6. 3D Tilt Effect for Glass Cards
    const glassCards = document.querySelectorAll('.glass-card');

    glassCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease-out';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });

    // 7. Custom Cursor Glow Effect
    // Fixed: use left/top positioning instead of transform to avoid conflict with will-change:transform
    const cursorGlow = document.createElement('div');
    cursorGlow.classList.add('cursor-glow');
    // Remove transform-based centering from CSS default — use margin trick via left/top offset
    cursorGlow.style.position = 'fixed';
    cursorGlow.style.pointerEvents = 'none';
    cursorGlow.style.zIndex = '9999';
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
        // Fixed: position via left/top with a -50% offset for centering, not transform
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    // 8. MetaMask-style Global 3D Tracking for Chatbot
    const chatbot = document.querySelector('.chatbot-container');
    if (chatbot) {
        document.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            chatbot.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
    }

    // 9. Back to Top Button Logic
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 10. Day/Night Theme Toggle
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        const themeIcon = themeBtn.querySelector('i');

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            themeIcon.className = 'fa-solid fa-sun';
        }

        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');

            if (document.body.classList.contains('light-mode')) {
                themeIcon.className = 'fa-solid fa-sun';
                localStorage.setItem('theme', 'light');
            } else {
                themeIcon.className = 'fa-solid fa-moon';
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // 11. Draggable Horizontal Slider for Experience Section
    const slider = document.querySelector('.experience-container');
    let isDown = false;
    let startX;
    let scrollLeft;

    if (slider) {
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            slider.style.scrollSnapType = 'none';
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.style.cursor = '';
            slider.style.scrollSnapType = 'x mandatory';
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.style.cursor = '';
            slider.style.scrollSnapType = 'x mandatory';
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
    }

    // 12. Active Nav Link Highlighting on Scroll
    const sections = document.querySelectorAll('section[id], header[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navAnchors.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }, { threshold: 0.4, rootMargin: '-10% 0px -50% 0px' });

    sections.forEach(section => sectionObserver.observe(section));

    // 13. Hamburger Menu Toggle for Mobile
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            // Prevent body scroll when menu is open
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
    }

    // 14. Contact Form — JS-handled mailto redirect (replaces broken HTML form POST)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('senderName').value.trim();
            const email = document.getElementById('senderEmail').value.trim();
            const message = document.getElementById('senderMessage').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all fields before sending.');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            const mailtoLink = `mailto:321muhammadkamran@gmail.com?subject=${subject}&body=${body}`;

            window.location.href = mailtoLink;

            // Show success feedback
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Opening Email Client...';
            submitBtn.style.background = 'linear-gradient(90deg, #22c55e, #06b6d4)';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                contactForm.reset();
            }, 3000);
        });
    }

});
