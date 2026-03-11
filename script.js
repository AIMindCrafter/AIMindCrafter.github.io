document.addEventListener('DOMContentLoaded', () => {
    // 1. Typing Effect for Hero Section
    const roleElement = document.querySelector('.typing-effect');
    const roles = ['AI Engineer & Data Scientist', 'Machine Learning Expert', 'Deep Learning Specialist'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
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
    setTimeout(typeEffect, 500);

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
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
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

    // 4. Smooth Scrolling for Navigation
    document.querySelectorAll('.nav-links a, .cta-buttons a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            const navHeight = document.querySelector('.glass-nav').offsetHeight;
            
            window.scrollTo({
                top: targetElement.offsetTop - navHeight,
                behavior: 'smooth'
            });
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
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -8; // Max rotation 8deg
            const rotateY = ((x - centerX) / centerX) * 8;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease-out';
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none'; // Remove transition during hover for instant smooth tracking
        });
    });

    // 7. Custom Cursor Glow Effect
    const cursorGlow = document.createElement('div');
    cursorGlow.classList.add('cursor-glow');
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    });

    // 8. MetaMask-style Global 3D Tracking for Chatbot
    const chatbot = document.querySelector('.chatbot-container');
    if(chatbot) {
        document.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            chatbot.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
    }

    // 9. Back to Top Button Logic
    const backToTopBtn = document.getElementById('backToTopBtn');
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

    // 10. Day/Night Theme Toggle
    const themeBtn = document.getElementById('themeToggle');
    const themeIcon = themeBtn.querySelector('i');
    
    // Check local storage for theme preference
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

    // 11. Draggable Horizontal Slider for Experience Section
    const slider = document.querySelector('.experience-container');
    let isDown = false;
    let startX;
    let scrollLeft;

    if (slider) {
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.style.cursor = 'grabbing';
            // Disable CSS snap during physical drag for smoothness
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
            e.preventDefault(); // Prevent highlighting text while dragging
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            slider.scrollLeft = scrollLeft - walk;
        });
    }

    // 12. Chatbot Widget Logic
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeChatbot = document.getElementById('closeChatbot');
    const chatbotInputBox = document.getElementById('chatbotInputBox');
    const chatbotSendBtn = document.getElementById('chatbotSendBtn');
    const chatbotMessages = document.getElementById('chatbotMessages');

    if (chatbotToggle && chatbotWindow) {
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('open');
            if(chatbotWindow.classList.contains('open')) {
                chatbotInputBox.focus();
            }
        });

        closeChatbot.addEventListener('click', (e) => {
            e.stopPropagation();
            chatbotWindow.classList.remove('open');
        });

        let sessionApiKey = window.ENV?.GEMINI_API_KEY || "";

        const handleSendMessage = async () => {
            const text = chatbotInputBox.value.trim();
            if (text) {
                // Add user message to UI
                const userMsg = document.createElement('div');
                userMsg.className = 'message user-message';
                userMsg.textContent = text;
                chatbotMessages.appendChild(userMsg);
                chatbotInputBox.value = '';
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

                // Handle missing API key on GitHub pages
                if (!sessionApiKey) {
                    if (text.startsWith("AIza")) {
                        sessionApiKey = text;
                        const keyMsg = document.createElement('div');
                        keyMsg.className = 'message bot-message';
                        keyMsg.innerHTML = "API Key saved securely for this session! 🤖 How can I help you today?";
                        chatbotMessages.appendChild(keyMsg);
                        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                        return;
                    } else {
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'message bot-message';
                        errorMsg.innerHTML = "<b>API Key missing!</b><br>Since this is a public GitHub Page, the API key is hidden for security.<br><br>Please paste your Gemini API Key here to start chatting securely in this session.";
                        chatbotMessages.appendChild(errorMsg);
                        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                        return;
                    }
                }

                // Create a temporary loading message for the bot
                const loadingMsg = document.createElement('div');
                loadingMsg.className = 'message bot-message';
                loadingMsg.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Thinking...';
                chatbotMessages.appendChild(loadingMsg);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

                // --- HOW TO CONNECT TO YOUR AI BACKEND ---
                try {
                    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${sessionApiKey}`;
                    
                    const response = await fetch(url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{ text: "You are an AI assistant for Zeeshan, an AI Engineer. Keep your answers brief, professional, and helpful. User asks: " + text }]
                            }]
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (!response.ok) {
                        if(data.error?.message.includes("API key not valid")) {
                            sessionApiKey = ""; // Reset invalid key
                        }
                        throw new Error(data.error?.message || "Network response was not ok");
                    }
                    
                    // Extract the text from the Gemini response structure
                    let aiReply = "Sorry, I couldn't understand that.";
                    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts.length > 0) {
                        aiReply = data.candidates[0].content.parts[0].text;
                    }

                    // Format line breaks for HTML display
                    aiReply = aiReply.replace(/\n/g, '<br>');

                    // Update UI with the actual AI response
                    loadingMsg.innerHTML = aiReply;

                } catch (error) {
                    console.error("Chatbot API Error:", error);
                    loadingMsg.innerHTML = `Error: ${error.message}`;
                    loadingMsg.style.color = "#ff5f56";
                }
                
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }
        };

        chatbotSendBtn.addEventListener('click', handleSendMessage);
        chatbotInputBox.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSendMessage();
        });
    }

});
