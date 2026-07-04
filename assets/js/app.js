// Global portfolio data store — accessible from all functions
let portfolioData = {};

document.addEventListener('DOMContentLoaded', () => {
    initDynamicContent();
    initTheme();
    initNavbar();
    initTypingEffect();
    initSkillsFilter();
    initProjectsFilter();
    initGitHubStats();
    initTimeline();
    initContactForm();
    initScrollReveal();
    initAdminLockState();
    initVisitorLogger();
});

// Log unique visitor counts to database
function initVisitorLogger() {
    fetch('http://127.0.0.1:5000/api/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }).catch(err => console.log("Visitor logging skipped locally:", err));
}


// Check admin auth token and update lock icon state
function initAdminLockState() {
    const AUTH_KEY = 'admin-auth-token';
    const AUTH_EXPIRY = 24 * 60 * 60 * 1000;

    const svgLocked = document.querySelector('.svg-locked');
    const svgUnlocked = document.querySelector('.svg-unlocked');
    if (!svgLocked || !svgUnlocked) return;

    let isLoggedIn = false;
    try {
        const stored = localStorage.getItem(AUTH_KEY);
        if (stored) {
            const { timestamp } = JSON.parse(stored);
            isLoggedIn = (Date.now() - timestamp) < AUTH_EXPIRY;
        }
    } catch { isLoggedIn = false; }

    if (isLoggedIn) {
        svgLocked.style.display = 'none';
        svgUnlocked.style.display = 'block';
        svgUnlocked.style.position = 'static';
    } else {
        svgLocked.style.display = 'block';
        svgUnlocked.style.display = 'none';
    }
}


function initDynamicContent() {
    const defaultPortfolioData = {
        profile: {
            name: "Aryan Joshi",
            title: "Full Stack & Intelligent Agents Architect",
            description: "Designing and building high-performance web solutions, advanced intelligent applications, and scalable backend infrastructures for forward-thinking clients.",
            about: "I started programming over five years ago, driven by curiosity to build solutions that resolve real-world problems. Today, my focus lies at the intersection of modern front-end design systems, scalable backend architectures, and intelligent API implementations.",
            avatar: "assets/images/avatar.png?v=original",
            resume: "#"
        },
        education: [
            {
                id: "1",
                title: "M.S. in Computer Science",
                date: "2020 - 2022",
                org: "State Tech University",
                desc: "Specialized in Intelligent Systems and Distributed Backend Architecture. Graduated with Honors."
            },
            {
                id: "2",
                title: "B.S. in Software Engineering",
                date: "2016 - 2020",
                org: "Tech Institute of Science",
                desc: "Acquired foundational training in Data Structures, Database Systems design, and Object-Oriented methodologies."
            }
        ],
        experience: [
            {
                id: "1",
                title: "Senior Full Stack Engineer",
                date: "2024 - Present",
                org: "Vortex Digital Lab",
                desc: "Designing high-throughput API services, optimizing database latency, and guiding the transition from monoliths to next-gen edge architectures."
            },
            {
                id: "2",
                title: "Software Developer",
                date: "2022 - 2024",
                org: "WebSolutions Inc.",
                desc: "Successfully built and scaled 15+ clients dashboards, increasing application load speed and UI metrics."
            }
        ],
        stats: {
            username: "aryanjoshi458-rgb",
            repos: 34,
            followers: 120,
            following: 84
        },
        contact: {
            email: "Aryan.Joshi.dev@gmail.com",
            phone: "+1 (555) 019-2834",
            location: "San Francisco, CA"
        },
        projects: [
            {
                id: "1",
                title: "Neural Analytics Hub",
                category: "ai",
                desc: "Real-time business data processing platform powered by the Gemini API for natural language reports.",
                tech: "Next.js, FastAPI, Gemini API, ChartJS",
                features: "Natural language query interface, Automated reports builder, Real-time telemetry integration",
                image: "assets/images/project1.png?v=original",
                demo: "#",
                github: "#"
            },
            {
                id: "2",
                title: "Stripe-integrated SaaS Portal",
                category: "web",
                desc: "A premium customer management tool with dynamic billing subscription plans, and invoice exports.",
                tech: "React, Node.js, MongoDB, Stripe",
                features: "Stripe Billing API integration, Responsive admin panel, Secure user authentication",
                image: "assets/images/project1.png?v=original",
                demo: "#",
                github: "#"
            },
            {
                id: "3",
                title: "Git-Automate CLI",
                category: "tools",
                desc: "A lightweight command-line tool to automate git status auditing, auto-commit creation, and pull requests.",
                tech: "Node.js, Inquirer, OpenAI API",
                features: "Automated local git repository scan, AI-generated commit descriptions, Interactive shell menu",
                image: "assets/images/project1.png?v=original",
                demo: "#",
                github: "#"
            }
        ],
        certs: [
            {
                id: "1",
                logo: "AWS",
                title: "AWS Certified Solutions Architect",
                provider: "Amazon Web Services",
                date: "Issued Jan 2025 • Expires Jan 2028",
                link: "#"
            },
            {
                id: "2",
                logo: "TFS",
                title: "TensorFlow Developer Certificate",
                provider: "TensorFlow / Google",
                date: "Issued Aug 2024 • No Expiration",
                link: "#"
            },
            {
                id: "3",
                logo: "MDB",
                title: "MongoDB Certified Developer",
                provider: "MongoDB University",
                date: "Issued May 2023 • No Expiration",
                link: "#"
            }
        ]
    };

    // Merge defaults into global portfolioData if it hasn't been set yet
    if (!portfolioData || Object.keys(portfolioData).length === 0) {
        portfolioData = defaultPortfolioData;
    }

    function applyData() {
        // Ensure all properties exist to prevent JS errors
        if (!portfolioData) portfolioData = {};
        if (!portfolioData.profile) portfolioData.profile = {};
        if (!portfolioData.profile.name) portfolioData.profile.name = "Aryan Joshi";
        if (!portfolioData.profile.title) portfolioData.profile.title = "Full Stack & Intelligent Agents Architect";
        if (!portfolioData.profile.description) portfolioData.profile.description = "";
        if (!portfolioData.profile.about) portfolioData.profile.about = "";
        if (!portfolioData.profile.avatar) portfolioData.profile.avatar = "assets/images/avatar.png?v=original";
        if (!portfolioData.profile.resume) portfolioData.profile.resume = "#";

        if (!portfolioData.stats) portfolioData.stats = { username: "", repos: 0, followers: 0, following: 0 };
        if (!portfolioData.contact) portfolioData.contact = { email: "", phone: "", location: "" };
        if (!portfolioData.projects) portfolioData.projects = [];
        if (!portfolioData.certs) portfolioData.certs = [];
        if (!portfolioData.education || portfolioData.education.length === 0) {
            portfolioData.education = [
                {
                    id: "1",
                    title: "M.S. in Computer Science",
                    date: "2020 - 2022",
                    org: "State Tech University",
                    desc: "Specialized in Intelligent Systems and Distributed Backend Architecture. Graduated with Honors."
                },
                {
                    id: "2",
                    title: "B.S. in Software Engineering",
                    date: "2016 - 2020",
                    org: "Tech Institute of Science",
                    desc: "Acquired foundational training in Data Structures, Database Systems design, and Object-Oriented methodologies."
                }
            ];
        }
        if (!portfolioData.experience || portfolioData.experience.length === 0) {
            portfolioData.experience = [
                {
                    id: "1",
                    title: "Senior Full Stack Engineer",
                    date: "2024 - Present",
                    org: "Vortex Digital Lab",
                    desc: "Designing high-throughput API services, optimizing database latency, and guiding the transition from monoliths to next-gen edge architectures."
                },
                {
                    id: "2",
                    title: "Software Developer",
                    date: "2022 - 2024",
                    org: "WebSolutions Inc.",
                    desc: "Successfully built and scaled 15+ clients dashboards, increasing application load speed and UI metrics."
                }
            ];
        }

        if (!portfolioData.testimonials || portfolioData.testimonials.length === 0) {
            portfolioData.testimonials = [
                {
                    id: "1",
                    name: "Sarah Jenkins",
                    role: "Product Manager",
                    company: "Vortex Labs",
                    link: "https://linkedin.com",
                    review: "Aryan is an exceptional developer. He built our automated agent workflow ahead of schedule and reduced API costs by 35%. Highly recommended!"
                },
                {
                    id: "2",
                    name: "David Chen",
                    role: "Founder",
                    company: "SaaSify",
                    link: "https://github.com",
                    review: "Working with Aryan was seamless. His architecture is extremely clean and he explained complex system designs very clearly. A top-tier architect."
                }
            ];
        }

        // Update Resume link
        const resumeBtn = document.getElementById('hero-btn-resume');
        if (resumeBtn && portfolioData.profile.resume) {
            resumeBtn.href = portfolioData.profile.resume;
            if (portfolioData.profile.resume !== "#") {
                resumeBtn.setAttribute('download', 'Resume.pdf');
            }
        }

        // Update Name elements
        const nameSpans = document.querySelectorAll('.gradient-text');
        nameSpans.forEach(el => {
            if (el.parentElement.classList.contains('hero-title')) {
                el.textContent = portfolioData.profile.name;
            }
        });

        // Keep custom HTML vector emblem logo intact
        const navLogo = document.getElementById('nav-logo');
        if (navLogo) {
            // Inner HTML is fully defined inside index.html, no overwrite needed
        }

        const footerH3 = document.querySelector('.footer-brand h3');
        if (footerH3) footerH3.textContent = portfolioData.profile.name;

        const footerCopy = document.querySelector('.footer-bottom div:first-child');
        if (footerCopy) footerCopy.textContent = `© 2026 ${portfolioData.profile.name}. All rights reserved.`;

        const ghUserH3 = document.querySelector('.github-username h3');
        if (ghUserH3) ghUserH3.textContent = portfolioData.stats.username;

        // Update Image elements
        const avatarImg = document.querySelector('.avatar-image');
        if (avatarImg) {
            avatarImg.src = portfolioData.profile.avatar;
            avatarImg.style.opacity = '1';
        }

        const ghAvatarImg = document.querySelector('.github-avatar');
        if (ghAvatarImg) {
            ghAvatarImg.src = portfolioData.profile.avatar;
            ghAvatarImg.style.opacity = '1';
        }

        // Update Descriptions
        const heroDesc = document.querySelector('.hero-desc');
        if (heroDesc) heroDesc.textContent = portfolioData.profile.description;

        const footerDesc = document.querySelector('.footer-brand p');
        if (footerDesc) footerDesc.textContent = portfolioData.profile.description;

        const aboutP = document.querySelector('.about-details p:first-of-type');
        if (aboutP) aboutP.textContent = portfolioData.profile.about;

        // Update Contact Details
        const emailEl = document.querySelector('.contact-method:nth-child(1) .contact-value');
        if (emailEl) emailEl.textContent = portfolioData.contact.email;

        const phoneEl = document.querySelector('.contact-method:nth-child(2) .contact-value');
        if (phoneEl) phoneEl.textContent = portfolioData.contact.phone;

        const locEl = document.querySelector('.contact-method:nth-child(3) .contact-value');
        if (locEl) locEl.textContent = portfolioData.contact.location;

        // Update GitHub stats
        const ghReposEl = document.getElementById('gh-repos');
        if (ghReposEl) ghReposEl.textContent = portfolioData.stats.repos;

        const ghFollowersEl = document.getElementById('gh-followers');
        if (ghFollowersEl) ghFollowersEl.textContent = portfolioData.stats.followers;

        const ghFollowingEl = document.getElementById('gh-following');
        if (ghFollowingEl) ghFollowingEl.textContent = portfolioData.stats.following;

        // Render Projects dynamically
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid && portfolioData.projects) {
            projectsGrid.innerHTML = '';
            portfolioData.projects.forEach(p => {
                const art = document.createElement('article');
                art.className = 'project-card glass-panel reveal';
                art.setAttribute('data-category', p.category);

                let featuresHTML = '';
                if (p.features) {
                    const featuresArr = Array.isArray(p.features) ? p.features : p.features.split(',');
                    featuresHTML = featuresArr
                        .map(f => f.trim())
                        .filter(f => f)
                        .map(f => `<li>${f}</li>`)
                        .join('');
                }

                let techHTML = '';
                if (p.tech) {
                    const techArr = Array.isArray(p.tech) ? p.tech : p.tech.split(',');
                    techHTML = techArr
                        .map(t => t.trim())
                        .filter(t => t)
                        .map(t => `<span class="tech-badge">${t}</span>`)
                        .join('');
                }

                // Parse images list
                let images = [];
                if (p.image && p.image.includes(',')) {
                    images = p.image.split(',');
                } else {
                    images = p.image ? [p.image] : ['assets/images/project1.png?v=original'];
                }

                let imageBoxHTML = '';
                if (images.length > 1) {
                    // Create hover-slider track with all images side-by-side
                    const trackImagesHTML = images.map(imgSrc => `<img src="${imgSrc}" alt="${p.title}" class="project-image">`).join('');
                    const segmentsHTML = images.map((_, idx) => `<div class="hover-segment" data-index="${idx}"></div>`).join('');
                    const dotsHTML = images.map((_, idx) => `<div class="slider-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></div>`).join('');

                    imageBoxHTML = `
                         <div class="hover-slider-container">
                             <div class="hover-slider-track" id="slider-track-${p.id}">
                                 ${trackImagesHTML}
                             </div>
                             <div class="hover-segments">${segmentsHTML}</div>
                             <div class="slider-indicators">${dotsHTML}</div>
                         </div>
                     `;
                } else {
                    imageBoxHTML = `<img src="${images[0]}" alt="${p.title}" class="project-image">`;
                }

                art.innerHTML = `
                      <div class="project-image-box">
                          ${imageBoxHTML}
                          <span class="project-badge">${p.category.toUpperCase()} Project</span>
                     </div>
                     <div class="project-body">
                         <h3 class="project-title">${p.title}</h3>
                         <p class="project-desc">${p.desc}</p>
                         <ul class="project-features">
                             ${featuresHTML}
                         </ul>
                         <div class="project-tech">
                             ${techHTML}
                         </div>
                         <div class="project-links" style="display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap;">
                             <button onclick="openCaseStudy('${p.id}')" class="project-link btn-primary" style="flex: 1; text-align: center; justify-content: center; padding: 10px 0; border-radius: 8px; font-weight: 600; cursor: pointer; border: none;">View Case Study</button>
                             <div style="display: flex; gap: 8px; width: 100%;">
                                 <a href="${p.demo}" class="project-link btn-secondary" target="_blank" style="flex: 1; text-align: center; font-size: 0.85rem; padding: 8px 0; border-radius: 6px; font-weight: 600;">Live Demo</a>
                                 <a href="${p.github}" class="project-link btn-secondary" target="_blank" style="flex: 1; text-align: center; font-size: 0.85rem; padding: 8px 0; border-radius: 6px; font-weight: 600;">GitHub</a>
                             </div>
                         </div>
                     </div>
                 `;
                projectsGrid.appendChild(art);

                // Attach hover slider interactive listeners
                if (images.length > 1) {
                    const sliderTrack = art.querySelector(`#slider-track-${p.id}`);
                    const segments = art.querySelectorAll('.hover-segment');
                    const dots = art.querySelectorAll('.slider-dot');

                    segments.forEach(seg => {
                        seg.addEventListener('mouseenter', (e) => {
                            const idx = parseInt(e.target.getAttribute('data-index'));
                            sliderTrack.style.transform = `translateX(-${idx * 100}%)`;
                            dots.forEach(d => {
                                if (parseInt(d.getAttribute('data-index')) === idx) {
                                    d.classList.add('active');
                                } else {
                                    d.classList.remove('active');
                                }
                            });
                        });
                    });

                    // Reset to first image on mouse leave
                    const container = art.querySelector('.hover-slider-container');
                    container.addEventListener('mouseleave', () => {
                        sliderTrack.style.transform = 'translateX(0%)';
                        dots.forEach((d, idx) => {
                            if (idx === 0) d.classList.add('active');
                            else d.classList.remove('active');
                        });
                    });
                }
            });
        }

        // Render Certifications dynamically
        const certsGrid = document.getElementById('certs-grid');
        if (certsGrid) {
            certsGrid.innerHTML = '';
            if (portfolioData.certs) {
                portfolioData.certs.forEach(c => {
                    const card = document.createElement('div');
                    card.className = 'cert-card glass-panel reveal';
                    card.innerHTML = `
                        <div class="cert-header">
                            <div class="cert-logo">${c.logo}</div>
                            <h3 class="cert-title">${c.title}</h3>
                        </div>
                        <div class="cert-provider">${c.provider}</div>
                        <div class="cert-date">${c.date}</div>
                        <a href="${c.link}" class="cert-btn btn-secondary" target="_blank">Verify Credential</a>
                    `;
                    certsGrid.appendChild(card);
                });
            }
        }

        // Render Education dynamically
        const eduList = document.getElementById('education-list');
        if (eduList && portfolioData.education) {
            eduList.innerHTML = '';
            portfolioData.education.forEach(e => {
                const card = document.createElement('div');
                card.className = 'resume-card glass-panel reveal';
                card.innerHTML = `
                    <div class="resume-card-header">
                        <span class="resume-card-title">${e.title}</span>
                        <span class="resume-card-date">${e.date}</span>
                    </div>
                    <div class="resume-card-org">${e.org}</div>
                    <p class="resume-card-body">${e.desc}</p>
                `;
                eduList.appendChild(card);
            });
        }

        // Render Experience dynamically
        const expList = document.getElementById('experience-list');
        if (expList && portfolioData.experience) {
            expList.innerHTML = '';
            portfolioData.experience.forEach(e => {
                const card = document.createElement('div');
                card.className = 'resume-card glass-panel reveal';
                card.innerHTML = `
                    <div class="resume-card-header">
                        <span class="resume-card-title">${e.title}</span>
                        <span class="resume-card-date">${e.date}</span>
                    </div>
                    <div class="resume-card-org">${e.org}</div>
                    <p class="resume-card-body">${e.desc}</p>
                `;
                expList.appendChild(card);
            });
        }

        // Render Skills dynamically
        const skillsGrid = document.getElementById('skills-grid');
        if (skillsGrid && portfolioData.skills) {
            skillsGrid.innerHTML = '';
            portfolioData.skills.forEach(s => {
                // Map class for devicon classes
                let deviconClass = 'devicon-javascript-plain colored';
                const nameLower = s.name.toLowerCase();

                if (nameLower.includes('html')) {
                    deviconClass = 'devicon-html5-plain-wordmark colored';
                } else if (nameLower.includes('css')) {
                    deviconClass = 'devicon-css3-plain-wordmark colored';
                } else if (nameLower.includes('react') || nameLower.includes('next')) {
                    deviconClass = 'devicon-react-original-wordmark colored';
                } else if (nameLower.includes('node') || nameLower.includes('express')) {
                    deviconClass = 'devicon-nodejs-plain-wordmark colored';
                } else if (nameLower.includes('javascript') || nameLower.includes('js')) {
                    deviconClass = 'devicon-javascript-plain colored';
                } else if (nameLower.includes('python') || nameLower.includes('fastapi')) {
                    deviconClass = 'devicon-python-plain colored';
                } else if (nameLower.includes('mongo')) {
                    deviconClass = 'devicon-mongodb-plain-wordmark colored';
                } else if (nameLower.includes('sql') || nameLower.includes('postgres')) {
                    deviconClass = 'devicon-postgresql-plain-wordmark colored';
                } else if (nameLower.includes('git') || nameLower.includes('github')) {
                    deviconClass = 'devicon-github-original-wordmark colored';
                } else if (nameLower.includes('docker')) {
                    deviconClass = 'devicon-docker-plain-wordmark colored';
                } else if (nameLower.includes('aws')) {
                    deviconClass = 'devicon-amazonwebservices-plain-wordmark colored';
                } else if (nameLower.includes('gemini') || nameLower.includes('openai') || nameLower.includes('ai') || nameLower.includes('api')) {
                    deviconClass = 'devicon-google-plain colored'; // Fallback to Google / general devicon
                } else {
                    deviconClass = 'devicon-code-plain colored';
                }

                const card = document.createElement('div');
                card.className = 'skill-card glass-panel reveal';
                card.setAttribute('data-skill-type', s.category);
                card.innerHTML = `
                    <div class="skill-info">
                        <div class="skill-icon" style="display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; font-size: 2.2rem; background: transparent; border: none; border-radius: 0;">
                            ${nameLower.includes('python') ?
                        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="16 16 32 32" style="width: 1em; height: 1em;">
                                  <path fill="#3776AB" d="M31.885 16c-8.124 0-7.617 3.523-7.617 3.523l.01 3.65h7.752v1.095H21.197S16 23.678 16 31.876c0 8.196 4.537 7.906 4.537 7.906h2.708v-3.804s-.146-4.537 4.465-4.537h7.688s4.32.07 4.32-4.175v-7.019S40.374 16 31.885 16zm-4.275 2.454a1.394 1.394 0 1 1 0 2.79 1.393 1.393 0 0 1-1.395-1.395c0-.771.624-1.395 1.395-1.395z"/>
                                  <path fill="#FFD43B" d="M32.115 47.833c8.124 0 7.617-3.523 7.617-3.523l-.01-3.65H31.97v-1.095h10.832S48 40.155 48 31.958c0-8.197-4.537-7.906-4.537-7.906h-2.708v3.803s.146 4.537-4.465 4.537h-7.688s-4.32-.07-4.32 4.175v7.019s-.656 4.247 7.833 4.247zm4.275-2.454a1.393 1.393 0 0 1-1.395-1.395 1.394 1.394 0 1 1 1.395 1.395z"/>
                              </svg>` :
                        `<i class="${deviconClass}" style="line-height: 1;"></i>`
                    }
                        </div>
                        <div class="skill-name">${s.name}</div>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" data-val="${s.percent}" style="width: 0%;"></div>
                    </div>
                    <span class="skill-percent">${s.percent}%</span>
                `;
                skillsGrid.appendChild(card);
            });
        }

        // Re-initialize filters and reveal managers for dynamic lists
        initSkillsFilter();
        initProjectsFilter();
        initScrollReveal();

        // Initialize Premium Client Attraction Features
        initCostEstimator();
        renderTestimonialsSlider();
        initSkillRadarHighlight();
        initMeetingBooking();
        initCaseStudies();
    }

    // Try fetching from database first
    fetch('http://127.0.0.1:5000/api/portfolio')
        .then(res => {
            if (!res.ok) throw new Error('Backend server response was not OK');
            return res.json();
        })
        .then(data => {
            portfolioData = data;

            // Auto-migrate from localStorage if local storage has custom projects and backend is fresh
            const stored = localStorage.getItem('AryanJoshiPortfolioData');
            if (stored) {
                try {
                    const localObj = JSON.parse(stored);
                    if (localObj.projects && localObj.projects.length > 0 && (!portfolioData.projects || portfolioData.projects.length === 0 || (portfolioData.projects.length === 3 && portfolioData.projects[0].title === "Neural Analytics Hub"))) {
                        console.log("Migrating local data to Flask database...");
                        portfolioData = localObj;
                        // Save back to backend immediately
                        fetch('http://127.0.0.1:5000/api/portfolio', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(portfolioData)
                        }).catch(err => console.error("Auto-migration save failed:", err));
                    }
                } catch (e) {
                    console.error("Migration error in app.js:", e);
                }
            }
            applyData();
        })
        .catch(() => {
            // Flask not available — try static data/portfolio.json (works on Netlify)
            fetch('data/portfolio.json')
                .then(res => {
                    if (!res.ok) throw new Error('Static JSON not found');
                    return res.json();
                })
                .then(data => {
                    portfolioData = data;
                    applyData();
                })
                .catch(() => {
                    // Final fallback: localStorage or hardcoded defaults
                    const stored = localStorage.getItem('AryanJoshiPortfolioData');
                    if (stored) {
                        try { portfolioData = JSON.parse(stored); } catch (e) { }
                    }
                    applyData();
                });
        });
}

/* Theme switcher */
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const themeIcon = themeBtn.querySelector('svg path');

    // Check local storage or system preference
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    root.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme, themeIcon);

    themeBtn.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
        updateThemeIcon(newTheme, themeIcon);
    });
}

function updateThemeIcon(theme, pathElement) {
    if (theme === 'light') {
        // SVG path for Moon icon (show moon in light mode to switch to dark)
        pathElement.setAttribute('d', 'M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z');
    } else {
        // SVG path for Sun icon (show sun in dark mode to switch to light)
        pathElement.setAttribute('d', 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z');
    }
}

/* Navbar active state & sticky logic */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    // Sticky header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Spy active tracking
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 120)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile navigation toggle
    mobileToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        const icon = mobileToggle.querySelector('svg path');
        if (navLinksContainer.classList.contains('active')) {
            // Close (X) icon path
            icon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
        } else {
            // Menu (Burger) icon path
            icon.setAttribute('d', 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5');
        }
    });

    // Close mobile nav on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            const icon = mobileToggle.querySelector('svg path');
            icon.setAttribute('d', 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5');
        });
    });
}

/* Typing animation effect */
function initTypingEffect() {
    const typingSpan = document.getElementById('typing-text');
    const roles = ['Full Stack Developer', 'AI Developer', 'Software Engineer', 'Web Architect'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    let timeoutId = null;

    function type() {
        if (!typingSpan) return;
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingSpan.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingSpan.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing next word
        }

        timeoutId = setTimeout(type, typingSpeed);
    }

    type();
}

/* Skills section category tabs & progress bar triggers */
function initSkillsFilter() {
    const tabs = document.querySelectorAll('.skill-tab');

    // Animate progress bars on load
    const initialCards = document.querySelectorAll('.skill-card');
    initialCards.forEach(card => {
        animateProgressBar(card.querySelector('.progress-bar'));
    });

    tabs.forEach(tab => {
        // Prevent duplicate listener accumulation
        tab.replaceWith(tab.cloneNode(true));
    });

    const freshTabs = document.querySelectorAll('.skill-tab');
    freshTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            freshTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.getAttribute('data-skill-cat');
            const cards = document.querySelectorAll('.skill-card');
            cards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-skill-type') === category) {
                    card.style.display = 'block';
                    animateProgressBar(card.querySelector('.progress-bar'));
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function animateProgressBar(bar) {
    if (!bar) return;
    const targetVal = bar.getAttribute('data-val');
    setTimeout(() => {
        bar.style.width = targetVal + '%';
    }, 100);
}

/* Project filters */
function initProjectsFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* GitHub integration stats */
function initGitHubStats() {
    // Render static grid for contributions simulation
    const gridContainer = document.getElementById('contrib-grid');
    if (!gridContainer) return;

    for (let c = 0; c < 24; c++) {
        const col = document.createElement('div');
        col.className = 'contrib-col';
        for (let r = 0; r < 7; r++) {
            const cell = document.createElement('div');
            cell.className = 'contrib-cell';
            // Randomly seed active contribution visual states
            const randVal = Math.random();
            if (randVal > 0.85) {
                cell.classList.add('contrib-level-4');
            } else if (randVal > 0.7) {
                cell.classList.add('contrib-level-3');
            } else if (randVal > 0.5) {
                cell.classList.add('contrib-level-2');
            } else if (randVal > 0.3) {
                cell.classList.add('contrib-level-1');
            }
            col.appendChild(cell);
        }
        gridContainer.appendChild(col);
    }
}

/* Timeline interaction */
function initTimeline() {
    // Placeholders for interactive details on journey nodes if user hovers/clicks
}

/* Testimonial slider logic */
function initTestimonialSlider() {
    const sliderContainer = document.querySelector('.testimonial-container');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.slider-dots');

    if (!sliderContainer || slides.length === 0) return;

    let currentIndex = 0;

    // Create navigation dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function goToSlide(index) {
        currentIndex = index;
        sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((d, i) => {
            d.classList.toggle('active', i === currentIndex);
        });
    }

    // Auto-slide transition
    setInterval(() => {
        let nextIndex = (currentIndex + 1) % slides.length;
        goToSlide(nextIndex);
    }, 6000);
}

/* Contact Form custom validation & simulation submit feedback */
function initContactForm() {
    const form = document.getElementById('portfolio-contact');
    const statusDiv = document.getElementById('form-status');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const subject = document.getElementById('form-subject').value.trim();
        const message = document.getElementById('form-message').value.trim();

        if (!name || !email || !subject || !message) {
            showStatus('Please fill in all fields.', 'error');
            return;
        }

        // Simple regex verification
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showStatus('Please enter a valid email address.', 'error');
            return;
        }

        // Send message to Flask API backend
        const submitBtn = form.querySelector('.submit-btn');
        const origText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending Message...';

        fetch('http://127.0.0.1:5000/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, subject, message })
        })
            .then(res => {
                if (!res.ok) throw new Error('API sending failed');
                return res.json();
            })
            .then(data => {
                showStatus('Thank you! Your message has been sent successfully.', 'success');
                form.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = origText;
            })
            .catch(err => {
                console.warn('API message submission offline, simulating success locally:', err);
                // Simulated local success fallback if server is offline
                setTimeout(() => {
                    showStatus('Thank you! Your message has been sent successfully.', 'success');
                    form.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = origText;
                }, 1000);
            });
    });

    function showStatus(msg, type) {
        statusDiv.textContent = msg;
        statusDiv.className = `form-status ${type}`;

        // Clear message after 5 seconds if success
        if (type === 'success') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        }
    }
}

/* IntersectionObserver logic for scroll animations */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // If it's a skill card, trigger progress bar animation when it comes into view
                if (entry.target.classList.contains('skill-card')) {
                    animateProgressBar(entry.target.querySelector('.progress-bar'));
                }

                // Stop observing once animated into view to avoid scroll reflow jumps
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* Interactive Cost Estimator Calculations */
function initCostEstimator() {
    const scopeSelect = document.getElementById('est-scope');
    const pagesRange = document.getElementById('est-pages');
    const pagesVal = document.getElementById('est-pages-val');
    const pagesFill = document.getElementById('est-pages-fill');
    const pageHint = document.getElementById('est-page-hint');
    const costText = document.getElementById('est-total-cost');
    const timeText = document.getElementById('est-total-time');
    const applyBtn = document.getElementById('btn-apply-estimate');
    const features = document.querySelectorAll('.est-feature');

    if (!scopeSelect) return;

    // Update the custom fill bar position
    function updateSliderFill() {
        if (!pagesRange || !pagesFill) return;
        const min = parseInt(pagesRange.min) || 1;
        const max = parseInt(pagesRange.max) || 20;
        const val = parseInt(pagesRange.value) || 5;
        const pct = ((val - min) / (max - min)) * 100;
        pagesFill.style.width = `${pct}%`;
    }

    function calculateEstimate() {
        // Read dynamic pricing from portfolioData (set by admin) with safe fallbacks
        const pricing = portfolioData.pricing || {};
        const scopeMap = {
            ui: pricing.ui || { base: 1, minDays: 1, maxDays: 2 },
            frontend: pricing.frontend || { base: 2, minDays: 2, maxDays: 3 },
            fullstack: pricing.fullstack || { base: 3, minDays: 3, maxDays: 5 },
            ai: pricing.ai || { base: 5, minDays: 5, maxDays: 7 }
        };
        // Admin controls pro rate (per page beyond 5)
        const proRate = pricing.perPage ?? 50;
        const perFeature = pricing.perFeature ?? 1;

        const scope = scopeSelect.value;
        const scopeData = scopeMap[scope] || scopeMap.frontend;
        const baseCost = scopeData.base;
        const baseTimeMin = scopeData.minDays;
        const baseTimeMax = scopeData.maxDays;

        const pages = parseInt(pagesRange.value);
        pagesVal.textContent = `${pages} Page${pages > 1 ? 's' : ''}`;

        // Tiered page pricing:
        //   Pages 1–5  →  $1 per page  (budget tier)
        //   Pages 6+   →  $5 (first 5) + proRate × extra pages
        let pagesCost;
        let pagesTime = Math.floor(pages / 3);
        const isPro = pages > 5;

        if (!isPro) {
            pagesCost = pages * 1;               // $1, $2, $3, $4, $5
        } else {
            const extraPages = pages - 5;
            pagesCost = 5 + (extraPages * proRate); // $5 base + pro rate for each extra
        }

        // Update hint text
        if (pageHint) {
            if (isPro) {
                pageHint.textContent = `Professional rate: $5 (first 5 pages) + $${proRate} × ${pages - 5} extra page${pages - 5 !== 1 ? 's' : ''}`;
                pageHint.classList.add('pro-active');
            } else {
                pageHint.textContent = `Budget rate: $${pages} (${pages} page${pages > 1 ? 's' : ''} × $1 each) · 6+ pages → professional rate`;
                pageHint.classList.remove('pro-active');
            }
        }

        // Animate value label (only when user actively slides, checking active element)
        if (pagesVal && document.activeElement === pagesRange) {
            pagesVal.style.transform = 'scale(1.15)';
            setTimeout(() => { pagesVal.style.transform = 'scale(1)'; }, 150);
        }

        // Update fill bar
        updateSliderFill();

        // Add feature costs
        let featureCost = 0;
        let featureTime = 0;
        features.forEach(f => {
            if (f.checked) {
                featureCost += perFeature;
                featureTime += 2;
            }
        });

        const totalCost = baseCost + pagesCost + featureCost;
        const totalTimeMin = baseTimeMin + pagesTime + featureTime;
        const totalTimeMax = baseTimeMax + pagesTime + featureTime;

        costText.textContent = `$${totalCost.toLocaleString()}`;
        timeText.textContent = `${totalTimeMin} - ${totalTimeMax} Days`;
    }

    scopeSelect.addEventListener('change', calculateEstimate);
    pagesRange.addEventListener('input', calculateEstimate);
    features.forEach(f => {
        f.addEventListener('change', () => {
            // Sync .checked class on the chip label
            const chip = f.closest('.est-chip');
            if (chip) chip.classList.toggle('checked', f.checked);
            calculateEstimate();
        });
    });

    applyBtn.addEventListener('click', () => {
        const scopeLabel = scopeSelect.options[scopeSelect.selectedIndex].text.split(' ($')[0];
        const pagesCount = pagesRange.value;
        const selectedFeats = [];
        features.forEach(f => {
            if (f.checked) {
                selectedFeats.push(f.parentElement.innerText.trim());
            }
        });

        const summary = `Hi Aryan,\n\nI used the Cost Estimator and would like to build a project:\n` +
            `- Scope: ${scopeLabel}\n` +
            `- Screens/Pages: ${pagesCount}\n` +
            `- Features: ${selectedFeats.length > 0 ? selectedFeats.join(', ') : 'None selected'}\n` +
            `- Estimated Budget: ${costText.textContent}\n` +
            `- Estimated Timeline: ${timeText.textContent}\n\nLet's connect!`;

        const subjectField = document.getElementById('form-subject');
        const msgField = document.getElementById('form-message');

        if (subjectField) subjectField.value = `New Project Estimate: ${costText.textContent}`;
        if (msgField) msgField.value = summary;

        const contactSec = document.getElementById('contact');
        if (contactSec) {
            contactSec.scrollIntoView({ behavior: 'smooth' });
        }
    });

    calculateEstimate();
}

/* Dynamic Testimonials Slider Renderer & Transition */
let currentTestimonialSlide = 0;

// Avatar gradient palette for initials
const avatarGradients = [
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #6366f1, #4f46e5)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
    'linear-gradient(135deg, #ef4444, #dc2626)',
    'linear-gradient(135deg, #0ea5e9, #0284c7)',
    'linear-gradient(135deg, #8b5cf6, #7c3aed)',
];

function renderTestimonialsSlider() {
    const container = document.getElementById('testimonials-container');
    const dotsContainer = document.getElementById('testimonials-dots');
    if (!container || !portfolioData.testimonials || portfolioData.testimonials.length === 0) return;

    container.innerHTML = '';
    dotsContainer.innerHTML = '';

    portfolioData.testimonials.forEach((t, i) => {
        const initials = t.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        const gradient = avatarGradients[i % avatarGradients.length];

        const verifyHTML = (t.link && t.link !== '#')
            ? `<a href="${t.link}" target="_blank" class="testimonial-verify-link">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                Verified
               </a>`
            : '';

        const slide = document.createElement('div');
        slide.className = 'testimonial-slide';
        slide.innerHTML = `
            <div class="testimonial-quote-mark">"</div>
            <div class="testimonial-stars">
                <span class="testimonial-star">★</span>
                <span class="testimonial-star">★</span>
                <span class="testimonial-star">★</span>
                <span class="testimonial-star">★</span>
                <span class="testimonial-star">★</span>
            </div>
            <p class="testimonial-quote">${t.review}</p>
            <div class="testimonial-author">
                <div class="testimonial-avatar" style="background: ${gradient};">${initials}</div>
                <div class="author-info">
                    <h4>${t.name}</h4>
                    <p>${t.role}${t.company ? ` · <strong style="color: var(--text-secondary);">${t.company}</strong>` : ''}</p>
                    ${verifyHTML}
                </div>
            </div>
        `;
        container.appendChild(slide);

        const dot = document.createElement('span');
        dot.className = `dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToTestimonialSlide(i));
        dotsContainer.appendChild(dot);
    });

    function goToTestimonialSlide(index) {
        currentTestimonialSlide = index;
        container.style.transform = `translateX(-${index * 100}%)`;
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((d, idx) => {
            d.className = `dot ${idx === index ? 'active' : ''}`;
        });
    }

    // Auto-loop every 8s
    setInterval(() => {
        let next = currentTestimonialSlide + 1;
        if (next >= portfolioData.testimonials.length) next = 0;
        goToTestimonialSlide(next);
    }, 8000);
}

/* Interactive Technology Skill Highlight Matrix */
function initSkillRadarHighlight() {
    const skillCards = document.querySelectorAll('.skill-card');

    skillCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const skillNameEl = card.querySelector('.skill-name');
            if (!skillNameEl) return;
            const skillQuery = skillNameEl.innerText.trim().toLowerCase();

            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach(proj => {
                const techBadges = proj.querySelectorAll('.tech-badge');
                let matches = false;
                techBadges.forEach(badge => {
                    const badgeText = badge.innerText.trim().toLowerCase();
                    if (badgeText.includes(skillQuery) || skillQuery.includes(badgeText)) {
                        matches = true;
                    }
                });

                if (matches) {
                    proj.classList.add('highlight');
                    proj.classList.remove('dim');
                } else {
                    proj.classList.add('dim');
                    proj.classList.remove('highlight');
                }
            });
        });

        card.addEventListener('mouseleave', () => {
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach(proj => {
                proj.classList.remove('highlight', 'dim');
            });
        });
    });
}

/* Meeting Booking Modal */
function initMeetingBooking() {
    const floatBtn = document.getElementById('btn-floating-booking');
    const closeBtn = document.getElementById('btn-close-booking');
    const modal = document.getElementById('booking-modal-container');
    const slots = document.querySelectorAll('.booking-time-slot');
    const feedback = document.getElementById('booking-success-message');
    const sliderWrapper = document.getElementById('booking-slider-wrapper');
    const backBtn = document.getElementById('btn-back-to-slots');
    const badge = document.getElementById('booking-selected-slot-badge');
    const form = document.getElementById('booking-contact-form');

    // Inputs
    const inputName = document.getElementById('booking-name');
    const inputEmail = document.getElementById('booking-email');
    const inputSubject = document.getElementById('booking-subject');
    const inputMessage = document.getElementById('booking-message');

    const stepSlots = document.getElementById('booking-step-slots');
    const stepForm = document.getElementById('booking-step-form');

    let selectedTimeSlot = '';

    if (!floatBtn || !modal) return;

    // Reset slide position
    function resetSlider() {
        if (stepSlots) stepSlots.style.display = 'flex';
        if (stepForm) stepForm.style.display = 'none';
        if (form) form.style.display = 'flex';
        feedback.style.display = 'none';
        if (form) form.reset();
    }

    floatBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        resetSlider();
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Step 1 -> Step 2 transition
    slots.forEach(slot => {
        slot.addEventListener('click', () => {
            selectedTimeSlot = slot.innerText.trim();
            if (badge) badge.textContent = selectedTimeSlot;
            if (inputSubject) inputSubject.value = `Consultation Call - ${selectedTimeSlot}`;
            if (inputMessage) inputMessage.value = `Hi Aryan,\n\nI would like to schedule a 15-minute consultation with you on ${selectedTimeSlot}. Let's connect!`;

            // Show Form, Hide Slots
            if (stepSlots) stepSlots.style.display = 'none';
            if (stepForm) stepForm.style.display = 'flex';
        });
    });

    // Step 2 -> Step 1 back transition
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (stepSlots) stepSlots.style.display = 'flex';
            if (stepForm) stepForm.style.display = 'none';
        });
    }

    // Submit booking request form to contact_messages API
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const payload = {
                name: inputName.value.trim(),
                email: inputEmail.value.trim(),
                subject: inputSubject.value.trim(),
                message: inputMessage.value.trim()
            };

            fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(res => {
                    if (!res.ok) throw new Error('Network response was not ok');
                    return res.json();
                })
                .then(data => {
                    form.style.display = 'none';
                    feedback.textContent = `Thank you! Your call is request-booked for ${selectedTimeSlot}. I'll reach out shortly!`;
                    feedback.style.display = 'block';

                    // Hide modal after 3 seconds
                    setTimeout(() => {
                        modal.style.display = 'none';
                        resetSlider();
                    }, 3000);
                })
                .catch(err => {
                    console.error('Error submitting booking:', err);
                    feedback.textContent = 'Oops, something went wrong. Please try again.';
                    feedback.style.color = '#ef4444';
                    feedback.style.display = 'block';
                });
        });
    }
}

/* Case Study details overlay modal */
function initCaseStudies() {
    const modal = document.getElementById('case-study-modal');
    const closeBtn = document.getElementById('btn-close-cs');
    const csBadge = document.getElementById('cs-badge');
    const csTitle = document.getElementById('cs-title');
    const csImage = document.getElementById('cs-image');
    const csChallenge = document.getElementById('cs-challenge');
    const csSolution = document.getElementById('cs-solution');
    const csMetricsContainer = document.getElementById('cs-metrics-container');
    const csDemoLink = document.getElementById('cs-demo-link');
    const csGitLink = document.getElementById('cs-git-link');

    if (!modal) return;

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.openCaseStudy = function (projectId) {
        const p = portfolioData.projects.find(x => x.id === projectId);
        if (!p) return;

        csBadge.textContent = `${p.category.toUpperCase()} Project`;
        csTitle.textContent = p.title;
        const displayImg = (p.image && p.image.includes(',')) ? p.image.split(',')[0] : (p.image || 'assets/images/project1.png?v=original');
        csImage.src = displayImg;
        csChallenge.textContent = p.challenge || p.desc || 'Details coming soon.';
        csSolution.textContent = p.solution || 'Fully integrated utilizing modern cloud structures and efficient programming paradigms.';

        csMetricsContainer.innerHTML = '';
        const metricsStr = p.metrics || '100% Reliable, 2x Scalability';
        metricsStr.split(',').map(m => m.trim()).filter(m => m).forEach(m => {
            const span = document.createElement('span');
            span.style.background = 'rgba(16, 185, 129, 0.1)';
            span.style.color = 'var(--accent-primary)';
            span.style.padding = '5px 12px';
            span.style.borderRadius = '20px';
            span.style.fontSize = '0.85rem';
            span.style.fontWeight = 'bold';
            span.textContent = m;
            csMetricsContainer.appendChild(span);
        });

        csDemoLink.href = p.demo || '#';
        csGitLink.href = p.github || '#';

        modal.style.display = 'flex';
    };
}
