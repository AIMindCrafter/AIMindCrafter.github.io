document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       1. THEME SWITCHER LOGIC & 3D SYNC
       ========================================================================== */
    // Sync initial 3D background colors on load
    const initialTheme = document.documentElement.getAttribute('data-theme') || 'light';
    setTimeout(() => {
        if (typeof update3DThemeColors === 'function') {
            update3DThemeColors(initialTheme);
        }
        // Sync theme toggle button icon on load
        const btn = document.getElementById('themeToggle');
        if (btn) {
            const icon = btn.querySelector('i');
            if (icon) {
                if (initialTheme === 'light') {
                    icon.className = 'fa-solid fa-moon';
                } else {
                    icon.className = 'fa-solid fa-sun';
                }
            }
        }
    }, 100);

    // Listen to theme changes from the inline head toggler
    window.addEventListener('themeChanged', (e) => {
        if (typeof update3DThemeColors === 'function') {
            update3DThemeColors(e.detail.theme);
        }
    });

    /* ==========================================================================
       2. INTERSECTION OBSERVER FOR FADE-IN REVEALS (FALLBACK)
       ========================================================================== */
    const supportsScrollTimeline = window.CSS && CSS.supports && CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
    
    if (!supportsScrollTimeline) {
        const faders = document.querySelectorAll('.section-scroll-reveal');
        
        const appearOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -60px 0px"
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
    }

    /* ==========================================================================
       3. NAVIGATION & SMOOTH SCROLLING
       ========================================================================== */
    document.querySelectorAll('.nav-center a, .mobile-nav a, .hero-btn-grid a[href^="#"], .footer-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const navHeight = document.getElementById('mainNavbar').offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = elementPosition - navHeight;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Mobile Hamburger Menu Toggling
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mobileNav.classList.toggle('open');
            mobileNav.setAttribute('aria-hidden', !isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen);
            
            const icon = menuToggle.querySelector('i');
            if (isOpen) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
        
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                mobileNav.setAttribute('aria-hidden', 'true');
                menuToggle.setAttribute('aria-expanded', 'false');
                const icon = menuToggle.querySelector('i');
                icon.className = 'fa-solid fa-bars';
            });
        });
    }


    /* ==========================================================================
       5. GEMINI AI RESUME BOT INTERACTION
       ========================================================================== */
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatHistory = document.getElementById('chatHistory');
    const chipBtns = document.querySelectorAll('.chip-btn');

    // System instruction detailing Zeeshan's complete background
     const SYSTEM_INSTRUCTION = `
    You are a professional, helpful, and highly articulate AI assistant representing Muhammad Zeeshan (AIMindCrafter), an AI Engineering professional.
    Your mission is to answer questions about Zeeshan's qualifications, bio, experience, projects, skills, and certifications.
    
    Zeeshan's Profile:
    - Title: AI Engineering Professional
    - Bio: Results-driven AI Engineering professional specializing in LLM fine-tuning, Retrieval-Augmented Generation (RAG), and agentic AI systems.
    - Skills: 
      * Languages: Python, Rust, C++
      * Frameworks: FastAPI, Flask, Django, LangChain, LangGraph
      * ML & AI: Fine-Tuning (PEFT, QLoRA), RAG Architectures, Vector Databases (Pinecone, ChromaDB), Stable Diffusion (DreamBooth, ControlNet), Multi-Modal AI (Qwen2-VL)
      * Dev & Cloud: Azure, Docker, GitHub Actions, PostgreSQL
    - Experience:
      * Algotix AI (Jan 2026 - Present): Software Engineer Intern & Backend Developer. Builds agentic microservices and distributed LLM frameworks.
      * Deep Embed (Nov 2024 - Jan 2026): Machine Learning Engineer. Developed multi-modal structured extraction systems.
      * Arch Technologies (Nov 2025 - Dec 2025): Data Science Intern. Automates analytical pipelines and business KPI projections.
      * CodeAlpha (Oct 2025 - Nov 2025): Data Scientist. Built data classification models.
    - Top Projects:
      * MRI Brain Tumor Detection (EfficientNetB2, TensorFlow, Grad-CAM): 4-class tumor classification with explainability, 97%+ accuracy on 7023 images.
      * Multimodal LLM Fine-tuning: Fine-tuned Qwen2-VL (7B) with LoRA/PEFT for structured invoice text retrieval.
      * QLoRA LLM Fine-tuning: LLaMA 3 (8B) domain fine-tuning with Unsloth in 4-bit quantization.
      * Multi-PDF RAG Assistant: Ingests documents with metadata matching, source citations, and LangChain query orchestration.
      * Stable Diffusion DreamBooth: Diffusers pipeline with ControlNet constraints.
      * End-to-End DevOps: Automated Docker packaging and test execution using GitHub Actions.
    - Certifications:
      * Oracle Cloud Infrastructure 2025 Certified Generative AI Professional (https://catalog-education.oracle.com/ords/certview/sharebadge?id=47DFC2B0FDD8B9686774D2A52CE6C48160030D827B64546EFBF6751B57D8C23C)
      * IBM GenAI Engineering with Python, LangChain & Watsonx (https://www.coursera.org/account/accomplishments/specialization/804C7OR70CY9)
      * IBM AI Engineering with Python, PyTorch & TensorFlow (https://www.coursera.org/account/accomplishments/specialization/ZU65K4VB9MYS)
      * Microsoft AI & ML Engineering (https://www.coursera.org/account/accomplishments/professional-cert/AMRVK1WWXGW5)
      * Natural Language Processing (NLP Specialization) (https://www.coursera.org/account/accomplishments/specialization/FFCUX2XHJQZS)
      * Deep Learning Specialization (https://www.coursera.org/account/accomplishments/specialization/FFN4ZP2DO68S)
      * Pak Angels HEC Generative AI Training Course Promising Performer (https://quiz.ideagist.com/ideagist-certificate/?cert_hash=4286ca139c35cb6d)
      * ML Specialization (Stanford / DeepLearning.AI)
      * AI Engineer for Data Scientists (DataCamp)
      * Gemini Certified University Student (Google)
    - Links & Contact:
      * Email: muhammadzeshan.covers@gmail.com
      * Phone/WhatsApp: 03256257787 (https://wa.me/923256257787)
      * Github: https://github.com/AIMindCrafter
      * LinkedIn: https://www.linkedin.com/in/muhammad-zeshan-6b66a7350/
      * Upwork: https://www.upwork.com/freelancers/~01ea1cf7ff4a012351
      * StackOverflow: https://stackoverflow.com/users/22225216/zeeshan-malik
      * Kaggle: https://kaggle.com/zeeshanmalik
      * Reddit: https://www.reddit.com/user/MuhammadZeeshan73/
      * Discord: https://discord.com/users/1166851427495334060
      * Facebook: https://www.facebook.com/profile.php?id=100093411528772
      * X (Twitter): https://x.com/zem53836
      * Medium Profile: https://medium.com/@shani829721
      
    Interaction Rules:
    - Keep responses concise (typically 2-4 sentences or structured bullets) and optimized for readability.
    - Focus heavily on Zeeshan's expertise in GenAI and software engineering.
    - Do not invent facts, projects, or timelines not specified here. If you don't know, suggest emailing Zeeshan at muhammadzeshan.covers@gmail.com.
    `;

    if (chatForm && chatInput && chatHistory) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const messageText = chatInput.value.trim();
            if (!messageText) return;
            
            chatInput.value = '';
            handleUserMessage(messageText);
        });

        // Chip prompts click handlers
        chipBtns.forEach(chip => {
            chip.addEventListener('click', () => {
                const queryText = chip.getAttribute('data-query');
                if (queryText) {
                    handleUserMessage(queryText);
                }
            });
        });
    }

    async function handleUserMessage(query) {
        // Append User Bubble
        appendMessage(query, 'user');
        
        // Append Loading bubble
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'bot-msg chat-loading-container';
        loadingDiv.innerHTML = `
            <div class="chat-loading">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        chatHistory.appendChild(loadingDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        const apiKey = window.ENV && window.ENV.GEMINI_API_KEY;

        if (apiKey && apiKey !== "" && !apiKey.startsWith("YOUR_")) {
            // Live Gemini API Query
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ role: 'user', parts: [{ text: query }] }],
                        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] }
                    })
                });

                if (!response.ok) {
                    throw new Error(`Gemini status: ${response.status}`);
                }

                const data = await response.json();
                loadingDiv.remove();
                
                if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
                    const text = data.candidates[0].content.parts[0].text;
                    appendMessage(text, 'bot');
                } else {
                    throw new Error("Invalid response payload structure");
                }
            } catch (err) {
                console.error("Gemini API call failed, loading fallback client answer:", err);
                loadingDiv.remove();
                loadFallbackAnswer(query);
            }
        } else {
            // Key is empty or placeholder - use simulated fallback responses
            setTimeout(() => {
                loadingDiv.remove();
                loadFallbackAnswer(query);
            }, 850);
        }
    }

    function loadFallbackAnswer(query) {
        const text = getSimulatedBotResponse(query);
        appendMessage(text, 'bot');
    }

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = sender === 'user' ? 'user-msg' : 'bot-msg';
        
        if (sender === 'bot') {
            msgDiv.innerHTML = parseMarkdown(text);
        } else {
            msgDiv.textContent = text;
        }
        
        chatHistory.appendChild(msgDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Dynamic Keyword matching engine for offline or key-less fallback runs
    function getSimulatedBotResponse(query) {
        const q = query.toLowerCase();
        
        if (q.includes('role') || q.includes('current') || q.includes('intern') || q.includes('algotix') || q.includes('where do you work')) {
            return "Zeeshan is currently working as a **Software Engineer Intern & Backend Developer** at **Algotix AI** (started Jan 2026). His tasks involve developing agentic AI microservices and distributed LLM frameworks.";
        }
        
        if (q.includes('project') || q.includes('work') || q.includes('build') || q.includes('mri') || q.includes('detection') || q.includes('qwen') || q.includes('rag')) {
            return "Here are Zeeshan's primary featured projects:\n\n- **MRI Brain Tumor Detection**: 4-class classification using EfficientNetB2 & TensorFlow with 97%+ accuracy.\n- **Multimodal LLM Fine-tuning**: Extracting OCR data formats using Qwen2-VL.\n- **Multi-PDF RAG Assistant**: Document index matching using LangChain, ChromaDB, and Gemini API.\n- **Stable Diffusion DreamBooth**: Fine-tuning SD images using ControlNet pipelines.\n\nYou can inspect all projects directly on his [GitHub Profile](https://github.com/AIMindCrafter).";
        }
        
        if (q.includes('certif') || q.includes('credentials') || q.includes('oracle') || q.includes('ibm') || q.includes('stanford')) {
            return "Zeeshan's credentials include:\n\n- **Oracle GenAI Professional** (1Z0-1127-25)\n- **IBM GenAI Engineering** (LangChain & Watsonx)\n- **IBM AI Engineering** (PyTorch & TensorFlow)\n- **Stanford / DeepLearning.AI ML Specialization**\n- **Google Gemini Certified Student**";
        }
        
        if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('python') || q.includes('rust') || q.includes('fastapi')) {
            return "Zeeshan's core skills are:\n\n- **Languages**: Python, Rust, C++\n- **Generative AI**: Fine-Tuning (PEFT, QLoRA), Advanced RAG systems, LangChain, LangGraph, Stable Diffusion, and Multi-modal extraction.\n- **DevOps & Cloud**: Docker, Azure Cloud Services, FastAPI, and GitHub Actions CI/CD pipelines.";
        }
        
        if (q.includes('contact') || q.includes('email') || q.includes('linkedin') || q.includes('reach') || q.includes('social')) {
            return "You can reach Zeeshan directly at **muhammadzeshan.covers@gmail.com** or connect via [LinkedIn](https://www.linkedin.com/in/muhammad-zeshan-6b66a7350/). You can also click the Download Resume button.";
        }
        
        return "I am Zeeshan's AI Assistant. Feel free to query me about:\n\n- His **Current Role** at Algotix AI\n- His **Notable Projects** (MRI Detection, LLM Fine-tuning, RAG)\n- His **Professional Certifications** (Oracle, IBM, Stanford)\n- His **Tech Stack** (Python, Rust, LangChain, FastAPI)\n\n*(Note: Running in local simulated mode because Gemini API Key is loading fallback values)*";
    }

    // Lightweight markdown parser for clean chatbot formatting
    function parseMarkdown(text) {
        let html = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        
        // Bold formatting
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        
        // Link markdown
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="chat-link">$1</a>');
        
        // Lists conversion
        html = html.replace(/^\s*-\s+(.+)/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
        // Clean double nested lists
        html = html.replace(/<\/ul>\s*<ul>/g, '');
        
        // Line breaks
        html = html.replace(/\n/g, '<br>');
        
        return html;
    }

    /* ==========================================================================
       6. CONTACT FORM SUBMISSION (FORMSUBMIT.CO)
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
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

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> SENDING...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('https://formsubmit.co/ajax/muhammadzeshan.covers@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message,
                        _subject: `New Portfolio Message from ${name}`
                    })
                });

                const result = await response.json();
                if (response.ok) {
                    submitBtn.innerHTML = 'MESSAGE SENT! <i class="fa-solid fa-check"></i>';
                    setTimeout(() => {
                        submitBtn.innerHTML = originalHTML;
                        submitBtn.disabled = false;
                        contactForm.reset();
                    }, 3000);
                } else {
                    console.error(result);
                    alert("Failed to send message: " + (result.message || "Unknown error"));
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error(error);
                alert("An error occurred while sending the message.");
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
            }
        });
    }

    /* ==========================================================================
       6b. TYPEWRITER EFFECT & DEV CONSOLE RUNNER
       ========================================================================== */
    // Typewriter effect
    const typewriterElement = document.getElementById('typewriter-text');
    if (typewriterElement) {
        const words = [
            "I build intelligent systems.",
            "I fine-tune large language models.",
            "I engineer agentic workflows.",
            "I deploy multi-modal pipelines."
        ];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                typingSpeed = 2000; // Pause at full word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 500; // Pause before typing next word
            }

            setTimeout(type, typingSpeed);
        }
        
        type();
    }

    // Overlapping Chatbot Helper Chips click handlers
    const overlapChips = document.querySelectorAll('.overlap-chip');
    overlapChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const queryText = chip.getAttribute('data-chat-query');
            if (queryText) {
                // Scroll to chatbot section smoothly
                const chatSection = document.getElementById('chat-bot');
                if (chatSection) {
                    const navHeight = document.getElementById('mainNavbar').offsetHeight;
                    const elementPosition = chatSection.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = elementPosition - navHeight;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
                // Trigger message handler
                handleUserMessage(queryText);
            }
        });
    });

    // Call 3D initialization
    init3DAnimation();

    /* ==========================================================================
       7. 3D PLEXUS BACKGROUND ANIMATION
       ========================================================================== */
    let scene, camera, renderer, pointCloud, lineSegments;
    let particlePositions, particleData = [];
    const maxParticleCount = 80;
    let pointsGeometry, lineGeometry;
    const r = 800; // bounding box radius
    const rHalf = r / 2;
    
    // Mouse interaction variables
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    function init3DAnimation() {
        const canvas = document.getElementById('canvas3d');
        if (!canvas) return;

        // Scene
        scene = new THREE.Scene();

        // Camera
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
        camera.position.z = 1200;

        // Renderer
        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Group container
        const group = new THREE.Group();
        scene.add(group);

        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const colorsConfig = getThemeColors(currentTheme);

        // Create particles
        pointsGeometry = new THREE.BufferGeometry();
        lineGeometry = new THREE.BufferGeometry();

        particlePositions = new Float32Array(maxParticleCount * 3);

        for (let i = 0; i < maxParticleCount; i++) {
            const x = Math.random() * r - rHalf;
            const y = Math.random() * r - rHalf;
            const z = Math.random() * r - rHalf;

            particlePositions[i * 3] = x;
            particlePositions[i * 3 + 1] = y;
            particlePositions[i * 3 + 2] = z;

            // add velocity
            particleData.push({
                velocity: new THREE.Vector3(
                    (-1 + Math.random() * 2) * 0.8,
                    (-1 + Math.random() * 2) * 0.8,
                    (-1 + Math.random() * 2) * 0.8
                )
            });
        }

        pointsGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

        // Create Materials
        const pMaterial = new THREE.PointsMaterial({
            color: colorsConfig.particleColor,
            size: 6,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        pointCloud = new THREE.Points(pointsGeometry, pMaterial);
        group.add(pointCloud);

        // Lines Geometry & Material
        const maxConnections = maxParticleCount * maxParticleCount;
        const linePositions = new Float32Array(maxConnections * 3);
        const lineColors = new Float32Array(maxConnections * 3);

        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

        const lMaterial = new THREE.LineBasicMaterial({
            color: colorsConfig.lineColor,
            transparent: true,
            opacity: colorsConfig.lineOpacity,
            blending: THREE.NormalBlending,
            linewidth: 1
        });

        lineSegments = new THREE.LineSegments(lineGeometry, lMaterial);
        group.add(lineSegments);

        // Mouse listener
        document.addEventListener('mousemove', onDocumentMouseMove);
        window.addEventListener('resize', onWindowResize);

        function animate() {
            requestAnimationFrame(animate);

            // Update particles position
            for (let i = 0; i < maxParticleCount; i++) {
                particlePositions[i * 3] += particleData[i].velocity.x;
                particlePositions[i * 3 + 1] += particleData[i].velocity.y;
                particlePositions[i * 3 + 2] += particleData[i].velocity.z;

                // Bounce check
                if (particlePositions[i * 3] < -rHalf || particlePositions[i * 3] > rHalf) {
                    particleData[i].velocity.x = -particleData[i].velocity.x;
                }
                if (particlePositions[i * 3 + 1] < -rHalf || particlePositions[i * 3 + 1] > rHalf) {
                    particleData[i].velocity.y = -particleData[i].velocity.y;
                }
                if (particlePositions[i * 3 + 2] < -rHalf || particlePositions[i * 3 + 2] > rHalf) {
                    particleData[i].velocity.z = -particleData[i].velocity.z;
                }
            }

            pointsGeometry.attributes.position.needsUpdate = true;

            // Lines updates
            const positionsArr = lineGeometry.attributes.position.array;
            const colorsArr = lineGeometry.attributes.color.array;

            let lineIndex = 0;
            const minDistance = 150;

            for (let i = 0; i < maxParticleCount; i++) {
                for (let j = i + 1; j < maxParticleCount; j++) {
                    const dx = particlePositions[i * 3] - particlePositions[j * 3];
                    const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
                    const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < minDistance) {
                        // Add line segment endpoints
                        positionsArr[lineIndex * 3] = particlePositions[i * 3];
                        positionsArr[lineIndex * 3 + 1] = particlePositions[i * 3 + 1];
                        positionsArr[lineIndex * 3 + 2] = particlePositions[i * 3 + 2];

                        positionsArr[(lineIndex + 1) * 3] = particlePositions[j * 3];
                        positionsArr[(lineIndex + 1) * 3 + 1] = particlePositions[j * 3 + 1];
                        positionsArr[(lineIndex + 1) * 3 + 2] = particlePositions[j * 3 + 2];

                        // Set alpha color based on proximity
                        const alpha = 1.0 - (dist / minDistance);
                        colorsArr[lineIndex * 3] = alpha;
                        colorsArr[lineIndex * 3 + 1] = alpha;
                        colorsArr[lineIndex * 3 + 2] = alpha;

                        colorsArr[(lineIndex + 1) * 3] = alpha;
                        colorsArr[(lineIndex + 1) * 3 + 1] = alpha;
                        colorsArr[(lineIndex + 1) * 3 + 2] = alpha;

                        lineIndex += 2;
                    }
                }
            }

            lineGeometry.setDrawRange(0, lineIndex);
            lineGeometry.attributes.position.needsUpdate = true;
            lineGeometry.attributes.color.needsUpdate = true;

            // Slow idle rotation
            group.rotation.y += 0.0005;

            // Rotate based on mouse
            targetRotationY = (mouseX - windowHalfX) * 0.0003;
            targetRotationX = (mouseY - windowHalfY) * 0.0003;

            group.rotation.y += (targetRotationY - group.rotation.y) * 0.05;
            group.rotation.x += (targetRotationX - group.rotation.x) * 0.05;

            renderer.render(scene, camera);
        }

        animate();
    }

    function getThemeColors(theme) {
        if (theme === 'dark') {
            return {
                particleColor: new THREE.Color(0x00F2FE), // Glowing cyan
                lineColor: new THREE.Color(0x00F2FE),
                lineOpacity: 0.15
            };
        } else {
            return {
                particleColor: new THREE.Color(0x1E1E1E), // Dark charcoal
                lineColor: new THREE.Color(0x1E1E1E),
                lineOpacity: 0.08
            };
        }
    }

    function update3DThemeColors(theme) {
        if (!pointCloud || !lineSegments) return;
        const colorsConfig = getThemeColors(theme);
        pointCloud.material.color.copy(colorsConfig.particleColor);
        lineSegments.material.color.copy(colorsConfig.lineColor);
        lineSegments.material.opacity = colorsConfig.lineOpacity;
    }

    function onDocumentMouseMove(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    }

    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        if (camera && renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
});
