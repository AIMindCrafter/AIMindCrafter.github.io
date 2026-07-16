document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       1. THEME SWITCHER LOGIC
       ========================================================================== */
    const themeToggleBtn = document.getElementById('themeToggle');
    
    // Set theme on load
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.style.colorScheme = theme;
        localStorage.setItem('theme', theme);
        
        // Update toggle button icon
        if (themeToggleBtn) {
            const icon = themeToggleBtn.querySelector('i');
            if (icon) {
                if (theme === 'light') {
                    // In light theme, show moon icon to switch to dark theme
                    icon.className = 'fa-solid fa-moon';
                } else {
                    // In dark theme, show sun icon to switch to light theme
                    icon.className = 'fa-solid fa-sun';
                }
            }
        }
    }

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
       4. CODE RUNNER PIEPELINE SIMULATION
       ========================================================================== */
    const runCodeBtn = document.getElementById('runCodeBtn');
    const consoleOutput = document.getElementById('consoleOutput');
    let isRunningCode = false;

    if (runCodeBtn && consoleOutput) {
        runCodeBtn.addEventListener('click', () => {
            if (isRunningCode) return;
            isRunningCode = true;
            runCodeBtn.disabled = true;
            runCodeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Running...';
            
            consoleOutput.innerHTML = '';
            
            const lines = [
                { text: "> python agent_pipeline.py", delay: 0, color: "var(--text-secondary)" },
                { text: "[INFO] Initializing Gemini LLM backend (gemini-2.5-flash)...", delay: 500, color: "var(--color-blue)" },
                { text: "[INFO] Loading RAG parameters & vector DB keys...", delay: 1000, color: "var(--color-blue)" },
                { text: "[SUCCESS] Ingested 4,210 document embeddings from Pinecone index.", delay: 1500, color: "var(--color-green)" },
                { text: "[INFO] Starting Zero-Shot Agent Planner...", delay: 2000, color: "var(--color-blue)" },
                { text: "[THOUGHT] Goal: 'Analyze context.' Search workspace files.", delay: 2400, color: "var(--color-yellow)" },
                { text: "[ACTION] Calling Tool: file_search(Query: 'MRI brain model specs')", delay: 2800, color: "var(--color-orange)" },
                { text: "[SUCCESS] Found file specs: EfficientNetB2 classification (97% accuracy).", delay: 3300, color: "var(--color-green)" },
                { text: "[RESULT] 'Analysis complete. The loaded model resolves MRI tumors across 4 categories.'", delay: 3800, color: "var(--color-cyan)" },
                { text: "[SUCCESS] Pipeline run finished in 4.12s.", delay: 4200, color: "var(--color-green)" }
            ];

            lines.forEach(line => {
                setTimeout(() => {
                    const lineDiv = document.createElement('div');
                    lineDiv.className = 'console-log-line';
                    lineDiv.style.color = line.color;
                    lineDiv.textContent = line.text;
                    consoleOutput.appendChild(lineDiv);
                    consoleOutput.scrollTop = consoleOutput.scrollHeight;
                }, line.delay);
            });

            setTimeout(() => {
                isRunningCode = false;
                runCodeBtn.disabled = false;
                runCodeBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run Agent';
            }, 4400);
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
    You are a professional, helpful, and highly articulate AI assistant representing Muhammad Zeeshan (AIMindCrafter), a Generative AI Engineer.
    Your mission is to answer questions about Zeeshan's qualifications, bio, experience, projects, skills, and certifications.
    
    Zeeshan's Profile:
    - Title: Generative AI Engineer
    - Bio: Results-driven Generative AI Engineer specializing in LLM fine-tuning, Retrieval-Augmented Generation (RAG), and agentic AI systems.
    - Skills: 
      * Languages: Python, Rust, C++
      * Frameworks: FastAPI, Flask, Django, LangChain, LangGraph
      * ML & AI: Fine-Tuning (PEFT, QLoRA), RAG Architectures, Vector Databases (Pinecone, ChromaDB), Stable Diffusion (DreamBooth, ControlNet), Multi-Modal AI (Qwen2-VL)
      * Dev & Cloud: Azure, Docker, GitHub Actions, PostgreSQL, Kubernetes
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
      * End-to-End MLOps: Automated Docker packaging and test execution using GitHub Actions.
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
      * Intro to Kubernetes LFS158 (Linux Foundation)
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
      * Gamma Portfolio: https://muhammad-zeeshan-aiengi-8owxsht.gamma.site/
      
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
            return "Zeeshan's core skills are:\n\n- **Languages**: Python, Rust, C++\n- **Generative AI**: Fine-Tuning (PEFT, QLoRA), Advanced RAG systems, LangChain, LangGraph, Stable Diffusion, and Multi-modal extraction.\n- **MLOps & DevOps**: Docker, Azure Cloud Services, FastAPI, and GitHub Actions CI/CD pipelines.";
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
       6. CONTACT FORM SUBMISSION (WEB3FORMS API)
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

            const accessKey = window.ENV && window.ENV.WEB3FORMS_ACCESS_KEY;
            
            if (!accessKey || accessKey === "") {
                alert("Web3Forms Access Key is missing in env.js. Message sending is currently in mock mode.");
                console.log("Form submitted locally:", { name, email, message });
                contactForm.reset();
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> SENDING...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: accessKey,
                        name: name,
                        email: email,
                        message: message,
                        subject: `Portfolio Contact from ${name}`
                    })
                });

                const result = await response.json();
                if (response.status === 200) {
                    submitBtn.innerHTML = 'MESSAGE SENT! <i class="fa-solid fa-check"></i>';
                    setTimeout(() => {
                        submitBtn.innerHTML = originalHTML;
                        submitBtn.disabled = false;
                        contactForm.reset();
                    }, 3000);
                } else {
                    console.error(result);
                    alert("Failed to send message: " + result.message);
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
});
